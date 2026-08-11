---
name: material-to-quest-game
description: Convert supplied educational material into physical, web, or dual-branch quest-game specifications with learning mechanics, levels, feedback, assets, accessibility, safety, and playtest contracts.
---
# 教材轉闖關遊戲

## 定位
把教材與學習目標轉為可試玩的實體／Web 闖關遊戲規格；完成規格不等於完成程式、素材、部署或產圖。

## 必要輸入
教材／來源、學段與年齡、學習目標、分支 `physical` / `web` / `both`、場域／設備、時間、玩家人數、可及性、評量方式、資產限制。

## Cloud workflow
1. 建立 material concept map 與 learning-mechanic matrix。
2. 設計 game-design spec、level map、題目／回饋 bank、教師引導。
3. physical：材料、印製、教室配置、年齡安全與備援玩法。
4. web：DOM／Canvas 分工、可及性、資料狀態、斷網與低效能 fallback；只有使用者另要求實作且 runtime 支援時才進入程式產出。
5. 建立 asset spec 與 playtest plan；外部 library 只作候選，不因名稱存在就宣稱已安裝。
6. 若有具名角色、重複場景、連續動作、Boss／鏡頭事件，可依 Registry 建議 `visual-art-storyboard`；不自動啟用。

## Output contract
`material-concept-map.md`、`learning-mechanic-matrix.md`、`game-design-spec.md`、`level-map.md`、`question-and-feedback-bank.md`、`asset-spec.md`、`accessibility-and-safety-review.md`、`playtest-plan.md`、`teacher-guide.md`、分支 prototype spec。

## Stopping / Human Gate
- 未指定分支、教材或目標 → 只輸出缺件。
- 實體活動有尖銳物、小零件、移動／競賽風險 → 年齡／安全 Gate。
- Web runtime、外部 API、部署未核准 → 只產規格，不誤報完成。

## Verification
每一關都需對應學習目標；檢查規則可玩性、回饋、可及性、安全、資料／斷網 fallback 與評量方式。

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
- path: `brain/skills/material-to-quest-game/SKILL.md`
- source_blob_sha: `5e44e0a927aa577d2822ebcb5a7f0623833d0192`
- canonical_sha256: `D34E208A22A8BEE938CE00E0EBE6E1BDF2EF3084EB9C171DFE38E6EBBD46DD12`
- upstream_version: `2`
- cloud_port_mode: `functional-adaptation`
