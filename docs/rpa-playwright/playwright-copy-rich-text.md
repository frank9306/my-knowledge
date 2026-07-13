---
title: "使用 Playwright 复制网页富文本内容"
date: 2026-06-25
source: "old-blog/技术分享/使用 Playwright 复制网页富文本内容.md"
---

# 使用 Playwright 复制网页富文本内容

## **1\. 引言**

在网页抓取或自动化测试中，有时需要复制网页中的富文本内容（包括格式、样式、链接等）。手动复制可能效率低下，而使用 Python 的 Playwright 库可以自动化这一过程。

本文将介绍如何：

1.  **使用 Playwright 选中网页内容**
2.  **执行复制操作**
3.  **从剪贴板获取富文本内容**
4.  **处理可能的异常情况**

适用于爬虫、数据采集、自动化测试等场景。

## **2\. 环境准备**

### **安装依赖**

```
pip install playwright pyperclip
playwright install  # 安装浏览器驱动（Chromium/Firefox/WebKit）

```

*   `**playwright**`：自动化浏览器操作
*   `**pyperclip**`：访问系统剪贴板

## **3\. 实现代码**

### **3.1 复制网页富文本内容**

```
from playwright.sync_api import sync_playwright
import pyperclip

def copy_rich_html(url_or_html_content):
    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context()
        page = context.new_page()

        # 判断输入是 URL 还是 HTML 内容
        if url_or_html_content.startswith('http'):
            page.goto(url_or_html_content)
        else:
            page.set_content(url_or_html_content)

        # 执行复制操作
        page.evaluate("""
            const range = document.createRange();
            range.selectNode(document.body);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
            document.execCommand('copy');
            window.getSelection().removeAllRanges();
            true;
        """)

        # 从剪贴板获取内容
        copied_content = pyperclip.paste()
        browser.close()
        return copied_content

# 示例：复制 HTML 内容
html_content = """
<html>
<body>
<h2>数据分析：持续优化的基石</h2>
<p>数据分析是持续优化选品策略的基础...</p>
</body>
</html>
"""
copied_text = copy_rich_html(html_content)
print(copied_text)

```

### **3.2 仅获取纯文本（无格式）**

```
text_content = page.evaluate("document.body.textContent")
print(text_content)

```

### **3.3 获取完整 HTML（保留结构）**

```
html_structure = page.evaluate("document.body.innerHTML")
print(html_structure)

```

* * *

## **4\. 关键点解析**

### **4.1 document.execCommand('copy')**

*   这是浏览器原生的复制命令，可以复制当前选中的内容（包括富文本格式）。
*   需要先使用 `**Range**` 和 `**Selection**` API 选中目标内容。

### **4.2** `**pyperclip**` **的作用**

*   由于 Playwright 无法直接读取剪贴板内容，`**pyperclip**` 用于获取系统剪贴板数据。

### **4.3 适用场景**

| **方法** | **适用场景** | **是否保留格式** |
| --- | --- | --- |
| `**execCommand('copy')**` | 复制富文本（如带格式的网页内容） | 保留 |
| `**textContent**` | 仅需纯文本 | 不保留 |
| `**innerHTML**` | 获取完整 HTML 结构 | 保留 |

* * *

## **5\. 常见问题**

### **Q1: 为什么** `**execCommand('copy')**` **不起作用？**

*   某些网站可能禁用剪贴板访问（如金融类网站）。
*   解决方案：改用 `**innerHTML**` 或 `**textContent**` 直接提取内容。

### **Q2:** `**pyperclip**` **无法读取剪贴板？**

*   确保系统剪贴板权限已开启（特别是 macOS/Linux）。
*   替代方案：使用 Playwright 的 `**page.evaluate()**` 返回内容，而非依赖剪贴板。

### **Q3: 如何复制特定元素（而非整个** `**body**`**）？**

```
// 修改此行，选择特定元素
range.selectNode(document.querySelector("#contentToCopy"));

```

* * *

## **6\. 总结**

本文介绍了如何使用 **Playwright + Python** 复制网页富文本内容，包括：

1.  **使用** `**execCommand('copy')**` **复制格式文本**
2.  **通过** `**pyperclip**` **获取剪贴板数据**
3.  **替代方案：**`**textContent**`**（纯文本）和** `**innerHTML**`**（完整结构）**

适用于爬虫、自动化测试、数据采集等场景，提高效率并减少手动操作。

使用 `execCommand('copy')` 可以保留网页富文本格式；只需要纯文本时，使用 Clipboard API 更合适。
