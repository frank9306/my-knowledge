---
version: "2.1.0"
name: Codex Editorial Archive
description: 以统一导航、内容型首页与 Codex 工具风文章页构成的 VitePress 知识站点视觉系统。
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

Codex Editorial Archive 是 Frank 知识库的统一视觉系统：首页与文章页共用 VitePress 顶部导航，首页主体呈现推荐阅读、最新文章和实战项目，透明背景的完整 3D CRT 档案管理员默认悬浮在视口右下角。文章页沿用 Codex Helper 的冷静工具界面语言。站点只保留 VitePress 原生 light/dark 切换，不再提供第二套风格选择。

站点主要面向"中文技术笔记、自动化实践、AI Agent 学习与个人知识沉淀"，所以视觉风格优先考虑：

- **可读性**：正文 1rem、行高 1.7、系统 sans 字体，保证技术内容易扫描。
- **层次感**：用冷灰背景和蓝色淡边框区分卡片与章节，不依赖重阴影。
- **一致性**：首页内容区与文章页共用背景、文字、边框和导航 token；3D 人物直接悬浮在页面上，不使用背景图或卡片容器。

## Style Modes

站点只有一套 Codex Editorial 风格，通过 VitePress 原生 `.dark` class 切换 light/dark。不要重新引入 `data-site-style`、额外 localStorage 状态或第二个风格切换控件。

## Colors

主品牌色为 `primary`（`#2563eb`），对应 VitePress 的 `--vp-c-brand-1`。

- **`bg` (#f8fafc)**：light 主背景。
- **`bg-soft` (#ffffff)**：卡片和柔和容器背景。
- **`text-1` (#111827)**：主文本。
- **`text-2` (#526173)**：metadata 与次级文本。
- **`primary` (#2563eb)**：链接、按钮和交互强调。

首页内容区使用文章页同一套 light/dark token。旧米色 CRT 人物使用透明 WebGL 画布，在 light/dark 模式中都直接叠加于页面背景之上。

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

`article-illustration`：文章默认配图，采用“蓝色工程主题的手绘知识卡式概念信息图”。

- **媒介质感**：暖米白纸张背景、细铅笔或彩铅轮廓、轻微自然抖动、低饱和水彩填色与细微纸纹；保持教育性和亲和力，不使用写实摄影、电影光效或高光 3D 渲染。
- **角色与隐喻**：需要行动主体时，默认使用造型一致的蓝白圆润机器人代表 Agent；用地图、仓库、工具台、书本、检查门、传送带、路标和回收箱等普通物件解释工程机制。角色和物件必须服务于论点，不添加无关装饰。
- **功能构图**：根据论点选择左右对比、3–5 步流程、中心辐射、机制剖面或单一隐喻总结。每张图只承担一个主要解释任务，保留清晰阅读路径与充足留白。
- **功能配色**：柔和蓝色表示规则、路径和主流程；绿色表示通过、修复和可靠反馈；橙黄表示待处理、Profile 差异或提醒；克制的红色只表示失败、风险和拦截。
- **文字生产**：生成底图时不得包含字母、数字、中文、伪文字、水印或最终标签边框。标题、标签、边框和说明必须在底图稳定后用确定性 SVG 排版叠加；中文标题使用粗圆体或手写感字体，标签使用清晰圆体，文字用深炭灰而不是纯黑。
- **交付格式**：优先交付自包含 SVG，在其中嵌入生成式底图并保留可验证的文字层；同时提供准确的 Markdown alt text 和“概念插画”图注。纯机制图确实更适合代码原生矢量时可以例外，但需保持同一配色和信息层级。
- **验证要求**：最终 SVG 必须以原始尺寸和文章实际显示宽度各渲染一次，逐项检查标题与标签的文案、居中、边距、边框包含、可读性和底图完整性；成功构建不能替代视觉检查。

`home-scene`：首页上可拖动的完整 3D CRT 档案管理员。

- 人物由头部、躯干、手臂和腿部的实时 3D 几何体组成，并带有轻微待机动画，不使用摄影身体或背景图。
- 默认固定在视口右下角；用户可用鼠标或触摸拖到任意位置，坐标必须限制在可视区域内并保存到 localStorage。
- WebGL 画布保持透明，不添加背景、边框、阴影或卡片容器。
- 水平跟随范围固定为左右各 65°，响应插值系数为 `0.024`。
- `pnpm home:scene-check` 是人物完整性、透明背景和默认定位的回归检查，并作为 `docs:build` 的前置步骤运行。

## Do's and Don'ts

- ✅ **DO**：正文里使用 `text-1` 而不是纯黑；用 token 引用（`{colors.primary}`）而不是硬编码 hex。
- ✅ **DO**：新增的卡片复用 `card` 组件的 token，保持视觉一致。
- ✅ **DO**：dark 模式保持 token 名一致，只在 `.dark` 作用域里覆盖颜色值。
- ✅ **DO**：文章概念配图默认复用 `article-illustration` 的机器人、纸张质感、功能配色和确定性文字层。
- ❌ **DON'T**：不要在正文里硬编码品牌色；统一通过 `colors.primary` 引用。
- ❌ **DON'T**：不要为卡片加阴影（`box-shadow`）来制造层次；本站用边框 + 背景差。
- ❌ **DON'T**：不要使用 `border-radius` 大于 `lg` (12px)，保持工具界面克制。
- ❌ **DON'T**：不要重新增加第二套风格切换；只使用 VitePress 原生 light/dark。
- ❌ **DON'T**：不要让图像模型直接生成最终中文标签、标签框、数据或伪文字。
