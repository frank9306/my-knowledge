---
title: "Playwright 中 expect_file_chooser() 不起作用？"
date: 2026-06-25
source: "old-blog/技术分享/Playwright 中 expect_file_choos.md"
---

# Playwright 中 expect_file_chooser() 不起作用？

## 起因：点击上传按钮却爆 Timeout

在使用 Playwright 编写自动化测试时，我遇到一个看似简单、实则恶心的“上传文件”问题。

```
with self.page.expect_file_chooser() as fc_info:
    _select_document_locator.first.click()


```

**结果等了 30 秒直接报错：**

```

Timeout 30000ms exceeded while waiting for event "filechooser"


```

而且是稳定复现，100% 超时，调试得我人都傻了。

* * *

## 表象：按钮能点，filechooser 却不弹

DOM 结构如下：

```

<button>上传</button>
<input name="file" type="file" accept=".docx,.pdf,.txt" style="display: none;">


```

肉眼可见的关键点：

*   `<input type="file">` 是隐藏的（`style="display: none"`）；
*   点击的是按钮，而不是 input；
*   input 和按钮不是一个标签，不存在 `<label for="input-id">` 的关系。

这就意味着：

> 上传按钮并不会“原生地”触发 filechooser，而是通过 JS 手动调用 input 的 .click() 方法。

比如前端代码很可能是这样写的：

```

document.querySelector("button").onclick = () => {
    document.querySelector("input[type='file']").click(); // 模拟点击 input
}


```

* * *

## 问题本质：Playwright 捕不到 JS 模拟 filechooser

Playwright 的 `expect_file_chooser()` 只能监听由浏览器原生触发的上传事件：

可以监听：

```

<input type="file" onchange="...">
<input type="file"> ← 直接点击 input 会触发 filechooser，Playwright 可以监听


```

无法监听：

```

<button onclick="document.querySelector('input').click()">上传</button>


```

这就解释了为什么我明明点了按钮，Playwright 却提示我“你根本没打开 filechooser”。

* * *

## 解决方案：使用 `set_input_files()`

这里不再等待 `filechooser` 事件，而是直接设置文件输入框：

```

file_input = self.page.locator('input[type="file"][name="file"]')
file_input.set_input_files("/path/to/your/file.pdf")


```

这种方式不需要触发 `filechooser`，只需定位 `input` 元素并设置文件。

即使 `input` 使用 `display: none` 隐藏，Playwright 仍可直接设置文件，从而绕过页面交互层。

* * *

## 方法对比

| 方法  | 原理  | 兼容性 | 建议  |
| --- | --- | --- | --- |
| `expect_file_chooser()` | 监听原生 filechooser 弹窗 | 仅限 `<input>` 被原生点击 | 只用于原生事件 |
| `set_input_files()` | 直接给 input 元素赋值文件 | 可定位到文件输入框 | 优先使用 |

* * *

## 最后吐槽一句

Playwright 的 filechooser 设计有点“太纯洁”了，它假设所有 file upload 都是原生触发的，但现实中的前端，早就用 JS 魔改了上传行为。

这也提醒我们：**不要迷信工具的糖衣 API，底层的** `**.set_input_files()**` **才是上传最稳的武器**。
