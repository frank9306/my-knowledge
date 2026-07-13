---
title: "rebrowser-playwright解决Etsy的Bot检测"
date: 2026-06-25
source: "old-blog/技术分享/🛡️ rebrowser-playwright解决Etsy.md"
---

# rebrowser-playwright解决Etsy的Bot检测

## 背景介绍

在抓取 Etsy 商家后台订单数据的过程中，目标链接如下：

```
<https://www.etsy.com/your/orders/sold/completed?ref=seller-platform-mcnav&completed_date=last_30_days>

```

目标站点不仅检查登录状态，还会频繁触发人机验证；即使手动通过验证，账号仍可能被锁定。

常规爬虫工具几乎全军覆没。

![rebrowser-playwright解决Etsy的Bot检测 image 1](/images/imported/rebrowser-playwright-etsy-bot-detection/image-01.png)

* * *

## 尝试失败的工具

### 1\. Selenium

*   模拟登陆 → 弹出验证码
*   尝试手动过验证 → 成功一两次后直接封号
*   连 Chrome 的 debug 模式都救不了

### 2\. Playwright

*   稍微好一点，偶尔能成功进页面
*   但只要频繁访问、或使用 headless，就又被检测为 Bot
*   有时页面能加载，数据却拿不到

**两者的共同问题**：浏览器指纹仍会暴露自动化特征，无法稳定通过 Etsy 的检测。

* * *

## 测试 rebrowser-playwright

测试 [`rebrowser-playwright`](https://github.com/rebrowser-dev/rebrowser) 后，Etsy 页面可以正常加载，验证码出现频率明显降低，本次测试未再触发其他反爬限制。

### 主要特性

*   自带 Fingerprint 伪装（包括 `navigator.*`、Canvas、WebGL 等）
*   Stealth 模式下几乎与真用户无异
*   支持真实代理 + cookie 导入
*   自动保持浏览器 session，支持断点续抓

## 总结

| 工具  | 结果  | 是否推荐 |
| --- | --- | --- |
| Selenium | 频繁出现验证码，测试中账号被锁 | 不适合此场景 |
| Playwright | 偶尔进入页面，频繁访问或无头模式会触发检测 | 稳定性不足 |
| rebrowser-playwright | 本次测试正常加载，验证码出现频率较低 | 需要持续验证 |

## 小技巧

因为我是使用的playwright 引擎，已经根深蒂固，我不想在没出都需要修改，所以可以这样，使用猴子补丁的方式，让替换 rebrowser-playwright 无感。

```
import sys
import rebrowser_playwright

sys.modules["playwright"] = rebrowser_playwright

```
