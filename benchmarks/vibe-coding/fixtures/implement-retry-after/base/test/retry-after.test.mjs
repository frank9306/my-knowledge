import assert from "node:assert/strict";
import test from "node:test";

import { parseRetryAfter } from "../src/retry-after.mjs";

const NOW = Date.parse("2026-07-16T00:00:00.000Z");

test("parses delta seconds", () => {
  assert.equal(parseRetryAfter("30", NOW), NOW + 30_000);
});

test("parses a future HTTP date", () => {
  assert.equal(
    parseRetryAfter("Thu, 16 Jul 2026 00:01:00 GMT", NOW),
    NOW + 60_000,
  );
});
