<script setup lang="ts">
import { computed, ref } from 'vue'
import { favoriteCategories, favorites, type FavoriteCategory, type FavoriteType } from './favorites'
import { filterFavorites } from './archive-state.mjs'

const query = ref('')
const type = ref<'all' | FavoriteType>('all')
const category = ref<'all' | FavoriteCategory>('all')
const filtered = computed(() => filterFavorites(favorites, { query: query.value, type: type.value, category: category.value }))
</script>

<template>
  <main class="favorites-page">
    <header class="favorites-hero">
      <p>TOOLS / REFERENCES</p>
      <h1>把值得反复使用的东西，留在手边。</h1>
      <span>这里不是链接仓库，而是一份经过使用、阅读和筛选后留下的工作台。</span>
    </header>

    <section class="favorites-controls" aria-label="筛选工具收藏">
      <label class="favorites-search">
        <span class="sr-only">搜索工具收藏</span>
        <span aria-hidden="true">⌕</span>
        <input v-model="query" type="search" placeholder="搜索名称、说明或用途" autocomplete="off">
      </label>

      <div class="favorites-types" aria-label="按内容类型筛选">
        <button
          v-for="option in [{ id: 'all', label: '全部' }, { id: 'resource', label: '工具资源' }, { id: 'article', label: '参考文章' }]"
          :key="option.id"
          type="button"
          :class="{ 'is-active': type === option.id }"
          :aria-pressed="type === option.id"
          @click="type = option.id as typeof type"
        >
          {{ option.label }}
        </button>
      </div>

      <div class="favorites-categories" aria-label="按使用场景筛选">
        <button type="button" :class="{ 'is-active': category === 'all' }" :aria-pressed="category === 'all'" @click="category = 'all'">
          全部场景
        </button>
        <button
          v-for="item in favoriteCategories"
          :key="item.id"
          type="button"
          :class="{ 'is-active': category === item.id }"
          :aria-pressed="category === item.id"
          @click="category = item.id"
        >
          {{ item.label }}
        </button>
      </div>
    </section>

    <div class="favorites-result">
      <h2>当前选择</h2>
      <p aria-live="polite">找到 {{ filtered.length }} 项可以继续探索的内容。</p>
    </div>

    <ul v-if="filtered.length" class="favorites-grid">
      <li v-for="item in filtered" :key="item.id">
        <a :href="item.url" target="_blank" rel="noreferrer">
          <span class="favorites-grid__meta">
            <span>{{ item.type === 'resource' ? '工具资源' : '参考文章' }}</span>
            <span>{{ favoriteCategories.find(({ id }) => id === item.category)?.label }}</span>
          </span>
          <strong>{{ item.title }}</strong>
          <small>{{ item.summary }}</small>
          <span class="favorites-grid__action">打开来源 <span aria-hidden="true">↗</span></span>
        </a>
      </li>
    </ul>

    <div v-else class="favorites-empty" role="status">
      <strong>这组条件下还没有收藏。</strong>
      <span>清空关键词，或切换一个使用场景。</span>
    </div>
  </main>
</template>

<style scoped>
.favorites-page { width: var(--atlas-shell); margin: 0 auto; padding: 80px 0 104px; color: var(--atlas-text); }
.favorites-hero { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(260px, .6fr); gap: 44px; align-items: end; max-width: 1120px; margin-bottom: 60px; }
.favorites-hero > p { grid-column: 1 / -1; margin: 0 0 -16px; color: var(--atlas-accent); font-family: var(--vp-font-family-mono); font-size: 11px; font-weight: 700; letter-spacing: .14em; }
.favorites-hero h1 { margin: 0; border: 0; color: var(--atlas-text); font-size: clamp(44px, 5.7vw, 76px); font-weight: 760; letter-spacing: -.055em; line-height: 1.1; }
.favorites-hero > span { color: var(--atlas-text-muted); font-size: 16px; line-height: 1.75; }
.favorites-controls { display: grid; grid-template-columns: minmax(280px, 1fr) auto; gap: 16px 28px; border-block: 1px solid var(--atlas-line); padding: 18px 0; }
.favorites-search { display: grid; grid-template-columns: 24px minmax(0, 1fr); align-items: center; min-height: 48px; border: 1px solid var(--atlas-line); border-radius: 4px; color: var(--atlas-text-muted); }
.favorites-search > span { padding-left: 14px; font-size: 20px; }
.favorites-search input { min-width: 0; height: 46px; border: 0; outline: 0; background: transparent; padding: 0 14px; color: var(--atlas-text); }
.favorites-search:focus-within { border-color: var(--atlas-accent); outline: 3px solid color-mix(in srgb, var(--atlas-accent) 18%, transparent); }
.favorites-types,
.favorites-categories { display: flex; gap: 8px; overflow-x: auto; }
.favorites-categories { grid-column: 1 / -1; padding-top: 2px; }
button { flex: 0 0 auto; min-height: 42px; border: 1px solid var(--atlas-line); border-radius: 4px; background: transparent; padding: 0 13px; color: var(--atlas-text-muted); cursor: pointer; }
button:hover,
button.is-active { border-color: var(--atlas-accent); color: var(--atlas-text); }
button.is-active { background: color-mix(in srgb, var(--atlas-accent) 10%, transparent); }
.favorites-result { display: flex; justify-content: space-between; gap: 24px; align-items: end; padding: 38px 0 18px; }
.favorites-result h2 { margin: 0; font-size: 26px; letter-spacing: -.025em; }
.favorites-result p { margin: 0; color: var(--atlas-text-muted); font-size: 13px; }
.favorites-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: 52px; margin: 0; padding: 0; list-style: none; }
.favorites-grid li { min-width: 0; border-bottom: 1px solid var(--atlas-line); }
.favorites-grid a { display: flex; min-height: 224px; flex-direction: column; padding: 26px 8px; color: inherit; text-decoration: none; }
.favorites-grid a:hover strong { color: var(--atlas-accent-strong); }
.favorites-grid__meta { display: flex; justify-content: space-between; gap: 18px; color: var(--atlas-text-muted); font-family: var(--vp-font-family-mono); font-size: 10px; }
.favorites-grid strong { margin-top: 20px; color: var(--atlas-text); font-size: 20px; line-height: 1.42; }
.favorites-grid small { display: -webkit-box; margin-top: 10px; overflow: hidden; color: var(--atlas-text-muted); font-size: 13px; line-height: 1.65; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
.favorites-grid__action { display: flex; justify-content: space-between; margin-top: auto; padding-top: 18px; color: var(--atlas-accent-strong); font-size: 12px; }
.favorites-empty { display: grid; gap: 8px; border: 1px solid var(--atlas-line); padding: 40px; color: var(--atlas-text-muted); }
.favorites-empty strong { color: var(--atlas-text); font-size: 20px; }
@media (max-width: 767px) {
  .favorites-page { padding: 48px 0 72px; }
  .favorites-hero { grid-template-columns: 1fr; gap: 20px; margin-bottom: 42px; }
  .favorites-hero > p { grid-column: 1; margin-bottom: 0; }
  .favorites-hero h1 { font-size: clamp(42px, 12vw, 58px); }
  .favorites-controls { grid-template-columns: 1fr; }
  .favorites-categories { grid-column: 1; }
  .favorites-result { align-items: start; flex-direction: column; gap: 8px; }
  .favorites-grid { grid-template-columns: 1fr; }
  .favorites-grid a { min-height: 205px; padding-inline: 0; }
}
</style>
