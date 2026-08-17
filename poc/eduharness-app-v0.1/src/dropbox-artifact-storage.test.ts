import assert from "node:assert/strict";
import test from "node:test";
import { DropboxArtifactStorage } from "./dropbox-artifact-storage.js";

function metadataHeader(value: unknown): Headers {
  return new Headers({ "dropbox-api-result": JSON.stringify(value) });
}

test("Dropbox adapter uploads and downloads exact bytes", async () => {
  const source = Buffer.from([0, 13, 10, 255, 1, 2, 3, 0]);
  let uploaded = Buffer.alloc(0);
  const calls: string[] = [];

  const fakeFetch: typeof fetch = async (input, init) => {
    const url = String(input);
    calls.push(url);
    if (url.endsWith("/files/upload")) {
      uploaded = Buffer.from((init?.body ?? new Uint8Array()) as Uint8Array);
      return new Response(
        JSON.stringify({
          id: "id:dropbox-test",
          rev: "rev-upload",
          path_display: "/cleanroom/teacher-a/artifacts/x.bin",
          size: uploaded.byteLength,
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    }
    if (url.endsWith("/files/download")) {
      return new Response(uploaded, {
        status: 200,
        headers: metadataHeader({
          id: "id:dropbox-test",
          rev: "rev-download",
          path_display: "/cleanroom/teacher-a/artifacts/x.bin",
          size: uploaded.byteLength,
        }),
      });
    }
    return new Response("not found", { status: 404 });
  };

  const storage = new DropboxArtifactStorage("test-token", "/cleanroom", fakeFetch);
  const write = await storage.writeBytes("teacher-a", "artifacts/x.bin", source);
  const read = await storage.readBytes("teacher-a", "artifacts/x.bin");

  assert.equal(write.providerIdentity, "id:dropbox-test");
  assert.ok(read);
  assert.deepEqual(Buffer.from(read.bytes), source);
  assert.equal(read.providerIdentity, "id:dropbox-test");
  assert.equal(read.revision, "rev-download");
  assert.deepEqual(calls, [
    "https://content.dropboxapi.com/2/files/upload",
    "https://content.dropboxapi.com/2/files/download",
  ]);
});

test("Dropbox adapter rejects metadata/content size mismatch", async () => {
  const fakeFetch: typeof fetch = async () =>
    new Response(Buffer.from("abc"), {
      status: 200,
      headers: metadataHeader({ size: 4, path_display: "/cleanroom/teacher-a/x.md" }),
    });

  const storage = new DropboxArtifactStorage("test-token", "/cleanroom", fakeFetch);
  await assert.rejects(
    () => storage.readBytes("teacher-a", "x.md"),
    /SAVE_UNVERIFIED: Dropbox metadata size mismatch/,
  );
});
