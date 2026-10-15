import test from 'node:test'
import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import {createHash} from 'node:crypto'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const root=fileURLToPath(new URL('../docs/public/books/agentic-llms-zh/',import.meta.url))
const hash=bytes=>createHash('sha256').update(bytes).digest('hex')

test('all textbook illustrations have local Chinese assets with intact embedded originals',async()=>{
  const manifest=JSON.parse(await readFile(path.join(root,'image-localization.json'),'utf8'))
  assert.equal(manifest.images.length,90)
  const assets=new Set()
  const dimensions=new Map()
  for(const item of manifest.images){
    assert.match(item.asset,/^images\/img\d{3}-zh\.svg$/)
    assert.ok(!assets.has(item.asset));assets.add(item.asset)
    dimensions.set(item.asset,item.output_size)
    const bytes=await readFile(path.join(root,item.asset));const svg=bytes.toString('utf8')
    assert.equal(hash(bytes),item.localized_sha256,item.id+' localized file audit')
    const original=svg.match(/<image\b[^>]*href="data:image\/(?:png|jpeg);base64,([A-Za-z0-9+/=]+)"/)
    assert.ok(original,item.id+' embedded original')
    assert.equal(hash(Buffer.from(original[1],'base64')),item.sha256,item.id+' original integrity')
    assert.doesNotMatch(svg,/<script\b|\bon\w+\s*=|href="https?:|\uFFFD/)
    const decode=value=>value.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#x27;/g,"'").replace(/&amp;/g,'&')
    const visibleText=[...svg.matchAll(/<text\b[^>]*>([\s\S]*?)<\/text>/g)].map(match=>decode(match[1].replace(/<[^>]+>/g,'')))
    let translated=0
    for(const region of item.decisions){
      assert.equal(['text','retain','skip'].filter(key=>key in region).length,1)
      if('text' in region){
        assert.ok(region.text.trim());translated++
        const index=visibleText.indexOf(region.text.replace(/\r?\n/g,''))
        assert.ok(index>=0,item.id+' complete Chinese label: '+region.text)
        visibleText.splice(index,1)
      }
    }
    assert.equal(translated,item.overlays)
  }
  const references=[]
  for(let n=1;n<=23;n++){
    const html=await readFile(path.join(root,`ch${String(n).padStart(2,'0')}.html`),'utf8')
    for(const image of html.matchAll(/<img\b[^>]*>/g)){
      const src=image[0].match(/\bsrc="([^"]+)"/)?.[1]
      assert.ok(assets.has(src),'every figure must load a local audited asset')
      assert.match(image[0],/data-localized-image="img\d{3}"/)
      const [width,height]=dimensions.get(src)
      assert.ok(image[0].includes(`width="${width}"`)&&image[0].includes(`height="${height}"`),'localized figure aspect ratio includes its Chinese comparison footer')
      references.push(src)
    }
  }
  assert.equal(references.length,91)
  assert.equal(new Set(references).size,90)
})
