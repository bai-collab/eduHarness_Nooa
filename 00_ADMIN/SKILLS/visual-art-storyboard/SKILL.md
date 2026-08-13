---
name: visual-art-storyboard
description: 規劃美術方向、角色、場景、Prompt、教育共同設計、可選八格分鏡與 ChatGPT Web 生圖驗證；支援直接生圖、先討論、教育逐張共同設計與既有圖片修改。
---
# 美工與分鏡設計

version: 2.3
namespace_id: edu:visual-art-storyboard
status: active

## Purpose
把自然語言或來源素材轉成可控、可追溯的 Visual Specification，再編譯為適合 ChatGPT Web 圖片生成或修改的 Prompt。依使用者意圖選擇快速生成、先討論確認、教育共同設計、或修改既有圖片。生成後執行 Physical / Rendering QA；教育模式再執行 Semantic / Educational QA 與局部 repair。分鏡為可選模式，不因一般生圖自動啟用。

## Responsibility Boundary
### Owns
- 視覺意圖、用途、受眾與媒介判定。
- 參考圖／角色 identity 保真規格。
- 構圖、場景、鏡頭、材質、光線、色彩與視覺層級設計。
- 高複雜結構的 geometry / physical topology 約束提示。
- 對受視角影響的結構建立 view-dependent topology：camera angle、near-side / far-side、expected visibility、allowed occlusion、required attachment visibility、forbidden duplication for visibility。
- 教育情境中的 Teaching Intent、Learner Action、Evidence、Role Fidelity 與 Semantic Topology。
- Style Recipe 選擇與 Prompt Compiler。
- ChatGPT Web 圖片生成與既有圖片修改（當次平台具備能力且使用者要求時）。
- Physical / Rendering QA、Semantic / Educational QA、缺陷分類與局部 repair loop。
- 多張教育系列的 temporary series continuity。
- storyboard-on 時的八格連續分鏡與 continuity 檢查。

### Excludes
- 外部圖片／影片 API、API Key、.env、模型 endpoint、模型價格與 provider routing。
- 影片生成、補幀或影片模型參數。
- 3D scene implementation。
- 未經 Governance Human Gate 的 production Skill／Registry 修改。

## Modes
- faithful：只整理、結構化與消歧，不新增藝術決策。
- enhanced：預設；可補低風險構圖、可讀性、背景簡化、視覺層級與光線一致性，不改變 identity、核心敘事與 hard constraints。
- creative：使用者需要創意發展時，可主動完成場景、藝術方向、鏡頭、材質、氛圍與敘事細節。
- art-only：預設，不建立分鏡。
- storyboard-on：/gb、運鏡八格或明確分鏡要求時啟用。

## Execution Profiles
### fast_generate
適用於使用者明確要求直接生圖、先試一版、不用問，或低歧義的一般生圖。
流程：Request → Visual Spec → Prompt Optimization → Generate → Visual QA。
教育用途本身不強制切換 educational_codesign。除非存在會顯著改變成果的關鍵 unknown，否則不額外要求確認。

### discuss_first
適用於使用者要求先討論、先看 Prompt、先確認美術方向，或一般高歧義／正式用途／複雜視覺限制。
流程：Request → Critical Unknowns → Visual Spec → Visual Proposal → Prompt → Design Approval → Generate → Visual QA。
Design Approval 是互動流程，不等同 Governance Human Gate。

### educational_codesign
`educational_codesign` 是 execution profile，不是獨立 Skill，也不是每張教育圖片的強制模式。
適用於教案情境示意圖、教材插圖、教學流程、多張教育系列、學習歷程連續圖，或當教學角色、活動順序、學習證據、決策權與逐張共同設計需要被精確保留時。

核心原則：
- Source-first
- Domain-verified when knowledge-bearing
- Intent-before-style
- One-image-at-a-time by default
- Approval-before-generation by default
- Student-action visibility
- Evidence visibility
- Role fidelity
- Semantic inspection
- Series continuity

預設流程：
Inspect Source → Resolve Series → Select Current Image → Define Teaching / Communication Intent → Resolve Educational Semantic Layer → Build Visual Proposal → Compile Prompt Schema → Design Approval → Generate ONE Image → Physical + Semantic QA → Repair / Accept → Lock Approved State → Next Image。

若使用者明確要求全部直接生、一次完成、不逐張確認，可使用 batch override；仍保留 Educational Semantic Layer、Series Continuity 與 QA。

### edit_existing
當 conversation 中存在可用既有圖片，且使用者表達修改、替換、刪除、保留、修正、調整或「這張……但……」等 edit/repair intent 時優先。
建立 Edit Spec：
- target
- preserve
- modify
- defect
- unknown

若 preserve / modify 邊界清楚，直接局部修改；若會實質改變 identity、主要構圖、核心敘事或存在多個合理解讀，先摘要範圍再取得 Design Approval。不得因局部修改任意重造已通過部分。

## Interaction Routing
1. Existing usable image + edit/repair intent → `edit_existing`
2. Educational source / task AND (multi-image series OR user requests step-by-step co-design OR pedagogical role fidelity matters OR teaching sequence/evidence must be preserved) → `educational_codesign`
3. User explicitly requests direct/batch generation → `fast_generate`
4. General low-ambiguity request → `fast_generate`
5. General high-ambiguity or explicit discussion request → `discuss_first`
6. 無法判定時優先最少阻塞但可逆的路徑；不得把 inferred 當 confirmed。

## Priority Order
一般模式：
P0 User hard constraints
P1 Reference / Character identity
P2 Structural correctness
P3 Semantic content / action
P4 Composition / camera
P5 Style / material / lighting
P6 Decorative enhancement

教育模式：
P0 Source / User hard constraints
P1 Educational Intent / Role Fidelity / Decision Ownership
P2 Reference / Character identity
P3 Structural Correctness / Geometry / Physical Topology / View-dependent Visibility / Contact / Occlusion
P4 Observable Learner Action / Evidence / Semantic Content
P5 Composition / Camera
P6 Style / Material / Lighting
P7 Decorative Enhancement

低層 priority 不得覆寫高層。Enhance ≠ Invent。

## Required Subresources
- references/prompt-architecture.md
- references/structural-prompts.md
- references/style-recipes.md
- references/storyboard-prompts.md
- references/educational-visual-semantics.md
- references/series-continuity.md

## Workflow
1. Route interaction：選 `fast_generate`、`discuss_first`、`educational_codesign` 或 `edit_existing`；再判斷 art-only / storyboard-on。
2. Parse intent/source：確認用途、受眾、媒介、比例、參考素材、來源與 hard constraints。
3. Domain knowledge preflight：若圖片承載可驗證的科學、歷史、地理、健康、工程或其他領域知識，先查證關鍵機制／關係；使用者未提供足夠來源時，不得把模型常識直接當已確認事實。
4. Build Visual Spec：依 prompt-architecture.md 建立 confirmed / inferred / unknown；教育模式才啟用 educational layer。
5. Resolve identity：有參考人物／角色時建立 immutable identity anchors。
6. 若 edit_existing：鎖定 preserve / modify / defect / unknown。
7. 若 educational_codesign：讀 educational-visual-semantics.md；先確定 Teaching Intent、Learner Action、Teacher Role、AI Role、Evidence、Decision Owner、Prohibited Misreading。
8. Direct visual design：決定主體層級、構圖、鏡頭、空間、場景、材質、光線、色彩與必要文字。若主體具有成對肢體、多層零件、左右對稱結構或會因 perspective 產生遮擋，camera angle 不得獨立決定；必須與 Structural pass 的可見性條件共同設計。
9. Structural pass：高複雜結構依 structural-prompts.md 補 geometry / physical topology / view topology / occlusion / contact。Semantic Topology 不取代此層。

   若結構正確性會受觀察角度影響，例如：
   - 昆蟲足、翅與附肢
   - 人物四肢、手勢與多人互動
   - 機械零件、連桿、支架
   - 器官或多層解剖構造
   - 多物件前後遮擋

   則必須建立：
   - camera_angle
   - near_side
   - far_side
   - expected_visible_parts
   - allowed_occlusion
   - required_attachment_visibility
   - forbidden_duplicate_for_visibility

   不得為了讓所有結構「看得更清楚」而製造在該視角下不合理的重複肢體或零件。
10. Series pass：多張教育系列讀 series-continuity.md，繼承 locked style / identity / world，並保留 per-image freedom。
11. Resolve recipe：必要時讀 style-recipes.md；不得讓 recipe 覆蓋 identity 或 educational semantics。
12. Compile prompt：依 Purpose/Teaching Intent → Source + Hard Constraints → Educational Roles/Decision Ownership → Identity → Subject → Observable Action/Evidence → Structural/Spatial Relations → View-dependent Visibility / Occlusion → Composition/Camera → Scene → Style → Material/Lighting/Palette → Optional Enhancement → Preserve/Avoid。
13. Design Approval：僅在 profile 需要時執行。核准後建立 Prompt Freeze；一般治理 Gate 另處理。
14. Generate / Edit：使用者只要 Prompt 時不得產圖；工具成功前不得宣稱已產圖或修改。
15. Visual QA：一般圖檢查 Physical / Rendering QA；教育圖再檢查 Semantic / Educational QA。
16. Repair loop：先診斷 defect code，只修失敗維度。
17. Series accept：本張通過後 lock approved state，再進下一張；USER_REJECTED 不得直接跳下一張。
18. storyboard-on：讀 storyboard-prompts.md，建立 8 個連續鏡頭並檢查 continuity。

## Design Approval
Design Approval 是圖片共同設計流程：
- Visual Proposal approval
- Prompt Freeze
- Generation approval
- Image acceptance
- Proceed-to-next-image approval

可由「好、可以、就這樣、生圖、開始、照這個做」等明確語句表示，但只對當前設計狀態有效。
Design Approval 不等同 Governance Human Gate。

## Prompt Freeze
在需要 Design Approval 的 profile 中，本張 Visual Proposal 核准後建立 Prompt Freeze。Freeze 後生成不得自行增加重要角色、更換角色身份、改變核心構圖、Teaching Intent、AI role、student decision ownership、重要物件或風格。若 runtime 因安全或模型限制必須調整，需揭露差異。

## Governance Human Gate
仍由 eduHarness Project governance 控制，包括學生個資、正式評量、正式送件／公開、刪除資料、高影響外部操作、production Registry／Skill governance 修改、Canonical Distribution promotion。普通 Prompt 確認不得誤記成 Governance Human Gate。

## Physical / Rendering QA
- IDENTITY_DRIFT
- ANATOMY_ERROR
- HAND_TOPOLOGY_ERROR
- OBJECT_COUNT_ERROR
- SPATIAL_RELATION_ERROR
- OCCLUSION_MISREAD
- DUPLICATED_FOR_VISIBILITY
- COMPOSITION_MISS
- STYLE_DRIFT
- TEXT_ERROR
- CONSTRAINT_LOSS

## Semantic / Educational QA
- INTENT_MISMATCH
- LEARNER_ACTION_MISSING
- AI_ROLE_DRIFT
- TEACHER_ROLE_DRIFT
- EVIDENCE_CONTINUITY_LOSS
- PEDAGOGICAL_SEQUENCE_ERROR
- DOMAIN_KNOWLEDGE_MISMATCH
- CAUSAL_ORDER_ERROR
- VISUAL_OVERLOAD
- SERIES_STYLE_DRIFT

## Failure Behavior
- 關鍵來源或既有圖片不可讀：SOURCE_UNAVAILABLE。
- 知識承載型圖片的關鍵機制無法可靠查證：保留 UNKNOWN、要求來源或改為概念性示意；不得把未驗證內容畫成已確認事實。
- 使用者要求編輯但 conversation 中沒有可用圖片：要求上傳或指出圖片，不宣稱已修改。
- 圖片生成／修改能力不可用：只交付 Prompt / Edit Spec，不宣稱已產圖或修改。
- identity / hard constraints 或來源互相衝突且無法裁決：SOURCE_CONFLICT。
- INTENT_MISMATCH：回到 Teaching Intent / learner action / evidence / prohibited misreading。
- AI_ROLE_DRIFT：重建 role hierarchy / semantic topology / visual priority / negative semantic constraints。
- LEARNER_ACTION_MISSING：強化 observable action 與 evidence。
- VISUAL_OVERLOAD：降低 information density / object count / decoration。
- SERIES_STYLE_DRIFT：回讀 temporary series state，只修當前圖。
- HAND_TOPOLOGY_ERROR：只修 orientation / relation / contact / occlusion。
- OCCLUSION_MISREAD：回到 view topology，重新校正 camera angle、near-side / far-side、expected visibility 與 allowed occlusion；不以增加物件數量解決可讀性。
- DUPLICATED_FOR_VISIBILITY：移除因「想讓遠側結構更清楚」而產生的重複肢體／零件，只修 count / attachment / visibility / occlusion，保留已通過的 identity、style、scene 與 teaching intent。
- TEXT_ERROR：減少長文字、使用短標籤／符號或改後製。
- USER_REJECTED：只重新規劃當前圖片，不跳下一張。
- QA 無法可靠確認：保留 UNKNOWN，不宣稱通過。

## Verification
Backward compatibility：
- fast_generate 正常。
- discuss_first 正常。
- edit_existing 正常。
- storyboard-on 正常。

Educational co-design：
- 知識承載型教育圖在 visual design 前完成 domain verification。
- source-derived / verified / inferred / unknown 有明確區分。
- 多張預設逐張。
- 每張有 Teaching Intent。
- 可逐張 Design Approval。
- 不擅自具體化 unknown。
- student action visible。
- role fidelity 正確。
- evidence continuity 正確。
- batch override 有效。

Structural quality：
- physical topology 與 semantic topology 責任分離。
- hand / object / spatial defect 可局部 repair。
- 不使用品質形容詞取代 geometry。
- camera angle 與 topology 在生成前共同校驗。
- 成對／多層結構允許符合視角的合理遮擋。
- 不得為提升可見性而複製遠側肢體或零件。

Series：
- locked style / identity 可繼承。
- 每張構圖可獨立。
- 已核准圖片不因後續圖片改動。
- temporary state 不自動持久化。

Governance：
- Design Approval 不誤當 Governance Human Gate。
- production 修改前需明確 Governance Human Gate。
- 工具成功前不宣稱完成修改。
- GitHub promotion 晚於 production validation。

## Runtime Boundary
Runtime：ChatGPT Web / Gemini Spark。不得假設 shell、Git CLI、Node.js、daemon、外部 API、.env 或本機服務。只有工具實際成功後才能宣稱已產圖、修改圖片或已寫入。

## Provenance
- Base: production `visual-art-storyboard` v2.1.
- v2.2 candidate adds `educational_codesign`, Educational Semantic Layer, Semantic Topology, Series Continuity, Educational Semantic QA, Design Approval naming separation, Prompt Freeze, and one-image-at-a-time educational series workflow.
- v2.3 candidate adds view-dependent physical topology, perspective-aware visibility/occlusion modeling, duplicate-for-visibility prevention, and corresponding QA/repair behavior.
- `educational_codesign` is an execution profile, not a separate Skill.
- Semantic Topology extends educational semantics and does not replace Physical Topology.
