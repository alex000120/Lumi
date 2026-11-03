/* Lumi · motor de dibujo mejorado: `scene` v2 (superset de `scene` de teach8.js).
   Novedades: degradados y sombras, colores hex, rotar/escalar/voltear cualquier forma, grupos con transformación,
   repetición (rep), animaciones en bucle (anim), fondos listos (day, night, sunset, sea, space, room), figuras ya dibujadas
   (stamp: sol, árbol, casa, persona…), más formas (path, star, ngon, wave, spiral, bubble, label, dim, pie) y lienzos wide/square.
   Las formas aparecen con setTimeout (por grupos "at"), así el Director de sync.js puede repartirlas entre las frases de Lumi.
   Todo el texto de la IA se inserta como texto (nunca HTML). */
(()=>{
if(typeof Board==='undefined')return;
const NS='http://www.w3.org/2000/svg',sheet=()=>document.getElementById('sheet'),box=()=>document.getElementById('board');
const el=(tag,cls,par,txt)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;if(par)par.appendChild(e);return e};
const sv=(n,a,par,t)=>{const e=document.createElementNS(NS,n);for(const k in a)e.setAttribute(k,a[k]);if(t!=null)e.textContent=t;if(par)par.appendChild(e);return e};
const reveal=n=>requestAnimationFrame(()=>requestAnimationFrame(()=>{n.classList.add('on','focus');setTimeout(()=>n.classList.remove('focus'),1800);box().scrollTop=box().scrollHeight}));
const put=(cls,par)=>el('div','it '+cls,par||sheet());
const T=s=>{s=String(s==null?'':s);return window.Tex&&Tex.text?Tex.text(s):s};
const clip=(s,n)=>{s=T(s);return s.length>n?s.slice(0,n-1)+'…':s};
function rich(p,t){const s=window.Tex&&Tex.fix?Tex.fix(String(t==null?'':t)):String(t==null?'':t);
  s.split(/(\$[^$]+\$)/).forEach(x=>{
    if(/^\$[^$]+\$$/.test(x)){const m=x.slice(1,-1),sp=el('span','',p);let ok=false;if(window.katex)try{katex.render(window.Tex&&Tex.norm?Tex.norm(m):m,sp,{throwOnError:false,displayMode:false,strict:'ignore'});ok=true}catch(e){}if(!ok)sp.textContent=window.Tex&&Tex.conv?Tex.conv(m):m}
    else x.split(/\*\*([^*]+)\*\*/).forEach((q,i)=>{if(q)i%2?el('b','',p,q):p.appendChild(document.createTextNode(q))})});return p}
const arr=a=>Array.isArray(a)?a:[];
const N=(v,a,b,d)=>{v=+v;return isFinite(v)?Math.max(a,Math.min(b,v)):d};
const cap=(d,it)=>{if(it.caption)rich(el('div','t-note',d),it.caption)};
const wrap=(t,n)=>{const w=String(t).split(/\s+/),L=[];let c='';w.forEach(x=>{if((c+' '+x).trim().length>n&&c){L.push(c);c=x}else c=(c+' '+x).trim()});if(c)L.push(c);return L.slice(0,4)};

const C4=['var(--blue)','var(--yel)','var(--pink)','var(--chalk)'];
const COL={blue:'var(--blue)',yel:'var(--yel)',pink:'var(--pink)',chalk:'var(--chalk)',green:'#8fe39a',red:'#ff8c8c',orange:'#ffb36b',purple:'#c4a4ff',white:'#ffffff',brown:'#c49a6c',sky:'#9ad7ff',gray:'#b8c0c8',teal:'#5fd3c4',gold:'#ffd45e',lime:'#c6ef6a',cream:'#fff3d6',skin:'#f2c9a0',navy:'#2b4a7a',dark:'#1d2b24',none:'none'};
const col=v=>{if(v==null||v==='')return null;if(typeof v==='number')return C4[Math.abs(Math.round(v))%4];v=String(v);if(/^#[0-9a-f]{3,8}$/i.test(v))return v;return COL[v]||'var(--chalk)'};
let UID=0;
const P2=(a,W,H)=>arr(a).slice(0,60).map(p=>[N(arr(p)[0],-40,W+40,0),N(arr(p)[1],-40,H+40,0)]);
const HALO=z=>`paint-order:stroke;stroke:var(--board,#243b2f);stroke-width:${z*.22}px;stroke-linejoin:round`;

/* ───────── Figuras ya dibujadas (caja de 20 × 20 centrada en 0,0; y hacia abajo) ───────── */
const OL='rgba(10,20,15,.38)';
const fp=(g,tag,a,fill,st)=>sv(tag,Object.assign({fill,stroke:st===undefined?OL:st,'stroke-width':.5,'stroke-linejoin':'round','stroke-linecap':'round'},a),g);
const ln=(g,x1,y1,x2,y2,c,w)=>sv('line',{x1,y1,x2,y2,stroke:c,'stroke-width':w||1,'stroke-linecap':'round'},g);
const starPts=(r,ri,n,rot)=>{const p=[];for(let i=0;i<n*2;i++){const a=(rot||-90)*Math.PI/180+i*Math.PI/n,q=i%2?ri:r;p.push((+(q*Math.cos(a)).toFixed(2))+','+(+(q*Math.sin(a)).toFixed(2)))}return p.join(' ')};
const cloudBase=(g,f)=>{fp(g,'rect',{x:-8.5,y:.6,width:17,height:5,rx:2.5},f,'none');[[-4.5,1.2,3.6],[0,-1.2,5],[4.8,1,3.6]].forEach(([x,y,r])=>fp(g,'circle',{cx:x,cy:y,r},f,'none'));fp(g,'ellipse',{cx:0,cy:4.2,rx:7,ry:1.1},'rgba(60,90,130,.18)','none')};
const STAMPS={
sun(g){for(let i=0;i<8;i++){const a=i*Math.PI/4;ln(g,6.3*Math.cos(a),6.3*Math.sin(a),9.2*Math.cos(a),9.2*Math.sin(a),'#ffd45e',1.4)}fp(g,'circle',{r:4.9},'#ffb02e','none');fp(g,'circle',{r:3.8,cx:-.3,cy:-.3},'#ffd45e','none');fp(g,'circle',{r:1.3,cx:-1.4,cy:-1.5},'#fff3b0','none')},
moon(g){fp(g,'path',{d:'M3 -8A8.5 8.5 0 1 0 3 8A9.5 9.5 0 0 1 3 -8Z'},'#f4efc0');[[-5.2,-3,1],[-6,1.6,.8],[-3.8,5,.6]].forEach(([x,y,r])=>fp(g,'circle',{cx:x,cy:y,r},'#e3dca0','none'))},
cloud(g){cloudBase(g,'#f4f7fb')},
raincloud(g){g.setAttribute('transform','translate(0,-3)');cloudBase(g,'#cdd7e3');[[-4,7],[0,7.6],[4,7]].forEach(([x,y])=>ln(g,x,y,x-1.3,y+2.8,'#5bb8ff',1.1))},
tree(g){fp(g,'rect',{x:-1.3,y:2,width:2.6,height:7.5,rx:.7},'#8d5a34');fp(g,'circle',{cx:0,cy:-3.2,r:5.2},'#3f9e4d','none');fp(g,'circle',{cx:-3.8,cy:0,r:4},'#4caf50','none');fp(g,'circle',{cx:3.8,cy:0,r:4},'#4caf50','none');fp(g,'circle',{cx:0,cy:.6,r:4},'#58bd5c','none');fp(g,'circle',{cx:-1.8,cy:-4.6,r:1.5},'#a6ec9c','none').setAttribute('opacity','.6')},
pine(g){fp(g,'rect',{x:-1.1,y:5,width:2.2,height:4.5,rx:.5},'#7a4b2a');[['0,-9.7 -4.6,-3 4.6,-3','#2f8a55'],['0,-6.2 -6,1.2 6,1.2','#2a7a4b'],['0,-2.6 -7.6,5.4 7.6,5.4','#256c42']].forEach(([p,f])=>fp(g,'polygon',{points:p},f))},
house(g){fp(g,'rect',{x:3.4,y:-6.2,width:2,height:4},'#a04540');fp(g,'rect',{x:-6.5,y:0,width:13,height:9.3},'#f2d3a8');fp(g,'polygon',{points:'-8.7,.5 0,-7.4 8.7,.5'},'#c0504d');fp(g,'rect',{x:-1.7,y:4,width:3.4,height:5.3,rx:.5},'#7a4b2a');fp(g,'rect',{x:2.7,y:2.2,width:3.1,height:3.1},'#9ad7ff');ln(g,4.25,2.2,4.25,5.3,'#fff',.4);ln(g,2.7,3.75,5.8,3.75,'#fff',.4);fp(g,'circle',{cx:1,cy:6.8,r:.35},'#ffd45e','none')},
mountain(g){fp(g,'polygon',{points:'-10,9 -3,-5.5 1.5,1.5 4.5,-2.5 10,9'},'#8a94a6');fp(g,'polygon',{points:'-3,-5.5 -10,9 -3.4,9'},'#6f7a8b','none').setAttribute('opacity','.45');fp(g,'polygon',{points:'-3,-5.5 -.4,-1.4 -1.6,-2.5 -2.6,-1.2 -3.6,-2.5 -5,-1.4'},'#ffffff','none');fp(g,'polygon',{points:'4.5,-2.5 6.4,.6 5.4,-.2 4.5,1 3.6,-.2 2.6,.6'},'#ffffff','none')},
person(g){fp(g,'rect',{x:-2.5,y:2,width:2,height:7,rx:.9},'#34495e');fp(g,'rect',{x:.5,y:2,width:2,height:7,rx:.9},'#34495e');ln(g,-3.3,-2.6,-5.6,1.4,'#4aa3df',1.9);ln(g,3.3,-2.6,5.6,1.4,'#4aa3df',1.9);fp(g,'rect',{x:-3.4,y:-3.9,width:6.8,height:7,rx:2.2},'#4aa3df');fp(g,'circle',{cx:-5.7,cy:1.7,r:.95},'#f2c9a0','none');fp(g,'circle',{cx:5.7,cy:1.7,r:.95},'#f2c9a0','none');fp(g,'circle',{cx:0,cy:-6.7,r:2.7},'#f2c9a0');fp(g,'path',{d:'M-2.8 -7.1A2.8 2.8 0 0 1 2.8 -7.1Q0 -9 -2.8 -7.1Z'},'#5a3a22','none');[-1,1].forEach(x=>fp(g,'circle',{cx:x,cy:-6.4,r:.32},'#1d2b24','none'));sv('path',{d:'M-1 -5.4Q0 -4.6 1 -5.4',fill:'none',stroke:'#1d2b24','stroke-width':.3,'stroke-linecap':'round'},g)},
drop(g){fp(g,'path',{d:'M0 -8.5C4 -2.5 6 .5 6 3.2A6 6 0 0 1 -6 3.2C-6 .5 -4 -2.5 0 -8.5Z'},'#5bb8ff');sv('path',{d:'M-3 2.4A3.3 3.3 0 0 0 -.8 5.6',fill:'none',stroke:'#fff','stroke-width':.9,'stroke-linecap':'round',opacity:.7},g)},
flower(g){ln(g,0,0,0,9.5,'#4caf50',1.3);fp(g,'path',{d:'M.4 6.4Q4.8 3.8 6 6.6Q2.8 8.2 .4 6.4Z'},'#4caf50','none');for(let i=0;i<6;i++){const a=i*Math.PI/3;fp(g,'circle',{cx:(3.5*Math.cos(a)).toFixed(2),cy:(-3+3.5*Math.sin(a)).toFixed(2),r:2.5},'#ff8fb1','none')}fp(g,'circle',{cx:0,cy:-3,r:2.1},'#ffd45e','none')},
fish(g){fp(g,'polygon',{points:'4,0 9,-4.2 9,4.2'},'#ff7d3b');fp(g,'ellipse',{cx:-1,cy:0,rx:6.2,ry:4},'#ff9a52');fp(g,'path',{d:'M-2.4 -3.7Q0 -6.6 2.6 -3.1Z'},'#ff7d3b');sv('path',{d:'M1.4 -3.4Q2.8 0 1.4 3.4',fill:'none',stroke:'#fff','stroke-width':.8,opacity:.6,'stroke-linecap':'round'},g);fp(g,'circle',{cx:-4,cy:-.9,r:.9},'#fff','none');fp(g,'circle',{cx:-4.1,cy:-.9,r:.42},'#1d2b24','none')},
bird(g){sv('path',{d:'M-8.5 0Q-5 -5.6 0 0Q5 -5.6 8.5 0',fill:'none',stroke:'#e8eef7','stroke-width':1.5,'stroke-linecap':'round','stroke-linejoin':'round'},g)},
heart(g){fp(g,'path',{d:'M0 7C-10 0 -6 -7 0 -3C6 -7 10 0 0 7Z'},'#ff5d73');fp(g,'ellipse',{cx:-4,cy:-3.2,rx:1.6,ry:.9},'#fff','none').setAttribute('opacity','.45')},
star(g){fp(g,'polygon',{points:starPts(9,3.8,5)},'#ffd45e')},
rocket(g){fp(g,'polygon',{points:'-3,3 -7,8 -3,6'},'#e5484d');fp(g,'polygon',{points:'3,3 7,8 3,6'},'#e5484d');fp(g,'polygon',{points:'-2,6 0,10 2,6'},'#ffb02e');fp(g,'path',{d:'M0 -9.5C4.4 -4.6 4.2 2 3 6.2L-3 6.2C-4.2 2 -4.4 -4.6 0 -9.5Z'},'#e8eef7');fp(g,'circle',{cx:0,cy:-2.2,r:1.8},'#5bb8ff');fp(g,'path',{d:'M-3.4 3.4H3.4'},'none','#e5484d')},
boat(g){ln(g,0,2,0,-8.4,'#6b4a2e',.8);fp(g,'polygon',{points:'.9,-8 7.4,.2 .9,.2'},'#ffffff');fp(g,'polygon',{points:'-.9,-6 -5.2,.2 -.9,.2'},'#fff3d6');fp(g,'path',{d:'M-8.5 1.8H8.5L5.4 7.4H-5.4Z'},'#8d5a34');sv('path',{d:'M-9 8.6Q-6.8 7.4 -4.5 8.6T0 8.6T4.5 8.6T9 8.6',fill:'none',stroke:'#7cc4ff','stroke-width':.8,'stroke-linecap':'round'},g)},
apple(g){fp(g,'path',{d:'M0 -4.5C-3 -6.5 -8 -4 -8 1.5C-8 6.5 -4.5 9 -2 9C-1 9 -.5 8.6 0 8.6C.5 8.6 1 9 2 9C4.5 9 8 6.5 8 1.5C8 -4 3 -6.5 0 -4.5Z'},'#e5484d');ln(g,0,-4.5,1.2,-8,'#7a4b2a',1);fp(g,'path',{d:'M1.4 -6.4Q3.8 -9.2 6.2 -7.4Q4.2 -5.2 1.4 -6.4Z'},'#4caf50','none');fp(g,'ellipse',{cx:-4.2,cy:-.6,rx:1.1,ry:2},'#fff','none').setAttribute('opacity','.35')},
book(g){fp(g,'polygon',{points:'-9.8,-5.8 0,-4 9.8,-5.8 9.8,6 0,7.8 -9.8,6'},'#4a6fa5');fp(g,'path',{d:'M-9 -5L0 -3.2V7L-9 5.2Z'},'#f8f1de');fp(g,'path',{d:'M9 -5L0 -3.2V7L9 5.2Z'},'#fffaf0');[-1,.8,2.6].forEach(y=>{ln(g,-7.6,y-1.4,-1.6,y+.2,'#b8aa8a',.4);ln(g,7.6,y-1.4,1.6,y+.2,'#b8aa8a',.4)})},
bulb(g){[[0,-9.7,0,-8.3],[-5.6,-7.4,-4.7,-6.4],[5.6,-7.4,4.7,-6.4]].forEach(a=>ln(g,a[0],a[1],a[2],a[3],'#ffd45e',.9));fp(g,'circle',{cx:0,cy:-2.5,r:5.3},'#ffe27a');fp(g,'rect',{x:-2.4,y:2.2,width:4.8,height:2.8,rx:.6},'#b8c0c8');fp(g,'rect',{x:-2.2,y:5,width:4.4,height:2.4,rx:.9},'#8a94a6');sv('path',{d:'M-1.6 2L-1.6 -1L0 -2.4L1.6 -1L1.6 2',fill:'none',stroke:'#c98a1a','stroke-width':.5},g);fp(g,'ellipse',{cx:-2.2,cy:-4.4,rx:1,ry:1.8},'#fff','none').setAttribute('opacity','.5')}
};

/* ───────── Fondos listos ───────── */
const grad=(ctx,stops,dir)=>{const c=arr(stops).slice(0,4).map(col).filter(Boolean);if(c.length<2)return null;const id=ctx.uid+'g'+(++ctx.n),r=dir==='r';
  const e=sv(r?'radialGradient':'linearGradient',r?{id,cx:.4,cy:.35,r:.75}:{id,x1:0,y1:0,x2:dir==='h'?1:0,y2:dir==='h'?0:1},ctx.defs);
  c.forEach((cc,i)=>sv('stop',{offset:i/(c.length-1),'stop-color':cc},e));return `url(#${id})`};
const stars=(g,W,H,n,seed)=>{let s=seed||7;const rnd=()=>(s=(s*16807)%2147483647)/2147483647;for(let i=0;i<n;i++)sv('circle',{cx:(rnd()*W).toFixed(1),cy:(rnd()*H*.8).toFixed(1),r:(.2+rnd()*.45).toFixed(2),fill:'#fff',opacity:(.45+rnd()*.5).toFixed(2),class:i%3?'':'t10-tw'},g)};
const hills=(g,W,H,y,f,a)=>sv('path',{d:`M0 ${H*y}Q${W*.25} ${H*(y-a)} ${W*.5} ${H*y}T${W} ${H*y}V${H}H0Z`,fill:f},g);
const BG={
day(g,W,H,ctx){sv('rect',{width:W,height:H,fill:grad(ctx,['#5bb5f0','#d4efff'])},g);hills(g,W,H,.76,'#79c96a',.1);hills(g,W,H,.86,'#5fb85a',-.07)},
night(g,W,H,ctx){sv('rect',{width:W,height:H,fill:grad(ctx,['#0b1030','#233a6b'])},g);stars(g,W,H,26,11)},
sunset(g,W,H,ctx){sv('rect',{width:W,height:H,fill:grad(ctx,['#3a2a6b','#ff7a59','#ffd28a'])},g);hills(g,W,H,.82,'#2b1f3d',.08);hills(g,W,H,.92,'#1f162e',-.06)},
sea(g,W,H,ctx){sv('rect',{width:W,height:H*.56,fill:grad(ctx,['#8fd3ff','#e6f7ff'])},g);sv('rect',{y:H*.56,width:W,height:H*.44,fill:grad(ctx,['#2f8fd8','#12497f'])},g);
  for(let k=0;k<5;k++){const y=H*(.62+k*.075);sv('path',{d:`M0 ${y}Q${W*.08} ${y-1.4} ${W*.17} ${y}T${W*.34} ${y}T${W*.51} ${y}T${W*.68} ${y}T${W*.85} ${y}T${W} ${y}`,fill:'none',stroke:'#fff','stroke-width':.35,opacity:.3},g)}},
space(g,W,H,ctx){sv('rect',{width:W,height:H,fill:grad(ctx,['#05060f','#0d1230'])},g);stars(g,W,H*1.2,44,3)},
room(g,W,H,ctx){sv('rect',{width:W,height:H,fill:'#e9d8c0'},g);sv('rect',{y:H*.72,width:W,height:H*.28,fill:grad(ctx,['#b98b5e','#8f6540'])},g);sv('rect',{y:H*.7,width:W,height:H*.025,fill:'#f5ece0'},g)}
};

/* ───────── Estilo, formas, transformaciones ───────── */
function stl(o,ctx){
  let fill='none';
  if(o.grad){const gr=grad(ctx,o.grad,o.gd);if(gr)fill=gr}
  else if(o.fill!=null)fill=col(o.fill)||'none';
  return `stroke:${col(o.c)||'var(--chalk)'};stroke-width:${N(o.sw,.1,5,.9)};fill:${fill};fill-opacity:${N(o.fo,0,1,fill==='none'?0:(o.grad?.9:.3))};stroke-linecap:round;stroke-linejoin:round;${o.dash?'stroke-dasharray:2.5 2;':''}${o.nostroke?'stroke:none;':''}`}
const arrowHead=(ctx,c)=>{const k=c||'x';if(!ctx.mk[k]){const id=ctx.uid+'m'+(++ctx.n),m=sv('marker',{id,viewBox:'0 0 10 10',refX:8,refY:5,markerWidth:5,markerHeight:5,orient:'auto'},ctx.defs);sv('path',{d:'M0 0L10 5L0 10z',style:`fill:${c||'var(--chalk)'}`},m);ctx.mk[k]=id}return ctx.mk[k]};
const smooth=(p,closed)=>{if(p.length<2)return'';const q=closed?[p[p.length-1],...p,p[0],p[1]]:[p[0],...p,p[p.length-1]];let d=`M${q[1][0]} ${q[1][1]}`;
  for(let i=1;i<q.length-2;i++){const a=q[i-1],b=q[i],c=q[i+1],e=q[i+2];d+=`C${+(b[0]+(c[0]-a[0])/6).toFixed(2)} ${+(b[1]+(c[1]-a[1])/6).toFixed(2)} ${+(c[0]-(e[0]-b[0])/6).toFixed(2)} ${+(c[1]-(e[1]-b[1])/6).toFixed(2)} ${c[0]} ${c[1]}`}return d+(closed?'Z':'')};
const safeD=d=>{d=String(d==null?'':d).slice(0,900);return/^[MmLlHhVvCcSsQqTtAaZz0-9eE.,\-\s+]+$/.test(d)?d:''};

function build(o,ctx,parent,W,H,depth){
  const k=String(o.k||''),outer=sv('g',{},parent),anim=/^(float|spin|pulse|blink|sway|bounce|flow|twinkle|drift)$/.test(o.anim)?o.anim:'',
    inner=anim?sv('g',{class:'t10-a t10-'+anim},outer):outer,x=N(o.x,-40,W+40,W/2),y=N(o.y,-40,H+40,H/2),st=stl(o,ctx);
  let e=null,strokeAnim=!o.dash&&o.fill==null&&!o.grad,pivot=[x,y],xf='';
  const shadow=()=>{if(o.sh){if(!ctx.sh){ctx.sh=ctx.uid+'sh';const f=sv('filter',{id:ctx.sh,x:'-20%',y:'-20%',width:'150%',height:'160%'},ctx.defs);sv('feDropShadow',{dx:.5,dy:.9,stdDeviation:.7,'flood-color':'#000','flood-opacity':.5},f)}e.style.filter=`url(#${ctx.sh})`}};
  if(k==='rect'){const w=N(o.w,.5,200,20),h=N(o.h,.5,200,12);e=sv('rect',{x,y,width:w,height:h,rx:N(o.r,0,40,0),style:st},inner);pivot=[x+w/2,y+h/2]}
  else if(k==='circle')e=sv('circle',{cx:x,cy:y,r:N(o.r,.2,100,8),style:st},inner);
  else if(k==='ellipse')e=sv('ellipse',{cx:x,cy:y,rx:N(o.rx,.2,100,12),ry:N(o.ry,.2,100,6),style:st},inner);
  else if(k==='line'||k==='arrow'||k==='dim'){const x1=N(o.x1,-40,W+40,0),y1=N(o.y1,-40,H+40,0),x2=N(o.x2,-40,W+40,10),y2=N(o.y2,-40,H+40,10);
    if(k==='dim'){const dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L,t=1.6,c=col(o.c)||'var(--yel)';e=sv('path',{d:`M${x1} ${y1}L${x2} ${y2}M${x1-nx*t} ${y1-ny*t}L${x1+nx*t} ${y1+ny*t}M${x2-nx*t} ${y2-ny*t}L${x2+nx*t} ${y2+ny*t}`,style:`fill:none;stroke:${c};stroke-width:${N(o.sw,.2,3,.6)};stroke-linecap:round`},inner);
      if(o.s!=null){const z=N(o.size,2,12,3.6),off=(o.side==='in'?-1:1)*3.2;sv('text',{x:(x1+x2)/2+nx*off,y:(y1+y2)/2+ny*off+z*.35,'text-anchor':'middle',style:`fill:${c};font-size:${z}px;font-weight:700;${HALO(z)}`},inner,clip(o.s,24))}}
    else{e=sv('line',{x1,y1,x2,y2,style:st},inner);if(k==='arrow'){e.setAttribute('marker-end',`url(#${arrowHead(ctx,col(o.c))})`);strokeAnim=false}if(o.both)e.setAttribute('marker-start',`url(#${arrowHead(ctx,col(o.c))})`)}
    pivot=[(x1+x2)/2,(y1+y2)/2]}
  else if(k==='curve'||k==='poly'){const p=P2(o.pts,W,H);if(p.length<2){outer.remove();return null}
    e=k==='curve'?sv('path',{d:smooth(p,!!o.close),style:st},inner):sv(o.close?'polygon':'polyline',{points:p.map(q=>q.join(',')).join(' '),style:st},inner);
    if(o.arrow){e.setAttribute('marker-end',`url(#${arrowHead(ctx,col(o.c))})`);strokeAnim=false}}
  else if(k==='path'){const d=safeD(o.d);if(!d){outer.remove();return null}e=sv('path',{d,style:st},inner);pivot=null}
  else if(k==='arc'){const r=N(o.r,.4,100,8),a1=N(o.a1,-720,720,0),a2=N(o.a2,-720,720,90),pt=a=>[+(x+r*Math.cos(a*Math.PI/180)).toFixed(3),+(y-r*Math.sin(a*Math.PI/180)).toFixed(3)],p1=pt(a1),p2=pt(a2);
    e=sv('path',{d:`${o.pie?`M${x} ${y}L`:'M'}${p1[0]} ${p1[1]}A${r} ${r} 0 ${Math.abs(a2-a1)%360>180?1:0} ${a2>a1?0:1} ${p2[0]} ${p2[1]}${o.pie?'Z':''}`,style:st},inner)}
  else if(k==='star'||k==='ngon'){const r=N(o.r,.5,80,8),n=Math.round(N(o.n,k==='star'?3:3,k==='star'?12:16,k==='star'?5:6)),pts=k==='star'?starPts(r,r*N(o.inner,.1,.9,.45),n,-90):starPts(r,r,n,-90).split(' ').filter((_,i)=>i%2===0).join(' ');
    e=sv('polygon',{points:pts,transform:`translate(${x} ${y})`,style:st},inner)}
  else if(k==='wave'){const x1=N(o.x1,-40,W+40,0),x2=N(o.x2,-40,W+40,W),A=N(o.amp,.2,20,2),len=N(o.len,2,100,10),yy=N(o.y,-40,H+40,H/2);let d=`M${x1} ${yy}`;const stp=Math.max(.5,len/10);for(let X=x1;X<=x2;X+=stp)d+=`L${+X.toFixed(2)} ${+(yy+A*Math.sin((X-x1)/len*2*Math.PI)).toFixed(2)}`;e=sv('path',{d,style:st},inner);pivot=[(x1+x2)/2,yy]}
  else if(k==='spiral'){const r=N(o.r,1,60,10),tn=N(o.turns,.5,6,2.5);let d='';for(let i=0;i<=120;i++){const t=i/120,a=t*tn*2*Math.PI,rr=r*t;d+=(i?'L':'M')+(x+rr*Math.cos(a)).toFixed(2)+' '+(y+rr*Math.sin(a)).toFixed(2)}e=sv('path',{d,style:st},inner)}
  else if(k==='text'){const z=N(o.size,2,16,4.2),L=String(o.s==null?'':o.s).split('\n').slice(0,4);
    e=sv('text',{x,y,'text-anchor':o.a==='start'||o.a==='end'?o.a:'middle',style:`fill:${col(o.c)||'var(--chalk)'};font-size:${z}px;font-weight:${o.bold===false?500:700};${HALO(z)}`},inner);
    L.forEach((l,i)=>sv('tspan',{x,dy:i?z*1.18:0},e,clip(l,44)));strokeAnim=false}
  else if(k==='emoji'){const z=N(o.size,2,50,9);e=sv('text',{x,y:y+z*.34,'text-anchor':'middle',style:`font-size:${z}px`},inner,String(o.s||'').slice(0,6));strokeAnim=false}
  else if(k==='bubble'){const w=N(o.w,8,90,30),h=N(o.h,5,50,12),r=Math.min(3,h/3),top=o.tail==='t',tx=N(o.tx,2,w-2,w*.28),by=y+h,ty=top?y-4:by+4,
      d=top?`M${x+r} ${y}H${x+tx-2}L${x+tx} ${ty}L${x+tx+3} ${y}H${x+w-r}Q${x+w} ${y} ${x+w} ${y+r}V${by-r}Q${x+w} ${by} ${x+w-r} ${by}H${x+r}Q${x} ${by} ${x} ${by-r}V${y+r}Q${x} ${y} ${x+r} ${y}Z`
        :`M${x+r} ${y}H${x+w-r}Q${x+w} ${y} ${x+w} ${y+r}V${by-r}Q${x+w} ${by} ${x+w-r} ${by}H${x+tx+3}L${x+tx} ${ty}L${x+tx-2} ${by}H${x+r}Q${x} ${by} ${x} ${by-r}V${y+r}Q${x} ${y} ${x+r} ${y}Z`;
    e=sv('path',{d,style:`fill:${col(o.fill)||'#fff3d6'};fill-opacity:.96;stroke:var(--chalk);stroke-width:.5;stroke-linejoin:round`},inner);
    const z=N(o.size,2,10,3.6),L=wrap(clip(o.s,120),Math.max(6,Math.floor((w-3)/(z*.52))));L.forEach((l,i)=>sv('text',{x:x+w/2,y:y+h/2+z*.35+(i-(L.length-1)/2)*z*1.15,'text-anchor':'middle',style:`fill:#1d2b24;font-size:${z}px;font-weight:700`},inner,l));
    strokeAnim=false;pivot=[x+w/2,y+h/2]}
  else if(k==='label'){const tx=N(o.tx,-40,W+40,x+12),ty=N(o.ty,-40,H+40,y-8),c=col(o.c)||'var(--chalk)',z=N(o.size,2,10,3.8),right=tx>=x;
    e=sv('path',{d:`M${x} ${y}L${tx} ${ty}`,style:`fill:none;stroke:${col(o.lc)||'var(--yel)'};stroke-width:.4;stroke-linecap:round`},inner);sv('circle',{cx:x,cy:y,r:.9,style:'fill:var(--yel)'},inner);
    sv('text',{x:tx+(right?1.2:-1.2),y:ty+z*.33,'text-anchor':right?'start':'end',style:`fill:${c};font-size:${z}px;font-weight:700;${HALO(z)}`},inner,clip(o.s,30));strokeAnim=false}
  else if(k==='stamp'){const f=STAMPS[String(o.n||o.s||'')];if(!f){outer.remove();return null}
    const g=sv('g',{},inner);f(g);e=g;strokeAnim=false;const s=N(o.s2!=null?o.s2:o.size!=null?o.size/20:o.sc,.1,8,1);
    xf=`translate(${x} ${y}) rotate(${N(o.rot,-720,720,0)}) scale(${(o.flip==='h'||o.flip===true?-1:1)*s} ${(o.flip==='v'?-1:1)*s})`;pivot=null;
    if(o.op!=null)g.style.opacity=String(N(o.op,0,1,1))}
  else if(k==='group'&&depth<2){const g=sv('g',{},inner);e=g;strokeAnim=false;arr(o.shapes).slice(0,40).forEach(c=>{if(c&&typeof c==='object')build(c,ctx,g,W,H,depth+1)});
    const s=N(o.sc,.1,8,1);xf=`translate(${o.x==null?0:x} ${o.y==null?0:y}) rotate(${N(o.rot,-720,720,0)}) scale(${(o.flip==='h'?-1:1)*s} ${(o.flip==='v'?-1:1)*s})`;pivot=null}
  if(!e){outer.remove();return null}
  if(o.op!=null&&k!=='stamp')e.style.opacity=String(N(o.op,0,1,1));
  if(o.sh)shadow();
  /* rotar / escalar / voltear alrededor del centro de la forma + desplazamiento de repetición */
  if(!xf&&(o.rot||o.sc||o.flip||o._tx||o._ty)){
    let pv=pivot;if(!pv){try{const b=outer.getBBox();pv=[b.x+b.width/2,b.y+b.height/2]}catch(x){pv=[x,y]}}
    const s=N(o.sc,.1,8,1);xf=`translate(${o._tx||0} ${o._ty||0}) translate(${pv[0]} ${pv[1]}) rotate(${N(o.rot,-720,720,0)}) scale(${(o.flip==='h'?-1:1)*s} ${(o.flip==='v'?-1:1)*s}) translate(${-pv[0]} ${-pv[1]})`}
  else if(xf&&(o._tx||o._ty))xf=`translate(${o._tx||0} ${o._ty||0}) `+xf;
  if(xf)outer.setAttribute('transform',xf);
  return{outer,e,strokeAnim:strokeAnim&&k!=='stamp'&&k!=='group',k}}

function scene(it){
  let sh=arr(it.shapes).slice(0,90).filter(o=>o&&typeof o==='object');
  if(!sh.length&&!it.bg)return 500;
  const H={wide:56.25,square:100,tall:120}[it.ratio]||75,W=100,uid='sx'+(++UID);
  /* repetición: rep:{n,dx,dy} copia la forma n veces desplazándola */
  const ex=[];sh.forEach(o=>{const r=o.rep&&typeof o.rep==='object'?o.rep:null;if(!r){ex.push(o);return}const n=Math.round(N(r.n,2,14,3));for(let q=0;q<n;q++)ex.push(Object.assign({},o,{_tx:N(r.dx,-100,100,8)*q,_ty:N(r.dy,-100,100,0)*q,rep:null}))});
  sh=ex.slice(0,140);
  const d=put('t-fig'),s=sv('svg',{viewBox:`0 0 ${W} ${H}`,class:'graph',style:'max-width:560px;overflow:visible'},d),defs=sv('defs',{},s),ctx={defs,mk:{},uid,n:0,sh:null};
  const bgs=String(it.bg||'');
  if(BG[bgs]){const cp=uid+'cp';sv('rect',{x:0,y:0,width:W,height:H,rx:2},sv('clipPath',{id:cp},defs));const g=sv('g',{'clip-path':`url(#${cp})`,class:'t5-sf'},s);BG[bgs](g,W,H,ctx)}
  else if(it.bg)sv('rect',{x:0,y:0,width:W,height:H,rx:2,style:`fill:${col(it.bg)||'none'};fill-opacity:.18`},s);
  if(it.grid){for(let i=10;i<W;i+=10)sv('line',{x1:i,y1:0,x2:i,y2:H,style:'stroke:currentColor;stroke-width:.15;opacity:.3'},s);for(let j=10;j<H;j+=10)sv('line',{x1:0,y1:j,x2:W,y2:j,style:'stroke:currentColor;stroke-width:.15;opacity:.3'},s)}
  /* grupos de aparición: las formas con el mismo "at" salen juntas; sin "at", una por una */
  const anyAt=sh.some(o=>o.at!=null);let prev=null;
  const items=[];sh.forEach((o,i)=>{const b=build(o,ctx,s,W,H,0);if(!b)return;let g=o.at!=null?+o.at:(anyAt&&prev!=null?prev:i);if(!isFinite(g))g=i;prev=g;b.g=g;items.push(b)});
  const ranks=[...new Set(items.map(b=>b.g))].sort((a,b)=>a-b),G=Math.max(1,ranks.length),step=Math.max(70,Math.min(520,8500/G));
  items.forEach(b=>{b.rank=ranks.indexOf(b.g);const e=b.e;let L=0;
    if(b.strokeAnim){try{L=e.getTotalLength()}catch(x){}e.style.fillOpacity=0;e.style.transition='stroke-dashoffset .8s ease-out,fill-opacity .6s';if(L){e.style.strokeDasharray=L;e.style.strokeDashoffset=L}}
    else{b.outer.style.opacity=0;b.outer.style.transition='opacity .5s'}
    b.L=L});
  items.forEach(b=>{setTimeout(()=>{
    if(b.strokeAnim){b.e.style.strokeDashoffset=0;b.e.style.fillOpacity='';setTimeout(()=>{b.e.style.strokeDasharray='';b.e.style.transition=''},900)}
    else b.outer.style.opacity=''},b.rank*step+60)});
  cap(d,it);reveal(d);return Math.round(G*step+900)}

const old=Board.draw;
Board.draw=function(it){if(it&&it.t==='scene'){try{return scene(it)}catch(e){console.warn('teach10',e)}}return old.call(Board,it)};
window.LumiScene={stamps:Object.keys(STAMPS),backgrounds:Object.keys(BG)};
})();
