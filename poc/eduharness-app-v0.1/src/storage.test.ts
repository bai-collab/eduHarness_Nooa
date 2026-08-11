import assert from "node:assert/strict";
import test from "node:test";
import { InMemoryStorage } from "./storage.js";

test("initialize is idempotent and creates portable ENV", async () => {
  const storage = new InMemoryStorage();
  assert.deepEqual(await storage.initializeWorkspace("teacher-a"), { created: true });
  assert.deepEqual(await storage.initializeWorkspace("teacher-a"), { created: false });

  const env = await storage.readFile("teacher-a", "00_EDUHARNESS_ENV.yaml");
  assert.ok(env);
  assert.match(env.content, /env_kind: "eduHarness-cloud"/);
  assert.match(env.content, /provider: "eduharness-app"/);
  assert.match(env.content, /workspace_id: "teacher-a"/);
});

test("workspaces are logically isolated", async () => {
  const storage = new InMemoryStorage();
  await storage.initializeWorkspace("teacher-a");
  await storage.initializeWorkspace("teacher-b");

  await storage.writeFile("teacher-a", "private.md", "teacher A only");

  assert.equal(await storage.readFile("teacher-b", "private.md"), null);
  assert.equal((await storage.readFile("teacher-a", "private.md"))?.content, "teacher A only");
});

test("unsafe relative paths are rejected", async () => {
  const storage = new InMemoryStorage();
  await storage.initializeWorkspace("teacher-a");

  await assert.rejects(() => storage.writeFile("teacher-a", "../escape.md", "no"), /INVALID_PATH/);
  await assert.rejects(() => storage.writeFile("teacher-a", "folder\\escape.md", "no"), /INVALID_PATH/);
});
