---
name: github-to-cloud-skill-port
description: >
  將 GitHub eduHarness Code Edition 的指定 Skill 功能移植、檢查或更新到
  Google Drive eduHarness Cloud，保留功能意圖與來源追溯，同時把 Code-only
  執行方式改寫成 ChatGPT Web / Gemini Spark 可用的 Cloud workflow。
---

# GitHub → Cloud Skill 移植

## 定位

這是 eduHarness Cloud 的管理型 meta Skill，不是一般教學 Skill。
用途是讓 GitHub `bai-collab/eduHarness-` 繼續作為主要功能開發來源，
再把指定 Skill 的「能力」移植到 Google Drive Cloud Edition。

核心原則：**功能對齊，不做盲目鏡像。**

## 觸發

只有使用者有明確 Skill 管理意圖時觸發，例如：

- 同步 GitHub skill
- 複製某個 eduHarness skill 到 Drive
- 把 GitHub 的某個 skill 移植成 Cloud 版
- 更新 Cloud skill
- 檢查 Cloud skill 是否落後 GitHub

一般教案、命題、教材、研究或文件任務不得觸發。

## 上游與目標

上游：
- repository: `https://github.com/bai-collab/eduHarness-.git`
- branch: `main`
- skill root: `brain/skills`
- registry: 以 GitHub 現行 registry / router 為實際來源，不依對話記憶猜測。

目標：
- 先讀正式 `00_EDUHARNESS_ENV.yaml`。
- Drive root：由 `ENV.workspace.drive_root` resolve。
- Cloud Registry：由 `ENV.workspace.registry` resolve。
- Cloud Skill root：由 `ENV.workspace.skills` resolve。
- Brain Index：由 `ENV.workspace.brain_index` resolve。
- Skill 不得保存 installation-specific Google Drive URL / folder ID / file ID。

## 必要輸入

至少要有下列之一：

1. GitHub skill_id；或
2. GitHub canonical path；或
3. 使用者明確指出要同步的 Skill 名稱。

若名稱可唯一對應既有 GitHub Skill，可直接解析；若無法唯一判定則停止，不自行猜測。

操作模式：
- `install`：Cloud 尚無此 Skill，建立 Cloud 版。
- `update`：Cloud 已有此 Skill，依上游變更做最小必要更新。
- `check`：只比較，不寫入。

未指定模式時：Cloud 無 Skill 則 install；已有 Skill 則先 check，再依使用者原始更新意圖決定是否 update。

## 執行流程

### 1. 解析 Cloud Installation 並讀取 Registry

先讀正式 `00_EDUHARNESS_ENV.yaml`，再依 `ENV.workspace.registry` 實際讀取 Cloud Registry。不得依硬編碼 Drive URL 或模型記憶定位 installation。
確認：

- skill_id 是否已存在；
- Cloud path；
- dependencies；
- 已記錄的 upstream path / version / commit；
- 是否為 meta Skill 或一般 Skill。

Registry 無法讀取時回報 `⏳ EDU_REGISTRY_UNAVAILABLE` 並停止。

### 2. 讀取 GitHub 上游

實際讀取最新版 GitHub registry/router 與指定 Skill 全文。
不得只依搜尋摘要、README 或模型記憶移植。

至少記錄可取得的：

- upstream_repository
- upstream_branch
- upstream_path
- upstream_commit / version / SHA
- skill_id
- display name

GitHub 無法存取時回報 `⏳ UPSTREAM_UNAVAILABLE`，不得更新 Cloud Skill。

### 3. 讀取既有 Cloud Skill

若 Cloud 已有同 skill_id，先實際讀取全文再修改。
不得直接覆寫。

若 Cloud 與 GitHub 有刻意不同的 runtime 設計，保留差異並納入比較，不把差異自動判為錯誤。

### 4. 建立 Functional Parity Matrix

逐項比較：

- purpose / 定位
- trigger / anti-trigger
- required inputs
- workflow stages
- output contract
- stopping rules
- verification / quality gate
- dependencies
- safety / human gate
- runtime assumptions

狀態使用：

- `KEEP`：Cloud 可直接保留。
- `ADAPT`：功能保留但執行方式需改寫。
- `DEFER`：Cloud 目前無可靠等價能力。
- `DROP`：純 Code Edition 技術細節，與 Cloud 功能無關。
- `CONFLICT`：Cloud 現有設計與上游功能意圖衝突，需要 Human Gate。

### 5. Runtime Adaptation

下列 Code-only 行為不得原樣複製：

- shell command
- Node.js script
- Git CLI / git diff / commit workflow
- local filesystem absolute path
- `.claude/` / `.agents/` projection
- hooks
- background daemon
- 真實 while loop guarantee
- provider-specific local MCP 安裝程序

轉換原則：

- 本機檔案讀寫 → Drive / 當次可用檔案工具。
- Git 操作 → GitHub connector 或明確的上游讀取/寫入操作；無工具則 deferred。
- shell verifier → instruction-level verify + 實際工具結果驗證。
- local artifact → Google Drive / Workspace / 平台可交付 artifact。
- hooks / background loop → execution cycle 或使用者明確要求的排程能力；不得假裝 runtime hook 存在。
- 無 Cloud 等價能力 → 明確標記 `⏳ RUNTIME_INCOMPATIBLE`，不可偷偷省略關鍵功能。

### 6. 產生 Cloud Skill

若功能意圖等價，優先沿用相同 `skill_id`。
Cloud Skill 至少包含：

- name / description
- 定位
- trigger / anti-trigger
- 必要輸入
- Cloud 執行流程
- output contract
- stopping rules
- runtime boundary
- verification
- Human Gate（若需要）
- upstream metadata

建議附加：

```yaml
upstream:
  repository: "https://github.com/bai-collab/eduHarness-.git"
  branch: "main"
  path: "<actual path>"
  commit: "<actual commit if available>"

cloud:
  edition: "cloud"
  runtimes:
    - chatgpt_web
    - gemini_spark
  port_mode: "functional-adaptation"
```

不得填入未實際取得的 commit、version 或 path。

### 7. Breaking-change Gate

出現下列任一情況，在寫入前停在 Human Gate：

- 需要刪除既有 Cloud 功能；
- output contract 發生重大改變；
- Skill 改名或 skill_id 改變；
- dependencies 大幅改動；
- Cloud 現有設計與 GitHub 新版產生 `CONFLICT`；
- 使用者要求批次同步多個 Skill；
- 更新可能破壞其他 Cloud Skill routing。

一般非破壞性的單一 Skill install/update，可依使用者明確的同步指令完成，不重複詢問。

### 8. 寫入與 Registry 更新

成功 install/update 時：

1. 將 Cloud Skill 寫入 `00_ADMIN/SKILLS/<skill_id>/SKILL.md`；
2. 更新 `00_ADMIN/00_EDU_SKILL_REGISTRY.yaml`；
3. 只有新增或變更 Knowledge / Template / Experience / Error Log / Shared Resource 索引時才更新 Brain Index；單純新增或同步 Skill 不修改 Brain Index；
4. 重新讀取 Skill 與 Registry 驗證；
5. 執行 portability verification：Skill / Registry 不得包含 installation-specific Google Drive URL、folder ID 或 file ID。若發現 → `PORTABILITY_VIOLATION`，不得宣稱同步完成。

若 Skill 寫入成功但 Registry 失敗：

`⏳ REGISTRY_NOT_UPDATED`

不得宣稱安裝完成。

## Registry 建議欄位

每個由 GitHub 移植的 Cloud Skill 建議保存：

```yaml
- id: "lesson-plan-authoring"
  namespace_id: "edu:lesson-plan-authoring"
  type: "workflow"
  file: "00_ADMIN/SKILLS/lesson-plan-authoring/SKILL.md"
  source:
    kind: "github-port"
    repository: "https://github.com/bai-collab/eduHarness-.git"
    branch: "main"
    upstream_path: "brain/skills/lesson-plan-authoring/SKILL.md"
    upstream_commit: "<verified commit>"
  cloud:
    port_mode: "functional-adaptation"
    sync_status: "current | adapted | upstream_changed | conflict | deferred"
  dependencies: []
```

## 檢查模式輸出契約

`check` 不修改 Drive，只輸出：

1. Skill identity
2. GitHub upstream version/commit（若可取得）
3. Cloud 現況
4. Functional Parity Matrix
5. 新增/修改/刪除差異
6. Runtime compatibility
7. 建議狀態：
   - `CURRENT`
   - `UPDATE_AVAILABLE`
   - `CLOUD_DIVERGENCE_INTENTIONAL`
   - `CONFLICT`
   - `RUNTIME_INCOMPATIBLE`
8. 建議下一步

## 停止規則

- Registry 無法讀取 → 停止。
- GitHub 指定 Skill 無法實際讀取 → 停止。
- 名稱無法唯一解析 → 停止並列候選，不猜測。
- 依賴形成 cycle → `❌ SKILL_DEPENDENCY_CYCLE`。
- Code 功能在 Cloud 無等價能力且屬核心功能 → 不得宣稱完整移植。
- 寫入後未能重新讀取驗證 → `⏳ SAVE_UNVERIFIED`。
- Skill / Registry 含 installation-specific Google Drive locator → `❌ PORTABILITY_VIOLATION`。

## 核心規則

**GitHub 是 Canonical Distribution 與主要功能演進來源；Drive 是各使用者的 Cloud runtime installation。所有 installation-specific Google Drive locator 只由正式 ENV 提供。**

所謂「同步」是：

`讀 GitHub → 比較 Cloud → 保留功能意圖 → Runtime adaptation → 驗證 → 寫入 Drive → 更新 Registry`

不是：

`GitHub SKILL.md → 直接覆蓋 Drive SKILL.md`
