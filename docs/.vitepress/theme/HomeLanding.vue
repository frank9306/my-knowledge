<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import CrtHead from './CrtHead.vue'

const menuOpen = ref(false)
const typedText = ref('')
const actionsVisible = ref(false)
const message = '欢迎停留。好奇心总会把对的人带到这里。今天想探索什么？'

let typeTimer: ReturnType<typeof setInterval> | undefined
let actionTimer: ReturnType<typeof setTimeout> | undefined
let startTimer: ReturnType<typeof setTimeout> | undefined

const navigation = [
  { label: '专题', href: '/topics/' },
  { label: '文章', href: '/blog/' },
  { label: '资源', href: '/resources/' },
  { label: '关于', href: '/about' }
]

const topics = [
  { label: 'AI Agent', href: '/ai-agent/' },
  { label: 'Python 自动化', href: '/python-automation/' },
  { label: 'RPA / Playwright', href: '/rpa-playwright/' },
  { label: 'Web / React', href: '/web-react/' }
]

onMounted(() => {
  actionTimer = setTimeout(() => (actionsVisible.value = true), 400)
  startTimer = setTimeout(() => {
    let index = 0
    typeTimer = setInterval(() => {
      index += 1
      typedText.value = message.slice(0, index)
      if (index >= message.length) clearInterval(typeTimer)
    }, 55)
  }, 600)
})

onBeforeUnmount(() => {
  clearInterval(typeTimer)
  clearTimeout(actionTimer)
  clearTimeout(startTimer)
})
</script>

<template>
  <div class="knowledge-landing">
    <div class="knowledge-landing__scene">
      <div class="knowledge-landing__backdrop" />
      <CrtHead />
    </div>
    <div class="knowledge-landing__veil" />

    <header class="knowledge-landing__nav">
      <a class="knowledge-landing__brand" href="/">FRANK'S ARCHIVE<sup>®</sup><span>✳︎</span></a>
      <nav class="knowledge-landing__links" aria-label="主导航">
        <template v-for="(item, index) in navigation" :key="item.href">
          <a :href="item.href">{{ item.label }}</a><span v-if="index < navigation.length - 1">, </span>
        </template>
      </nav>
      <a class="knowledge-landing__contact" href="/friends">友情链接</a>
      <button
        class="knowledge-landing__menu"
        type="button"
        :aria-expanded="menuOpen"
        aria-label="切换导航"
        @click="menuOpen = !menuOpen"
      ><span /><span /><span /></button>
    </header>

    <div class="knowledge-landing__mobile" :class="{ 'is-open': menuOpen }">
      <a v-for="item in navigation" :key="item.href" :href="item.href">{{ item.label }}</a>
      <a href="/friends">友情链接</a>
    </div>

    <main class="knowledge-landing__hero">
      <div class="knowledge-landing__intro">嘿，欢迎来到 Frank 的知识库，<br>一座持续生长的技术实践档案。</div>
      <p class="knowledge-landing__typed">{{ typedText }}<span v-if="typedText.length < message.length" class="knowledge-landing__cursor" /></p>
      <div class="knowledge-landing__actions" :class="{ 'is-visible': actionsVisible }">
        <a v-for="topic in topics" :key="topic.href" :href="topic.href">{{ topic.label }}</a>
        <a class="knowledge-landing__outline" href="/blog/">浏览全部文章 <span aria-hidden="true">↗</span></a>
      </div>
    </main>

  </div>
</template>
