# Prompt Architecture

## Goal
將自然語言需求轉成穩定、可稽核的 Visual Specification，再編譯成 ChatGPT Web 生圖或圖片修改指令。避免把「優化」誤解為無限制增加細節，並依使用者意圖選擇快速生成、先討論確認或修改既有圖片。

## Evidence State
- confirmed：使用者或可靠來源明確指定。
- inferred：依用途做的低風險推定，可被覆寫。
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
```

## Edit Specification
既有圖片修改時建立：
```yaml
edit_intent:
  target:
  preserve:
  modify:
  defect:
  unknown:
```

`preserve` 與 `modify` 是 edit_existing 的核心邊界；沒有被要求修改且已通過的元素不得任意重造。

## Priority
P0 hard constraints > P1 identity/reference > P2 structural correctness > P3 semantic content/action > P4 composition/camera > P5 style/material/lighting > P6 decorative enhancement.

## Clarification Rule
只有 unknown 會顯著改變輸出時才詢問；低影響 unknown 保持開放。不要為了填滿 schema 而詢問所有欄位。

## Interaction Profiles
### fast_generate
- 使用者明確要求直接生、先試一版、不用問；或一般需求低歧義。
- Visual Spec → Prompt Optimization → Generate → Visual QA。
- 不強制先展示 Prompt。

### discuss_first
- 使用者要求先討論、先看 Prompt、先確認；或需求高歧義、正式用途、複雜限制。
- 必要澄清 → Visual Spec → Prompt → 使用者確認 → Generate。
- Prompt 確認屬互動設計，不等同治理 Human Gate。

### edit_existing
- conversation 中存在可用既有圖片，且使用者有修改／修正／替換／刪除／保留等意圖時優先。
- 先做 preserve / modify / defect / unknown 分析。
- 若邊界明確，直接局部修改。
- 若多義或可能改變 identity、主要構圖、核心敘事，先摘要修改範圍並確認。
- 不得把局部修改轉成全新生圖。

## Modes
### faithful
只重排、消歧、結構化；不新增創意設定。

### enhanced
預設。允許加入可讀性、視覺層級、合理留白、背景簡化、光線一致性等低風險設計，不得變更 identity 或核心敘事。

### creative
允許發展場景、鏡頭、藝術方向、材質、氛圍與敘事，但仍受 P0/P1/P2 約束。

## Prompt Compile Order
1. Purpose
2. Hard Constraints
3. Identity / Reference
4. Subject
5. Action
6. Structural / Spatial Relations
7. Composition / Camera
8. Scene
9. Style
10. Material / Lighting / Palette
11. Optional Enhancement
12. Preserve / Avoid

## Compiler Rules
- Enhance ≠ Invent。
- 不設全域 `masterpiece / ultra detailed / cinematic` 預設；只有風格需要時才使用相符語彙。
- 風格 recipe 不得覆蓋 identity。
- 使用者要求粗糙、塗鴉、低精緻等風格時，不得加入與目標相反的完美品質詞。
- 若有參考圖，先描述「保留什麼」再描述「改變什麼」。
- edit_existing 必須先鎖定 preserve，再編譯 modify；不得為局部修正重寫整體視覺設計。
- 若圖片含文字，文字內容視為 hard constraint，Visual QA 必須單獨檢查。

## Output Profiles
- prompt-only：Visual Spec 摘要 + 最終 Prompt。
- fast-generate：優化後直接產圖，再進入 Visual QA。
- discuss-first：先討論／確認 Prompt，再產圖。
- edit-existing：Edit Spec → 必要時確認 → 局部圖片修改 → Visual QA。
- storyboard-on：在共用 Visual Spec 後再進入 storyboard reference。
