import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {chromium} from 'playwright-core';
import {PNG} from 'pngjs';
import {serve} from '../server.mjs';
const config=JSON.parse(fs.readFileSync('compositions/scan-ai-emotion.json','utf8'));
const run=(bin,args)=>execFileSync(bin,args,{maxBuffer:384*1024*1024});
const file=config.output,stat=fs.statSync(file);assert.ok(stat.size>0&&stat.size<100_000_000);
const probe=JSON.parse(run('ffprobe',['-v','error','-count_frames','-show_streams','-show_format','-of','json',file]));
const v=probe.streams.find(s=>s.codec_type==='video'),a=probe.streams.find(s=>s.codec_type==='audio');
assert.equal(v.codec_name,'h264');assert.equal(a.codec_name,'aac');assert.equal(v.width,1080);assert.equal(v.height,1920);assert.equal(v.avg_frame_rate,'30/1');assert.equal(+v.nb_read_frames,1185);assert.equal(+probe.format.duration,39.5);
run('ffmpeg',['-v','error','-i',file,'-f','null','-']);
const pcm=path=>{const b=run('ffmpeg',['-v','error','-i',path,'-ac','1','-ar','8000','-f','f32le','pipe:1']);return new Float32Array(b.buffer.slice(b.byteOffset,b.byteOffset+b.length));};
const src=pcm(config.audio),out=pcm(file);assert.ok(out.length>=src.length);
let dot=0,sx=0,sy=0;for(let i=0;i<src.length;i++){dot+=src[i]*out[i];sx+=src[i]**2;sy+=out[i]**2;}const correlation=dot/Math.sqrt(sx*sy);assert.ok(correlation>.999,'Source voice changed or shifted');
// Test actual sample lags ±30 ms rather than relying solely on container timestamps.
let bestLag=0,best=-Infinity;for(let lag=-240;lag<=240;lag++){let dot=0;for(let i=240;i<src.length-240;i++)dot+=src[i]*out[i+lag];if(dot>best){best=dot;bestLag=lag;}}
assert.equal(bestLag,0,'Encoded voice has a timing shift');let silencePeak=0;for(let i=Math.ceil((config.audioDuration+.12)*8000);i<out.length;i++)silencePeak=Math.max(silencePeak,Math.abs(out[i]));assert.ok(silencePeak<.0001);
const server=await serve(0);let browser;const checks=[];
try{
 browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage','--hide-scrollbars','--font-render-hinting=none']});
 const page=await browser.newPage({viewport:{width:1080,height:1920}}),errors=[];page.on('pageerror',e=>errors.push(String(e)));
 const base=`http://127.0.0.1:${server.address().port}`;await page.goto(`${base}/${config.page}&render=1`);await page.evaluate(()=>filmReady);
 // Includes every main scene and each composited transition.
 const times=[...config.previews.map(x=>x.time),5.78,9.6,13.28,15.84,19.05,26.78,30.74,35.1];
 // One decode extracts all requested exact frame indices; no approximate input seeking.
 const frames=times.map(t=>Math.round(t*30)),unique=[...new Set(frames)].sort((a,b)=>a-b),filter=unique.map(n=>`eq(n\\,${n})`).join('+');
 const raw=run('ffmpeg',['-v','error','-threads','2','-i',file,'-vf',`select=${filter}`,'-fps_mode','vfr','-f','rawvideo','-pix_fmt','rgb24','pipe:1']);
 const frameBytes=1080*1920*3;assert.equal(raw.length,frameBytes*unique.length);
 for(const n of frames){await page.evaluate(t=>render(t),n/30);const ref=PNG.sync.read(await page.screenshot()),offset=unique.indexOf(n)*frameBytes;let diff=0;for(let i=0,j=0;i<frameBytes;i+=3,j+=4)diff+=Math.abs(raw[offset+i]-ref.data[j])+Math.abs(raw[offset+i+1]-ref.data[j+1])+Math.abs(raw[offset+i+2]-ref.data[j+2]);const mean=diff/frameBytes;assert.ok(mean<2.5,`Encoded frame ${n} differs from canvas: ${mean}`);checks.push({frame:n,time:n/30,mean_pixel_difference:mean});}
 const playback=await page.evaluate(async url=>{const v=document.createElement('video');v.muted=true;v.preload='auto';document.body.append(v);v.src=url;await new Promise((resolve,reject)=>{v.onloadedmetadata=resolve;v.onerror=()=>reject(Error('MP4 metadata failed'));});await v.play();await new Promise(resolve=>{v.onseeked=resolve;v.currentTime=38.6;});await new Promise(resolve=>v.requestVideoFrameCallback(resolve));v.pause();const result={width:v.videoWidth,height:v.videoHeight,duration:v.duration,readyState:v.readyState,currentTime:v.currentTime};v.remove();return result;},base+'/'+file);assert.equal(playback.width,1080);assert.equal(playback.height,1920);assert.equal(playback.duration,39.5);assert.ok(playback.readyState>=2);
 const range=await fetch(base+'/'+file,{headers:{Range:'bytes=0-1023'}});assert.equal(range.status,206);assert.equal((await range.arrayBuffer()).byteLength,1024);assert.deepEqual(errors,[]);
 const report={composition:config.id,file,bytes:stat.size,sha256:createHash('sha256').update(fs.readFileSync(file)).digest('hex'),duration:+probe.format.duration,frames:+v.nb_read_frames,width:v.width,height:v.height,fps:v.avg_frame_rate,video_codec:v.codec_name,audio_codec:a.codec_name,full_decode:'passed',voice:{source_duration:config.audioDuration,best_lag_samples_at_8khz:bestLag,correlation,silence_hold_peak:silencePeak,music_added:false},encoded_frame_checks:checks,browser_playback:playback,http_range_status:range.status,javascript_errors:errors};
 fs.writeFileSync(`${config.previewDirectory}/media-validation.json`,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
}finally{if(browser)await browser.close();server.close();}
