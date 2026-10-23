// Native video composition with deterministic source-frame seeking. No exported
// frame sequences or duplicate clip audio enter the project or final mix.
export async function createVideoLayer(E,definitions){
 const videos={};
 await Promise.all(Object.entries(definitions).map(async([key,clip])=>{
  const v=document.createElement('video');v.muted=true;v.playsInline=true;v.preload='auto';v.src=clip.path;
  await new Promise((resolve,reject)=>{v.onloadeddata=resolve;v.onerror=()=>reject(Error('Video missing: '+clip.path));});
  if(v.videoWidth!==1080||v.videoHeight!==1920)throw Error('Unexpected source clip dimensions');videos[key]=v;
 }));
 const sourceTime=(clip,time)=>Math.min(4.9666666667,Math.max(0,Math.floor((clip.sourceIn+(time-clip.start)*clip.rate)*30)/30))+.001;
 async function seekFrame(time){
  await Promise.all(Object.entries(definitions).filter(([,c])=>time>=c.start&&time<c.end+.32).map(async([key,c])=>{
   const v=videos[key],target=sourceTime(c,time);if(Math.abs(v.currentTime-target)<.0001&&v.readyState>=2)return;
   await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('Video seek timeout: '+key)),5000);v.onseeked=()=>{clearTimeout(timer);resolve();};v.currentTime=target;});
   await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  }));
 }
 let queue=Promise.resolve();
 function prepare(time){const task=queue.then(()=>seekFrame(time));queue=task.catch(()=>{});return task;}
 function draw(key,time){
  const clip=definitions[key],v=videos[key],b=clip.box,s=clip.crop,{ctx,rounded}=E;
  ctx.save();ctx.shadowColor='#05071830';ctx.shadowBlur=35;ctx.shadowOffsetY=16;ctx.fillStyle='#050718';rounded(b.x,b.y,b.w,b.h,42);ctx.fill();ctx.shadowBlur=0;ctx.shadowOffsetY=0;
  ctx.save();rounded(b.x,b.y,b.w,b.h,42);ctx.clip();ctx.drawImage(v,s.x,s.y,s.w,s.h,b.x,b.y,b.w,b.h);ctx.restore();
  ctx.strokeStyle=E.getTheme()==='light'?'#7A52EE55':'#B8C8E044';ctx.lineWidth=2;rounded(b.x,b.y,b.w,b.h,42);ctx.stroke();ctx.restore();
  const f=clip.faceSourceBounds,faceBounds={left:b.x+(f.left-s.x)/s.w*b.w,right:b.x+(f.right-s.x)/s.w*b.w,top:b.y+(f.top-s.y)/s.h*b.h,bottom:b.y+(f.bottom-s.y)/s.h*b.h};
  return {key,path:clip.path,sourceTime:v.currentTime,sourceFrame:Math.floor(v.currentTime*30),faceBounds,crop:s,box:b};
 }
 return {prepare,draw,videos,sourceTime};
}
