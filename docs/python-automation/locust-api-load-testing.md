---
title: "用 Locust 做 API 压测：一篇能让你下次不用再查文档的教程"
date: 2026-06-25
source: "old-blog/技术分享/用 Locust 做 API 压测：一篇能让你下次不用再查文.md"
---

# 用 Locust 做 API 压测：一篇能让你下次不用再查文档的教程

*   最新做了个压力测试，用到了Locust， 做下备忘，用起来还是挺不错的

## 🐍 为什么 Python 工程师不该再用 JMeter？

很多人做接口压测的“第一把枪”都是 **JMeter** —— Java 写的，功能强、支持协议多，但作为 Python 程序员，咱用它就像穿着别人的皮肤写测试脚本，写个逻辑绕三圈、调个参数靠 XML，图形界面又丑又重，配合自动化部署更是心累。

**我们要有自己的压测工具——用 Python 写的，用代码说话的，用起来顺手的。**

于是登场的就是本文主角：**Locust**。

## 什么是 Locust？

[Locust](https://locust.io/) 是一个使用 Python 编写的分布式用户负载测试工具。它允许你使用纯 Python 脚本来定义用户行为，然后模拟数千上万的并发用户发起请求，非常适合做接口压测、性能基准测试和系统稳定性验证。

## 为什么用 Locust？

*   ✅ **Python 写的，写测试像写脚本一样爽**
*   ✅ **Web UI 可视化启动、实时查看压测数据**
*   ✅ **支持分布式压测，顶得住高并发**
*   ✅ **高度可编程，自定义行为逻辑贼灵活**

## 安装 Locust

```

pip install locust

```

你用的是 Windows 的话，建议创建虚拟环境来隔离依赖。

## 快速上手：压测一个 API

以一个简单的 API 为例，假设你有一个 `GET /api/users` 的接口。下面是一个 Locust 测试脚本：

```
from locust import HttpUser, task, between

class MyUser(HttpUser):
    wait_time = between(1, 3)  # 模拟用户请求间隔时间

    @task
    def get_users(self):
        self.client.get("/api/users")


```

保存为 `locustfile.py`，然后运行：

```
locust

```

浏览器访问 [http://localhost:8089](http://localhost:8089)，输入用户数、生成速率、目标地址，开始压测。

## 核心概念回顾

| 概念  | 说明  |
| --- | --- |
| `HttpUser` | 表示一个虚拟用户 |
| `task` | 用户执行的任务，可以是访问接口、登录、提交表单等 |
| `wait_time` | 用户每次任务之间的等待时间 |
| `client` | 内部封装了 HTTP 请求方法，如 `.get()`、`.post()` 等 |

## 更复杂的场景

你可以模拟登录 + 带 token 的接口调用：

```
class AuthUser(HttpUser):
    token = None

    def on_start(self):
        res = self.client.post("/api/login", json={"user": "foo", "pass": "bar"})
        self.token = res.json().get("token")

    @task
    def get_profile(self):
        headers = {"Authorization": f"Bearer {self.token}"}
        self.client.get("/api/profile", headers=headers)


```

## 分布式压测

本地跑不过瘾？可以这样分布式启动：

```
# 启动 master
locust -f locustfile.py --master

# 启动多个 worker
locust -f locustfile.py --worker --master-host=127.0.0.1


```

## 实时监控 + 自动报告

*   Web UI 实时图表：请求成功率、响应时间、吞吐量
*   使用 `-headless` 参数 + `-csv` 可以批量导出测试结果：

```

locust -f locustfile.py --headless -u 100 -r 10 -t 1m --host=http://localhost:8000 --csv=report


```

会生成三份 CSV 文件，包含摘要、统计数据和失败请求。

## 常见坑点 ⚠️

*   **接口响应过慢 → 提前设置超时时间**：用 `self.client.get(..., timeout=10)`
*   **token 在并发场景下不共享 → 用** `**on_start()**` **单用户初始化**
*   **压测数据污染生产库**：**千万别**对正式环境搞压测！

* * *

## 总结

Locust 是个轻量、灵活且 Pythonic 的压测利器，用它压接口就像写自动化脚本一样优雅。下次你要压个微服务、测个登录接口的时候，翻出这篇文章就够了。

> 写代码要测性能，测性能要用 Locust。别等线上打爆了才后悔没压。
