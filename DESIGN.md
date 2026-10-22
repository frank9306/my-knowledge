---
version: "4.0.0"
name: Frank Quiet Study
description: Frank 的书房，采用暖白纸面、宋体标题、鼠尾草绿链接和自然光书桌照片，呈现简洁的个人技术笔记。
colors:
  primary: "#445d46"
  bg: "#faf9f6"
  bg-soft: "#eeeee6"
  text-1: "#242923"
  text-2: "#6c7066"
typography:
  h1:
    fontFamily: "Noto Serif SC"
    fontSize: 4.5rem
    fontWeight: 400
    letterSpacing: "-0.04em"
  h2:
    fontFamily: "Noto Serif SC"
    fontSize: 2rem
    fontWeight: 400
  body:
    fontFamily: "Segoe UI"
    fontSize: 1rem
    lineHeight: 1.85
  caption:
    fontFamily: "Noto Serif SC"
    fontSize: 0.875rem
    color: "{colors.text-2}"
  code:
    fontFamily: "Cascadia Code"
    fontSize: 0.9em
rounded:
  sm: 2px
  md: 4px
  lg: 6px
spacing:
  xs: 8px
  sm: 16px
  md: 24px
  lg: 32px
  xl: 48px
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

已确认的 C 版“安静书房”取代原知识地图视觉。首页品牌为“Frank 的书房”，标题“边学，边记。”，说明“AI、代码与自动化笔记。”。照片、文字和留白构成首页，不添加口号、统计或功能卡片。来源：主人于 2026-10-22 选择 C 并确认精简设计图，随后授权实施和直接上线；参见 ISSUE-0035。

## Colors

默认 light：暖白 `#faf9f6`、深墨 `#242923`、鼠尾草绿 `#445d46`、日期 `#6c7066`、结构线 `#dcded5`。暗色选项使用深绿灰 `#20241f`、米白 `#eeeee5`、浅绿 `#bbcfad` 和次级文字 `#b4baad`。所有主题组件复用 custom.css 中既有 `--atlas-*` 语义接口，避免改动各组件的业务逻辑。新声明只引用语义颜色和字体变量。

主站为实色纸面；独立教材阅读器保持自身蓝色阅读主题和共享 site-canvas.css 契约，本次不重做教材。不要把旧主站的渐变断言用于新书房主题。

## Typography

标题与首页目录使用 `--font-display`：Georgia、Noto Serif SC、Source Han Serif SC、Songti SC、SimSun、serif。本地字体优先，不请求外部字体。正文使用系统 sans，代码使用 Cascadia Code / Consolas。宋体标题使用正常字形和 400 字重，首页标题 64–88px，移动端 50–70px；长文标题 32–48px，正文行高 1.85，阅读宽约 760px。签名使用本地手写字体，正文不使用手写体。

## Layout

首页采用非对称双栏：左侧短标题、说明与“开始阅读”，右侧自然光书桌。下方“案头新文”默认展示最新四篇真实文章：前两篇并列，其余为紧凑目录。首页短标题沿用已确认设计稿，完整文章名和日期来自 frontmatter，不改正文、路由或推荐名单。

“全部文章”展开可搜索列表，首次 12 篇，继续加载每次 12 篇。底部鼠尾草浅色带提供六个主题筛选。页脚提供更新、RSS、GitHub、AI 协作和 llms.txt。导航保留全站本地搜索和手动主题切换。

收藏、AI 和资源目录沿用各自组件与路由，用相同色彩、字体与结构线统一。文章页仅排版，不放首页装饰照片。

## Elevation & Depth

用留白、自然照片、纸面色差和细线组织层级；不使用玻璃、光晕、卡片阴影或装饰渐变。现有弹层保持实色与边框。

## Shapes

首页照片和文章目录保持直角。表单、菜单和代码块复用 2–6px 圆角。无无意义胶囊按钮。

## Components

- 首页主图为本地生成图片 `/images/quiet-study/desk.webp`，1840×855，提供尺寸与高加载优先级；装饰用途空 alt，不作为技术内容证据。第二条文章的缩略图是同一张编辑性装饰照片，不冒充文章插图。
- HomeLanding 负责首页壳与页脚，HomeTimeline 负责文章发现，ThemeLayout 保持全局 WebMCP/阅读状态生命周期。筛选与排序继续由 archive-state.mjs 提供，不新增后端。
- 收藏分类、已读状态、RSS 复制、远程 AGENTS/Skills 和已有加载/失败/重试行为保持原有所有权。
- 首页四篇使用主人选定的短标题，完整列表与可访问名称保留真实文章标题；不以模型生成摘要填补空间。

## Interaction

开始阅读跳到文章区；全部文章显示筛选；主题按钮筛选后滚到结果；清除筛选恢复全部文章；收起列表恢复四篇。`/` 在首页聚焦文章筛选，在输入中不触发；Ctrl/Cmd+K 仍打开全站搜索。避免一个按键同时打开两个搜索界面。

焦点使用 2px 绿色轮廓和 4px offset，触摸目标至少 42px。小按钮、导航和页脚短链接不换行；文章标题可以正常换行。

## Motion

仅颜色、边框和轻微交互反馈，无入场动画、滚动劫持或循环效果。reduced-motion 关闭平滑滚动与过渡。

## Responsive Behavior

767px 以下首页主图置于标题下方，文章和版头改为单列。主题和页脚按项目换行，短链接不拆行。320/375/414/768px 与 1440px 在真实浏览器检查；不能以裁切页面掩盖内容溢出。html/body 使用 overflow-x: clip，内容容器仍需通过实际布局检查。

## Content & Terminology

短句、少解释。站点名“Frank 的书房”，导航“阅读 / 专题 / 收藏 / AI 协作”，首页“边学，边记。”、“AI、代码与自动化笔记。”、“案头新文”、“按主题阅读”。保留真实文章、日期和接口名称。禁止虚构统计、评价和阅读时长。

## Accessibility

保留语义导航、唯一主标题、可见焦点、搜索标签和空结果恢复。筛选结果数量用 polite live region，当前主题按钮有 aria-pressed。装饰照片不进入辅助阅读顺序，正文插图保留原 alt。light/dark 正文与交互文字均须验证对比度。

## Product States

首页覆盖初始四篇、展开、筛选、空结果、清除及更多文章。RSS 复制与恢复、最近更新已读状态、远程内容加载和失败由原组件继续提供。主题切换复用 VitePress 持久化，无数据迁移。

## Do's and Don'ts

- 用短文案、宋体和宽松目录保持个人书房气质。
- 用实际数据和可操作入口；保留全部文章可访问性。
- 文章插图继续遵循蓝色工程手绘知识卡的内容规范；生成底图不含最终中文标签，确定后用 SVG 合成文字、边框和说明。
- 不恢复旧首页知识地图，不扩展 CRT 角色，不增加功能卡片墙或营销证明。
