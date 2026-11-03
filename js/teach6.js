/* Herramientas de enseñanza de Lumi · tanda 8: percent, clock, balance, calendar, wordparts, array.
   Todo el texto de la IA se inserta como texto (nunca HTML). */
(()=>{
if(typeof Board==='undefined')return;
const NS='http://www.w3.org/2000/svg',sheet=()=>document.getElementById('sheet'),box=()=>document.getElementById('board');
const el=(tag,cls,par,txt)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;if(par)par.appendChild(e);return e};
const sv=(n,a,par,t)=>{const e=document.createElementNS(NS,n);for(const k in a)e.setAttribute(k,a[k]);if(t!=null)e.textContent=t;if(par)par.appendChild(e);return e};
const reveal=n=>requestAnimationFrame(()=>requestAnimationFrame(()=>{n.classList.add('on','focus');setTimeout(()=>n.classList.remove('focus'),1800);box().scrollTop=box().scrollHeight}));
const put=cls=>el('div','it '+cls,sheet());
const T=s=>{s=String(s==null?'':s);return window.Tex&&Tex.text?Tex.text(s):s};
function rich(p,t){const s=window.Tex&&Tex.fix?Tex.fix(String(t==null?'':t)):String(t==null?'':t);
  s.split(/(\$[^$]+\$)/).forEach(x=>{
    if(/^\$[^$]+\$$/.test(x)){const m=x.slice(1,-1),sp=el('span','',p);let ok=false;if(window.katex)try{katex.render(window.Tex&&Tex.norm?Tex.norm(m):m,sp,{throwOnError:false,displayMode:false,strict:'ignore'});ok=true}catch(e){}if(!ok)sp.textContent=window.Tex&&Tex.conv?Tex.conv(m):m}
    else x.split(/\*\*([^*]+)\*\*/).forEach((q,i)=>{if(q)i%2?el('b','',p,q):p.appendChild(document.createTextNode(q))})});return p}
const arr=a=>Array.isArray(a)?a:[];
const N=(v,a,b,d)=>{v=+v;return isFinite(v)?Math.max(a,Math.min(b,v)):d};
const fm=v=>String(+(+v).toFixed(2));
const cap=(d,it)=>{if(it.caption)rich(el('div','t6-cap',d),it.caption)};
const head=(d,it)=>{if(it.title)rich(el('div','t6-h',d),it.title)};

const E={
/* Porcentaje: cuadrícula de 100 con la parte pintada y, si hay "of", el cálculo */
percent(it){
  const v=N(it.value,0,100,NaN);if(isNaN(v))return 500;
  const d=put('t6-pct');head(d,it);
  const g=el('div','t6-pg',d),full=Math.floor(v),part=v-full;
  for(let i=0;i<100;i++){const c=el('i','',g);if(i<full){c.className='f';c.style.animationDelay=(i*.012)+'s'}else if(i===full&&part>0){c.className='f';c.style.opacity=.35+part*.65;c.style.animationDelay=(i*.012)+'s'}}
  const big=el('div','t6-big',d,fm(v)+' %');
  const o=+it.of;
  if(isFinite(o)&&it.of!==''&&it.of!=null){const r=el('div','t6-eq',d);rich(r,'$'+fm(v)+'\\%\\ \\text{de}\\ '+fm(o)+' = \\frac{'+fm(v)+'}{100}\\times '+fm(o)+' = '+fm(v*o/100)+'$')}
  else el('div','t6-eq',d,fm(v)+' de cada 100 = '+fm(v/100)+' = '+fm(v)+'/100');
  cap(d,it);reveal(d);return 2200},

/* Reloj analógico (hasta 3 horas para comparar o medir tiempo transcurrido) */
clock(it){
  const L=arr(it.times).slice(0,3).map(x=>({h:N(x&&x.h,0,23,0)|0,m:N(x&&x.m,0,59,0)|0,l:String((x&&x.label)||'')}));
  if(!L.length&&it.h!=null)L.push({h:N(it.h,0,23,0)|0,m:N(it.m,0,59,0)|0,l:''});
  if(!L.length)return 500;
  const d=put('t6-clk');head(d,it);const row=el('div','t6-ck',d);
  L.forEach((t,i)=>{
    const w=el('div','t6-cw',row);w.style.animationDelay=(i*.5)+'s';
    const s=sv('svg',{viewBox:'-60 -60 120 120',class:'t6-cs'},w);
    sv('circle',{r:56,fill:'rgba(255,255,255,.06)',stroke:'var(--chalk)','stroke-width':3},s);
    for(let k=0;k<60;k++){const a=k*6*Math.PI/180,r1=k%5?52:48;sv('line',{x1:Math.sin(a)*r1,y1:-Math.cos(a)*r1,x2:Math.sin(a)*54,y2:-Math.cos(a)*54,stroke:'var(--chalk)','stroke-width':k%5?.6:1.6},s)}
    for(let k=1;k<=12;k++){const a=k*30*Math.PI/180;sv('text',{x:Math.sin(a)*38,y:-Math.cos(a)*38+4,'text-anchor':'middle','font-size':11,fill:'var(--chalk)','font-weight':700},s,String(k))}
    const ha=((t.h%12)+t.m/60)*30,ma=t.m*6;
    const hand=(a,len,w2,c)=>{const r=a*Math.PI/180;sv('line',{x1:0,y1:0,x2:Math.sin(r)*len,y2:-Math.cos(r)*len,stroke:c,'stroke-width':w2,'stroke-linecap':'round'},s)};
    hand(ha,26,4,'var(--yel)');hand(ma,40,2.6,'var(--blue)');sv('circle',{r:3,fill:'var(--pink)'},s);
    el('div','t6-dig',w,String(t.h).padStart(2,'0')+':'+String(t.m).padStart(2,'0'));
    if(t.l)rich(el('div','t6-cl',w),t.l)});
  if(L.length>=2){const a=L[0].h*60+L[0].m,b=L[L.length-1].h*60+L[L.length-1].m;let df=b-a;if(df<0)df+=1440;
    el('div','t6-eq',d,'Tiempo transcurrido: '+(df/60|0)+' h '+(df%60)+' min')}
  cap(d,it);reveal(d);return L.length*900+1200},

/* Balanza para ecuaciones: lo que hay en cada platillo y hacia dónde se inclina */
balance(it){
  const A=arr(it.left).slice(0,4).map(x=>T(x)),B=arr(it.right).slice(0,4).map(x=>T(x));
  if(!A.length&&!B.length)return 500;
  const tl=it.tilt==='left'?-9:it.tilt==='right'?9:0,d=put('t6-bal');head(d,it);
  const s=sv('svg',{viewBox:'0 0 320 210',class:'t6-bs'},d),r=tl*Math.PI/180,ex=118*Math.cos(r),ey=118*Math.sin(r);
  sv('path',{d:'M160 62 L140 190 L180 190 Z',fill:'rgba(255,255,255,.15)',stroke:'var(--chalk)','stroke-width':2},s);
  sv('rect',{x:110,y:190,width:100,height:8,rx:4,fill:'var(--chalk)'},s);
  const beam=sv('g',{class:'t6-beam'},s);beam.style.transformOrigin='160px 62px';beam.style.setProperty('--a',tl+'deg');
  sv('line',{x1:160-118,y1:62,x2:160+118,y2:62,stroke:'var(--yel)','stroke-width':5,'stroke-linecap':'round'},beam);
  [[160+(-ex),62+(-ey),A],[160+ex,62+ey,B]].forEach(([x,y,L],si)=>{
    const dy=y-62,dx=si?ex-118:118-ex,g=sv('g',{class:'t6-pan'},s);
    g.style.setProperty('--dx',dx+'px');g.style.setProperty('--dy',dy+'px');
    const px=si?160+118:160-118;
    sv('path',{d:'M'+(px-34)+' 108 L'+(px)+' 62 L'+(px+34)+' 108',fill:'none',stroke:'var(--chalk)','stroke-width':1.5},g);
    sv('path',{d:'M'+(px-38)+' 108 h76 a38 22 0 0 1 -76 0',fill:'rgba(255,255,255,.12)',stroke:'var(--chalk)','stroke-width':2},g);
    L.forEach((t,i)=>{const w=Math.max(30,t.length*10+14),cx=px,cy=100-i*24;
      sv('rect',{x:cx-w/2,y:cy-20,width:w,height:21,rx:6,fill:si?'var(--pink)':'var(--blue)',opacity:.9},g);
      sv('text',{x:cx,y:cy-5,'text-anchor':'middle','font-size':14,'font-weight':700,fill:'#13251c'},g,t.slice(0,12))})});
  if(it.eq)rich(el('div','t6-eq',d),it.eq.indexOf('$')>=0?it.eq:'$'+it.eq+'$');
  cap(d,it);reveal(d);return 2400},

/* Calendario de un mes con días marcados */
calendar(it){
  const y=N(it.year,1,9999,new Date().getFullYear())|0,m=N(it.month,1,12,new Date().getMonth()+1)|0;
  const MN=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const first=(new Date(y,m-1,1).getDay()+6)%7,days=new Date(y,m,0).getDate();
  const mk={};arr(it.marks).slice(0,12).forEach(x=>{if(x&&+x.d>=1&&+x.d<=days)mk[+x.d|0]={l:String(x.label||''),c:N(x.c,0,2,0)|0}});
  const d=put('t6-cal');el('div','t6-h',d,(it.title?T(it.title)+' · ':'')+MN[m-1]+' '+y);
  const g=el('div','t6-cg',d);['L','M','X','J','V','S','D'].forEach(x=>el('b','',g,x));
  for(let i=0;i<first;i++)el('span','',g);
  for(let k=1;k<=days;k++){const c=el('span','',g,String(k));if(mk[k]){c.className='mk c'+mk[k].c;c.style.animationDelay=(.3+Object.keys(mk).indexOf(String(k))*.35)+'s'}}
  const ks=Object.keys(mk);if(ks.length){const lg=el('div','t6-lg',d);ks.forEach(k=>{if(mk[k].l)rich(el('div','',lg),'**'+k+'**: '+mk[k].l)})}
  cap(d,it);reveal(d);return 1500+ks.length*400},

/* Partes de una palabra: prefijo, raíz, sufijo o sílabas con su significado */
wordparts(it){
  const P=arr(it.parts).slice(0,6).filter(x=>x&&x.p).map(x=>({p:String(x.p).slice(0,14),k:String(x.k||''),m:String(x.m||'')}));
  if(!P.length)return 500;
  const d=put('t6-wp'),row=el('div','t6-wr',d);
  const col=k=>/pref/i.test(k)?0:/suf/i.test(k)?2:/ra[ií]z|lex|base/i.test(k)?1:3;
  P.forEach((x,i)=>{const c=el('div','t6-wc c'+col(x.k),row);c.style.animationDelay=(i*.6)+'s';
    el('div','t6-wt',c,x.p);if(x.k)el('div','t6-wk',c,x.k);if(x.m)rich(el('div','t6-wm',c),x.m)});
  if(it.meaning)rich(el('div','t6-eq',d),(it.word?'**'+T(it.word)+'**: ':'')+it.meaning);
  cap(d,it);reveal(d);return P.length*700+1200},

/* Arreglo de puntos para multiplicar (y propiedad distributiva con "split") */
array(it){
  const R=N(it.rows,1,10,0)|0,C=N(it.cols,1,12,0)|0;if(!R||!C)return 500;
  const sp=it.split!=null?N(it.split,1,C-1,0)|0:0,d=put('t6-arr');head(d,it);
  const g=el('div','t6-ag',d);g.style.gridTemplateColumns='repeat('+C+',1fr)';g.style.maxWidth=(C*34)+'px';
  for(let r=0;r<R;r++)for(let c=0;c<C;c++){const i=el('i',sp?(c<sp?'a':'b'):'',g);i.style.animationDelay=(r*.25+c*.03)+'s'}
  el('div','t6-big',d,R+' × '+C+' = '+(R*C));
  if(sp)rich(el('div','t6-eq',d),'$'+R+'\\times('+sp+'+'+(C-sp)+') = '+R+'\\times'+sp+' + '+R+'\\times'+(C-sp)+' = '+R*sp+' + '+R*(C-sp)+' = '+(R*C)+'$');
  cap(d,it);reveal(d);return R*250+1800}
};
const old=Board.draw;
Board.draw=function(it){const f=it&&Object.prototype.hasOwnProperty.call(E,it.t)&&E[it.t];if(f){try{return f(it)}catch(e){console.warn('teach6',e);return 600}}return old.call(Board,it)};
window.LumiTeach6={types:Object.keys(E)};
})();
