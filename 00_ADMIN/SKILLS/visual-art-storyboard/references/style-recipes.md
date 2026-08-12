# Style Recipes

Recipes 保存「視覺語法」，不是固定 Prompt。只在與需求匹配時載入；永遠低於 hard constraints、identity 與 structural correctness。

## 1. editorial-cyber-fashion
來源概念：高級時尚海報、賽博精品、玻璃／水晶／液態反射、冷淡空靈、霓虹光影。

```yaml
visual_goal: luxury editorial poster
hierarchy: character-first with material-driven visual identity
composition:
  - editorial layout
  - negative space
  - centered or deliberate asymmetry
materials:
  - glass
  - crystal
  - translucent resin
  - reflective synthetic surface
lighting:
  - rim light
  - controlled bloom
  - specular/refraction emphasis
verify:
  - material readability
  - luxury restraint
  - identity preserved
```
注意：不把 `masterpiece/8k/ultra detailed` 當全域必備；人物身材詞也不應自動加入。

## 2. ink-negative-space
```yaml
visual_goal: restrained eastern poster
hierarchy:
  upper: oversized recognizable silhouette or portrait
  lower: secondary full/half figure
techniques:
  - double exposure
  - narrative collage
  - ink diffusion
  - mist
  - large negative space
flow: one visual path connecting upper and lower subjects
verify:
  - breathing room preserved
  - primary silhouette readable
  - collage does not become clutter
```

## 3. half-body-commercial-poster
```yaml
visual_goal: clean premium character poster
composition:
  - frontal half-body close-up
  - subject offset to one side
  - large negative space
lighting:
  - soft cinematic key
  - rim light
palette: low saturation with character accent color
verify:
  - face recognizable
  - whitespace usable
  - text area not blocked
```

## 4. frame-breakout
```yaml
visual_goal: subject crossing a social-media/photo frame plane
camera:
  - low-angle or wide-angle only when requested
structure:
  - define frame plane
  - define body parts behind / crossing / in front
  - define contact and occlusion at frame edge
background: secondary playful elements if requested
verify:
  - topology of crossing frame is coherent
  - body is not fused with frame
```

## 5. ugly-doodle
```yaml
visual_goal: intentionally crude humorous drawing
style:
  - cheap marker/crayon feel
  - rough sketch
  - awkward perspective
  - uneven coloring
  - visible strokes
  - childlike proportions
avoid:
  - photorealism
  - polished rendering
  - luxury finish
verify:
  - intentional imperfection remains
```
此 recipe 明確證明「高品質咒語」不能全域套用。

## 6. eight-frame-previs
此 recipe 不取代 storyboard-prompts.md；只作 storyboard-on 的視覺風格入口。
```yaml
sequence: 8 continuous frames
focus:
  - action progression
  - camera progression
  - body mechanics
  - continuity
verify:
  - same event
  - stable identity
  - clear motion arc
```

## Recipe Resolution Rules
1. 使用者明確指定風格 > recipe 自動匹配。
2. 可混合 recipes，但先判斷是否語法衝突。
3. recipe 只能填充 style/composition/material/lighting 等相容欄位。
4. recipe 不可覆蓋 identity、文字內容、指定數量或核心動作。
5. 無匹配 recipe 時直接使用 Visual Spec，不強迫套模板。
