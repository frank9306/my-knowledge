import { requireTenantAdmin } from "../auth.mjs";
import { jsonError } from "../http-response.mjs";

export async function listAuditRoute(request) {
  const auth = requireTenantAdmin(request.session);
  if (!auth.ok) return jsonError(auth.status, "forbidden");

  return { status: 501, body: { error: "not-implemented" } };
}
