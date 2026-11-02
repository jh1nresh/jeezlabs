// Original project architecture. Colorfigures ink + Anatomy convex solids.
// The camera adapter is shared by the map and the selected-building portrait.
function isAnatomyProjection(){return {origin:P(0,0,0),scale:Math.sqrt(1.5/1.6),azimuth:45+(IS_ORBIT+VIEW*Math.PI/2)*180/Math.PI,elevation:IS_ELEV*180/Math.PI};}
function isAnatomySlab(x,y,z,w,d,h,r,color){
 const m=typeof color==='string'?matOf(color):color;
 const p=IS_ANATOMY.slabOf({x,y,w,d,r},z,h,isAnatomyProjection(),4,Math.min(.65,h/3));
 return fill(p.fill,m.d)+p.shades.map((path,i)=>fill(path,mix(m.d,m.m,(i+1)/4))).join('')+fill(p.top,m.l)+ink(p.crease,.55)+ink(p.bevel||'',.3)+ink(p.outline,1.05);
}
function isBuilding(i,x,y,z){ // eslint-disable-line @typescript-eslint/no-unused-vars -- shared classic-script entrypoint
 const color=isColors[i],roof=isMat.roof,cream='#dfd8b7',glass='#97b9ba',dark='#344b50',parts=[];
 const add=(a,b,c,svg)=>{const p={at:[x+a,y+b,z+c],svg};parts.push(p);return p;};
 const B=(a,b,c,w,d,h,col=color,r=0)=>add(a+w/2,b+d/2,c+h/2,r?isAnatomySlab(x+a,y+b,z+c,w,d,h,r,col):box(x+a,y+b,z+c,x+a+w,y+b+d,z+c+h,typeof col==='string'?matOf(col):col));
 const panel=(part,axis,q,u,v,w,h,col,sign=1)=>{
  const n=axis==='x'?[sign,0,0]:[0,sign,0];if(!vis(n))return;
  const plane=axis==='x'?PX(x+q):PY(y+q),offset=axis==='x'?y:x;
  part.svg+=shape(on(plane,rectUV(offset+u,z+v,offset+u+w,z+v+h)),col,.6);
 };
 const windows=(part,a,b,c,w,d,h)=>{
  for(const sign of [-1,1]){
   for(let k=6;k<w-7;k+=14)panel(part,'y',b+(sign>0?d+.12:-.12),a+k,c+7,7,Math.min(12,h-10),glass,sign);
   panel(part,'x',a+(sign>0?w+.12:-.12),b+d/2-5,c+2,10,Math.min(20,h-4),dark,sign);
  }
 };
 const gable=(a,b,c,w,d,rise)=>add(a+w/2,b+d/2,c+rise/2,isRoof(x+a,y+b,z+c,w,d,rise,roof.l));
 const topLine=(points,width=.55)=>line(points.map(([a,b,c])=>[x+a,y+b,z+c]),width);
 // Every plot has a grounded, bevelled base, not a floating object shelf.
 let base=isAnatomySlab(x-5,y-5,z-3,76,61,3,3,isMat.stone);
 switch(isInfo[i][4]){
 case 'hall':{
  // The shared table remains visible; the narrow canopy shelters its far edge.
  const paving=B(1,1,0,63,48,1,cream,2);
  for(let k=13;k<63;k+=13)paving.svg+=topLine([[k,1,1.1],[k,49,1.1]],.35);
  for(const a of [4,57])for(const b of [4,15])B(a,b,1,3,3,35,roof);
  B(-1,0,36,68,23,4,color,2);B(0,2,40,66,2,2,cream);
  B(27,24,1,8,8,13,roof);B(15,21,14,33,22,3,color,4);
  for(const [a,b] of [[8,26],[52,26],[23,45],[39,45]]){B(a,b,1,3,3,9,roof);B(a-3,b-2,10,10,8,2,cream,1);}
  break;
 }
 case 'house':{
  const cottage=B(0,1,0,32,44,32);windows(cottage,0,1,0,32,44,32);gable(0,1,32,32,44,16);
  B(34,4,0,30,39,29,color,1);
  // Rental cubbies are separate fitted doors, never fabricated inventory counts.
  const bank=parts.at(-1);for(const sign of [-1,1])for(let row=0;row<2;row++)for(let k=0;k<3;k++){
   panel(bank,'x',sign>0?64.2:33.8,7+k*11,3+row*12,9,10,cream,sign);
   panel(bank,'x',sign>0?64.3:33.7,13+k*11,7+row*12,1,2,dark,sign);
  }
  B(33,2,29,33,43,3,roof,1);B(38,46,0,12,7,7,cream);B(52,46,0,10,7,11,color);
  break;
 }
 case 'club':{
  const court=B(0,0,0,64,49,2,'#7c9e94',2);
  court.svg+=shape(on(PZ(z+2.1),rectUV(x+3,y+3,x+61,y+46)),'#6d9388',.6);
  for(const a of [14,48])for(const b of [14,33])B(a,b,2,3,3,9,cream);
  const table=B(10,10,11,46,30,3,'#83abb1',1);
  table.svg+=shape(on(PZ(z+14.1),rectUV(x+12,y+12,x+54,y+38)),'#7ea5ad',.65)+topLine([[12,25,14.2],[54,25,14.2]],.6);
  const net=add(33,25,17,shape([[x+33,y+9,z+14],[x+33,y+41,z+14],[x+33,y+41,z+21],[x+33,y+9,z+21]],cream,.75));
  for(let b=11;b<41;b+=3)net.svg+=topLine([[33,b,14],[33,b,21]],.3);
  for(const c of [16.5,19])net.svg+=topLine([[33,9,c],[33,41,c]],.3);
  for(const [a,b] of [[3,2],[59,43]]){B(a,b,2,2,2,39,roof);B(a-3,b-1,41,8,4,4,cream,1);}
  // Two paddles lie flush on the table. They do not animate or imply a game demo.
  for(const [a,b,col] of [[19,19,'#d29484'],[45,31,cream]]){
   table.svg+=shape(on(PZ(z+14.4),ellUV(x+a,y+b,3,4,12)),col,.65);
   table.svg+=shape(on(PZ(z+14.4),rectUV(x+a-1,y+b+3,x+a+1,y+b+7)),cream,.5);
  }
  break;
 }
 case 'gallery':{
  for(let k=0;k<3;k++){
   const a=k*21,h=41-k*10,b=3+k*3;
   const wing=B(a,b,0,21,43-k*3,h,color,1);
   for(const sign of [-1,1]){
    panel(wing,'y',sign>0?46.2:b-.2,a+4,7,13,h-13,cream,sign);
    panel(wing,'y',sign>0?46.3:b-.3,a+6,9,9,h-17,['#9eae8c','#b38e87','#819da6'][k],sign);
   }
   B(a-1,b-1,h,23,45-k*3,3,roof,1);
   if(k===0){B(a+4,b+7,h+3,13,26,2,cream,1);B(a+5,b+8,h+5,11,24,4,glass,1);}
  }
  B(17,47,0,29,6,2,cream);B(21,47,2,21,4,2,cream);
  break;
 }
 case 'play':{
  const floor=B(0,0,0,64,49,2,cream,2);
  for(let a=2;a<62;a+=10)for(let b=2;b<47;b+=9)if((Math.floor((a-2)/10)+Math.floor((b-2)/9))%2===0)floor.svg+=shape(on(PZ(z+2.1),rectUV(x+a,y+b,x+a+10,y+b+9)),color,0);
  for(const [a,b,col] of [[4,3,color],[35,14,'#c1adbd']]){
   const cabinet=B(a,b,2,23,24,36,col,2);
   for(const sign of [-1,1]){
    panel(cabinet,'y',sign>0?b+24.2:b-.2,a+3,19,17,15,cream,sign);
    panel(cabinet,'y',sign>0?b+24.3:b-.3,a+5,21,13,11,dark,sign);
   }
   const deck=B(a,b+22,12,23,9,4,col,1);
   for(const dx of [6,14])deck.svg+=shape(on(PZ(z+16.2),ellUV(x+a+dx,y+b+26,1.5,1.5,8)),cream,.5);
   B(a-1,b-1,38,25,26,4,roof,1);
   B(a+3,b+1,42,17,3,2,cream,1);
  }
  break;
 }
 case 'library':{
  B(0,0,0,64,49,3,cream,1);
  const room=B(3,3,3,48,39,33);windows(room,3,3,3,48,39,33);
  for(let b=3;b<46;b+=13){B(55,b,3,4,4,33,cream);B(53,b-1,3,8,6,2,cream);B(53,b-1,34,8,6,2,cream);}
  B(0,0,36,65,49,4,roof,1);B(6,5,40,44,38,3,cream,1);B(25,5,43,5,38,2,'#b77e70');
  // A document relief set into the reading-room roof, with a red review margin.
  const document=B(11,12,43,11,23,.8,'#e4ddc5');
  for(let b=16;b<33;b+=4)document.svg+=topLine([[11,b,44],[22,b,44]],.4);
  B(61,13,0,7,24,1,cream);B(61,16,1,5,18,2,cream);
  break;
 }
 case 'market':{
  for(const [a,b,col] of [[1,2,color],[35,2,'#b6b9a0'],[19,29,'#a4b8b6']]){
   const kiosk=B(a,b,0,25,18,22,col,1);
   for(const sign of [-1,1])panel(kiosk,'y',sign>0?b+18.2:b-.2,a+5,8,15,10,dark,sign);
   const canopy=add(a+12,b+11,25,'');
   for(let k=0;k<5;k++)canopy.svg+=box(x+a-2+k*6,y+b-2,z+23,x+a+4+k*6,y+b+23,z+26,matOf(k%2?cream:col));
   for(const aa of [a,a+23])B(aa,b+21,0,2,2,23,roof);
   B(a+2,b+17,8,21,6,3,cream);
  }
  break;
 }
 case 'dispatch':{
  const shed=B(0,6,0,64,39,24,color,1);
  for(const sign of [-1,1])for(const a of [5,35]){
   panel(shed,'y',sign>0?45.2:5.8,a,3,24,18,dark,sign);
   panel(shed,'y',sign>0?45.3:5.7,a+2,5,20,13,'#8b9c8c',sign);
  }
  B(-2,4,24,68,43,3,roof,1);B(0,45,0,65,9,3,cream,1);
  const cabin=B(4,10,27,23,27,23);windows(cabin,4,10,27,23,27,23);B(2,8,50,27,31,3,roof,1);
  for(const [a,b,h] of [[37,47,8],[48,47,12],[59,47,6]])B(a,b,3,9,7,h,cream,.8);
  B(14,20,53,3,3,17,roof);B(7,20,66,17,3,2,cream);B(14,13,62,3,17,2,cream);
  break;
 }
 case 'tower':{
  for(const [a,b,w,d,c,h] of [[8,3,46,43,0,13],[14,9,34,31,13,28],[20,15,22,19,41,18]]){
   const stage=B(a,b,c,w,d,h,color,1);
   for(const sign of [-1,1])for(let v=c+5;v<c+h-2;v+=7)panel(stage,'y',b+(sign>0?d+.12:-.12),a+4,v,w-8,1,cream,sign);
   B(a-2,b-2,c+h,w+4,d+4,2,roof,1);
  }
  const beacon=B(21,16,61,20,17,15,glass,1);
  for(const sign of [-1,1])panel(beacon,'y',sign>0?33.2:15.8,24,64,14,9,cream,sign);
  for(const a of [20,39])for(const b of [15,32])B(a,b,61,2,2,15,roof);
  B(17,12,76,27,25,4,roof,1);B(29,23,80,3,3,11,cream);
  break;
 }
 case 'archive':{
  const wing=B(0,0,0,24,47,31);windows(wing,0,0,0,24,47,31);
  const wing2=B(24,0,0,39,17,24);windows(wing2,24,0,0,39,17,24);
  B(-2,-2,31,28,51,3,roof,1);B(23,-2,24,42,21,3,roof,1);
  B(2,2,34,20,43,2,'#91a782',2);
  for(const b of [8,22,36])B(6,b,36,12,7,3,'#b4c491',2);
  // A courtyard map table links the archive to private place memories.
  for(const a of [33,56])for(const b of [27,43])B(a,b,0,2,2,10,roof);
  const map=B(30,24,10,31,24,2,cream,1);
  map.svg+=topLine([[30,31,12.2],[61,31,12.2]],.55)+topLine([[39,24,12.2],[39,48,12.2]],.55)+topLine([[30,43,12.2],[49,24,12.2]],.55);
  const markerStart=parts.length;
  for(const [a,b] of [[35,28],[45,35],[55,44]]){B(a,b,12,1.4,1.4,6,roof);B(a-1,b-1,18,3.4,3.4,3,color,.8);}
  map.svg+=byDepth(parts.splice(markerStart));
  B(24,48,0,39,5,4,color,1);B(27,49,4,33,3,2,'#91a782');
  break;
 }
 case 'workshop':{
  const shed=B(0,0,0,63,26,27);windows(shed,0,0,0,63,26,27);
  // Two glazed roof bays, each with a real roof thickness and ridge.
  for(let k=0;k<2;k++){
   const b=k*13;
   const bay=add(31,b+6,32,isRoof(x,y+b,z+27,63,10,11,roof.l));
   // The pane follows the near roof slope (rise 11 over run 8), not its interior.
   if(vis([0,-11,8]))bay.svg+=shape([[x+3,y+b+1,z+32.65],[x+59,y+b+1,z+32.65],[x+59,y+b+4,z+36.775],[x+3,y+b+4,z+36.775]],glass,.6);
  }
  for(const a of [4,44])for(const b of [33,49])B(a,b,0,3,3,11,roof);
  const work=B(1,31,11,50,23,3,cream,1);
  work.svg+=shape(on(PZ(z+14.15),rectUV(x+4,y+34,x+48,y+51)),'#aaa996',.5);
  const pieceStart=parts.length;
  for(const [a,b,w,d] of [[5,35,15,7],[22,35,24,7],[5,44,10,6],[17,44,13,6],[32,44,14,6]])B(a,b,14.2,w,d,.65,color,.4);
  work.svg+=byDepth(parts.splice(pieceStart));
  B(56,31,0,8,23,3,roof);for(let k=0;k<4;k++)B(56+k*2,32,3,1.2,21,17+k*2,cream);
  break;
 }
 }
 return `<g data-architecture="${isInfo[i][4]}">${base}${byDepth(parts)}</g>`;
}
