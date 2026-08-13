# Registry v3 Dual-Layer Routing Contract

Status: Candidate 0.1

## Purpose
Registry v3 separates shared Official routing from installation-owned Local routing without creating a merged persistent SSOT.

## Authority model

```text
Project Kernel
  > Local explicit policy
  > Official Registry
  > Skill self-routing
```

- Official Registry is GitHub Canonical Distribution, read-only to installations.
- Local Registry is installation-specific overlay, writable by the installation owner.
- Effective Routing View is runtime-ephemeral and MUST NOT become a third persistent registry.
- Project governance, Human Gate, privacy, safety, failure and runtime invariants cannot be overridden by Local Registry.

## Registry identities

### Official Registry
- `schema_version: 3`
- `registry_kind: eduharness-official-registry`
- namespace: `edu`
- authority: `canonical_distribution`
- mutability: `read_only`

### Local Registry
- separate contract: `eduharness-local-registry`, schema 1, overlay contract 1.
- namespace: `local`
- authority: `installation`

## Distribution snapshot rule
Official Registry and every Official Skill/Knowledge artifact used in one routing/execution cycle MUST resolve from the same immutable distribution snapshot.

Runtime sequence:
1. Resolve repository/branch from Project upstream.
2. Resolve branch to immutable commit SHA.
3. Store the SHA only in ephemeral runtime evidence as `distribution_snapshot.ref`.
4. Read Official Registry, Official Skills and Official Knowledge using that same commit SHA.
5. A later upstream update MUST NOT change the active snapshot mid-execution.

If an immutable snapshot cannot be resolved, stop with `SOURCE_UNAVAILABLE` or `RUNTIME_INCOMPATIBLE` as applicable.

## Official Skill resolution
Official Registry entries point to canonical Distribution paths, not installation Artifact Index entries.

```yaml
artifact:
  source: distribution
  path: 00_ADMIN/SKILLS/example/SKILL.md
```

Resolution:

```text
Official Registry entry
  -> pinned distribution snapshot
  -> canonical path
  -> read full Skill
  -> execute
```

Official Skill packages MUST remain portable and MUST NOT depend on installation-specific locators.

## Local Skill resolution
Local Skill entries point to installation logical artifacts.

```text
Local Registry entry
  -> artifact://installation/skill/<id>
  -> Artifact Index
  -> provider stable identity/revision
  -> read full Skill
```

Artifact Index remains authoritative for installation-owned artifacts only.

## Local modes
Local Skill entries MUST declare exactly one mode:
- `extend`: adds a Local-only capability/routing candidate.
- `override`: deliberately replaces one named Official Skill.
- `disable`: expressed as Local policy; removes a named Official Skill from the effective candidate set.

No implicit override exists.

## Namespace and identity rules
- Official namespace IDs MUST use `edu:`.
- Local namespace IDs MUST use `local:`.
- Local entries MUST NOT declare an `edu:` identity.
- Local `id` basename MUST NOT equal any Official `id`; override uses a distinct Local `id` as well as a distinct `namespace_id`.
- Any Local identity collision or impersonation of an Official identity is invalid even when override is intended.
- An override MUST use a distinct Local identity and an explicit Official target.

## Cross-layer relation rules

| From | To | Allowed |
|---|---|---|
| Official | Official | yes |
| Local | Official | yes |
| Local | Local | yes |
| Official | Local | no |

Official portability forbids authored Official relations that require installation-local nodes. Because Official -> Local edges are invalid before Effective View graph construction, a valid cross-layer dependency cycle cannot be formed by authored relations; attempts are blocked as `OFFICIAL_DEPENDS_ON_LOCAL`.

## Capability collision rules
A Local `extend` candidate that claims the same Primary capability/responsibility as an Official candidate MUST NOT silently win by precedence. It is a conflict unless the Local entry is converted to an explicit `override` or narrowed so no Primary collision remains.

Failure: `REGISTRY_CAPABILITY_CONFLICT`.

## Effective Routing View construction
Resolver order is normative:
1. Apply Project governance.
2. Resolve immutable Distribution snapshot.
3. Load/validate Official Registry independently.
4. Load/validate Local Registry independently.
5. Validate cross-layer identities and relations.
6. Apply Local disable policies.
7. Apply Local explicit overrides.
8. Add valid Local extend candidates.
9. Detect ID/capability/override conflicts.
10. Build ephemeral Effective Routing View.
11. Validate effective typed graph.
12. Run normal routing order:
   `selection -> entry_routes -> primary_confirmation -> requires -> enhances -> execute -> post_execution_routes -> verify`.

Typed relations retain Registry v2 semantics: `requires`, `enhances`, `routes`, `conflicts`, `replaces`, `supports` MUST NOT be flattened.

## Override semantics
An override entry MUST name exactly one Official target:

```yaml
mode: override
overrides:
  target: edu:lesson-plan-authoring
```

Rules:
- target must exist in the pinned Official Registry;
- Local `id` and `namespace_id` must both differ from the Official target identity;
- only the targeted Official Skill is removed/replaced;
- Project governance and Human Gate remain in force;
- missing target fails closed as `LOCAL_OVERRIDE_TARGET_NOT_FOUND`;
- multiple Local overrides for the same target fail as `LOCAL_OVERRIDE_CONFLICT`.

## Disable semantics
Local policy may disable an Official Skill by exact `edu:` identity. Disable is evaluated before override/extend activation. A Local Skill cannot disable Project Kernel rules or system-level governance.

## Graph validation
After overlay resolution, validate the effective graph:
- requires cycles: forbidden;
- replacement/override cycles: forbidden;
- repeated node + same relevant state obeys route-loop stop policy;
- max route hops preserved;
- simultaneous forbidden conflicts remain blocked;
- missing route/relation target stops;
- Official -> Local authored relation is invalid.

## Evidence and observability
Audit output SHOULD include for each resolved Primary/supporting Skill:
- `namespace_id`
- `scope: official|local`
- `source_registry`
- immutable Official snapshot identity or Local artifact identity/revision
- applied Local policy (`none|disable|override|extend`)
- conflict diagnostics when blocked

Private chain-of-thought MUST NOT be persisted or emitted.

## Failure mapping
Registry-specific diagnostic codes may include:
- `LOCAL_REGISTRY_INVALID`
- `LOCAL_SKILL_ID_COLLISION`
- `LOCAL_OVERRIDE_TARGET_NOT_FOUND`
- `LOCAL_OVERRIDE_CONFLICT`
- `REGISTRY_CAPABILITY_CONFLICT`
- `OFFICIAL_DEPENDS_ON_LOCAL`
- `LOCAL_ARTIFACT_UNRESOLVED`
- `LOCAL_SKILL_UNAVAILABLE`

Map to Project core failures where appropriate: `REGISTRY_GRAPH_INVALID`, `SKILL_UNAVAILABLE`, `ARTIFACT_UNRESOLVED`, `SOURCE_UNAVAILABLE`, `RUNTIME_INCOMPATIBLE`.

## Compatibility boundary
Registry v3 is a breaking governance/runtime-source change relative to Registry v2. Promotion requires Kernel support for schema 3 and a coordinated Distribution/bootstrap migration. A v2 Kernel MUST NOT accept a v3 Registry as production SSOT.
