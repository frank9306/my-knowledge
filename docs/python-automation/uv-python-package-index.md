---
title: "使用 uv 替换 Python 包源"
date: 2026-06-25
source: "old-blog/心情随笔/使用 uv 替换 Python 包源.md"
---

# 使用 uv 替换 Python 包源

在 Python 的包管理世界里，`pip` 和 `venv` 曾是不可撼动的老大哥。但随着 [`uv`](https://github.com/astral-sh/uv) 横空出世，以其极致的速度和现代化的体验，逐渐成为开发者新宠。

每次新建项目之后发现安装包时，报错 `Timeout` ,然后再去替换源，总记不住它的格式，所以盘点下它的几种修改方式，备忘。

## 💡 为啥要替换源？

*   **提速**：默认的 `https://pypi.org/simple` 对国内访问速度堪忧，能快谁不想快？
*   **测试私有包**：在 CI/CD 或测试环境中，我们可能需要指向 `https://test.pypi.org/simple` 或私有源。
*   **内网部署**：很多公司使用 Nexus、Artifactory 或 devpi 托管自己的 PyPI 镜像。

## 🧪 方法一：临时替换（命令行）

这是最简单直接的方式，适用于临时性场景：

```

uv add requests --index-url <https://pypi.tuna.tsinghua.edu.cn/simple>

```

支持的参数和 pip 几乎一致：

*   `-index-url`（主索引）
*   `-extra-index-url`（附加索引）
*   `-no-index`（关闭默认索引）

* * *

## 📦 方法二：项目环境替换（推荐方式）

要实现**自动使用某个索引地址**，推荐在项目的 `pyproject.toml` 文件中配置。

```

[[tool.uv.index]]
url = "<https://pypi.tuna.tsinghua.edu.cn/simple>"
default = true

```

上面配置说明：

*   `[[tool.uv.index]]`：可以有多个索引地址。
*   `url`：索引地址。
*   `default = true`：这个设置是关键！它等价于命令行里的 `-default-index`，会替换默认的 PyPI。

你也可以添加多个源，例如：

```

[[tool.uv.index]]
url = "<https://pypi.tuna.tsinghua.edu.cn/simple>"
default = true

[[tool.uv.index]]
url = "<https://company-internal-pypi.com/simple>"


```

* * *

## 🧼 方法三：环境变量配置

官方提供了环境变量的方式配置

[Environment variables | uv](https://docs.astral.sh/uv/configuration/environment/#uv_custom_compile_command)

![使用 uv 替换 Python 包源 image 1](/images/imported/uv-python-package-index/image-01.png)

需要可以自行配置。

* * *

## 🚀 总结

`uv` 让 Python 包管理更快更稳更现代，而设置源也比 `pip` 时代更优雅。只需动动 `pyproject.toml`，就能优雅替换源地址，个人还是喜欢这种方式。
