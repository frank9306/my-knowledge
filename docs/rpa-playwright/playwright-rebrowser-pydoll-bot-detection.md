---
title: "⚔️三种方式挑战 Cloudflare 与 Bot 检测：Playwright、ReBrowser 与 Pydoll 实战评测"
source: "old-blog/技术分享/⚔️三种方式挑战 Cloudflare 与 Bot 检测：P.md"
---

# ⚔️三种方式挑战 Cloudflare 与 Bot 检测：Playwright、ReBrowser 与 Pydoll 实战评测

在反爬领域混久了，Cloudflare、BotDetection、验证码系统这几座大山，简直让人抓狂。尤其是 Cloudflare Challenge，一不留神就把你踢出去了，怀疑人生。

但今天，我们带来了三款自动化武器，分别是：

*   🧪 **Playwright**：老牌可靠的浏览器自动化工具，生态成熟，功能齐全，但面对现代 bot 检测稍显吃力。
*   🔬 **ReBrowser Playwright**：Playwright 的“换皮”重制版，绕过 Cloudflare 更进一步，接近类人行为模拟。
*   🧬 **Pydoll**：今天的主角，一个新晋项目，**零 WebDriver**，**原生验证码处理**，**异步极致性能**，正在重新定义“浏览器自动化”的下限和上限。

## 💡 第一眼看到pydoll充满惊喜

来自 [autoscrape-labs](https://github.com/autoscrape-labs/pydoll) 的这个项目，不走寻常路，特点如下：

### ✅ **Zero Webdrivers! Say goodbye to webdriver compatibility nightmares**

传统 WebDriver 不仅运行慢、兼容性差，还容易被特征指纹一锅端，**Pydoll 彻底抛弃 WebDriver**，用 CDP 驱动浏览器，和“真用户”一样登场。

### ✅ **Native Captcha Bypass**

Cloudflare Turnstile？reCAPTCHA v3？小场面。Pydoll 支持验证码的原生绕过逻辑（部分需要外部插件），省去第三方插件 + 脚本混乱。

### ✅ **Async-first 设计**

所有 API 默认异步调用，Python 的 `asyncio` 发挥最大威力，**爬虫速度直接飙车**。

### ✅ **Human-like Interactions**

Pydoll 支持高级行为模拟，比如鼠标轨迹、人类打字节奏、延迟模拟等，**高度还原真实用户操作路径**，对抗 Bot 检测如鱼得水。

### ✅ **Reactive Event System**

你可以监听任意事件，响应 DOM 变化、点击、页面跳转等，**让自动化行为变得真正“智能”**。

### ✅ **Multi-browser Support**

不仅限于 Chromium，还能支持 Chrome、Edge 等多个浏览器，未来甚至可能打通更多浏览器生态。

## 背景：Bot 检测 & Cloudflare 是怎么卡我们的

在自动化采集中，`Cloudflare Challenge` 和各类 `Bot Detection` 是让开发者最头疼的问题之一。传统 Playwright 或 Puppeteer 打开页面，一眼就会暴露出“你是个机器人”。

举个例子：[https://www.browserscan.net/zh/bot-detection](https://www.browserscan.net/zh/bot-detection) 会从多个维度（`navigator.webdriver`, `chrome.runtime`, `WebGL`, `User-Agent` 等）综合判断你是不是人类。

而 Cloudflare 的挑战更是复杂，从 JS Challenge 到 Turnstile 验证，想绕过并不容易。

## 目标

我们将分别使用以下三种方式进行绕过实测：

*   ✅ 原生 Playwright（接管现有浏览器）
*   ✅ ReBrowser（Playwright 的变体）
*   ✅ Pydoll（新项目，专为反检测优化）

测试网站：

*   ✅ Bot 检测站：[https://www.browserscan.net/zh/bot-detection](https://www.browserscan.net/zh/bot-detection)
*   ✅ Cloudflare 挑战站：[https://www.scrapingcourse.com/cloudflare-challenge](https://www.scrapingcourse.com/cloudflare-challenge)

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

![⚔️三种方式挑战 Cloudflare 与 Bot 检测：Playwright、ReBrowser 与 Pydoll 实战评测 image 1](/images/imported/playwright-rebrowser-pydoll-bot-detection/image-01.png)![⚔️三种方式挑战 Cloudflare 与 Bot 检测：Playwright、ReBrowser 与 Pydoll 实战评测 image 2](/images/imported/playwright-rebrowser-pydoll-bot-detection/image-02.png)

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

![⚔️三种方式挑战 Cloudflare 与 Bot 检测：Playwright、ReBrowser 与 Pydoll 实战评测 image 3](/images/imported/playwright-rebrowser-pydoll-bot-detection/image-03.png)![⚔️三种方式挑战 Cloudflare 与 Bot 检测：Playwright、ReBrowser 与 Pydoll 实战评测 image 4](/images/imported/playwright-rebrowser-pydoll-bot-detection/image-04.png)

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

🧩 **问题**：目前 `Pydoll` 虽然可以使用现有浏览器调试端口，但并**没有开放类似 Playwright 的** `**connect_over_cdp**` **接口**，对高级自定义场景略显不足，但github上已经发布了预告，期待这个功能。

![⚔️三种方式挑战 Cloudflare 与 Bot 检测：Playwright、ReBrowser 与 Pydoll 实战评测 image 5](/images/imported/playwright-rebrowser-pydoll-bot-detection/image-05.png)![⚔️三种方式挑战 Cloudflare 与 Bot 检测：Playwright、ReBrowser 与 Pydoll 实战评测 image 6](/images/imported/playwright-rebrowser-pydoll-bot-detection/image-06.png)![⚔️三种方式挑战 Cloudflare 与 Bot 检测：Playwright、ReBrowser 与 Pydoll 实战评测 image 7](/images/imported/playwright-rebrowser-pydoll-bot-detection/image-07.png)

明显看到都过了，确实很棒！

* * *

## 🧠 实测结论

| 项目  | Bot 检测站通过 | Cloudflare Challenge 通过 | 支持调试端口 | 防检测能力 | 成熟度 |
| --- | --- | --- | --- | --- | --- |
| Playwright | 🚫（有CDP连接痕迹） | 🚫  | ✅   | ⭐⭐  | ⭐⭐⭐⭐ |
| ReBrowser | ✅   | 🚫  | ✅   | ⭐⭐⭐ | ⭐⭐⭐ |
| Pydoll | ✅（默认通过） | ✅   | ⚠️ 不开放API | ⭐⭐⭐⭐⭐ | ⭐⭐  |

* * *

## 💬 总结 & 建议

*   **快速上手建议用 Pydoll**，默认通过 bot 检测，但灵活性有限；
*   **想要自定义复杂行为建议用 ReBrowser + 调试端口接管 Chrome**；
*   **原生 Playwright** 依然是最通用的方式，但防检测需手动处理。

* * *

### 🧱 遗憾补充：Pydoll 尚且年轻

目前 `pydoll.browser.chrome.Chrome` 虽然底层调用了 Chrome DevTools，但它**没有暴露标准的** `**connect_over_cdp()**` **接口**，导致没法像 Playwright 一样接入本地调试 Chrome。但是也发布了预告会有新的功能发布。

![⚔️三种方式挑战 Cloudflare 与 Bot 检测：Playwright、ReBrowser 与 Pydoll 实战评测 image 8](/images/imported/playwright-rebrowser-pydoll-bot-detection/image-08.png)

* * *

## 📎 参考链接

*   Pydoll GitHub: [https://github.com/autoscrape-labs/pydoll](https://github.com/autoscrape-labs/pydoll)
*   Playwright: [https://playwright.dev/](https://playwright.dev/)
*   ReBrowser: [https://github.com/rebrowser/rebrowser-playwright](https://github.com/rebrowser/rebrowser-playwright)
*   Browserscan 检测站: [https://www.browserscan.net/zh/bot-detection](https://www.browserscan.net/zh/bot-detection)
*   Cloudflare 挑战站: [https://www.scrapingcourse.com/cloudflare-challenge](https://www.scrapingcourse.com/cloudflare-challenge)
