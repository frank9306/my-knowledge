export function buildPermissionQuery(user, requestedTenantId, requestedLimit) {
  if (!user.roles.includes("admin")) {
    return { ok: false, reason: "forbidden" };
  }

  if (requestedTenantId !== user.tenantId) {
    return { ok: false, reason: "cross-tenant" };
  }

  const limit = Number(requestedLimit);
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    return { ok: false, reason: "invalid-limit" };
  }

  return {
    ok: true,
    tenantId: user.tenantId,
    limit,
    cacheKey: `permissions:${user.tenantId}:${user.id}`,
  };
}
