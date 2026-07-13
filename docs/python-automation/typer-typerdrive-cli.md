---
title: "Typer + Typerdrive 开发 CLI 工具全攻略"
date: 2026-06-25
source: "old-blog/心情随笔/🚀 Typer + Typerdrive 开发 CLI 工.md"
---

# Typer + Typerdrive 开发 CLI 工具全攻略

## 背景：为啥选 Typer / Typerdrive？

Python 写 CLI 一直有好几家，比如 click、argparse、fire，但 Typer 一出来直接把它们都按地上摩擦：

*   用起来像 FastAPI，类型注解天然适配
*   支持自动补全、help 文档、类型检查
*   干净优雅，适合现代人类使用

但 Typer 只管“命令行参数解析”，当你要构建一个**对接 API 的 CLI 工具**时，你还得重复造轮子（配置管理、缓存、日志、异常处理等）。

这时候，Typerdrive 上场了。它就是 Typer 的“生产力外挂”，封装了构建 API 客户端 CLI 的所有通用逻辑。

* * *

## Typer 简单回顾

```
import typer

app = typer.Typer()

@app.command()
def hello(name: str):
    print(f"Hello {name}")

if __name__ == "__main__":
    app()


```

它会自动生成：

```
$ python main.py hello --name 狗剩


```

支持：help、类型校验、自动补全，一应俱全。

* * *

## Typerdrive 是什么？

Typerdrive 是在 Typer 上封装的一个 CLI 应用开发工具集，作者是 [@Dusktreader](https://dusktreader.dev/)。它包含：

*   设置管理：配置保存在 `.tdconfig.toml` 中
*   缓存支持：比如登录后的 token、用户 ID
*   HTTP 客户端：封装 `httpx`，默认加上 header、异常处理
*   日志与调试：支持 debug mode
*   异常美化：API 错误转为人类能看懂的话

* * *

## 安装 Typerdrive

```
pip install typerdrive


```

* * *

## 实战案例：打造一个 Todo CLI 工具

目标是操作一个 FastAPI 提供的远程 API：

*   `/tasks` GET：列出任务
*   `/tasks` POST：新增任务
*   `/tasks/{id}` DELETE：删除任务

### 代码：

```
from typerdrive import TyperDriveClient, CommandApp
import typer

app = CommandApp(name="todo")
client = TyperDriveClient(base_url="<https://api.your-todo.com>")

@app.command()
def list():
    tasks = client.get("/tasks").json()
    for task in tasks:
        typer.echo(f"{task['id']}: {task['title']}")

@app.command()
def add(title: str):
    res = client.post("/tasks", json={"title": title})
    typer.echo(f"添加成功: {res.json()}")

@app.command()
def delete(task_id: int):
    client.delete(f"/tasks/{task_id}")
    typer.echo(f"已删除任务 {task_id}")


```

### 使用：

```
# 设置 token
$ todo config set auth.token "your-token"

# 查看任务
$ todo list

# 添加任务
$ todo add "赚钱买显卡"

# 删除任务
$ todo delete 42


```

* * *

## 配置与缓存机制

Typerdrive 自动读取 `.tdconfig.toml` 和缓存路径 `~/.cache/typerdrive/<project>`。

示例 `.tdconfig.toml`：

```
[auth]
token = "your-token"

[api]
base_url = "<https://api.your-todo.com>"


```

你可以在代码中通过 `client.settings["auth.token"]` 拿到值。

* * *

## 总结一下

| 项目  | 作用  |
| --- | --- |
| Typer | 命令行参数解析 |
| Typerdrive | 构建完整 CLI 工具（尤其是 API 客户端） |

Typer = CLI 框架，Typerdrive = 构建 CLI 产品。

推荐场景：需要编写操作后端 API 的 CLI 工具，例如：

*   管理 K8s、Serverless 的命令行工具
*   操作某个 SaaS 平台的数据接口
*   构建面向运维或内部开发者的终端工具
