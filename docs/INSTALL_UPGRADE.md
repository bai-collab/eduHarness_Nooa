# eduHarness Cloud｜安裝與升級

本文件對應 `00_EDUHARNESS_DISTRIBUTION.yaml` 與 `cloud-bootstrap`。

## 一句話版本

- **第一次安裝**：建立 ChatGPT Project → 貼 Portable Kernel → 使用 default profile（Notion Control Plane + Dropbox Storage）執行安裝 → 建立 Bootstrap Descriptor / ENV → fresh-start 驗證。
- **之後升級**：從現有 Bootstrap Descriptor 開始，解析 ENV / Control Plane / Storage，對照 GitHub stable Distribution；先做 diff / recovery plan，必要 Human Gate 後只修改 managed resources，最後重新從 Descriptor 驗證。

Google Drive 不再是 fresh installation 必要 root；它只保留為 optional/legacy storage provider 或 migration source。

## Architecture roles

```text
GitHub = Canonical Distribution
Bootstrap Descriptor = installation entry
ENV = installation config
Registry = capability / routing
Brain Index = knowledge / memory logical index
Artifact Index = logical artifact resolution
Control Plane default = Notion
Storage Provider default = Dropbox
Runtime State = ephemeral
Google Drive = optional / legacy storage
```

## 新安裝

### 使用者要做的事
1. 建立 ChatGPT Project。
2. 貼入 `00_PROJECT_INSTRUCTIONS.yaml`。
3. 確認 default profile 所需 Notion / Dropbox connection 可用。
4. 輸入安裝指令。

```text
安裝 eduHarness Cloud。
請依官方 GitHub Canonical Distribution 使用預設 installation profile，
完成後從 Bootstrap Descriptor fresh-start 驗證。
```

### 系統要做的事
1. 讀 GitHub Distribution Manifest 與 required contracts。
2. 選 provider profile；default = Notion + Dropbox。
3. 規劃 Control Plane resources：ENV、Registry、Brain Index、Artifact Index。
4. 規劃 Storage roles：artifacts、output、work_area。
5. 建立/安裝 Distribution-managed Skills / Knowledge artifacts。
6. 建立 logical artifact mapping。
7. 建立 Registry / Brain logical bindings。
8. 產生 provider-neutral正式 ENV。
9. 建立 Bootstrap Descriptor。
10. 從 Descriptor 重新讀取所有 required resources。
11. provider 支援 stable identity/revision 時執行 read-back。
12. 全部 PASS 才宣稱 `INSTALLATION_READY`。

## Logical artifact model

```text
Registry / Brain Index
  ↓
logical artifact:// ID
  ↓
Artifact Index
  ↓
provider stable identity + optional revision/path hint
  ↓
Storage Provider
```

### Identity rule
- logical artifact ID 是 control-plane identity。
- provider 有 stable ID 時，stable ID 優先於 path。
- path 只作 hint/fallback，不得取代 strong stable identity。
- provider 支援 revision 時，revision read-back 是 verification evidence。

## 升級 preflight

升級前必須：
1. 讀 Bootstrap Descriptor。
2. 驗證 Descriptor → ENV。
3. 讀正式 ENV，解析實際 Control Plane / Storage providers。
4. 讀 current Registry / Brain Index / Artifact Index。
5. 讀 GitHub stable Distribution。
6. 檢查 Kernel / ENV / Registry compatibility。
7. 比對 logical artifacts 與 provider identities。
8. 建立精確 mutation scope。
9. 建立 recovery / rollback plan。
10. 在重大 production mutation 前取得 Human Gate。

任何 preflight failure → 不進行 partial upgrade。

## Preserve set

一般升級預設不碰：
- installation-specific Descriptor identity / locator，除非明確 migration；
- 正式 ENV，除非明確 schema migration；
- Brain Index 中 user-owned / pre-existing entries，除非明確 additive migration；
- user-owned Knowledge；
- user Templates；
- Experience / Error Log；
- user outputs；
- Runtime State（預設 ephemeral，根本不應進 managed set）。

## Managed set

Distribution 可管理：
- Registry canonical semantics；
- Distribution-managed Skill artifacts；
- Distribution-managed Knowledge artifacts；
- Manifest 明確宣告的 Brain Index additive migration；
- Manifest 明確宣告的 Artifact Index mapping/remap；
- provider-neutral canonical contracts。

## Mutation ordering

建議 dependency-safe order：

```text
canonical contracts
→ Control Plane schema/resources if required
→ Registry
→ managed Skill/Knowledge storage artifacts
→ Artifact Index mappings
→ Brain Index additive mappings
→ ENV/Descriptor migration only when explicitly required
→ fresh-start verification
```

不應把升級定義成「覆寫一組 Google Drive files」。mutation 必須在 logical control-plane / artifact 層描述，再由 provider adapter 實作。

## Human Gate

下列操作必須先取得明確核准：
- production Control Plane schema/record 大量變更；
- Registry governance / routing mutation；
- managed artifact overwrite；
- Brain Index migration；
- Artifact Index remap；
- provider migration；
- 刪除資料；
- rollback overwrite；
- GitHub Canonical Distribution promotion。

## Recovery / rollback

Rollback 不假設單一 provider 技術。

### Control Plane
依 provider 能力使用 snapshot、history、record reconstruction 或其他可驗證回復機制。

### Dropbox
可使用 stable identity / revision 作 recovery evidence；但任何實際 restore 都仍是 mutation，需遵守 Human Gate。

### Google Drive / other provider
依 adapter 能力執行，不得把 Dropbox revision contract 強套到其他 provider。

### Recovery invariants
- 只回復本次 mutation 影響的 managed resources。
- 不刪除 user-owned data。
- 不把舊 runtime state 恢復成 production state。
- 回復完成後必須從 Bootstrap Descriptor fresh-start 再驗證。

## Upgrade verification

至少驗證：
- Descriptor 可定位 ENV；
- ENV schema/config valid；
- Registry schema 2 與 typed relations 完整；
- Brain Index logical refs 可解析；
- Artifact Index logical IDs 可解析；
- required Skill/Knowledge artifacts 可由 Storage Provider 實際讀取；
- stable identity/revision read-back（provider 支援時）；
- storage `artifacts` / `output` / `work_area` roles 存在；
- Runtime State 仍為 ephemeral；
- Human Gate / failure codes 未退化；
- Canonical Kernel/Distribution 無 installation-specific locator leakage；
- fresh installation 不要求 Google Drive root。

任何 required check FAIL → 不可宣稱 `UPGRADE_READY`。

## Provider migration

從 legacy Drive-centric installation 遷移到 v0.2 時：
1. 舊 Drive 可作 migration source。
2. 不把舊 Drive root/path schema 複製進新 Kernel/Brain/Registry。
3. 把可重用 artifacts 匯入選定 Storage Provider。
4. 建立新的 Artifact Index mappings。
5. Brain/Registry 改引用 logical refs。
6. 新 ENV 保存新 provider config。
7. 建立/更新 Descriptor。
8. fresh-start verification PASS 後才完成 cutover。
9. legacy data 的刪除不是 migration 完成的必要條件；若要刪除，另走 Human Gate。

## Failure codes

核心：
- `EDUHARNESS_DESCRIPTOR_NOT_FOUND`
- `EDUHARNESS_DESCRIPTOR_INVALID`
- `EDUHARNESS_ENV_NOT_FOUND`
- `ENV_AMBIGUOUS`
- `EDUHARNESS_ENV_INVALID`
- `EDU_REGISTRY_UNAVAILABLE`
- `BRAIN_INDEX_UNAVAILABLE`
- `ARTIFACT_INDEX_UNAVAILABLE`
- `ARTIFACT_UNRESOLVED`
- `SKILL_UNAVAILABLE`
- `SOURCE_UNAVAILABLE`
- `ACCESS_UNAVAILABLE`
- `RUNTIME_INCOMPATIBLE`
- `REGISTRY_GRAPH_INVALID`
- `SKILL_ROUTE_LOOP`
- `SAVE_FAILED`
- `SAVE_UNVERIFIED`

provider / installer 可定義更細 failure code，但不可取代核心治理語意。
