# 40_ERROR_LOG

eduHarness Cloud 的可重用錯誤與修復經驗區。

## 用途

保存具有後續診斷價值、可避免重複犯錯的 Error Log、失敗模式與已確認修復方式。

## Installation 規則

此目錄是標準 runtime 結構的一部分。安裝或修復流程應確保 Google Drive 中存在 `40_ERROR_LOG`，即使目前沒有錯誤紀錄。

本 `README.md` 用於讓 GitHub Canonical Distribution 保留此目錄；Git 本身不追蹤空資料夾。

## 邊界

錯誤紀錄應避免保存 credentials、tokens、學生個資或其他敏感資訊。未確認的推測不得寫成已確認根因。
