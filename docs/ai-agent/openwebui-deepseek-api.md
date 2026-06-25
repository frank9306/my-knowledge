---
title: "🐳 OpenWebUI + Deepseek API 快速部署笔记"
source: "old-blog/技术分享/🐳 OpenWebUI + Deepseek API 快速.md"
---

# 🐳 OpenWebUI + Deepseek API 快速部署笔记

在大模型遍地开花的今天，想整一个“能打的”本地聊天界面+强力 API 推理后端，已经成了很多工程师的刚需。这篇笔记就是奔着实用、快速部署去的：我们用 Docker 拉起 OpenWebUI，当作前端交互界面，然后把 Deepseek 的 API 搭进去，搞定一个轻量、可控、不依赖国外服务的 ChatGPT 平替。

本文不吹牛逼，不卖安利，纯干货。你会看到完整的部署命令、配置说明、注意事项，全程一把梭，不绕弯子，5 分钟搞定能用能改能扩展的 LLM 聊天系统。

![🐳 OpenWebUI + Deepseek API 快速部署笔记 image 1](/images/imported/openwebui-deepseek-api/image-01.png)

## 1\. 起个 OpenWebUI 容器先

这玩意可以用 `docker run` 一行搞定，不用管什么 docker-compose 了，懒人最爱。

```
docker run -d \\
  -p 3000:8080 \\
  --add-host=host.docker.internal:host-gateway \\
  -v open-webui:/app/backend/data \\
  --name open-webui \\
  --restart always \\
  ghcr.io/open-webui/open-webui:main

```

几个重点参数解释一下：

*   `p 3000:8080` → 浏览器访问用 `localhost:3000`
*   `-add-host=host.docker.internal:host-gateway` → 让容器能访问宿主机，比如你跑的 Deepseek API
*   `v open-webui:/app/backend/data` → 保持用户数据、设置啥的别丢
*   `-restart always` → 宿主机重启自动拉起来

注意：启动需要点时间，耐心等待

* * *

## 2\. 获取Deepseek API KEY

[DeepSeek Platform](https://platform.deepseek.com/api_keys)

充值后自行获取

* * *

## 3\. 配置 OpenWebUI 连上DeepSeek

浏览器访问：[http://localhost:3000](http://localhost:3000)

### 3.1 注册登录

注册个账号，然后：

![🐳 OpenWebUI + Deepseek API 快速部署笔记 image 2](/images/imported/openwebui-deepseek-api/image-02.png)

这是已经添加了模型的，刚一进来时没有模型可用的。

### 3.2 登录OpenWebUI社区，获取函数配置

进入  [https://openwebui.com/f/zgccrui/deepseek\_r1](https://openwebui.com/f/zgccrui/deepseek_r1) （如果没有注册先注册）

![🐳 OpenWebUI + Deepseek API 快速部署笔记 image 3](/images/imported/openwebui-deepseek-api/image-03.png)

获取

![🐳 OpenWebUI + Deepseek API 快速部署笔记 image 4](/images/imported/openwebui-deepseek-api/image-04.png)

输入要导入的链接

![🐳 OpenWebUI + Deepseek API 快速部署笔记 image 5](/images/imported/openwebui-deepseek-api/image-05.png)

点击保存

### 3.3 设置默认值

![🐳 OpenWebUI + Deepseek API 快速部署笔记 image 6](/images/imported/openwebui-deepseek-api/image-06.png)

点击设置并修改默认值。

![🐳 OpenWebUI + Deepseek API 快速部署笔记 image 7](/images/imported/openwebui-deepseek-api/image-07.png)

最后记得开启，否则还是看不到。
