---
title: "Textual:  Python 终端UI"
source: "old-blog/心情随笔/Textual  Python 终端UI.md"
---

# Textual:  Python 终端UI

最近在看 Rust 的终端 UI 框架 Ratatui，功能丰富、渲染高效、适合写复杂的 TUI 应用。顺手查了一下 Python 生态中有没有类似的替代品，找到了 [Textual](https://github.com/Textualize/textual)。

## 背景

在 Rust 中，Ratatui（原 tui-rs）提供了结构化布局、样式控制、图表渲染等能力，能用来做一些复杂的终端应用。Python 本身也有一些 TUI 框架，（如 `urwid`, `npyscreen`, `curses`）都偏底层或者不够现代。

## Textual 简介

Textual 是 Rich 作者推出的一个终端 UI 框架，特点：

*   基于 Rich，终端渲染效果好
*   支持响应式布局和样式控制
*   异步架构（基于 asyncio）
*   支持鼠标操作、窗口大小自适应
*   组件化开发，接近前端思维

整体上，Textual 更像是“为现代 Python 开发者准备的 TUI 框架”。

## 简单示例

```
#!/usr/bin/env -S uvx run --script
# /// script
# requires-python = ">=3.12"
# dependencies = ['textual']
# ///

"""
An App to show the current time.
"""

from datetime import datetime

from textual.app import App, ComposeResult
from textual.widgets import Digits

class ClockApp(App):
    CSS = """
    Screen { align: center middle; }
    Digits { width: auto; }
    """

    def compose(self) -> ComposeResult:
        yield Digits("")

    def on_ready(self) -> None:
        self.update_clock()
        self.set_interval(1, self.update_clock)

    def update_clock(self) -> None:
        clock = datetime.now().time()
        self.query_one(Digits).update(f"{clock:%T}")

if __name__ == "__main__":
    app = ClockApp()
    app.run()

```

官方给的示例还是挺有意思的，终端中直接运行脚本即可看到界面，和 Ratatui 类似，也采用了布局和组件组合的方式。

## 总结

我是在了解 Ratatui 的时候，顺便找到了 Textual，作为 Python 生态中少有的现代 TUI 框架，它值得后续深入研究。

适合场景包括：终端工具封装、系统监控面板、数据处理 UI 包装器、聊天机器人终端界面等。
