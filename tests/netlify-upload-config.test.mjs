import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("uses one conservative upload chunk size in browser and Netlify Functions", async () => {
  const [rules, page, storage] = await Promise.all([
    readFile(new URL("../app/projectUploadRules.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../netlify/functions/_shared/storage.mts", import.meta.url), "utf8"),
  ]);

  assert.match(rules, /NETLIFY_UPLOAD_CHUNK_SIZE\s*=\s*512\s*\*\s*1024/);
  assert.match(page, /import\s*\{\s*NETLIFY_UPLOAD_CHUNK_SIZE\s*\}/);
  assert.match(storage, /CHUNK_SIZE\s*=\s*NETLIFY_UPLOAD_CHUNK_SIZE/);
  assert.doesNotMatch(page, /UPLOAD_CHUNK_SIZE\s*=\s*5\s*\*\s*1024\s*\*\s*1024/);
  assert.doesNotMatch(storage, /CHUNK_SIZE\s*=\s*5\s*\*\s*1024\s*\*\s*1024/);
});
