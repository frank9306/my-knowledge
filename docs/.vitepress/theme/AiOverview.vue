<script setup lang="ts">
const surfaces = [
  {
    label: '协作规则',
    title: 'AGENTS.md',
    href: '/agents',
    description: '让人与 AI 在同一套边界、术语和验证方式下工作。'
  },
  {
    label: '能力目录',
    title: 'Agent Skills',
    href: '/skills',
    description: '把可复用的工作方式封装成能力，按任务场景组合调用。'
  },
  {
    label: '机器可读入口',
    title: 'AI 访问接口',
    href: '/llms.txt',
    description: '通过 llms.txt 与 WebMCP 发现、搜索并打开本站公开知识。',
    id: 'ai-access'
  }
]
</script>

<template>
  <main class="ai-overview">
    <header class="ai-hero">
      <div>
        <p>PERSONAL AI SYSTEM</p>
        <h1>把协作规则、可复用能力与公开入口，放在同一张图里。</h1>
      </div>
      <p>这里公开的不是一份工具清单，而是墩儿如何理解任务、调用能力、验证结果并与主人协作的工作系统。</p>
    </header>

    <section class="ai-system-map" aria-label="个人 AI 协作系统入口">
      <div class="ai-system-map__core" aria-hidden="true">
        <span>FRANK</span>
        <strong>AI</strong>
        <span>SYSTEM</span>
      </div>
      <svg viewBox="0 0 180 620" aria-hidden="true">
        <path d="M20 310 H70 C95 310 95 105 124 105 H170" />
        <path d="M20 310 H170" />
        <path d="M20 310 H70 C95 310 95 515 124 515 H170" />
        <circle cx="70" cy="310" r="4" />
        <circle cx="124" cy="105" r="4" />
        <circle cx="124" cy="310" r="4" />
        <circle cx="124" cy="515" r="4" />
      </svg>
      <div class="ai-system-map__surfaces">
        <article v-for="surface in surfaces" :id="surface.id" :key="surface.title">
          <span>{{ surface.label }}</span>
          <h2><a :href="surface.href">{{ surface.title }} <span aria-hidden="true">→</span></a></h2>
          <p>{{ surface.description }}</p>
        </article>
      </div>
    </section>

    <footer class="ai-overview__note">
      <strong>公开边界</strong>
      <p>这里只展示可公开复用的规则与能力。凭据、私有数据和未确认的项目推断不会进入公开接口。</p>
    </footer>
  </main>
</template>

<style scoped>
.ai-overview { width: var(--atlas-shell); margin: 0 auto; padding: 80px 0 104px; color: var(--atlas-text); }
.ai-hero { display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(300px, .65fr); gap: clamp(48px, 7vw, 110px); align-items: end; padding-bottom: 52px; border-bottom: 1px solid var(--atlas-line); }
.ai-hero div > p { margin: 0 0 22px; color: var(--atlas-accent); font-family: var(--vp-font-family-mono); font-size: 11px; font-weight: 700; letter-spacing: .14em; }
.ai-hero h1 { max-width: 900px; margin: 0; border: 0; color: var(--atlas-text); font-size: clamp(44px, 5.6vw, 74px); font-weight: 760; letter-spacing: -.055em; line-height: 1.1; }
.ai-hero > p { margin: 0; color: var(--atlas-text-muted); font-size: 16px; line-height: 1.8; }
.ai-system-map { display: grid; grid-template-columns: 190px 180px minmax(0, 1fr); min-height: 620px; align-items: center; padding: 56px 0; }
.ai-system-map__core { display: grid; width: 156px; height: 156px; place-items: center; border: 1px solid var(--atlas-accent); border-radius: 50%; background: var(--atlas-surface); color: var(--atlas-accent); font-family: var(--vp-font-family-mono); font-size: 10px; letter-spacing: .14em; }
.ai-system-map__core strong { margin-block: -12px; color: var(--atlas-text); font-family: var(--vp-font-family-base); font-size: 46px; letter-spacing: -.05em; }
.ai-system-map > svg { width: 180px; height: 620px; fill: var(--atlas-accent); }
.ai-system-map > svg path { fill: none; stroke: var(--atlas-accent); stroke-width: 1.5; }
.ai-system-map__surfaces { display: grid; gap: 16px; }
.ai-system-map article { min-height: 176px; border: 1px solid var(--atlas-line); background: color-mix(in srgb, var(--atlas-surface) 62%, transparent); padding: 26px 30px; }
.ai-system-map article > span { color: var(--atlas-accent); font-family: var(--vp-font-family-mono); font-size: 10px; }
.ai-system-map h2 { margin: 14px 0 0; border: 0; font-size: clamp(26px, 3vw, 40px); letter-spacing: -.035em; }
.ai-system-map h2 a { display: flex; justify-content: space-between; gap: 24px; color: var(--atlas-text); text-decoration: none; }
.ai-system-map h2 a:hover { color: var(--atlas-accent-strong); }
.ai-system-map article p { max-width: 650px; margin: 14px 0 0; color: var(--atlas-text-muted); line-height: 1.7; }
.ai-overview__note { display: grid; grid-template-columns: 190px minmax(0, 700px); gap: 36px; border-top: 1px solid var(--atlas-line); padding-top: 26px; }
.ai-overview__note strong { color: var(--atlas-accent); font-family: var(--vp-font-family-mono); font-size: 11px; letter-spacing: .1em; }
.ai-overview__note p { margin: 0; color: var(--atlas-text-muted); line-height: 1.7; }
@media (max-width: 900px) {
  .ai-hero { grid-template-columns: 1fr; gap: 24px; }
  .ai-system-map { grid-template-columns: 132px 100px minmax(0, 1fr); }
  .ai-system-map__core { width: 116px; height: 116px; }
  .ai-system-map__core strong { font-size: 36px; }
  .ai-system-map > svg { width: 100px; }
}
@media (max-width: 767px) {
  .ai-overview { padding: 48px 0 72px; }
  .ai-hero h1 { font-size: clamp(40px, 11.5vw, 56px); }
  .ai-system-map { grid-template-columns: 1fr; gap: 28px; min-height: 0; padding: 42px 0; }
  .ai-system-map__core { width: 108px; height: 108px; }
  .ai-system-map > svg { display: none; }
  .ai-system-map__surfaces { gap: 12px; }
  .ai-system-map article { min-height: 0; padding: 22px; }
  .ai-overview__note { grid-template-columns: 1fr; gap: 10px; }
}
</style>
