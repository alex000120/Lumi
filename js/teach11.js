/* Herramientas de enseñanza de Lumi · tanda 12: pen, factortree, units, vectors, truth.
   Se enganchan a Board.draw encima de teach.js … teach10.js. Todo el texto de la IA se inserta como texto (nunca HTML). */
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

/* ---------- factorización en primos ---------- */
const fac=v=>{const f=[];for(let p=2;p*p<=v;p++)while(v%p===0){f.push(p);v/=p}if(v>1)f.push(v);return f};
const expo=f=>{const m={};f.forEach(p=>{m[p]=(m[p]||0)+1});return m};
const fstr=m=>{const k=Object.keys(m).map(Number).sort((a,b)=>a-b);return k.length?k.map(p=>m[p]>1?p+sup(m[p]):String(p)).join(' × '):'1'};

const COL={yel:'var(--yel)',pink:'var(--pink)',blue:'var(--blue)',chalk:'var(--chalk)'};
const PEN={
  circle:'M50 4C78 2 98 22 97 50C96 80 74 98 48 97C20 96 3 78 4 48C5 22 24 5 52 5C60 5 66 8 70 11',
  underline:'M3 94C20 90 35 98 52 93S85 92 97 95',
  box:'M4 6L96 4L97 95L3 96L4 8',
  cross:'M6 6L94 94M94 6L6 94'
};

const E={
/* ---------- pen: la tiza de la profe (encierra, subraya o tacha algo ya escrito) ---------- */
pen(it){
  const kids=[...sheet().children],n=Math.max(1,Math.min(Math.round(+it.target)||1,8)),host=kids[kids.length-n];if(!host)return 300;
  const line=Math.round(+it.line)||0,col=COL[String(it.color||'pink')]||COL.pink,st=PEN[String(it.style||'circle')]?String(it.style||'circle'):'circle';
  const apply=left=>{
    let t=host;
    if(line>=1&&(host.classList.contains('t-steps')||host.classList.contains('t5-steps'))){t=host.classList.contains('t5-steps')?host.querySelectorAll('.t5-st')[line-1]:host.children[line-1];if(!t){if(left>0)setTimeout(()=>apply(left-1),700);return}}
    if(!t.isConnected)return;
    setTimeout(()=>{t.style.clipPath='none'},1300);   /* el recorte solo sirve para la aparición; después deja ver el rótulo y el contorno */
    if(t.tagName==='TABLE'){t.classList.add('pen-tbl');t.style.setProperty('--pc',col);return}
    if(getComputedStyle(t).position==='static')t.style.position='relative';
    const o=el('div','pen-o',t);o.style.setProperty('--pc',col);
    const s=sv('svg',{viewBox:'0 0 100 100',preserveAspectRatio:'none'},o);
    PEN[st].split('M').filter(Boolean).forEach(d=>sv('path',{d:'M'+d,style:'fill:none;stroke:'+col+';stroke-width:3.5;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke'},s));
    if(it.note)el('span','pen-n',o,clip(it.note,40));
    requestAnimationFrame(()=>requestAnimationFrame(()=>o.classList.add('on')))};
  apply(4);return 1000},

/* ---------- factortree: árbol de factores primos (+ MCD y MCM) ---------- */
factortree(it){
  const n=Math.round(+it.n);if(!(n>=2&&n<=9999))return sorry('Solo puedo descomponer números enteros de 2 a 9999.');
  const f=fac(n),m=f.length,d=put('t-fig'),sy=36,H=m*sy+40,s=sv('svg',{viewBox:`0 0 400 ${H}`,class:'graph'},d);
  const node=(x,y,v,prime)=>{const r=v>999?17:15,c=prime?'var(--pink)':'var(--blue)';
    sv('circle',{cx:x,cy:y,r,style:`fill:${prime?'rgba(245,154,180,.3)':'none'};stroke:${c};stroke-width:${prime?3:2.2}`},s);
    sv('text',{x,y:y+5,'text-anchor':'middle',style:`fill:var(--chalk);font-size:${v>999?12:14}px;font-weight:${prime?800:600}`},s,String(v))};
  const X=k=>(m>8?70:110)+k*(m>8?24:30);let v=n;
  for(let k=0;k<m;k++){const x=X(k),y=22+k*sy;
    if(k<m-1){const x1=x-32,x2=X(k+1),y1=y+sy;
      sv('line',{x1:x-6,y1:y+13,x2:x1+4,y2:y1-13,style:'stroke:var(--chalk);stroke-width:1.6'},s);sv('line',{x1:x+6,y1:y+13,x2:x2-4,y2:y1-13,style:'stroke:var(--chalk);stroke-width:1.6'},s);
      node(x,y,v,false);node(x1,y1,f[k],true);v/=f[k]}
    else node(x,y,v,true)}
  const a=el('div','t-note',d);a.textContent=n+' = '+(m===1?n+' (es un número primo)':fstr(expo(f)));
  const q=Math.round(+it.m);
  if(q>=2&&q<=9999){const g=expo(fac(q)),e=expo(f),both=Object.assign({},e),mn={},mx={};
    new Set([...Object.keys(e),...Object.keys(g)]).forEach(p=>{const a1=e[p]||0,b1=g[p]||0;if(Math.min(a1,b1))mn[p]=Math.min(a1,b1);mx[p]=Math.max(a1,b1)});
    el('div','t-note',d).textContent=q+' = '+(fac(q).length===1?q+' (primo)':fstr(g));
    const gg=gcd(n,q);
    el('div','t-note',d).textContent='MCD('+n+', '+q+') = '+fstr(mn)+' = '+gg+'  (primos comunes, el menor exponente)';
    el('div','t-note',d).textContent='MCM('+n+', '+q+') = '+fstr(mx)+' = '+(n/gg*q)+'  (todos los primos, el mayor exponente)'}
  cap(d,it);reveal(d);return 1900},

/* ---------- units: escalera de conversión de unidades (longitud, masa, capacidad) ---------- */
units(it){
  const U={length:['km','hm','dam','m','dm','cm','mm'],mass:['kg','hg','dag','g','dg','cg','mg'],capacity:['kl','hl','dal','l','dl','cl','ml']},norm=u=>String(u==null?'':u).trim().replace(/[²³]/g,'').replace(/^L$/,'l').replace(/^kL$/,'kl').replace(/^(.*)L$/,(m,a)=>a+'l').replace(/^m[2-3]$/,'m');
  const a=norm(it.from),b=norm(it.to),kind=Object.keys(U).find(k=>U[k].includes(a)),v=+String(it.value==null?'':it.value).replace(',','.');
  if(!kind||!U[kind].includes(b)||!isFinite(v)||a===b)return sorry('Para convertir dime un valor y dos unidades distintas de longitud, masa o capacidad (por ejemplo m → cm).');
  const L=U[kind],i=L.indexOf(a),j=L.indexOf(b),k=j-i,pw=[1,2,3].includes(+it.power)?+it.power:1,e=k*pw,res=Number((v*Math.pow(10,e)).toPrecision(12));
  const sp=pw>1?sup(pw):'',d=put('t-fig'),s=sv('svg',{viewBox:'0 0 400 150',class:'graph'},d),W=48;
  L.forEach((u,q)=>{const on=q===i,to=q===j,x=26+q*W;sv('rect',{x,y:70,width:W-4,height:36,rx:6,style:`fill:${on?'rgba(246,216,107,.4)':to?'rgba(245,154,180,.4)':'none'};stroke:${on?'var(--yel)':to?'var(--pink)':'var(--chalk)'};stroke-width:${on||to?3:1.8}`},s);
    sv('text',{x:x+(W-4)/2,y:94,'text-anchor':'middle',style:`fill:var(--chalk);font-size:${u.length>2?14:17}px;font-weight:${on||to?800:600}`},s,u+sp)});
  const x1=26+i*W+(W-4)/2,x2=26+j*W+(W-4)/2,my=36;
  sv('path',{d:`M${x1} 66Q${(x1+x2)/2} ${my-24} ${x2} 66`,style:'fill:none;stroke:var(--yel);stroke-width:3'},s);
  sv('polygon',{points:`${x2},66 ${x2-7},${k>0?55:58} ${x2+7},${k>0?55:58}`,style:'fill:var(--yel);transform-box:fill-box'},s);
  sv('text',{x:(x1+x2)/2,y:my-2,'text-anchor':'middle',style:`fill:var(--yel);font-size:16px;font-weight:800;${HALO}`},s,(e>0?'× 10':'÷ 10')+sup(Math.abs(e)));
  sv('text',{x:200,y:132,'text-anchor':'middle',style:'fill:var(--chalk);font-size:13px;opacity:.85'},s,'→ derecha: multiplicas   ·   ← izquierda: divides');
  const n=el('div','t-note',d);n.textContent=fc(v)+' '+a+sp+' = '+fc(res)+' '+b+sp;
  el('div','t-note',d).textContent='Pasas '+Math.abs(k)+(Math.abs(k)===1?' casilla':' casillas')+' a la '+(k>0?'derecha':'izquierda')+(pw>1?' y cada una vale 10'+sup(pw):' (cada una vale 10)')+': '+(e>0?'multiplicas':'divides')+' por 10'+sup(Math.abs(e))+' = '+Math.pow(10,Math.abs(e))+'.';
  cap(d,it);reveal(d);return 1700},

/* ---------- vectors: suma de vectores punta con cola, con componentes y módulo ---------- */
vectors(it){
  const V=arr(it.vectors).slice(0,4).map((q,i)=>({l:String((q&&q.label)||String.fromCharCode(97+i)),x:+(q&&q.x),y:+(q&&q.y)})).filter(q=>isFinite(q.x)&&isFinite(q.y)&&Math.abs(q.x)<=50&&Math.abs(q.y)<=50);
  if(!V.length)return sorry('Dame al menos un vector con sus componentes x e y.');
  const sum=it.sum!==false&&V.length>1,pts=[[0,0]];V.forEach(q=>{const p=pts[pts.length-1];pts.push([p[0]+q.x,p[1]+q.y])});
  const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]),x0=Math.min(0,...xs)-1,x1=Math.max(0,...xs)+1,y0=Math.min(0,...ys)-1,y1=Math.max(0,...ys)+1;
  const sc=Math.min(340/(x1-x0),215/(y1-y0)),X=x=>30+(x-x0)*sc,Y=y=>245-(y-y0)*sc,d=put('t-fig'),s=sv('svg',{viewBox:'0 0 400 270',class:'graph'},d);
  if(x1-x0<=16&&y1-y0<=12){for(let x=Math.ceil(x0);x<=x1;x++)sv('line',{x1:X(x),x2:X(x),y1:Y(y0),y2:Y(y1),style:'stroke:var(--chalk);opacity:.13'},s);for(let y=Math.ceil(y0);y<=y1;y++)sv('line',{x1:X(x0),x2:X(x1),y1:Y(y),y2:Y(y),style:'stroke:var(--chalk);opacity:.13'},s)}
  sv('line',{x1:X(x0),x2:X(x1),y1:Y(0),y2:Y(0),style:'stroke:var(--chalk);stroke-width:1.6'},s);sv('line',{x1:X(0),x2:X(0),y1:Y(y0),y2:Y(y1),style:'stroke:var(--chalk);stroke-width:1.6'},s);
  const arrow=(ax,ay,bx,by,c,w,dash)=>{const dx=bx-ax,dy=by-ay,L=Math.hypot(dx,dy)||1,ux=dx/L,uy=dy/L,hx=bx-ux*11,hy=by-uy*11;
    sv('line',{x1:ax,y1:ay,x2:hx,y2:hy,style:`stroke:${c};stroke-width:${w};stroke-linecap:round;${dash?'stroke-dasharray:7 5':''}`},s);
    sv('polygon',{points:`${bx},${by} ${hx-uy*5.5},${hy+ux*5.5} ${hx+uy*5.5},${hy-ux*5.5}`,style:`fill:${c}`},s)};
  V.forEach((q,i)=>{const a=pts[i],b=pts[i+1],c=C[i%3];arrow(X(a[0]),Y(a[1]),X(b[0]),Y(b[1]),c,3.5);
    sv('text',{x:(X(a[0])+X(b[0]))/2+8,y:(Y(a[1])+Y(b[1]))/2-8,style:`fill:${c};font-size:16px;font-weight:800;${HALO}`},s,clip(q.l,6))});
  const R=pts[pts.length-1];if(sum){arrow(X(0),Y(0),X(R[0]),Y(R[1]),'var(--pink)',4,true);sv('text',{x:X(R[0])/2+X(0)/2-4,y:(Y(0)+Y(R[1]))/2+18,style:`fill:var(--pink);font-size:16px;font-weight:800;${HALO}`},s,'suma')}
  sv('circle',{cx:X(0),cy:Y(0),r:3.5,style:'fill:var(--chalk)'},s);
  V.forEach(q=>el('div','t-note',d).textContent=q.l+' = ('+fc(q.x)+', '+fc(q.y)+')   |'+q.l+'| = '+fc(Math.hypot(q.x,q.y)));
  if(sum){const ang=(Math.atan2(R[1],R[0])*180/Math.PI+360)%360;
    el('div','t-note',d).textContent='Suma = ('+V.map(q=>fc(q.x)).join(' + ')+', '+V.map(q=>fc(q.y)).join(' + ')+') = ('+fc(R[0])+', '+fc(R[1])+')';
    el('div','t-note',d).textContent='Módulo = √('+fc(R[0])+'² + '+fc(R[1])+'²) = '+fc(Math.hypot(R[0],R[1]))+' · ángulo ≈ '+fc(ang)+'°'}
  cap(d,it);reveal(d);return 1900},

/* ---------- truth: tabla de verdad (lógica proposicional) ---------- */
truth(it){
  const vars=arr(it.vars).map(x=>String(x).trim().slice(0,2)).filter(Boolean).slice(0,3),cols=arr(it.cols).map(x=>String(x).trim()).filter(Boolean).slice(0,5);
  if(!vars.length||!cols.length)return sorry('Dame las variables (p, q…) y las expresiones de la tabla de verdad.');
  const tok=s=>{const o=[];let i=0;s=s.replace(/<->|<=>/g,'↔').replace(/->|=>/g,'→').replace(/&&?|\^/g,'∧').replace(/\|\|?/g,'∨').replace(/[~!]/g,'¬').replace(/\s+/g,'');
    while(i<s.length){const v=vars.find(x=>s.startsWith(x,i));if(v){o.push({v});i+=v.length}else{o.push({o:s[i]});i++}}return o};
  const parse=s=>{const t=tok(s);let p=0;const pk=()=>t[p]&&t[p].o,
    atom=()=>{const x=t[p++];if(!x)throw 0;if(x.v)return e=>e[x.v];if(x.o==='¬'){const f=atom();return e=>!f(e)}if(x.o==='('){const f=iff();if(pk()!==')')throw 0;p++;return f}throw 0},
    and=()=>{let f=atom();while(pk()==='∧'){p++;const a=f,b=atom();f=e=>a(e)&&b(e)}return f},
    or=()=>{let f=and();while(pk()==='∨'||pk()==='⊕'){const x=t[p++].o,a=f,b=and();f=x==='∨'?e=>a(e)||b(e):e=>a(e)!==b(e)}return f},
    imp=()=>{const f=or();if(pk()==='→'){p++;const g=imp();return e=>!f(e)||g(e)}return f},
    iff=()=>{let f=imp();while(pk()==='↔'){p++;const a=f,b=imp();f=e=>a(e)===b(e)}return f};
    const f=iff();if(p<t.length)throw 0;return f};
  let F;try{F=cols.map(parse)}catch(e){return sorry('No pude leer alguna de las expresiones de la tabla de verdad.')}
  const n=vars.length,rows=1<<n,d=put('t-fig'),tb=el('table','t-table tt'+(n+cols.length>5?' tt-s':''),el('div','tt-w',d)),h=tb.insertRow();
  [...vars,...cols].forEach((c,i)=>{const th=el('th','',h,T(c));if(i>=n)th.className='tt-r'});
  const res=cols.map(()=>[]);
  for(let r=0;r<rows;r++){const env={};vars.forEach((v,i)=>{env[v]=!((r>>(n-1-i))&1)});const tr=tb.insertRow();
    vars.forEach(v=>{const td=el('td',env[v]?'tt-v':'tt-f',tr,env[v]?'V':'F')});
    F.forEach((f,i)=>{const val=!!f(env);res[i].push(val);el('td',(val?'tt-v':'tt-f')+' tt-r',tr,val?'V':'F')})}
  cols.forEach((c,i)=>{const all=res[i].every(Boolean),none=res[i].every(x=>!x);el('div','t-note',d).textContent=c+': '+(all?'tautología (siempre V)':none?'contradicción (siempre F)':'contingencia (a veces V, a veces F)')});
  cap(d,it);reveal(d);return 1200+rows*120}
};
const old=Board.draw;
Board.draw=function(it){const f=it&&Object.prototype.hasOwnProperty.call(E,it.t)&&E[it.t];if(f){try{return f(it)}catch(e){console.warn('teach11',e);return 600}}return old.call(Board,it)};
window.LumiTeach11={types:Object.keys(E)};
})();
