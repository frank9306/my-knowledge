<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData, useRoute } from 'vitepress'
import { watch } from 'vue'
import HomeLanding from './HomeLanding.vue'
import RecentUpdates from './RecentUpdates.vue'
import ResourceCatalog from './ResourceCatalog.vue'
import RemoteAgents from './RemoteAgents.vue'
import RemoteSkills from './RemoteSkills.vue'
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
  <DefaultTheme.Layout>
    <template #nav-bar-content-after>
      <RecentUpdates />
    </template>
    <template #home-hero-before>
      <HomeLanding v-if="frontmatter.layout === 'home'" />
    </template>
    <template #page-top>
      <ResourceCatalog
        v-if="frontmatter.resourceCatalog === 'all' || frontmatter.resourceCatalog === 'recommended'"
        :mode="frontmatter.resourceCatalog"
      />
    </template>
    <template #doc-footer-before>
      <RemoteAgents v-if="route.path === '/agents'" />
      <RemoteSkills v-else-if="route.path === '/skills'" />
    </template>
  </DefaultTheme.Layout>
</template>
