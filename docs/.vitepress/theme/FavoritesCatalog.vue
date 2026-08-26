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
    <header>
      <p>CURATED BY FRANK</p>
      <h1>我的收藏</h1>
      <span>把长期使用的资源和值得反复阅读的好文放在同一份目录里。</span>
    </header>
    <div class="favorites-toolbar">
      <label><span class="sr-only">搜索收藏</span><input v-model="query" type="search" placeholder="搜索收藏"></label>
      <div class="favorites-types" aria-label="按收藏类型筛选">
        <button v-for="option in [{ id: 'all', label: '全部' }, { id: 'resource', label: '资源' }, { id: 'article', label: '好文' }]" :key="option.id" type="button" :class="{ 'is-active': type === option.id }" :aria-pressed="type === option.id" @click="type = option.id as typeof type">{{ option.label }}</button>
      </div>
    </div>
    <div class="favorites-categories" aria-label="按用途筛选">
      <button type="button" :class="{ 'is-active': category === 'all' }" :aria-pressed="category === 'all'" @click="category = 'all'">全部用途</button>
      <button v-for="item in favoriteCategories" :key="item.id" type="button" :class="{ 'is-active': category === item.id }" :aria-pressed="category === item.id" @click="category = item.id">{{ item.label }}</button>
    </div>
    <p class="favorites-count" aria-live="polite">当前显示 {{ filtered.length }} 项</p>
    <ul v-if="filtered.length" class="favorites-list">
      <li v-for="item in filtered" :key="item.id">
        <span class="favorites-list__type">{{ item.type === 'resource' ? '资源' : '好文' }}</span>
        <a :href="item.url" target="_blank" rel="noreferrer"><strong>{{ item.title }}</strong><small>{{ item.summary }}</small></a>
        <span>{{ favoriteCategories.find(({ id }) => id === item.category)?.label }}</span>
      </li>
    </ul>
    <div v-else class="favorites-empty" role="status">没有符合条件的收藏，请调整搜索或筛选条件。</div>
  </main>
</template>

<style scoped>
.favorites-page { width: min(1120px, calc(100vw - 64px)); margin: 0 auto; padding: 64px 0 96px; }
.favorites-page header { max-width: 760px; margin-bottom: 38px; }
.favorites-page header p { margin: 0 0 14px; color: var(--vp-c-brand-1); font-size: 11px; font-weight: 700; letter-spacing: .14em; }
.favorites-page h1 { margin: 0 0 16px; border: 0; font-size: clamp(42px, 6vw, 70px); line-height: 1; letter-spacing: -.05em; }
.favorites-page header span { color: var(--vp-c-text-2); line-height: 1.7; }
.favorites-toolbar { display: grid; grid-template-columns: minmax(260px, 1fr) auto; gap: 16px; padding: 18px 0; border-block: 1px solid var(--vp-c-divider); }
.favorites-toolbar input { width: 100%; min-height: 44px; padding: 0 14px; border: 1px solid var(--vp-c-divider); border-radius: 4px; background: var(--vp-c-bg-soft); color: var(--vp-c-text-1); font: inherit; }
.favorites-types, .favorites-categories { display: flex; gap: 8px; overflow-x: auto; }
.favorites-types button, .favorites-categories button { flex: 0 0 auto; min-height: 44px; border: 1px solid var(--vp-c-divider); border-radius: 4px; background: transparent; padding: 0 13px; color: var(--vp-c-text-2); font: inherit; font-size: 13px; cursor: pointer; }
.favorites-categories { padding: 14px 0; border-bottom: 1px solid var(--vp-c-divider); }
button:hover, button.is-active { border-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); }
button.is-active { background: color-mix(in srgb, var(--vp-c-brand-1) 8%, transparent); }
.favorites-count { margin: 22px 0 8px; color: var(--vp-c-text-2); font-size: 13px; }
.favorites-list { margin: 0; padding: 0; list-style: none; }
.favorites-list li { display: grid; grid-template-columns: 64px minmax(0, 1fr) 110px; gap: 22px; align-items: start; padding: 20px 8px; border-top: 1px solid var(--vp-c-divider); }
.favorites-list li:last-child { border-bottom: 1px solid var(--vp-c-divider); }
.favorites-list__type { color: var(--vp-c-brand-1) !important; font-family: var(--vp-font-family-mono); }
.favorites-list li > span { color: var(--vp-c-text-2); font-size: 12px; }
.favorites-list a { color: var(--vp-c-text-1); text-decoration: none; }
.favorites-list strong, .favorites-list small { display: block; }
.favorites-list strong { line-height: 1.45; }
.favorites-list small { margin-top: 7px; color: var(--vp-c-text-2); font-size: 13px; line-height: 1.55; }
.favorites-list a:hover strong { color: var(--vp-c-brand-1); text-decoration: underline; text-underline-offset: 3px; }
input:focus, button:focus-visible, a:focus-visible { outline: 3px solid color-mix(in srgb, var(--vp-c-brand-1) 32%, transparent); outline-offset: 3px; }
.favorites-empty { margin-top: 18px; padding: 36px 20px; border: 1px solid var(--vp-c-divider); color: var(--vp-c-text-2); text-align: center; }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0, 0, 0, 0); }
@media (max-width: 767px) {
  .favorites-page { width: auto; padding: 44px 20px 72px; }
  .favorites-toolbar { grid-template-columns: 1fr; }
  .favorites-list li { grid-template-columns: 54px minmax(0, 1fr); gap: 10px 14px; }
  .favorites-list li > span:last-child { grid-column: 2; }
}
</style>
