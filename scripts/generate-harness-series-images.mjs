import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const out = join(process.cwd(), 'docs/public/images/blog/harness-series')
await mkdir(out, { recursive: true })

const esc = (s) => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
const card = (x,y,w,h,title,copy,{dark=false,warm=false,muted=false}={}) => `
  <g opacity="${muted ? .28 : 1}">
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="${dark?'#153c31':warm?'#fff7e6':'#ffffff'}" stroke="${warm?'#d8ad59':'#a9cabb'}" stroke-width="2"/>
    <text x="${x+24}" y="${y+39}" class="ct ${dark?'light':''}">${esc(title)}</text>
    <text x="${x+24}" y="${y+70}" class="cc ${dark?'light2':''}">${esc(copy)}</text>
  </g>`
const line=(d,{green=false,orange=false,red=false,dash=false}={})=>`<path d="${d}" fill="none" stroke="${red?'#9b4f5b':orange?'#b96a15':green?'#08785a':'#41665a'}" stroke-width="4" ${dash?'stroke-dasharray="9 7"':''} marker-end="url(#${red?'ar':orange?'ao':green?'ag':'a'})"/>`

const master = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="1200" viewBox="0 0 1800 1200" role="img" aria-labelledby="title desc">
<title id="title">Harness Engineering 完整知识地图</title>
<desc id="desc">一个任务核心控制环与五个横向保障面组成可持续运行的 Agent 工程系统。</desc>
<defs>
 <marker id="a" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="8" markerHeight="8" orient="auto"><path d="M1 1 11 6 1 11z" fill="#41665a"/></marker>
 <marker id="ag" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="8" markerHeight="8" orient="auto"><path d="M1 1 11 6 1 11z" fill="#08785a"/></marker>
 <marker id="ao" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="8" markerHeight="8" orient="auto"><path d="M1 1 11 6 1 11z" fill="#b96a15"/></marker>
 <marker id="ar" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="8" markerHeight="8" orient="auto"><path d="M1 1 11 6 1 11z" fill="#9b4f5b"/></marker>
 <style>text{font-family:"Microsoft YaHei","PingFang SC",sans-serif}.ey{font-size:18px;font-weight:800;letter-spacing:4px;fill:#08785a}.h1{font-size:43px;font-weight:800;fill:#14251f}.sub{font-size:18px;fill:#617168}.pt{font-size:22px;font-weight:750;fill:#17251f}.pc{font-size:15px;fill:#596961}.core{font-size:26px;font-weight:800;fill:#123d31}.ct{font-size:18px;font-weight:750;fill:#17251f}.cc{font-size:14px;fill:#637169}.light{fill:#fff}.light2{fill:#cce0d7}.tag{font-size:14px;font-weight:800}.foot{font-size:16px;fill:#52635a}</style>
</defs>
<rect width="1800" height="1200" fill="#f7faf7"/><circle cx="1740" cy="65" r="220" fill="#dcebe4"/><circle cx="30" cy="1180" r="180" fill="#e5ede7"/>
<text x="90" y="65" class="ey">HARNESS ENGINEERING</text><text x="90" y="120" class="h1">完整知识地图</text><text x="90" y="160" class="sub">一个任务核心控制环，五个横向保障面，组成可持续运行的 Agent 工程系统</text>

<g id="planes">
${card(90,205,500,135,'安全与权限治理','最小权限 · 工具白名单 · 密钥保护 · 审批',{dark:true})}
${card(650,205,500,135,'环境隔离与可重复性','Worktree · 独立资源 · 固定版本 · CI 一致')}
${card(1210,205,500,135,'任务编排与状态管理','任务拆解 · 阶段状态 · 上下文恢复 · 幂等执行')}
${card(245,1010,610,130,'恢复、回滚与人工接管','超时 · 重试上限 · 回滚 · 数据恢复 · 高风险升级')}
${card(945,1010,610,130,'评估指标与持续治理','自主完成率 · 人工介入 · 缺陷逃逸 · 架构漂移')}
</g>

<rect x="155" y="390" width="1490" height="570" rx="36" fill="#edf6f1" stroke="#92c4ad" stroke-width="3"/>
<text x="210" y="443" class="core">任务核心控制环</text><text x="210" y="473" class="pc">理解目标，受约束执行，观察结果，用证据裁决，并把失败写回 Harness</text>

${card(205,520,230,112,'目标与边界','优先级 · 风险 · 决策',{dark:true})}
${card(475,520,230,112,'意图与验收','目标 · 非目标 · 完成定义')}
${card(745,520,230,112,'知识与上下文','代码 · 文档 · 计划 · 规则')}
${card(1015,520,230,112,'受约束执行','工具 · 权限 · 架构护栏')}
${card(1285,520,230,112,'观察结果','日志 · 指标 · API · UI',{warm:true})}
${line('M435 576H475')}${line('M705 576H745')}${line('M975 576H1015')}${line('M1245 576H1285')}

${card(1285,700,230,112,'机械验证','类型 · Lint · 测试 · CI',{warm:true})}
${card(815,700,270,112,'反馈与修正','失败 → 定位 → 修改 → 重验')}
${card(285,700,310,112,'交付结果与证据','报告 · 截图 · 未验证项',{dark:true})}
${line('M1400 632V700')}
${line('M1285 756H1085',{orange:true,dash:true})}<text x="1175" y="744" class="tag" fill="#a85f16">未通过</text>
${line('M950 700V670Q950 650 970 650H1130Q1150 650 1150 632',{orange:true,dash:true})}
${line('M1285 790H1215V835H595V790',{green:true})}<text x="1205" y="824" class="tag" fill="#08785a">通过</text>
${line('M815 772H720V980H550V1010',{red:true,dash:true})}<text x="730" y="965" class="tag" fill="#934956">需要判断</text>

<rect x="620" y="850" width="560" height="78" rx="18" fill="#d8ebe2" stroke="#79b69b" stroke-width="2"/>
<text x="900" y="884" text-anchor="middle" class="ct">经验沉淀回 Harness</text><text x="900" y="911" text-anchor="middle" class="cc">文档与知识 · 规则与约束 · 测试与工具</text>
${line('M440 812V830Q440 889 500 889H620',{green:true})}
${line('M900 850V665Q900 645 880 645V632',{green:true})}
${line('M1020 850V665Q1020 645 1040 645V632',{green:true})}

${line('M340 340V470Q340 500 360 500V520',{red:true,dash:true})}
${line('M900 340V490Q900 505 1040 505V520',{dash:true})}
${line('M1480 340V475Q1480 495 1350 495V520',{dash:true})}
${line('M550 1010V980H720V812',{red:true,dash:true})}
${line('M1250 1010V940Q1250 920 1180 920',{dash:true})}
<text x="90" y="1174" class="foot">阅读顺序：先沿中央主链向右；验证失败进入橙色修正回路，通过进入绿色交付与沉淀路径，需要判断时进入红色人工接管路径。</text>
</svg>`
await writeFile(join(out,'harness-knowledge-map.svg'),master,'utf8')

const focusData = [
 ['01-audit','系列第 1 篇：诊断 Harness 断点','目标 → 知识 → 执行 → 观察 → 验证','诊断不是给项目打总分，而是找到控制环在哪一步失去事实、工具或反馈。',['目标','知识','执行','观察','验证','介入记录']],
 ['02-goal-contract','系列第 2 篇：Goal Contract','自然语言 → 目标边界 → 可验收行为','契约把“想做什么”变成范围、验收、风险和升级条件。',['目标','范围','非目标','验收','风险','升级']],
 ['03-knowledge-map','系列第 3 篇：项目知识地图','意图 → 可发现知识 → 受约束执行','AGENTS.md 提供地图，详细事实留在分层文档和代码中。',['入口地图','架构','领域','运行','安全','历史']],
 ['04-command-surface','系列第 4 篇：统一执行面','隔离环境 → 标准命令 → 可观察结果','命令必须唯一、非交互、退出码可靠，并在本地与 CI 中一致。',['安装','开发','Lint','测试','构建','预览']],
 ['05-mechanical-constraints','系列第 5 篇：机械约束','安全边界 → 受约束执行 → 确定性裁决','把重复审查意见变成类型、Lint、结构测试或 CI 规则。',['架构','数据','可靠性','安全','诊断','修复']],
 ['06-feedback-loop','系列第 6 篇：反馈闭环','执行 → 观察 → 验证 → 修正 → 重验','测试、日志、API 和 UI 共同形成 Agent 可以读取的纠偏信号。',['执行','日志','行为','验证','修正','重验']],
 ['07-evidence-evaluation','系列第 7 篇：证据与独立评估','观察 → 验证 → 证据 → 独立裁决','执行者提供证据，确定性工具查事实，独立评估处理语义验收。',['存在','接线','执行','通过','证据','裁决']],
 ['08-continuous-governance','系列第 8 篇：持续治理','交付证据 → 经验沉淀 → Harness 升级','重复人工纠正应升级为文档、规则、测试或工具。',['介入','漂移','文档','规则','测试','工具']],
 ['09-capstone','系列第 9 篇：最小可运行 Harness','目标 → 执行 → 验证 → 证据 → 沉淀','把前八篇组件连接为一次可复现、可验证、可改进的真实任务。',['契约','知识','命令','约束','证据','治理']],
]
for (const [slug,title,flow,copy,labels] of focusData) {
 const boxes=labels.map((v,i)=>{const x=95+i*245; return `${card(x,260,205,105,v,i===0?'起点':i===labels.length-1?'结果':'关键能力',{dark:i===0,warm:i===labels.length-1})}${i<labels.length-1?line(`M${x+205} 312H${x+245}`):''}`}).join('')
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="720" viewBox="0 0 1600 720" role="img" aria-labelledby="t d"><title id="t">${esc(title)}</title><desc id="d">${esc(copy)}</desc><defs><marker id="a" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="8" markerHeight="8" orient="auto"><path d="M1 1 11 6 1 11z" fill="#41665a"/></marker><style>text{font-family:"Microsoft YaHei","PingFang SC",sans-serif}.ey{font-size:18px;font-weight:800;letter-spacing:2px;fill:#08785a}.h{font-size:34px;font-weight:800;fill:#14251f}.ct{font-size:18px;font-weight:750;fill:#17251f}.cc{font-size:14px;fill:#637169}.light{fill:#fff}.light2{fill:#cce0d7}.lead{font-size:21px;font-weight:700;fill:#284c3e}.copy{font-size:17px;fill:#52635a}</style></defs><rect width="1600" height="720" fill="#f7faf7"/><circle cx="1515" cy="20" r="190" fill="#dcebe4"/><text x="95" y="78" class="ey">HARNESS ENGINEERING</text><text x="95" y="130" class="h">${esc(title)}</text><text x="95" y="190" class="lead">${esc(flow)}</text>${boxes}<rect x="95" y="445" width="1410" height="120" rx="18" fill="#edf6f1" stroke="#9bc7b3" stroke-width="2"/><text x="130" y="493" class="lead">当前关注区域</text><text x="130" y="533" class="copy">${esc(copy)}</text><text x="95" y="645" class="copy">局部图来自同一份权威母图；深色为起点，暖色为本篇要验证的结果。</text></svg>`
 await writeFile(join(out,`${slug}-focus.svg`),svg,'utf8')
}

const metaphors=['六个检查站','契约加工台','知识地图与迷宫','统一工具控制台','工程道路护栏','观察验证控制环','三层质量法庭','持续治理花园','Harness 全景控制台']
for (let i=0;i<focusData.length;i++) {
 const [slug,title,,,labels]=focusData[i]
 const colors=['#dcebe4','#f7df9d','#bdd8e8','#e5b7ad','#c9deb2','#d9c7e8']
 const notes=labels.map((v,j)=>`<g transform="translate(${115+j*230} ${315+(j%2)*90}) rotate(${j%2?-1.5:1.2})"><rect width="185" height="72" rx="12" fill="${colors[j]}" stroke="#5c655f" stroke-width="2"/><text x="92" y="43" text-anchor="middle" class="lab">${esc(v)}</text></g>`).join('')
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900" role="img" aria-labelledby="t d"><title id="t">${esc(title)}概念插画</title><desc id="d">${esc(metaphors[i])}手绘知识卡片</desc><defs><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".7" numOctaves="2" seed="8" result="n"/><feBlend in="SourceGraphic" in2="n" mode="multiply"/></filter><style>text{font-family:"Microsoft YaHei","PingFang SC",sans-serif}.title{font-size:42px;font-weight:800;fill:#303a35}.sub{font-size:21px;fill:#59645e}.lab{font-size:24px;font-weight:750;fill:#303a35}.small{font-size:18px;fill:#59645e}</style></defs><rect width="1600" height="900" fill="#fffaf0"/><rect width="1600" height="900" fill="#fff" opacity=".05" filter="url(#grain)"/><path d="M90 170Q800 120 1510 170" stroke="#68776f" stroke-width="3" fill="none" stroke-dasharray="4 9"/><text x="95" y="90" class="title">${esc(title)}</text><text x="95" y="135" class="sub">视觉隐喻：${esc(metaphors[i])}</text><g transform="translate(720 205)"><rect x="0" y="0" width="160" height="145" rx="35" fill="#d9e8e0" stroke="#4f6459" stroke-width="5"/><rect x="32" y="32" width="96" height="54" rx="14" fill="#f8fbf9" stroke="#4f6459" stroke-width="4"/><circle cx="62" cy="58" r="8" fill="#08785a"/><circle cx="99" cy="58" r="8" fill="#08785a"/><path d="M58 106Q80 125 103 106" fill="none" stroke="#4f6459" stroke-width="4"/><path d="M80 0V-24M70-28h20" stroke="#4f6459" stroke-width="4"/></g>${notes}<path d="M150 610C430 710 1180 710 1450 610" fill="none" stroke="#6b786f" stroke-width="5" stroke-dasharray="10 13"/><path d="M1430 595l35 18-38 13" fill="#6b786f"/><rect x="210" y="730" width="1180" height="90" rx="18" fill="#fffdf7" stroke="#759682" stroke-width="3"/><text x="800" y="772" text-anchor="middle" class="lab">${esc(metaphors[i])}</text><text x="800" y="801" text-anchor="middle" class="small">概念插画：用于解释机制，不代表真实运行证据</text></svg>`
 await writeFile(join(out,`${slug}-knowledge-card.svg`),svg,'utf8')
}

console.log(`Generated 19 SVG assets in ${out}`)
