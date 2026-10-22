import {smooth} from './fintech.js';
// A deterministic, reusable palette reveal. Both layers share one scene and one clock.
// Native text is painted in both palettes through complementary spatial masks.
export function drawThemeReveal(E,{time,start,end,draw}){
 const {ctx,stroke}=E;
 if(time<start||time>=end){E.setTheme(time>=end?'light':'dark');draw();return;}
 E.setTheme('dark');draw();
 const line=1920*smooth((time-start)/(end-start));
 ctx.save();ctx.beginPath();ctx.rect(0,0,1080,line);ctx.clip();
 E.setTheme('light');E.resetAudit();draw();ctx.restore();
 ctx.save();ctx.shadowColor='#5FCDC9';ctx.shadowBlur=28;
 const g=ctx.createLinearGradient(0,0,1080,0);g.addColorStop(0,'#7A52EE');g.addColorStop(.5,'#FFFFFF');g.addColorStop(1,'#5FCDC9');
 stroke(0,line,1080,line,g,5);ctx.restore();
}
