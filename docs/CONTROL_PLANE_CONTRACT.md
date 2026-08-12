# Control Plane Contract

Status: Canonical v0.2 contract

## Role

Control Plane 承載 eduHarness runtime metadata 與 routing/index state，不承擔大型 artifact bytes 的主要儲存責任。

Canonical logical resources：

- ENV
- Registry
- Brain Index
- Artifact Index

Notion 是 v0.2 **default Control Plane implementation**，但不是 Kernel-global hard dependency。

## Required capabilities

Control Plane adapter MUST 能支援其承載角色所需的：

- uniquely resolve / read records
- inspect schema / metadata
- query or search records
- create/update records when mutation is explicitly authorized
- read-back after mutation

SQL、database query language 或特定 provider API 都不是 cross-provider 必要條件；若 provider 有多種查詢方式，runtime 可以使用可驗證 fallback。

## Registry

Registry 是 capability/routing SSOT，必須保留 schema v2 typed relations：

`requires` / `enhances` / `routes` / `conflicts` / `replaces` / `supports`。

Control Plane adapter 不得把 typed relations 扁平化成相同 edge semantics。

## Brain Index

Brain Index 保存 knowledge/memory logical identity，不應把 storage path 當成 knowledge identity。

## Artifact Index

Artifact Index 保存 logical `artifact://` ID 到 provider identity 的解析資訊。至少應能表示：

- Artifact ID
- Provider
- Identity Type
- Identity Value
- Identity Strength
- Revision（provider 支援時）
- Path Hint（optional）
- Status

## Mutation governance

重大 schema change、production Registry/routing change、Brain migration、Artifact remap 都需要 Human Gate。

只有工具成功且 read-back 通過後，才能宣稱 control-plane mutation 完成。

## Portability

Canonical Kernel/Distribution 不得保存 installation-specific Notion page/database IDs。

其他 Control Plane provider 若要支援，必須滿足本 contract；不得因 provider 改變而要求改寫 Project Kernel 的核心 routing semantics。
