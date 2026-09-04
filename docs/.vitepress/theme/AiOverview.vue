<template>
  <main class="ai-overview">
    <header>
      <p>PERSONAL AI SYSTEM</p>
      <h1>我的 AI</h1>
      <span>查看墩儿工作的协作规则，以及可复用的 Agent Skills。</span>
    </header>
    <ol>
      <li>
        <span>01</span>
        <div><p>协作规则</p><h2><a href="/agents">AGENTS.md <span aria-hidden="true">→</span></a></h2><small>从公开源实时加载当前 AI 编程协作规则，保留加载失败与重试状态。</small></div>
      </li>
      <li>
        <span>02</span>
        <div><p>能力目录</p><h2><a href="/skills">Agent Skills <span aria-hidden="true">→</span></a></h2><small>浏览公开 Skills 的名称、说明、类别和上游来源。</small></div>
      </li>
      <li id="ai-access">
        <span>03</span>
        <div><p>AI DISCOVERY</p><h2><a href="/llms.txt">AI 访问接口 <span aria-hidden="true">→</span></a></h2><small><code>llms.txt</code> 提供站点入口与索引；支持 WebMCP 的浏览器 Agent 还能通过只读工具搜索、读取和打开公开文章。</small></div>
      </li>
    </ol>
  </main>
</template>

<style scoped>
.ai-overview { width: min(1120px, calc(100vw - 64px)); margin: 0 auto; padding: 64px 0 104px; }
.ai-overview header { max-width: 760px; margin-bottom: 56px; }
.ai-overview header > p { margin: 0 0 14px; color: var(--vp-c-brand-1); font-size: 11px; font-weight: 700; letter-spacing: .14em; }
.ai-overview h1 { margin: 0 0 16px; border: 0; font-size: clamp(42px, 6vw, 70px); line-height: 1; letter-spacing: -.05em; }
.ai-overview header > span { color: var(--vp-c-text-2); line-height: 1.7; }
.ai-overview ol { margin: 0; padding: 0; border-top: 1px solid var(--vp-c-divider); list-style: none; }
.ai-overview li { display: grid; grid-template-columns: 150px minmax(0, 1fr); gap: 48px; padding: 48px 12px; border-bottom: 1px solid var(--vp-c-divider); }
.ai-overview li > span { color: var(--vp-c-brand-1); font-size: clamp(48px, 7vw, 88px); font-weight: 500; line-height: 1; letter-spacing: -.06em; }
.ai-overview li p { margin: 0 0 10px; color: var(--vp-c-text-2); font-size: 12px; letter-spacing: .08em; }
.ai-overview h2 { margin: 0; border: 0; font-size: clamp(30px, 4vw, 52px); line-height: 1.1; }
.ai-overview h2 a { display: flex; justify-content: space-between; gap: 20px; color: var(--vp-c-text-1); text-decoration: none; }
.ai-overview h2 a:hover { color: var(--vp-c-brand-1); }
.ai-overview small { display: block; max-width: 660px; margin-top: 18px; color: var(--vp-c-text-2); font-size: 14px; line-height: 1.7; }
.ai-overview a:focus-visible { outline: 3px solid color-mix(in srgb, var(--vp-c-brand-1) 32%, transparent); outline-offset: 5px; }
@media (max-width: 767px) { .ai-overview { width: auto; padding: 44px 20px 72px; } .ai-overview li { grid-template-columns: 64px minmax(0, 1fr); gap: 18px; padding: 32px 0; } .ai-overview li > span { font-size: 42px; } }
</style>
