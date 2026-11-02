// Colorfigures primitives, scoped to two SVG surfaces. No mountFigure or animation loop.
const isInfo=[
 ['The commons','Group coordination','DIP focuses on group coordination.',['Coordination','Groups'],'hall'],
 ['Rental house','Agentic rentals','GIMI explores agentic rentals.',['Agents','Rentals'],'house'],
 ['Table tennis club','Ping pong finder','PINGME helps people find table tennis.',['Table tennis','Discovery'],'club'],
 ['Gallery','NFT gallery viewer','DISTOKEN is an NFT gallery viewer.',['NFT','Gallery'],'gallery'],
 ['Play house','Multiplayer party game','TRANSPARENT is a multiplayer party game.',['Multiplayer','Party game'],'play'],
 ['Review library','Law review scanner','REDLINE AI focuses on legal review and document scanning.',['Documents','Legal review'],'library'],
 ['Agent market','AI agent marketplace','AGENTSHACK is a marketplace for discovering AI agents.',['Agents','Marketplace'],'market'],
 ['Dispatch house','Distributed print-production network','OUTPUT connects production jobs with print shops through a distributed production network. Explore the sandbox preview.',['Jobs','Print shops','Network'],'dispatch'],
 ['Signal tower','Agent trust layer','MAIAT PROTOCOL explores a trust layer for agents.',['Agents','Trust layer'],'tower'],
 ['Place archive','Private place memory for iOS','savvy saves places from shared links. Uncertain places stay in Review; confirmed places become private map memories.',['Shared links','Review','Map'],'archive'],
 ['Layout workshop','Nesting for print shops','EZNest is a nesting workspace for print shops, focused on arranging pieces on material. Explore the preview.',['Nesting','Layouts','Print shops'],'workshop']
];
const isPositions=[[75, 55], [195, 55], [435, 70], [65, 165], [185, 165], [305, 165], [425, 180], [90, 285], [210, 285], [330, 285], [450, 290]];
const isColors=['#b7c69b', '#d6ae88', '#b1c7a0', '#c1b5cc', '#d29f91', '#d7c8a7', '#a8b9a4', '#e2d27a', '#a4b8c7', '#becd9b', '#c3a5a0'];
let isSelected=7,isView='island',isAngle=0,isElev=IS_BASE_ELEV,isZoom=1,isPan=[0,0];
const isEscape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const isMat={ground:{l:'#82917a',m:'#5a6b5a',d:'#3b4b42'},stone:{l:'#bbc2aa',m:'#8a9782',d:'#62755f'},roof:{l:'#537077',m:'#3d5961',d:'#2b454e'},window:{l:'#e8d997',m:'#c4b573',d:'#a3945d'}};
function isRoof(x,y,z,w,d,rise,color){const m=matOf(color),faces=[
 [[0,-rise,d/2],[[x-3,y-3,z],[x+w+3,y-3,z],[x+w+3,y+d/2,z+rise],[x-3,y+d/2,z+rise]]],
 [[0,rise,d/2],[[x-3,y+d/2,z+rise],[x+w+3,y+d/2,z+rise],[x+w+3,y+d+3,z],[x-3,y+d+3,z]]],
 [[1,0,0],[[x+w+3,y-3,z],[x+w+3,y+d+3,z],[x+w+3,y+d/2,z+rise]]],
 [[-1,0,0],[[x-3,y-3,z],[x-3,y+d+3,z],[x-3,y+d/2,z+rise]]]];
 return faces.filter(([n])=>vis(n)).map(([n,q])=>shape(q,toneI(norm(n),m),1.4)).join('');}
function isWindows(x,y,z,w,d,h){let s='';for(const side of [-1,1]){
 if(vis([0,side,0]))for(const xx of [x+10,x+w-18]){const yy=side>0?y+d+.15:y-.15;s+=shape(on(PY(yy),rectUV(xx,z+8,xx+8,z+19)),'#e8d997',.8);s+=line([[xx+4,yy,z+8],[xx+4,yy,z+19]],.5);}
 if(vis([side,0,0])){const xx=side>0?x+w+.2:x-.2;s+=shape(on(PX(xx),rectUV(y+d/2-6,z,y+d/2+6,z+Math.min(h-2,22))),'#334f50',1.1);s+=shape(on(PX(xx),rectUV(y+6,z+8,y+13,z+19)),'#e8d997',.7);}}
 return s;}
function isBuilding(i,x,y,z){
 const kind=isInfo[i][4],m=matOf(isColors[i]);let s='';const w=62,d=48;
 s+=box(x-5,y-5,z-3,x+w+6,y+d+7,z,isMat.stone);
 if(kind==='dispatch')s+=box(x+62,y+12,z,x+75,y+35,z+3,isMat.stone);
 if(kind==='workshop')s+=box(x+62,y+8,z,x+76,y+38,z+3,isMat.stone);
 if(kind==='hall')s+=box(x+61,y+12,z,x+78,y+36,z+3,isMat.stone);
 if(kind==='tower'){
 s+=box(x+12,y+9,z,x+46,y+39,z+53,m);s+=isWindows(x+12,y+9,z,34,30,53);
 s+=box(x+8,y+5,z+51,x+50,y+43,z+56,isMat.roof);
 s+=cyl(x+29,y+24,z+56,z+74,12,m);s+=cyl(x+29,y+24,z+65,z+68,13,isMat.window);
 s+=cyl(x+29,y+24,z+74,z+78,15,isMat.roof);s+=rod([x+29,y+24,z+78],[x+29,y+24,z+92],.9,isMat.window);
 }else if(kind==='dispatch'){
 s+=box(x,y,z,x+62,y+48,z+34,m);s+=box(x+5,y+4,z+34,x+40,y+44,z+54,m);
 s+=box(x-2,y-2,z+33,x+64,y+50,z+37,isMat.roof);s+=box(x+3,y+2,z+54,x+42,y+46,z+58,isMat.roof);
 s+=isWindows(x,y,z,62,48,34);if(vis([1,0,0]))s+=shape(on(PX(x+62.3),rectUV(y+7,z+3,y+42,z+24)),'#354d50',1);
 if(vis([1,0,0]))for(const yy of [y+11,y+26])s+=shape(on(PX(x+62.5),rectUV(yy,z+7,yy+11,z+20)),'#b8cbb0',.7);
 s+=rod([x+24,y+24,z+58],[x+24,y+24,z+73],.8,isMat.roof);s+=cyl(x+24,y+24,z+71,z+74,4,isMat.window);
 }else if(kind==='workshop'){
 s+=box(x,y,z,x+62,y+48,z+32,m);
 const teeth=[];for(let r=0;r<3;r++){const yy=y+r*16,faces=[
 [[0,-12,13],[[x-2,yy,z+32],[x+64,yy,z+32],[x+64,yy+13,z+44],[x-2,yy+13,z+44]]],
 [[0,12,3],[[x-2,yy+13,z+44],[x+64,yy+13,z+44],[x+64,yy+16,z+32],[x-2,yy+16,z+32]]],
 [[1,0,0],[[x+64,yy,z+32],[x+64,yy+16,z+32],[x+64,yy+13,z+44]]],
 [[-1,0,0],[[x-2,yy,z+32],[x-2,yy+16,z+32],[x-2,yy+13,z+44]]]];
 teeth.push({at:[x+31,yy+8,z+38],svg:faces.filter(([n])=>vis(n)).map(([n,q])=>shape(q,toneI(norm(n),isMat.roof),1)).join('')});}s+=byDepth(teeth);
 s+=isWindows(x,y,z,62,48,32);
 }else if(kind==='gallery'){
 s+=box(x,y,z,x+62,y+48,z+31,m);s+=box(x-2,y-2,z+31,x+64,y+50,z+35,isMat.roof);
 if(vis([0,1,0]))s+=shape(on(PY(y+48.2),rectUV(x+6,z+5,x+55,z+26)),'#344f54',1);
 if(vis([0,1,0]))for(let f=0;f<3;f++){if(vis([0,1,0]))s+=shape(on(PY(y+48.4),rectUV(x+10+f*15,z+9,x+20+f*15,z+22)),['#c3b37f','#d49b86','#95b9b8'][f],.8);}
 s+=isWindows(x,y,z,62,48,31);
 }else if(kind==='station'){
 const pad=s;s='';s+=box(x,y,z,x+33,y+47,z+30,m);s+=isRoof(x,y,z+30,33,47,13,isMat.roof.l);s+=isWindows(x,y,z,33,47,30);
 const body=s;s='';s+=box(x+34,y+4,z,x+72,y+43,z+2,isMat.stone);
 s+=box(x+36,y+7,z+2,x+39,y+10,z+26,isMat.roof)+box(x+68,y+37,z+2,x+71,y+40,z+26,isMat.roof);
 s+=box(x+34,y+4,z+26,x+74,y+44,z+29,m);s=pad+(vis([1,0,0])?body+s:s+body);
 }else if(kind==='club'){
 s+=box(x,y,z,x+62,y+48,z+22,m);s+=box(x-2,y-2,z+22,x+64,y+50,z+26,isMat.roof);
 s+=box(x+10,y+10,z+26,x+52,y+37,z+29,matOf('#94b7bc'));
 s+=line([[x+31,y+10,z+29.1],[x+31,y+37,z+29.1]],1);s+=line([[x+10,y+23,z+29.1],[x+52,y+23,z+29.1]],.7);
 s+=isWindows(x,y,z,62,48,22);
 }else if(kind==='market'){
 const pad=s;s='';s+=box(x,y,z,x+57,y+48,z+32,m);s+=box(x-2,y-2,z+32,x+59,y+50,z+36,isMat.roof);
 const body=s;s='';for(let k=0;k<4;k++){s+=shape([[x+57,y+k*12,z+26],[x+72,y+k*12,z+19],[x+72,y+k*12+12,z+19],[x+57,y+k*12+12,z+26]],k%2?'#d0c590':'#91b0aa',.8);}
 s+=box(x+70,y+1,z,x+72,y+3,z+19,isMat.roof)+box(x+70,y+45,z,x+72,y+47,z+19,isMat.roof);
 s=pad+(vis([1,0,0])?body+s:s+body);s+=isWindows(x,y,z,57,48,32);
 }else if(kind==='library'){
 s+=box(x,y,z,x+62,y+48,z+37,m);s+=isRoof(x,y,z+37,62,48,11,isMat.roof.l);
 if(vis([1,0,0]))for(let k=0;k<4;k++)s+=box(x+62,y+4+k*13,z,x+66,y+7+k*13,z+31,matOf('#e5ddbf'));
 if(vis([1,0,0]))s+=shape(on(PX(x+62.2),rectUV(y+18,z,y+32,z+26)),'#3c5152',.9);s+=isWindows(x,y,z,62,48,37);
 }else if(kind==='archive'){
 s+=box(x,y,z,x+62,y+48,z+36,m);s+=isRoof(x,y,z+36,62,48,17,isMat.roof.l);s+=isWindows(x,y,z,62,48,36);
 s+=box(x+10,y+11,z+42,x+22,y+23,z+56,m);s+=box(x+8,y+9,z+55,x+24,y+25,z+58,isMat.roof);
 if(vis([0,1,0]))s+=shape(on(PY(y+48.4),rectUV(x+22,z+9,x+40,z+29)),'#94b0ad',1);if(vis([0,1,0]))s+=line([[x+23,y+48.6,z+13],[x+31,y+48.6,z+24],[x+39,y+48.6,z+17]],1);
 }else if(kind==='play'){
 s+=cyl(x+31,y+24,z,z+29,28,m);s+=cyl(x+31,y+24,z+29,z+34,32,isMat.roof);
 s+=rod([x+31,y+24,z+34],[x+31,y+24,z+51],.9,isMat.roof);s+=shape([[x+31,y+24,z+51],[x+49,y+24,z+46],[x+31,y+24,z+41]],'#d5ba89',1);
 if(vis([1,0,0]))s+=shape(on(PX(x+55),rectUV(y+17,z+1,y+29,z+20)),'#344e50',1);
 }else{
 s+=box(x,y,z,x+62,y+48,z+34,m);s+=isRoof(x,y,z+34,62,48,kind==='hall'?19:22,isMat.roof.l);s+=isWindows(x,y,z,62,48,34);
 if(kind==='hall'){s+=cyl(x+32,y+24,z+54,z+59,6,isMat.window);}
 }
 return s;
}
function isTree(x,y,z,size=1){return rod([x,y,z],[x,y,z+14*size],2*size,matOf('#82765b'))+cyl(x,y,z+10*size,z+20*size,9*size,matOf('#688a68'))+cyl(x,y,z+20*size,z+28*size,6*size,matOf('#8f9f76'));}
function isMap(){
 OX=400;OY=40;INK_K=1.15;VIEW=0;RC=[280,210];IS_ORBIT=isAngle;IS_ELEV=isElev;setLight(105);_clipN=0;
 const outline=[[20,38],[130,7],[315,5],[480,53],[560,175],[550,314],[431,395],[232,415],[62,344],[8,190]];
 let terrain='';
 // Bathymetric rings keep the ocean dark and the coastline legible.
 for(const k of [1.13,1.25,1.39]){const pts=outline.map(([x,y])=>[280+(x-280)*k,210+(y-210)*k,-10]);terrain+=`<path d="${pd(pts)}" fill="none" stroke="#30434b" stroke-width="1" opacity="${k<1.2?.8:.35}"/>`;}
 const bottom=on(PZ(-16),outline),top=on(PZ(14),outline);
 terrain+=loft(bottom,top,n=>toneI(n,{l:'#6c7563',m:'#4f6054',d:'#374a43'}))+shape(top,'#819178',1.8)+hullInk([...bottom,...top],2.3);
 const inner=outline.map(([x,y])=>[280+(x-280)*.96,210+(y-210)*.96,15]);terrain+=shape(inner,'#8d9b80',.6);
 const roads=[[[42,135,15.2],[515,135,15.2]],[[58,255,15.2],[528,255,15.2]],[[160,35,15.2],[160,363,15.2]],[[280,27,15.2],[280,375,15.2]],[[400,38,15.2],[400,363,15.2]]];
 roads.forEach(pts=>{terrain+=`<path d="${pd(pts,false)}" fill="none" stroke="#6a7c67" stroke-width="18" stroke-linecap="round"/><path d="${pd(pts,false)}" fill="none" stroke="#b7b498" stroke-width="10" stroke-linecap="round"/>`;});
 // A public square and the harbor are navigation scenery, not live facilities.
 terrain+=cyl(280,255,15.4,17,21,matOf('#b7b69a'))+cyl(280,255,17,20,11,matOf('#9bb8af'));
 terrain+=box(500,348,0,532,455,5,matOf('#9c8e70'));
 for(let q=355;q<455;q+=12)terrain+=line([[500,q,5.2],[532,q,5.2]],.8);
 terrain+=box(493,440,-7,499,448,10,matOf('#a89d7b'))+box(533,440,-7,539,448,10,matOf('#a89d7b'));
 // Geometry sorted per building; stable groups retain focus when selection changes.
 const ordered=isPositions.map(([x,y],i)=>({i,x,y})).sort((a,b)=>depthOf([a.x+31,a.y+24,18])-depthOf([b.x+31,b.y+24,18]));
 const scenery=[];ordered.forEach(({i,x,y})=>{const [px,py]=P(x+30,y+24,14);scenery.push({at:[x+31,y+24,18],svg:`<g class="is-building${i===isSelected?' selected':''}" data-building="${i}" role="button" tabindex="0" aria-label="Explore ${isEscape(projects[i][0])}" aria-pressed="${i===isSelected}"><ellipse class="selection-ring" cx="${px}" cy="${py+10}" rx="55" ry="29" fill="none" stroke="#e1f28b" stroke-width="3"/>${inkScale(isBuilding(i,x,y,18))}</g>`});});
 const trees=[[34,77,.9],[30,123,.7],[27,230,1],[61,302,.85],[150,390,.75],[213,395,.9],[386,390,.7],[520,243,.8],[540,170,1],[370,26,.7],[251,30,.8],[498,111,.8]];
 // Trees stay along the shoreline so they cannot occlude a building's controls.

 trees.forEach(([x,y,k])=>scenery.push({at:[x,y,15],svg:inkScale(isTree(x,y,15,k))}));
 let labels='';isPositions.forEach(([x,y],i)=>{const [px,py]=P(x+55,y+51,14),name=projects[i][0],width=name.length*5.8+28;labels+=`<g class="map-label${i===isSelected?' selected':''}" data-label="${i}" aria-hidden="true"><rect x="${px-width/2}" y="${py+7}" width="${width}" height="21" rx="3"/><text x="${px}" y="${py+21}" text-anchor="middle"><tspan class="label-no">${String(i+1).padStart(2,'0')} </tspan>${isEscape(name)}</text></g>`;});
 document.querySelector('#is-map').innerHTML=`<g transform="translate(${460+isPan[0]} ${285+isPan[1]}) scale(${isZoom}) translate(-460 -285)"><g>${terrain}</g><g>${byDepth(scenery)}</g><g>${labels}</g></g>`;
}
function isPortrait(i){IS_ELEV=IS_BASE_ELEV;IS_ORBIT=0;RC=[0,0];OX=110;OY=90;INK_K=.62;VIEW=0;setLight(105);_clipN=0;const m={l:'#6d7c68',m:'#4f6054',d:'#33483f'};return inkScale(board(-10,-8,90,77,5,5,m)+isBuilding(i,0,0,8));}
function isText(selector,text){document.querySelector(selector).textContent=text;}
function isSelect(i,{focusPanel=false}={}){
 if(!Number.isInteger(i)||i<0||i>=projects.length)return;isSelected=i;const p=projects[i],info=isInfo[i];
 document.querySelectorAll('[data-building]').forEach(b=>{const selected=+b.dataset.building===i;b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected));});
 document.querySelectorAll('[data-label]').forEach(b=>b.classList.toggle('selected',+b.dataset.label===i));
 document.querySelectorAll('[data-project]').forEach(b=>{const selected=+b.dataset.project===i;b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected));});
 isText('#detail-number',String(i+1).padStart(2,'0')+' / '+projects.length);isText('#detail-name',p[0]);isText('#detail-type',info[1]);isText('#detail-description',info[2]);isText('#detail-building',info[0]);isText('#detail-status',p[2]);isText('#detail-maker',p[3]);
 document.querySelector('#portrait-art').innerHTML=isPortrait(i);document.querySelector('#portrait').setAttribute('aria-label',p[0]+' — '+info[0]+', a building used as a project navigation metaphor');
 const tags=document.querySelector('#detail-tags');tags.replaceChildren();info[3].forEach(t=>{const tag=document.createElement('span');tag.textContent=t;tags.append(tag);});
 const links=document.querySelector('#detail-links');links.replaceChildren();for(const [label,url] of [['Visit project ↗',p[4]],['GitHub ↗',p[5]]])if(url){const a=document.createElement('a');a.textContent=label;a.href=url;a.target='_blank';a.rel='noopener noreferrer';links.append(a);}
 document.querySelector('#project-select').value=String(i);isText('#selection-status',p[0]+' selected. '+info[1]+'.');
 if(focusPanel&&matchMedia('(max-width: 1000px)').matches){document.querySelector('#project-detail').scrollIntoView({block:'start',behavior:'auto'});document.querySelector('#detail-name').focus({preventScroll:true});}
}
function isSetView(view){if(!['island','index'].includes(view))return;isCancelFlight();isPanel(true);isView=view;document.querySelector('.orbit-controls').hidden=view!=='island';document.querySelector('#island-view').hidden=view!=='island';document.querySelector('#index-view').hidden=view!=='index';document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===view)));}
isMap();
projects.forEach((p,i)=>{const row=document.createElement('button');row.type='button';row.className='index-row';row.dataset.project=String(i);row.setAttribute('aria-pressed','false');const number=document.createElement('span');number.className='row-number';number.textContent=String(i+1).padStart(2,'0');const text=document.createElement('span');text.className='row-name';text.textContent=p[0];const desc=document.createElement('span');desc.className='row-desc';desc.textContent=isInfo[i][1];const status=document.createElement('span');status.className='row-status';status.textContent=p[2];row.append(number,text,desc,status);row.addEventListener('click',()=>isEnter(i));document.querySelector('#index-view').append(row);
 const option=document.createElement('option');option.value=String(i);option.textContent=String(i+1).padStart(2,'0')+' / '+p[0];document.querySelector('#project-select').append(option);
});
document.querySelector('#is-map').addEventListener('click',e=>{const target=e.target.closest('[data-building],[data-label]');if(target)isEnter(+(target.dataset.building??target.dataset.label));});
document.querySelector('#is-map').addEventListener('keydown',e=>{const target=e.target.closest('[data-building]');if(target&&(e.key==='Enter'||e.key===' ')){e.preventDefault();isEnter(+target.dataset.building);}});
document.querySelector('#project-select').addEventListener('change',e=>isEnter(+e.target.value));document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>isSetView(b.dataset.view)));
document.querySelector('#back-island').addEventListener('click',()=>{isSetView('island');isReset();if(isFrame){cancelAnimationFrame(isFrame);isFrame=0;}isFlushRender();document.querySelector('#island-view').scrollIntoView({block:'center',behavior:'auto'});const building=document.querySelector(`[data-building="${isSelected}"]`);building.scrollIntoView({block:'nearest',inline:'center',behavior:'auto'});building.focus({preventScroll:true});});
isSelect(7);
// Camera input owns one coalesced frame; no background render loop.
const isCanvas=document.querySelector('.map-svg'),isMotion=matchMedia('(prefers-reduced-motion: reduce)');
let isFrame=0,isSuppressUntil=0,isFlight=null;
const isPointers=new Map();let isGesture=null;
const isClamp=(v,a,b)=>Math.min(b,Math.max(a,v));
function isOrbitRender(){isFrame=0;const focused=document.activeElement?.dataset?.building;isMap();if(focused!==undefined)document.querySelector(`[data-building="${focused}"]`)?.focus({preventScroll:true});document.querySelector('.compass').style.transform=`rotate(${-25-isAngle*180/Math.PI}deg)`;document.querySelector('#orbit-angle').textContent=(Math.round((isAngle*180/Math.PI+360)%360)%360)+'° / '+Math.round(isElev*180/Math.PI)+'° · '+Math.round(isZoom*100)+'%';}
function isFlushRender(){if(isFrame){cancelAnimationFrame(isFrame);isFrame=0;}isOrbitRender();}
function isSchedule(){if(!isFrame&&!document.hidden)isFrame=requestAnimationFrame(isCameraFrame);}
function isCameraFrame(now){
 isFrame=0;const flight=isFlight;
 if(flight){const t=Math.min(1,(now-flight.start)/950),e=t*t*(3-2*t);isAngle=flight.from.angle+flight.turn*e;isElev=flight.from.elev+(flight.to.elev-flight.from.elev)*e;isZoom=flight.from.zoom+(flight.to.zoom-flight.from.zoom)*e;isPan=flight.from.pan.map((v,k)=>v+(flight.to.pan[k]-v)*e);}
 isOrbitRender();
 if(flight&&isFlight===flight){if(now-flight.start>=950)isFinishEntry(flight);else isSchedule();}
}
function isPanel(open){const panel=document.querySelector('#project-detail');document.querySelector('.workspace').classList.toggle('detail-closed',!open);panel.inert=!open;panel.setAttribute('aria-hidden',String(!open));}
function isCancelFlight(){if(!isFlight)return;isFlight=null;isPanel(true);isText('#entry-prompt','Select a building to view the project');}
function isFinishEntry(flight){if(isFlight!==flight)return;isFlight=null;isPanel(true);isSelect(flight.i,{focusPanel:true});}
function isEnter(i){
 if(!Number.isInteger(i)||i<0||i>=projects.length)return;
 isCancelFlight();if(isView==='index'){isPanel(true);isSelect(i,{focusPanel:true});return;}
 isSelect(i);isPanel(false);isText('#entry-prompt','Entering '+projects[i][0]+'…');
 const [x,y]=isPositions[i],angle=([-.25,.2,-.15,.25][i%4]),elev=42*Math.PI/180,zoom=2.65;
 // Frame the selected building's centre, including its height, in map coordinates.
 const old=[IS_ORBIT,IS_ELEV,RC,OX,OY];IS_ORBIT=angle;IS_ELEV=elev;RC=[280,210];OX=400;OY=40;
 const point=P(x+31,y+24,isInfo[i][4]==='tower'?55:38);[IS_ORBIT,IS_ELEV,RC,OX,OY]=old;
 const target={angle,elev,zoom,pan:[(460-point[0])*zoom,(285-point[1])*zoom]};
 const turn=Math.atan2(Math.sin(angle-isAngle),Math.cos(angle-isAngle));
 const flight={i,start:performance.now(),from:{angle:isAngle,elev:isElev,zoom:isZoom,pan:[...isPan]},to:target,turn};isFlight=flight;
 if(isMotion.matches){isAngle=angle;isElev=elev;isZoom=zoom;isPan=target.pan;isFlushRender();isFinishEntry(flight);}else isSchedule();
}
function isOrbit(delta,tilt=0){isCancelFlight();isAngle=(isAngle+delta+Math.PI*2)%(Math.PI*2);isElev=isClamp(isElev+tilt,20*Math.PI/180,78*Math.PI/180);isSchedule();}
function isZoomBy(factor){isCancelFlight();isZoom=isClamp(isZoom*factor,.7,3);isSchedule();}
function isReset(){isCancelFlight();isAngle=0;isElev=IS_BASE_ELEV;isZoom=1;isPan=[0,0];isSchedule();}
function isPair(){const p=[...isPointers.values()];return {distance:Math.max(1,Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y)),x:(p[0].x+p[1].x)/2,y:(p[0].y+p[1].y)/2};}
isCanvas.addEventListener('pointerdown',e=>{
 if(e.button!==0&&e.button!==2)return;if(isPointers.size>=2)return;isCancelFlight();
 isPointers.set(e.pointerId,{x:e.clientX,y:e.clientY});isCanvas.setPointerCapture(e.pointerId);
 if(isPointers.size===2){isGesture={pair:isPair(),moved:true};isSuppressUntil=performance.now()+500;}
 else isGesture={x:e.clientX,y:e.clientY,lastX:e.clientX,lastY:e.clientY,moved:false,pan:e.shiftKey||e.button===2,target:e.target.closest('[data-building],[data-label]')};
});
isCanvas.addEventListener('pointermove',e=>{
 if(!isPointers.has(e.pointerId)||!isGesture)return;isPointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
 const rect=isCanvas.getBoundingClientRect(),unit=920/rect.width;
 if(isPointers.size===2){const pair=isPair(),old=isGesture.pair;isZoomBy(pair.distance/old.distance);isPan[0]=isClamp(isPan[0]+(pair.x-old.x)*unit,-1000,1000);isPan[1]=isClamp(isPan[1]+(pair.y-old.y)*unit,-800,800);isGesture.pair=pair;}
 else {if(Math.hypot(e.clientX-isGesture.x,e.clientY-isGesture.y)>6)isGesture.moved=true;
 if(isGesture.moved){const dx=e.clientX-isGesture.lastX,dy=e.clientY-isGesture.lastY;if(isGesture.pan){isPan[0]=isClamp(isPan[0]+dx*unit,-1000,1000);isPan[1]=isClamp(isPan[1]+dy*unit,-800,800);isSchedule();}else isOrbit(dx*.008,-dy*.006);}
 isGesture.lastX=e.clientX;isGesture.lastY=e.clientY;}
 isCanvas.classList.toggle('dragging',isGesture.moved);
});
function isEndDrag(e){
 if(!isPointers.has(e.pointerId))return;const g=isGesture;isPointers.delete(e.pointerId);
 if(g?.moved)isSuppressUntil=performance.now()+300;else if(e.type==='pointerup'&&g?.target){const t=g.target;isEnter(+(t.dataset.building??t.dataset.label));}
 // After a pinch the remaining finger starts a fresh drag, never a tap.
 if(isPointers.size){const p=[...isPointers.values()][0];isGesture={x:p.x,y:p.y,lastX:p.x,lastY:p.y,moved:true,pan:false};}else{isGesture=null;isCanvas.classList.remove('dragging');}
 if(isCanvas.hasPointerCapture(e.pointerId))isCanvas.releasePointerCapture(e.pointerId);
}
isCanvas.addEventListener('pointerup',isEndDrag);isCanvas.addEventListener('pointercancel',isEndDrag);isCanvas.addEventListener('lostpointercapture',isEndDrag);
isCanvas.addEventListener('contextmenu',e=>e.preventDefault());
isCanvas.addEventListener('click',e=>{if(performance.now()<isSuppressUntil){e.preventDefault();e.stopImmediatePropagation();}},true);
isCanvas.addEventListener('wheel',e=>{e.preventDefault();isZoomBy(Math.exp(-isClamp(e.deltaY,-100,100)*.002));},{passive:false});
isCanvas.addEventListener('keydown',e=>{const actions={ArrowLeft:()=>isOrbit(-Math.PI/12),ArrowRight:()=>isOrbit(Math.PI/12),ArrowUp:()=>isOrbit(0,Math.PI/18),ArrowDown:()=>isOrbit(0,-Math.PI/18),'+':()=>isZoomBy(1.2),'=':()=>isZoomBy(1.2),'-':()=>isZoomBy(1/1.2),Home:isReset};if(actions[e.key]){e.preventDefault();actions[e.key]();}});
for(const [id,fn] of Object.entries({'orbit-left':()=>isOrbit(-Math.PI/6),'orbit-right':()=>isOrbit(Math.PI/6),'orbit-up':()=>isOrbit(0,Math.PI/18),'orbit-down':()=>isOrbit(0,-Math.PI/18),'zoom-in':()=>isZoomBy(1.2),'zoom-out':()=>isZoomBy(1/1.2),'orbit-reset':isReset}))document.getElementById(id).addEventListener('click',fn);
function isMotionPreference(){if(isMotion.matches&&isFlight){const flight=isFlight;isAngle=flight.to.angle;isElev=flight.to.elev;isZoom=flight.to.zoom;isPan=[...flight.to.pan];isFlushRender();isFinishEntry(flight);}document.documentElement.classList.toggle('is-reduced',isMotion.matches);}
isMotion.addEventListener('change',isMotionPreference);isMotionPreference();
document.addEventListener('visibilitychange',()=>{document.documentElement.classList.toggle('is-paused',document.hidden);if(document.hidden){isCancelFlight();if(isFrame){cancelAnimationFrame(isFrame);isFrame=0;}isPointers.clear();isGesture=null;isCanvas.classList.remove('dragging');}else isSchedule();});
isSchedule();
isPanel(false);
