---
title: "基于 LangGraph 构建的聊天机器人"
date: 2026-06-25
source: "old-blog/技术分享/基于 LangGraph 构建的聊天机器人.md"
---

# 基于 LangGraph 构建的聊天机器人

在 AI 应用大爆炸的时代，各种AI应用层出不穷，所以赶紧学习下langChain，langGraph这些东西，做一个自己的AI应用岂不美哉。

## 💡 为什么选 LangGraph？

LangGraph 是基于状态图（State Graph）思想构建的语言模型执行框架，支持多节点执行、上下文流转、记忆管理等高级功能，非常适合构建对话代理、工具链调用、数据智能处理等 AI 应用。

* * *

## 🧱 项目特点

*   🧠 使用 LangGraph 构建状态机，自动管理消息流转
*   💾 支持对话记忆：使用 `MemorySaver` 自动追踪上下文
*   💬 CLI 对话体验，轻量灵活
*   🌍 支持代理接入第三方 GPT服务端点（如 Zetatechs）

* * *

## 📦 环境准备

安装依赖：

```
pip install langgraph langchain python-dotenv

```

创建 `.env` 文件或在运行时输入：

```

LANGSMITH_TRACING=true
LANGSMITH_API_KEY=lsv2_sk_
LANGSMITH_PROJECT=default
OPENAI_API_KEY=sk-

```

* * *

## 📁 文件结构概览

```

langgraph_chatbot/
│
├── .env             # 存放 API 密钥
└── main.py          # 主程序


```

* * *

## 🔧 主程序解析

### 1\. 初始化模型与环境变量

```

import getpass, os
from dotenv import load_dotenv
from langchain.chat_models import init_chat_model

load_dotenv()
if not os.environ.get("OPENAI_API_KEY"):
    os.environ["OPENAI_API_KEY"] = getpass.getpass("Enter API key for OpenAI: ")

model = init_chat_model(
    "gpt-4o-mini",
    model_provider="openai",
    base_url="<https://api.zetatechs.com/v1>"
)


```

使用 `init_chat_model` 创建模型实例，支持自定义 Base URL，方便代理接入。

* * *

### 2\. 定义 LangGraph 状态图

```

from langgraph.graph import START, MessagesState, StateGraph

workflow = StateGraph(state_schema=MessagesState)

def call_model(state: MessagesState):
    response = model.invoke(state["messages"])
    return {"messages": response}

workflow.add_node("model", call_model)
workflow.add_edge(START, "model")


```

*   `MessagesState` 作为状态定义，自动处理消息收发
*   将模型调用包装为图节点 `call_model`
*   通过 `add_edge` 建立执行流程

* * *

### 3\. 接入对话记忆系统

```
python
复制编辑
from langgraph.checkpoint.memory import MemorySaver

memory = MemorySaver()
app = workflow.compile(checkpointer=memory)


```

`MemorySaver` 让聊天记录像存档一样被保存下来，支持跨轮对话记忆。

* * *

### 4\. 启动聊天循环

```

from langchain_core.messages import HumanMessage

config = {"configurable": {"thread_id": "abc123"}}

while True:
    try:
        user_input = input("You: ")
        if user_input.lower() in ["exit", "quit"]:
            print("Exiting...")
            break
        output = app.invoke({"messages": [HumanMessage(content=user_input)]}, config)
        print("Bot: ", output["messages"][-1].content)
    except Exception as e:
        print("Error: ", e)
        break


```

控制台对话逻辑，`thread_id` 代表对话上下文的唯一标识 —— 换 ID 就是开启新话题。

* * *

## 🧪 示例效果

![基于 LangGraph 构建的聊天机器人 image 1](/images/imported/langgraph-chatbot/image-01.png)

是不是感觉到有点“聪明”？这就是 LangGraph 的 `MemorySaver` 起了作用！

* * *

## ✅ 总结

这只是 LangGraph 强大能力的冰山一角。在这个示例中，我们实现了一个：

*   状态图驱动的模型调用流程
*   支持记忆功能的聊天机器人
*   可自定义、可扩展、可嵌入其他模块的 AI 交互体

## 📌 下一步你可以干什么？

*   加入工具节点（如搜索、代码运行器、数据查询器）
*   构建多路径逻辑（分支、循环、条件判断）
*   接入 Web UI、语音模块、数据库插件等
