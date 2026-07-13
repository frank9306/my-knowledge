---
title: "在 Playwright 页面中实现持久化、可折叠的日志输出面板"
date: 2026-06-25
source: "old-blog/技术分享/在 Playwright 页面中实现持久化、可折叠的日志输出.md"
---

# 在 Playwright 页面中实现持久化、可折叠的日志输出面板

在使用 Playwright 进行浏览器自动化时，为了便于调试和直观观察执行过程，我萌生了一个小想法：**在页面中直接输出日志信息，作为 UI 反馈**。本以为只是一个 `evaluate` 的小操作，没想到这个“小功能”却在实际使用中踩了不少坑。

## 最初的想法

日志通常输出在终端，但如果能在页面内直接显示日志，就能：

*   在看视频、图文等自动操作时**观察当前进度**
*   在开发时**不依赖终端输出，查看更直观**
*   甚至能让非技术人员**可视化地了解每一步在干啥（这是很关键的）**

于是，我用 `page.evaluate` 动态往页面中插入一个 `div` 元素，并将日志内容写入其中。代码大概是这样的：

```
self.page.evaluate("""
    if (!window.__logBox) {
        const logBox = document.createElement("div");
        logBox.id = "__logBox";
        logBox.innerText = "开始执行";
        document.body.appendChild(logBox);
        window.__logBox = logBox;
    }
    window.__logBox.innerText += "\\\\n下一步...";
""")


```

一切运行良好，直到 —— **页面刷新了。**

## 页面刷新之后，日志消失

因为 Playwright 操作的是真实浏览器，所以一旦 `self.page.goto()` 导航或用户操作触发刷新，之前通过 `evaluate` 注入的 DOM 元素就会被清空。这也包括我们注入的 `__logBox` 元素。

最初的解决方法是——**每次日志执行前都判断一下 DOM 是否存在，不存在就重新创建**。虽然解决了“丢失”问题，但又引出了下一个更尴尬的 bug。

## 日志面板遮挡了点击目标元素

因为日志面板固定在屏幕上，而且是 `position: fixed` + 高亮文字，一旦你正好要点击页面的下方按钮（比如小红书的“下一步”或“发布”按钮），点击事件就会被拦截，Playwright 就会报 `Element is not visible` 错。

这个问题很蛋疼，因为日志框很容易遮挡其他元素。于是我需要一个新设计：

*   日志面板应该是**可折叠的**
*   默认只显示一个按钮，这个按钮的占用空间就可以忽略不计
*   位置还要支持自定义（比如放到右下角）

## 最终版本：可折叠 + 可配置位置的日志面板

以下是最终实现：

```

class SyncUIConsoleLogger:
    COLOR_MAP = {
        "info": "#0f0",
        "error": "red",
        "warning": "yellow",
        "success": "#00ffff",
    }

    def __init__(self, logger, page, max_lines=100):
        self.logger = logger
        self.page = page
        self.max_lines = max_lines
        self.cache = deque(maxlen=max_lines)
        self._enabled = True
        self.position = "left-bottom"  # 默认位置

    def set_display(self, display: bool):
        self._enabled = display

    def set_position(self, position: str):
        """
        设置日志面板位置: 'left-top', 'left-bottom', 'right-top', 'right-bottom'
        """
        if position not in ['left-top', 'left-bottom', 'right-top', 'right-bottom']:
            self.logger.warning(f"Invalid position '{position}', using default left-bottom")
            position = "left-bottom"
        self.position = position

        # 若已注入，则立即更新位置
        self.page.evaluate(f"""
        () => {{
            const panel = document.getElementById("ui-log-panel");
            if (!panel) return;
            panel.style.top = '';
            panel.style.bottom = '';
            panel.style.left = '';
            panel.style.right = '';
            {"panel.style.top = '10px';" if 'top' in position else "panel.style.bottom = '10px';"}
            {"panel.style.left = '10px';" if 'left' in position else "panel.style.right = '10px';"}
        }}
        """)

    def _inject_console_html(self):
        is_exist = self.page.evaluate("() => !!document.getElementById('ui-log-toggle')")
        if is_exist:
            return

        # 注入样式和 DOM
        position_styles = {
            "top": "panel.style.top = '10px';",
            "bottom": "panel.style.bottom = '10px';",
            "left": "panel.style.left = '10px';",
            "right": "panel.style.right = '10px';",
        }
        vert = 'top' if 'top' in self.position else 'bottom'
        hori = 'left' if 'left' in self.position else 'right'

        self.page.evaluate(f"""
        () => {{
            if (document.getElementById("ui-log-toggle")) return;

            const style = document.createElement("style");
            style.id = "ui-log-style";
            style.innerHTML = `
            #ui-log-toggle {{
                position: fixed;
                {vert}: 10px;
                {hori}: 10px;
                z-index: 999999;
                background: #333;
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                font-family: monospace;
                cursor: pointer;
            }}
            #ui-log-panel {{
                display: none;
                position: fixed;
                width: 500px;
                height: 220px;
                background: rgba(0, 0, 0, 0.85);
                font-size: 12px;
                font-family: monospace;
                padding: 10px;
                border-radius: 6px;
                overflow-y: auto;
                z-index: 999998;
                box-shadow: 0 0 8px #000;
                resize: both;
                line-height: 1.4;
            }}
            `;

            if (!document.getElementById("ui-log-style")) {{
                document.head.appendChild(style);
            }}

            const toggle = document.createElement("div");
            toggle.id = "ui-log-toggle";
            toggle.textContent = "📋 日志";
            document.body.appendChild(toggle);

            const panel = document.createElement("div");
            panel.id = "ui-log-panel";
            document.body.appendChild(panel);

            // 设置位置
            {position_styles[vert]}
            {position_styles[hori]}

            toggle.addEventListener("click", () => {{
                panel.style.display = panel.style.display === "none" ? "block" : "none";
            }});
        }}
        """)

        # 恢复缓存日志
        logs_html = "<br>".join(self.cache).replace("`", "\\\\`")
        self.page.evaluate(f"""
        () => {{
            const el = document.getElementById("ui-log-panel");
            if (el) {{
                el.innerHTML = `{logs_html}`;
                el.scrollTop = el.scrollHeight;
            }}
        }}
        """)

    def _ui_log(self, msg: str, tag: str):
        timestamp = datetime.now().strftime("%H:%M:%S")
        color = self.COLOR_MAP.get(tag.lower(), "#fff")
        formatted = f'<span style="color:{color}">[{timestamp}] {msg}</span>'
        self.cache.append(formatted)

        # 注入并更新日志内容
        self._inject_console_html()
        logs_html = "<br>".join(self.cache).replace("`", "\\\\`")
        self.page.evaluate(f"""
        () => {{
            const el = document.getElementById("ui-log-panel");
            if (el) {{
                el.innerHTML = `{logs_html}`;
                el.scrollTop = el.scrollHeight;
            }}
        }}
        """)

    def log(self, msg: str, tag: str = "info"):
        if tag == "error":
            self.logger.error(msg)
        elif tag == "warning":
            self.logger.warning(msg)
        else:
            self.logger.info(msg)

        if not self._enabled:
            return

        try:
            self._ui_log(msg, tag)
        except Exception as e:
            self.logger.error(f"output ui log error: {e}")

```

使用示例：

![在 Playwright 页面中实现持久化、可折叠的日志输出面板 image 1](/images/imported/playwright-page-log-panel/image-01.gif)

## 小结

这一小段日志面板功能，虽然看似“可有可无”，却让用户在调试体验提升了不少。
