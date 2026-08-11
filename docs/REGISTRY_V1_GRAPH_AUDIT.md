# eduHarness Registry v1 Graph Audit Baseline

Status: Initial audit  
Source: `00_ADMIN/00_EDU_SKILL_REGISTRY.yaml` on `main`  
Registry schema: v1  
Installed Cloud Skills: 16  
Purpose: establish the migration baseline for Registry Graph Schema v2.

## 1. Audit scope

This audit reviews the current Registry's graph-relevant fields:

- `dependencies`
- `conditional_routes`
- `role`
- `trigger`
- `anti_trigger`
- `human_gate_if`

The audit does not change runtime SSOT. It classifies current relations so they can later migrate into typed v2 relations.

Evidence rule:

- Registry declarations are treated as current routing metadata.
- Skill text is read when dependency semantics cannot be determined from the Registry alone.
- A current `dependency` is not automatically assumed to be a v2 `requires` edge.

---

## 2. Current Skill nodes

The Registry currently declares 16 Cloud Skills:

1. `edu:cloud-bootstrap`
2. `edu:github-to-cloud-skill-port`
3. `edu:lesson-plan-authoring`
4. `edu:lesson-differentiation`
5. `edu:digital-learning-lesson-plan`
6. `edu:item-authoring`
7. `edu:material-to-quest-game`
8. `edu:visual-art-storyboard`
9. `edu:image-to-3d-scene`
10. `edu:pixel-ai-secretary`
11. `edu:audience-outcome-lens`
12. `edu:conjecturing-five-stage`
13. `edu:quest-threejs-adoption`
14. `edu:educational-web-game-workflow`
15. `edu:reasoning-kernel`
16. `edu:conjecturing-five-stage-facilitator`

Current Registry metadata reports 2 meta Skills and 14 workflow Skills, including the supporting reasoning workflow.

---

## 3. Dependency audit

Four current Skills have non-empty `dependencies`.

| Source | Current dependency | v2 candidate | Audit status | Basis |
|---|---|---|---|---|
| `edu:digital-learning-lesson-plan` | `lesson-plan-authoring` | `routes` | ✅ recommended reclassification | Skill text says complete new lesson-plan content is routed to `lesson-plan-authoring` only when needed; it is not a universal prerequisite. |
| `edu:educational-web-game-workflow` | `material-to-quest-game` | `requires` | ✅ likely true prerequisite for full workflow | Gate 1 explicitly uses `material-to-quest-game` to build the learning/game specification that the complete Web workflow composes. |
| `edu:conjecturing-five-stage` | `reasoning-kernel` | `enhances` or remove | ⚠️ requires implementation review | The Skill text does not explicitly invoke `reasoning-kernel`, while Registry global policy defines it as a conditional supporting capability. Treating it as mandatory `requires` is not supported by the Skill procedure currently read. |
| `edu:conjecturing-five-stage-facilitator` | `reasoning-kernel` | `enhances` | ✅ recommended reclassification | Skill text explicitly calls `reasoning-kernel` a supporting dependency, primarily for the validation stage, not a replacement Primary Skill. |

### 3.1 `digital-learning-lesson-plan`

Current Registry:

```yaml
dependencies: ["lesson-plan-authoring"]
```

But the Skill procedure states, in effect:

```text
需要完整新教案內容時
→ route lesson-plan-authoring
```

Therefore the relation is conditional responsibility transfer, not a permanent execution prerequisite.

Recommended v2 representation:

```yaml
relations:
  requires: []
  routes:
    - when: "complete_new_lesson_content_needed"
      to: "edu:lesson-plan-authoring"
      mode: handoff
```

This is the clearest confirmed example of v1 `dependencies` mixing route semantics.

### 3.2 `educational-web-game-workflow`

The complete workflow's Gate 1 explicitly uses `material-to-quest-game` to create the material concept map, learning mechanic matrix, game design spec, level map, question/feedback bank, asset spec, accessibility/safety review, playtest plan, and teacher guide.

Recommended v2 representation for the full workflow:

```yaml
relations:
  requires:
    - "edu:material-to-quest-game"
```

The workflow also has conditional routes for narrower task classes; those routes are independent of this prerequisite relation.

### 3.3 `conjecturing-five-stage`

Current Registry:

```yaml
dependencies: ["reasoning-kernel"]
```

However:

- the Skill procedure currently contains its own counterexample and verification process;
- the Skill text read in this audit does not explicitly reference `reasoning-kernel`;
- Registry global `reasoning_policy` defines `reasoning-kernel` as a supporting capability activated conditionally.

Therefore a mandatory `requires` edge is currently too strong.

Candidate v2 representation:

```yaml
relations:
  enhances:
    - skill: "edu:reasoning-kernel"
      when: "reasoning_policy.activation"
```

Final classification remains **⚠️ pending semantic confirmation during v2 candidate generation**.

### 3.4 `conjecturing-five-stage-facilitator`

The Skill explicitly says `reasoning-kernel` is a supporting dependency and mainly uses it during Stage 3 validation to treat the student's conjecture as a hypothesis and select discriminative challenge cases.

Recommended v2 representation:

```yaml
relations:
  enhances:
    - skill: "edu:reasoning-kernel"
      when: "phase == STAGE_3_VALIDATE"
```

The exact condition syntax is not yet standardized; this is a semantic target, not yet executable syntax.

---

## 4. Current conditional route edges

Confirmed current route edges include:

### `edu:lesson-plan-authoring`

```text
existing_lesson_for_tiering → edu:lesson-differentiation
assessment_item_bank        → edu:item-authoring
quest_game                  → edu:material-to-quest-game
```

### `edu:lesson-differentiation`

```text
no_source_lesson → edu:lesson-plan-authoring
```

### `edu:material-to-quest-game`

```text
storyboard_needed → edu:visual-art-storyboard
```

### `edu:conjecturing-five-stage`

```text
ordinary_lesson                                   → edu:lesson-plan-authoring
existing_lesson_tiering                           → edu:lesson-differentiation
item_bank                                         → edu:item-authoring
existing_five_stage_lesson_for_student_facilitation → edu:conjecturing-five-stage-facilitator
```

### `edu:quest-threejs-adoption`

```text
no_quest_spec       → edu:material-to-quest-game
single_image_scene  → edu:image-to-3d-scene
```

### `edu:educational-web-game-workflow`

```text
threejs_pilot      → edu:quest-threejs-adoption
single_image_scene → edu:image-to-3d-scene
storyboard_needed  → edu:visual-art-storyboard
physical_or_both   → edu:material-to-quest-game
```

### `edu:conjecturing-five-stage-facilitator`

```text
lesson_design_needed → edu:conjecturing-five-stage
```

---

## 5. Confirmed route-cycle structures

### 5.1 Lesson-plan / differentiation cycle

```text
edu:lesson-plan-authoring
    --existing_lesson_for_tiering-->
edu:lesson-differentiation
    --no_source_lesson-->
edu:lesson-plan-authoring
```

Status: **⚠️ structurally cyclic, not proven erroneous**.

The route guards describe different states and may be mutually exclusive in valid execution. The problem is that v1 does not formally model state signature, route history, or maximum hops.

Required v2 control:

```yaml
graph_policy:
  routing:
    max_route_hops: 5
    repeated_node_state_action: stop
```

### 5.2 Conjecturing design / facilitation cycle

```text
edu:conjecturing-five-stage
    --existing_five_stage_lesson_for_student_facilitation-->
edu:conjecturing-five-stage-facilitator
    --lesson_design_needed-->
edu:conjecturing-five-stage
```

Status: **⚠️ structurally cyclic, semantically plausible**.

Expected state transition:

```text
no usable five-stage lesson
→ design lesson
→ usable lesson exists
→ facilitate student
```

Without state-sensitive loop protection, the same two nodes could theoretically be revisited indefinitely if runtime does not record whether the missing lesson condition was resolved.

---

## 6. Selection fields are not graph edges

Current `trigger` and `anti_trigger` fields are selection metadata.

They should migrate to:

```yaml
selection:
  triggers: []
  excludes: []
```

They must not be represented as Skill-to-Skill relations.

---

## 7. Role fields are node metadata

Current examples include:

```yaml
role: "supporting-kernel"
```

and:

```yaml
role: "one-to-one-student-facilitation"
```

These describe node function, not graph traversal.

They should migrate to:

```yaml
metadata:
  role: ...
```

---

## 8. Human Gate fields are constraints

Current `human_gate_if` fields should migrate to:

```yaml
constraints:
  human_gate_if: []
```

They are execution guards, not Skill graph relations.

---

## 9. Namespace migration requirement

Current v1 relation targets use bare Skill IDs, for example:

```yaml
dependencies: ["reasoning-kernel"]
```

or:

```yaml
conditional_routes:
  ordinary_lesson: "lesson-plan-authoring"
```

Registry v2 should normalize all graph targets to canonical namespace IDs:

```yaml
skill: "edu:reasoning-kernel"
to: "edu:lesson-plan-authoring"
```

This eliminates ambiguity between:

- Skill ID,
- canonical name,
- file path,
- namespace ID.

---

## 10. Initial migration decisions

### Confirmed

- `trigger` → `selection.triggers`
- `anti_trigger` → `selection.excludes`
- `type` → `metadata.type`
- `role` → `metadata.role`
- `purpose` → `metadata.purpose`
- `conditional_routes` → typed `relations.routes`
- `human_gate_if` → `constraints.human_gate_if`
- graph targets → canonical `namespace_id`
- `digital-learning-lesson-plan → lesson-plan-authoring` should not remain a universal dependency.
- `conjecturing-five-stage-facilitator → reasoning-kernel` is supporting semantics and should not be modeled as ordinary mandatory dependency.

### Pending

- final v2 classification of `conjecturing-five-stage → reasoning-kernel`;
- formal route-condition expression grammar;
- whether conflict storage is canonical one-way or duplicated symmetric form;
- whether `supports` is required in v2.0 implementation or may remain reserved vocabulary;
- whether route `return` semantics are needed in v2.0.

---

## 11. Risk ranking

### High

**Dependency semantic ambiguity**

A v1 dependency may mean prerequisite, support, or conditional routing. Blind migration would encode wrong runtime behavior.

### High

**Route loop without state/hop policy**

At least two current pairs form route cycles structurally.

### Medium

**Bare-ID graph references**

Works while namespace is small, but weakens formal validation and future multi-namespace support.

### Medium

**Reasoning policy duplication**

`reasoning-kernel` is both globally conditionally activated and locally declared as dependency by some Skills.

### Low / structural

**Metadata and routing coexist at the same YAML depth**

This is readable today but makes machine semantics and validation less explicit.

---

## 12. Next implementation step

Before modifying runtime SSOT:

1. define a concrete v2 YAML candidate for all 16 nodes;
2. resolve every current dependency into `requires`, `enhances`, or `routes`;
3. normalize relation targets to `namespace_id`;
4. add `graph_policy`;
5. perform static graph validation;
6. compare v1 and v2 routing outcomes on representative tasks;
7. only after regression validation, propose cutover of `00_ADMIN/00_EDU_SKILL_REGISTRY.yaml`.

This audit is the baseline for that migration and must be updated if the v1 Registry changes before v2 candidate generation.
