---
title: "React Flow 学习笔记（一）"
source: "old-blog/技术分享/React Flow 学习笔记（一）.md"
---

# React Flow 学习笔记（一）

[ReactFlow官方教程](https://reactflow.dev/learn)

## **1.创建流程**

### 1.1 **添加导入**

**首先，我们需要从 @xyflow/react 包中导入一些基本组件以及** **React Flow 运行所需的 css 样式表****：**

```
import { ReactFlow, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
```

### 1.2 **渲染 ReactFlow**

**现在我们创建一个 React 组件，用于渲染我们的流程图。****父容器的宽度和高度是必需的****，因为 React Flow 使用这些尺寸。**

```
export default function App() {
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <ReactFlow>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
```

### 1.3 **空流程**

**就这样！你已经创建了你的第一个空流程 🎉**

<figure class="image"><img style="aspect-ratio:877/226;" src="React Flow 学习笔记（一）_image.png" width="877" height="226"></figure>

## 2\. **添加节点**

### 2.1 创建节点

**在你的 React 组件外部，创建一个节点对象数组。每个节点对象需要一个唯一的 id 和 position 。让我们也给它们添加一个标签：**

```
const initialNodes = [
  {
    id: 'n1',
    position: { x: 0, y: 0 },
    data: { label: 'Node 1' },
    type: 'input',
  },
  {
    id: 'n2',
    position: { x: 100, y: 100 },
    data: { label: 'Node 2' },
  },
];
```

### 2.2 **将节点添加到流程中**

**现在我们可以使用 nodes 属性将我们的 initialNodes 数组传递给 <ReactFlow /> 组件：**

```
<ReactFlow nodes={initialNodes}>
  <Background />
  <Controls />
</ReactFlow>
```

### 2.3 **带有节点的流程**

<figure class="image"><img style="aspect-ratio:869/217;" src="2_React Flow 学习笔记（一）_image.png" width="869" height="217"></figure>

## 3. **添加边**

**现在我们有了两个节点，让我们用一条边将它们连接起来。**

### 3.1 **创建一条边**

**要创建一条边，我们定义一个边对象数组。每个边对象都需要有一个 id ，一个 source （边开始的位置），和一个 target （边结束的位置）。在这个例子中，我们使用我们之前创建的两个节点的 id 值（ n1 和 n2 ）来定义这条边：**

```
const initialEdges = [
  {
    id: 'n1-n2',
    source: 'n1',
    target: 'n2',
  },
];
```

这条边连接了节点 id: 'n1' （源节点）和节点 id: 'n2' （目标节点）。

<figure class="image"><img style="aspect-ratio:869/209;" src="1_React Flow 学习笔记（一）_image.png" width="869" height="209"></figure>

### 3.2 **标记边**

**让我们给这个边添加两个 React Flow 内置的属性，一个 label 和一个 type: "step" 。**

```
const initialEdges = [
  {
    id: 'n1-n2',
    source: 'n1',
    target: 'n2',
    type: 'step',
    label: 'connects with',
  },
];
```

### 3.3 **为流程添加边**

**现在我们可以使用 edges 属性将我们的 initialEdges 数组传递给 <ReactFlow /> 组件：**

```
<ReactFlow nodes={initialNodes} edges={initialEdges}>
  <Background />
  <Controls />
</ReactFlow>
```

### 3.4 **基础流程**

**你已经完成了一个包含节点和边的简单流程！🎉**

<figure class="image"><img style="aspect-ratio:869/223;" src="3_React Flow 学习笔记（一）_image.png" width="869" height="223"></figure>

## 4.**完整代码示例**

**App.jsx**

```
import { ReactFlow, Controls, Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes = [
  {
    id: 'n1',
    data: { label: 'Node 1' },
    position: { x: 0, y: 0 },
    type: 'input',
  },
  {
    id: 'n2',
    data: { label: 'Node 2' },
    position: { x: 100, y: 100 },
  },
];
const initialEdges = [
  { id: 'n1-n2', source: 'n1', target: 'n2', label: 'connects with', type: 'step' },
];

export default function App() {
  return (
    <div style={{ height: '100%' }}>
      <ReactFlow nodes={initialNodes} edges={initialEdges} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}



```

* * *

## 添加交互性

* * *

现在我们已经构建了第一个流程，让我们添加\*交互性，以便你可以选择、拖动和删除节点和边。

### **1.处理变更事件**

默认情况下，React Flow 除了处理视口之外不会管理任何内部状态更新。与 HTML <input /> 元素一样，你需要将事件处理器传递给 React Flow，以便将触发的变更应用到你的节点和边。

#### 1.1  **添加导入**

**为了管理变更，我们将使用 useState 以及 React Flow 提供的两个辅助函数： applyNodeChanges 和 applyEdgeChanges 。那么让我们导入这些函数：**

```
import { useState, useCallback } from 'react';
import { ReactFlow, applyEdgeChanges, applyNodeChanges } from '@xyflow/react';
```

#### 1.2 **定义节点和边**

**我们需要定义初始节点和边。这些将成为我们流程的起点。**

```
const initialNodes = [
  {
    id: 'n1',
    position: { x: 0, y: 0 },
    data: { label: 'Node 1' },
    type: 'input',
  },
  {
    id: 'n2',
    position: { x: 100, y: 100 },
    data: { label: 'Node 2' },
  },
];
 
const initialEdges = [
  {
    id: 'n1-n2',
    source: 'n1',
    target: 'n2',
  },
];
```

#### 1.3 **初始化状态**

**在我们的组件中，我们将调用 useState 钩子来管理我们的节点和边状态：**

```
export default function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
 
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <ReactFlow>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
```

#### 1.4 **添加事件处理器**

**我们需要创建两个事件处理器： onNodesChange 和 onEdgesChange 。它们将在发生变化时（如拖动或删除元素）用于更新节点和边的状态。onConnect 处理器会在两个节点之间建立新连接时被调用。我们可以使用 addEdge 实用函数来创建新的边并更新边数组。现在，请将这些处理器添加到您的组件中：**

```
const onNodesChange = useCallback(
  (changes) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
  [],
);
const onEdgesChange = useCallback(
  (changes) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
  [],
);
const onConnect = useCallback(
  (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
  [],
);
```

#### 1.5 **将它们传递给 ReactFlow**

**现在我们可以将我们的节点、边和事件处理器传递给 <ReactFlow /> 组件：**

```
<ReactFlow
  nodes={nodes}
  edges={edges}
  onNodesChange={onNodesChange}
  onEdgesChange={onEdgesChange}
  onConnect={onConnect}
  fitView
>
  <Background />
  <Controls />
</ReactFlow>
```

### 2\. 完整代码

```
import { useState, useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes = [
  {
    id: 'n1',
    data: { label: 'Node 1' },
    position: { x: 0, y: 0 },
    type: 'input',
  },
  {
    id: 'n2',
    data: { label: 'Node 2' },
    position: { x: 100, y: 100 },
  },
];

const initialEdges = [];

function Flow() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  return (
    <div style={{ height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default Flow;

```

* * *

* * *

## 视口

### 1.**平移和缩放**

React Flow 的默认平移和缩放行为受滑块地图启发。您通过拖动指针来平移，通过滚动来缩放。您可以通过 <ReactFlow /> 组件上的交互和键盘属性轻松自定义此行为。

### 2.**视口配置**

**在这里，我们将列出并解释其他工具使用的一些配置。**

#### 2.1 **默认视口控制**

*   `pan`: 指针拖拽
*   `zoom`:指针捏合或滚动
*   `select`: shift+指针拖拽

* * *

* * *

## 内置组件

React Flow 提供了几个内置组件，可以作为子组件传递给 <ReactFlow /> 组件

*   MiniMap： MiniMap 提供了流程图的鸟瞰视图，使导航更轻松，特别是对于较大的流程。您可以通过提供 nodeColor 函数来自定义缩略图中节点的外观。

```
import { ReactFlow, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { defaultNodes } from './nodes';
import { defaultEdges } from './edges';

const nodeColor = (node) => {
  switch (node.type) {
    case 'input':
      return '#6ede87';
    case 'output':
      return '#6865A5';
    default:
      return '#ff0072';
  }
};

function Flow() {
  return (
    <ReactFlow defaultNodes={defaultNodes} defaultEdges={defaultEdges} fitView>
      <MiniMap nodeColor={nodeColor} nodeStrokeWidth={3} zoomable pannable />
    </ReactFlow>
  );
}

export default Flow;

```

*   Controls

React Flow 提供了一套可自定义的 Controls 用于视口。您可以放大和缩小、适应视口，并切换用户是否可以移动、选择和编辑节点。

```
import { ReactFlow, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { defaultNodes } from './nodes';
import { defaultEdges } from './edges';

function Flow() {
  return (
    <ReactFlow defaultNodes={defaultNodes} defaultEdges={defaultEdges} fitView>
      <Controls />
    </ReactFlow>
  );
}

export default Flow;

```

*   Background

Background 组件为您的流程图添加了可视网格图案，帮助用户保持方向。您可以选择不同的图案变体，或者如果您需要更高级的自定义，可以探索源代码来实现自己的图案。

```
import { useState } from 'react';
import { ReactFlow, Background, Panel } from '@xyflow/react';

import '@xyflow/react/dist/style.css';

import { defaultNodes } from './nodes';
import { defaultEdges } from './edges';

function Flow() {
  const [variant, setVariant] = useState('cross');

  return (
    <ReactFlow defaultNodes={defaultNodes} defaultEdges={defaultEdges} fitView>
      <Background color="skyblue" variant={variant} />
      <Panel>
        <div>variant:</div>
        <button onClick={() => setVariant('dots')}>dots</button>
        <button onClick={() => setVariant('lines')}>lines</button>
        <button onClick={() => setVariant('cross')}>cross</button>
      </Panel>
    </ReactFlow>
  );
}

export default Flow;



```

*   Panel: Panel 组件允许您向流程图添加固定的覆盖层，非常适合标题、控件或任何其他应保持静止的 UI 元素。
    
    ```
    import { ReactFlow, Background, Panel } from '@xyflow/react';
    import '@xyflow/react/dist/style.css';
    
    const nodes = [
      {
        id: '1',
        data: { label: 'this is an example flow for the <Panel /> component' },
        position: { x: 0, y: 0 },
      },
    ];
    
    function Flow() {
      return (
        <ReactFlow nodes={nodes} fitView>
          <Panel position="top-left">top-left</Panel>
          <Panel position="top-center">top-center</Panel>
          <Panel position="top-right">top-right</Panel>
          <Panel position="bottom-left">bottom-left</Panel>
          <Panel position="bottom-center">bottom-center</Panel>
          <Panel position="bottom-right">bottom-right</Panel>
          <Panel position="center-left">center-left</Panel>
          <Panel position="center-right">center-right</Panel>
          <Background variant="cross" />
        </ReactFlow>
      );
    }
    
    export default Flow;
    
    
    
    
    ```
