import {reveal,smooth,clamp} from './fintech.js';
import {drawTradingChart,validateSetup,cursor} from './trading-setup.js';
export const forexPrice=n=>n.toFixed(5);
// One continuous application surface: pair → horizon → analysis → full setup.
export function createForexJourney(E,{events,setup}){
 if(!validateSetup(setup))throw Error('Inconsistent EUR/USD demo');
 const {ctx,C,type,label,panel,tag,stroke,rounded,brandPlate}=E;
 function layer(t,start,end,draw){if(t<start||t>=end+.25)return;ctx.save();const p=t<start+.25?smooth((t-start)/.25):1,q=t>=end?smooth((t-end)/.25):0;ctx.beginPath();ctx.rect(80+920*(1-p),731,920*(p-q),858);ctx.clip();ctx.translate(24*(1-p)-24*q,0);draw();ctx.restore();}
 function render(t){
  const stage=t<events.shortTerm?'pair':t<events.analysis?'mode':t<events.setup?'analysis':'setup';
  brandPlate(t-events.open,540,639,830,0);panel(80,743,920,841,{accent:stage==='mode'?C.violet:C.cyan});
  layer(t,events.open,events.shortTerm,()=>{
   type('ВЫБЕРИ ВАЛЮТНУЮ ПАРУ',540,840,53,C.ivory,800,{align:'center',maxWidth:820});
   ['EUR/USD','GBP/USD','USD/JPY'].forEach((name,i)=>{const y=916+i*190,selected=i===0&&t>=events.pairClick;panel(122,y,836,149,{accent:selected?C.cyan:C.line});type(name,165,y+91,53,C.ivory,700,{mono:true});if(selected)tag('ВЫБРАНО',651,y+45,262,C.cyan,{size:38,height:64});else label(['ЕВРО / ДОЛЛАР','ФУНТ / ДОЛЛАР','ДОЛЛАР / ИЕНА'][i],917,y+89,C.muted,36,{align:'right',maxWidth:430});});
   if(t>=events.pairs){const p=smooth((t-events.pairClick+.35)/.35);cursor(E,850-230*p,1480-420*p,reveal(t,events.pairClick,.35));}
  });
  layer(t,events.shortTerm,events.analysis,()=>{
   type('EUR/USD',126,826,46,C.ivory,700,{mono:true});label('СРОК ТОРГОВЛИ',954,826,C.violet,38,{align:'right'});
   const names=['КРАТКОСРОЧНАЯ','СРЕДНЕСРОЧНАЯ'];names.forEach((name,i)=>{const y=931+i*255,selected=(t>=events.mediumTerm?1:0)===i;panel(122,y,836,211,{accent:selected?C.violet:C.line});tag(i===0?'01':'02',154,y+58,100,selected?C.violet:C.muted,{size:40,height:84});type(name,294,y+89,43,selected?C.violet:C.ivory,800,{maxWidth:620});label(i===0?'БЛИЖАЙШЕЕ ДВИЖЕНИЕ':'БОЛЕЕ ДЛИННЫЙ ГОРИЗОНТ',294,y+152,C.muted,36,{maxWidth:620});});
   cursor(E,852,1379,reveal(t,events.modeClick,.4));label('ВЫБЕРИ ПОДХОДЯЩИЙ ГОРИЗОНТ',540,1504,C.muted,36,{align:'center',maxWidth:820});
  });
  layer(t,events.analysis,events.setup,()=>{
   type('EUR/USD',126,825,46,C.ivory,700,{mono:true});tag('AI',804,778,150,C.cyan,{size:40,height:68});
   drawTradingChart(E,{x:142,y:927,w:788,h:375},{time:t-events.analysis,setup,scan:true,progress:reveal(t,events.analysis,.75),fvg:t>=events.scan,orderBlock:t>=events.scan,labels:false});
   const n=Math.min(2,Math.floor(Math.max(0,t-events.scan)/.48));label(t<events.scan?'СКАНИРОВАНИЕ ГРАФИКА':['СТРУКТУРА ЦЕНЫ','ЗОНЫ ИНТЕРЕСА','КЛЮЧЕВЫЕ УРОВНИ'][n],540,1437,C.cyan,40,{align:'center',maxWidth:820});
   stroke(128,1503,952,1503,C.line,3);stroke(128,1503,128+824*clamp((t-events.analysis)/(events.setup-events.analysis)),1503,C.cyan,4);
  });
  if(t>=events.setup){
   const k=reveal(t,events.setup,.35);ctx.save();ctx.globalAlpha*=k;
   type('EUR/USD',126,825,49,C.ivory,700,{mono:true});if(t>=events.direction)tag('LONG',753,777,200,C.green,{size:40,height:68});else label('ДЕМО',952,825,C.muted,38,{align:'right'});
   const levels=(t>=events.entry?1:0)+(t>=events.stop?1:0)+(t>=events.targets?3:0),active=t>=events.targets?'targets':t>=events.stop?'stop':'entry';
   const chart=drawTradingChart(E,{x:140,y:875,w:790,h:202},{time:t,setup,levels,active,labels:false,fvg:true,orderBlock:true});
   if(t<events.entry){const a=1-reveal(t,events.entry-.25,.25);ctx.save();ctx.globalAlpha*=a;if(t>=events.direction){type('LONG',540,1262,136,C.green,800,{align:'center'});label('НАПРАВЛЕНИЕ СДЕЛКИ',540,1353,C.muted,38,{align:'center'});}else{type('СЦЕНАРИЙ',540,1235,76,C.ivory,800,{align:'center'});type('EUR/USD',540,1356,95,C.cyan,700,{align:'center',mono:true});}ctx.restore();}
   const rows=[['ENTRY',setup.entry,C.cyan,events.entry],['STOP LOSS',setup.stop,C.red,events.stop],...setup.targets.map((p,i)=>[`TAKE PROFIT ${i+1}`,p,i?C.cyan:C.green,events.targets+i*.14])];
   rows.forEach(([s,p,c,start],i)=>{const a=reveal(t,start,.25);ctx.save();ctx.globalAlpha*=a;ctx.translate(20*(1-a),0);type(s,128,1148+i*72,38,c,700);type(forexPrice(p),952,1148+i*72,43,C.ivory,600,{align:'right',mono:true});ctx.restore();});
   stroke(126,1472,954,1472,C.line,1.5);
   if(t>=events.explain){const index=Math.min(2,Math.floor((t-events.explain)/.55)),lines=['ВХОД: РЕТЕСТ УРОВНЯ','СТОП: НИЖЕ СТРУКТУРЫ','ЦЕЛИ: ЗОНЫ ЛИКВИДНОСТИ'];tag(lines[index],118,1494,844,C.violet,{size:36,height:65});}else label('ДЕМОНСТРАЦИОННЫЙ СЦЕНАРИЙ',540,1540,C.muted,36,{align:'center',maxWidth:820});
   ctx.restore();return {stage,levels,active,renderedLevels:[{label:'ENTRY',price:setup.entry,y:chart.py(setup.entry)},{label:'STOP LOSS',price:setup.stop,y:chart.py(setup.stop)},...setup.targets.map((p,i)=>({label:`TAKE PROFIT ${i+1}`,price:p,y:chart.py(p)}))]};
  }
  return {stage};
 }
 function stages(t){const names=[['ПАРА',events.open],['СРОК',events.shortTerm],['АНАЛИЗ',events.analysis],['СЦЕНАРИЙ',events.setup]];names.forEach(([name,start],i)=>{const selected=t>=start&&(i===3||t<names[i+1][1]);label(name,80+i*235,1660,selected?C.cyan:C.muted,36,{maxWidth:225});stroke(80+i*235,1687,295+i*235,1687,t>=start?C.cyan:C.line,3);});}
 return {render,stages,setup,validate:()=>validateSetup(setup)};
}
