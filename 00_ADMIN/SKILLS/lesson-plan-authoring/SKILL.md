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

## Cloud workflow
1. 建立 context brief 與來源／版本 ledger。
2. 將目標轉為可觀察表現，建立 objective–activity–assessment matrix。
3. 設計 universal access、分層支援、補救／延伸；迷思、易錯概念與鷹架若無證據則標記待確認。
4. 設計形成性／總結性評量、規準、成功條件與可及性調整；支援不得降低核心標準。
5. 建立 lesson flow、教材資源、教師／學生操作步驟。
6. 以顯式 checklist 驗證目標—活動—差異化—評量、證據與過度主張；若 runtime 有獨立 reviewer 能力，可加做第二視角審查，但不得假裝存在 `verifier` agent。

## Output contract
`context-brief.md`、`standards-alignment.md`、`objective-activity-assessment-matrix.md`、`differentiation-plan.md`、`assessment-design.md`、`assessment-rubric.md`、`differentiation-assessment-alignment.md`、`lesson-flow.md`、`materials-and-resources.md`、`lesson-plan-draft.md`、`review-report.md`、下一步核准清單。

## Stopping / Human Gate
- 缺來源、目標、學習者差異或評量目的／方式 → 只輸出 `intake-gap.md`。
- 無證據的學科迷思／教學定論 → 待確認，不猜測。
- 差異化後評量無法對應核心目標／公平性 → 阻擋交付。
- 學生個資、正式送件、外部發布、付費工具 → 先取得使用者核准。

## Verification
確認必要輸入完整、每個目標有活動與評量對應、支援未降低標準、所有外部事實可追溯、未知格式未被升級為官方格式。

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
