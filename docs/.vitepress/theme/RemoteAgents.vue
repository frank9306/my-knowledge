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
    <h2 id="agents-source-title" class="sr-only">AGENTS.md 内容</h2>
    <p v-if="loading" class="remote-source__status" role="status">加载中…</p>
    <div v-else-if="error" class="remote-source__error" role="alert">
      <p>加载失败：{{ error }}</p>
      <button type="button" @click="load">重试</button>
    </div>
    <pre v-else class="remote-source__document" tabindex="0"><code>{{ content }}</code></pre>
    <a class="remote-source__link" :href="sourceUrl" target="_blank" rel="noopener noreferrer">源文件</a>
  </section>
</template>
