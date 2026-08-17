import assert from "node:assert/strict";
import test from "node:test";
import {
  fetchGitHubArtifact,
  sha256,
  transferCanonicalArtifact,
  type ArtifactStorageAdapter,
} from "./artifact-transfer.js";
import { InMemoryStorage } from "./storage.js";

test("GitHub contents response is decoded as exact bytes", async () => {
  const source = Buffer.from("line1\r\nline2\n尾端空白  \n", "utf8");
  const fakeFetch: typeof fetch = async () =>
    new Response(
      JSON.stringify({
        type: "file",
        sha: "0123456789abcdef",
        encoding: "base64",
        content: source.toString("base64").replace(/(.{20})/g, "$1\n"),
      }),
      { status: 200, headers: { "content-type": "application/json" } },
    );

  const artifact = await fetchGitHubArtifact(
    { repository: "bai-collab/eduHarness_Nooa", path: "x.md", ref: "main" },
    fakeFetch,
  );

  assert.equal(artifact.sourceIdentity, "github:blob:0123456789abcdef");
  assert.equal(artifact.byteLength, source.byteLength);
  assert.equal(artifact.sha256, sha256(source));
  assert.deepEqual(Buffer.from(artifact.bytes), source);
});

test("canonical transfer preserves CRLF, trailing newline, whitespace and Unicode", async () => {
  const storage = new InMemoryStorage();
  await storage.initializeWorkspace("teacher-a");
  const source = Buffer.from("A\r\nB\n繁體中文  \n", "utf8");
  const artifact = {
    repository: "bai-collab/eduHarness_Nooa",
    path: "00_ADMIN/SKILLS/demo/SKILL.md",
    ref: "main",
    sourceIdentity: "github:blob:test",
    bytes: source,
    byteLength: source.byteLength,
    sha256: sha256(source),
  };

  const evidence = await transferCanonicalArtifact(storage, {
    workspaceId: "teacher-a",
    destinationPath: "artifacts/skills/demo/SKILL.md",
    artifact,
  });
  const readBack = await storage.readBytes("teacher-a", "artifacts/skills/demo/SKILL.md");

  assert.ok(readBack);
  assert.deepEqual(Buffer.from(readBack.bytes), source);
  assert.equal(evidence.sourceSha256, evidence.destinationSha256);
  assert.equal(evidence.byteLength, source.byteLength);
  assert.equal(evidence.verified, true);
});

test("mutating destination adapter fails closed with SAVE_UNVERIFIED", async () => {
  let stored = new Uint8Array();
  const mutatingStorage: ArtifactStorageAdapter = {
    async writeBytes(_workspaceId, path, bytes) {
      stored = Buffer.from(Buffer.from(bytes).toString("utf8").replace(/\r\n/g, "\n"), "utf8");
      return { path, bytes: stored };
    },
    async readBytes(_workspaceId, path) {
      return { path, bytes: stored };
    },
  };
  const source = Buffer.from("A\r\nB\r\n", "utf8");

  await assert.rejects(
    () =>
      transferCanonicalArtifact(mutatingStorage, {
        workspaceId: "teacher-a",
        destinationPath: "x.md",
        artifact: {
          repository: "owner/repo",
          path: "x.md",
          ref: "main",
          sourceIdentity: "github:blob:test",
          bytes: source,
          byteLength: source.byteLength,
          sha256: sha256(source),
        },
      }),
    /SAVE_UNVERIFIED: canonical equivalence mismatch/,
  );
});
