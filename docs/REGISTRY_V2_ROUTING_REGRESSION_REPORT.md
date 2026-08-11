# Registry v1 vs v2 Shadow Routing Regression Report

Status: PASS WITH REVIEW ITEMS  
Fixtures: `docs/REGISTRY_V2_ROUTING_REGRESSION_FIXTURES.yaml`  
Registry v1: `00_ADMIN/00_EDU_SKILL_REGISTRY.yaml`  
Registry v2 candidate: `docs/REGISTRY_V2_SHADOW.yaml`  
Runtime SSOT changed: **No**

## 1. Scope

This regression compares routing semantics, not end-user lesson-plan quality. It checks:

- Primary Skill selection
- mandatory dependency loading
- conditional supporting capability loading
- conditional handoff targets
- Human Gate preservation
- route-loop behavior

The fixtures use explicit routing signals derived from current Registry and Skill contracts. This is a deterministic contract comparison, not a claim that a language model will classify every unconstrained natural-language prompt identically.

## 2. Result summary

16 regression cases were defined.

| Category | Cases | Result |
|---|---:|---|
| Equivalent / typed-equivalent behavior | 6 | PASS |
| Expected semantic improvement | 6 | PASS |
| Safety / Human Gate preservation | 2 | PASS |
| Requires design review before cutover | 2 | REVIEW |

Overall: `REGRESSION_PASS_WITH_REVIEW_ITEMS`.

No blocking regression has been found in the shadow graph under the tested routing contracts.

## 3. Passed equivalence cases

### RP01 — ordinary lesson authoring

Both versions select lesson-plan-authoring. v2 only canonicalizes the node reference to `edu:lesson-plan-authoring`.

Result: PASS.

### RP02 — existing lesson differentiation

Both versions select lesson-differentiation.

Result: PASS.

### RP03 — differentiation without source lesson

Both versions start from lesson-differentiation and hand off to lesson-plan-authoring when `no_source_lesson` is true.

v2 improvement: the transition is explicitly typed as `routes.mode=handoff` rather than an untyped conditional route map.

Result: PASS.

### RP06 — full educational Web game workflow

Both versions select educational-web-game-workflow and use material-to-quest-game as a required capability for the full workflow.

v2 preserves this as:

```text
edu:educational-web-game-workflow
  --requires-->
edu:material-to-quest-game
```

Result: PASS.

### RP12 — facilitator needs lesson design

Both versions hand off from conjecturing-five-stage-facilitator to conjecturing-five-stage when lesson design is needed.

Result: PASS.

### RP16 — quest game needs storyboard

Both versions route from material-to-quest-game to visual-art-storyboard when storyboard work is needed.

Result: PASS.

## 4. Expected improvements

### RP04 — digital-learning lesson with complete source lesson

v1 declares lesson-plan-authoring as an unconditional dependency.

The Skill contract says lesson-plan-authoring is needed only when complete new lesson content is required.

v2 therefore does not load lesson-plan-authoring for an already-complete source lesson.

Result: PASS — semantic improvement.

### RP05 — digital-learning lesson needs complete new lesson content

v1 loads lesson-plan-authoring as a dependency.

v2 explicitly hands off when `complete_new_lesson_content_needed` is true.

The required functional outcome is preserved, while responsibility transfer is represented more accurately.

Result: PASS — equivalent outcome with improved semantics.

### RP08 — conjecturing lesson with reasoning activation

v1 always loads reasoning-kernel as dependency.

v2 loads it as an enhancing supporting capability when reasoning policy activates.

For a task explicitly requiring counterexample/reasoning verification, both versions make reasoning-kernel available.

Result: PASS for this activated case.

### RP10 — conjecturing facilitator at validation stage

The facilitator Skill text states that reasoning-kernel is a supporting dependency mainly used during Stage 3 validation.

v2 loads it through `enhances[stage_3_validation]` instead of treating it as globally mandatory.

Result: PASS — improved semantic fidelity.

### RP11 — conjecturing facilitator at example stage

v1 would load reasoning-kernel unconditionally.

v2 does not load it in Stage 1 merely because the facilitator Skill is active.

This matches the Skill's stated integration pattern better.

Result: PASS — reduced unnecessary load.

### RP13 — repeated conjecturing route with unchanged state

v1 Registry has conditional routes but no formal route-loop policy.

v2 defines `max_route_hops: 5` and `repeated_node_state_action: stop`.

A repeated unchanged node/state traversal therefore has a defined stop condition: `SKILL_ROUTE_LOOP`.

Result: PASS — explicit safety improvement.

## 5. Human Gate preservation

### RP14 — formal digital lesson submission

v2 retains a Human Gate for formal submission/external upload/student personal-data processing.

Result: PASS.

### RP15 — identifiable student learning records

v2 retains the conjecturing facilitator Human Gate for identifiable learning records, recording, formal assessment, and research/IRB submission.

Result: PASS.

## 6. Review item A — conjecturing-five-stage reasoning relation

### RP09

Case: conjecturing-five-stage is selected but no additional `reasoning_policy.activation` signal is present.

v1 behavior:

```text
always load reasoning-kernel
```

v2 shadow behavior:

```text
load reasoning-kernel only when reasoning policy activates
```

This is a real semantic difference.

Evidence currently available:

- v1 Registry declares reasoning-kernel as a dependency.
- the conjecturing-five-stage Skill text does not explicitly state that reasoning-kernel must be loaded on every execution.
- the global reasoning policy defines reasoning-kernel as a conditional supporting capability.

Current assessment:

`REVIEW_REQUIRED`, not regression failure.

Recommended cutover rule:

Use `enhances` unless a concrete Skill-contract requirement is found showing that every conjecturing-five-stage execution is invalid without reasoning-kernel.

This decision should be fixed before v2 becomes runtime SSOT.

## 7. Review item B — early-route ordering

### RP07

Case: educational-web-game-workflow is initially selected, but the task is actually physical/both-only.

Current v2 shadow graph contains both:

```text
educational-web-game-workflow
  --requires--> material-to-quest-game
```

and:

```text
educational-web-game-workflow
  --routes[physical_or_both]--> material-to-quest-game
```

If runtime resolves all `requires` before evaluating a route that is already knowable from the initial task state, it may unnecessarily load the full workflow context before handoff.

This does not produce a wrong target, but it creates avoidable work and makes execution ordering less precise.

Recommended runtime order for cutover:

```text
Selection
→ evaluate entry-known route guards
→ confirm Primary Skill
→ resolve requires
→ evaluate enhances
→ execute
→ evaluate execution-result routes
```

Important: this does NOT yet justify adding a new `entry_routes` relation type. The same `routes` relation can remain, while runtime distinguishes guards evaluable from initial state from guards requiring execution output.

Result: REVIEW REQUIRED before Kernel update.

## 8. Cutover criteria after regression

Before v2 may replace Registry v1, the following remain:

1. decide Review Item A;
2. define route evaluation order for Review Item B;
3. update the Schema v2 specification with the accepted runtime ordering;
4. update Project Kernel routing/planning contract;
5. generate a cutover Registry v2 candidate from the shadow file;
6. update Distribution references if needed;
7. verify a Cloud installation from ENV using the new Registry;
8. keep rollback to Registry v1 available until installation verification passes.

## 9. Regression conclusion

The shadow Registry preserves tested Primary Skill choices, routing targets, and Human Gate behavior while improving the distinction between mandatory dependency, conditional supporting capability, and handoff.

No tested case requires abandoning the typed routing graph design.

The only unresolved semantic decisions are:

- whether `edu:conjecturing-five-stage` should conditionally enhance with reasoning-kernel or always require it;
- when runtime must evaluate route guards relative to dependency resolution.

Therefore Phase 3 result is:

```text
REGRESSION_PASS_WITH_REVIEW_ITEMS
```

Registry v1 remains runtime SSOT until those review items and the subsequent cutover checks are completed.
