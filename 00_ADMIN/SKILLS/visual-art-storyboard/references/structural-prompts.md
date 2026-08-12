# Structural Prompts

## Status
Experimental supporting strategy。借用 SVG / vector graphics 的結構思考：node、relation、orientation、containment、topology、occlusion、contact。不是要求模型解析真正 SVG path，也不宣稱固定成功率。

## When to Activate
- 手指／手勢／持物
- 多人肢體互動
- 肢體遮擋
- 跨越框體、穿出相框
- 物件數量與連接關係重要
- 複雜姿勢或幾何排列

## Hand Schema
```yaml
hand:
  side: left|right
  orientation:
  gesture:
  fingers:
    thumb:
    index:
    middle:
    ring:
    little:
  wrist:
  overlap:
  object_contact:
```

## Hand Compile Pattern
優先說清楚：哪一隻手 → 掌面朝向 → 手勢 → 各指狀態 → 手腕方向 → 手指彼此遮擋 → 與物件接觸點。

例：
`right hand gripping the cup handle; thumb opposing the index finger around the handle; middle, ring and little fingers naturally curled; wrist aligned with forearm; all five fingers remain distinct; no fused fingers; contact occurs at the handle rather than the cup body.`

## Spatial Relationship Pattern
- A in front of B
- A behind B
- A inside / outside frame
- A passes through opening B
- A contacts B at point C
- A overlaps B only at region C
- left/right ordering must remain stable

## Frame Breakout Pattern
對「人物爬出相框」等場景，分開描述：
1. frame plane
2. body parts still behind the plane
3. body parts crossing the plane
4. body parts already in front
5. contact / occlusion at frame edge
6. camera perspective

避免只寫「爬出來」而沒有前後拓撲關係。

## Multi-person Interaction
明確標示 Person A / Person B；分別描述左右位置、面向、哪隻手接觸、接觸部位與遮擋順序，避免把兩人的手臂／手指融合。

## Repair Strategy
Visual QA 若出現 HAND_TOPOLOGY_ERROR / SPATIAL_RELATION_ERROR：
- 保留 identity、服裝、場景、構圖等已通過維度。
- 只重寫錯誤結構的 orientation / relation / contact / occlusion。
- 不用堆疊大量品質形容詞取代幾何描述。

## Evaluation Plan
至少建立普通自然語言 Prompt vs structural Prompt 的 A/B cases；觀察 finger count、joint coherence、gesture correctness、object contact、occlusion、identity drift。未建立實測前，不把「七至八成」等成功率寫入正式 Skill。
