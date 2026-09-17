---
name: lesson-plan-authoring
description: Author Taiwan-context lesson plans from supplied curriculum, learner, time, technology, assessment, and source constraints; align objectives, activities, differentiation, and assessment without inventing missing official requirements.
---
# 教案撰寫

## 定位
把已提供或已核准的課程脈絡轉成「目標—活動—差異化—評量」對齊的教案草稿。可採使用者提供或已確認的官方模板；未確認年度／地方格式時只產生 generic draft，不冒充正式格式。

## Trigger / anti-trigger
- 觸發：教案撰寫、lesson plan、教學活動設計、教案草稿。
- 已有教案要分層支持 → 路由 `lesson-differentiation`。
- 題庫命題 → `item-authoring`；教材轉遊戲 → `material-to-quest-game`。

## 必要輸入
學段／年級、科目、節數、先備知識、教材範圍、核心素養／學習目標、設備、學習者差異、評量目的與方式、交付格式、來源。

## 課綱知識庫來源與載入契約

### 正式知識庫來源
教案中的「學習表現、學習內容、學習目標」需優先依 eduHarness Cloud Knowledge Base 中的課綱資料建立。

- 索引：`10_KNOWLEDGE_BASE/課綱_各領域/README_課綱索引.md`
- 總綱：`10_KNOWLEDGE_BASE/課綱_各領域/00_總綱.md`
- 國語文：`10_KNOWLEDGE_BASE/課綱_各領域/01_國語文.md`
- 數學：`10_KNOWLEDGE_BASE/課綱_各領域/02_數學.md`
- 社會：`10_KNOWLEDGE_BASE/課綱_各領域/03_社會.md`
- 自然科學：`10_KNOWLEDGE_BASE/課綱_各領域/04_自然科學.md`
- 生活課程：`10_KNOWLEDGE_BASE/課綱_各領域/05_生活課程.md`
- 綜合活動：`10_KNOWLEDGE_BASE/課綱_各領域/06_綜合活動.md`
- 健康與體育：`10_KNOWLEDGE_BASE/課綱_各領域/07_健康與體育.md`
- 國小科技／資訊教育參考：`10_KNOWLEDGE_BASE/課綱_各領域/08A_國小科技與資訊教育參考.md`
- 國中／高中科技領域：`10_KNOWLEDGE_BASE/課綱_各領域/08B_國中科技領域.md`
- 藝術：`10_KNOWLEDGE_BASE/課綱_各領域/09_藝術.md`

`10_KNOWLEDGE_BASE/課綱_完整Markdown.md` 僅作完整來源追溯／跨領域查核用途；一般教案撰寫不得預設全文載入。

### 按需載入規則
1. 先依「領域／科目＋教育階段／學習階段＋年級＋教材主題」選定對應領域 MD。
2. 在該領域 MD 內檢索並實際讀取與本課相關的核心素養、學習表現、學習內容及必要前後文。
3. 只有跨領域、總綱核心素養、議題融入或來源衝突時，才加載第二領域或 `00_總綱.md`。
4. 不得只憑單一搜尋片段直接定案；需讀足以確認「代碼—文字—學習階段—主題」關係的上下文。
5. 若課綱來源找不到、內容不足、版本不明或無法可靠對應，標記 `⏳ 待確認`，不得用模型常識補成課綱內容。

### 學習表現
- 必須以對應領域課綱中可追溯的「學習表現」為主要來源。
- 有代碼時保留代碼與原文；不得自行改寫後仍標示為課綱原文。
- 若教案只取其中部分意涵，需區分「課綱原文」與「本課聚焦」。

### 學習內容
- 必須以對應領域課綱中可追溯的「學習內容」為主要來源。
- 有代碼時保留代碼與原文；需核對其適用學習階段與本課主題。
- 教材內容可以補充課綱，但不得反向冒充為課綱學習內容。

### 學習目標
- 學習目標是**教案層級的轉化結果**，不是預設視為課綱原文。
- 需由已確認的「學習表現＋學習內容＋本課情境／任務」轉化成可觀察、可評量的敘述。
- 每一個學習目標至少能回溯到一項已確認的學習表現或學習內容；必要時建立對照矩陣。
- 不得把模型自行生成的目標標成官方課綱代碼或官方原文。

### 來源標示
在 `standards-alignment.md` 或等價輸出中，至少保留：領域、學習階段、來源檔案、學習表現代碼／原文、學習內容代碼／原文、由其轉化出的本課學習目標。

## AI 素養知識庫來源與載入契約

### Canonical Knowledge 來源
當教案本身涉及 AI 素養、人工智慧素養、生成式 AI、人機協作、AI 倫理、提示詞／Prompt、AI 學習夥伴、幻覺、偏見、深偽、個資／隱私、學術誠信、AI 賦能學習、AI 系統設計，或學生實際使用 AI 進行學習與產出時，必須先讀：

- 索引：`10_KNOWLEDGE_BASE/AI素養/README_AI素養知識庫.md`

再依索引按需載入必要子檔，不得預設整包全文載入：

- `01_臺灣AI素養框架_教案速查.md`：教師／學生 AI 素養四面向與三層級。
- `02_數位教學指引3.0_生成式AI教學實務.md`：生成式 AI 教學、風險、評量與使用規範。
- `03_國小生聰明用AI_教學重點.md`：國小三至六年級的年齡合宜活動與 AI 公民實務。
- `04_AI素養教案設計對照表.md`：AI 素養目標—活動—評量—倫理的教案轉譯。
- `05_來源索引與版本注意.md`：來源、頁碼、版本差異與衝突查核。

### 啟動判定
1. 以使用者需求、教材、學習目標、課程活動或評量中**已確認存在的 AI 相關學習內容**為啟動依據。
2. 模型或教師單純使用 AI 協助備課，不代表學生課程必然涉及 AI 素養；若 AI 只作教師端工作工具且不進入學生學習內容、活動、評量或規範，可不啟動本契約。
3. 一旦學生要操作 AI、分析 AI 生成內容、使用 AI 協作產出，或課程明確要求 AI 素養／AI 倫理／查證／提示詞／人機協作等目標，即啟動本契約。
4. 啟動後先讀 README 索引，再只讀與當次教案相關的子檔；若來源不足或版本衝突，依索引與 `05_來源索引與版本注意.md` 回到較完整／較新的正式來源查核，不得自行補完。

### 年段與來源優先
- 國小三至六年級：先用 `01` 定位 AI 素養面向／層級，再用 `03` 做年齡合宜轉譯，必要時以 `02` 補風險、查證、評量與規範，最後用 `04` 做教案對照。
- 國中／高中：以 `01` 為主要 AI 素養依據，`02` 補教學實施、風險與評量；`03` 僅可作基礎概念或活動靈感，不可直接當作國高中學習要求。
- 教師 AI 素養或教師增能內容：優先以 `01` 教師框架為依據，再用 `02` 轉化為備課、教學、評量與規範實務。
- AI 素養面向／層級名稱以 2026《臺灣中小學教師與學生 AI 素養框架》完整版為主要依據；公版簡報僅供快速查閱，文字衝突時回到完整版。

### 教案整合最低要求
只要本契約啟動，教案至少明確處理下列適用項目：
- AI 素養面向／層級或本課聚焦能力，並區分官方框架語詞與本課轉化目標。
- AI 在活動中的角色，以及必須由學生／教師保留的問題設定、判斷、查證、決策與責任。
- AI 生成資訊的查證方式與可信來源；不得把 AI 輸出直接當成外部事實。
- 學生使用 AI 協作產出時的 AI 使用標記、學術誠信與過程證據要求。
- 個資、隱私、偏見、幻覺、深偽或其他與任務相關的風險與處理方式。
- 評量需保留學生理解、推理、修正或反思的可觀察證據，不得只以 AI 生成成品判定學習成果。

### 停止規則
- Canonical AI 素養索引或必要子檔無法讀取 → `⏳ SOURCE_UNAVAILABLE`，不得以模型常識冒充正式 AI 素養框架或教育部指引。
- 來源內容不支持某一 AI 素養面向、層級、規範或年段要求 → 標記 `⏳ 待確認`，不得自行具體化。
- 正式送件、學生個資、外部發布或付費 AI 工具仍依本 Skill 的 Human Gate 執行，不因載入 AI 素養知識而降低 Gate。

## Cloud workflow
1. 建立 context brief 與來源／版本 ledger；若需撰寫學習表現、學習內容或學習目標，先依「課綱知識庫來源與載入契約」解析並讀取對應領域課綱；同時檢查教案是否符合「AI 素養知識庫來源與載入契約」的啟動條件，若符合則先讀 AI 素養 README 索引並按需載入相關子檔。
2. 將目標轉為可觀察表現，建立 objective–activity–assessment matrix；AI 素養契約已啟動時，同步確認 AI 素養目標／活動／評量／倫理與風險之間可追溯。
3. 設計 universal access、分層支援、補救／延伸；迷思、易錯概念與鷹架若無證據則標記待確認。
4. 設計形成性／總結性評量、規準、成功條件與可及性調整；支援不得降低核心標準；學生使用 AI 時須保留可觀察的學生理解、推理、修正或反思證據。
5. 建立 lesson flow、教材資源、教師／學生操作步驟；AI 素養契約已啟動時，明列 AI 使用角色、查證、標記與風險處理。
6. 以顯式 checklist 驗證目標—活動—差異化—評量、證據與過度主張；若 runtime 有獨立 reviewer 能力，可加做第二視角審查，但不得假裝存在 `verifier` agent。

## Output contract
`context-brief.md`、`standards-alignment.md`、`objective-activity-assessment-matrix.md`、`differentiation-plan.md`、`assessment-design.md`、`assessment-rubric.md`、`differentiation-assessment-alignment.md`、`lesson-flow.md`、`materials-and-resources.md`、`lesson-plan-draft.md`、`review-report.md`、下一步核准清單。

## Stopping / Human Gate
- 缺來源、目標、學習者差異或評量目的／方式 → 只輸出 `intake-gap.md`。
- 無證據的學科迷思／教學定論 → 待確認，不猜測。
- 差異化後評量無法對應核心目標／公平性 → 阻擋交付。
- 學生個資、正式送件、外部發布、付費工具 → 先取得使用者核准。

## Verification
確認必要輸入完整、每個目標有活動與評量對應、支援未降低標準、所有外部事實可追溯、未知格式未被升級為官方格式。若教案符合 AI 素養載入條件，另確認：已讀 canonical AI 素養 README、只載入必要子檔、AI 素養面向／層級與教學主張可回溯來源、AI 角色與人類保留責任清楚、查證／標記／個資與風險規則已落入活動或評量、學生學習證據不被 AI 成品取代。

## Cloud runtime boundary

- Runtime：ChatGPT Web / Gemini Spark；實際能力以當次可用工具與 Connected Apps 為準。
- 不假設 shell、Git CLI、本機絕對路徑、Node.js、daemon、hooks、localhost server 或真實 while-loop。
- 文件／檔案內容使用當次平台可用的 Drive、上傳檔案或文件讀取工具；工具不可用時回報 `⏳ SOURCE_UNAVAILABLE`。
- 只有工具實際成功後，才能宣稱已建立、修改、儲存、上傳、部署或產圖。
- 不保存 secrets、tokens、credentials、private keys 或學生個資。

## Upstream metadata

- repository: `https://github.com/bai-collab/eduHarness-.git`
- branch: `main`
- snapshot_commit: `95234c8b0b6da75b34f0f032ef29272a0f194aa4`
- path: `brain/skills/lesson-plan-authoring/SKILL.md`
- source_blob_sha: `3e1e830dd2421dd8037b454a516cb8d2cdd4dc90`
- canonical_sha256: `31E7A2696873B0CF7EAB952912172CE27584D29F7F2A2912C0AD8A58D4FBDA7C`
- upstream_version: `1`
- cloud_port_mode: `functional-adaptation`
- canonical_extension: `AI literacy on-demand loading contract + 10_KNOWLEDGE_BASE/AI素養, 2026-09-17`
