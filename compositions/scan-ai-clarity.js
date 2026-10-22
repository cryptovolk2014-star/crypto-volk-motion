import {drawThemeReveal} from '../components/theme-reveal.js';
import {createFintechEngine,clamp,reveal,smooth} from '../components/fintech.js';
import {createMarketToSetup,drawTradingChart,DEMO_SETUP,validateSetup,token3D,price} from '../components/trading-setup.js';
const loadImage=url=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>reject(new Error('Missing transparent brand asset: '+url));im.src=url;});
export async function createComposition(canvas,config){
 const E=createFintechEngine(canvas,{minFont:36,small:38}),{ctx,C,type,label,title,panel,tag,stroke,disc,trace,rounded,contain,brandPlate,telegram,caption,group,background}=E;
 const brand={logo:'assets/brand/clean/cryptovolk-logo.png',plate:'assets/brand/clean/scan-ai-plate.png'};
 const [logo,plate,envelope]=await Promise.all([loadImage(brand.logo),loadImage(brand.plate),fetch(config.envelope).then(r=>r.json())]);E.setBrandAssets({logo,plate});
 const journey=createMarketToSetup(E,{events:config.journey,setup:DEMO_SETUP});let lastState={},sceneAudit=[];
 const alpha=(a,draw)=>{if(a<=0)return;ctx.save();ctx.globalAlpha*=clamp(a);draw();ctx.restore();};
 function topTwo(a,b,t,{size=110,secondSize=size,color=C.ivory,secondColor=C.cyan}={}){title(a,407,t,0,color,size);title(b,526,t,.09,secondColor,secondSize);}
 function footer(t,index){
  type('CRYPTO VOLK',80,143,36,C.ivory,800);tag('SCAN AI',780,96,220,C.cyan,{size:38,height:64});stroke(80,200,1000,200,'#7785A349');
  const short=['РЫНОК','ДВА МНЕНИЯ','ЗНАНИЯ И СОМНЕНИЯ','ОТ СОМНЕНИЙ К ЯСНОСТИ','ПУТЬ В SCAN AI','ЛОГИКА СЦЕНАРИЯ','СЦЕНАРИЙ И ОБУЧЕНИЕ','3 СЦЕНАРИЯ БЕСПЛАТНО','ПОПРОБУЙ И ОЦЕНИ'];label(`${String(index+1).padStart(2,'0')} / ${short[index]}`,80,278,C.muted,38,{maxWidth:920});
  stroke(80,1732,1000,1732,'#7785A349');label('SCAN AI',80,1800,C.ivory,36);label(index===4||index===5?'ДЕМО · BTC/USDT':'CRYPTO VOLK',1000,1800,C.cyan,36,{align:'right'});
  ctx.fillStyle=E.getTheme()==='light'?'#CED0DB':'#313A50';rounded(80,1830,920,4,2);ctx.fill();ctx.fillStyle=C.cyan;rounded(80,1830,Math.max(4,t/config.duration*920),4,2);ctx.fill();label(`${String(Math.floor(t)).padStart(2,'0')} / ${config.duration}`,80,1890,C.muted,36,{mono:true});
  for(let j=0;j<24;j++){const amp=envelope[Math.max(0,Math.floor((t-(23-j)*.02)*40))]||0,h=5+amp*28;stroke(801+j*8.3,1873-h/2,801+j*8.3,1873+h/2,j<14?C.violet:C.cyan,3);}
 }
 function wireCube(x,y,size,t){
  const a=.2+.14*Math.sin(t*.7),b=.45+.1*Math.sin(t*.4),verts=[];
  for(const z of [-1,1])for(const yy of [-1,1])for(const xx of [-1,1]){let rx=xx*Math.cos(b)+z*Math.sin(b),rz=-xx*Math.sin(b)+z*Math.cos(b),ry=yy*Math.cos(a)-rz*Math.sin(a);rz=yy*Math.sin(a)+rz*Math.cos(a);const k=3.8/(3.8+rz*.6);verts.push([x+rx*size*k,y+ry*size*k]);}
  const edges=[[0,1],[0,2],[0,4],[1,3],[1,5],[2,3],[2,6],[3,7],[4,5],[4,6],[5,7],[6,7]];for(const [i,j] of edges)trace([verts[i],verts[j]],C.violet+'50',1.4,4);
 }
 function hook(local,time){
  const tired=1-reveal(local,1.38,.18),question=reveal(local,1.56,.35);
  alpha(question,()=>topTwo('КУДА ПОЙДЁТ','РЫНОК?',local-1.46,{size:100,secondSize:126}));alpha(tired,()=>topTwo('УСТАЛ','ГАДАТЬ?',local,{size:126}));
  group(local,.1,()=>{const zoom=1+.04*smooth(local/2.5);ctx.save();ctx.translate(540,1060);ctx.scale(zoom,zoom);ctx.translate(-540,-1060);panel(100,740,880,650,{accent:C.violet});type('BTC/USDT',145,820,46,C.ivory,700,{mono:true});tag('РЫНОК',729,774,204,C.cyan,{size:36});drawTradingChart(E,{x:150,y:918,w:760,h:360},{time:local,labels:false,progress:reveal(local,.12,.7),uncertain:true,uncertaintyColors:true});
   const k=reveal(local,.5,.6)*(1-reveal(local,2.48,.22));alpha(k,()=>{ctx.save();ctx.setLineDash([12,10]);trace([[685,1195],[760,1150],[882,975]],C.green,4);trace([[685,1195],[770,1255],[890,1325]],C.red,4);ctx.restore();});ctx.restore();});
  caption('Один рынок. Слишком много догадок.','Направление меняется. Сомнения остаются.',local,.3);lastState={phase:'uncertainty'};
 }
 function opinions(local,time){
  topTwo('ОДИН РЫНОК.','ДВА МНЕНИЯ.',local,{size:99,secondSize:101});
  const cards=[{x:80,start:2.88,cue:4.2,title:'LONG',color:C.green,channel:'КАНАЛ 01',up:true},{x:565,start:4.76,cue:5.32,title:'SHORT',color:C.red,channel:'КАНАЛ 02',up:false}];
  cards.forEach(a=>{const k=reveal(time,a.start,.5);ctx.save();ctx.globalAlpha*=k;ctx.translate((a.up?-100:100)*(1-k),0);panel(a.x,737,435,635,{accent:a.color});telegram(a.x+58,809,26);label(a.channel,a.x+107,822,C.muted,36);stroke(a.x+36,866,a.x+399,866,'#ABBAD82A');
   const shown=time>=a.cue;type(shown?a.title:'МНЕНИЕ',a.x+217,985,shown?76:48,shown?a.color:C.muted,800,{align:'center'});
   const points=[.2,.35,.28,.49,.4,.66,.58,.82].map((v,i)=>[a.x+52+i*47,1205-(a.up?v:1-v)*150]);alpha(reveal(time,a.cue,.3),()=>trace(points,a.color,4));tag('TELEGRAM',a.x+35,1250,365,C.blue,{size:36,height:66});ctx.restore();});
  alpha(reveal(time,5.49,.25),()=>type('?',540,1532,137,C.ivory,800,{align:'center'}));label('ЧЬЕМУ ПРОГНОЗУ ДОВЕРЯТЬ?',540,1642,C.muted,38,{align:'center',maxWidth:920});lastState={phase:'conflicting-opinions'};
 }
 function knowledge(local,time){
  const doubt=reveal(time,10.76,.4),merge=reveal(time,9.68,.75),cardsFade=1-reveal(time,10.52,.22);
  alpha(cardsFade,()=>topTwo('ТЫ ИЗУЧИЛ…','А УВЕРЕННОСТЬ?',local,{size:110,secondSize:84}));
  const rows=[{s:'ТЕХАНАЛИЗ',start:6.56,y:704,col:C.cyan},{s:'SMART MONEY',start:7.4,y:960,col:C.violet},{s:'ОБУЧЕНИЕ',start:8.92,y:1216,col:C.blue}];
  alpha(cardsFade,()=>{ctx.save();ctx.filter=`blur(${merge*4}px)`;rows.forEach((a,i)=>{const k=reveal(time,a.start,.45),y=a.y+(985-a.y)*merge*.74;ctx.save();ctx.globalAlpha*=k;ctx.translate((i-1)*merge*38,40*(1-k));panel(80,y,920,210,{accent:a.col});type(a.s,126,y+76,46,C.ivory,700);E.miniTrend(645,y+35,285,125,a.col,1.4);if(i===0){stroke(655,y+99,930,y+99,C.cyan+'AA',2);stroke(655,y+145,930,y+145,C.red+'77',2);}else if(i===1){ctx.fillStyle=C.violet+'25';rounded(690,y+60,220,75,8);ctx.fill();}else{for(let j=0;j<3;j++)stroke(655,y+60+j*35,820+j*30,y+60+j*35,C.blue+'AA',3);}ctx.restore();});ctx.restore();});
  alpha(doubt,()=>{wireCube(540,1100,240,local);type('ВСЁ РАВНО',540,881,112,C.ivory,800,{align:'center'});type('СОМНЕВАЕШЬСЯ?',540,1013,83,C.red,800,{align:'center',maxWidth:920});tag('В МОМЕНТ СДЕЛКИ',215,1196,650,C.violet,{size:40,height:84});});
  label('Знания должны складываться в логику.',540,1617,C.muted,38,{align:'center',maxWidth:920});lastState={phase:time<10.72?'knowledge':'doubt',intentionalOverlay:time>=9.68&&time<11.3};
 }
 function question(local,time){
  const look=config.themeTransition.start,freeze=Math.min(local,2.2);
  const asking=1-reveal(time,look-.18,.18);
  alpha(asking,()=>{
   topTwo('КАК ПОСТУПИТЬ','ПРАВИЛЬНО?',local,{size:87,secondSize:104,secondColor:C.ivory});
   const settle=1-reveal(local,.25,1.5);ctx.save();ctx.globalAlpha*=.38;
   panel(125,770,830,590,{accent:C.violet});drawTradingChart(E,{x:175,y:900,w:730,h:330},{time:freeze,labels:false,uncertain:true,uncertaintyColors:true});ctx.restore();
   type('В ТАКОЙ СИТУАЦИИ?',540,1518,50,C.muted,700,{align:'center',maxWidth:920});
  });
  alpha(reveal(time,look,.15),()=>{
   const k=reveal(time,look,.24);ctx.save();ctx.translate(0,18*(1-k));
   type('СМОТРИ',540,966,126,C.ivory,800,{align:'center',maxWidth:920});ctx.restore();
   label(E.getTheme()==='light'?'СТРУКТУРА ВМЕСТО ДОГАДОК':'ОТ СОМНЕНИЙ К ЯСНОСТИ',540,1124,C.muted,40,{align:'center',maxWidth:920});
  });
  lastState={phase:time<look?'question':'dark-light-reveal',theme:E.getTheme(),transitionProgress:smooth((time-look)/(config.themeTransition.end-look)),intentionalOverlay:time>=look};
 }
 function product(local,time){journey.render(time);lastState={phase:time<config.journey.market?'brand':time<config.journey.assets?'market':time<config.journey.analysis?'asset':time<config.journey.setup?'analysis':'setup',setup:DEMO_SETUP};}
 function logic(local,time){
  const zoom=smooth(local/.52);
  alpha(1-reveal(local,0,.2),()=>{brandPlate(5,540,400,720,0);type('ГОТОВЫЙ СЦЕНАРИЙ',540,575,67,C.ivory,800,{align:'center',maxWidth:920});});
  alpha(reveal(local,.22,.35),()=>topTwo('ПОНИМАЙ ЛОГИКУ','СДЕЛКИ.',local-.22,{size:88,secondSize:121}));
  panel(80,657+(704-657)*zoom,920,893+(819-893)*zoom,{accent:C.cyan});type('BTC/USDT',127,735+(784-735)*zoom,46,C.ivory,700,{mono:true});tag('LONG',766,688+(739-688)*zoom,185,C.green,{size:40,height:63});
  let active='entry';if(time>=config.logicCues.stop)active='stop';if(time>=config.logicCues.targets)active='targets';if(time>=config.logicCues.fvg)active='fvg';if(time>=config.logicCues.orderBlock)active='orderBlock';
  const box={x:140,y:789+(857-789)*zoom,w:780+(805-780)*zoom,h:250+(553-250)*zoom};
  drawTradingChart(E,box,{time,setup:DEMO_SETUP,levels:5,active,fvg:time>=config.logicCues.fvg,orderBlock:time>=config.logicCues.orderBlock,labels:zoom>.75,labelSpace:195*zoom,activeLabelsOnly:true});
  alpha(1-reveal(local,0,.18),()=>{stroke(126,1080,952,1080,'#B0BFDE30');const rows=[['ENTRY',DEMO_SETUP.entry,C.cyan],['STOP LOSS',DEMO_SETUP.stop,C.red],...DEMO_SETUP.targets.map((p,i)=>[`TAKE PROFIT ${i+1}`,p,i?C.cyan:C.green])];rows.forEach(([s,p,c],i)=>{type(s,128,1147+i*78,38,c,700);type(price(p),951,1147+i*78,42,C.ivory,600,{align:'right',mono:true});});});
  alpha(reveal(local,.48,.3),()=>{const text=active==='entry'?'ENTRY · '+price(DEMO_SETUP.entry):active==='stop'?'STOP LOSS · '+price(DEMO_SETUP.stop):active==='targets'?'TAKE PROFIT · 3 ЦЕЛИ':active==='fvg'?'FVG / ИМБАЛАНС':'ORDER BLOCK';type(text,540,1608,active==='targets'?44:46,active==='stop'?C.red:active==='orderBlock'?C.violet:C.cyan,700,{align:'center',maxWidth:920});});lastState={phase:'explanation',active,setup:DEMO_SETUP};
 }
 function learning(local,time){
  topTwo('СЦЕНАРИЙ +','ПОНИМАНИЕ',local,{size:105,secondSize:108});const merge=reveal(time,37.66,.65);
  alpha(1-reveal(time,37.66,.22),()=>{group(local,.1,()=>{panel(80,703-merge*80,920,350,{accent:C.cyan});type('ГОТОВЫЙ СЦЕНАРИЙ',126,775-merge*80,46,C.ivory,700);drawTradingChart(E,{x:132,y:831-merge*80,w:425,h:160},{time,labels:false});label('ВХОД',648,852-merge*80,C.cyan,38);label('СТОП',648,911-merge*80,C.red,38);label('ЦЕЛИ',648,970-merge*80,C.green,38);});
   alpha(reveal(time,36.12,.5),()=>{panel(80,1124+merge*80,920,350,{accent:C.violet});type('ПОНИМАНИЕ РЫНКА',126,1196+merge*80,46,C.ivory,700);drawTradingChart(E,{x:132,y:1254+merge*80,w:425,h:160},{time,labels:false,fvg:true,orderBlock:true});label('ЛОГИКА',648,1275+merge*80,C.cyan,38);label('ЗОНЫ',648,1334+merge*80,C.violet,38);label('СТРУКТУРА',648,1393+merge*80,C.ivory,38);});
   stroke(540,1056,540,1117,C.cyan+'99',3);disc(540,1065+((local*.6)%1)*42,7,C.cyan);});
  alpha(reveal(time,37.9,.4),()=>{wireCube(540,1050,230,local);brandPlate(local,540,1070,950,0);type('РАБОТАЙ. ПОНИМАЙ.',540,1388,62,C.ivory,800,{align:'center',maxWidth:920});});label('Сценарий и обучение — одновременно.',540,1620,C.muted,38,{align:'center',maxWidth:920});lastState={phase:merge>.8?'learning-unified':'scenario-and-learning'};
 }
 function free(local,time){
  const offer=reveal(time,41.38,.35),freeWord=reveal(time,42.17,.3);alpha(1-reveal(time,41.14,.24),()=>topTwo('УВЕРЕНЫ','В SCAN AI.',local,{size:123,secondSize:116}));alpha(offer,()=>{title('3 СЦЕНАРИЯ',409,time-41.38,0,C.ivory,106);alpha(freeWord,()=>type('БЕСПЛАТНО',80,541,104,C.violet,800,{maxWidth:920}));});
  const gather=reveal(time,42.7,.25);[0,1,2].forEach(i=>{const k=reveal(time,39.04+i*.38,.65),x=80+i*285,y=791+(i===1?-31:20),cx=x+165;ctx.save();ctx.globalAlpha*=k*(1-gather);ctx.translate((540-cx)*gather,60*(1-k));ctx.translate(cx,y+260);ctx.rotate((i-1)*.048*reveal(local,.1,1));ctx.translate(-cx,-y-260);panel(x,y,330,536,{accent:i===1?C.cyan:C.violet});type(String(i+1).padStart(2,'0'),cx,y+125,104,i===1?C.cyan:C.ivory,800,{align:'center'});type('СЦЕНАРИЙ',cx,y+206,36,C.muted,700,{align:'center'});E.miniTrend(x+40,y+261,250,150,i===1?C.cyan:C.violet,1.5);tag('SCAN AI',x+38,y+446,254,C.cyan,{size:36,height:62});ctx.restore();});
  label('Оцени продукт на практике.',540,1598,C.muted,42,{align:'center'});lastState={phase:time>=42.17?'three-free-scenarios':'three-cards'};
 }
 function cta(local,time){
  topTwo('ПОПРОБУЙ','И ОЦЕНИ',local,{size:118,secondSize:122});group(local,.08,()=>{ctx.save();ctx.shadowColor='#7A52EE28';ctx.shadowBlur=36;ctx.fillStyle='#050718';rounded(160,584,760,610,170);ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle='#7A52EE55';ctx.lineWidth=2;ctx.stroke();contain(logo,250,604,580,565);ctx.restore();});brandPlate(local,540,1271,940,.1);
  group(local,.25,()=>{ctx.fillStyle='#5FCDC9';rounded(80,1450,920,118,28);ctx.fill();ctx.strokeStyle='#7A52EE';ctx.lineWidth=2;ctx.stroke();telegram(145,1509,30);type('ОТКРОЙ SCAN AI',569,1526,49,'#050718',800,{align:'center',maxWidth:730});});label('3 СЦЕНАРИЯ БЕСПЛАТНО',540,1641,C.ivory,38,{align:'center'});lastState={phase:'final-cta'};
 }
 const scenes=[hook,opinions,knowledge,question,product,logic,learning,free,cta];
 function drawScene(t,index,local){
  background(index===3?Math.min(t,14.64):t);
  // One continuous trading graph bridges the scenario and the explanation.
  if(index>0&&index!==5&&index!==4&&local<.3){const p=smooth(local/.3),cut=1080*(1-p);ctx.save();ctx.beginPath();ctx.rect(0,0,cut,1920);ctx.clip();ctx.translate(-45*p,0);scenes[index-1](t-config.scenes[index-1].start,t);ctx.restore();ctx.save();ctx.beginPath();ctx.rect(cut,0,1080-cut,1920);ctx.clip();ctx.translate(45*(1-p),0);scenes[index](local,t);ctx.restore();}
  else scenes[index](local,t);
  sceneAudit=E.getAudit().slice();footer(t,index);
 }
 function render(seconds){
  const t=clamp(seconds,0,config.duration-.001),index=config.scenes.findLastIndex(s=>s.start<=t),local=t-config.scenes[index].start;
  const {start,end}=config.themeTransition;E.resetAudit();
  drawThemeReveal(E,{time:t,start,end,draw:()=>drawScene(t,index,local)});
  window.lastTextAudit=E.getAudit();window.sceneTextAudit=sceneAudit;window.lastSceneState={...lastState,scene:config.scenes[index].id,time:t,local,theme:t>=end?'light':t>=start?'transition':'dark'};return window.lastSceneState;
 }
 return {render,config,brand,setup:DEMO_SETUP,validateSetup:()=>validateSetup(DEMO_SETUP),getAudit:()=>sceneAudit};
}
