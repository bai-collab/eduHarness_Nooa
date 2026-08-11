---
name: reasoning-kernel
description: Reusable evidence-based reasoning kernel for eduHarness Cloud. Activates conditionally when a task requires competing hypotheses, uncertainty reduction, diagnosis, decision comparison, counterexample testing, or iterative verification; exposes an auditable decision record rather than private chain-of-thought.
---
# Reasoning Kernel｜證據式推理核心

## 定位
`reasoning-kernel` 是 eduHarness Cloud 的共用推理支援層，不取代領域 Skill，也不負責選擇主要任務流程。

Primary Skill 決定「要完成什麼工作」；本 Kernel 在需要時協助回答：
1. 已確認看到什麼？
2. 哪些解釋／方案仍可能成立？
3. 哪個下一步最能降低關鍵不確定性？
4. 新證據支持、削弱或否定了什麼？
5. 目前是否足以形成結論，還是應停止並保留未知？

本 Skill 只輸出可稽核的外部推理紀錄（evidence / hypothesis / test / result / conclusion），不得要求、保存或輸出模型私有 chain-of-thought。

## 何時啟動
啟動條件至少符合一項：
- 有兩個以上合理假設、方案或解釋，需要區分。
- 來源互相衝突、證據強度不同，不能直接裁決。
- 任務涉及診斷、除錯、研究、策略或因果判斷。
- 需要設計反例、測試、實驗或查證步驟才能提高信心。
- 結論會影響後續高成本工作，值得先驗證關鍵假設。
- Primary Skill 明確依賴本 Kernel。

## 何時略過
以下情況預設不啟動：
- 單純抄錄、翻譯、格式轉換、明確規則下的機械操作。
- 可由單一可靠來源直接回答的簡單事實查詢。
- 使用者已提供完整程序，且不需要額外判斷或驗證。
- 啟動推理迴圈的成本高於可能降低的不確定性。

## Working State Contract
本 Kernel 的 working state 是單次任務的暫態狀態，不等同 eduHarness Brain 長期記憶，不得自動寫入 Knowledge / Experience / Error Log。

```yaml
working_state:
  problem: null
  goal: null
  constraints: []
  observations: []
  evidence:
    confirmed: []
    partial: []
    conflicts: []
    unknown: []
  hypotheses:
    active: []
    rejected: []
    supported: []
  predictions: []
  candidate_checks: []
  selected_check: null
  check_result: null
  confirmed_patterns: []
  remaining_uncertainties: []
  budget:
    step_limit: null
    steps_used: 0
  status: reasoning | ready | blocked | exhausted
```

Evidence status 沿用 eduHarness：
- `✅` 已確認
- `⚠️` 合理推測／部分支持
- `⏳` 待確認或工具不可用
- `❓` 來源未提及
- `❌` 已否定
- `❗` 來源衝突

## Reasoning Loop
### 1. Observe & Encode
把使用者輸入、來源、工具結果與既有工作狀態拆開記錄。
- 不把推論寫成觀察。
- 不把搜尋到檔案等同已讀內容。
- 不把來源提及等同外部事實已證實。

產出：`observations`、`evidence`、`remaining_uncertainties`。

### 2. Hypothesize
只有在存在實質不確定性時建立候選假設。
- 通常維持 2–4 個彼此可區分的候選。
- 每個假設必須能指出可觀察的預測或被否定的條件。
- 不為了湊數建立虛假替代方案。

產出：`hypotheses.active`、`predictions`。

### 3. Select Discriminative Check
從可用來源、工具或安全操作中，選擇最能區分候選假設的下一步。
依序評估：
1. information gain：能否明顯降低關鍵未知？
2. evidence quality：是否能取得較原始、直接、可驗證證據？
3. cost：時間與操作成本是否合理？
4. risk：是否涉及 Human Gate、不可逆或高影響操作？
5. redundancy：是否重複已做過且不能新增資訊？

產出：`candidate_checks`、`selected_check`。

### 4. Execute / Inspect
由 Primary Skill 或平台可用 Tool 實際執行查證、讀取、計算、測試或其他允許操作。
Kernel 不得虛構 Tool 成功、來源內容或 runtime capability。

產出：`check_result`。

### 5. Reflect & Revise
比較「預測」與「實際結果」：
- 支持：增加支持，但除非證據足夠，不升級成完全確定。
- 反駁：移入 `hypotheses.rejected`，避免重複採用。
- 意外結果：新增未知或建立新候選，但仍維持候選數量可管理。
- 來源衝突：保留 `❗`，依原始性、日期、方法評估；無法裁決時不強行合併。

產出：更新後的 hypothesis / evidence state。

### 6. Consolidate
把跨步驟結果整理成：
- `confirmed_patterns`
- `supported hypotheses`
- `rejected hypotheses`
- `remaining_uncertainties`

此步驟是領域 Skill 與 Kernel 之間的穩定介面。

### 7. Validate Before Conclusion
形成結論前至少檢查：
- 是否存在反例或未處理矛盾？
- 關鍵結論是否超過證據強度？
- 是否把未知資訊自行補完？
- 是否有另一個同樣能解釋證據的候選？
- 是否需要 Human Gate 或更高品質來源？

若未通過，回到 Hypothesize 或 Select Discriminative Check；若無可行查證路徑則標 `blocked`。

## Stopping Rule
任一條件成立即可停止：
- `ready`：關鍵結論已被足夠證據支持，且無未處理的致命反例。
- `blocked`：缺少必要來源、工具、權限或 Human Gate，無法安全繼續。
- `exhausted`：已達合理 step / time / resource budget，新增操作資訊增益過低。
- Primary Skill 的完成條件已滿足。

不得因「想更確定」無限循環。

## Output Contract
預設不輸出逐步私有思考，只在對任務有價值時提供精簡 `reasoning_record`：

```yaml
reasoning_record:
  conclusion: null
  evidence_used: []
  alternatives_considered: []
  checks_performed: []
  rejected_or_weakened: []
  remaining_uncertainties: []
  confidence: high | medium | low
  next_action: null
```

對一般使用者輸出時，優先轉成：
- 結論
- 依據
- 反方／替代解釋（若重要）
- 未知與限制
- 下一步

## Integration Contract
- Registry / Project Orchestrator 仍負責 Primary Skill routing。
- 本 Kernel 是 supporting capability；不得因啟動 Kernel 而覆蓋 Primary Skill 的 domain rules、output contract、Human Gate 或 stopping rule。
- 若 Primary Skill 與 Kernel 規則衝突：Project 全域規則 > Registry routing > Primary Skill domain contract > Reasoning Kernel 一般程序。
- Primary Skill 可把自己的領域狀態映射到 `working_state`，但不必採用相同檔案格式。
- Kernel 結果只能作為可驗證的工作狀態／決策紀錄，不自動進入 Brain 長期記憶。

## Failure Policy
- 缺來源：`⏳ SOURCE_UNAVAILABLE`
- 缺 runtime 能力：`⏳ RUNTIME_INCOMPATIBLE`
- 來源衝突無法裁決：`❗ SOURCE_CONFLICT`
- 關鍵假設被否定：標 `❌` 並回到候選建立，不得沿用舊結論。
- 無法取得區分性證據：保留多個候選，不強迫單一答案。

## Cloud Runtime Boundary
- 不假設 shell、Git CLI、Node.js、daemon、background loop 或固定 Plugin/MCP 存在。
- 實際查證與操作只使用當次平台提供的工具、Connected Apps 與來源。
- Loop 是工作程序語意，不宣稱具有程式層級持續 while-loop runtime guarantee。
- 涉及學生個資、正式評量、正式送件、刪除、批次覆寫或其他 Project Human Gate 時，必須先遵守上層 Human Gate。

## Provenance
- kind: `local-design`
- basis: eduHarness Cloud runtime contract + ARC-style observe / hypothesize / experiment / reflect / generalize / validate abstraction.
- adaptation: 移除 ARC 專用 action-space 假設，改為可被教育、研究、診斷、設計與決策 Skill 共用的 evidence-based reasoning kernel。
- version: `0.1.0`
