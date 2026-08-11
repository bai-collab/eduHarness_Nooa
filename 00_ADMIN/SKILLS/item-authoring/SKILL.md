---
name: item-authoring
description: Create and review assessment-item drafts with indicator, source, coverage, item type, answer, rationale, difficulty, and human-review contracts.
---
# 試題命題

## 定位
將使用者提供的課綱、教材或已核准來源轉為可審查題目規格；只產生草稿與證據清單，不宣稱已通過正式審查。

## 必要輸入
學段、科目、來源、題數、題型、學習指標範圍、難度、答案格式、語言、人工審查需求；來源標記 `user-supplied` / `official` / `reference` / `unknown`。

## Cloud workflow
1. 建立 intake 與 source ledger，記錄 URI／檔名、日期、版本、授權、證據狀態。
2. 對齊指標、認知層次、題型、答案、干擾項、解析、難度；標記重複與矛盾題。
3. 建立 coverage matrix、item blueprint、item-bank draft，每題保留來源定位與人工覆核欄位。
4. 逐欄檢查完整性與 coverage；若當次 runtime 有獨立審查者能力，可做 second-pass review，否則明示未執行獨立 reviewer。

## Output contract
`intake-gap.md`、`indicator-checklist.md`、`source-ledger.md`、`coverage-matrix.md`、`item-blueprint.md`、`item-bank-draft.md`、`review-report.md`、`human-review-brief.md`。

## Stopping / Human Gate
- 缺學段、科目、來源或指標 → 不正式命題，只列缺件。
- 無官方證據 → 不把模型／工作坊建議標為官方規範。
- 學生個資、未授權題庫、外部發布、正式評量 → 使用者核准。

## Verification
檢查題數、題型、指標 coverage、答案唯一性／合理性、解析、來源追溯、難度分布與人工審查欄位。

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
- path: `brain/skills/item-authoring/SKILL.md`
- source_blob_sha: `20d215bc0e08e5ea09b6a3d7059c80d9455b0320`
- canonical_sha256: `64D0E59E5A248924E05A5CDE7FC6D451026C12EB67EFF9D315E77B87D5901EF6`
- upstream_version: `1`
- cloud_port_mode: `functional-adaptation`
