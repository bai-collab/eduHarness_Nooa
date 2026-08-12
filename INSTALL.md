# eduHarness_Nooa｜教師安裝指南

## 適用環境
本流程適用於 ChatGPT Web / Gemini Spark 的 eduHarness Cloud v0.2 architecture。

- **GitHub**：Canonical Distribution。
- **Bootstrap Descriptor**：installation entry。
- **ENV**：installation config。
- **Notion**：default Control Plane。
- **Dropbox**：default Storage Provider。
- **Registry**：capability / routing。
- **Brain Index**：knowledge / memory logical index。
- **Artifact Index**：logical artifact resolution。
- **Runtime State**：ephemeral by default。
- **Google Drive**：optional / legacy storage provider，不是安裝前置條件。

## 安裝前準備
1. 建立 ChatGPT Project。
2. 確認可使用官方 GitHub Canonical Distribution。
3. Default profile 安裝時，確認 ChatGPT 可使用你的 Notion 與 Dropbox 連線／權限。
4. 不需要先建立 Google Drive root，也不需要提供任何 production Notion/Dropbox ID。

## Step 1｜建立 Project Kernel
1. 取得官方 `00_PROJECT_INSTRUCTIONS.yaml`。
2. 將全文貼入 Project Instructions。
3. 不要把自己的 Notion page/database ID、Dropbox stable ID、Google Drive URL/ID 寫進 Project Instructions。

只有 Kernel breaking change 時才需要重新貼 Project Instructions。

## Step 2｜執行安裝
在 Project 對話輸入：

```text
安裝 eduHarness Cloud。
請依官方 GitHub Canonical Distribution，使用預設 installation profile 完成安裝，
並從 Bootstrap Descriptor 做 fresh-start read-back verification。
```

Default profile：

```text
Control Plane = Notion
Storage Provider = Dropbox
Runtime State = ephemeral
```

若你有明確理由使用其他 supported provider，可在安裝指令中指定。Google Drive 只能作 optional/legacy storage provider，不再是必填 root。

## Step 3｜系統應完成的工作
1. 讀取 `00_EDUHARNESS_DISTRIBUTION.yaml` 與 canonical contracts。
2. 選擇 provider profile；預設為 Notion + Dropbox。
3. 建立/解析 Control Plane resources：ENV、Registry、Brain Index、Artifact Index。
4. 建立/解析 Storage roles：`artifacts`、`output`、`work_area`。
5. 安裝 Distribution-managed Skill / Knowledge artifacts。
6. 建立 Artifact Index：logical `artifact://` → provider identity。
7. 建立 Registry / Brain logical bindings。
8. 產生正式 provider-neutral ENV。
9. 建立 Bootstrap Descriptor，讓 Descriptor 定位 ENV。
10. 從 Descriptor fresh-start：Descriptor → ENV → Indexes → logical artifact → Storage Provider。
11. provider 支援 stable ID / revision 時，必須做 identity / revision read-back。
12. 全部 PASS 才回報 `INSTALLATION_READY`。

## 核心解析鏈

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

## Default production profile

### Notion Control Plane
保存 installation/control metadata。實際 Notion page/database ID 只屬個別 installation，不得放入 Canonical Distribution。

### Dropbox Storage
保存 artifacts、output、work_area。可用時以 stable ID 作 authoritative identity，revision 作驗證／recovery evidence。

### Google Drive
仍可透過 Storage Adapter 使用於 legacy installation、migration source 或明確指定的 storage profile；但不得把 Drive folder tree 當作 Kernel/ENV/Brain/Registry 的固定 schema。

## 升級
在原本 Project 中輸入：

```text
升級 eduHarness Cloud 到最新版
```

正常升級必須：
- 先讀 Bootstrap Descriptor 與正式 ENV。
- 解析目前 Control Plane / Storage providers。
- 比對 GitHub stable Distribution。
- 顯示 mutation / preserve / recovery scope。
- 重大 control-plane mutation、Artifact remap、managed overwrite、rollback 前取得 Human Gate。
- user-owned Knowledge / Templates / Experience / Error Log / Output 預設保留。
- Runtime State 維持 ephemeral，不作 distribution-managed artifact。
- 更新後重新從 Descriptor fresh bootstrap；任何必要 read-back FAIL 都不能宣稱 `UPGRADE_READY`。

完整升級規則：`docs/INSTALL_UPGRADE.md`。

## 安全與 Portability
- Bootstrap Descriptor 與 ENV 都是 installation-specific，不是 credential。
- Canonical Kernel / Distribution 不得保存 production Notion/Dropbox/Drive locator。
- Skill/Knowledge logical identity 與 storage locator 分層；locator 變更不應要求改 Kernel。
- 不保存 secrets、tokens、cookies、credentials、private keys、學生個資或 private chain-of-thought。
- 工具沒有實際成功並 read-back 時，不得宣稱安裝或升級完成。

## 常見失敗狀態
- `EDUHARNESS_DESCRIPTOR_NOT_FOUND`
- `EDUHARNESS_DESCRIPTOR_INVALID`
- `EDUHARNESS_ENV_NOT_FOUND`
- `ENV_AMBIGUOUS`
- `EDUHARNESS_ENV_INVALID`
- `EDU_REGISTRY_UNAVAILABLE`
- `BRAIN_INDEX_UNAVAILABLE`
- `ARTIFACT_INDEX_UNAVAILABLE`
- `ARTIFACT_UNRESOLVED`
- `SOURCE_UNAVAILABLE`
- `ACCESS_UNAVAILABLE`
- `RUNTIME_INCOMPATIBLE`
- `SAVE_FAILED`
- `SAVE_UNVERIFIED`

## 驗收標準
只有 installation 能從 **Bootstrap Descriptor** fresh-start 重新解析 ENV、Registry、Brain Index、Artifact Index、required logical artifacts、storage roles，且 Human Gate / failure boundary 完整，才可回報：

`INSTALLATION_READY`
