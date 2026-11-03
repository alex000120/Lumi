/* Herramientas de enseñanza de Lumi · tanda 10 (DIBUJO): scene, solid, cycle, breakdown, barmodel, objects, tilegrid, comic, jumps.
   Pensadas para dibujar y diseñar en la pizarra. Todo el texto de la IA se inserta como texto (nunca HTML). */
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

const E={
/* LIENZO LIBRE 100 × 75: formas, curvas suaves, flechas, textos y emojis que aparecen en orden */
scene(it){
  const sh=arr(it.shapes).slice(0,70).filter(o=>o&&typeof o==='object');if(!sh.length)return 500;
  const d=put('t-fig'),s=sv('svg',{viewBox:'0 0 100 75',class:'graph',style:'max-width:560px;overflow:visible'},d),df=sv('defs',{},s),mk={};
  if(it.bg){sv('rect',{x:0,y:0,width:100,height:75,rx:2,style:`fill:${col(it.bg)||'none'};fill-opacity:.18`},s)}
  if(it.grid){for(let i=10;i<100;i+=10)sv('line',{x1:i,y1:0,x2:i,y2:75,style:'stroke:currentColor;stroke-width:.15;opacity:.3'},s);for(let j=10;j<75;j+=10)sv('line',{x1:0,y1:j,x2:100,y2:j,style:'stroke:currentColor;stroke-width:.15;opacity:.3'},s)}
  const head=c=>{const k=c||'x';if(!mk[k]){const id='sc'+(++mid),m=sv('marker',{id,viewBox:'0 0 10 10',refX:8,refY:5,markerWidth:5,markerHeight:5,orient:'auto'},df);sv('path',{d:'M0 0L10 5L0 10z',style:`fill:${c||'var(--chalk)'}`},m);mk[k]=id}return mk[k]};
  const smooth=(p,closed)=>{if(p.length<2)return '';let q=p.slice();if(closed){q=[p[p.length-1],...p,p[0],p[1]]}else q=[p[0],...p,p[p.length-1]];
    let dd=`M${q[1][0]} ${q[1][1]}`;for(let i=1;i<q.length-2;i++){const a=q[i-1],b=q[i],c=q[i+1],e=q[i+2];dd+=`C${b[0]+(c[0]-a[0])/6} ${b[1]+(c[1]-a[1])/6} ${c[0]-(e[0]-b[0])/6} ${c[1]-(e[1]-b[1])/6} ${c[0]} ${c[1]}`}return dd+(closed?'Z':'')};
  const step=Math.min(.22,7/sh.length);
  sh.forEach((o,i)=>{const k=String(o.k||''),x=num(o.x,-30,130,50),y=num(o.y,-30,105,37),st=stl(o);let e=null,draw=!o.dash&&o.fill==null;
    if(k==='rect')e=sv('rect',{x,y,width:num(o.w,.5,140,20),height:num(o.h,.5,110,12),rx:num(o.r,0,30,0),style:st},s);
    else if(k==='circle')e=sv('circle',{cx:x,cy:y,r:num(o.r,.3,70,8),style:st},s);
    else if(k==='ellipse'){e=sv('ellipse',{cx:x,cy:y,rx:num(o.rx,.3,70,12),ry:num(o.ry,.3,70,6),style:st},s);if(o.rot)e.setAttribute('transform',`rotate(${num(o.rot,-360,360,0)} ${x} ${y})`)}
    else if(k==='line'||k==='arrow'){e=sv('line',{x1:num(o.x1,-30,130,0),y1:num(o.y1,-30,105,0),x2:num(o.x2,-30,130,10),y2:num(o.y2,-30,105,10),style:st},s);
      if(k==='arrow'){e.setAttribute('marker-end',`url(#${head(col(o.c))})`);draw=false}if(o.both){e.setAttribute('marker-start',`url(#${head(col(o.c))})`)}}
    else if(k==='curve'||k==='poly'){const p=P2(o.pts);if(p.length<2)return;
      if(k==='curve')e=sv('path',{d:smooth(p,!!o.close),style:st},s);else e=sv(o.close?'polygon':'polyline',{points:p.map(q=>q.join(',')).join(' '),style:st},s);
      if(o.arrow){e.setAttribute('marker-end',`url(#${head(col(o.c))})`);draw=false}}
    else if(k==='arc'){const r=num(o.r,.5,70,8),a1=num(o.a1,-720,720,0),a2=num(o.a2,-720,720,90),pt=a=>[x+r*Math.cos(a*Math.PI/180),y-r*Math.sin(a*Math.PI/180)],p1=pt(a1),p2=pt(a2);
      e=sv('path',{d:`M${p1[0]} ${p1[1]}A${r} ${r} 0 ${Math.abs(a2-a1)%360>180?1:0} ${a2>a1?0:1} ${p2[0]} ${p2[1]}`,style:st},s)}
    else if(k==='text'){const z=num(o.size,2,16,4.2);e=sv('text',{x,y,'text-anchor':o.a==='start'||o.a==='end'?o.a:'middle',style:`fill:${col(o.c)||'var(--chalk)'};font-size:${z}px;font-weight:700;paint-order:stroke;stroke:var(--board,#243b2f);stroke-width:${z*.22}px;stroke-linejoin:round`},s,clip(o.s,40));draw=false}
    else if(k==='emoji'){const z=num(o.size,2,40,9);e=sv('text',{x,y:y+z*.34,'text-anchor':'middle',style:`font-size:${z}px`},s,String(o.s||'').slice(0,6));draw=false}
    if(!e)return;
    if(o.op!=null)e.style.opacity=String(num(o.op,0,1,1));
    if(draw){e.setAttribute('pathLength','1');e.classList.add('t5-draw')}else e.classList.add('t5-sf');
    e.style.animationDelay=(i*step)+'s'});
  cap(d,it);reveal(d);return Math.round(sh.length*step*1000+900)},

/* Cuerpo geométrico con medidas, volumen y área */
solid(it){
  const kind=['cube','prism','cylinder','cone','pyramid','sphere'].includes(it.kind)?it.kind:'prism',u=String(it.unit||'').slice(0,4),
    a=N(it.a,.1,1000,kind==='cube'?3:4),h=N(it.h,.1,1000,kind==='cube'?a:5),b=kind==='cube'?a:N(it.b,.1,1000,3),r=N(it.r,.1,1000,3);
  const d=put('t-fig'),s=sv('svg',{viewBox:'0 0 400 270',class:'graph'},d),LN='fill:none;stroke:var(--blue);stroke-width:3;stroke-linejoin:round',HD='fill:none;stroke:var(--blue);stroke-width:2;stroke-dasharray:6 5;opacity:.8',FL='rgba(143,208,232,.14)';
  const ln=(x1,y1,x2,y2,st)=>sv('line',{x1,y1,x2,y2,style:st||LN},s),lab=(x,y,t,an)=>tx(s,x,y,t,'var(--yel)',an,15);
  let V=0,A=0,fv='',fa='';const f2=fmt;
  if(kind==='cube'||kind==='prism'){
    const k=Math.min(170/a,120/h,130/b),W=a*k,H=h*k,dx=b*k*.5,dy=b*k*.4,x0=60,y0=235,xr=x0+W,yt=y0-H;
    sv('polygon',{points:`${x0},${yt} ${xr},${yt} ${xr+dx},${yt-dy} ${x0+dx},${yt-dy}`,style:`fill:${FL};${LN}`},s);
    sv('polygon',{points:`${xr},${y0} ${xr+dx},${y0-dy} ${xr+dx},${yt-dy} ${xr},${yt}`,style:`fill:rgba(255,255,255,.07);${LN}`},s);
    sv('rect',{x:x0,y:yt,width:W,height:H,style:`fill:${FL};${LN}`},s);
    ln(x0,y0,x0+dx,y0-dy,HD);ln(x0+dx,y0-dy,xr+dx,y0-dy,HD);ln(x0+dx,y0-dy,x0+dx,yt-dy,HD);
    lab(x0+W/2,y0+20,`${f2(a)}${u}`);lab(x0-8,y0-H/2+5,`${f2(h)}${u}`,'end');lab(xr+dx/2+12,y0-dy/2+16,`${f2(b)}${u}`,'start');
    V=a*b*h;A=2*(a*b+a*h+b*h);fv=kind==='cube'?`V = a³ = ${f2(a)}³`:`V = a·b·h = ${f2(a)}·${f2(b)}·${f2(h)}`;fa=kind==='cube'?`A = 6a² = 6·${f2(a)}²`:`A = 2(ab + ah + bh)`}
  else if(kind==='cylinder'||kind==='cone'){
    const k=Math.min(100/r,150/h),rx=r*k,ry=Math.max(10,rx*.32),H=h*k,cx=200,yb=225-ry,yt=yb-H;
    if(kind==='cylinder'){sv('path',{d:`M${cx-rx} ${yt}V${yb}A${rx} ${ry} 0 0 0 ${cx+rx} ${yb}V${yt}`,style:`fill:${FL};${LN}`},s);sv('ellipse',{cx,cy:yt,rx,ry,style:`fill:rgba(255,255,255,.1);${LN}`},s);
      sv('path',{d:`M${cx-rx} ${yb}A${rx} ${ry} 0 0 1 ${cx+rx} ${yb}`,style:HD},s);ln(cx,yt,cx+rx,yt,'stroke:var(--yel);stroke-width:2.5');lab(cx+rx/2,yt-ry-6,`r = ${f2(r)}${u}`);lab(cx+rx+12,(yt+yb)/2,`h = ${f2(h)}${u}`,'start');
      V=Math.PI*r*r*h;A=2*Math.PI*r*(r+h);fv=`V = π·r²·h = π·${f2(r)}²·${f2(h)}`;fa=`A = 2πr(r + h)`}
    else{const ap=yt;sv('path',{d:`M${cx-rx} ${yb}L${cx} ${ap}L${cx+rx} ${yb}A${rx} ${ry} 0 0 1 ${cx-rx} ${yb}Z`,style:`fill:${FL};${LN}`},s);
      sv('path',{d:`M${cx-rx} ${yb}A${rx} ${ry} 0 0 0 ${cx+rx} ${yb}`,style:HD},s);ln(cx,ap,cx,yb,'stroke:var(--yel);stroke-width:2.5;stroke-dasharray:6 4');ln(cx,yb,cx+rx,yb,'stroke:var(--yel);stroke-width:2.5');
      lab(cx+rx/2,yb+ry+18,`r = ${f2(r)}${u}`);lab(cx-6,(ap+yb)/2,`h = ${f2(h)}${u}`,'end');const g=Math.hypot(r,h);
      V=Math.PI*r*r*h/3;A=Math.PI*r*(r+g);fv=`V = π·r²·h / 3 = π·${f2(r)}²·${f2(h)} / 3`;fa=`A = πr(r + g), g = ${f2(g)}`}}
  else if(kind==='pyramid'){
    const k=Math.min(150/a,140/h),W=a*k,H=h*k,dx=W*.5,dy=W*.32,x0=60,yb=235,ap=[x0+(W+dx)/2,yb-dy/2-H];
    sv('polygon',{points:`${x0},${yb} ${x0+W},${yb} ${x0+W+dx},${yb-dy} ${x0+dx},${yb-dy}`,style:`fill:${FL};stroke:none`},s);
    [[x0,yb],[x0+W,yb],[x0+W+dx,yb-dy]].forEach(p=>ln(p[0],p[1],ap[0],ap[1]));ln(x0+dx,yb-dy,ap[0],ap[1],HD);
    ln(x0,yb,x0+W,yb);ln(x0+W,yb,x0+W+dx,yb-dy);ln(x0,yb,x0+dx,yb-dy,HD);ln(x0+dx,yb-dy,x0+W+dx,yb-dy,HD);
    ln(ap[0],ap[1],ap[0],yb-dy/2,'stroke:var(--yel);stroke-width:2.5;stroke-dasharray:6 4');lab(x0+W/2,yb+20,`a = ${f2(a)}${u}`);lab(ap[0]-6,ap[1]+H/2,`h = ${f2(h)}${u}`,'end');
    const sl=Math.hypot(h,a/2);V=a*a*h/3;A=a*a+2*a*sl;fv=`V = a²·h / 3 = ${f2(a)}²·${f2(h)} / 3`;fa=`A = a² + 2a·l, l = ${f2(sl)} (base cuadrada)`}
  else{const k=100/r,R=r*k,cx=200,cy=135;sv('circle',{cx,cy,r:R,style:`fill:${FL};${LN}`},s);sv('path',{d:`M${cx-R} ${cy}A${R} ${R*.3} 0 0 0 ${cx+R} ${cy}`,style:LN},s);sv('path',{d:`M${cx-R} ${cy}A${R} ${R*.3} 0 0 1 ${cx+R} ${cy}`,style:HD},s);
    ln(cx,cy,cx+R,cy,'stroke:var(--yel);stroke-width:2.5');lab(cx+R/2,cy-8,`r = ${f2(r)}${u}`);V=4/3*Math.PI*r**3;A=4*Math.PI*r*r;fv=`V = 4/3·π·r³ = 4/3·π·${f2(r)}³`;fa=`A = 4πr² = 4·π·${f2(r)}²`}
  const t=el('div','t5-sol',d);if(it.show!=='area')el('div','',t,`${fv} ≈ ${f2(V)} ${u?u+'³':'u³'}`);if(it.show!=='volume')el('div','',t,`${fa} ≈ ${f2(A)} ${u?u+'²':'u²'}`);
  cap(d,it);reveal(d);return 2000},

/* Ciclo circular de etapas (agua, carbono, célula, estaciones, proceso que se repite) */
cycle(it){
  const St=arr(it.stages).slice(0,8).map(x=>typeof x==='string'?{t:x}:{t:String((x&&x.t)||''),e:String((x&&x.e)||'').slice(0,4)}).filter(x=>x.t);if(St.length<2)return 500;
  const n=St.length,d=put('t-fig'),s=sv('svg',{viewBox:'0 0 400 300',class:'graph'},d),df=sv('defs',{},s),id='cy'+(++mid),m=sv('marker',{id,viewBox:'0 0 10 10',refX:8,refY:5,markerWidth:7,markerHeight:7,orient:'auto'},df);sv('path',{d:'M0 0L10 5L0 10z',style:'fill:var(--yel)'},m);
  const Rx=n>6?150:135,Ry=n>4?100:95,cx=200,cy=150,sp=2*Math.PI/n,dl2=Math.min(.45,sp*.36),w=n>6?84:98,P=a=>[cx+Rx*Math.cos(a),cy+Ry*Math.sin(a)];
  St.forEach((x,i)=>{const a0=-Math.PI/2+i*sp+dl2,a1=-Math.PI/2+(i+1)*sp-dl2;if(a1-a0<.12)return;const p=P(a0),q=P(a1),g=sv('path',{d:`M${p[0]} ${p[1]}A${Rx} ${Ry} 0 0 1 ${q[0]} ${q[1]}`,style:'fill:none;stroke:var(--yel);stroke-width:3;stroke-linecap:round','marker-end':`url(#${id})`,class:'t5-sf'},s);g.style.animationDelay=(i*.5+.25)+'s'});
  St.forEach((x,i)=>{const p=P(-Math.PI/2+i*sp),L=wrap(x.t,n>6?11:13).slice(0,2),h=L.length*16+10+(x.e?22:0),g=sv('g',{class:'t5-sf'},s);g.style.animationDelay=(i*.5)+'s';
    sv('rect',{x:p[0]-w/2,y:p[1]-h/2,width:w,height:h,rx:12,style:`fill:rgba(255,255,255,.08);stroke:${C[i%3]};stroke-width:2.5`},g);
    if(x.e)sv('text',{x:p[0],y:p[1]-h/2+22,'text-anchor':'middle',style:'font-size:19px'},g,x.e);
    L.forEach((l,k)=>sv('text',{x:p[0],y:p[1]-h/2+(x.e?36:19)+k*16,'text-anchor':'middle',style:'fill:currentColor;font-size:13px;font-weight:700'},g,l))});
  if(it.center)wrap(String(it.center),14).slice(0,2).forEach((l,k,A)=>tx(s,cx,cy+k*18-(A.length-1)*9+5,l,'var(--pink)',null,16));
  cap(d,it);reveal(d);return n*500+1000},

/* Una expresión partida en piezas con llave de color y etiqueta debajo */
breakdown(it){
  const P=arr(it.parts).slice(0,6).map(x=>({t:String((x&&x.t)||''),m:String((x&&x.m)||''),c:x&&x.c})).filter(x=>x.t);if(!P.length)return 500;
  const d=put('t5-bd');if(it.title)rich(el('div','t5-h',d),it.title);const row=el('div','t5-bdr',d);
  P.forEach((p,i)=>{const c=el('div','t5-bdc',row);c.style.setProperty('--bc',col(p.c!=null?p.c:i%3));dl(c,i,.5);rich(el('div','t5-bdt',c),mm(p.t));el('div','t5-bdb',c);if(p.m)rich(el('div','t5-bdm',c),p.m)});
  if(it.result)rich(el('div','t-note t5-c',d),mm(it.result));cap(d,it);reveal(d);return P.length*500+900},

/* Modelo de barras (problemas con palabras, fracciones, comparar cantidades) */
barmodel(it){
  const B=arr(it.bars).slice(0,5).map(b=>{b=b||{};let sg=arr(b.segs).slice(0,10).map(g=>({v:N(g&&g.v,.1,1000,1),t:String((g&&g.t)==null?'':g.t),c:g&&g.c}));
    if(!sg.length&&b.parts){const n=Math.round(N(b.parts,1,12,4)),k=Math.round(N(b.shade,0,12,0));sg=Array.from({length:n},(_,i)=>({v:1,t:'',c:i<k?1:null,sh:i<k}))}
    return {label:String(b.label||''),total:b.total==null?'':String(b.total),sg}}).filter(b=>b.sg.length);
  if(!B.length)return 500;
  const mx=Math.max(...B.map(b=>b.sg.reduce((a,g)=>a+g.v,0))),d=put('t5-bm');if(it.title)rich(el('div','t5-h',d),it.title);
  B.forEach((b,i)=>{const r=el('div','t5-bmr',d);dl(r,i,.6);if(b.label)rich(el('span','t5-bml',r),b.label);const bar=el('div','t5-bmb',r),W=b.sg.reduce((a,g)=>a+g.v,0)/mx*100;bar.style.width=W.toFixed(1)+'%';
    b.sg.forEach((g,k)=>{const sg=el('div','t5-bms'+(g.sh?' sh':''),bar);sg.style.flex=g.v+' 1 0';sg.style.setProperty('--bc',col(g.c!=null?g.c:(k%2?'yel':'blue')));if(g.t)rich(sg,g.t)});
    if(b.total)rich(el('span','t5-bmt',r),'= '+b.total)});
  cap(d,it);reveal(d);return B.length*600+900},

/* Objetos para contar, agrupar, repartir o quitar */
objects(it){
  const em=String(it.emoji||'🍎').slice(0,4),G=arr(it.groups).slice(0,8).map(v=>Math.round(N(v,0,20,0)));if(!G.length)return 500;
  let tot=G.reduce((a,b)=>a+b,0);if(tot>80||tot<1)return 500;
  const d=put('t5-ob'),row=el('div','t5-obr',d);let cr=Math.round(N(it.cross,0,tot,0)),n=0;
  const idx=G.map(g=>g);let left=cr;const xs=G.map(()=>0);for(let i=G.length-1;i>=0&&left>0;i--){xs[i]=Math.min(G[i],left);left-=xs[i]}
  G.forEach((g,gi)=>{const b=el('div','t5-obg',row);for(let k=0;k<g;k++){const sp=el('span',k>=g-xs[gi]?'x':'',b,em);sp.style.animationDelay=(n++*.07)+'s'}});
  const eq=G.every(v=>v===G[0]);let t=G.length>1?(eq?`${G.length} grupos de ${G[0]} = ${tot}`:G.join(' + ')+' = '+tot):`${tot}`;if(cr)t+=` − ${cr} = ${tot-cr}`;
  el('div','t-note t5-c',d,t);cap(d,it);reveal(d);return tot*70+1000},

/* Cuadrícula de casillas con colores o emojis (mapas, tableros, planos, pixel art, coordenadas) */
tilegrid(it){
  const R=arr(it.rows).slice(0,12).map(r=>[...String(r)].slice(0,14));if(!R.length)return 500;
  const cols=Math.max(...R.map(r=>r.length)),lg=it.legend&&typeof it.legend==='object'?it.legend:{},sz=Math.max(22,Math.min(46,Math.floor(340/(cols+(it.coords?1:0)))));
  const d=put('t5-tg'),g=el('div','t5-tgg',d);g.style.gridTemplateColumns=`repeat(${cols+(it.coords?1:0)},${sz}px)`;g.style.fontSize=(sz*.62)+'px';
  if(it.coords){el('span','t5-tgh',g);for(let c=0;c<cols;c++)el('span','t5-tgh',g,String.fromCharCode(65+c))}
  R.forEach((r,ri)=>{if(it.coords)el('span','t5-tgh',g,String(ri+1));for(let c=0;c<cols;c++){const ch=r[c]||'.',e=lg[ch],cell=el('span','t5-tgc',g);cell.style.height=sz+'px';
    if(e&&typeof e==='object'){if(e.c)cell.style.background=col(e.c);if(e.e)cell.textContent=String(e.e).slice(0,4)}else if(ch!=='.'&&ch!==' ')cell.textContent=ch;if(ch==='.'||ch===' ')cell.classList.add('em')}});
  const L=Object.keys(lg).slice(0,8);if(L.length){const l=el('div','t5-tgl',d);L.forEach(k=>{const e=lg[k]||{},c=el('span','',l);const sw=el('i','',c,e.e?String(e.e).slice(0,4):'');if(e.c)sw.style.background=col(e.c);c.appendChild(document.createTextNode(' '+String(e.t||k)))})}
  cap(d,it);reveal(d);return 1600},

/* Historieta de paneles con emojis y globos de diálogo */
comic(it){
  const P=arr(it.panels).slice(0,6).map(p=>({e:String((p&&p.e)||'').slice(0,16),t:String((p&&p.t)||''),say:String((p&&p.say)||'')})).filter(p=>p.e||p.t);if(!P.length)return 500;
  const d=put('t5-cm'),g=el('div','t5-cmg',d);
  P.forEach((p,i)=>{const c=el('div','t5-cmp',g);dl(c,i,.7);el('div','t5-cme',c,p.e);if(p.say)rich(el('div','t5-cmb',c),p.say);if(p.t)rich(el('div','t5-cmt',c),p.t)});
  cap(d,it);reveal(d);return P.length*700+1000},

/* Saltos en la recta numérica (suma y resta) */
jumps(it){
  const st=N(it.start,-1000,1000,0),J=arr(it.jumps).slice(0,6).map(Number).filter(v=>isFinite(v)&&v!==0);if(!J.length)return 500;
  const pos=[st];J.forEach(j=>pos.push(pos[pos.length-1]+j));
  let lo=Math.floor(Math.min(...pos))-1,hi=Math.ceil(Math.max(...pos))+1;if(it.min!=null)lo=Math.min(lo,Math.floor(+it.min));if(it.max!=null)hi=Math.max(hi,Math.ceil(+it.max));if(hi-lo>60)return 500;
  const d=put('t-fig'),s=sv('svg',{viewBox:'0 0 400 190',class:'graph'},d),df=sv('defs',{},s),id='jm'+(++mid),m=sv('marker',{id,viewBox:'0 0 10 10',refX:8,refY:5,markerWidth:6,markerHeight:6,orient:'auto'},df);sv('path',{d:'M0 0L10 5L0 10z',style:'fill:currentColor'},m);
  const X=v=>20+360*(v-lo)/(hi-lo),Y=120,sk=Math.ceil((hi-lo)/20);
  sv('line',{x1:14,y1:Y,x2:386,y2:Y,style:'stroke:currentColor;stroke-width:2.5'},s);
  for(let v=lo;v<=hi;v++){sv('line',{x1:X(v),y1:Y-5,x2:X(v),y2:Y+5,style:'stroke:currentColor;stroke-width:1.5'},s);if(v%sk===0||pos.includes(v))tx(s,X(v),Y+24,fmt(v),'currentColor',null,14)}
  J.forEach((j,i)=>{const a=X(pos[i]),b=X(pos[i+1]),pk=Math.min(60,16+Math.abs(b-a)*.3),c=j>0?'var(--yel)':'var(--pink)',p=sv('path',{d:`M${a} ${Y-4}Q${(a+b)/2} ${Y-4-2*pk} ${b} ${Y-4}`,style:`fill:none;stroke:${c};stroke-width:3;color:${c}`,'marker-end':`url(#${id})`,class:'t5-sf'},s);p.style.animationDelay=(i*.6)+'s';
    const g=tx(s,(a+b)/2,Y-4-pk-5,(j>0?'+':'−')+fmt(Math.abs(j)),c,null,16);g.classList.add('t5-sf');g.style.animationDelay=(i*.6+.2)+'s'});
  sv('circle',{cx:X(st),cy:Y,r:6,style:'fill:var(--blue)'},s);sv('circle',{cx:X(pos[pos.length-1]),cy:Y,r:7,style:'fill:var(--yel);stroke:var(--chalk);stroke-width:2'},s);
  el('div','t-note t5-c',d,fmt(st)+J.map(j=>(j>0?' + ':' − ')+fmt(Math.abs(j))).join('')+' = '+fmt(pos[pos.length-1]));
  cap(d,it);reveal(d);return J.length*600+1200}
};
const old=Board.draw;
Board.draw=function(it){const f=it&&Object.prototype.hasOwnProperty.call(E,it.t)&&E[it.t];if(f){try{return f(it)}catch(e){console.warn('teach8',e);return 600}}return old.call(Board,it)};
window.LumiTeach8={types:Object.keys(E)};
})();
