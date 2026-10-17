// Deterministic cutouts of the supplied artwork. No image generation or redraw.
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {PNG} from 'pngjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const directory=path.join(root,'assets/brand/clean');fs.mkdirSync(directory,{recursive:true});
const hash=buffer=>createHash('sha256').update(buffer).digest('hex');
const manifest=[];
function save(name,image,source,method){
 const bytes=PNG.sync.write(image);fs.writeFileSync(path.join(directory,name),bytes);
 let empty=0,soft=0;for(let i=3;i<image.data.length;i+=4){if(image.data[i]===0)empty++;else if(image.data[i]<255)soft++;}
 const item={path:`assets/brand/clean/${name}`,source,source_sha256:hash(fs.readFileSync(path.join(root,source))),sha256:hash(bytes),width:image.width,height:image.height,transparent_pixels:empty,antialiased_pixels:soft,method};
 manifest.push(item);console.log(JSON.stringify(item));
}
// Logo: the known flat navy matte is removed from every pixel, including holes
// between letters and in the wolf mark. Fully opaque artwork RGB is untouched.
{
 const source='assets/brand/cryptovolk-trade.png',im=PNG.sync.read(fs.readFileSync(path.join(root,source))),bg=[5,7,24];
 let minX=im.width,minY=im.height,maxX=0,maxY=0;
 for(let y=0;y<im.height;y++)for(let x=0;x<im.width;x++){
  const i=(y*im.width+x)*4,delta=Math.max(...bg.map((b,c)=>Math.abs(im.data[i+c]-b)));
  const alpha=Math.max(0,Math.min(1,(delta-2)/16));
  if(alpha>0&&alpha<1)for(let c=0;c<3;c++)im.data[i+c]=Math.max(0,Math.min(255,Math.round((im.data[i+c]-(1-alpha)*bg[c])/alpha)));
  im.data[i+3]=Math.round(im.data[i+3]*alpha);
  if(im.data[i+3]>0){minX=Math.min(x,minX);minY=Math.min(y,minY);maxX=Math.max(x,maxX);maxY=Math.max(y,maxY);}
 }
 const pad=20;minX=Math.max(0,minX-pad);minY=Math.max(0,minY-pad);maxX=Math.min(im.width-1,maxX+pad);maxY=Math.min(im.height-1,maxY+pad);
 const cut=new PNG({width:maxX-minX+1,height:maxY-minY+1});PNG.bitblt(im,cut,minX,minY,cut.width,cut.height,0,0);
 save('cryptovolk-logo.png',cut,source,'Flat navy matte removed; antialiased edges unmatted; content bounds cropped with 20px transparent padding.');
}
// Plate: retain the complete original interior and frame. Only the surrounding
// rectangular canvas is masked. A rounded contour retains the natural neon halo.
{
 const source='assets/brand/scan-ai-banner.png',im=PNG.sync.read(fs.readFileSync(path.join(root,source)));
 const left=78,top=149,right=2097,bottom=560,radius=106,halo=28;
 const minX=left-halo,minY=top-halo,width=right-left+halo*2,height=bottom-top+halo*2;
 const cut=new PNG({width,height});
 const cx=(left+right)/2,cy=(top+bottom)/2,hx=(right-left)/2,hy=(bottom-top)/2;
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){
  const sx=x+minX,sy=y+minY,qi=Math.abs(sx-cx)-(hx-radius),qj=Math.abs(sy-cy)-(hy-radius);
  const distance=Math.hypot(Math.max(qi,0),Math.max(qj,0))+Math.min(Math.max(qi,qj),0)-radius;
  let a=distance<=0?1:distance>=halo?0:Math.exp(-Math.pow(distance/11,2));
  if(a<1/255)a=0;
  const i=(y*width+x)*4,j=(sy*im.width+sx)*4;for(let c=0;c<3;c++)cut.data[i+c]=im.data[j+c];cut.data[i+3]=Math.round(a*255);
 }
 save('scan-ai-plate.png',cut,source,'Rounded contour (78,149)-(2097,560), radius 106; transparent outside; original plate interior preserved; 28px fading neon halo.');
}
fs.writeFileSync(path.join(directory,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
