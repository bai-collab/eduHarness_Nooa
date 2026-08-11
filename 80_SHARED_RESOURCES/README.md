# 80_SHARED_RESOURCES

eduHarness Cloud 的共用資源區。

## 用途

保存多個 Skill、Knowledge 或工作流程可共同使用的 portable 資源，例如共用參考材料、規格或其他已核准的共享內容。

## Installation 規則

此目錄是標準 runtime 結構的一部分。安裝或修復流程應確保 Google Drive 中存在 `80_SHARED_RESOURCES`，即使目前沒有共用資源。

本 `README.md` 用於讓 GitHub Canonical Distribution 保留此目錄；Git 本身不追蹤空資料夾。

## 邊界

只有適合共享的內容才應進入 Canonical Distribution。教師私人資源、學生個資與 installation-specific locator 應留在各自 installation 或 ENV 所管理的範圍。
