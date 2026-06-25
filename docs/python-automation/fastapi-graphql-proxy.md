---
title: "使用 FastAPI 实现 GraphQL 代理：优雅地隐藏后端复杂性"
source: "old-blog/技术分享/使用 FastAPI 实现 GraphQL 代理：优雅地隐藏.md"
---

# 使用 FastAPI 实现 GraphQL 代理：优雅地隐藏后端复杂性

## 背景

在现代三层架构的项目开发中，我们经常面临一个经典的问题：如何优雅地管理前端与多个后端服务之间的通信？

我的项目架构如下：

*   **前端**：用户交互界面
*   **客户端**：中间层服务，负责业务逻辑和API聚合
*   **服务端**：核心数据服务，需要token认证

传统方案中，前端需要同时与客户端和服务端通信，这带来了几个问题：

1.  **认证复杂性**：前端需要管理多套认证机制
2.  **依赖耦合**：前端直接依赖服务端，增加了系统复杂度
3.  **维护困难**：当服务端接口变更时，需要同时修改前端和客户端

为了解决这些问题，我决定在客户端实现一个 GraphQL 代理层，让前端只需要与客户端通信，由客户端负责转发需要认证的请求到服务端。

## 解决方案设计

### 架构思路

```
前端 → 客户端 (GraphQL代理) → 服务端
     ↑                    ↑
   单一入口           携带token转发


```

核心思想是：

*   前端只与客户端通信，统一使用 GraphQL 接口
*   客户端根据请求类型决定本地处理还是代理转发
*   服务端的认证和复杂性完全对前端透明

### 技术选型

*   **FastAPI**：高性能的现代 Python Web 框架
*   **Strawberry GraphQL**：现代化的 Python GraphQL 库
*   **中间件机制**：实现透明的请求拦截和转发

## 实现详解

### 1\. 项目结构设置

```
from fastapi import FastAPI, Request, Response
from fastapi.responses import JSONResponse
import strawberry
from strawberry.fastapi import GraphQLRouter
import requests

# 配置远程服务信息
REMOTE_GRAPHQL_URL = "<http://127.0.0.1:8081/v1/graphql?time=1753866863712>"
REMOTE_TOKEN = "your-remote-token"
CUSTOM_HEADER = "X-Remote-GraphQL"


```

配置部分定义了：

*   远程服务的完整URL（包含查询参数）
*   认证token（实际项目中应该从环境变量读取）
*   自定义header作为代理触发条件

### 2\. 本地 GraphQL Schema 定义

```
@strawberry.type
class Query:
    @strawberry.field
    def local_hello(self) -> str:
        return "Hello from local server!"

schema = strawberry.Schema(Query)
graphql_app = GraphQLRouter(schema)


```

这部分定义了客户端自己的 GraphQL schema，用于处理不需要转发的本地查询。

### 3\. 核心代理中间件

```
@app.middleware("http")
async def graphql_proxy_middleware(request: Request, call_next):
    # 只处理 GraphQL 路由
    if request.url.path == "/graphql":
        # 检查是否需要代理到远程服务
        if request.headers.get(CUSTOM_HEADER):
            # 读取原始请求体
            body_bytes = await request.body()

            # 构建转发请求的 headers
            headers = {
                "Authorization": f"Bearer {REMOTE_TOKEN}",
                "Content-Type": "application/json",
            }

            try:
                # 转发请求到远程服务
                remote_resp = requests.post(
                    REMOTE_GRAPHQL_URL,
                    data=body_bytes,
                    headers=headers,
                )
                # 直接返回远程服务的响应
                return JSONResponse(
                    status_code=remote_resp.status_code,
                    content=remote_resp.json()
                )
            except Exception as e:
                return JSONResponse(
                    status_code=500,
                    content={"error": str(e)}
                )

    # 继续处理本地路由
    response = await call_next(request)
    return response


```

这是整个方案的核心，工作流程如下：

1.  **路径过滤**：只对 `/graphql` 路径生效
2.  **代理判断**：检查请求头中是否包含 `X-Remote-GraphQL`
3.  **请求转发**：
    *   读取原始请求体
    *   添加认证头
    *   转发到远程服务
    *   透传响应结果
4.  **本地处理**：如果不满足代理条件，继续本地 GraphQL 处理

### 4\. 应用启动

```
app = FastAPI()
app.include_router(graphql_app, prefix="/graphql")


```

注册 GraphQL 路由，完成应用配置。

## 使用方式

### 本地查询（客户端处理）

```
// 前端发起本地查询
const query = `
  query {
    local_hello
  }
`;

fetch('/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ query })
});


```

### 远程查询（代理转发）

```
// 前端发起需要转发的查询
const query = `
  query {
    remote_user_data {
      id
      name
    }
  }
`;

fetch('/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Remote-GraphQL': 'true',  // 触发代理
  },
  body: JSON.stringify({ query })
});


```

## 优势分析

### 1\. **简化前端逻辑**

*   前端只需要知道一个 GraphQL 端点
*   无需管理多套认证机制
*   统一的错误处理和响应格式

### 2\. **提高安全性**

*   服务端 token 完全隐藏在客户端
*   减少了前端的攻击面
*   集中化的权限控制

### 3\. **便于维护**

*   服务端接口变更时，只需要修改客户端
*   统一的API版本管理
*   更容易实现监控和日志记录

### 4\. **架构清晰**

*   明确的职责分离
*   降低系统耦合度
*   便于单元测试和集成测试

## 总结

通过 FastAPI 中间件实现 GraphQL 代理，我们成功地：

1.  **隐藏了后端复杂性**：前端无需感知服务端的存在
2.  **统一了接口管理**：所有 GraphQL 查询都通过一个端点
3.  **提升了安全性**：认证信息集中管理，不暴露给前端
4.  **简化了架构**：清晰的职责分离，便于维护和扩展
