/* Deterministic 1080 × 1920 artwork. No remote assets or random frame state. */
const canvas=document.getElementById('film'), ctx=canvas.getContext('2d',{alpha:false});
const W=1080,H=1920,DURATION=25.156;
const C={bg:'#050718',white:'#F3EFE9',violet:'#7A52EE',cyan:'#5FCDC9',muted:'#8A92AC',line:'#2C3450',green:'#6DE6B4',red:'#FF657D',gold:'#F6CE75'};
const starts=[0,2.72,5.56,8.42,11.58,15.28,18.52,22.15],ends=[...starts.slice(1),DURATION];
const titles=['РЫНОК','НАПРАВЛЕНИЕ','ИНТЕЛЛЕКТ','SCAN AI','СЦЕНАРИИ','ВАШ АКТИВ','ПЕРВЫЙ ШАГ','ВАШ АНАЛИЗ'];
let plaque=null,logo=null,audioEnvelope=[];
async function asset(url){return new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>reject(new Error(`Cannot load original brand asset: ${url}`));im.src=url;});}
const ready=Promise.all([document.fonts.ready,asset('assets/brand/scan-ai-banner.png').then(x=>plaque=x),asset('assets/brand/cryptovolk-trade.png').then(x=>logo=x),fetch('assets/audio-envelope.json').then(r=>r.json()).then(x=>audioEnvelope=x)]);
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x)),mix=(a,b,t)=>a+(b-a)*t;
const ease=x=>1-Math.pow(1-clamp(x),3),smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
const enter=(t,d=0,s=.7)=>ease((t-d)/s);
function rr(x,y,w,h,r=28){ctx.beginPath();ctx.roundRect(x,y,w,h,r);}
function line(x1,y1,x2,y2,color=C.line,width=1){ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();}
function dot(x,y,r,color){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();}
function text(str,x,y,size=36,color=C.white,weight=700,family='Montserrat',align='left',maxWidth){
 ctx.save();ctx.font=`${weight} ${size}px ${family}`;ctx.textAlign=align;ctx.fillStyle=color;
 if(maxWidth){let w=ctx.measureText(str).width;if(w>maxWidth)ctx.font=`${weight} ${size*maxWidth/w}px ${family}`;}
 ctx.fillText(str,x,y);ctx.restore();
}
function mono(s,x,y,size=24,color=C.muted,align='left'){text(s,x,y,size,color,400,'RobotoMono',align);}
function tracked(s,x,y,size=22,spacing=5,color=C.muted){ctx.save();ctx.font=`500 ${size}px Montserrat`;ctx.fillStyle=color;for(const ch of s){ctx.fillText(ch,x,y);x+=ctx.measureText(ch).width+spacing;}ctx.restore();}
function headline(s,x,y,size,t,delay=0,color=C.white,max=930){const k=enter(t,delay,.65);ctx.save();ctx.globalAlpha*=k;ctx.translate(0,42*(1-k));text(s,x,y,size,color,800,'Montserrat','left',max);ctx.restore();}
function pill(s,x,y,w,color=C.cyan,size=22){ctx.save();ctx.fillStyle=color+'14';rr(x,y,w,52,26);ctx.fill();ctx.strokeStyle=color+'70';ctx.lineWidth=1;ctx.stroke();mono(s,x+w/2,y+34,size,color,'center');ctx.restore();}
function card(x,y,w,h,r=32,accent=C.violet){ctx.save();let g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,'#202440');g.addColorStop(.45,'#0F142A');g.addColorStop(1,'#0A1022');ctx.fillStyle=g;ctx.shadowColor='#0009';ctx.shadowBlur=45;ctx.shadowOffsetY=24;rr(x,y,w,h,r);ctx.fill();ctx.shadowBlur=0;ctx.shadowOffsetY=0;ctx.strokeStyle='#FFFFFF20';ctx.lineWidth=1.4;ctx.stroke();let gl=ctx.createLinearGradient(x,y,x+w,y);gl.addColorStop(0,accent+'00');gl.addColorStop(.4,accent+'AA');gl.addColorStop(1,accent+'00');line(x+r,y,x+w-r,y,gl,2);ctx.restore();}
function glowLine(points,color,width=3,glow=14){if(points.length<2)return;ctx.save();ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.lineJoin='round';ctx.shadowBlur=glow;ctx.shadowColor=color;ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();ctx.restore();}
function arrow(x,y,up=true,color=C.cyan,scale=1){ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);ctx.strokeStyle=color;ctx.lineWidth=5;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(0,up?28:-28);ctx.lineTo(0,up?-28:28);ctx.moveTo(-18,up?-10:10);ctx.lineTo(0,up?-28:28);ctx.lineTo(18,up?-10:10);ctx.stroke();ctx.restore();}
function grid(x,y,w,h,step=100){ctx.save();ctx.strokeStyle='#7383A31B';ctx.lineWidth=1;for(let yy=y;yy<=y+h;yy+=step)line(x,yy,x+w,yy,'#7383A31B');for(let xx=x;xx<=x+w;xx+=step)line(xx,y,xx,y+h,'#7383A31B');ctx.restore();}
const prices=[.46,.5,.44,.54,.63,.58,.55,.64,.7,.64,.6,.51,.43,.38,.47,.52,.6,.68,.64,.69,.76,.7,.72,.65,.62,.67,.75,.8,.74,.78,.84,.78,.82,.72,.77,.82];
function chart(x,y,w,h,t,{progress=1,levels=false,branches=false,scan=false}={}){
 grid(x,y,w,h,80);let pts=[];const n=Math.max(1,Math.floor(prices.length*clamp(progress)));
 for(let i=0;i<n;i++){const px=x+i*w/(prices.length-1),py=y+h-prices[i]*h,prev=prices[Math.max(0,i-1)],open=y+h-prev*h,up=prices[i]>=prev,col=up?C.cyan:C.violet,body=Math.max(10,Math.abs(open-py));line(px,Math.min(py,open)-24-((i*13)%22),px,Math.max(py,open)+24,col+'B0',2);ctx.fillStyle=col;rr(px-6,Math.min(py,open),12,body,2);ctx.fill();pts.push([px,py]);}
 if(pts.length>1){let path=pts.map(([px,py])=>[px,py-10]);glowLine(path,C.cyan,2,6);let [ex,ey]=path[path.length-1];dot(ex,ey,6,C.white);ctx.save();ctx.strokeStyle=C.cyan+'55';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(ex,ey,15+(Math.sin(t*4)+1)*4,0,Math.PI*2);ctx.stroke();ctx.restore();}
 if(scan){const sx=x+((t*.34)%1)*w;let g=ctx.createLinearGradient(sx-160,0,sx,0);g.addColorStop(0,C.cyan+'00');g.addColorStop(1,C.cyan+'22');ctx.fillStyle=g;ctx.fillRect(sx-160,y,160,h);line(sx,y,sx,y+h,C.cyan+'99',2);}
 if(levels){const q=enter(t,.3,.8);ctx.save();ctx.globalAlpha*=q;[[.16,'ЦЕЛЬ',C.green],[.42,'ВХОД',C.cyan],[.8,'СТОП',C.red]].forEach(([dy,lab,col])=>{ctx.setLineDash([10,8]);line(x,y+h*dy,x+w,y+h*dy,col+'80',2);ctx.setLineDash([]);ctx.fillStyle='#0D172A';rr(x+w-128,y+h*dy-22,140,44,10);ctx.fill();mono(lab,x+w-58,y+h*dy+7,21,col,'center');});ctx.restore();}
 if(branches){const q=enter(t,.55,.8),[xx,py]=pts[pts.length-1],yy=py-10;ctx.save();ctx.setLineDash([8,10]);glowLine([[xx,yy],[xx+70*q,yy],[xx+210*q,yy-110*q],[xx+300*q,yy-150*q]],C.green,4,12);glowLine([[xx,yy],[xx+70*q,yy],[xx+210*q,yy+190*q],[xx+300*q,yy+240*q]],C.red,4,12);ctx.restore();}
}
function background(t){ctx.fillStyle=C.bg;ctx.fillRect(0,0,W,H);const a=ctx.createRadialGradient(180+Math.sin(t*.3)*60,440,10,160,500,1000);a.addColorStop(0,'#39216C55');a.addColorStop(1,'#05071800');ctx.fillStyle=a;ctx.fillRect(0,0,W,H);const b=ctx.createRadialGradient(1050,1370+Math.sin(t*.22)*100,10,1000,1400,820);b.addColorStop(0,'#14626F40');b.addColorStop(1,'#05071800');ctx.fillStyle=b;ctx.fillRect(0,0,W,H);
 for(let x=80;x<1080;x+=46)for(let y=250;y<1700;y+=46)dot(x,y,1,'#8191BD15');
 ctx.save();ctx.translate(540,1010);ctx.rotate(-.35+Math.sin(t*.15)*.03);ctx.strokeStyle='#786FA51C';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(0,0,700,475,0,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.ellipse(0,0,740,515,0,0,Math.PI*2);ctx.stroke();ctx.restore();
}
function chrome(t,i){
 ctx.save();text('CRYPTO VOLK',80,151,29,C.white,800);tracked('TRADE',81,183,13,5,C.cyan);
 pill('SCAN AI',815,116,185,C.cyan,21);line(80,222,1000,222,'#65718C40');
 mono(`${String(i+1).padStart(2,'0')} / ${titles[i]}`,80,291,21,C.muted);dot(983,281,5,C.cyan);
 line(80,1700,1000,1700,'#65718C40');mono('CRYPTO VOLK  /  SCAN AI',80,1750,20,C.muted);mono('XAU / USD',1000,1750,20,C.cyan,'right');
 const p=t/DURATION;ctx.fillStyle='#23283E';rr(80,1800,920,3,2);ctx.fill();ctx.fillStyle=C.cyan;rr(80,1800,Math.max(3,920*p),3,2);ctx.fill();mono(`${String(Math.floor(t)).padStart(2,'0')} : 25`,80,1851,18,C.muted);
 for(let j=0;j<28;j++){const amp=audioEnvelope[Math.max(0,Math.floor((t-(27-j)*.018)*40))]||0,hh=4+amp*28;line(826+j*6.3,1842-hh/2,826+j*6.3,1842+hh/2,j<18?C.violet:C.cyan,2.7);}
 ctx.restore();
}
function coin(x,y,r,t,label='Au'){ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(t*.7)*.06);ctx.scale(.9+.05*Math.sin(t*.9),1);ctx.shadowColor='#F6CE7533';ctx.shadowBlur=50;let g=ctx.createLinearGradient(-r,-r,r,r);g.addColorStop(0,'#FFF0B4');g.addColorStop(.25,'#E3B963');g.addColorStop(.6,'#8D6329');g.addColorStop(.82,'#F1D38B');g.addColorStop(1,'#B3833F');dot(0,0,r,g);ctx.shadowBlur=0;ctx.lineWidth=2;ctx.strokeStyle='#FFE7A5';ctx.beginPath();ctx.arc(0,0,r*.88,0,Math.PI*2);ctx.stroke();ctx.strokeStyle='#241A15AA';ctx.lineWidth=1;ctx.beginPath();ctx.arc(0,0,r*.82,0,Math.PI*2);ctx.stroke();text(label,0,17,r*.75,'#2C211B',800,'Montserrat','center');mono('GOLD',0,r*.48,r*.16,'#49341D','center');ctx.restore();}
function caption(a,b,t,delay=.8){let k=enter(t,delay,.65);ctx.save();ctx.globalAlpha*=k;ctx.translate(0,(1-k)*22);text(a,80,1546,40,C.white,600,'Montserrat','left',920);if(b)mono(b,80,1600,23,C.muted);ctx.restore();}
function scene0(t){
 headline('ЗОЛОТО.',80,435,132,t);headline('Что дальше?',80,548,84,t,.12);
 const k=enter(t,.16,.9);ctx.save();ctx.globalAlpha*=k;ctx.translate(0,(1-k)*100);ctx.translate(540,1080);ctx.rotate(-.018);ctx.translate(-540,-1080);card(80,740,920,665);text('XAU/USD',125,816,37,C.white,700);mono('GOLD / 1H',125,858,21);pill('ОБЗОР РЫНКА',702,790,253,C.gold,18);line(125,893,955,893,'#FFFFFF13');chart(140,936,800,390,t,{progress:enter(t,.25,1.5)});mono('01:00',140,1370,18);mono('12:00',540,1370,18);mono('24:00',940,1370,18,C.muted,'right');ctx.restore();coin(851,655,86,t);caption('Один график. Два направления.','СМОТРИМ НА РЫНОК',t,.8);
}
function scene1(t){
 headline('ВВЕРХ',80,430,132,t,0,C.green);headline('или ВНИЗ?',80,550,105,t,.1,C.white);
 let k=enter(t,.15,.7);ctx.save();ctx.globalAlpha*=k;ctx.translate(0,60*(1-k));card(80,730,920,670,32);mono('XAU/USD  /  КУДА ДАЛЬШЕ?',128,801,23,C.muted);chart(140,870,760,420,t,{progress:.57,branches:true});
 pill('РОСТ',740,870,170,C.green,22);pill('ПАДЕНИЕ',740,1250,190,C.red,22);ctx.restore();caption('Догадка — ещё не стратегия.','ДВА ВОЗМОЖНЫХ СЦЕНАРИЯ',t,.75);
}
function scene2(t){
 headline('ВЗГЛЯД',80,430,121,t);headline('ИНТЕЛЛЕКТА.',80,548,96,t,.12,C.cyan);
 let k=enter(t,.12,.75);ctx.save();ctx.globalAlpha*=k;const cx=540,cy=1030;ctx.translate(cx,cy+60*(1-k));
 for(let i=0;i<4;i++){ctx.save();ctx.rotate(t*.2*(i%2?1:-1)+i*.7);ctx.scale(1,.6+i*.06);ctx.strokeStyle=[C.cyan+'88',C.violet+'99',C.cyan+'44',C.violet+'33'][i];ctx.lineWidth=i?1.6:3;ctx.beginPath();ctx.arc(0,0,230+i*38,.2,Math.PI*1.85);ctx.stroke();dot(Math.cos(t*.6+i)* (230+i*38),Math.sin(t*.6+i)*(230+i*38),5,i%2?C.violet:C.cyan);ctx.restore();}
 let g=ctx.createRadialGradient(-30,-40,0,0,0,200);g.addColorStop(0,'#6650A4');g.addColorStop(.5,'#292449');g.addColorStop(1,'#10182B');ctx.shadowColor=C.violet;ctx.shadowBlur=65;dot(0,0,158,g);ctx.shadowBlur=0;ctx.strokeStyle='#B9A9FF66';ctx.lineWidth=1;ctx.beginPath();ctx.arc(0,0,158,0,Math.PI*2);ctx.stroke();text('AI',0,37,112,C.white,800,'Montserrat','center');ctx.restore();
 const tags=[['ГРАФИК',105,743,C.violet],['КОНТЕКСТ',735,768,C.cyan],['СЦЕНАРИИ',112,1277,C.cyan]];tags.forEach(([s,x,y,col],i)=>{let a=enter(t,.3+i*.15,.6);ctx.save();ctx.globalAlpha*=a;pill(s,x,y,230,col,21);ctx.restore();});caption('Больше, чем направление.','ИСКУССТВЕННЫЙ ИНТЕЛЛЕКТ В ДЕЛЕ',t,.9);
}
function telegramIcon(x,y,r=25){ctx.save();ctx.translate(x,y);dot(0,0,r,C.cyan);ctx.beginPath();ctx.moveTo(-r*.58,-r*.08);ctx.lineTo(r*.65,-r*.5);ctx.lineTo(r*.3,r*.58);ctx.lineTo(-r*.06,r*.22);ctx.lineTo(r*.35,-r*.23);ctx.lineTo(-r*.24,r*.1);ctx.closePath();ctx.fillStyle='#0C1F2D';ctx.fill();ctx.restore();}
function plaqueDraw(t,y=565){let k=enter(t,.12,.8);ctx.save();ctx.globalAlpha*=k;ctx.translate(540,y+(plaque&&y<600?42:0));ctx.scale(.94+.06*k,.94+.06*k);if(plaque){let w=Math.min(920,320*plaque.width/plaque.height),h=w*plaque.height/plaque.width;ctx.drawImage(plaque,-w/2,-h/2,w,h);}else{text('Scan AI',0,30,110,C.white,800,'Montserrat','center');tracked('CRYPTO VOLK',-147,83,21,5,C.cyan);}ctx.restore();}
function scene3(t){
 plaqueDraw(t,438);mono('АНАЛИЗ В TELEGRAM',540,plaque?683:625,25,C.cyan,'center');
 let k=enter(t,.18,.75);ctx.save();ctx.globalAlpha*=k;ctx.translate(0,(1-k)*85);card(167,721,746,713,42,C.cyan);telegramIcon(222,780,24);text('Scan AI',266,790,28,C.white,700);mono('CRYPTO VOLK',865,789,17,C.muted,'right');line(205,821,875,821,'#FFFFFF16');mono('ВЫБЕРИТЕ АКТИВ',215,876,21);
 const opts=[['₿','BITCOIN','BTC',C.gold],['Au','ЗОЛОТО','XAU',C.gold],['Ξ','ETHEREUM','ETH',C.violet]];opts.forEach(([sym,name,tick,col],i)=>{let yy=911+i*129;let selected=i===1&&t>.65;ctx.fillStyle=selected?'#5FCDC917':'#FFFFFF04';rr(205,yy,670,105,20);ctx.fill();ctx.strokeStyle=selected?C.cyan+'AA':'#FFFFFF18';ctx.lineWidth=selected?2:1;ctx.stroke();dot(256,yy+52,27,selected?'#F6CE7525':'#FFFFFF08');text(sym,256,yy+62,25,col,700,'Montserrat','center');text(name,305,yy+48,26,C.white,700);mono(tick,305,yy+78,18);if(selected){dot(827,yy+52,14,C.cyan);ctx.strokeStyle=C.bg;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(821,yy+52);ctx.lineTo(825,yy+56);ctx.lineTo(833,yy+47);ctx.stroke();}});
 pill('ЗОЛОТО ВЫБРАНО',305,1327,470,C.cyan,22);ctx.restore();caption('Выбери актив. Получи разбор.','ЗОЛОТО → SCAN AI → АНАЛИЗ',t,1);
}
function scene4(t){
 headline('СЦЕНАРИИ.',80,429,104,t);headline('УРОВНИ.',80,547,118,t,.12,C.cyan);
 let k=enter(t,.15,.65);ctx.save();ctx.globalAlpha*=k;ctx.translate(0,60*(1-k));card(80,706,920,697);text('XAU/USD',128,780,36,C.white,700);pill('AI-РАЗБОР',729,743,220,C.cyan,20);chart(140,858,770,405,t,{progress:1,scan:true,levels:true});mono('СХЕМА АНАЛИЗА',130,1350,19);mono('RISK / REWARD',948,1350,19,C.muted,'right');ctx.restore();
 let q=enter(t,.7,.7);ctx.save();ctx.globalAlpha*=q;card(105,1250,485,116,20,C.violet);dot(139,1290,5,C.cyan);mono('ВОЗМОЖНЫЙ СЦЕНАРИЙ',159,1298,18,C.cyan);text('Логика движения цены',137,1340,24,C.white,600);ctx.restore();caption('Понимай логику движения.','НАПРАВЛЕНИЕ · ЦЕЛИ · РИСК',t,1.1);
}
function miniChart(x,y,w,h,color,t){const arr=[.5,.45,.6,.52,.64,.58,.72,.63,.78,.72,.86];let pts=arr.slice(0,Math.ceil(arr.length*enter(t,.15,1.2))).map((a,i)=>[x+i*w/(arr.length-1),y+h-a*h]);glowLine(pts,color,3,6);}
function scene5(t){
 headline('ТВОЙ АКТИВ.',80,430,104,t);headline('ТВОЯ ПРОВЕРКА.',80,541,82,t,.1,C.cyan);
 const items=[{name:'BITCOIN',sym:'₿',ticker:'BTC',col:C.gold,x:128,y:740},{name:'ЗОЛОТО',sym:'Au',ticker:'XAU',col:C.cyan,x:215,y:990},{name:'ETHEREUM',sym:'Ξ',ticker:'ETH',col:C.violet,x:128,y:1240}];
 items.forEach((it,i)=>{let k=enter(t,.15+i*.15,.75);ctx.save();ctx.globalAlpha*=k;ctx.translate((1-k)*(i%2?100:-100),0);let y=it.y+Math.sin(t*.9+i)*5;card(it.x,y,745,190,24,it.col);dot(it.x+70,y+76,36,it.col+'22');text(it.sym,it.x+70,y+88,32,it.col,700,'Montserrat','center');text(it.name,it.x+130,y+72,31,C.white,700);mono(it.ticker,it.x+130,y+113,21);miniChart(it.x+425,y+36,250,115,it.col,t);ctx.restore();});caption('Проверь на своём рынке.','СРАВНИ С СОБСТВЕННЫМ АНАЛИЗОМ',t,.8);
}
function scene6(t){
 headline('ПОПРОБУЙ.',80,429,112,t);headline('БЕСПЛАТНО.',80,545,100,t,.12,C.cyan);
 let k=enter(t,.13,.9);ctx.save();ctx.globalAlpha*=k;ctx.translate(540,1025+50*(1-k));ctx.scale(.85+.15*k,.85+.15*k);
 for(let i=0;i<3;i++){ctx.save();ctx.rotate((i-1)*.085);card(-322+(i-1)*55,-288+i*12,644,576,36,i===2?C.cyan:C.violet);ctx.restore();}
 let g=ctx.createLinearGradient(-100,-200,130,210);g.addColorStop(0,C.white);g.addColorStop(.5,'#D5C7FF');g.addColorStop(1,C.cyan);ctx.shadowColor=C.violet+'88';ctx.shadowBlur=45;text('3',0,112,365,g,800,'Montserrat','center');ctx.shadowBlur=0;mono('БЕСПЛАТНЫХ СИГНАЛА',0,206,26,C.cyan,'center');ctx.restore();
 caption('Каждому новому пользователю.','3 СИГНАЛА ДЛЯ ПЕРВОГО ЗНАКОМСТВА',t,.95);
}
function scene7(t){
 headline('ПОПРОБУЙ.',80,430,112,t);headline('И СРАВНИ.',80,546,116,t,.12,C.cyan);
 const k=enter(t,.15,.75);ctx.save();ctx.globalAlpha*=k;
 if(logo){const sz=500,ratio=logo.width/logo.height;ctx.drawImage(logo,540-sz*ratio/2,565,sz*ratio,sz);}else{
 ctx.save();ctx.translate(540,891);ctx.rotate(-.2+t*.05);for(let i=0;i<3;i++){ctx.strokeStyle=[C.violet+'99',C.cyan+'99',C.violet+'33'][i];ctx.lineWidth=2;rr(-150-i*22,-150-i*22,300+i*44,300+i*44,52);ctx.stroke();}ctx.restore();text('AI',540,932,119,C.white,800,'Montserrat','center');
 }
 plaqueDraw(t,1225);ctx.restore();
 let q=enter(t,.65,.65);ctx.save();ctx.globalAlpha*=q;let g=ctx.createLinearGradient(80,0,1000,0);g.addColorStop(0,C.violet);g.addColorStop(1,C.cyan);ctx.fillStyle=g;rr(80,1395,920,112,28);ctx.fill();telegramIcon(149,1451,27);text('ОТКРОЙ SCAN AI В TELEGRAM',220,1464,30,C.bg,800,'Montserrat','left',720);ctx.restore();mono('СРАВНИ СО СВОИМ АНАЛИЗОМ',540,1585,24,C.muted,'center');
}
const scenes=[scene0,scene1,scene2,scene3,scene4,scene5,scene6,scene7];
function render(time){let t=clamp(time,0,DURATION-.001);let i=starts.findLastIndex(x=>x<=t);background(t);const local=t-starts[i];
 ctx.save();let a=1;if(i>0&&local<.25)a=smooth(local/.25);if(t>ends[i]-.2&&i<7)a*=smooth((ends[i]-t)/.2);ctx.globalAlpha=a;ctx.translate(0,(1-a)*-22);scenes[i](local);ctx.restore();chrome(t,i);
 // Deliberate ending: hold the CTA; keep the soundtrack's complete duration.
 return {time:t,scene:i+1};
}
window.render=render;window.filmReady=ready.then(()=>{render(0);return true;});window.DURATION=DURATION;
if(new URLSearchParams(location.search).has('render'))document.body.classList.add('render');
else{const audio=document.getElementById('voice'),play=document.getElementById('play'),seek=document.getElementById('seek');let playing=false;
play.onclick=async()=>{if(playing){audio.pause();playing=false;play.textContent='Продолжить';}else{if(audio.ended)audio.currentTime=0;try{await audio.play();playing=true;play.textContent='Пауза';}catch(e){play.textContent='Нажмите для воспроизведения';}}};seek.oninput=()=>{audio.currentTime=Number(seek.value);render(audio.currentTime);};audio.onended=()=>{playing=false;play.textContent='Посмотреть ещё раз';};
function tick(){if(playing){render(audio.currentTime);seek.value=audio.currentTime;document.getElementById('time').textContent=`00:${String(Math.floor(audio.currentTime)).padStart(2,'0')} / 00:25`;}requestAnimationFrame(tick);}window.filmReady.then(tick);
}
