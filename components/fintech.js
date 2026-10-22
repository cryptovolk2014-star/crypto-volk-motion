// Shared visual language extracted unchanged from the approved Rebuild 02.
export const C={navy:'#050718',ivory:'#F3EFE9',violet:'#7A52EE',cyan:'#5FCDC9',muted:'#B0B9CD',line:'#414A67',green:'#72E3B2',red:'#FF7089',gold:'#F5CF80',blue:'#69AEFF'};
export const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
export const ease=v=>1-(1-clamp(v))**3;
export const smooth=v=>{v=clamp(v);return v*v*(3-2*v);};
export const reveal=(t,delay=0,duration=.7)=>ease((t-delay)/duration);
const BASE_COLORS=C;
export function createFintechEngine(canvas,{minFont=36,small=38,theme='dark'}={}){
// A palette belongs to an engine instance: older compositions keep their exact dark rendering.
const dark={...BASE_COLORS},light={...BASE_COLORS,navy:'#F3EFE9',ivory:'#050718',muted:'#526076',line:'#C7CBD6',cyan:'#167B78',violet:'#7043DA',green:'#16734E',red:'#BC2D4A',blue:'#2768BC',gold:'#8E6315'};
const colors={...dark};let currentTheme=theme;
const C=colors;
function setTheme(name){currentTheme=name;Object.assign(colors,name==='light'?light:dark);}
setTheme(theme);
const ctx=canvas.getContext('2d',{alpha:false}),W=1080,H=1920;
const TYPE={headline:118,body:46,ui:40,small,min:minFont};
let plate,logo,textAudit=[];
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
 textAudit.push({text:s,color:ctx.fillStyle,theme:currentTheme,opacity:ctx.globalAlpha,size:Number(size.toFixed(2)),x,y,align,width:metrics.width,bounds:{left:Math.min(...corners.map(p=>p.x)),right:Math.max(...corners.map(p=>p.x)),top:Math.min(...corners.map(p=>p.y)),bottom:Math.max(...corners.map(p=>p.y))}});ctx.restore();
}
function label(s,x,y,color=C.muted,size=TYPE.small,opts={}){type(s,x,y,size,color,600,opts);}
function title(s,y,t,delay=0,color=C.ivory,size=TYPE.headline){const k=reveal(t,delay,.62);ctx.save();ctx.globalAlpha*=k;ctx.translate(0,36*(1-k));type(s,80,y,size,color,800,{maxWidth:920});ctx.restore();}
function group(t,delay,draw){const k=reveal(t,delay,.8);ctx.save();ctx.globalAlpha*=k;ctx.translate(0,66*(1-k));draw(k);ctx.restore();}
function panel(x,y,w,h,{accent=C.violet,radius=32,fill='#10162D'}={}){
 if(currentTheme==='light'){
  ctx.save();ctx.shadowColor='#26304E1A';ctx.shadowBlur=36;ctx.shadowOffsetY=16;
  const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,'#FFFFFF');g.addColorStop(1,'#F7F6FA');ctx.fillStyle=g;rounded(x,y,w,h,radius);ctx.fill();ctx.shadowBlur=0;ctx.shadowOffsetY=0;ctx.lineWidth=1.8;ctx.strokeStyle='#B9BFCE';ctx.stroke();stroke(x+radius,y,x+w-radius,y,accent+'A0',3);ctx.restore();return;
 }
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
 if(currentTheme==='light'){
  ctx.fillStyle='#F3EFE9';ctx.fillRect(0,0,W,H);
  const glow=ctx.createRadialGradient(1060,760,30,1000,950,1000);glow.addColorStop(0,'#5FCDC930');glow.addColorStop(1,'#5FCDC900');ctx.fillStyle=glow;ctx.fillRect(0,0,W,H);
  const violet=ctx.createRadialGradient(20,1370,20,120,1320,780);violet.addColorStop(0,'#7A52EE13');violet.addColorStop(1,'#7A52EE00');ctx.fillStyle=violet;ctx.fillRect(0,0,W,H);
  ctx.save();ctx.translate(540,1050);ctx.rotate(-.22+Math.sin(t*.16)*.035);ctx.strokeStyle='#635A8B16';ctx.lineWidth=1.5;for(let j=0;j<3;j++){ctx.beginPath();ctx.ellipse(0,0,570+j*85,470+j*65,0,0,Math.PI*2);ctx.stroke();}ctx.restore();
  for(let x=80;x<=1000;x+=80)for(let y=640;y<1460;y+=80)disc(x,y,1.2,'#525A7225');return;
 }
 ctx.fillStyle=C.navy;ctx.fillRect(0,0,W,H);
 let g=ctx.createRadialGradient(120,450,40,150,600,1000);g.addColorStop(0,'#39227265');g.addColorStop(1,'#05071800');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
 let c=ctx.createRadialGradient(1050,1280,10,1000,1340,820);c.addColorStop(0,'#17677A4A');c.addColorStop(1,'#05071800');ctx.fillStyle=c;ctx.fillRect(0,0,W,H);
 // Restrained architecture behind the content, not a field of tiny UI text.
 ctx.save();ctx.translate(540,1050);ctx.rotate(-.22+Math.sin(t*.16)*.035);ctx.strokeStyle='#8B85BB20';ctx.lineWidth=1;for(let j=0;j<3;j++){ctx.beginPath();ctx.ellipse(0,0,570+j*85,470+j*65,0,0,Math.PI*2);ctx.stroke();}ctx.restore();
 for(let x=80;x<=1000;x+=80)for(let y=640;y<1460;y+=80)disc(x,y,1.1,'#C6CEFF16');
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
function miniTrend(x,y,w,h,c,t){const a=[.25,.33,.28,.47,.4,.55,.48,.65,.59,.82];let p=[];const n=Math.max(1,Math.ceil(a.length*reveal(t,.15,1.2)));for(let i=0;i<n;i++)p.push([x+i*w/(a.length-1),y+h-a[i]*h]);trace(p,c,4,8);if(p.length)disc(...p.at(-1),5,c);}

return {ctx,C,TYPE,rounded,stroke,disc,type,label,title,group,panel,tag,trace,contain,brandPlate,caption,arrow,telegram,background,chart,goldCoin,miniTrend,setTheme,getTheme:()=>currentTheme,setBrandAssets:(assets)=>{plate=assets.plate;logo=assets.logo;},resetAudit:()=>textAudit=[],getAudit:()=>textAudit};
}
