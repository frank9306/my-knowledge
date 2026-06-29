---
title: "🚨Python爬虫被识别？一招用 rebrowser_playwright 轻松过检测"
date: 2026-06-25
source: "old-blog/心情随笔/🚨Python爬虫被识别？一招用 rebrowser_pl.md"
---

# 🚨Python爬虫被识别？一招用 rebrowser_playwright 轻松过检测

当你用 Playwright 做爬虫或自动化时，网站一眼看出你是机器人有多容易？这时候，你需要的是一个真正能装成“人类浏览器”的工具——`rebrowser_playwright`！

本文将手把手教你如何用 Python + rebrowser 打开 [https://www.browserscan.net/zh/bot-detection，实操演示如何不被识别是爬虫。](https://www.browserscan.net/zh/bot-detection%EF%BC%8C%E5%AE%9E%E6%93%8D%E6%BC%94%E7%A4%BA%E5%A6%82%E4%BD%95%E4%B8%8D%E8%A2%AB%E8%AF%86%E5%88%AB%E6%98%AF%E7%88%AC%E8%99%AB%E3%80%82)

* * *

## 为什么选 rebrowser?

`rebrowser` 是一个对 Playwright 进行强化的浏览器，充分模拟人类浏览器行为，能有效隔绝：

*   常规 headless 检测，如 `navigator.webdriver`
*   WebGL / Canvas / Audio 指纹检测
*   输入法，语言环境，安装插件
*   鼠标运动、点击操作行为

* * *

## 环境配置

### 安装 rebrowser-playwright

```
pip install rebrowser-playwright
rebrowser install

```

### 检测是否完成

```
python -m rebrowser doctor

```

如果看到下面的运行结果，表示 OK:

```
✔ rebrowser Chromium installed
✔ Python bindings OK

```

* * *

## 实战代码

文件名：`browserscan_test.py`

```
from rebrowser_playwright.sync_api import sync_playwright
import time

def run_check():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        context = browser.new_context(
            viewport={'width': 1280, 'height': 720},
            locale='zh-CN',
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        )
        page = context.new_page()
        page.goto("<https://www.browserscan.net/zh/bot-detection>")

        print("🐶 页面打开了，快看检测结果！")

        page.screenshot(path="scan_result.png")

        time.sleep(10)
        browser.close()

if __name__ == "__main__":
    run_check()

```

运行：

```
python browserscan_test.py

```

* * *

## 效果显示

使用 rebrowser 后，大量检测项相对 Playwright 不再是红色的，包括：

*   WebGL 正常
*   AudioContext 值正常
*   `navigator.webdriver` = false
*   UserAgent 和规范浏览器一致
*   插件列表、fonts、语言环境 OK

* * *

## 进阶技巧

### 模拟鼠标操作

```
page.mouse.move(100, 100)
page.mouse.down()
page.mouse.up()

```

### 保存检测结果 PDF

```
page.pdf(path="browserscan_report.pdf")

```

### 配合代理

```
browser = p.chromium.launch(proxy={"server": "<http://127.0.0.1:7890>"})

```

* * *

## 异常排查

| 问题  | 解决方案 |
| --- | --- |
| `rebrowser not found` | 运行 `rebrowser install` |
| 空白页/卡页 | 确保网络正常，加 `headless=False` 进行观察 |
| 检测项仍然失败 | 补充 UA，加上人类操作介入 |

* * *

## 🚫 无缝切换方案：已有 Playwright 代码也可用

你已经写了大量的 `playwright` 代码，不想改 import？用下面这 3 行程序，一键切换：

```
import sys
import rebrowser_playwright

sys.modules["playwright"] = rebrowser_playwright

```

然后你的原有代码：

```
from playwright.sync_api import sync_playwright

```

使用这种猴子补丁（Monkey Patch）🐒方式。保持原有代码不变，就是用了 rebrowser，太方便了！

> 推荐放在入口文件最上方，确保后续代码正确被替换

* * *

## 总结

rebrowser\_playwright 是当下很好用的高障断自动化工具，重写 Playwright 内核，有效解决:

*   被 [browserscan.net](http://browserscan.net) 识别为 bot 的问题
*   随时装成人类运行环境
*   允许旧代码无缝转换

无论是做爬虫，测试，还是行为模拟，rebrowser 都是你的右手。
