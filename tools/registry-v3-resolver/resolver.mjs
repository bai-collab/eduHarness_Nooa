function blocked(diagnostic) {
  return { result: "blocked", diagnostic };
}

function allRelationTargets(skill) {
  const r = skill.relations ?? {};
  const out = [];
  for (const key of ["requires", "enhances", "conflicts", "replaces", "supports"]) {
    for (const item of r[key] ?? []) {
      out.push(typeof item === "string" ? item : item?.skill ?? item?.to);
    }
  }
  for (const item of r.routes ?? []) out.push(item?.to);
  return out.filter(Boolean);
}

function detectRequiresCycle(skills) {
  const graph = new Map(skills.map((s) => [s.namespace_id, (s.relations?.requires ?? []).map((x) => typeof x === "string" ? x : x?.skill).filter(Boolean)]));
  const visiting = new Set();
  const done = new Set();
  function visit(node) {
    if (visiting.has(node)) return true;
    if (done.has(node)) return false;
    visiting.add(node);
    for (const next of graph.get(node) ?? []) if (graph.has(next) && visit(next)) return true;
    visiting.delete(node);
    done.add(node);
    return false;
  }
  return [...graph.keys()].some(visit);
}

export function resolveFixtureCase(c) {
  const official = [...(c.official ?? [])];
  const local = [...(c.local?.skills ?? [])];
  const disabled = new Set(c.local?.disabled ?? []);

  if (c.distribution_snapshot) {
    if (c.distribution_snapshot.registry_ref !== c.distribution_snapshot.skill_ref) return blocked("SOURCE_CONFLICT");
  }

  const officialIds = new Set(official.map((s) => s.id ?? s.namespace_id?.replace(/^edu:/, "")));
  const officialNs = new Set(official.map((s) => s.namespace_id));

  for (const s of local) {
    if (!s.namespace_id?.startsWith("local:")) return blocked("LOCAL_SKILL_ID_COLLISION");
    if (officialIds.has(s.id ?? s.namespace_id.replace(/^local:/, ""))) return blocked("LOCAL_SKILL_ID_COLLISION");
  }

  for (const s of official) {
    if (allRelationTargets(s).some((t) => t.startsWith("local:"))) return blocked("OFFICIAL_DEPENDS_ON_LOCAL");
  }

  const overrides = local.filter((s) => s.mode === "override");
  const targetCounts = new Map();
  for (const s of overrides) {
    const target = s.overrides?.target;
    if (!target || !officialNs.has(target)) return blocked("LOCAL_OVERRIDE_TARGET_NOT_FOUND");
    targetCounts.set(target, (targetCounts.get(target) ?? 0) + 1);
  }
  if ([...targetCounts.values()].some((n) => n > 1)) return blocked("LOCAL_OVERRIDE_CONFLICT");

  const officialCapabilities = new Map();
  for (const s of official) if (s.primary_capability) officialCapabilities.set(s.primary_capability, s.namespace_id);
  for (const s of local.filter((x) => x.mode === "extend")) {
    if (s.primary_capability && officialCapabilities.has(s.primary_capability)) return blocked("REGISTRY_CAPABILITY_CONFLICT");
  }

  if (detectRequiresCycle(local)) return blocked("REGISTRY_GRAPH_INVALID");

  if (c.task?.formal_assessment && (c.project_governance?.human_gate_required_for ?? []).includes("formal_assessment")) {
    return { result: "human_gate_required", governance_source: "project" };
  }

  let effective = official.filter((s) => !disabled.has(s.namespace_id));
  for (const s of overrides) effective = effective.filter((x) => x.namespace_id !== s.overrides.target);
  effective.push(...local.filter((s) => s.mode !== "disable"));

  const response = { result: "pass" };
  if (disabled.size) response.absent_from_effective_candidates = [...disabled];
  if (overrides.length) response.removed_from_effective_candidates = overrides.map((s) => s.overrides.target);

  const candidatesWithPrimary = effective.filter((s) => s.primary_capability);
  if (candidatesWithPrimary.length === 1) {
    response.effective_primary = candidatesWithPrimary[0].namespace_id;
    response.provenance = candidatesWithPrimary[0].namespace_id.startsWith("local:") ? "local" : "official";
  }

  const requires = local.flatMap((s) => (s.relations?.requires ?? []).map((x) => typeof x === "string" ? x : x?.skill).filter(Boolean));
  if (requires.length) response.load_required = [...new Set(requires)];
  return response;
}
