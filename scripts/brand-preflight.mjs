import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {PNG} from 'pngjs';
const hash=x=>createHash('sha256').update(x).digest('hex');
export function brandPreflight(){
 const rows=JSON.parse(fs.readFileSync('assets/brand/clean/manifest.json','utf8'));
 for(const item of rows){const bytes=fs.readFileSync(item.path),p=PNG.sync.read(bytes);assert.equal(hash(bytes),item.sha256);assert.equal(hash(fs.readFileSync(item.source)),item.source_sha256,'Original branding modified');
  for(const [x,y] of [[0,0],[p.width-1,0],[0,p.height-1],[p.width-1,p.height-1]])assert.equal(p.data[(y*p.width+x)*4+3],0,'Brand has opaque exterior corners');
  assert.ok(item.transparent_pixels>10000&&item.antialiased_pixels>0,'Missing true cutout transparency');
  const edges=[];for(let x=0;x<p.width;x++)edges.push(p.data[x*4+3],p.data[((p.height-1)*p.width+x)*4+3]);for(let y=0;y<p.height;y++)edges.push(p.data[y*p.width*4+3],p.data[(y*p.width+p.width-1)*4+3]);assert.ok(Math.max(...edges)<=3,'Outer canvas has an opaque background');
 }return rows.map(({path,sha256})=>({path,sha256,alpha:'passed'}));
}
