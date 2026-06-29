---
version: "alpha"
name: Warm Bronze Library
description: 暖色木质 + 霞鹜文楷的 VitePress 知识站点视觉系统，给编程 Agent 一份持久可读的设计源。
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

Warm Bronze Library 是 Frank 知识库（VitePress 站点）的视觉系统。整体调性是"暖色木质 + 霞鹜文楷"：以深棕和奶白为主色，搭配可读性高的中文衬线字体，让长文阅读接近纸质书卷的体验。

站点主要面向"中文技术笔记、自动化实践、AI Agent 学习与个人知识沉淀"，所以视觉风格优先考虑：

- **可读性**：正文 1rem、行高 1.7、衬线字体，避免视觉疲劳。
- **层次感**：用淡边框和暖色背景区分卡片和章节分隔线，而不是用阴影。
- **可亲近**：颜色来自"书脊、铜扣、米纸"的意象，避免冷色调和过度鲜艳的强调色。

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

`primary` 与 `hero-name` 在 dark 模式下保持不变。

## Typography

字体栈有两套：

- **基础字体（serif）**：`"LXGW WenKai Screen"` → `"Noto Serif SC"` → `"Source Han Serif SC"` → `"Microsoft YaHei"` → `serif`。在常见系统上以霞鹜文楷或思源宋体优先，提供接近"印刷书"的阅读质感。
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

## Do's and Don'ts

- ✅ **DO**：正文里使用 `text-1` 而不是纯黑；用 token 引用（`{colors.primary}`）而不是硬编码 hex。
- ✅ **DO**：新增的卡片复用 `card` 组件的 token，保持视觉一致。
- ✅ **DO**：dark 模式保持 token 名一致，只在 `.dark` 作用域里覆盖颜色值。
- ❌ **DON'T**：不要在正文里硬编码品牌色 hex（`#8a5a2b` 等）；统一通过 `colors.primary` 引用。
- ❌ **DON'T**：不要为卡片加阴影（`box-shadow`）来制造层次；本站用边框 + 背景差。
- ❌ **DON'T**：不要使用 `border-radius` 大于 `lg` (12px) 的圆角；本站保持书卷/印刷调性。
