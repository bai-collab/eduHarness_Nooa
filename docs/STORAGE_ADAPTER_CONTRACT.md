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

`storage.update` **不是 universal required capability**。若工作需要 in-place update/replace，但 provider 未宣告等價能力，runtime MUST 回報 `ACCESS_UNAVAILABLE`（可附 provider-specific `REQUIRED_CAPABILITY_UNAVAILABLE` detail），不得以 delete/recreate、move 或其他高風險操作暗自模擬。

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
