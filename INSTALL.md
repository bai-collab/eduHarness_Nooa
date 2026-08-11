# eduHarness_Nooa｜教師安裝指南

## 適用環境
本安裝流程適用於 ChatGPT Web / Gemini Spark 的 eduHarness Cloud。

- GitHub：Canonical Distribution 與功能演進來源。
- Google Drive：每位教師自己的 Cloud runtime installation。
- Project Kernel：`00_PROJECT_INSTRUCTIONS.yaml`。
- ENV：`00_EDUHARNESS_ENV.yaml`；installation-specific Google Drive URL / ID 只放 ENV。
- Stable Distribution Manifest：`00_EDUHARNESS_DISTRIBUTION.yaml`。

> 一般升級不用重新貼 Project Instructions。只要 Kernel 仍相容，更新會發生在教師自己的 Drive installation。

## 安裝前準備
1. 確認 ChatGPT Web 已連接你自己的 Google Drive 帳號。
2. 在自己的 Google Drive 建立新的空白資料夾，例如 `eduHarness_Nooa`。
3. 複製該資料夾 URL。不要使用其他人的 Drive URL。

## Step 1｜首次建立 ChatGPT Project
1. 建立新的 ChatGPT Project。
2. 取得官方 `00_PROJECT_INSTRUCTIONS.yaml`。
3. 將檔案全文原封不動貼入 Project Instructions。
4. 不要把自己的 Drive URL 寫進 Project Instructions。

這一步只在首次建立 Project，或未來 Distribution 明確宣告 Kernel breaking change 時需要。

## Step 2｜執行安裝指令
在 Project 對話中貼上：

```text
安裝 eduHarness Cloud
這是我的 Google Drive root：
<貼上你的 Google Drive 資料夾 URL>

請依官方 GitHub Canonical Distribution 建立完整 installation，
完成後重新從正式 ENV 執行 bootstrap 驗證。
```

教師不需要提供 Distribution URL；Project Kernel 會從官方 upstream 解析。

## Step 3｜系統應完成的工作
1. 驗證 Drive root 可讀且可寫。
2. 讀取 `00_EDUHARNESS_DISTRIBUTION.yaml`。
3. 驗證 Kernel / Registry schema compatibility。
4. 建立標準 installation 結構。
5. 安裝：
   - `00_ADMIN/00_EDU_SKILL_REGISTRY.yaml`
   - `00_ADMIN/01_BRAIN_INDEX.yaml`
   - `00_ADMIN/REGISTRY_V2_1_RUNTIME_STATE_BUILDER.yaml`
   - `00_ADMIN/REGISTRY_V2_1_RUNTIME_AUDIT_TRACE_CONTRACT.yaml`
   - `00_ADMIN/REGISTRY_V2_1_RUNTIME_TRACE_ADAPTER.yaml`
   - 完整 `00_ADMIN/SKILLS/**` packages
   - Distribution-managed `10_KNOWLEDGE_BASE/課綱_各領域/**`
6. 課綱至少必須包含 `README_課綱索引.md` 與 Manifest 要求的各領域課綱；安裝後教案 Skill 依領域／學習階段按需讀取，不預載全部課綱。
7. 建立正式 `00_EDUHARNESS_ENV.yaml`，其中 `workspace.drive_root` 使用老師提供的 URL。
8. 不複製其他 installation 的私人 Knowledge、Experience、Error Log、Workspace、Output 或 Archive。
9. 重新從正式 ENV 讀取 Registry、Brain Index、runtime contracts、Skills 與 curriculum resources。
10. 全部 read-back PASS 才可回報 `INSTALLATION_READY`；課綱缺失時必須失敗，不得把空 Knowledge Base 視為完成安裝。

## 安裝後結構
```text
eduHarness_Nooa/
├── 00_EDUHARNESS_ENV.yaml
├── 00_ADMIN/
│   ├── 00_EDU_SKILL_REGISTRY.yaml
│   ├── 01_BRAIN_INDEX.yaml
│   ├── REGISTRY_V2_1_RUNTIME_STATE_BUILDER.yaml
│   ├── REGISTRY_V2_1_RUNTIME_AUDIT_TRACE_CONTRACT.yaml
│   ├── REGISTRY_V2_1_RUNTIME_TRACE_ADAPTER.yaml
│   └── SKILLS/
├── 10_KNOWLEDGE_BASE/
│   └── 課綱_各領域/
│       ├── README_課綱索引.md
│       └── <各領域課綱 Markdown>
├── 20_TEMPLATES/
├── 30_EXPERIENCE/
├── 40_ERROR_LOG/
├── 50_WORKSPACE/
├── 80_SHARED_RESOURCES/
├── 90_OUTPUT/
├── 98_REVIEW_LATER/
└── 99_ARCHIVE/
```

`10_KNOWLEDGE_BASE/課綱_各領域` 由 Distribution 管理；教師自行加入 `10_KNOWLEDGE_BASE` 其他位置的教材、校本資料與教學筆記屬 user-owned，不得因一般升級被刪除或覆寫。

## 之後如何升級？
在原本的 Project 直接輸入：

```text
升級 eduHarness Cloud 到最新版
```

正常升級：
- 不重新貼 Project Instructions。
- 不替換正式 ENV。
- 不覆寫老師的 user-owned Knowledge / Experience / Workspace / Output。
- 可更新 Distribution-managed `10_KNOWLEDGE_BASE/課綱_各領域`，但不能把整個 Knowledge Base 當成 overwrite 單位。
- Brain Index 預設保留；若缺少 curriculum entry，只允許依 Manifest 做 additive migration，不能整份以 canonical Brain Index 覆寫 local index。
- 先 snapshot 受管理的 Registry / runtime contracts / Skill packages / curriculum resources；若需 Brain Index migration，也先 snapshot local Brain Index。
- 顯示 upgrade scope 與 rollback plan。
- 在 managed production overwrite / Brain Index migration 前取得 Human Gate。
- 更新後重新由原 ENV bootstrap 驗證；失敗就 rollback managed resources。

完整升級規則見 `docs/INSTALL_UPGRADE.md`。

## 安全與 Portability
- ENV 是 installation locator，不是 credential。
- 除正式 ENV 外，Kernel、Registry、Brain Index、runtime contracts、Skills 不得保存 installation-specific Drive URL/ID。
- Distribution 不能包含私人 Brain、學生個資、tokens、cookies、credentials、private keys。
- Skill 更新以完整 package 為單位，不能只更新 `SKILL.md` 而漏掉 references/templates/assets。
- 課綱更新只限 Distribution-managed curriculum subtree；不得覆寫其他教師 Knowledge。
- Brain Index migration 必須保留既有 entries；無法可靠 additive merge 時停止。
- 既有 production managed resources 的覆寫、批次搬移、rollback 都需 Human Gate。
- 工具沒有實際成功並 read-back 時，不得宣稱安裝或升級完成。

## 目前 Stable Runtime Contract
- Project Kernel：`eduHarness Cloud v1.4.1 Compact Portable Kernel`
- Registry schema：`2`
- routing guard contract：`2.1`
- State Builder：required
- Observability：Audit Trace Contract + Runtime Trace Adapter
- installed cloud skills：`17`
- curriculum standards：required Distribution resource

## 常見失敗狀態
- `INSTALL_ROOT_REQUIRED`
- `ACCESS_UNAVAILABLE`
- `DISTRIBUTION_NOT_FOUND`
- `DISTRIBUTION_INVALID`
- `INSTALL_ENV_INVALID`
- `EDU_REGISTRY_UNAVAILABLE`
- `BRAIN_INDEX_UNAVAILABLE`
- `BRAIN_INDEX_MIGRATION_FAILED`
- `CURRICULUM_RESOURCE_INCOMPLETE`
- `SKILL_PACKAGE_INCOMPLETE`
- `UPGRADE_PREFLIGHT_FAILED`
- `UPGRADE_VERIFICATION_FAILED`
- `SAVE_FAILED`
- `SAVE_UNVERIFIED`

## 驗收標準
只有新 installation 能從正式 ENV 重新發現 Registry、Brain Index、State Builder、Observability contracts、完整 Skills 與必要 curriculum resources，且 ENV 以外沒有 installation-specific locator，才可回報：

`INSTALLATION_READY`

升級則只有 user-owned Knowledge / local Brain Index 既有 entries / preserve set 未被破壞、managed resources（含 curriculum subtree）全部更新且重新 bootstrap PASS，才可回報：

`UPGRADE_READY`
