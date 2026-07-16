<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import CrtHead from './CrtHead.vue'
import { data as articleUpdates } from './recent-updates.data'

const PERSON_POSITION_KEY = 'frank-archive:person-position'
const figure = ref<HTMLElement | null>(null)
const dragPosition = ref<{ x: number; y: number } | null>(null)
const dragging = ref(false)
let dragOffset = { x: 0, y: 0 }

const figureStyle = computed(() => dragPosition.value ? {
  left: `${dragPosition.value.x}px`,
  top: `${dragPosition.value.y}px`,
  right: 'auto',
  bottom: 'auto'
} : undefined)

const topics = [
  { label: 'AI Agent', href: '/ai-agent/' },
  { label: 'Python 自动化', href: '/python-automation/' },
  { label: 'RPA / Playwright', href: '/rpa-playwright/' },
  { label: 'Web / React', href: '/web-react/' }
]

const recommended = [
  { title: 'Codex Switch Helper：在 Windows 上切换多套 Codex Profile', href: '/blog/codex-switch-helper-windows-profiles' },
  { title: 'AI Agent 开发转行指南：从面试痛点看学习路径', href: '/ai-agent/ai-agent-career-guide' },
  { title: '智能体经典范式-ReAct', href: '/ai-agent/react-agent-pattern' },
  { title: '用 Locust 做 API 压测：从脚本编写到结果分析', href: '/python-automation/locust-api-load-testing' },
  { title: '三种方式挑战 Cloudflare 与 Bot 检测', href: '/rpa-playwright/playwright-rebrowser-pydoll-bot-detection' },
  { title: '给 VitePress 站点加一份 DESIGN.md', href: '/blog/design-md-visual-system-spec' }
]

const projects = [
  { title: 'QuickNav：我的个人导航站浏览器扩展', href: '/web-react/quicknav-browser-extension' },
  { title: '为了解决「链接别人从哪看起」的问题，我写了个 Chrome 插件', href: '/web-react/quicknav-chrome-extension-entrypoints' },
  { title: '使用 browser-use + DeepSeek 构建 GitHub 日榜提取器', href: '/ai-agent/browser-use-deepseek-github-trending' },
  { title: '基于 LlamaIndex 与 Notion 的智能问答系统', href: '/ai-agent/llamaindex-notion-qa' },
  { title: '在 Playwright 页面中实现持久化日志面板', href: '/rpa-playwright/playwright-page-log-panel' }
]

const latestArticles = articleUpdates.slice(0, 6)
const dateFormatter = new Intl.DateTimeFormat('zh-CN', { month: 'numeric', day: 'numeric' })

function clampPosition(x: number, y: number) {
  const rect = figure.value?.getBoundingClientRect()
  if (!rect) return { x, y }

  return {
    x: Math.min(Math.max(8, x), Math.max(8, window.innerWidth - rect.width - 8)),
    y: Math.min(Math.max(8, y), Math.max(8, window.innerHeight - rect.height - 8))
  }
}

function startDragging(event: PointerEvent) {
  if (event.button !== 0 || !figure.value) return
  const rect = figure.value.getBoundingClientRect()
  dragPosition.value = { x: rect.left, y: rect.top }
  dragOffset = { x: event.clientX - rect.left, y: event.clientY - rect.top }
  dragging.value = true
  figure.value.setPointerCapture(event.pointerId)
  event.preventDefault()
}

function moveDragging(event: PointerEvent) {
  if (!dragging.value) return
  dragPosition.value = clampPosition(event.clientX - dragOffset.x, event.clientY - dragOffset.y)
}

function stopDragging(event: PointerEvent) {
  if (!dragging.value || !figure.value || !dragPosition.value) return
  dragging.value = false
  if (figure.value.hasPointerCapture(event.pointerId)) figure.value.releasePointerCapture(event.pointerId)

  const rect = figure.value.getBoundingClientRect()
  const availableX = Math.max(1, window.innerWidth - rect.width)
  const availableY = Math.max(1, window.innerHeight - rect.height)
  window.localStorage.setItem(PERSON_POSITION_KEY, JSON.stringify({
    x: dragPosition.value.x / availableX,
    y: dragPosition.value.y / availableY
  }))
}

function restorePosition() {
  if (!figure.value) return
  try {
    const stored = JSON.parse(window.localStorage.getItem(PERSON_POSITION_KEY) ?? 'null')
    if (!stored || typeof stored.x !== 'number' || typeof stored.y !== 'number') return
    const rect = figure.value.getBoundingClientRect()
    dragPosition.value = clampPosition(
      stored.x * Math.max(1, window.innerWidth - rect.width),
      stored.y * Math.max(1, window.innerHeight - rect.height)
    )
  } catch {
    window.localStorage.removeItem(PERSON_POSITION_KEY)
  }
}

function clampCurrentPosition() {
  if (dragPosition.value) dragPosition.value = clampPosition(dragPosition.value.x, dragPosition.value.y)
}

onMounted(() => {
  requestAnimationFrame(restorePosition)
  window.addEventListener('resize', clampCurrentPosition)
})

onBeforeUnmount(() => window.removeEventListener('resize', clampCurrentPosition))
</script>

<template>
  <div class="knowledge-home">
    <header class="knowledge-home__intro">
      <p class="knowledge-home__archive">FRANK'S ARCHIVE</p>
      <h1>把技术实践<br>沉淀成可复用的知识地图</h1>
      <p class="knowledge-home__lead">AI Agent、Python 自动化、RPA、Web 开发与个人工具链笔记。</p>
      <div class="knowledge-home__topics" aria-label="知识专题">
        <a v-for="topic in topics" :key="topic.href" :href="topic.href">{{ topic.label }}</a>
      </div>
    </header>

    <aside
      ref="figure"
      class="knowledge-home__figure"
      :class="{ 'is-dragging': dragging }"
      :style="figureStyle"
      aria-label="可拖动的 3D CRT 档案管理员"
      title="按住并拖动人物"
      @pointerdown="startDragging"
      @pointermove="moveDragging"
      @pointerup="stopDragging"
      @pointercancel="stopDragging"
    >
      <CrtHead />
    </aside>

    <div class="knowledge-home__sections">
      <section class="knowledge-home__section">
        <div class="knowledge-home__section-heading">
          <div>
            <h2>推荐阅读</h2>
            <p>第一次来，可以先从这些文章开始。</p>
          </div>
          <a href="/blog/">全部文章</a>
        </div>
        <ul>
          <li v-for="item in recommended" :key="item.href">
            <a :href="item.href"><span>{{ item.title }}</span><span aria-hidden="true">↗</span></a>
          </li>
        </ul>
      </section>

      <section class="knowledge-home__section">
        <div class="knowledge-home__section-heading">
          <div>
            <h2>最新文章</h2>
            <p>最近发布与维护的内容。</p>
          </div>
        </div>
        <ul>
          <li v-for="item in latestArticles" :key="item.url">
            <a :href="item.url">
              <span>{{ item.title }}</span>
              <time :datetime="item.date">{{ dateFormatter.format(new Date(item.date)) }}</time>
            </a>
          </li>
        </ul>
      </section>

      <section class="knowledge-home__section">
        <div class="knowledge-home__section-heading">
          <div>
            <h2>实战项目</h2>
            <p>真实项目、工具链与踩坑复盘。</p>
          </div>
        </div>
        <ul>
          <li v-for="item in projects" :key="item.href">
            <a :href="item.href"><span>{{ item.title }}</span><span aria-hidden="true">↗</span></a>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>
