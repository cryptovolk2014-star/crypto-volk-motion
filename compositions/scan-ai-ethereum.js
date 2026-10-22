import {drawDarkScan} from '../components/dark-scan.js';
import {createFintechEngine,clamp,reveal,smooth,ease} from '../components/fintech.js';
import {drawTradingChart,validateSetup} from '../components/trading-setup.js';
import {drawThemeReveal} from '../components/theme-reveal.js';
import {createPhoneDemo} from '../components/phone-demo.js';
const load=url=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>reject(Error('Missing asset: '+url));im.src=url;});
export async function createComposition(canvas,config){
 const E=createFintechEngine(canvas,{minFont:36,small:38}),{ctx,C,type,label,title,panel,tag,stroke,disc,trace,rounded,contain,brandPlate,telegram,background}=E;
 const brand={logo:'assets/brand/clean/cryptovolk-logo.png',plate:'assets/brand/clean/scan-ai-plate.png'},phoneAssets={left:'assets/phone/left-hand-iphone.png',right:'assets/phone/right-hand-tap.png'};
 const [logo,plate,left,right,envelope]=await Promise.all([load(brand.logo),load(brand.plate),load(phoneAssets.left),load(phoneAssets.right),fetch(config.envelope).then(r=>r.json())]);E.setBrandAssets({logo,plate});
 const setup=config.setup,phone=createPhoneDemo(E,{left,right,events:config.phoneCues,setup,...config.phoneOptions});let state={},sceneAudit=[];
 const alpha=(a,draw)=>{if(a<=0)return;ctx.save();ctx.globalAlpha*=clamp(a);draw();ctx.restore();};
 function top(a,b,t,{size=108,second=size,color=C.ivory,accent=C.cyan}={}){title(a,407,t,0,color,size);title(b,526,t,.08,accent,second);}
 function ethereum(x,y,size,time,{rotation=true}={}){
  ctx.save();ctx.translate(x,y);const yaw=rotation?.19*Math.sin(Math.min(time,1.1)*1.2):.12;ctx.scale(Math.cos(yaw),1);ctx.rotate(-.04+smooth(Math.min(time,1))*.04);
  const faces=[[[0,-1],[-.59,-.02],[0,.3],'#D6D7F6'],[[0,-1],[.59,-.02],[0,.3],'#7A52EE'],[[-.59,-.02],[0,-.27],[0,.3],'#ABA9DF'],[[.59,-.02],[0,-.27],[0,.3],'#5FCDC9'],[[-.59,.1],[0,.45],[0,1],'#9692D6'],[[.59,.1],[0,.45],[0,1],'#5FCDC9']];
  ctx.shadowColor='#7A52EE28';ctx.shadowBlur=35;for(const [a,b,c,fill] of faces){ctx.fillStyle=fill;ctx.beginPath();ctx.moveTo(a[0]*size,a[1]*size);ctx.lineTo(b[0]*size,b[1]*size);ctx.lineTo(c[0]*size,c[1]*size);ctx.closePath();ctx.fill();}ctx.restore();
 }
 function footer(t,index){
  type('CRYPTO VOLK',80,143,36,C.ivory,800);tag('SCAN AI',780,96,220,C.cyan,{size:38,height:64});stroke(80,200,1000,200,'#7785A349');
  const names=['ETHEREUM / ПРОБЛЕМА','ТЕХНОЛОГИИ / РЕШЕНИЕ','ETHEREUM НА ЛАДОНИ','20 000+ ПОЛЬЗОВАТЕЛЕЙ','ПРОВЕРЬ САМ','3 БЕСПЛАТНЫХ СИГНАЛА','ВОЗМОЖНОСТИ AI','ПОЛУЧИ И УБЕДИСЬ'];label(`${String(index+1).padStart(2,'0')} / ${names[index]}`,80,278,C.muted,38,{maxWidth:920});
  stroke(80,1732,1000,1732,'#7785A349');label('SCAN AI',80,1800,C.ivory,36);label(index===2?'ДЕМО · ETH/USDT':'CRYPTO VOLK',1000,1800,C.cyan,36,{align:'right'});
  ctx.fillStyle=E.getTheme()==='light'?'#CED0DB':'#313A50';rounded(80,1830,920,4,2);ctx.fill();ctx.fillStyle=C.cyan;rounded(80,1830,Math.max(4,t/config.duration*920),4,2);ctx.fill();label(`${String(Math.floor(t)).padStart(2,'0')} / ${config.duration}`,80,1890,C.muted,36,{mono:true});
  for(let j=0;j<24;j++){const amp=envelope[Math.max(0,Math.floor((t-(23-j)*.02)*40))]||0,h=5+amp*28;stroke(801+j*8.3,1873-h/2,801+j*8.3,1873+h/2,j<14?C.violet:C.cyan,3);}
 }
 function problem(local,time){
  const second=reveal(time,1.72,.25);alpha(1-reveal(time,1.49,.22),()=>top('ХВАТИТ','СЛЕПО ВЕРИТЬ.',local,{size:121,second:83,accent:C.ivory}));alpha(second,()=>top('СИГНАЛЫ ПО','ETHEREUM?',time-1.62,{size:103,second:110}));
  const k=reveal(local,.15,.7);ctx.save();ctx.globalAlpha*=k;ctx.translate(0,40*(1-k));panel(80,713,920,708,{accent:C.violet});type('ETH/USDT',126,794,46,C.ivory,700,{mono:true});tag('?',817,745,130,C.red,{size:44,height:66});
  drawTradingChart(E,{x:145,y:903,w:780,h:349},{time:local,setup,labels:false,progress:reveal(local,.1,.65),uncertain:true,uncertaintyColors:true});
  alpha(reveal(local,.8,.5),()=>{trace([[675,1129],[762,1040],[900,935]],C.green,4);trace([[675,1129],[778,1230],[900,1310]],C.red,4);});
  tag('LONG',128,1317,250,C.green,{size:39});tag('SHORT',699,1317,250,C.red,{size:39});ctx.restore();
  label('Один актив. Противоположные прогнозы.',540,1585,C.muted,38,{align:'center',maxWidth:920});state={phase:'uncertainty'};
 }
 function technology(local,time){
  const look=config.themeTransition.start;
  alpha(1-reveal(time,5.08,.2),()=>{type('ПОСМОТРИ',540,900,119,C.ivory,800,{align:'center',maxWidth:920});label('ДО ЧЕГО ДОШЛИ ТЕХНОЛОГИИ',540,1032,C.muted,38,{align:'center',maxWidth:920});});
  alpha(reveal(time,5.28,.35),()=>{top('ТЕХНОЛОГИИ','УЖЕ ЗДЕСЬ.',time-5.18,{size:91,second:116});ethereum(540,1078,275,time-5.12);label('ETHEREUM × SCAN AI',540,1534,C.cyan,42,{align:'center'});});
  state={phase:time<look?'look':time<config.themeTransition.end?(config.themeMode==='dark'?'scan-reveal':'dark-light-reveal'):'technology',intentionalOverlay:time>=look&&time<config.themeTransition.end};
 }
 function product(local,time){
  const phase=time<config.phoneCues.analysis?'asset':time<config.phoneCues.setup?'analysis':'setup';
  if(phase==='asset')top('ВЫБЕРИ','ETHEREUM',local,{size:108,second:111});else if(phase==='analysis')top('AI-АНАЛИЗ','ETHEREUM',time-config.phoneCues.analysis,{size:109,second:111});else top('СЦЕНАРИЙ','ГОТОВ.',time-config.phoneCues.setup,{size:111,second:121});
  const result=phone.render(time);state={phase:'phone-'+phase,phone:result,setup};
 }
 function proof(local,time){
  const count=reveal(time,16.6,.35);alpha(1-reveal(time,16.37,.22),()=>top('НЕ ПРОСТО','ЭКСПЕРИМЕНТ.',local,{size:112,second:82}));
  alpha(count,()=>{const n=Math.floor(20000*ease((time-16.6)/.84));type(new Intl.NumberFormat('fr-FR').format(n).replaceAll('\u202f',' ')+'+',80,418,148,C.ivory,800,{maxWidth:920});title('ПОЛЬЗОВАТЕЛЕЙ',535,time-16.6,0,C.cyan,78);});
  panel(80,718,920,715,{accent:C.violet});brandPlate(local,540,866,810,0);
  const dots=Array.from({length:24},(_,i)=>({x:168+(i%6)*148,y:1065+Math.floor(i/6)*77}));dots.forEach((p,i)=>{const k=reveal(local,.25+i*.025,.5);ctx.save();ctx.globalAlpha*=k;disc(p.x,p.y,16,i%3?C.cyan:C.violet);ctx.strokeStyle=i%3?C.cyan:C.violet;ctx.lineWidth=4;ctx.beginPath();ctx.arc(p.x,p.y+28,22,Math.PI,Math.PI*2);ctx.stroke();ctx.restore();});
  label('С НАШИМ БОТОМ УЖЕ РАБОТАЮТ',540,1578,C.muted,38,{align:'center',maxWidth:920});state={phase:time>=16.96?'20000-users':'not-experiment'};
 }
 function trust(local,time){
  top('НЕ ВЕРЬ','НА СЛОВО.',local,{size:121,second:117});
  panel(80,705,920,777,{accent:C.cyan});ethereum(540,961,175,local);brandPlate(local,540,1239,810,.15);
  ctx.fillStyle='#5FCDC9';rounded(176,1360,728,91,23);ctx.fill();type('ПРОВЕРЬ САМ',540,1422,49,'#050718',800,{align:'center'});
  label('Оцени возможности Scan AI на практике.',540,1615,C.muted,38,{align:'center',maxWidth:920});state={phase:'check-yourself'};
 }
 function offer(local,time){
  const three=config.offerCues.three,free=config.offerCues.free;
  alpha(1-reveal(time,three-.2,.2),()=>top('ПОПРОБУЙ','НА ПРАКТИКЕ.',local,{size:111,second:91}));
  alpha(reveal(time,three,.3),()=>{title('3 СИГНАЛА',407,time-three,0,C.ivory,117);alpha(reveal(time,free,.3),()=>type('БЕСПЛАТНО',80,541,104,C.violet,800,{maxWidth:920}));});
  [0,1,2].forEach(i=>{const k=reveal(time,22.54+i*.24,.6),x=80+i*285,y=791+(i===1?-31:20),cx=x+165;ctx.save();ctx.globalAlpha*=k;ctx.translate(0,65*(1-k));ctx.translate(cx,y+260);ctx.rotate((i-1)*.048*reveal(local,.1,.9));ctx.translate(-cx,-y-260);panel(x,y,330,536,{accent:i===1?C.cyan:C.violet});type(String(i+1).padStart(2,'0'),cx,y+125,104,i===1?C.cyan:C.ivory,800,{align:'center'});type('ETH/USDT',cx,y+206,36,C.muted,700,{align:'center',mono:true});E.miniTrend(x+40,y+261,250,150,i===1?C.cyan:C.violet,1.5);tag('SCAN AI',x+38,y+446,254,C.cyan,{size:36,height:62});ctx.restore();});
  label(time>=config.offerCues.check?'ПРОВЕРЬ ВОЗМОЖНОСТИ AI':'3 БЕСПЛАТНЫХ СИГНАЛА',540,1598,C.muted,40,{align:'center',maxWidth:920});state={phase:'three-free-signals'};
 }
 function potential(local,time){
  top('НЕ ГАДАЙ.','ПРОВЕРЬ.',local,{size:117,second:121});
  ctx.save();ctx.translate(540,1080);ctx.rotate(-.18+Math.min(local,1)*.08);for(let j=0;j<3;j++){ctx.strokeStyle=j===1?'#5FCDC955':'#7A52EE33';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,0,320+j*45,250+j*32,0,0,Math.PI*2);ctx.stroke();}ctx.restore();
  ethereum(540,1050,285,local);brandPlate(local,540,1450,890,.12);label('ИСКУССТВЕННЫЙ ИНТЕЛЛЕКТ',540,1625,C.muted,38,{align:'center',maxWidth:920});state={phase:'ai-potential'};
 }
 function cta(local,time){
  top('ПОЛУЧИ 3','СИГНАЛА',local,{size:112,second:122});
  const k=reveal(local,.08,.7);ctx.save();ctx.globalAlpha*=k;ctx.translate(0,40*(1-k));ctx.shadowColor='#7A52EE28';ctx.shadowBlur=36;ctx.fillStyle='#050718';rounded(160,584,760,610,170);ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle='#7A52EE55';ctx.lineWidth=2;ctx.stroke();contain(logo,250,604,580,565);ctx.restore();brandPlate(local,540,1271,940,.1);
  alpha(reveal(local,.25,.6),()=>{ctx.fillStyle='#5FCDC9';rounded(80,1450,920,118,28);ctx.fill();ctx.strokeStyle='#7A52EE';ctx.lineWidth=2;ctx.stroke();telegram(145,1509,30);type('ОТКРОЙ SCAN AI',569,1526,49,'#050718',800,{align:'center',maxWidth:730});});label('БЕСПЛАТНО · УБЕДИСЬ САМ',540,1641,C.ivory,38,{align:'center',maxWidth:920});state={phase:'final-cta'};
 }
 const scenes=[problem,technology,product,proof,trust,offer,potential,cta];
 function scene(t,index,local){
  background(t);
  if(index>0&&index!==1&&local<.3){const p=smooth(local/.3),cut=1080*(1-p);ctx.save();ctx.beginPath();ctx.rect(0,0,cut,1920);ctx.clip();ctx.translate(-45*p,0);scenes[index-1](t-config.scenes[index-1].start,t);ctx.restore();ctx.save();ctx.beginPath();ctx.rect(cut,0,1080-cut,1920);ctx.clip();ctx.translate(45*(1-p),0);scenes[index](local,t);ctx.restore();}else scenes[index](local,t);
  // A restrained fade keeps forearms out of the decorative footer without a hard cut.
  const ink=E.getTheme()==='light'?'#F3EFE9':'#050718',fade=ctx.createLinearGradient(0,1645,0,1732);fade.addColorStop(0,ink+'00');fade.addColorStop(1,ink);ctx.fillStyle=fade;ctx.fillRect(0,1645,1080,90);ctx.fillStyle=ink;ctx.fillRect(0,1732,1080,188);
  sceneAudit=E.getAudit().slice();footer(t,index);
 }
 function render(seconds){const t=clamp(seconds,0,config.duration-.001),index=config.scenes.findLastIndex(s=>s.start<=t),local=t-config.scenes[index].start;E.resetAudit();if(config.themeMode==='dark')drawDarkScan(E,{time:t,start:config.themeTransition.start,end:config.themeTransition.end,draw:()=>scene(t,index,local)});else drawThemeReveal(E,{time:t,start:config.themeTransition.start,end:config.themeTransition.end,draw:()=>scene(t,index,local)});window.lastTextAudit=E.getAudit();window.sceneTextAudit=sceneAudit;window.lastSceneState={...state,scene:config.scenes[index].id,time:t,local,theme:config.themeMode==='dark'?'dark':t>=config.themeTransition.end?'light':t>=config.themeTransition.start?'transition':'dark'};return window.lastSceneState;}
 return {render,config,brand,phoneAssets,setup,validateSetup:()=>validateSetup(setup),getAudit:()=>sceneAudit};
}
