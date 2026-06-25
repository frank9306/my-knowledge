---
title: "Python 运行单文件：uv + PEP 723 真正实现即写即跑！"
source: "old-blog/技术分享/Python 运行单文件：uv + PEP 723 真正实现.md"
---

# Python 运行单文件：uv + PEP 723 真正实现即写即跑！

### 1\. 开场：告别虚拟环境的烦恼

传统 Python 项目总是这样开局：

```

python -m venv venv
source venv/bin/activate
pip install -r requirements.txt


```

或者可以使用 `uv` ：

```
uv init project_name
cd project_name
uv add
....
uv run main.py

```

每个脚本都要从头来一套，**你是在写 Python，还是在“孵虚拟环境”？**

是时候进入 Python 的单文件新时代了。

* * *

### 2\. 主角登场：uv + PEP 723 是什么

**uv** 是一个极速、现代化的 Python 包管理器，支持安装、运行、缓存依赖，性能爆炸快。

而 **PEP 723** 是 Python 的提案规范，允许我们在脚本文件头部直接声明依赖：

```
# /// script
# requires-python = ">=3.10"
# dependencies = ["rich"]
# ///

from rich import print

if __name__ == "__main__":
    print("[bold green]Hello uv!")


```

你只需要保存这个文件，然后：

```
uv run file.py

```

它就会自动：

*   解析 metadata
*   安装依赖（如果缓存已有会复用）
*   使用合适的解释器运行
*   不生成任何 `.venv/` 目录

* * *

### 3\. uvx 是啥？能干嘛？

`uvx` 是 `uv` 的扩展接口，能替代工具链里的很多命令，例如：

```

uvx ruff --fix file.py  # 等同于 ruff --fix
uvx black .             # 自动格式化当前目录代码


```

相当于你有个环境管理器，一口气就把所有工具和依赖都跑起来，还不怕版本冲突。

* * *

### 4\. 没 metadata 能运行吗？

如果你写的 Python 脚本**没有带 PEP 723 元数据块**，直接 `uv file.py` 会报错：

```

$ uv run myscript.py

Traceback (most recent call last):
  File "xxxxxxx\\myscript.py", line 2, in <module>
    from rich import print
ModuleNotFoundError: No module named 'rich'


```

* * *

### 5\. 缓存机制：隐形但高效的虚拟环境

不写 `venv` 是怎么装包的？

**全靠 uv 的缓存机制！**

*   uv 会根据 metadata + Python 版本生成哈希
*   在系统缓存目录创建虚拟环境
*   复用已有环境，**无需重复安装依赖**

* * *

### 6\. 对比传统开发体验

| 操作  | venv + pip | uv + PEP 723 |
| --- | --- | --- |
| 安装依赖 | 手动 pip install | 自动解析 + 安装 |
| 虚拟环境 | 手动创建 venv | 自动缓存，无需创建 |
| 文件结构 | 多个文件夹 `.venv/` 等 | 只有一个 .py 文件 |
| 运行速度 | 冷启动慢，重复安装 | 热启动快，复用缓存 |
| 清理难度 | 麻烦，要找路径手删 | `uv cache clean` 一键搞定 |

* * *

### 7\. 常用命令小抄

```

# 运行单文件（含 PEP 723 元数据）
uv run script.py

# 清理缓存
uv cache clean

# 扩展工具链
uvx ruff --fix .
uvx black .


```

* * *

### 8\. 结语：Python，也能优雅地“即写即跑”

你写了个小脚本，复制一段 rich、requests 的 demo，往往却要折腾一堆安装、配置。

而现在，**uv + PEP 723 让你回归“写代码”本身**：

*   没有虚拟环境污染
*   没有 requirements.txt
*   没有重复安装

**只用一个** `**.py**` **文件，就能拥有“现代脚本语言”的全部体验。**

用惯了你会发现：**Python，其实也可以“懒得很高级”。**
