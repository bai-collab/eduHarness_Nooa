# Production Readiness Contract

Status: Canonical v0.2 contract

## Principle

`ready` 不能只是一個 status flag；必須有 fresh-start、end-to-end read-back 證據。

本文件只保存 canonical readiness criteria，**不得保存某個 production installation 的 Notion UUID、Dropbox stable ID、Drive URL 或其他 private locator**。

## Required readiness matrix

Production installation 至少必須驗證：

1. Bootstrap Descriptor readable / valid。
2. Descriptor → formal ENV。
3. ENV schema/config valid。
4. ENV → Registry。
5. ENV → Brain Index。
6. ENV → Artifact Index。
7. Registry required capability/Skill logical target resolves。
8. Brain required logical ref resolves。
9. logical artifact ID → Artifact Index。
10. Artifact Index → Storage Provider identity。
11. required artifact actual content readable。
12. stable identity matches index record（provider 支援時）。
13. revision/version matches expected record（provider 支援時）。
14. storage `artifacts` role resolves。
15. storage `output` role resolves。
16. storage `work_area` role resolves。
17. Registry typed relations v2 未退化。
18. failure / recovery contract 有可執行 evidence。
19. Human Gate contract 存在且 mutation boundary 未退化。
20. Runtime State default ephemeral。
21. Canonical Kernel / Distribution 無 installation-specific locator leakage。
22. fresh installation flow 不要求 Google Drive root。

## Evidence strength

- `PASS`：實際 read-back 或明確 canonical contract 支持。
- `PARTIAL`：只有宣告，缺必要 read-back。
- `FAIL`：解析失敗、revision/identity 不一致、contract 缺失或發生不允許的 mutation。

只有所有 required items PASS，才可宣稱 production ready。

## Failure/recovery evidence

Production SHOULD 至少具備：

- metadata lookup fallback / alternative lookup path when appropriate；
- storage inspection / search capability；
- provider-specific recovery capability or reconstructable managed artifact plan；
- verification failure → stop / recovery，而不是繼續宣稱完成。

## Promotion gate

GitHub Canonical Distribution promotion 前，必須確認 production readiness 已由獨立 audit PASS，並對 canonical governance mutation 取得 Human Gate。

Promotion 後還必須重新 read GitHub main 驗證：

- files exist；
- canonical contracts mutually consistent；
- no Drive-root installation requirement regression；
- no typed relation / Human Gate / failure-code regression。
