<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const sourceUrl = 'https://github.com/frank9306/ai-environment/blob/main/instructions/core.md'
const contentsUrl = 'https://api.github.com/repos/frank9306/ai-environment/contents/instructions/core.md?ref=main'
const content = ref('')
const error = ref('')
const loading = ref(true)
let controller: AbortController | undefined

async function load() {
  controller?.abort()
  controller = new AbortController()
  loading.value = true
  error.value = ''
  try {
    const response = await fetch(contentsUrl, { cache: 'no-store', signal: controller.signal })
    if (!response.ok) throw new Error(`GitHub returned ${response.status}`)
    const data = (await response.json()) as { content?: string; encoding?: string }
    if (data.encoding !== 'base64' || !data.content) throw new Error('GitHub returned an unsupported file format')
    const bytes = Uint8Array.from(atob(data.content.replace(/\s/g, '')), (character) => character.charCodeAt(0))
    content.value = new TextDecoder().decode(bytes)
  } catch (reason) {
    if (reason instanceof DOMException && reason.name === 'AbortError') return
    error.value = reason instanceof Error ? reason.message : 'Unknown error'
  } finally {
    loading.value = false
  }
}

onMounted(load)
onBeforeUnmount(() => controller?.abort())
</script>

<template>
  <section class="remote-source" aria-labelledby="agents-source-title">
    <header class="remote-source__header">
      <div>
        <p class="remote-source__eyebrow">LIVE FROM GITHUB</p>
        <h2 id="agents-source-title">全局协作规则</h2>
        <p>每次打开页面时读取 <code>main/instructions/core.md</code>，无需手动同步本站。</p>
      </div>
      <a :href="sourceUrl" target="_blank" rel="noopener noreferrer">查看源文件</a>
    </header>
    <p v-if="loading" class="remote-source__status" role="status">正在读取 GitHub 最新内容…</p>
    <div v-else-if="error" class="remote-source__error" role="alert">
      <p>暂时无法读取 GitHub：{{ error }}</p>
      <button type="button" @click="load">重试</button>
    </div>
    <pre v-else class="remote-source__document" tabindex="0"><code>{{ content }}</code></pre>
  </section>
</template>
