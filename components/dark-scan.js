import {smooth} from './fintech.js';
// A scan accent keeps the entire composition in Navy, including the phone interface.
export function drawDarkScan(E,{time,start,end,draw}){
 const {ctx,stroke}=E;E.setTheme('dark');draw();
 if(time<start||time>=end)return;
 const p=smooth((time-start)/(end-start)),y=1920*p,fade=Math.sin(Math.PI*p);
 ctx.save();ctx.globalAlpha*=fade;const band=ctx.createLinearGradient(0,y-115,0,y+12);band.addColorStop(0,'#5FCDC900');band.addColorStop(1,'#5FCDC916');ctx.fillStyle=band;ctx.fillRect(0,Math.max(0,y-115),1080,127);ctx.shadowColor='#5FCDC9';ctx.shadowBlur=24;stroke(0,y,1080,y,'#5FCDC9',3);ctx.restore();
}
