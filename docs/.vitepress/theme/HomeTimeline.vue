<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { data as articleUpdates } from './recent-updates.data'
import { filterTimeline, shouldFocusArchiveSearch, visibleTimelineItems } from './archive-state.mjs'

const query = ref('')
const page = ref(1)
const search = ref<HTMLInputElement | null>(null)
const filtered = computed(() => filterTimeline(articleUpdates, query.value))
const visible = computed(() => visibleTimelineItems(filtered.value, page.value))
const hasMore = computed(() => visible.value.length < filtered.value.length)
const dateFormatter = new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })

watch(query, () => { page.value = 1 })

function focusSearch(event: KeyboardEvent) {
  const target = event.target as HTMLElement | null
  if (!shouldFocusArchiveSearch({ key: event.key, tagName: target?.tagName, editable: target?.isContentEditable })) return
  event.preventDefault()
  event.stopImmediatePropagation()
  search.value?.focus()
}

onMounted(() => window.addEventListener('keydown', focusSearch, true))
onBeforeUnmount(() => window.removeEventListener('keydown', focusSearch, true))
</script>

<template>
  <section class="archive-timeline" aria-labelledby="archive-timeline-title">
    <header class="archive-timeline__header">
      <div>
        <p>FRANK'S ARCHIVE</p>
        <h1 id="archive-timeline-title">文章</h1>
      </div>
      <label class="archive-search">
        <span class="sr-only">搜索文章</span>
        <input ref="search" v-model="query" type="search" placeholder="搜索文章" autocomplete="off" aria-keyshortcuts="/">
        <kbd aria-hidden="true">/</kbd>
      </label>
    </header>

    <aside class="archive-announcement" aria-labelledby="archive-announcement-title">
      <span>NEW / AI DISCOVERY</span>
      <div>
        <strong id="archive-announcement-title">本站现已支持 WebMCP 与 llms.txt</strong>
        <p>AI Agent 可以发现站点内容，并通过只读工具搜索、读取和打开公开文章。</p>
      </div>
      <span class="archive-announcement__links">
        <a href="/ai#ai-access">查看说明</a>
        <a href="/llms.txt">打开 llms.txt</a>
      </span>
    </aside>

    <p class="archive-timeline__count" aria-live="polite">{{ filtered.length }} 篇文章</p>
    <ol v-if="visible.length" class="archive-timeline__list">
      <li v-for="item in visible" :key="item.url">
        <time :datetime="item.date">{{ dateFormatter.format(new Date(item.date)) }}</time>
        <a :href="item.url">
          <span>{{ item.title }}</span>
          <small>{{ item.description || '查看文章内容与实践记录。' }}</small>
        </a>
        <span class="archive-timeline__tag">{{ item.category }}</span>
      </li>
    </ol>
    <div v-else class="archive-empty" role="status">没有找到匹配的文章，换个关键词试试。</div>
    <button v-if="hasMore" class="archive-load-more" type="button" @click="page += 1">
      加载更多 <span aria-hidden="true">↓</span>
    </button>
  </section>
</template>

<style scoped>
.archive-timeline { width: min(1120px, calc(100vw - 64px)); margin: 0 auto; padding: calc(var(--vp-nav-height) + 72px) 0 104px; }
.archive-timeline__header { display: grid; grid-template-columns: minmax(0, 1fr) 320px; gap: 48px; align-items: end; padding-bottom: 28px; border-bottom: 1px solid var(--vp-c-divider); }
.archive-timeline__header p { margin: 0 0 16px; color: var(--vp-c-brand-1); font-size: 11px; font-weight: 700; letter-spacing: .14em; }
.archive-timeline__header h1 { margin: 0; border: 0; font-size: clamp(42px, 6vw, 72px); line-height: 1; letter-spacing: -.05em; }
.archive-timeline__header span { display: block; margin-top: 18px; color: var(--vp-c-text-2); line-height: 1.7; }
.archive-search { position: relative; display: flex; align-items: center; }
.archive-search input { width: 100%; min-height: 48px; padding: 0 48px 0 15px; border: 1px solid var(--vp-c-divider); border-radius: 4px; background: var(--vp-c-bg-soft); color: var(--vp-c-text-1); font: inherit; }
.archive-search input:focus { border-color: var(--vp-c-brand-1); outline: 3px solid color-mix(in srgb, var(--vp-c-brand-1) 24%, transparent); }
.archive-search kbd { position: absolute; right: 12px; border: 1px solid var(--vp-c-divider); border-radius: 3px; padding: 1px 6px; color: var(--vp-c-text-3); font-size: 11px; }
.archive-announcement { display: grid; grid-template-columns: 126px minmax(0, 1fr) auto; gap: 24px; align-items: start; margin-top: 28px; border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 36%, var(--vp-c-divider)); border-radius: 8px; background: var(--vp-c-bg-soft); padding: 18px 20px; }
.archive-announcement > span:first-child { color: var(--vp-c-brand-1); font-family: var(--vp-font-family-mono); font-size: 10px; font-weight: 700; letter-spacing: .1em; }
.archive-announcement strong { display: block; color: var(--vp-c-text-1); font-size: 15px; line-height: 1.45; }
.archive-announcement p { margin: 6px 0 0; color: var(--vp-c-text-2); font-size: 13px; line-height: 1.6; }
.archive-announcement__links { display: flex; gap: 14px; font-size: 12px; white-space: nowrap; }
.archive-announcement a { color: var(--vp-c-brand-1); text-decoration: none; }
.archive-announcement a:hover { text-decoration: underline; text-underline-offset: 3px; }
.archive-timeline__count { margin: 26px 0 8px; color: var(--vp-c-text-2); font-size: 13px; }
.archive-timeline__list { margin: 0; padding: 0; list-style: none; }
.archive-timeline__list li { display: grid; grid-template-columns: 126px minmax(0, 1fr) auto; gap: 24px; align-items: start; padding: 22px 8px; border-top: 1px solid var(--vp-c-divider); }
.archive-timeline__list li:last-child { border-bottom: 1px solid var(--vp-c-divider); }
.archive-timeline__list time { color: var(--vp-c-text-2); font-family: var(--vp-font-family-mono); font-size: 12px; }
.archive-timeline__list a { color: var(--vp-c-text-1); text-decoration: none; }
.archive-timeline__list a > span { display: block; font-size: 16px; font-weight: 600; line-height: 1.45; }
.archive-timeline__list a small { display: -webkit-box; margin-top: 7px; overflow: hidden; color: var(--vp-c-text-2); font-size: 13px; line-height: 1.55; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
.archive-timeline__list a:hover > span { color: var(--vp-c-brand-1); text-decoration: underline; text-underline-offset: 3px; }
.archive-timeline__tag { margin: 0; border: 1px solid var(--vp-c-divider); border-radius: 4px; padding: 3px 7px; color: var(--vp-c-text-2); font-size: 11px; white-space: nowrap; }
.archive-load-more { display: flex; min-width: 150px; min-height: 44px; justify-content: center; gap: 10px; align-items: center; margin: 32px auto 0; border: 1px solid var(--vp-c-divider); border-radius: 4px; background: transparent; color: var(--vp-c-text-1); font: inherit; cursor: pointer; }
.archive-load-more:hover { border-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); }
.archive-load-more:focus-visible, .archive-timeline__list a:focus-visible, .archive-announcement a:focus-visible { outline: 3px solid color-mix(in srgb, var(--vp-c-brand-1) 32%, transparent); outline-offset: 4px; }
.archive-empty { margin-top: 20px; padding: 36px 20px; border: 1px solid var(--vp-c-divider); color: var(--vp-c-text-2); text-align: center; }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0, 0, 0, 0); }
@media (max-width: 767px) {
  .archive-timeline { width: auto; padding: calc(var(--vp-nav-height) + 42px) 20px 72px; }
  .archive-timeline__header { grid-template-columns: 1fr; gap: 28px; }
  .archive-timeline__header h1 { font-size: clamp(40px, 13vw, 56px); }
  .archive-announcement { grid-template-columns: 1fr; gap: 10px; padding: 16px; }
  .archive-announcement__links { flex-wrap: wrap; gap: 10px 18px; }
  .archive-timeline__list li { grid-template-columns: 1fr auto; gap: 8px 12px; padding: 18px 0; }
  .archive-timeline__list time { grid-column: 1 / -1; }
  .archive-timeline__list a small { display: none; }
}
@media (prefers-reduced-motion: reduce) { * { scroll-behavior: auto !important; } }
</style>
