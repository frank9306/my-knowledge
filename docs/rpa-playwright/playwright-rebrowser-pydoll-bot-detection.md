---
title: "三种方式挑战 Cloudflare 与 Bot 检测：Playwright、ReBrowser 与 Pydoll 实战评测"
date: 2026-06-25
source: "old-blog/技术分享/⚔️三种方式挑战 Cloudflare 与 Bot 检测：P.md"
---

# 三种方式挑战 Cloudflare 与 Bot 检测：Playwright、ReBrowser 与 Pydoll 实战评测

本文对比 Playwright、ReBrowser Playwright 和 Pydoll 在 Bot 检测与 Cloudflare Challenge 场景中的表现，并记录各自的接入方式和限制。

参与对比的工具如下：

*   **Playwright**：生态成熟、功能完整，但默认配置容易暴露自动化特征。
*   **ReBrowser Playwright**：基于 Playwright 调整浏览器特征，目标是降低自动化检测概率。
*   **Pydoll**：直接通过 CDP 控制浏览器，API 以异步调用为主，并提供验证码处理能力。

## Pydoll 的主要特性

Pydoll 由 [autoscrape-labs](https://github.com/autoscrape-labs/pydoll) 维护，主要特点如下：

### 不依赖 WebDriver

Pydoll 不通过 WebDriver 启动浏览器，而是使用 CDP 建立控制通道，从而避开 WebDriver 兼容性和部分自动化特征问题。

### 验证码处理

Pydoll 提供验证码处理能力，部分场景仍需外部插件，实际效果取决于目标站点和验证方式。

### 异步 API

API 默认采用异步调用，便于使用 `asyncio` 组织并发浏览器任务。

### 交互行为模拟

Pydoll 支持鼠标轨迹、输入节奏和操作延迟等行为模拟，用于降低固定操作模式带来的检测风险。

### 事件系统

事件系统可以监听 DOM 变化、点击和页面跳转，并触发对应的自动化逻辑。

### 浏览器支持

当前可用于 Chrome、Edge 等 Chromium 系浏览器；其他浏览器需以项目后续支持情况为准。

## 背景：Bot 检测 & Cloudflare 是怎么卡我们的

在自动化采集中，`Cloudflare Challenge` 和各类 `Bot Detection` 是让开发者最头疼的问题之一。传统 Playwright 或 Puppeteer 打开页面，一眼就会暴露出“你是个机器人”。

举个例子：[https://www.browserscan.net/zh/bot-detection](https://www.browserscan.net/zh/bot-detection) 会从多个维度（`navigator.webdriver`, `chrome.runtime`, `WebGL`, `User-Agent` 等）综合判断你是不是人类。

而 Cloudflare 的挑战更是复杂，从 JS Challenge 到 Turnstile 验证，想绕过并不容易。

## 目标

我们将分别使用以下三种方式进行绕过实测：

*   原生 Playwright（接管现有浏览器）
*   ReBrowser（Playwright 的变体）
*   Pydoll（新项目，专为反检测优化）

测试网站：

*   Bot 检测站：[https://www.browserscan.net/zh/bot-detection](https://www.browserscan.net/zh/bot-detection)
*   Cloudflare 挑战站：[https://www.scrapingcourse.com/cloudflare-challenge](https://www.scrapingcourse.com/cloudflare-challenge)

* * *

## 1️⃣ 原生 Playwright 实测

```
@pytest.mark.asyncio
async def test_playwright():
    async with async_playwright() as p:
        browser = await p.chromium.connect_over_cdp("<http://127.0.0.1:9372>")
        context = browser.contexts[0]
        page = await context.new_page()

        await page.goto("<https://www.browserscan.net/zh/bot-detection>")
        await page.wait_for_timeout(5000)
        await page.goto("<https://www.scrapingcourse.com/cloudflare-challenge>")
        await page.wait_for_load_state()
        await page.wait_for_timeout(15000)


```

截图：

![三种方式挑战 Cloudflare 与 Bot 检测：Playwright、ReBrowser 与 Pydoll 实战评测 image 1](/images/imported/playwright-rebrowser-pydoll-bot-detection/image-01.png)![三种方式挑战 Cloudflare 与 Bot 检测：Playwright、ReBrowser 与 Pydoll 实战评测 image 2](/images/imported/playwright-rebrowser-pydoll-bot-detection/image-02.png)

* * *

可以看到明显了CDP连接被检测到了，而且手动点击（verify you are human）也不能跳过，这个在quora平台自动化的时候也遇见过。

## 2️⃣ ReBrowser 实测

```

@pytest.mark.asyncio
async def test_rebrowser_playwright():
    async with reborwser_async_playwright() as p:
        browser = await p.chromium.connect_over_cdp("<http://127.0.0.1:7616>")
        context = browser.contexts[0]
        page = await context.new_page()

        await page.goto("<https://www.browserscan.net/zh/bot-detection>")
        await page.wait_for_timeout(5000)
        await page.goto("<https://www.scrapingcourse.com/cloudflare-challenge>")
        await page.wait_for_load_state()
        await page.wait_for_timeout(30000)


```

![三种方式挑战 Cloudflare 与 Bot 检测：Playwright、ReBrowser 与 Pydoll 实战评测 image 3](/images/imported/playwright-rebrowser-pydoll-bot-detection/image-03.png)![三种方式挑战 Cloudflare 与 Bot 检测：Playwright、ReBrowser 与 Pydoll 实战评测 image 4](/images/imported/playwright-rebrowser-pydoll-bot-detection/image-04.png)

虽然browser-scan显示一切正常，但是 Clouflare却还是跳了人机，而且连接时同样不能手动跳过。

* * *

## 3️⃣ Pydoll 实测

Pydoll 是一个新开源项目：[https://github.com/autoscrape-labs/pydoll](https://github.com/autoscrape-labs/pydoll)

它的核心卖点是：**防检测优化** + **便捷封装的浏览器控制能力**

```

@pytest.mark.asyncio
async def test_pydoll():
    async with Chrome() as browser:
        await browser.start()
        page = await browser.get_page()
        await page.go_to("<https://www.scrapingcourse.com/cloudflare-challenge>")
        await asyncio.sleep(100)
        _success_element = await page.find_element(by="text", value="You bypassed the Cloudflare challenge!")
        assert _success_element is not None


```

**问题**：目前 `Pydoll` 虽然可以使用现有浏览器调试端口，但没有开放类似 Playwright 的 `connect_over_cdp` 接口，因此高级自定义场景仍受限制。GitHub 上已经发布了相关功能预告。

![三种方式挑战 Cloudflare 与 Bot 检测：Playwright、ReBrowser 与 Pydoll 实战评测 image 5](/images/imported/playwright-rebrowser-pydoll-bot-detection/image-05.png)![三种方式挑战 Cloudflare 与 Bot 检测：Playwright、ReBrowser 与 Pydoll 实战评测 image 6](/images/imported/playwright-rebrowser-pydoll-bot-detection/image-06.png)![三种方式挑战 Cloudflare 与 Bot 检测：Playwright、ReBrowser 与 Pydoll 实战评测 image 7](/images/imported/playwright-rebrowser-pydoll-bot-detection/image-07.png)

各工具的测试结果汇总如下。

* * *

## 实测结论

| 项目  | Bot 检测站通过 | Cloudflare Challenge 通过 | 支持调试端口 | 防检测能力 | 成熟度 |
| --- | --- | --- | --- | --- | --- |
| Playwright | 未通过（有 CDP 连接痕迹） | 未通过 | 支持 | 低 | 较高 |
| ReBrowser | 通过 | 未通过 | 支持 | 中 | 中 |
| Pydoll | 通过 | 通过 | 有限（未开放 API） | 高 | 较低 |

* * *

## 总结 & 建议

*   **快速上手建议用 Pydoll**，默认通过 bot 检测，但灵活性有限；
*   **想要自定义复杂行为建议用 ReBrowser + 调试端口接管 Chrome**；
*   **原生 Playwright** 依然是最通用的方式，但防检测需手动处理。

* * *

### 遗憾补充：Pydoll 尚且年轻

目前 `pydoll.browser.chrome.Chrome` 虽然底层调用了 Chrome DevTools，但它**没有暴露标准的** `**connect_over_cdp()**` **接口**，导致没法像 Playwright 一样接入本地调试 Chrome。但是也发布了预告会有新的功能发布。

![三种方式挑战 Cloudflare 与 Bot 检测：Playwright、ReBrowser 与 Pydoll 实战评测 image 8](/images/imported/playwright-rebrowser-pydoll-bot-detection/image-08.png)

* * *

## 参考链接

*   Pydoll GitHub: [https://github.com/autoscrape-labs/pydoll](https://github.com/autoscrape-labs/pydoll)
*   Playwright: [https://playwright.dev/](https://playwright.dev/)
*   ReBrowser: [https://github.com/rebrowser/rebrowser-playwright](https://github.com/rebrowser/rebrowser-playwright)
*   Browserscan 检测站: [https://www.browserscan.net/zh/bot-detection](https://www.browserscan.net/zh/bot-detection)
*   Cloudflare 挑战站: [https://www.scrapingcourse.com/cloudflare-challenge](https://www.scrapingcourse.com/cloudflare-challenge)
