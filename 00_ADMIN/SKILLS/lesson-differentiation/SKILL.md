---
name: lesson-differentiation
description: Differentiate an existing lesson into supported tiers while preserving the core learning objective, task, assessment, and standard.
---
# 教案差異化教學

## 定位
以既有教案或明確 lesson source 為基礎設計分層支持、補救與延伸；不重新發明核心目標，不降低核心標準。

## Trigger / anti-trigger
- 觸發：教案差異化、分層教學、補救／延伸、lesson differentiation。
- 沒有來源 lesson → 路由 `lesson-plan-authoring` 或只列缺件。

## 必要輸入
來源 lesson、科目、核心目標與評量、學習者差異／先備、分層數量、時間／設備、語言／可及性需求、補救與延伸限制。

## Cloud workflow
1. 鎖定來源 lesson 的核心目標、任務、評量與不可降低標準。
2. 建立 learner profile 與 differentiation matrix。
3. 建立 concept-risk-register，分開記錄迷思概念與易錯概念；每項附 evidence、教學回應與 look-for。
4. 明示鷹架理論、各 tier 支援與撤除條件。
5. below tier 只能增加支援，不得降低標準。
6. 以 checklist 驗證目標、活動、語言、可及性、迷思／易錯回應、鷹架撤除與評量映射。

## Output contract
`source-lesson-summary.md`、`learner-profile.md`、`differentiation-matrix.md`、`subject-misconception-analysis.md`、`error-prone-concept-analysis.md`、`scaffolding-theory-rationale.md`、`tier-support-plan.md`、`remediation-plan.md`、`extension-plan.md`、`assessment-alignment.md`、`artifact-alignment-report.md`、`teacher-implementation-notes.md`、review brief。

## Stopping / Human Gate
- 無來源 lesson、核心目標或評量 → 只輸出缺件報告。
- 迷思／易錯／鷹架缺來源 → 待確認或 deferred，不寫成定論。
- 方案會改變核心標準、評量公平性、資格判定或涉及學生個資 → 教師／使用者審查 Gate。

## Verification
逐 tier 檢查核心目標相同、支援差異有理由、評量仍對齊、證據狀態清楚。

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
- path: `brain/skills/lesson-differentiation/SKILL.md`
- source_blob_sha: `5bbf91b3502103951ab86eeed3a57bfa40a31901`
- canonical_sha256: `5CA78FA8A2B26FACA7D2B5CF8B567B4C107B11D0FB795C44B868B48F76C4D645`
- upstream_version: `1`
- cloud_port_mode: `functional-adaptation`
