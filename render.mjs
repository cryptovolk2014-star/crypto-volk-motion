import {chromium} from 'playwright-core';
import {serve} from './server.mjs';
import fs from 'node:fs';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
const fps=30,duration=25.156,frames=Math.ceil(duration*fps);
const preview=process.argv.includes('--stills');
fs.mkdirSync('output',{recursive:true});
const server=await serve(0),port=server.address().port;
let browser;
try{
browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--hide-scrollbars','--font-render-hinting=none']});
const page=await browser.newPage({viewport:{width:1080,height:1920},deviceScaleFactor:1});
const errors=[];page.on('pageerror',e=>errors.push(String(e)));
await page.goto(`http://127.0.0.1:${port}/?render=1`);await page.evaluate(()=>window.filmReady);
if(preview){for(const t of [1.8,4.3,7.3,10.4,13.8,17,20.6,24.2]){await page.evaluate(t=>window.render(t),t);await page.screenshot({path:`output/scene-${t}.png`});}console.log('Saved 8 scene previews.');}
else{
 const encoder=spawn('ffmpeg',['-hide_banner','-loglevel','warning','-y','-f','image2pipe','-vcodec','mjpeg','-framerate',String(fps),'-i','pipe:0','-i','assets/voiceover.mp3','-map','0:v:0','-map','1:a:0','-c:v','libx264','-preset','medium','-crf','17','-pix_fmt','yuv420p','-threads','3','-c:a','aac','-b:a','256k','-t',String(duration),'-movflags','+faststart','-metadata','title=Crypto Volk — Scan AI / Gold','output/crypto-volk-motion-final.mp4'],{stdio:['pipe','ignore','inherit']});
 const completion=once(encoder,'exit');let failed=false;encoder.stdin.on('error',()=>{failed=true;});
 for(let i=0;i<frames;i++){if(failed)throw new Error('Encoder pipe closed');await page.evaluate(t=>window.render(t),i/fps);const frame=await page.screenshot({type:'jpeg',quality:96});if(!encoder.stdin.write(frame))await once(encoder.stdin,'drain');if(i%60===0)console.log(`Rendered ${i}/${frames} frames (${Math.round(i/frames*100)}%)`);}
 encoder.stdin.end();const [code]=await completion;if(code!==0)throw new Error(`FFmpeg exited ${code}`);console.log(`Complete: ${frames} frames, 1080x1920, 30 fps.`);
}
if(errors.length)throw new Error(errors.join('\n'));
}finally{if(browser)await browser.close();server.close();}
