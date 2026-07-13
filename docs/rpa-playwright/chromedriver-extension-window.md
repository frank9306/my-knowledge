---
title: "ChromeDriver 无法识别插件页面为窗口"
date: 2026-06-25
source: "old-blog/心情随笔/ChromeDriver 无法识别插件页面为窗口.md"
---

# ChromeDriver 无法识别插件页面为窗口

在使用 Selenium + ChromeDriver 连接浏览器进行调试的时候，遇到了如下错误：

```
selenium.common.exceptions.WebDriverException: Message: unknown error: unable to discover open window in chrome

```

这个错误表面是“找不到可连接的窗口”，但实质上是 —— ChromeDriver 无法将插件页识别为有效的浏览器窗口。

## 问题场景复现

以下是一个典型的复现代码：

```
chrome_options = webdriver.ChromeOptions()
chrome_options.add_experimental_option("debuggerAddress", "127.0.0.1:14222")

service = Service(executable_path="path/to/chromedriver")
driver = webdriver.Chrome(service=service, options=chrome_options)

```

如果这时 ClonBrowser 正处于初始页面（例如默认打开了插件页 `chrome-extension://xxx/index.html`），会出现以下错误：

`unknown error: unable to discover open window in chrome`

## 根本原因分析

ChromeDriver 连接浏览器调试端口时，会查找一个或多个可作为 WebDriver 控制目标的窗口。在 `134` 版本之前，即使初始页面是插件页也可以正常连接；升级到 `134` 后，ChromeDriver 不再把插件页识别为有效窗口。
