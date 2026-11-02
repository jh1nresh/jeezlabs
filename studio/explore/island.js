// Colorfigures primitives, scoped to two SVG surfaces. No mountFigure or animation loop.
const isInfo=[
 ['The commons','Group coordination','DIP lets a group share a link and signal when everyone is ready.',['Coordination','Groups'],'hall'],
 ['Rental house','Agentic rentals','GIMI is an AI rental agent for school, community and hackathon inventory.',['Agents','Rentals'],'house'],
 ['Table tennis club','Ping pong finder','PINGME shows who is ready to play table tennis and sends a notification when others are ready.',['Table tennis','Discovery'],'club'],
 ['Gallery','NFT gallery viewer','DISTOKEN displays NFT collections from a wallet address across multiple blockchains.',['NFT','Gallery'],'gallery'],
 ['Play house','Multiplayer party game','TRANSPARENT is a multiplayer party game on Solana. Players answer personal questions to win the pot.',['Multiplayer','Party game'],'play'],
 ['Review library','Law review scanner','REDLINE AI scans law review manuscripts for style violations and cites the relevant rules.',['Documents','Legal review'],'library'],
 ['Agent market','AI agent marketplace','AGENTSHACK lets people hire, subscribe to and fork AI agents with verifiable work history.',['Agents','Marketplace'],'market'],
 ['Dispatch house','Distributed print-production network','OUTPUT connects print jobs with print shops through a distributed production network. Sandbox preview.',['Jobs','Print shops','Network'],'dispatch'],
 ['Signal tower','Agent trust layer','MAIAT PROTOCOL is a trust oracle for AI agents, tokens, attestations and agentic commerce.',['Agents','Trust layer'],'tower'],
 ['Place archive','Private place memory for iOS','savvy saves places from shared links. Uncertain places stay in Review; confirmed places become private map memories.',['Shared links','Review','Map'],'archive'],
 ['Layout workshop','Nesting for print shops','EZNest arranges pieces on material for print shops. Preview.',['Nesting','Layouts','Print shops'],'workshop']
];
const isPositions=[[75, 55], [195, 55], [435, 70], [65, 165], [185, 165], [305, 165], [425, 180], [90, 285], [210, 285], [330, 285], [450, 290]];
const isColors=['#b7c69b', '#d6ae88', '#b1c7a0', '#c1b5cc', '#d29f91', '#d7c8a7', '#a8b9a4', '#e2d27a', '#a4b8c7', '#becd9b', '#c3a5a0']; // eslint-disable-line @typescript-eslint/no-unused-vars -- shared drawing globals
let isSelected=7,isView='island',isAngle=0,isElev=IS_BASE_ELEV,isZoom=1,isPan=[0,0];
const isEscape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const isMat={ground:{l:'#82917a',m:'#5a6b5a',d:'#3b4b42'},stone:{l:'#bbc2aa',m:'#8a9782',d:'#62755f'},roof:{l:'#537077',m:'#3d5961',d:'#2b454e'},window:{l:'#e8d997',m:'#c4b573',d:'#a3945d'}}; // eslint-disable-line @typescript-eslint/no-unused-vars -- shared drawing globals
function isRoof(x,y,z,w,d,rise,color){const m=matOf(color),faces=[ // eslint-disable-line @typescript-eslint/no-unused-vars -- shared drawing globals
 [[0,-rise,d/2+3],[[x-3,y-3,z],[x+w+3,y-3,z],[x+w+3,y+d/2,z+rise],[x-3,y+d/2,z+rise]]],
 [[0,rise,d/2+3],[[x-3,y+d/2,z+rise],[x+w+3,y+d/2,z+rise],[x+w+3,y+d+3,z],[x-3,y+d+3,z]]],
 [[1,0,0],[[x+w+3,y-3,z],[x+w+3,y+d+3,z],[x+w+3,y+d/2,z+rise]]],
 [[-1,0,0],[[x-3,y-3,z],[x-3,y+d+3,z],[x-3,y+d/2,z+rise]]]];
 return faces.filter(([n])=>vis(n)).map(([n,q])=>shape(q,toneI(norm(n),m),1.4)).join('');}
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
 let labels='';isPositions.forEach(([x,y],i)=>{const [px,py]=P(x+55,y+51,14),name=projects[i][0],width=name.length*5.8+28;if(isZoom>1.8&&i!==isSelected)return;labels+=`<g class="map-label${i===isSelected?' selected':''}" data-label="${i}" aria-hidden="true"><rect x="${px-width/2}" y="${py+7}" width="${width}" height="21" rx="3"/><text x="${px}" y="${py+21}" text-anchor="middle"><tspan class="label-no">${String(i+1).padStart(2,'0')} </tspan>${isEscape(name)}</text></g>`;});
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
// Details start closed; every Quick Find project must be selectable on first use.
document.querySelector('#project-select').value='';
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
