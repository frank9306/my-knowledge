<script setup lang="ts">
import { computed, ref } from 'vue'
import { resourceCategories, resources, type ResourceCategoryId } from './resources'

const props = defineProps<{ mode: 'all' | 'recommended' }>()
const selectedCategory = ref<'all' | ResourceCategoryId>('all')

const recommendedResources = computed(() => resources.filter((resource) => resource.recommended))
const recommendedCategories = computed(() => resourceCategories.filter(({ id }) =>
  recommendedResources.value.some((resource) => resource.category === id)))
const filteredRecommendations = computed(() => selectedCategory.value === 'all'
  ? recommendedResources.value
  : recommendedResources.value.filter(({ category }) => category === selectedCategory.value))
const populatedCategories = computed(() => resourceCategories.map((category) => ({
  ...category,
  resources: resources.filter((resource) => resource.category === category.id)
})).filter(({ resources }) => resources.length))
</script>

<template>
  <main class="resource-catalog" :class="`resource-catalog--${mode}`">
    <div class="resource-catalog__intro">
      <p class="resource-catalog__eyebrow">资源导航</p>
      <h1>{{ mode === 'recommended' ? '精选推荐' : '全部资源' }}</h1>
      <p v-if="mode === 'recommended'">经过长期关注或实际使用，值得优先了解的工具与资料。</p>
      <p v-else>按主题浏览长期会反复使用的工具、资料和服务。资源只维护一份，推荐内容会自动同步。</p>
      <a v-if="mode === 'all'" class="resource-catalog__featured-link" href="/resources/recommended">
        查看全部精选推荐 <span aria-hidden="true">→</span>
      </a>
      <a v-else class="resource-catalog__featured-link" href="/resources/">
        浏览完整资源目录 <span aria-hidden="true">→</span>
      </a>
    </div>

    <template v-if="mode === 'recommended'">
      <div class="resource-filters" aria-label="按资源类型筛选">
        <button
          type="button"
          :class="{ 'is-active': selectedCategory === 'all' }"
          :aria-pressed="selectedCategory === 'all'"
          @click="selectedCategory = 'all'"
        >
          全部 <span>{{ recommendedResources.length }}</span>
        </button>
        <button
          v-for="category in recommendedCategories"
          :key="category.id"
          type="button"
          :class="{ 'is-active': selectedCategory === category.id }"
          :aria-pressed="selectedCategory === category.id"
          @click="selectedCategory = category.id"
        >
          {{ category.label }}
        </button>
      </div>

      <p class="resource-catalog__result-count" aria-live="polite">
        当前显示 {{ filteredRecommendations.length }} 项推荐
      </p>

      <div class="recommended-grid">
        <article v-for="resource in filteredRecommendations" :key="resource.id" class="recommended-card">
          <div class="recommended-card__meta">
            <span class="recommended-card__badge">长期推荐</span>
            <span>{{ resourceCategories.find(({ id }) => id === resource.category)?.label }}</span>
          </div>
          <h2><a :href="resource.url" target="_blank" rel="noreferrer">{{ resource.title }}</a></h2>
          <p class="recommended-card__summary">{{ resource.summary }}</p>
          <dl>
            <div>
              <dt>适合</dt>
              <dd>{{ resource.audience }}</dd>
            </div>
            <div>
              <dt>推荐理由</dt>
              <dd>{{ resource.reason }}</dd>
            </div>
            <div>
              <dt>使用提醒</dt>
              <dd>{{ resource.caution }}</dd>
            </div>
          </dl>
          <a class="recommended-card__action" :href="resource.url" target="_blank" rel="noreferrer">
            访问资源 <span aria-hidden="true">↗</span>
          </a>
        </article>
      </div>
    </template>

    <div v-else class="resource-sections">
      <section v-for="category in populatedCategories" :key="category.id" :id="category.id">
        <div class="resource-section__heading">
          <h2>{{ category.label }}</h2>
          <span>{{ category.resources.length }} 项</span>
        </div>
        <ul>
          <li v-for="resource in category.resources" :key="resource.id">
            <div>
              <a :href="resource.url" target="_blank" rel="noreferrer">{{ resource.title }}</a>
              <span v-if="resource.recommended" class="resource-list__badge">长期推荐</span>
            </div>
            <p>{{ resource.summary }}</p>
          </li>
        </ul>
      </section>
    </div>
  </main>
</template>

<style scoped>
.resource-catalog {
  box-sizing: border-box;
  max-width: 1320px;
  margin: 0 auto;
  padding: 64px 32px 80px;
  color: var(--vp-c-text-1);
}

.resource-catalog__intro {
  max-width: 760px;
  margin-bottom: 32px;
}

.resource-catalog__eyebrow {
  margin: 0 0 8px;
  color: var(--vp-c-brand-1);
  font-size: 0.875rem;
  font-weight: 600;
}

.resource-catalog h1 {
  margin: 0 0 12px;
  border: 0;
  font-size: clamp(2rem, 5vw, 2.5rem);
  line-height: 1.15;
  letter-spacing: -0.03em;
}

.resource-catalog__intro > p:not(.resource-catalog__eyebrow) {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 1rem;
  line-height: 1.7;
}

.resource-catalog__featured-link {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  margin-top: 16px;
  color: var(--vp-c-brand-1);
  font-size: 0.9375rem;
  font-weight: 600;
}

.resource-filters {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 4px;
  overflow-x: auto;
}

.resource-filters button {
  flex: 0 0 auto;
  min-height: 42px;
  padding: 8px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font: inherit;
  font-size: 0.875rem;
  cursor: pointer;
}

.resource-filters button span {
  margin-left: 4px;
  color: var(--vp-c-text-3);
}

.resource-filters button:hover,
.resource-filters button.is-active {
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 42%, transparent);
  background: color-mix(in srgb, var(--vp-c-brand-1) 8%, var(--vp-c-bg-soft));
  color: var(--vp-c-brand-1);
}

.resource-filters button:focus-visible,
.recommended-card a:focus-visible,
.resource-sections a:focus-visible,
.resource-catalog__featured-link:focus-visible {
  border-radius: 4px;
  outline: 3px solid color-mix(in srgb, var(--vp-c-brand-1) 35%, transparent);
  outline-offset: 3px;
}

.resource-catalog__result-count {
  margin: 0 0 16px;
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
}

.recommended-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.recommended-card {
  display: flex;
  min-width: 0;
  flex-direction: column;
  padding: 20px 20px 16px;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 18%, var(--vp-c-divider));
  border-left: 3px solid var(--vp-c-brand-1);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.recommended-card:hover {
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 45%, var(--vp-c-divider));
}

.recommended-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  min-height: 24px;
  color: var(--vp-c-text-2);
  font-size: 0.75rem;
}

.recommended-card__badge,
.resource-list__badge {
  display: inline-flex;
  align-items: center;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 35%, transparent);
  border-radius: 4px;
  background: color-mix(in srgb, var(--vp-c-brand-1) 8%, transparent);
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

.recommended-card__badge {
  padding: 3px 7px;
}

.recommended-card h2 {
  margin: 14px 0 6px;
  border: 0;
  font-size: 1.25rem;
  line-height: 1.35;
}

.recommended-card h2 a {
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.recommended-card h2 a:hover {
  color: var(--vp-c-brand-1);
}

.recommended-card__summary {
  margin: 0 0 16px;
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
  line-height: 1.6;
}

.recommended-card dl {
  margin: auto 0 0;
  border-top: 1px solid var(--vp-c-divider);
}

.recommended-card dl div {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr);
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid var(--vp-c-divider);
}

.recommended-card dt {
  color: var(--vp-c-brand-1);
  font-size: 0.8125rem;
  font-weight: 600;
}

.recommended-card dd {
  min-width: 0;
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 0.8125rem;
  line-height: 1.55;
  overflow-wrap: anywhere;
}

.recommended-card__action {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  color: var(--vp-c-brand-1);
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
}

.resource-sections {
  display: grid;
  gap: 32px;
}

.resource-sections section {
  scroll-margin-top: 88px;
}

.resource-section__heading {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-top: 20px;
  border-top: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 18%, var(--vp-c-divider));
}

.resource-section__heading h2 {
  margin: 0;
  border: 0;
  font-size: 1.5rem;
}

.resource-section__heading > span {
  color: var(--vp-c-text-3);
  font-size: 0.8125rem;
}

.resource-sections ul {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px 24px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.resource-sections li {
  min-width: 0;
  padding: 14px 0;
  border-bottom: 1px solid var(--vp-c-divider);
}

.resource-sections li > div {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.resource-sections li a {
  color: var(--vp-c-text-1);
  font-weight: 600;
  text-decoration: none;
}

.resource-sections li a:hover {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.resource-list__badge {
  padding: 1px 5px;
  font-size: 0.6875rem;
}

.resource-sections li p {
  margin: 6px 0 0;
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
  line-height: 1.6;
}

@media (max-width: 1023px) {
  .recommended-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 767px) {
  .resource-catalog {
    padding: 40px 20px 64px;
  }

  .recommended-grid,
  .resource-sections ul {
    grid-template-columns: 1fr;
  }

  .recommended-card {
    padding: 18px 16px 14px;
  }

  .recommended-card dl div {
    grid-template-columns: 68px minmax(0, 1fr);
  }
}

@media (max-width: 374px) {
  .resource-catalog {
    padding-right: 16px;
    padding-left: 16px;
  }

  .recommended-card dl div {
    grid-template-columns: 1fr;
    gap: 4px;
  }
}
</style>
