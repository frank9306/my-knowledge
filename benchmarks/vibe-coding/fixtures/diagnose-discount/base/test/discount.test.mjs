import assert from "node:assert/strict";
import test from "node:test";

import { allocateDiscount } from "../src/discount.mjs";

test("allocates every discount cent", () => {
  const allocation = allocateDiscount(
    [
      { priceCents: 199, quantity: 1 },
      { priceCents: 299, quantity: 1 },
      { priceCents: 502, quantity: 1 },
    ],
    101,
  );

  assert.deepEqual(allocation, [20, 30, 51]);
  assert.equal(allocation.reduce((sum, value) => sum + value, 0), 101);
});
