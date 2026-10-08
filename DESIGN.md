---
version: "3.0.0"
name: Frank Knowledge Atlas
description: 面向中文技术创作者与 AI 工程实践者的交互式知识地图，以深墨蓝画布、冰白文字、单一钴蓝信号和可检索主题关系建立个人知识品牌。
colors:
  primary: "#5d7cff"
  bg: "#0b1020"
  bg-soft: "#10182a"
  text-1: "#edf2ff"
  text-2: "#9ca8c2"
typography:
  h1:
    fontFamily: "Noto Sans SC"
    fontSize: 4.5rem
    fontWeight: 760
    letterSpacing: "-0.055em"
  h2:
    fontFamily: "Noto Sans SC"
    fontSize: 2.5rem
    fontWeight: 740
  body:
    fontFamily: "Noto Sans SC"
    fontSize: 1rem
    lineHeight: 1.75
  caption:
    fontFamily: "IBM Plex Mono"
    fontSize: 0.75rem
    color: "{colors.text-2}"
  code:
    fontFamily: "IBM Plex Mono"
    fontSize: 0.9em
rounded:
  sm: 2px
  md: 4px
  lg: 6px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
components:
  page:
    backgroundColor: "{colors.bg}"
  card:
    backgroundColor: "{colors.bg-soft}"
    rounded: "{rounded.md}"
  nav-link:
    textColor: "{colors.text-2}"
  nav-link-hover:
    textColor: "{colors.text-1}"
  link:
    textColor: "{colors.primary}"
  caption:
    textColor: "{colors.text-2}"
    typography: "{typography.caption}"
---

## Overview

Frank Knowledge Atlas 将个人技术站点理解为一张持续生长、可检索、可复用的知识地图。主要用户是阅读中文技术长文、研究 AI Agent、自动化、RPA 和前端工程的开发者。站点的首要任务是帮助访问者快速找到一条可信的探索路径，而不是展示文章数量或制造营销氛围。

视觉论点是“深色工程图纸上的知识关系”。深墨蓝画布负责沉浸和专注，冰白文字建立阅读层级，钴蓝只表示交互、路径和当前选择。知识地图是唯一标志性元素。页面不使用漂浮角色、玻璃拟态、发光渐变、装饰性数据或同尺寸卡片墙。

## Colors

Dark 是默认品牌呈现，light 使用相同语义关系而不是反相复制。

- `bg` `#0b1020`：dark 主画布。
- `bg-soft` `#10182a`：内容表面、代码块和浮层。
- `text-1` `#edf2ff`：标题与主要内容。
- `text-2` `#9ca8c2`：摘要、日期、帮助文字与次级关系。
- `primary` `#5d7cff`：链接、焦点、知识路径和当前选择。一个页面不再引入第二个高饱和强调色。
- `line` `#24304a`：结构边界。边线只表达真实分组或关系。

Light 模式使用 `#f4f7ff` 画布、`#ffffff` 表面、`#10182a` 主文字和 `#4e6ee8` 强调色。两种模式均满足 WCAG AA 正文对比要求。

## Typography

- 中文界面与正文使用 `Noto Sans SC`、`Segoe UI`、`Microsoft YaHei`、`sans-serif` 回退链。
- 代码、日期、类别和机器接口使用 `IBM Plex Mono`、`JetBrains Mono`、`Consolas` 回退链。
- 首页主标题为 48-72px，最多两行，字重 760，紧字距，行高 1.14。
- 文章标题为 42-68px，正文保持 1rem 和 1.85 行高，阅读宽度约 760px。
- 小号等宽文字只用于真实元数据，不用于装饰性眉题或编号。

## Layout

- 站点桌面容器为 `min(1450px, 100vw - 96px)`，1100px 以下缩减为视口减 64px，767px 以下为视口减 36px。
- 首页首屏采用非对称两栏，左侧完成定位与文章搜索，右侧用真实主题和筛选行为构成知识地图。
- 首页第二屏使用一个重点文章和三个紧凑入口，再逐步披露更多记录。
- 收藏页以两列目录呈现筛选结果，不使用无限卡片嵌套。
- AI 页面用一个核心节点和三条可访问路径表达协作规则、Skills 与机器可读入口。
- 文章页不显示主题侧边栏，正文保持稳定阅读宽度。

## Elevation & Depth

页面不依赖阴影。层次来自画布色阶、1px 结构线、排版尺度和间距。浮层允许使用实色表面与清晰边框，不使用玻璃模糊作为主要材质。

## Shapes

- `sm` 2px：机械边线和小型状态元素。
- `md` 4px：按钮、筛选器、代码块和目录表面。
- `lg` 6px：搜索框和少量主交互。
- 圆形只用于知识节点，不能扩散到普通按钮或内容容器。

## Components

### Knowledge map

- 六个固定主题为 AI Agent、AI 编程工程、Python 自动化、RPA / Playwright、Web / React、技术随笔。
- 节点必须是键盘可操作的真实筛选按钮，连接线用于解释主题关系。
- 移动端保留全部主题和筛选能力，缩短辅助文字，不把桌面图简单缩小。

### Search

- 首页搜索作用于文章标题、摘要和分类，标签必须明确为“搜索技术文章”。
- 全站搜索继续由 VitePress 本地搜索提供。
- 空结果说明下一步，不使用只有“无数据”的死端文案。

### Article discovery

- 重点文章优先使用文章自身的第一张本地图片。没有图片时使用纯排版回退，不伪造产品截图。
- 日期和分类来自真实 frontmatter，不生成阅读时长或虚构统计。
- 长列表使用渐进加载，结构线只位于条目之间。

### Collection filters

- 搜索、内容类型和使用场景是三个独立概念。
- 当前选择通过文字、边框和背景共同表达，不只依赖颜色。

### Remote sources

- AGENTS.md 与 Skills 保留加载、空、错误和重试状态。
- 错误文案说明失败原因和最小恢复动作。

## Interaction

- 高频交互保持即时，hover 与 pressed 反馈控制在颜色、边框和 1px 位移以内。
- 键盘焦点使用 2px 钴蓝轮廓和 4px offset。
- 知识节点点击后更新文章结果并把结果区带入视口。
- 最近更新弹层支持 Escape 和点击外部关闭，原有未读状态保持不变。

## Motion

- 默认动效强度为 4/10，只用于地图路径响应、图片轻微缩放和状态切换。
- 不使用滚动劫持、循环跑马灯、磁吸按钮或装饰性视差。
- `prefers-reduced-motion: reduce` 下关闭平滑滚动、变换和过渡，内容与反馈仍完整。

## Responsive Behavior

- 900px 以下首页首屏改为单列，地图位于定位文案之后。
- 767px 以下知识地图隐藏解释性子项但保留主题标签、关系线和点击目标。
- 多列文章、收藏和 AI 路径在移动端改为单列，主要动作与上下文不得消失。
- 最低验证宽度为 375px。所有触摸目标至少 42px，关键文字不能依赖截断才能成立。

## Content & Terminology

站点语气直接、具体、可信。描述解决过的问题、可复用的方法和明确边界，不使用“赋能”“无缝”“颠覆”等空泛营销词。

- 站点：`FRANK / KNOWLEDGE`
- 首页：`知识地图`
- 收藏：`工具收藏`
- AI 总览：`AI 协作系统`
- 首页定位：`把零散经验，组织成可复用的系统。`
- 首页说明：`这里记录 AI Agent、自动化与前端工程中，真正解决过问题的方法。`

## Accessibility

- 默认目标为 WCAG AA，正文和交互文字同时在 light 与 dark 模式验证。
- 主题地图使用可访问按钮和明确区域名称，视觉连接线不进入辅助技术阅读顺序。
- 搜索输入、筛选按钮、外链和错误恢复均可通过键盘操作。
- 动态结果数量使用 polite live region，加载错误使用 alert。
- 图像必须使用真实 alt；纯装饰图像使用空 alt。

## Product States

- 搜索无结果：说明更换关键词或选择主题。
- 远程内容加载：保持内容骨架位置，使用状态文字，不显示空结果。
- 远程内容失败：显示具体错误与“重试”。
- 收藏无结果：说明清空关键词或切换使用场景。
- 动态更新：最近更新面板继续区分已读与未读。

## Do's and Don'ts

- DO 使用一个钴蓝强调色表达交互和路径。
- DO 优先通过文字层级、间距和结构线组织内容。
- DO 使用真实文章、日期、分类、图片和公开接口名称。
- DO 在 375px、键盘模式和 reduced motion 下验证关键路径。
- DON'T 使用 CRT-404、漂浮吉祥物或与内容无关的 3D 场景。
- DON'T 使用紫蓝发光、玻璃卡片、装饰性状态点或三张同款功能卡。
- DON'T 伪造阅读时长、访问量、运行状态或工程统计。
- DON'T 把知识地图做成不可操作的背景装饰。
