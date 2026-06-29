---
title: "🧩为了解决「链接别人从哪看起」的问题，我写了个 Chrome 插件"
date: 2026-06-25
source: "old-blog/技术分享/🧩为了解决「链接别人从哪看起」的问题，我写了个 Chrom.md"
---

# 🧩为了解决「链接别人从哪看起」的问题，我写了个 Chrome 插件

### 👀 背景：你发的链接别人根本不知道你想让他看哪段

有时候我们会把一篇网页链接发给别人，比如：

```
<https://en.wikipedia.org/wiki/Nikola_Tesla>

```

但问题是，这页面可能有几万字，对方打开后一脸懵逼：

**“你到底是想让我看哪个段落？”**

我们总不能说“你往下滑第 17 段的第三行那个‘生于奥匈帝国’那句……”

这不仅效率低，还极度依赖于双方眼神同步 + 运气。

* * *

### 🔥 解决方案：用浏览器原生的 `#:~:text=` 高亮链接

其实 Chromium 浏览器（Chrome、Edge 等）内置了一个非常好用但被忽略的功能：**Text Fragments**。

它允许你在链接中加上一段 `#:~:text=` 参数，浏览器打开链接后会：

*   自动滚动到那段文字
*   高亮显示你指定的内容

比如：

```
<https://en.wikipedia.org/wiki/Nikola_Tesla#:~:text=Tesla%20was%20the%20fourth%20of%20five%20children>

```

点击这个链接，页面会直接滚动并高亮这段：“Tesla was the fourth of five children”

⚠️ 但要手动构造这种链接很麻烦，而且 URL 编码不直观、容易出错。

* * *

### 🛠️ 所以我干脆写了一个插件：**Text Fragment Copier**

GitHub 地址：

👉 [https://github.com/frank9306/text-fragment-copier](https://github.com/frank9306/text-fragment-copier)

它干的事情很简单：

> 🔹 你在网页中选中一段文字
> 
> 🔹 右键点击“复制带文本定位的链接”
> 
> 🔹 插件会自动复制一个带有 `#:~:text=` 的完整链接到剪贴板
> 
> 🔹 你可以直接粘贴发给别人，对方打开就能自动跳转 + 高亮你选的内容！

* * *

### 💡 使用方式（1分钟上手）

1.  克隆这个项目
    
    ```
    git clone <https://github.com/frank9306/text-fragment-copier.git>
    
    ```
2.  打开 Chrome → 输入 `chrome://extensions`
3.  开启右上角「开发者模式」→ 点击「加载已解压的扩展程序」→ 选择该目录
4.  安装完成！现在你在任意网页选中文字、右键即可复制带定位的链接 🎯

* * *

### 📸 实际演示

比如我选中了维基百科上的一段话：

> “After graduating Tesla returned to Smiljan but soon contracted [cholera](https://en.wikipedia.org/wiki/Cholera)”

右键 → 「复制带文本定位的链接」

> 图片待补：image.png

粘贴出来就是这样一段：

```
<https://en.wikipedia.org/wiki/Nikola_Tesla#:~:text=After%20graduating%20Tesla%20returned%20to%20Smiljan%20but%20soon%20contracted%20cholera>

```

别人点击后直接高亮，非常丝滑！

* * *

### ⚙️ 技术实现简述

*   使用了 Chrome 插件的 Context Menu API（右键菜单）
*   用 `window.getSelection()` 拿到你选中的文本
*   拼接当前页面 URL + `#:~:text=你的内容`
*   使用 `navigator.clipboard.writeText` 自动复制到剪贴板

简洁、无 UI、无依赖，极简主义直男式开发风格 ✅

* * *

### ⚠️ 注意事项

*   仅支持 Chromium 内核的浏览器（Chrome、Edge）
*   Firefox 和 Safari 暂不支持 `#:~:text=` 标准
*   对于某些复杂 DOM 或懒加载页面可能偶尔不生效（浏览器行为）

* * *

### 📦 项目结构 & 开源地址

```
bash
复制编辑
text-fragment-copier/
├── manifest.json    # 插件清单（MV3）
└── background.js    # 插件逻辑脚本（右键+剪贴板）


```

📎 GitHub 仓库：

[https://github.com/frank9306/text-fragment-copier](https://github.com/frank9306/text-fragment-copier)

欢迎 Star 🌟、Fork、魔改、或提交 PR！
