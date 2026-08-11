# eduHarness Cloud｜安裝與升級

本文件對應 `00_EDUHARNESS_DISTRIBUTION.yaml` 與 `cloud-bootstrap`。

## 一句話版本

- **第一次安裝**：老師建立空白 Google Drive root → 建立 ChatGPT Project → 把 `00_PROJECT_INSTRUCTIONS.yaml` 貼入 Project Instructions → 對 ChatGPT 說「安裝 eduHarness Cloud，這是我的 Drive root：...」。
- **之後升級**：不用重貼 Project Instructions。直接在原 Project 說「升級 eduHarness Cloud 到最新版」，系統會讀本機 ENV、檢查 GitHub Distribution、建立 snapshot、顯示影響範圍、取得 Human Gate 後，只更新受管理的 runtime files / Skills。

## 為什麼一般升級不用重貼 Project Instructions？

`00_PROJECT_INSTRUCTIONS.yaml` 是 Portable Kernel，刻意保持穩定。現在的 Kernel `eduHarness Cloud v1.4.1 Compact Portable Kernel` 已支援 Registry schema 2，因此一般 Skill、Registry、State Builder、observability 與 installer 演進，都應在 Drive installation / GitHub Distribution 層處理。

只有未來 Kernel 本身出現 breaking runtime / governance change，Distribution Manifest 才會標示需要 Project Instructions migration。

## 新安裝

### 老師要做的事
1. 在自己的 Google Drive 建立一個空白資料夾，作為 eduHarness root。
2. 複製該資料夾 URL。
3. 建立 ChatGPT Project。
4. 把 GitHub `00_PROJECT_INSTRUCTIONS.yaml` 全文貼入 Project Instructions。
5. 在 Project 對話輸入：

```text
安裝 eduHarness Cloud
這是我的 Google Drive root：<你的資料夾 URL>
```

### 系統會做的事
1. 從 Project Kernel 宣告的 GitHub upstream 讀取 `00_EDUHARNESS_DISTRIBUTION.yaml`。
2. 驗證 Distribution compatibility / required resources。
3. 檢查老師提供的 Drive root 是否可唯一識別與寫入。
4. 建立標準資料夾。
5. 安裝：
   - Registry schema 2
   - Runtime State Builder / guard contract 2.1
   - Audit Trace Contract
   - Runtime Trace Adapter
   - Brain Index
   - 完整 Skill packages
6. 依老師的 Drive root 產生正式 `00_EDUHARNESS_ENV.yaml`。
7. 重新由正式 ENV bootstrap，read-back 驗證所有 required resources。
8. 全部 PASS 才宣稱 `INSTALLATION_READY`。

## 升級

在既有 eduHarness Project 中輸入：

```text
升級 eduHarness Cloud 到最新版
```

系統必須先：
1. 讀正式 local ENV。
2. 讀 local Registry / runtime contracts / Skills。
3. 讀 GitHub stable Distribution Manifest。
4. 做 Kernel compatibility preflight。
5. 比對 managed resources。
6. 對會被覆寫的 Registry / runtime contracts / Skill packages 建 rollback snapshot 到 `ENV.workspace.work_area`。
7. 顯示此次 upgrade scope、保留項目與 rollback plan。
8. 在 managed production overwrite 前取得 Human Gate。

## 升級時會保留什麼？

預設不碰：
- `00_EDUHARNESS_ENV.yaml`
- 老師的 Knowledge / Experience / Error Log
- 老師自己累積的 Templates
- `50_WORKSPACE`
- `80_SHARED_RESOURCES`
- `90_OUTPUT`
- `98_REVIEW_LATER`
- `99_ARCHIVE`
- Brain Index 內容，除非未來真的有明確 schema migration

## 升級時會更新什麼？

Distribution-managed resources：
- `00_ADMIN/00_EDU_SKILL_REGISTRY.yaml`
- `00_ADMIN/REGISTRY_V2_1_RUNTIME_STATE_BUILDER.yaml`
- `00_ADMIN/REGISTRY_V2_1_RUNTIME_AUDIT_TRACE_CONTRACT.yaml`
- `00_ADMIN/REGISTRY_V2_1_RUNTIME_TRACE_ADAPTER.yaml`
- `00_ADMIN/SKILLS/**`

Skill 以完整 package 為單位同步，不允許只更新 `SKILL.md` 卻漏掉 references/templates/assets。

## 升級驗證

更新後必須重新從原正式 ENV 啟動並驗證：
- Registry schema = 2
- routing guard contract = 2.1
- Registry Skill targets 全部存在
- State Builder reference 可讀
- Audit Trace Contract / Trace Adapter 可讀
- installed Skills 數量符合 Distribution Manifest
- user data 沒被覆寫
- installation-specific Drive locator 沒有跑到 ENV 以外

任何一項 FAIL → 使用 snapshot rollback managed resources，並重新 bootstrap 驗證。

## 安全邊界

- GitHub = Canonical Distribution；不是老師的工作區。
- Google Drive = 老師自己的 runtime installation。
- ENV = installation-specific locator，不是 credential。
- 不把別人的 ENV、Drive URL、私人 Brain、學生個資、secrets、tokens 或工作 trace 放入 Distribution。
- 大量覆寫、rollback、正式治理修改都需要 Human Gate。
