import {C,clamp,reveal,smooth} from './fintech.js';

// One coherent illustrative LONG setup shared by selection, analysis and education.
export const DEMO_SETUP=Object.freeze({asset:'BTC/USDT',market:'CRYPTO',side:'LONG',entry:100000,stop:99000,targets:[101000,102000,103000],fvg:[100300,100620],orderBlock:[99300,99650],min:98500,max:103500,demo:true});
export function validateSetup(s){return s.side==='LONG'&&s.stop<s.entry&&s.targets.every((p,i)=>p>s.entry&&(i===0||p>s.targets[i-1]))&&s.stop<s.orderBlock[0]&&s.orderBlock[1]<s.entry&&s.entry<s.fvg[0]&&s.fvg[1]<s.targets[0];}
export const price=n=>new Intl.NumberFormat('fr-FR',{maximumFractionDigits:0}).format(n).replaceAll('\u202f',' ');
const closes=[100500,100250,100450,100000,99600,99400,99700,99950,100200,99900,99800,100150,100420,100240,100820,101020,100820,100540,100180,100000,100080,100050];
export function drawTradingChart(E,box,{time=0,setup=DEMO_SETUP,progress=1,levels=0,active='',fvg=false,orderBlock=false,labels=true,labelSpace=labels?195:0,scan=false,uncertain=false,uncertaintyColors=false,activeLabelsOnly=false}={}){
 const {ctx,C,stroke,rounded,disc,trace,tag}=E,{x,y,w,h}=box,pw=w-labelSpace,py=value=>y+h*(setup.max-value)/(setup.max-setup.min);
 for(let j=0;j<=4;j++)stroke(x,y+j*h/4,x+pw,y+j*h/4,E.getTheme()==='light'?'#24365328':'#A8BBD022');for(let j=0;j<=6;j++)stroke(x+j*pw/6,y,x+j*pw/6,y+h,E.getTheme()==='light'?'#24365320':'#A8BBD019');
 const zone=(range,start,col)=>{const yy=py(range[1]),hh=py(range[0])-yy;ctx.fillStyle=col+'24';rounded(x+pw*start,yy,pw*(1-start),hh,5);ctx.fill();stroke(x+pw*start,yy,x+pw,yy,col+'B0',2);stroke(x+pw*start,yy+hh,x+pw,yy+hh,col+'80',1.5);};
 if(fvg)zone(setup.fvg,.48,C.cyan);if(orderBlock)zone(setup.orderBlock,.12,C.violet);
 const count=Math.max(1,Math.ceil(closes.length*clamp(progress))),points=[];
 for(let i=0;i<count;i++){let close=closes[i],open=closes[Math.max(i-1,0)],high=Math.max(close,open)+120,low=Math.min(close,open)-100;
  if(i===13){open=100080;close=100240;high=100300;low=100020;}if(i===14){open=100240;close=100820;high=100940;low=100180;}if(i===15){open=100820;close=101020;high=101160;low=100620;}
  if(uncertain){const a=1-smooth((time-2.4)/.3);close+=Math.sin(time*8+i*.9)*180*a;high=Math.max(high,close+100);low=Math.min(low,close-100);}
  const xx=x+i*pw*.86/(closes.length-1),up=close>=open,color=uncertaintyColors?(up?C.green:C.red):(up?C.cyan:C.violet);stroke(xx,py(high),xx,py(low),color+'DD',2.5);ctx.fillStyle=color;rounded(xx-7,Math.min(py(close),py(open)),14,Math.max(9,Math.abs(py(close)-py(open))),2);ctx.fill();points.push([xx,py(close)]);
 }
 trace(points,C.cyan,2.4,6);const last=points.at(-1);disc(last[0],last[1],6,C.ivory);
 const list=[{p:setup.entry,s:'ENTRY',c:C.cyan,id:'entry'},{p:setup.stop,s:'STOP',c:C.red,id:'stop'},...setup.targets.map((p,i)=>({p,s:`TP ${i+1}`,c:i?C.cyan:C.green,id:'targets'}))];
 for(let i=0;i<Math.min(levels,list.length);i++){let l=list[i],yy=py(l.p),isActive=l.id===active;ctx.save();ctx.setLineDash([12,9]);stroke(x,yy,x+pw,yy,l.c+(isActive?'DD':'88'),isActive?3:1.7);ctx.restore();if(labels&&(!activeLabelsOnly||l.id===active))tag(l.s,x+pw+15,yy-29,177,l.c,{size:36,height:58});}
 if(scan){const sx=x+((time*1.1)%1)*pw;ctx.save();ctx.beginPath();ctx.rect(x,y,pw,h);ctx.clip();const g=ctx.createLinearGradient(sx-145,0,sx,0);g.addColorStop(0,'#5FCDC900');g.addColorStop(1,'#5FCDC92C');ctx.fillStyle=g;ctx.fillRect(sx-145,y,145,h);stroke(sx,y,sx,y+h,C.cyan,2);ctx.restore();}
 return {py,last,plotWidth:pw};
}
export function token3D(E,x,y,r,symbol,color,t=0){const {ctx,disc,stroke,type}=E;ctx.save();ctx.translate(x,y);const yaw=.16*Math.sin(Math.min(t,1.2)*1.2);ctx.rotate(-.08+.06*reveal(t));ctx.scale(Math.cos(yaw),1);disc(7,7,r,'#151C32');const g=ctx.createLinearGradient(-r,-r,r,r);g.addColorStop(0,color);g.addColorStop(.38,'#FFFFFF');g.addColorStop(.42,color);g.addColorStop(1,'#20223F');ctx.shadowBlur=35;ctx.shadowColor=color+'55';disc(0,0,r,g);ctx.shadowBlur=0;ctx.strokeStyle='#FFFFFF66';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,r*.86,0,Math.PI*2);ctx.stroke();type(symbol,0,19,Math.max(44,r*.75),'#102036',800,{align:'center'});ctx.restore();}
export function cursor(E,x,y,click=0){const {ctx,C,disc}=E;ctx.save();ctx.translate(x,y);ctx.shadowColor='#0009';ctx.shadowBlur=12;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,48);ctx.lineTo(14,36);ctx.lineTo(26,57);ctx.lineTo(36,51);ctx.lineTo(24,31);ctx.lineTo(42,28);ctx.closePath();ctx.fillStyle=C.ivory;ctx.fill();ctx.strokeStyle='#10162B';ctx.lineWidth=2;ctx.stroke();ctx.shadowBlur=0;if(click>0){ctx.strokeStyle=C.cyan;ctx.lineWidth=3;ctx.globalAlpha*=1-click;ctx.beginPath();ctx.arc(6,12,20+click*42,0,Math.PI*2);ctx.stroke();}ctx.restore();}
export function createMarketToSetup(E,{events,setup=DEMO_SETUP}={}){
 if(!validateSetup(setup))throw new Error('Inconsistent demo LONG levels');
 const {ctx,C,type,label,panel,tag,stroke,rounded,brandPlate}=E;
 const fades=(time,start,end,draw)=>{if(time<start||time>=end+.28)return;let left=0,right=1080,offset=0;if(time<start+.28){const p=smooth((time-start)/.28);left=1080*(1-p);offset=30*(1-p);}if(time>=end){const p=smooth((time-end)/.28);right=1080*(1-p);offset=-30*p;}ctx.save();ctx.beginPath();ctx.rect(left,0,Math.max(0,right-left),1920);ctx.clip();ctx.translate(offset,0);draw();ctx.restore();};
 function render(time){
  const compact=smooth((time-events.assets+.4)/.8),cy=462-62*compact,width=960-240*compact;
  ctx.save();if(time<events.market){const mask=reveal(time,events.open,.85);ctx.beginPath();ctx.rect(30,260,1020*mask,430);ctx.clip();}brandPlate(time-events.open,540,cy,width,0);ctx.restore();
  fades(time,events.open,events.market,()=>{type('ОТКРОЙ SCAN AI',540,698,74,C.ivory,800,{align:'center',maxWidth:920});label('АНАЛИЗ В TELEGRAM',540,785,C.cyan,40,{align:'center'});});
  fades(time,events.market,events.assets,()=>{
   type('ВЫБЕРИ РЫНОК',540,704,76,C.ivory,800,{align:'center'});
   const options=[{name:'CRYPTO',symbol:'₿',c:C.gold},{name:'GOLD',symbol:'Au',c:C.gold},{name:'FOREX',symbol:'$',c:C.blue}];
   options.forEach((a,i)=>{const k=reveal(time,events.market+i*.14,.45),x=80+i*315;ctx.save();ctx.globalAlpha*=k;ctx.translate(0,45*(1-k));panel(x,844,290,363,{accent:i===0?C.cyan:a.c});token3D(E,x+145,965,58,a.symbol,a.c,time-events.market);type(a.name,x+145,1100,42,C.ivory,700,{align:'center'});if(i===0&&time>=events.marketClick)tag('ВЫБРАНО',x+24,1133,242,C.cyan,{size:36,height:58});ctx.restore();});
   const p=smooth((time-events.marketClick+.35)/.35);cursor(E,850-560*p,1320-230*p,reveal(time,events.marketClick,.45));label('КРИПТО · ЗОЛОТО · ВАЛЮТА',540,1385,C.muted,38,{align:'center',maxWidth:920});
  });
  fades(time,events.assets,events.analysis,()=>{
   type('ВЫБЕРИ АКТИВ',540,622,76,C.ivory,800,{align:'center'});
   ['BTC/USDT','ETH/USDT','SOL/USDT'].forEach((a,i)=>{const x=100,y=755+i*207;panel(x,y,880,168,{accent:i===0?C.cyan:C.violet});type(a,153,y+100,49,C.ivory,700,{mono:true});if(i===0)tag('ВЫБРАНО',681,y+55,250,C.cyan,{size:36,height:60});});cursor(E,740,871,reveal(time,events.assetClick,.38));
  });
  fades(time,events.analysis,events.setup,()=>{
   type('AI ANALYSIS',540,612,91,C.ivory,800,{align:'center'});panel(80,710,920,768,{accent:C.cyan});type(setup.asset,128,791,46,C.ivory,700,{mono:true});drawTradingChart(E,{x:140,y:875,w:790,h:405},{time:time-events.analysis,scan:true,progress:reveal(time,events.analysis,.45),fvg:true,orderBlock:true,setup,labels:false});
   const labels=['СВЕЧИ И ЛИКВИДНОСТЬ','ЗОНЫ FVG И ORDER BLOCK','ТОРГОВЫЕ УРОВНИ'];let index=Math.min(2,Math.floor((time-events.analysis)/.38));label(labels[index],540,1399,C.cyan,38,{align:'center',maxWidth:820});
  });
  if(time>=events.setup){const k=reveal(time,events.setup,.4);ctx.save();if(time<events.setup+.28){const p=smooth((time-events.setup)/.28);ctx.beginPath();ctx.rect(1080*(1-p),0,1080*p,1920);ctx.clip();ctx.translate(30*(1-p),0);}ctx.globalAlpha*=k;type('ГОТОВЫЙ СЦЕНАРИЙ',540,575,67,C.ivory,800,{align:'center',maxWidth:920});panel(80,657,920,893,{accent:C.cyan});type(setup.asset,126,735,47,C.ivory,700,{mono:true});tag(setup.side,763,688,190,C.green,{size:40,height:65});
   const n=(time>=events.entry?1:0)+(time>=events.stop?1:0)+(time>=events.targets?3:0);drawTradingChart(E,{x:140,y:789,w:780,h:250},{time,setup,levels:n,labels:false});stroke(126,1080,952,1080,'#B0BFDE30');
   const rows=[['ENTRY',setup.entry,C.cyan,events.entry],['STOP LOSS',setup.stop,C.red,events.stop],...setup.targets.map((p,i)=>[`TAKE PROFIT ${i+1}`,p,i?C.cyan:C.green,events.targets+i*.15])];
   rows.forEach(([s,p,c,start],i)=>{const a=reveal(time,start,.32);ctx.save();ctx.globalAlpha*=a;ctx.translate(24*(1-a),0);type(s,128,1147+i*78,38,c,700);type(price(p),951,1147+i*78,42,C.ivory,600,{align:'right',mono:true});ctx.restore();});ctx.restore();
  }
  const stages=[['РЫНОК',events.market],['АКТИВ',events.assets],['АНАЛИЗ',events.analysis],['СЦЕНАРИЙ',events.setup]];stages.forEach(([s,start],i)=>{const selected=time>=start&&(i===3||time<stages[i+1][1]);label(s,80+i*228,1633,selected?C.cyan:C.muted,36,{maxWidth:236});stroke(80+i*228,1660,287+i*228,1660,time>=start?C.cyan:'#3E4860',3);});
 }
 return {render,setup,events};
}
