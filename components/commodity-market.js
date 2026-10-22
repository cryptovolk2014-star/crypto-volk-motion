import {clamp,reveal,smooth} from './fintech.js';

// Decimal-price commodity charts. SHORT and LONG share one deterministic OHLC
// series, so the scan, scenario and detail view explain the same setup.
export function validateCommoditySetup(s){
 const direction=s.side==='SHORT'?-1:s.side==='LONG'?1:0;
 return !!direction&&s.demo===true&&(s.entry-s.stop)*direction>0&&s.targets.every((p,i)=>(p-s.entry)*direction>0&&(!i||(p-s.targets[i-1])*direction>0))&&s.min<Math.min(s.stop,...s.targets)&&s.max>Math.max(s.stop,...s.targets);
}
export const commodityPrice=v=>Number(v).toFixed(2);
export function createCommodityMarket(E,setup){
 if(!validateCommoditySetup(setup))throw Error('Invalid commodity demonstration');
 const {ctx,C,stroke,rounded,trace,disc,label,tag}=E;
 const pattern=[.68,.76,.70,.81,.75,.65,.72,.61,.66,.55,.60,.53,.49,.58,.54,.43,.38,.44,.35,.30,.36,.28,.23,.20];
 const direction=setup.side==='SHORT'?-1:1;
 const candles=pattern.map((p,i)=>{const n=direction<0?p:1-p,prev=direction<0?(pattern[i-1]??.73):1-(pattern[i-1]??.73),span=setup.max-setup.min;const close=setup.min+span*(.27+n*.67),open=setup.min+span*(.27+prev*.67);return {open,close,high:Math.max(open,close)+span*.023,low:Math.min(open,close)-span*.023};});
 function chart(box,{time=0,progress=1,scan=false,levels=0,active='',zones=false,showLabels=false,priceTicks=false,fall=false}={}){
  const {x,y,w,h}=box,py=p=>y+h*(setup.max-p)/(setup.max-setup.min),pw=w-(showLabels?185:0);
  for(let j=0;j<=4;j++){stroke(x,y+h*j/4,x+pw,y+h*j/4,'#A8BBD027',1);if(priceTicks)label(commodityPrice(setup.max-j*(setup.max-setup.min)/4),x+pw-5,y+h*j/4-15,C.muted,36,{align:'right',mono:true});}
  for(let j=0;j<=6;j++)stroke(x+pw*j/6,y,x+pw*j/6,y+h,'#A8BBD014',1);
  const zone=(range,start,color)=>{ctx.fillStyle=color+'20';rounded(x+pw*start,py(range[1]),pw*(1-start),py(range[0])-py(range[1]),5);ctx.fill();stroke(x+pw*start,py(range[1]),x+pw,py(range[1]),color+'90',2);};
  if(zones){zone(setup.fvg,.48,C.cyan);zone(setup.orderBlock,.12,C.violet);}
  const n=Math.max(1,Math.ceil(clamp(progress)*candles.length)),points=[];
  ctx.save();ctx.beginPath();ctx.rect(x-16,y-12,pw+32,h+24);ctx.clip();
  for(let i=0;i<n;i++){const a=candles[i],xx=x+i*pw*.95/(candles.length-1),color=a.close<a.open?C.red:C.cyan;stroke(xx,py(a.high),xx,py(a.low),color+'D0',2.7);ctx.fillStyle=color;rounded(xx-7,Math.min(py(a.close),py(a.open)),14,Math.max(9,Math.abs(py(a.close)-py(a.open))),2);ctx.fill();points.push([xx,py(a.close)]);}
  trace(points,fall?C.red:C.cyan,2.5,fall?12:4);const last=points.at(-1);disc(...last,6,C.ivory);
  if(scan){const p=(time*.7)%1,sx=x+p*pw,g=ctx.createLinearGradient(sx-130,0,sx,0);g.addColorStop(0,'#5FCDC900');g.addColorStop(1,'#5FCDC934');ctx.fillStyle=g;ctx.fillRect(sx-130,y,130,h);stroke(sx,y,sx,y+h,C.cyan,3);}
  ctx.restore();
  const all=[{id:'entry',p:setup.entry,name:'ENTRY',c:C.cyan},{id:'target',p:setup.targets[0],name:'TAKE PROFIT',c:C.green},{id:'risk',p:setup.stop,name:'STOP LOSS',c:C.red}];
  const rendered=[];all.slice(0,levels).forEach(l=>{const yy=py(l.p);ctx.save();ctx.setLineDash([12,9]);stroke(x,yy,x+pw,yy,l.c+(active===l.id?'FF':'88'),active===l.id?3:2);ctx.restore();if(showLabels)tag(l.name,x+pw+12,yy-29,176,l.c,{size:36,height:58});if(active===l.id){disc(x+pw*.72,yy,11,l.c);ctx.strokeStyle=l.c+'60';ctx.lineWidth=2;ctx.beginPath();ctx.arc(x+pw*.72,yy,25,0,Math.PI*2);ctx.stroke();}rendered.push({...l,y:yy});});
  return {levels:rendered,box,py};
 }
 function downImpulse(box,time){
  const {x,y,w,h}=box,k=reveal(time,.1,.8),pts=[[x,y],[x+w*.23,y+h*.17],[x+w*.42,y+h*.09],[x+w*.6,y+h*.48],[x+w*.77,y+h*.41],[x+w,y+h]];
  const n=Math.max(2,Math.ceil(pts.length*k));trace(pts.slice(0,n),C.red,6,16);if(k>.9){const [xx,yy]=pts.at(-1);stroke(xx,yy,xx-35,yy-11,C.red,6);stroke(xx,yy,xx+4,yy-38,C.red,6);}
 }
 return {chart,downImpulse,setup,candles,validate:()=>validateCommoditySetup(setup)};
}
