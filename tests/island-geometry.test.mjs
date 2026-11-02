import { readFileSync } from 'node:fs';
import { createContext, runInContext } from 'node:vm';
import assert from 'node:assert/strict';
import { test } from 'node:test';

// Exercise the portable output, including its actual inlined Anatomy adapter.
const html=readFileSync(new URL('../public/explore.html',import.meta.url),'utf8');
const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
const context=createContext({addEventListener(){}});
runInContext(scripts.slice(0,-1).join('\n')+'\n'+scripts.at(-1).split('function isTree(')[0],context);
const run=source=>runInContext(source,context);

test('Anatomy and Colorfigures stay registered throughout orbit and tilt',()=>{
 for(const angle of [0,.23,1.5,Math.PI,5.9])for(const elevation of [20,35,78])for(const view of [0,1,2,3]){
  run(`IS_ORBIT=${angle};IS_ELEV=${elevation}*Math.PI/180;VIEW=${view};RC=[280,210];OX=400;OY=40;`);
  for(const point of [[0,0,0],[67,29,91],[560,415,-16]]){
   const error=run(`(()=>{const q=${JSON.stringify(point)},a=P(...q),b=IS_ANATOMY.iso(q,isAnatomyProjection());return Math.hypot(a[0]-b[0],a[1]-b[1]);})()`);
   assert.ok(error<1e-9,`camera registration drift: ${error}`);
  }
 }
});
test('all eleven buildings have finite, distinct geometry at every exposed camera quadrant',()=>{
 assert.equal(run('isInfo.length'),11);
 for(const angle of [0,.25,Math.PI/2,Math.PI,Math.PI*1.5,Math.PI*2])for(const elev of [20,42,78]){
  run(`IS_ORBIT=${angle};IS_ELEV=${elev}*Math.PI/180;VIEW=0;`);
  const shapes=run('isInfo.map((_,i)=>isBuilding(i,0,0,18))');
  assert.equal(new Set(shapes).size,11);
  for(const svg of shapes){assert.doesNotMatch(svg,/NaN|Infinity|undefined/);assert.match(svg,/data-architecture=/);assert.match(svg,/<path/);}
 }
});
test('portable output carries both licenses and needs no module or drawing CDN',()=>{
 assert.match(html,/Copyright \(c\) 2026 Ryan/);
 assert.match(html,/Colorfigures/);
 assert.doesNotMatch(html,/<script[^>]+src=|type="module"/);
});
