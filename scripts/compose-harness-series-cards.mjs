import { mkdir, writeFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { join } from 'node:path'

const root = process.cwd()
const assetDir = join(root, 'docs/public/images/blog/harness-series')
const specDir = join(root, 'scripts/harness-series-card-compositions')
const compositorIndex = process.argv.indexOf('--compositor')
if (compositorIndex === -1 || !process.argv[compositorIndex + 1]) {
  console.error('usage: node scripts/compose-harness-series-cards.mjs --compositor <compose_knowledge_card.mjs>')
  process.exit(2)
}
const compositor = process.argv[compositorIndex + 1]
await mkdir(specDir, { recursive: true })

const cards = [
 ['01-audit','系列第 1 篇：Harness 诊断','六个检查站',['目标','知识','执行','观察','验证','介入记录']],
 ['02-goal-contract','系列第 2 篇：Goal Contract','契约加工台',['目标','范围','非目标','验收','风险','升级']],
 ['03-knowledge-map','系列第 3 篇：项目知识地图','知识地图与迷宫',['入口地图','架构','领域','运行','安全','历史']],
 ['04-command-surface','系列第 4 篇：统一执行面','统一工具控制台',['安装','开发','Lint','测试','构建','预览']],
 ['05-mechanical-constraints','系列第 5 篇：机械约束','工程道路护栏',['架构','数据','可靠性','安全','诊断','修复']],
 ['06-feedback-loop','系列第 6 篇：反馈闭环','观察验证控制环',['执行','日志','行为','验证','修正','重验']],
 ['07-evidence-evaluation','系列第 7 篇：证据与独立评估','三层质量法庭',['存在','接线','执行','通过','证据','裁决']],
 ['08-continuous-governance','系列第 8 篇：持续治理','持续治理花园',['介入','漂移','文档','规则','测试','工具']],
 ['09-capstone','系列第 9 篇：最小 Harness','Harness 全景控制台',['契约','知识','命令','约束','证据','治理']],
]

for (const [slug,title,metaphor,notes] of cards) {
  const labels = [
    { text:title, x:80,y:40,width:760,height:92,maxFontSize:42,minFontSize:28,background:'#fffaf0',backgroundOpacity:1,borderWidth:0 },
    { text:`视觉隐喻：${metaphor}`, x:80,y:130,width:620,height:58,maxFontSize:23,minFontSize:18,background:'#fffaf0',backgroundOpacity:1,borderWidth:0,fontWeight:500,textColor:'#59645e' },
    ...notes.map((text,index)=>({text,x:105+index*230,y:300+(index%2)*90,width:205,height:82,maxFontSize:26,minFontSize:20,background:['#dcebe4','#f7df9d','#bdd8e8','#e5b7ad','#c9deb2','#d9c7e8'][index],backgroundOpacity:1,borderColor:'#5c655f',borderWidth:2,radius:12})),
    { text:metaphor,x:210,y:720,width:1180,height:58,maxFontSize:28,minFontSize:22,background:'#fffdf7',backgroundOpacity:1,borderColor:'#759682',borderWidth:3,radius:18 },
    { text:'概念插画：用于解释机制，不代表真实运行证据',x:300,y:770,width:1000,height:64,maxFontSize:19,minFontSize:16,background:'#fffdf7',backgroundOpacity:1,borderWidth:0,fontWeight:500,textColor:'#59645e' },
  ]
  const config={width:1600,height:900,artwork:join(assetDir,`${slug}-knowledge-card.png`),output:join(assetDir,`${slug}-knowledge-card.svg`),title:`${title}概念插画`,description:`以${metaphor}解释本篇机制的手绘知识卡片`,labels}
  const configPath=join(specDir,`${slug}.json`)
  await writeFile(configPath,JSON.stringify(config,null,2),'utf8')
  const result=spawnSync(process.execPath,[compositor,'--config',configPath],{stdio:'inherit'})
  if(result.status!==0) process.exit(result.status ?? 1)
}

console.log('Composed nine self-contained knowledge-card SVGs.')
