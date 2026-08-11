# Registry v2 Shadow Graph Validation Report

Status: PASS WITH WARNINGS  
Candidate: `docs/REGISTRY_V2_SHADOW.yaml`  
Runtime SSOT changed: **No**  
Validated scope: structural and semantic graph checks defined by `docs/REGISTRY_GRAPH_SCHEMA_V2.md`.

## 1. Summary

The v2 shadow candidate contains 16 Skill nodes and uses canonical `edu:*` namespace references for Skill-to-Skill relations.

Static graph result:

| Check | Result | Notes |
|---|---|---|
| V01 unique namespace | PASS | 16 declared nodes; no duplicate `namespace_id` in candidate |
| V02 relation targets exist | PASS | all `requires`, `enhances`, and `routes` targets resolve to declared nodes |
| V03 requires graph acyclic | PASS | one retained mandatory edge; no dependency cycle |
| V04 self dependency | PASS | none |
| V05 route target integrity | PASS | all route targets use canonical namespace IDs and resolve |
| V06 route loop safety | PASS WITH WARNINGS | route cycles exist, but candidate defines hop/state loop protection |
| V07 conflict consistency | PASS | no `conflicts` edges currently declared |
| V08 replacement integrity | PASS | no `replaces` edges currently declared |
| V09 namespace integrity | PASS | graph targets use `edu:*` references |
| V10 semantic relation conflict | PASS WITH REVIEW ITEM | no hard require/conflict contradiction; one require+route same-target case is intentional but should be regression-tested |

Overall result: `VALID_SHADOW_ROUTING_GRAPH_WITH_WARNINGS`.

This result does **not** authorize runtime cutover.

---

## 2. Typed edge inventory

### `requires`

Retained mandatory relation:

```text
edu:educational-web-game-workflow
  --requires-->
edu:material-to-quest-game
```

Reason: the Workflow's Gate 1 explicitly uses `material-to-quest-game` to establish the learning/game specification for the full Web workflow.

No other v1 dependency is blindly retained as `requires`.

### `enhances`

```text
edu:conjecturing-five-stage
  --enhances[reasoning_policy.activation]-->
edu:reasoning-kernel

edu:conjecturing-five-stage-facilitator
  --enhances[stage_3_validation]-->
edu:reasoning-kernel
```

The facilitator relation has direct Skill-text support: reasoning-kernel is described as a supporting dependency used mainly in the validation stage.

The `conjecturing-five-stage` relation is provisional. Its v1 Registry declares a dependency, but its Skill text does not establish that reasoning-kernel is mandatory for every execution. The v2 candidate therefore aligns it with the global conditional reasoning policy and marks it for semantic review before cutover.

### `routes`

Current shadow routes:

```text
lesson-plan-authoring
  -> lesson-differentiation
  -> item-authoring
  -> material-to-quest-game

authoring-related:
lesson-differentiation -> lesson-plan-authoring
digital-learning-lesson-plan -> lesson-plan-authoring

conjecturing-five-stage
  -> lesson-plan-authoring
  -> lesson-differentiation
  -> item-authoring
  -> conjecturing-five-stage-facilitator

conjecturing-five-stage-facilitator
  -> conjecturing-five-stage

material-to-quest-game
  -> visual-art-storyboard

quest-threejs-adoption
  -> material-to-quest-game
  -> image-to-3d-scene

educational-web-game-workflow
  -> quest-threejs-adoption
  -> image-to-3d-scene
  -> visual-art-storyboard
  -> material-to-quest-game
```

---

## 3. Route strongly-connected components / loop risks

### WARN-R01 — Lesson design loop

```text
edu:lesson-plan-authoring
       ↕
edu:lesson-differentiation
```

Guards:

- `existing_lesson_for_tiering`
- `no_source_lesson`

This is not automatically invalid because the two transitions describe different task states. Runtime MUST still stop repeated `(node, relevant-state)` traversal without meaningful state change.

### WARN-R02 — Conjecturing design/facilitation loop

```text
edu:conjecturing-five-stage
       ↕
edu:conjecturing-five-stage-facilitator
```

Guards:

- `existing_five_stage_lesson_for_student_facilitation`
- `lesson_design_needed`

This is a legitimate design/facilitation state transition if the existence/readiness of the lesson changes between states. It becomes invalid only if routing repeats without state change.

### Required runtime protection

Candidate policy:

```yaml
graph_policy:
  routing:
    max_route_hops: 5
    repeated_node_state_action: stop
```

Runtime failure for uncontrolled repetition:

```text
SKILL_ROUTE_LOOP
```

---

## 4. Semantic migration findings

### M01 — `digital-learning-lesson-plan`

v1:

```text
dependency -> lesson-plan-authoring
```

Skill procedure says complete new lesson content may be routed to `lesson-plan-authoring` only when needed.

v2 shadow:

```text
route[complete_new_lesson_content_needed]
  -> edu:lesson-plan-authoring
```

Classification: **accepted for shadow testing**.

### M02 — `conjecturing-five-stage-facilitator`

v1:

```text
dependency -> reasoning-kernel
```

Skill procedure explicitly describes reasoning-kernel as a supporting dependency, mainly during Stage 3 validation.

v2 shadow:

```text
enhances[stage_3_validation]
  -> edu:reasoning-kernel
```

Classification: **strongly supported**.

### M03 — `conjecturing-five-stage`

v1:

```text
dependency -> reasoning-kernel
```

The Skill procedure does not establish that reasoning-kernel is mandatory in every run, while the Registry's global reasoning policy defines reasoning-kernel as conditional support.

v2 shadow:

```text
enhances[reasoning_policy.activation]
  -> edu:reasoning-kernel
```

Classification: **provisional; regression test required before cutover**.

### M04 — `educational-web-game-workflow`

v1:

```text
dependency -> material-to-quest-game
```

The full Workflow explicitly requires the game specification produced through `material-to-quest-game`.

v2 shadow:

```text
requires -> edu:material-to-quest-game
```

Classification: **strongly supported**.

---

## 5. Require + route same-target review

`edu:educational-web-game-workflow` currently both:

```text
requires edu:material-to-quest-game
```

and conditionally:

```text
routes[physical_or_both] -> edu:material-to-quest-game
```

This is not logically contradictory under v2 semantics:

- `requires` means the full Web workflow needs the material/game-spec capability.
- `routes[physical_or_both]` means the requested task is outside the full Web workflow and should hand off primary responsibility to the material-to-quest-game Skill.

However, regression tests MUST verify that the router evaluates the early handoff condition before unnecessarily loading full-workflow prerequisites when the task is clearly physical/both-only.

Recommended runtime ordering refinement for cutover testing:

```text
selection
→ early scope/route guard evaluation when defined as entry redirect
→ Primary Skill confirmation
→ requires resolution
→ enhances
→ execution
→ normal post/within-execution routes
```

This exposes a possible future distinction between `entry routes` and execution-state routes. It is **not** added to Schema v2 yet because there is currently only one concrete case and the project follows minimal-schema expansion.

---

## 6. Empty relation types

Current shadow graph declares no actual edges for:

```text
conflicts
replaces
supports
```

This is valid. These relation types remain part of Schema v2 vocabulary for future explicit cases; they MUST NOT be populated without evidence merely to make the graph look complete.

---

## 7. Current blockers to runtime cutover

The shadow candidate MUST remain non-SSOT until all are complete:

1. routing regression test cases for the 16 current Skills;
2. explicit comparison of v1 versus v2 Primary Skill behavior;
3. verification of the provisional `conjecturing-five-stage -> reasoning-kernel` classification;
4. verification of entry-route ordering for `educational-web-game-workflow` physical/both cases;
5. Kernel routing-contract update draft;
6. Distribution migration/update draft;
7. Cloud installation compatibility verification;
8. final cutover Human Gate if the production Registry is to be replaced.

---

## 8. Phase 2 status

Completed:

- v2 shadow candidate generated for all 16 current Skill nodes;
- v1 graph fields mapped into Node / Selection / Relations / Constraints;
- canonical namespace targets applied;
- v1 dependency semantics audited;
- static graph validation performed;
- route-cycle risks documented;
- runtime SSOT left unchanged.

Next phase: **routing regression specification and shadow execution tests**.
