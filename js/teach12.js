/* Herramientas de enseñanza de Lumi · tanda 13: scinot, bases, quad, tangent, riemann, syllables.
   Se enganchan a Board.draw encima de teach.js … teach11.js. Todo el texto de la IA se inserta como texto (nunca HTML). */
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
const fc=v=>fm(v).replace('.',',');
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
const HALO='paint-order:stroke;stroke:var(--board,#243b2f);stroke-width:4px;stroke-linejoin:round;';
const sorry=t=>{const d=put('t-note');d.textContent=t;reveal(d);return 900};
const SUP='⁰¹²³⁴⁵⁶⁷⁸⁹';
const sup=n=>String(n).replace(/\d/g,c=>SUP[+c]);


const supS=n=>(n<0?'⁻':'')+sup(Math.abs(n));
const grp=s=>s.replace(/\B(?=(\d{3})+(?!\d))/g,' ');
const P=n=>n<0?'('+fm(n)+')':fm(n);
const PC=n=>n<0?'('+fc(n)+')':fc(n);
const dl=(n,i,g)=>{n.style.animationDelay=((g||.3)*i)+'s';return n};

/* evaluador seguro de f(x) (mismas reglas que las gráficas de la pizarra) */
const FN=['x','sin','cos','tan','sqrt','abs','ln','log','exp','pi','e'];
function mkFn(expr){
  let s=String(expr==null?'':expr).replace(/\s+/g,'').replace(/\^/g,'**').replace(/π/g,'pi').replace(/^y=/i,'').replace(/^f\(x\)=/i,'');
  if(!s||!/^[0-9a-z+\-*\/().,]*$/i.test(s)||!(s.match(/[a-z]+/gi)||[]).every(i=>FN.includes(i)))return null;
  s=s.replace(/(\d|\))(x|\(|sin|cos|tan|sqrt|abs|ln|log|exp|pi)/g,'$1*$2');
  try{return new Function('x','const{sin,cos,tan,sqrt,abs,exp,PI:pi,E:e}=Math;const ln=Math.log,log=Math.log10;return '+s)}catch(e){return null}}
const ev=(f,x)=>{try{const y=f(x);return isFinite(y)?y:NaN}catch(e){return NaN}};
/* lienzo de función: devuelve helpers de dibujo para un rango dado */
function plot(d,xa,xb,ya,yb,f){
  const W=400,H=250,m=26,s=sv('svg',{viewBox:`0 0 ${W} ${H}`,class:'graph'},d),id='t12c'+Math.random().toString(36).slice(2,7);
  const X=x=>m+(x-xa)/(xb-xa)*(W-2*m),Y=y=>H-m-(y-ya)/(yb-ya)*(H-2*m);
  const cp=sv('clipPath',{id},s);sv('rect',{x:m,y:m-8,width:W-2*m,height:H-2*m+16},cp);
  const g=sv('g',{'clip-path':`url(#${id})`},s);
  const st=(xb-xa)/8,nice=(()=>{const p=Math.pow(10,Math.floor(Math.log10(st))),q=st/p;return(q<=1?1:q<=2?2:q<=5?5:10)*p})(),nyv=(()=>{const r=(yb-ya)/6,p=Math.pow(10,Math.floor(Math.log10(r))),q=r/p;return(q<=1?1:q<=2?2:q<=5?5:10)*p})();
  for(let x=Math.ceil(xa/nice)*nice;x<=xb+1e-9;x+=nice){sv('line',{x1:X(x),x2:X(x),y1:m,y2:H-m,style:'stroke:var(--chalk);opacity:.13'},s);if(Math.abs(x)>1e-9)sv('text',{x:X(x),y:H-m+13,'text-anchor':'middle',style:'fill:var(--chalk);font-size:11px'},s,fm(x))}
  for(let y=Math.ceil(ya/nyv)*nyv;y<=yb+1e-9;y+=nyv){sv('line',{x1:m,x2:W-m,y1:Y(y),y2:Y(y),style:'stroke:var(--chalk);opacity:.13'},s);if(Math.abs(y)>1e-9)sv('text',{x:m-3,y:Y(y)+4,'text-anchor':'end',style:'fill:var(--chalk);font-size:11px'},s,fm(y))}
  if(ya<=0&&yb>=0)sv('line',{x1:m,x2:W-m,y1:Y(0),y2:Y(0),style:'stroke:var(--chalk);stroke-width:1.8'},s);
  if(xa<=0&&xb>=0)sv('line',{x1:X(0),x2:X(0),y1:m,y2:H-m,style:'stroke:var(--chalk);stroke-width:1.8'},s);
  const curve=(ff,c,w)=>{let dd='',pen=false;for(let k=0;k<=240;k++){const x=xa+(xb-xa)*k/240,y=ev(ff,x);if(!isFinite(y)||Math.abs(Y(y))>5000){pen=false;continue}dd+=(pen?'L':'M')+X(x).toFixed(1)+' '+Y(y).toFixed(1);pen=true}sv('path',{d:dd,style:`fill:none;stroke:${c};stroke-width:${w};stroke-linecap:round`},g)};
  return{s,g,X,Y,curve,W,H,m}}
const yrange=(f,xa,xb,extra)=>{let lo=Infinity,hi=-Infinity;for(let k=0;k<=160;k++){const y=ev(f,xa+(xb-xa)*k/160);if(isFinite(y)){lo=Math.min(lo,y);hi=Math.max(hi,y)}}(extra||[]).forEach(y=>{if(isFinite(y)){lo=Math.min(lo,y);hi=Math.max(hi,y)}});
  if(!isFinite(lo))return null;lo=Math.max(lo,-1e4);hi=Math.min(hi,1e4);if(hi-lo<1e-6){lo-=1;hi+=1}const pd=(hi-lo)*.1;return[lo-pd,hi+pd]};

const E={
/* ---------- scinot: notación científica moviendo la coma ---------- */
scinot(it){
  let v=it.mant!=null&&it.exp!=null?Number(String(it.mant).replace(',','.')+'e'+Math.round(+it.exp)):Number(String(it.n==null?'':it.n).replace(/\s/g,'').replace(',','.'));
  if(!isFinite(v)||v===0||Math.abs(v)<1e-12||Math.abs(v)>1e15)return sorry('Dame un número distinto de 0 (entre 0,000000000001 y un billón).');
  const neg=v<0;v=Math.abs(v);const[mm,ee]=v.toExponential().split('e'),exp=+ee,dg=mm.replace('.','');
  const plain=exp>=0?(dg.length>exp+1?dg.slice(0,exp+1)+'.'+dg.slice(exp+1):dg+'0'.repeat(exp+1-dg.length)):'0.'+'0'.repeat(-exp-1)+dg;
  const mantTxt=(neg?'−':'')+mm.replace('.',','),plainTxt=(neg?'−':'')+grp(plain.split('.')[0])+(plain.includes('.')?','+plain.split('.')[1]:'');
  const d=put('t-fig'),cw=Math.min(26,372/plain.length),x0=(400-plain.length*cw)/2,s=sv('svg',{viewBox:'0 0 400 150',class:'graph'},d);
  const first=plain.search(/[1-9]/),pi=plain.indexOf('.'),orig=pi>=0?x0+pi*cw+cw/2:x0+plain.length*cw,dest=x0+(first+1)*cw;
  [...plain].forEach((ch,i)=>{const x=x0+i*cw,sig=i>=first&&i<first+dg.length&&ch!=='.';
    if(ch==='.'){sv('text',{x:x+cw/2,y:96,'text-anchor':'middle',style:'fill:var(--pink);font-size:26px;font-weight:800'},s,',');return}
    sv('rect',{x,y:70,width:cw-2,height:38,rx:4,style:`fill:${sig?'rgba(246,216,107,.35)':'none'};stroke:${sig?'var(--yel)':'var(--chalk)'};stroke-opacity:${sig?1:.5};stroke-width:2`},s);
    sv('text',{x:x+(cw-2)/2,y:96,'text-anchor':'middle',style:`fill:var(--chalk);font-size:${Math.min(22,cw*.85)}px;font-weight:700`},s,ch)});
  if(exp===0)sv('text',{x:200,y:40,'text-anchor':'middle',style:'fill:var(--yel);font-size:15px;font-weight:700'},s,'La coma ya está después de la primera cifra');
  else{sv('path',{d:`M${orig} 62Q${(orig+dest)/2} 14 ${dest} 62`,style:'fill:none;stroke:var(--pink);stroke-width:3'},s);
    sv('polygon',{points:`${dest},64 ${dest-6},53 ${dest+6},53`,style:'fill:var(--pink)'},s);
    sv('text',{x:(orig+dest)/2,y:20,'text-anchor':'middle',style:`fill:var(--pink);font-size:15px;font-weight:800;${HALO}`},s,Math.abs(exp)+(Math.abs(exp)===1?' lugar':' lugares')+(exp>0?' a la izquierda':' a la derecha'))}
  sv('text',{x:200,y:134,'text-anchor':'middle',style:'fill:var(--chalk);font-size:12.5px;opacity:.85'},s,'amarillo = cifras significativas');
  el('div','t-note',d).textContent=plainTxt+' = '+mantTxt+' × 10'+supS(exp);
  el('div','t-note',d).textContent=exp>0?'La coma se movió '+exp+' a la izquierda → el exponente es positivo (+'+exp+').':exp<0?'La coma se movió '+(-exp)+' a la derecha → el exponente es negativo ('+exp+').':'No se movió la coma → el exponente es 0.';
  el('div','t-note',d).textContent='La mantisa siempre está entre 1 y 10. Para volver atrás: mueve la coma al revés.';
  cap(d,it);reveal(d);return 1800},

/* ---------- bases: cambio de base (binario, octal, hexadecimal…) ---------- */
bases(it){
  const DG='0123456789ABCDEF',fr=Math.round(+it.from)||10,to=Math.round(+it.to)||2,str=String(it.n==null?'':it.n).trim().toUpperCase().replace(/\s/g,'');
  if(fr<2||fr>16||to<2||to>16||fr===to)return sorry('Elige dos bases distintas entre 2 y 16.');
  if(!str||[...str].some(c=>DG.indexOf(c)<0||DG.indexOf(c)>=fr))return sorry('Ese número tiene cifras que no existen en base '+fr+'.');
  const dec=parseInt(str,fr);if(!(dec>=0&&dec<=1e9))return sorry('Usemos un número más pequeño (hasta mil millones).');
  const d=put('t-fig bs'),lines=[];let i=0;
  const L=(txt,cls)=>{const r=dl(el('div','bs-l',d),i++,.28);if(typeof txt==='string')r.textContent=txt;else txt(r);if(cls)r.classList.add(cls);return r};
  L(r=>{r.appendChild(document.createTextNode(str));el('sub','',r,String(fr));r.appendChild(document.createTextNode('  →  base '+to))},'bs-h');
  if(fr!==10){const ds=[...str].slice(0,12),n=ds.length;
    L('Valor de cada posición (base '+fr+'):');
    L(ds.map((c,k)=>c+'×'+fr+sup(n-1-k)).join(' + '));
    L(ds.map((c,k)=>DG.indexOf(c)*Math.pow(fr,n-1-k)).join(' + ')+' = '+dec,'bs-y')}
  let out=str;
  if(to!==10){const rows=[];let q=dec;if(q===0)rows.push([0,0,0]);while(q>0&&rows.length<34){const r=q%to;rows.push([q,Math.floor(q/to),r]);q=Math.floor(q/to)}
    L('Dividimos entre '+to+' y anotamos los restos:');
    rows.forEach(([a,b,r])=>L(rr=>{rr.appendChild(document.createTextNode(a+' ÷ '+to+' = '+b+'  resto '));el('span','bs-r',rr,DG[r])}));
    out=rows.map(x=>DG[x[2]]).reverse().join('');L('Leemos los restos de abajo hacia arriba:')}
  else out=String(dec);
  L(r=>{r.appendChild(document.createTextNode(str));el('sub','',r,String(fr));r.appendChild(document.createTextNode(' = '));el('span','bs-y',r,out);el('sub','',r,String(to))},'bs-h');
  cap(d,it);reveal(d);return 900+i*280},

/* ---------- quad: ecuación de segundo grado con discriminante y parábola ---------- */
quad(it){
  const a=+it.a,b=+it.b,c=+it.c;if(![a,b,c].every(isFinite)||a===0||[a,b,c].some(v=>Math.abs(v)>1e4))return sorry('Necesito a, b y c numéricos, con a distinto de 0.');
  const D=b*b-4*a*c,d=put('t-fig'),tm=(k,s,first)=>k===0?'':(first?(k<0?'-':''):(k<0?'-':'+'))+(Math.abs(k)===1&&s?'':fm(Math.abs(k)))+s;
  const poly=(tm(a,'x^2',true)+tm(b,'x',!a)+tm(c,'',!a&&!b))||'0';
  const line=t=>rich(el('div','t-note',d),t);
  line('$'+poly+'=0$   →   $a='+fm(a)+'$, $b='+fm(b)+'$, $c='+fm(c)+'$');
  line('$\\Delta=b^2-4ac='+P(b)+'^2-4\\cdot'+P(a)+'\\cdot'+P(c)+'='+fm(D)+'$');
  const vx=-b/(2*a),vy=a*vx*vx+b*vx+c,s=Math.sqrt(Math.max(D,0)),rts=D>=0?[(-b-s)/(2*a),(-b+s)/(2*a)].sort((p,q)=>p-q):[];
  const val=(sg)=>{const nn=-b+sg*s,dd=2*a;if(Number.isInteger(s)&&Number.isInteger(b)&&Number.isInteger(a)){const g=gcd(nn,dd)||1,N=nn/g,Dn=dd/g,sgn=(N<0)!==(Dn<0)?'-':'';return Dn===1||Dn===-1?fm(N*Dn):sgn+'\\frac{'+Math.abs(N)+'}{'+Math.abs(Dn)+'}'}return fm(+((nn/dd).toFixed(4)))};
  if(D>0){line('$\\Delta>0$: dos soluciones reales. $x=\\frac{-b\\pm\\sqrt{\\Delta}}{2a}$');line('$x_1='+val(-Math.sign(a)||-1)+'$,   $x_2='+val(Math.sign(a)||1)+'$')}
  else if(D===0){line('$\\Delta=0$: una solución doble. $x=\\frac{-b}{2a}='+val(0)+'$')}
  else line('$\\Delta<0$: no hay soluciones reales (la parábola no corta el eje x).');
  const half=Math.max(3,D>0?s/Math.abs(a)*.9+1:3),xa=vx-half,xb=vx+half,rg=yrange(x=>a*x*x+b*x+c,xa,xb,[0,vy]);
  const f=x=>a*x*x+b*x+c,pl=plot(d,xa,xb,rg[0],rg[1]);pl.curve(f,'var(--blue)',3.2);
  sv('line',{x1:pl.X(vx),x2:pl.X(vx),y1:pl.m,y2:pl.H-pl.m,style:'stroke:var(--yel);stroke-width:1.8;stroke-dasharray:5 4;opacity:.8'},pl.s);
  rts.forEach((r,k)=>{sv('circle',{cx:pl.X(r),cy:pl.Y(0),r:5.5,style:'fill:var(--yel);stroke:var(--chalk);stroke-width:1.5'},pl.s);sv('text',{x:pl.X(r),y:pl.Y(0)+(a>0?-10:20),'text-anchor':'middle',style:`fill:var(--yel);font-size:13px;font-weight:800;${HALO}`},pl.s,(D===0?'x = ':'x'+(k?'₂':'₁')+' = ')+fm(+r.toFixed(3)))});
  sv('circle',{cx:pl.X(vx),cy:pl.Y(vy),r:5.5,style:'fill:var(--pink);stroke:var(--chalk);stroke-width:1.5'},pl.s);
  if(D!==0)sv('text',{x:Math.max(40,Math.min(360,pl.X(vx)+9)),y:pl.Y(vy)+(a>0?20:-10),style:`fill:var(--pink);font-size:12.5px;font-weight:800;${HALO}`},pl.s,'vértice ('+fm(+vx.toFixed(3))+', '+fm(+vy.toFixed(3))+')');
  el('div','t-note',d).textContent='a '+(a>0?'> 0: la parábola abre hacia arriba (∪)':'< 0: la parábola abre hacia abajo (∩)')+' · eje de simetría x = '+fc(+vx.toFixed(3))+' · corta el eje y en '+fc(c);
  cap(d,it);reveal(d);return 2300},

/* ---------- tangent: de la secante a la tangente (derivada) ---------- */
tangent(it){
  const f=mkFn(it.f),x0=+it.x0;if(!f||!isFinite(x0)||!isFinite(ev(f,x0)))return sorry('No pude leer la función o no existe en ese punto.');
  let xa=isFinite(+it.xmin)&&it.xmin!=null?+it.xmin:x0-3,xb=isFinite(+it.xmax)&&it.xmax!=null?+it.xmax:x0+3;if(!(xb>xa)){xa=x0-3;xb=x0+3}
  const hs=arr(it.hs).map(Number).filter(h=>isFinite(h)&&h!==0).slice(0,5),H=hs.length?hs:[2,1,.5,.1],y0=ev(f,x0),m=(ev(f,x0+1e-5)-ev(f,x0-1e-5))/2e-5;
  if(!isFinite(m))return sorry('Esa función no tiene tangente definida en ese punto.');
  const rg=yrange(f,xa,xb,[y0]);if(!rg)return sorry('No pude graficar esa función en ese rango.');
  const d=put('t-fig'),pl=plot(d,xa,xb,rg[0],rg[1]);pl.curve(f,'var(--blue)',3.2);
  const line=(sl,c,w,op,dash)=>sv('line',{x1:pl.X(xa),y1:pl.Y(y0+sl*(xa-x0)),x2:pl.X(xb),y2:pl.Y(y0+sl*(xb-x0)),style:`stroke:${c};stroke-width:${w};opacity:${op};${dash?'stroke-dasharray:6 4':''}`},pl.g);
  const rows=[];H.forEach((h,k)=>{const y1=ev(f,x0+h);if(!isFinite(y1))return;const sl=(y1-y0)/h;rows.push([h,sl]);line(sl,k%2?'var(--yel)':'var(--chalk)',2,.75,true);sv('circle',{cx:pl.X(x0+h),cy:pl.Y(y1),r:3.6,style:'fill:var(--yel)'},pl.g)});
  line(m,'var(--pink)',3.8,1,false);sv('circle',{cx:pl.X(x0),cy:pl.Y(y0),r:6,style:'fill:var(--pink);stroke:var(--chalk);stroke-width:2'},pl.s);
  sv('text',{x:pl.X(x0)+9,y:pl.Y(y0)+(m>=0?18:-10),style:`fill:var(--pink);font-size:13px;font-weight:800;${HALO}`},pl.s,'P ('+fm(x0)+', '+fm(+y0.toFixed(3))+')');
  const q=x=>fc(+x.toFixed(4));
  rows.forEach(([h,sl])=>el('div','t-note',d).textContent='h = '+fc(h)+'  →  pendiente de la secante = (f(x₀+h) − f(x₀)) / h = '+fc(+sl.toFixed(4)));
  el('div','t-note',d).textContent='Cuando h → 0 la secante (punteada) se convierte en la tangente (rosa): pendiente f′('+fc(x0)+') ≈ '+fc(+m.toFixed(4));
  const b0=y0-m*x0,mt=Math.abs(m-1)<1e-9?'x':Math.abs(m+1)<1e-9?'−x':q(m)+'x';
  el('div','t-note',d).textContent='Recta tangente: y = '+q(m)+'·(x − '+PC(x0)+') + '+PC(+y0.toFixed(4))+'  =  '+(Math.abs(m)<1e-9?q(b0):mt+(Math.abs(b0)<1e-9?'':(b0<0?' − ':' + ')+q(Math.abs(b0))));
  cap(d,it);reveal(d);return 2300},

/* ---------- riemann: área bajo la curva con rectángulos ---------- */
riemann(it){
  const f=mkFn(it.f),a=+it.a,b=+it.b;if(!f||!isFinite(a)||!isFinite(b)||b<=a)return sorry('Necesito la función y un intervalo [a, b] con a < b.');
  const n=Math.max(1,Math.min(40,Math.round(+it.n)||4)),kind=/^r/i.test(String(it.kind))?'right':/^m/i.test(String(it.kind))?'mid':'left',dx=(b-a)/n,hs=[];
  for(let k=0;k<n;k++){const x=kind==='left'?a+k*dx:kind==='right'?a+(k+1)*dx:a+(k+.5)*dx,y=ev(f,x);if(!isFinite(y))return sorry('La función no está definida en todo ese intervalo.');hs.push(y)}
  const S=hs.reduce((p,q)=>p+q,0)*dx;let I=0;{const N=2000,h=(b-a)/N;for(let k=0;k<=N;k++){const y=ev(f,a+k*h),w=k===0||k===N?1:k%2?4:2;I+=w*(isFinite(y)?y:0)}I*=h/3}
  const pad=(b-a)*.12,xa=a-pad,xb=b+pad,rg=yrange(f,a,b,[0,...hs]);if(!rg)return sorry('No pude graficar esa función.');
  const d=put('t-fig'),pl=plot(d,xa,xb,Math.min(rg[0],-(rg[1]-rg[0])*.02),rg[1]);
  hs.forEach((y,k)=>{const x1=pl.X(a+k*dx),x2=pl.X(a+(k+1)*dx),y1=pl.Y(0),y2=pl.Y(y);sv('rect',{x:x1,y:Math.min(y1,y2),width:Math.max(0,x2-x1),height:Math.abs(y2-y1),style:'fill:var(--yel);fill-opacity:.28;stroke:var(--yel);stroke-width:1.6'},pl.g)});
  pl.curve(f,'var(--blue)',3.2);
  const t=el('div','t-note',d);t.textContent='Δx = (b − a) / n = ('+fc(b)+' − '+PC(a)+') / '+n+' = '+fc(+dx.toFixed(4))+' · rectángulos con la altura '+(kind==='left'?'del extremo izquierdo':kind==='right'?'del extremo derecho':'del punto medio');
  if(n<=8)el('div','t-note',d).textContent='Suma = Δx · ('+hs.map(y=>fc(+y.toFixed(3))).join(' + ')+') = '+fc(+S.toFixed(4));else el('div','t-note',d).textContent='Suma de las áreas de los '+n+' rectángulos ≈ '+fc(+S.toFixed(4));
  el('div','t-note',d).textContent='Área exacta bajo la curva ≈ '+fc(+I.toFixed(4))+' · error ≈ '+fc(+Math.abs(S-I).toFixed(4))+'. Con más rectángulos el error baja: esa es la idea de la integral.';
  cap(d,it);reveal(d);return 2200},

/* ---------- syllables: sílabas y acento (aguda, llana, esdrújula) ---------- */
syllables(it){
  const W=arr(it.words).slice(0,6).map(w=>({s:arr(w&&w.syl).map(x=>String(x)).filter(Boolean).slice(0,8),k:Math.round(+(w&&w.stress))})).filter(w=>w.s.length);
  if(!W.length)return sorry('Dame las palabras separadas en sílabas.');
  const d=put('t-syl');
  W.forEach((w,wi)=>{const row=dl(el('div','sy-w',d),wi,.6),n=w.s.length,k=isFinite(w.k)&&w.k>=0&&w.k<n?w.k:n-1,chips=el('div','sy-c',row);
    w.s.forEach((x,i)=>el('span','sy-s'+(i===k?' sy-t':''),chips,T(x)));
    const fromEnd=n-1-k,tipo=n===1?'monosílaba':fromEnd===0?'aguda':fromEnd===1?'llana':fromEnd===2?'esdrújula':'sobresdrújula',pos=['última','penúltima','antepenúltima'][fromEnd]||'anterior a la antepenúltima';
    el('div','sy-i',row,n+(n===1?' sílaba':' sílabas')+' · '+tipo+(n>1?' (la sílaba tónica es la '+pos+')':''))});
  el('div','t-note',d).textContent='Rosa = sílaba tónica (la que se pronuncia con más fuerza).';
  cap(d,it);reveal(d);return 900+W.length*600}
};
const old=Board.draw;
Board.draw=function(it){const f=it&&Object.prototype.hasOwnProperty.call(E,it.t)&&E[it.t];if(f){try{return f(it)}catch(e){console.warn('teach12',e);return 600}}return old.call(Board,it)};
window.LumiTeach12={types:Object.keys(E)};
})();
