---
title: "🚀 从 Pipenv 切换到 uv：一键上手现代 Python 依赖管理"
date: 2026-06-25
source: "old-blog/心情随笔/🚀 从 Pipenv 切换到 uv：一键上手现代 Pyth.md"
---

# 🚀 从 Pipenv 切换到 uv：一键上手现代 Python 依赖管理

你有没有被 `Pipenv` 折磨过？

虚拟环境藏在系统路径下，每次换个 shell 都要重新找路径，`Pipfile.lock` 还动不动冲突，简直糟心。

有一天我终于受够了，决定投奔更现代更清爽的工具 —— [`uv`](https://github.com/astral-sh/uv)。

这篇文章就来**记录我从 Pipenv 切换到 uv 的完整过程**，包括导出 `requirements.txt`，再用 `uv` 正确导入依赖的全过程。以后你也想迁移项目，一看就懂。

* * *

### 🔧 1. 安装 uv

先上命令

```
pip install u


```

装好后你应该能看到版本：

```
uv --version

```

* * *

### 🧹 2. 从 Pipenv 导出 requirements.txt

这一步**非常关键**，是把原来用 `Pipenv` 安装的依赖全部导出来：

```
pipenv requirements > requirements.txt

```

这会从你的 `Pipfile.lock` 里解析出准确依赖，写入 `requirements.txt`。

⚠️ 注意：不要用 `pip freeze`，那是导当前虚拟环境中所有依赖的，可能不准确。

* * *

### 🧽 3. 清理旧的 Pipenv 文件

如果你已经准备好完全拥抱 `uv`，建议顺手把旧文件干掉，免得混淆：

```

rm -f Pipfile Pipfile.lock


```

* * *

### 📦 4. 用 uv 添加依赖

这一步是灵魂！

```
uv add -r requirements.txt


```

uv 会：

*   自动创建本地 `.venv` 环境
*   安装 `requirements.txt` 里的所有依赖
*   创建 `uv.lock` 文件管理版本

* * *

### 🧪 5. 验证虚拟环境

确认 uv 正确生成虚拟环境：

```

uv venv


```

你会看到 `.venv/` 目录已经出现在项目里，非常清爽。

激活方式也跟常规 venv 一样：

```

source .venv/bin/activate     # Linux/macOS
.venv\\Scripts\\activate.bat    # Windows


```

* * *

### 📎 6. 项目结构一览

```
csharp
CopyEdit
my-project/
├── .venv/          # 本地虚拟环境
├── uv.lock         # 锁文件
├── requirements.txt
|—— pyproject.toml # 项目文件
├── ...


```

告别隐形虚拟环境、诡异路径和奇怪锁文件，回归清晰简洁。
