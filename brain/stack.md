---
slug: stack
title: Tech stack
role: tech-stack choices
updated: "2026-08-17T09:54:04"
---

# Tech stack

| 领域 | 选择 | 用途与依据 |
|---|---|---|
| 站点生成 | VitePress `^1.6.4` | Markdown 驱动的静态知识站，提供导航、侧边栏、主题扩展和本地搜索 |
| UI 层 | Vue（由 VitePress 提供）+ TypeScript | `docs/.vitepress/theme/` 内实现首页与主题扩展 |
| 3D 交互 | Three.js `^0.185.1` | 首页实时 3D CRT 档案管理员与交互场景 |
| 包管理 | pnpm `10.14.0` | 本地与 CI 使用一致的锁文件安装 |
| 运行时 | Node.js 20（CI） | 执行 VitePress、同步脚本、设计 lint、场景检查与基准脚本 |
| 设计规范 | `@google/design.md` `^0.3.0` | 校验根目录 `DESIGN.md`；详见 [[design-system-build-gate]] |
| 内容格式 | Markdown + YAML frontmatter | 文章正文、标题、日期与导航元数据 |
| 样式 | VitePress CSS tokens + `custom.css` | 统一 Codex Editorial light/dark 视觉；详见 [[single-editorial-site-experience]] |
| 搜索 | VitePress 本地搜索 | 中文内容切词与站内检索由站点配置承担 |
| 分析 | Google Analytics（配置注入） | 站点访问分析，配置位于 VitePress head |
| CI/CD | GitHub Actions + GitHub Pages | `main` 分支构建并发布；详见 [[github-pages-custom-domain]] |
| 实验工具 | Node ESM 脚本 + JSON/JSONL | 运行和保存 Vibe Coding 基准证据；详见 [[repository-owned-agent-benchmark]] |

## 依赖原则

项目依赖面较小，站点能力优先使用 VitePress 原生机制和仓库内脚本。新增依赖必须服务明确需求，并与现有 Node / pnpm 工具链兼容。
