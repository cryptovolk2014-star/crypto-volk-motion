import {clamp,reveal,smooth} from './fintech.js';
import {drawTradingChart,price,validateSetup} from './trading-setup.js';

// The hand and phone are independent photographic layers; every screen element is native code.
// Screen coordinates are calibrated against the new blank-screen asset, not the user's screenshots.
export const PHONE_GEOMETRY=Object.freeze({asset:{x:-30,y:500,scale:.96},screen:{x:312.72,y:587.36,w:477.12,h:1030.08,r:72},fingerSource:{x:205,y:135},assetTouch:{x:717,y:1080},analysisTouch:{x:690,y:1430}});
export function touchPose(time,touch,target){
 const d=time-touch;if(d<-.55||d>.35)return null;
 let x=target.x,y=target.y,pressure=0;
 if(d<-.12){const p=smooth((d+.55)/.43);x=1060+(target.x-1060)*p;y=target.y+200*(1-p)-35*Math.sin(Math.PI*p);}
 else if(d<=.12){pressure=d<0?smooth((d+.12)/.12):1-smooth(d/.12);y+=2*pressure;}
 else{const p=smooth((d-.12)/.23);x+=(1150-target.x)*p;y+=160*p;}
 return {x,y,pressure,touch,d};
}
export function createPhoneDemo(E,{left,right,events,setup,screenTheme='light',rightHandScale=.53}){
 if(!validateSetup(setup))throw Error('Invalid ETH demo setup');
 const {ctx,C,type,label,panel,tag,rounded,stroke,brandPlate,disc}=E;
 const g=PHONE_GEOMETRY;
 const dark=screenTheme==='dark',ink=dark?'#F3EFE9':'#050718',muted=dark?'#B0B9CD':'#526076',screenFill=dark?'#090E23':'#F9FAFC',cardFill=dark?'#121A32':'#FFFFFF',edge=dark?'#414A67':'#C7CBD6',active=dark?'#5FCDC9':'#167B78';
 if(rightHandScale<=0||rightHandScale>1.5)throw Error('Invalid hand calibration');
 function frame(){
  ctx.save();ctx.shadowColor='#05071824';ctx.shadowBlur=24;ctx.shadowOffsetY=12;ctx.drawImage(left,g.asset.x,g.asset.y,left.width*g.asset.scale,left.height*g.asset.scale);ctx.restore();
  // Fully replaces the blank glass; round corners preserve the original titanium bezel.
  ctx.save();rounded(g.screen.x,g.screen.y,g.screen.w,g.screen.h,g.screen.r);ctx.clip();ctx.fillStyle=screenFill;ctx.fillRect(g.screen.x,g.screen.y,g.screen.w,g.screen.h);
  type('9:41',340,635,36,ink,600);
  ctx.fillStyle='#050718';rounded(485,597,139,37,19);ctx.fill();for(let i=0;i<4;i++)stroke(697+i*10,626,697+i*10,626-7-i*4,ink,5);rounded(749,611,25,16,4);ctx.strokeStyle=ink;ctx.lineWidth=2;ctx.stroke();ctx.fillStyle=ink;ctx.fillRect(752,614,18,10);
  brandPlate(5,551,724,440,0);return ()=>ctx.restore();
 }
 function assets(time){
  type('ВЫБЕРИ АКТИВ',551,832,38,ink,700,{align:'center',maxWidth:435});
  ['BTC/USDT','ETH/USDT','SOL/USDT'].forEach((a,i)=>{const y=887+i*142,selected=i===1&&time>=events.assetTouch;
   ctx.fillStyle=selected?(dark?'#5FCDC91F':'#5FCDC92C'):cardFill;rounded(333,y,434,105,20);ctx.fill();ctx.strokeStyle=selected?active:edge;ctx.lineWidth=selected?3:1.5;ctx.stroke();type(a,354,y+67,40,ink,700,{mono:true});
   if(selected){stroke(715,y+54,729,y+68,active,4);stroke(729,y+68,748,y+36,active,4);}
  });
  const enabled=time>=events.assetTouch,pressure=clamp(1-Math.abs(time-events.analysisTouch)/.12);ctx.fillStyle=enabled?(pressure>.01?'#45B8B3':'#5FCDC9'):(dark?'#202A44':'#E2E4EB');rounded(333,1375,434,112,23);ctx.fill();type('AI-АНАЛИЗ',550,1448,42,enabled?'#050718':muted,800,{align:'center',maxWidth:406});
 }
 function analysis(time){
  type('AI-АНАЛИЗ',551,840,48,ink,800,{align:'center'});type(setup.asset,551,915,39,ink,700,{align:'center',mono:true});
  drawTradingChart(E,{x:347,y:989,w:406,h:300},{time:time-events.analysis,setup,labels:false,fvg:true,orderBlock:true,scan:true,progress:reveal(time,events.analysis,.4)});
  const list=['СВЕЧИ И ЗОНЫ','ЛИКВИДНОСТЬ','ЛОГИКА СЕТАПА'],index=Math.min(2,Math.floor((time-events.analysis)/.6));label(list[index],551,1405,C.cyan,36,{align:'center',maxWidth:427});
  const p=clamp((time-events.analysis)/(events.setup-events.analysis));ctx.fillStyle=dark?'#27324A':'#DDE2E8';rounded(351,1470,400,8,4);ctx.fill();ctx.fillStyle='#7A52EE';rounded(351,1470,Math.max(8,400*p),8,4);ctx.fill();
 }
 function result(time){
  type(setup.asset,551,840,43,ink,800,{align:'center',mono:true});tag('LONG',604,874,164,C.green,{size:36,height:58});label('СЦЕНАРИЙ',335,917,C.muted,36);
  const n=(time>=events.entry?1:0)+(time>=events.stop?1:0)+(time>=events.targets?3:0);
  drawTradingChart(E,{x:349,y:985,w:404,h:190},{time,setup,labels:false,levels:n});
  const rows=[['ENTRY',setup.entry,C.cyan,events.entry],['STOP',setup.stop,C.red,events.stop],...setup.targets.map((p,i)=>[`TP ${i+1}`,p,i?C.cyan:C.green,events.targets+i*.1])];
  rows.forEach(([s,p,c,start],i)=>{const k=reveal(time,start,.22);ctx.save();ctx.globalAlpha*=k;type(s,340,1235+i*67,38,c,700);type(price(p),766,1235+i*67,38,ink,600,{align:'right',mono:true});ctx.restore();});
 }
 function hand(time){
  const taps=[{at:events.assetTouch,target:g.assetTouch,kind:'select-ethereum'},{at:events.analysisTouch,target:g.analysisTouch,kind:'run-analysis'}];const action=taps.find(a=>time>=a.at-.55&&time<=a.at+.35);if(!action)return null;
  const pose=touchPose(time,action.at,action.target);
  ctx.save();if(pose.pressure>0){ctx.shadowColor='#05071866';ctx.shadowBlur=12-6*pose.pressure;ctx.globalAlpha*=.2+.2*pose.pressure;ctx.fillStyle='#050718';ctx.beginPath();ctx.ellipse(pose.x+6,pose.y+10,21,12,0,0,2*Math.PI);ctx.fill();}ctx.restore();
  // Slight compression and pitch give a controlled touch/release; the supporting hand stays fixed.
  ctx.save();ctx.translate(pose.x,pose.y);ctx.rotate(-.035*pose.pressure);const scale=rightHandScale*(1-.025*pose.pressure);ctx.scale(scale,scale*(1-.012*pose.pressure));ctx.shadowColor='#05071826';ctx.shadowBlur=10;ctx.drawImage(right,-g.fingerSource.x,-g.fingerSource.y);ctx.restore();
  if(pose.d>=0&&pose.d<.3){const p=pose.d/.3;ctx.save();ctx.globalAlpha*=1-p;ctx.strokeStyle=active;ctx.lineWidth=2;ctx.beginPath();ctx.arc(action.target.x,action.target.y,19+25*p,0,2*Math.PI);ctx.stroke();ctx.restore();}
  return {...pose,kind:action.kind,target:action.target,scale,baseScale:rightHandScale};
 }
 function render(time){
  const k=reveal(time,events.open,.65);ctx.save();ctx.globalAlpha*=k;ctx.translate(0,45*(1-k));const restore=frame();
  const phase=time<events.analysis?'asset':time<events.setup?'analysis':'setup';
  if(phase==='asset')assets(time);else if(phase==='analysis')analysis(time);else result(time);
  label('ДЕМО',551,1580,muted,36,{align:'center'});restore();const pose=hand(time);ctx.restore();
  return {phase,pose,geometry:g,screenTheme,rightHandScale,selectedAsset:time>=events.assetTouch?setup.asset:null};
 }
 return {render,geometry:g};
}
