---
title: "在飞牛 NAS 上部署基于 Trilium 的个人博客实践"
source: "old-blog/技术分享/在飞牛 NAS 上部署基于 Trilium 的个人博客实践.md"
---

# 在飞牛 NAS 上部署基于 Trilium 的个人博客实践

最近我在飞牛 NAS 上尝试搭建了一个个人博客，选择了 **Trilium Notes** 作为内容管理核心，并使用了开源的 **Ankia 主题(**[**Github链接**](https://github.com/dvai/Ankia-Theme)**)**。整个部署过程融合了 **Cloudflare Tunnels + Caddy** 的方案，并成功绑定了自定义域名。下面分享我的部署经验与配置要点。

以下内容为简略记录，后续补充详细内容。

* * *

## 1\. 系统与前置条件

*   **NAS 系统**：飞牛 NAS
*   **容器环境**：Docker
*   **Trilium 版本**：最新稳定版
*   **主题**：Ankia Theme
*   **反向代理**：Caddy
*   **外网穿透**：Cloudflare Tunnels

在部署前，你需要确保 NAS 可以运行 Docker，并且能访问外网，用于 Cloudflare 隧道的注册与配置。

* * *

## 2\. 部署 Trilium

1.  拉取 Trilium 镜像并运行：

```
docker run -d \
  --name trilium \
  -p 8089:8080 \
  -v /volume1/trilium-data:/data \
  zadam/trilium:latest
```

这里我们将 Trilium 内部的 8080 端口映射到 NAS 的 8089，避免与 Caddy 本身监听的 8080 冲突。

2.  访问 NAS IP:8089，完成 Trilium 的初始化设置，并导入 **Ankia 主题**。

* * *

## 3\. 配置 Caddy + Cloudflare Tunnels

为了让外网可以访问，并且使用自定义域名，我选择了 Cloudflare Tunnels 结合 Caddy 进行反向代理。

Caddyfile 配置示例：

```
:8080 {
    # 根路径重定向到 /share/Index
    @root path /
    rewrite @root /share/Index

    # 其他非 /share 路径重写到 /share{uri}
    @notShare {
        not path /share*
    }
    rewrite @notShare /share{uri}

    # 代理到后端 Trilium 容器
    reverse_proxy host.docker.internal:8089
}
```

### 配置说明：

*   **根路径重定向**：用户访问 `https://yourdomain.com/` 时，会直接跳转到 `/share/Index`，避免访问空白首页。
*   **其他路径重写**：所有非 `/share` 的路径都被重写到 `/share{uri}`，保证主题资源与文章路径正常。
*   **反向代理**：Caddy 将请求转发到本地 Docker 内运行的 Trilium 容器（端口 8089）。

* * *

## 4\. 使用 Cloudflare Tunnel

1.  在 Cloudflare 注册一个 Tunnel。
    
    <figure class="image"><img style="aspect-ratio:1920/860;" src="在飞牛 NAS 上部署基于 Trilium 的个人博.png" width="1920" height="860"></figure>
2.  添加一个应用程序路由， 将子域名→ NAS上的Caddy配置端口：

<figure class="image"><img style="aspect-ratio:1669/572;" src="1_在飞牛 NAS 上部署基于 Trilium 的个人博.png" width="1669" height="572"></figure>

此时，你的博客就可以通过自定义域名安全访问了。

* * *

## 5\. 小结与心得

*   利用 **Trilium Notes** + **Ankia Theme** 可以快速搭建一个漂亮的知识型博客。
*   **Caddy** 的路径重写功能非常方便，能够解决主题资源与访问路径问题。
*   **Cloudflare Tunnel** 免去了传统端口映射和 NAT 的烦恼，同时提供 HTTPS。
*   结合 NAS 和 Docker，整套方案简单、高效、可维护。
