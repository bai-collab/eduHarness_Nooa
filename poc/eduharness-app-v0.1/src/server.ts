import { McpServer } from "@modelcontextprotocol/server";
import * as z from "zod/v4";
import {
  fetchGitHubArtifact,
  transferCanonicalArtifact,
  type ArtifactStorageAdapter,
} from "./artifact-transfer.js";
import type { StorageAdapter } from "./storage.js";

const workspaceIdSchema = z
  .string()
  .min(3)
  .max(80)
  .regex(/^[a-zA-Z0-9_-]+$/)
  .describe("Opaque eduHarness workspace identifier. In production this must come from authenticated identity, not user text.");

const pathSchema = z
  .string()
  .min(1)
  .max(240)
  .describe("Relative path inside the authenticated eduHarness workspace.");

function errorResult(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return {
    isError: true,
    content: [{ type: "text" as const, text: message }],
  };
}

export function createEduHarnessServer(
  storage: StorageAdapter,
  artifactStorage: ArtifactStorageAdapter = storage,
  githubToken?: string,
): McpServer {
  const server = new McpServer(
    { name: "eduharness-storage-poc", version: "0.2.0-poc" },
    {
      instructions:
        "Use initialize_workspace before file operations. Treat workspace_id as a temporary PoC stand-in for authenticated identity. Canonical artifact installation must use install_canonical_artifact so bytes are fetched from GitHub and verified after destination read-back; never regenerate canonical file contents in the model.",
    },
  );

  server.registerTool(
    "initialize_workspace",
    {
      title: "Initialize eduHarness workspace",
      description:
        "Use this when a user is setting up a new eduHarness workspace. Creates the workspace and a minimal portable ENV if it does not already exist.",
      inputSchema: z.object({ workspace_id: workspaceIdSchema }),
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ workspace_id }) => {
      try {
        const result = await storage.initializeWorkspace(workspace_id);
        return {
          structuredContent: { workspace_id, created: result.created },
          content: [
            {
              type: "text",
              text: result.created
                ? `Initialized workspace ${workspace_id}.`
                : `Workspace ${workspace_id} already exists; no overwrite performed.`,
            },
          ],
        };
      } catch (error) {
        return errorResult(error);
      }
    },
  );

  server.registerTool(
    "list_files",
    {
      title: "List eduHarness files",
      description:
        "Use this when the user or workflow needs to inspect which files exist in an eduHarness workspace or under a relative prefix.",
      inputSchema: z.object({
        workspace_id: workspaceIdSchema,
        prefix: z.string().max(240).optional(),
      }),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async ({ workspace_id, prefix }) => {
      try {
        const files = await storage.listFiles(workspace_id, prefix);
        const summaries = files.map(({ path, updatedAt }) => ({ path, updated_at: updatedAt }));
        return {
          structuredContent: { workspace_id, files: summaries },
          content: [{ type: "text", text: `Found ${files.length} file(s).` }],
        };
      } catch (error) {
        return errorResult(error);
      }
    },
  );

  server.registerTool(
    "read_file",
    {
      title: "Read eduHarness file",
      description:
        "Use this when a workflow needs the current UTF-8 text contents of one relative file in the user's eduHarness workspace.",
      inputSchema: z.object({ workspace_id: workspaceIdSchema, path: pathSchema }),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async ({ workspace_id, path }) => {
      try {
        const file = await storage.readFile(workspace_id, path);
        if (!file) {
          return {
            isError: true,
            content: [{ type: "text", text: "FILE_NOT_FOUND" }],
          };
        }
        return {
          structuredContent: {
            workspace_id,
            path: file.path,
            content: file.content,
            updated_at: file.updatedAt,
          },
          content: [{ type: "text", text: `Read ${file.path}.` }],
        };
      } catch (error) {
        return errorResult(error);
      }
    },
  );

  server.registerTool(
    "write_file",
    {
      title: "Write eduHarness file",
      description:
        "Use this for user-authored UTF-8 files only. Do not use it to install GitHub canonical artifacts; use install_canonical_artifact instead.",
      inputSchema: z.object({
        workspace_id: workspaceIdSchema,
        path: pathSchema,
        content: z.string().max(1_000_000),
      }),
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ workspace_id, path, content }) => {
      try {
        const file = await storage.writeFile(workspace_id, path, content);
        return {
          structuredContent: {
            workspace_id,
            path: file.path,
            updated_at: file.updatedAt,
            bytes: Buffer.byteLength(file.content, "utf8"),
          },
          content: [{ type: "text", text: `Wrote ${file.path}.` }],
        };
      } catch (error) {
        return errorResult(error);
      }
    },
  );

  server.registerTool(
    "install_canonical_artifact",
    {
      title: "Install verified canonical artifact",
      description:
        "Fetch one canonical GitHub file as exact bytes, write it through the binary artifact storage adapter, read it back, and verify SHA-256/byte equivalence before returning verified=true. Use this for Distribution-managed Skill/Knowledge files.",
      inputSchema: z.object({
        workspace_id: workspaceIdSchema,
        repository: z.string().regex(/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/),
        source_path: pathSchema,
        ref: z.string().min(1).max(120).default("main"),
        destination_path: pathSchema,
      }),
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async ({ workspace_id, repository, source_path, ref, destination_path }) => {
      try {
        const artifact = await fetchGitHubArtifact({
          repository,
          path: source_path,
          ref,
          token: githubToken,
        });
        const evidence = await transferCanonicalArtifact(artifactStorage, {
          workspaceId: workspace_id,
          destinationPath: destination_path,
          artifact,
        });
        return {
          structuredContent: {
            workspace_id,
            repository,
            source_path,
            ref,
            destination_path: evidence.destinationPath,
            source_identity: evidence.sourceIdentity,
            source_sha256: evidence.sourceSha256,
            destination_sha256: evidence.destinationSha256,
            bytes: evidence.byteLength,
            provider_identity: evidence.providerIdentity,
            revision: evidence.revision,
            verified: evidence.verified,
          },
          content: [
            {
              type: "text",
              text: `Verified canonical artifact ${source_path} → ${evidence.destinationPath}.`,
            },
          ],
        };
      } catch (error) {
        return errorResult(error);
      }
    },
  );

  return server;
}
