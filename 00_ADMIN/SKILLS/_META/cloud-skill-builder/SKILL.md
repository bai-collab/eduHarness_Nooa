# eduHarness Cloud Skill Builder

version: 0.2.0
namespace_id: edu:cloud-skill-builder
canonical_name: eduHarness Cloud Skill Builder
type: meta
role: primary-capability
status: active

## Purpose
設計、建立、修改與驗證 eduHarness Cloud Skill package；判斷 create vs extend；整合 Registry schema 2 selection、typed relations、KeyPoint/route guard 與 routing impact analysis；在 production write 前停於 Human Gate。

## Responsibility Boundary
### Owns
- 新增 Cloud Skill 的 contract/package candidate。
- 修改或擴充既有 Cloud Skill 的 candidate。
- create vs extend 判斷。
- package completeness、Registry schema 2、graph/routing impact、regression validation。
- production candidate 到 GitHub Canonical Distribution sync candidate 的設計與驗證。

### Excludes
- installation/upgrade/rollback：交由 `edu:cloud-bootstrap`。
- 已存在 Skill 的 GitHub ↔ Cloud 移植/同步：交由 `edu:github-to-cloud-skill-port`。
- 一般教案、命題、教材、研究等領域工作。
- 未經 Gate 的 production Registry、KeyPoint、route、Artifact Index remap、Skill overwrite、GitHub main 或 Project Kernel 修改。

## Triggers
- 新增 eduHarness Cloud Skill
- 建立 Cloud Skill
- 修改 Cloud Skill
- 擴充 Cloud Skill
- 設計 Skill package
- Skill create vs extend
- Skill routing impact analysis

## Required Inputs
1. 可唯一解析且合法的正式 Bootstrap Descriptor。
2. Descriptor 指向的正式 ENV。
3. ENV 解析出的最新 production Registry 與 Artifact Index。
4. 與需求相關的既有 Skill package；若不足以判定 create vs extend，停止。
5. 使用者對新/修改能力的需求。

## Source Resolution
1. Descriptor → ENV；驗證 `env_kind=eduHarness-cloud`、`installation.edition=cloud`。
2. 由 `ENV.control_plane.registry` 讀 production Registry，不得以 Project 記憶或 GitHub canonical file 猜 production state。
3. 由 `ENV.control_plane.artifact_index` 讀 Artifact Index。
4. 依 Registry logical identity / Artifact Index provider mapping 實際讀取相關 Skill package。
5. 只有需要 Knowledge/Experience/Error Log 時才依 Brain Index on-demand 載入。
6. installation-specific Notion/Dropbox/Drive locator 僅用於當次 runtime resolution，不寫入 portable Skill package candidate。

## Procedure

### 1. Classify and bootstrap
- 確認任務是 create/extend/modify Skill，而非 sync/install/domain work。
- Descriptor → ENV → Registry / Artifact Index → 相關 Skill package。

### 2. Create vs Extend decision
依序檢查：
- Registry 是否已有相同 Primary responsibility？
- 需求是否只是既有 Skill 的模式、output profile 或 supporting procedure？
- 新能力是否具有獨立 trigger、input contract、stopping rule、output responsibility？
- 拆成新 Skill 是否降低耦合而非製造重複？

預設可合理擴充則 extend；只有責任邊界實質不同才 create。

### 3. Define contract
至少定義 identity、purpose/responsibility、triggers、anti-triggers、required inputs、source rules、procedure、output、stopping、failure、Human Gate、runtime boundary、provenance/version。

若參與 routing，再定義 selection intent、Primary/supporting role、typed relations、route evaluation stage、guard dependency facts。

### 4. Build complete package candidate
管理單位為 logical Skill package。`SKILL.md` 必要；references/templates/assets/other files 僅在 procedure 真正依賴時建立並列為 required subresources。

Candidate 預設寫入 `ENV.storage.work_area` 所解析的 Storage Provider；若只需討論設計，可不持久化。

### 5. Registry schema 2 design
- selection 只產生 provisional Primary。
- typed relations 僅使用 `requires` / `enhances` / `routes` / `conflicts` / `replaces` / `supports` 的正式語義。
- route order 固定為 selection → entry_routes → primary_confirmation → requires → enhances → execute → post_execution_routes → verify。
- 不得把六種 typed relations 扁平化成同一 edge semantics。

### 6. KeyPoint decision
新增 Skill 不等於新增 KeyPoint。只有 routing decision 需要可觀察、可驗證、跨 Skill 共用狀態且現有 KeyPoint 無法表達時，才建立 KeyPoint candidate。

禁止把 missing 當 false、用 inferred 觸發 handoff、建立私有 routing flag 或不可由 runtime evidence 確認的抽象 KeyPoint。

### 7. Route guard design
- operator 僅限 Registry 啟用集合。
- handoff 僅 guard=TRUE。
- UNKNOWN/FALSE 保留 current Primary；UNKNOWN 產 diagnostic。
- inferred/conflict 投影 UNKNOWN。
- route 必須標明 entry 或 post_execution。
- 檢查 repeated node + same relevant state 與 max_route_hops。

### 8. Routing impact analysis
必查 trigger overlap、responsibility overlap、entry/post route impact、typed relation cycle/conflict、KeyPoint UNKNOWN/conflict surface、loop risk、regression impact、Human Gate bypass、ChatGPT Web/Gemini Spark portability。

### 9. Validation
Package：SKILL.md、required subresources、無 installation locator、無 secrets/credentials/student PII。

Registry：namespace 唯一、targets 存在、schema supported、guard syntax/type、enum、evaluation stage。

Graph：requires cycle=0、replacement cycle=0、forbidden simultaneous conflict=0、routing loop safety intact。

Artifact：logical `artifact://` identity 與 provider identity 分層；portable package 不嵌入 production provider locator。

Regression：routing 行為變更時新增/更新 fixtures 並重跑受影響 cases。

### 10. Candidate lifecycle
- 預設 candidate → `ENV.storage.work_area`，由實際 Storage Provider 決定位置。
- candidate 驗證成功後，若要寫 production Skill/Registry/KeyPoint/route/Artifact mapping，提出 Human Gate 並列明精確 scope。
- production Skill 寫入後，先取得 provider identity/revision（若支援），再更新 Artifact Index mapping。
- production Registry / Artifact Index read-back 成功後才可建立 GitHub Distribution sync candidate。
- GitHub main publish 再次需要獨立 Human Gate。

## Output Contract
每次執行至少輸出：
- decision: create | extend | modify | blocked
- primary_responsibility
- package_candidate location 或 proposed structure
- registry_entry_candidate（如適用）
- artifact_mapping_candidate（如適用）
- keypoint/route candidates（只有必要時）
- routing_impact_report
- validation_report
- regression evidence（若 routing 受影響）
- human_gate_required + exact scope
- next_action

## Stopping Rules
遇到任一情況停止且不補完：Descriptor/ENV 不可唯一解析、Registry/Artifact Index unavailable/invalid、無法讀取足夠相關 package、route target 不存在、graph invalid、route loop、schema 超出 Kernel support、package incomplete、需要 production Gate 但未核准、write/read-back failure。

## Human Gate Boundary
必須取得明確 Gate 才可：
- 新增/修改 production Registry entry、KeyPoint catalog、production route。
- Artifact Index mapping/remap。
- 重大覆寫既有 Skill procedure。
- 刪除/重新命名 production Skill。
- 批次同步多個 Skill。
- 發布 GitHub Canonical Distribution main。
- 任何可能破壞 routing 的治理修改。

Gate 僅授權當次列明 scope，不可沿用。

## Runtime Boundary
支援 ChatGPT Web / Gemini Spark procedure semantics。不得假設 shell、Git CLI、Node.js、daemon 或 background loop；平台操作由當次可用 tool/runtime adapter 實現。

Default profile 可為 Notion Control Plane + Dropbox Storage，但本 Skill 不把它們當成唯一 provider。Google Drive 僅為 optional/legacy Storage Provider 或 migration source。

## Failure Behavior
適用時回報：`EDUHARNESS_DESCRIPTOR_NOT_FOUND`、`EDUHARNESS_DESCRIPTOR_INVALID`、`EDUHARNESS_ENV_NOT_FOUND`、`ENV_AMBIGUOUS`、`EDUHARNESS_ENV_INVALID`、`EDU_REGISTRY_UNAVAILABLE`、`ARTIFACT_INDEX_UNAVAILABLE`、`ARTIFACT_UNRESOLVED`、`SKILL_UNAVAILABLE`、`SOURCE_UNAVAILABLE`、`ACCESS_UNAVAILABLE`、`REGISTRY_GRAPH_INVALID`、`SKILL_ROUTE_LOOP`、`REPLAN_BLOCKED`、`SAVE_FAILED`、`SAVE_UNVERIFIED`。

## Provenance
- Source plan: `CLOUD_SKILL_BUILDER_DEVELOPMENT_PLAN.md`, Draft 0.1。
- Registry contract: schema_version 2; routing guard contract 2.1。
- v0.2 compatibility cleanup: provider-neutral Descriptor/ENV/Artifact Index architecture；舊 `ENV.workspace.*` / Drive-specific candidate model 不再適用。
