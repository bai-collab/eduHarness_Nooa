# Series Continuity

## Purpose
為多張教育系列建立 temporary visual state，維持已核准風格、角色與世界規則，同時允許每張圖依 Teaching Intent 重新設計構圖。

## State
```yaml
series_state:
  series_id:
  image_count:
  current_index:
  locked_style:
    illustration_style:
    palette:
    lighting:
    line_style:
    texture:
    aspect_ratio:
  locked_identity:
    characters:
    age_language:
    ai_character_style:
  world:
    recurring_environment:
    recurring_objects:
  artifact_continuity:
  approved_images:
    - index:
      teaching_intent:
      important_continuity:
      output_state:
```

## Locked Fields
系列應繼承已確認的：
- illustration style
- palette
- lighting language
- line style
- texture
- age language
- recurring character identity
- AI visual identity
- aspect ratio
- recurring world rules

## Per-image Fields
每張重新決定：
- Teaching Intent
- learner action
- scene-specific composition
- camera
- props
- current evidence
- interaction
- prohibited misreading

不得因 continuity 複製上一張構圖。

## Paper / Learning Artifact Continuity
支援「前一階段輸出 → 下一階段輸入」，例如：
Lesson 4 完成訪談題 → Lesson 5 持已完成訪談題演練 → Lesson 6 使用正式訪談表蒐證。

## One-image-at-a-time
`educational_codesign` 多張預設：
Design → Approve → Generate → Inspect → Repair/Accept → Lock → Next。

## Batch Override
若使用者明確要求全部直接生成／不逐張確認／一次完成：
```yaml
educational_codesign:
  default_generation_unit: one_image
  batch_allowed_when_user_explicit: true
```
Batch 只取消逐張 Design Approval，不取消 Educational Semantic Layer、Prompt Schema、Series Continuity、Visual QA。

## State Lifetime
series_state 預設為 temporary / ephemeral，不自動持久化。若使用者另有明確保存要求，再依 storage / governance 規則處理。
