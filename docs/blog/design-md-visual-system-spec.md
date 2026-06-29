---
title: "给 VitePress 站点加一份 DESIGN.md：把视觉系统交给 AI 编程 Agent"
date: 2026-06-29
---

# 给 VitePress 站点加一份 DESIGN.md：把视觉系统交给 AI 编程 Agent

最近给我的 VitePress 知识站点加了一份 `DESIGN.md`，把原本散落在 `config.ts` 和 `custom.css` 里的视觉规则整理成一份"Agent 也能读的设计源"。整个过程踩了不少坑，写下来给同样想这么做的人一个参考。

## 为什么需要 DESIGN.md

VitePress 站点的视觉系统一般由两块组成：主题色、字体栈、`<meta name="theme-color">` 在 `docs/.vitepress/config.ts` 里，剩下的颜色变量、字体、章节分隔线、卡片样式都堆在 `docs/.vitepress/theme/custom.css` 里。本项目之前的状态：

- `config.ts:95` 写了 `--theme-color: #8a5a2b`。
- `custom.css` 里 15 个 `--vp-c-*` 变量定义颜色，5 行规则定义组件。
- dark 模式在 `.dark` 作用域里手动覆盖 5 个变量。

这套结构对人类够用，但有两个问题：

1. **AI 编程 Agent 看不见**。Claude Code / Cursor / Gemini CLI 在生成新页面或组件时只能扫到 CSS 变量名，没法理解"什么是品牌色、什么是文本色、为什么 hero name 要深一档"。结果就是 Agent 给你硬编码 `#8a5a2b`，而不是引用 `var(--vp-c-brand-1)`。
2. **改一次容易漏**。如果想把品牌色从铜棕换成其他颜色，得在 `config.ts`、`custom.css`、可能还有几处页面内联样式里同步改，缺一处就视觉不一致。

`DESIGN.md` 想解决的就是这两个问题：把视觉系统的"事实之源"用机器可读 + 人类可读的方式集中到一份文件里，Agent 拿到后就有"持久结构化的设计上下文"。

## DESIGN.md 是什么

`google-labs-code/design.md` 是 Google Labs 推出的一个**格式规范**（不是框架，不是库）。一份 `DESIGN.md` 文件长这样：

- **YAML front matter**：机器可读的设计 token（颜色、字体、圆角、间距、组件）。
- **Markdown body**：人类可读的设计理念、使用说明、Do's and Don'ts。

顶层 key 有 8 个：`version` / `name` / `description` / `colors` / `typography` / `rounded` / `spacing` / `components`。token 之间可以引用，语法是 `{colors.primary}`，lint 会校验引用是否解析得到。组件子 token 限制在 8 个里：`backgroundColor` / `textColor` / `typography` / `rounded` / `padding` / `size` / `height` / `width`。

配套的 `@google/design.md` CLI 提供三类能力：

- `designmd lint DESIGN.md`：结构 + 引用 + WCAG 对比度 + 章节顺序检查，输出 JSON 报告。
- `designmd diff a.md b.md`：对比两个版本，定位 token 回归。
- `designmd export --format css-tailwind DESIGN.md`：导出为 Tailwind v4 `@theme {}` 或 W3C DTCG `tokens.json`。

## 从 CSS 反推 token

最自然的做法不是从零设计，而是把现有 CSS 变量映射成 token。本项目 `custom.css` 的关键变量和 `DESIGN.md` 的对应关系：

| `custom.css` 变量 | 值 | `DESIGN.md` token |
| --- | --- | --- |
| `--vp-c-brand-1` | `#8a5a2b` | `colors.primary` |
| `--vp-c-bg` | `#fbf7ef` | `colors.bg` |
| `--vp-c-bg-soft` | `#f7efe2` | `colors.bg-soft` |
| `--vp-c-text-1` | `#24180f` | `colors.text-1` |
| `--vp-c-text-2` | `#5f4b3d` | `colors.text-2` |
| `--vp-home-hero-name-color` | `#7a4b20` | `colors.hero-name` |

字体也是同样的逻辑。`--vp-font-family-base` 是 `"LXGW WenKai Screen", "Noto Serif SC", ...`，在 `typography.body.fontFamily` 里保留完整 fallback 链；`--vp-font-family-mono` 进 `typography.code.fontFamily`。

写出来的 front matter 节选：

```yaml
colors:
  primary: "#8a5a2b"
  bg: "#fbf7ef"
  bg-soft: "#f7efe2"
  text-1: "#24180f"
  text-2: "#5f4b3d"
  hero-name: "#7a4b20"
typography:
  body:
    fontFamily: "LXGW WenKai Screen"
    fontSize: 1rem
    lineHeight: 1.7
  caption:
    fontFamily: "LXGW WenKai Screen"
    fontSize: 0.875rem
    color: "{colors.text-2}"
```

每个 token 在 Markdown body 里都有"为什么"和"怎么用"两段说明。`bg-soft` 那一节会写"用于首页 feature 卡片、`VPFeature` 容器"；`primary` 那一节会写"用于链接、强调、按钮，对应 VitePress 的 `--vp-c-brand-1`，同时被 `<meta name="theme-color">` 使用"。

## 第一次 lint：14 个 warning

写完第一版跑 `designmd lint DESIGN.md`，0 errors 但 14 个 warnings。问题集中在三处：

- **组件子 token 写错**。我用了 `color` / `borderColor` / `borderTop` / `paddingTop`，但 spec 规定的合法子 token 只有 8 个（`backgroundColor` / `textColor` / `typography` / `rounded` / `padding` / `size` / `height` / `width`）。解决办法是 `color` 改 `textColor`，`borderColor` / `borderTop` / `paddingTop` 这些"装饰属性"移出 `components` 块，在 Markdown body 的 `Components` 章节用文字说明"按上面 `Elevation & Depth` 描述式约定处理"。

- **缺 `primary` color**。`missing-primary` 规则要求 colors 里有名为 `primary` 的 token，agent 否则会"自动生成"一个主色。最简洁的解法是直接用 `primary` 命名主色。

- **未引用的 color**。`orphaned-tokens` 规则会警告"这个 token 定义了但没有任何 component 引用"。我第一版留了 `brand-2` / `brand-3` / `bg-alt` 等几个"语义上有但实际不引用"的 token，全被报 orphan。处理方式有两个：删掉（最干净），或加个 component 引用。最简方案是删。

修完后再跑 `pnpm design:lint`：

```json
{
  "summary": { "errors": 0, "warnings": 0, "infos": 1 }
}
```

干净通过。

## 固化到 CI

`DESIGN.md` 写出来只完成一半，**关键是让 `docs:build` 失败时整条流水线都挂**。不然哪天有人改坏 design spec，CI 不会拦。本项目 `package.json`：

```json
"scripts": {
  "readme:sync": "node scripts/sync-readme.mjs",
  "design:lint": "designmd lint DESIGN.md",
  "docs:dev": "vitepress dev docs",
  "docs:build": "pnpm run readme:sync && pnpm run design:lint && vitepress build docs",
  "docs:preview": "vitepress preview docs"
}
```

`docs:build` 现在三步走：`readme:sync` → `design:lint` → `vitepress build`。任何一步失败都阻塞发布。

安装时用 `pnpm add -D @google/design.md`，版本锁到 `^0.3.0`，`pnpm-lock.yaml` 自动同步。GitHub Actions 跑 `pnpm install --frozen-lockfile` 拿到的版本和本地一致。

Windows 上有个坑：CLI 的 bin 名是 `design.md`，会和 Markdown 文件关联撞上。README 明确提示要 `npx -p @google/design.md designmd lint DESIGN.md`，用 `designmd` 别名。`package.json` 里直接写 `designmd` 即可，CI 在 Linux 上跑不受影响。

## 几个值得注意的取舍

**DESIGN.md 和 `custom.css` 是双轨维护。** 这是一开始就要接受的代价：token 改了，得同时改 `DESIGN.md` 和 `custom.css`（除非你写一个构建脚本从 `DESIGN.md` 派生 CSS，本项目目前没做）。好处是"事实之源"只有一份 —— 在 VitePress 这种"主题用 CSS 变量定义"的体系下，CSS 文件本身可读性已经不错，DESIGN.md 主要价值是给 Agent 看的"语义层"，不是替 CSS。

**组件子 token 不能表达装饰属性。** 想表达"hero name 用 `letter-spacing: -0.03em`"或"h2 顶部有 1px 分隔线 + 24px 留白"，都得在 Markdown body 里写"按 `typography.h1` 约定"或"按 `Elevation & Depth` 描述式约定处理"，spec 的 schema 不直接收这些键。这不是 bug，是 spec 故意收紧"机器可解析的部分"。Markdown 章节就是给"机器难表达但人类/Agent 需要知道"的内容留的出口。

**dark 模式不进 token。** 站点有 dark 模式，但我没在 `DESIGN.md` 里展开 dark 对应值（`bg` 在 dark 下变 `#17120d` 等），只在 Markdown body 的 `Colors` 章节末尾用一段列表说明。理由是：dark 值是"实现细节"，token 集合只表达"语义"。如果未来 Agent 要生成 dark 模式 CSS，看 body 说明就好。

## 小结

`DESIGN.md` 解决的是"AI 编程 Agent 看不见设计系统"和"改一次容易漏"两个老问题。它不是一个库或框架，而是一个**格式规范**，由 `google-labs-code/design.md` 定义，配套 `@google/design.md` CLI 提供 lint / diff / export。

接入流程：

1. 把现有 CSS 变量映射到 `colors` / `typography` 等 token。
2. 第一次跑 `designmd lint`，按 warning 调整（最常见是子 token 错和 orphan）。
3. `pnpm add -D @google/design.md`，加 `design:lint` 脚本。
4. 把 `pnpm design:lint` 串到 `docs:build` 之前，让 CI 拦截回归。

本项目最终 `DESIGN.md`：6 colors / 5 typography scales / 3 rounded levels / 5 spacing tokens / 7 components，lint 0 errors / 0 warnings。

参考：

- [google-labs-code/design.md](https://github.com/google-labs-code/design.md) — 格式规范本身
- [@google/design.md on npm](https://www.npmjs.com/package/@google/design.md) — CLI 包
- [DESIGN.md spec on stitch.withgoogle.com](https://stitch.withgoogle.com/docs/design-md/specification) — Google 配套文档
