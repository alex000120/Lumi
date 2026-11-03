/* Herramientas de enseñanza de Lumi · tanda 14: system, sequence, areas, motion, combin, interest, verb, rounding.
   Se enganchan a Board.draw encima de teach.js … teach12.js. Todo el texto de la IA se inserta como texto (nunca HTML). */
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
const grp=s=>s.replace(/\B(?=(\d{3})+(?!\d))/g,'\u00a0');
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


/* ---------- ayudantes propios de esta tanda ---------- */
const f4=v=>String(+(+v).toFixed(4)).replace('.',',');
const sg=v=>(v<0?'−':'')+f4(Math.abs(v));
const Pn=v=>v<0?'('+sg(v)+')':f4(v);
const SUB='₀₁₂₃₄₅₆₇₈₉',subn=n=>String(n).replace(/\d/g,c=>SUB[+c]);
const term=(c,v,first)=>{if(Math.abs(c)<1e-12)return'';const a=Math.abs(c),n=Math.abs(a-1)<1e-12?'':f4(a);return(c<0?(first?'−':' − '):(first?'':' + '))+n+v};
const fmtN=v=>{if(!isFinite(v))return'∞';if(Math.abs(v)>=1e12||(v!==0&&Math.abs(v)<1e-4)){const[m,x]=v.toExponential(3).split('e');return f4(+m)+' × 10'+supS(+x)}
  const s=f4(Math.abs(v)).split(',');return(v<0?'−':'')+grp(s[0])+(s[1]?','+s[1]:'')};
const money=(v,cur)=>{const s=Math.abs(v).toFixed(2).split('.');return(v<0?'−':'')+grp(s[0])+','+s[1]+(cur?' '+cur:'')};
const line=(par,txt,i,cls)=>dl(el('div','t13-l'+(cls?' '+cls:''),par,txt),i,.5);
const txtS=(s,max)=>String(s==null?'':s).slice(0,max||40);

const E={

/* ---------- system: sistema de dos ecuaciones lineales, método y gráfica ---------- */
system(it){
  const a1=+it.a1,b1=+it.b1,c1=+it.c1,a2=+it.a2,b2=+it.b2,c2=+it.c2;
  if([a1,b1,c1,a2,b2,c2].some(v=>!isFinite(v))||(!a1&&!b1)||(!a2&&!b2))return sorry('Necesito los seis números del sistema: a₁x + b₁y = c₁ y a₂x + b₂y = c₂.');
  const eq=(a,b,c)=>{const l=term(a,'x',true),y=term(b,'y',!l);return(l+y||'0')+' = '+sg(c)};
  const D=a1*b2-a2*b1,one=Math.abs(D)>1e-12,inf=!one&&Math.abs(a1*c2-a2*c1)<1e-9&&Math.abs(b1*c2-b2*c1)<1e-9;
  const X=one?(c1*b2-c2*b1)/D:0,Y=one?(a1*c2-a2*c1)/D:0;
  const d=put('t-fig'),top=el('div','t13-eq',d);
  el('div','',top,'①  '+eq(a1,b1,c1));el('div','',top,'②  '+eq(a2,b2,c2));
  const xa=one?Math.min(-3,X-3):-8,xb=one?Math.max(3,X+3):8,ya=one?Math.min(-3,Y-3):-8,yb=one?Math.max(3,Y+3):8;
  const pl=plot(d,xa,xb,ya,yb);
  const ln=(a,b,c,col,dash)=>{const st=`stroke:${col};stroke-width:3;stroke-linecap:round${dash?';stroke-dasharray:7 6':''}`;
    if(Math.abs(b)>1e-12){const f=x=>(c-a*x)/b;sv('line',{x1:pl.X(xa),y1:pl.Y(f(xa)),x2:pl.X(xb),y2:pl.Y(f(xb)),style:st},pl.g)}
    else{const x=c/a;sv('line',{x1:pl.X(x),y1:pl.Y(ya),x2:pl.X(x),y2:pl.Y(yb),style:st},pl.g)}};
  ln(a1,b1,c1,'var(--blue)');ln(a2,b2,c2,'var(--yel)',inf);
  if(one){const px=pl.X(X),py=pl.Y(Y);sv('circle',{cx:px,cy:py,r:6,style:'fill:var(--pink);stroke:var(--chalk);stroke-width:1.5'},pl.s);
    sv('text',{x:Math.max(50,Math.min(350,px)),y:Math.max(18,py-11),'text-anchor':'middle',style:HALO+'fill:var(--pink);font-size:15px;font-weight:700'},pl.s,'('+f4(X)+', '+f4(Y)+')')}
  let i=0;
  if(one){
    const nx=c1*b2-c2*b1;
    line(d,'Elimino y: ① × '+Pn(b2)+'  y  ② × '+Pn(b1)+', y resto.',i++);
    line(d,'('+Pn(a1)+'·'+Pn(b2)+' − '+Pn(a2)+'·'+Pn(b1)+')·x = '+Pn(c1)+'·'+Pn(b2)+' − '+Pn(c2)+'·'+Pn(b1),i++);
    line(d,f4(D)+'·x = '+sg(nx)+'   →   x = '+sg(X),i++,'t13-y');
    if(Math.abs(b1)>1e-12)line(d,'Sustituyo x en ①:  '+Pn(a1)+'·'+Pn(X)+' + '+Pn(b1)+'·y = '+Pn(c1)+'   →   y = '+sg(Y),i++,'t13-y');
    else line(d,'Sustituyo x en ②:  '+Pn(a2)+'·'+Pn(X)+' + '+Pn(b2)+'·y = '+Pn(c2)+'   →   y = '+sg(Y),i++,'t13-y');
    line(d,'Compruebo ①: '+Pn(a1)+'·'+Pn(X)+' + '+Pn(b1)+'·'+Pn(Y)+' = '+sg(+(a1*X+b1*Y).toFixed(4))+' ✓',i++);
    line(d,'Las rectas se cortan en un punto: sistema compatible determinado (una sola solución).',i++,'t13-r');
  }else if(inf)line(d,'Las dos ecuaciones dibujan la MISMA recta: infinitas soluciones (compatible indeterminado).',i++,'t13-r');
  else line(d,'Las rectas son paralelas (misma pendiente, distinto desplazamiento): no se cortan, no hay solución (incompatible).',i++,'t13-r');
  cap(d,it);reveal(d);return 1800+i*600},

/* ---------- sequence: sucesiones aritméticas y geométricas ---------- */
sequence(it){
  const geo=/^g/i.test(String(it.kind)),a1=+it.a1,q=geo?+it.r:+it.d,n=Math.max(2,Math.min(12,Math.round(+it.n)||6));
  if(!isFinite(a1)||!isFinite(q))return sorry('Necesito el primer término y '+(geo?'la razón r.':'la diferencia d.'));
  const at=k=>geo?a1*Math.pow(q,k):a1+k*q;
  const d=put('t-seq'),row=el('div','sq-row',d);
  for(let k=0;k<n;k++){if(k){const a=dl(el('span','sq-a',row),k,.25);el('small','',a,geo?'×'+Pn(q):(q<0?'−':'+')+f4(Math.abs(q)));el('span','',a,'→')}
    const c=dl(el('span','sq-t',row),k,.25);el('small','',c,'a'+subn(k+1));el('b','',c,fmtN(at(k)))}
  let i=0;const box=el('div','',d);
  line(box,geo?'Cada término es el anterior × '+Pn(q)+'  (razón r = '+f4(q)+')':'Cada término es el anterior '+(q<0?'−':'+')+' '+f4(Math.abs(q))+'  (diferencia d = '+sg(q)+')',i++);
  if(geo)line(box,'aₙ = a₁·rⁿ⁻¹ = '+Pn(a1)+'·'+Pn(q)+'ⁿ⁻¹',i++,'t13-y');
  else{const c0=a1-q,tx=Math.abs(q)<1e-12?sg(a1):term(q,'n',true)+(Math.abs(c0)<1e-12?'':(c0<0?' − ':' + ')+f4(Math.abs(c0)));
    line(box,'aₙ = a₁ + (n − 1)·d = '+Pn(a1)+' + (n − 1)·'+Pn(q)+'  =  '+tx,i++,'t13-y')}
  const fk=Math.round(+it.find);
  if(isFinite(fk)&&fk>=1&&fk<=(geo?60:1000)&&it.find!=null)line(box,'a'+subn(fk)+' = '+(geo?Pn(a1)+'·'+Pn(q)+'^'+(fk-1):Pn(a1)+' + '+(fk-1)+'·'+Pn(q))+' = '+fmtN(at(fk-1)),i++,'t13-y');
  let S=0;for(let k=0;k<n;k++)S+=at(k);
  line(box,'Suma de los '+n+' primeros: '+(geo?(Math.abs(q-1)<1e-12?'Sₙ = n·a₁':'Sₙ = a₁·(rⁿ − 1)/(r − 1)'):'Sₙ = (a₁ + aₙ)·n/2')+' = '+fmtN(S),i++);
  if(geo&&Math.abs(q)<1)line(box,'Como |r| < 1, la suma infinita converge: S∞ = a₁/(1 − r) = '+fmtN(a1/(1-q)),i++,'t13-r');
  cap(d,it);reveal(d);return 1500+n*250+i*400},

/* ---------- areas: área y perímetro de figuras planas con su dibujo ---------- */
areas(it){
  const s0=String(it.shape||'').toLowerCase(),dm=it.dims&&typeof it.dims==='object'?it.dims:{},u=txtS(it.unit,6)||'u';
  const g=k=>{const v=+dm[k];return isFinite(v)&&v>0?v:NaN},opt=k=>{const v=+dm[k];return isFinite(v)&&v>0?v:null};
  const kind=/^rect/.test(s0)?'rect':/^(sq|cuad)/.test(s0)?'square':/^tri/.test(s0)?'tri':/^(circ|círc)/.test(s0)?'circle':/^trap/.test(s0)?'trap':/^para/.test(s0)?'para':/^(romb|rhom)/.test(s0)?'rhombus':'';
  if(!kind)return sorry('Dime la figura: rectángulo, cuadrado, triángulo, círculo, trapecio, paralelogramo o rombo.');
  const need={rect:['b','h'],square:['l'],tri:['b','h'],circle:['r'],trap:['B','b','h'],para:['b','h'],rhombus:['D','d']}[kind];
  if(need.some(k=>isNaN(g(k))))return sorry('Para esa figura necesito: '+need.join(', ')+' (números positivos).');
  const v={};need.forEach(k=>v[k]=g(k));
  const d=put('t-fig'),s=sv('svg',{viewBox:'0 0 400 230',class:'graph'},d);
  let pts,w,h,lab=[],dash=[];
  if(kind==='rect'){w=v.b;h=v.h;pts=[[0,0],[w,0],[w,h],[0,h]];lab=[[w/2,h,0,22,'b = '+fc(v.b)+' '+u],[w,h/2,10,5,'h = '+fc(v.h)+' '+u,'start']]}
  else if(kind==='square'){w=h=v.l;pts=[[0,0],[w,0],[w,h],[0,h]];lab=[[w/2,h,0,22,'l = '+fc(v.l)+' '+u],[w,h/2,10,5,'l','start']]}
  else if(kind==='tri'){w=v.b;h=v.h;const ax=w*.35;pts=[[0,h],[w,h],[ax,0]];dash=[[ax,0,ax,h]];lab=[[w/2,h,0,22,'b = '+fc(v.b)+' '+u],[ax,h/2,6,5,'h = '+fc(v.h)+' '+u,'start']]}
  else if(kind==='para'){const off=v.b*.25;w=v.b+off;h=v.h;pts=[[off,0],[off+v.b,0],[v.b,h],[0,h]];dash=[[off,0,off,h]];lab=[[v.b/2,h,0,22,'b = '+fc(v.b)+' '+u],[off,h/2,6,5,'h = '+fc(v.h)+' '+u,'start']]}
  else if(kind==='trap'){w=v.B;h=v.h;const off=(v.B-v.b)/2;pts=[[off,0],[off+v.b,0],[v.B,h],[0,h]];dash=[[off,0,off,h]];lab=[[v.B/2,h,0,22,'B = '+fc(v.B)+' '+u],[off+v.b/2,0,0,-8,'b = '+fc(v.b)+' '+u],[off,h/2,6,5,'h = '+fc(v.h)+' '+u,'start']]}
  else if(kind==='rhombus'){w=v.D;h=v.d;pts=[[w/2,0],[w,h/2],[w/2,h],[0,h/2]];dash=[[0,h/2,w,h/2],[w/2,0,w/2,h]];lab=[[w*.75,h/2,0,-6,'D = '+fc(v.D)+' '+u],[w/2,h*.2,6,5,'d = '+fc(v.d)+' '+u,'start']]}
  else{w=h=2*v.r;lab=[[v.r*1.5,v.r,0,-6,'r = '+fc(v.r)+' '+u]]}
  const sc=Math.min(260/w,140/h),ox=(400-w*sc)/2,oy=(230-h*sc)/2-4,tx=x=>ox+x*sc,ty=y=>oy+y*sc;
  if(kind==='circle'){sv('circle',{cx:tx(v.r),cy:ty(v.r),r:v.r*sc,style:'fill:var(--blue);fill-opacity:.2;stroke:var(--blue);stroke-width:3'},s);dash=[[v.r,v.r,w,v.r]];sv('circle',{cx:tx(v.r),cy:ty(v.r),r:3.5,style:'fill:var(--pink)'},s)}
  else sv('polygon',{points:pts.map(p=>tx(p[0]).toFixed(1)+','+ty(p[1]).toFixed(1)).join(' '),style:'fill:var(--blue);fill-opacity:.2;stroke:var(--blue);stroke-width:3;stroke-linejoin:round'},s);
  dash.forEach(l=>sv('line',{x1:tx(l[0]),y1:ty(l[1]),x2:tx(l[2]),y2:ty(l[3]),style:'stroke:var(--pink);stroke-width:2.2;stroke-dasharray:6 5'},s));
  lab.forEach(l=>sv('text',{x:tx(l[0])+l[2],y:ty(l[1])+l[3],'text-anchor':l[5]||'middle',style:HALO+'fill:var(--yel);font-size:16px;font-weight:700'},s,l[4]));
  const A=({rect:v.b*v.h,square:v.l*v.l,tri:v.b*v.h/2,circle:Math.PI*v.r*v.r,trap:(v.B+v.b)*v.h/2,para:v.b*v.h,rhombus:v.D*v.d/2})[kind];
  const I=[];
  const nm={rect:'Rectángulo',square:'Cuadrado',tri:'Triángulo',circle:'Círculo',trap:'Trapecio',para:'Paralelogramo',rhombus:'Rombo'}[kind];
  const aT={rect:'A = b · h = '+fc(v.b)+' · '+fc(v.h),square:'A = l² = '+fc(v.l)+'²',tri:'A = b · h / 2 = '+fc(v.b)+' · '+fc(v.h)+' / 2',circle:'A = π · r² = π · '+fc(v.r)+'²',trap:'A = (B + b) · h / 2 = ('+fc(v.B)+' + '+fc(v.b)+') · '+fc(v.h)+' / 2',para:'A = b · h = '+fc(v.b)+' · '+fc(v.h),rhombus:'A = D · d / 2 = '+fc(v.D)+' · '+fc(v.d)+' / 2'}[kind];
  I.push(aT+(kind==='circle'?' ≈ ':' = ')+fc(A)+' '+u+'²');
  let Pm=null,pT='';
  if(kind==='rect'){Pm=2*(v.b+v.h);pT='P = 2·(b + h) = 2·('+fc(v.b)+' + '+fc(v.h)+')'}
  else if(kind==='square'){Pm=4*v.l;pT='P = 4 · l = 4 · '+fc(v.l)}
  else if(kind==='circle'){Pm=2*Math.PI*v.r;pT='Longitud de la circunferencia: C = 2 · π · r = 2 · π · '+fc(v.r)}
  else if(kind==='rhombus'){const l=Math.sqrt((v.D/2)**2+(v.d/2)**2);Pm=4*l;pT='Lado: l = √((D/2)² + (d/2)²) = '+fc(l)+'  →  P = 4 · l'}
  else if(kind==='tri'){const a=opt('s1'),c=opt('s2');if(a&&c){Pm=v.b+a+c;pT='P = b + lado₁ + lado₂ = '+fc(v.b)+' + '+fc(a)+' + '+fc(c)}}
  else if(kind==='para'){const a=opt('s');if(a){Pm=2*(v.b+a);pT='P = 2·(b + lado) = 2·('+fc(v.b)+' + '+fc(a)+')'}}
  else if(kind==='trap'){const a=opt('s1'),c=opt('s2');if(a&&c){Pm=v.B+v.b+a+c;pT='P = B + b + lado₁ + lado₂ = '+fc(v.B)+' + '+fc(v.b)+' + '+fc(a)+' + '+fc(c)}}
  if(Pm!=null)I.push(pT+(kind==='circle'?' ≈ ':' = ')+fc(Pm)+' '+u);
  else I.push('Para el perímetro haría falta medir también los otros lados.');
  el('div','t13-h',d,nm);
  I.forEach((t,i)=>line(d,t,i+1,i===0?'t13-y':''));
  el('div','t-note',d).textContent='El área se mide en '+u+'² (cuadraditos) y el perímetro en '+u+' (el contorno).';
  cap(d,it);reveal(d);return 1800},

/* ---------- motion: MRU y MRUA con gráficas x–t y v–t ---------- */
motion(it){
  const a=+it.a||0,mrua=/mrua|acel|var/i.test(String(it.kind))||(a!==0&&!/^mru$/i.test(String(it.kind||'').trim())),aa=mrua?a:0;
  const x0=isFinite(+it.x0)?+it.x0:0,v0=isFinite(+(it.v0!=null?it.v0:it.v))?+(it.v0!=null?it.v0:it.v):0;
  const tm=Math.max(2,Math.min(60,+it.tmax||10)),ux=txtS(it.ux,6)||'m',ut=txtS(it.ut,6)||'s';
  if(mrua&&!aa&&!v0)return sorry('Necesito la velocidad inicial y la aceleración.');
  const xf=t=>x0+v0*t+.5*aa*t*t,vf=t=>v0+aa*t;
  const d=put('t-fig');
  const rg=(f,ex)=>{const r=yrange(f,0,tm,ex);return r||[-1,1]};
  el('div','t13-h',d,'Posición x(t)  ['+ux+']');
  let r1=rg(xf,[x0]),p1=plot(d,0,tm,r1[0],r1[1]);p1.curve(xf,'var(--blue)',3.4);
  sv('circle',{cx:p1.X(tm),cy:p1.Y(xf(tm)),r:5,style:'fill:var(--pink)'},p1.g);
  el('div','t13-h',d,'Velocidad v(t)  ['+ux+'/'+ut+']');
  let r2=rg(vf,[0]),p2=plot(d,0,tm,r2[0],r2[1]);p2.curve(vf,'var(--yel)',3.4);
  sv('circle',{cx:p2.X(tm),cy:p2.Y(vf(tm)),r:5,style:'fill:var(--pink)'},p2.g);
  let i=0;
  if(mrua){line(d,'x(t) = x₀ + v₀·t + ½·a·t² = '+sg(x0)+' + '+Pn(v0)+'·t + ½·'+Pn(aa)+'·t²',i++,'t13-y');line(d,'v(t) = v₀ + a·t = '+sg(v0)+' + '+Pn(aa)+'·t',i++,'t13-y')}
  else{line(d,'x(t) = x₀ + v·t = '+sg(x0)+' + '+Pn(v0)+'·t',i++,'t13-y');line(d,'v(t) = '+sg(v0)+' '+ux+'/'+ut+'  (constante: no acelera)',i++,'t13-y')}
  line(d,'En t = '+f4(tm)+' '+ut+':  x = '+sg(+xf(tm).toFixed(4))+' '+ux+'   v = '+sg(+vf(tm).toFixed(4))+' '+ux+'/'+ut,i++);
  line(d,'Pendiente de x–t = velocidad ·  área bajo v–t = desplazamiento = '+sg(+(xf(tm)-x0).toFixed(4))+' '+ux,i++,'t13-r');
  cap(d,it);reveal(d);return 2200+i*400},

/* ---------- combin: variaciones, combinaciones y con repetición ---------- */
combin(it){
  const ks=String(it.kind||'perm').toLowerCase(),kind=/^rep|^v.*rep/.test(ks)?'rep':/^c/.test(ks)?'comb':'perm';
  const n=Math.round(+it.n);let r=Math.round(+(it.r!=null?it.r:it.n));
  if(!isFinite(n)||n<1||n>20||!isFinite(r)||r<1||(kind!=='rep'&&r>n)||(kind==='rep'&&r>8))return sorry('Necesito n entre 1 y 20 y r (cuántos eliges, r ≤ n; con repetición r ≤ 8).');
  const F=k=>{let x=1n;for(let j=2n;j<=BigInt(k);j++)x*=j;return x};
  const total=kind==='rep'?BigInt(n)**BigInt(r):kind==='perm'?F(n)/F(n-r):F(n)/(F(r)*F(n-r));
  const fac=(from,cnt)=>{const a=[];for(let j=0;j<cnt&&j<6;j++)a.push(from-j);return a.join('·')+(cnt>6?'·…':'')};
  const d=put('t-cmb');
  el('div','t13-h',d,({perm:'Variaciones: el orden SÍ importa y no se repite',comb:'Combinaciones: el orden NO importa',rep:'Variaciones con repetición: el orden importa y se puede repetir'})[kind]);
  let i=0;
  if(kind==='perm'){line(d,'V('+n+', '+r+') = n! / (n − r)! = '+n+'! / '+(n-r)+'!',i++);line(d,'= '+fac(n,r)+' = '+grp(String(total)),i++,'t13-y')}
  else if(kind==='comb'){line(d,'C('+n+', '+r+') = n! / (r! · (n − r)!) = '+n+'! / ('+r+'! · '+(n-r)+'!)',i++);line(d,'= ('+fac(n,r)+') / ('+fac(r,r)+') = '+grp(String(total)),i++,'t13-y')}
  else{line(d,'VR('+n+', '+r+') = nʳ = '+n+sup(r),i++);line(d,'= '+Array(r).fill(n).join('·')+' = '+grp(String(total)),i++,'t13-y')}
  if(n<=6&&total<=40n){
    const L='ABCDEF'.split(''),raw=arr(it.items).map(x=>clip(x,10)).filter(Boolean).slice(0,n);const items=L.slice(0,n).map((c,j)=>raw[j]||c);
    const out=[];
    if(kind==='perm'){const rec=(cur,used)=>{if(cur.length===r){out.push(cur.slice());return}for(let j=0;j<n;j++)if(!used[j]){used[j]=1;cur.push(items[j]);rec(cur,used);cur.pop();used[j]=0}};rec([],[])}
    else if(kind==='comb'){const rec=(s,cur)=>{if(cur.length===r){out.push(cur.slice());return}for(let j=s;j<n;j++){cur.push(items[j]);rec(j+1,cur);cur.pop()}};rec(0,[])}
    else{const rec=cur=>{if(cur.length===r){out.push(cur.slice());return}for(let j=0;j<n;j++){cur.push(items[j]);rec(cur);cur.pop()}};rec([])}
    const sep=items.every(x=>x.length===1)?'':' ',box=el('div','cb-g',d);
    out.forEach((c,j)=>dl(el('span','cb-c',box,c.join(sep)),j,.07));
    el('div','t-note',d).textContent='Aquí están las '+out.length+' posibilidades, una por una.';
  }
  cap(d,it);reveal(d);return 1800+i*500},

/* ---------- interest: interés simple vs compuesto ---------- */
interest(it){
  const C=+it.capital,rate=+it.rate,Y=Math.max(1,Math.min(40,Math.round(+it.years)||5)),cur=txtS(it.cur,5);
  if(!isFinite(C)||C<=0||!isFinite(rate)||rate<0||rate>100)return sorry('Necesito el capital (mayor que 0) y la tasa anual en % (de 0 a 100).');
  const ks=String(it.kind||'both').toLowerCase(),sh={s:/^s/.test(ks),c:/^c/.test(ks)},both=!sh.s&&!sh.c,i1=rate/100;
  const S=t=>C*(1+i1*t),M=t=>C*Math.pow(1+i1,t);
  const d=put('t-fig');
  const hi0=Math.max(both||sh.s?S(Y):0,both||sh.c?M(Y):0),hi=hi0-C<1e-9?C*1.1+1:hi0,pd=(hi-C)*.1;
  const pl=plot(d,0,Y,C-pd,hi+pd);
  if(both||sh.s)pl.curve(S,'var(--blue)',3.4);
  if(both||sh.c)pl.curve(M,'var(--yel)',3.4);
  const lg=el('div','t13-lg',d);if(both||sh.s)el('span','t13-b',lg,'● simple');if(both||sh.c)el('span','t13-yy',lg,'● compuesto');
  let i=0;
  if(both||sh.s)line(d,'Simple:  M = C·(1 + r·t) = '+money(C)+'·(1 + '+f4(i1)+'·'+Y+') = '+money(S(Y),cur),i++);
  if(both||sh.c)line(d,'Compuesto:  M = C·(1 + r)ᵗ = '+money(C)+'·(1 + '+f4(i1)+')'+sup(Y)+' = '+money(M(Y),cur),i++,'t13-y');
  const rows=[];for(let t=1;t<=Math.min(Y,5);t++)rows.push(t);if(Y>5)rows.push(Y);
  rows.forEach(t=>line(d,'Año '+t+':'+(both||sh.s?'  simple '+money(S(t)):'')+(both||sh.c?'  ·  compuesto '+money(M(t)):''),i++,'t13-m'));
  if(both)line(d,'Con el compuesto ganas '+money(M(Y)-S(Y),cur)+' más: los intereses también generan intereses.',i++,'t13-r');
  cap(d,it);reveal(d);return 2000+i*350},

/* ---------- verb: conjugación con raíz y terminación resaltadas ---------- */
verb(it){
  const F=arr(it.forms).slice(0,8).map(f=>({p:txtS(f&&f.p,14),stem:txtS(f&&f.stem,20),end:txtS(f&&f.end,14),form:txtS(f&&f.form,30),irr:!!(f&&f.irr)})).filter(f=>f.stem||f.end||f.form);
  if(!F.length)return sorry('Dame las formas del verbo (persona, raíz y terminación).');
  const d=put('t-vb');
  el('div','vb-v',d,T(txtS(it.verb,30)||'verbo'));
  if(it.tense)el('div','vb-t',d,T(txtS(it.tense,60)));
  const tb=el('div','vb-tb',d);
  F.forEach((f,j)=>{const r=dl(el('div','vb-r'+(f.irr?' irr':''),tb),j,.35);el('span','vb-p',r,T(f.p));const w=el('span','vb-f',r);
    if(f.stem||f.end){el('span','vb-s',w,T(f.stem));el('span','vb-e',w,T(f.end))}else w.textContent=T(f.form)});
  el('div','t-note',d).textContent='La raíz casi no cambia · la terminación (en color) sí'+(F.some(f=>f.irr)?' · recuadro = forma irregular':'');
  if(it.note){const n=el('div','t-note',d);rich(n,it.note)}
  cap(d,it);reveal(d);return 1000+F.length*350},

/* ---------- rounding: redondeo sobre la recta numérica ---------- */
rounding(it){
  const raw=String(it.n==null?'':it.n).trim().replace(',','.'),n=parseFloat(raw),p=Math.max(-4,Math.min(4,Math.round(+it.to)||0));
  if(!isFinite(n)||n<0||raw.length>14)return sorry('Dame un número positivo para redondear (y a qué cifra: unidades, décimas, centenas…).');
  const NM={'-4':'decenas de millar','-3':'unidades de millar','-2':'centenas','-1':'decenas','0':'unidades','1':'décimas','2':'centésimas','3':'milésimas','4':'diezmilésimas'};
  const step=Math.pow(10,-p),k=p+1,sc=Math.floor((k>=0?n*Math.pow(10,k):n/Math.pow(10,-k))+1e-9),dg=sc%10;
  const cl=v=>+v.toFixed(Math.max(0,p)),fl=cl(Math.floor(sc/10)*step),up=cl(fl+step),res=dg>=5?up:fl;
  const fmtP=v=>p>0?v.toFixed(p).replace('.',','):grp(String(Math.round(v)));
  const d=put('t-fig'),s=sv('svg',{viewBox:'0 0 400 160',class:'graph'},d);
  const X0=40,X1=360,xn=X0+Math.max(0,Math.min(1,(n-fl)/step))*(X1-X0),yb=95;
  sv('line',{x1:X0-12,y1:yb,x2:X1+12,y2:yb,style:'stroke:var(--chalk);stroke-width:2.4'},s);
  for(let j=0;j<=10;j++){const x=X0+j*(X1-X0)/10,big=j===0||j===10||j===5;sv('line',{x1:x,y1:yb-(big?12:6),x2:x,y2:yb+(big?12:6),style:'stroke:var(--chalk);stroke-width:'+(big?2.4:1.3)},s)}
  [[X0,fmtP(fl)],[X1,fmtP(up)]].forEach(a=>sv('text',{x:a[0],y:yb+32,'text-anchor':'middle',style:'fill:var(--chalk);font-size:19px;font-weight:700'},s,a[1]));
  sv('text',{x:200,y:yb+32,'text-anchor':'middle',style:'fill:var(--chalk);opacity:.7;font-size:14px'},s,'mitad');
  const tgt=dg>=5?X1:X0;
  if(Math.abs(tgt-xn)>6){sv('path',{d:`M${xn} ${yb-18} Q${(xn+tgt)/2} ${yb-72} ${tgt} ${yb-18}`,style:'fill:none;stroke:var(--yel);stroke-width:3;stroke-dasharray:7 5;stroke-linecap:round'},s);
    sv('polygon',{points:`${tgt},${yb-14} ${tgt-7},${yb-27} ${tgt+7},${yb-27}`,style:'fill:var(--yel)'},s)}
  sv('circle',{cx:xn,cy:yb,r:7,style:'fill:var(--pink);stroke:var(--chalk);stroke-width:1.5'},s);
  sv('text',{x:Math.max(50,Math.min(350,xn)),y:yb-30,'text-anchor':'middle',style:HALO+'fill:var(--pink);font-size:17px;font-weight:700'},s,raw.replace('.',','));
  let i=0;
  line(d,'Redondear a las '+NM[p]+':  está entre '+fmtP(fl)+' y '+fmtP(up),i++);
  line(d,'Miro la cifra siguiente'+(NM[p+1]?' ('+NM[p+1]+')':'')+':  es un '+dg,i++);
  line(d,dg>=5?'5 o más → SUBE al siguiente: '+fmtP(up):'Menos de 5 → se QUEDA abajo: '+fmtP(fl),i++,'t13-y');
  line(d,raw.replace('.',',')+'  ≈  '+fmtP(res),i++,'t13-r');
  cap(d,it);reveal(d);return 1800+i*500}
};
const old=Board.draw;
Board.draw=function(it){const f=it&&Object.prototype.hasOwnProperty.call(E,it.t)&&E[it.t];if(f){try{return f(it)}catch(e){console.warn('teach13',e);return 600}}return old.call(Board,it)};
window.LumiTeach13={types:Object.keys(E)};
})();
