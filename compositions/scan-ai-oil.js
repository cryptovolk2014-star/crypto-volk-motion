import {createFintechEngine,clamp,reveal,smooth} from '../components/fintech.js';
import {createCommodityMarket,commodityPrice} from '../components/commodity-market.js';
const load=url=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>reject(Error('Missing asset '+url));im.src=url;});
export async function createComposition(canvas,config){
 const E=createFintechEngine(canvas,{minFont:36,small:38}),{ctx,C,type,label,title,panel,tag,stroke,disc,rounded,contain,brandPlate,telegram,background}=E;
 const brand={logo:'assets/brand/clean/cryptovolk-logo.png',plate:'assets/brand/clean/scan-ai-plate.png'},barrelPath='assets/commodities/oil-barrel.png';
 const [logo,plate,barrel,envelope]=await Promise.all([load(brand.logo),load(brand.plate),load(barrelPath),fetch(config.envelope).then(r=>r.json())]);E.setBrandAssets({logo,plate});
 const market=createCommodityMarket(E,config.setup);let state={},sceneAudit=[];
 const alpha=(a,draw)=>{if(a<=.001)return;ctx.save();ctx.globalAlpha*=clamp(a);draw();ctx.restore();};
 function top(a,b,t,{size=110,second=size,accent=C.cyan}={}){title(a,407,t,0,C.ivory,size);title(b,532,t,.07,accent,second);}
 function chartPanel(t,{x=80,y=711,w=920,h=745,scan=false,levels=0,active='',zones=false}={}){
  panel(x,y,w,h,{accent:active==='risk'?C.red:C.cyan});type('BRENT',x+46,y+85,46,C.ivory,800);tag('SHORT',x+w-247,y+32,200,C.red,{size:38,height:67});
  const result=market.chart({x:x+58,y:y+159,w:w-116,h:h-339},{time:t,progress:reveal(t,0,.6),scan,levels,active,zones});
  stroke(x+46,y+h-128,x+w-46,y+h-128,'#99ADD332');label('XBRUSD · ДЕМО',x+46,y+h-58,C.muted,38,{mono:true});
  label(scan?'AI-АНАЛИЗ':active==='entry'?'ТОЧКА ВХОДА':active==='target'?'ЦЕЛЬ СДЕЛКИ':active==='risk'?'ОГРАНИЧЕНИЕ РИСКА':'ПЛАН СДЕЛКИ',x+w-46,y+h-58,active==='risk'?C.red:C.cyan,36,{align:'right',maxWidth:550});return result;
 }
 function barrelHero(local){
  const k=reveal(local,0,.48),settle=smooth(local/1.1);ctx.save();ctx.globalAlpha*=k;ctx.translate(642,1051+80*(1-k));ctx.rotate(-.07+.035*settle);ctx.scale(.90+.10*k,.90+.10*k);ctx.shadowColor='#00000080';ctx.shadowBlur=45;contain(barrel,-500,-500,1000,1000);ctx.restore();
 }
 function hook(local,time){
  top('НЕФТЬ','СЛИВАЕТСЯ?',local,{size:132,second:105,accent:C.red});
  alpha(reveal(local,.05,.3),()=>{ctx.save();ctx.fillStyle='#FF708912';rounded(80,704,920,815,45);ctx.fill();market.chart({x:123,y:830,w:800,h:536},{time:local,progress:reveal(local,0,.65),fall:true});ctx.restore();});
  barrelHero(local);alpha(reveal(local,.26,.4),()=>{tag('BRENT',90,727,230,C.ivory,{size:40});market.downImpulse({x:112,y:1060,w:264,h:340},local);});
  label('А ЧТО, ЕСЛИ УВИДЕТЬ ЗАРАНЕЕ?',540,1625,C.ivory,38,{align:'center',maxWidth:920});state={phase:'oil-hook'};
 }
 function forecast(local,time){
  top('НЕ ПРОСТО','ПРОГНОЗ.',local,{size:109,second:123,accent:C.ivory});
  panel(80,724,920,704,{accent:C.red});type('BRENT / XBRUSD',128,815,43,C.ivory,700,{mono:true});
  market.chart({x:140,y:915,w:790,h:330},{time:local,progress:reveal(local,0,.45),fall:true});
  alpha(reveal(local,.2,.35),()=>{type('?',829,1254,168,C.red,800,{align:'center'});tag('ЧТО ДАЛЬШЕ?',126,1315,554,C.red,{size:43});});
  label('НЕФТЬ · АНАЛИЗ РЫНКА',540,1596,C.muted,38,{align:'center',maxWidth:920});state={phase:'forecast'};
 }
 function plan(local,time){
  top('ЦЕЛЫЙ ПЛАН','СДЕЛКИ.',local,{size:105,second:128});
  const rows=[['01','ВХОД','Где рассмотреть сделку',C.cyan],['02','ЦЕЛЬ','Куда направлен сценарий',C.green],['03','РИСК','Где ограничить риск',C.red]];
  rows.forEach(([n,main,sub,c],i)=>{const k=reveal(local,.1+i*.17,.5),y=733+i*237;ctx.save();ctx.globalAlpha*=k;ctx.translate(45*(1-k),0);panel(80,y,920,200,{accent:c});tag(n,117,y+53,120,c,{size:44,height:88});type(main,280,y+83,57,C.ivory,800);label(sub,280,y+146,C.muted,38,{maxWidth:670});ctx.restore();if(i<2)stroke(177,y+203,177,y+232,C.cyan+'66',3);});
  label('СТРУКТУРА ВМЕСТО ОДНОГО ПРОГНОЗА',540,1588,C.cyan,38,{align:'center',maxWidth:920});state={phase:'plan'};
 }
 function analysis(local,time){
  const scanning=time>=config.cues.scan;
  top(scanning?'РАЗБИРАЕТ':'МЫ СОЗДАЛИ',scanning?'ГРАФИК.':'AI-БОТА.',scanning?time-config.cues.scan:local,{size:105,second:125});
  brandPlate(local,540,658,890,0);
  const k=reveal(local,.15,.6);alpha(k,()=>{ctx.save();ctx.translate(0,45*(1-k));chartPanel(local,{y:817,h:700,scan:scanning,zones:scanning});ctx.restore();});
  if(scanning){const sy=816+((time-config.cues.scan)/1.72%1)*690;ctx.save();ctx.beginPath();ctx.rect(80,817,920,700);ctx.clip();const g=ctx.createLinearGradient(0,sy-65,0,sy);g.addColorStop(0,'#5FCDC900');g.addColorStop(1,'#5FCDC924');ctx.fillStyle=g;ctx.fillRect(80,sy-65,920,65);stroke(80,sy,1000,sy,C.cyan,2);ctx.restore();}
  label(scanning?'СВЕЧИ · ЦЕНОВЫЕ ЗОНЫ · УРОВНИ':'SCAN AI · АНАЛИЗ НЕФТИ',540,1615,C.cyan,38,{align:'center',maxWidth:920});state={phase:scanning?'ai-analysis':'ai-bot'};
 }
 function levels(local,time){
  const c=config.cues,active=time>=c.riskAction?'risk':time>=c.target?'target':'entry',name=active==='entry'?'ВХОД':active==='target'?'ЦЕЛЬ':'РИСК',color=active==='risk'?C.red:active==='target'?C.green:C.cyan;
  top(active==='risk'?'ОГРАНИЧЬ':active==='target'?'ПОСТАВЬ':'РАССМОТРИ',name+'.',time-(active==='risk'?c.riskAction:active==='target'?c.target:10.52),{size:105,second:132,accent:color});
  const n=time>=c.risk?3:time>=c.target?2:time>=c.entry?1:0,result=chartPanel(local,{y:713,h:705,levels:n,active,zones:true});
  const items=[['ВХОД',config.setup.entry,C.cyan,c.entry],['ЦЕЛЬ',config.setup.targets[0],C.green,c.target],['СТОП',config.setup.stop,C.red,c.risk]];
  items.forEach(([s,p,col,start],i)=>{const k=reveal(time,start-.15,.35);alpha(k,()=>{const x=80+i*317;panel(x,1476,286,170,{accent:col});label(s,x+26,1530,col,36);type(commodityPrice(p),x+26,1608,49,C.ivory,700,{mono:true});});});
  state={phase:'setup-'+active,active,renderedLevels:result.levels.map(({id,p,y})=>({id,price:p,y})),setup:config.setup};
 }
 function telegramScene(local,time){
  top('ВСЁ ЭТО —','В TELEGRAM.',local,{size:115,second:100});
  panel(80,711,920,798,{accent:C.cyan});telegram(180,815,53);type('SCAN AI',269,812,55,C.ivory,800);label('АНАЛИЗ НЕФТИ',269,872,C.cyan,38);
  stroke(126,927,954,927,'#7F9BC444');type('BRENT / XBRUSD',126,1008,43,C.ivory,700,{mono:true});tag('SHORT',746,955,208,C.red,{size:38});
  market.chart({x:143,y:1083,w:785,h:231},{time:local,levels:3,zones:true});
  const entries=[['ВХОД',78.4,C.cyan],['ЦЕЛЬ',76.2,C.green],['СТОП',79.6,C.red]];entries.forEach(([s,p,c],i)=>{const x=127+i*282;label(s,x,1385,c,36);type(commodityPrice(p),x,1450,43,C.ivory,700,{mono:true});});
  label('ПЛАН СДЕЛКИ ПРЯМО В TELEGRAM',540,1615,C.cyan,38,{align:'center',maxWidth:920});state={phase:'telegram'};
 }
 function offer(local,time){
  const c=config.cues;alpha(1-reveal(time,c.three-.2,.18),()=>top('САМОЕ','ИНТЕРЕСНОЕ.',local,{size:127,second:102}));
  alpha(reveal(time,c.three,.28),()=>{title('3 АНАЛИЗА',407,time-c.three,0,C.ivory,119);alpha(reveal(time,c.free-.08,.25),()=>type('БЕСПЛАТНО',80,543,105,C.cyan,800,{maxWidth:920}));});
  [0,1,2].forEach(i=>{const k=reveal(time,18.65+i*.23,.55),x=80+i*316,y=786+(i===1?-30:15);ctx.save();ctx.globalAlpha*=k;ctx.translate(0,70*(1-k));const angle=(i-1)*.038*smooth((time-18.65)/.65);ctx.translate(x+143,y+270);ctx.rotate(angle);ctx.translate(-x-143,-y-270);panel(x,y,288,551,{accent:i===1?C.cyan:C.violet});type(String(i+1).padStart(2,'0'),x+144,y+128,103,i===1?C.cyan:C.ivory,800,{align:'center'});label('BRENT',x+144,y+213,C.muted,36,{align:'center',mono:true});market.chart({x:x+35,y:y+270,w:218,h:123},{time:local,progress:reveal(time,18.7+i*.23,.6)});tag('АНАЛИЗ',x+25,y+444,238,C.cyan,{size:36});ctx.restore();});
  label(time>=c.free?'АБСОЛЮТНО БЕСПЛАТНО':'ПОЛУЧИ ТРИ АНАЛИЗА',540,1588,C.ivory,40,{align:'center',maxWidth:920});state={phase:time>=c.free?'free':'three-analyses'};
 }
 function cta(local,time){
  top('ВЫБИРАЙ','НЕФТЬ.',local,{size:115,second:132});
  alpha(reveal(local,.08,.65),()=>{ctx.save();ctx.shadowColor='#7A52EE30';ctx.shadowBlur=42;ctx.fillStyle='#050718';rounded(193,592,694,594,145);ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle='#7A52EE55';ctx.lineWidth=2;ctx.stroke();contain(logo,274,614,532,529);ctx.restore();});
  brandPlate(local,540,1271,940,.12);
  alpha(reveal(local,.25,.5),()=>{ctx.fillStyle=C.cyan;rounded(80,1450,920,118,28);ctx.fill();telegram(147,1509,31);type('ПОСМОТРИ, ЧТО ПОКАЖЕТ БОТ',572,1525,42,C.navy,800,{align:'center',maxWidth:725});});
  label('3 АНАЛИЗА · БЕСПЛАТНО',540,1641,C.ivory,39,{align:'center',maxWidth:920});state={phase:'final-cta'};
 }
 const scenes=[hook,forecast,plan,analysis,levels,telegramScene,offer,cta];
 function footer(t,index){
  type('CRYPTO VOLK',80,143,36,C.ivory,800);tag('SCAN AI',780,96,220,C.cyan,{size:38});stroke(80,200,1000,200,'#7785A349');
  const names=['НЕФТЬ / ИМПУЛЬС ВНИЗ','БОЛЬШЕ, ЧЕМ ПРОГНОЗ','ПЛАН ВОЗМОЖНОЙ СДЕЛКИ','AI / АНАЛИЗ ГРАФИКА','ВХОД · ЦЕЛЬ · РИСК','АНАЛИЗ В TELEGRAM','ТРИ АНАЛИЗА БЕСПЛАТНО','ВЫБИРАЙ НЕФТЬ'];label(`${String(index+1).padStart(2,'0')} / ${names[index]}`,80,278,C.muted,38,{maxWidth:920});
  stroke(80,1732,1000,1732,'#7785A349');label('SCAN AI',80,1800,C.ivory,36);label('ДЕМО · НЕ КОТИРОВКА',1000,1800,C.muted,36,{align:'right'});
  ctx.fillStyle='#313A50';rounded(80,1830,920,4,2);ctx.fill();ctx.fillStyle=C.cyan;rounded(80,1830,Math.max(4,t/config.duration*920),4,2);ctx.fill();label(`${String(Math.floor(t)).padStart(2,'0')} / ${config.duration}`,80,1890,C.muted,36,{mono:true});
  for(let j=0;j<24;j++){const amp=envelope[Math.max(0,Math.floor((t-(23-j)*.02)*40))]||0,h=5+amp*28;stroke(801+j*8.3,1873-h/2,801+j*8.3,1873+h/2,j<14?C.violet:C.cyan,3);}
 }
 function render(seconds){
  const t=clamp(seconds,0,config.duration-.001),index=config.scenes.findLastIndex(s=>s.start<=t),local=t-config.scenes[index].start;E.resetAudit();E.setTheme('dark');background(t);
  if(index>0&&local<.30){const p=smooth(local/.30),cut=1080*(1-p);ctx.save();ctx.beginPath();ctx.rect(0,0,cut,1920);ctx.clip();ctx.translate(-32*p,0);scenes[index-1](t-config.scenes[index-1].start,t);ctx.restore();ctx.save();ctx.beginPath();ctx.rect(cut,0,1080-cut,1920);ctx.clip();ctx.translate(32*(1-p),0);scenes[index](local,t);ctx.restore();stroke(cut,350,cut,1660,C.cyan+'65',2);}else scenes[index](local,t);
  sceneAudit=E.getAudit().slice();footer(t,index);window.lastTextAudit=E.getAudit();window.sceneTextAudit=sceneAudit;window.lastSceneState={...state,scene:config.scenes[index].id,time:t,local,theme:'dark',intentionalOverlay:index>0&&local<.3};return window.lastSceneState;
 }
 return {render,config,brand,barrelPath,setup:config.setup,validateSetup:market.validate,getAudit:()=>sceneAudit};
}
