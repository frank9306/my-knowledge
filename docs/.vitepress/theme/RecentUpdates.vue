<script setup lang="ts">
import { useRoute } from 'vitepress'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { data as articleUpdates } from './recent-updates.data'
import {
  type DetectedUpdate,
  getReadUpdateVersions,
  markUpdateAsRead,
  normalizeUpdateUrl,
  RECENT_UPDATE_WINDOW_MS,
  syncArticleVersions
} from './recent-updates'

const route = useRoute()
const open = ref(false)
const root = ref<HTMLElement | null>(null)
const readVersions = ref<Record<string, string>>({})
const detectedUpdates = ref<Record<string, DetectedUpdate>>({})
const currentTime = ref(0)
const dateFormatter = new Intl.DateTimeFormat('zh-CN', { month: 'numeric', day: 'numeric' })

const recentUpdates = computed(() => articleUpdates
  .filter(({ url, date, version }) => {
    if (!currentTime.value) return false
    const datedAt = new Date(date).getTime()
    const detection = detectedUpdates.value[normalizeUpdateUrl(url)]
    return isRecentTimestamp(datedAt) || detection?.version === version
  })
  .sort((a, b) => getUpdateTimestamp(b) - getUpdateTimestamp(a)))

const unreadCount = computed(() => recentUpdates.value.filter(isUnread).length)

function isRecentTimestamp(timestamp: number) {
  return timestamp <= currentTime.value && currentTime.value - timestamp < RECENT_UPDATE_WINDOW_MS
}

function getUpdateTimestamp(item: (typeof articleUpdates)[number]) {
  const datedAt = new Date(item.date).getTime()
  if (isRecentTimestamp(datedAt)) return datedAt
  const detection = detectedUpdates.value[normalizeUpdateUrl(item.url)]
  return detection?.version === item.version ? detection.detectedAt : datedAt
}

function isUnread(item: (typeof articleUpdates)[number]) {
  return readVersions.value[normalizeUpdateUrl(item.url)] !== item.version
}

function syncState() {
  if (typeof window === 'undefined') return
  currentTime.value = Date.now()
  detectedUpdates.value = syncArticleVersions(articleUpdates)
  readVersions.value = getReadUpdateVersions()
}

function markRead(item: (typeof articleUpdates)[number]) {
  readVersions.value = markUpdateAsRead(item.url, item.version)
}

function closeOnOutsideClick(event: MouseEvent) {
  if (!root.value?.contains(event.target as Node)) open.value = false
}

function closeOnEscape(event: KeyboardEvent) {
  if (event.key === 'Escape') open.value = false
}

watch(() => route.path, syncState)

onMounted(() => {
  syncState()
  document.addEventListener('click', closeOnOutsideClick)
  document.addEventListener('keydown', closeOnEscape)
  window.addEventListener('storage', syncState)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeOnOutsideClick)
  document.removeEventListener('keydown', closeOnEscape)
  window.removeEventListener('storage', syncState)
})
</script>

<template>
  <div ref="root" class="recent-updates">
    <button
      class="recent-updates__trigger"
      type="button"
      :aria-expanded="open"
      :aria-label="unreadCount ? `最近更新，有 ${unreadCount} 篇未读` : '最近更新，无未读'"
      aria-controls="recent-updates-panel"
      @click="open = !open"
    >
      <span class="recent-updates__desktop-label">最近更新</span>
      <span class="recent-updates__mobile-label">更新</span>
      <span v-if="unreadCount" class="recent-updates__trigger-dot" aria-hidden="true" />
    </button>

    <div v-if="open" id="recent-updates-panel" class="recent-updates__panel" aria-label="最近 7 天更新">
      <div class="recent-updates__heading">
        <strong>最近 7 天更新</strong>
        <span>{{ unreadCount ? `${unreadCount} 篇未读` : '已全部读过' }}</span>
      </div>
      <ul v-if="recentUpdates.length">
        <li v-for="item in recentUpdates" :key="item.url" :class="{ 'is-unread': isUnread(item) }">
          <a :href="item.url" @click="markRead(item)">
            <span class="recent-updates__title">
              <span v-if="isUnread(item)" class="recent-updates__item-dot" role="img" aria-label="未读" />
              <span>{{ item.title }}</span>
            </span>
            <time :datetime="new Date(getUpdateTimestamp(item)).toISOString()">{{ dateFormatter.format(getUpdateTimestamp(item)) }}</time>
          </a>
        </li>
      </ul>
      <p v-else class="recent-updates__empty">最近 7 天暂无更新</p>
    </div>
  </div>
</template>
