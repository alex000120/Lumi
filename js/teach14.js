/* Herramientas de enseñanza de Lumi · tanda 15: periodic, histogram, fracop, energy, complex.
   Se enganchan a Board.draw encima de teach.js … teach13.js. Todo el texto de la IA se inserta como texto (nunca HTML). */
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


const lraw=(n,d)=>d===1?String(n):(n<0?'-':'')+'\\frac{'+Math.abs(n)+'}{'+d+'}';
const lf=(n,d)=>{if(d<0){n=-n;d=-d}const g=gcd(n,d)||1;return lraw(n/g,d/g)};
const lcm=(a,b)=>Math.abs(a*b)/(gcd(a,b)||1);
const nk=s=>String(s==null?'':s).normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^A-Za-z0-9]/g,'').toLowerCase();
const cx=(re,im)=>{const r=fm(+re.toFixed(4)),i=Math.abs(+im.toFixed(4)),is=(i===1?'':fm(i))+'i';if(!i)return r;if(!+re.toFixed(4))return (im<0?'−':'')+is;return r+(im<0?' − ':' + ')+is};

/* ---------- periodic: tabla periódica completa con familias, grupos y períodos ---------- */
const SY='H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr Rf Db Sg Bh Hs Mt Ds Rg Cn Nh Fl Mc Lv Ts Og'.split(' ');
const FAM=[['alkali','Alcalinos','#ef5350',[3,11,19,37,55,87]],['alkaline','Alcalinotérreos','#ff9800',[4,12,20,38,56,88]],['transition','Transición','#42a5f5',[...Array(10)].map((_,i)=>21+i).concat([...Array(10)].map((_,i)=>39+i),[...Array(9)].map((_,i)=>72+i),[...Array(9)].map((_,i)=>104+i))],
  ['post','Otros metales','#26a69a',[13,31,49,50,81,82,83,84,113,114,115,116]],['metalloid','Metaloides','#9ccc65',[5,14,32,33,51,52]],['nonmetal','No metales','#ffd54f',[1,6,7,8,15,16,34]],
  ['halogen','Halógenos','#ab47bc',[9,17,35,53,85,117]],['noble','Gases nobles','#ec407a',[2,10,18,36,54,86,118]],['lanth','Lantánidos','#8d6e63',[...Array(15)].map((_,i)=>57+i)],['actin','Actínidos','#bcaaa4',[...Array(15)].map((_,i)=>89+i)]];
const FOF={};FAM.forEach(f=>f[3].forEach(z=>{FOF[z]=f}));
const FALIAS={alcalinos:'alkali',metalesalcalinos:'alkali',alcalinoterreos:'alkaline',alcalinoterros:'alkaline',transicion:'transition',metalesdetransicion:'transition',otrosmetales:'post',postransicion:'post',posttransicion:'post',metaloides:'metalloid',nometales:'nonmetal',halogenos:'halogen',gasesnobles:'noble',nobles:'noble',lantanidos:'lanth',actinidos:'actin'};
function ppos(z){
  if(z===1)return[0,0];if(z===2)return[17,0];
  if(z<=4)return[z-3,1];if(z<=10)return[12+z-5,1];
  if(z<=12)return[z-11,2];if(z<=18)return[12+z-13,2];
  if(z<=36)return[z-19,3];if(z<=54)return[z-37,4];
  if(z<=56)return[z-55,5];if(z<=71)return[z-57+2,8];if(z<=86)return[3+z-72,5];
  if(z<=88)return[z-87,6];if(z<=103)return[z-89+2,9];return[3+z-104,6]}

const E={
periodic(it){
  const hl=new Set(),flt=[...arr(it.highlight)];let any=false;
  flt.forEach(h=>{const t=typeof h==='number'?h:String(h).trim(),k=nk(t);
    if(typeof t==='number'||/^\d+$/.test(String(t))){const z=+t;if(z>=1&&z<=118){hl.add(z);any=true}return}
    const sy=SY.indexOf(String(t));if(sy>=0){hl.add(sy+1);any=true;return}
    if(k==='metales'){FAM.slice(0,4).concat([FAM[8],FAM[9]]).forEach(f=>f[3].forEach(z=>hl.add(z)));any=true;return}
    const fid=FALIAS[k]||(FAM.find(f=>f[0]===k)||[])[0];const f=FAM.find(x=>x[0]===fid);if(f){f[3].forEach(z=>hl.add(z));any=true}});
  const g=Math.round(+it.group),pr=Math.round(+it.period);
  if(g>=1&&g<=18){for(let z=1;z<=118;z++){const p=ppos(z);if(p[0]===g-1&&p[1]<7){hl.add(z);any=true}}}
  if(pr>=1&&pr<=7){for(let z=1;z<=118;z++){const p=ppos(z);if(p[1]===pr-1||(pr===6&&p[1]===8)||(pr===7&&p[1]===9)){hl.add(z);any=true}}}
  const show=it.legend!==false,d=put('t-fig'),cell=21.5,x0=8,y0=22,s=sv('svg',{viewBox:'0 0 400 255',class:'graph'},d);
  for(let c=0;c<18;c++)sv('text',{x:x0+c*cell+cell/2,y:15,'text-anchor':'middle',style:'fill:var(--chalk);font-size:9px;opacity:.75'},s,String(c+1));
  for(let r=0;r<7;r++)sv('text',{x:3,y:y0+r*cell+cell/2+3,style:'fill:var(--chalk);font-size:8px;opacity:.75'},s,String(r+1));
  for(let z=1;z<=118;z++){const p=ppos(z),f=FOF[z],x=x0+p[0]*cell,y=y0+p[1]*cell+(p[1]>=8?8:0),on=!any||hl.has(z);
    sv('rect',{x,y,width:cell-1.6,height:cell-1.6,rx:3,style:`fill:${f[2]};fill-opacity:${on?.55:.09};stroke:${f[2]};stroke-opacity:${on?1:.25};stroke-width:${any&&on?2.2:1}`},s);
    sv('text',{x:x+(cell-1.6)/2,y:y+(cell-1.6)/2+3.3,'text-anchor':'middle',style:`fill:var(--chalk);font-size:${SY[z-1].length>1?8.4:9.4}px;font-weight:${any&&on?800:600};opacity:${on?1:.35}`},s,SY[z-1])}
  [[5,'57–71'],[6,'89–103']].forEach(([r,t])=>{const x=x0+2*cell,y=y0+r*cell;sv('rect',{x,y,width:cell-1.6,height:cell-1.6,rx:3,style:'fill:none;stroke:var(--chalk);stroke-opacity:.4;stroke-dasharray:2 2'},s);sv('text',{x:x+(cell-1.6)/2,y:y+(cell-1.6)/2+2.5,'text-anchor':'middle',style:'fill:var(--chalk);font-size:5.6px;opacity:.7'},s,t)});
  if(show){const lg=el('div','pt-lg',d);FAM.forEach(f=>{const c=el('span','pt-k',lg);c.style.setProperty('--pk',f[2]);c.textContent=f[1]})}
  if(any&&hl.size&&hl.size<=14)el('div','t-note',d).textContent=[...hl].sort((a,b)=>a-b).map(z=>SY[z-1]+' (Z = '+z+')').join(' · ');
  else if(any)el('div','t-note',d).textContent='Resaltados: '+hl.size+' elementos.';
  el('div','t-note',d).textContent='Columnas = grupos (1 a 18) · filas = períodos (1 a 7) · el número atómico Z crece de izquierda a derecha.';
  cap(d,it);reveal(d);return 1900},

/* ---------- histogram: datos agrupados en intervalos ---------- */
histogram(it){
  const V=arr(it.values).map(Number).filter(isFinite).slice(0,80);if(V.length<3)return sorry('Dame al menos 3 datos numéricos.');
  const mn=Math.min(...V),mx=Math.max(...V);if(mx===mn)return sorry('Todos los datos son iguales: no hay nada que agrupar.');
  let k=Math.round(+it.bins)||Math.ceil(Math.log2(V.length))+1;k=Math.max(2,Math.min(10,k));let w=+it.width;
  if(!(w>0)){const raw=(mx-mn)/k,p=Math.pow(10,Math.floor(Math.log10(raw))),q=raw/p;w=(q<=1?1:q<=2?2:q<=5?5:10)*p}
  const lo=Math.floor(mn/w+1e-9)*w;k=Math.floor((mx-lo)/w+1e-9)+1;if(k>20)return sorry('Con ese ancho salen demasiados intervalos; usa uno más grande.');
  const cnt=Array(k).fill(0);V.forEach(x=>{cnt[Math.min(k-1,Math.floor((x-lo)/w+1e-9))]++});
  const d=put('t-fig'),s=sv('svg',{viewBox:'0 0 400 230',class:'graph'},d),W=340,x0=40,bw=W/k,yb=185,ph=140,top=Math.max(...cnt),sc=ph/top;
  sv('line',{x1:x0,x2:x0+W,y1:yb,y2:yb,style:'stroke:var(--chalk);stroke-width:2'},s);sv('line',{x1:x0,x2:x0,y1:yb-ph-8,y2:yb,style:'stroke:var(--chalk);stroke-width:2'},s);
  for(let t=0;t<=top;t+=Math.max(1,Math.ceil(top/5))){sv('text',{x:x0-6,y:yb-t*sc+4,'text-anchor':'end',style:'fill:var(--chalk);font-size:11px'},s,String(t));sv('line',{x1:x0,x2:x0+W,y1:yb-t*sc,y2:yb-t*sc,style:'stroke:var(--chalk);opacity:.12'},s)}
  cnt.forEach((c,i)=>{const x=x0+i*bw;sv('rect',{x,y:yb-c*sc,width:bw,height:c*sc,style:`fill:${c===top?'var(--pink)':'var(--blue)'};fill-opacity:.55;stroke:var(--chalk);stroke-width:1.5`},s);
    if(c)sv('text',{x:x+bw/2,y:yb-c*sc-5,'text-anchor':'middle',style:`fill:var(--chalk);font-size:13px;font-weight:800;${HALO}`},s,String(c))});
  const fl=v=>fm(+v.toFixed(6));for(let i=0;i<=k;i++)if(k<=10||i%2===0)sv('text',{x:x0+i*bw,y:yb+15,'text-anchor':'middle',style:'fill:var(--chalk);font-size:11px'},s,fl(lo+i*w));
  sv('text',{x:x0+W/2,y:222,'text-anchor':'middle',style:'fill:var(--chalk);font-size:12px;opacity:.85'},s,it.label?clip(it.label,40):'intervalos');sv('text',{x:6,y:yb-ph/2,transform:`rotate(-90 6 ${yb-ph/2})`,'text-anchor':'middle',style:'fill:var(--chalk);font-size:12px;opacity:.85'},s,'frecuencia');
  cnt.forEach((c,i)=>el('div','t-note',d).textContent='['+fl(lo+i*w)+', '+fl(lo+(i+1)*w)+(i===k-1?']':')')+' → '+c+(c===1?' dato':' datos'));
  const mi=cnt.indexOf(top);el('div','t-note',d).textContent='Total: '+V.length+' datos · el intervalo más frecuente (clase modal) es ['+fl(lo+mi*w)+', '+fl(lo+(mi+1)*w)+').';
  cap(d,it);reveal(d);return 2000},

/* ---------- fracop: operaciones con fracciones paso a paso ---------- */
fracop(it){
  const pf=x=>{x=String(x==null?'':x).trim().replace(',','.');let m;
    if((m=x.match(/^(-?)(\d+)\s+(\d+)\s*\/\s*(\d+)$/))&&+m[4])return[(m[1]?-1:1)*(+m[2]*+m[4]+ +m[3]),+m[4]];
    if((m=x.match(/^(-?\d+)\s*\/\s*(\d+)$/))&&+m[2])return[+m[1],+m[2]];
    if((m=x.match(/^-?\d+$/)))return[+x,1];return null};
  const A=pf(it.a),B=pf(it.b),o=String(it.op==null?'+':it.op).trim(),op=/^[+]$/.test(o)?'+':/^[-−–]$/.test(o)?'-':/^[×*x·]$/i.test(o)?'*':/^[÷\/:]$/.test(o)?'/':null;
  if(!A||!B||!op||Math.abs(A[0])>9999||Math.abs(B[0])>9999||A[1]>999||B[1]>999)return sorry('Dame dos fracciones como 1/2 o 1 1/2 y una operación (+, −, ×, ÷).');
  if(op==='/'&&B[0]===0)return sorry('No se puede dividir entre 0.');
  const d=put('t-fig'),line=t=>rich(el('div','t-note',d),t),[na,da]=A,[nb,db]=B,sym=op==='+'?'+':op==='-'?'-':op==='*'?'\\times':'\\div';
  line('$'+lraw(na,da)+sym+(nb<0?'(':'')+lraw(nb,db)+(nb<0?')':'')+'$');
  let rn,rd,bars=null;
  if(op==='+'||op==='-'){const L=lcm(da,db),x=na*L/da,y=nb*L/db;rn=op==='+'?x+y:x-y;rd=L;
    if(da===db)line('Los denominadores son iguales: se '+(op==='+'?'suman':'restan')+' los numeradores y el denominador no cambia.');
    else line('Denominador común: mcm('+da+', '+db+') = '+L+'  →  $'+lraw(na,da)+'='+lraw(x,L)+'$ y $'+lraw(nb,db)+'='+lraw(y,L)+'$');
    line('$'+lraw(x,L)+sym+lraw(y,L)+'='+lraw(rn,rd)+'$');
    if(L<=24&&x>=0&&y>=0&&(op==='+'?x+y<=L:(x<=L&&y<=x)))bars={L,x,y}}
  else if(op==='*'){rn=na*nb;rd=da*db;line('$'+lraw(na,da)+'\\times'+lraw(nb,db)+'=\\frac{'+na+'\\cdot'+P(nb)+'}{'+da+'\\cdot'+db+'}='+lraw(rn,rd)+'$')}
  else{rn=na*db;rd=da*nb;line('Dividir es multiplicar por la inversa: $'+lraw(na,da)+'\\div'+lraw(nb,db)+'='+lraw(na,da)+'\\times'+lraw(db,nb)+'=\\frac{'+na+'\\cdot'+db+'}{'+da+'\\cdot'+P(nb)+'}='+lraw(rn,rd)+'$')}
  if(rd<0){rn=-rn;rd=-rd}
  const g=gcd(rn,rd)||1,sn=rn/g,sd=rd/g;
  if(g>1)line('Simplificamos (÷ '+g+'): $'+lraw(rn,rd)+'='+lraw(sn,sd)+'$');
  if(sd!==1&&Math.abs(sn)>sd){const w=Math.trunc(sn/sd),r=Math.abs(sn)-Math.abs(w)*sd;line('Como el numerador es mayor: $'+lraw(sn,sd)+'='+(sn<0?'-':'')+Math.abs(w)+'\\,'+lraw(r,sd).replace(/^-/,'')+'$ (número mixto)')}
  line('**Resultado:** $'+lraw(sn,sd)+'$'+(sd===1?'':'  ≈ '+fc(+(sn/sd).toFixed(4))));
  if(bars){const s=sv('svg',{viewBox:'0 0 400 70',class:'graph'},d),{L,x,y}=bars,w=Math.min(340/L,40),X0=(400-w*L)/2,res=op==='+'?x+y:x-y;
    for(let i=0;i<L;i++){const f=i<(op==='+'?x:res)?'yel':i<(op==='+'?x+y:x)&&(op==='+'||i>=res)?'pink':'';
      sv('rect',{x:X0+i*w,y:12,width:w-1.5,height:30,rx:3,style:`fill:${f==='yel'?'rgba(246,216,107,.5)':f==='pink'?(op==='+'?'rgba(245,154,180,.5)':'none'):'none'};stroke:${f==='pink'?'var(--pink)':f==='yel'?'var(--yel)':'var(--chalk)'};stroke-width:2;${op==='-'&&f==='pink'?'stroke-dasharray:3 3':''}`},s)}
    sv('text',{x:200,y:62,'text-anchor':'middle',style:'fill:var(--chalk);font-size:13px'},s,op==='+'?'amarillo: '+lraw(x,L).replace('\\frac{','').replace('}{','/').replace('}','')+'  ·  rosa: '+lraw(y,L).replace('\\frac{','').replace('}{','/').replace('}',''):'amarillo: lo que queda · rosa punteado: lo que quitamos')}
  cap(d,it);reveal(d);return 1000+500*Math.min(5,d.children.length)},

/* ---------- energy: barras de energía cinética y potencial (conservación) ---------- */
energy(it){
  const Pn=arr(it.points).slice(0,5).map(p=>({l:String((p&&p.label)||''),k:+(p&&p.ke)||0,p:+(p&&p.pe)||0})).filter(p=>p.k>=0&&p.p>=0&&(p.k+p.p)>0);
  if(Pn.length<2)return sorry('Necesito al menos 2 puntos con su energía cinética (ke) y potencial (pe).');
  const unit=String(it.unit||'J').slice(0,4),tot=Pn.map(p=>p.k+p.p),T=Math.max(...tot),d=put('t-fig');if(it.title)rich(el('div','t-note',d),it.title);
  const s=sv('svg',{viewBox:'0 0 400 240',class:'graph'},d),x0=30,W=350,gw=W/Pn.length,bw=Math.min(54,gw*.55),yb=190,ph=140,sc=ph/T;
  sv('line',{x1:x0,x2:x0+W,y1:yb,y2:yb,style:'stroke:var(--chalk);stroke-width:2'},s);
  sv('line',{x1:x0,x2:x0+W,y1:yb-tot[0]*sc,y2:yb-tot[0]*sc,style:'stroke:var(--pink);stroke-width:2;stroke-dasharray:6 4'},s);
  sv('text',{x:x0+W,y:yb-tot[0]*sc-5,'text-anchor':'end',style:`fill:var(--pink);font-size:12px;font-weight:700;${HALO}`},s,'E total del inicio = '+fm(tot[0])+' '+unit);
  Pn.forEach((p,i)=>{const cx0=x0+gw*i+gw/2,x=cx0-bw/2,hk=p.k*sc,hp=p.p*sc;
    sv('rect',{x,y:yb-hk,width:bw,height:hk,style:'fill:rgba(143,208,232,.55);stroke:var(--blue);stroke-width:2'},s);
    sv('rect',{x,y:yb-hk-hp,width:bw,height:hp,style:'fill:rgba(246,216,107,.5);stroke:var(--yel);stroke-width:2'},s);
    if(hk>16)sv('text',{x:cx0,y:yb-hk/2+4,'text-anchor':'middle',style:'fill:var(--chalk);font-size:12.5px;font-weight:800'},s,fm(p.k));
    if(hp>16)sv('text',{x:cx0,y:yb-hk-hp/2+4,'text-anchor':'middle',style:'fill:var(--chalk);font-size:12.5px;font-weight:800'},s,fm(p.p));
    sv('text',{x:cx0,y:yb+16,'text-anchor':'middle',style:'fill:var(--chalk);font-size:12.5px;font-weight:700'},s,clip(p.l||String.fromCharCode(65+i),16))});
  sv('rect',{x:x0,y:214,width:12,height:12,style:'fill:rgba(143,208,232,.55);stroke:var(--blue);stroke-width:2'},s);sv('text',{x:x0+17,y:225,style:'fill:var(--chalk);font-size:12px'},s,'Ec (cinética)');
  sv('rect',{x:x0+120,y:214,width:12,height:12,style:'fill:rgba(246,216,107,.5);stroke:var(--yel);stroke-width:2'},s);sv('text',{x:x0+137,y:225,style:'fill:var(--chalk);font-size:12px'},s,'Ep (potencial)');
  Pn.forEach((p,i)=>el('div','t-note',d).textContent=(p.l||String.fromCharCode(65+i))+': Ec + Ep = '+fm(p.k)+' + '+fm(p.p)+' = '+fm(p.k+p.p)+' '+unit);
  const cons=tot.every(q=>Math.abs(q-tot[0])<1e-6*Math.max(1,tot[0]));
  el('div','t-note',d).textContent=cons?'La energía mecánica total es la misma en todos los puntos: se conserva (Ec + Ep = constante).':'La energía total baja de '+fm(tot[0])+' a '+fm(tot[tot.length-1])+' '+unit+': la diferencia ('+fm(+(tot[0]-tot[tot.length-1]).toFixed(4))+' '+unit+') se pierde como calor por el rozamiento.';
  cap(d,it);reveal(d);return 2000},

/* ---------- complex: números complejos en el plano de Argand ---------- */
complex(it){
  const pz=z=>{if(Array.isArray(z)&&z.length>=2&&z.slice(0,2).every(q=>isFinite(+q)))return[+z[0],+z[1]];if(z&&typeof z==='object'&&isFinite(+z.re)&&isFinite(+z.im))return[+z.re,+z.im];return null};
  const Z1=pz(it.z1||it.z),Z2=pz(it.z2);if(!Z1||Math.hypot(...Z1)>1e4||(it.z2!=null&&!Z2))return sorry('Dame z como [parte real, parte imaginaria], por ejemplo [3, 4].');
  const o=String(it.op||'').toLowerCase(),op=/^(add|sum|\+)/.test(o)?'add':/^(mul|prod|×|\*)/.test(o)?'mul':/^(con|bar)/.test(o)?'conj':'';
  if((op==='add'||op==='mul')&&!Z2)return sorry('Para sumar o multiplicar necesito z1 y z2.');
  const[a,b]=Z1,pts=[{l:'z₁',z:Z1,c:'var(--blue)'}];if(Z2)pts.push({l:'z₂',z:Z2,c:'var(--yel)'});
  let R=null;if(op==='add')R=[a+Z2[0],b+Z2[1]];else if(op==='mul')R=[a*Z2[0]-b*Z2[1],a*Z2[1]+b*Z2[0]];else if(op==='conj')R=[a,-b];
  if(R)pts.push({l:op==='conj'?'z̄₁':'resultado',z:R,c:'var(--pink)',dash:true});
  const r=Math.max(2,...pts.map(p=>Math.max(Math.abs(p.z[0])/1.74,Math.abs(p.z[1]))))*1.25+.5,d=put('t-fig'),pl=plot(d,-r*1.74,r*1.74,-r,r);
  const arrow=(p,col,dash)=>{const ax=pl.X(0),ay=pl.Y(0),bx=pl.X(p[0]),by=pl.Y(p[1]),dx=bx-ax,dy=by-ay,L=Math.hypot(dx,dy)||1,ux=dx/L,uy=dy/L,hx=bx-ux*10,hy=by-uy*10;
    sv('line',{x1:ax,y1:ay,x2:hx,y2:hy,style:`stroke:${col};stroke-width:3.4;stroke-linecap:round;${dash?'stroke-dasharray:7 5':''}`},pl.s);sv('polygon',{points:`${bx},${by} ${hx-uy*5},${hy+ux*5} ${hx+uy*5},${hy-ux*5}`,style:`fill:${col}`},pl.s)};
  pts.forEach(p=>{arrow(p.z,p.c,p.dash);const lf2=p.z[0]<0||pl.X(p.z[0])>240;sv('text',{x:pl.X(p.z[0])+(lf2?-7:7),y:pl.Y(p.z[1])+(p.z[1]>=0?-8:16),'text-anchor':lf2?'end':'start',style:`fill:${p.c};font-size:13.5px;font-weight:800;${HALO}`},pl.s,p.l+' = '+cx(p.z[0],p.z[1]))});
  sv('text',{x:pl.W-26,y:pl.Y(0)-6,'text-anchor':'end',style:'fill:var(--chalk);font-size:11px;opacity:.8'},pl.s,'real');sv('text',{x:pl.X(0)+6,y:pl.m+4,style:'fill:var(--chalk);font-size:11px;opacity:.8'},pl.s,'imaginario');
  const note=t=>el('div','t-note',d).textContent=t,pol=(z,n)=>{const m=Math.hypot(...z),ang=((Math.atan2(z[1],z[0])*180/Math.PI)+360)%360;note(n+' = '+cx(z[0],z[1])+'  →  módulo |'+n+'| = '+fc(+m.toFixed(4))+' · argumento ≈ '+fc(+ang.toFixed(2))+'°  →  forma polar: '+fc(+m.toFixed(3))+'(cos '+fc(+ang.toFixed(1))+'° + i·sen '+fc(+ang.toFixed(1))+'°)')};
  pol(Z1,'z₁');if(Z2)pol(Z2,'z₂');
  if(op==='add')note('Suma: ('+cx(a,b)+') + ('+cx(Z2[0],Z2[1])+') = ('+fm(a)+' + '+P(Z2[0])+') + ('+fm(b)+' + '+P(Z2[1])+')i = '+cx(R[0],R[1])+' · se suman las partes reales y las imaginarias por separado.');
  if(op==='mul')note('Producto: ('+cx(a,b)+')·('+cx(Z2[0],Z2[1])+') = (ac − bd) + (ad + bc)i = ('+fm(a*Z2[0])+' − '+P(b*Z2[1])+') + ('+fm(a*Z2[1])+' + '+P(b*Z2[0])+')i = '+cx(R[0],R[1])+' (recuerda que i² = −1).');
  if(op==='conj')note('Conjugado: se cambia el signo de la parte imaginaria → '+cx(R[0],R[1])+' (es el reflejo respecto al eje real).');
  cap(d,it);reveal(d);return 2200}
};
const old=Board.draw;
Board.draw=function(it){const f=it&&Object.prototype.hasOwnProperty.call(E,it.t)&&E[it.t];if(f){try{return f(it)}catch(e){console.warn('teach14',e);return 600}}return old.call(Board,it)};
window.LumiTeach14={types:Object.keys(E)};
})();
