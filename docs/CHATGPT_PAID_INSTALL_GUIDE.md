# eduHarness_Nooa｜ChatGPT 付費版新手安裝手冊 v1.0

> 給會使用 ChatGPT、但第一次接觸「專案」的老師。
>
> 目標：照著本手冊操作，完成 eduHarness_Nooa 安裝，最後看到 `INSTALLATION_READY`。

- 適用：ChatGPT Web＋eduHarness Cloud v1.3.2
- 更新日期：2026-08-11
- 圖文完整版 Google 文件：<https://docs.google.com/document/d/1EFl7fx6AfiaExUA-FKUv2BHMSgK9srJ6djPHHcKo80c/edit?usp=drivesdk>

## 安裝路線圖

你只要完成 6 件事：

1. 連接 Google Drive
2. 建立自己的空白資料夾
3. 複製資料夾網址
4. 建立 ChatGPT 專案
5. 貼上專案指令
6. 貼上安裝指令

最後看到 `INSTALLATION_READY`，就代表第一次安裝完成並通過讀回驗證。

---

## 0｜開始前先準備

你需要準備：

1. 一個已登入的 ChatGPT 帳戶。
2. 一個自己的 Google 帳號，而且可以在 Google Drive 建立、修改檔案。
3. 在 ChatGPT 的 **Settings（設定） → 外掛程式** 中，可以找到並連接 Google Drive。

> 重要：請使用「自己的」Google Drive。不要把別人的 eduHarness 資料夾直接當成你的安裝位置。

如果 Google Drive 外掛程式顯示 `Disabled by admin`、沒有 `Connect` 按鈕，或無法取得需要的檔案操作權限，請先處理帳號或管理員權限，再繼續安裝。

## 1｜把 Google Drive 連接到 ChatGPT

1. 打開 ChatGPT。
2. 點自己的頭像 → **Settings（設定）**。
3. 進入 **外掛程式**。
4. 找到 **Google Drive**。
5. 點 **Connect**。
6. 依畫面登入你的 Google 帳號，並同意需要的權限。

如果你同時登入多個 Google 帳號，請確認選的是準備放 eduHarness 的那一個帳號。

eduHarness 安裝需要 ChatGPT 能在你授權的 Google Drive 範圍內讀取並建立檔案。是否啟用 Sync 不作為安裝成功判準；真正要確認的是 Google Drive 檔案操作是否可用。

## 2｜在 Google Drive 建立空白資料夾

1. 打開 Google Drive。
2. 點 **＋ 新增**。
3. 選 **新增資料夾**。
4. 資料夾名稱建議輸入：`eduHarness_Nooa`
5. 建立後，打開這個資料夾。

這時裡面應該是空的，這是正常的。等等會由 ChatGPT 幫你建立 eduHarness 需要的資料夾與檔案。

## 3｜複製 Google Drive 資料夾連結

1. 確定你目前正在剛才建立的 `eduHarness_Nooa` 資料夾裡。
2. 直接複製瀏覽器上方網址列的完整網址。

網址大致會像：

```text
https://drive.google.com/drive/folders/xxxxxxxxxxxxxxxx
```

不用修改網址，也不用自己找資料夾 ID；整串複製即可。

> 不要把這個資料夾設定成「知道連結的任何人都可以編輯」。ChatGPT 使用的是你已連接的 Google 帳號權限，不需要把自己的資料夾公開成可編輯。

## 4｜在 ChatGPT 建立 eduHarness 專案

1. 回到 ChatGPT。
2. 在左側欄找到 **New project（新專案）**。
3. 專案名稱建議輸入：`eduHarness_Nooa`
4. 圖示與顏色可自由選擇，不影響功能。
5. 建立專案後，進入這個專案。

你可以把「專案」想成一個專門給 eduHarness 使用的工作空間。之後要使用 eduHarness，就從這個專案開始新對話。

## 5｜貼上專案指令

eduHarness 需要一份固定的 Project Instructions，讓 ChatGPT 知道怎麼運作。

1. 開啟官方檔案：[`00_PROJECT_INSTRUCTIONS.yaml`](../00_PROJECT_INSTRUCTIONS.yaml)
2. 複製檔案全部內容。
3. 回到你的 `eduHarness_Nooa` 專案。
4. 點專案右上角 `⋯`。
5. 選 **專案設定**。
6. 找到 **Project instructions／專案指令** 欄位。
7. 把 `00_PROJECT_INSTRUCTIONS.yaml` 全文貼進去。
8. 儲存。

> 請整份原封不動貼上。不要自行刪除 YAML 內容，也不要把自己的 Google Drive 網址寫進 Project Instructions。

## 6｜開始安裝 eduHarness

在 `eduHarness_Nooa` 專案中建立一個新對話，把下面整段文字貼給 ChatGPT。只需要把 `<貼上你的 Google Drive 資料夾 URL>` 換成剛才複製的網址。

```text
請初始化我的 eduHarness Cloud。

我的 Google Drive 根目錄：
<貼上你的 Google Drive 資料夾 URL>

請依 eduHarness 官方 Distribution 建立完整 Cloud installation，
完成後重新從 ENV 執行 bootstrap 驗證。
```

## 7｜遇到權限詢問時怎麼辦？

安裝過程中，ChatGPT 需要在你的 Google Drive 建立資料夾與檔案，因此可能跳出「允許／Allow」確認畫面。

可以核准的典型情況：在你指定的空白 `eduHarness_Nooa` 資料夾中建立安裝所需資料夾與檔案。

先不要核准的情況：刪除既有檔案、覆寫與 eduHarness 無關的內容、把成果存到不明位置，或要求你把整個 Drive 公開。

## 8｜怎樣才算安裝成功？

不要只看 ChatGPT 說「完成了」。正式安裝流程會在寫入後重新讀取 ENV、Registry、Brain Index 與 Skills 做驗證。

你最後應看到：

```text
INSTALLATION_READY
```

安裝後，Google Drive 會出現類似下面的結構：

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

新手先記住兩個資料夾即可：

- `50_WORKSPACE`：工作中的暫存／中間產物。
- `90_OUTPUT`：完成後要交給你使用的成果。

若你沒有另外指定位置，且 Skill／Registry 沒有專用規則，可交付成果應預設進 `90_OUTPUT`；中間工作檔使用 `50_WORKSPACE`。

## 9｜安裝完成後，先試這一句

在 eduHarness 專案新對話中輸入：

```text
目前我有哪些 skill 可以用？
```

如果 eduHarness 能從你的安裝環境讀取 Registry，並列出目前可以使用的能力，就代表基本運作正常。

之後可以直接用自然語言提出教師工作，例如：

- 幫我設計一堂國小四年級自然課。
- 分析這份教案並提出改進建議。
- 我要做一份形成性評量。
- 把這份教材改成學生闖關活動。

## 常見問題

### 我一定要懂 YAML、GitHub 或程式嗎？

不用。第一次安裝只要會複製、貼上、建立資料夾即可。

### 為什麼一定要建立 ChatGPT 專案？

因為 Project Instructions 會固定放在專案裡，讓每次在專案內的新對話都能使用 eduHarness 的運作規則。

### 為什麼要連接 Google Drive？

因為 eduHarness 的 Skills、Knowledge、Templates 與輸出資料需要一個屬於你自己的雲端工作空間。

### 我需要把 Google Drive 設成公開嗎？

不需要。保留你自己正常的 Drive 權限即可；ChatGPT 透過你授權連接的 Google 帳號存取。

### ChatGPT 找不到 Google Drive 怎麼辦？

先檢查 **Settings（設定） → 外掛程式 → Google Drive** 是否已連接。如果 `Connect` 灰掉、顯示 `Disabled by admin`，或動作無法執行，可能是方案、工作區角色、地區或管理員設定有限制。

### 我沒有看到 INSTALLATION_READY？

代表目前不能確定安裝已完整驗證。保留 ChatGPT 最後顯示的錯誤訊息，再請它檢查安裝失敗原因，不要自行刪除 Drive 裡的資料夾。

### 成果會跑到哪裡？

若沒有指定其他位置，正常情況下可交付成果會依 ENV 路由到 `90_OUTPUT`；中間工作檔則使用 `50_WORKSPACE`。若成果出現在 My Drive 根目錄或其他不明位置，應視為位置驗證失敗並修正。

---

## 最後只要記住三件事

1. ChatGPT 專案 = 你的 eduHarness AI 工作台。
2. Google Drive 的 `eduHarness_Nooa` 資料夾 = 你的私人工作空間。
3. 看到 `INSTALLATION_READY` = 第一次安裝完成。

> ChatGPT 介面與外掛程式能力可能持續更新；若按鈕名稱或位置有小幅變動，以當下介面功能名稱為準。
