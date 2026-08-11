# eduHarness_Nooa Cloud Installation

## 適用環境

- ChatGPT Web
- Gemini Spark

GitHub `bai-collab/eduHarness_Nooa` 是 Canonical Distribution；每位教師自己的 Google Drive 是 Cloud runtime installation。

## 安裝步驟

1. 在自己的 Google Drive 建立一個空白 eduHarness 根資料夾，複製該資料夾 URL。
2. 建立 ChatGPT Web Project。
3. 從本 repository 讀取 `00_PROJECT_INSTRUCTIONS.yaml`，將全文原封不動貼入 Project Instructions。
4. 在 Project 對話輸入：

```text
請初始化我的 eduHarness Cloud。

我的 Google Drive 根目錄：
<貼上你的 Google Drive 資料夾 URL>

請依 eduHarness 官方 Distribution 建立完整 Cloud installation，
完成後重新從 ENV 執行 bootstrap 驗證。
```

5. `cloud-bootstrap` 應由 Project Kernel 的 `upstream.repository` / `upstream.branch` 解析本 Canonical Distribution，讀取 `00_EDUHARNESS_DISTRIBUTION.yaml`，並在教師自己的 Google Drive root 建立 installation。
6. 正式 runtime ENV 必須由安裝程序依教師實際 Drive root 產生為 `00_EDUHARNESS_ENV.yaml`；不得直接複製其他 installation 的正式 ENV。
7. 安裝完成後，重新從正式 ENV 執行 bootstrap：讀取 ENV → resolve workspace → 讀取 Registry / Brain Index → 驗證 required resources。

## Portability 規則

除 ENV template 的明確 placeholder 外，Canonical Distribution 不得包含 installation-specific Google Drive URL、folder ID 或 file ID。正式個人 Drive locator 只能存在教師自己的 `00_EDUHARNESS_ENV.yaml`。

Distribution 不散布私人 Brain、學生個資、secrets、tokens、cookies、credentials、private keys 或 installation-specific working state。

## 驗證條件

至少驗證：

- `installed_env_exists`
- `installed_env_schema_valid`
- `installed_env_points_to_local_root`
- `registry_readable`
- `brain_index_readable`
- `skills_root_accessible`
- `required_resources_present`
- `no_multiple_runtime_env_anchors`
- `private_brain_not_copied`
- `project_kernel_available_for_manual_install`
- `no_installation_specific_drive_locator_outside_env`

只有必要寫入成功且讀回驗證通過後，才可宣稱 `INSTALLATION_READY`。
