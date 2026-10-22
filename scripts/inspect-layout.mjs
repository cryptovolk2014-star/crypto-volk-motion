// Check actual rendered glyph boxes and image layers; panels may contain content,
// while settled text and brand artwork must not accidentally cover one another.
export async function inspectLayout(page,times,{brandImagesOnly=false}={}){return page.evaluate(({times,brandImagesOnly})=>{
 const violations=[],draw=CanvasRenderingContext2D.prototype.drawImage;let images=[];
 CanvasRenderingContext2D.prototype.drawImage=function(im,...a){if(a.length===4){const [x,y,w,h]=a,m=this.getTransform(),pts=[[x,y],[x+w,y],[x,y+h],[x+w,y+h]].map(([px,py])=>({x:m.a*px+m.c*py+m.e,y:m.b*px+m.d*py+m.f}));images.push({src:new URL(im.src).pathname,opacity:this.globalAlpha,bounds:{left:Math.min(...pts.map(p=>p.x)),right:Math.max(...pts.map(p=>p.x)),top:Math.min(...pts.map(p=>p.y)),bottom:Math.max(...pts.map(p=>p.y))}});}return draw.call(this,im,...a);};
 const intersection=(a,b)=>Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left))*Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top));
 try{for(const t of times){images=[];render(t);const texts=lastTextAudit.filter(x=>x.opacity>.98);for(let i=0;i<texts.length;i++)for(let j=i+1;j<texts.length;j++)if(intersection(texts[i].bounds,texts[j].bounds)>22)violations.push({time:t,kind:'text-text',first:texts[i].text,second:texts[j].text});for(const im of images.filter(x=>x.opacity>.98&&(!brandImagesOnly||x.src.startsWith('/assets/brand/'))))for(const text of texts)if(intersection(im.bounds,text.bounds)>22)violations.push({time:t,kind:'brand-text',image:im.src,text:text.text});}}finally{CanvasRenderingContext2D.prototype.drawImage=draw;}
 return {sampledFrames:times.length,textAndBrandCollisions:violations};
 },{times,brandImagesOnly});}
