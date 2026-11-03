/* Caja de herramientas de estudio: graficadora, calculadora, ecuaciones, tarjetas, pomodoro, conversor, promedio y notas.
   Todo funciona sin internet. Se abre con el botón 🧰 de la barra. */
(()=>{
const $=(s,r=document)=>r.querySelector(s), esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmt=n=>{if(!isFinite(n))return n!==n?'indefinido':(n>0?'∞':'-∞');const a=Math.abs(n);if(a!==0&&(a>=1e12||a<1e-9))return n.toExponential(6).replace(/\.?0+e/,'e');return String(+n.toPrecision(12))};

/* ---------- Analizador de expresiones (seguro, sin eval) ---------- */
const FN={sin:Math.sin,cos:Math.cos,tan:Math.tan,asin:Math.asin,acos:Math.acos,atan:Math.atan,sinh:Math.sinh,cosh:Math.cosh,tanh:Math.tanh,
  sqrt:Math.sqrt,cbrt:Math.cbrt,abs:Math.abs,ln:Math.log,log:Math.log10,exp:Math.exp,floor:Math.floor,ceil:Math.ceil,round:Math.round,sign:Math.sign};
const TRIG=['sin','cos','tan'],ITRIG=['asin','acos','atan'];
function fact(n){if(n<0||n!==Math.floor(n)||n>170)return NaN;let r=1;for(let i=2;i<=n;i++)r*=i;return r}
function compile(src,deg){
  const s=String(src).toLowerCase().replace(/π/g,'pi').replace(/√/g,'sqrt').replace(/[×·]/g,'*').replace(/÷/g,'/').replace(/[−–]/g,'-').replace(/,/g,'.').replace(/\*\*/g,'^');
  const T=[];const re=/\s*(\d+\.?\d*(?:e[+-]?\d+)?|\.\d+|[a-z]+|[-+*/^()!%|])/y;let m,last=0;
  while(last<s.trimEnd().length&&(m=re.exec(s))){last=re.lastIndex;const t=m[1];T.push(/^[\d.]/.test(t)?{n:parseFloat(t)}:/^[a-z]/.test(t)?{id:t}:{op:t})}
  if(last<s.trimEnd().length)throw Error('Símbolo no válido');
  let i=0;const pk=()=>T[i],op=o=>T[i]&&T[i].op===o;
  const k=f=>f;
  function expr(){let a=term();while(op('+')||op('-')){const o=T[i++].op,b=term(),l=a;a=o==='+'?x=>l(x)+b(x):x=>l(x)-b(x)}return a}
  function term(){let a=unary();for(;;){const t=pk();let o=null;
    if(op('*')||op('/'))o=T[i++].op;else if(t&&(t.n!==undefined||t.id||t.op==='('))o='*';else break;
    const b=unary(),l=a;a=o==='*'?x=>l(x)*b(x):x=>l(x)/b(x)}return a}
  function unary(){if(op('-')){i++;const a=unary();return x=>-a(x)}if(op('+')){i++;return unary()}return power()}
  function power(){const a=post();if(op('^')){i++;const b=unary();return x=>Math.pow(a(x),b(x))}return a}
  function post(){let a=prim();while(op('!')||op('%')){const o=T[i++].op,l=a;a=o==='!'?x=>fact(l(x)):x=>l(x)/100}return a}
  function prim(){const t=T[i++];if(!t)throw Error('Falta algo al final');
    if(t.n!==undefined)return()=>t.n;
    if(t.op==='('){const a=expr();if(!op(')'))throw Error('Falta cerrar )');i++;return a}
    if(t.op==='|'){const a=expr();if(!op('|'))throw Error('Falta cerrar |');i++;return x=>Math.abs(a(x))}
    if(t.id){const id=t.id;
      if(id==='pi')return()=>Math.PI;if(id==='e')return()=>Math.E;if(id==='x'||id==='t')return x=>x;if(id==='y')return()=>compile.y||0;if(id==='ans')return()=>compile.ans||0;
      if(FN[id]){const a=op('(')?prim():power(),f=FN[id];
        if(deg&&TRIG.includes(id))return x=>f(a(x)*Math.PI/180);if(deg&&ITRIG.includes(id))return x=>f(a(x))*180/Math.PI;return x=>f(a(x))}
      throw Error('No conozco «'+id+'»')}
    throw Error('Símbolo inesperado «'+(t.op||'')+'»')}
  const f=expr();if(i<T.length)throw Error('Sobra algo: «'+(T[i].op||T[i].id||T[i].n)+'»');return f}

/* ---------- Estructura ---------- */
const TABS=[['graf','📈','Graficar'],['calc','🧮','Calculadora'],['ecu','🧩','Ecuaciones'],['tarj','🃏','Tarjetas'],['pomo','🍅','Pomodoro'],['conv','🔁','Conversor'],['prom','🎯','Notas'],['nota','📝','Apuntes']];
let dlg,body,cur='graf';
const ask=t=>{const q=$('#q');if(!q)return;q.value=t;dlg.close();q.form.requestSubmit?q.form.requestSubmit():q.form.dispatchEvent(new Event('submit',{cancelable:true}))};
const askBtn=(label,fn)=>`<button type="button" class="askL" data-ask="${esc(label)}">💬 Pedirle a Lumi que lo explique</button>`;

function build(){
  dlg=document.createElement('dialog');dlg.id='toolsDlg';
  dlg.innerHTML=`<div class="tl-h"><h3>🧰 Herramientas de estudio</h3><button type="button" id="tlClose" class="primary">Cerrar</button></div><div class="tabs" id="tlTabs"></div><div id="tlBody"></div>`;
  document.body.appendChild(dlg);body=$('#tlBody',dlg);
  const tb=$('#tlTabs',dlg);TABS.forEach(([id,ic,nm])=>{const b=document.createElement('button');b.type='button';b.textContent=ic+' '+nm;b.dataset.id=id;b.onclick=()=>show(id);tb.appendChild(b)});
  $('#tlClose',dlg).onclick=()=>dlg.close();
  dlg.addEventListener('close',()=>{G.stop&&G.stop()});
  dlg.addEventListener('click',e=>{const a=e.target.closest('[data-ask]');if(a)ask(a.dataset.ask)});
}
function show(id){cur=id;Store.set('toolTab',id);G.stop&&G.stop();[...$('#tlTabs',dlg).children].forEach(b=>b.setAttribute('aria-pressed',b.dataset.id===id));body.innerHTML='';VIEWS[id](body)}

/* ---------- Graficadora ---------- */
const COL=['#e63946','#2a7de1','#2a9d4f','#e08a00'];
const G={};
function viewGraf(el){
  const saved=Store.get('graf',{f:['x^2-4','sin(x)','','']});
  el.innerHTML=`<div class="gf">${[0,1,2,3].map(i=>`<label class="fr"><i style="background:${COL[i]}"></i><input data-f="${i}" value="${esc(saved.f[i]||'')}" placeholder="${i?'otra función…':'f(x) = ej. x^2-4'}" autocapitalize="off" autocomplete="off"></label>`).join('')}</div>
  <div class="gtools"><label><input type="checkbox" id="gDer"> Derivada de f₁</label><label><input type="checkbox" id="gTab"> Tabla</label><button type="button" id="gHome">Centrar</button><button type="button" id="gZi">＋</button><button type="button" id="gZo">－</button></div>
  <canvas id="gc"></canvas><p class="hint" id="gInfo">Arrastra para mover · pellizca o usa la rueda para acercar · toca para leer valores.</p><div id="gTable"></div>${askBtn('Explícame la gráfica de f(x) = '+esc(saved.f[0]||'x^2'))}`;
  const cv=$('#gc',el),ctx=cv.getContext('2d'),V={cx:0,cy:0,s:40};let W=0,H=0,fns=[],pts=new Map(),touch=null,probe=null;
  const dpr=Math.min(devicePixelRatio||1,2);
  const size=()=>{W=cv.clientWidth;H=Math.min(Math.round(W*.75),420);cv.style.height=H+'px';cv.width=W*dpr;cv.height=H*dpr;draw()};
  const X=x=>W/2+(x-V.cx)*V.s,Y=y=>H/2-(y-V.cy)*V.s,ix=px=>(px-W/2)/V.s+V.cx,iy=py=>-(py-H/2)/V.s+V.cy;
  const sty=n=>getComputedStyle(document.documentElement).getPropertyValue(n);
  function parse(){fns=[];const inputs=[...el.querySelectorAll('[data-f]')];const sv=[];
    inputs.forEach((inp,i)=>{sv.push(inp.value);inp.parentNode.classList.remove('bad');const v=inp.value.trim();if(!v)return;
      try{const e=v.replace(/^\s*(f|y|g|h)\s*(\(x\))?\s*=/,'');fns.push({i,f:compile(e,false)})}catch(er){inp.parentNode.classList.add('bad');inp.title=er.message}});
    Store.set('graf',{f:sv});
    const a=$('.askL',el);if(a)a.dataset.ask='Explícame la gráfica de f(x) = '+(sv.find(Boolean)||'x^2')+': dominio, cortes con los ejes, vértice o puntos clave y comportamiento.'}
  function nice(r){const p=Math.pow(10,Math.floor(Math.log10(r))),f=r/p;return(f<1.5?1:f<3.5?2:f<7.5?5:10)*p}
  function draw(){
    ctx.setTransform(dpr,0,0,dpr,0,0);const ink=getComputedStyle(cv).color,line=getComputedStyle(cv).borderColor;ctx.clearRect(0,0,W,H);
    const st=nice(60/V.s),x0=Math.floor(ix(0)/st)*st,y0=Math.floor(iy(H)/st)*st;ctx.font='11px sans-serif';ctx.lineWidth=1;
    for(let x=x0;x<=ix(W);x+=st){ctx.strokeStyle=line;ctx.globalAlpha=.5;ctx.beginPath();ctx.moveTo(X(x),0);ctx.lineTo(X(x),H);ctx.stroke();ctx.globalAlpha=1;if(Math.abs(x)>st/2){ctx.fillStyle=ink;ctx.globalAlpha=.7;ctx.fillText(fmt(+x.toFixed(10)),X(x)+2,Math.min(Math.max(Y(0)+12,12),H-3));ctx.globalAlpha=1}}
    for(let y=y0;y<=iy(0);y+=st){ctx.strokeStyle=line;ctx.globalAlpha=.5;ctx.beginPath();ctx.moveTo(0,Y(y));ctx.lineTo(W,Y(y));ctx.stroke();ctx.globalAlpha=1;if(Math.abs(y)>st/2){ctx.fillStyle=ink;ctx.globalAlpha=.7;ctx.fillText(fmt(+y.toFixed(10)),Math.min(Math.max(X(0)+3,2),W-30),Y(y)-2);ctx.globalAlpha=1}}
    ctx.strokeStyle=ink;ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(0,Y(0));ctx.lineTo(W,Y(0));ctx.moveTo(X(0),0);ctx.lineTo(X(0),H);ctx.stroke();
    const plot=(f,col,dash)=>{ctx.strokeStyle=col;ctx.lineWidth=2.4;ctx.setLineDash(dash?[6,5]:[]);ctx.beginPath();let pen=false,py=0;
      for(let px=0;px<=W;px+=1){const x=ix(px);let y;try{y=f(x)}catch(e){y=NaN}
        if(!isFinite(y)||Math.abs(y)>1e7){pen=false;continue}const yy=Y(y);
        if(pen&&Math.abs(yy-py)>H*1.5)pen=false;if(pen)ctx.lineTo(px,yy);else ctx.moveTo(px,yy);pen=true;py=yy}ctx.stroke();ctx.setLineDash([])};
    fns.forEach(o=>plot(o.f,COL[o.i]));
    if($('#gDer',el).checked&&fns[0]){const f=fns[0].f;plot(x=>{const h=1e-5;return(f(x+h)-f(x-h))/(2*h)},COL[0],true)}
    if(probe){const px=X(probe.x);ctx.strokeStyle=ink;ctx.globalAlpha=.4;ctx.beginPath();ctx.moveTo(px,0);ctx.lineTo(px,H);ctx.stroke();ctx.globalAlpha=1;
      fns.forEach(o=>{const y=o.f(probe.x);if(isFinite(y)){ctx.fillStyle=COL[o.i];ctx.beginPath();ctx.arc(px,Y(y),5,0,7);ctx.fill()}})}
    table()}
  function table(){const t=$('#gTable',el);if(!$('#gTab',el).checked){t.innerHTML='';return}
    const st=nice(V.s>0?100/V.s:1),x0=Math.round(V.cx/st)*st;let h='<table class="tt"><tr><th>x</th>'+fns.map(o=>`<th style="color:${COL[o.i]}">f${o.i+1}</th>`).join('')+'</tr>';
    for(let k=-5;k<=5;k++){const x=x0+k*st;h+=`<tr><td>${fmt(+x.toFixed(10))}</td>`+fns.map(o=>{let y;try{y=o.f(x)}catch(e){y=NaN}return`<td>${fmt(+y.toFixed(8))}</td>`}).join('')+'</tr>'}t.innerHTML=h+'</table>'}
  function info(){const i=$('#gInfo',el);if(!probe||!fns.length){return}i.innerHTML='x = <b>'+fmt(+probe.x.toFixed(6))+'</b> · '+fns.map(o=>{let y;try{y=o.f(probe.x)}catch(e){y=NaN}return`<span style="color:${COL[o.i]}">f${o.i+1} = <b>${fmt(+y.toFixed(6))}</b></span>`}).join(' · ')}
  const zoom=(k,px=W/2,py=H/2)=>{const ax=ix(px),ay=iy(py);V.s=Math.min(Math.max(V.s*k,0.5),5e5);V.cx=ax-(px-W/2)/V.s;V.cy=ay+(py-H/2)/V.s;draw()};
  cv.onwheel=e=>{e.preventDefault();const r=cv.getBoundingClientRect();zoom(e.deltaY<0?1.15:1/1.15,e.clientX-r.left,e.clientY-r.top)};
  cv.onpointerdown=e=>{cv.setPointerCapture(e.pointerId);pts.set(e.pointerId,{x:e.clientX,y:e.clientY});touch={moved:0}};
  cv.onpointermove=e=>{if(!pts.has(e.pointerId))return;const p=pts.get(e.pointerId),r=cv.getBoundingClientRect();
    if(pts.size===1){V.cx-=(e.clientX-p.x)/V.s;V.cy+=(e.clientY-p.y)/V.s;touch.moved+=Math.abs(e.clientX-p.x)+Math.abs(e.clientY-p.y);pts.set(e.pointerId,{x:e.clientX,y:e.clientY});draw()}
    else if(pts.size===2){const o=[...pts].find(([id])=>id!==e.pointerId)[1],d0=Math.hypot(p.x-o.x,p.y-o.y);pts.set(e.pointerId,{x:e.clientX,y:e.clientY});const d1=Math.hypot(e.clientX-o.x,e.clientY-o.y);touch.moved+=9;if(d0>0)zoom(d1/d0,(e.clientX+o.x)/2-r.left,(e.clientY+o.y)/2-r.top)}};
  cv.onpointerup=cv.onpointercancel=e=>{if(touch&&touch.moved<6&&pts.size===1){const r=cv.getBoundingClientRect();probe={x:ix(e.clientX-r.left)};draw();info()}pts.delete(e.pointerId)};
  el.oninput=e=>{if(e.target.dataset.f!==undefined){parse();draw()}};
  el.onchange=e=>{if(e.target.type==='checkbox')draw()};
  $('#gHome',el).onclick=()=>{V.cx=0;V.cy=0;V.s=40;draw()};$('#gZi',el).onclick=()=>zoom(1.4);$('#gZo',el).onclick=()=>zoom(1/1.4);
  const ro=new ResizeObserver(size);ro.observe(cv);G.stop=()=>{ro.disconnect();G.stop=null};
  parse();size();
}

/* ---------- Calculadora científica ---------- */
function viewCalc(el){
  let deg=Store.get('calcDeg',true);const hist=Store.get('calcHist',[]);
  const keys=['sin(','cos(','tan(','√(','C','⌫','ln(','log(','^','(',')','÷','7','8','9','×','π','e','!','4','5','6','−','x²','1/','%','1','2','3','+','Ans','0','.','=','DEG'];
  el.innerHTML=`<input id="cIn" inputmode="none" autocapitalize="off" autocomplete="off" placeholder="Escribe: 2(3+4)^2 / sqrt(16)…"><div id="cOut" class="cout">&nbsp;</div>
  <div class="ckeys">${keys.map(k=>`<button type="button" data-k="${k}" class="${/^[0-9.]$/.test(k)?'num':k==='='?'primary':'fn'}">${k}</button>`).join('')}</div>
  <div id="cHist" class="chist"></div>`;
  const inp=$('#cIn',el),out=$('#cOut',el);
  const live=()=>{out.classList.remove('bad');const v=inp.value.trim();if(!v){out.innerHTML='&nbsp;';return null}try{const r=compile(v,deg)(0);out.textContent='= '+fmt(r);return r}catch(e){out.textContent=e.message;out.classList.add('bad');return null}};
  const hs=()=>{$('#cHist',el).innerHTML=hist.slice(0,6).map((h,i)=>`<button type="button" data-h="${i}">${esc(h.e)} = <b>${esc(h.r)}</b></button>`).join('')};
  const ins=t=>{const a=inp.selectionStart??inp.value.length,b=inp.selectionEnd??a;inp.value=inp.value.slice(0,a)+t+inp.value.slice(b);inp.setSelectionRange(a+t.length,a+t.length);live()};
  const eq=()=>{const r=live();if(r===null)return;compile.ans=r;hist.unshift({e:inp.value,r:fmt(r)});hist.length=Math.min(hist.length,20);Store.set('calcHist',hist);hs();inp.value=fmt(r);out.innerHTML='&nbsp;'};
  const degBtn=$('[data-k=DEG]',el);degBtn.textContent=deg?'DEG':'RAD';
  el.onclick=e=>{const b=e.target.closest('button');if(!b)return;
    if(b.dataset.h!==undefined){inp.value=hist[b.dataset.h].e;live();return}
    const k=b.dataset.k;if(!k)return;
    if(k==='C'){inp.value='';live()}else if(k==='⌫'){inp.value=inp.value.slice(0,-1);live()}else if(k==='=')eq();
    else if(k==='DEG'){deg=!deg;Store.set('calcDeg',deg);b.textContent=deg?'DEG':'RAD';live()}
    else if(k==='x²')ins('^2');else if(k==='Ans')ins('ans');else ins(k)};
  inp.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();eq()}};inp.oninput=live;hs();
  el.insertAdjacentHTML('beforeend','<p class="hint">Entiende 2x, 3(4+1), 5!, 20%, |x|, π, e y «ans» (resultado anterior). Los ángulos usan '+'el modo DEG/RAD de la tecla.</p>');
}

/* ---------- Ecuaciones ---------- */
function viewEcu(el){
  el.innerHTML=`<h4>Ecuación cuadrática  ax² + bx + c = 0</h4><div class="row3"><input id="qa" placeholder="a" inputmode="decimal" value="1"><input id="qb" placeholder="b" inputmode="decimal" value="-3"><input id="qc" placeholder="c" inputmode="decimal" value="2"></div><div id="qo" class="res"></div>
  <h4>Sistema 2×2   a₁x + b₁y = c₁ · a₂x + b₂y = c₂</h4><div class="row3"><input id="s1" placeholder="a₁" inputmode="decimal" value="2"><input id="s2" placeholder="b₁" inputmode="decimal" value="1"><input id="s3" placeholder="c₁" inputmode="decimal" value="5"></div><div class="row3"><input id="s4" placeholder="a₂" inputmode="decimal" value="1"><input id="s5" placeholder="b₂" inputmode="decimal" value="-1"><input id="s6" placeholder="c₂" inputmode="decimal" value="1"></div><div id="so" class="res"></div>
  <h4>Resolver cualquier f(x) = 0 (método numérico)</h4><input id="nf" placeholder="ej. x^3 - 2x - 5" value="x^3-2x-5"><div id="no" class="res"></div>${askBtn('Resuelve paso a paso la ecuación cuadrática')}`;
  const v=id=>{const t=$('#'+id,el).value.replace(',','.');return t.trim()===''?NaN:Number(t)};
  function quad(){const a=v('qa'),b=v('qb'),c=v('qc'),o=$('#qo',el);if([a,b,c].some(isNaN)){o.textContent='Completa a, b y c';return}
    if(a===0){o.innerHTML=b===0?'No es una ecuación':'Es lineal: x = <b>'+fmt(-c/b)+'</b>';return}
    const D=b*b-4*a*c,vx=-b/(2*a),vy=a*vx*vx+b*vx+c;let h='Discriminante Δ = b² − 4ac = <b>'+fmt(D)+'</b><br>';
    if(D>0)h+='Dos soluciones reales: x₁ = <b>'+fmt((-b+Math.sqrt(D))/(2*a))+'</b>, x₂ = <b>'+fmt((-b-Math.sqrt(D))/(2*a))+'</b>';
    else if(D===0)h+='Una solución doble: x = <b>'+fmt(vx)+'</b>';
    else h+='Soluciones complejas: x = <b>'+fmt(vx)+' ± '+fmt(Math.sqrt(-D)/(2*Math.abs(a)))+'i</b>';
    o.innerHTML=h+'<br>Vértice: (<b>'+fmt(vx)+'</b>, <b>'+fmt(vy)+'</b>) · se abre hacia '+(a>0?'arriba':'abajo')+' · corta el eje y en <b>'+fmt(c)+'</b>';
    $('.askL',el).dataset.ask='Resuelve paso a paso, explicando cada uno, la ecuación '+fmt(a)+'x² + '+fmt(b)+'x + '+fmt(c)+' = 0, y grafica la parábola.'}
  function sys(){const [a,b,c,d,e,f]=[1,2,3,4,5,6].map(i=>v('s'+i)),o=$('#so',el);if([a,b,c,d,e,f].some(isNaN)){o.textContent='Completa los 6 números';return}
    const D=a*e-b*d;if(D===0){o.textContent=(a*f-c*d===0&&b*f-c*e===0)?'Infinitas soluciones (rectas iguales)':'Sin solución (rectas paralelas)';return}
    o.innerHTML='x = <b>'+fmt((c*e-b*f)/D)+'</b> · y = <b>'+fmt((a*f-c*d)/D)+'</b> (regla de Cramer, det = '+fmt(D)+')'}
  function num(){const o=$('#no',el);try{const f=compile($('#nf',el).value.replace(/^\s*(f\(x\)|y)\s*=/,''),false),roots=[];let px=-50,py=f(px);
      for(let x=-50+.01;x<=50&&roots.length<8;x+=.01){const y=f(x);if(isFinite(py)&&isFinite(y)&&py*y<=0&&Math.abs(y-py)<1e3){let l=x-.01,r=x;for(let k=0;k<60;k++){const m=(l+r)/2;(f(l)*f(m)<=0)?r=m:l=m}const z=(l+r)/2;if(Math.abs(f(z))<1e-6&&!roots.some(q=>Math.abs(q-z)<1e-4))roots.push(z)}py=y}
      o.innerHTML=roots.length?'Raíces entre −50 y 50: '+roots.map(r=>'<b>'+fmt(+r.toFixed(8))+'</b>').join(' · '):'No encontré raíces reales entre −50 y 50'}catch(er){o.textContent=er.message}}
  el.oninput=()=>{quad();sys();num()};quad();sys();num();
}

/* ---------- Tarjetas (repaso espaciado) ---------- */
function viewTarj(el){
  const cards=Store.get('cards',[]),DAY=864e5,IV=[0,1,3,7,14,30];let flip=false,mode='study';
  const save=()=>Store.set('cards',cards),due=()=>cards.filter(c=>c.due<=Date.now());
  function render(){
    const d=due();el.innerHTML=`<div class="tgl"><button type="button" data-m="study" aria-pressed="${mode==='study'}">Estudiar (${d.length})</button><button type="button" data-m="add" aria-pressed="${mode==='add'}">Añadir</button><button type="button" data-m="list" aria-pressed="${mode==='list'}">Mis tarjetas (${cards.length})</button></div><div id="tv"></div>`;
    const tv=$('#tv',el);
    if(mode==='add'){tv.innerHTML=`<input id="cq" placeholder="Pregunta o concepto"><textarea id="ca" placeholder="Respuesta" rows="3"></textarea><div class="row"><button type="button" id="cAdd" class="primary">Guardar tarjeta</button></div><p class="hint">¿Sin ganas de escribir? Pídele a Lumi que te prepare tarjetas y copia las que quieras.</p>${askBtn('Hazme 8 tarjetas de estudio (pregunta → respuesta corta) sobre el último tema que vimos')}`;
      $('#cAdd',el).onclick=()=>{const q=$('#cq',el).value.trim(),a=$('#ca',el).value.trim();if(!q||!a)return;cards.push({q,a,box:0,due:0});save();$('#cq',el).value=$('#ca',el).value='';$('#cq',el).focus();$('#cAdd',el).textContent='✔ Guardada (+1)';setTimeout(()=>{const b=$('#cAdd',el);if(b)b.textContent='Guardar tarjeta'},900)}}
    else if(mode==='list'){tv.innerHTML=cards.length?cards.map((c,i)=>`<div class="lrow"><div><b>${esc(c.q)}</b><br><span class="hint">${esc(c.a)}</span></div><button type="button" data-del="${i}" aria-label="Borrar">✕</button></div>`).join(''):'<p class="hint">Todavía no tienes tarjetas.</p>';
      tv.onclick=e=>{const b=e.target.closest('[data-del]');if(b){cards.splice(+b.dataset.del,1);save();render()}}}
    else{if(!cards.length){tv.innerHTML='<p class="hint">Crea tu primera tarjeta en «Añadir». Las que falles vuelven pronto; las que sepas aparecen cada vez más espaciadas.</p>';}
      else if(!d.length){tv.innerHTML='<p class="done">🎉 ¡Todo repasado por hoy!</p>'}
      else{const c=d[0];tv.innerHTML=`<div class="card ${flip?'back':''}" id="fc"><small>${flip?'Respuesta':'Pregunta'}</small><div>${esc(flip?c.a:c.q)}</div></div>`+(flip?`<div class="row"><button type="button" id="no">😅 No me la sabía</button><button type="button" id="si" class="primary">😎 Me la sabía</button></div>`:'<p class="hint" style="text-align:center">Toca la tarjeta para ver la respuesta</p>');
        $('#fc',el).onclick=()=>{if(!flip){flip=true;render()}};
        if(flip){$('#no',el).onclick=()=>{c.box=0;c.due=Date.now()+60e3;flip=false;save();render()};$('#si',el).onclick=()=>{c.box=Math.min(c.box+1,5);c.due=Date.now()+IV[c.box]*DAY;flip=false;save();try{Shop.earn(1)}catch(e){}render()}}}}
    el.querySelector('.tgl').onclick=e=>{const b=e.target.closest('[data-m]');if(b){mode=b.dataset.m;flip=false;render()}}}
  render();
}

/* ---------- Pomodoro ---------- */
const P={end:0,left:0,run:false,phase:'work',t:null};
function beep(){try{const a=new(window.AudioContext||window.webkitAudioContext)(),o=a.createOscillator(),g=a.createGain();o.connect(g);g.connect(a.destination);o.frequency.value=880;g.gain.setValueAtTime(.2,a.currentTime);g.gain.exponentialRampToValueAtTime(.001,a.currentTime+1);o.start();o.stop(a.currentTime+1)}catch(e){}try{navigator.vibrate&&navigator.vibrate([200,100,200])}catch(e){}}
function viewPomo(el){
  const cfg=Store.get('pomo',{w:25,b:5});const today=new Date().toDateString(),st=Store.get('pomoDone',{d:today,n:0});if(st.d!==today){st.d=today;st.n=0}
  if(!P.left)P.left=cfg.w*60e3;
  el.innerHTML=`<div class="pomo"><div id="pPh" class="ph"></div><div id="pT" class="clock"></div><div class="row"><button type="button" id="pGo" class="primary"></button><button type="button" id="pRs">Reiniciar</button><button type="button" id="pSk">Saltar</button></div>
  <div class="row3"><label>Estudio (min)<input id="pw" type="number" min="1" max="120" value="${cfg.w}"></label><label>Descanso (min)<input id="pb" type="number" min="1" max="60" value="${cfg.b}"></label><label>Hoy<input id="pn" disabled value="${st.n} 🍅"></label></div>
  <p class="hint">Mantén esta pestaña abierta; el temporizador sigue aunque cierres la ventana de herramientas y suena al terminar.</p></div>`;
  const paint=()=>{const ms=P.run?Math.max(0,P.end-Date.now()):P.left,s=Math.ceil(ms/1000);$('#pT',el)&&($('#pT',el).textContent=String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0'));
    if($('#pPh',el)){$('#pPh',el).textContent=P.phase==='work'?'📚 A estudiar':'☕ Descanso';$('#pGo',el).textContent=P.run?'Pausar':'Empezar'}};
  const next=()=>{if(P.phase==='work'){st.n++;Store.set('pomoDone',st);try{Shop.earn(3)}catch(e){}}P.phase=P.phase==='work'?'break':'work';P.left=(P.phase==='work'?cfg.w:cfg.b)*60e3;P.run=false;clearInterval(P.t)};
  const tick=()=>{if(P.run&&Date.now()>=P.end){beep();next();const n=$('#pn',el);if(n)n.value=st.n+' 🍅'}paint()};
  const go=()=>{if(P.run){P.left=P.end-Date.now();P.run=false;clearInterval(P.t)}else{P.end=Date.now()+P.left;P.run=true;clearInterval(P.t);P.t=setInterval(()=>{tick()},500)}paint()};
  $('#pGo',el).onclick=go;$('#pRs',el).onclick=()=>{clearInterval(P.t);P.run=false;P.phase='work';P.left=cfg.w*60e3;paint()};$('#pSk',el).onclick=()=>{next();paint()};
  el.onchange=()=>{cfg.w=Math.max(1,+$('#pw',el).value||25);cfg.b=Math.max(1,+$('#pb',el).value||5);Store.set('pomo',cfg);if(!P.run){P.left=(P.phase==='work'?cfg.w:cfg.b)*60e3;paint()}};
  paint();
}

/* ---------- Conversor ---------- */
const UN={
 'Longitud':{m:1,km:1e3,cm:.01,mm:.001,'milla':1609.344,yarda:.9144,pie:.3048,pulgada:.0254},
 'Masa':{kg:1,g:.001,mg:1e-6,t:1e3,libra:.45359237,onza:.028349523},
 'Tiempo':{s:1,min:60,h:3600,'día':86400,semana:604800,'año':31557600},
 'Volumen':{L:1,mL:.001,'m³':1e3,'galón (US)':3.785411784,'taza':.2365882365,'cm³':.001},
 'Área':{'m²':1,'km²':1e6,'cm²':1e-4,ha:1e4,'acre':4046.8564,'pie²':.09290304},
 'Velocidad':{'m/s':1,'km/h':1/3.6,'mph':.44704,nudo:.514444},
 'Energía':{J:1,kJ:1e3,cal:4.184,kcal:4184,kWh:3.6e6},
 'Datos':{B:1,KB:1024,MB:1048576,GB:1073741824,TB:1099511627776,bit:.125},
 'Temperatura':null};
function viewConv(el){
  const cats=Object.keys(UN);el.innerHTML=`<label>Magnitud<select id="vc">${cats.map(c=>`<option>${c}</option>`).join('')}</select></label><div class="cv"><input id="va" inputmode="decimal" value="1"><select id="vf"></select></div><div class="sw">⇅</div><div class="cv"><input id="vb" inputmode="decimal"><select id="vt"></select></div><div id="vAll" class="hint"></div>`;
  const vc=$('#vc',el),vf=$('#vf',el),vt=$('#vt',el),va=$('#va',el),vb=$('#vb',el);
  const units=()=>UN[vc.value]?Object.keys(UN[vc.value]):['°C','°F','K'];
  const toBase=(x,u)=>vc.value==='Temperatura'?(u==='°C'?x:u==='°F'?(x-32)*5/9:x-273.15):x*UN[vc.value][u];
  const fromBase=(x,u)=>vc.value==='Temperatura'?(u==='°C'?x:u==='°F'?x*9/5+32:x+273.15):x/UN[vc.value][u];
  const fill=()=>{const u=units();vf.innerHTML=vt.innerHTML=u.map(x=>`<option>${x}</option>`).join('');vt.selectedIndex=Math.min(1,u.length-1);calc()};
  const calc=()=>{const x=parseFloat(va.value.replace(',','.'));if(isNaN(x)){vb.value='';return}vb.value=fmt(+fromBase(toBase(x,vf.value),vt.value).toPrecision(10));
    $('#vAll',el).textContent=units().filter(u=>u!==vf.value).slice(0,7).map(u=>fmt(+fromBase(toBase(x,vf.value),u).toPrecision(6))+' '+u).join(' · ')};
  vc.onchange=fill;vf.onchange=vt.onchange=va.oninput=calc;
  vb.oninput=()=>{const y=parseFloat(vb.value.replace(',','.'));if(!isNaN(y))va.value=fmt(+fromBase(toBase(y,vt.value),vf.value).toPrecision(10))};
  $('.sw',el).onclick=()=>{const a=vf.selectedIndex;vf.selectedIndex=vt.selectedIndex;vt.selectedIndex=a;calc()};fill();
}

/* ---------- Notas y promedio ---------- */
function viewProm(el){
  const rows=Store.get('grades',[{n:'',p:30},{n:'',p:30}]);
  el.innerHTML=`<p class="hint">Escribe tus notas y cuánto vale cada una (%). Te digo tu promedio y cuánto necesitas en lo que falta.</p><div id="gr"></div><div class="row"><button type="button" id="gAdd">＋ Añadir nota</button></div>
  <label>Nota que quieres lograr<input id="gT" inputmode="decimal" value="${Store.get('gTarget',6)}"></label><label>Nota máxima<input id="gM" inputmode="decimal" value="${Store.get('gMax',10)}"></label><div id="go2" class="res"></div>`;
  const draw=()=>{$('#gr',el).innerHTML=rows.map((r,i)=>`<div class="grow"><input data-i="${i}" data-k="n" inputmode="decimal" placeholder="Nota" value="${esc(r.n)}"><input data-i="${i}" data-k="p" inputmode="decimal" placeholder="%" value="${esc(r.p)}"><button type="button" data-d="${i}" aria-label="Quitar">✕</button></div>`).join('')};
  const calc=()=>{Store.set('grades',rows);const T=+$('#gT',el).value.replace(',','.'),M=+$('#gM',el).value.replace(',','.')||10;Store.set('gTarget',T);Store.set('gMax',M);
    const ok=rows.filter(r=>r.n!==''&&!isNaN(+String(r.n).replace(',','.'))),w=ok.reduce((a,r)=>a+(+String(r.p).replace(',','.')||0),0),s=ok.reduce((a,r)=>a+(+String(r.n).replace(',','.'))*(+String(r.p).replace(',','.')||0),0),o=$('#go2',el);
    if(!w){o.textContent='Añade al menos una nota con su porcentaje';return}
    let h='Promedio actual (de lo ya evaluado): <b>'+fmt(+(s/w).toFixed(2))+'</b> · evaluado: <b>'+fmt(w)+'%</b>';
    const rest=100-w;if(rest>0){const need=(T*100-s)/rest;h+='<br>Para llegar a '+fmt(T)+' necesitas promediar <b>'+fmt(+need.toFixed(2))+'</b> en el '+fmt(rest)+'% restante'+(need>M?' (🙈 no alcanza, el máximo es '+fmt(M)+')':need<=0?' (✅ ¡ya lo lograste!)':'')}
    else h+='<br>Nota final: <b>'+fmt(+(s/100).toFixed(2))+'</b> '+(s/100>=T?'✅ ¡Aprobaste!':'')+'';o.innerHTML=h};
  el.oninput=e=>{const d=e.target.dataset;if(d.i!==undefined)rows[d.i][d.k]=e.target.value;calc()};
  el.onclick=e=>{if(e.target.id==='gAdd'){rows.push({n:'',p:''});draw()}const b=e.target.closest('[data-d]');if(b){rows.splice(+b.dataset.d,1);draw();calc()}};
  draw();calc();
}
function viewNota(el){
  el.innerHTML=`<p class="hint">Tus apuntes se guardan en este dispositivo.</p><textarea id="nt" rows="12" placeholder="Escribe aquí tus apuntes, fórmulas, pendientes…">${esc(Store.get('notes',''))}</textarea><div class="row"><button type="button" id="ntCopy">Copiar</button><button type="button" id="ntDl">Descargar .txt</button></div>`;
  const t=$('#nt',el);t.oninput=()=>Store.set('notes',t.value);
  $('#ntCopy',el).onclick=()=>{navigator.clipboard&&navigator.clipboard.writeText(t.value)};
  $('#ntDl',el).onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t.value],{type:'text/plain'}));a.download='apuntes-lumi.txt';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),2000)};
}
const VIEWS={graf:viewGraf,calc:viewCalc,ecu:viewEcu,tarj:viewTarj,pomo:viewPomo,conv:viewConv,prom:viewProm,nota:viewNota};

/* ---------- Botón en la barra ---------- */
function init(){
  const util=$('.topbar .util');if(!util)return;
  const b=document.createElement('button');b.id='toolsBtn';b.className='tb';b.type='button';b.title='Herramientas de estudio';b.setAttribute('aria-label','Herramientas de estudio');b.textContent='🧰';
  util.insertBefore(b,$('#shopBtn')||util.firstChild);
  b.onclick=()=>{if(!dlg)build();show(VIEWS[Store.get('toolTab','graf')]?Store.get('toolTab','graf'):'graf');dlg.showModal()};
}
window.LumiTools={compile,esc,fmt,askBtn,register(id,ic,nm,fn){TABS.push([id,ic,nm]);VIEWS[id]=fn},setStop(f){G.stop=f}};
init();
})();
