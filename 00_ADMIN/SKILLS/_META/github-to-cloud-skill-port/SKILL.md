---
name: github-to-cloud-skill-port
description: >
  將 GitHub Canonical Distribution 或使用者明確指定的 legacy Code Edition Skill 功能移植、檢查或更新到
  eduHarness Cloud installation；以 Bootstrap Descriptor / ENV 解析實際 Control Plane、Artifact Index 與 Storage Provider，
  保留功能意圖與來源追溯，並把 Code-only 執行方式改寫成 ChatGPT Web / Gemini Spark 可用的 Cloud workflow。
---

# GitHub → Cloud Skill 移植

## 定位
這是 eduHarness Cloud 的管理型 meta Skill，不是一般教學 Skill。

預設上游是 Project Kernel 宣告的 `eduHarness_Nooa` Canonical Distribution；舊 `bai-collab/eduHarness-` 僅為 legacy Code Edition 功能來源，必須由使用者明確指定才讀取。

核心原則：**功能對齊，不做盲目鏡像；logical identity 與 provider locator 分層。**

## 觸發
- 同步 GitHub skill
- 移植 eduHarness skill
- 更新 Cloud skill
- 檢查 Cloud skill 是否落後 GitHub
- 把 GitHub skill 安裝到目前 eduHarness Cloud installation

一般教案、命題、教材、研究或文件任務不得觸發。

## Canonical / Runtime boundary
- GitHub = Canonical Distribution，不是 production runtime SSOT。
- Bootstrap Descriptor = installation entry。
- ENV = installation config。
- Registry = capability/routing SSOT。
- Artifact Index = logical `artifact://` → provider identity resolution。
- Storage Provider = Skill package 實體內容位置。
- Default profile 可為 Notion Control Plane + Dropbox Storage；不得把任何 provider 寫死成 Kernel 唯一 implementation。
- Google Drive 僅為 optional/legacy Storage Provider 或 migration source，不得作本 Skill 的固定 runtime root。

## 上游與目標解析
### 上游
- repository：從 Project Kernel `upstream.repository` resolve。
- branch：從 Project Kernel `upstream.branch` resolve。
- canonical skill identity/path：依 Distribution Manifest / Registry 實際宣告解析，不猜路徑。
- legacy repository：`https://github.com/bai-collab/eduHarness-.git`，僅在使用者明確要求 Code Edition migration 時使用。

### Production target
1. 由正式 Bootstrap Descriptor 定位正式 ENV。
2. 由 ENV 解析 `control_plane.registry`、`control_plane.artifact_index`、`storage.artifacts`。
3. 讀 production Registry；不得以 GitHub canonical Registry 取代 production SSOT。
4. 若目標 Skill 已有 logical artifact mapping，經 Artifact Index 解析實際 provider identity。
5. 實際讀取既有 Cloud Skill package 與必要 subresources。

若 Descriptor / ENV / Registry / Artifact Index 無法唯一解析，停止，不猜 provider locator。

## 必要輸入
至少要有下列之一：
1. GitHub skill_id；
2. GitHub canonical path；
3. 使用者明確指出要同步的 Skill 名稱。

若名稱無法唯一對應則停止並列候選，不自行猜測。

操作模式：
- `install`：production 尚無此 Skill logical artifact，建立 Cloud 版。
- `update`：production 已有 Skill，先比較再做最小必要更新。
- `check`：只比較，不寫入。

未指定模式時：無 production Skill 則 install；已有則先 check，再依使用者原始更新意圖決定是否 update。

## 執行流程

### 1. Fresh resolve installation
- Descriptor → ENV → Registry / Artifact Index → Storage Provider。
- 讀 Registry 確認 skill_id / namespace / relations / source metadata。
- 讀 Artifact Index 確認 logical artifact mapping 與 provider identity。
- 若 provider 支援 revision/version，記錄 current revision 作 diff/recovery evidence。

### 2. 讀取 GitHub 上游
實際讀取最新版 GitHub Registry/Manifest 與指定 Skill package 必要內容，不得只依搜尋摘要、README 或模型記憶移植。

至少記錄可取得的：
- upstream_repository
- upstream_branch
- upstream_path 或 logical source
- upstream_commit / version / SHA
- skill_id / namespace_id
- display name

GitHub 無法存取時回報 `SOURCE_UNAVAILABLE`，不得更新 Cloud Skill。

### 3. 讀取既有 Cloud Skill
若 production 已有同 skill identity，必須先透過 Artifact Index → Storage Provider 實際讀取既有 package，再修改。

若 Cloud 與 GitHub 有刻意不同的 runtime 設計，保留差異並納入比較，不把 functional adaptation 自動判為錯誤。

### 4. 建立 Functional Parity Matrix
逐項比較：
- purpose / responsibility
- trigger / anti-trigger
- required inputs
- workflow stages
- output contract
- stopping rules
- verification / quality gate
- typed relations / routing impact
- safety / Human Gate
- runtime assumptions
- required subresources

狀態：`KEEP` / `ADAPT` / `DEFER` / `DROP` / `CONFLICT`。

### 5. Runtime Adaptation
下列 Code-only 行為不得原樣複製：shell、Node.js、Git CLI、本機絕對路徑、`.claude/`/`.agents/` projection、hooks、daemon、background loop、provider-specific local MCP 安裝程序。

轉換原則：
- 本機檔案讀寫 → 當次 Storage Adapter / artifact tools。
- Git 操作 → GitHub connector；無工具則 deferred。
- shell verifier → instruction-level verify + 真實 tool result read-back。
- local artifact → logical artifact + Artifact Index + Storage Provider。
- hooks/background loop → execution cycle 或明確排程；不得假裝 runtime hook 存在。
- 無 Cloud 等價能力 → `RUNTIME_INCOMPATIBLE`，不可偷偷省略核心功能。

### 6. 產生 Cloud Skill candidate
若功能意圖等價，優先沿用相同 `skill_id` / `namespace_id`。

至少包含：name/description、定位、trigger/anti-trigger、必要輸入、Cloud procedure、output contract、stopping rules、verification、Human Gate、runtime boundary、upstream metadata。

不得把 installation-specific Notion/Dropbox/Drive locator 寫入 Skill package。

### 7. Breaking-change Gate
以下任一情況寫入前停在 Human Gate：
- 刪除既有 Cloud 功能；
- output contract 重大改變；
- Skill identity 改變；
- requires/routes/conflicts/replaces 等 routing semantics 重大改動；
- Cloud 與上游產生 `CONFLICT`；
- 批次同步；
- Artifact Index remap；
- 可能破壞其他 Skill routing。

一般非破壞性的單一 Skill install/update，在使用者已明確要求且 scope 精確時可執行；任何額外 governance mutation 不可沿用既有 Gate。

### 8. Production write
成功 install/update 時：
1. 將完整 Skill package 寫入 `ENV.storage.artifacts` 所解析的 Storage Provider；不得只寫 `SKILL.md` 而遺漏 required subresources。
2. 寫入後取得 provider identity / revision（若支援）並 read-back。
3. 建立或更新 Artifact Index 的 logical `artifact://` mapping。
4. 更新 production Registry 的 Skill resolution/source metadata；typed relations 必須保留 Registry schema v2 semantics。
5. 單純 Skill install/update 不更新 Brain Index；只有新增或變更 Knowledge/Template/Experience/Error Log/Shared Resource logical entry 時才更新 Brain Index。
6. 重新從 Descriptor fresh-read Registry → logical artifact → Artifact Index → Storage Provider，並讀取 Skill 全文與必要 subresources。
7. 掃描 package / Registry，不得含 installation-specific Notion page/database ID、Dropbox stable ID/path、Google Drive URL/ID 或其他 installation locator。

若任何 required write 已成功但後續 mapping/Registry/read-back 失敗，不得宣稱同步完成；依 failure/recovery contract 回報 partial state。

## Registry 建議 metadata
Registry 保存 portable identity / routing / source metadata，不保存 installation-specific storage locator。Storage identity 由 Artifact Index 管理。

範例：
```yaml
- id: lesson-plan-authoring
  namespace_id: edu:lesson-plan-authoring
  metadata: {type: workflow, role: primary-capability}
  source:
    kind: github-port
    repository: <verified repository>
    branch: main
    upstream_path: <verified path>
    upstream_commit: <verified commit>
  cloud:
    port_mode: functional-adaptation
    sync_status: current | adapted | upstream_changed | conflict | deferred
```

## Check mode output
`check` 不修改 production，只輸出：
1. Skill identity
2. GitHub upstream version/commit（若可取得）
3. Production Registry / Artifact mapping / storage identity 現況
4. Functional Parity Matrix
5. 新增/修改/刪除差異
6. Runtime compatibility
7. `CURRENT` / `UPDATE_AVAILABLE` / `CLOUD_DIVERGENCE_INTENTIONAL` / `CONFLICT` / `RUNTIME_INCOMPATIBLE`
8. 建議下一步

## 停止規則
- Descriptor / ENV 無法唯一解析 → 停止。
- Registry unavailable/invalid → 停止。
- Artifact Index unavailable/unresolved → 停止。
- GitHub 指定 Skill 無法實際讀取 → 停止。
- 名稱無法唯一解析 → 停止並列候選。
- graph invalid / dependency cycle / route loop → 停止。
- Code 功能無 Cloud 等價能力且屬核心功能 → 不得宣稱完整移植。
- required subresource 遺失 → `SKILL_PACKAGE_INCOMPLETE`。
- 寫入後未能 read-back → `SAVE_UNVERIFIED`。
- canonical Skill/Registry 含 installation-specific locator → `PORTABILITY_VIOLATION`。

## Failure codes
適用時使用：`EDUHARNESS_DESCRIPTOR_NOT_FOUND`、`EDUHARNESS_DESCRIPTOR_INVALID`、`EDUHARNESS_ENV_NOT_FOUND`、`EDUHARNESS_ENV_INVALID`、`EDU_REGISTRY_UNAVAILABLE`、`ARTIFACT_INDEX_UNAVAILABLE`、`ARTIFACT_UNRESOLVED`、`SOURCE_UNAVAILABLE`、`ACCESS_UNAVAILABLE`、`RUNTIME_INCOMPATIBLE`、`REGISTRY_GRAPH_INVALID`、`SKILL_ROUTE_LOOP`、`SAVE_FAILED`、`SAVE_UNVERIFIED`。

## 核心規則
**同步 = 讀 GitHub → 比較 production → functional adaptation → 寫 Storage artifact → Artifact Index mapping → Registry update → Descriptor fresh-start read-back。**

不是把 GitHub `SKILL.md` 直接覆蓋到某個固定 Google Drive path。
