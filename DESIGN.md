---
version: "alpha"
name: Warm Bronze Library
description: 支持暖铜书卷与 Codex 工具两套风格的 VitePress 知识站点视觉系统，给编程 Agent 一份持久可读的设计源。
colors:
  primary: "#8a5a2b"
  bg: "#fbf7ef"
  bg-soft: "#f7efe2"
  text-1: "#24180f"
  text-2: "#5f4b3d"
  hero-name: "#7a4b20"
typography:
  h1:
    fontFamily: "LXGW WenKai Screen"
    fontSize: 2.5rem
    fontWeight: 600
    letterSpacing: "-0.03em"
  h2:
    fontFamily: "LXGW WenKai Screen"
    fontSize: 1.75rem
    fontWeight: 600
  body:
    fontFamily: "LXGW WenKai Screen"
    fontSize: 1rem
    lineHeight: 1.7
  caption:
    fontFamily: "LXGW WenKai Screen"
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
  hero-name:
    textColor: "{colors.hero-name}"
---

## Overview

Warm Bronze Library 是 Frank 知识库（VitePress 站点）的默认视觉系统。整体调性是"暖色木质 + 霞鹜文楷"：以深棕和奶白为主色，搭配可读性高的中文衬线字体，让长文阅读接近纸质书卷的体验。

站点还支持一套 `Codex Helper` 风格，来自 `E:\private-store\myproject\codex-switch-helper\AGENTS.md` 中描述的 Windows Tauri 桌面工具语境。它不改变内容结构，只把视觉材料切换成更接近桌面配置工具的冷静、清晰、低装饰界面：蓝色品牌强调、系统 sans 字体、更轻的卡片边界和更高的信息扫描效率。

站点主要面向"中文技术笔记、自动化实践、AI Agent 学习与个人知识沉淀"，所以视觉风格优先考虑：

- **可读性**：正文 1rem、行高 1.7、衬线字体，避免视觉疲劳。
- **层次感**：用淡边框和暖色背景区分卡片和章节分隔线，而不是用阴影。
- **可亲近**：颜色来自"书脊、铜扣、米纸"的意象，避免冷色调和过度鲜艳的强调色。

## Style Modes

站点通过 `html[data-site-style]` 支持多风格：

- **`warm-bronze`**：默认风格，保留暖铜书卷视觉语言，适合长文阅读和知识沉淀。
- **`codex-helper`**：新增风格，提炼 Codex Profile 管理工具的桌面应用感，适合偏工具化、配置化的阅读氛围。

切换控件位于 VitePress 顶部导航右侧。用户选择会缓存到 `localStorage` 的 `my-knowledge-site-style`，并由 `docs/.vitepress/config.ts` 中的 head 初始化脚本在页面渲染前恢复，避免刷新时样式闪烁。

## Colors

主品牌色为 `primary`（`#8a5a2b`，铜棕），对应 VitePress 的 `--vp-c-brand-1`，同时被 `<meta name="theme-color">` 使用。

- **`bg` (#fbf7ef)**：主背景，温暖的米白色，避免纯白刺眼。
- **`bg-soft` (#f7efe2)**：柔和背景，用于首页 feature 卡片、`VPFeature` 容器。
- **`text-1` (#24180f)**：主文本色，深棕，替代纯黑，对中文衬线字体更友好。
- **`text-2` (#5f4b3d)**：次文本色，灰棕，用于注释、metadata、次级标签。
- **`primary` (#8a5a2b)**：主品牌色（铜棕），用于链接、强调、按钮。
- **`hero-name` (#7a4b20)**：首页 hero `.name` / `.text` 专用的稍深一档品牌色，搭配 `letter-spacing: -0.03em` 收得紧一点。

首页 hero 的背景使用从 `#d6a661`（金黄）到 `#7c5a3c`（中棕）再到 `#2d2a24`（深炭）的 135° 渐变，叠加 56px 模糊形成氛围光；hover / active 态对应的次级品牌色（`#a46b32` / `#c78642`）由 VitePress 默认品牌色阶直接处理，不在 token 集合里展开。

### Dark 模式对应

Dark 模式自动通过 `.dark` class 切换，对应 token 关系不变：

- `bg` → `#17120d`
- `bg-soft` → `#251c14`
- `text-1` → `#f5eadb`
- `text-2` → `#d2bfa8`

Dark 模式使用现有暖铜亮色阶提高对比度：`primary` 与 `hero-name` 均切换为 `#c78642`，交互态可使用 `#d6a661`。

### Codex Helper 色彩

`codex-helper` 风格使用蓝色作为工具型主色：

- **品牌色**：`#2563eb`，对应 VitePress 的 `--vp-c-brand-1`，用于链接、按钮和切换后的 theme-color。
- **浅色背景**：`#f8fafc` / `#eef2f7` / `#ffffff`，模拟桌面工具的清洁工作区。
- **浅色文本**：`#111827` / `#526173`，保证文档扫描时有明确层级。
- **Dark 背景**：`#0b1220` / `#111827` / `#172033`，保留工具感但避免纯黑。
- **Dark 文本**：`#e5edf8` / `#a8b4c7`，比默认暖色 dark 更冷静。
- **Dark 品牌色**：`#60a5fa`，hover 使用 `#38bdf8`，确保深色背景上的链接和 hero 标题保持足够对比度。
- **Hero 图像背景**：保持透明，不使用蓝色渐变或大范围模糊光晕，让工具风格维持低装饰、易扫描的界面特征。

## Typography

字体栈有两套：

- **基础字体（serif）**：`"LXGW WenKai Screen"` → `"Noto Serif SC"` → `"Source Han Serif SC"` → `"Microsoft YaHei"` → `serif`。霞鹜文楷屏幕版通过 `lxgw-wenkai-screen-webfont` 随站点构建，确保访客无需预装字体；其余字体作为加载失败时的 fallback。
- **Codex Helper 基础字体（sans）**：`"Inter"` → `"Segoe UI"` → `"Microsoft YaHei"` → `sans-serif`。用于切换后的工具风格，优先保证界面控件和导航文本的清晰度。
- **等宽字体**：`"JetBrains Mono"` → `SFMono-Regular` → `Consolas` → `monospace`，用于代码块和行内 `code`。

字号体系：

- **`h1`**：2.5rem / 600 / `letter-spacing: -0.03em`，用于页面主标题、首页 hero 名字。
- **`h2`**：1.75rem / 600，文章内的二级标题；自带 1px / `rgba(138, 90, 43, 0.16)` 的上边框 + 24px 顶部留白作为章节分隔（描述式约定，详见 `Components` 之外的说明）。
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

本站不依赖阴影制造层次，优先用"边框 + 暖色背景差"来表达：

- **卡片（VPFeature）**：`bg-soft` 背景 + `rounded.md` 圆角；外加 `rgba(138, 90, 43, 0.2)` 的 1px 边框（描述式约定，组件 schema 不直接表达边框）。
- **章节分隔（h2）**：上方 1px 暖棕色分隔线 + 24px 顶部留白。
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

- 背景 `bg-soft`，圆角 `md`；外加 `rgba(138, 90, 43, 0.2)` 边框（按上面 `Elevation & Depth` 的描述式约定处理）。

`nav-link` / `nav-link-hover`：顶部导航项的默认与 hover 颜色。

- `nav-link`：`text-1` 色，无下划线。
- `nav-link-hover`：`primary` 色，强化交互反馈。

`link`：正文中的普通链接。

- 默认 `primary` 色，hover 显示下划线（`text-underline-offset: 3px`，按 `Elevation & Depth` 描述式约定处理）。

`caption`：副标题、metadata、注释。

- 文本色 `text-2`，排版用 `typography.caption`（0.875rem / 霞鹜文楷）。

`hero-name`：首页 hero 区域的 `.name` 与 `.text`。

- 文本色 `hero-name`，搭配 `letter-spacing: -0.03em`（按 typography.h1 约定）。

`style-switcher`：顶部导航中的风格切换按钮。

- 桌面端使用 32px 高度、8px 圆角和一个短 toggle 轨道；移动端触控区域扩大到 40 × 40px。
- 标签显示当前风格：`书卷` 或 `Codex`。移动端隐藏文字，只保留 toggle 形态。
- `aria-label` 描述即将切换到的风格，`aria-pressed` 表示当前是否处于 Codex Helper 模式。
- 点击后写入 `localStorage` 并更新 `html[data-site-style]`，不改变 VitePress 的 light / dark 机制。

## Do's and Don'ts

- ✅ **DO**：正文里使用 `text-1` 而不是纯黑；用 token 引用（`{colors.primary}`）而不是硬编码 hex。
- ✅ **DO**：新增的卡片复用 `card` 组件的 token，保持视觉一致。
- ✅ **DO**：新增风格只覆写 CSS 变量和少量组件状态，避免复制整套布局。
- ✅ **DO**：dark 模式保持 token 名一致，只在 `.dark` 作用域里覆盖颜色值。
- ❌ **DON'T**：不要在正文里硬编码品牌色 hex（`#8a5a2b` 等）；统一通过 `colors.primary` 引用。
- ❌ **DON'T**：不要为卡片加阴影（`box-shadow`）来制造层次；本站用边框 + 背景差。
- ❌ **DON'T**：不要使用 `border-radius` 大于 `lg` (12px) 的圆角；本站保持书卷/印刷调性。
- ❌ **DON'T**：不要把风格切换和 VitePress 内置 dark mode 混在同一个状态里；两者是正交设置。
