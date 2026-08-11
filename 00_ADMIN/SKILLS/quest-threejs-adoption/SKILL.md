---
name: quest-threejs-adoption
description: Guide progressive Three.js adoption in a Web educational quest while keeping learning state and accessible operation in DOM; use small, evidence-gated 3D pilots with fallback rather than making 3D the learning-state authority.
---
# 闖關遊戲 Three.js 導入

## 定位
協助教師或開發者只在「空間理解確實需要 3D」時，把小型 Three.js Pilot 加入 Web 闖關遊戲。Quest State 與 DOM 永遠承擔題目、得分、進度與等價操作；Three.js 只作可關閉的 3D 美術／互動層。本 Workflow 是規格與驗證流程，不代表已通過真實課堂 Pilot。

## 路由
1. 沒有教材或案例 → `intake-only`，不得猜教材、年段或學習目標。
2. 只有教材、尚無闖關規格 → 路由 `material-to-quest-game` 建立 `web` 分支。
3. 已有 Web 闖關規格 → 判斷 3D 是美術層或學習物件層。
4. 單張參考圖要求 Three.js 展示頁 → `image-to-3d-scene`。
5. 要建立程式、安裝套件、導入資產或部署 → 先產 implementation preview；需要實際寫入或付費／外部服務時依工具與 Human Gate 執行。

## 必要輸入
教材／案例、學習目標、年段、Web 分支、Pilot 物件、目標裝置與瀏覽器、網路條件、可及性、評量方式、資產政策、可用時間與停止條件。

## Cloud workflow
### Gate 0：教師 Intake
缺少會改變教學設計的資料時，只輸出 intake 與缺件報告。

### Gate 1：DOM-only baseline
即使 WebGL 關閉、裝置過慢、3D 載入失敗或教師停用 3D，學生仍須可完成同一學習任務。每個 3D hotspot 都要有鍵盤、觸控、螢幕閱讀器與 DOM 等價操作。

### Gate 2：3D 必要性
- 遊戲美術層（入口、地圖、寶箱、Boss、粒子、天氣）：預設 2D／DOM；只以動機、成本、可及性與效能決定。
- 學習物件層：只有 2D 會遺失深度、遮蔽、內部構造或空間關係時才進 3D Pilot。
- 第一個 Pilot 限一題、一個物件、3–5 熱點與必要的旋轉／縮放／剖面／拆解；不做完整 3D 世界、物理、自由探索、敵人 AI、多人或編輯器。

### Gate 3：契約
至少建立：`teacher-intake.md`、`quest-3d-use-case.md`、`scene-art-spec.md`、`scene-event-contract.md`、`asset-ledger.md`、`performance-budget.md`、`pilot-acceptance-checklist.md`、`pilot-budget-and-kill-switch.md`。

Scene Event 至少包含 `contractVersion`、`eventId`、`sceneInstanceId`、`questRevision`、`correlationId`、`type`、`payload`。`animation.completed` 只能表示視覺動畫完成，不得直接推進關卡。

### Gate 4：驗證與停止
比較 DOM-only 與 3D 版：任務完成率、完成時間、錯誤／迷思、教師觀察、學生不適、可及性與效能。若沒有可觀察的學習增益、兩輪仍難辨識、造成不適或超過 Pilot 預算，回退 DOM／SVG。

只有當次 runtime 真的能取得瀏覽器／裝置證據時，才可標記 DOM/CUA/效能實測結果；否則相關欄位標 `DEFERRED`，不得把規格推論當實測。

### Gate 5：延後擴張
第一個 Pilot 通過後，第二個不同類型 Pilot 才評估 3D 關卡地圖；至少兩個不同類型 Pilot 有直接證據通過後，才評估共用 Adapter、編輯器或成熟化。

## 資產／授權／安全
- 第一個 Pilot 優先使用自製或直接驗證授權的資產。
- 聚合站僅作線索；ledger 保留原作者／原始來源、授權、取得日期與 hash。
- 未授權影像不得轉衍生 3D 資產。
- `prefers-reduced-motion`、三閃、動暈、文字對比、靜音、焦點順序與 context loss 必須納入設計。
- 不載入未知遠端模型，不收集或輸出學生個資。

## Output states
- `intake-only`
- `spec-ready`
- `implementation-preview`
- `pilot-evidence-ready`：僅限真實瀏覽器／裝置與教學比較證據齊全。
- `stopped`：觸發品質、成本、可及性、安全或學習停止條件。

## Verification
確認 DOM 是唯一學習狀態真相；3D 可完全關閉；每個 hotspot 有 DOM 等價路徑；事件契約不以動畫控制進度；Pilot 範圍受限；任何實測結論均有當次工具直接證據。

## Cloud runtime boundary
- 不假設 shell、Node.js、npm、localhost、Git CLI、瀏覽器自動化、CUA、WebGL profiler 或真實裝置一定可用。
- 若當次工具可執行程式、瀏覽器或視覺驗證，依工具結果驗證；否則只交付規格／預覽並標 `DEFERRED`。
- 只有工具實際成功後才能宣稱建立、部署、載入、測試或驗證完成。

## Upstream metadata
- repository: `https://github.com/bai-collab/eduHarness-.git`
- branch: `main`
- snapshot_commit: `11246662c0ecbf6ac861d66f6c5c7132ad90d674`
- path: `brain/skills/quest-threejs-adoption/SKILL.md`
- source_blob_sha: `9c1a796078606368d4be17a5906528534f653b75`
- canonical_sha256: `1A4A22E33BCF31079F31867E0A0A5609F085EA5DD2DA08719724DCC4F2C4933C`
- upstream_version: `1`
- cloud_port_mode: `functional-adaptation`
