---
id: ISSUE-0039
title: "Rewrite Paperclip article around Windows-native Franks Team"
status: done
priority: medium
created: 2026-11-03
updated: 2026-11-03
closed: 2026-11-03
related_adrs: []
depends_on: []
---

# ISSUE-0039: Rewrite Paperclip article around Windows-native Franks Team

## Problem

旧文不能代表当前Windows原生三岗团队及两个MCP的实际结果。

## Desired outcome

保持原URL，基于真实FT-v1实施和交付证据完整重写图文，独立验证后交主人接受。

## Acceptance criteria

- [x] 保持docs/blog/paperclip-codex-weixin-agent-company.md原URL/slug，完整重写当前Windows原生三岗实战，历史七岗/WSL/Docker/关闭保护注明历史日期，未验证微信不当现状，不新增接入。
- [x] 当前组织、Codex/模型、Skills版本、MCP、并发/唯一写入权有真实来源；流程约定与OS隔离分开；文章真实父子派工、产物读取、QA/返修和负责人交接如实叙述，组织自检不充当文章交付。
- [x] 图片覆盖真实组织/汇报关系、项目与任务、UI或预览截图、精确架构及交付/返修解释图、封面知识卡。截图经两个MCP真实采集逐张脱敏，原图私存。不得伪造成功界面。
- [x] 按DESIGN.md/write-articles制作成品PNG，知识卡默认1600×900；中文/标签/箭头可控排版，AI底图无最终中文字；准确alt/图注/来源；水印knowledge.webfrank.top · Frank的知识库已获主人确认。
- [x] 保留原始date，按格式同步title/description/updated/cover/social，标题变化同步README，不加入推荐阅读。
- [x] 最新package.json规定的pnpm docs:build及串联检查、check_draft.py、图片规格/链接检查记录实际退出码；纯文章不增加无意义测试。
- [x] QA独立审查和行为验收分别交付，常见桌面及约390px手机真实浏览器验证无图404/新增横向溢出，表格代码可读，有尺寸截图；无未解决P0/P1。
- [x] 所有检查对应最终文件指纹，返修后重验受影响路径；同问题最多两轮自动返修随业务父任务与本Issue保存，不因换会话重置。
- [x] check-delivery核对差异、来源、证据、预览、恢复与接续；交主人接受。修改完成、人工接受、提交推送、线上发布分别记录，未执行明确写未执行。

## Out of scope

无暂存/提交/推送/分支/PR/合并/发布授权；不覆盖用户工作，不查询或改旧公司/归栈，不新增微信消费者/改路由，不改认证/权限/数据库/远程访问，不新增付费。

## Decisions

FT-v1来源主人2026-11-03实施交接第9–11节及FRA-1监督留言be4eb5e6-e195-4a34-ad61-30e9a05a266c。预算沿现有订阅。负责人维护需求和写入权、开发执笔配图、QA独立审查/验收；单岗1、双执行槽、项目serialize、桌面浏览器全局串行。水印已确认覆盖原文待确认状态。

## Implementation notes

准备阶段，未修改文章。Paperclip业务父任务：FRA-4。FRA-1仅组织自检通过。负责人本次仅持Issue/索引准备写入权，保存后释放；开发尚未获源码写入权。下一父任务核对目标文章、DESIGN、package.json/部署、来源与用户差异，明确冻结基线/就绪条件后派开发。保持proposed不冒充ready。恢复仅撤销本轮精确差异，保护后续用户修改，不整库回滚或删除历史。

### 2026-11-03 — 就绪与实施接续（编码纠正）

依据主人 FT-v1 交接第9–11节及 FRA-4 有效派工记录，负责人已完成 ready 核查并释放写入权。开发为本轮唯一业务写入者，UI 串行阶段同时交开发。七项准备基线和 SHA256 私存；不是全树备份。当前 DESIGN 优先于过时 Brain 视觉描述。

授权范围：目标文章、新增同主题配图、必要来源证据、本 Issue/索引及 README 生成区。保留现有工作树，禁止改首页、主题、测试、其他 Issue、DESIGN 和依赖。无 Git 暂存、提交、分支、PR、推送、发布。文章与精确图片计划稳定后制作成品。水印已确认。自动返修 0/2；开发交出后由负责人冻结并安排独立 QA，不自行关闭业务 Issue。

本段替换已损坏问号文本；来源：FRA-4 就绪派工与 2026-11-03 08:29Z 监督接续记录，不将损坏内容作为契约。纯文章复用 VitePress Markdown/静态资源契约，不生成业务模块或行为测试；通过图片、链接、构建与真实页面验证。

## Verification

开发自检（2026-11-03，独立 QA 待负责人派工）：

- pnpm docs:build：最终图文输入 exit 0，串联 readme:sync、design:lint、home:scene-check 均通过。首次沙箱 spawn EPERM；单次命令审批后长路径 esbuild ENOENT；同一二进制扩展路径版本探针 exit 0，设置仅进程 ESBUILD_BINARY_PATH 后完成构建。未修改依赖或全局保护设置。早期缺预览 PNG 的构建失败保留；成品后重跑通过。
- check_draft.py 原文 exit 1：5 条长度提示对应 frontmatter（2条）及3张完整表格（各1条），无正文长句、套话或占位提示。逐项人工复核；移除元信息与表格的辅助正文副本 exit 0，不覆盖原始 exit 1。
- check_image_specs.py：3张知识卡 exit 0，均1600×900。另3张真实截图保留适合比例，6张PNG签名、尺寸和链接检查通过；知识卡已按原尺寸与750px宽查看。
- 静态来源/图片/元信息/泄漏/写入范围检查 exit 0：6个图片文件存在，4个外链HTTP 200，封面/social一致，原date保留。package.json、DESIGN、首页相对准备基线无变化，preflight所覆盖既有文件无越界变更。
- 真实 Playwright MCP：构建预览1440×900与390×844，6图均200；页面scrollWidth=clientWidth（桌面1425／手机375），图片、表格、代码均在视口内；保留各尺寸顶部、表格、代码截图。开发自检不是独立QA。
- 真实 Windows-MCP：ControlStatus、目标窗口切换和区域截图；首次采错当前任务聊天未发布，重采文章页面并裁去标签/地址，原图私存。工具窗口摘要为空，不能据回执证明完整窗口元数据。中间ai状态是工具控制归属，不是已证实主人接管；严格ready脚本停止一次后重新观察。
- Windows合成文本输入、逐字读回与恢复尚未验收，按父任务qa-supplement留待QA获得UI后执行。独立审查、独立行为验收、check-delivery、主人接受、提交推送发布均未执行。

完整日志、来源清单、最终SHA256、相对七项准备基线的逐行差异、预览和恢复说明在本任务私有交接包。所有失败保留，不把首次失败重写成通过。

## Activity log

### 2026-11-03 — Created

Issue created from the supplied project input.

### 2026-11-03 — Status changed from proposed to ready.

### 2026-11-03 — Status changed from ready to in-progress.

### 2026-11-03 — Status changed from in-progress to done.

## Completion summary

### 2026-11-03 — 最终完成摘要（当前）

主人已于2026-11-03T09:53:08.751Z通过human_only确认卡96f2ce81-51d8-4a56-a967-2728958262a3真实接受固定文章交付；该卡绑定原验收报告revision 61361c9e-ed17-4f58-91f2-6145c3cb0b54。本地Issue当前done，全部验收项已勾选，索引与2026-11 Changelog已同步。接受与发布分离，未暂存、提交、分支、PR、推送或发布。

最终独立QA：[review](/FRA/issues/FRA-6#document-review) revision 11b05315-2b4d-46b3-aaf8-de9a6209d6a8；[qa](/FRA/issues/FRA-6#document-qa) revision f722d945-1902-435d-a76b-7965e00e4012。P2-WM-01（水印颜色）与P2-TIME-01（叙述时序）均经独立复验首轮关闭，各1/2；没有未解决P0/P1/P2。负责人已完成[最终交付核查](/FRA/issues/FRA-4#document-delivery-check)，接受后补记版本为19fa6daf-8c34-4a5e-8935-76fe09032f10。文章SHA256保持536e96a7f815180c3b3de7886287dae86afc025c5905c401a16f866c007ced3c，六图未改。

来源：上述确认卡及报告版本；主人/监督2026-11-03评论064dcbbb-642d-4505-a518-50eedecc357f；原接受记录c7b94d43-a5ff-4d89-b40a-fe34dde8c7b2。下列开发与修复记录均为历史阶段证据，其中“待QA/负责人/主人接受”“in-progress”“0/2”只描述当时状态，不代表当前状态。

### 2026-11-03 — 历史：开发首次交出摘要（非当前状态）

开发图文成品已完成，保持原slug和2026-10-29发布日期，updated=2026-11-03。新增六张PNG：AI辅助封面、架构/交付程序图、真实组织/项目/Windows预览截图；README生成区同步标题。Readiness局部编码损坏已据有效派工修复并UTF-8读回。

本地Issue保持in-progress；验收清单不替QA或主人勾选。下一接收者负责人：实际读取开发交接包，冻结文章/PNG/共享页面输入后派QA，分别取得独立审查和行为验收（含Windows输入读回恢复），再check-delivery并交主人接受。自动返修仍0/2。开发交出后停止业务写入与UI；最终QA后若补写结果必须重新冻结和复验。无Git暂存、提交、分支、PR、推送或发布。

### 2026-11-03 — 开发实现与自检交出

正文和六图成品已保存；详细通过、失败、未验证如上。未关闭本Issue，未写月度完成Changelog。唯一写入权与UI阶段交回负责人安排后续。

### 2026-11-03 — 中断恢复与最终封面接收

依据主人63873ce4交付，已原样复制cover-composed-v1.png为公开封面，SHA256=048914d4fee11be685c7b4ce45389011fd903ce7362392af22593a72a07e1bb4。旧开发重排版本不再交付；图片计划与来源已更新，AI辅助图注正确。全尺寸和750宽已查看，整组水印KaiTi/18px/500/0.65/右下位置一致。

最终封面输入：pnpm docs:build exit0（build-adopted-cover-approved.log；此前沙箱spawn EPERM exit1保留）；三张知识卡规格exit0；check_draft.py exit1仍为上述五条元信息/表格提示。真实Playwright MCP重新检查1440×900与390×844，六图加载且无页面横向溢出，最终封面HTTP200、2460896字节。静态本地图片/元信息/泄漏/写入范围通过；外链复查Paperclip200，三个GitHub链接连接超时，不能沿用早期200冒充本次通过。

最终交接包：私有tmp/FRA-5/delivery.md、final-sha256.json、baseline-diff.patch及来源/日志。中断恢复未修改首页、主题、测试、依赖或DESIGN。自动返修0/2。停止业务写入及UI，交负责人读取指纹并安排独立QA；QA后结果叙述仍须交回原开发任务按真实结果更新、重建重冻和复验。主人接受、Git操作及发布均未执行。

### 2026-11-03 — 首轮QA后收口与监督P2-WM-01第1轮修复

来源：FRA-4负责人822a7a44派工；已实际读取FRA-6 review revision56e344a1、qa revisionf10cc008。两报告针对旧冻结版判断P0/P1/P2=0；监督另发现水印颜色不一致，不能记为QA发现或整体无缺陷。P2-WM-01第1轮：其余五张图SVG水印#667481改为封面#5278a3，opacity0.65/weight500/文字及截图内容不变；执行后1/2，不重置。按真实首轮QA及Windows安全临时textarea输入、双路逐字读回、清空读回和关闭标签结果收口，未泛化所有原生应用。最终复验及check-delivery待执行。旧日志/指纹保留；本次验证另存repair1产物。

本轮最终验证：pnpm docs:build exit0（repair1-build-approved.log，沙箱内exit1另存）；三知识卡规格exit0；check_draft exit1仍五条元信息/整表提示（更新状态表287字符）。六图PNG及来源/本地链接/范围检查通过，外链结果见repair1-static-check.json。五图原尺寸和750宽已逐图查看；独立复验尚未发生。封面哈希保持不变。

### 2026-11-03 — P2-TIME-01首次时序修复

依据负责人67ab4081派工：监督原评论3bf9d3dd时间09:12:33.680Z，早于首轮QA报告09:18:18Z。局部修正开头先后措辞为QA执行期间监督登记，QA完成释放后负责人读报告交原开发修复。全文检查其余监督/交回措辞无同类先后矛盾。P2-TIME-01执行后1/2；水印P2-WM-01已独立复验通过保持1/2，六图不重渲染。最终局部复验及check-delivery未执行，本地Issue保持in-progress。

P2-TIME-01验证：pnpm docs:build exit0（time1-build.log）；check_draft exit1五条元信息/整表提示（time1-draft.log），未伪改退出码。六图SHA256与上一冻结完全一致，沿用未变输入的水印及Windows有效证据；源/dist新身份见final-sha256.json。开发阶段交出并释放写入/UI，原生FRA-5 done仅代表开发阶段；最终局部QA/check-delivery/主人接受仍待完成。

### 2026-11-03 — 主人接受及文档收尾

主人真实接受时间为2026-11-03T09:53:08.751Z，确认卡96f2ce81-51d8-4a56-a967-2728958262a3绑定原验收报告revision 61361c9e-ed17-4f58-91f2-6145c3cb0b54；最新QA review revision 11b05315-2b4d-46b3-aaf8-de9a6209d6a8、qa revision f722d945-1902-435d-a76b-7965e00e4012。P2-WM-01与P2-TIME-01均首轮关闭，各1/2。本Issue当前done，未发布；来源及报告链接见本节顶部最终完成摘要。

负责人现仅持本Issue/索引/本月Changelog收尾写入权，开发与QA已释放写入/UI。不修改已验文章或六图；本次仅更新治理记录，447清单中Issue指纹因此自然过期，文章/图片/运行输入身份保持不变，旧清单作为交付时点证据保留。主人接受与Git/发布分离。
