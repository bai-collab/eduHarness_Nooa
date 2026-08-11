# eduHarness Registry Graph Schema v2

Status: Cutover-ready specification  
Target: eduHarness Cloud Registry Schema v2  
Scope: Registry graph model, routing semantics, validation contract  
Runtime targets: ChatGPT Web, Gemini Spark

## 1. Purpose

Registry v2 upgrades the Registry from a skill catalog containing routing metadata into a typed, verifiable routing graph control plane.

The schema MUST distinguish four different concepts:

1. **Node metadata** — what a Skill is.
2. **Selection semantics** — when a Skill can become a Primary Skill candidate.
3. **Typed relations** — how Skills relate to other Skills during execution.
4. **Execution constraints** — guards such as Human Gate and runtime restrictions.

The design MUST preserve the existing eduHarness portability contract:

```text
Project = Portable Kernel
ENV = installation
Registry = capability / routing
Skill = procedure
Brain Index = knowledge / memory index
Drive = user Cloud runtime
GitHub = Canonical Distribution
```

Registry v2 MUST NOT store installation-specific Google Drive locators.

---

## 2. Normative terminology

The keywords **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** are normative requirements in this document.

### Primary Skill

The Skill that currently owns execution responsibility for the task.

### Supporting capability

A Skill loaded to support the Primary Skill without replacing its domain rules, output contract, Human Gate, or stopping rule.

### Route

A state/input-dependent transfer of Primary Skill responsibility from one Skill to another.

### Entry-known route guard

A route condition that can be evaluated from the task input or already-resolved state before dependency loading or substantive Skill execution.

### Post-execution route guard

A route condition that can only be evaluated after the current Primary Skill has produced or inspected execution state.

### Relation target

The `namespace_id` of another registered Skill.

---

## 3. Skill node structure

A v2 Skill entry SHOULD follow this shape:

```yaml
- id: "conjecturing-five-stage"
  namespace_id: "edu:conjecturing-five-stage"
  canonical_name: "臆測五階段"
  file: "00_ADMIN/SKILLS/conjecturing-five-stage/SKILL.md"

  metadata:
    type: workflow
    role: primary-capability
    purpose: >
      將已提供的數學單元改寫為臆測五階段教學。

  selection:
    triggers:
      - "臆測五階段"
      - "臆測教學"
    excludes:
      - "一般教案撰寫"

  relations:
    requires: []
    enhances:
      - skill: "edu:reasoning-kernel"
        when: "reasoning_policy.activation"
    routes:
      - when: "ordinary_lesson"
        to: "edu:lesson-plan-authoring"
        mode: handoff
        evaluation: entry
    conflicts: []
    replaces: []
    supports: []

  constraints:
    human_gate_if: []

  source: {}
  cloud: {}
```

`source`, `cloud`, and runtime deployment metadata MAY retain their current internal structures unless a later schema revision explicitly changes them.

---

## 4. Identity and references

### 4.1 Canonical graph reference

All Skill-to-Skill graph relations MUST use `namespace_id` as the canonical target reference.

Valid:

```yaml
skill: "edu:reasoning-kernel"
```

Invalid as graph targets:

```yaml
skill: "reasoning-kernel"
skill: "證據式推理核心"
skill: "00_ADMIN/SKILLS/reasoning-kernel/SKILL.md"
```

### 4.2 Uniqueness

Every `namespace_id` MUST be unique within one Registry.

Duplicate namespace IDs make the Registry graph invalid.

---

## 5. Selection semantics

Selection controls Primary Skill candidacy. Selection fields are NOT Skill-to-Skill graph edges.

```yaml
selection:
  triggers: []
  excludes: []
```

### `triggers`

Signals that MAY cause the router to consider this Skill as a Primary Skill candidate.

### `excludes`

Signals that SHOULD exclude this Skill from Primary Skill candidacy.

Selection semantics MUST NOT imply automatic loading or handoff to another Skill.

---

## 6. Typed relation vocabulary

Registry v2 defines six relation types.

| Relation | Meaning | Runtime action |
|---|---|---|
| `requires` | mandatory execution prerequisite | LOAD |
| `enhances` | conditional supporting capability | CONDITIONAL LOAD |
| `routes` | conditional Primary Skill responsibility transfer | HANDOFF |
| `conflicts` | capabilities must not be simultaneously active in the prohibited configuration | BLOCK / RESOLVE |
| `replaces` | successor/migration relation | REDIRECT / MIGRATE |
| `supports` | informational compatibility | INFORMATION ONLY |

No runtime MAY treat all relation types as equivalent `A -> B` traversal.

---

## 7. `requires`

### Semantics

`A requires B` means A cannot satisfy its execution contract without B.

```yaml
relations:
  requires:
    - "edu:material-to-quest-game"
```

Runtime behavior:

```text
resolve B
→ validate B
→ load B
→ execute A
```

### Constraints

- The `requires` subgraph MUST be acyclic.
- Self-dependency is invalid.
- Every target MUST exist.
- A Skill MUST NOT both `require` and `conflict` with the same target.

Dependency cycles MUST fail with `SKILL_DEPENDENCY_CYCLE`.

---

## 8. `enhances`

### Semantics

`A enhances with B when X` means B is a supporting capability that is loaded only when condition X is true.

```yaml
relations:
  enhances:
    - skill: "edu:reasoning-kernel"
      when: "reasoning_policy.activation"
```

Runtime behavior:

```text
condition false → execute A without B
condition true  → load B as supporting capability → execute A
```

An `enhances` target MUST NOT replace the Primary Skill merely because it was loaded.

This relation is intended to distinguish conditional supporting capabilities from mandatory prerequisites.

### Adjudicated migration rule: reasoning-kernel

For Registry v2 migration, `edu:conjecturing-five-stage` MUST treat `edu:reasoning-kernel` as `enhances[reasoning_policy.activation]`, not as an unconditional `requires` relation, unless a future Skill contract explicitly establishes that every execution is invalid without the reasoning kernel.

`edu:conjecturing-five-stage-facilitator` MUST treat `edu:reasoning-kernel` as a stage-sensitive enhancing capability, currently activated for `stage_3_validation`.

---

## 9. `routes`

### Semantics

`A routes to B when X` means that when guard X is satisfied, Primary Skill responsibility moves from A to B.

```yaml
relations:
  routes:
    - when: "existing_lesson_for_tiering"
      to: "edu:lesson-differentiation"
      mode: handoff
      evaluation: entry
```

### Route fields

Each route MUST contain:

```yaml
when:
to:
mode:
```

A route MAY contain:

```yaml
evaluation: entry | post_execution
```

If `evaluation` is omitted, runtime MUST default to `post_execution` for safety and backward compatibility.

### `evaluation: entry`

Use when the guard can be determined from initial task input or already-known state before dependency resolution.

When true, the runtime MUST hand off before loading the source Skill's `requires` or `enhances` relations.

This prevents unnecessary dependency loading for a Skill that should not remain Primary.

### `evaluation: post_execution`

Use when the route condition depends on evidence or state produced during execution of the current Primary Skill.

### Initial route mode

Schema v2 initially standardizes only:

```text
handoff
```

Additional modes such as `delegate` or `resume` MUST NOT be added until a concrete runtime requirement exists.

### Route cycles

Route cycles are not globally forbidden because they may describe legitimate state transitions.

However, runtime MUST implement loop protection.

```yaml
graph_policy:
  routing:
    max_route_hops: 5
    repeated_node_state_action: stop
```

A repeated `(node, relevant-state)` traversal without meaningful state change MUST stop with `SKILL_ROUTE_LOOP`.

---

## 10. `conflicts`

### Semantics

`A conflicts B` means A and B cannot be simultaneously active in the prohibited execution configuration.

```yaml
relations:
  conflicts:
    - "edu:example-skill"
```

The validator MUST detect contradictory combinations such as:

```text
A requires B
A conflicts B
```

The storage representation MAY be one-way, but validators SHOULD normalize the relation as symmetric when checking active capability sets.

---

## 11. `replaces`

### Semantics

`A replaces B` means A is the declared successor of B.

```yaml
relations:
  replaces:
    - "edu:legacy-skill"
```

A deprecated Skill MAY declare:

```yaml
lifecycle:
  status: deprecated
  replaced_by: "edu:new-skill"
```

Replacement cycles are invalid.

Invalid:

```text
A replaces B
B replaces A
```

Failure: `SKILL_REPLACEMENT_CYCLE`.

---

## 12. `supports`

### Semantics

`supports` is informational compatibility only.

```yaml
relations:
  supports:
    - "edu:example-skill"
```

`supports` MUST NOT imply automatic loading, dependency, Primary Skill handoff, or execution order.

If automatic loading is required, use `requires` or `enhances`.

If responsibility transfer is required, use `routes`.

---

## 13. Constraints

Execution guards do not belong to the Skill graph relation layer.

```yaml
constraints:
  human_gate_if:
    - "學生個資"
    - "正式評量"
```

Human Gate semantics remain governed by the Project Kernel and applicable Skill contract.

---

## 14. Global graph policy

Registry v2 SHOULD add a top-level graph policy.

```yaml
graph_policy:
  canonical_reference:
    field: namespace_id

  requires:
    cycle_allowed: false
    missing_target_action: stop

  routing:
    cycle_allowed: conditional
    max_route_hops: 5
    repeated_node_state_action: stop
    omitted_evaluation_default: post_execution

  conflicts:
    simultaneous_activation: forbidden

  supports:
    auto_load: false

  replaces:
    replacement_cycle_allowed: false
```

---

## 15. Validation contract

A Registry v2 implementation MUST perform at least these checks.

### V01 — Unique namespace
All `namespace_id` values must be unique. Failure: `SKILL_NAMESPACE_CONFLICT`.

### V02 — Valid relation target
Every relation target must resolve to an existing Registry node unless explicitly allowed by a future external namespace contract. Failure: `SKILL_RELATION_TARGET_NOT_FOUND`.

### V03 — Dependency cycle
The `requires` graph must be a DAG. Failure: `SKILL_DEPENDENCY_CYCLE`.

### V04 — Self dependency
`A requires A` is invalid. Failure: `REGISTRY_GRAPH_INVALID`.

### V05 — Route target integrity
Every route target must resolve to a valid Skill node. Failure: `SKILL_RELATION_TARGET_NOT_FOUND`.

### V06 — Route loop safety
Route cycles may exist, but runtime loop-protection policy must be defined. Uncontrolled repetition fails with `SKILL_ROUTE_LOOP`.

### V07 — Conflict consistency
Contradictory active relations must be detected. Failure: `SKILL_RELATION_CONFLICT`.

### V08 — Replacement integrity
Replacement cycles are invalid. Failure: `SKILL_REPLACEMENT_CYCLE`.

### V09 — Namespace integrity
Relation targets must use canonical namespace references. Failure: `REGISTRY_GRAPH_INVALID`.

### V10 — Semantic relation conflict
A pair of Skills must not carry logically impossible combinations such as both mandatory dependency and hard conflict. Failure: `SKILL_RELATION_CONFLICT`.

### V11 — Route evaluation value
If present, `routes[].evaluation` MUST be either `entry` or `post_execution`. Any other value fails with `REGISTRY_GRAPH_INVALID`.

---

## 16. Validation pipeline

```text
Registry YAML
    ↓
Schema validation
    ↓
Node validation
    ↓
Reference validation
    ↓
Relation validation
    ↓
Dependency-cycle validation
    ↓
Route-evaluation validation
    ↓
Route-safety validation
    ↓
Conflict validation
    ↓
Replacement validation
    ↓
VALID_ROUTING_GRAPH
```

A Registry that fails graph validation MUST NOT become the runtime routing SSOT.

---

## 17. v1 → v2 field mapping

| Registry v1 | Registry v2 |
|---|---|
| `type` | `metadata.type` |
| `role` | `metadata.role` |
| `purpose` | `metadata.purpose` |
| `trigger` | `selection.triggers` |
| `anti_trigger` | `selection.excludes` |
| `dependencies` | `relations.requires` OR reviewed `relations.enhances` |
| `conditional_routes` | `relations.routes` |
| `human_gate_if` | `constraints.human_gate_if` |

`dependencies` MUST NOT be blindly migrated because current entries may represent either true prerequisites or supporting capabilities.

Each existing dependency must therefore receive a semantic audit before v2 cutover.

---

## 18. Runtime routing order

A v2-compatible runtime MUST follow this ordering model:

```text
User Input
    ↓
Selection Layer
    ↓
Provisional Primary Skill
    ↓
Evaluate routes[evaluation=entry]
    ↓
If handoff: target becomes provisional Primary Skill
    ↓
Repeat entry-route evaluation with loop protection
    ↓
Confirm Primary Skill
    ↓
Resolve requires
    ↓
Evaluate enhances
    ↓
Load required/supporting capabilities
    ↓
Plan
    ↓
Execute
    ↓
Evaluate routes[evaluation=post_execution or omitted]
    ↓
If handoff: target becomes new provisional Primary Skill
    ↓
Route loop protection
    ↓
Verify / continue
```

The runtime MUST distinguish "load another capability" from "transfer execution responsibility".

Entry-route evaluation MUST occur before dependency loading when the route guard is explicitly marked `evaluation: entry`.

---

## 19. Failure codes

Existing relevant failures retained:

```text
SKILL_DEPENDENCY_CYCLE
SKILL_UNAVAILABLE
EXECUTION_PLAN_INVALID
REPLAN_BLOCKED
```

Registry v2 failures:

```text
REGISTRY_GRAPH_INVALID
SKILL_RELATION_TARGET_NOT_FOUND
SKILL_RELATION_CONFLICT
SKILL_ROUTE_LOOP
SKILL_REPLACEMENT_CYCLE
SKILL_NAMESPACE_CONFLICT
```

`EDU_REGISTRY_UNAVAILABLE` SHOULD remain reserved for Registry access/readability failure rather than graph-invalid state.

---

## 20. Compatibility and migration rule

Registry v1 remains runtime SSOT until all of the following are complete:

1. current Registry graph audit,
2. dependency semantic classification,
3. v2 candidate generation,
4. graph validation,
5. routing regression tests,
6. Project Kernel routing-contract update,
7. Distribution update,
8. Cloud installation verification,
9. final cutover Human Gate.

The v2 migration SHOULD minimize changes to individual `SKILL.md` files. Graph semantics belong in Registry; procedure semantics remain in Skill files.

---

## 21. Adjudicated Phase 3 review items

### A. `conjecturing-five-stage` reasoning relation

Decision: `enhances`, not `requires`.

Basis:

- v1 Registry used `dependencies`;
- the Skill contract does not establish reasoning-kernel as mandatory for every execution;
- global reasoning policy defines reasoning-kernel as conditional supporting capability;
- regression testing preserved reasoning availability when reasoning activation is present.

### B. Early-route ordering

Decision: keep a single `routes` relation type and add optional `evaluation` phase metadata.

No new `entry_routes` relation type is introduced.

---

## 22. Definition of done for Schema v2 specification

The specification is cutover-ready when:

- node / selection / relation / constraint boundaries are explicit;
- all six relation types have runtime semantics;
- namespace reference rules are fixed;
- `requires` and `enhances` are distinct;
- route handoff, evaluation phase, and loop-protection behavior are defined;
- graph validation rules and failure codes are defined;
- v1 → v2 migration rules are defined;
- Phase 3 review items are adjudicated;
- no installation-specific locator is introduced.

This document defines the graph contract. Runtime activation still requires a validated cutover Registry and final cutover gate.
