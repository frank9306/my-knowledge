---
title: "【实战】Playwright 大文件上传突破 50MB 限制，CDP 助你一臂之力！"
date: 2026-06-25
source: "old-blog/技术分享/【实战】Playwright 大文件上传突破 50MB 限制.md"
---

# 【实战】Playwright 大文件上传突破 50MB 限制，CDP 助你一臂之力！

在日常自动化测试或脚本开发中，我们经常需要上传本地文件。而使用 [Playwright 的 FileChooser API](https://playwright.dev/python/docs/api/class-filechooser) 进行上传时，文件大小存在一个**致命限制**：**不能超过 50MB**。

这是什么原因？

## 为什么会限制 50MB？

因为 `set_files()` 本质上是通过 WebSocket 将文件 base64 编码后传输到浏览器端，这个过程中 Playwright 内部有一个 WebSocket payload size 的 hard limit，大文件直接就被拒掉。

* * *

## 最佳解决方案：使用 CDP 指令直通浏览器！

我们可以通过 Chrome DevTools Protocol（CDP）绕过 WebSocket 通道，**直接在浏览器上下文中设置文件选择器的文件内容**，从而实现大文件上传。下面是基于 Python 的完整实现：

```
def upload_file_by_cdp(self, selector, file_path):
    """
    通过 CDP 指令上传大文件，绕过 Playwright 的 50MB 限制
    :param selector: 文件输入框的 CSS 选择器
    :param file_path: 本地文件路径
    :return: True/False 是否上传成功
    """
    # 建立 CDP 会话
    cdp_session = self.page.context.new_cdp_session(self.page)

    # 定位文件输入元素
    file_input_handle = self.page.query_selector(selector)
    if not file_input_handle:
        print("❌ File input element not found!")
        return False

    # 获取 DOM 根节点
    dom_snapshot = cdp_session.send("DOM.getDocument")

    # 查询对应元素的 nodeId
    node_id_info = cdp_session.send("DOM.querySelector", {
        "nodeId": dom_snapshot["root"]["nodeId"],
        "selector": selector
    })

    # 设置文件
    cdp_session.send("DOM.setFileInputFiles", {
        "nodeId": node_id_info["nodeId"],
        "files": [file_path]
    })

    print("✅ 文件上传成功！")
    return True


```

* * *

## 使用示例

```

from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    page = browser.new_page()
    page.goto("<https://example.com/upload>")

    uploader = BaseObject(page)
    uploader.upload_file_by_cdp("input[type='file']", "C:/path/to/big_file.zip")


```

* * *

## 适用场景

| 场景  | 推荐方式 |
| --- | --- |
| 小文件上传（<50MB） | `file_chooser.set_files()` |
| 大文件上传（>50MB） | `upload_file_by_cdp()` |

* * *

## 补充说明

*   该方法要求文件输入元素是真实存在的 `<input type="file">`，不能是伪造上传按钮；
*   CDP 操作 Chrome 内核原始 DOM，比模拟操作更低层，**适用于所有 Chromium 内核浏览器**；
*   Firefox 不支持 CDP 指令，不适用于该方案。

* * *

## 延伸阅读

*   官方 Issue: [Playwright#34192](https://github.com/microsoft/playwright/issues/34192)
*   CDP API 文档: [https://chromedevtools.dev](https://chromedevtools.dev)
