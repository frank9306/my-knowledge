<script setup lang="ts">
import { useData, useRoute } from 'vitepress'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { copyRssAddress } from './rss-subscription.mjs'

const { theme } = useData<{ rssUrl: string }>()
const route = useRoute()
const address = computed(() => theme.value.rssUrl)
const root = ref<HTMLElement | null>(null)
const trigger = ref<HTMLButtonElement | null>(null)
const addressInput = ref<HTMLInputElement | null>(null)
const open = ref(false)
const status = ref<'idle' | 'copying' | 'copied' | 'manual'>('idle')
const message = computed(() => ({
  idle: '复制地址，粘贴到 RSS 阅读器即可订阅。',
  copying: '正在复制…',
  copied: '地址已复制，粘贴到 RSS 阅读器即可订阅。',
  manual: '自动复制不可用，请选择下方地址并手动复制。'
})[status.value])

function toggle() {
  open.value = !open.value
  if (open.value && status.value !== 'copying') status.value = 'idle'
}

async function copy() {
  if (status.value === 'copying' || !address.value) return
  status.value = 'copying'
  const analytics = (window as Window & {
    umami?: { track: (name: string) => unknown }
  }).umami
  status.value = await copyRssAddress(address.value, navigator.clipboard, analytics)
  if (status.value === 'manual' && open.value) {
    await nextTick()
    addressInput.value?.focus()
    addressInput.value?.select()
  }
}

function closeOnOutsideClick(event: MouseEvent) {
  if (!root.value?.contains(event.target as Node)) open.value = false
}

function closeOnEscape(event: KeyboardEvent) {
  if (event.key === 'Escape' && open.value) {
    open.value = false
    trigger.value?.focus()
  }
}

function closeOnFocusOut(event: FocusEvent) {
  if (!root.value?.contains(event.relatedTarget as Node | null)) open.value = false
}

watch(() => route.path, () => { open.value = false })
onMounted(() => {
  document.addEventListener('click', closeOnOutsideClick)
  document.addEventListener('keydown', closeOnEscape)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', closeOnOutsideClick)
  document.removeEventListener('keydown', closeOnEscape)
})
</script>

<template>
  <div ref="root" class="rss-subscribe" @focusout="closeOnFocusOut">
    <button
      ref="trigger"
      type="button"
      class="rss-subscribe__trigger"
      aria-label="RSS 订阅"
      aria-controls="rss-subscribe-panel"
      :aria-expanded="open"
      @click="toggle"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8">
        <circle cx="5" cy="19" r="1.2" fill="currentColor" stroke="none" />
        <path d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16" />
      </svg>
      <span>RSS 订阅</span>
    </button>
    <section v-if="open" id="rss-subscribe-panel" class="rss-subscribe__panel" aria-label="订阅文章更新">
      <strong>订阅文章更新</strong>
      <p role="status" aria-live="polite">{{ message }}</p>
      <label class="sr-only" for="rss-subscribe-address">RSS 订阅地址</label>
      <input
        id="rss-subscribe-address"
        ref="addressInput"
        :value="address"
        readonly
        @focus="addressInput?.select()"
      />
      <div class="rss-subscribe__actions">
        <button type="button" :disabled="status === 'copying' || !address" @click="copy">
          {{ status === 'copying' ? '正在复制…' : status === 'copied' ? '再次复制' : '复制地址' }}
        </button>
        <a :href="address">查看订阅源</a>
      </div>
    </section>
  </div>
</template>

<style scoped>
.rss-subscribe { position: relative; margin-left: 8px; }
.rss-subscribe__trigger {
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 42px;
  border: 1px solid var(--atlas-line);
  border-radius: 4px;
  padding: 0 10px;
  color: var(--atlas-text-muted);
  font-size: 12px;
  cursor: pointer;
}
.rss-subscribe__trigger svg { width: 16px; height: 16px; }
.rss-subscribe__trigger:hover,
.rss-subscribe__trigger[aria-expanded="true"] { border-color: var(--atlas-accent); color: var(--atlas-text); }
.rss-subscribe__panel {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  z-index: 40;
  width: min(340px, calc(100vw - 24px));
  border: 1px solid var(--atlas-line-strong);
  border-radius: 6px;
  background: var(--atlas-surface);
  padding: 16px;
  color: var(--atlas-text);
  font-size: 13px;
  white-space: normal;
}
.rss-subscribe__panel strong { font-size: 14px; }
.rss-subscribe__panel p { margin: 8px 0 12px; color: var(--atlas-text-muted); line-height: 1.6; }
.rss-subscribe__panel input {
  width: 100%;
  min-height: 42px;
  border: 1px solid var(--atlas-line);
  border-radius: 4px;
  padding: 0 8px;
  background: var(--atlas-canvas);
  color: var(--atlas-text);
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
}
.rss-subscribe__actions { display: flex; align-items: center; gap: 16px; margin-top: 12px; }
.rss-subscribe__actions button {
  min-height: 42px;
  border: 1px solid var(--atlas-accent);
  border-radius: 4px;
  padding: 0 12px;
  color: var(--atlas-accent-strong);
  cursor: pointer;
}
.rss-subscribe__actions button:hover { background: var(--atlas-surface-soft); }
.rss-subscribe__actions button:disabled { opacity: .6; cursor: wait; }
.rss-subscribe__actions a { display: inline-flex; align-items: center; min-height: 42px; color: var(--atlas-text-muted); }
.rss-subscribe__actions a:hover { color: var(--atlas-accent-strong); }
@media (max-width: 767px) {
  .rss-subscribe { margin-left: 4px; }
  .rss-subscribe__trigger { justify-content: center; min-width: 42px; padding: 0 8px; }
  .rss-subscribe__trigger span { display: none; }
  .rss-subscribe__panel { position: fixed; top: calc(var(--vp-nav-height) - 1px); right: 12px; }
}
</style>
