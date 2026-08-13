# Structural Prompts v2.3

## Status
Experimental supporting strategy。借用 SVG / vector graphics 的結構思考：node、relation、orientation、containment、topology、occlusion、contact。不是要求模型解析真正 SVG path，也不宣稱固定成功率。

## Responsibility Boundary
### Physical Topology
本檔負責可見的幾何／接觸／遮擋／空間結構，例如：
`hand → contacts → worksheet`
`finger → wraps around → object handle`

### Semantic Topology
教育責任、時序、證據與決策權由 `educational-visual-semantics.md` 負責，例如：
`Student Draft → exists before → AI Critique`
`Student → owns → Final Decision`

Semantic Topology 是教育語意延伸，不取代 Physical Topology。

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
哪一隻手 → 掌面朝向 → 手勢 → 各指狀態 → 手腕方向 → 手指遮擋 → 物件接觸點。

## Spatial Relationship Pattern
- A in front of B
- A behind B
- A inside / outside frame
- A passes through opening B
- A contacts B at point C
- A overlaps B only at region C
- left/right ordering must remain stable

## Frame Breakout Pattern
分開描述 frame plane、behind、crossing、in front、contact/occlusion、camera perspective。

## Multi-person Interaction
明確標示 Person A / Person B；分別描述位置、面向、接觸手、接觸部位與遮擋順序。

## View-dependent Visibility & Occlusion Topology

### Principle
Physical Topology 不只回答「物件由哪些節點組成」，還必須回答：

> 在指定 camera angle 下，哪些節點應完整可見、部分可見、合理遮擋或不可見？

當主體具有左右對稱、成對肢體、多層零件、前後重疊、複雜 attachment 或 perspective-sensitive structure 時，不得只描述 object count 與 connection。

否則生成模型可能為了讓所有結構「看得清楚」，把遠側構件額外複製到畫面中，造成 OBJECT_COUNT_ERROR 或 SPATIAL_RELATION_ERROR。

### Activation Conditions
除了既有 Structural Prompt 條件外，以下情況必須啟用 view topology：
- 左右成對的手、腳、翅、角、輪、連桿或支架
- 側視、斜側視、俯視等會造成 near/far side 差異的構圖
- 遠側構件會被主體或近側構件部分遮擋
- 總數正確性是知識或任務 hard constraint
- 為了展示全部零件而可能誘發 duplicate geometry
- 單一彎曲構件容易被誤讀為多個獨立物件

### View Topology Schema
```yaml
view_topology:
  camera_angle:

  near_side:
    expected_visibility:
    required_parts:

  far_side:
    expected_visibility:
    required_parts:

  expected_visible_parts:

  allowed_occlusion:

  required_attachment_visibility:

  forbidden_duplicate_for_visibility:
```

### Compile Order
對 view-sensitive structure：
1. 定義 anatomical / mechanical topology。
2. 定義 camera angle。
3. 判定 near-side / far-side。
4. 對每個成對或多層構件指定：fully visible / partially visible / allowed occluded / not expected visible。
5. 指定 attachment point 是否必須可見。
6. 明確禁止：duplicated far-side structure / phantom appendage / split geometry interpreted as multiple objects。
7. 再決定標籤與 callout placement。

### Core Rule
`anatomical/mechanical total count` 與 `fully visible count` 不是同一件事。

例如側視昆蟲：
```text
anatomical total legs = 6
fully exposed near-side legs = 3
far-side legs = partially visible / partially occluded
```

不得把「總共有六足」錯誤編譯成：
```text
all six legs must be completely exposed in a strict side view
```
如果這會違反合理 perspective。

## Example — Side-view Grasshopper

### Topology
```text
THORAX
├── foreleg_pair
│   ├── near_foreleg
│   └── far_foreleg
├── midleg_pair
│   ├── near_midleg
│   └── far_midleg
└── hindleg_pair
    ├── near_hindleg
    └── far_hindleg
```

### Count
```text
foreleg_pair = 2
midleg_pair  = 2
hindleg_pair = 2

anatomical_total = exactly 6
```

### View Topology
```yaml
view_topology:
  camera_angle: lateral_three_quarter_view

  near_side:
    expected_visibility: fully_visible
    required_parts:
      - foreleg
      - midleg
      - hindleg

  far_side:
    expected_visibility: partially_visible
    required_parts:
      - foreleg_pair_member
      - midleg_pair_member
      - hindleg_pair_member

  allowed_occlusion:
    - far-side legs may be partially occluded by thorax
    - far-side legs may be partially occluded by near-side legs
    - far-side hindleg may be partially occluded by wing or body edge

  required_attachment_visibility:
    - every visible leg root must originate from thorax
    - three leg-pair relationships must remain inferable

  forbidden_duplicate_for_visibility:
    - do not duplicate far-side legs to expose all six completely
    - do not create an extra limb next to an existing near-side limb
    - do not split one bent hindleg into two apparent legs
```

### Educational Label Rule
側視教學圖優先標示：
- 前足（1 對）
- 中足（1 對）
- 後足（1 對）

而不是強迫標示左／右前足、中足、後足全部完整展開。標籤語意不得反過來逼迫生成模型違反 perspective。

## View-aware QA
Visual QA 除了確認 object count，也必須確認：
1. 該 camera angle 下的可見方式是否合理。
2. far-side structure 是否被不必要複製。
3. 合理遮擋是否被錯判成「缺少物件」。
4. 單一彎曲構件是否被誤判為兩個物件。
5. visible attachment 是否符合 anatomy / mechanism。
6. 教學標籤是否與實際可見關係一致。

### New Defect Codes
#### OCCLUSION_MISREAD
正確總數存在，但因視角或遮擋設計不合理，導致結構被看成缺失、錯接或多出。

Repair：
- 保留正確 topology。
- 調整 camera angle / near-far relation / overlap。
- 不新增構件。

#### DUPLICATED_FOR_VISIBILITY
為了讓遠側構件「清楚可見」，模型額外產生重複肢體或零件。

Repair：
- 移除 duplicate node。
- 保留 anatomical/mechanical total。
- 允許 far-side 合理部分遮擋。
- 不改變已通過的 identity / scene / style。

## View / Topology Conflict Gate
若以下兩者互相衝突：
```text
camera requirement
vs
structural visibility requirement
```
不得直接生成。

優先處理方式：
1. 保留 anatomy / mechanism hard constraint。
2. 放寬不必要的「全部完整可見」要求。
3. 或改用更適合的 camera angle。
4. 若使用者明確指定視角，則依該視角建立合理 occlusion。

不得用 duplicate geometry 解決衝突。

## Repair Strategy
HAND_TOPOLOGY_ERROR / SPATIAL_RELATION_ERROR / OCCLUSION_MISREAD / DUPLICATED_FOR_VISIBILITY 時：
- 保留 identity、服裝、場景、構圖等已通過維度。
- 只重寫必要的 orientation / relation / contact / view topology / occlusion。
- 不用堆疊品質形容詞取代幾何描述。
- 不得為修正可見性而增加不存在的結構節點。

## Evaluation
普通自然語言 Prompt vs structural Prompt 做 A/B；觀察 finger count、object count、joint coherence、gesture correctness、object contact、attachment、occlusion、near/far visibility、duplicate geometry、identity drift。未實測前不寫固定成功率。
