---
title: "什么是对 AI 友好的代码结构"
date: 2026-08-31
description: "一次面向 AI 编程的代码结构实验：用窄接口封装复杂实现，让 Agent 更容易导航、修改和验证，同时重新理解人与 AI 对代码可读性的不同要求。"
---

# 什么是对 AI 友好的代码结构

最近我开始实验一种面向 AI 编程的代码结构：**深模块（Deep Modules）**。

它并不是一种专门为大模型发明的新架构。这个概念来自 John Ousterhout 的《A Philosophy of Software Design》，关注的是一个模块能否用较小的接口隐藏较多的实现复杂度。

Matt Pocock 在 [How To Make Codebases AI Agents Love](https://www.aihero.dev/how-to-make-codebases-ai-agents-love) 里把它放进了 AI 编程场景。按照他的思路，与其让 Agent 面对一张相互引用的文件网络，不如把系统整理成少数几个职责明确、接口受控、行为可测试的模块。

我想实验的正是这一点。过去整理代码时，我通常问：“人读起来是否清楚？”现在还要再问一句：

> 一个刚进入仓库、没有历史记忆、上下文有限的 Agent，能否只看目录、公共接口和测试，就判断应该改哪里、不能碰哪里，以及修改是否正确？

这两个问题并不矛盾，但它们对“清楚”的要求并不完全相同。

![机器人拿着代码地图，从依赖混乱的文件堆走向拥有公共入口和验证机制的模块化仓库](/images/ai-coding/deep-modules/cover.png)

*概念插画：对 AI 友好的代码结构，会把隐含关系变成明确入口、模块边界和验证反馈。*

## AI 每次进入仓库，都像一名没有团队记忆的新同事

长期维护项目的人会积累一张代码之外的地图。我们知道 `utils.ts` 里哪几个函数其实属于订单域，知道某个看起来通用的 Hook 只能被结算页调用，也知道修改用户模型时还要顺手更新一个没有显式关联的缓存键。

这些关系可能来自几个月前的讨论、代码审查留下的印象，或者一次线上故障带来的肌肉记忆。即使目录结构没有准确表达它们，人也能靠长期记忆补齐。

在我的实验里，我不能假定 AI Agent 拥有这份团队记忆。每次给它一个新任务，我都要把它当成从有限上下文开始的协作者。它需要搜索文件、跟踪 import、读取类型、推断调用关系，再通过测试或命令结果校正判断。

Anthropic 将上下文称为 Agent 的有限资源。OpenAI 在总结 Agent-first 仓库实践时也强调，应给 Agent 一张可导航的地图，而不是把整个系统说明塞进一份巨大的指令文件。

因此，代码库里的隐含关系会变成 Agent 每次执行任务都要重新支付的“理解税”。文件越分散、依赖越自由、验证入口越模糊，这笔税越高。

![人类开发者依靠长期记忆理解分组后的代码地图，AI Agent 则只能在仓库证据中检查大量相互连接的文件](/images/ai-coding/deep-modules/memory-map.png)

*概念插画：人可以用经验补齐隐含关系，AI 每次都需要从文件、接口和测试重新建立地图。*

## 深模块真正压缩的是认知接口

“深”容易被误解为文件很长、类很大，甚至是把代码重新堆回一个巨型模块。它真正描述的是**接口提供的能力与接口自身复杂度之间的比例**：外部只需要理解少量概念，模块内部却可以完成一段相对复杂的工作。

例如，一个视频发布功能可以对外只暴露：

```ts
export interface PublishVideoInput {
  source: string
  title: string
}

export interface PublishedVideo {
  id: string
  playbackUrl: string
}

export async function publishVideo(
  input: PublishVideoInput,
): Promise<PublishedVideo>
```

模块内部仍然可以包含格式检测、转码、缩略图生成、对象存储上传、数据库写入和失败补偿。关键不在于内部有多少文件，而在于外部调用者不需要分别理解并编排这些步骤，也不能绕过入口直接引用内部实现。

如果把这些步骤全部暴露出去，调用方可能要自己拼装流程：

```ts
import { inspectMedia } from '@/media/inspect-media'
import { transcodeVideo } from '@/media/transcode-video'
import { generateThumbnail } from '@/media/generate-thumbnail'
import { persistPublication } from '@/media/persist-publication'

const metadata = await inspectMedia(input.source)
const video = await transcodeVideo(input.source, metadata)
const thumbnail = await generateThumbnail(video)
const published = await persistPublication({ input, video, thumbnail })
```

在深模块结构里，我希望调用方只依赖一个能够表达业务意图的入口：

```ts
import { publishVideo } from '@/modules/video-publishing'

const published = await publishVideo({
  source: input.source,
  title: input.title,
})
```

前一种写法中的每个函数都很短，但调用方必须理解执行顺序、中间数据和失败处理。后一种写法没有消灭复杂度，而是把这些知识收回到拥有它们的模块里。

```text
video-publishing/
├─ index.ts                 # 公共契约
├─ publish-video.ts         # 流程编排
├─ internal/
│  ├─ inspect-media.ts
│  ├─ transcode-video.ts
│  ├─ generate-thumbnail.ts
│  └─ persist-publication.ts
└─ publish-video.test.ts    # 行为契约
```

这就是我理解的深模块：不是减少内部结构，而是限制外部需要同时理解的结构。

![机器人通过简单公共入口向深模块提交输入，模块内部包含复杂但有序的机制，最后产生稳定输出](/images/ai-coding/deep-modules/deep-module.png)

*概念插画：深模块保留内部实现深度，同时把外部认知接口收敛成稳定契约。*

## 为什么这种结构对 AI 更友好

### 1. 文件系统直接告诉它从哪里进入

当每个业务模块拥有独立目录和单一公共入口时，Agent 不必先读十几个调用方来猜测一组文件是否属于同一能力。目录名提供领域定位，`index.ts` 提供可用能力，输入输出类型说明交互契约。

这是一种渐进式披露：先看模块能做什么，任务确实涉及内部行为时，再继续向下读取实现。Agent 可以把宝贵的上下文留给当前问题，而不是被无关细节提前占满。

### 2. 它缩小了修改的搜索空间

浅模块网络常见的形态是：大量小函数分别暴露，各层都可以自由组合。人类开发者可能认为每个函数都很短、很好懂；Agent 面对的却是更多候选入口、更多 import 边和更多可能受影响的调用方。

所以我给深模块加了一条强约束：如果公共契约不变，修改就应该优先留在模块内部。这样一来，Agent 搜索、规划和审查的范围会随之收窄，我也更容易控制它误改相邻功能的风险。

这并不表示 AI 从此只改一个文件，而是让多文件修改发生在一个可命名、可测试的边界之内。

![浅模块工作台暴露大量控制点和连线，深模块工作台只开放一个必要入口并把复杂机制封装在内部](/images/ai-coding/deep-modules/shallow-vs-deep.png)

*概念插画：文件和函数分别很小，不代表整个系统向调用者暴露的认知接口也很小。*

### 3. 测试把“我觉得改对了”变成机械反馈

仅有封装还不够。一个无法快速验证的深模块，只是把风险藏进了盒子里。

我真正想建立的组合是：**窄公共接口 + 锁定行为的测试 + 简单明确的验证命令**。Agent 修改内部实现后，可以立即运行模块测试，获得来自真实代码执行的反馈。

Anthropic 对 Agent 工作流的描述也强调，Agent 需要从工具调用和代码执行中持续取得 ground truth，以判断自己是否取得进展。

在我的判断里，测试不是为了证明内部代码“写得漂亮”，而是为了守住边界承诺：相同输入是否仍得到约定输出，失败是否以约定方式暴露，副作用是否被限制在允许范围内。

### 4. 人可以把注意力集中在最昂贵的决定上

当行为契约稳定、反馈足够可靠时，我不必逐行接管 AI 生成的所有实现细节。我仍然会检查安全、性能、数据兼容和异常处理，但日常关注点可以更多地放在：模块应该负责什么、接口是否泄露内部概念、两个领域是否被错误耦合。

换句话说，人负责设计“关口”，AI 可以在关口以内完成更多实现工作，测试负责持续检查它有没有越界。

## 它与传统人类编程方式有什么不同

严格来说，我并不认为深模块与“人类编程”对立。它本来就是一项长期存在的软件设计原则，优秀的人类团队同样受益。对我来说，真正发生变化的是：我开始把**陌生 Agent 的可导航性**当作一等架构指标。

| 关注点 | 我过去更熟悉的团队维护方式 | 我正在实验的深模块方式 |
| --- | --- | --- |
| 系统地图 | 可以部分存在于成员记忆、评审历史和口头约定中 | 必须尽量由目录、接口、类型和测试显式表达 |
| 可读性 | 常强调单个函数短小、局部代码易读 | 还强调跨文件搜索空间小、模块入口唯一 |
| 复用 | 容易把内部小工具提升为全局公共能力 | 默认把实现留在模块内部，确认稳定复用后再公开 |
| 依赖 | 熟悉项目的人可以凭经验识别“虽然能引用，但不该引用” | 用导出规则和机械检查阻止不合法依赖 |
| 验证 | 人可以结合经验进行探索性检查和跨页面联调 | 优先提供快速、确定、可重复执行的反馈入口 |
| 交接 | 新成员偶尔入场，团队记忆相对连续 | Agent 可能一天启动很多次，每次都近似重新入场 |

过去组织代码时，我也容易把“拆得足够小”视为可维护性的直接证据。小函数当然有价值，但如果我把每个小函数都变成公共接口，调用者就必须理解它们的顺序、组合条件和失败语义。局部看起来更简单，系统整体反而可能更浅、更宽。

对人类来说，这种成本有时会被 IDE 跳转、代码熟悉度和团队惯例掩盖；对 AI 来说，它会直接表现为更多搜索、更多上下文、更长计划和更高的误判机会。

## 从浅模块网络迁移到深模块，我会怎么做

我不会一开始就重构整个仓库。模块边界需要从真实变化中验证，而不是先画一张漂亮的架构图再强迫代码服从。

![从选择稳定业务边界、收敛公共入口、隐藏内部实现到测试行为契约的渐进迁移路径](/images/ai-coding/deep-modules/migration-loop.png)

*概念插画：我会从一个稳定业务能力开始迁移，让变化逐渐停留在模块内部。*

第一步是选择一个经常独立变化、拥有明确业务语言、已经有测试或容易补测试的能力。例如“发布视频”，而不是含义模糊的“媒体工具”。

第二步是盘点外部真正需要的操作和数据，把它们收敛成公共接口。这里应该警惕把数据库模型、第三方 SDK 类型或内部状态机直接泄漏出去，因为这些细节一旦进入接口，模块就失去了隐藏变化的能力。

第三步是把实现文件移入模块边界，禁止外部深层引用：

```ts
// 推荐：通过公共入口使用能力
import { publishVideo } from '@/modules/video-publishing'

// 避免：绕过边界依赖内部步骤
import { transcodeVideo } from '@/modules/video-publishing/internal/transcode-video'
```

第四步是围绕公共行为建立快速测试，并给 Agent 一条确定命令，例如：

```bash
pnpm test modules/video-publishing
```

最后再观察一段时间：需求变化是否主要停留在模块内部？接口是否稳定？测试能否发现真实回归？如果每次改动都必须穿透边界，问题可能不是 Agent 能力不够，而是模块划分错了。

我会用下面这份清单控制迁移范围：

- [ ] 先选择一个能够用业务语言准确命名的能力；
- [ ] 记录外部调用者真正需要的输入、输出和失败语义；
- [ ] 建立单一公共入口，并禁止外部深层引用内部文件；
- [ ] 把流程编排和第三方实现细节移回模块内部；
- [ ] 为公共行为提供一条快速、确定的测试命令；
- [ ] 用后续需求验证边界，而不是一次性重写整个仓库。

## 深模块也有边界

我不会把深模块理解成“模块越大越好”。如果我让一个目录同时负责用户、订单、支付和通知，它不会因为只有一个入口就自动变成好设计。一个难以命名、行为互不相关的巨型模块，仍然会制造高认知负担。

我也不会因此永远禁止复用。真正稳定、语义一致的能力当然可以上升为共享模块；但在我的实验里，“复制了两次”并不足以证明它应该立刻成为全局抽象。过早公开会扩大接口面，也会让未来的 Agent 把一个局部实现误认为全局契约。

还有一个更现实的限制：测试只能保护被表达出来的行为。权限、性能、并发、数据迁移或外部服务失败如果没有进入测试与验证环境，接口再漂亮也不能提供保证。因此，深模块降低的是理解和修改的范围，不是软件工程本身的风险。

## 这场实验真正要验证什么

我并不准备通过“AI 写得更快了”来判断实验成功。速度受到模型、任务大小和熟悉度影响，单次感受很容易失真。

我更想观察几个具体信号：

- Agent 第一次搜索后，能否准确找到公共入口；
- 一次内部需求是否主要修改单个模块；
- 计划中是否减少了无关文件和猜测性改动；
- 模块测试能否在完整构建之前快速暴露错误；
- 人工审查是否能更多聚焦于接口、风险和行为，而不是替 Agent 拼回整个调用链；
- 同类任务重复执行时，结果是否更稳定。

如果这些信号持续改善，说明代码库不只是“允许 AI 写代码”，而是在结构上为一种没有长期记忆、依靠有限上下文和反馈循环工作的协作者提供支持。

这也是深模块最吸引我的地方：它没有要求我们发明一套只对 AI 有效的怪异架构。它只是迫使代码库把过去可以藏在人脑里的边界、地图和验证方式，更诚实地写出来。

## 参考资料

- [Matt Pocock：How To Make Codebases AI Agents Love](https://www.aihero.dev/how-to-make-codebases-ai-agents-love)
- [John Ousterhout：A Philosophy of Software Design](https://web.stanford.edu/~ouster/cgi-bin/aposd.php)
- [Anthropic：Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [Anthropic：Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- [OpenAI：Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/)
