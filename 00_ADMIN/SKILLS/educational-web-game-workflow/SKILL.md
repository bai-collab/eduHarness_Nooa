---
name: educational-web-game-workflow
description: Orchestrate a complete Web educational-game workflow from supplied material and learning goals through game specification, traceable assets, DOM-first implementation contracts, optional Three.js pilots, and evidence-gated verification.
---
# 教育 Web 教學遊戲工作流

## 定位
把教材轉成可學習、可操作、可降級、可驗證的 Web 教學遊戲工作流。先固定學習目標與 DOM-only 任務，再決定 2D 或可關閉的 Three.js 視覺層。AI 生成的圖片、模型與程式碼都只是候選產物；規格完成、資產生成、導入或部署都不等於遊戲已完成。

## 路由
1. 缺教材、學習目標或 Web 分支 → `intake-only`，只輸出教師 intake、缺件與空白契約。
2. 只有教材轉遊戲規格（含 physical／both） → `material-to-quest-game`。
3. 已有 Web 遊戲，只評估／加入 Three.js → `quest-threejs-adoption`。
4. 單張參考圖要求可旋轉 Three.js 展示頁 → `image-to-3d-scene`。
5. 只有角色、場景或分鏡 → `visual-art-storyboard`。
6. 從教材＋學習目標開始，要求 Web 規格、資產、實作與驗證串接 → 本 Workflow 編排。

## 必要輸入
教材與來源、學習目標、年段與先備能力、Web 分支、場域、目標裝置／瀏覽器／網路、評量方式、可及性、資產政策、可用時間與停止條件。

## Cloud workflow
### Gate 0：教師 Intake
不得用 synthetic fixture 補真實課程事實。關鍵資料不足時停在 `intake-only`。

### Gate 1：學習與遊戲規格
使用 `material-to-quest-game` 建立 material concept map、learning mechanic matrix、game design spec、level map、question/feedback bank、asset spec、accessibility/safety review、playtest plan、teacher guide。每題需有答案、理由、提示、錯誤回饋與補救路徑。

### Gate 2：2D／3D 必要性
- 關卡入口、背景、寶箱、粒子、天氣等美術層：依動機、成本、裝置與可及性決定。
- 只有旋轉、剖面、拆解、遮蔽或空間關係不可被 2D 充分表達時，才啟動 `quest-threejs-adoption` 的單一 3D 教學物件 Pilot。
- 文字、公式、平面圖、時間軸、表單或 2D 拖曳足夠時，維持 DOM／SVG／Canvas。

### Gate 3：資產管線
建立 asset ledger，對每個候選資產記錄來源、授權、取得日期、版本／hash、用途、fallback。外部 2D／3D 來源只能作候選；未逐件確認授權不得宣稱可正式使用。未知遠端模型、未驗證 CDN、未授權輸入影像不得直接接入。

### Gate 4：DOM-first 實作契約
Quest State 是答案、得分、進度與完成狀態的唯一真相。Three.js Art Island 只能接收唯讀 state snapshot 並送出語意事件，不能以 Mesh、Object3D、動畫或 WebGL 狀態推進學習進度。

必要事件欄位：`contractVersion`、`eventId`、`sceneInstanceId`、`questRevision`、`correlationId`、`type`、`payload`。`animation.completed` 不得直接控制關卡。

若採固定單頁介面，必須預先定義 viewport／overflow 契約：頁面本身不得意外產生 body 捲軸；會超出的內容區使用內部 `overflow-y: auto|scroll`；控制列不得被裁切。

### Gate 5：驗證矩陣
每個 UI／互動需求都維持：Requirement ID、DOM/程式預期、DOM 驗證、視覺／操作驗證、viewport、evidence、status。

狀態只允許：`PENDING → DOM_PASS → CUA_PASS`。如果當次 runtime 沒有 DOM evaluate、瀏覽器操作或 CUA 能力，對應驗證標 `BLOCKED`／`DEFERRED`，不能跳級或用截圖／文字敘述代替缺失證據。

### Gate 6：平衡參數與變更預覽
遊戲平衡參數集中管理；每次調參記錄舊值、新值、預期影響、驗證證據與 rollback 值。

若要建立程式、導入資產、安裝套件或修改既有專案，先產 implementation preview：來源／目的地、預計修改、依賴、覆寫行為、風險、rollback、drift recheck。只有使用者核准且當次工具支援時才執行實際變更。

### Gate 7：教師 Pilot
真實 Pilot 驗證涵蓋：學習完成率／時間／錯誤類型／迷思／教師觀察、功能與狀態恢復、可及性、視覺、效能、安全與授權。只有直接證據齊全才使用 `pilot-evidence-ready`。

## Output states
- `intake-only`
- `spec-ready`
- `implementation-preview`
- `experimental-blocked`
- `pilot-evidence-ready`
- `stopped`

## Stopping rules
- DOM 元素、事件、學習狀態、數值或公式不符合規格 → 停止，不進視覺 PASS。
- 固定單頁出現意外 body 捲軸、內部 overflow 缺失或控制列被遮蔽 → 停止。
- 視覺／操作驗證沒有直接工具證據 → 不得標 CUA_PASS。
- 調參沒有對應測試／證據／rollback → 不得標完成。
- 資產授權、來源或外部 runtime 未確認 → 保持 blocked/deferred。
- 不把 synthetic fixture、規格、資產生成、部署或教師成效推論誤報為真實完成。

## Verification
逐項確認：學習目標對齊、DOM-only 可完成任務、Three.js 可關閉、scene event 契約、可及性 fallback、資產可追溯、平衡參數集中、變更有 rollback、所有 PASS 狀態都有直接證據。

## Cloud runtime boundary
- 不假設 shell、Node.js、npm、Git CLI、本機 server、瀏覽器 evaluate、CUA、WebGL profiler、真實裝置或 background runtime 一定存在。
- 上游 `assets/`、`references/`、schema 與 fixture 為功能設計來源；Cloud 版不把這些 Code Edition 路徑視為已安裝依賴。需要模板時依本 Skill 的 output contract 產生等價 Cloud 內容。
- 若當次 runtime 能執行程式／瀏覽器／視覺驗證，依直接工具結果升級狀態；否則保持 `spec-ready`、`implementation-preview` 或 `DEFERRED`。
- 只有工具實際成功後，才能宣稱建立、修改、儲存、導入、部署或驗證完成。
- 不保存 secrets、tokens、credentials、private keys 或學生個資。

## Upstream metadata
- repository: `https://github.com/bai-collab/eduHarness-.git`
- branch: `main`
- snapshot_commit: `11246662c0ecbf6ac861d66f6c5c7132ad90d674`
- path: `brain/skills/educational-web-game-workflow/SKILL.md`
- source_blob_sha: `2ac1233a00a9e180dc58dc1fed5ea3e77c05a3a0`
- canonical_sha256: `07D346E34A79DA6226C77F192B44678A8B50F874BE9E0E0CBF43BEA8C54A078A`
- upstream_version: `1`
- cloud_port_mode: `functional-adaptation`
