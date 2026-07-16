export function jsonError(status, code) {
  return { status, body: { error: code } };
}
