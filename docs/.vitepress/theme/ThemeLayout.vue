<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData, useRoute } from 'vitepress'
import { onBeforeUnmount, onMounted, watch } from 'vue'
import HomeLanding from './HomeLanding.vue'
import RecentUpdates from './RecentUpdates.vue'
import ResourceCatalog from './ResourceCatalog.vue'
import RemoteAgents from './RemoteAgents.vue'
import RemoteSkills from './RemoteSkills.vue'
import FavoritesCatalog from './FavoritesCatalog.vue'
import AiOverview from './AiOverview.vue'
import { data as articleUpdates } from './recent-updates.data'
import { markUpdateAsRead, normalizeUpdateUrl, syncArticleVersions } from './recent-updates'
import { registerWebMcpTools } from './webmcp.mjs'

const { frontmatter } = useData()
const route = useRoute()
let unregisterWebMcpTools: (() => void) | undefined
let layoutUnmounted = false

onMounted(async () => {
  const unregister = await registerWebMcpTools(articleUpdates)
  if (layoutUnmounted) unregister()
  else unregisterWebMcpTools = unregister
})

onBeforeUnmount(() => {
  layoutUnmounted = true
  unregisterWebMcpTools?.()
})

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
  <DefaultTheme.Layout>
    <template #nav-bar-content-after>
      <RecentUpdates />
    </template>
    <template #home-hero-before>
      <HomeLanding v-if="frontmatter.layout === 'home'" />
    </template>
    <template #page-top>
      <FavoritesCatalog v-if="frontmatter.archiveView === 'favorites'" />
      <AiOverview v-else-if="frontmatter.archiveView === 'ai'" />
      <ResourceCatalog
        v-else-if="frontmatter.resourceCatalog === 'all' || frontmatter.resourceCatalog === 'recommended'"
        :mode="frontmatter.resourceCatalog"
      />
    </template>
    <template #doc-footer-before>
      <RemoteAgents v-if="route.path === '/agents'" />
      <RemoteSkills v-else-if="route.path === '/skills'" />
    </template>
  </DefaultTheme.Layout>
</template>
