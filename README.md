# eduHarness_Nooa

Canonical Distribution for eduHarness Cloud, targeting ChatGPT Web and Gemini Spark.

This repository is the canonical distribution and feature-evolution source. Installation-specific Google Drive locators must not be stored here outside the ENV template placeholders.

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

## 參考來源

eduHarness_Nooa 的設計過程參考了下列公開資料與實作方向；這些來源提供概念與設計啟發，eduHarness_Nooa 並非其官方衍生版本：

1. [arXiv:2607.20709](https://arxiv.org/abs/2607.20709) — 參考其對 AI／agent 系統設計的研究觀點。
2. [Anthropic K-12 Teacher Skills](https://github.com/anthropics/k12-teacher-skills/tree/main) — 參考教師工作 Skill 的模組化、可重用程序與教育情境設計方式。

此外，eduHarness_Nooa 依自身目標加入 Portable Kernel、ENV、Registry、Brain Index、Skill routing、Cloud installation、Human Gate 與輸出路由等結構，以支援 ChatGPT Web／Gemini Spark 的教師工作流程。

## 教師安裝入口

- [ChatGPT 付費版新手安裝手冊 v1.0](docs/CHATGPT_PAID_INSTALL_GUIDE.md)
- [技術版安裝指南](INSTALL.md)
