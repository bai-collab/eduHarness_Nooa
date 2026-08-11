# eduHarness_Nooa｜教師安裝指南

## 適用環境

本安裝流程適用於 ChatGPT Web / Gemini Spark 的 eduHarness Cloud。

- GitHub：Canonical Distribution 與功能演進來源。
- Google Drive：每位教師自己的 Cloud runtime installation。
- Project Kernel：`00_PROJECT_INSTRUCTIONS.yaml`，教師需原封不動貼入 ChatGPT Web Project Instructions。
- ENV：`00_EDUHARNESS_ENV.yaml`，所有 installation-specific Google Drive URL / ID 只放在 ENV。

## 安裝前準備

1. 確認 ChatGPT Web 已連接「你自己的」Google Drive 帳號，且該帳號能在自己的 Drive 建立與修改檔案。
2. 在自己的 Google Drive 建立一個新的空白資料夾，例如 `eduHarness_Nooa`。
3. 開啟該資料夾並複製資料夾 URL。這個 URL 是你的 installation root；不要使用其他人的 Drive URL。

## Step 1｜建立 ChatGPT Project

1. 在 ChatGPT Web 建立新的 Project。
2. 取得官方 `00_PROJECT_INSTRUCTIONS.yaml`。
3. 將檔案全文原封不動貼入 Project Instructions。
4. 不要把自己的 Drive URL 寫進 Project Instructions。

## Step 2｜執行安裝指令

在剛建立的 Project 對話中貼上以下文字，只替換 `<貼上你的 Google Drive 資料夾 URL>`：

```text
請初始化我的 eduHarness Cloud。

我的 Google Drive 根目錄：
<貼上你的 Google Drive 資料夾 URL>

請依 eduHarness 官方 Distribution 建立完整 Cloud installation，
完成後重新從 ENV 執行 bootstrap 驗證。
```

教師不需要提供 Distribution URL。Project Kernel 會從官方 upstream 解析 Distribution。

## Step 3｜AI 應完成的安裝工作

安裝程序應：

1. 驗證你提供的 Drive root 可讀且可寫。
2. 讀取官方 `00_EDUHARNESS_DISTRIBUTION.yaml`。
3. 建立標準 installation 結構。
4. 建立或複製 portable Registry、Brain Index 與完整 Skill folders；Skill 的 `references/`、`templates/`、`assets/` 等子資源必須一併保留。
5. 建立正式 `00_EDUHARNESS_ENV.yaml`，其中 `workspace.drive_root` 使用你提供的資料夾 URL。
6. 不將其他 installation 的私人 Knowledge、Experience、Error Log、Workspace、Output、Archive 複製到你的環境。
7. 重新從正式 ENV 讀取 Registry、Brain Index 與 Skills，完成 bootstrap 驗證。
8. 只有全部必要寫入與讀回驗證成功後才能回報 `INSTALLATION_READY`。

## 安裝後應有的結構

```text
eduHarness_Nooa/
├── 00_EDUHARNESS_ENV.yaml
├── 00_ADMIN/
│   ├── 00_EDU_SKILL_REGISTRY.yaml
│   ├── 01_BRAIN_INDEX.yaml
│   └── SKILLS/
├── 10_KNOWLEDGE_BASE/
├── 20_TEMPLATES/
├── 30_EXPERIENCE/
├── 40_ERROR_LOG/
├── 50_WORKSPACE/
├── 80_SHARED_RESOURCES/
├── 90_OUTPUT/
├── 98_REVIEW_LATER/
└── 99_ARCHIVE/
```

## 安全與 Portability 規則

- ENV 是 installation locator，不是 credential。
- 除正式 ENV 外，Kernel、Registry、Brain Index 與 Skills 不得保存 installation-specific Google Drive URL、folder ID 或 file ID。
- Distribution 不能包含私人 Brain、學生個資、tokens、cookies、credentials、private keys。
- 既有資料不得 blind overwrite；需要覆寫、刪除或批次搬移時必須先取得 Human Gate。
- 工具沒有實際成功並讀回驗證時，不得宣稱安裝完成。

## 常見失敗狀態

- 沒有提供自己的 Drive root → `INSTALL_ROOT_REQUIRED`
- Drive root 無法存取或不可寫 → `ACCESS_UNAVAILABLE`
- Distribution 找不到 → `DISTRIBUTION_NOT_FOUND`
- Manifest 不合法 → `DISTRIBUTION_INVALID`
- ENV 指向錯誤 scope → `INSTALL_ENV_INVALID`
- 寫入失敗 → `SAVE_FAILED`
- 寫入後無法讀回 → `SAVE_UNVERIFIED`

## 驗收標準

安裝完成後，AI 必須能從新 installation 的正式 ENV 重新發現並讀取 Registry、Brain Index、Skills，且除了 ENV 外找不到 installation-specific Google Drive locator，才可回報：

`INSTALLATION_READY`
