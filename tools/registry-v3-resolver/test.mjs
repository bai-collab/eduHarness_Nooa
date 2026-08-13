import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";
import { resolveFixtureCase } from "./resolver.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const fixturePath = path.resolve(here, "../../00_ADMIN/REGISTRY_V3_RESOLVER_FIXTURES.yaml");
const doc = YAML.parse(fs.readFileSync(fixturePath, "utf8"));

const cases = doc.cases ?? [];
const required = new Set(doc.coverage_requirements?.required_case_ids ?? []);
assert.ok(cases.length > 0, "fixtures must not be empty");
for (const id of required) assert.ok(cases.some((c) => c.id === id), `missing required fixture ${id}`);

for (const c of cases) {
  const actual = resolveFixtureCase(c);
  for (const [key, expected] of Object.entries(c.expect ?? {})) {
    assert.deepEqual(actual[key], expected, `${c.id}: ${key}`);
  }
  console.log(`PASS ${c.id}`);
}

console.log(`\nRegistry v3 resolver fixtures: ${cases.length}/${cases.length} PASS`);
