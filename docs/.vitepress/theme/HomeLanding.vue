<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import CrtHead from './CrtHead.vue'
import { data as articleUpdates } from './recent-updates.data'
import {
  type DetectedUpdate,
  getReadUpdateVersions,
  markUpdateAsRead,
  normalizeUpdateUrl,
  RECENT_UPDATE_WINDOW_MS,
  syncArticleVersions
} from './recent-updates'

const menuOpen = ref(false)
const updatesOpen = ref(false)
const updatesArea = ref<HTMLElement | null>(null)
const readUpdateVersions = ref<Record<string, string>>({})
const detectedUpdates = ref<Record<string, DetectedUpdate>>({})
const currentTime = ref(0)
const typedText = ref('')
const actionsVisible = ref(false)
const message = '欢迎停留。好奇心总会把对的人带到这里。今天想探索什么？'

let typeTimer: ReturnType<typeof setInterval> | undefined
let actionTimer: ReturnType<typeof setTimeout> | undefined
let startTimer: ReturnType<typeof setTimeout> | undefined

const navigation = [
  { label: '专题', href: '/topics/' },
  { label: '文章', href: '/blog/' },
  { label: '资源', href: '/resources/' },
  { label: '关于', href: '/about' }
]

const topics = [
  { label: 'AI Agent', href: '/ai-agent/' },
  { label: 'Python 自动化', href: '/python-automation/' },
  { label: 'RPA / Playwright', href: '/rpa-playwright/' },
  { label: 'Web / React', href: '/web-react/' }
]

const dateFormatter = new Intl.DateTimeFormat('zh-CN', {
  month: 'numeric',
  day: 'numeric'
})
const recentUpdates = computed(() => articleUpdates
  .filter(({ url, date, version }) => {
    if (!currentTime.value) return false

    const datedAt = new Date(date).getTime()
    const detection = detectedUpdates.value[normalizeUpdateUrl(url)]
    const isDetectedRecently = detection?.version === version

    return isRecentTimestamp(datedAt) || isDetectedRecently
  })
  .sort((a, b) => getUpdateTimestamp(b) - getUpdateTimestamp(a)))
const unreadCount = computed(() => (
  recentUpdates.value.filter(({ url, version }) => (
    readUpdateVersions.value[normalizeUpdateUrl(url)] !== version
  )).length
))

function isRecentTimestamp(timestamp: number) {
  return timestamp <= currentTime.value && currentTime.value - timestamp < RECENT_UPDATE_WINDOW_MS
}

function syncReadUpdates() {
  currentTime.value = Date.now()
  detectedUpdates.value = syncArticleVersions(articleUpdates)
  readUpdateVersions.value = getReadUpdateVersions()
}

function getUpdateTimestamp(item: (typeof articleUpdates)[number]) {
  const datedAt = new Date(item.date).getTime()
  if (isRecentTimestamp(datedAt)) return datedAt

  const detection = detectedUpdates.value[normalizeUpdateUrl(item.url)]
  return detection?.version === item.version ? detection.detectedAt : datedAt
}

function markUpdateRead(url: string, version: string) {
  readUpdateVersions.value = markUpdateAsRead(url, version)
}

function closeUpdatesOnOutsideClick(event: MouseEvent) {
  if (!updatesArea.value?.contains(event.target as Node)) updatesOpen.value = false
}

function closeUpdatesOnEscape(event: KeyboardEvent) {
  if (event.key === 'Escape') updatesOpen.value = false
}

onMounted(() => {
  syncReadUpdates()
  document.addEventListener('click', closeUpdatesOnOutsideClick)
  document.addEventListener('keydown', closeUpdatesOnEscape)
  window.addEventListener('storage', syncReadUpdates)
  actionTimer = setTimeout(() => (actionsVisible.value = true), 400)
  startTimer = setTimeout(() => {
    let index = 0
    typeTimer = setInterval(() => {
      index += 1
      typedText.value = message.slice(0, index)
      if (index >= message.length) clearInterval(typeTimer)
    }, 55)
  }, 600)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeUpdatesOnOutsideClick)
  document.removeEventListener('keydown', closeUpdatesOnEscape)
  window.removeEventListener('storage', syncReadUpdates)
  clearInterval(typeTimer)
  clearTimeout(actionTimer)
  clearTimeout(startTimer)
})
</script>

<template>
  <div class="knowledge-landing">
    <div class="knowledge-landing__scene">
      <div class="knowledge-landing__backdrop" />
      <CrtHead />
    </div>
    <div class="knowledge-landing__veil" />

    <header class="knowledge-landing__nav">
      <a class="knowledge-landing__brand" href="/">FRANK'S ARCHIVE<sup>®</sup><span>✳︎</span></a>
      <nav class="knowledge-landing__links" aria-label="主导航">
        <template v-for="(item, index) in navigation" :key="item.href">
          <a :href="item.href">{{ item.label }}</a><span v-if="index < navigation.length - 1">, </span>
        </template>
      </nav>
      <div class="knowledge-landing__nav-actions">
        <div ref="updatesArea" class="knowledge-landing__updates">
          <button
            class="knowledge-landing__updates-button"
            type="button"
            :aria-expanded="updatesOpen"
            :aria-label="unreadCount ? `本周更新，有 ${unreadCount} 篇未读` : '本周更新，无未读'"
            aria-controls="recent-updates-panel"
            @click="updatesOpen = !updatesOpen"
          >
            本周更新
            <span v-if="unreadCount" class="knowledge-landing__updates-dot" aria-hidden="true" />
          </button>
          <div
            v-if="updatesOpen"
            id="recent-updates-panel"
            class="knowledge-landing__updates-panel"
            aria-label="最近 7 天更新"
          >
            <p>最近 7 天更新</p>
            <ul v-if="recentUpdates.length">
              <li v-for="item in recentUpdates" :key="item.url">
                <a :href="item.url" @click="markUpdateRead(item.url, item.version)">
                  <span>{{ item.title }}</span>
                  <time :datetime="new Date(getUpdateTimestamp(item)).toISOString()">{{ dateFormatter.format(getUpdateTimestamp(item)) }}</time>
                </a>
              </li>
            </ul>
            <span v-else class="knowledge-landing__updates-empty">最近 7 天暂无更新</span>
          </div>
        </div>
        <a class="knowledge-landing__contact" href="/friends">友情链接</a>
      </div>
      <button
        class="knowledge-landing__menu"
        type="button"
        :aria-expanded="menuOpen"
        aria-label="切换导航"
        @click="menuOpen = !menuOpen"
      ><span /><span /><span /></button>
    </header>

    <div class="knowledge-landing__mobile" :class="{ 'is-open': menuOpen }">
      <a v-for="item in recentUpdates" :key="`update-${item.url}`" :href="item.url" @click="markUpdateRead(item.url, item.version)">本周更新 · {{ item.title }}</a>
      <a v-for="item in navigation" :key="item.href" :href="item.href">{{ item.label }}</a>
      <a href="/friends">友情链接</a>
    </div>

    <main class="knowledge-landing__hero">
      <div class="knowledge-landing__intro">嘿，欢迎来到 Frank 的知识库，<br>一座持续生长的技术实践档案。</div>
      <p class="knowledge-landing__typed">{{ typedText }}<span v-if="typedText.length < message.length" class="knowledge-landing__cursor" /></p>
      <div class="knowledge-landing__actions" :class="{ 'is-visible': actionsVisible }">
        <a v-for="topic in topics" :key="topic.href" :href="topic.href">{{ topic.label }}</a>
        <a class="knowledge-landing__outline" href="/blog/">浏览全部文章 <span aria-hidden="true">↗</span></a>
      </div>
    </main>

  </div>
</template>
