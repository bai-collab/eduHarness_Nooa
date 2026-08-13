# eduHarness App Storage PoC v0.2 candidate

## Goal

Validate a provider-neutral eduHarness storage boundary and a deterministic Canonical Distribution transfer path:

`ChatGPT/Plugin → MCP → artifact transfer adapter → Storage Provider`.

This branch is isolated from the Canonical Distribution on `main`. It is a candidate implementation, not production promotion.

## Scope

Implemented MCP tools:

- `initialize_workspace` — idempotently creates a logical workspace and a minimal `00_EDUHARNESS_ENV.yaml`.
- `list_files` — lists file metadata within one workspace.
- `read_file` — reads one UTF-8 file.
- `write_file` — creates/replaces one user-authored UTF-8 file.
- `install_canonical_artifact` — fetches one GitHub canonical file as exact bytes, transfers it through a binary-safe destination adapter, reads it back, and returns `verified=true` only when SHA-256 and byte length match.

The normal workspace backend remains in-memory for PoC isolation. Canonical artifact transfer can optionally use the Dropbox Content API backend.

## Verified artifact transfer

`install_canonical_artifact` performs:

```text
GitHub Contents API
  → base64 decode exact blob bytes
  → source blob identity + SHA-256 + byte length
  → binary writeBytes
  → binary readBytes
  → destination SHA-256 + byte length
  → equivalence PASS
  → verified=true + provider identity/revision when available
```

The model never receives canonical file contents as a text transport payload. CRLF, trailing newlines, whitespace, Unicode and arbitrary byte values are handled as bytes.

The transfer fails closed:

- source bytes unavailable → `SOURCE_UNAVAILABLE`;
- destination upload failure → `SAVE_FAILED`;
- read-back missing/mutated/unverifiable → `SAVE_UNVERIFIED`.

## Dropbox artifact backend

Set these only in the MCP server environment:

```text
DROPBOX_ACCESS_TOKEN=<server-side OAuth/access token>
DROPBOX_ARTIFACT_ROOT=/path/to/provisioned-installation-root
```

Optional for private/rate-limited GitHub access:

```text
GITHUB_TOKEN=<server-side GitHub token>
```

Tokens are not MCP tool arguments and must never be supplied through model text.

`DropboxArtifactStorage` uses Dropbox Content API `/files/upload` and `/files/download` directly with `application/octet-stream`. Upload/download bytes are not converted through UTF-8 strings.

### Provisioning boundary

Artifact transfer does **not** silently create missing folder trees. The installer must provision the installation root, workspace and package parent folders first. This preserves the separation between:

1. storage provisioning;
2. managed artifact transfer;
3. Artifact Index verified binding.

If a destination parent is missing, Dropbox upload fails and the installer must report the failure instead of guessing a path.

## Critical security boundary

`workspace_id` is currently supplied as a tool argument **only for PoC testing**. It is not secure tenant isolation.

Before any public or multi-user deployment:

1. add OAuth 2.1 / authenticated user identity;
2. derive tenant/workspace from authenticated server-side identity;
3. remove user-controlled cross-workspace selection;
4. enforce authorization on every read/write request;
5. use short-lived/provider-managed credentials instead of long-lived development tokens;
6. add a persistent general StorageAdapter and tenant-level policies.

Until those are complete, this server must not store real student data, credentials, private Brain content, or production teacher data.

## Local validation

Requirements: Node.js 20+.

```bash
npm install
npm run typecheck
npm test
npm run build
```

Tests cover:

- exact GitHub base64→bytes decoding;
- CRLF/trailing newline/whitespace/Unicode byte preservation;
- mutation detection with `SAVE_UNVERIFIED`;
- Dropbox binary upload/download round-trip;
- Dropbox metadata/content size mismatch rejection;
- existing workspace isolation/path checks.

## Local MCP

```text
http://127.0.0.1:3000/mcp
```

Health endpoint reports whether artifact transfer is using:

- `in-memory-binary-verified`, or
- `dropbox-binary-verified`.

## Remaining production gates

- OAuth 2.1 and authenticated tenant mapping;
- installer provisioning tool for Dropbox folder structure;
- production secret management / token rotation;
- full 17-package Distribution installer orchestration;
- Artifact Index write only after transfer evidence PASS;
- live Dropbox clean-room acceptance test;
- public HTTPS deployment/submission review.
