---
title: "🚀 SHEIN 订单下载踩坑记：UI拦不住我，我用 Playwright 拦截请求改时间！"
date: 2026-06-25
source: "old-blog/技术分享/🚀 SHEIN 订单下载踩坑记：UI拦不住我，我用 Pla.md"
---

# 🚀 SHEIN 订单下载踩坑记：UI拦不住我，我用 Playwright 拦截请求改时间！

今天在处理一个下载 SHEIN 订单数据的需求时，遇到了一点小坎坷。需求本身很简单：

1.  选择时间范围
2.  点“查询”
3.  点“导出订单”下载

但谁能想到，一个小小的**时间选择器**居然把人劝退了。于是我换了思路，直接**拦截请求改参数**，一顿操作猛如虎，搞定！

* * *

## 🧨 问题复现

按照流程，我先在页面上选时间，再点查询，最后点击导出订单。

但是——**时间选择器完全没有绑定任何** `**<input>**`**！**

我打开 DevTools 一看，发现页面加载的时候挂着 `window.React` 和 `window.ReactDOM`，这玩意明显是用 React 写的，状态都封装在组件里。

光看到这样的框架，有些人就要望而却步了。这种设计方案看起来是在给用户画套圈子，把一切都封装在 React 状态里。我也先跑了，没必要和他较真。

* * *

## 🔍 接口分析

我转头去看了下 Network 面板，点击“导出订单”按钮后，抓到了关键请求：

```

POST /export/order


```

请求体里带着两个关键参数：

```

{
  "allocateTimeStart": "2024-05-01",
  "allocateTimeEnd": "2024-05-20"
}


```

这不就是我要的时间范围吗？

既然页面改不了，那就直接从接口下手，**拦截请求，注入我要的时间参数！**

* * *

## 🛠️ 解决方案：Playwright 拦截 + 参数注入（Python 版）

以下是我用 Python + Playwright 写的脚本，思路很简单：

1.  拦截导出请求
2.  修改时间参数
3.  放行请求

```
python
复制编辑
from playwright.sync_api import sync_playwright
import json

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    context = browser.new_context()
    page = context.new_page()

    # 拦截并修改 export/order 请求的参数
    def handle_route(route, request):
        if request.method == "POST" and "/export/order" in request.url:
            post_data = json.loads(request.post_data or '{}')
            post_data["allocateTimeStart"] = "2024-05-01"
            post_data["allocateTimeEnd"] = "2024-05-20"
            route.continue_(
                post_data=json.dumps(post_data)
            )
        else:
            route.continue_()

    page.route("**/export/order", handle_route)

    # 打开 SHEIN 管理后台页面
    page.goto("<https://your-shein-admin-url.com>")

    
    # 直接点导出按钮就行了，时间参数已经被我改了
    page.click("text=导出订单")

    # 观察页面行为，下载是否成功
    page.wait_for_timeout(5000)

    browser.close()


```

\*\*声明：\*\*以上所有请求内容和技术细节均为演示用途，仅用于展示 Playwright 的请求拦截能力。和平台并无关联。

* * *

## ✅ 最终效果

下载下来的订单 Excel 文件，时间范围完全命中我设定的 `2024-05-01 ~ 2024-05-20`，不用点击时间选择器、不用点查询，**一键导出，一步到位。**

* * *

## 📌 总结

这事告诉我一个道理：

> UI 是你演的，接口才是你真的在干活。

别跟那些 UI 弯弯绕瞎耗时间，Playwright 一出手，接口拦截走一波，**数据直通、效率翻倍**。

* * *
