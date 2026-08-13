# Educational Visual Semantics

## Purpose
在 `educational_codesign` 或來源需要教育語意保真時，將 Teaching Intent、Learner Action、Evidence、Role Fidelity、Decision Ownership 與時序轉成可視化且可 QA 的結構。

## Source-first
若來源為教案、學習單、教材、課程流程、教學簡報或已確認設計，來源明確定義的活動、角色與順序優先。不得為了更好看改變 AI 出現時點、學生／教師角色、學習證據、判斷責任或活動順序。

## Domain Knowledge Verification
若圖片本身承載可驗證的科學、歷史、地理、健康、工程或其他領域知識，Visual Proposal 前先確認關鍵機制、因果、結構與名詞。

規則：
- 優先使用使用者提供來源。
- 使用者未提供足夠來源且內容會影響教學正確性時，先查可靠來源再設計。
- 明確區分 `source-derived`、`verified`、`inferred`、`unknown`。
- 不得把常見示意圖的「流動路徑」誤寫成「因果順序」。
- 無法可靠確認時，保留 UNKNOWN、要求來源，或改成不宣稱機制細節的概念性示意。
- 視覺簡化可以降低細節，但不得改變核心因果、順序、角色或結構。

## Teaching Intent
每張圖先回答：
1. 這張圖片為什麼存在？
2. 觀看者應一眼理解什麼學習行為、概念或關係？

畫風低於 Teaching Intent。

## Learner Action Visibility
重要學習行為要能從畫面辨識。例如：
- 訪談：ask → listen → follow-up → record
- 證據分析：source artifact → evidence code → comparison → decision
- AI critique：human draft exists first → AI feedback later → human verifies evidence → human owns final decision

## Role Fidelity
### AI
若來源定義 AI = critic / second analyst / alternative perspective generator，不得改成 teacher / answer generator / main character / final decision maker。

### Teacher
若教師只負責引導、提問、觀察、提供資源，不得在圖中代替學生完成主要學習工作。

## Evidence Visibility
活動依賴紙本學習單、訪談紀錄、原始資料、Persona、證據卡或前一節作品時，應盡可能讓 evidence 可視化，而不是只畫人物聊天。

## Semantic Topology
用 directed relations 表達教育責任與時序，例如：
```text
Student Draft
→ exists before
AI Critique

AI Critique
→ suggests
Alternative Perspective

Student
→ verifies against
Evidence

Student
→ owns
Final Decision
```

Semantic Topology 防止：
- AI answering first
- student copying AI output
- responsibility inversion
- unsupported causal implication
- teaching sequence reversal

## Negative Semantic Constraints
將 `prohibited_misreading` 編譯成明確避免項，例如：
- Do not depict AI as the final decision maker.
- Do not show the student copying an AI-generated answer.
- Do not place teacher intervention before the student's initial attempt if the source says otherwise.

## Semantic QA
至少檢查：
- INTENT_MISMATCH
- LEARNER_ACTION_MISSING
- AI_ROLE_DRIFT
- TEACHER_ROLE_DRIFT
- EVIDENCE_CONTINUITY_LOSS
- PEDAGOGICAL_SEQUENCE_ERROR
- DOMAIN_KNOWLEDGE_MISMATCH
- CAUSAL_ORDER_ERROR
- VISUAL_OVERLOAD
- SERIES_STYLE_DRIFT

## Repair
先修失敗的 semantic dimension，不重做已通過的 style / identity / composition，除非 defect 本身要求構圖調整。
知識型錯誤先回到已查證的機制／來源，再修圖；不得只改箭頭或文字而保留錯誤因果。
