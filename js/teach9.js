/* Herramientas de enseñanza de Lumi · tanda 11: anatomy, moonphases, slope, transform, lever, projectile, boxplot, circleparts, regpoly.
   Plantillas de dibujo y gráficos listos. Todo el texto de la IA se inserta como texto (nunca HTML). */
(()=>{
if(typeof Board==='undefined')return;
const NS='http://www.w3.org/2000/svg',sheet=()=>document.getElementById('sheet'),box=()=>document.getElementById('board');
const C=['var(--blue)','var(--yel)','var(--pink)','var(--chalk)'];
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
const cap=(d,it)=>{if(it.caption)rich(el('div','t-note',d),it.caption)};
const fm=v=>String(+(+v).toFixed(2));
let uid=0;

const mm=s=>{s=String(s==null?'':s);return s.indexOf('$')>=0?s:'$'+s+'$'};
const N=(v,a,b,d)=>{v=+v;return isFinite(v)?Math.max(a,Math.min(b,v)):d};
const S=(a,n)=>arr(a).slice(0,n).map(x=>String(x==null?'':x));
const wrap=(t,n)=>{const w=String(t).split(/\s+/),L=[];let c='';w.forEach(x=>{if((c+' '+x).trim().length>n&&c){L.push(c);c=x}else c=(c+' '+x).trim()});if(c)L.push(c);return L.slice(0,3)};
const dl=(n,i,step)=>{n.style.animationDelay=(i*(step||.4))+'s'};

const HALO='paint-order:stroke;stroke:var(--board,#243b2f);stroke-width:4px;stroke-linejoin:round;';
const tx=(s,x,y,t,c,a,z)=>sv('text',{x,y,'text-anchor':a||'middle',style:`fill:${c||'currentColor'};font-size:${z||13}px;font-weight:600;${HALO}`},s,t);
const fmt=v=>String(+(+v).toFixed(2)).replace('.',',');

const COL={blue:'var(--blue)',yel:'var(--yel)',pink:'var(--pink)',chalk:'var(--chalk)',green:'#8fe39a',red:'#ff8c8c',orange:'#ffb36b',purple:'#c4a4ff',white:'#ffffff',brown:'#c49a6c',sky:'#9ad7ff',gray:'#b8c0c8',none:'none'};
const col=v=>{if(v==null||v==='')return null;if(typeof v==='number')return C[Math.abs(Math.round(v))%4];return COL[String(v)]||'var(--chalk)'};
const num=(v,a,b,d)=>N(v,a,b,d),P2=a=>arr(a).slice(0,40).map(p=>[num(arr(p)[0],-30,130,0),num(arr(p)[1],-30,105,0)]);
const stl=o=>`stroke:${col(o.c)||'var(--chalk)'};stroke-width:${num(o.sw,.2,4,.9)};fill:${o.fill!=null?col(o.fill):'none'};fill-opacity:${num(o.fo,0,1,.3)};stroke-linecap:round;stroke-linejoin:round;${o.dash?'stroke-dasharray:2.5 2;':''}`;
let mid=0;

const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
const rad=d=>d*Math.PI/180;
/* plano cartesiano cuadrado que incluye los puntos dados; devuelve conversores */
function plane(s,vals){
  const lo=Math.floor(Math.min(0,...vals))-1,hi=Math.ceil(Math.max(0,...vals))+1,sp=hi-lo,st=Math.max(1,Math.ceil(sp/12));
  const X=v=>60+280*(v-lo)/sp,Y=v=>290-280*(v-lo)/sp;
  for(let v=lo;v<=hi;v++){if((v-lo)%st)continue;sv('line',{x1:X(v),y1:Y(lo),x2:X(v),y2:Y(hi),style:'stroke:currentColor;stroke-width:.6;opacity:.25'},s);sv('line',{x1:X(lo),y1:Y(v),x2:X(hi),y2:Y(v),style:'stroke:currentColor;stroke-width:.6;opacity:.25'},s);
    if(v&&v%st===0){tx(s,X(v),Y(0)+15,String(v),'currentColor',null,11);tx(s,X(0)-6,Y(v)+4,String(v),'currentColor','end',11)}}
  sv('line',{x1:X(lo),y1:Y(0),x2:X(hi),y2:Y(0),style:'stroke:currentColor;stroke-width:2'},s);sv('line',{x1:X(0),y1:Y(lo),x2:X(0),y2:Y(hi),style:'stroke:currentColor;stroke-width:2'},s);
  return {X,Y,lo,hi}}
const frac=(a,b)=>{if(!b)return '';const g=gcd(a,b)||1;let p=a/g,q=b/g;if(q<0){p=-p;q=-q}return q===1?String(p):p+'/'+q};

/* ---------- Plantillas anatómicas (viewBox 400 × 300) ---------- */
const BL='#7aa7ff',RD='#ff7a7a',pa=(g,d,f,k,w)=>sv('path',{d,style:`fill:${f||'none'};stroke:${k||'var(--chalk)'};stroke-width:${w||2.5};stroke-linejoin:round;stroke-linecap:round`},g);
const TPL={
heart:[
 {id:'vcava',l:'Vena cava',d:g=>pa(g,'M78 40H100V150H78Z',BL),p:[89,70],q:[8,60],a:'start'},
 {id:'pulm',l:'Arteria pulmonar',d:g=>pa(g,'M175 95C165 55 140 40 120 55L127 70C145 62 160 80 165 100Z',BL),p:[140,58],q:[8,25],a:'start'},
 {id:'ra',l:'Aurícula derecha',d:g=>pa(g,'M110 100C105 75 165 70 192 92V150H132C112 138 108 118 110 100Z',BL),p:[130,125],q:[8,150],a:'start'},
 {id:'rv',l:'Ventrículo derecho',d:g=>pa(g,'M132 155H192L198 240C165 228 135 195 132 155Z',BL),p:[165,195],q:[8,230],a:'start'},
 {id:'ao',l:'Aorta',d:g=>pa(g,'M205 95C205 35 285 20 290 85L275 85C272 50 225 55 222 100Z',RD),p:[262,45],q:[392,25],a:'end'},
 {id:'la',l:'Aurícula izquierda',d:g=>pa(g,'M208 92C245 68 292 78 286 108C288 125 284 140 276 150H208Z',RD),p:[250,115],q:[392,110],a:'end'},
 {id:'lv',l:'Ventrículo izquierdo',d:g=>pa(g,'M208 155H276C282 200 250 240 206 258Z',RD),p:[245,205],q:[392,240],a:'end'}],
eye:[
 {id:'sclera',l:'Esclerótica',d:g=>sv('circle',{cx:210,cy:150,r:80,style:'fill:rgba(255,255,255,.08);stroke:var(--chalk);stroke-width:5'},g),p:[210,70],q:[392,30],a:'end'},
 {id:'cornea',l:'Córnea',d:g=>pa(g,'M138 100C108 120 108 180 138 200','none','#9ad7ff',7),p:[113,150],q:[8,150],a:'start'},
 {id:'iris',l:'Iris',d:g=>pa(g,'M150 108V135M150 165V192','none','#ffb36b',8),p:[150,118],q:[8,60],a:'start'},
 {id:'pupil',l:'Pupila',d:g=>pa(g,'M146 137V163','none','var(--chalk)',2),p:[147,152],q:[8,230],a:'start'},
 {id:'lens',l:'Cristalino',d:g=>sv('ellipse',{cx:172,cy:150,rx:11,ry:26,style:'fill:#9ad7ff;fill-opacity:.7;stroke:var(--chalk);stroke-width:2'},g),p:[172,126],q:[8,20],a:'start'},
 {id:'retina',l:'Retina',d:g=>pa(g,'M271 99A80 80 0 0 1 271 201','none',RD,7),p:[283,117],q:[392,75],a:'end'},
 {id:'nerve',l:'Nervio óptico',d:g=>pa(g,'M290 142H350V162H290Z','#ffe58a'),p:[330,152],q:[392,205],a:'end'}],
plant:[
 {id:'flower',l:'Flor',d:g=>{[0,60,120].forEach(r=>sv('ellipse',{cx:200,cy:70,rx:24,ry:8,transform:`rotate(${r} 200 70)`,style:'fill:#ff9ec7;stroke:var(--chalk);stroke-width:1.5'},g));sv('circle',{cx:200,cy:70,r:9,style:'fill:#ffe58a;stroke:var(--chalk);stroke-width:1.5'},g)},p:[222,62],q:[392,45],a:'end'},
 {id:'leaf',l:'Hojas',d:g=>{sv('ellipse',{cx:165,cy:140,rx:32,ry:12,transform:'rotate(-30 165 140)',style:'fill:#8fe39a;stroke:var(--chalk);stroke-width:2'},g);sv('ellipse',{cx:235,cy:120,rx:32,ry:12,transform:'rotate(30 235 120)',style:'fill:#8fe39a;stroke:var(--chalk);stroke-width:2'},g)},p:[160,135],q:[8,115],a:'start'},
 {id:'stem',l:'Tallo',d:g=>pa(g,'M200 190V80','none','#6fcf7e',10),p:[200,165],q:[392,150],a:'end'},
 {id:'soil',l:'Suelo',d:g=>pa(g,'M0 190H400V300H0Z','rgba(196,154,108,.3)','rgba(196,154,108,.8)',2),p:[60,235],q:[8,210],a:'start'},
 {id:'roots',l:'Raíces',d:g=>pa(g,'M200 190C195 220 170 235 150 262M200 190C200 230 205 250 205 280M200 190C210 220 240 235 255 262','none','#c49a6c',5),p:[205,250],q:[392,265],a:'end'}],
solar:(()=>{const S=[['Mercurio',95,4,'#b8c0c8'],['Venus',122,7,'#ffd9a0'],['Tierra',152,7,'#6fb7ff'],['Marte',180,5,'#ff9b7a'],['Júpiter',230,22,'#e8c9a0'],['Saturno',290,18,'#f2dca0'],['Urano',337,12,'#9be8e8'],['Neptuno',375,12,'#7a9bff']],Q=[60,240,40,260,60,240,40,260];
  return [{id:'sun',l:'Sol',d:g=>sv('circle',{cx:22,cy:150,r:50,style:'fill:#ffd45e;stroke:var(--chalk);stroke-width:2'},g),p:[40,120],q:[40,50],a:'middle'}].concat(S.map((x,i)=>({id:x[0].toLowerCase().normalize('NFD').replace(/[^a-z]/g,''),l:x[0],d:g=>{sv('circle',{cx:x[1],cy:150,r:x[2],style:`fill:${x[3]};stroke:var(--chalk);stroke-width:1.5`},g);if(x[0]==='Saturno')sv('ellipse',{cx:x[1],cy:150,rx:x[2]*1.8,ry:x[2]*.4,style:'fill:none;stroke:#f2dca0;stroke-width:2'},g)},p:[x[1],150-(i%2?-1:1)*x[2]],q:[x[1],Q[i]],a:'middle'})))})(),
volcano:[
 {id:'ash',l:'Nube de ceniza',d:g=>[[190,60,40,18],[225,50,35,20],[160,68,28,14]].forEach(e=>sv('ellipse',{cx:e[0],cy:e[1],rx:e[2],ry:e[3],style:'fill:#b8c0c8;stroke:var(--chalk);stroke-width:1.5'},g)),p:[225,45],q:[392,30],a:'end'},
 {id:'crater',l:'Cráter',d:g=>pa(g,'M160 105L178 123H222L240 105Z','#4a3426'),p:[232,110],q:[392,90],a:'end'},
 {id:'cone',l:'Cono volcánico',d:g=>pa(g,'M60 220L160 105H240L340 220Z','#8b6b4a'),p:[310,185],q:[392,190],a:'end'},
 {id:'lava',l:'Flujo de lava',d:g=>pa(g,'M178 123C168 150 190 160 175 185C165 205 185 215 170 220','none','#ff5a2a',6),p:[175,170],q:[8,185],a:'start'},
 {id:'chimney',l:'Chimenea',d:g=>pa(g,'M188 120H212V232H188Z','#ff7a3d'),p:[200,170],q:[8,130],a:'start'},
 {id:'magma',l:'Cámara magmática',d:g=>{pa(g,'M0 220H400V300H0Z','rgba(80,50,30,.55)','rgba(196,154,108,.8)',2);sv('ellipse',{cx:200,cy:262,rx:80,ry:28,style:'fill:#e63b2e;stroke:var(--chalk);stroke-width:2.5'},g)},p:[170,265],q:[8,275],a:'start'}]
};

const E={
/* Plantillas de dibujos con partes rotuladas: corazón, ojo, planta, sistema solar y volcán */
anatomy(it){
  const T=TPL[String(it.template)];if(!T)return 500;
  const hl=new Set(arr(it.highlight).map(String)),lab=it.labels&&typeof it.labels==='object'?it.labels:{},quiz=!!it.quiz,showOnly=arr(it.show).length?new Set(arr(it.show).map(String)):null;
  const d=put('t-fig'),s=sv('svg',{viewBox:'0 0 400 300',class:'graph'},d);let n=0;
  T.forEach((p,i)=>{if(showOnly&&!showOnly.has(p.id))return;const dim=hl.size&&!hl.has(p.id),g=sv('g',{class:'t5-sf'},s);g.style.animationDelay=(n++*.35)+'s';
    const ig=sv('g',{style:dim?'opacity:.3':''},g);p.d(ig);
    const t=quiz?String(i+1):clip(lab[p.id]||p.l,22),len=quiz?10:t.length*6.4+8,[qx,qy]=p.q;let ex=qx,ey=qy;
    if(p.a==='start'){ex=qx+len+4;ey=qy-4}else if(p.a==='end'){ex=qx-len-4;ey=qy-4}else{ey=qy+(qy<p.p[1]?4:-14)}
    sv('line',{x1:p.p[0],y1:p.p[1],x2:ex,y2:ey,style:`stroke:var(--chalk);stroke-width:1.3;opacity:${dim?.25:.8}`},g);sv('circle',{cx:p.p[0],cy:p.p[1],r:3,style:'fill:var(--chalk)'},g);
    if(quiz){sv('circle',{cx:qx+(p.a==='end'?-8:p.a==='start'?8:0),cy:qy-4,r:10,style:'fill:var(--yel)'},g);sv('text',{x:qx+(p.a==='end'?-8:p.a==='start'?8:0),y:qy,'text-anchor':'middle',style:'fill:#13251c;font-size:13px;font-weight:800'},g,t)}
    else sv('text',{x:qx,y:qy,'text-anchor':p.a,style:`fill:${hl.has(p.id)?'var(--yel)':'currentColor'};font-size:${T.length>8?11:14}px;font-weight:700;${HALO}opacity:${dim?.5:1}`},g,t)});
  cap(d,it);reveal(d);return n*350+1000},

/* Fases de la Luna */
moonphases(it){
  const N8=['Luna nueva','Creciente','Cuarto creciente','Gibosa creciente','Luna llena','Gibosa menguante','Cuarto menguante','Menguante'],sur=String(it.hemisphere||'').toLowerCase().startsWith('s'),hi=it.highlight==null?-1:Math.round(+it.highlight);
  const d=put('t-fig'),s=sv('svg',{viewBox:'0 0 400 270',class:'graph'},d);
  N8.forEach((nm,i)=>{const cx=55+(i%4)*97,cy=52+Math.floor(i/4)*128,r=34,wax=i>0&&i<4,wan=i>4,pi=wan?8-i:i,k=Math.cos(2*Math.PI*pi/8),g=sv('g',{class:'t5-sf'},s);g.style.animationDelay=(i*.3)+'s';
    sv('circle',{cx,cy,r,style:'fill:#2b3550;stroke:var(--chalk);stroke-width:2'},g);
    if(i!==0){const lit=sv('path',{d:`M${cx} ${cy-r}A${r} ${r} 0 0 1 ${cx} ${cy+r}A${Math.max(.01,Math.abs(k)*r)} ${r} 0 0 ${k>0?0:1} ${cx} ${cy-r}Z`,style:'fill:#f5efc8'},g);
      if(wan!==sur&&i!==4)lit.setAttribute('transform',`translate(${2*cx} 0) scale(-1 1)`)}
    if(i===hi)sv('circle',{cx,cy,r:r+6,style:'fill:none;stroke:var(--yel);stroke-width:3'},g);
    tx(g,cx,cy+r+19,nm,i===hi?'var(--yel)':'currentColor',null,12)});
  el('div','t-note t5-c',d,`Vista desde el hemisferio ${sur?'sur':'norte'}: la parte iluminada ${sur?'crece desde la izquierda':'crece desde la derecha'} cuando la Luna va creciendo.`);
  cap(d,it);reveal(d);return 3400},

/* Pendiente de una recta: subida, avance y ecuación */
slope(it){
  const x1=N(it.x1,-50,50,0),y1=N(it.y1,-50,50,0),x2=N(it.x2,-50,50,2),y2=N(it.y2,-50,50,3);if(x1===x2&&y1===y2)return 500;
  const d=put('t-fig'),s=sv('svg',{viewBox:'0 0 400 300',class:'graph'},d),pl=plane(s,[x1,y1,x2,y2]),{X,Y,lo,hi}=pl,dx=x2-x1,dy=y2-y1;
  const cid='cl'+(++mid),cp=sv('clipPath',{id:cid},s);sv('rect',{x:60,y:10,width:280,height:280},cp);
  if(dx!==0){const m=dy/dx,b=y1-m*x1;sv('line',{x1:X(lo),y1:Y(m*lo+b),x2:X(hi),y2:Y(m*hi+b),'clip-path':`url(#${cid})`,style:'stroke:var(--blue);stroke-width:3.5'},s)}else sv('line',{x1:X(x1),y1:Y(lo),x2:X(x1),y2:Y(hi),style:'stroke:var(--blue);stroke-width:3.5'},s);
  sv('line',{x1:X(x1),y1:Y(y1),x2:X(x2),y2:Y(y1),style:'stroke:var(--yel);stroke-width:3;stroke-dasharray:6 4'},s);sv('line',{x1:X(x2),y1:Y(y1),x2:X(x2),y2:Y(y2),style:'stroke:var(--pink);stroke-width:3;stroke-dasharray:6 4'},s);
  [[x1,y1],[x2,y2]].forEach(p=>{sv('circle',{cx:X(p[0]),cy:Y(p[1]),r:5.5,style:'fill:var(--chalk);stroke:var(--blue);stroke-width:2'},s);tx(s,X(p[0])+8,Y(p[1])-9,`(${p[0]}, ${p[1]})`,'currentColor','start',12)});
  tx(s,(X(x1)+X(x2))/2,Y(y1)+(dy>=0?16:-8),`avance Δx = ${fmt(dx)}`,'var(--yel)',null,12);tx(s,X(x2)+8,(Y(y1)+Y(y2))/2,`subida Δy = ${fmt(dy)}`,'var(--pink)','start',12);
  const t=el('div','t5-sol',d);if(dx===0)el('div','',t,'Recta vertical: Δx = 0, la pendiente no está definida.');
  else{const m=dy/dx,b=y1-m*x1;el('div','',t,`m = Δy / Δx = ${fmt(dy)} / ${fmt(dx)} = ${Number.isInteger(dy)&&Number.isInteger(dx)&&frac(dy,dx).includes('/')?frac(dy,dx)+' ≈ ':''}${fmt(m)}`);el('div','',t,`y = ${fmt(m)}x ${b<0?'−':'+'} ${fmt(Math.abs(b))}  ·  ${m>0?'sube (m > 0)':m<0?'baja (m < 0)':'horizontal (m = 0)'}`)}
  cap(d,it);reveal(d);return 2000},

/* Transformaciones geométricas de un polígono: traslación, reflexión, giro y homotecia */
transform(it){
  const P=arr(it.pts).slice(0,8).map(p=>[N(arr(p)[0],-30,30,0),N(arr(p)[1],-30,30,0)]);if(P.length<2)return 500;
  const op=['translate','reflect-x','reflect-y','rotate','dilate'].includes(it.op)?it.op:'translate',dx=N(it.dx,-30,30,3),dy=N(it.dy,-30,30,2),deg=N(it.deg,-360,360,90),k=N(it.k,-10,10,2),c=Math.cos(rad(deg)),sn=Math.sin(rad(deg));
  const Q=P.map(([x,y])=>op==='translate'?[x+dx,y+dy]:op==='reflect-x'?[x,-y]:op==='reflect-y'?[-x,y]:op==='rotate'?[+(x*c-y*sn).toFixed(2),+(x*sn+y*c).toFixed(2)]:[x*k,y*k]);
  const d=put('t-fig'),s=sv('svg',{viewBox:'0 0 400 300',class:'graph'},d),{X,Y}=plane(s,P.concat(Q).flat());
  const poly=(A,st,pr)=>{sv(A.length>2?'polygon':'polyline',{points:A.map(p=>X(p[0])+','+Y(p[1])).join(' '),style:st},s);A.forEach((p,i)=>{sv('circle',{cx:X(p[0]),cy:Y(p[1]),r:3.5,style:'fill:currentColor'},s);tx(s,X(p[0])+7,Y(p[1])-7,String.fromCharCode(65+i)+pr,'currentColor','start',13)})};
  poly(P,'fill:rgba(143,208,232,.22);stroke:var(--blue);stroke-width:3','');poly(Q,'fill:rgba(255,229,138,.18);stroke:var(--yel);stroke-width:3;stroke-dasharray:7 4',"'");
  const R={translate:`Traslación: (x, y) → (x ${dx<0?'−':'+'} ${fmt(Math.abs(dx))}, y ${dy<0?'−':'+'} ${fmt(Math.abs(dy))})`,'reflect-x':'Reflexión en el eje x: (x, y) → (x, −y)','reflect-y':'Reflexión en el eje y: (x, y) → (−x, y)',rotate:`Giro de ${fmt(deg)}° alrededor del origen (antihorario)`,dilate:`Homotecia de razón ${fmt(k)} desde el origen: (x, y) → (${fmt(k)}x, ${fmt(k)}y)`};
  const t=el('div','t5-sol',d);el('div','',t,R[op]);el('div','',t,P.map((p,i)=>`${String.fromCharCode(65+i)}(${fmt(p[0])}, ${fmt(p[1])}) → ${String.fromCharCode(65+i)}'(${fmt(Q[i][0])}, ${fmt(Q[i][1])})`).join('  ·  '));
  cap(d,it);reveal(d);return 2200},

/* Palanca: torque izquierdo y derecho, inclina la barra o equilibra */
lever(it){
  const L=it.left||{},Rr=it.right||{},wl=N(L.w,.1,1000,20),dl2=N(L.d,.1,100,3),dr=N(Rr.d,.1,100,2),u=String(it.unit||'').slice(0,4);let wr=+Rr.w;const solve=!(wr>0);const tl=wl*dl2;if(solve)wr=tl/dr;const tr=wr*dr;
  const phi=Math.max(-14,Math.min(14,(tr-tl)/Math.max(tl,tr)*14)),k=130/Math.max(dl2,dr),d=put('t-fig'),s=sv('svg',{viewBox:'0 0 400 230',class:'graph'},d);
  sv('polygon',{points:'200,175 178,215 222,215',style:'fill:rgba(255,255,255,.12);stroke:var(--chalk);stroke-width:3'},s);
  const g=sv('g',{transform:`rotate(${phi.toFixed(2)} 200 170)`},s);sv('rect',{x:35,y:164,width:330,height:9,rx:3,style:'fill:var(--yel);stroke:var(--chalk);stroke-width:1.5'},g);
  const box=(x,w,dd,c)=>{const z=Math.max(26,Math.min(54,20+Math.sqrt(w)*3.2));sv('line',{x1:x,y1:173,x2:x,y2:188,style:'stroke:var(--chalk);stroke-width:2'},g);sv('rect',{x:x-z/2,y:188,width:z,height:z*.8,rx:4,style:`fill:${c};fill-opacity:.35;stroke:${c};stroke-width:2.5`},g);tx(g,x,188+z*.4+5,fmt(w)+u,'currentColor',null,13);tx(g,x,155,`d = ${fmt(dd)}`,c,null,13)};
  box(200-dl2*k,wl,dl2,'var(--blue)');box(200+dr*k,wr,dr,'var(--pink)');
  const t=el('div','t5-sol',d);el('div','',t,`Izquierda: τ = F · d = ${fmt(wl)} × ${fmt(dl2)} = ${fmt(tl)}`);el('div','',t,`Derecha: τ = ${fmt(wr)} × ${fmt(dr)} = ${fmt(tr)}`);
  el('div','',t,solve?`Para equilibrar la derecha necesita ${fmt(wr)}${u} (porque ${fmt(tl)} ÷ ${fmt(dr)})`:Math.abs(tl-tr)<1e-9?'Los torques son iguales: la palanca está en equilibrio':`Gana el lado ${tl>tr?'izquierdo':'derecho'}: ese lado baja`);
  cap(d,it);reveal(d);return 2000},

/* Tiro parabólico: trayectoria, altura máxima, alcance y tiempo */
projectile(it){
  const v=N(it.v,.1,10000,20),a=N(it.angle,1,89,45),g0=N(it.g,.5,30,9.8),vx=v*Math.cos(rad(a)),vy=v*Math.sin(rad(a)),T=2*vy/g0,R=vx*T,H=vy*vy/(2*g0),k=Math.min(320/R,150/H),x0=40,y0=200;
  const d=put('t-fig'),s=sv('svg',{viewBox:'0 0 400 240',class:'graph'},d);
  sv('line',{x1:20,y1:y0,x2:385,y2:y0,style:'stroke:currentColor;stroke-width:2.5'},s);
  let p='';for(let i=0;i<=60;i++){const t=T*i/60;p+=(i?'L':'M')+(x0+vx*t*k).toFixed(1)+' '+(y0-(vy*t-g0*t*t/2)*k).toFixed(1)}
  const tr=sv('path',{d:p,style:'fill:none;stroke:var(--blue);stroke-width:3.5;stroke-linecap:round','pathLength':1,class:'t5-draw'},s);
  const px=x0+vx*(T/2)*k,py=y0-H*k;sv('line',{x1:px,y1:py,x2:px,y2:y0,style:'stroke:var(--yel);stroke-width:2;stroke-dasharray:5 4'},s);sv('line',{x1:x0,y1:y0+16,x2:x0+R*k,y2:y0+16,style:'stroke:var(--pink);stroke-width:2.5'},s);
  sv('circle',{cx:px,cy:py,r:5,style:'fill:var(--yel)'},s);tx(s,px+8,(py+y0)/2,`H = ${fmt(H)} m`,'var(--yel)','start',13);tx(s,x0+R*k/2,y0+34,`Alcance R = ${fmt(R)} m`,'var(--pink)',null,13);
  sv('line',{x1:x0,y1:y0,x2:x0+50*Math.cos(rad(a)),y2:y0-50*Math.sin(rad(a)),style:'stroke:var(--chalk);stroke-width:2;stroke-dasharray:3 3'},s);sv('path',{d:`M${x0+32} ${y0}A32 32 0 0 0 ${x0+32*Math.cos(rad(a))} ${y0-32*Math.sin(rad(a))}`,style:'fill:none;stroke:var(--chalk);stroke-width:2'},s);tx(s,x0+40,y0-8,`${fmt(a)}°`,'currentColor','start',12);
  const t=el('div','t5-sol',d);el('div','',t,`vₓ = v·cos θ = ${fmt(vx)} m/s · v_y = v·sen θ = ${fmt(vy)} m/s`);el('div','',t,`Tiempo de vuelo T = 2·v_y / g = ${fmt(T)} s`);el('div','',t,`Altura máx. H = v_y² / 2g = ${fmt(H)} m · Alcance R = vₓ·T = ${fmt(R)} m`);
  cap(d,it);reveal(d);return 2400},

/* Diagrama de caja y bigotes con cuartiles y valores atípicos */
boxplot(it){
  const V=arr(it.values).slice(0,40).map(Number).filter(isFinite).sort((a,b)=>a-b);if(V.length<4)return 500;
  const med=a=>{const n=a.length,m=n>>1;return n%2?a[m]:(a[m-1]+a[m])/2},n=V.length,lowH=V.slice(0,n>>1),upH=V.slice(n%2?(n>>1)+1:n>>1),q1=med(lowH),q2=med(V),q3=med(upH),iqr=q3-q1,fl=q1-1.5*iqr,fh=q3+1.5*iqr;
  const ins=V.filter(v=>v>=fl&&v<=fh),wl=ins[0],wh=ins[ins.length-1],out=V.filter(v=>v<fl||v>fh),lo=V[0],hi=V[n-1],sp=(hi-lo)||1;
  const d=put('t-fig'),s=sv('svg',{viewBox:'0 0 400 190',class:'graph'},d),X=v=>30+340*(v-lo)/sp,Y=95;
  sv('line',{x1:30,y1:150,x2:370,y2:150,style:'stroke:currentColor;stroke-width:2'},s);for(let i=0;i<=4;i++){const v=lo+sp*i/4;sv('line',{x1:X(v),y1:145,x2:X(v),y2:155,style:'stroke:currentColor;stroke-width:1.5'},s);tx(s,X(v),170,fmt(v),'currentColor',null,12)}
  sv('line',{x1:X(wl),y1:Y,x2:X(q1),y2:Y,style:'stroke:var(--chalk);stroke-width:3'},s);sv('line',{x1:X(q3),y1:Y,x2:X(wh),y2:Y,style:'stroke:var(--chalk);stroke-width:3'},s);
  [wl,wh].forEach(v=>sv('line',{x1:X(v),y1:Y-12,x2:X(v),y2:Y+12,style:'stroke:var(--chalk);stroke-width:3'},s));
  sv('rect',{x:X(q1),y:Y-26,width:Math.max(2,X(q3)-X(q1)),height:52,style:'fill:rgba(143,208,232,.25);stroke:var(--blue);stroke-width:3'},s);sv('line',{x1:X(q2),y1:Y-26,x2:X(q2),y2:Y+26,style:'stroke:var(--yel);stroke-width:4'},s);
  out.forEach(v=>sv('circle',{cx:X(v),cy:Y,r:5,style:'fill:var(--pink)'},s));
  [[q1,'Q1','var(--blue)',-34],[q2,'Mediana','var(--yel)',-34],[q3,'Q3','var(--blue)',-34]].forEach(([v,l,c],i)=>tx(s,X(v),Y-34+(i===1?-14:0),`${l} = ${fmt(v)}`,c,null,12));
  tx(s,X(wl),Y+34,`mín = ${fmt(wl)}`,'currentColor',null,11);tx(s,X(wh),Y+34,`máx = ${fmt(wh)}`,'currentColor',null,11);
  const t=el('div','t5-sol',d);el('div','',t,`Q1 = ${fmt(q1)} · Mediana = ${fmt(q2)} · Q3 = ${fmt(q3)} · RIC = Q3 − Q1 = ${fmt(iqr)}`);el('div','',t,out.length?`Valores atípicos (fuera de ${fmt(fl)} a ${fmt(fh)}): ${out.map(fmt).join(', ')}`:'No hay valores atípicos (regla de 1,5 × RIC)');
  cap(d,it);reveal(d);return 2200},

/* Partes de la circunferencia: radio, diámetro, cuerda, arco, tangente y sector */
circleparts(it){
  const hl=String(it.highlight||''),cx=190,cy=150,r=100,P=a=>[cx+r*Math.cos(rad(a)),cy-r*Math.sin(rad(a))],d=put('t-fig'),s=sv('svg',{viewBox:'0 0 400 300',class:'graph'},d);
  const dm=k=>hl&&hl!==k?'opacity:.28;':'',ln=(a,b,k,c,w,ds)=>sv('line',{x1:a[0],y1:a[1],x2:b[0],y2:b[1],style:`${dm(k)}stroke:${c};stroke-width:${w||3.5};${ds?'stroke-dasharray:6 4;':''}`},s),T=(x,y,t,k,c,an)=>{const e=tx(s,x,y,t,c,an,14);if(hl&&hl!==k)e.style.opacity='.35'};
  const [sa,sb]=[P(80),P(120)];sv('path',{d:`M${cx} ${cy}L${sa[0]} ${sa[1]}A${r} ${r} 0 0 0 ${sb[0]} ${sb[1]}Z`,style:`${dm('sector')}fill:rgba(255,158,199,.3);stroke:var(--pink);stroke-width:2`},s);
  sv('circle',{cx,cy,r,style:'fill:rgba(143,208,232,.08);stroke:var(--chalk);stroke-width:3.5'},s);
  ln(P(180),P(0),'diameter','var(--yel)');ln([cx,cy],P(30),'radius','var(--blue)');ln(P(200),P(250),'chord','var(--pink)');ln([cx-70,cy+r],[cx+70,cy+r],'tangent','var(--chalk)',3,true);
  const a1=P(285),a2=P(335);sv('path',{d:`M${a1[0]} ${a1[1]}A${r} ${r} 0 0 1 ${a2[0]} ${a2[1]}`,style:`${dm('arc')}fill:none;stroke:#8fe39a;stroke-width:7;stroke-linecap:round`},s);
  sv('circle',{cx,cy,r:4,style:'fill:var(--chalk)'},s);T(cx-4,cy-8,'O','center','currentColor','end');
  T(cx+r*.62,cy-r*.3-8,'radio','radius','var(--blue)');T(cx-r*.5,cy+18,'diámetro','diameter','var(--yel)');T(cx-r*.95,cy+r*.78,'cuerda','chord','var(--pink)','end');T(cx+r*.82,cy+r*.85,'arco','arc','#8fe39a','start');T(cx+78,cy+r+18,'tangente','tangent','currentColor','start');T(cx,cy-r*.55,'sector','sector','var(--pink)');
  const rv=+it.r,t=el('div','t5-sol',d);if(rv>0){el('div','',t,`d = 2r = ${fmt(2*rv)}${it.unit?' '+it.unit:''}`);el('div','',t,`Longitud C = 2πr ≈ ${fmt(2*Math.PI*rv)} · Área A = πr² ≈ ${fmt(Math.PI*rv*rv)}`)}else el('div','',t,'La tangente toca la circunferencia en un solo punto y es perpendicular al radio.');
  cap(d,it);reveal(d);return 2200},

/* Polígono regular: ángulo central e interior, suma de ángulos y diagonales */
regpoly(it){
  const n=Math.round(N(it.n,3,12,6)),NM=['','','','triángulo','cuadrilátero','pentágono','hexágono','heptágono','octógono','eneágono','decágono','undecágono','dodecágono'],cx=200,cy=150,R=105,V=[...Array(n)].map((_,i)=>{const a=-Math.PI/2+2*Math.PI*i/n;return [cx+R*Math.cos(a),cy+R*Math.sin(a)]});
  const d=put('t-fig'),s=sv('svg',{viewBox:'0 0 400 300',class:'graph'},d);
  if(it.diagonals)for(let i=0;i<n;i++)for(let j=i+2;j<n;j++){if(i===0&&j===n-1)continue;sv('line',{x1:V[i][0],y1:V[i][1],x2:V[j][0],y2:V[j][1],style:'stroke:currentColor;stroke-width:1.2;opacity:.45;stroke-dasharray:4 3'},s)}
  sv('polygon',{points:V.map(p=>p.join(',')).join(' '),style:'fill:rgba(143,208,232,.15);stroke:var(--blue);stroke-width:3.5;stroke-linejoin:round'},s);
  [V[0],V[1]].forEach(p=>sv('line',{x1:cx,y1:cy,x2:p[0],y2:p[1],style:'stroke:var(--pink);stroke-width:2.5'},s));sv('circle',{cx,cy,r:3.5,style:'fill:var(--chalk)'},s);
  const ca=-Math.PI/2,cb=ca+2*Math.PI/n,rr=30;sv('path',{d:`M${cx+rr*Math.cos(ca)} ${cy+rr*Math.sin(ca)}A${rr} ${rr} 0 0 1 ${cx+rr*Math.cos(cb)} ${cy+rr*Math.sin(cb)}`,style:'fill:none;stroke:var(--pink);stroke-width:3'},s);
  const cm=(ca+cb)/2;tx(s,cx+50*Math.cos(cm),cy+50*Math.sin(cm)+5,`${fmt(360/n)}°`,'var(--pink)',null,13);
  const un=(a,b)=>{const l=Math.hypot(b[0]-a[0],b[1]-a[1]);return [(b[0]-a[0])/l,(b[1]-a[1])/l]},u1=un(V[0],V[1]),u2=un(V[0],V[n-1]),ri=28;
  sv('path',{d:`M${V[0][0]+ri*u1[0]} ${V[0][1]+ri*u1[1]}A${ri} ${ri} 0 0 1 ${V[0][0]+ri*u2[0]} ${V[0][1]+ri*u2[1]}`,style:'fill:none;stroke:var(--yel);stroke-width:3'},s);
  const ui=un(V[0],[cx,cy]);tx(s,V[0][0]+52*ui[0],V[0][1]+52*ui[1]+4,`${fmt((n-2)*180/n)}°`,'var(--yel)',null,13);
  const t=el('div','t5-sol',d);el('div','',t,`${NM[n][0].toUpperCase()+NM[n].slice(1)} regular: ${n} lados y ${n} vértices`);el('div','',t,`Ángulo central = 360° / ${n} = ${fmt(360/n)}° · Ángulo interior = (${n} − 2)·180° / ${n} = ${fmt((n-2)*180/n)}°`);el('div','',t,`Suma de ángulos interiores = (${n} − 2)·180° = ${(n-2)*180}° · Diagonales = ${n}(${n} − 3)/2 = ${n*(n-3)/2}`);
  cap(d,it);reveal(d);return 2200}
};
const old=Board.draw;
Board.draw=function(it){const f=it&&Object.prototype.hasOwnProperty.call(E,it.t)&&E[it.t];if(f){try{return f(it)}catch(e){console.warn('teach9',e);return 600}}return old.call(Board,it)};
window.LumiTeach9={types:Object.keys(E)};
})();
