---
title: "深入理解 LlamaIndex：基于 Notion 文档的智能问答系统实战"
date: 2026-06-25
source: "old-blog/技术分享/深入理解 LlamaIndex：基于 Notion 文档的智.md"
---

# 深入理解 LlamaIndex：基于 Notion 文档的智能问答系统实战

在人工智能日益融入开发者工具链的今天，我最初计划使用 LangChain 构建一个基于文档的智能问答系统。LangChain 作为一个强大的框架，能够将大型语言模型（LLMs）与各种数据源和应用场景连接起来，看起来是个不错的选择。

然而，在深入研究和实践过程中，我发现了 LlamaIndex（前身为 GPT Index）这个更为专注于知识检索和问答的框架。LlamaIndex 在处理文档索引、构建知识库以及生成上下文相关回答方面，提供了更为精细和直观的工具。尤其是对于我这个需要基于 Notion 文档构建智能问答系统的场景，LlamaIndex 提供了更加无缝的集成体验。

本文将分享我从 LangChain 转向 LlamaIndex 的经历，以及如何利用 LlamaIndex 构建一个能够理解、检索并回答 Notion 文档内容的智能问答系统。无论你是 AI 开发新手，还是寻找更高效文档处理方案的资深开发者，希望这篇实战分享能给你带来一些启发。

## 什么是 LlamaIndex？

LlamaIndex（原名 GPT Index）是一个开源框架，帮你把各种格式的文档变成结构化的索引，方便大语言模型（LLM）用更少的上下文轻松理解和回答问题。简单说就是：帮你把大海捞针变成小池塘钓鱼。

官网：[https://www.llamaindex.ai/](https://www.llamaindex.ai/)

* * *

## 我们的目标

*   从 Notion 加载文档（不限深度递归）
*   用 HuggingFace 的嵌入模型做向量化
*   自定义 DeepSeek LLM 做问答
*   持久化索引，方便下次直接用

* * *

## 项目结构及代码说明

### 1\. 环境准备

```

pip install llama-index notion-client python-dotenv requests

```

并且你需要在 `.env` 文件里配置：

```

NOTION_TOKEN=你的Notion集成Token
NOTION_PAGE_ID=你的Notion页面ID
DEEPSEEK_API_KEY=你的DeepSeek API密钥

```

`llama_index` 默认是使用openai的，但是没买，顺便也看下如何自定义模型。另外`NOTION_TOKEN` 和 `NOTION_PAGE_ID` 获取就不在赘述。

* * *

### 2\. Notion 文档加载工具（`notion_loader.py`）

负责递归抓取 Notion 页面及子页面文本，返回 `List[Document]`。

```

import os
from notion_client import Client
from llama_index.core.schema import Document
from dotenv import load_dotenv
from typing import List

load_dotenv()

notion = Client(auth=os.getenv("NOTION_TOKEN"))

def load_notion_all_docs(page_id: str) -> List[Document]:
    docs = []

    def recurse_blocks(block_id: str):
        children = notion.blocks.children.list(block_id).get("results", [])
        texts = []

        for block in children:
            b_type = block["type"]

            if b_type in ["paragraph", "heading_1", "heading_2", "heading_3"]:
                rich_text = block[b_type].get("rich_text", [])
                if rich_text:
                    texts.append("".join([t.get("plain_text", "") for t in rich_text]))
            elif b_type == "child_page":
                child_page_id = block["id"]
                docs.extend(load_notion_all_docs(child_page_id))
            # 你还可以根据需求扩展处理代码块、引用块等

        if texts:
            docs.append(Document(text="\\n".join(texts), metadata={"source": block_id}))

    recurse_blocks(page_id)
    return docs


```

* * *

### 3\. DeepSeek 自定义 LLM 适配器（`deepseek_llm.py`）

实现了 `CustomLLM`，对接 DeepSeek API，支持同步和流式返回。

```

from typing import Any, Generator
import json
import requests
from pydantic import Field
from llama_index.core.llms import CustomLLM, CompletionResponse, CompletionResponseGen, LLMMetadata
from llama_index.core.llms.callbacks import llm_completion_callback

class DeepSeekLLM(CustomLLM):
    api_key: str = Field(...)
    api_base: str = Field(default="<https://api.deepseek.com/v1>")
    model_name: str = Field(default="deepseek-chat")
    temperature: float = Field(default=0.7)
    max_tokens: int = Field(default=1024)

    @property
    def metadata(self) -> LLMMetadata:
        return LLMMetadata(
            context_window=8192,
            num_output=self.max_tokens,
            model_name=self.model_name,
        )

    def _request(self, prompt: str, stream: bool = False):
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        body = {
            "model": self.model_name,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": self.temperature,
            "max_tokens": self.max_tokens,
            "stream": stream,
        }
        res = requests.post(
            f"{self.api_base}/chat/completions",
            headers=headers,
            json=body,
            stream=stream,
            timeout=60,
        )
        res.raise_for_status()
        return res

    @llm_completion_callback()
    def complete(self, prompt: str, **kwargs: Any) -> CompletionResponse:
        res = self._request(prompt, stream=False)
        data = res.json()
        message = data["choices"][0]["message"]["content"]
        return CompletionResponse(text=message)

    @llm_completion_callback()
    def stream_complete(self, prompt: str, **kwargs: Any) -> CompletionResponseGen:
        res = self._request(prompt, stream=True)
        partial = ""
        for line in res.iter_lines(decode_unicode=True):
            if line.startswith("data: "):
                line = line[len("data: "):]
            if line.strip() == "[DONE]":
                break
            try:
                data = json.loads(line)
                delta = data["choices"][0]["delta"].get("content", "")
                partial += delta
                yield CompletionResponse(text=partial, delta=delta)
            except Exception:
                continue


```

* * *

### 4\. 主程序（`main.py`）

完整流程：加载 Notion 文档，构建索引，持久化，循环问答。

```

import os
from dotenv import load_dotenv
from llama_index.core import StorageContext, VectorStoreIndex, Settings
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from deepseek_llm import DeepSeekLLM
from notion_loader import load_notion_all_docs

load_dotenv()

page_id = os.getenv("NOTION_PAGE_ID")
deepseek_api_key = os.getenv("DEEPSEEK_API_KEY")

# 配置 LLM 和嵌入模型
Settings.llm = DeepSeekLLM(api_key=deepseek_api_key)
Settings.embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-small-en-v1.5")

def ask(index, query: str):
    engine = index.as_query_engine(llm=Settings.llm)
    return engine.query(query)

if __name__ == "__main__":
    print("📄 开始加载 Notion 文档...")
    docs = load_notion_all_docs(page_id)
    print(f"📄 加载文档完成，文档数量：{len(docs)}")

    print("🔍 开始构建索引...")
    index = VectorStoreIndex.from_documents(docs)
    index.storage_context.persist(persist_dir="storage")
    print("✅ 索引构建完成并持久化")

    while True:
        q = input("🔍 请输入问题（输入 exit 或 quit 退出）：")
        if q.strip().lower() in ["exit", "quit"]:
            break
        answer = ask(index, q)
        print("💬 回答：", answer)


```

* * *

## 示例测试数据

为了验证我们的问答系统效果，用GPT Mock了两段内容，我们在 Notion 中创建了两个子页面，内容如下（以下是示意内容节选）：

### 子页面一：

```

李雷的爸爸叫张三，妈妈叫王芳，姐姐叫李梅。
韩梅梅的男朋友是李雷。
张三是一名建筑工程师，毕业于清华大学土木工程系。
王芳是一位医生，曾在北京协和医院工作十年。

王小明出生于2000年5月4日，是一名程序员，擅长Python和Go语言。
王小明在2023年加入了字节跳动，担任后端开发工程师。

大白是一只三岁的萨摩耶犬，它的主人是韩梅梅。
韩梅梅家住在北京市朝阳区幸福路88号。


```

### 子页面二：

```

《微积分入门》是由陈建华教授编写的一本数学教材，适用于大一学生。
《现代操作系统》是由 Andrew S. Tanenbaum 编写的，被广泛用于计算机专业课程。

百度是由李彦宏于2000年创建的，总部位于北京市海淀区。
阿里巴巴的创始人是马云，成立于1999年，总部位于杭州。

地球是太阳系中的第三颗行星，平均距离太阳约为1.5亿公里。
水的化学式是H₂O，常温下为无色无味液体。

林晓是一名UI设计师，毕业于中国美术学院，目前在腾讯工作，负责微信的界面设计。
林晓的表哥叫赵强，是一位网络安全专家，在阿里云任职。

赵强的妻子是李娜，曾在华为工作，现在是独立安全顾问。
李娜和林晓在2022年共同参与了一个关于“用户隐私保护”的研究项目。

林晓的男朋友叫陈宇，是一名前端工程师，精通Vue和React。
陈宇在2021年从网易跳槽到了美团，目前居住在上海浦东新区。

陈宇和赵强在一次黑客马拉松比赛中认识，当时他们的队伍获得了一等奖。

赵强的父亲赵云，是一位退休军人，曾服役于广州军区。
赵云非常喜欢书法，经常在社区活动中心教老人写毛笔字。

林晓的宠物是一只英短猫，名字叫“灰灰”，今年两岁，最喜欢吃冻干鸡肉。


```

* * *

## 测试效果

> 图片待补：image.png

* * *

## 总结

*   LlamaIndex 让复杂文档结构变得简单
*   Notion 文档用递归方式采集，结构清晰
*   DeepSeek LLM 适配接口灵活，能用自定义模型
*   向量索引结合嵌入模型，大幅提升问答质量
*   持久化索引避免重复构建，提高效率

* * *
