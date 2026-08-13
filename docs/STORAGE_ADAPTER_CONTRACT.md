# Storage Adapter Contract

Status: Canonical v0.2 contract

## Role

Storage Provider 承載 eduHarness 的實體 artifacts、output、work_area 與 provider-specific recovery identity。

Dropbox 是 v0.2 **default Storage Provider**。Google Drive 是 optional/legacy provider 或 migration source。

## Required logical roles

每個 installation MUST 能解析：

- `storage.artifacts`
- `storage.output`
- `storage.work_area`

實際 implementation 可以是 folder、namespace、bucket、database-backed object storage 或其他 provider 結構；Kernel 不得固定實體 path tree。

## Capability advertisement

Storage capability MUST 由 provider adapter 依當次 runtime tools / Connected Apps / ACL 明確宣告，不得假設所有 provider 擁有相同 mutation API。

Cross-provider baseline 以需求語意描述，例如：

- `inspect`
- `search`
- `read`
- `create`

下列能力為 **provider-advertised optional capabilities**，只有 adapter 明確支援時才能使用：

- `update` / `replace`
- `move`
- `delete`
- `share`
- `revision_restore`
- `artifact_transfer`

`storage.update` **不是 universal required capability**。若工作需要 in-place update/replace，但 provider 未宣告等價能力，runtime MUST 回報 `ACCESS_UNAVAILABLE`（可附 provider-specific `REQUIRED_CAPABILITY_UNAVAILABLE` detail），不得以 delete/recreate、move 或其他高風險操作暗自模擬。

`artifact_transfer` 不是單純「能 create file」。它代表 runtime 能把 canonical source artifact 以 deterministic、可驗證方式寫入 Storage，且可證明 destination content 與 canonical source 等價。

## Identity contract

當 provider 提供 stable identity 時：

1. stable identity 是 authoritative provider identity；
2. path/name 只作 display / hint / fallback；
3. rename/move 不應自動改變 logical artifact identity；
4. Artifact Index 應保存 logical ID → stable identity mapping。

當 provider 提供 revision/version 時，revision SHOULD 用於 mutation read-back 與 recovery evidence。

## Read contract

Adapter 必須能：
- resolve provider identity；
- read metadata；
- read artifact content（格式/大小允許時）；
- 驗證 object/folder role；
- 回報 access/source failure，不得假成功。

## Write contract

任何 write 必須：
1. 有明確 mutation scope；
2. 使用 adapter 實際宣告且可用的 capability；
3. 遵守 Human Gate；
4. 寫入後 read-back identity/parent/revision；
5. 失敗時回報 `SAVE_FAILED` 或更細 provider code；
6. 無法驗證時回報 `SAVE_UNVERIFIED`。

## Canonical Artifact Transfer Contract

Distribution-managed Skill / Knowledge 從 Canonical Distribution 寫入 Storage 時，MUST 使用以下流程：

1. `source_identity`
   - 取得 canonical source 的 immutable identity；GitHub 可使用 blob SHA / commit-pinned blob identity。
2. `source_content_evidence`
   - 取得可供等價驗證的 content evidence，例如 byte length + cryptographic digest，或 runtime 能可靠重算的 canonical content digest。
3. `transfer_preflight`
   - 確認 runtime + source adapter + destination adapter 存在 deterministic transfer path。
   - 只有「讀文字」與「create text file」不足以自動宣告 `artifact_transfer`。
4. `transfer`
   - 優先使用 byte-preserving connector-file / binary-safe upload / provider-native copy 等不經模型重建內容的路徑。
5. `destination_readback`
   - 寫入後重新取得 destination content/metadata、stable identity 與 revision（若 provider 支援）。
6. `canonical_equivalence_verify`
   - 比對 source 與 destination 的 canonical content evidence。
   - cryptographic digest 可用時優先使用 digest；否則至少需要 deterministic canonicalization 後重新計算 digest，不能只比較「看起來相同」的文字。
7. `bind`
   - 只有 equivalence PASS 後，Artifact Index 才能把該 logical artifact 標記為 `verified`。

### Forbidden fallback

下列流程不得視為可靠 canonical artifact transfer：

```text
canonical source
→ model paraphrase / regeneration / manual reconstruction
→ text create API
→ write success
```

模型不得因為 source 是純文字，就把自己當作 byte-preserving transport adapter。若模型必須重新輸出 source 內容才能呼叫 destination create API，而 runtime 又無法在 destination read-back 後證明 canonical equivalence，MUST 停止。

### Failure boundary

- source identity/content evidence 無法取得 → `SOURCE_UNAVAILABLE`。
- 沒有 deterministic、可驗證 transfer path → `RUNTIME_INCOMPATIBLE`（可附 `ARTIFACT_TRANSFER_UNAVAILABLE` detail）。
- destination write 失敗 → `SAVE_FAILED`。
- destination 可讀但 canonical equivalence 不成立或無法證明 → `SAVE_UNVERIFIED`。
- equivalence 未 PASS 前，不得建立 `binding_status: verified`，不得宣稱 installation/upgrade ready。

## Recovery

Recovery 是 adapter-specific：

- Dropbox 可利用 stable ID / revision / restore capability（實際可用性仍以當次 adapter 為準）。
- Google Drive 或其他 provider 依其 own version/history/snapshot capability。
- 不得假設所有 provider 都具有相同 revision semantics。

Rollback 只應回復此次 managed mutation，不得刪除 user-owned data。

## Google Drive legacy rule

Google Drive 可以繼續存在，但 MUST NOT：
- 成為 fresh installation 必填 root；
- 讓 `workspace.drive_root` 成為 Kernel/Registry/Brain schema；
- 把 installation-specific Drive URL/ID 放進 Canonical Distribution。
