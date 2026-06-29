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

📌 问题场景复现 以下是一个典型的复现代码：

```
chrome_options = webdriver.ChromeOptions()
chrome_options.add_experimental_option("debuggerAddress", "127.0.0.1:14222")

service = Service(executable_path="path/to/chromedriver")
driver = webdriver.Chrome(service=service, options=chrome_options)

```

如果这时 ClonBrowser 正处于初始页面（例如默认打开了插件页 chrome-extension://xxx/index.html），你就会直面以下爆炸性报错：

`unknown error: unable to discover open window in chrome` 🧠 根本原因分析 ChromeDriver 在连接浏览器调试端口时，会尝试获取一个或多个“可用窗口”作为 WebDriver 的控制目标。在 `134` 版本之前，我都是可以正常连接的即使页面是插件页面，但到了 `134` 版本，他将不识别插件页面为一个有效页面。
