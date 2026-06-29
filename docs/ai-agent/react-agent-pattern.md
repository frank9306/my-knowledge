---
title: "智能体经典范式-ReAct"
date: 2026-06-25
source: "old-blog/技术分享/智能体经典范式-ReAct.md"
---

# 智能体经典范式-ReAct

本文来源：[hello-agents](https://datawhalechina.github.io/hello-agents/#/./chapter4/%E7%AC%AC%E5%9B%9B%E7%AB%A0%20%E6%99%BA%E8%83%BD%E4%BD%93%E7%BB%8F%E5%85%B8%E8%8C%83%E5%BC%8F%E6%9E%84%E5%BB%BA?id=_42-react)

ReAct由Shunyu Yao于2022年提出    其核心思想是模仿人类解决问题的方式，将推理 (Reasoning) 与行动 (Acting) 显式地结合起来，形成一个“思考-行动-观察”的循环。

ReAct的巧妙之处在于，它认识到思考与行动是相辅相成的。思考指导行动，而行动的结果又反过来修正思考。为此，ReAct范式通过一种特殊的提示工程来引导模型，使其每一步的输出都遵循一个固定的轨迹
