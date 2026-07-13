---
title: "多Apollo Client在React中的实战踩坑记录"
date: 2026-06-25
source: "old-blog/技术分享/多Apollo Client在React中的实战踩坑记录.md"
---

# 多Apollo Client在React中的实战踩坑记录

最近在将项目改成 `react` 时遇到了一个问题，项目接口使用的是 `graphql` ,而且是两个接口地址，也就是说需要提供两个 `ApolloClient` 。

本文记录完整心路历程，希望能帮到以后看到这篇文章的你。

* * *

## 需求背景

假设我需要同时访问两个 GraphQL API：

*   [`https://countries.trevorblades.com/`](https://countries.trevorblades.com/)：国家信息接口
*   [`https://spacex-production.up.railway.app/`](https://spacex-production.up.railway.app/)：SpaceX 发射记录

目标是在 React 应用中优雅地同时使用这两个 Apollo Client，分别用来发起查询。

* * *

## ApolloProvider 使用

已知存在 以下使用方式，可以将 `apolloclient` 添加到 上下文中。

```
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'
import App from './App.jsx'

const client = new ApolloClient({
  uri: '<https://countries.trevorblades.com/>',
  cache: new InMemoryCache(),
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
)


```

就可以直接使用了。

```
import { gql, useQuery } from '@apollo/client'

const GET_COUNTRIES = gql`
  query GetCountries {
    countries {
      code
      name
    }
  }
`

function App() {
  const { loading, error, data } = useQuery(GET_COUNTRIES)
  return (
    <div style={{ padding: '1rem' }}>
      <h2>🌍 国家列表</h2>
      <ul>
        {data.countries.map((country) => (
          <li key={country.code}>
            {country.code} - {country.name}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App


```

但是这种方式只能将一个 `apolloclient` 添加到上下文中。

## 多个 ApolloClient

那么一个是这样添加的，那么多个呢？

### 1\. 定义一个可以传递多个 client 的Context

```
// src/contexts/ApolloClientsContext.js
import { createContext, useContext } from 'react';

// 创建一个 Context 对象
const ApolloClientsContext = createContext<any>(undefined);

// 导出一个自定义 Hook，方便在组件中使用
export const useApolloClients = () => {
  return useContext(ApolloClientsContext);
};

// 导出 Provider 组件
export const ApolloClientsProvider = ApolloClientsContext.Provider;


```

### 2\. 将多个client 注入到 Context中

```
// index.js 或 main.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import App from './App';
import { ApolloClientsProvider } from './contexts/ApolloClientsContext';

// 第一个 Client (例如: Trevor Blades Countries API)
const clientA = new ApolloClient({
  uri: '<https://countries.trevorblades.com/>',
  cache: new InMemoryCache(),
});

// 第二个 Client (例如: 一个不同的 SpaceX API)
const clientB = new ApolloClient({
  uri: '<https://spacex-production.up.railway.app/>', // 只是一个例子
  cache: new InMemoryCache(),
});

// 将两个 client 放入一个对象中
const clients = {
  countries: clientA,
  spacex: clientB,
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/*
      使用我们自己创建的 Provider，
      并将包含两个 client 的对象作为 value 传下去
    */}
    <ApolloClientsProvider value={clients}>
      <App />
    </ApolloClientsProvider>
  </React.StrictMode>
);

```

### 3\. 在Context 上下文中取出并使用

```
// src/components/MyComponent.js
import { gql, useQuery } from '@apollo/client';
import { useApolloClients } from '../contexts/ApolloClientsContext';

const GET_COUNTRY_DETAILS = gql`
  query GetCountry($code: ID!) {
    country(code: $code) {
      name
      emoji
    }
  }
`;

const GET_COMPANY_INFO = gql`
  query GetInfo {
    company {
      name
      summary
    }
  }
`;

function MyComponent() {
  // 获取包含所有 client 的对象
  const clients = useApolloClients();

  // 使用 countries client 发起请求
  const { data: countryData, loading: countryLoading } = useQuery(GET_COUNTRY_DETAILS, {
    variables: { code: 'US' },
    client: clients.countries, // <-- 在这里显式指定 client
  });

  // 使用 spacex client 发起请求
  const { data: companyData, loading: companyLoading } = useQuery(GET_COMPANY_INFO, {
    client: clients.spacex, // <-- 在这里显式指定 client
  });

  if (countryLoading || companyLoading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Country Info:</h2>
      <p>{countryData?.country.name} {countryData?.country.emoji}</p>

      <h2>SpaceX Info:</h2>
      <p>{companyData?.company.name}: {companyData?.company.summary}</p>
    </div>
  );
}

export default MyComponent;

```

### 4\. Error: Rendered more hooks than during the previous render.

一刷新报错了 `Error: Rendered more hooks than during the previous render.`

因为 React 要求 Hook **顺序必须严格一致**，不能因为条件语句跳过某个 `useState` / `useQuery` 等 Hook。 不能提前 return，必须保证每次渲染顺序和数量一致。

所以改成了如下：

```
// src/components/MyComponent.js
import { gql, useQuery } from '@apollo/client';
import { useApolloClients } from '../contexts/ApolloClientsContext';

const GET_COUNTRY_DETAILS = gql`
  query GetCountry($code: ID!) {
    country(code: $code) {
      name
      emoji
    }
  }
`;

const GET_COMPANY_INFO = gql`
  query GetInfo {
    company {
      name
      summary
    }
  }
`;

function MyComponent() {
  // 获取包含所有 client 的对象
  const clients = useApolloClients();

  // 使用 countries client 发起请求
  const { data: countryData, loading: countryLoading } = useQuery(GET_COUNTRY_DETAILS, {
    variables: { code: 'US' },
    client: clients.countries, // <-- 在这里显式指定 client
  });

  // 使用 spacex client 发起请求
  const { data: companyData, loading: companyLoading } = useQuery(GET_COMPANY_INFO, {
    client: clients.spacex, // <-- 在这里显式指定 client
  });

  const loading = countryLoading || companyLoading;

  return (
    <div className="p-2">
        {loading ? (
            <p>Loading...</p>
        ) : (
            <div>
                <h2>Country Info:</h2>
                <p className=' text-blue-700'>{countryData?.country.name} {countryData?.country.emoji}</p>

                <h2>SpaceX Info:</h2>
                <p className=' text-blue-700'>{companyData?.company.name}: {companyData?.company.summary}</p>
            </div>
        )}
    </div>

  );
}

export default MyComponent;

```

> 图片待补：image.png

这样就ok了。
