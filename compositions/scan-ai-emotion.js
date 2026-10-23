import {createFintechEngine,clamp,reveal,smooth} from '../components/fintech.js';
import {drawThemeReveal} from '../components/theme-reveal.js';
import {createVideoLayer} from '../components/video-layer.js';
import {createForexJourney} from '../components/forex-journey.js';
import {drawTradingChart} from '../components/trading-setup.js';
const load=url=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>reject(Error('Missing brand '+url));im.src=url;});
export async function createComposition(canvas,config){
 const E=createFintechEngine(canvas,{minFont:36,small:38}),{ctx,C,type,label,title,panel,tag,stroke,disc,trace,rounded,contain,brandPlate,background,telegram}=E;
 const brand={logo:'assets/brand/clean/cryptovolk-logo.png',plate:'assets/brand/clean/scan-ai-plate.png'};
 const [logo,plate,envelope,video]=await Promise.all([load(brand.logo),load(brand.plate),fetch(config.envelope).then(r=>r.json()),createVideoLayer(E,config.videoClips)]);E.setBrandAssets({logo,plate});
 const journey=createForexJourney(E,{events:config.cues,setup:config.setup});let state={},sceneAudit=[];
 const alpha=(a,draw)=>{if(a<=.001)return;ctx.save();ctx.globalAlpha*=clamp(a);draw();ctx.restore();};
 function top(a,b,t,{size=109,second=size,accent=C.cyan}={}){title(a,407,t,0,C.ivory,size);title(b,532,t,.07,accent,second);}
 function problem(local,time){
  if(time<1.84)top('СМОТРИШЬ','НА ГРАФИК?',local,{size:109,second:104,accent:C.ivory});else top('И НЕ','ПОНИМАЕШЬ?',time-1.84,{size:128,second:100,accent:C.ivory});
  const layer=video.draw('despair',time);
  const cards=[['ПОКУПАТЬ?',126,725,458,C.green,config.cues.buy],['ПРОДАВАТЬ?',108,1394,510,C.red,config.cues.sell],['ЖДАТЬ?',650,1495,308,C.ivory,config.cues.wait]];
  cards.forEach(([s,x,y,w,c,start])=>{const k=reveal(time,start,.33);ctx.save();ctx.globalAlpha*=k;ctx.translate((x<600?-26:26)*(1-k),0);panel(x,y,w,85,{accent:c,fill:'#080D20'});type(s,x+w/2,y+58,46,c,800,{align:'center',maxWidth:w-35});ctx.restore();});
  state={phase:'doubt',video:layer,faceBounds:layer.faceBounds};
 }
 function minute(local,time){
  const key=config.cues.less;
  if(time<key)top('АНАЛИЗ','РЫНКА?',local,{size:124,second:127});else top('МЕНЬШЕ','1 МИНУТЫ.',time-key,{size:123,second:114,accent:C.violet});
  panel(80,717,920,787,{accent:C.violet});
  const sweep=reveal(local,.1,1.3);ctx.save();ctx.translate(540,1050);ctx.strokeStyle=C.line;ctx.lineWidth=13;ctx.beginPath();ctx.arc(0,0,225,-Math.PI/2,Math.PI*1.5);ctx.stroke();ctx.strokeStyle=C.cyan;ctx.lineCap='round';ctx.beginPath();ctx.arc(0,0,225,-Math.PI/2,-Math.PI/2+Math.PI*1.87*sweep);ctx.stroke();ctx.restore();
  type('< 01:00',540,1089,123,C.ivory,700,{align:'center',mono:true,maxWidth:795});label('ВРЕМЯ ДЛЯ АНАЛИЗА',540,1387,C.muted,40,{align:'center'});
  brandPlate(time-key,540,1590,720,0);state={phase:time<key?'time-question':time<config.themeTransition.end?'dark-light-reveal':'under-one-minute',timerKind:'illustrative-threshold-not-measured-result'};
 }
 function pair(local,time){top(time<config.cues.pairs?'ОТКРОЙ':'ВЫБЕРИ',time<config.cues.pairs?'SCAN AI.':'ВАЛЮТНУЮ ПАРУ.',time<config.cues.pairs?local:time-config.cues.pairs,{size:114,second:time<config.cues.pairs?118:78});state={phase:'pair-selection',journey:journey.render(time)};journey.stages(time);}
 function mode(local,time){top('ВЫБЕРИ','СРОК ТОРГОВЛИ.',local,{size:116,second:88,accent:C.violet});state={phase:'horizon-selection',selected:time<config.cues.mediumTerm?'short':'medium',journey:journey.render(time)};journey.stages(time);}
 function analysis(local,time){top('AI АНАЛИЗИРУЕТ','РЫНОК.',local,{size:88,second:132});state={phase:'ai-analysis',journey:journey.render(time)};journey.stages(time);}
 function setup(local,time){top('ГОТОВЫЙ','АНАЛИЗ.',local,{size:117,second:129});state={phase:time>=config.cues.explain?'explanation':time>=config.cues.targets?'take-profits':time>=config.cues.stop?'stop-loss':time>=config.cues.entry?'entry':time>=config.cues.direction?'direction':'setup-reveal',journey:journey.render(time),setup:config.setup};journey.stages(time);}
 function clarity(local,time){
  if(time<config.cues.logic)top('БЕЗ','ДОГАДОК.',local,{size:130,second:120});else top('ПОНЯТНАЯ','ЛОГИКА.',time-config.cues.logic,{size:110,second:130,accent:C.violet});
  const layer=video.draw('joy',time);ctx.fillStyle='#F3EFE9';rounded(124,1416,832,68,18);ctx.fill();ctx.strokeStyle=C.cyan;ctx.lineWidth=1.5;ctx.stroke();type('СТРУКТУРА ВМЕСТО ДОГАДОК',540,1463,38,C.cyan,700,{align:'center',maxWidth:800});label('ЯСНОСТЬ В АНАЛИЗЕ',540,1620,C.violet,42,{align:'center'});
  state={phase:time<config.cues.logic?'no-guesses':'clear-logic',video:layer,faceBounds:layer.faceBounds};
 }
 function offer(local,time){
  const c=config.cues;alpha(1-reveal(time,c.three-.18,.18),()=>top('САМОЕ','ИНТЕРЕСНОЕ.',local,{size:127,second:101}));
  alpha(reveal(time,c.three,.24),()=>{title('3 АНАЛИЗА',407,time-c.three,0,C.ivory,119);alpha(reveal(time,c.free,.25),()=>type('БЕСПЛАТНО',80,540,105,C.violet,800,{maxWidth:920}));});
  [0,1,2].forEach(i=>{const start=31.45+i*.23,k=reveal(time,start,.55),x=80+i*316,y=788+(i===1?-30:15),cx=x+144;ctx.save();ctx.globalAlpha*=k;ctx.translate(0,60*(1-k));ctx.translate(cx,y+270);ctx.rotate((i-1)*.038*smooth((time-start)/.65));ctx.translate(-cx,-y-270);panel(x,y,288,551,{accent:i===1?C.cyan:C.violet});type(String(i+1).padStart(2,'0'),cx,y+128,103,i===1?C.cyan:C.ivory,800,{align:'center'});label('EUR/USD',cx,y+210,C.muted,36,{align:'center',mono:true});drawTradingChart(E,{x:x+35,y:y+270,w:218,h:123},{time:local,setup:config.setup,labels:false,progress:reveal(time,start,.6)});tag('АНАЛИЗ',x+25,y+444,238,C.violet,{size:36});ctx.restore();});
  label(time>=c.free?'СОВЕРШЕННО БЕСПЛАТНО':'ПОЛУЧИ ТРИ АНАЛИЗА',540,1597,C.ivory,40,{align:'center',maxWidth:920});state={phase:time>=c.free?'free-offer':'three-analyses'};
 }
 function cta(local,time){
  top('ПОПРОБУЙ','И ОЦЕНИ.',local,{size:111,second:123,accent:C.violet});
  alpha(reveal(local,.1,.65),()=>{ctx.save();ctx.shadowColor='#7A52EE28';ctx.shadowBlur=42;ctx.fillStyle='#050718';rounded(193,592,694,594,145);ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle='#7A52EE55';ctx.lineWidth=2;ctx.stroke();contain(logo,274,614,532,529);ctx.restore();});
  brandPlate(local,540,1271,940,.12);
  alpha(reveal(local,.25,.5),()=>{ctx.fillStyle='#5FCDC9';rounded(80,1450,920,118,28);ctx.fill();telegram(148,1509,31);type('ОТКРОЙ SCAN AI',570,1526,50,'#050718',800,{align:'center',maxWidth:720});});label('3 АНАЛИЗА · БЕСПЛАТНО',540,1641,C.ivory,39,{align:'center',maxWidth:920});state={phase:'final-cta'};
 }
 const scenes=[problem,minute,pair,mode,analysis,setup,clarity,offer,cta];
 function footer(t,index){
  type('CRYPTO VOLK',80,143,36,C.ivory,800);tag('SCAN AI',780,96,220,C.cyan,{size:38});stroke(80,200,1000,200,C.line+'60');
  const names=['ПОКУПАТЬ · ПРОДАВАТЬ · ЖДАТЬ','МЕНЬШЕ ОДНОЙ МИНУТЫ','ВЫБЕРИ ВАЛЮТНУЮ ПАРУ','КРАТКО- И СРЕДНЕСРОЧНО','AI АНАЛИЗИРУЕТ РЫНОК','СЦЕНАРИЙ И ЛОГИКА','ОТ СОМНЕНИЙ К ЯСНОСТИ','ТРИ АНАЛИЗА БЕСПЛАТНО','ПОПРОБУЙ И ОЦЕНИ'];label(`${String(index+1).padStart(2,'0')} / ${names[index]}`,80,278,C.muted,38,{maxWidth:920});
  stroke(80,1732,1000,1732,C.line+'60');label('SCAN AI',80,1800,C.ivory,36);label(index>=2&&index<=5?'ДЕМО · EUR/USD':'CRYPTO VOLK',1000,1800,C.muted,36,{align:'right'});
  ctx.fillStyle=C.line;rounded(80,1830,920,4,2);ctx.fill();ctx.fillStyle=C.cyan;rounded(80,1830,Math.max(4,t/config.duration*920),4,2);ctx.fill();label(`${String(Math.floor(t)).padStart(2,'0')} / ${config.duration}`,80,1890,C.muted,36,{mono:true});
  for(let j=0;j<24;j++){const amp=envelope[Math.max(0,Math.floor((t-(23-j)*.02)*40))]||0,h=5+amp*28;stroke(801+j*8.3,1873-h/2,801+j*8.3,1873+h/2,j<14?C.violet:C.cyan,3);}
 }
 function scene(t,index,local){
  background(t);
  if(index>0&&![3,4,5].includes(index)&&local<.3){const p=smooth(local/.3),cut=1080*(1-p);ctx.save();ctx.beginPath();ctx.rect(0,0,cut,1920);ctx.clip();ctx.translate(-32*p,0);scenes[index-1](t-config.scenes[index-1].start,t);ctx.restore();ctx.save();ctx.beginPath();ctx.rect(cut,0,1080-cut,1920);ctx.clip();ctx.translate(32*(1-p),0);scenes[index](local,t);ctx.restore();stroke(cut,350,cut,1665,C.cyan+'65',2);}else scenes[index](local,t);
  sceneAudit=E.getAudit().slice();footer(t,index);
 }
 function render(seconds){const t=clamp(seconds,0,config.duration-.001),index=config.scenes.findLastIndex(s=>s.start<=t),local=t-config.scenes[index].start;E.resetAudit();drawThemeReveal(E,{time:t,start:config.themeTransition.start,end:config.themeTransition.end,draw:()=>scene(t,index,local)});window.lastTextAudit=E.getAudit();window.sceneTextAudit=sceneAudit;window.lastSceneState={...state,scene:config.scenes[index].id,time:t,local,theme:t<config.themeTransition.start?'dark':t>=config.themeTransition.end?'light':'transition',intentionalOverlay:(index>0&&local<.3)||t>=config.themeTransition.start&&t<config.themeTransition.end};return window.lastSceneState;}
 return {render,prepareFrame:t=>video.prepare(clamp(t,0,config.duration-.001)),config,brand,setup:config.setup,validateSetup:journey.validate,getAudit:()=>sceneAudit};
}
