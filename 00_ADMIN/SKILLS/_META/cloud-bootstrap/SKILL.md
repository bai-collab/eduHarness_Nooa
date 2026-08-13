---
name: cloud-bootstrap
description: >
  eduHarness Cloud installation lifecycle meta Skill。支援首次安裝、Distribution 安裝、升級、搬移與修復；
  以 GitHub Canonical Distribution 為散布來源，以 Bootstrap Descriptor 為 installation entry。
---

# eduHarness Cloud Bootstrap

## 定位
`cloud-bootstrap` 負責 installation lifecycle，不處理一般教案、命題、教材或研究任務。

支援五種模式：
1. `fresh_install`：建立新的 Descriptor-first installation。
2. `distribution_install`：依官方 GitHub Distribution 建立 control plane / storage / ENV / Descriptor。
3. `upgrade`：升級既有 installation 的 distribution-managed control-plane records 與 logical artifacts。
4. `move`：遷移 provider 或 locator，不假設一定是 Drive root 搬移。
5. `repair`：修復 Descriptor / ENV / Registry / Brain Index / Artifact Index / Storage resolution。

## Canonical Distribution Contract
- Canonical Distribution 固定由 Project Kernel `upstream.repository` / `upstream.branch` 解析。
- 必須讀取 `00_EDUHARNESS_DISTRIBUTION.yaml`，不得依記憶猜版本或資源。
- GitHub 是 Canonical Distribution，不是 production runtime SSOT。
- Bootstrap Descriptor 是 installation entry；正式 ENV 是 installation config。
- Notion 是 default Control Plane；Dropbox 是 default Storage Provider。
- Google Drive 是 optional/legacy storage provider，不是首次安裝必要條件。
- Default provider 不代表唯一 provider；實際 provider 由安裝程序與正式 Descriptor/ENV 決定。
- Distribution locator 不代表寫入權限；所有 mutation 依 authenticated user / connector ACL。

## Project Instructions 穩定性
一般 Distribution upgrade 不要求重新貼 Project Instructions；只有 Kernel 自身有 breaking bootstrap/governance change 時才需要 Project Instructions migration，並在執行前取得 Human Gate。

## 新安裝必要輸入
`distribution_install` 不要求教師先建立 Google Drive root。

必要條件：
- 使用者明確要求安裝；
- runtime 至少具有可建立或使用所選 Control Plane / Storage provider 的能力；
- 若使用 default profile，需能使用 Notion 與 Dropbox。

可選：installation name、owner label、指定 Control Plane、指定 Storage Provider、legacy Google Drive migration source。

若 provider 不可用、ACL 不足或 installation identity 無法唯一解析，停止，不猜 locator。

## 新安裝流程
1. `resolve_distribution`
   - 讀官方 `00_EDUHARNESS_DISTRIBUTION.yaml` 與 required canonical contracts。
2. `select_provider_profile`
   - default = Notion Control Plane + Dropbox Storage；若使用者明確指定 supported provider，依 adapter contract 執行。
3. `plan_installation`
   - 規劃 Control Plane resources、Storage containers、ENV、Bootstrap Descriptor、Registry/Brain/Artifact mappings。
4. `human_gate_if_required`
   - 新空白 installation 的可預期 create 可依已明確安裝請求執行；覆寫既有 production、批次搬移、刪除、治理變更仍需 Human Gate。
5. `provision_control_plane`
   - 建立/解析 ENV record、Registry、Brain Index、Artifact Index 所需 control-plane resources。
6. `provision_storage`
   - 建立/解析 `artifacts`、`output`、`work_area` logical storage roles。
7. `artifact_transfer_preflight`
   - 讀 `docs/STORAGE_ADAPTER_CONTRACT.md`，檢查 source + destination adapters 是否具有 deterministic、可驗證的 canonical artifact transfer path。
   - 必須取得 canonical source identity 與 content evidence。
   - 只有 source text read + destination text create 不等於可用的 `artifact_transfer`。
   - 若只能靠模型重新輸出/重建 canonical source 才能寫入，且無法證明 destination canonical equivalence，停止並回報 `RUNTIME_INCOMPATIBLE`。
8. `install_managed_artifacts`
   - 將 Distribution-managed Skills / Knowledge 經已通過 preflight 的 transfer path 寫入 Storage Provider。
   - 每個 artifact 寫入後 read-back destination content/metadata、stable identity / revision（provider 支援時）。
   - 比對 canonical source 與 destination content evidence；equivalence 未 PASS → `SAVE_UNVERIFIED`。
9. `build_artifact_index`
   - 只有 canonical equivalence PASS 的 artifact 才能建立 logical `artifact://` → provider identity mapping 並標記 verified；stable identity 優先於 path。
10. `build_brain_registry_bindings`
   - Registry Skill resolution 與 Brain logical refs 指向 logical artifacts，不直接綁 provider path。
11. `generate_env`
   - 依 provider-neutral ENV template 建立正式 ENV，只保存 installation config/locator。
12. `create_bootstrap_descriptor`
   - Descriptor 定位正式 ENV 與 control-plane entry；不得把 Descriptor locator寫回 Kernel。
13. `fresh_start_verify`
   - 從 Descriptor 重新開始：Descriptor → ENV → Registry/Brain/Artifact Index → logical artifact → Storage Provider → stable identity/revision + canonical-equivalence read-back。
14. `finish`
   - 全部 PASS 才回報 `INSTALLATION_READY`。

## Canonical Artifact Transfer Contract

Distribution-managed artifacts 必須遵守：

```text
canonical source
  → immutable source identity
  → source content evidence
  → transfer capability preflight
  → deterministic transfer
  → destination read-back
  → canonical equivalence verification
  → verified Artifact Index binding
```

### Source evidence
- GitHub source 優先使用 blob SHA / commit-pinned identity。
- cryptographic digest 可直接取得或可可靠重算時，優先用 digest。
- source byte length 可作輔助 evidence，但不得單獨取代 digest/equivalence proof。

### Transfer rules
- 優先 byte-preserving connector-file、binary-safe upload、provider-native copy 等不經模型重建內容的 transfer。
- 模型不得把自己當 transport adapter；不得因 artifact 是 Markdown / YAML / 純文字，就重新生成內容後直接當 canonical copy。
- write API 回成功只代表 destination mutation 成功，不代表 canonical artifact 安裝成功。

### Verification rules
- destination 必須重新 read-back；不能只依 write response。
- equivalence 應比較 source/destination cryptographic digest；若 runtime 只能讀 normalized text，必須有明確 deterministic canonicalization，再於兩端重算同一 digest。
- 「目視相同」、「字數接近」、「size 相同」不能單獨作為 verified equivalence。
- equivalence PASS 前，不得建立 `binding_status: verified`。

### Failure boundary
- canonical source identity/content evidence 不可得 → `SOURCE_UNAVAILABLE`。
- deterministic verified transfer path 不存在 → `RUNTIME_INCOMPATIBLE`（detail 可用 `ARTIFACT_TRANSFER_UNAVAILABLE`）。
- destination write failure → `SAVE_FAILED`。
- destination read-back 與 canonical source 不等價，或無法證明等價 → `SAVE_UNVERIFIED`。

## Artifact Resolution Contract
```text
Registry / Brain Index
  → logical artifact:// ID
  → Artifact Index
  → provider stable identity + revision/path hint
  → Storage Provider
```

- 有 stable identity 時，不得以 path 作 authoritative identity。
- provider 提供 revision 時，安裝/升級 verification 必須 read-back revision。
- verified binding 還必須有 canonical artifact equivalence evidence；stable ID/revision 本身不能證明內容等價。
- logical ID 找不到 → `ARTIFACT_UNRESOLVED`。
- Artifact Index 不可用 → `ARTIFACT_INDEX_UNAVAILABLE`。

## Runtime State
- Runtime State 預設 ephemeral。
- private chain-of-thought、temporary routing state、working trace 不得因 bootstrap 自動成為 production artifact。
- 只有符合 Brain/Experience contract 且已確認可重用的內容，才可經獨立 persistence path 儲存。

## Upgrade Contract
### Preflight
1. 讀 Bootstrap Descriptor。
2. 讀正式 ENV。
3. 解析 current Control Plane / Storage providers。
4. 讀 Registry / Brain Index / Artifact Index。
5. 讀 GitHub stable Distribution。
6. 比對 schema、logical artifacts、provider capabilities 與 mutation scope。
7. 對所有將被更新的 managed artifacts 執行 artifact transfer preflight，確認 canonical-equivalence 可驗證。
8. 顯示 preserve set、mutation set、rollback/recovery plan。
9. 重大 production overwrite / remap / migration 前取得 Human Gate。

### Preserve set
預設保留：
- installation-specific Descriptor identity；
- 正式 ENV，除非明確 schema migration；
- user-owned Knowledge / Templates / Experience / Error Log / Output；
- Brain Index 既有 user entries；
- Runtime State（ephemeral，不納入 upgrade managed set）。

### Managed set
可依 Distribution 更新：
- Registry canonical semantics；
- Distribution-managed Skill artifacts；
- Distribution-managed Knowledge artifacts；
- Manifest 明確宣告的 Brain Index additive migration；
- Manifest 明確宣告的 Artifact Index mapping/remap。

### Recovery
- 不假設 rollback 等於 Drive file copy。
- 使用 Control Plane / Storage adapter 可用的 revision、snapshot、restore 或重新寫入機制。
- 只復原此次 mutation 的 managed resources。
- rollback 後必須從 Descriptor fresh bootstrap 再驗證。

## Provider Boundaries
### Default Control Plane — Notion
用於 ENV / Registry / Brain Index / Artifact Index 等 metadata/control records。Notion page/database IDs 屬 installation-specific locator，不得進 Canonical Kernel/Distribution。

### Default Storage — Dropbox
用於 artifacts / output / work_area。優先使用 Dropbox stable ID；revision 可作 read-back / recovery evidence，但 canonical artifact installation 還必須通過 source↔destination equivalence verification。

### Optional / Legacy — Google Drive
可作 Storage Provider 或 migration source，但：
- 首次安裝不得要求 Google Drive root；
- Drive URL/ID 只存在 installation config/provider records；
- 不得讓 Drive path tree 成為 Kernel/Brain/Registry schema。

## Privacy / Portability
- Distribution 不包含 installation-specific Notion/Dropbox/Drive locator。
- 不保存私人 Brain、學生個資、working traces、教師成果、secrets/tokens/cookies/credentials/private keys。
- 不假設 shell、Git CLI、daemon 或 background loop；依當次工具能力執行。

## Failure Codes
- `EDUHARNESS_DESCRIPTOR_NOT_FOUND`
- `EDUHARNESS_DESCRIPTOR_INVALID`
- `DISTRIBUTION_NOT_FOUND`
- `DISTRIBUTION_INVALID`
- `SOURCE_UNAVAILABLE`
- `RUNTIME_INCOMPATIBLE`
- `ENV_AMBIGUOUS`
- `INSTALL_ENV_GENERATION_FAILED`
- `INSTALL_ENV_INVALID`
- `EDU_REGISTRY_UNAVAILABLE`
- `BRAIN_INDEX_UNAVAILABLE`
- `ARTIFACT_INDEX_UNAVAILABLE`
- `ARTIFACT_UNRESOLVED`
- `SAVE_FAILED`
- `SAVE_UNVERIFIED`
- `UPGRADE_PREFLIGHT_FAILED`
- `UPGRADE_VERIFICATION_FAILED`
- `UPGRADE_ROLLBACK_FAILED`

## Completion Rule
只有所有 required writes 實際成功、每個 Distribution-managed artifact 都通過 canonical-equivalence read-back、Control Plane 與 Storage identities 可 read-back、Descriptor fresh-start bootstrap 全部通過，才能宣稱 installation 或 upgrade 完成。
