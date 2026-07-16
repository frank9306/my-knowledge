<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData, useRoute } from 'vitepress'
import { watch } from 'vue'
import HomeLanding from './HomeLanding.vue'
import { data as articleUpdates } from './recent-updates.data'
import { markUpdateAsRead, normalizeUpdateUrl, syncArticleVersions } from './recent-updates'

const { frontmatter } = useData()
const route = useRoute()

watch(
  () => route.path,
  (path) => {
    if (typeof window === 'undefined') return
    syncArticleVersions(articleUpdates)
    const currentUpdate = articleUpdates.find(({ url }) => normalizeUpdateUrl(url) === normalizeUpdateUrl(path))
    if (currentUpdate) markUpdateAsRead(path, currentUpdate.version)
  },
  { immediate: true }
)
</script>

<template>
  <HomeLanding v-if="frontmatter.layout === 'landing'" />
  <DefaultTheme.Layout v-else />
</template>
