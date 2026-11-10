<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData, useRoute, withBase } from 'vitepress'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import HomeLanding from './HomeLanding.vue'
import RecentUpdates from './RecentUpdates.vue'
import RssSubscribe from './RssSubscribe.vue'
import ResourceCatalog from './ResourceCatalog.vue'
import RemoteAgents from './RemoteAgents.vue'
import RemoteSkills from './RemoteSkills.vue'
import FavoritesCatalog from './FavoritesCatalog.vue'
import AiOverview from './AiOverview.vue'
import { data as articleUpdates } from './recent-updates.data'
import { markUpdateAsRead, normalizeUpdateUrl, syncArticleVersions } from './recent-updates'
import { registerWebMcpTools } from './webmcp.mjs'

const { frontmatter, isDark } = useData()
const route = useRoute()
const switchSource = withBase('/focus-switch.html?embed')
const desktopSwitch = ref<HTMLIFrameElement>()
const mobileSwitch = ref<HTMLIFrameElement>()
const switchNamespace = 'pixel-study-switch'

function syncSwitch(frame?: HTMLIFrameElement) {
  frame?.contentWindow?.postMessage({
    namespace: switchNamespace,
    type: 'state',
    checked: isDark.value
  }, location.origin)
}

function handleSwitchMessage(event: MessageEvent) {
  if (event.origin !== location.origin || event.data?.namespace !== switchNamespace) return
  const frame = [desktopSwitch.value, mobileSwitch.value].find(
    frame => frame?.contentWindow === event.source
  )
  if (!frame) return
  const { type, checked } = event.data
  if (type === 'request') syncSwitch(frame)
  if (type === 'ready') frame.dataset.ready = ''
  if (type === 'change' && 'ready' in frame.dataset && typeof checked === 'boolean') {
    isDark.value = checked
  }
  if ('ready' in frame.dataset && (type === 'search' || type === 'slash')) {
    document.dispatchEvent(new KeyboardEvent('keydown', {
      key: type === 'search' ? 'k' : '/',
      ctrlKey: type === 'search',
      bubbles: true,
      cancelable: true
    }))
  }
}

watch(isDark, () => {
  syncSwitch(desktopSwitch.value)
  syncSwitch(mobileSwitch.value)
})

let unregisterWebMcpTools: (() => void) | undefined
let layoutUnmounted = false

onMounted(async () => {
  window.addEventListener('message', handleSwitchMessage)
  syncSwitch(desktopSwitch.value)
  syncSwitch(mobileSwitch.value)
  const unregister = await registerWebMcpTools(articleUpdates)
  if (layoutUnmounted) unregister()
  else unregisterWebMcpTools = unregister
})

onBeforeUnmount(() => {
  layoutUnmounted = true
  window.removeEventListener('message', handleSwitchMessage)
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
      <iframe
        ref="desktopSwitch"
        class="focus-theme-switch focus-theme-switch--desktop"
        :src="switchSource"
        title="主题切换"
        @load="syncSwitch(desktopSwitch)"
      />
      <RecentUpdates v-if="frontmatter.layout !== 'home'" />
      <RssSubscribe v-if="frontmatter.layout !== 'home'" />
    </template>
    <template #nav-screen-content-after>
      <iframe
        ref="mobileSwitch"
        class="focus-theme-switch focus-theme-switch--mobile"
        :src="switchSource"
        title="主题切换"
        @load="syncSwitch(mobileSwitch)"
      />
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
