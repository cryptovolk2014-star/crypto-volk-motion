import fs from 'node:fs';import path from 'node:path';import {spawn} from 'node:child_process';import {once} from 'node:events';
import {chromium} from 'playwright-core';import {serve} from '../server.mjs';import {brandPreflight} from './brand-preflight.mjs';
const id=process.argv.find(x=>x.startsWith('--composition='))?.split('=')[1]||'scan-ai-product';if(!/^[a-z0-9-]+$/.test(id))throw new Error('Invalid composition ID');
const config=JSON.parse(fs.readFileSync(`compositions/${id}.json`,'utf8')),stills=process.argv.includes('--stills');brandPreflight();fs.mkdirSync(config.previewDirectory,{recursive:true});
const server=await serve(0),base=`http://127.0.0.1:${server.address().port}`;let browser;
try{
 browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--hide-scrollbars','--font-render-hinting=none']});
 const page=await browser.newPage({viewport:{width:config.width,height:config.height},deviceScaleFactor:1}),errors=[];page.on('pageerror',e=>errors.push(String(e)));await page.goto(`${base}/${config.page}&render=1`);await page.evaluate(()=>window.filmReady);
 const loaded=await page.evaluate(()=>[...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family));if(!loaded.includes('Montserrat')||!loaded.includes('RobotoMono'))throw new Error('Required real fonts not loaded');if(await page.evaluate(()=>getComputedStyle(document.body).margin)!=='0px')throw new Error('Render stylesheet missing');

 if(stills){for(const item of config.previews){await page.evaluate(t=>window.render(t),item.time);await page.screenshot({path:`${config.previewDirectory}/${item.id}.png`});console.log(`Preview ${item.id} @ ${item.time}s`);}}
 else{
  const frames=Math.ceil(config.duration*config.fps),pending=config.output.replace(/\.mp4$/,'.rendering.mp4');
  const encoder=spawn('ffmpeg',['-hide_banner','-loglevel','warning','-y','-f','image2pipe','-vcodec','mjpeg','-framerate',String(config.fps),'-i','pipe:0','-i',config.audio,'-map','0:v:0','-map','1:a:0','-af',`apad=whole_dur=${config.duration}`,'-c:v','libx264','-preset','medium','-crf','17','-pix_fmt','yuv420p','-threads','3','-c:a','aac','-b:a','256k','-t',String(config.duration),'-movflags','+faststart','-metadata',`title=${config.title}`,pending],{stdio:['pipe','ignore','inherit']});
  const completed=once(encoder,'exit');let failed=false;encoder.stdin.on('error',()=>failed=true);
  try{for(let n=0;n<frames;n++){if(failed)throw new Error('FFmpeg input closed');await page.evaluate(t=>window.render(t),n/config.fps);const frame=await page.screenshot({type:'jpeg',quality:96});if(!encoder.stdin.write(frame))await once(encoder.stdin,'drain');if(n%90===0)console.log(`${id}: ${n}/${frames} frames (${Math.round(n/frames*100)}%)`);}encoder.stdin.end();const [code]=await completed;if(code!==0)throw new Error('FFmpeg failed: '+code);if(errors.length)throw new Error(errors.join('\n'));fs.renameSync(pending,config.output);console.log(`Complete: ${config.output}, ${frames} frames, ${config.duration}s`);}catch(e){encoder.stdin.destroy();encoder.kill('SIGTERM');throw e;}
 }
 if(errors.length)throw new Error(errors.join('\n'));
}finally{if(browser)await browser.close();server.close();}
