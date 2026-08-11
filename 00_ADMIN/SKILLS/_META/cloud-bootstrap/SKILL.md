---
name: cloud-bootstrap
description: >
  初始化、散布安裝、移植或修復 eduHarness Cloud installation。
  可從空白環境建立標準 Drive 架構，或依正式 Distribution Manifest
  將唯讀 upstream 重建為使用者自己的 installation，建立正式 ENV、
  Registry、Brain Index 與必要 Skills，並驗證 installation 可被 Portable Kernel 發現。
---

# eduHarness Cloud Bootstrap

## 定位

`cloud-bootstrap` 是 eduHarness Cloud 的 installation lifecycle meta Skill。

支援四種模式：

1. `empty_bootstrap`：從空白 Google Drive 建立新的 eduHarness Cloud installation。
2. `distribution_install`：從合法、唯讀的 eduHarness Distribution 建立使用者自己的 installation；Distribution 是安裝來源，不是 runtime workspace。
3. `move`：將既有 installation 搬移到新的 Drive root。
4. `repair`：修復缺少或失效的 bootstrap 資源。

一般教案、命題、教材或研究任務不得觸發。

## 觸發

- 初始化 eduHarness Cloud
- 安裝 eduHarness Cloud
- 安裝 eduHarness_Nooa
- 從 Distribution 安裝 eduHarness
- 幫我建立 eduHarness Cloud 架構
- 依模板建立 ENV
- 搬移 / 複製 eduHarness Cloud 到新的 Drive
- 修復 eduHarness Cloud bootstrap

## 模式判定

- `empty_bootstrap`：從空白 Drive 建立 installation，未指定 Distribution source。
- `distribution_install`：從正式 Distribution、公開母版或其他可辨識 eduHarness Distribution 建立自己的 installation。
- `move`：將既有 installation 搬移或複製到另一個 Drive root。
- `repair`：修復既有 installation 的 bootstrap resource。

若無法唯一判定模式，不得自行選擇可能覆寫既有資料的模式。

## Distribution Contract

`distribution_install` 必須從 Project Kernel 宣告的官方 GitHub upstream 解析並讀取合法 `00_EDUHARNESS_DISTRIBUTION.yaml`。教師只需提供自己的 Google Drive installation root。

Canonical Distribution 由 Project Kernel 宣告的官方 GitHub upstream 提供；Google Drive 僅作為各使用者的 Cloud runtime installation。Distribution 與 Installation 必須視為不同 resource scope。不得將 GitHub Distribution 當成使用者 runtime workspace，也不得把其他 installation-specific locator 寫入 local ENV。

Distribution locator 只代表資源位置，不代表 authorization。所有寫入只能使用當次 runtime 實際提供的能力、authenticated user identity 與其實際 ACL。ENV 不得作為 credential。

## Distribution Privacy Rule

Distribution 不應預設散布 installation owner 的私人 Brain 或 working data。`10_KNOWLEDGE_BASE`、`30_EXPERIENCE`、`40_ERROR_LOG`、`50_WORKSPACE`、`90_OUTPUT`、`98_REVIEW_LATER`、`99_ARCHIVE` 預設建立新的 local resource，不因 upstream 存在內容就自動複製。

私人 Brain、學生個資、secrets、tokens、cookies、credentials、private keys 與 installation-specific working state 不得進入 Distribution。

## Resource Action Contract

- `copy`：複製單一來源資源到 destination，完成後必須讀回驗證。
- `reconstruct`：依 Manifest 與可讀來源在 destination 重建結構與內容；不得假設 runtime 一定有 recursive folder-copy API。
- `create`：只建立 installation-side 新資源，不複製 upstream 私人內容。
- `generate-env`：依實際 destination installation 產生 `00_EDUHARNESS_ENV.yaml`，不得直接複製 upstream 正式 ENV。

## 必要輸入

依模式決定。

- `empty_bootstrap`：需要可唯一識別的目標 Google Drive 根目錄。
- `distribution_install`：需要可唯一識別且可讀的 Distribution source，以及 runtime 對 authenticated user's Google Drive 具必要寫入能力。使用者未指定目標 root 時，可依 Manifest 的 `installation.default_root_name` 建立新 root；若同名或疑似既有 installation 已存在，不得直接覆寫。
- `move`：需要可唯一識別的 source installation 與 destination root。
- `repair`：需要可唯一識別的既有 installation root。

若為新使用者，還可提供：
- installation name
- owner label
- 是否啟用 Literature Library
- Literature Library Drive root（若有）

無法唯一識別目標根目錄時停止，不猜測。

## 標準結構

目標根目錄至少包含：

- `00_EDUHARNESS_ENV.yaml`
- `00_ADMIN/`
- `00_ADMIN/00_EDU_SKILL_REGISTRY.yaml`
- `00_ADMIN/01_BRAIN_INDEX.yaml`
- `00_ADMIN/SKILLS/`
- `10_KNOWLEDGE_BASE/`
- `20_TEMPLATES/`
- `30_EXPERIENCE/`
- `40_ERROR_LOG/`
- `50_WORKSPACE/`
- `80_SHARED_RESOURCES/`
- `90_OUTPUT/`
- `98_REVIEW_LATER/`
- `99_ARCHIVE/`

## 執行流程

1. `select_mode`
   - 判定 `empty_bootstrap`、`distribution_install`、`move` 或 `repair`。

2. `resolve_distribution_if_required`
   - 僅 `distribution_install` 執行；實際讀取 `00_EDUHARNESS_DISTRIBUTION.yaml`，不得依資料夾名稱猜測。

3. `validate_manifest`
   - 確認 schema、`manifest_kind == eduHarness-distribution`、edition、installer、strategy、required resources、env generation 與 verification contract。
   - 不合法 → `DISTRIBUTION_INVALID`。

4. `validate_distribution_resources`
   - 實際確認所有 `required: true` 的來源存在且可讀；缺少 → `SOURCE_UNAVAILABLE`。

5. `inspect_target`
   - 實際列出目標 Drive 根目錄。
   - 不因資料夾名稱相似就推定為 eduHarness installation。

6. `check_existing_env`
   - 尋找正式 `00_EDUHARNESS_ENV.yaml`。
   - `00_EDUHARNESS_ENV_TEMPLATE.yaml` 只作模板，不視為正式 ENV。

7. `plan_changes`
   - Distribution install 依 Manifest 建立 `resource_plan`，區分 create / copy / reconstruct / generate / preserve / conflicts。
   - 列出缺少資料夾、控制檔與預計建立/修改項目。
   - 已存在內容不得直接覆蓋。

8. `human_gate_if_destructive`
   - 若需覆寫既有 ENV、Registry、Brain Index、Skill 或批次搬移資料，先取得使用者明確核准。

9. `create_or_repair_structure`
   - Distribution install 的 destination root 必須位於 authenticated user's 可寫 workspace，不得建立在 upstream Distribution scope。

10. `execute_distribution_resource_plan`
   - 僅 `distribution_install` 執行；依 dependency-safe 順序執行 create → copy → reconstruct → generate-env。
   - 每一項只有工具成功且讀回驗證後才標記完成。
   - 只建立缺少項目。
   - 一般新安裝可建立標準空資料夾與初始控制檔。

11. `create_env`
   - 正式檔名固定為 `00_EDUHARNESS_ENV.yaml`。
   - 填入該 installation 的 Drive root 與相對路徑。
   - 個人/環境 URL 只放 ENV，不寫入 Project YAML。

12. `initialize_registry_and_index`
   - 建立或確認 EDU Registry 與 Brain Index。
   - Registry 管 Skill；Brain Index 管 Knowledge / Template / Experience / Error / Shared Resource discovery。

13. `install_core_meta_skills`
   - 至少確認 `cloud-bootstrap` 可被 Registry 發現。
   - 若使用者要求 GitHub→Cloud 移植能力，再確認 `github-to-cloud-skill-port`。

14. `verify_locality`
   - Distribution install 額外確認 ENV drive root、Registry、Brain Index 與 Skills resolver 均落在 destination installation scope；若仍錯誤指向 upstream → `INSTALL_ENV_INVALID`。

15. `verify`
   - 重新讀取 ENV。
   - 依 ENV 實際讀取 Registry 與 Brain Index。
   - 驗證路徑存在且不產生多個正式 ENV ambiguity。

16. `finish`
   - 只有所有必要寫入與讀回驗證成功後，才能回報 `READY`。

## ENV 規則

正式 runtime anchor：

`00_EDUHARNESS_ENV.yaml`

模板：

`00_EDUHARNESS_ENV_TEMPLATE.yaml`

Portable Kernel 只搜尋正式 anchor；模板不得參與 runtime discovery。

ENV 至少應定義：

```yaml
schema_version: 1
env_kind: "eduHarness-cloud"
installation:
  edition: "cloud"
workspace:
  drive_root: "<actual Drive root>"
  registry: "00_ADMIN/00_EDU_SKILL_REGISTRY.yaml"
  brain_index: "00_ADMIN/01_BRAIN_INDEX.yaml"
  skills: "00_ADMIN/SKILLS"
```

## 停止規則

- 目標 Drive 根目錄無法唯一確認 → 停止。
- 已存在多個正式 `00_EDUHARNESS_ENV.yaml` 且無法判定目標 → `❗ ENV_AMBIGUOUS`。
- ENV 無法讀取 → `⏳ EDUHARNESS_ENV_UNAVAILABLE`。
- Registry 無法建立/讀回 → `⏳ EDU_REGISTRY_UNAVAILABLE`。
- Brain Index 無法建立/讀回 → `⏳ BRAIN_INDEX_UNAVAILABLE`。
- 需要破壞性覆寫而未取得核准 → 停止。
- 寫入後無法重新讀取驗證 → `⏳ SAVE_UNVERIFIED`。
- Distribution 找不到 → `⏳ DISTRIBUTION_NOT_FOUND`。
- Distribution Manifest 不合法 → `⏳ DISTRIBUTION_INVALID`。
- Runtime 缺少必要安全操作能力 → `⏳ RUNTIME_INCOMPATIBLE`。
- Installation root 衝突且無法安全處理 → `⏳ INSTALL_ROOT_EXISTS`。
- ENV 生成失敗 → `⏳ INSTALL_ENV_GENERATION_FAILED`。
- ENV 指向錯誤 resource scope → `⏳ INSTALL_ENV_INVALID`。

## 核心規則

**Project YAML 是可分享的 Portable Kernel；個人環境差異只進 ENV。**

- Canonical Distribution 位於 Project Kernel 宣告的官方 GitHub upstream；Google Drive 僅作為使用者 runtime installation。
- Distribution 與 Installation 必須維持不同 resource scope。
- ENV 是 locator / installation configuration，不是 credential。
- 新增 Skill / Knowledge 不應修改 Project YAML。
- 不假設 runtime 具有 recursive folder-copy、shell、Git CLI、daemon 或其他未確認能力。
- 所有完成宣稱必須建立在實際工具成功與 read-back verification。
- 私人 Brain 與 installation working data 不得因 Distribution install 被自動散布。
- 既有資料不得 blind overwrite。
- 未知資訊不得自行補完。
