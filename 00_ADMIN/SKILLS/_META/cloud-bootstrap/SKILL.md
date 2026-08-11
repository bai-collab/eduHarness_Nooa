---
name: cloud-bootstrap
description: >
  eduHarness Cloud installation lifecycle meta Skill。支援首次安裝、Distribution 安裝、升級、搬移與修復；
  以 GitHub Canonical Distribution 為散布來源，以教師自己的 Google Drive 為 runtime installation。
---

# eduHarness Cloud Bootstrap

## 定位
`cloud-bootstrap` 負責 installation lifecycle，不處理一般教案、命題、教材或研究任務。

支援五種模式：
1. `empty_bootstrap`：從空白 Drive 建立新的 installation。
2. `distribution_install`：從官方 GitHub Distribution 建立教師自己的 installation。
3. `upgrade`：把既有 installation 的受管理 runtime resources 升級到目前 stable Distribution。
4. `move`：搬移 installation 到新的 Drive root。
5. `repair`：修復缺少或失效的 bootstrap resources。

## 觸發
- 初始化 / 安裝 eduHarness Cloud
- 安裝 eduHarness_Nooa
- 從 Distribution 安裝 eduHarness
- 升級 / 更新 eduHarness Cloud
- 同步我的 installation 到最新版
- 搬移 / 複製 eduHarness Cloud
- 修復 eduHarness Cloud bootstrap

## Canonical Distribution Contract
- Canonical Distribution 固定由 Project Kernel `upstream.repository` / `upstream.branch` 解析。
- 必須讀取 `00_EDUHARNESS_DISTRIBUTION.yaml`，不得依記憶猜版本或資源。
- GitHub Distribution 是唯讀散布來源；Google Drive 才是每位教師自己的 runtime installation。
- Distribution locator 不代表寫入權限；所有寫入依當次 authenticated user / connector ACL。
- 正式 ENV 永遠在教師自己的 Drive 產生，絕不複製他人的正式 ENV。

## Project Instructions 穩定性
一般 Distribution upgrade **不得要求老師重新貼 Project Instructions**。

只要：
- active Project Kernel 仍支援 target Registry schema；且
- Distribution Manifest 沒有宣告 Kernel breaking change，

就保留目前 Project Instructions，僅升級教師 Drive 中受管理的 Registry / runtime contracts / Skill packages。

只有 Kernel 本身有 breaking governance/runtime change，才提出新的 Project Instructions migration，並在執行前取得 Human Gate。

## 新安裝必要輸入
`distribution_install` 必須有：
- 教師自己建立的可寫 Google Drive root URL。

可選：installation name、owner label、Literature Library 設定。

若 root 未提供、不可唯一識別或不可寫，停止，不猜測其他 root。

## 新安裝流程
1. `resolve_distribution`
   - 讀取官方 `00_EDUHARNESS_DISTRIBUTION.yaml`。
2. `validate_manifest`
   - 驗證 `manifest_kind=eduHarness-distribution`、edition、compatibility、required resources。
3. `inspect_target`
   - 列出教師提供的 Drive root，檢查現有內容與正式 ENV。
4. `plan_changes`
   - 建立 create/copy/reconstruct/generate-env resource plan。
5. `human_gate_if_required`
   - 只有涉及覆寫既有 managed resources、批次搬移/刪除等才需要 Human Gate。
6. `create_structure`
   - 建立缺少的 `00_ADMIN` 與標準 workspace folders。
7. `install_managed_resources`
   - Registry、Brain Index、State Builder、Audit Trace Contract、Trace Adapter、完整 Skill packages。
8. `generate_env`
   - 從 `00_EDUHARNESS_ENV_TEMPLATE.yaml` 語意產生教師自己的 `00_EDUHARNESS_ENV.yaml`。
9. `verify`
   - fresh-read ENV → Registry → runtime contracts → Skills；確認無 multiple ENV ambiguity、路徑都在教師自己的 installation。
10. `finish`
   - 全部 read-back PASS 才回報 `INSTALLATION_READY`。

## Upgrade Contract
### 原則
升級只更新 Distribution-managed runtime resources；老師自己的資料不應被當作發行檔覆寫。

### Upgrade preflight
1. 先讀既有正式 `00_EDUHARNESS_ENV.yaml`。
2. 依 ENV fresh-read local Registry、runtime contracts、Skills root。
3. 讀官方 Distribution Manifest。
4. 確認 target Registry schema 在 active Kernel `registry_schema_support` 內。
5. 確認 required Distribution resources 全部存在且可讀。
6. 確認 installation root 唯一且可寫。

任一 preflight 失敗即停止，不做 partial upgrade。

### Upgrade preserve set
預設不得覆寫：
- `00_EDUHARNESS_ENV.yaml`
- 使用者 Knowledge / Experience / Error Log
- 使用者 Templates
- `50_WORKSPACE`
- `80_SHARED_RESOURCES`
- `90_OUTPUT`
- `98_REVIEW_LATER`
- `99_ARCHIVE`
- Brain Index 內容（除非未來明確存在 schema migration，且另外通過 Human Gate）

### Upgrade managed set
可由 Distribution 更新：
- `00_ADMIN/00_EDU_SKILL_REGISTRY.yaml`
- `00_ADMIN/REGISTRY_V2_1_RUNTIME_STATE_BUILDER.yaml`
- `00_ADMIN/REGISTRY_V2_1_RUNTIME_AUDIT_TRACE_CONTRACT.yaml`
- `00_ADMIN/REGISTRY_V2_1_RUNTIME_TRACE_ADAPTER.yaml`
- Distribution-managed `00_ADMIN/SKILLS/**` packages

### Snapshot + Human Gate
在任何 managed production file 被替換前：
1. 將現行 Registry / runtime contracts / 受影響 Skill packages 建立 rollback snapshot 到 `ENV.workspace.work_area`。
2. 顯示 upgrade diff scope、preserve set、rollback plan。
3. 取得明確 Human Gate。

「檢查更新」「同步」「繼續」本身不等於覆寫授權；若使用者已明確要求並核准此次 upgrade scope，才執行 managed overwrite。

### Upgrade execution
依 dependency-safe order：
1. runtime contracts
2. Registry
3. complete Skill packages

Skill 以 folder/package 為單位，不只複製 `SKILL.md`；所有 required references/templates/assets/subresources 必須一起保持完整。

### Upgrade verification
寫入後必須：
1. 保持原正式 ENV 不變並重新 bootstrap。
2. Registry schema / routing guard contract 符合 Manifest。
3. Registry 內所有 Skill target 都能解析。
4. State Builder reference 可讀。
5. Audit Trace Contract / Trace Adapter reference 可讀。
6. installed Skill count 與 Manifest expectation 相符。
7. installation-specific Drive locator 不得出現在 ENV 以外的 Distribution-managed files。
8. user data / workspace / output 未被覆寫。

全數 PASS 才回報 `UPGRADE_READY`。

### Rollback
任何 verification failure：
- 只 rollback 此次 upgrade 的 managed resources；
- 使用 pre-upgrade snapshot 還原；
- 不回滾/刪除教師自己的 ENV、Knowledge、Experience、Workspace、Output；
- rollback 寫入同樣需要 Human Gate；
- rollback 後重新 fresh bootstrap 驗證。

## 標準 Installation 結構
- `00_EDUHARNESS_ENV.yaml`
- `00_ADMIN/00_EDU_SKILL_REGISTRY.yaml`
- `00_ADMIN/01_BRAIN_INDEX.yaml`
- `00_ADMIN/REGISTRY_V2_1_RUNTIME_STATE_BUILDER.yaml`
- `00_ADMIN/REGISTRY_V2_1_RUNTIME_AUDIT_TRACE_CONTRACT.yaml`
- `00_ADMIN/REGISTRY_V2_1_RUNTIME_TRACE_ADAPTER.yaml`
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

## Privacy / Portability
- Distribution 不包含私人 Brain、學生個資、working traces、教師成果。
- secrets/tokens/cookies/credentials/private keys 禁止保存。
- installation-specific Drive URL/ID 只能存在正式 ENV。
- 不假設 shell、Git CLI、recursive folder-copy、daemon 或 background loop；依當次工具能力執行。

## Failure Codes
- `INSTALL_ROOT_REQUIRED`
- `DISTRIBUTION_NOT_FOUND`
- `DISTRIBUTION_INVALID`
- `SOURCE_UNAVAILABLE`
- `RUNTIME_INCOMPATIBLE`
- `INSTALL_ROOT_EXISTS`
- `ENV_AMBIGUOUS`
- `INSTALL_ENV_GENERATION_FAILED`
- `INSTALL_ENV_INVALID`
- `EDU_REGISTRY_UNAVAILABLE`
- `BRAIN_INDEX_UNAVAILABLE`
- `SKILL_PACKAGE_INCOMPLETE`
- `SAVE_FAILED`
- `SAVE_UNVERIFIED`
- `UPGRADE_PREFLIGHT_FAILED`
- `UPGRADE_VERIFICATION_FAILED`
- `UPGRADE_ROLLBACK_FAILED`

## Completion Rule
只有工具實際寫入成功、目的地/parent 正確、read-back verification 全部通過後，才能宣稱 installation 或 upgrade 完成。
