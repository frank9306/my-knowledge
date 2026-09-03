# Harness Engineering 思维导图数据归档

- Date: 2026-09-01
- Research question: 如何在撤销网页交互式思维导图后，完整保留其问题—解决办法数据供后续提取？
- Related Issues: [ISSUE-0018](../issues/ISSUE-0018-embed-an-interactive-harness-engineering-mind-map.md)
- Record status: archived dataset

## Conclusion

交互式思维导图的数据已从网站主题运行时代码中移出，并保存为独立 TypeScript 树形数据文件 [`harness-engineering-mind-map-data.ts`](./harness-engineering-mind-map-data.ts)。数据保留六个分类和 44 组问题—解决办法，可在后续任务中转换成 JSON、Markdown、XMind 或新的网页组件。[S1][S2]

## Source-supported findings

- 归档数据包含六个一级分类和 44 个问题节点，每个问题节点对应一个解决办法叶子节点。[S1]
- 用户要求撤销该思维导图在网页上的应用，同时保留数据供以后提取。[S2]

## Analysis and synthesis

TypeScript 文件保留了原始树结构和中文内容，同时不再被网站主题导入，因此可以作为后续格式转换的单一数据源，但不会增加当前网页运行时代码。

## Experiments and observations

- 2026-09-01：从 `docs/.vitepress/theme/` 移至 `docs/research/`，并通过源码引用检查和生产构建验证其不再参与网页渲染。

## Applicability and limitations

- 数据来源是本次已有的项目内思维导图数据，没有重新核验其最初研究材料。
- 当前归档格式是 TypeScript，不是 `.xmind` 文件；后续可按需要转换。

## Risks and alternatives

- 若后续内容发生修订，应直接更新归档数据并保留来源说明，避免网页组件与归档文件产生两份事实源。
- 可选格式包括 JSON、CSV、Markdown 和 XMind；当前未额外生成，以避免重复数据。

## Conflicts and open questions

None identified.

## Sources

- **S1** — 项目内原始数据：`docs/.vitepress/theme/harness-mind-map-data.ts`，创建于 ISSUE-0018 实施期间，访问日期 2026-09-01。限制：文件没有逐条记录 44 项内容的外部研究出处。
- **S2** — 用户指令，2026-09-01：撤销思维导图在网页上的应用，并保存数据供后续提取。

## Proposed downstream updates

### Architecture decisions

None identified.

### Issues

取消 ISSUE-0018，因为用户已明确撤销网页交互式思维导图目标。

### Domain context

None identified.
