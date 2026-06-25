---
title: "用 JavaScript 快速定位页面滚动容器"
source: "old-blog/心情随笔/用 JavaScript 快速定位页面滚动容器.md"
---

# 用 JavaScript 快速定位页面滚动容器

在做前端自动化或者调试页面滚动时，经常会遇到一个问题：

页面上有滚动条，但它不一定是 `window` 自己滚动，可能是某个内部容器（`div`）在滚动。

如果想用 JS 控制滚动，就得先**找出哪个元素是真正的滚动容器**。

### 原理

一个元素如果能滚动，必须同时满足：

1.  `**overflow-y**` 样式是 `auto` 或 `scroll`
2.  它的 `**scrollHeight > clientHeight**`（内容高度大于可视高度）

### 代码实现

```
function findScrollContainers(root = document.body) {
  const containers = [];
  const nodes = root.querySelectorAll('*');
  nodes.forEach(node => {
    const style = getComputedStyle(node);
    if (style.overflowY === 'scroll' || style.overflowY === 'auto') {
      if (node.scrollHeight > node.clientHeight) {
        containers.push(node);
      }
    }
  });
  return containers;
}

const scrollables = findScrollContainers();
console.log(scrollables);


```

### 用法

1.  打开浏览器控制台
2.  粘贴上面的函数
3.  查看输出的 `scrollables` 数组
    *   数组里的每个元素都是可滚动容器
    *   可以用 `scrollables[0].scrollTop += 100` 来滚动

### 小贴士

*   如果页面里嵌套了多个滚动区域（比如邮件列表、聊天窗口），这段代码能一次找全。
*   对 SPA 应用（如 Gmail、Notion）尤其好用，因为它们经常隐藏了真实滚动容器。
