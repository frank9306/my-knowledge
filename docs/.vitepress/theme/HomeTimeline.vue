<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { data as articleUpdates } from './recent-updates.data'
import { filterTimeline, shouldFocusArchiveSearch } from './archive-state.mjs'

const PAGE_SIZE = 12

const topics = [
  { id: 'ai-agent', label: 'AI Agent', query: 'AI Agent', details: ['Agent 架构', '工具调用', '知识工程'] },
  { id: 'ai-coding', label: 'AI 编程工程', query: 'AI 编程工程', details: ['开发范式', '代码工具', '工程实践'] },
  { id: 'python', label: 'Python 自动化', query: 'Python 自动化', details: ['脚本与工具', '数据处理', '自动化实践'] },
  { id: 'rpa', label: 'RPA / Playwright', query: 'RPA / Playwright', details: ['流程自动化', '浏览器控制', '工程集成'] },
  { id: 'web', label: 'Web / React', query: 'Web / React', details: ['前端工程化', 'React 生态', '构建与部署'] },
  { id: 'notes', label: '技术随笔', query: '技术随笔', details: ['思考与总结', '工具评测', '行业观察'] }
]

const query = ref('')
const page = ref(1)
const results = ref<HTMLElement | null>(null)
const searchInput = ref<HTMLInputElement | null>(null)
const filtered = computed(() => filterTimeline(articleUpdates, query.value))
const featured = computed(() => filtered.value[0])
const secondary = computed(() => filtered.value.filter((item) => item.url !== featured.value?.url).slice(0, 3))
const remaining = computed(() => filtered.value
  .filter((item) => item.url !== featured.value?.url && !secondary.value.some(({ url }) => url === item.url))
  .slice(0, Math.max(0, page.value * PAGE_SIZE - 4)))
const visibleCount = computed(() => (featured.value ? 1 : 0) + secondary.value.length + remaining.value.length)
const hasMore = computed(() => visibleCount.value < filtered.value.length)
const dateFormatter = new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })

watch(query, () => { page.value = 1 })

function focusSearch(event: KeyboardEvent) {
  const target = event.target as HTMLElement | null
  if (event.ctrlKey || event.metaKey || event.altKey) return
  if (shouldFocusArchiveSearch({ key: event.key, tagName: target?.tagName, editable: target?.isContentEditable })) {
    event.preventDefault()
    searchInput.value?.focus()
  }
}

onMounted(() => window.addEventListener('keydown', focusSearch))
onUnmounted(() => window.removeEventListener('keydown', focusSearch))

function showResults() {
  results.value?.scrollIntoView({ block: 'start' })
}

async function selectTopic(topic: (typeof topics)[number]) {
  query.value = topic.query
  await nextTick()
  results.value?.scrollIntoView({ block: 'start' })
}
</script>

<template>
  <section class="atlas-hero" aria-labelledby="atlas-title">
    <div class="atlas-hero__copy">
      <p class="atlas-brandline">FRANK / KNOWLEDGE</p>
      <h1 id="atlas-title" data-fidelity="headline">把零散经验，<br>组织成可复用的系统。</h1>
      <p class="atlas-hero__lead">这里记录 AI Agent、自动化与前端工程中，真正解决过问题的方法。</p>

      <form class="atlas-search" role="search" @submit.prevent="showResults">
        <label class="sr-only" for="atlas-query">搜索技术文章</label>
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="m15.5 15.5 5 5" />
        </svg>
        <input id="atlas-query" ref="searchInput" v-model="query" type="search" placeholder="搜索技术文章" autocomplete="off">
        <button type="submit" aria-label="查看搜索结果">→</button>
      </form>
    </div>

    <div class="atlas-map" data-fidelity="map" role="region" aria-label="知识主题地图">
      <h2 id="knowledge-map-title" class="sr-only">知识主题地图</h2>
      <svg class="atlas-map__paths" viewBox="0 0 720 440" aria-hidden="true">
        <path d="M344 220 C286 188 247 146 205 96" />
        <path d="M360 214 C423 165 480 125 548 101" />
        <path d="M367 232 C431 237 485 269 552 292" />
        <path d="M337 235 C284 257 239 292 190 306" />
        <path d="M351 248 C347 301 356 338 379 374" />
        <path class="atlas-map__orbit" d="M126 225 C194 92 488 44 633 183 C687 235 650 361 518 400" />
        <circle cx="277" cy="154" r="3" />
        <circle cx="444" cy="154" r="3" />
        <circle cx="463" cy="253" r="3" />
        <circle cx="271" cy="270" r="3" />
        <circle cx="354" cy="309" r="3" />
      </svg>

      <button
        v-for="topic in topics"
        :key="topic.id"
        type="button"
        class="atlas-node"
        :class="`atlas-node--${topic.id}`"
        :aria-pressed="query === topic.query"
        @click="selectTopic(topic)"
      >
        <span class="atlas-node__point" aria-hidden="true" />
        <strong>{{ topic.label }}</strong>
        <small v-for="detail in topic.details" :key="detail">{{ detail }}</small>
      </button>
    </div>
  </section>

  <section id="atlas-stories" ref="results" class="atlas-stories" aria-labelledby="atlas-stories-title">
    <header class="atlas-stories__header">
      <div>
        <h2 id="atlas-stories-title">{{ query ? `“${query}”的相关记录` : '从这里开始' }}</h2>
        <p aria-live="polite">{{ filtered.length }} 篇可检索文章，按最近更新排序。</p>
      </div>
      <div class="atlas-machine-access">
        <span>面向读者，也面向 Agent</span>
        <a href="/ai#ai-access">了解 WebMCP</a>
        <a href="/llms.txt">打开 llms.txt</a>
      </div>
    </header>

    <div v-if="featured" class="atlas-stories__grid">
      <article class="atlas-featured">
        <a class="atlas-featured__visual" :href="featured.url" tabindex="-1" aria-hidden="true">
          <img v-if="featured.image" :src="featured.image" alt="">
          <span v-else class="atlas-featured__fallback">KNOWLEDGE<br>FIELD</span>
        </a>
        <div class="atlas-featured__body">
          <span>{{ featured.category }}</span>
          <h3><a :href="featured.url">{{ featured.title }}</a></h3>
          <p>{{ featured.description || '从真实问题出发，记录判断、实现与验证过程。' }}</p>
          <div>
            <time :datetime="featured.date">最近更新 {{ dateFormatter.format(new Date(featured.date)) }}</time>
            <a :href="featured.url" :aria-label="`阅读 ${featured.title}`">→</a>
          </div>
        </div>
      </article>

      <ol class="atlas-secondary">
        <li v-for="item in secondary" :key="item.url">
          <a :href="item.url">
            <span>{{ item.title }}</span>
            <small>{{ item.description || '查看文章内容与实践记录。' }}</small>
            <span class="atlas-secondary__meta">
              <span>{{ item.category }}</span>
              <time :datetime="item.date">{{ dateFormatter.format(new Date(item.date)) }}</time>
            </span>
            <span aria-hidden="true">→</span>
          </a>
        </li>
      </ol>
    </div>

    <ol v-if="remaining.length" class="atlas-more">
      <li v-for="item in remaining" :key="item.url">
        <a :href="item.url">
          <time :datetime="item.date">{{ dateFormatter.format(new Date(item.date)) }}</time>
          <span>{{ item.title }}</span>
          <small>{{ item.category }}</small>
          <span aria-hidden="true">→</span>
        </a>
      </li>
    </ol>

    <div v-if="!filtered.length" class="atlas-empty" role="status">
      <strong>还没有找到对应记录。</strong>
      <span>换一个更短的关键词，或从知识地图选择主题。</span>
    </div>

    <button v-if="hasMore" class="atlas-load-more" type="button" @click="page += 1">
      查看更多文章
    </button>
  </section>
</template>
