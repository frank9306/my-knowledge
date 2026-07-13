---
title: "用 Locust 做 API 压测：从脚本编写到结果分析"
date: 2026-06-25
source: "old-blog/技术分享/用 Locust 做 API 压测：一篇能让你下次不用再查文.md"
---

# 用 Locust 做 API 压测：从脚本编写到结果分析

这篇文章记录一次 Locust 接口压测实践，包括任务脚本、启动参数、结果指标和常见问题。

## 为什么在 Python 项目中使用 Locust？

JMeter 支持的协议较多，也提供成熟的图形界面。对于以 Python 为主的项目，Locust 可以直接用 Python 定义用户行为，更容易复用现有代码并接入 CI。

本文选择 **Locust**，重点关注 API 压测脚本的可维护性和自动化执行。

## 什么是 Locust？

[Locust](https://locust.io/) 是一个使用 Python 编写的分布式用户负载测试工具。它允许你使用纯 Python 脚本来定义用户行为，然后模拟数千上万的并发用户发起请求，非常适合做接口压测、性能基准测试和系统稳定性验证。

## 为什么用 Locust？

*   使用 Python 编写用户行为脚本
*   通过 Web UI 查看实时压测数据
*   支持分布式压测
*   可以按业务场景扩展请求和校验逻辑

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

## 常见坑点

*   **接口响应过慢 → 提前设置超时时间**：用 `self.client.get(..., timeout=10)`
*   **token 在并发场景下不共享 → 用** `**on_start()**` **单用户初始化**
*   **压测数据污染生产库**：**千万别**对正式环境搞压测！

* * *

## 总结

Locust 适合需要用 Python 描述用户行为、接入自动化流程或运行分布式压测的项目。执行压测前应明确目标并发量、响应时间阈值和测试数据隔离方案，避免直接对生产环境施压。
