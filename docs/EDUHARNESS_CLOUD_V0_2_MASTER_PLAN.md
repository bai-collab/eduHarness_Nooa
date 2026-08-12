# eduHarness Cloud v0.2 Master Plan

**文件狀態**：Implemented / Canonical Architecture History  
**版本**：v0.2-master-plan-canonical-01  
**日期**：2026-08-12  
**Kernel**：`eduHarness Cloud v2.0.0 Compact Portable Kernel`

## 1. Purpose

本文件記錄 eduHarness Cloud v0.2 從 Drive-centric runtime 重構為 Descriptor-first、provider-separated architecture 的開發路徑、治理決策、實際 promotion 歷史與後續 roadmap。

本文件保存 architecture history 與 roadmap；runtime normative contracts 仍以對應 canonical contract files 為準。

## 2. Canonical End State

```text
Project Kernel = portable governance
GitHub = Canonical Distribution
Bootstrap Descriptor = installation discovery / ENV entry
ENV = installation config
Registry = capability / routing SSOT
Skill = procedure
Brain Index = knowledge / memory logical index
Artifact Index = logical artifact resolution
Control Plane = runtime metadata/control abstraction
Notion = default Control Plane implementation
Storage Provider = artifacts / output / work_area storage
Dropbox = default Storage Provider implementation
Runtime State = ephemeral by default
Google Drive = optional / legacy Storage Provider or migration source
```

Project Kernel 不保存 installation-specific Notion/Dropbox/Drive locator。

## 3. Architecture Decisions

### 3.1 Bootstrap Descriptor

Bootstrap Descriptor 的**主要責任**是 installation discovery / formal ENV entry。

它可以攜帶 fresh bootstrap 所需的最小 provider metadata，但完整 installation config 仍以 ENV 為準。

解析順序：

```text
Bootstrap Descriptor
→ formal ENV
→ Control Plane / Storage config
→ Registry / Brain Index / Artifact Index
→ logical artifacts
```

Descriptor 不得被硬編碼進 Portable Kernel 或 GitHub production distribution。

### 3.2 ENV schema

Canonical ENV schema 2 使用 provider-neutral top-level roles：

```yaml
control_plane:
  provider:
  root:
  registry:
  brain_index:
  artifact_index:

storage:
  provider:
  root:
  artifacts:
  output:
  work_area:

runtime:
  state_persistence: ephemeral
```

舊 `ENV.workspace.*` / `workspace.drive_root` 不再是 v0.2 canonical runtime schema。

### 3.3 Control / Storage Separation

Control Plane 負責 installation/control metadata：ENV、Registry、Brain Index、Artifact Index。

Storage Provider 負責實體 artifacts、output、work_area 與 provider-specific recovery identity。

Notion / Dropbox 是 v0.2 default implementations，不是 Kernel-global hard dependencies。

### 3.4 Logical Artifact Layering

Knowledge resolution：

```text
Brain Logical Ref
→ artifact:// ID
→ Artifact Index
→ provider stable identity / revision
→ Storage Artifact
```

Skill resolution：

```text
Registry capability
→ artifact:// ID
→ Artifact Index
→ Storage Artifact
→ Skill full text
```

有 stable provider identity 時，path 只作 hint，不得取代 stable identity 成為 authoritative identity。

### 3.5 Runtime State

Runtime State 預設 ephemeral。Private chain-of-thought、temporary routing state、scratch state、raw working trace 不因 runtime 執行而自動成為 production artifact。

### 3.6 Storage Capability Model

Storage capabilities 採 **provider-advertised capability model**。

Baseline semantic capabilities可包含：

```text
inspect
search
read
create
```

下列能力只有 provider adapter 明確支援時才能使用：

```text
update / replace
move
delete
share
revision_restore
```

`storage.update` **不是 universal required capability**。若 required capability 不存在，不得用 delete/recreate 或其他高風險操作暗自模擬。

## 4. Runtime Execution Model

```text
classify
→ bootstrap if required
→ route
→ evaluate entry routes
→ confirm Primary Skill
→ resolve requires
→ resolve enhances
→ plan
→ inspect source
→ reason if required
→ Human Gate if required
→ execute
→ observe
→ post-execution routes
→ verify
→ replan if needed
→ persist if explicitly required
→ stop
```

Registry schema v2 保留六種 typed relations：

- `requires`
- `enhances`
- `routes`
- `conflicts`
- `replaces`
- `supports`

六種 relation 不得被扁平化成相同 graph edge semantics。

## 5. Human Gate

至少以下情況需要明確 Human Gate：

- 學生個資或可識別學習紀錄
- 正式評量
- 正式送件 / 公開
- 付費服務
- 刪除資料
- 批次搬移 / 覆寫
- production Registry / routing / governance 重大修改
- Artifact Index remap 或 provider migration
- Canonical Distribution promotion
- 可能破壞 routing 的變更

Gate 僅授權當次明確列出的 mutation scope。

## 6. Phase Roadmap — Actual History

### Phase 0 — Architecture Contracts

**狀態：✅ COMPLETE**

建立 failure envelope、compensation/partial-commit semantics、Human Gate intent snapshot、stable identity、Bootstrap acquisition、ephemeral runtime state 與 architecture fixtures。

### Phase 1 — Provider Mapping

**狀態：✅ COMPLETE**

完成 Notion staging Control Plane、Dropbox staging Storage、provider capability mapping 與 fallback 行為驗證。

### Phase 2 — Runtime Integration

**狀態：✅ COMPLETE**

Control / storage / bootstrap / artifact runtime capabilities E2E 通過。

### Phase 3A — Failure & Recovery

**狀態：✅ COMPLETE**

完成 broken locator、stale revision、read-back mismatch、partial commit、preserve-and-report、index reconstruction、Human Gate target drift 等 fault-model validation。

Real provider outage 未刻意誘發；該項仍屬 fault-model validation，而非真實 outage drill。

### Phase 3B — Production Installation / Bootstrap Contract

**狀態：✅ COMPLETE**

Descriptor-first installation contract 建立；ENV schema 2、Notion default Control Plane、Dropbox default Storage Provider。

### Phase 4 — Production Deployment

**狀態：✅ TECHNICAL COMPLETE**

Production Control Plane / Storage / ENV / Registry / Brain / Artifact Index / stable locator read-back 完成。

#### Governance exception retained

Phase 4 曾發生一次 staging root title 的同值 update call：

```text
logical state change: NONE
production impact: NONE
data loss: NONE
strict mutation-scope audit: EXCEPTION
```

此歷史不得被抹除；它屬 implementation governance history，不應寫進跨 installation 的 runtime contract。

### Phase 4B — Full Runtime Completion

**狀態：✅ COMPLETE**

Production chain完成：

```text
Registry → real Skill → Artifact Index → Storage Skill
Brain Index → logical Artifact ID → Artifact Index → Storage Knowledge
Bootstrap Descriptor → ENV → full runtime
```

### Phase 5A — Final Production Readiness Audit

**狀態：✅ PASS**

完成 Descriptor→ENV、ENV→Indexes、Registry/Brain→Artifact Index→Storage、stable identity/revision、storage roles、failure/recovery、Human Gate、zero Google Drive mutation 等 production readiness audit。

結論：

```text
GitHub Promotion Gate = READY
```

### Phase 5B-1 — Promotion Diff Planning

**狀態：✅ COMPLETE**

先以 read-only GitHub audit 建立 exact mutation plan。

### Phase 5B-2 — Promotion Human Gate

**狀態：✅ COMPLETE**

使用者明確核准 Canonical Distribution governance mutation。

### Phase 5B-3 — Canonical Distribution Promotion

**狀態：✅ COMPLETE**

初始 promotion 實際修改 10 個 existing files、新增 5 個 canonical contracts，將 architecture promotion 到 Descriptor-first / Notion-default / Dropbox-default / provider-neutral model。

### Phase 5B-4 — Post-Promotion Verification

**狀態：✅ COMPLETED WITH INITIAL BLOCKER**

第一次 post-promotion audit 發現 4 個 residual legacy normative/procedural contracts：

- `docs/REGISTRY_GRAPH_SCHEMA_V2.md`
- `00_ADMIN/REGISTRY_V2_1_RUNTIME_TRACE_ADAPTER.yaml`
- `00_ADMIN/SKILLS/_META/github-to-cloud-skill-port/SKILL.md`
- `00_ADMIN/SKILLS/_META/cloud-skill-builder/SKILL.md`

因此當時不得宣稱 `CANONICAL_DISTRIBUTION_READY`。

### Phase 5B-5 — Legacy Contract Compatibility Cleanup

**狀態：✅ COMPLETE**

清理上述 4 個 residual contracts，移除 active/normative `ENV.workspace.*`、Drive-as-runtime-root 等 legacy assumptions，保留 Registry v2 typed relation semantics。

### Phase 5B-6 — Final Canonical Readiness Audit

**狀態：✅ PASS**

Final regression verification 確認已知 active Drive-root / `ENV.workspace.*` blockers 清除。

結論：

```text
CANONICAL_DISTRIBUTION_READY
```

### Kernel v2.0.0 Governance Cutover

**狀態：✅ APPROVED / CANONICAL**

v0.2 architecture 實質改變 installation entry、bootstrap discovery、ENV schema expectations、Artifact Index layering、provider model 與 failure boundary，因此 Kernel 正式升為：

```text
eduHarness Cloud v2.0.0 Compact Portable Kernel
```

由舊 `v1.4.1` Project Instructions 升級到 v2.0.0 時，應重新貼入最新版 `00_PROJECT_INSTRUCTIONS.yaml`；一般未涉及 Kernel breaking change 的 Distribution upgrade 仍不要求重新貼 Project Instructions。

## 7. Canonical Failure Model

核心 failure codes：

```text
EDUHARNESS_DESCRIPTOR_NOT_FOUND
EDUHARNESS_DESCRIPTOR_INVALID
EDUHARNESS_ENV_NOT_FOUND
ENV_AMBIGUOUS
EDUHARNESS_ENV_INVALID
EDU_REGISTRY_UNAVAILABLE
BRAIN_INDEX_UNAVAILABLE
ARTIFACT_INDEX_UNAVAILABLE
ARTIFACT_UNRESOLVED
SKILL_UNAVAILABLE
SOURCE_UNAVAILABLE
ACCESS_UNAVAILABLE
RUNTIME_INCOMPATIBLE
SOURCE_CONFLICT
REGISTRY_GRAPH_INVALID
SKILL_ROUTE_LOOP
EXECUTION_PLAN_INVALID
REPLAN_BLOCKED
SAVE_FAILED
SAVE_UNVERIFIED
```

Provider-specific detail 可附加於 canonical failure，不得取代 canonical semantics。

## 8. Transaction / Compensation Policy

```text
Intent
→ Human Gate if required
→ provider write
→ read-back
→ verify
→ logical commit
```

若 storage commit 成功但 metadata commit 失敗，預設採：

```text
preserve_and_report
```

不得自動 delete/recreate 模擬 update。Partial commit 必須可被後續 recovery resolution 找回。

## 9. Production Readiness Model

Readiness 分層：

```text
provider_runtime_ready
full_installation_ready
canonical_distribution_ready
```

截至本 canonical plan：

```yaml
provider_runtime_ready: true
full_installation_ready: true
canonical_distribution_ready: true
```

此狀態只代表已完成的 v0.2 production/canonical audit，不代表未來 provider extension 已完成。

## 10. Current Hardening Status

### Closed / incorporated

- Artifact lifecycle：logical artifact → provider read-back → re-resolve → verified。
- Runtime State ephemeral。
- Provider-neutral Kernel。
- Registry typed relation semantics 與 provider capability semantics 分離。
- Google Drive 不再是 default runtime assumption。

### Open / future hardening

1. Notion rich-text / datasource locator normalization 可進一步抽成更完整 adapter normalization specification。
2. Provider capability advertisement 可建立更機械可驗證的 capability descriptor schema。
3. 真實 provider outage drill 尚未執行。
4. Phase 4 no-op mutation exception 可在未來建立獨立 governance audit log/index；本文件先保留歷史。

`storage.update` 不再列為待建立 universal contract；它已定案為 provider-advertised optional capability。

## 11. Migration Strategy

v0.1 Drive installation 不自動搬移。

```text
legacy Drive
→ read-only compatibility assessment
→ migration plan
→ explicit Human Gate
→ provider migration
→ verification
```

不得在 migration 未核准時寫回或刪除 legacy Drive data。

## 12. Phase 6 — Legacy Migration / Provider Extension

**狀態：⏳ FUTURE**

尚未完成：

- v0.1 Drive → v0.2 migration implementation
- Google Drive v0.2 Storage Adapter validation
- OneDrive adapter
- S3 adapter
- Local adapter
- other provider capability descriptors

Future provider 支援不應要求修改 Portable Kernel 核心治理。

## 13. Rollback Strategy

GitHub canonical rollback 與 production provider rollback 必須分離。

GitHub promotion rollback：回到已知 canonical commit，不自動修改 production Control Plane / Storage。

Provider rollback：任何 delete / move / schema rollback / remap 都依 provider capability 與 Human Gate 執行，完成後重新 fresh-start verification。

## 14. Canonical References

- `00_PROJECT_INSTRUCTIONS.yaml`
- `00_EDUHARNESS_ENV_TEMPLATE.yaml`
- `00_EDUHARNESS_DISTRIBUTION.yaml`
- `00_ADMIN/00_EDU_SKILL_REGISTRY.yaml`
- `00_ADMIN/01_BRAIN_INDEX.yaml`
- `docs/BOOTSTRAP_DESCRIPTOR_CONTRACT.md`
- `docs/CONTROL_PLANE_CONTRACT.md`
- `docs/STORAGE_ADAPTER_CONTRACT.md`
- `docs/RUNTIME_STATE_CONTRACT.md`
- `docs/PRODUCTION_READINESS.md`
- `docs/REGISTRY_GRAPH_SCHEMA_V2.md`

## 15. Next Roadmap

```text
Phase 0–5B   v0.2 architecture / production / canonical promotion    ✅ COMPLETE
Kernel v2.0  governance version cutover                              ✅ COMPLETE
Phase 6      legacy migration / provider extension                   ⏳ FUTURE
```
