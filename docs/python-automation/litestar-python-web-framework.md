---
title: "快速上手 Litestar：高性能 Python Web 框架实战"
date: 2026-06-25
source: "old-blog/技术分享/快速上手 Litestar：高性能 Python Web 框.md"
---

# 快速上手 Litestar：高性能 Python Web 框架实战

在 Python Web 框架中，FastAPI、Flask 和 Django 是开发者熟知的选择，而 **Litestar**（前身 Starlite）作为一款现代化 Web 框架，兼具高性能、类型安全和插件化特性，非常适合构建结构化 API 服务。本文将带你快速了解 Litestar，并用实战示例讲解如何搭建用户认证 API。

* * *

## **什么是 Litestar？**

Litestar 是一个 **现代、类型安全、高性能的 Python Web 框架**，主要特点包括：

*   **高性能**：基于 Starlette + uvicorn，天然支持异步。
*   **类型安全**：充分利用 Python 的 `typing` 与 Pydantic 数据验证。
*   **插件化**：内置插件系统，可快速集成数据库、缓存、认证等功能。
*   **依赖注入（DI）**：支持全局和局部依赖注入，使路由函数更简洁。
*   **自动文档**：内置 OpenAPI 支持，自动生成 Swagger / ReDoc。

Litestar 的设计目标是：在保证高性能的前提下，让大型 API 服务的结构更清晰、更易维护。

* * *

## **快速入门**

### **安装 Litestar**

```
pip install litestar[standard]

```

### **Hello World 示例**

```
from litestar import Litestar, get

@get("/")
def hello() -> dict:
    return {"message": "Hello, Litestar!"}

app = Litestar(route_handlers=[hello])

```

运行：

```
uvicorn main:app --reload

```

访问 [http://127.0.0.1:8000](http://127.0.0.1:8000) 即可看到：

```
{"message": "Hello, Litestar!"}

```

Swagger 文档默认生成在：

```
<http://127.0.0.1:8000/schema/swagger>

```

* * *

## **核心特性讲解**

### **1\. 路由与 HTTP 方法**

Litestar 提供 `@get`, `@post`, `@put`, `@delete` 等装饰器，支持路径参数、查询参数和请求体。

```
from pydantic import BaseModel
from litestar import post

class User(BaseModel):
    name: str
    age: int

@post("/users")
def create_user(data: User) -> dict:
    return {"status": "success", "user": data.dict()}

```

* * *

### **2\. 依赖注入（DI）**

Litestar 的 DI 系统允许你在全局或路由级别注入依赖：

```
def get_db_connection() -> dict:
    return {"db": "connected"}

@get("/")
def index(db=get_db_connection) -> dict:
    return {"status": db["db"]}


```

全局依赖注册：

```
app = Litestar(route_handlers=[index], dependencies={"db": get_db_connection})

```

* * *

### **3\. 插件系统**

官方提供多种插件，如 SQLAlchemy、Tortoise ORM 等：

```
from litestar.plugins.sql_alchemy import SQLAlchemyPlugin, SQLAlchemyConfig
from models import Base

sqlalchemy_config = SQLAlchemyConfig(connection_string="sqlite:///test.db", create_all=True, metadata=Base.metadata)
plugin = SQLAlchemyPlugin(config=sqlalchemy_config)

app = Litestar(route_handlers=[...], plugins=[plugin])

```

插件可以自动注入数据库会话、管理生命周期，简化代码。

* * *

### **4\. 生命周期钩子**

Litestar 支持 app 启动和关闭钩子：

```
async def on_startup():
    print("App starting...")

async def on_shutdown():
    print("App shutting down")

app = Litestar(route_handlers=[...], on_startup=[on_startup], on_shutdown=[on_shutdown])

```

* * *

## **实战示例：用户注册与 JWT 登录**

### **1\. 数据库模型**

```
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)

```

### **2\. JWT 认证依赖**

```
from litestar.params import Header
from litestar.exceptions import HTTPException
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from models import User

SECRET_KEY = "mysecret"
ALGORITHM = "HS256"

def get_current_user(authorization: str = Header(...), db_session: Session = None) -> User:
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid Authorization header")
    token = authorization[len("Bearer "):]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db_session.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

```

### **3\. 路由实现**

```
from litestar import Litestar, post, get
from litestar.params import Body
from sqlalchemy.orm import Session
from passlib.hash import bcrypt
from jose import jwt
from db import sqlalchemy_plugin
from models import User
from auth import get_current_user

@post("/register")
def register(data: dict = Body(...), db_session: Session = None):
    hashed_pw = bcrypt.hash(data["password"])
    user = User(username=data["username"], hashed_password=hashed_pw)
    db_session.add(user)
    db_session.commit()
    return {"message": "User created"}

@post("/login")
def login(data: dict = Body(...), db_session: Session = None):
    user = db_session.query(User).filter(User.username == data["username"]).first()
    if not user or not bcrypt.verify(data["password"], user.hashed_password):
        return {"error": "Invalid credentials"}
    token = jwt.encode({"sub": user.username}, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": token}

@get("/me")
def get_me(current_user: User = get_current_user):
    return {"username": current_user.username}

app = Litestar(route_handlers=[register, login, get_me], plugins=[sqlalchemy_plugin])

```

### **4\. 测试流程**

1.  注册用户：`POST /register`
2.  登录获取 JWT：`POST /login`
3.  带 token 访问用户信息：`GET /me`（Authorization: Bearer <token>）

* * *

## **总结**

Litestar 结合了 **FastAPI 的高性能 + 强类型 + DI + 插件化**，非常适合企业级 API 开发。

特点回顾：

*   高性能异步支持
*   类型安全与自动验证
*   插件化数据库和认证
*   生命周期管理与依赖注入
*   内置 Swagger / ReDoc 文档生成

> 对比 FastAPI、Flask、Django，Litestar 更加关注 结构化 API 服务与可扩展性，尤其适合中大型项目。

通过本文示例，你已经掌握了 Litestar 的核心用法，能快速搭建带 JWT 认证的用户管理 API。
