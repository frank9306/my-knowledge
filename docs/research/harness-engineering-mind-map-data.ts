// Archived source data for later extraction; not imported by the website runtime.
export interface HarnessMindMapItem {
  name: string
  children?: HarnessMindMapItem[]
}

const pair = (problem: string, solution: string): HarnessMindMapItem => ({
  name: problem,
  children: [{ name: solution }]
})

export const harnessMindMapData: HarnessMindMapItem = {
  name: 'Harness 工程问题与解决办法',
  children: [
    {
      name: '目标与上下文',
      children: [
        pair('目标和完成标准模糊', '用 Spec、验收标准和停止条件绑定 Task Episode'),
        pair('Spec 混入未确认推断', '区分事实、假设、未知项和 out-of-scope'),
        pair('Ticket 过度拆分或横向分层', '用可验证的纵向 Tracer Bullet 拆分'),
        pair('依赖只写在正文里', '优先使用 Tracker 原生 blocking 关系'),
        pair('AGENTS.md 膨胀、冲突或过时', '根文件最小化，细节通过 Skills 渐进披露'),
        pair('隐藏的 Harness 上下文膨胀', '测量 payload，按任务启用工具和 MCP'),
        pair('长会话注意力退化', '单任务单会话，在自然阶段边界主动交接'),
        pair('跨 Session 失忆与 Handoff 污染', '持久交接文件中分开事实、假设和验证状态'),
        pair('仓库坏模式压过文字指令', '把质量要求固化为 lint、类型和结构门禁')
      ]
    },
    {
      name: '受控执行',
      children: [
        pair('一次修改跨度过大', '小型端到端切片，一次一个逻辑变更'),
        pair('先做简单项而回避高风险集成', '优先 Spike、架构和模块集成点'),
        pair('Tool result 太大、截断或静默失败', '检查退出码、截断和真实输出范围'),
        pair('环境变化后继续使用陈旧快照', '外部变更后显式重新读取文件与状态'),
        pair('工具太少或太多', '按任务提供最小、差异明确的工具集'),
        pair('MCP stdio 日志污染协议流', '日志写 stderr、文件或 protocol notification'),
        pair('MCP 多客户端共享全局状态', '按连接隔离状态，必要时外置持久存储'),
        pair('把部分能力说成完整宿主支持', '安装、资产、会话、输出和 Smoke 分别验证'),
        pair('帮助命令意外执行真实工作', 'Dispatcher 提前短路 --help/-h 并加 canary'),
        pair('同一 Checkout 并行 Agent 相互污染', '每任务独立 worktree，交付前复核 revision')
      ]
    },
    {
      name: '安全边界',
      children: [
        pair('权限过紧导致审批疲劳', '只读操作自动化，高风险操作保留门禁'),
        pair('权限过松扩大破坏面', '隔离环境、最小凭据、网络与预算上限'),
        pair('Sandbox 未保护 Git 与外部系统', '危险命令 Hook 加凭据和网络隔离'),
        pair('未经授权修改项目控制面', 'Protected surfaces 写入前要求精确授权'),
        pair('有写入能力但没有恢复证明', '验证 rollback、补偿、幂等重放和后置状态')
      ]
    },
    {
      name: '验证与评审',
      children: [
        pair('缺少快速可执行反馈回路', '接入类型、测试、Lint、Build 和 Hooks'),
        pair('Flaky check 导致错误修复', '控制时间、随机、动画、字体和数据顺序'),
        pair('机械重试且没有新假设', '每轮验证不同假设并设置轮次上限'),
        pair('Mock 全绿但不保留生产语义', '按验证声明选择环境并加入独立 Oracle'),
        pair('TDD 选择错误测试 Seam', '优先稳定公开接口，仅在系统边界 Mock'),
        pair('Bug 诊断没有确定性复现', '建立秒级、精确、无人值守的复现环'),
        pair('让编写者 Agent 自审', '使用新上下文 Reviewer，必要时更换模型'),
        pair('评审子代理结论直接当事实', 'Finding 必须绑定规则、Spec 和 diff hunk')
      ]
    },
    {
      name: '证据与度量',
      children: [
        pair('配置存在被当作任务中已使用', '区分 Present、Wired、Exercised、Outcome'),
        pair('缺失证据被当作 0 或通过', '明确 Missing、Unobserved、Partial、Blocked'),
        pair('报告不同位置使用不同数据源', '所有投影读取同一 Canonical Evidence'),
        pair('会话采集静默归零', '修正路径归一化并保留 bounded fallback warning'),
        pair('路径和时间接近被当成作者关系', '关系保存依据、置信度、解析器和评审状态'),
        pair('评分数字缺少经验校准', '先展示 evidence band，再建设校准语料')
      ]
    },
    {
      name: '长期改进',
      children: [
        pair('长期任务完成声明失效', '使用 freshness-aware completion contract'),
        pair('Memory、Spec、Context 和进度混用', '按执行、需求、决策和领域分别持久化'),
        pair('缺少持久 HarnessIssue', '候选→评审→Issue→干预→后续复验'),
        pair('缺少可比实验与 Eval Lab', '控制预算、重复试验、保留反例与混杂因素'),
        pair('缺少 Durable Loop Runtime', '统一 validate、run、resume、stop 和 verify'),
        pair('Host×OS 真实证据不足', '原生安装、升级、会话和报告全链 Smoke')
      ]
    }
  ]
}
