---
title: "🛡️ rebrowser-playwright解决Etsy的Bot检测"
date: 2026-06-25
source: "old-blog/技术分享/🛡️ rebrowser-playwright解决Etsy.md"
---

# 🛡️ rebrowser-playwright解决Etsy的Bot检测

## 🧾 背景介绍

在抓取 Etsy 商家后台订单数据的过程中，目标链接如下：

```
<https://www.etsy.com/your/orders/sold/completed?ref=seller-platform-mcnav&completed_date=last_30_days>

```

原本以为只是常规登录态检查，结果是开启了全套「反爬核武器」——动不动就弹人机验证，甚至在手动通过验证后，账号直接被锁。😡

常规爬虫工具几乎全军覆没。

![🛡️ rebrowser-playwright解决Etsy的Bot检测 image 1](/images/imported/rebrowser-playwright-etsy-bot-detection/image-01.png)

* * *

## ❌ 尝试失败的工具

### 1\. Selenium

*   模拟登陆 → 弹出验证码
*   尝试手动过验证 → 成功一两次后直接封号
*   连 Chrome 的 debug 模式都救不了

### 2\. Playwright

*   稍微好一点，偶尔能成功进页面
*   但只要频繁访问、或使用 headless，就又被检测为 Bot
*   有时页面能加载，数据却拿不到

👎 **两者共同的硬伤**：**浏览器指纹无法隐藏**，在 Etsy 眼里，就是“伪装得像人，但我就是不信”。

* * *

## ✅ rebrowser-playwright：反爬破局者

偶然发现了 [`rebrowser-playwright`](https://github.com/rebrowser-dev/rebrowser) 这个项目。试了一下之后惊为天人——Etsy 页面完美加载，验证码几乎不弹，反爬系统也不触发。

### 🚀 特性一览：

*   🔐 自带 Fingerprint 伪装（包括 `navigator.*`、Canvas、WebGL 等）
*   🧙 Stealth 模式下几乎与真用户无异
*   🧭 支持真实代理 + cookie 导入
*   🔁 自动保持浏览器 session，支持断点续抓

## 📌 总结

| 工具  | 结果  | 是否推荐 |
| --- | --- | --- |
| Selenium | 🚫 被秒杀，频繁验证码、封锁 | ❌   |
| Playwright | ⚠️ 偶尔成功，容易暴露 | ⚠️  |
| rebrowser-playwright | ✅ 稳定、高拟真、无验证 | ✅ 强推 |

## 🔍 小技巧

因为我是使用的playwright 引擎，已经根深蒂固，我不想在没出都需要修改，所以可以这样，使用猴子补丁的方式，让替换 rebrowser-playwright 无感。

```
import sys
import rebrowser_playwright

sys.modules["playwright"] = rebrowser_playwright

```
