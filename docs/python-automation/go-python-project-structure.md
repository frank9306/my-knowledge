---
title: "重拾秩序：Go 与 Python 项目的标准结构实践指南"
source: "old-blog/技术分享/重拾秩序：Go 与 Python 项目的标准结构实践指南.md"
---

# 重拾秩序：Go 与 Python 项目的标准结构实践指南

在过往的开发过程中，我常常因为项目时间紧张或者尝试快速迭代，忽略了代码项目的结构设计，导致项目一旦扩展或重构，便陷入“修一处，崩三层”的困境。目录层级混乱、模块边界不清、测试难以组织，这些看似“以后再说”的问题，最终却成为技术债中最顽固的一类。

近期在复盘多个代码仓库后，我决定从源头做起，给每个新项目一个清晰、可维护、可扩展的结构。以下是我整理并落地实践的 Go 与 Python 项目标准结构，既符合社区最佳实践，也具备实际生产适用性。

* * *

## Go 项目标准结构

[project-layout/README\_zh.md at master · golang-standards/project-layout](https://github.com/golang-standards/project-layout/blob/master/README_zh.md)

Go 的结构设计强调清晰的模块边界和工具导向的组织方式。以下是推荐的目录布局：

```

your_project/
├── cmd/                # 各个主程序的入口（如 CLI 或服务）
│   └── yourapp/
│       └── main.go
├── internal/           # 项目内部模块，外部不可 import
│   ├── service/
│   ├── handler/
│   └── ...
├── pkg/                # 可供外部依赖的包
│   └── logger/
├── api/                # 接口协议定义，如 Protobuf、OpenAPI
│   └── v1/
├── configs/            # 配置文件目录（yaml/json/toml）
├── scripts/            # 自动化脚本，如构建或工具初始化
├── deployments/        # Dockerfile、Kubernetes、Helm 等部署相关
├── test/               # 集中管理的集成测试或模拟环境
├── go.mod
├── go.sum
└── README.md


```

### 核心思想：

*   `cmd/` 分离主程序入口，可支持多个子程序， ~~**注意统计目录下不能存在多个main包**~~；
*   `internal/` 限定包作用域，约束模块间访问；
*   `pkg/` 对外开放，可供其他项目使用；
*   `api/` 为接口协议做统一管理，便于协作；
*   `configs/` 和 `scripts/` 解耦部署和运行逻辑。

* * *

## Python 项目标准结构

在 Python 项目中，结构混乱的现象更加普遍。通过采用 `src` 布局、统一依赖管理工具，可以有效控制复杂度。

```

your_project/
├── src/                  # 主源代码目录
│   └── your_project/     # 实际包名
│       ├── __init__.py
│       ├── core/         # 核心业务逻辑
│       ├── services/     # 各类服务层
│       ├── models/       # 数据结构、ORM 或 Pydantic 模型
│       └── utils/        # 工具类函数
├── tests/                # 测试目录
│   └── test_core.py
├── scripts/              # 各类工具脚本
├── pyproject.toml        # 项目配置（推荐使用 uv 或 poetry 管理）
├── requirements.txt      # 可选，与 pyproject.toml 二选一
├── .env                  # 环境变量文件
├── .gitignore
└── README.md


```

### 推荐配置：

*   使用 `src` 布局避免路径污染，增强隔离性；
*   用 `pyproject.toml` 管理构建与依赖（支持 uv/poetry/pdm）；
*   模块粒度尽量保持职责单一，便于测试和重构。

* * *

## 总结：结构即承诺

项目结构不仅仅是目录的摆放问题，更是一种 **组织原则的体现**。它决定了团队协作的效率、后期维护的成本，也影响着代码质量的上限。

无论是 Go 的“工具即主程序”哲学，还是 Python 的“模块即逻辑单位”惯例，最终都要落实在一套 **清晰、规范、一致** 的结构之上。把结构设计作为项目启动的第一步，不是一种形式主义，而是一种对代码未来的尊重。
