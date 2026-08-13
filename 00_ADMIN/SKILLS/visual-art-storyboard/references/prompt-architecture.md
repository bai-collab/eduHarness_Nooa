# Prompt Architecture v2.2

## Goal
將自然語言或來源素材轉成穩定、可稽核的 Visual Specification，再編譯成 ChatGPT Web 生圖或圖片修改指令。避免把「優化」誤解為無限制增加細節；教育模式額外保護 Teaching Intent、Role Fidelity、Evidence 與 Decision Ownership。

## Evidence State
- confirmed：使用者或可靠來源明確指定。
- inferred：低風險推定，可被覆寫。
- unknown：未決定；不得自行具體化。

## Visual Specification
```yaml
intent:
purpose:
audience:
medium:
aspect_ratio:
subject:
reference:
identity:
action:
geometry:
spatial_relationships:
composition:
camera:
scene:
style:
materials:
lighting:
palette:
text:
constraints:
negative_constraints:
educational:
  teaching_intent:
  learner_action:
  teacher_role:
  ai_role:
  evidence:
  prerequisite_artifact:
  decision_owner:
  prohibited_misreading:
```

`educational` 為可選層，只在教育模式或來源需要時啟用；一般生圖不得被迫填滿。

## Edit Specification
```yaml
edit_intent:
  target:
  preserve:
  modify:
  defect:
  unknown:
```

## Interaction Profiles
### fast_generate
低歧義或明確要求直接生成。Visual Spec → Prompt Optimization → Generate → Visual QA。

### discuss_first
高歧義或明確要求先討論。Critical Unknowns → Visual Proposal → Prompt → Design Approval → Generate → Visual QA。

### educational_codesign
教育來源／任務且存在多圖系列、逐張共同設計、教學角色 fidelity、活動順序或 evidence preservation 需求時使用。
Inspect Source → Teaching Intent → Educational Semantic Layer → Visual Proposal → Prompt Schema → Design Approval → Generate ONE → Physical + Semantic QA → Repair/Accept → Lock → Next。
明確 batch request 可略過逐張 Approval，但不可略過 semantics / continuity / QA。

### edit_existing
先做 preserve / modify / defect / unknown 分析；只修必要維度。

## Clarification Rule
只有 unknown 會顯著改變輸出時才詢問；低影響 unknown 保持開放。Proposal 不等於 confirmed。

## Priority
一般：
P0 hard constraints > P1 identity/reference > P2 structural correctness > P3 semantic content/action > P4 composition/camera > P5 style/material/lighting > P6 decorative enhancement.

教育：
P0 source/user hard constraints > P1 educational intent/role fidelity/decision ownership > P2 identity/reference > P3 structural correctness > P4 observable learner action/evidence > P5 composition/camera > P6 style/material/lighting > P7 decorative enhancement.

## Prompt Compile Order
1. Purpose / Teaching Intent
2. Source + Hard Constraints
3. Educational Roles / Decision Ownership
4. Identity / Reference
5. Subject
6. Observable Action / Evidence
7. Structural / Spatial Relations
8. Composition / Camera
9. Scene
10. Style
11. Material / Lighting / Palette
12. Optional Enhancement
13. Preserve / Avoid

一般非教育模式中沒有資料的 educational steps 直接略過。

## Compiler Rules
- Enhance ≠ Invent.
- Proposal ≠ confirmed.
- 風格 recipe 不得覆蓋 identity、Teaching Intent、Role Fidelity 或 Decision Ownership。
- 若有參考圖，先描述 preserve 再描述 transform。
- edit_existing 必須先鎖 preserve。
- 圖中文字視為 hard constraint；QA 單獨檢查。
- Semantic Topology 應用來表達教育責任與時序；Physical Topology 仍由 structural-prompts.md 負責。

## Design Approval / Prompt Freeze
需要 Design Approval 的 profile 在核准 Visual Proposal 後建立 Prompt Freeze。Freeze 後不得自行增加重要角色、重寫 Teaching Intent、角色權限、核心構圖、重要 evidence 或風格。這不是 Governance Human Gate。

## Output Profiles
- prompt-only
- fast-generate
- discuss-first
- educational-codesign
- edit-existing
- storyboard-on
