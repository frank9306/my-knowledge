---
version: "2.0.0"
name: Codex Editorial Archive
description: 以暗黑编辑影像首页与 Codex 工具风文章页构成的 VitePress 知识站点视觉系统。
colors:
  primary: "#2563eb"
  bg: "#f8fafc"
  bg-soft: "#ffffff"
  text-1: "#111827"
  text-2: "#526173"
typography:
  h1:
    fontFamily: "Inter"
    fontSize: 2.5rem
    fontWeight: 600
    letterSpacing: "-0.03em"
  h2:
    fontFamily: "Inter"
    fontSize: 1.75rem
    fontWeight: 600
  body:
    fontFamily: "Inter"
    fontSize: 1rem
    lineHeight: 1.7
  caption:
    fontFamily: "Inter"
    fontSize: 0.875rem
    color: "{colors.text-2}"
  code:
    fontFamily: "JetBrains Mono"
    fontSize: 0.9em
rounded:
  sm: 4px
  md: 8px
  lg: 12px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
components:
  page:
    backgroundColor: "{colors.bg}"
  card:
    backgroundColor: "{colors.bg-soft}"
    rounded: "{rounded.md}"
  nav-link:
    textColor: "{colors.text-1}"
  nav-link-hover:
    textColor: "{colors.primary}"
  link:
    textColor: "{colors.primary}"
  caption:
    textColor: "{colors.text-2}"
    typography: "{typography.caption}"
---

## Overview

Codex Editorial Archive 是 Frank 知识库的统一视觉系统：首页使用暗黑编辑影像与实时 3D 角色，文章页沿用 Codex Helper 的冷静工具界面语言。站点只保留 VitePress 原生 light/dark 切换，不再提供第二套风格选择。

站点主要面向"中文技术笔记、自动化实践、AI Agent 学习与个人知识沉淀"，所以视觉风格优先考虑：

- **可读性**：正文 1rem、行高 1.7、系统 sans 字体，保证技术内容易扫描。
- **层次感**：用冷灰背景和蓝色淡边框区分卡片与章节，不依赖重阴影。
- **一致性**：首页的暗黑材质与文章页的 Codex 深色模式共享石墨背景、冷白文字和克制强调色。

## Style Modes

站点只有一套 Codex Editorial 风格，通过 VitePress 原生 `.dark` class 切换 light/dark。不要重新引入 `data-site-style`、额外 localStorage 状态或第二个风格切换控件。

## Colors

主品牌色为 `primary`（`#2563eb`），对应 VitePress 的 `--vp-c-brand-1`。

- **`bg` (#f8fafc)**：light 主背景。
- **`bg-soft` (#ffffff)**：卡片和柔和容器背景。
- **`text-1` (#111827)**：主文本。
- **`text-2` (#526173)**：metadata 与次级文本。
- **`primary` (#2563eb)**：链接、按钮和交互强调。

首页不使用文章页背景 token：它固定采用黑色摄影棚背景、旧米色 CRT、冷白文字和少量半透明遮罩。

### Dark 模式对应

Dark 模式自动通过 `.dark` class 切换，对应 token 关系不变：

- `bg` → `#0b1220`
- `bg-soft` → `#172033`
- `text-1` → `#e5edf8`
- `text-2` → `#a8b4c7`

- **Dark 背景**：`#0b1220` / `#111827` / `#172033`，保留工具感但避免纯黑。
- **Dark 文本**：`#e5edf8` / `#a8b4c7`，比默认暖色 dark 更冷静。
- **Dark 品牌色**：`#60a5fa`，hover 使用 `#38bdf8`，确保深色背景上的链接和 hero 标题保持足够对比度。

## Typography

字体栈统一为一套：

- **基础字体（sans）**：`"Inter"` → `"Segoe UI"` → `"Microsoft YaHei"` → `sans-serif`。
- **等宽字体**：`"JetBrains Mono"` → `SFMono-Regular` → `Consolas` → `monospace`，用于代码块和行内 `code`。

字号体系：

- **`h1`**：2.5rem / 600 / `letter-spacing: -0.03em`，用于页面主标题、首页 hero 名字。
- **`h2`**：1.75rem / 600，文章内的二级标题；自带蓝色低透明度上边框和 24px 顶部留白。
- **`body`**：1rem / `line-height: 1.7`，正文与列表。
- **`caption`**：0.875rem / `text-2` 色，副标题、metadata、注释。
- **`code`**：0.9em（继承父元素大小），等宽字体，行内与代码块统一。

## Layout & Spacing

站点使用 VitePress 默认布局（顶部 nav + 左侧 sidebar + 正文），不引入网格框架。

间距阶梯（来自 VitePress 8px 基线 + 自定义 24px 章节分隔）：

- `xs` (4px)：icon 与文字之间的最小间距。
- `sm` (8px)：行内元素、tag、badge 之间的间距。
- `md` (16px)：卡片内边距、组件之间的间距。
- `lg` (24px)：段落间距、章节分隔顶部留白。
- `xl` (32px)：区块级大间距。

## Elevation & Depth

本站不依赖阴影制造层次，优先用"淡蓝边框 + 冷灰背景差"来表达：

- **卡片（VPFeature）**：`bg-soft` 背景 + `rounded.md` 圆角；外加品牌蓝低透明度的 1px 边框。
- **章节分隔（h2）**：上方 1px 蓝灰分隔线 + 24px 顶部留白。
- **链接**：默认无下划线，hover 显示下划线，`text-underline-offset: 3px`，避免与文字粘连。

## Shapes

圆角阶梯：

- `sm` (4px)：按钮、tag、输入框。
- `md` (8px)：卡片、对话框。
- `lg` (12px)：首页 hero image 容器、特殊强调卡片。

## Components

`page`：站点主背景。

- 背景 `bg`，与 light / dark 模式对应。

`card`：首页 feature 卡片、相关推荐卡片、引用块容器。

- 背景 `bg-soft`，圆角 `md`；外加品牌蓝低透明度边框。

`nav-link` / `nav-link-hover`：顶部导航项的默认与 hover 颜色。

- `nav-link`：`text-1` 色，无下划线。
- `nav-link-hover`：`primary` 色，强化交互反馈。

`link`：正文中的普通链接。

- 默认 `primary` 色，hover 显示下划线（`text-underline-offset: 3px`，按 `Elevation & Depth` 描述式约定处理）。

`caption`：副标题、metadata、注释。

- 文本色 `text-2`，排版用 `typography.caption`（0.875rem / Inter）。

`home-scene`：首页摄影身体与 3D CRT 头部共享的 16:9 场景。

- 桌面端按 `cover` 等比缩放；移动端使用上方 `60vh` 构图。
- 3D 头部必须使用场景内部百分比锚点，不得重新使用独立 `vw` / `vh` 定位。
- `pnpm home:scene-check` 是坐标系回归检查，并作为 `docs:build` 的前置步骤运行。

## Do's and Don'ts

- ✅ **DO**：正文里使用 `text-1` 而不是纯黑；用 token 引用（`{colors.primary}`）而不是硬编码 hex。
- ✅ **DO**：新增的卡片复用 `card` 组件的 token，保持视觉一致。
- ✅ **DO**：dark 模式保持 token 名一致，只在 `.dark` 作用域里覆盖颜色值。
- ❌ **DON'T**：不要在正文里硬编码品牌色；统一通过 `colors.primary` 引用。
- ❌ **DON'T**：不要为卡片加阴影（`box-shadow`）来制造层次；本站用边框 + 背景差。
- ❌ **DON'T**：不要使用 `border-radius` 大于 `lg` (12px)，保持工具界面克制。
- ❌ **DON'T**：不要重新增加第二套风格切换；只使用 VitePress 原生 light/dark。
