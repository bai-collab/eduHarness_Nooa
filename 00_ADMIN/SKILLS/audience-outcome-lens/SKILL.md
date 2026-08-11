---
name: audience-outcome-lens
description: Use a lightweight audience-and-outcome frame before people-facing work when who receives, uses, decides, or is affected by the result could materially change what should be emphasized, omitted, sequenced, explained, or recommended.
---
# 受眾成果校準

## 定位
這是一個輕量的前置判斷 Lens，不是完整的受眾分析交付物，也不取代領域 Skill。當任務的 usefulness 會因受眾、情境或預期改變而不同時使用；對客觀、受眾無關的精確轉換、計算、查核或技術檢查不啟用。

## 必要判斷
在執行前只推定與任務真正相關的資訊：
- 主要接收者或使用者是誰？
- 還有哪些受影響者或決策者？
- 他們目前處境是什麼？
- 有效結果應讓什麼產生改變？
- 哪些證據、限制或既有決策會約束工作？
- 哪些未知資訊若不同，會實質改變結果？

把上述 frame 視為暫定假設。明確區分使用者提供的事實、工具觀察與模型推論；不得以刻板印象補完受眾特徵。

## Cloud workflow
1. 判斷任務是否真的受受眾／成果影響；若否，維持原任務的客觀驗收標準。
2. 形成最小 provisional frame，只保留會改變輸出的資訊。
3. 接收者、使用者、決策者與受影響者需求若不同，分開處理，不強行合成單一 persona。
4. 只有未解資訊會導致多個實質不同且都合理的方向、且無法安全推定或查證時才詢問使用者。
5. 將 frame 傳給實際執行的領域／格式 Skill；不得用本 Lens 取代主要工作流。
6. 完成前檢查：結果是否適合受眾情境、是否支持預期改變、是否掩蓋利害衝突、是否依賴未支持假設、是否超出範圍。

## Output contract
預設不額外輸出 worksheet；直接完成原任務。只有 frame 會影響重大選擇或需要使用者裁決時，才簡短揭露相關假設、衝突或未知。

## Stopping / Human Gate
- 不因追求預期成果而犧牲正確性、證據、安全或非操弄原則。
- 不得 cherry-pick 證據或創造成效指標來支持偏好結果。
- 若使用者回饋或新證據推翻 provisional frame，更新 frame 並修正輸出。

## Verification
確認：受眾資訊是否真的影響任務；關鍵假設是否有來源；不同角色的需求是否被錯誤合併；客觀技術工作是否仍維持原驗收標準。

## Cloud runtime boundary
- Runtime：ChatGPT Web / Gemini Spark；實際能力依當次可用工具與 Connected Apps。
- 本 Skill 不要求 shell、Git CLI、本機檔案系統、background daemon 或 provider-specific runtime。
- 需要外部資料時依當次可用來源查證；無法取得時保留未知，不自行補完。

## Upstream metadata
- repository: `https://github.com/bai-collab/eduHarness-.git`
- branch: `main`
- snapshot_commit: `11246662c0ecbf6ac861d66f6c5c7132ad90d674`
- path: `brain/skills/audience-outcome-lens/SKILL.md`
- source_blob_sha: `b1c063f577151e94b41f7e6d96f321487d8a086e`
- canonical_sha256: `77821C9F818442C6C1D38AD4EDDF3698D7F1C5C8319A6444F9526F3CFD905FA2`
- upstream_version: `0.1.0`
- cloud_port_mode: `functional-adaptation`
