---
title: "使用 browser-use 进行数据爬取并保存到文件"
date: 2026-06-25
source: "old-blog/技术分享/使用 browser-use 进行数据爬取并保存到文件.md"
---

# 使用 browser-use 进行数据爬取并保存到文件

在这篇博客中，我们将介绍如何使用 `browser-use` 库进行数据爬取，并将抓取的数据保存到本地文件。我们将通过使用 `uv`来管理我们的依赖。`browser-use` 是一个强大的库，能够帮助我们与浏览器进行交互，抓取网页数据。

## 环境配置

首先，我们需要安装 `uv` 和其他必要的 Python 包。假设你已经安装了 `uv`，可以通过以下步骤进行依赖管理：

### 1\. 安装 `uv`

如果你还没有安装 `uv`，可以通过以下命令进行安装：

```
pip install uv

```

### 2\. 安装其他必要的依赖

接着使用 `uv` 安装其他所需的库：

```
uv install browser-use dotenv

```

然后，确保你在项目的根目录下创建一个 `.env` 文件来存储 API 密钥和其他配置：

```
DEEPSEEK_API_KEY=your_deepseek_api_key
Base_URL=http://your_base_url
Model=your_model

```

## 代码实现

### 1\. 导入所需库

我们需要导入相关的库并加载 `.env` 文件中的配置：

```
import asyncio
import os

from browser_use.agent.service import Agent
from browser_use.browser.browser import Browser, BrowserConfig
from browser_use.controller.service import Controller
from dotenv import load_dotenv
from langchain_deepseek import ChatDeepSeek

load_dotenv()

api_key = os.getenv('DEEPSEEK_API_KEY')
base_url = os.getenv('Base_URL')
model = os.getenv('Model')

```

### 2\. 配置浏览器

使用 `browser-use` 时，我们需要配置一个浏览器实例。以下代码将浏览器配置为连接到本地运行的浏览器服务：

```
browser = Browser(
    config=BrowserConfig(
        cdp_url=f"<http://127.0.0.1:2201>")
)

```

### 3\. 定义操作控制器

`Controller` 是 `browser-use` 中用于管理任务的组件。我们可以通过它来定义具体的动作(其实就是mcp中的tools，目前它的描述和参数是如何绑定的还没搞清楚)。例如，在本示例中，我们定义了一个将数据保存到文件的操作：

```
controller = Controller()

@controller.registry.action('保存结果到指定文件')
def save_to_file(text: str, file_path: str):
    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(text)
    print(f"结果已保存到 {file_path}")

```

### 4\. 定义主任务

在主任务中，我们设置要爬取的数据内容，以及如何与浏览器进行交互。目标是抓取 GitHub 日榜第一名仓库的信息，并将结果保存到 `result.txt` 文件：

```
async def main():
    _prompt = "获取github日榜第一名，并将仓库信息写入文件'result.txt'"
    _llm = ChatDeepSeek(
        model=model,
        api_key=api_key,
        base_url=base_url,
    )
    _agent = Agent(
        task=_prompt,
        llm=_llm,
        controller=controller,
        browser=browser
    )
    _result = await _agent.run()


```

### 5\. 启动程序

最后，我们需要启动程序并运行任务。使用 `asyncio.run()` 来启动异步任务：

```
if __name__ == "__main__":
    asyncio.run(main())

```

## 运行效果

当你运行这段代码时，`browser-use` 会启动一个浏览器实例并访问指定的网页，抓取 GitHub 日榜第一名的仓库信息。抓取的数据将通过控制器保存到 `result.txt` 文件中。

> 图片待补：image.png

> 图片待补：image.png

> 图片待补：image.png

**主要需要关注的就是执行的Action信息， 最后会输出总共花费的token数(还是挺多的)**

## 完整代码

```
import asyncio
import os

from browser_use.agent.service import Agent
from browser_use.browser.browser import Browser, BrowserConfig
from browser_use.controller.service import Controller
from dotenv import load_dotenv
from langchain_deepseek import ChatDeepSeek

load_dotenv()

api_key = os.getenv('DEEPSEEK_API_KEY')
base_url = os.getenv('Base_URL')
model = os.getenv('Model')

browser = Browser(
    config=BrowserConfig(
        cdp_url=f"<http://127.0.0.1:2201>")
)

controller = Controller()

@controller.registry.action('保存结果到指定文件')
def save_to_file(text: str, file_path: str):
    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(text)
    print(f"结果已保存到 {file_path}")

async def main():
    pass
    _prompt = "获取github日榜第一名，并将仓库信息写入文件'result.txt'"
    _llm = ChatDeepSeek(
        model=model,
        api_key=api_key,
        base_url=base_url,
    )
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

## 总结

在这篇博客中，我们展示了如何使用 `browser-use` 库进行数据爬取并保存到文件，备忘下，感觉这东西可玩性还是挺高的，只不过量起来之后还是不小的支出，个人用户可能不好负担起。
