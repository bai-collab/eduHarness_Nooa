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

![eduHarness_Nooa 思考推進流程與 Human Gate](docs/eduHarness_Nooa%20%E6%B5%81%E7%A8%8B%E5%9C%96.png)

eduHarness 的核心不是把更多設定塞給 AI，而是讓 AI 按一條可檢核的路徑往前推進：

**理解任務 → 決定 Skill → 規劃 → 執行 → 驗證 → 迭代優化 → 完成交付／經驗累積**

其中兩個關鍵機制：

1. **驗證沒通過就回到前面調整**：不是一次回答到底，而是根據驗證結果重新規劃、補資料或改用其他 Skill，再次執行與驗證。
2. **必要時加入 Human Gate**：當任務涉及學生個資、正式評量、正式送件／公開、付費服務、刪除資料、批次搬移／覆寫、重大 Registry／治理修改或可能破壞 routing 的變更時，AI 會先停下來，交由老師明確核准後才繼續。

任務完成後，經過確認且可重用的知識、模板、經驗與錯誤修正，可以逐步沉澱成後續工作可再利用的資產，讓下一次執行不必從零開始。

### 架構元件的角色

| 元件 | 主要責任 |
|---|---|
| **Project Kernel** | 定義全域規則、規劃／執行／驗證循環與 Human Gate |
| **Registry** | 判斷任務應使用哪個能力／Skill |
| **Skill** | 提供可重用的標準工作程序 |
| **Brain Index** | 索引可重用的 Knowledge、Template、Experience、Error Log 等資料 |
| **Google Drive** | 保存每位教師自己的 Cloud runtime、工作內容與成果 |
| **GitHub** | 保存 Canonical Distribution 與功能演進來源 |

## 參考來源

eduHarness_Nooa 的設計過程參考了下列公開資料與實作方向；這些來源提供概念與設計啟發，eduHarness_Nooa 並非其官方衍生版本：

1. [NVIDIA-labs OO Agents: Native Python Object-Oriented Agents（arXiv:2607.20709）](https://arxiv.org/abs/2607.20709) — 參考其對 AI／agent 系統設計的研究觀點。
2. [Anthropic K-12 Teacher Skills](https://github.com/anthropics/k12-teacher-skills/tree/main) — 參考教師工作 Skill 的模組化、可重用程序與教育情境設計方式。

此外，eduHarness_Nooa 依自身目標加入 Portable Kernel、ENV、Registry、Brain Index、Skill routing、Cloud installation、Human Gate 與輸出路由等結構，以支援 ChatGPT Web／Gemini Spark 的教師工作流程。
