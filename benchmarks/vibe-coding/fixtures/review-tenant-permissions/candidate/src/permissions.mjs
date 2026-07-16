export function buildPermissionQuery(user, requestedTenantId, requestedLimit) {
  if (!user.roles.includes("admin")) {
    return { ok: false, reason: "forbidden" };
  }

  const limit = Number(requestedLimit);

  return {
    ok: true,
    tenantId: requestedTenantId,
    limit: Math.min(limit, 100),
    cacheKey: `permissions:${user.id}`,
  };
}
