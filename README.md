# eduHarness_Nooa

Canonical Distribution for eduHarness Cloud, targeting ChatGPT Web and Gemini Spark.

GitHub 是 **Canonical Distribution / 功能演進來源**。eduHarness Cloud v0.2 採 **Descriptor-first、provider-separated architecture**：Bootstrap Descriptor 是 installation entry；ENV 是 installation config；Notion 是 default Control Plane；Dropbox 是 default Storage Provider；Google Drive 降為 optional / legacy storage provider。

## 目前 Stable Distribution

- Distribution version：`2026.08.12`
- Architecture revision：`v0.2`
- Project Kernel：`eduHarness Cloud v1.4.1 Compact Portable Kernel`
- ENV schema：`2`
- Registry schema：`2`
- routing guard contract：`2.1`
- Runtime State：ephemeral by default
- Default Control Plane：Notion
- Default Storage Provider：Dropbox

## 教師安裝入口

- [安裝指南](INSTALL.md)
- [安裝／升級完整說明](docs/INSTALL_UPGRADE.md)
- [ChatGPT 新手安裝手冊](docs/CHATGPT_PAID_INSTALL_GUIDE.md)

首次安裝最短流程：

1. 建立 ChatGPT Project。
2. 將 `00_PROJECT_INSTRUCTIONS.yaml` 全文貼入 Project Instructions。
3. 確認 default profile 所需的 Notion / Dropbox 連線可用。
4. 在 Project 對話輸入：

```text
安裝 eduHarness Cloud。
請依官方 GitHub Canonical Distribution 使用預設 installation profile，
完成後從 Bootstrap Descriptor fresh-start 驗證。
```

**不再要求先建立 Google Drive root。**

## 架構元件

| 元件 | 主要責任 |
|---|---|
| **GitHub** | Canonical Distribution 與功能演進來源 |
| **Project Kernel** | 全域 planning / execution / verification / Human Gate / failure governance |
| **Bootstrap Descriptor** | installation entry；定位正式 ENV |
| **ENV** | installation config；定位 Control Plane / Storage resources |
| **Control Plane** | runtime metadata/control abstraction |
| **Notion** | default Control Plane implementation |
| **Registry** | capability / Skill selection / routing / typed relations |
| **Brain Index** | Knowledge / Template / Experience / Error Log 等 logical index |
| **Artifact Index** | logical `artifact://` → provider identity / revision resolution |
| **Skill** | 可重用標準工作程序 |
| **Storage Provider** | artifacts / output / work_area 的實體儲存 |
| **Dropbox** | default Storage Provider implementation |
| **Google Drive** | optional / legacy Storage Provider 或 migration source |
| **Runtime State** | 一次性 routing / execution state；預設 ephemeral |

## 核心解析架構

```text
Bootstrap Descriptor
  ↓
ENV
  ├─ Control Plane → Registry / Brain Index / Artifact Index
  └─ Storage → artifacts / output / work_area

Registry / Brain Index
  ↓
logical artifact:// ID
  ↓
Artifact Index
  ↓
provider stable identity / revision
  ↓
Storage Provider
```

這個分層的目的，是讓 **capability/knowledge identity 不再與某一個 Drive path 或 provider 綁死**。

## eduHarness 的運行架構

![eduHarness_Nooa 思考推進流程與 Human Gate](docs/eduHarness_Nooa%20%E6%B5%81%E7%A8%8B%E5%9C%96.png)

核心工作路徑：

**理解任務 → 決定 Skill → 規劃 → 執行 → 驗證 → 迭代優化 → 完成交付／經驗累積**

- 驗證失敗會觸發 re-plan，只重做受影響路徑。
- 學生個資、正式評量、正式送件／公開、付費服務、刪除資料、批次搬移／覆寫、重大 Registry／治理修改、Canonical Distribution promotion 或可能破壞 routing 的變更，都需要 Human Gate。
- Runtime State 預設 ephemeral；private chain-of-thought 不持久化。

## Registry v2

Registry v2 保留六種 typed relations：

- `requires` — mandatory prerequisite
- `enhances` — conditional supporting capability
- `routes` — Primary Skill responsibility transfer
- `conflicts` — block/resolve incompatible activation
- `replaces` — redirect/migrate
- `supports` — informational only

不能把六種 relation 當成相同的 graph edge。

## Provider policy

### Default

```text
Control Plane = Notion
Storage Provider = Dropbox
```

### Optional / legacy
Google Drive 可作 storage adapter 或 migration source，但不再是 Kernel、ENV、Registry、Brain Index 的固定 root model，也不是 fresh installation 的必要輸入。

## Canonical contracts

- `docs/BOOTSTRAP_DESCRIPTOR_CONTRACT.md`
- `docs/CONTROL_PLANE_CONTRACT.md`
- `docs/STORAGE_ADAPTER_CONTRACT.md`
- `docs/RUNTIME_STATE_CONTRACT.md`
- `docs/PRODUCTION_READINESS.md`

## Portability / privacy

Canonical Distribution 不得包含：

- installation-specific Notion page/database IDs
- installation-specific Dropbox IDs/paths
- installation-specific Google Drive URLs/IDs
- 他人的正式 ENV / Bootstrap Descriptor
- private Brain、教師 outputs、working traces
- student PII
- secrets、tokens、credentials、private keys

## 參考來源

eduHarness_Nooa 的設計過程參考了公開研究與實作方向；並非以下專案的官方衍生版本：

1. NVIDIA-labs OO Agents: Native Python Object-Oriented Agents（arXiv:2607.20709）
2. Anthropic K-12 Teacher Skills

eduHarness_Nooa 另外建立 Portable Kernel、Descriptor/ENV installation layer、Registry v2、Brain/Artifact layering、provider adapters、Runtime State、Human Gate 與驗證/回復治理，以支援 ChatGPT Web / Gemini Spark 的教師工作流程。
