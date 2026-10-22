<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { data as articleUpdates } from './recent-updates.data'
import { filterTimeline, shouldFocusArchiveSearch } from './archive-state.mjs'

const topics = ['AI Agent', 'AI 编程工程', 'Python 自动化', 'RPA / Playwright', 'Web / React', '技术随笔']
const homeTitles: Record<string, { title: string; note?: string }> = {
  '/ai-agent/agentic-llms-chinese': { title: '《智能体式大语言模型》', note: '中文译本 · 23 章' },
  '/ai-coding/vibe-coding-top-10-readings': { title: '10 篇 Vibe Coding 文章' },
  '/ai-coding/cross-session-agent-handoff': { title: 'Agent Handoff：跨会话任务交接' },
  '/ai-coding/deep-modules-for-ai-coding': { title: '对 AI 友好的代码结构' }
}
const query = ref('')
const expanded = ref(false)
const page = ref(1)
const results = ref<HTMLElement | null>(null)
const searchInput = ref<HTMLInputElement | null>(null)
const filtered = computed(() => filterTimeline(articleUpdates, query.value))
const visible = computed(() => filtered.value.slice(0, expanded.value ? page.value * 12 : 4))
const hasMore = computed(() => visible.value.length < filtered.value.length)
const dateFormatter = new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC' })

watch(query, () => { page.value = 1 })

function dateLabel(date: string) {
  return dateFormatter.format(new Date(date)).replaceAll('/', '.')
}

async function openArchive(focus = false) {
  expanded.value = true
  await nextTick()
  if (focus) searchInput.value?.focus({ preventScroll: true })
  results.value?.scrollIntoView({ block: 'start' })
}

async function selectTopic(topic: string) {
  query.value = topic
  await openArchive()
}

function focusSearch(event: KeyboardEvent) {
  const target = event.target as HTMLElement | null
  if (event.ctrlKey || event.metaKey || event.altKey) return
  if (shouldFocusArchiveSearch({ key: event.key, tagName: target?.tagName, editable: target?.isContentEditable })) {
    event.preventDefault()
    event.stopPropagation()
    void openArchive(true)
  }
}

onMounted(() => document.addEventListener('keydown', focusSearch))
onUnmounted(() => document.removeEventListener('keydown', focusSearch))
</script>

<template>
  <section class="study-hero" aria-labelledby="study-title">
    <div class="study-hero__copy">
      <h1 id="study-title" data-fidelity="headline">边学，<br>边记。</h1>
      <p>AI、代码与自动化笔记。</p>
      <a class="study-read" href="#study-stories">开始阅读 <span aria-hidden="true">↗</span></a>
    </div>
    <figure class="study-hero__photo">
      <img src="/images/quiet-study/desk.webp" alt="" width="1840" height="855" fetchpriority="high" decoding="async">
    </figure>
  </section>

  <section id="study-stories" ref="results" class="study-stories" aria-labelledby="study-stories-title">
    <header class="study-section-heading">
      <h2 id="study-stories-title">{{ expanded ? '全部文章' : '案头新文' }}</h2>
      <button v-if="!expanded" type="button" class="study-text-action" @click="openArchive()">全部文章 <span aria-hidden="true">↗</span></button>
      <button v-else type="button" class="study-text-action" @click="expanded = false; query = ''; page = 1">收起列表 ↑</button>
    </header>

    <form v-if="expanded" class="study-search" role="search" @submit.prevent>
      <label class="sr-only" for="study-query">搜索文章</label>
      <input id="study-query" ref="searchInput" v-model="query" type="search" placeholder="搜索标题、主题或关键词" autocomplete="off">
      <button v-if="query" type="button" class="study-text-action" @click="query = ''">清除筛选</button>
      <span class="study-search__count" aria-live="polite">{{ filtered.length }} 篇</span>
    </form>

    <div v-if="visible.length" class="study-articles" :class="{ 'is-expanded': expanded }">
      <article v-for="(item, index) in visible" :key="item.url" class="study-article" :class="{ 'study-article--lead': index < 2 && !expanded }">
        <a :href="item.url" class="study-article__link" :aria-label="item.title">
          <img v-if="index === 1 && !expanded" class="study-article__image" src="/images/quiet-study/desk.webp" alt="" width="1840" height="855" loading="lazy" decoding="async">
          <div class="study-article__copy">
            <div>
              <h3>{{ !expanded ? homeTitles[item.url]?.title || item.title : item.title }}</h3>
              <p v-if="!expanded && homeTitles[item.url]?.note" class="study-article__note">{{ homeTitles[item.url].note }}</p>
            </div>
            <time :datetime="item.date">{{ dateLabel(item.date) }}</time>
          </div>
        </a>
      </article>
    </div>

    <div v-else class="study-empty" role="status">
      <p>没有找到相关文章。</p>
      <span>换个关键词，或清除筛选。</span>
    </div>
    <button v-if="expanded && hasMore" class="study-load-more" type="button" @click="page += 1">更多文章 ↓</button>
  </section>

  <nav id="study-topics" class="study-topics" aria-label="按主题阅读">
    <div class="study-topics__inner">
      <h2>按主题阅读</h2>
      <div class="study-topics__links">
        <button v-for="topic in topics" :key="topic" type="button" :aria-pressed="query === topic" @click="selectTopic(topic)">{{ topic }}</button>
      </div>
    </div>
  </nav>
</template>
