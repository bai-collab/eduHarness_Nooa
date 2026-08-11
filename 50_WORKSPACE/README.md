# 50_WORKSPACE

eduHarness Cloud 的任務工作區。

## 用途

放置任務執行中的 working files、草稿、中間產物與尚未決定是否持久化的內容。

## Installation 規則

此目錄是標準 runtime 結構的一部分。安裝或修復流程應確保 Google Drive 中存在 `50_WORKSPACE`，即使目前沒有進行中的工作。

本 `README.md` 用於讓 GitHub Canonical Distribution 保留此目錄；Git 本身不追蹤空資料夾。

## 邊界

Workspace 內容不等於 Knowledge、Experience 或正式 Output。一次性 working state 預設不自動持久化，也不應自動同步回 Canonical Distribution。
