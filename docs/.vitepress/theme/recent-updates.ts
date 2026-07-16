export const RECENT_UPDATES_STORAGE_KEY = 'frank-archive:read-update-versions'
const KNOWN_UPDATE_VERSIONS_STORAGE_KEY = 'frank-archive:known-update-versions'
const DETECTED_UPDATES_STORAGE_KEY = 'frank-archive:detected-updates'

export const RECENT_UPDATE_WINDOW_MS = 7 * 24 * 60 * 60 * 1000

export interface DetectedUpdate {
  version: string
  detectedAt: number
}

export function normalizeUpdateUrl(url: string) {
  const pathname = url.split(/[?#]/, 1)[0]
  return pathname.replace(/\/index(?:\.html)?$/, '/').replace(/\.html$/, '').replace(/\/$/, '') || '/'
}

function getStoredObject(key: string) {
  if (typeof window === 'undefined') return {} as Record<string, unknown>

  try {
    const storedValue = JSON.parse(window.localStorage.getItem(key) ?? '{}')
    if (!storedValue || Array.isArray(storedValue) || typeof storedValue !== 'object') return {}
    return storedValue
  } catch {
    return {}
  }
}

function setStoredObject(key: string, value: object) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Keep the in-memory state when storage is unavailable.
  }
}

function getStoredVersions(key: string) {
  return Object.fromEntries(
    Object.entries(getStoredObject(key))
      .filter((entry): entry is [string, string] => typeof entry[1] === 'string')
      .map(([url, version]) => [normalizeUpdateUrl(url), version])
  )
}

export function getReadUpdateVersions() {
  return getStoredVersions(RECENT_UPDATES_STORAGE_KEY)
}

export function syncArticleVersions(articles: readonly { url: string; version: string }[]) {
  const now = Date.now()
  const readVersions = getReadUpdateVersions()
  const knownVersions = getStoredVersions(KNOWN_UPDATE_VERSIONS_STORAGE_KEY)
  const storedDetections = getStoredObject(DETECTED_UPDATES_STORAGE_KEY)
  const nextKnownVersions: Record<string, string> = {}
  const nextDetections: Record<string, DetectedUpdate> = {}

  for (const article of articles) {
    const url = normalizeUpdateUrl(article.url)
    const previousVersion = knownVersions[url] ?? readVersions[url]
    const storedDetection = storedDetections[url]

    nextKnownVersions[url] = article.version

    if (previousVersion && previousVersion !== article.version) {
      nextDetections[url] = { version: article.version, detectedAt: now }
    } else if (
      storedDetection
      && typeof storedDetection === 'object'
      && 'version' in storedDetection
      && 'detectedAt' in storedDetection
      && storedDetection.version === article.version
      && typeof storedDetection.detectedAt === 'number'
      && now - storedDetection.detectedAt < RECENT_UPDATE_WINDOW_MS
    ) {
      nextDetections[url] = {
        version: storedDetection.version,
        detectedAt: storedDetection.detectedAt
      }
    }
  }

  setStoredObject(KNOWN_UPDATE_VERSIONS_STORAGE_KEY, nextKnownVersions)
  setStoredObject(DETECTED_UPDATES_STORAGE_KEY, nextDetections)

  return nextDetections
}

export function markUpdateAsRead(url: string, version: string) {
  const readVersions = getReadUpdateVersions()
  readVersions[normalizeUpdateUrl(url)] = version
  setStoredObject(RECENT_UPDATES_STORAGE_KEY, readVersions)

  return readVersions
}
