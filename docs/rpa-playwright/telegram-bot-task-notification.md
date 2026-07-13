---
title: "任务跑挂了你都不知道？用Telegram Bot通知你"
date: 2026-06-25
source: "old-blog/技术分享/任务跑挂了你都不知道？用Telegram Bot通知你.md"
---

# 任务跑挂了你都不知道？用Telegram Bot通知你

日常开发中，我们总有一些定时跑的任务，比如抓取数据、备份服务、同步配置、爬虫更新等等。这些任务大多数时候悄无声息地跑完，但一旦失败或者机器宕机，没人提醒就可能直接酿成事故。

公司有一台机器需要跑RPA的任务，开始以为仅仅是跑几天就完事了，一不留神都几个月了。每隔一段时间机器就会重启，宕机或者账号掉了。最后忍无可忍，我也不能每天盯着它，所以我自己写了一个基于 Python 的轻量定时任务框架，再配合 Telegram Bot 搭建了一套「异常秒报 + 状态推送」的通知系统，效果非常稳。**成功了给我发绿勾，失败了直接红警推送，根本不会错过任何异常。**

## 为什么选 Telegram Bot？

*   免费，稳定，不限条数
*   官方 API 文档清晰，调用简单
*   支持群组、频道、私聊多场景
*   消息支持富文本、图片、代码块等样式

* * *

## 一、创建 Telegram Bot

1.  打开 Telegram，搜索 `BotFather`，发送 `/start`
2.  输入 `/newbot` 创建你的机器人，按提示操作
3.  创建成功后，BotFather 会返回一段类似这样的 Token：
    
    ```
    
    123456789:ABCdefGhIJKLmnoPQRstuVwxyZ12345678
    
    
    ```

* * *

## 二、获取 chat\_id（发送目标）

1.  创建一个频道或群组，或者直接给自己发也行
2.  把你的机器人拉进去
3.  发一条消息（如“hello”）
4.  打开浏览器访问以下链接：
    
    ```
    <https://api.telegram.org/bot><你的BotToken>/getUpdates
    
    ```
5.  找到你发的那条消息，里面会有如下结构：
    
    ```
    "chat": {
      "id": -1001234567890
    }
    
    ```

这个 `id` 就是你要发送消息的目标 chat\_id。

* * *

## 三、用 Python 发消息到 Telegram

```
python
复制编辑
import requests

TOKEN = "你的 Bot Token"
CHAT_ID = "你的 chat_id"

def send_message(text: str):
    url = f"<https://api.telegram.org/bot{TOKEN}/sendMessage>"
    payload = {
        "chat_id": CHAT_ID,
        "text": text,
        "parse_mode": "Markdown"
    }
    r = requests.post(url, json=payload)
    return r.json()


```

* * *

## 四、应用场景举例

我在自己的定时任务框架中内置了 Telegram 通知，比如：

*   任务执行成功/失败通知
*   每日定时任务汇总报告
*   服务心跳检测失败提醒
*   主机重启、内存占用过高报警

你可以把它理解成：**一套穷人的企业微信+Server酱+运维监控系统**。

### 示例效果

![任务跑挂了你都不知道？用Telegram Bot通知你 image 1](/images/imported/telegram-bot-task-notification/image-01.png)

* * *

## 五、总结

Telegram Bot 是一个非常实用的工具：

*   可用于定时任务结果汇报
*   也可用于系统监控告警
*   不依赖第三方服务，不受限速，不需要登录网页
*   接入简单，一次接入，随便扩展

如果你平时有在写脚本、跑定时任务、做监控分析，这种通知方式强烈建议用起来。
