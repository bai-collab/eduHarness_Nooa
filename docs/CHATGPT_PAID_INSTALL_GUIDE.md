# eduHarness_Nooa｜ChatGPT 新手安裝手冊 v2.0

> 給會使用 ChatGPT、但第一次接觸 eduHarness 的老師。
>
> 目標：依照本手冊完成 eduHarness Cloud 安裝，最後看到 `INSTALLATION_READY`。

- 適用：ChatGPT Web＋eduHarness Cloud v0.2 architecture
- Default profile：Notion Control Plane + Dropbox Storage
- Runtime State：ephemeral

## 你只要完成 5 件事

1. 建立 ChatGPT Project
2. 連接需要的服務（default profile：Notion、Dropbox）
3. 貼上 Project Kernel
4. 輸入安裝指令
5. 確認 fresh-start verification PASS

**不需要先建立 Google Drive 資料夾，也不需要複製 Drive URL。**

---

## 0｜開始前準備

你需要：

1. 一個可使用 Project 的 ChatGPT 帳戶。
2. 可連接 Notion 與 Dropbox 的帳戶／工作區，作為 default installation profile。
3. 對自己要使用的 Notion / Dropbox resources 具備必要讀寫權限。

如果某個連線被管理員停用、沒有連接權限或 connector 不支援必要操作，安裝必須停止並明確回報；不能偷偷改用別人的 installation 或猜 provider locator。

## 1｜建立 ChatGPT Project

1. 在 ChatGPT 建立新的 Project。
2. 專案名稱可使用 `eduHarness_Nooa`。
3. 之後 eduHarness 工作都從這個 Project 開始。

## 2｜連接 default providers

Default profile：

```text
Control Plane = Notion
Storage Provider = Dropbox
```

請在 ChatGPT 可用的 Connected Apps / plugins 中連接自己的 Notion 與 Dropbox。

- Notion 用來承載 ENV / Registry / Brain Index / Artifact Index 等 control-plane resources。
- Dropbox 用來承載 artifacts / output / work_area。

Google Drive 仍可作 optional/legacy Storage Provider 或 migration source，但不是首次安裝必要條件。

## 3｜貼上 Project Kernel

1. 開啟官方 [`00_PROJECT_INSTRUCTIONS.yaml`](../00_PROJECT_INSTRUCTIONS.yaml)。
2. 複製全文。
3. 貼入 Project Instructions。
4. 不要加入自己的 Notion page/database ID、Dropbox ID/path 或 Google Drive URL。

Project Kernel 是 portable governance；installation-specific locator 應留在 Bootstrap Descriptor / ENV / provider records。

## 4｜開始安裝

在 Project 新對話輸入：

```text
請初始化我的 eduHarness Cloud。
請依 eduHarness 官方 GitHub Canonical Distribution，
使用預設 installation profile（Notion Control Plane + Dropbox Storage）完成安裝，
並從 Bootstrap Descriptor 執行 fresh-start read-back verification。
```

系統應完成：

```text
GitHub Distribution
→ provision Control Plane / Storage
→ install logical artifacts
→ Artifact Index mappings
→ Registry / Brain bindings
→ formal ENV
→ Bootstrap Descriptor
→ fresh-start verification
```

## 5｜遇到權限詢問時

可以核准的典型情況：
- 在你自己的 Notion workspace 建立 eduHarness control-plane resources。
- 在你自己的 Dropbox 建立 eduHarness storage folders / artifacts。
- 依已顯示的安裝計畫建立必要 resources。

需要先確認的情況：
- 覆寫既有 production Registry / Brain / Artifact mappings。
- 刪除既有資料。
- 大量搬移或覆寫。
- 使用你沒有指定的其他 provider。
- 將 installation-specific locator 寫回 GitHub Canonical Distribution。

## 6｜怎樣才算安裝成功？

不要只看 ChatGPT 說「完成」。系統必須從 Bootstrap Descriptor 重新開始讀回：

```text
Bootstrap Descriptor
→ ENV
→ Registry / Brain Index / Artifact Index
→ logical artifact
→ Storage Provider
→ stable identity / revision（provider 支援時）
```

並確認 storage roles：

- `artifacts`
- `output`
- `work_area`

全部 required checks PASS 才能看到：

```text
INSTALLATION_READY
```

## 7｜三個最重要的概念

### Bootstrap Descriptor
installation entry。它告訴 runtime 正式 ENV 在哪裡。

### ENV
installation config。它告訴 runtime 使用哪個 Control Plane / Storage Provider，以及對應 locators。

### Artifact Index
把 logical artifact ID 解析成真正的 provider identity。

例如：

```text
brain://curriculum/index
→ artifact://production/knowledge/curriculum/index
→ Artifact Index
→ Dropbox stable ID
```

## 8｜成果會放哪裡？

若沒有特別指定，且 Skill/Registry 沒有其他規則：

- 可交付成果 → `ENV.storage.output`
- 中間工作檔 → `ENV.storage.work_area`

實際位置由 Storage Provider 決定，而不是 Kernel 固定某個 Drive directory。

## 9｜安裝後測試

建立新對話並輸入：

```text
目前我有哪些 skill 可以用？
```

正常情況下，runtime 會從 Descriptor / ENV 解析 production Registry，而不是直接以 GitHub canonical file 當 production SSOT。

## 常見問題

### 我一定要懂 YAML、GitHub 或程式嗎？
不用。一般安裝只需要建立 Project、連接服務、貼 Kernel 與輸入安裝指令。

### 為什麼不用先建 Google Drive？
因為 v0.2 把 Control Plane、Storage、logical artifact identity 分開。Default Storage 改為 Dropbox；Google Drive 只是 optional adapter。

### 一定要用 Notion + Dropbox 嗎？
這是目前 Canonical Distribution 的 default profile，不是 Kernel 唯一可能的 provider。其他 provider 必須符合 Control Plane / Storage Adapter contracts，並且當次 runtime 有對應工具與權限。

### ChatGPT 說找不到 Descriptor？
代表 installation entry 不存在或不可唯一解析。應修復 Descriptor / ENV；不要改用 GitHub 或模型記憶猜 production locator。

### 沒看到 INSTALLATION_READY？
代表至少一個 required read-back 尚未通過。保留錯誤訊息，依 failure code 修復，不要自行刪除 storage/control-plane resources。

---

## 最後記住四件事

1. Project Kernel = 固定治理規則。
2. Bootstrap Descriptor = installation entry。
3. Notion + Dropbox = default profile，不是 Kernel 硬編碼唯一 provider。
4. `INSTALLATION_READY` = fresh-start read-back 全部 PASS。

> ChatGPT 介面與 Connected Apps 能力可能更新；實際操作以當次可用功能與權限為準。
