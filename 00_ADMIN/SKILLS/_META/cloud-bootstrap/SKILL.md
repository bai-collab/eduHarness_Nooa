---
name: cloud-bootstrap
description: >
  eduHarness Cloud installation lifecycle meta Skill。支援首次安裝、Distribution 安裝、升級、搬移與修復；
  Registry v3 採 Official GitHub snapshot + installation Local Registry 雙層 routing。
---

# eduHarness Cloud Bootstrap

version: 0.3.0-candidate
status: candidate
registry_contract: v3-dual-layer

## 定位
`cloud-bootstrap` 負責 installation lifecycle，不處理一般教案、命題、教材或研究任務。

支援五種模式：
1. `fresh_install`：建立新的 Descriptor-first v3 installation。
2. `distribution_install`：依官方 GitHub Distribution 建立 installation Control Plane / Storage / ENV / Descriptor。
3. `upgrade`：將既有 installation 升級至目標 Distribution/source model。
4. `move`：遷移 installation provider 或 locator。
5. `repair`：修復 Descriptor / ENV / Local Registry / Brain Index / Artifact Index / Storage resolution。

## Registry v3 Source Model
- Project Kernel 仍是最高層 governance。
- GitHub Canonical Distribution 提供 Official Registry、Official Skills 與 Official Knowledge。
- 每次 routing/execution 開始前，必須把 Project upstream branch 解析成 immutable commit SHA；Official Registry/Skill/Knowledge 全部使用同一 snapshot。
- Official Registry 不再是 installation Control Plane resource；installation 不建立 Official Registry 的 authoritative copy。
- Official Skills 不再要求複製到 installation Storage；runtime 依 pinned snapshot on-demand 讀取完整 Skill package。
- installation 建立 Local Registry，作為 Teacher Custom Skill 與 explicit local policy overlay。
- Local Skill 由 Local Registry -> Artifact Index -> installation Storage 解析。
- Effective Routing View 只存在 runtime，預設 ephemeral，不得持久化成第三份 Registry SSOT。
- Local policy 不得覆蓋 Project Human Gate、privacy、安全、failure 或其他 Kernel governance。

## Canonical Distribution Contract
- Canonical Distribution 固定由 Project Kernel `upstream.repository` / `upstream.branch` 解析。
- 必須讀取 `00_EDUHARNESS_DISTRIBUTION.yaml` 與 v3 contracts，不得依記憶猜版本。
- Distribution snapshot identity 必須是 immutable commit；branch 名稱只能作 discovery hint，不能作 active execution identity。
- Bootstrap Descriptor 是 installation entry；正式 ENV 是 installation config。
- Notion 是 default Control Plane；Dropbox 是 default Storage Provider；Google Drive 是 optional/legacy。
- Provider 預設值不是 Kernel-global hard dependency；實際 installation provider 由 Descriptor/ENV 解析。
- Distribution locator 不代表 mutation 權限；所有寫入依 authenticated user / connector ACL。

## 新安裝必要輸入
必要條件：
- 使用者明確要求安裝；
- active Kernel 支援目標 ENV/Registry contract；
- runtime 能讀 GitHub Canonical Distribution 並解析 immutable commit snapshot；
- runtime 至少能建立或使用所選 installation Control Plane / Storage provider；
- default profile 需要 Notion + Dropbox 可用。

可選：installation name、owner label、指定 Control Plane、指定 Storage Provider、legacy migration source。

若 Distribution snapshot、provider、ACL 或 installation identity 無法唯一解析，停止，不猜 locator。

## Fresh Install / Distribution Install
1. `resolve_distribution`
   - 讀 Project upstream 指向的 `00_EDUHARNESS_DISTRIBUTION.yaml`。
   - 確認 active Kernel 支援 manifest 宣告的 ENV/Official Registry/Local Registry contract。
2. `pin_distribution_snapshot`
   - 將 upstream branch 解析為 immutable commit SHA。
   - 後續 Official Registry/Skills/Knowledge 全部使用此 SHA。
   - 若中途來源不一致，停止 `SOURCE_CONFLICT`。
3. `select_provider_profile`
   - default = Notion Control Plane + Dropbox Storage；其他 provider 依可用 adapter contract。
4. `plan_installation`
   - 規劃 ENV、Local Registry、Brain Index、Artifact Index、Bootstrap Descriptor 與 Storage containers。
   - Fresh install 不規劃 Official Skill mirror 或 Official Registry installation copy。
5. `human_gate_if_required`
   - 新空白 installation 的預期 create 可依明確安裝請求執行；覆寫 production、migration、批次搬移、刪除、治理變更仍需 Gate。
6. `provision_control_plane`
   - 建立/解析 Local Registry、Brain Index、Artifact Index 與 ENV 所需 installation resources。
   - Local Registry 初始內容依 `00_ADMIN/LOCAL_REGISTRY_TEMPLATE.yaml` 建立，預設 `skills: []`。
7. `provision_storage`
   - 建立/解析 `artifacts`、`output`、`work_area` logical roles。
   - `artifacts` 儲存 installation-owned Local Skill/Knowledge，不要求存放 Official Skills。
8. `validate_official_registry`
   - 從 pinned snapshot 讀 Official Registry v3。
   - 驗證 schema、namespace、typed relations、guard contract、graph 基本合法性。
9. `validate_local_registry`
   - 讀 installation Local Registry。
   - 驗證 schema 1 / overlay contract、`local:` namespace、artifact refs、override/disable/extend policy。
10. `build_effective_routing_view`
   - 依 `REGISTRY_V3_DUAL_LAYER_CONTRACT.md`：Project governance -> Official + Local validation -> disable -> explicit override -> extend -> conflict detection -> effective graph validation。
   - Effective View 不持久化。
11. `generate_env`
   - 使用 ENV schema 3；`control_plane.local_registry` 定位 Local Registry。
   - ENV 不保存 Official Registry installation locator。
12. `create_bootstrap_descriptor`
   - Descriptor 定位正式 ENV 與 installation resources；不得把 installation locator 寫回 Kernel/Distribution。
13. `fresh_start_verify`
   - 從 Descriptor 全新開始：Descriptor -> ENV -> pin Distribution snapshot -> Official Registry -> Local Registry / Brain / Artifact Index -> Effective Routing View -> Official Skill snapshot read -> Local artifact resolution -> Storage roles。
14. `finish`
   - 全部 PASS 才回報 `INSTALLATION_READY`。

## Official Artifact Resolution
```text
Project upstream
  -> immutable distribution commit
  -> Official Registry v3
  -> Official Skill/Knowledge canonical path
  -> read full artifact from same snapshot
```

Rules:
- Official artifacts 不要求 installation Artifact Index mirror。
- Official Skill 執行前仍必須讀全文。
- Registry 與 Skill 若不是同一 snapshot -> `SOURCE_CONFLICT`。
- Official source 無法讀取 -> `SOURCE_UNAVAILABLE` 或 `SKILL_UNAVAILABLE`。

## Local Artifact Resolution
```text
Local Registry
  -> artifact://installation/...
  -> Artifact Index
  -> provider stable identity + revision/path hint
  -> installation Storage
```

Rules:
- stable identity 優先於 path。
- provider 支援 revision 時，write 後必須 read-back revision。
- unresolved -> `ARTIFACT_UNRESOLVED` / `LOCAL_ARTIFACT_UNRESOLVED`。
- Local Skill package mutation 仍遵守 write/read-back verification。

## Artifact Transfer Contract Scope
Fresh v3 install **不需要**把 Official Skills 從 GitHub 複製到 Dropbox，因此 Official Skill installation 不再觸發 artifact transfer preflight。

Artifact transfer contract仍適用於：
- Local/installation-owned artifact 寫入或搬移；
- 明確 legacy import/migration；
- 任何聲稱為 canonical copy 且需要 source↔destination equivalence 的操作。

禁止把模型重新生成/轉寫內容當 byte-preserving transport；write success 不能取代 read-back verification。

## Local Registry Bootstrap Contract
初始 Local Registry：
```yaml
schema_version: 1
registry_kind: eduharness-local-registry
overlay_contract_version: 1
scope: installation
namespace: local
status: active
skills: []
policies:
  disabled_official_skills: []
```

- locator 僅存在 ENV/control-plane installation record。
- Local Registry 不複製 Official entries。
- Teacher Custom Skill 日後由 `cloud-skill-builder` 寫 Local Skill package + Artifact Index + Local Registry。

## Upgrade v2 -> v3 Candidate Contract
### Preflight
1. 讀現有 Bootstrap Descriptor。
2. 讀現有 ENV、Registry v2、Brain Index、Artifact Index。
3. pin 目標 v3 Distribution snapshot。
4. 確認 active Kernel 已支援 Registry schema 3 / ENV schema 3 / Local Registry overlay contract。
5. 建立 preserve / mutation / authority-switch / rollback plan。
6. migration 屬重大 production routing/source-of-truth 變更，執行前必須 Human Gate。

### Preserve
初次 cutover 預設保留：
- Bootstrap Descriptor identity；
- 舊 ENV，直到 ENV v3 fresh-start PASS；
- Brain Index user entries；
- Artifact Index user-owned entries；
- user-owned Knowledge/Templates/Experience/Error Log/Output；
- v2 已安裝的 17 個 Official Dropbox Skill mirrors。

舊 Official mirrors 在 v3 只可標記為 legacy cache / rollback evidence，**不得刪除、不得繼續作 authoritative Official source**。

### Create / Switch
- 建立 Local Registry。
- 建立 ENV v3 的 `control_plane.local_registry` locator。
- Official Registry authority：installation Registry v2 -> pinned GitHub Official Registry v3。
- Official Skill authority：Dropbox mirrors -> pinned GitHub Official Skills。
- Local Skill authority：Local Registry -> Artifact Index -> installation Storage。

### Verification
- immutable snapshot 可解析；
- Official Registry v3 合法；
- Local Registry v1 合法；
- resolver fixtures / effective graph PASS；
- Official Skill 可由同 snapshot 讀全文；
- Local artifact refs 可從 Artifact Index 解析；
- Descriptor fresh-start PASS；
- 舊 v2 resources 未被破壞。

### Rollback
任何 verification failure：
- 不刪 v2 resources；
- 恢復 v2 ENV/Registry authority；
- 只撤銷本次 v3 candidate mutation；
- 再做 v2 fresh-start verification。

## Provider Boundaries
### Default Control Plane — Notion
installation-owned ENV / Local Registry / Brain Index / Artifact Index metadata。Notion IDs 為 installation locator，不得進 Canonical Distribution。

### Default Storage — Dropbox
installation-owned Local artifacts / output / work_area。Official Skill mirror 不是 v3 fresh install requirement。

### Optional / Legacy — Google Drive
可作 supported Storage Provider 或 migration source，但首次安裝不得要求 Drive root。

## Runtime State
- Runtime State 預設 ephemeral。
- Effective Routing View 預設 ephemeral。
- private chain-of-thought、temporary routing state、working trace 不得自動持久化。

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
- `SOURCE_CONFLICT`
- `RUNTIME_INCOMPATIBLE`
- `ENV_AMBIGUOUS`
- `INSTALL_ENV_GENERATION_FAILED`
- `INSTALL_ENV_INVALID`
- `EDU_REGISTRY_UNAVAILABLE`
- `LOCAL_REGISTRY_INVALID`
- `BRAIN_INDEX_UNAVAILABLE`
- `ARTIFACT_INDEX_UNAVAILABLE`
- `ARTIFACT_UNRESOLVED`
- `SKILL_UNAVAILABLE`
- `REGISTRY_GRAPH_INVALID`
- `SKILL_ROUTE_LOOP`
- `SAVE_FAILED`
- `SAVE_UNVERIFIED`
- `UPGRADE_PREFLIGHT_FAILED`
- `UPGRADE_VERIFICATION_FAILED`
- `UPGRADE_ROLLBACK_FAILED`

## Human Gate Boundary
必須 Gate：
- v2 -> v3 production cutover；
- 覆寫 ENV / Local Registry / Brain Index / Artifact Index；
- Local Skill重大 overwrite/remap；
- 刪除 legacy Official mirrors；
- Canonical Distribution / Project Kernel promotion；
- 任何可能破壞 routing 的治理變更。

## Completion Rule
Fresh v3 installation 只有在 installation-owned writes read-back 成功、Distribution snapshot/Official Registry/Official Skill 可讀、Local Registry/Brain/Artifact Index 合法、Effective Routing View 驗證成功且 Descriptor fresh-start PASS 後，才能宣稱 `INSTALLATION_READY`。
