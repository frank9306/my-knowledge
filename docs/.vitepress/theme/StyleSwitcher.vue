<script setup lang="ts">
import { onMounted, ref } from 'vue'

const storageKey = 'my-knowledge-site-style'
const defaultStyle = 'warm-bronze'
const codexStyle = 'codex-helper'

const activeStyle = ref(defaultStyle)

function applyStyle(style: string) {
  const nextStyle = style === codexStyle ? codexStyle : defaultStyle
  activeStyle.value = nextStyle
  document.documentElement.dataset.siteStyle = nextStyle
  localStorage.setItem(storageKey, nextStyle)

  const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
  if (themeColor) {
    themeColor.content = nextStyle === codexStyle ? '#2563eb' : '#8a5a2b'
  }
}

function toggleStyle() {
  applyStyle(activeStyle.value === codexStyle ? defaultStyle : codexStyle)
}

onMounted(() => {
  applyStyle(localStorage.getItem(storageKey) ?? defaultStyle)
})
</script>

<template>
  <button
    class="site-style-switcher"
    type="button"
    :aria-pressed="activeStyle === codexStyle"
    :title="activeStyle === codexStyle ? '切换到暖铜书卷风格' : '切换到 Codex 工具风格'"
    @click="toggleStyle"
  >
    <span class="site-style-switcher__track">
      <span class="site-style-switcher__thumb" />
    </span>
    <span class="site-style-switcher__label">
      {{ activeStyle === codexStyle ? 'Codex' : '书卷' }}
    </span>
  </button>
</template>
