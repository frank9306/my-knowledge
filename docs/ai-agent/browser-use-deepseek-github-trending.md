---
title: "🚀 使用 browser-use + DeepSeek 构建自动化 GitHub 日榜信息提取器"
source: "old-blog/技术分享/🚀 使用 browser-use + DeepSeek 构.md"
---

# 🚀 使用 browser-use + DeepSeek 构建自动化 GitHub 日榜信息提取器

在 AI Agent 场景中，如何让大模型**主动控制浏览器、调用本地函数、结合文件输入输出**？这篇文章将介绍我基于 [`browser-use`](https://github.com/openbmb/browser-use) 和 DeepSeek-LLM 构建的一个 Demo，用于：

*   打开 GitHub Trending 页面
*   读取本地 `source.txt` 中指定的日榜名次
*   提取该仓库的关键信息
*   最后保存到 `result.txt`

适合用作 AI Agent 项目的入门案例，也适合扩展为自动化信息抓取、写报告机器人等场景。

本示例旨在证明 `browser-use` 在输入和输出端 `MCP`场景的处理能力，并无实际业务考量。

## 🧱 技术栈

*   `browser-use`: 浏览器自动化控制框架
*   `langchain_deepseek`: DeepSeek-LLM 接入包
*   `Python asyncio`: 异步执行
*   `dotenv`: 环境变量加载

## 📦 项目结构简述

```

.
├── main.py             # 主执行文件
├── source.txt          # 用户指定的排名，比如“3”
├── result.txt          # 最终结果输出
├── .env                # 存放模型密钥等环境变量

```

## 📄 源码详解

### 1\. 引入核心模块并加载环境变量

```
import asyncio
import os

from browser_use.agent.service import Agent
from browser_use.browser.browser import Browser, BrowserConfig
from browser_use.controller.service import Controller
from dotenv import load_dotenv
from langchain_deepseek import ChatDeepSeek

load_dotenv()

```

### 2\. 初始化浏览器与控制器

```
browser = Browser(
    config=BrowserConfig(
        cdp_url=f"<http://127.0.0.1:13508>"  # Chrome 调试地址
    )
)

controller = Controller()


```

### 3\. 注册动作：读取文件中的排名

我们通过 `@controller.registry.action` 装饰器把该函数注册为“控制动作”，供 LLM 调用。

```
@controller.registry.action('从文件读取排名')
def read_rank_from_file(file_path: str) -> str:
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            rank = file.readline().strip()
            print(f"读取到的排名是：{rank}")
            return rank
    except FileNotFoundError:
        return "1"

```

### 4\. 注册动作：保存最终结果

```
@controller.registry.action('保存结果到指定文件')
def save_to_file(text: str, file_path: str):
    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(text)
    print(f"结果已保存到 {file_path}")


```

* * *

### 5\. 构造任务 Prompt

Prompt 要明确告诉模型要干的几件事：

*   打开 GitHub 日榜页面
*   从本地读取一个排名数字
*   获取对应的仓库信息
*   保存到文件中

```
_prompt = (
    "打开 链接：<https://github.com/OpenGithubs/github-daily-rank。>"
    "请从文件 'source.txt' 中读取一个排名（表示 github 日榜的排名），"
    "然后获取 github 日榜该排名的仓库信息，并将信息写入文件 'result.txt'。"
)

```

* * *

### 6\. 运行 Agent 主体

```
async def main():
    _llm = ChatDeepSeek(model="deepseek-chat")

    _agent = Agent(
        task=_prompt,
        llm=_llm,
        controller=controller,
        browser=browser
    )

    _result = await _agent.run()

if __name__ == "__main__":
    asyncio.run(main())


```

* * *

## 📄 示例输入

`source.txt`：

```

第三名

```

输入源内容可以只要表明意图即可

* * *

## 配置 .env

`.env`

```
DEEPSEEK_API_KEY="your deepseek api key"
Base_URL="<https://api.deepseek.com>"

```

* * *

## 完整代码示例

```
import asyncio
import os

from browser_use.agent.service import Agent
from browser_use.browser.browser import Browser, BrowserConfig
from browser_use.controller.service import Controller
from dotenv import load_dotenv
from langchain_deepseek import ChatDeepSeek

load_dotenv()

browser = Browser(
    config=BrowserConfig(
        cdp_url=f"<http://127.0.0.1:13508>")
)

controller = Controller()

@controller.registry.action('从文件读取排名')
def read_rank_from_file(file_path: str) -> str:
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            rank = file.readline().strip()
            print(f"读取到的排名是：{rank}")
            return rank
    except FileNotFoundError:
        return "1"  # 默认返回第1名，防止报错

@controller.registry.action('保存结果到指定文件')
def save_to_file(text: str, file_path: str):
    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(text)
    print(f"结果已保存到 {file_path}")

async def main():
    pass
    _prompt = (
        "打开 链接：<https://github.com/OpenGithubs/github-daily-rank>"
        "请从文件 'source.txt' 中读取一个排名（表示 github 日榜的排名），"
        "然后获取 github 日榜该排名的仓库信息，并将信息写入文件 'result.txt'。"
    )

    _llm = ChatDeepSeek(model="deepseek-chat")
    _agent = Agent(
        task=_prompt,
        llm=_llm,
        controller=controller,
        browser=browser
    )
    _result = await _agent.run()

if __name__ == "__main__":
    asyncio.run(main())


```

* * *

## 📝 运行结果示意

### 运行截图(action)：

1.  打开链接

![🚀 使用 browser-use + DeepSeek 构建自动化 GitHub 日榜信息提取器 image 1](/images/imported/browser-use-deepseek-github-trending/image-01.png)

1.  读取文件

![🚀 使用 browser-use + DeepSeek 构建自动化 GitHub 日榜信息提取器 image 2](/images/imported/browser-use-deepseek-github-trending/image-02.png)

1.  获取排名信息

![🚀 使用 browser-use + DeepSeek 构建自动化 GitHub 日榜信息提取器 image 3](/images/imported/browser-use-deepseek-github-trending/image-03.png)

1.  保存到文件

![🚀 使用 browser-use + DeepSeek 构建自动化 GitHub 日榜信息提取器 image 4](/images/imported/browser-use-deepseek-github-trending/image-04.png)

1.  任务完成

![🚀 使用 browser-use + DeepSeek 构建自动化 GitHub 日榜信息提取器 image 5](/images/imported/browser-use-deepseek-github-trending/image-05.png)

### 结果文件

运行后，程序将调用 DeepSeek LLM，控制浏览器自动访问 GitHub Trending 页面，并抓取第 3 个项目的信息保存到 `result.txt`，内容如下：

```
{"repository_information": {"rank": 3, "project_name": "aquasecurity/trivy", "repository_url": "<https://github.com/aquasecurity/trivy>", "total_stars": 26600, "daily_star_growth": 156, "weekly_star_growth": 374, "monthly_star_growth": 1176, "open_source_date": "2019-04-11", "description": "Find vulnerabilities, misconfigurations, secrets, SBOM in containers, Kubernetes, code repositories, clouds and more"

```

* * *

## 🔍 模型是怎么知道该调用哪个动作的？

它靠 `browser-use` 的 `Controller` 注册的动作来反射函数签名，使用 `inspect` 模块自动获取函数参数，比如：

```
def read_rank_from_file(file_path: str) -> str

```

大模型只需要判断出“我需要读取 source.txt”，然后 Controller 就能自动补参数并调用这个函数。无需手写复杂 DSL 或 API schema，非常轻量好用。

* * *

## 💡 可扩展方向

你可以很轻松地扩展其他能力，比如：

*   从多个源读取排名
*   把结果生成 Markdown 报告
*   自动提交到 GitHub Pages
*   和飞书/钉钉机器人联动汇报日报

* * *

## 🧠 总结

通过 `browser-use + DeepSeek`，我们实现了一个完全自动的「任务代理 + 浏览器控制 + 本地函数调用 + 文件处理」闭环。整个流程无需硬编码逻辑，全靠 Prompt + 注册函数，是真正的低代码/自然语言驱动 Agent 实践。
