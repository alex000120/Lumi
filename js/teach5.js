/* Herramientas de enseñanza de Lumi · tanda 7: steps, solve, diagram, analogy, cause, pyramid, mnemonic, fix, proof, placevalue, passage, dialog, matrix, proscons.
   Son herramientas GENERALES para explicar cualquier tema. Todo el texto de la IA se inserta como texto (nunca HTML). */
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

const E={
/* Pasos numerados para resolver o explicar cualquier cosa (método, receta, procedimiento) */
steps(it){
  const L=arr(it.items).slice(0,10).map(x=>typeof x==='string'?{n:x}:{n:String((x&&x.n)||''),d:String((x&&x.d)||''),r:String((x&&x.r)||'')}).filter(x=>x.n||x.d);
  if(!L.length)return arr(it.lines).length?old.call(Board,it):500;   /* formato clásico (lines + notes con LaTeX): lo dibuja board.js */
  const d=put('t5-steps');if(it.title)rich(el('div','t5-h',d),it.title);
  L.forEach((x,i)=>{const r=el('div','t5-st',d);dl(r,i);el('div','t5-num',r,String(i+1));const b=el('div','t5-sb',r);
    if(x.n)rich(el('b','',b),x.n);if(x.d)rich(el('div','t5-sd',b),x.d);if(x.r)rich(el('div','t5-sr',b),'→ '+x.r)});
  cap(d,it);reveal(d);return L.length*400+800},

/* Problema resuelto: datos, incógnita, fórmula, sustitución, resultado, comprobación */
solve(it){
  const d=put('t5-solve');if(it.title)rich(el('div','t5-h',d),it.title);
  const row=(k,c,fn)=>{const r=el('div','t5-row',d);r.style.setProperty('--rc',c);el('span','t5-k',r,k);fn(el('div','t5-v',r));dl(r,rows++,.45)};let rows=0;
  const g=S(it.given,8);
  if(g.length)row('Datos','var(--blue)',v=>g.forEach(x=>rich(el('div','',v),mm(x))));
  if(it.find)row('Buscamos','var(--yel)',v=>rich(v,mm(it.find)));
  if(it.formula)row('Fórmula','var(--pink)',v=>rich(v,mm(it.formula)));
  if(it.sub)row('Sustituimos','var(--blue)',v=>rich(v,mm(it.sub)));
  if(it.result)row('Resultado','var(--yel)',v=>{v.classList.add('t5-res');rich(v,mm(it.result))});
  if(it.check)row('Comprobamos','var(--pink)',v=>rich(v,it.check));
  cap(d,it);reveal(d);return rows*450+800},

/* Diagrama libre: nodos con posición (0-100) y flechas entre ellos. Sirve para cualquier esquema */
diagram(it){
  const nodes=arr(it.nodes).slice(0,12).map((n,i)=>({id:String((n&&n.id)||i),label:String((n&&(n.label||n.id))||''),x:N(n&&n.x,6,94,50),y:N(n&&n.y,8,92,50),c:Math.abs(Math.round(N(n&&n.c,0,2,i%3))),shape:(n&&n.shape)||'box',emoji:String((n&&n.emoji)||'').slice(0,4)}));
  if(!nodes.length)return 500;
  const d=put('t-fig'),s=sv('svg',{viewBox:'0 0 400 300',class:'graph'},d),by={};
  const mk='dgm'+(++uid);
  const df=sv('defs',{},s),m=sv('marker',{id:mk,viewBox:'0 0 10 10',refX:9,refY:5,markerWidth:7,markerHeight:7,orient:'auto-start-reverse'},df);sv('path',{d:'M0 0L10 5L0 10z',fill:'currentColor'},m);
  nodes.forEach(n=>{n.px=n.x*4;n.py=n.y*3;n.lines=wrap(n.label,13);n.w=Math.max(70,Math.min(130,Math.max(...n.lines.map(l=>l.length))*8.5+22));n.h=n.lines.length*17+16+(n.emoji?22:0);if(n.shape==='diamond'){n.w+=36;n.h+=14}by[n.id]=n});
  arr(it.edges).slice(0,16).forEach((e,i)=>{const a=by[String(e&&e.from)],b=by[String(e&&e.to)];if(!a||!b||a===b)return;
    const dx=b.px-a.px,dy=b.py-a.py,cut=(n)=>{const t=Math.min((n.w/2+4)/(Math.abs(dx)||1e-6),(n.h/2+4)/(Math.abs(dy)||1e-6));return Math.min(t,.45)};
    const ta=cut(a),tb=cut(b),g=sv('g',{class:'t5-fade'},s);dl(g,nodes.length*.25+i*.3,1);
    sv('line',{x1:a.px+dx*ta,y1:a.py+dy*ta,x2:b.px-dx*tb,y2:b.py-dy*tb,style:'stroke:currentColor;stroke-width:2.2;opacity:.85','marker-end':`url(#${mk})`,...(e.both?{'marker-start':`url(#${mk})`}:{})},g);
    if(e.label)sv('text',{x:(a.px+b.px)/2,y:(a.py+b.py)/2-5,'text-anchor':'middle',style:'fill:var(--yel);font-size:12px;font-weight:700;paint-order:stroke;stroke:var(--board,#243b2f);stroke-width:4px'},g,clip(e.label,18))});
  nodes.forEach((n,i)=>{const g=sv('g',{class:'t5-fade'},s),col=C[n.c%3];dl(g,i*.25,1);
    if(n.shape==='diamond')sv('polygon',{points:`${n.px},${n.py-n.h/2} ${n.px+n.w/2},${n.py} ${n.px},${n.py+n.h/2} ${n.px-n.w/2},${n.py}`,style:`fill:rgba(255,255,255,.07);stroke:${col};stroke-width:2.5`},g);
    else if(n.shape==='circle'||n.shape==='oval')sv('ellipse',{cx:n.px,cy:n.py,rx:n.w/2,ry:n.h/2+4,style:`fill:rgba(255,255,255,.07);stroke:${col};stroke-width:2.5`},g);
    else sv('rect',{x:n.px-n.w/2,y:n.py-n.h/2,width:n.w,height:n.h,rx:n.shape==='pill'?n.h/2:9,style:`fill:rgba(255,255,255,.07);stroke:${col};stroke-width:2.5`},g);
    if(n.emoji)sv('text',{x:n.px,y:n.py-n.h/2+21,'text-anchor':'middle',style:'font-size:20px'},g,n.emoji);
    n.lines.forEach((l,k)=>sv('text',{x:n.px,y:n.py-(n.lines.length-1)*8.5+k*17+5+(n.emoji?11:0),'text-anchor':'middle',style:'fill:currentColor;font-size:14px;font-weight:600'},g,l))});
  cap(d,it);reveal(d);return nodes.length*250+1200},

/* Analogía: «X es como Y» con correspondencias parte por parte */
analogy(it){
  const P=arr(it.pairs).slice(0,8).map(p=>({a:String((p&&p.a)||''),b:String((p&&p.b)||'')})).filter(p=>p.a&&p.b);
  if(!P.length)return 500;
  const d=put('t5-ana'),h=el('div','t5-anah',d);rich(el('b','',h),it.a||'Idea');el('span','',h,' es como ');rich(el('b','',h),it.b||'algo cotidiano');
  P.forEach((p,i)=>{const r=el('div','t5-anar',d);dl(r,i,.4);rich(el('span','t5-a',r),p.a);el('span','t5-ar',r,'≈');rich(el('span','t5-b',r),p.b)});
  cap(d,it);reveal(d);return P.length*400+900},

/* Causas → hecho → consecuencias */
cause(it){
  const C1=S(it.causes,4),C2=S(it.effects,4);if(!C1.length&&!C2.length)return 500;
  const d=put('t5-cause'),g=el('div','t5-cg',d);
  const col=(t,a,cls)=>{const c=el('div','t5-cc '+cls,g);el('div','t5-ct',c,t);a.forEach((x,i)=>{const b=el('div','t5-cb',c);dl(b,i,.4);rich(b,x)})};
  if(C1.length){col('Causas',C1,'c1');el('div','t5-arr',g,'➜')}
  const m=el('div','t5-cc mid',g);rich(el('div','t5-cb ev',m),String(it.event||''));
  if(C2.length){el('div','t5-arr',g,'➜');col('Consecuencias',C2,'c2')}
  cap(d,it);reveal(d);return (C1.length+C2.length)*400+900},

/* Pirámide o jerarquía por niveles (la cima va primero) */
pyramid(it){
  const L=arr(it.levels).slice(0,7).map(x=>typeof x==='string'?{label:x}:{label:String((x&&x.label)||''),note:String((x&&x.note)||'')}).filter(x=>x.label);
  if(!L.length)return 500;
  const d=put('t5-pyr'),n=L.length;if(it.title)rich(el('div','t5-h',d),it.title);
  const w=el('div','t5-pw',d);
  L.forEach((x,i)=>{const a=50-50*(i+.0001)/n,b=50-50*(i+1)/n,r=el('div','t5-pl',w);r.style.clipPath=`polygon(${a}% 0,${100-a}% 0,${100-b}% 100%,${b}% 100%)`;r.style.setProperty('--pc',C[i%3]);dl(r,(n-1-i),.4);
    rich(el('b','',r),clip(x.label,24));if(x.note)rich(el('small','',r),clip(x.note,30))});
  cap(d,it);reveal(d);return n*400+800},

/* Regla mnemotécnica: cada letra de la palabra recuerda una idea */
mnemonic(it){
  const L=arr(it.letters).slice(0,12).map(x=>({l:String((x&&x.l)||'').slice(0,3),w:String((x&&x.w)||'')})).filter(x=>x.l);
  if(!L.length)return 500;
  const d=put('t5-mn');if(it.word)rich(el('div','t5-h',d),it.word);
  L.forEach((x,i)=>{const r=el('div','t5-mr',d);dl(r,i,.4);el('span','t5-ml',r,x.l);rich(el('span','t5-mw',r),x.w)});
  cap(d,it);reveal(d);return L.length*400+800},

/* Errores comunes: ✗ mal → ✓ bien, con el porqué */
fix(it){
  const L=arr(it.items).slice(0,4).map(x=>({wrong:String((x&&x.wrong)||''),right:String((x&&x.right)||''),why:String((x&&x.why)||'')})).filter(x=>x.wrong||x.right);
  if(!L.length)return 500;
  const d=put('t5-fix');if(it.title)rich(el('div','t5-h',d),it.title);
  L.forEach((x,i)=>{const b=el('div','t5-fb',d);dl(b,i,.8);
    if(x.wrong){const w=el('div','t5-fw',b);el('span','',w,'✗');rich(el('div','',w),x.wrong)}
    if(x.right){const r=el('div','t5-fr',b);el('span','',r,'✓');rich(el('div','',r),x.right)}
    if(x.why)rich(el('div','t5-fy',b),x.why)});
  cap(d,it);reveal(d);return L.length*800+800},

/* Demostración en dos columnas: afirmación y razón */
proof(it){
  const L=arr(it.rows).slice(0,10).map(x=>({s:String((x&&x.s)||''),r:String((x&&x.r)||'')})).filter(x=>x.s);
  if(!L.length)return 500;
  const d=put('t5-proof');if(it.title)rich(el('div','t5-h',d),it.title);
  const t=el('table','t5-pt',d),hd=el('tr','',el('thead','',t));el('th','',hd,'#');el('th','',hd,'Afirmación');el('th','',hd,'Razón');const tb=el('tbody','',t);
  L.forEach((x,i)=>{const r=el('tr','t5-fade',tb);dl(r,i,.5);el('td','',r,String(i+1));rich(el('td','',r),mm(x.s));rich(el('td','',r),x.r)});
  cap(d,it);reveal(d);return L.length*500+800},

/* Valor posicional: unidades, decenas, centenas… y forma desarrollada */
placevalue(it){
  const raw=String(it.number==null?'':it.number).replace(/[^\d.,]/g,'').replace(',','.'),pp=raw.split('.'),ip=(pp[0]||'0').replace(/^0+(?=\d)/,'').slice(0,9),fp=(pp[1]||'').slice(0,3);
  if(!ip)return 500;
  const nm=['U','D','C','UM','DM','CM','UMM','DMM','CMM'],fn=['d','c','m'],full={U:'unidades',D:'decenas',C:'centenas',UM:'unidades de mil',DM:'decenas de mil',CM:'centenas de mil',UMM:'unid. de millón',DMM:'dec. de millón',CMM:'cent. de millón',d:'décimas',c:'centésimas',m:'milésimas'};
  const d=put('t5-pv'),tb=el('table','t5-pvt',d),h=el('tr','',tb),b=el('tr','',tb),e=el('tr','',tb);const parts=[];
  [...ip].forEach((c,i)=>{const k=nm[ip.length-1-i],th=el('th','',h,k);th.title=full[k];el('td','',b,c);el('td','t5-pvn',e,full[k]);if(c!=='0')parts.push(c+'×'+Math.pow(10,ip.length-1-i).toLocaleString('es'))});
  [...fp].forEach((c,i)=>{const k=fn[i];el('th','t5-pvd',h,k);el('td','t5-pvd',b,c);el('td','t5-pvn',e,full[k]);if(c!=='0')parts.push(c+'×1/'+Math.pow(10,i+1))});
  if(parts.length)el('div','t5-pvx',d,ip+(fp?','+fp:'')+' = '+parts.join(' + '));
  cap(d,it);reveal(d);return 1800},

/* Texto con frases marcadas y explicadas (lectura, literatura, análisis de fuentes) */
passage(it){
  const text=String(it.text||'').slice(0,900);if(!text)return 500;
  const M=[];arr(it.marks).slice(0,6).forEach(m=>{const q=String((m&&m.q)||''),i=q?text.indexOf(q):-1;if(i>=0)M.push({i,e:i+q.length,note:String((m&&m.note)||'')})});
  M.sort((a,b)=>a.i-b.i);const ok=[];M.forEach(m=>{if(!ok.length||m.i>=ok[ok.length-1].e)ok.push(m)});
  const d=put('t5-pass'),p=el('div','t5-pt2',d);let pos=0;
  ok.forEach((m,k)=>{if(m.i>pos)p.appendChild(document.createTextNode(text.slice(pos,m.i)));const mk=el('mark','',p,text.slice(m.i,m.e));mk.style.setProperty('--mc',C[k%3]);const sp=el('sup','',mk,String(k+1));pos=m.e});
  if(pos<text.length)p.appendChild(document.createTextNode(text.slice(pos)));
  ok.forEach((m,k)=>{if(!m.note)return;const r=el('div','t5-pn',d);r.style.setProperty('--mc',C[k%3]);dl(r,k,.5);el('b','',r,(k+1)+'. ');rich(el('span','',r),m.note)});
  cap(d,it);reveal(d);return ok.length*500+1000},

/* Diálogo para idiomas: burbujas con traducción y audio */
dialog(it){
  const L=arr(it.lines).slice(0,8).map(x=>({who:String((x&&x.who)||''),text:String((x&&x.text)||''),tr:String((x&&x.tr)||'')})).filter(x=>x.text);
  if(!L.length)return 500;
  const lang=String(it.lang||'en-US').slice(0,10),d=put('t5-dlg'),names=[];
  L.forEach((x,i)=>{let k=names.indexOf(x.who);if(k<0){names.push(x.who);k=names.length-1}
    const r=el('div','t5-bub '+(k%2?'r':'l'),d);dl(r,i,.6);if(x.who)el('small','',r,x.who);const t=el('div','',r);rich(t,x.text);
    const bt=el('button','t5-spk',t,'🔊');bt.type='button';bt.setAttribute('aria-label','Escuchar');bt.onclick=()=>{try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(x.text.replace(/[$*]/g,''));u.lang=lang;speechSynthesis.speak(u)}catch(e){}};
    if(x.tr)rich(el('em','',r),x.tr)});
  cap(d,it);reveal(d);return L.length*600+800},

/* Matrices con operaciones entre ellas y celdas resaltadas */
matrix(it){
  const L=arr(it.items).slice(0,7);if(!L.length)return 500;
  const d=put('t5-mx'),row=el('div','t5-mxr',d);
  L.forEach((x,i)=>{if(!x||typeof x!=='object')return;
    if(x.op){el('div','t5-mop',row,String(x.op).slice(0,3));return}
    const M=arr(x.m).slice(0,5).map(r=>arr(r).slice(0,6));if(!M.length)return;
    const w=el('div','t5-mw',row);if(x.name)el('div','t5-mxn',w,String(x.name).slice(0,6));
    const g=el('div','t5-mg',w),cols=Math.max(...M.map(r=>r.length));g.style.gridTemplateColumns=`repeat(${cols},auto)`;
    const hl=arr(x.hl).map(p=>arr(p).join(','));
    M.forEach((r,ri)=>{for(let c=0;c<cols;c++){const cell=el('span','',g);rich(cell,mm(r[c]==null?'':r[c]));if(hl.includes(ri+','+c))cell.className='hl'}})});
  cap(d,it);reveal(d);return 1500},

/* Pros y contras (decisiones, debates, comparar opciones) */
proscons(it){
  const P=S(it.pros,5),Q=S(it.cons,5);if(!P.length&&!Q.length)return 500;
  const d=put('t5-pc');if(it.title)rich(el('div','t5-h',d),it.title);
  const g=el('div','t5-pcg',d);
  [['A favor ✓',P,'pro'],['En contra ✗',Q,'con']].forEach(([t,a,c])=>{const b=el('div','t5-pcb '+c,g);el('b','',b,t);a.forEach((x,i)=>{const r=el('div','',b);dl(r,i,.4);rich(r,x)})});
  if(it.verdict)rich(el('div','t5-pv2',d),it.verdict);
  cap(d,it);reveal(d);return (P.length+Q.length)*400+900}
};
const old=Board.draw;
Board.draw=function(it){const f=it&&Object.prototype.hasOwnProperty.call(E,it.t)&&E[it.t];if(f){try{return f(it)}catch(e){console.warn('teach5',e);return 600}}return old.call(Board,it)};
window.LumiTeach5={types:Object.keys(E)};
})();
