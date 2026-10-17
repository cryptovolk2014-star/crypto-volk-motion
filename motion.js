/* Crypto Volk / rebuild 02. All eight scenes use the same readable type system.
 * Original artwork is used ONLY through the prepared transparent PNG cutouts.
 * Frame state is a pure function of time, for repeatable 30 fps exports.
 */
const canvas=document.getElementById('film'),ctx=canvas.getContext('2d',{alpha:false});
const W=1080,H=1920,DURATION=25.156;
const C={navy:'#050718',ivory:'#F3EFE9',violet:'#7A52EE',cyan:'#5FCDC9',muted:'#B0B9CD',line:'#414A67',green:'#72E3B2',red:'#FF7089',gold:'#F5CF80'};
const TYPE={headline:118,body:44,ui:36,small:34,min:32};
const starts=[0,2.72,5.56,8.42,11.58,15.28,18.52,22.15];
const names=['РЫНОК ЗОЛОТА','ДВА НАПРАВЛЕНИЯ','AI-ИНТЕЛЛЕКТ','ВЫБОР АКТИВА','СЦЕНАРИИ И УРОВНИ','ВАША ПРОВЕРКА','ПЕРВОЕ ЗНАКОМСТВО','СРАВНИТЕ АНАЛИЗ'];
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const ease=v=>1-(1-clamp(v))**3;
const smooth=v=>{v=clamp(v);return v*v*(3-2*v);};
const reveal=(t,delay=0,duration=.7)=>ease((t-delay)/duration);
let logo,plate,envelope=[],textAudit=[];
const resources={logo:'assets/brand/clean/cryptovolk-logo.png',plate:'assets/brand/clean/scan-ai-plate.png'};
function imageAsset(url){return new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>reject(new Error('Missing clean brand asset: '+url));im.src=url;});}
const ready=Promise.all([document.fonts.ready,imageAsset(resources.logo).then(im=>logo=im),imageAsset(resources.plate).then(im=>plate=im),fetch('assets/audio-envelope.json').then(r=>{if(!r.ok)throw new Error('Missing audio envelope');return r.json();}).then(x=>envelope=x)]);
function rounded(x,y,w,h,r=28){ctx.beginPath();ctx.roundRect(x,y,w,h,r);}
function stroke(x1,y1,x2,y2,color=C.line,width=1){ctx.save();ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.restore();}
function disc(x,y,r,fill){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=fill;ctx.fill();}
function type(s,x,y,size=TYPE.ui,color=C.ivory,weight=600,{align='left',maxWidth=Infinity,mono=false}={}){
 ctx.save();const face=mono?'RobotoMono':'Montserrat';ctx.font=`${weight} ${size}px ${face}`;
 const measured=ctx.measureText(s).width;if(measured>maxWidth){size*=maxWidth/measured;ctx.font=`${weight} ${size}px ${face}`;}
 if(size<TYPE.min-.01)throw new Error(`Unreadable type: ${s} (${size.toFixed(1)}px)`);
 ctx.fillStyle=color;ctx.textAlign=align;ctx.fillText(s,x,y);
 const metrics=ctx.measureText(s),matrix=ctx.getTransform(),left=x-metrics.actualBoundingBoxLeft,right=x+metrics.actualBoundingBoxRight,top=y-metrics.actualBoundingBoxAscent,bottom=y+metrics.actualBoundingBoxDescent;
 const corners=[[left,top],[right,top],[left,bottom],[right,bottom]].map(([px,py])=>({x:matrix.a*px+matrix.c*py+matrix.e,y:matrix.b*px+matrix.d*py+matrix.f}));
 textAudit.push({text:s,size:Number(size.toFixed(2)),x,y,align,width:metrics.width,bounds:{left:Math.min(...corners.map(p=>p.x)),right:Math.max(...corners.map(p=>p.x)),top:Math.min(...corners.map(p=>p.y)),bottom:Math.max(...corners.map(p=>p.y))}});ctx.restore();
}
function label(s,x,y,color=C.muted,size=TYPE.small,opts={}){type(s,x,y,size,color,600,opts);}
function title(s,y,t,delay=0,color=C.ivory,size=TYPE.headline){const k=reveal(t,delay,.62);ctx.save();ctx.globalAlpha*=k;ctx.translate(0,36*(1-k));type(s,80,y,size,color,800,{maxWidth:920});ctx.restore();}
function group(t,delay,draw){const k=reveal(t,delay,.8);ctx.save();ctx.globalAlpha*=k;ctx.translate(0,66*(1-k));draw(k);ctx.restore();}
function panel(x,y,w,h,{accent=C.violet,radius=32,fill='#10162D'}={}){
 ctx.save();ctx.shadowColor='#00000070';ctx.shadowBlur=36;ctx.shadowOffsetY=18;
 const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,'#202840');g.addColorStop(.46,fill);g.addColorStop(1,'#0A1126');ctx.fillStyle=g;rounded(x,y,w,h,radius);ctx.fill();ctx.shadowBlur=0;ctx.shadowOffsetY=0;ctx.lineWidth=1.5;ctx.strokeStyle='#ADC2F033';ctx.stroke();
 const gl=ctx.createLinearGradient(x,0,x+w,0);gl.addColorStop(0,accent+'00');gl.addColorStop(.4,accent+'B0');gl.addColorStop(1,accent+'00');stroke(x+radius,y,x+w-radius,y,gl,2);ctx.restore();
}
function tag(s,x,y,w,color=C.cyan,{size=TYPE.small,height=64}={}){ctx.save();ctx.fillStyle=color+'15';rounded(x,y,w,height,18);ctx.fill();ctx.strokeStyle=color+'70';ctx.lineWidth=1.4;ctx.stroke();type(s,x+w/2,y+height/2+size*.36,size,color,600,{align:'center',maxWidth:w-28});ctx.restore();}
function trace(points,color=C.cyan,width=3,glow=12){if(points.length<2)return;ctx.save();ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.lineJoin='round';ctx.shadowColor=color;ctx.shadowBlur=glow;ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();ctx.restore();}
function contain(im,x,y,w,h){const scale=Math.min(w/im.width,h/im.height),iw=im.width*scale,ih=im.height*scale;ctx.drawImage(im,x+(w-iw)/2,y+(h-ih)/2,iw,ih);}
function brandPlate(t,cx,cy,width=940,delay=.1){const k=reveal(t,delay,.75);ctx.save();ctx.globalAlpha*=k;ctx.translate(cx,cy+30*(1-k));ctx.scale(.95+.05*k,.95+.05*k);ctx.drawImage(plate,-width/2,-width*plate.height/plate.width/2,width,width*plate.height/plate.width);ctx.restore();}
function caption(main,sub,t,delay=.75){const k=reveal(t,delay,.65);ctx.save();ctx.globalAlpha*=k;ctx.translate(0,22*(1-k));type(main,80,1550,TYPE.body,C.ivory,600,{maxWidth:920});if(sub)label(sub,80,1620,C.muted,TYPE.small,{maxWidth:920});ctx.restore();}
function arrow(x,y,up,color,size=1){ctx.save();ctx.translate(x,y);ctx.scale(size,size);ctx.strokeStyle=color;ctx.lineWidth=5;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(0,up?25:-25);ctx.lineTo(0,up?-25:25);ctx.moveTo(-17,up?-8:8);ctx.lineTo(0,up?-25:25);ctx.lineTo(17,up?-8:8);ctx.stroke();ctx.restore();}
function telegram(x,y,r=30){ctx.save();disc(x,y,r,C.cyan);ctx.translate(x,y);ctx.beginPath();ctx.moveTo(-r*.6,-r*.08);ctx.lineTo(r*.63,-r*.5);ctx.lineTo(r*.3,r*.57);ctx.lineTo(-r*.06,r*.22);ctx.lineTo(r*.32,-r*.22);ctx.lineTo(-r*.25,r*.1);ctx.closePath();ctx.fillStyle='#11263B';ctx.fill();ctx.restore();}
function background(t){
 ctx.fillStyle=C.navy;ctx.fillRect(0,0,W,H);
 let g=ctx.createRadialGradient(120,450,40,150,600,1000);g.addColorStop(0,'#39227265');g.addColorStop(1,'#05071800');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
 let c=ctx.createRadialGradient(1050,1280,10,1000,1340,820);c.addColorStop(0,'#17677A4A');c.addColorStop(1,'#05071800');ctx.fillStyle=c;ctx.fillRect(0,0,W,H);
 // Restrained architecture behind the content, not a field of tiny UI text.
 ctx.save();ctx.translate(540,1050);ctx.rotate(-.22+Math.sin(t*.16)*.035);ctx.strokeStyle='#8B85BB20';ctx.lineWidth=1;for(let j=0;j<3;j++){ctx.beginPath();ctx.ellipse(0,0,570+j*85,470+j*65,0,0,Math.PI*2);ctx.stroke();}ctx.restore();
 for(let x=80;x<=1000;x+=80)for(let y=640;y<1460;y+=80)disc(x,y,1.1,'#C6CEFF16');
}
function chrome(t,index){
 type('CRYPTO VOLK',80,140,36,C.ivory,800);tag('SCAN AI',783,94,217,C.cyan,{size:34,height:65});stroke(80,198,1000,198,'#7785A349');
 label(`${String(index+1).padStart(2,'0')} / ${names[index]}`,80,275,C.muted,34,{maxWidth:920});
 stroke(80,1703,1000,1703,'#7785A349');label('CRYPTO VOLK',80,1767,C.ivory,32);label('XAU / USD',1000,1767,C.cyan,32,{align:'right',mono:true});
 ctx.fillStyle='#313A50';rounded(80,1812,920,4,2);ctx.fill();ctx.fillStyle=C.cyan;rounded(80,1812,Math.max(4,920*t/DURATION),4,2);ctx.fill();
 label(`${String(Math.floor(t)).padStart(2,'0')} / 25`,80,1871,C.muted,32,{mono:true});
 for(let j=0;j<24;j++){const amp=envelope[Math.max(0,Math.floor((t-(23-j)*.02)*40))]||0,h=5+amp*30;stroke(800+j*8.4,1858-h/2,800+j*8.4,1858+h/2,j<14?C.violet:C.cyan,3);}
}
const values=[.34,.43,.38,.5,.57,.52,.61,.56,.45,.39,.44,.53,.59,.67,.62,.73,.68,.75,.7,.82,.76,.84,.79,.87];
function chart(x,y,w,h,t,{progress=1,count=24,grid=true,line=true}={}){
 if(grid){for(let i=0;i<=4;i++)stroke(x,y+i*h/4,x+w,y+i*h/4,'#A8BBD022');for(let i=0;i<=6;i++)stroke(x+i*w/6,y,x+i*w/6,y+h,'#A8BBD019');}
 let points=[];const n=Math.max(1,Math.min(count,Math.floor(count*clamp(progress))));
 for(let i=0;i<n;i++){let close=y+h-values[i]*h,open=y+h-values[Math.max(0,i-1)]*h,xx=x+i*w/(count-1),col=close<=open?C.cyan:C.violet;stroke(xx,Math.min(close,open)-23-(i*7%15),xx,Math.max(close,open)+24,col+'CC',2.5);ctx.fillStyle=col;rounded(xx-8,Math.min(close,open),16,Math.max(12,Math.abs(close-open)),3);ctx.fill();points.push([xx,close]);}
 if(line){trace(points.map(([a,b])=>[a,b-10]),C.cyan,2.4,5);}
 const [px,py]=points.at(-1);disc(px,py-10,6,C.ivory);ctx.save();ctx.strokeStyle=C.cyan+'66';ctx.lineWidth=2;ctx.beginPath();ctx.arc(px,py-10,17+Math.sin(t*3)*3,0,Math.PI*2);ctx.stroke();ctx.restore();return [px,py-10];
}
function goldCoin(x,y,r,t){ctx.save();ctx.translate(x,y);ctx.rotate(-.08+.05*reveal(t));ctx.scale(.92,1);let g=ctx.createLinearGradient(-r,-r,r,r);g.addColorStop(0,'#FFF1BE');g.addColorStop(.3,'#DBAA50');g.addColorStop(.7,'#8F632B');g.addColorStop(1,'#F8DE9B');ctx.shadowColor='#F5CF8040';ctx.shadowBlur=50;disc(0,0,r,g);ctx.shadowBlur=0;ctx.strokeStyle='#FFE7AF';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,r*.87,0,Math.PI*2);ctx.stroke();type('Au',0,22,64,'#382616',800,{align:'center'});ctx.restore();}
function market(t){
 title('ЗОЛОТО.',420,t,0,C.ivory,132);title('Что дальше?',534,t,.1,C.ivory,86);
 group(t,.1,()=>{ctx.save();const tilt=-.018*(1-reveal(t,.1,1));ctx.translate(540,1080);ctx.rotate(tilt);ctx.translate(-540,-1080);panel(80,735,920,650);type('XAU/USD',128,815,44,C.ivory,700,{mono:true});tag('ЗОЛОТО',714,769,238,C.gold);stroke(128,858,952,858,'#B9D2E626');chart(140,927,800,346,t,{progress:reveal(t,.2,1.6)});label('ГРАФИК ЦЕНЫ',128,1341,C.muted,34);tag('H1',826,1300,126,C.cyan,{size:32,height:62});ctx.restore();});
 goldCoin(870,647,82,t);caption('Один график. Два направления.','Какой сценарий выберет рынок?',t);
}
function direction(t){
 title('ВВЕРХ',419,t,0,C.green,132);title('или ВНИЗ?',535,t,.1,C.ivory,105);
 group(t,.1,()=>{panel(80,717,440,190,{accent:C.green});panel(560,717,440,190,{accent:C.red});arrow(148,812,true,C.green,1.2);type('РОСТ',208,827,42,C.green,700);arrow(627,812,false,C.red,1.2);type('ПАДЕНИЕ',680,827,38,C.red,700,{maxWidth:290});
 panel(80,977,920,430);label('XAU/USD',127,1041,C.ivory,36,{mono:true});label('ДВА СЦЕНАРИЯ',953,1041,C.muted,32,{align:'right'});
 const [x,y]=chart(135,1108,480,230,t,{count:16,progress:1});const k=reveal(t,.45,.95);ctx.save();ctx.lineCap='round';ctx.setLineDash([13,10]);trace([[x,y],[x+55*k,y],[x+170*k,y-95*k],[x+320*k,y-120*k]],C.green,5);trace([[x,y],[x+55*k,y],[x+175*k,y+100*k],[x+320*k,y+130*k]],C.red,5);ctx.restore();});
 caption('Догадка — ещё не стратегия.','Сравни возможные направления.',t);
}
function intelligence(t){
 title('ВЗГЛЯД',420,t,0,C.ivory,121);title('ИНТЕЛЛЕКТА.',536,t,.1,C.cyan,96);
 group(t,.12,()=>{
 const cx=540,cy=1060;
 const labels=[{s:'ГРАФИК',x:80,y:718,w:290,c:C.violet},{s:'КОНТЕКСТ',x:690,y:821,w:310,c:C.cyan},{s:'СЦЕНАРИИ',x:355,y:1351,w:370,c:C.cyan}];
 labels.forEach(({x,y,w,c})=>stroke(cx,cy,x+w/2,y+40,c+'40',2));
 for(let j=0;j<3;j++){ctx.save();ctx.translate(cx,cy);ctx.rotate(t*.24*(j%2?-1:1)+j*.7);ctx.scale(1,.62+j*.1);ctx.lineWidth=j?2:3;ctx.strokeStyle=(j%2?C.violet:C.cyan)+'99';ctx.beginPath();ctx.arc(0,0,235+j*48,.15,Math.PI*1.9);ctx.stroke();disc(Math.cos(t*.7+j)*(235+j*48),Math.sin(t*.7+j)*(235+j*48),6,j%2?C.violet:C.cyan);ctx.restore();}
 let g=ctx.createRadialGradient(cx-45,cy-60,0,cx,cy,164);g.addColorStop(0,'#65539E');g.addColorStop(.6,'#302752');g.addColorStop(1,'#111B31');ctx.save();ctx.shadowBlur=60;ctx.shadowColor=C.violet+'88';disc(cx,cy,164,g);ctx.restore();type('AI',cx,cy+42,124,C.ivory,800,{align:'center'});labels.forEach(({s,x,y,w,c})=>{panel(x,y,w,88,{accent:c,radius:22});type(s,x+w/2,y+58,34,c,700,{align:'center'});});
 });caption('Больше, чем направление.','AI связывает данные и логику.',t,.85);
}
function bot(t){
 brandPlate(t,540,462,960);type('АНАЛИЗ В TELEGRAM',540,668,38,C.cyan,700,{align:'center'});
 group(t,.18,()=>{panel(80,764,920,667,{accent:C.cyan,radius:38});telegram(142,829,30);type('Scan AI',199,844,40,C.ivory,700);tag('AI',808,796,132,C.cyan,{size:34,height:62});stroke(125,880,955,880,'#B8D3EE25');label('ВЫБЕРИТЕ АКТИВ',128,938,C.muted,34);
 const opts=[{sym:'₿',name:'BITCOIN',ticker:'BTC',c:C.gold},{sym:'Au',name:'ЗОЛОТО',ticker:'XAU',c:C.gold},{sym:'Ξ',name:'ETHEREUM',ticker:'ETH',c:C.violet}];
 opts.forEach((a,i)=>{const y=976+i*140,selected=i===1&&t>.64;ctx.fillStyle=selected?'#5FCDC919':'#FFFFFF05';rounded(120,y,840,124,22);ctx.fill();ctx.strokeStyle=selected?C.cyan+'B0':'#A9BFDF30';ctx.lineWidth=selected?2:1;ctx.stroke();disc(178,y+62,32,a.c+'22');type(a.sym,178,y+74,32,a.c,700,{align:'center'});type(a.name,239,y+51,36,C.ivory,700);label(a.ticker,239,y+96,C.muted,32,{mono:true});if(selected)tag('ВЫБРАНО',665,y+30,262,C.cyan,{size:32,height:64});});});
 caption('Выбери актив. Получи разбор.','Золото → Scan AI → Анализ',t,.85);
}
function levels(t){
 title('СЦЕНАРИИ.',420,t,0,C.ivory,104);title('И УРОВНИ.',535,t,.1,C.cyan,104);
 group(t,.1,()=>{panel(80,705,920,704,{accent:C.cyan});type('XAU/USD',128,788,44,C.ivory,700,{mono:true});tag('AI-РАЗБОР',655,743,300,C.cyan,{size:34});stroke(128,829,952,829,'#B8D3EE26');chart(141,915,590,370,t,{count:24});
 const k=reveal(t,.4,.8);ctx.save();ctx.globalAlpha*=k;[[940,'ЦЕЛЬ',C.green],[1085,'ВХОД',C.cyan],[1270,'СТОП',C.red]].forEach(([y,s,c])=>{ctx.setLineDash([11,9]);stroke(130,y,790,y,c+'BB',2);ctx.setLineDash([]);tag(s,757,y-34,201,c,{size:34,height:68});});ctx.restore();
 const sx=141+(t*.25%1)*590;ctx.save();let g=ctx.createLinearGradient(sx-110,0,sx,0);g.addColorStop(0,'#5FCDC900');g.addColorStop(1,'#5FCDC91E');ctx.fillStyle=g;ctx.fillRect(sx-110,887,110,420);stroke(sx,887,sx,1307,C.cyan+'70',2);ctx.restore();label('ВХОД  ·  ЦЕЛИ  ·  РИСК',128,1365,C.muted,34);});
 caption('Понимай логику движения.','Уровни помогают оценить сценарий.',t,1);
}
function miniTrend(x,y,w,h,c,t){const a=[.25,.33,.28,.47,.4,.55,.48,.65,.59,.82];let p=[];const n=Math.max(1,Math.ceil(a.length*reveal(t,.15,1.2)));for(let i=0;i<n;i++)p.push([x+i*w/(a.length-1),y+h-a[i]*h]);trace(p,c,4,8);if(p.length)disc(...p.at(-1),5,c);}
function ownAsset(t){
 title('ТВОЙ АКТИВ.',420,t,0,C.ivory,104);title('ТВОЯ ПРОВЕРКА.',535,t,.1,C.cyan,82);
 const cards=[{sym:'₿',s:'BITCOIN',ticker:'BTC / USDT',c:C.gold,x:80,y:705},{sym:'Au',s:'ЗОЛОТО',ticker:'XAU / USD',c:C.cyan,x:140,y:953},{sym:'Ξ',s:'ETHEREUM',ticker:'ETH / USDT',c:C.violet,x:80,y:1201}];
 cards.forEach((a,i)=>group(t,.1+i*.13,()=>{panel(a.x,a.y,860,205,{accent:a.c});disc(a.x+69,a.y+87,36,a.c+'20');type(a.sym,a.x+69,a.y+100,36,a.c,700,{align:'center'});type(a.s,a.x+130,a.y+78,38,C.ivory,700);label(a.ticker,a.x+130,a.y+137,C.muted,32,{mono:true});miniTrend(a.x+533,a.y+34,273,132,a.c,t-i*.1);}));
 caption('Проверь на своём рынке.','Сравни со своим анализом.',t,.85);
}
function offer(t){
 title('ПОПРОБУЙ.',420,t,0,C.ivory,112);title('БЕСПЛАТНО.',535,t,.1,C.cyan,100);
 group(t,.1,()=>{ctx.save();ctx.translate(540,1060);for(let j=0;j<3;j++){ctx.save();ctx.rotate((j-1)*.07*reveal(t,.1,.9));panel(-353+(j-1)*35,-329+j*10,706,640,{accent:j===2?C.cyan:C.violet,radius:38});ctx.restore();}
 const g=ctx.createLinearGradient(-130,-250,140,180);g.addColorStop(0,C.ivory);g.addColorStop(.6,'#CAB5FF');g.addColorStop(1,C.cyan);ctx.save();ctx.shadowColor=C.violet+'77';ctx.shadowBlur=40;type('3',0,67,318,g,800,{align:'center'});ctx.restore();type('БЕСПЛАТНЫХ',0,189,40,C.cyan,700,{align:'center'});type('СИГНАЛА',0,248,44,C.ivory,700,{align:'center'});ctx.restore();});
 caption('Для новых пользователей.','Три сигнала для знакомства с Scan AI.',t,.9);
}
function ending(t){
 title('ПОПРОБУЙ.',420,t,0,C.ivory,112);title('И СРАВНИ.',535,t,.1,C.cyan,116);
 group(t,.13,()=>{contain(logo,250,592,580,565);});brandPlate(t,540,1274,940,.25);
 group(t,.5,()=>{const g=ctx.createLinearGradient(80,0,1000,0);g.addColorStop(0,C.violet);g.addColorStop(1,C.cyan);ctx.fillStyle=g;rounded(80,1445,920,126,28);ctx.fill();telegram(143,1508,29);type('ОТКРОЙ SCAN AI В TELEGRAM',207,1522,34,C.navy,800,{maxWidth:746});});
 const k=reveal(t,.75,.6);ctx.save();ctx.globalAlpha*=k;type('СРАВНИ СО СВОИМ АНАЛИЗОМ',540,1640,34,C.muted,600,{align:'center'});ctx.restore();
}
const scenes=[market,direction,intelligence,bot,levels,ownAsset,offer,ending];
function render(time){const t=clamp(time,0,DURATION-.001);const index=starts.findLastIndex(s=>s<=t),local=t-starts[index];textAudit=[];background(t);
 // Short slide/dissolve. Background and navigation stay continuous.
 if(index>0&&local<.28){ctx.save();ctx.globalAlpha=1-smooth(local/.28);ctx.translate(-70*smooth(local/.28),0);scenes[index-1](t-starts[index-1]);ctx.restore();}
 ctx.save();if(index>0&&local<.32){const k=smooth(local/.32);ctx.globalAlpha=k;ctx.translate(65*(1-k),0);}scenes[index](local);ctx.restore();chrome(t,index);
 window.lastTextAudit=textAudit;return {time:t,scene:index+1};
}
window.render=render;window.DURATION=DURATION;window.TYPE=TYPE;window.brandResources=resources;
window.filmReady=ready.then(()=>{render(0);return true;});
if(new URLSearchParams(location.search).has('render'))document.body.classList.add('render');
else{
 const audio=document.getElementById('voice'),button=document.getElementById('play'),seek=document.getElementById('seek');let playing=false;
 button.onclick=async()=>{if(playing){audio.pause();playing=false;button.textContent='Продолжить';}else{if(audio.ended)audio.currentTime=0;try{await audio.play();playing=true;button.textContent='Пауза';}catch{button.textContent='Нажмите для воспроизведения';}}};
 seek.oninput=()=>{audio.currentTime=Number(seek.value);render(audio.currentTime);};audio.onended=()=>{playing=false;button.textContent='Посмотреть ещё раз';};
 function tick(){if(playing){render(audio.currentTime);seek.value=audio.currentTime;document.getElementById('time').textContent=`00:${String(Math.floor(audio.currentTime)).padStart(2,'0')} / 00:25`;}requestAnimationFrame(tick);}window.filmReady.then(tick);
}
