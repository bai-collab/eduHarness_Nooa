# eduHarness App Storage PoC v0.1

## Goal

Validate the smallest useful replacement boundary for Google Drive:

`ChatGPT/Plugin → MCP → eduHarness storage adapter → isolated workspace files`.

This branch is isolated from the Canonical Distribution on `main`.

## Scope

Implemented MCP tools:

- `initialize_workspace` — idempotently creates a logical workspace and a minimal `00_EDUHARNESS_ENV.yaml`.
- `list_files` — lists file metadata within one workspace.
- `read_file` — reads one UTF-8 file.
- `write_file` — creates/replaces one UTF-8 file.

Storage is currently **in-memory only**. Restarting the process loses data. This is deliberate: v0.1 validates the MCP/tool contract before choosing a persistent database/provider.

## Critical security boundary

`workspace_id` is currently supplied as a tool argument **only for PoC testing**. It is not secure tenant isolation.

Before any public or multi-user deployment:

1. add OAuth 2.1 / authenticated user identity;
2. derive the tenant/workspace from authenticated server-side identity;
3. remove user-controlled cross-workspace selection;
4. enforce authorization on every read/write request;
5. add a persistent storage adapter and tenant-level database policies.

Until those are complete, this server must not store real teacher data, student data, credentials, or private eduHarness Brain content.

## Local run

Requirements: Node.js 20+.

```bash
npm install
npm run typecheck
npm run dev
```

Local MCP endpoint:

```text
http://127.0.0.1:3000/mcp
```

Health endpoint:

```text
http://127.0.0.1:3000/healthz
```

Inspect with MCP Inspector:

```bash
npx @modelcontextprotocol/inspector@latest
```

Choose **Streamable HTTP** and connect to `http://127.0.0.1:3000/mcp`.

## Minimum smoke test

Use workspace `teacher-a`:

1. call `initialize_workspace({ workspace_id: "teacher-a" })`;
2. call `list_files({ workspace_id: "teacher-a" })` and confirm `00_EDUHARNESS_ENV.yaml` exists;
3. call `write_file({ workspace_id: "teacher-a", path: "test.md", content: "hello" })`;
4. call `read_file({ workspace_id: "teacher-a", path: "test.md" })` and confirm `hello`;
5. initialize `teacher-b` and confirm `teacher-b` cannot see `teacher-a/test.md` through normal scoped calls.

Logical isolation in step 5 is not an authentication guarantee; OAuth is a required next gate.

## ChatGPT development test

OpenAI's current plugin development flow requires an MCP endpoint reachable via public HTTPS (or Secure MCP Tunnel for development), then developer mode can connect the server and inspect discovered tools.

For a temporary development endpoint, expose this local server through an HTTPS development tunnel, then use the resulting URL ending in `/mcp`.

Do not treat a temporary tunnel as a production/submission endpoint.

## Free ChatGPT target

Free ChatGPT currently supports installed interactive/write-capable published apps/plugins, but Free does not support creating a Custom MCP connection. Therefore the Free-user validation sequence is:

1. develop and test the MCP server from an eligible developer account;
2. deploy a stable public HTTPS endpoint;
3. satisfy authentication, privacy, and submission requirements;
4. submit/publish the plugin;
5. only then test whether the approved listing exposes **Connect** on a Free account in the target region.

Until step 5 is observed, Free eligibility is **not proven**.

## v0.2 gates

- persistent StorageAdapter (candidate: managed Postgres/Supabase or equivalent);
- OAuth 2.1 and authenticated tenant mapping;
- immutable/audited revision metadata for control files;
- bootstrap from GitHub Canonical Distribution;
- Registry / Brain Index / Skill package reconstruction;
- write confirmation semantics and conflict detection;
- privacy policy / terms / support URL / verified developer identity for submission.
