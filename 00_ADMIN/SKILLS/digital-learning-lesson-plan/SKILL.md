---
name: digital-learning-lesson-plan
description: Prepare Taiwan digital-learning lesson-plan drafts with a selected submission profile, platform evidence, teacher-student operation matrix, learning evidence, privacy disclosure, and fallback; never treat an old or unspecified annual template as current fact.
---
# 數位學習精進教案

## 定位
把教案內容轉成可追溯的數位學習教學方案草稿。未指定其他 profile 時，使用本 Skill 的 `assets/moe-digital-teaching-plan-format.md` 作為穩定基準骨架；它不是特定年度地方徵件保證。

## 必要輸入
既有教案或課程脈絡、學段／科目／節數、目標、數位平台、教師／學生操作、設備／網路、評量與學習證據、profile 來源與日期、隱私／AI 揭露需求。

## Cloud workflow
1. 建立 `submission-profile.md` 與 `platform-evidence-ledger.md`；未指定 profile 時綁定附屬模板。
2. 建立 `digital-strategy-map.md`、`teacher-student-operation-matrix.md`、`learning-evidence-plan.md`。
3. 對齊目標、活動、平台操作、評量、斷網／低設備 fallback 與教師審查。
4. 產生 generic 或 profile-specific draft；年度／平台證據不足時標記 pending。
5. 需要完整新教案內容時，可依 Registry 路由 `lesson-plan-authoring`。

## Output contract
沿用教案對齊輸出，另含 `submission-profile.md`、`platform-evidence-ledger.md`、`digital-strategy-map.md`、`teacher-student-operation-matrix.md`、`learning-evidence-plan.md`、`privacy-ai-disclosure.md`、格式差異報告。

## Stopping / Human Gate
- 未確認指定年度／地方 profile → 不宣稱符合當年度徵件。
- 平台功能、版本、個資或 AI 使用缺證據 → 待確認。
- 正式送件、外部上傳、學生個資處理 → 使用者核准。
- provider／bridge 不可用 → deferred，不假造平台結果。

## Verification
檢查 profile 來源／日期、平台證據、目標—活動—數位操作—評量對齊、privacy disclosure 與 fallback 是否完整。

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
- path: `brain/skills/digital-learning-lesson-plan/SKILL.md`
- source_blob_sha: `2c51291b6c587b7d795ab733ecb3ba4a53fcb411`
- canonical_sha256: `686A56CA7D68E3CA5F379A9DB305D545FF1E7B7B9AAC94B7D3A1845EACCDBA31`
- upstream_version: `1`
- cloud_port_mode: `functional-adaptation`
