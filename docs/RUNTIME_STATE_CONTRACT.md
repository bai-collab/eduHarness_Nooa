# Runtime State Contract

Status: Canonical v0.2 contract

## Default

eduHarness Cloud Runtime State 預設為 **ephemeral**。

Runtime State 包含一次性 task state、routing state、guard evaluation、temporary execution notes 與 working trace；它不是 Brain、不是 Knowledge，也不是 Distribution artifact。

## Persistence rule

下列內容不得因 runtime 執行而自動持久化：

- private chain-of-thought
- temporary hypotheses / scratch state
- route hop state
- connector/tool transient state
- raw working traces
- student PII

只有「可跨任務重用、已確認、符合 Brain/Experience/Error Log contract」的內容，才可經明確 persistence workflow 保存；若 persistence 涉及學生個資、正式評量或其他 Human Gate 條件，必須先核准。

## Trace

可稽核 trace SHOULD 只保存可對外呈現的結構，例如：

- evidence
- hypothesis label
- check/action
- result
- conclusion
- route/gate decision

不得保存 private chain-of-thought。

## Storage

`ENV.storage.work_area` 可作明確要求的 working artifact destination，但「存在 work_area」不代表 Runtime State 要自動寫入。

Canonical Distribution / upgrade snapshot 不得把 ephemeral Runtime State 當成 production-managed resource。

## Fresh start

Production readiness / bootstrap verification 必須能在不依賴前一個 session Runtime State 的條件下，從 Bootstrap Descriptor 重新解析 installation。

若 fresh start 必須依賴未持久化的前一輪 state 才能成功，則 readiness FAIL。
