export async function copyRssAddress(address, clipboard, analytics) {
  try {
    if (!clipboard?.writeText) return 'manual'
    await clipboard.writeText(address)
  } catch {
    return 'manual'
  }
  try {
    // Optional telemetry must not delay copying or turn success into an error.
    Promise.resolve(analytics?.track('rss-copy')).catch(() => {})
  } catch {
    // The existing tracker may be unavailable or blocked.
  }
  return 'copied'
}
