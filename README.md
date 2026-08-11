# eduHarness_Nooa

Canonical Distribution for eduHarness Cloud, targeting ChatGPT Web and Gemini Spark.

This repository is the canonical distribution and feature-evolution source. Installation-specific Google Drive locators must not be stored here outside the ENV template placeholders.

## 教師安裝入口

- [圖文完整版設定手冊 Google 文件](https://docs.google.com/document/d/1EFl7fx6AfiaExUA-FKUv2BHMSgK9srJ6djPHHcKo80c/edit?usp=drivesdk)
- [純文字版設定手冊 v1.0](docs/CHATGPT_PAID_INSTALL_GUIDE.md)

## 為什麼要設計 eduHarness？

一般使用 AI Chat 時，每次對話都像重新交代工作：規則、資料、流程與輸出方式常常要重講一次，結果也容易因對話不同而改變。

eduHarness 把 AI 變成一個比較穩定的「教師工作台」：

| 一般 AI Chat | eduHarness |
|---|---|
| 每次重新說明需求 | 專案規則可持續使用 |
| AI 自己決定怎麼做 | 依 Registry／Skill 路由到既定流程 |
| 資料散落在對話中 | Knowledge、Template、Experience 有固定位置 |
| 輸出位置容易不一致 | 成果依 ENV 路由到指定工作區 |
| 好用的方法不一定能重複 | Skill 把有效流程做成可重用程序 |

簡單說：**一般 AI Chat 是「問一次、答一次」；eduHarness 是把 AI 加上工作流程、資料結構與可重用技能，讓教師可以較穩定地重複完成工作。**

## eduHarness 的運行架構

eduHarness 不是另一個 AI 模型，而是架在 ChatGPT Web／Gemini Spark 上的一層「工作系統」。

它把原本只有「使用者 ↔ AI 對話」的方式，拆成幾個責任清楚的層次：

```text
教師提出任務
    ↓
ChatGPT Web / Gemini Spark
    ↓
Project Kernel
決定全域規則、執行順序、驗證與安全界線
    ↓
ENV
找到這位使用者自己的 Cloud installation
    ↓
Registry
判斷這個任務應使用哪個能力／Skill
    ↓
Skill
依既定程序執行任務
    ↓
Brain Index
需要既有知識、模板、經驗時，再找到對應資料
    ↓
Google Drive Cloud Runtime
讀取／建立／更新工作資料與成果
    ↓
驗證結果
    ↓
回傳給教師
```

### 各層負責什麼？

| 元件 | 可以把它想成 | 主要責任 |
|---|---|---|
| **Project Kernel** | 工作台的基本規則 | 規定整體怎麼規劃、執行、驗證、重新規劃，以及哪些操作需要 Human Gate |
| **ENV** | 地址簿 | 告訴 AI「這位使用者自己的 eduHarness 在哪裡」，保存 installation-specific 的 Google Drive locator |
| **Registry** | 能力目錄＋路由表 | 告訴 AI 現在有哪些能力、哪一類任務應該交給哪個 Skill |
| **Skill** | 標準作業流程 | 定義某項工作應該怎麼一步一步完成，例如教學設計、評量、教材處理等 |
| **Brain Index** | 知識索引 | 告訴 AI 可重用的 Knowledge、Template、Experience、Error Log、Shared Resource 在哪裡 |
| **Google Drive** | 每位教師自己的工作空間 | 保存實際的知識、模板、工作檔、輸出成果與個人 Cloud runtime |
| **GitHub** | 官方版本來源 | 保存 Portable Kernel、Registry、Skills、Distribution 與功能演進，不保存每位教師的私人工作內容 |

### 一個任務實際怎麼跑？

例如教師輸入：

> 幫我設計一堂國小四年級自然課。

eduHarness 不會立刻只靠模型自由回答，而會依序處理：

1. **Kernel 判斷任務類型與風險**：這是教學設計任務，需要規劃，但通常不涉及高風險寫入。
2. **從 ENV 找到自己的工作環境**：不猜 Google Drive 位置。
3. **讀 Registry 做 routing**：確認目前登錄的能力中，哪個 Skill 負責教學設計。
4. **讀取該 Skill 的完整程序**：依 Skill 定義的步驟工作，而不是臨時憑感覺組答案。
5. **需要既有資料時才讀 Brain Index**：例如課程模板、過去經驗或相關 Knowledge；沒有需要就不預載。
6. **產出結果並驗證**：檢查輸入是否完整、結果是否符合 Skill contract、未知資訊是否被擅自補完。
7. **需要保存時依 ENV 路由**：中間工作內容進 `50_WORKSPACE`，可交付成果預設進 `90_OUTPUT`，除非使用者或 Skill 有另外指定。

核心原則是：**先找到正確環境 → 再找到正確能力 → 再讀需要的資料 → 執行 → 驗證。**

### GitHub 與 Google Drive 為什麼要分開？

```text
GitHub
│
├─ 官方 Kernel
├─ Registry
├─ Skills
├─ Distribution
└─ 功能演進

            ↓ 安裝／同步

Google Drive（每位教師自己的）
│
├─ ENV
├─ Skills runtime copy
├─ Knowledge
├─ Templates
├─ Experience
├─ Workspace
└─ Output
```

這樣設計的目的，是把 **「大家共用的系統」** 和 **「每位教師自己的資料」** 分開。

GitHub 可以公開、版本控制與持續更新；Google Drive 則保存每位教師自己的 Cloud runtime 與工作內容。換句話說，**GitHub 管功能，Google Drive 管使用者自己的工作環境。**

### 為什麼不是把所有東西都塞進 Project Instructions？

因為 Project Instructions 適合放穩定、可分享的全域規則，不適合塞入所有 Skills、個人資料、Drive URL 或不斷變動的工作內容。

所以 eduHarness 採分層設計：

```text
Project = Portable Kernel
ENV     = installation locator
Registry= capability / routing
Skill   = procedure
Brain   = knowledge / memory index
Drive   = user cloud runtime
GitHub  = canonical distribution
```

這讓系統可以在不改動整個 Project 的情況下新增 Skill、更新 Knowledge，或讓不同教師各自使用自己的 Google Drive installation。

### Human Gate 與驗證

eduHarness 不把「AI 說完成了」當成真的完成。

涉及學生個資、正式評量、正式送件／公開、付費服務、刪除資料、批次搬移／覆寫或重大治理修改時，必須先取得使用者明確核准。

同時，建立、修改、移動或保存檔案後，必須由工具實際成功，必要時再讀回確認位置與內容，才能宣稱完成。

因此整體循環可以簡化成：

```text
分類 → 發現環境 → 路由 → 規劃 → 執行 → 觀察 → 驗證
                         ↑                  ↓
                         └──── 必要時重新規劃 ────┘
```

## 參考來源

eduHarness_Nooa 的設計過程參考了下列公開資料與實作方向；這些來源提供概念與設計啟發，eduHarness_Nooa 並非其官方衍生版本：

1. [NVIDIA-labs OO Agents: Native Python Object-Oriented Agents（arXiv:2607.20709）](https://arxiv.org/abs/2607.20709) — 參考其對 AI／agent 系統設計的研究觀點。
2. [Anthropic K-12 Teacher Skills](https://github.com/anthropics/k12-teacher-skills/tree/main) — 參考教師工作 Skill 的模組化、可重用程序與教育情境設計方式。

此外，eduHarness_Nooa 依自身目標加入 Portable Kernel、ENV、Registry、Brain Index、Skill routing、Cloud installation、Human Gate 與輸出路由等結構，以支援 ChatGPT Web／Gemini Spark 的教師工作流程。
