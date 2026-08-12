---
name: visual-art-storyboard
description: 規劃美術方向、角色、場景、Prompt、可選八格分鏡與 ChatGPT Web 生圖驗證；支援直接生圖、先討論後生圖與既有圖片修改三種互動路徑。
---
# 美工與分鏡設計

version: 2.1
namespace_id: edu:visual-art-storyboard
status: active

## Purpose
把使用者的自然語言視覺需求轉成可控的 Visual Specification，再編譯為適合 ChatGPT Web 圖片生成的 Prompt；依使用者意圖選擇直接生成、先討論確認、或修改既有圖片。生成後做視覺驗證與局部修復。分鏡為可選模式，不因一般生圖需求自動啟用。

## Responsibility Boundary
### Owns
- 視覺意圖、用途、受眾與媒介判定。
- 參考圖／角色 identity 保真規格。
- 構圖、場景、鏡頭、材質、光線、色彩與視覺層級設計。
- 高複雜結構的 geometry / topology 約束提示。
- Style Recipe 選擇與 Prompt Compiler。
- ChatGPT Web 圖片生成與既有圖片修改（當次平台具備能力且使用者要求時）。
- Visual QA、缺陷分類與局部 repair loop。
- storyboard-on 時的八格連續分鏡與 continuity 檢查。

### Excludes
- 外部圖片／影片 API、API Key、.env、模型 endpoint、模型價格與 provider routing。
- 影片生成、補幀或影片模型參數。
- 3D scene implementation。
- 未經 Human Gate 的 production Skill／Registry 修改。

## Modes
- faithful：只整理、結構化與消歧，不新增藝術決策。
- enhanced：預設；可補低風險的構圖、可讀性、背景簡化、視覺層級與光線一致性，不改變 identity、核心敘事與 hard constraints。
- creative：使用者需要創意發展時，可主動完成場景、藝術方向、鏡頭、材質、氛圍與敘事細節。
- art-only：預設，不建立分鏡。
- storyboard-on：/gb、運鏡八格或明確分鏡要求時啟用。

## Execution Profiles
### fast_generate
適用於使用者明確要求「直接生圖、先試一版、不用問」或低歧義的一般生圖需求。
流程：需求 → Visual Spec → Prompt Optimization → Generate → Visual QA。
除非存在會顯著改變成果的關鍵 unknown，否則不要額外要求確認。

### discuss_first
適用於使用者明確要求討論、先看 Prompt、先設計方向，或需求具有高歧義／正式用途／複雜限制。
流程：需求 → 找出關鍵 unknown → 必要澄清 → Visual Spec → 優化 Prompt → 使用者確認 → Generate。
不得為了填滿 schema 而詢問低影響欄位。

### edit_existing
當 conversation 中存在可用的既有圖片，且使用者表達修改、替換、刪除、保留、修正、調整或「這張……但……」等 edit/repair intent 時優先啟用。
先建立 Edit Spec：
- target：要修改的既有圖片。
- preserve：已通過且應保持不變的 identity、構圖、場景、風格、文字或其他元素。
- modify：使用者明確要求改變的部分。
- defect：若屬生成錯誤，標記對應 defect code。
- unknown：只有會實質影響修改結果的未知。

若 modify / preserve 邊界已清楚，直接執行局部修改，不重複追問。
若修改會實質影響 identity、主要構圖、核心敘事或存在多個合理解讀，先摘要「保留什麼／改什麼」並取得使用者確認後再修改。
修改既有圖片不得被當成全新生圖需求；禁止因局部修改任意重造已通過部分。

## Interaction Routing
1. 若有可用既有圖片且偵測到 edit/repair intent → `edit_existing`。
2. 否則若使用者明確要求直接生成，或需求低歧義且未要求討論 → `fast_generate`。
3. 若使用者要求先討論、先看 Prompt、先確認，或關鍵 unknown 會顯著改變成果 → `discuss_first`。
4. 無法判定時，優先採最少阻塞但可逆的路徑；不得把 inferred 當 confirmed。

## Priority Order
P0 User hard constraints
P1 Reference / Character identity
P2 Structural correctness
P3 Semantic content / action
P4 Composition / camera
P5 Style / material / lighting
P6 Decorative enhancement

Enhance ≠ Invent。未知資訊不得因「讓 Prompt 更完整」而擅自具體化；只有會顯著改變成果的未知才詢問，否則保持開放。

## Required Subresources
- references/prompt-architecture.md
- references/structural-prompts.md
- references/style-recipes.md
- references/storyboard-prompts.md

## Workflow
1. Route interaction：依 Interaction Routing 選 `fast_generate`、`discuss_first` 或 `edit_existing`；再判斷 art-only / storyboard-on。
2. Parse intent：確認圖片用途、主要受眾、媒介、比例、是否有參考素材與不可違反條件。
3. Build Visual Spec：依 prompt-architecture.md 建立 confirmed / inferred / unknown 狀態；P0/P1 不得被後層覆蓋。
4. Resolve identity：有參考人物／角色時建立 immutable identity anchors；style、服裝、場景與 archetype 只能做 transformation，不得重造角色。
5. 若為 edit_existing：建立 Edit Spec，先鎖定 preserve / modify / defect / unknown，再決定直接局部修改或先確認。
6. Direct visual design：決定主體層級、構圖、鏡頭、空間關係、場景、材質、光線、色彩與必要文字。
7. Structural pass：手部、肢體、多人互動、持物、框體穿越或其他高複雜結構時，依 structural-prompts.md 補 geometry / topology / occlusion / contact 約束。此層為 experimental strategy，不宣稱固定成功率。
8. Resolve recipe：有明確風格或與 recipes 高度匹配時讀 style-recipes.md；只套用視覺語法，不把 recipe 內容當不可變模板。
9. Compile prompt：依 Purpose → Hard Constraints → Identity → Subject → Action → Structural/Spatial → Composition/Camera → Scene → Style → Material/Lighting/Palette → Optional Enhancement → Preserve/Avoid 的順序組裝。
10. Generate / Edit：依 execution profile 執行；使用者只要 Prompt 時不得產圖。只有當次平台具備圖片生成／修改能力且使用者要求時才執行。
11. Visual QA：檢查 identity、數量、anatomy、hand topology、spatial relation、composition、style、文字與 hard constraints。
12. Repair loop：若失敗，先診斷 defect code，只修失敗維度；禁止因局部錯誤任意改寫整體 identity、構圖或風格。達成條件或無安全可驗證改進路徑時停止。
13. storyboard-on：讀 storyboard-prompts.md，建立 8 個連續鏡頭；每格需有景別、鏡頭運動、動作、場景變化、敘事目的、銜接點，並檢查角色、光源、左右方向與空間軸線連續。

## Defect Taxonomy
- IDENTITY_DRIFT
- ANATOMY_ERROR
- HAND_TOPOLOGY_ERROR
- OBJECT_COUNT_ERROR
- SPATIAL_RELATION_ERROR
- COMPOSITION_MISS
- STYLE_DRIFT
- TEXT_ERROR
- CONSTRAINT_LOSS

## Human Gate
- fast_generate 的低歧義一般生圖：不因 Prompt 優化本身強制 Gate。
- discuss_first：Prompt 確認是互動流程，不等同治理 Human Gate。
- edit_existing：只有修改存在實質歧義時才做使用者確認；明確局部修改可直接執行。
- 對外正式發布、學生個資、未成年人敏感呈現或其他 Project human_gate 類別：依治理規則 Gate。
- production Skill／Registry 修改：由 cloud-skill-builder 在候選驗證後另行提出 Gate。

## Verification
art-only：
- hard constraints 全部保留。
- 有 reference 時 identity 未被 style/archetype 覆蓋。
- Prompt 不含與使用者目標衝突的全域品質咒語。
- 高複雜結構已進行 structural pass 或明確標記不需要。
- 生成後檢查 defect taxonomy；修正時只改受影響維度。

edit_existing：
- target 是 conversation 中實際可用的圖片；若沒有可用圖片，不得假裝能編輯。
- preserve / modify 邊界已辨識。
- 未被要求修改且已通過的主要元素保持不變。
- 若先確認，實際修改與確認內容一致。
- 局部 defect 只做局部 repair。

storyboard-on：
- 八格為同一連續事件。
- identity、服裝、道具、光線、screen direction、spatial continuity 一致。
- 鏡頭變化服務敘事；最後一格形成可交接狀態。

## Failure Behavior
- 關鍵參考素材或既有圖片不可讀：SOURCE_UNAVAILABLE。
- 使用者要求編輯但 conversation 中沒有可用圖片：要求使用者上傳或指出圖片，不宣稱已修改。
- 圖片生成／修改能力不可用：只交付 Prompt / Edit Spec，不宣稱已產圖或修改。
- identity / hard constraints 互相衝突且無法裁決：SOURCE_CONFLICT 或詢問使用者。
- Visual QA 無法可靠確認：保留 UNKNOWN，不宣稱通過。

## Runtime Boundary
Runtime：ChatGPT Web / Gemini Spark；本 Skill 以 ChatGPT Web 生圖與圖片修改為主要 execution target。不得假設 shell、Git CLI、Node.js、daemon、外部 API、.env 或本機服務。只有工具實際成功後才能宣稱已產圖、修改圖片或已寫入。

## Provenance
- Production extension approved at Human Gate on 2026-08-12.
- Base: existing Cloud `visual-art-storyboard` plus existing `storyboard-prompts.md`.
- Added in v2: Prompt Architecture, identity priority, SVG-inspired structural prompting, Style Recipes, Visual QA / local repair loop.
- Added in v2.1: fast_generate / discuss_first / edit_existing interaction routing and edit preserve/modify analysis.
- Structural prompting remains experimental; no fixed success-rate claim is encoded.
