# Bootstrap Descriptor Contract

Status: Canonical v0.2 contract  
Scope: eduHarness Cloud installation entry

## Purpose

Bootstrap Descriptor 是 **installation entry**。它的責任只有：讓 fresh runtime 能找到該 installation 的正式 ENV 與必要 control-plane entry metadata。

它不是 Project Kernel、不是 Distribution Manifest、也不是 Runtime State。

## Required semantics

Descriptor MUST 至少能表達：

- schema / descriptor kind
- installation/workspace identity
- formal ENV locator
- Control Plane provider/entry locator
- Storage provider family（可直接或經 ENV 解析）
- runtime state policy（default `ephemeral`）

## Resolution order

```text
Bootstrap Descriptor
→ formal ENV
→ Control Plane / Storage config
→ Registry / Brain Index / Artifact Index
→ logical artifact resolution
```

## Portability rules

- Project Kernel MUST NOT 保存某個 installation 的 Descriptor locator。
- GitHub Canonical Distribution MUST NOT 發布 production Descriptor。
- Descriptor MAY 包含 installation-specific Notion/Dropbox/Drive locator，因為它本身就是 installation artifact。
- Descriptor MUST NOT 包含 secrets、tokens、credentials、private keys 或學生個資。
- Descriptor locator 不可唯一解析時，runtime MUST stop；不得以 GitHub、模型記憶或其他 installation 猜測替代。

## Fresh-start verification

Production readiness 必須從 Descriptor 重新開始，而不是沿用前一輪已解析的 runtime state。

至少驗證：

1. Descriptor readable / valid。
2. Descriptor → ENV。
3. ENV → Registry / Brain Index / Artifact Index。
4. logical artifact → Artifact Index → Storage Provider。
5. provider identity/revision read-back（provider 支援時）。

## Failure codes

- `EDUHARNESS_DESCRIPTOR_NOT_FOUND`
- `EDUHARNESS_DESCRIPTOR_INVALID`
- `EDUHARNESS_ENV_NOT_FOUND`
- `ENV_AMBIGUOUS`

## Default profile

Canonical Distribution v0.2 的 default profile 為 Notion Control Plane + Dropbox Storage；這是 installer default，不代表 Descriptor contract 只能支援這兩個 provider。
