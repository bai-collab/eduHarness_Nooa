import { createServer } from "node:http";
import { NodeStreamableHTTPServerTransport } from "@modelcontextprotocol/node";
import { DropboxArtifactStorage } from "./dropbox-artifact-storage.js";
import { createEduHarnessServer } from "./server.js";
import { InMemoryStorage } from "./storage.js";

const storage = new InMemoryStorage();
const dropboxToken = process.env.DROPBOX_ACCESS_TOKEN;
const dropboxRoot = process.env.DROPBOX_ARTIFACT_ROOT;
const artifactStorage =
  dropboxToken && dropboxRoot
    ? new DropboxArtifactStorage(dropboxToken, dropboxRoot)
    : storage;
const githubToken = process.env.GITHUB_TOKEN;
const port = Number(process.env.PORT ?? 3000);
const host = process.env.HOST ?? "127.0.0.1";

const httpServer = createServer(async (req, res) => {
  if (req.url === "/healthz") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(
      JSON.stringify({
        ok: true,
        service: "eduharness-app-poc",
        version: "0.2.0-poc",
        artifact_transfer: dropboxToken && dropboxRoot ? "dropbox-binary-verified" : "in-memory-binary-verified",
      }),
    );
    return;
  }

  if (req.url !== "/mcp") {
    res.writeHead(404, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: "NOT_FOUND" }));
    return;
  }

  const server = createEduHarnessServer(storage, artifactStorage, githubToken);
  const transport = new NodeStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });

  try {
    await server.connect(transport);
    await transport.handleRequest(req, res);
  } catch (error) {
    if (!res.headersSent) {
      res.writeHead(500, { "content-type": "application/json" });
    }
    if (!res.writableEnded) {
      res.end(
        JSON.stringify({
          error: "MCP_REQUEST_FAILED",
          message: error instanceof Error ? error.message : String(error),
        }),
      );
    }
  } finally {
    await transport.close().catch(() => undefined);
    await server.close().catch(() => undefined);
  }
});

httpServer.listen(port, host, () => {
  console.error(`eduHarness App PoC listening on http://${host}:${port}/mcp`);
});
