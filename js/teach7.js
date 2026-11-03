/* Herramientas de enseñanza de Lumi · tanda 9: scatter, rtri, conjugate, pattern, layers, areamodel, atom, ratio.
   Todo el texto de la IA se inserta como texto (nunca HTML). */
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

const E={
/* Dispersión con recta de tendencia y correlación */
scatter(it){
  const P=arr(it.points).slice(0,30).map(p=>[+arr(p)[0],+arr(p)[1]]).filter(p=>isFinite(p[0])&&isFinite(p[1]));
  if(P.length<2)return 500;
  const xs=P.map(p=>p[0]),ys=P.map(p=>p[1]),x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys);
  const d=put('t-fig'),s=sv('svg',{viewBox:'0 0 400 290',class:'graph'},d),L=50,R=380,T=15,B=240;
  const X=x=>L+(R-L)*(x1===x0?.5:(x-x0)/(x1-x0)),Y=y=>B-(B-T)*(y1===y0?.5:(y-y0)/(y1-y0));
  sv('path',{d:`M${L} ${T}V${B}H${R}`,style:'fill:none;stroke:currentColor;stroke-width:2;opacity:.7'},s);
  tx(s,L,B+16,fmt(x0));tx(s,R,B+16,fmt(x1));tx(s,L-6,B,fmt(y0),'','end');tx(s,L-6,T+8,fmt(y1),'','end');
  if(it.xlabel)tx(s,(L+R)/2,B+34,String(it.xlabel).slice(0,30),'var(--yel)',null,14);
  if(it.ylabel)tx(s,L+4,T-3,String(it.ylabel).slice(0,30),'var(--yel)','start',14);
  const n=P.length,mx=xs.reduce((a,b)=>a+b)/n,my=ys.reduce((a,b)=>a+b)/n;let sxy=0,sxx=0,syy=0;P.forEach(p=>{sxy+=(p[0]-mx)*(p[1]-my);sxx+=(p[0]-mx)**2;syy+=(p[1]-my)**2});
  const r=sxx&&syy?sxy/Math.sqrt(sxx*syy):0,m=sxx?sxy/sxx:0,b=my-m*mx;
  if(it.trend!==false&&sxx){sv('line',{x1:X(x0),y1:Y(m*x0+b),x2:X(x1),y2:Y(m*x1+b),style:'stroke:var(--pink);stroke-width:3;stroke-dasharray:8 5'},s)}
  P.forEach(p=>sv('circle',{cx:X(p[0]),cy:Y(p[1]),r:5.5,style:'fill:var(--blue);stroke:var(--chalk);stroke-width:1.5'},s));
  const a=Math.abs(r),w=a>.8?'fuerte':a>.5?'moderada':a>.2?'débil':'casi nula';
  const nt=el('div','t-note',d);nt.textContent=`Correlación r = ${fmt(r)} (${r>0.2?'positiva':r<-0.2?'negativa':'sin relación clara'}, ${w}).`+(sxx?` Recta: y = ${fmt(m)}x ${b<0?'−':'+'} ${fmt(Math.abs(b))}`:'');
  cap(d,it);reveal(d);return 1600},

/* Triángulo rectángulo con razones trigonométricas (da dos lados cualesquiera) */
rtri(it){
  let a=+it.a,b=+it.b,c=+it.c;const ok=v=>isFinite(v)&&v>0;
  if(ok(a)&&ok(b)){c=Math.hypot(a,b)}else if(ok(a)&&ok(c)&&c>a){b=Math.sqrt(c*c-a*a)}else if(ok(b)&&ok(c)&&c>b){a=Math.sqrt(c*c-b*b)}else return 500;
  const d=put('t-fig'),s=sv('svg',{viewBox:'0 0 400 270',class:'graph'},d),k=Math.min(300/b,170/a),W=b*k,H=a*k,cx=40,cy=225;
  sv('path',{d:`M${cx} ${cy}L${cx+W} ${cy}L${cx} ${cy-H}Z`,style:'fill:rgba(143,208,232,.12);stroke:var(--blue);stroke-width:3.5;stroke-linejoin:round'},s);
  sv('path',{d:`M${cx} ${cy-14}H${cx+14}V${cy}`,style:'fill:none;stroke:var(--chalk);stroke-width:2'},s);
  const th=Math.atan2(a,b),ar=34;sv('path',{d:`M${cx+W-ar} ${cy}A${ar} ${ar} 0 0 0 ${cx+W-ar*Math.cos(th)} ${cy-ar*Math.sin(th)}`,style:'fill:none;stroke:var(--pink);stroke-width:3'},s);
  tx(s,cx+W-ar-14,cy-8,'θ','var(--pink)','end',18);
  tx(s,cx-8,cy-H/2,`a = ${fmt(a)}`,'var(--yel)','end',15);tx(s,cx+W/2,cy+22,`b = ${fmt(b)}`,'var(--yel)',null,15);tx(s,cx+W/2+10,cy-H/2-8,`c = ${fmt(c)}`,'var(--pink)','start',15);
  const deg=th*180/Math.PI,t=el('div','t5-trig',d);
  [['sen θ','opuesto / hipotenusa = a/c',a/c],['cos θ','adyacente / hipotenusa = b/c',b/c],['tan θ','opuesto / adyacente = a/b',a/b]].forEach(x=>el('div','',t,`${x[0]} = ${x[1]} ≈ ${fmt(x[2])}`));
  el('div','',t,`θ ≈ ${fmt(deg)}° · el otro ángulo agudo ≈ ${fmt(90-deg)}°`);
  cap(d,it);reveal(d);return 2000},

/* Tabla de conjugación con la terminación resaltada */
conjugate(it){
  const R=arr(it.rows).slice(0,8).map(x=>({p:String((x&&x.p)||''),f:String((x&&x.f)||''),e:String((x&&x.e)||'')})).filter(x=>x.f);
  if(!R.length)return 500;
  const d=put('t5-cj');rich(el('div','t5-h',d),[it.verb,it.tense].filter(Boolean).join(' · ')||'Conjugación');
  const t=el('table','t5-cjt',d);
  R.forEach((x,i)=>{const r=el('tr','t5-fade',t);dl(r,i,.35);el('td','t5-cjp',r,x.p);const c=el('td','',r);
    if(x.e&&x.f.endsWith(x.e)&&x.f.length>x.e.length){c.appendChild(document.createTextNode(x.f.slice(0,-x.e.length)));el('b','',c,x.e)}else c.textContent=x.f});
  cap(d,it);reveal(d);return R.length*350+800},

/* Patrón numérico: detecta la regla y sigue la secuencia */
pattern(it){
  const q=arr(it.seq).slice(0,10).map(Number).filter(isFinite);if(q.length<3)return 500;
  const df=q.slice(1).map((v,i)=>v-q[i]),ar=df.every(v=>Math.abs(v-df[0])<1e-9),rt=q.every(v=>v!==0)&&q.slice(1).map((v,i)=>v/q[i]),ge=rt&&rt.every(v=>Math.abs(v-rt[0])<1e-9);
  const nx=Math.round(N(it.next,0,4,2)),out=q.slice(),step=ar?v=>v+df[0]:ge?v=>v*rt[0]:null;
  if(step)for(let i=0;i<nx;i++)out.push(step(out[out.length-1]));
  const d=put('t5-pat'),row=el('div','t5-patr',d);
  out.forEach((v,i)=>{if(i){const a=el('div','t5-pa',row,step&&i>=1?(ar?(df[0]>=0?'+':'−')+fmt(Math.abs(df[0])):'×'+fmt(rt[0])):'→');dl(a,i,.3)}
    const b=el('div','t5-pb'+(i>=q.length?' nx':''),row,fmt(v));dl(b,i,.3)});
  const rule=ar?`Sumamos ${fmt(df[0])} cada vez. Término n: aₙ = ${fmt(q[0])} + ${fmt(df[0])}·(n − 1)`:ge?`Multiplicamos por ${fmt(rt[0])} cada vez. Término n: aₙ = ${fmt(q[0])}·${fmt(rt[0])}ⁿ⁻¹`:(it.rule?String(it.rule):'Busca qué cambia de un número al siguiente');
  rich(el('div','t-note t5-c',d),rule);cap(d,it);reveal(d);return out.length*300+900},

/* Capas (atmósfera, suelo, Tierra, niveles): la primera va arriba */
layers(it){
  const L=arr(it.layers).slice(0,8).map(x=>typeof x==='string'?{label:x}:{label:String((x&&x.label)||''),note:String((x&&x.note)||'')}).filter(x=>x.label);
  if(!L.length)return 500;
  const d=put('t5-ly');if(it.title)rich(el('div','t5-h',d),it.title);
  L.forEach((x,i)=>{const r=el('div','t5-lyr',d);r.style.setProperty('--lc',C[i%3]);r.style.setProperty('--lo',String(.28+.5*i/Math.max(1,L.length-1)));dl(r,i,.4);rich(el('b','',r),x.label);if(x.note)rich(el('small','',r),x.note)});
  cap(d,it);reveal(d);return L.length*400+800},

/* Modelo de área: multiplicar partiendo los factores (números o álgebra) */
areamodel(it){
  const cs=S(it.cols,4),rs=S(it.rows,4);if(!cs.length||!rs.length)return 500;
  const num=a=>a.every(v=>isFinite(+v)&&v.trim()!==''),nn=num(cs)&&num(rs),d=put('t5-am'),t=el('table','t5-amt',d),h=el('tr','',t);el('th','',h);
  cs.forEach(c=>rich(el('th','',h),mm(c)));let tot=0;
  rs.forEach((r,i)=>{const tr=el('tr','',t);rich(el('th','',tr),mm(r));cs.forEach((c,j)=>{const td=el('td','t5-fade',tr);dl(td,i*cs.length+j,.4);
    if(nn){const v=+r*+c;tot+=v;rich(td,mm(String(v)))}else rich(td,mm(arr(arr(it.cells)[i])[j]||(r+'\\cdot '+c)))})});
  const f=a=>a.join(' + '),n=el('div','t-note t5-c',d);
  n.textContent=nn?`(${f(cs)}) × (${f(rs)}) = ${f(rs.flatMap(r=>cs.map(c=>String(+r*+c))))} = ${fmt(tot)}`:`(${f(cs)})(${f(rs)})`;
  cap(d,it);reveal(d);return cs.length*rs.length*400+900},

/* Átomo de Bohr: capas y electrones (Z hasta 20 solo con Z; para más da "shells") */
atom(it){
  const z=Math.round(N(it.z,1,118,1));let sh=arr(it.shells).map(Number).filter(v=>v>0).slice(0,7);
  if(!sh.length){let r=z;[2,8,8,18,18,32,32].forEach(c=>{if(r>0){sh.push(Math.min(c,r));r-=c}});if(z>20&&!it.shells)it.caption=(it.caption?it.caption+' ':'')+'(distribución aproximada de capas)'}
  const d=put('t-fig'),s=sv('svg',{viewBox:'0 0 300 300',class:'graph',style:'max-width:320px'},d),n=sh.length,r0=30,dr=Math.min(24,120/n);
  sv('circle',{cx:150,cy:150,r:r0-4,style:'fill:var(--pink);opacity:.9'},s);tx(s,150,155,(it.symbol?String(it.symbol).slice(0,3)+' · ':'')+z+'p⁺','#13251c',null,12);
  sh.forEach((c,i)=>{const r=r0+dr*(i+1);sv('circle',{cx:150,cy:150,r,style:'fill:none;stroke:currentColor;opacity:.5;stroke-width:1.5'},s);
    for(let k=0;k<c;k++){const a=2*Math.PI*k/c-Math.PI/2+i*.4;sv('circle',{cx:150+r*Math.cos(a),cy:150+r*Math.sin(a),r:5,style:`fill:${C[i%3]};stroke:var(--chalk);stroke-width:1`},s)}});
  el('div','t-note t5-c',d,`Electrones por capa: ${sh.join(', ')} · electrones de valencia: ${sh[sh.length-1]}`);
  cap(d,it);reveal(d);return 1800},

/* Razón y proporción: tabla de razones equivalentes y reparto */
ratio(it){
  const a=+it.a,b=+it.b;if(!(a>0&&b>0))return 500;
  const u=arr(it.units).slice(0,2).map(String),d=put('t5-ra'),g=(x,y)=>y?g(y,x%y):x,k=g(a,b);
  rich(el('div','t5-h',d),`Razón ${a} : ${b}`+(k>1?` = ${a/k} : ${b/k}`:''));
  const t=el('table','t5-rat',d),h=el('tr','',t);el('th','',h,u[0]||'A');el('th','',h,u[1]||'B');
  [1,2,3,4,5].forEach((m,i)=>{const r=el('tr','t5-fade',t);dl(r,i,.35);el('td','',r,fmt(a*m));el('td','',r,fmt(b*m))});
  const tot=+it.total;if(tot>0){const s=a+b;el('div','t-note t5-c',d,`Si el total es ${fmt(tot)}: ${u[0]||'A'} = ${fmt(tot*a/s)} y ${u[1]||'B'} = ${fmt(tot*b/s)} (cada parte vale ${fmt(tot/s)})`)}
  cap(d,it);reveal(d);return 2200}
};
const old=Board.draw;
Board.draw=function(it){const f=it&&Object.prototype.hasOwnProperty.call(E,it.t)&&E[it.t];if(f){try{return f(it)}catch(e){console.warn('teach7',e);return 600}}return old.call(Board,it)};
window.LumiTeach7={types:Object.keys(E)};
})();
