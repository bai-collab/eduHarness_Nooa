# eduHarness Registry Graph Schema v2

Status: Active canonical routing specification  
Target: eduHarness Cloud Registry Schema v2  
Scope: Registry graph model, routing semantics, validation contract  
Runtime targets: ChatGPT Web, Gemini Spark

## 1. Purpose
Registry v2 defines a typed, verifiable routing graph. It separates:

1. **Node metadata** — what a Skill is.
2. **Selection semantics** — when a Skill can become a Primary Skill candidate.
3. **Typed relations** — how Skills relate during execution.
4. **Execution constraints** — guards such as Human Gate and runtime restrictions.

### v0.2 portability contract

```text
Project Kernel = portable governance
Bootstrap Descriptor = installation entry
ENV = installation config
Registry = capability / routing
Brain Index = knowledge / memory logical index
Artifact Index = logical artifact resolution
Control Plane = runtime metadata/control abstraction
Storage Provider = artifact/output/work-area storage
Runtime State = ephemeral by default
GitHub = Canonical Distribution
```

Canonical v0.2 default profile is Notion Control Plane + Dropbox Storage. Google Drive is optional/legacy storage only. Registry MUST NOT store installation-specific Notion IDs, Dropbox IDs/paths, Google Drive URLs/IDs, or other provider locators.

Provider/storage architecture is governed by `docs/CONTROL_PLANE_CONTRACT.md` and `docs/STORAGE_ADAPTER_CONTRACT.md`. This specification governs routing graph semantics and MUST remain provider-neutral.

---

## 2. Normative terminology
The keywords **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** are normative.

### Primary Skill
The Skill that currently owns execution responsibility for the task.

### Supporting capability
A Skill loaded to support the Primary Skill without replacing its domain rules, output contract, Human Gate, or stopping rule.

### Route
A state/input-dependent transfer of Primary Skill responsibility from one Skill to another.

### Entry route
A route whose guard can be evaluated from task input or already-resolved state before dependency loading.

### Post-execution route
A route whose guard depends on state/evidence produced during execution.

### Relation target
The canonical `namespace_id` of another registered Skill.

---

## 3. Skill node structure
A v2 Skill entry SHOULD follow this shape:

```yaml
- id: lesson-plan-authoring
  namespace_id: edu:lesson-plan-authoring
  canonical_name: 教案撰寫
  metadata:
    type: workflow
    role: primary-capability
  selection:
    triggers: [教案撰寫]
    excludes: []
  relations:
    requires: []
    enhances: []
    routes: []
    conflicts: []
    replaces: []
    supports: []
  constraints:
    human_gate_if: []
```

Runtime deployment/storage identity does not belong in the routing graph. If a Skill body is stored as a logical artifact, the runtime resolves it through Registry → logical `artifact://` ID → Artifact Index → Storage Provider.

---

## 4. Identity and references
All Skill-to-Skill graph relations MUST use `namespace_id` as canonical target reference.

Valid:

```yaml
skill: edu:reasoning-kernel
```

Invalid as graph identity:

```yaml
skill: reasoning-kernel
skill: 00_ADMIN/SKILLS/reasoning-kernel/SKILL.md
skill: <provider-specific file id>
```

Every `namespace_id` MUST be unique. Duplicate namespace IDs fail with `SKILL_NAMESPACE_CONFLICT`.

---

## 5. Selection semantics
Selection controls Primary Skill candidacy and is not a graph edge.

```yaml
selection:
  triggers: []
  excludes: []
```

`triggers` MAY cause consideration as Primary. `excludes` SHOULD exclude candidacy. Neither field implies automatic loading or handoff.

---

## 6. Typed relation vocabulary
Registry v2 defines exactly six relation types:

| Relation | Meaning | Runtime action |
|---|---|---|
| `requires` | mandatory execution prerequisite | LOAD |
| `enhances` | conditional supporting capability | CONDITIONAL LOAD |
| `routes` | conditional Primary responsibility transfer | HANDOFF |
| `conflicts` | incompatible simultaneous activation | BLOCK / RESOLVE |
| `replaces` | successor/migration relation | REDIRECT / MIGRATE |
| `supports` | informational compatibility | INFORMATION ONLY |

No runtime MAY treat all relation types as equivalent `A → B` traversal.

---

## 7. `requires`
`A requires B` means A cannot satisfy its execution contract without B.

Runtime order:

```text
resolve B → validate B → load B → execute A
```

Constraints:
- `requires` MUST be acyclic.
- self-dependency is invalid.
- every target MUST exist.
- a Skill MUST NOT both require and hard-conflict with the same target.

Dependency cycle → `SKILL_DEPENDENCY_CYCLE`.

---

## 8. `enhances`
`A enhances with B when X` means B is loaded as a supporting capability only when condition X is satisfied.

```yaml
relations:
  enhances:
    - skill: edu:reasoning-kernel
      when: reasoning_policy.activation
```

An `enhances` target MUST NOT become Primary merely because it was loaded.

Adjudicated rule retained: `edu:conjecturing-five-stage` uses `edu:reasoning-kernel` as conditional `enhances`, not unconditional `requires`; facilitator use may be stage-sensitive.

---

## 9. `routes`
`A routes to B when X` transfers Primary responsibility when the guard is TRUE.

```yaml
relations:
  routes:
    - guard: {key_point: task.intent, equals: lesson_differentiation}
      to: edu:lesson-differentiation
      mode: handoff
      evaluation: entry
```

Each route MUST contain target, mode, and a guard/condition. `evaluation` MAY be `entry` or `post_execution`; omitted evaluation defaults to `post_execution` for compatibility.

### Entry evaluation
When TRUE, handoff occurs before source `requires` / `enhances` loading.

### Post-execution evaluation
Used when route decision depends on evidence/state produced by the current Primary.

### Route safety
Route cycles are not globally forbidden, but runtime MUST implement loop protection:

```yaml
graph_policy:
  routing:
    max_route_hops: 5
    repeated_node_state_action: stop
```

Repeated `(node, relevant-state)` without meaningful state change → `SKILL_ROUTE_LOOP`.

A recommendation-only route MUST NOT change Primary responsibility.

---

## 10. `conflicts`
`A conflicts B` means A and B cannot be simultaneously active in the prohibited configuration.

Validators MUST detect contradictory combinations such as `A requires B` plus `A conflicts B`.

Failure → `SKILL_RELATION_CONFLICT`.

---

## 11. `replaces`
`A replaces B` declares A as successor/migration target for B.

Replacement cycles are invalid.

Failure → `SKILL_REPLACEMENT_CYCLE`.

---

## 12. `supports`
`supports` is informational only. It MUST NOT imply automatic loading, dependency, handoff, or execution order.

Use `requires`/`enhances` for loading and `routes` for responsibility transfer.

---

## 13. Constraints and Human Gate
Execution guards do not belong to the typed-relation layer.

```yaml
constraints:
  human_gate_if:
    - 學生個資
    - 正式評量
```

Human Gate semantics are governed by the Project Kernel and applicable Skill contract. Registry/provider adapters MUST NOT bypass them.

---

## 14. Global graph policy
A Registry v2 runtime SHOULD expose equivalent policy to:

```yaml
graph_policy:
  canonical_reference: {field: namespace_id}
  requires: {cycle_allowed: false, missing_target_action: stop}
  routing:
    cycle_allowed: conditional
    max_route_hops: 5
    repeated_node_state_action: stop
    omitted_evaluation_default: post_execution
  conflicts: {simultaneous_activation: forbidden}
  supports: {auto_load: false}
  replaces: {replacement_cycle_allowed: false}
```

---

## 15. Validation contract
A v2 implementation MUST check at least:

- **V01 Unique namespace** → `SKILL_NAMESPACE_CONFLICT`
- **V02 Valid relation target** → `SKILL_RELATION_TARGET_NOT_FOUND`
- **V03 Requires DAG** → `SKILL_DEPENDENCY_CYCLE`
- **V04 No self dependency** → `REGISTRY_GRAPH_INVALID`
- **V05 Route target integrity** → `SKILL_RELATION_TARGET_NOT_FOUND`
- **V06 Route loop protection exists** → uncontrolled repetition `SKILL_ROUTE_LOOP`
- **V07 Conflict consistency** → `SKILL_RELATION_CONFLICT`
- **V08 Replacement acyclic** → `SKILL_REPLACEMENT_CYCLE`
- **V09 Canonical namespace references** → `REGISTRY_GRAPH_INVALID`
- **V10 No impossible relation combinations** → `SKILL_RELATION_CONFLICT`
- **V11 Route evaluation value is entry/post_execution** → `REGISTRY_GRAPH_INVALID`
- **V12 No installation-specific provider locator in canonical Registry** → `REGISTRY_GRAPH_INVALID` or portability validation failure

A graph that fails validation MUST NOT become runtime routing SSOT.

---

## 16. Validation pipeline

```text
Registry
→ schema validation
→ node/namespace validation
→ reference validation
→ typed-relation validation
→ dependency-cycle validation
→ route-evaluation validation
→ route-safety validation
→ conflict validation
→ replacement validation
→ portability validation
→ VALID_ROUTING_GRAPH
```

---

## 17. v1 → v2 semantic mapping

| Registry v1 | Registry v2 |
|---|---|
| `type` | `metadata.type` |
| `role` | `metadata.role` |
| `purpose` | `metadata.purpose` |
| `trigger` | `selection.triggers` |
| `anti_trigger` | `selection.excludes` |
| `dependencies` | reviewed `relations.requires` OR `relations.enhances` |
| `conditional_routes` | `relations.routes` |
| `human_gate_if` | `constraints.human_gate_if` |

Legacy `dependencies` MUST NOT be blindly migrated because it may represent either mandatory prerequisites or supporting capabilities.

---

## 18. Runtime routing order
A v2-compatible runtime MUST preserve this order:

```text
User Input
→ Selection
→ Provisional Primary
→ Evaluate entry routes
→ Handoff/repeat entry evaluation with loop protection
→ Confirm Primary
→ Resolve requires
→ Evaluate/load enhances
→ Plan
→ Execute
→ Evaluate post-execution routes
→ Handoff if required
→ Verify / continue
```

The runtime MUST distinguish "load another capability" from "transfer execution responsibility".

---

## 19. Runtime source resolution
Registry routing semantics are independent of where Skill content is physically stored.

Canonical v0.2 resolution is:

```text
Bootstrap Descriptor
→ ENV
→ production Registry
→ selected Skill logical artifact
→ Artifact Index
→ Storage Provider identity
→ read full Skill text
```

GitHub canonical Registry MUST NOT be substituted for an installation's production Registry during normal runtime.

---

## 20. Failure codes
Relevant failures include:

```text
EDU_REGISTRY_UNAVAILABLE
REGISTRY_GRAPH_INVALID
SKILL_UNAVAILABLE
SKILL_DEPENDENCY_CYCLE
SKILL_RELATION_TARGET_NOT_FOUND
SKILL_RELATION_CONFLICT
SKILL_ROUTE_LOOP
SKILL_REPLACEMENT_CYCLE
SKILL_NAMESPACE_CONFLICT
EXECUTION_PLAN_INVALID
REPLAN_BLOCKED
ARTIFACT_INDEX_UNAVAILABLE
ARTIFACT_UNRESOLVED
```

`EDU_REGISTRY_UNAVAILABLE` is reserved for access/readability failure; graph-invalid state uses graph-specific failures.

---

## 21. Compatibility
Registry schema v2 typed-relation semantics remain stable across provider changes. A Control Plane or Storage migration MUST NOT alter `requires/enhances/routes/conflicts/replaces/supports` meaning.

Legacy statements that define Google Drive as the Cloud runtime root are superseded by the v0.2 Descriptor/ENV/Control Plane/Storage Adapter contracts. Google Drive remains a supported optional/legacy storage adapter where installation config selects it.

---

## 22. Definition of done
Registry v2 is valid when:
- node/selection/relation/constraint boundaries are explicit;
- all six relation types retain distinct runtime semantics;
- namespace references are canonical;
- requires/enhances are distinct;
- entry/post route ordering is explicit;
- loop protection is defined;
- Human Gate remains external governance;
- routing graph contains no installation-specific provider locator;
- actual Skill text is resolved/read through the installation's Descriptor/ENV/Artifact Index path before substantive execution.
