import assert from "node:assert/strict";
import test from "node:test";

import { requireTenantAdmin } from "../src/auth.mjs";

test("takes the tenant from the authenticated session", () => {
  assert.deepEqual(
    requireTenantAdmin({ tenantId: "tenant-a", roles: ["admin"] }),
    { ok: true, tenantId: "tenant-a" },
  );
});
