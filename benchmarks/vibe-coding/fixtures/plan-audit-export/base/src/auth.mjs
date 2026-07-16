export function requireTenantAdmin(session) {
  if (!session?.roles?.includes("admin")) {
    return { ok: false, status: 403 };
  }

  return { ok: true, tenantId: session.tenantId };
}
