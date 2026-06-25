---
title: "React Flow"
source: "old-blog/技术分享/React Flow.md"
---

# React Flow

## 自定义

### 1\. 自定义节点

React Flow 的一个强大功能是创建自定义节点。这让你可以在节点内渲染任何你想要的内容。我们通常建议创建自己的自定义节点，而不是依赖内置节点。使用自定义节点，你可以添加任意数量的源和目标连接点——甚至可以嵌入表单输入、图表和其他交互元素。

> ## **实现自定义节点**
> 
> **要创建自定义节点，您只需要创建一个 React 组件。React Flow 会自动将其包裹在一个交互式容器中，该容器注入节点 ID、位置和数据等必要属性，并提供选择、拖动和连接手柄的功能。**

1.  **创建组件**  
    让我们通过创建一个名为 TextUpdaterNode 的自定义节点来深入探讨一个示例。为此，我们添加了一个带有变更处理程序的简单输入字段。
    
    ```
    export function TextUpdaterNode(props) {
      const onChange = useCallback((evt) => {
        console.log(evt.target.value);
      }, []);
     
      return (
        <div className="text-updater-node">
          <div>
            <label htmlFor="text">Text:</label>
            <input id="text" name="text" onChange={onChange} className="nodrag" />
          </div>
        </div>
      );
    }
    ```
2.  **初始化节点类型**
    
    您可以通过将新节点类型添加到 nodeTypes 属性中来向 React Flow 添加新的节点类型，如下所示。我们将 nodeTypes 定义在组件外部以防止重新渲染。
    
    ```
    const nodeTypes = {
      textUpdater: TextUpdaterNode,
    };
    ```
3.  **将节点类型传递给 React Flow**
    
    ```
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
    />
    ```
4.  **更新节点定义**
    
    ```
    const nodes = [
      {
        id: 'node-1',
        type: 'textUpdater',
        position: { x: 0, y: 0 },
        data: { value: 123 },
      },
    ];
    ```
5.  **包含自定义节点的流程**
    
    **将所有内容组合在一起并添加一些基本样式后，我们得到了一个将文本打印到控制台的自定义节点：**
    
    ```
    import { useState } from 'react';
    import { ReactFlow } from '@xyflow/react';
    import '@xyflow/react/dist/style.css';
    import TextUpdaterNode from './TextUpdaterNode';
    
    const rfStyle = {
      backgroundColor: '#B8CEFF',
    };
    
    const initialNodes = [
      {
        id: 'node-1',
        type: 'textUpdater',
        position: { x: 0, y: 0 },
        data: { value: 123 },
      },
    ];
    // we define the nodeTypes outside of the component to prevent re-renderings
    // you could also use useMemo inside the component
    const nodeTypes = { textUpdater: TextUpdaterNode };
    
    function Flow() {
      const [nodes, setNodes] = useState(initialNodes);
      const [edges, setEdges] = useState([]);
    
      return (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          style={rfStyle}
        />
      );
    }
    
    export default Flow;
    
    ```
