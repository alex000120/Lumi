/* Herramientas de enseñanza de Lumi · tanda 16: inequality, gcdlcm, powers, temp, money.
   Se enganchan a Board.draw encima de teach.js … teach14.js. Todo el texto de la IA se inserta como texto (nunca HTML). */
(()=>{
if(typeof Board==='undefined')return;
const NS='http://www.w3.org/2000/svg',sheet=()=>document.getElementById('sheet'),box=()=>document.getElementById('board');
const el=(tag,cls,par,txt)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;if(par)par.appendChild(e);return e};
const sv=(n,a,par,t)=>{const e=document.createElementNS(NS,n);for(const k in a)e.setAttribute(k,a[k]);if(t!=null)e.textContent=t;if(par)par.appendChild(e);return e};
const reveal=n=>requestAnimationFrame(()=>requestAnimationFrame(()=>{n.classList.add('on','focus');setTimeout(()=>n.classList.remove('focus'),1800);box().scrollTop=box().scrollHeight}));
const put=(cls,par)=>el('div','it '+cls,par||sheet());
const T=s=>{s=String(s==null?'':s);return window.Tex&&Tex.text?Tex.text(s):s};
function rich(p,t){const s=window.Tex&&Tex.fix?Tex.fix(String(t==null?'':t)):String(t==null?'':t);
  s.split(/(\$[^$]+\$)/).forEach(x=>{
    if(/^\$[^$]+\$$/.test(x)){const m=x.slice(1,-1),sp=el('span','',p);let ok=false;if(window.katex)try{katex.render(window.Tex&&Tex.norm?Tex.norm(m):m,sp,{throwOnError:false,displayMode:false,strict:false});ok=true}catch(e){}if(!ok)sp.textContent=m}
    else x.split(/\*\*([^*]+)\*\*/).forEach((q,i)=>{if(q)i%2?el('b','',p,q):p.appendChild(document.createTextNode(q))})});return p}
const cap=(d,it)=>{if(it.caption)rich(el('div','t-note',d),it.caption)};
const fm=v=>String(+(+v).toFixed(2)),fc=v=>fm(v).replace('.',',');
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
const sorry=t=>{const d=put('t-note');d.textContent=t;reveal(d);return 900};
const sup=n=>String(n).replace(/-/g,'⁻').replace(/\d/g,c=>'⁰¹²³⁴⁵⁶⁷⁸⁹'[c]);
const line=(d,t)=>rich(el('div','t-note',d),t);
/* fracción reducida como texto: 7/2 (= 3,5) */
function fr(n,dn){if(!dn)return'?';const g=gcd(Math.round(n*1e6),Math.round(dn*1e6))||1;
  if(Number.isInteger(n)&&Number.isInteger(dn)){const gg=gcd(n,dn)||1;n/=gg;dn/=gg;if(dn<0){n=-n;dn=-dn}return dn===1?String(n):n+'/'+dn+' (= '+fc(n/dn)+')'}
  return fc(n/dn)}
const val=(n,dn)=>n/dn;

const E={
/* ---------- inequality: inecuación lineal ax + b (<,≤,>,≥) c con recta numérica ---------- */
inequality(it){
  const a=+it.a,b=+(it.b==null?0:it.b),c=+it.c,o=String(it.op==null?'<':it.op).replace('<=','≤').replace('>=','≥').replace('=<','≤').replace('=>','≥').trim();
  if(![a,b,c].every(isFinite)||!a||!['<','≤','>','≥'].includes(o)||Math.abs(a)>999||Math.abs(b)>9999||Math.abs(c)>9999)return sorry('Dame una inecuación ax + b ‹ c con a distinto de 0: a, b, c y op (<, ≤, >, ≥).');
  const d=put('t-fig'),sg=n=>n<0?'('+fc(n)+')':fc(n),opl=o;
  const lhs=(a===1?'':a===-1?'-':fc(a))+'x'+(b?(b<0?' − ':' + ')+fc(Math.abs(b)):'');
  line(d,'**Resolvemos:** '+lhs+' '+opl+' '+fc(c));
  let r=c-b,o2=o;
  if(b)line(d,'Pasamos '+fc(b)+' al otro lado '+(b>0?'restando':'sumando')+': '+(a===1?'':a===-1?'-':fc(a))+'x '+o+' '+fc(c)+(b>0?' − ':' + ')+sg(Math.abs(b))+' = '+fc(r));
  let s=r/a;
  if(a!==1){const flip=a<0;if(flip)o2={'<':'>','>':'<','≤':'≥','≥':'≤'}[o];
    line(d,'Dividimos entre '+fc(a)+': x '+o2+' '+fr(r,a)+(flip?'  ⚠️ **¡Al dividir entre un número negativo el signo se invierte!**':''))}
  const closed=o2==='≤'||o2==='≥',left=o2==='<'||o2==='≤',sol=Number.isInteger(r)&&Number.isInteger(a)?fr(r,a):fc(s);
  line(d,'**Solución:** x '+o2+' '+sol);
  const nice=[1,2,5,10,20,50,100,200,500,1000,2000,5000,10000,20000,50000],st=nice.find(v=>v*4>=Math.abs(s))||50000,c0=Math.round(s/st)*st,x=v=>200+(v-c0)/st*40;
  const g=sv('svg',{viewBox:'0 0 400 90',class:'graph'},d);
  sv('line',{x1:10,x2:390,y1:45,y2:45,style:'stroke:var(--chalk);stroke-width:2'},g);
  const sx=Math.max(10,Math.min(390,x(s))),ex=left?10:390;
  sv('line',{x1:sx,x2:ex,y1:45,y2:45,style:'stroke:var(--pink);stroke-width:7;stroke-linecap:round;opacity:.8'},g);
  sv('path',{d:left?'M10 45l10-7v14z':'M390 45l-10-7v14z',style:'fill:var(--pink)'},g);
  for(let i=-4;i<=4;i++){const v=c0+i*st,px=x(v);sv('line',{x1:px,x2:px,y1:39,y2:51,style:'stroke:var(--chalk);stroke-width:2'},g);sv('text',{x:px,y:72,'text-anchor':'middle',style:'fill:var(--chalk);font-size:13px'},g,fc(+(v).toFixed(4)))}
  sv('circle',{cx:sx,cy:45,r:8,style:'stroke:var(--pink);stroke-width:3;fill:'+(closed?'var(--pink)':'var(--board,#243b2f)')},g);
  sv('text',{x:sx,y:24,'text-anchor':'middle',style:'fill:var(--pink);font-size:14px;font-weight:700'},g,fc(+s.toFixed(3)));
  line(d,(closed?'Círculo **lleno**: el '+fc(+s.toFixed(3))+' sí es solución.':'Círculo **vacío**: el '+fc(+s.toFixed(3))+' no es solución (solo los valores '+(left?'menores':'mayores')+').'));
  const sv2=fc(+s.toFixed(3));line(d,'**Intervalo:** '+(left?'(−∞, '+sv2+(closed?']':')'):(closed?'[':'(')+sv2+', +∞)'));
  const t0=+(s+(left?-st:st)).toFixed(6),t1=+s.toFixed(6);
  line(d,'Comprobación con x = '+fc(t0)+': '+fc(a)+'·'+sg(t0)+(b?(b<0?' − ':' + ')+fc(Math.abs(b)):'')+' = '+fc(+(a*t0+b).toFixed(6))+' '+(((o==='<'&&a*t0+b<c)||(o==='≤'&&a*t0+b<=c)||(o==='>'&&a*t0+b>c)||(o==='≥'&&a*t0+b>=c))?o+' '+fc(c)+' ✅':'(no cumple) ❌'));
  cap(d,it);reveal(d);return 1400+500*Math.min(6,d.children.length)},

/* ---------- gcdlcm: m.c.d. y m.c.m. por descomposición en primos ---------- */
gcdlcm(it){
  const N=(Array.isArray(it.nums)?it.nums:[]).map(Number).filter(n=>Number.isInteger(n)&&n>=2&&n<=99999).slice(0,3);
  if(N.length<2)return sorry('Dame 2 o 3 números enteros (de 2 a 99999) en nums, por ejemplo [12, 18].');
  const fac=n=>{const m={};for(let p=2;p*p<=n;p++)while(n%p===0){m[p]=(m[p]||0)+1;n/=p}if(n>1)m[n]=(m[n]||0)+1;return m},F=N.map(fac);
  const P=[...new Set(F.flatMap(f=>Object.keys(f).map(Number)))].sort((a,b)=>a-b);
  const mn=P.map(p=>Math.min(...F.map(f=>f[p]||0))),mx=P.map(p=>Math.max(...F.map(f=>f[p]||0)));
  const prod=(ps,es)=>ps.reduce((a,p,i)=>a*Math.pow(p,es[i]),1),G=prod(P,mn),L=prod(P,mx);
  const d=put('t-fig');if(it.title)rich(el('div','t-note',d),it.title);
  const tb=el('table','t15-tb',d),hd=el('tr','',tb);el('th','',hd,'');
  P.forEach(p=>el('th','',hd,String(p)));
  N.forEach((n,i)=>{const r=el('tr','',tb);el('th','',r,String(n));P.forEach((p,j)=>{const e=F[i][p]||0,td=el('td','',r,e?String(e):'·');if(e&&e===mn[j]&&mn[j]>0)td.className='t15-mn';if(e&&e===mx[j])td.classList.add('t15-mx')})});
  [['m.c.d. (mín.)',mn,'t15-mn'],['m.c.m. (máx.)',mx,'t15-mx']].forEach(([l,es,c])=>{const r=el('tr','t15-sum',tb);el('th','',r,l);es.forEach(e=>el('td',c,r,e?String(e):'·'))});
  line(d,'Cada número se descompone en primos: '+N.map((n,i)=>n+' = '+(Object.keys(F[i]).map(Number).sort((a,b)=>a-b).map(p=>F[i][p]>1?p+sup(F[i][p]):p).join(' · '))).join('  ;  '));
  const fx=(es,pp)=>pp.map((p,i)=>es[i]>0?(es[i]>1?p+sup(es[i]):p):null).filter(Boolean).join(' · ');
  line(d,'**m.c.d.** = primos **comunes** con el **menor** exponente → '+(G>1?fx(mn,P)+' = **'+G+'**':'no hay primos comunes → **1** (primos entre sí)'));
  line(d,'**m.c.m.** = **todos** los primos con el **mayor** exponente → '+fx(mx,P)+' = **'+L+'**');
  if(N.length===2)line(d,'Control: m.c.d. × m.c.m. = '+G+' × '+L+' = '+G*L+' = '+N[0]+' × '+N[1]+(G*L===N[0]*N[1]?' ✅':''));
  cap(d,it);reveal(d);return 1500+500*Math.min(6,d.children.length)},

/* ---------- powers: leyes de las potencias con la expansión de los factores ---------- */
powers(it){
  const a=Math.round(+it.base),m=Math.round(+it.m),n=Math.round(+(it.n==null?0:it.n)),law=String(it.law||'product').toLowerCase();
  if(!isFinite(a)||Math.abs(a)<2||Math.abs(a)>12||!isFinite(m)||m<1||m>8||!isFinite(n)||n<0||n>8||!['product','quotient','power','zero','negative'].includes(law))
    return sorry('Dame base (2 a 12), exponentes m y n (1 a 8) y law: product, quotient, power, zero o negative.');
  const d=put('t-fig'),B=a<0?'('+a+')':String(a),pw=(e)=>B+sup(e),ex=(k)=>Array(k).fill(B).join('·'),num=v=>Math.abs(v)<1e12?String(v):null;
  const Pn=(e)=>Math.pow(a,e);
  const row=(txt)=>line(d,txt);
  if(law==='product'){const t=m+n;row('**Producto de potencias de igual base:** se **suman** los exponentes.');
    row('$a^m\\cdot a^n=a^{m+n}$');if(t<=10)row('('+ex(m)+') · ('+ex(n)+') = '+ex(t)+' = '+pw(t));
    row(pw(m)+' · '+pw(n)+' = '+B+sup(t)+(num(Pn(t))?' = '+Pn(t):''))}
  else if(law==='quotient'){if(m<=n)return sorry('Para el cociente usa m mayor que n (por ejemplo 5 y 2).');const t=m-n;row('**Cociente de potencias de igual base:** se **restan** los exponentes.');
    row('$a^m:a^n=a^{m-n}$');row('('+ex(m)+') : ('+ex(n)+') → se simplifican '+n+' factores → '+ex(t));row(pw(m)+' : '+pw(n)+' = '+B+sup(t)+(num(Pn(t))?' = '+Pn(t):''))}
  else if(law==='power'){const t=m*Math.max(n,1);const k=Math.max(n,1);row('**Potencia de una potencia:** se **multiplican** los exponentes.');row('$(a^m)^n=a^{m\\cdot n}$');
    row('('+pw(m)+')'+sup(k)+' = '+Array(k).fill(pw(m)).join(' · ')+' = '+B+sup(t)+(num(Pn(t))?' = '+Pn(t):''))}
  else if(law==='zero'){row('**Exponente cero:** todo número (distinto de 0) elevado a 0 da **1**.');row('Mirá: '+pw(m)+' : '+pw(m)+' = 1  y  por la regla del cociente = '+B+sup(0));row('Entonces '+B+'⁰ = **1**')}
  else{const k=Math.max(n,1);row('**Exponente negativo:** es la **inversa** de la potencia positiva.');row('$a^{-n}=\\dfrac{1}{a^n}$');
    row(B+sup(-k)+' = 1 / '+pw(k)+(num(Pn(k))?' = 1/'+Pn(k):''))}
  cap(d,it);reveal(d);return 1300+500*d.children.length},

/* ---------- temp: termómetro y conversión entre °C, °F y K ---------- */
temp(it){
  const v=+it.value,u=String(it.unit||'C').toUpperCase().replace('°','');
  if(!isFinite(v)||!['C','F','K'].includes(u))return sorry('Dame un value numérico y unit: C, F o K.');
  const C=u==='C'?v:u==='F'?(v-32)*5/9:v-273.15;
  if(C<-273.15||C>5000)return sorry('Esa temperatura no es posible (el cero absoluto es −273,15 °C).');
  const F=C*9/5+32,K=C+273.15,d=put('t-fig');
  const g=sv('svg',{viewBox:'0 0 400 230',class:'graph'},d),lo=-30,hi=120,Y=t=>205-(Math.max(lo,Math.min(hi,t))-lo)/(hi-lo)*185;
  sv('rect',{x:70,y:15,width:20,height:190,rx:10,style:'fill:none;stroke:var(--chalk);stroke-width:3'},g);
  sv('rect',{x:74,y:Y(C),width:12,height:205-Y(C),rx:5,style:'fill:var(--pink)'},g);sv('circle',{cx:80,cy:212,r:13,style:'fill:var(--pink);stroke:var(--chalk);stroke-width:3'},g);
  [[0,'0 °C · el agua se congela'],[37,'37 °C · cuerpo humano'],[100,'100 °C · el agua hierve']].forEach(([t,l])=>{sv('line',{x1:90,x2:104,y1:Y(t),y2:Y(t),style:'stroke:var(--chalk);stroke-width:2'},g);sv('text',{x:110,y:Y(t)+4,style:'fill:var(--chalk);font-size:13px'},g,l)});
  sv('text',{x:60,y:Y(C)+4,'text-anchor':'end',style:'fill:var(--yel);font-size:14px;font-weight:700'},g,fc(+C.toFixed(1))+'°');
  [['°C',C],['°F',F],['K',K]].forEach(([l,x],i)=>{sv('text',{x:250,y:92+i*34,style:'fill:'+(l.endsWith(u)&&(u==='K'?l==='K':l==='°'+u)?'var(--yel)':'var(--chalk)')+';font-size:22px;font-weight:700'},g,fc(+x.toFixed(2))+' '+l)});
  line(d,'**Fórmulas:**  °F = °C × 9/5 + 32  ·  K = °C + 273,15  ·  °C = (°F − 32) × 5/9');
  if(u==='C'){line(d,fc(v)+' °C → °F: '+fc(v)+' × 9/5 + 32 = '+fc(+F.toFixed(2))+' °F');line(d,fc(v)+' °C → K: '+fc(v)+' + 273,15 = '+fc(+K.toFixed(2))+' K')}
  else if(u==='F'){line(d,fc(v)+' °F → °C: ('+fc(v)+' − 32) × 5/9 = '+fc(+C.toFixed(2))+' °C');line(d,'Y en kelvin: '+fc(+C.toFixed(2))+' + 273,15 = '+fc(+K.toFixed(2))+' K')}
  else{line(d,fc(v)+' K → °C: '+fc(v)+' − 273,15 = '+fc(+C.toFixed(2))+' °C');line(d,'Y en °F: '+fc(+C.toFixed(2))+' × 9/5 + 32 = '+fc(+F.toFixed(2))+' °F')}
  cap(d,it);reveal(d);return 1500+500*Math.min(5,d.children.length)},

/* ---------- money: descomponer una cantidad en billetes y monedas (y calcular el vuelto) ---------- */
money(it){
  const amt=Math.round(+it.amount),pay=it.pay==null?null:Math.round(+it.pay),cur=String(it.currency||'$').slice(0,4);
  if(!isFinite(amt)||amt<1||amt>999999)return sorry('Dame amount: una cantidad entera de dinero (1 a 999999).');
  if(pay!==null&&(!isFinite(pay)||pay<amt))return sorry('Lo que se paga (pay) tiene que ser mayor o igual que el precio (amount).');
  const D=[1000,500,200,100,50,20,10,5,2,1],split=x=>{const r=[];D.forEach(v=>{const c=Math.floor(x/v);if(c){r.push([v,c]);x-=c*v}});return r};
  const d=put('t-fig');
  const draw=(x,title)=>{const parts=split(x);line(d,title+' **'+cur+' '+x+'**');
    const wrap=el('div','t15-money',d);let shown=0;
    parts.forEach(([v,c])=>{const g=el('div','t15-g',wrap);for(let i=0;i<Math.min(c,6);i++){shown++;el('span','t15-'+(v>=20?'bill':'coin'),g,String(v))}
      if(c>6)el('span','t15-more',g,'×'+c);el('small','',g,c+' × '+v+' = '+c*v)});
    return parts};
  draw(amt,pay===null?'Armamos':'Precio:');
  if(pay!==null){const ch=pay-amt;draw(pay,'Pagás con:');line(d,'**Vuelto** = '+pay+' − '+amt+' = **'+cur+' '+ch+'**');if(ch>0)draw(ch,'El vuelto en billetes y monedas:')}
  line(d,'(Usamos los valores de ejemplo '+D.join(', ')+'; los billetes y monedas reales dependen de cada país.)');
  cap(d,it);reveal(d);return 1400+400*d.children.length}
};
const old=Board.draw;
Board.draw=function(it){const f=it&&Object.prototype.hasOwnProperty.call(E,it.t)&&E[it.t];if(f){try{return f(it)}catch(e){console.warn('teach15',e);return 600}}return old.call(Board,it)};
window.LumiTeach15={types:Object.keys(E)};
})();
