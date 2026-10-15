import assert from 'node:assert/strict'
import {createServer} from 'node:http'
import {readFile} from 'node:fs/promises'
import path from 'node:path'
import {pathToFileURL} from 'node:url'

const runtime=process.argv[2]
if(!runtime)throw new Error('Pass an existing Playwright module path')
const {chromium}=await import(pathToFileURL(path.resolve(runtime)).href)
const root=path.resolve('docs/.vitepress/dist')
const server=createServer(async(req,res)=>{
  try{
    const url=new URL(req.url,'http://localhost')
    let file=path.resolve(root,'.'+decodeURIComponent(url.pathname))
    assert.ok(file.startsWith(root+path.sep)||file===root)
    if(url.pathname.endsWith('/'))file=path.join(file,'index.html')
    else if(!path.extname(file))file+='.html'
    const bytes=await readFile(file)
    const mime={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg'}
    res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});res.end(bytes)
  }catch{res.writeHead(404);res.end('Not found')}
})
let browser
try{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve))
  const base=process.env.BOOK_TEST_BASE||`http://127.0.0.1:${server.address().port}`
  browser=await chromium.launch({executablePath:process.argv[3]||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true})
  const context=await browser.newContext({viewport:{width:1280,height:900}})
  if(!process.env.BOOK_TEST_BASE)await context.route('https://**/*',route=>route.abort())
  const page=await context.newPage()
  page.setDefaultTimeout(10000)
  await page.goto(base+'/ai-agent/agentic-llms-chinese.html',{waitUntil:'networkidle'})
  const [newPage]=await Promise.all([
    context.waitForEvent('page',{timeout:1500}).catch(()=>null),
    page.getByRole('link',{name:'打开中文版阅读页 →',exact:true}).click()
  ])
  const book=newPage||page
  await book.waitForLoadState('domcontentloaded')
  await book.locator('main#main > h1').waitFor()
  assert.equal(await book.locator('main#main > h1').textContent(),'智能体式大语言模型')
  assert.equal(await book.locator('#app').count(),0,'standalone book must use native document navigation')
  const direct=await context.newPage()
  const response=await direct.goto(base+'/books/agentic-llms-zh/',{waitUntil:'domcontentloaded'})
  assert.equal(response.status(),200)
  await direct.getByRole('link',{name:'从第 1 章开始阅读 →'}).click()
  await direct.locator('section#Ch1 h1').waitFor()
  assert.ok(direct.url().endsWith('/ch01.html'))
  const figure=direct.locator('img[data-localized-image="img001"]')
  await figure.scrollIntoViewIfNeeded()
  await figure.evaluate(img=>img.decode())
  assert.ok(await figure.evaluate(img=>img.naturalWidth>0),'local Chinese SVG must load')
  assert.equal(await figure.locator('..').getAttribute('href'),'images/img001-zh.svg')
  await direct.goto(base+'/books/agentic-llms-zh/ch03.html')
  const recovered=direct.locator('img[data-localized-image="img012"]')
  await recovered.scrollIntoViewIfNeeded()
  await recovered.evaluate(img=>img.decode())
  assert.ok(await recovered.evaluate(img=>img.naturalWidth===1408),'recovered Figure 3.1 must load')
  console.log('Static book entry, direct directory, and chapter navigation passed.')
}finally{await browser?.close();await new Promise(resolve=>server.close(resolve))}
