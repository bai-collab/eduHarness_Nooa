---
name: conjecturing-five-stage
description: Convert supplied mathematics units into five-stage conjecturing lesson designs using 造例 → 提出猜想 → 效化 → 一般化 → 證實, with source-verified textbook facts, heterogeneous examples, counterexamples, worksheets, assessment criteria, and scaffolding controls.
---
# 臆測五階段

## 定位
把已提供的數學單元教材改寫成「造例 → 提出猜想 → 效化 → 一般化 → 證實」的臆測教學。學生先產出性質，再在一般化階段命名；不得先把目標定義當答案給學生。

## 觸發 / 反觸發
- 觸發：臆測五階段、臆測教學、臆測任務、把數學單元改成臆測、conjecturing teaching。
- 一般教案 → `lesson-plan-authoring`。
- 既有教案分層 → `lesson-differentiation`。
- 命題／題庫 → `item-authoring`。
- 教材轉遊戲 → 不使用本 Skill。

## 必要輸入
單元教材或原始來源、年級與科目、單元教學目標、建議節數、班級人數與組數、可用教具、學生先備狀況。缺教材、年級、節數或單元範圍時只輸出缺件清單。

## 五階段規格
| 階段 | 活動形式 | 核心工作 | 產出 |
|---|---|---|---|
| 造例 | 個人→小組 | 建立、檢驗、分類、彙整 | 小組工作單 |
| 提出猜想 | 個人→小組 | 提出、分享、支持／反駁、收斂 | 每組 1 條猜想 |
| 效化 | 全班 | 分享、檢驗、反例、修正、歸類 | 全班猜想 |
| 一般化 | 全班 | 推廣、限制條件、全稱量詞、精緻化 | 數學命題 |
| 證實 | 全班 | 列舉／操作證明、演繹推理 | 被說服的恆真命題 |

術語固定使用「造例／提出猜想／效化／一般化／證實」。上游指出模式出處年份存在多種歸屬；正式引用時必須另行查證，不逕採單一年份。

## Cloud workflow
1. **來源與教材 ledger**：從使用者提供、Drive 或可讀取來源抽出目標、節數、活動、提醒、迷思、習作對應，建立 `ledger-教材事實.md`。
2. **原檔視覺核對**：數值、分數、箭頭、圖示、符號位置、活動編號等不得只依轉檔文字。若來源是 PDF／圖片，使用當次平台可用的原檔檢視或頁面截圖能力核對；看不清則標待補，不猜。
3. **異質造例**：起始材料至少同時包含可支持與可被反例打破的條件，避免猜想池只剩恆真命題。
4. **猜想池**：必須同時含恆真、非恆真、錯誤三類，並為非恆真／錯誤猜想建立可驗算反例。
5. **逐小節設計**：核心猜想、造例材料、反例、一般化限制條件、證實所需先備知識與逐事件時間帳。
6. **全單元對齊**：節數配置、目標涵蓋、任務依賴、課本活動處置與跨檔編號索引。
7. **學習單與評量**：學生版在一般化前不得直接出現待命名目標術語；評量分「教學用成功條件」與「研究用編碼」，研究編碼不得直接作成績。
8. **差異化判準**：措施若直接說出目標猜想關係內容，一律視為過度答案給予；只提供部分操作支持時需明示限制條件與使用範圍。
9. **驗證**：重新檢查時間帳、反例計算、來源 ledger、術語、紅線與跨檔矛盾。若發現 REFUTED 項，修正後必須再驗。

## Output contract
`ledger-教材事實.md`、各小節任務檔、`全單元總表.md`、`學習單內容稿.md`、`評量規準.md`、`差異化方案.md`、`未取得清單-待補.md`、`審查紀錄.md`。

## Stopping / Human Gate
- 時間帳超出配置節數 → 回報實際分鐘數，等待使用者裁決，不灌水。
- 原檔視覺仍無法辨識 → 標待補並要求清楚影像／原檔。
- 猜想池缺非恆真或錯誤猜想 → 回到造例設計，不得跳過效化。
- 教具、班級人數、特殊需求未知且會影響定稿 → 標阻塞。
- 涉及學生個資、錄影錄音、IRB、正式送件 → Human Gate。

## Verification
至少檢查：目標涵蓋、時間帳逐層加總、反例逐道驗算、教材事實可追溯、編號跨檔一致、術語一致、紅線與跨檔矛盾。修正時固定檢查「舊錯誤是否真的刪除」與「其他檔是否仍有同一錯誤」。

## Cloud runtime boundary
- 不假設本機 shell、`uvx`、Node.js、Git CLI、provider Plugin/MCP 或固定的本機資料夾存在。
- 文件閱讀使用當次可用 Drive／上傳檔案／文件工具；格式與數值核對必須回原檔視覺證據。
- 若平台缺少可可靠檢視原檔的能力，回報 `⏳ RUNTIME_INCOMPATIBLE` 或 `⏳ SOURCE_UNAVAILABLE`，不得宣稱完成教材事實核對。

## Upstream metadata
- repository: `https://github.com/bai-collab/eduHarness-.git`
- branch: `main`
- snapshot_commit: `11246662c0ecbf6ac861d66f6c5c7132ad90d674`
- path: `brain/skills/conjecturing-five-stage/SKILL.md`
- source_blob_sha: `876b486128af3996380d0d65ec2f1e2216c1f3be`
- canonical_sha256: `2730DA690A1C306B892F1658051C5E5ECD7E9B1B49EBBB5FBDB6F128824C8BF5`
- upstream_version: `null`
- cloud_port_mode: `functional-adaptation`
