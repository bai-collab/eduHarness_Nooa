# eduHarness_Nooa

Canonical Distribution for eduHarness Cloud, targeting ChatGPT Web and Gemini Spark.

GitHub 是 Canonical Distribution / 功能演進來源；每位教師自己的 Google Drive 是 Cloud runtime installation。Installation-specific Google Drive locator 只能存在正式 ENV，不得寫入 Portable Kernel、Registry、runtime contracts 或 Skills。

## 目前 Stable Distribution

- Distribution version：`2026.08.12`
- Project Kernel：`eduHarness Cloud v1.4.1 Compact Portable Kernel`
- Registry schema：`2`
- routing guard contract：`2.1`
- Runtime State Builder：已納入 Distribution
- Observability：Audit Trace Contract + Runtime Trace Adapter 已納入 Distribution
- installed cloud skills：`17`

**一般升級不需要重新貼 Project Instructions。** Project Kernel 刻意保持穩定；只要 Kernel 仍支援新版 Registry schema，更新會發生在教師自己的 Drive installation。只有未來 Kernel 本身出現 breaking runtime / governance change 時，才需要 Project Instructions migration。

## 教師安裝入口

- [首次安裝指南](INSTALL.md)
- [安裝／升級完整說明](docs/INSTALL_UPGRADE.md)
- [純文字版設定手冊](docs/CHATGPT_PAID_INSTALL_GUIDE.md)

首次安裝最短流程：

1. 老師在自己的 Google Drive 建立空白 eduHarness root，複製 URL。
2. 建立 ChatGPT Project。
3. 將 `00_PROJECT_INSTRUCTIONS.yaml` 全文貼入 Project Instructions。
4. 在 Project 對話輸入：

```text
安裝 eduHarness Cloud
這是我的 Google Drive root：<你的資料夾 URL>
```

之後升級只要在原 Project 輸入：

```text
升級 eduHarness Cloud 到最新版
```

升級程序會讀本機正式 ENV、比對 GitHub stable Distribution、建立 rollback snapshot、保留老師自己的資料，在 Human Gate 核准後只更新受管理的 Registry / runtime contracts / Skill packages，最後重新 bootstrap 驗證。

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

![eduHarness_Nooa 思考推進流程與 Human Gate](docs/eduHarness_Nooa%20%E6%B5%81%E7%A8%8B%E5%9C%96.png)

核心工作路徑：

**理解任務 → 決定 Skill → 規劃 → 執行 → 驗證 → 迭代優化 → 完成交付／經驗累積**

其中：

1. **驗證未通過會重新規劃**：依驗證結果補資料、調整流程或重新 route，再執行與驗證。
2. **必要時 Human Gate**：學生個資、正式評量、正式送件／公開、付費服務、刪除資料、批次搬移／覆寫、重大 Registry／治理修改或可能破壞 routing 的變更，都必須先取得明確核准。

### 架構元件

| 元件 | 主要責任 |
|---|---|
| **Project Kernel** | 全域規則、planning/execution/verification、Human Gate |
| **ENV** | 每個 installation 的 Drive locator 與路徑設定 |
| **Registry** | capability / Skill selection、KeyPoint routing、typed relations |
| **State Builder** | 將可稽核 evidence 解析成 KeyPoint state；UNKNOWN 不得偷偷變 FALSE |
| **Skill** | 可重用標準工作程序 |
| **Brain Index** | 索引 Knowledge、Template、Experience、Error Log 等可重用資料 |
| **Runtime Trace Adapter** | 組裝可稽核 trace；預設 ephemeral，必要時才持久化 |
| **Google Drive** | 每位教師自己的 Cloud runtime、工作內容與成果 |
| **GitHub** | Canonical Distribution 與功能演進來源 |

## 參考來源

eduHarness_Nooa 的設計過程參考了下列公開資料與實作方向；這些來源提供概念與設計啟發，eduHarness_Nooa 並非其官方衍生版本：

1. [NVIDIA-labs OO Agents: Native Python Object-Oriented Agents（arXiv:2607.20709）](https://arxiv.org/abs/2607.20709) — 參考其對 AI／agent 系統設計的研究觀點。
2. [Anthropic K-12 Teacher Skills](https://github.com/anthropics/k12-teacher-skills/tree/main) — 參考教師工作 Skill 的模組化、可重用程序與教育情境設計方式。

此外，eduHarness_Nooa 依自身目標加入 Portable Kernel、ENV、Registry、Brain Index、Skill routing、KeyPoint guard、State Builder、Cloud installation、Observability、Human Gate 與輸出路由等結構，以支援 ChatGPT Web／Gemini Spark 的教師工作流程。
