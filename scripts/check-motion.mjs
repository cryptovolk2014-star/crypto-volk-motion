import fs from 'node:fs';
import assert from 'node:assert/strict';
import {PNG} from 'pngjs';
import {createHash} from 'node:crypto';
import {chromium} from 'playwright-core';
import {serve} from '../server.mjs';
const hash=x=>createHash('sha256').update(x).digest('hex');
const manifests=JSON.parse(fs.readFileSync('assets/brand/clean/manifest.json','utf8'));
for(const item of manifests){
 assert.equal(hash(fs.readFileSync(item.source)),item.source_sha256,'Original source was changed');
 const bytes=fs.readFileSync(item.path);assert.equal(hash(bytes),item.sha256);const p=PNG.sync.read(bytes);
 for(const [x,y] of [[0,0],[p.width-1,0],[0,p.height-1],[p.width-1,p.height-1]])assert.equal(p.data[(y*p.width+x)*4+3],0,'Opaque asset corner');
 assert.ok(item.transparent_pixels>10000);assert.ok(item.antialiased_pixels>0);
}
const server=await serve(0);let browser;
try{
 browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const page=await browser.newPage({viewport:{width:1080,height:1920},deviceScaleFactor:1});const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.goto(`http://127.0.0.1:${server.address().port}/?render=1`);await page.evaluate(()=>window.filmReady);
 const result=await page.evaluate(()=>{
  const used=new Set(),draw=CanvasRenderingContext2D.prototype.drawImage;CanvasRenderingContext2D.prototype.drawImage=function(im,...args){used.add(new URL(im.src).pathname);return draw.call(this,im,...args);};
  let minimum=Infinity,calls=0;const sceneCounts={};
  for(let frame=0;frame<Math.ceil(DURATION*30);frame++){const r=render(frame/30);sceneCounts[r.scene]=(sceneCounts[r.scene]||0)+1;for(const item of lastTextAudit){minimum=Math.min(minimum,item.size);calls++;}}
  const stableTimes=[1.8,4.3,7.3,10.4,13.8,17,20.6,24.2],overflow=[];
  for(const t of stableTimes){render(t);for(const item of lastTextAudit){const b=item.bounds;if(b.left<55||b.right>1025||b.top<50||b.bottom>1890)overflow.push({time:t,...item});}}
  CanvasRenderingContext2D.prototype.drawImage=draw;
  return {frames:Math.ceil(DURATION*30),minimumFontSize:minimum,textDrawCalls:calls,sceneFrameCounts:sceneCounts,drawnBrandAssets:[...used],overflow};
 });
 assert.equal(result.frames,755);assert.equal(Object.keys(result.sceneFrameCounts).length,8);assert.ok(result.minimumFontSize>=32);assert.deepEqual(result.overflow,[]);assert.deepEqual(errors,[]);
 assert.deepEqual(result.drawnBrandAssets.sort(),['/assets/brand/clean/cryptovolk-logo.png','/assets/brand/clean/scan-ai-plate.png'].sort());
 // Inspect cutout boundaries on a deliberately different checkerboard backdrop.
 await page.evaluate(async()=>{
  const c=document.getElementById('film');c.width=1080;c.height=760;c.style.width='1080px';c.style.height='760px';const d=c.getContext('2d');for(let y=0;y<760;y+=40)for(let x=0;x<1080;x+=40){d.fillStyle=(x/40+y/40)%2?'#63738A':'#34445C';d.fillRect(x,y,40,40);}
  const load=url=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=reject;im.src=url;});
  const a=await load(brandResources.logo),b=await load(brandResources.plate);d.drawImage(a,55,25,450,450*a.height/a.width);d.drawImage(b,35,510,1010,1010*b.height/b.width);
 });
 await page.screenshot({path:'output/clean-assets-check.png',clip:{x:0,y:0,width:1080,height:760}});
 const report={...result,assetAlphaAndHashes:'passed',javascriptErrors:errors};fs.writeFileSync('output/design-validation.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
}finally{if(browser)await browser.close();server.close();}
