<script setup lang="ts">
import HomeTimeline from './HomeTimeline.vue'
import RecentUpdates from './RecentUpdates.vue'
import RssSubscribe from './RssSubscribe.vue'
</script>

<template>
  <main class="knowledge-study" data-fidelity="canvas">
    <HomeTimeline />
    <footer class="study-footer">
      <a class="study-signature" href="/" aria-label="Frank 的书房首页">Frank</a>
      <div class="study-footer__links">
        <RecentUpdates />
        <RssSubscribe />
        <a href="https://github.com/frank9306">GitHub ↗</a>
        <a href="/ai">AI 协作 ↗</a>
        <a href="/llms.txt">llms.txt ↗</a>
      </div>
    </footer>
  </main>
</template>
