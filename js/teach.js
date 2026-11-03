/* Herramientas de enseñanza de Lumi: elementos extra de pizarra que la IA puede pedir (timeline, concept, compare, numline, flow, chart, match, blank, tf, flash).
   Se enganchan a Board.draw sin tocar el resto. Todo el texto se inserta como texto (nada de HTML de la IA). */
(()=>{
if(typeof Board==='undefined')return;
const NS='http://www.w3.org/2000/svg',sheet=()=>document.getElementById('sheet'),box=()=>document.getElementById('board');
const C=['var(--blue)','var(--yel)','var(--pink)','var(--chalk)'];
const el=(tag,cls,par,txt)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;if(par)par.appendChild(e);return e};
const sv=(n,a,par,t)=>{const e=document.createElementNS(NS,n);for(const k in a)e.setAttribute(k,a[k]);if(t!=null)e.textContent=t;if(par)par.appendChild(e);return e};
const reveal=n=>requestAnimationFrame(()=>requestAnimationFrame(()=>{n.classList.add('on','focus');setTimeout(()=>n.classList.remove('focus'),1800);box().scrollTop=box().scrollHeight}));
const put=(cls,par)=>{const d=el('div','it '+cls,par||sheet());return d};
const T=s=>{s=String(s==null?'':s);return window.Tex&&Tex.text?Tex.text(s):s};
const clip=(s,n)=>{s=T(s);return s.length>n?s.slice(0,n-1)+'…':s};
const norm=s=>String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9ñ]/g,'');
function rich(p,t){const s=window.Tex&&Tex.fix?Tex.fix(String(t==null?'':t)):String(t==null?'':t);
  s.split(/(\$[^$]+\$)/).forEach(x=>{
    if(/^\$[^$]+\$$/.test(x)){const m=x.slice(1,-1),sp=el('span','',p);let ok=false;if(window.katex)try{katex.render(window.Tex&&Tex.norm?Tex.norm(m):m,sp,{throwOnError:false,displayMode:false,strict:'ignore'});ok=true}catch(e){}if(!ok)sp.textContent=window.Tex&&Tex.conv?Tex.conv(m):m}
    else x.split(/\*\*([^*]+)\*\*/).forEach((q,i)=>{if(q)i%2?el('b','',p,q):p.appendChild(document.createTextNode(q))})});return p}
const done=ok=>{if(Board.onQuiz)Board.onQuiz(ok)};
const arr=a=>Array.isArray(a)?a:[];

const E={
timeline(it){
  const w=el('div','t-tl',sheet());if(it.title)rich(el('b','',w),it.title);const ev=arr(it.events).slice(0,10);
  ev.forEach((e,i)=>setTimeout(()=>{const r=put('tl-row',w);el('span','tl-dot',r);const c=el('div','tl-body',r);rich(el('b','',c),e.when);rich(el('div','',c),e.what);reveal(r)},i*800));
  return ev.length*800+400},
concept(it){
  const W=360,H=300,cx=W/2,cy=H/2,ns=arr(it.nodes).slice(0,8),d=put('t-fig');
  const s=sv('svg',{viewBox:`0 0 ${W} ${H}`,class:'graph'},d);
  ns.forEach((n,i)=>{const a=-Math.PI/2+i*2*Math.PI/ns.length,x=cx+Math.cos(a)*128,y=cy+Math.sin(a)*98,col=C[i%3];
    sv('line',{x1:cx,y1:cy,x2:x,y2:y,style:`stroke:${col};stroke-width:2;stroke-dasharray:4 4`},s);
    const lab=clip(typeof n==='string'?n:n.label,18),w=Math.max(60,lab.length*7.4+16);
    sv('rect',{x:x-w/2,y:y-14,width:w,height:28,rx:14,style:`fill:var(--board,#222);stroke:${col};stroke-width:2`},s);
    sv('text',{x,y:y+4,'text-anchor':'middle','font-size':12,fill:'currentColor'},s,lab)});
  const cl=clip(it.center||'',20),rx=Math.max(52,cl.length*5.2+14);sv('ellipse',{cx,cy,rx,ry:26,style:'fill:var(--board,#222)'},s);sv('ellipse',{cx,cy,rx,ry:26,style:'fill:var(--yel);fill-opacity:.2;stroke:var(--yel);stroke-width:3'},s);
  sv('text',{x:cx,y:cy+5,'text-anchor':'middle','font-size':14,'font-weight':700,fill:'currentColor'},s,cl);
  const notes=ns.filter(n=>n&&n.note);if(notes.length||it.caption){const c=el('div','t-note',d);notes.forEach(n=>{const r=el('div','',c);rich(el('b','',r),n.label+': ');rich(r,n.note)});if(it.caption)rich(el('div','',c),it.caption)}
  reveal(d);return 1600},
compare(it){
  const d=put('t-cmp');[it.a,it.b].forEach((x,i)=>{x=x||{};const c=el('div','t-box '+(i?'ex':'def'),d);rich(el('b','',c),x.title||(i?'B':'A'));const ul=el('ul','',c);arr(x.points).slice(0,6).forEach(p=>rich(el('li','',ul),p))});
  if(it.caption)rich(el('div','t-note cap',d),it.caption);reveal(d);return 1500},
numline(it){
  const W=360,H=96,m=22,lo=+it.min,hi=+it.max;if(!(hi>lo))return 500;
  const X=v=>m+(v-lo)/(hi-lo)*(W-2*m),d=put('t-fig'),s=sv('svg',{viewBox:`0 0 ${W} ${H}`,class:'graph'},d),y=56;
  sv('line',{x1:m-8,x2:W-m+8,y1:y,y2:y,style:'stroke:currentColor;stroke-width:2'},s);sv('path',{d:`M${W-m+8} ${y}l-7 -4v8zM${m-8} ${y}l7 -4v8z`,fill:'currentColor'},s);
  const raw=(hi-lo)/10,p=10**Math.floor(Math.log10(raw)),f=raw/p,st=(f<=1?1:f<=2?2:f<=5?5:10)*p;
  for(let v=Math.ceil(lo/st)*st;v<=hi+1e-9;v+=st){sv('line',{x1:X(v),x2:X(v),y1:y-5,y2:y+5,style:'stroke:currentColor'},s);sv('text',{x:X(v),y:y+20,'text-anchor':'middle','font-size':11,fill:'currentColor'},s,String(+v.toFixed(6)))}
  arr(it.intervals).forEach((iv,i)=>{const col=C[i%3],a=iv.from==null?lo:+iv.from,b=iv.to==null?hi:+iv.to;
    sv('line',{x1:X(Math.max(lo,a)),x2:X(Math.min(hi,b)),y1:y,y2:y,style:`stroke:${col};stroke-width:6;stroke-linecap:round;opacity:.85`},s);
    [[a,iv.from==null,iv.openFrom],[b,iv.to==null,iv.openTo]].forEach(([v,inf,open])=>{if(inf)return;sv('circle',{cx:X(v),cy:y,r:6,style:`stroke:${col};stroke-width:3;fill:${open?'var(--board,#222)':col}`},s)})});
  arr(it.points).forEach(pt=>{const v=+pt.v;if(!isFinite(v))return;sv('circle',{cx:X(v),cy:y,r:5,style:`fill:${pt.open?'var(--board,#222)':'var(--pink)'};stroke:var(--pink);stroke-width:2.5`},s);if(pt.label)sv('text',{x:X(v),y:y-14,'text-anchor':'middle','font-size':13,'font-weight':700,fill:'currentColor'},s,clip(pt.label,12))});
  if(it.caption)rich(el('div','t-note',d),it.caption);reveal(d);return 1300},
flow(it){
  const w=el('div','t-flow',sheet());if(it.title)rich(el('b','',w),it.title);const st=arr(it.steps).slice(0,8),row=el('div','fl-row',w);
  st.forEach((x,i)=>setTimeout(()=>{if(i){const a=el('span','fl-ar',row,'➜');a.style.opacity=1}const b=put('fl-box',row);b.style.borderColor=C[i%3];const n=el('small','',b,String(i+1));rich(el('div','',b),x);reveal(b)},i*750));
  return st.length*750+300},
chart(it){
  const L=arr(it.labels).slice(0,8),V=arr(it.values).slice(0,8).map(Number),n=Math.min(L.length,V.length);if(!n)return 500;
  const d=put('t-fig');if(it.title)rich(el('b','t-note',d),it.title);const W=360,H=240,s=sv('svg',{viewBox:`0 0 ${W} ${H}`,class:'graph'},d);
  if(it.kind==='pie'){const tot=V.slice(0,n).reduce((a,b)=>a+Math.max(0,b),0)||1,cx=110,cy=120,r=90;let a0=-Math.PI/2;
    V.slice(0,n).forEach((v,i)=>{const fr=Math.max(0,v)/tot,a1=a0+fr*2*Math.PI,big=fr>.5?1:0,col=`hsl(${i*47+190} 70% 62%)`;
      if(fr>=.9999)sv('circle',{cx,cy,r,style:`fill:${col}`},s);else sv('path',{d:`M${cx} ${cy}L${cx+r*Math.cos(a0)} ${cy+r*Math.sin(a0)}A${r} ${r} 0 ${big} 1 ${cx+r*Math.cos(a1)} ${cy+r*Math.sin(a1)}Z`,style:`fill:${col};stroke:var(--board,#222);stroke-width:2`},s);
      sv('rect',{x:224,y:30+i*24,width:12,height:12,rx:3,style:`fill:${col}`},s);sv('text',{x:242,y:41+i*24,'font-size':12,fill:'currentColor'},s,clip(L[i],14)+' '+Math.round(fr*100)+'%');a0=a1})}
  else{const mx=Math.max(...V.slice(0,n),1e-9),mn=Math.min(0,...V.slice(0,n)),bw=(W-50)/n,top=24,bot=H-34,Y=v=>bot-(v-mn)/(mx-mn)*(bot-top);
    sv('line',{x1:30,x2:W-10,y1:Y(0),y2:Y(0),style:'stroke:currentColor;stroke-width:2'},s);
    V.slice(0,n).forEach((v,i)=>{const x=36+i*bw,col=C[i%3];sv('rect',{x:x+4,y:Math.min(Y(v),Y(0)),width:bw-8,height:Math.max(2,Math.abs(Y(v)-Y(0))),rx:4,style:`fill:${col};fill-opacity:.8`},s);
      sv('text',{x:x+bw/2,y:Y(v)-5,'text-anchor':'middle','font-size':12,'font-weight':700,fill:'currentColor'},s,String(+v.toFixed(4)));sv('text',{x:x+bw/2,y:H-14,'text-anchor':'middle','font-size':11,fill:'currentColor'},s,clip(L[i],10))})}
  if(it.caption)rich(el('div','t-note',d),it.caption);reveal(d);return 1400},
match(it){
  const ps=arr(it.pairs).filter(p=>Array.isArray(p)&&p.length>=2).slice(0,6);if(ps.length<2)return 500;
  const d=put('t-quiz t-match');rich(el('b','',d),it.q||'Une cada concepto con su pareja');const g=el('div','mt-grid',d),A=el('div','',g),B=el('div','',g),msg=el('div','qres',d);
  const order=ps.map((_,i)=>i).sort(()=>Math.random()-.5);let sel=null,ok=0,bad=0;
  ps.forEach((p,i)=>{const b=el('button','',A);b.type='button';rich(b,p[0]);b.dataset.i=i;b.onclick=()=>{if(b.disabled)return;A.querySelectorAll('button').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');sel=b}});
  order.forEach(i=>{const b=el('button','',B);b.type='button';rich(b,ps[i][1]);b.dataset.i=i;b.onclick=()=>{if(b.disabled||!sel)return;
    if(sel.dataset.i===b.dataset.i){sel.classList.remove('sel');sel.classList.add('good');b.classList.add('good');sel.disabled=b.disabled=true;sel=null;if(++ok===ps.length){msg.textContent=bad?'¡Listo! Con algunos intentos extra, ¡así se aprende!':'¡Todas bien a la primera!';done(!bad)}}
    else{bad++;b.classList.add('bad');setTimeout(()=>b.classList.remove('bad'),600)}}});
  reveal(d);return 1300},
blank(it){
  const ans=arr(it.answers).map(String),parts=String(it.text||'').split(/_{2,}/);if(parts.length<2)return 500;
  const d=put('t-quiz t-blank'),p=el('div','bl-text',d),ins=[];rich(el('b','',d),it.q||'Completa');d.insertBefore(d.lastChild,p);
  parts.forEach((x,i)=>{rich(el('span','',p),x);if(i<parts.length-1){const inp=el('input','',p);inp.setAttribute('autocomplete','off');inp.setAttribute('autocapitalize','off');inp.setAttribute('aria-label','Espacio '+(i+1));inp.size=Math.max(6,(ans[i]||'').length+2);ins.push(inp)}});
  const row=el('div','',d),b=el('button','',row,'Comprobar'),res=el('div','qres',d);let fin=false;
  if(it.hint){const h=el('details','',d);el('summary','',h,'Pista');rich(el('div','',h),it.hint)}
  b.type='button';b.onclick=()=>{if(fin)return;let all=true;ins.forEach((inp,i)=>{const ok=norm(inp.value)===norm(ans[i]||'');inp.classList.toggle('good',ok);inp.classList.toggle('bad',!ok);if(!ok)all=false});
    if(all){fin=true;res.textContent='¡Correcto! '+(it.why||'');done(true)}else res.textContent='Casi… revisa los marcados en rojo y prueba otra vez.'};
  reveal(d);return 1200},
tf(it){
  const d=put('t-quiz');rich(el('b','',d),'¿Verdadero o falso? '+(it.q||''));const res=el('div','qres'),ans=it.answer===true||String(it.answer).toLowerCase()==='true';let fin=false;
  [['Verdadero',true],['Falso',false]].forEach(([l,v])=>{const b=el('button','',d,l);b.type='button';b.onclick=()=>{if(fin)return;fin=true;const ok=v===ans;b.classList.add(ok?'good':'bad');if(!ok)[...d.querySelectorAll('button')].find(x=>x.textContent===(ans?'Verdadero':'Falso')).classList.add('good');res.textContent=(ok?'¡Correcto! ':'Casi. ')+(it.why||'');d.appendChild(res);done(ok)}});
  reveal(d);return 1100},
flash(it){
  const d=put('t-flash'),c=el('div','fc',d);let back=false;const draw=()=>{c.textContent='';el('small','',c,back?'Respuesta':(it.label||'Piénsalo…'));rich(el('div','',c),back?it.back:it.front);c.classList.toggle('back',back)};
  c.tabIndex=0;c.setAttribute('role','button');c.onclick=()=>{back=!back;draw()};c.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();c.onclick()}};
  draw();el('div','hint',d,'Toca la tarjeta para ver la respuesta');reveal(d);return 1100},
geo(it){
  const d=put('t-fig'),s=sv('svg',{viewBox:'0 0 360 270',class:'graph'},d),sh=String(it.shape||'triangle'),S=arr(it.sides),A=arr(it.angles),V=arr(it.vertices);
  const st='fill:var(--yel);fill-opacity:.12;stroke:var(--yel);stroke-width:3;stroke-linejoin:round',tx=(x,y,t,o={})=>{if(t==null||t==='')return;sv('text',{x,y,'text-anchor':o.a||'middle',style:`fill:${o.c||'var(--blue)'};font-size:${(o.s||15)+3}px;font-weight:${o.w||600}`},s,clip(t,14))};
  const poly=pts=>sv('polygon',{points:pts.map(p=>p.join(',')).join(' '),style:st},s);
  const vtx=(pts,off)=>pts.forEach((p,i)=>V[i]&&tx(p[0]+off[i][0],p[1]+off[i][1],V[i],{c:'currentColor',w:700,s:16}));
  const ang=(x,y,t)=>tx(x,y,t,{c:'var(--pink)',s:13});
  if(sh==='triangle'||sh==='rtriangle'){const r=sh==='rtriangle',P=r?[[70,230],[300,230],[70,60]]:[[60,230],[300,230],[200,50]];poly(P);
    tx(180,252,S[0]);tx(r?196:268,r?132:128,S[1],{a:'middle'});tx(r?50:112,r?150:128,S[2]);
    if(r)sv('path',{d:'M70 208h22v22',style:'fill:none;stroke:var(--pink);stroke-width:2'},s);else ang(P[0][0]+28,P[0][1]-8,A[0]);
    if(!r)ang(P[2][0],P[2][1]+28,A[2]);ang(P[1][0]-30,P[1][1]-8,A[1]);if(r)ang(P[2][0]+22,P[2][1]+30,A[2]);
    vtx(P,r?[[-14,6],[12,6],[-14,-4]]:[[-14,6],[14,6],[0,-10]])}
  else if(sh==='rect'||sh==='square'){const q=sh==='square',P=q?[[90,60],[270,60],[270,240],[90,240]]:[[60,70],[300,70],[300,220],[60,220]];poly(P);
    tx(180,q?260:244,S[0]);tx(q?290:322,q?154:150,S[1]!=null?S[1]:(q?S[0]:''),{a:q?'start':'middle'});
    sv('path',{d:`M${P[3][0]} ${P[3][1]-16}h16v16`,style:'fill:none;stroke:var(--pink);stroke-width:2'},s);
    if(it.diagonal){sv('line',{x1:P[3][0],y1:P[3][1],x2:P[1][0],y2:P[1][1],style:'stroke:var(--blue);stroke-width:2;stroke-dasharray:5 4'},s);tx(180,150,it.diagonal,{c:'var(--blue)'})}vtx([P[3],P[2],P[1],P[0]],[[-14,6],[14,6],[14,-4],[-14,-4]])}
  else if(sh==='circle'){sv('circle',{cx:180,cy:130,r:95,style:st},s);sv('circle',{cx:180,cy:130,r:3,style:'fill:var(--pink)'},s);
    if(it.diameter){sv('line',{x1:85,y1:130,x2:275,y2:130,style:'stroke:var(--blue);stroke-width:2.5'},s);tx(180,122,S[0]||'d')}
    else{sv('line',{x1:180,y1:130,x2:275,y2:130,style:'stroke:var(--blue);stroke-width:2.5'},s);tx(228,122,S[0]||'r')}
    if(S[1])tx(180,252,S[1],{c:'var(--yel)'})}
  else if(sh==='parallelogram'||sh==='trapezoid'){const p=sh==='parallelogram',P=p?[[90,230],[300,230],[260,70],[50,70]]:[[70,230],[300,230],[240,70],[130,70]];poly(P);
    tx(185,252,S[0]);tx(p?290:285,150,S[1],{a:'start'});if(!p)tx(185,56,S[2]);
    const hx=p?P[3][0]+10:P[3][0];sv('line',{x1:hx,y1:70,x2:hx,y2:230,style:'stroke:var(--pink);stroke-width:2;stroke-dasharray:5 4'},s);tx(hx-10,155,it.h||'h',{c:'var(--pink)',a:'end'})}
  else{rich(el('div','t-note',d),'(Figura no disponible)')}
  if(it.caption)rich(el('div','t-note',d),it.caption);reveal(d);return 1400},
fraction(it){
  const den=Math.max(1,Math.min(12,Math.round(+it.den)||2)),rows=[[Math.max(0,Math.min(den,Math.round(+it.num)||0)),den]];
  if(it.compare)rows.push([Math.max(0,Math.round(+it.compare.num)||0),Math.max(1,Math.min(12,Math.round(+it.compare.den)||2))]);
  const d=put('t-fig'),s=sv('svg',{viewBox:`0 0 360 ${rows.length*92+10}`,class:'graph'},d);
  rows.forEach(([n,m],r)=>{const y=10+r*92;n=Math.min(n,m);
    if(it.kind==='pie'){const cx=70,cy=y+40,R=38;for(let i=0;i<m;i++){const a0=-Math.PI/2+i*2*Math.PI/m,a1=a0+2*Math.PI/m;sv('path',{d:m===1?`M${cx-R} ${cy}a${R} ${R} 0 1 0 ${2*R} 0a${R} ${R} 0 1 0 ${-2*R} 0`:`M${cx} ${cy}L${cx+R*Math.cos(a0)} ${cy+R*Math.sin(a0)}A${R} ${R} 0 0 1 ${cx+R*Math.cos(a1)} ${cy+R*Math.sin(a1)}Z`,style:`fill:${i<n?'var(--yel)':'none'};fill-opacity:.55;stroke:var(--chalk);stroke-width:2`},s)}}
    else{const w=200,x0=20;for(let i=0;i<m;i++)sv('rect',{x:x0+i*w/m*1.4,y:y+16,width:w/m*1.4-2,height:48,rx:4,style:`fill:${i<n?'var(--yel)':'none'};fill-opacity:.55;stroke:var(--chalk);stroke-width:2`},s)}
    sv('text',{x:300,y:y+34,'text-anchor':'middle',style:'fill:var(--blue);font-size:30px;font-weight:700'},s,String(n));sv('line',{x1:280,x2:320,y1:y+42,y2:y+42,style:'stroke:var(--chalk);stroke-width:3'},s);sv('text',{x:300,y:y+68,'text-anchor':'middle',style:'fill:var(--blue);font-size:30px;font-weight:700'},s,String(m))});
  if(it.caption)rich(el('div','t-note',d),it.caption);reveal(d);return 1300},
code(it){
  const w=el('div','t-code',sheet());el('small','',w,String(it.lang||'código').slice(0,20));
  const ls=arr(it.lines).length?arr(it.lines).map(l=>typeof l==='string'?{c:l}:l):String(it.code||'').split('\n').map(c=>({c}));
  const KW=/\b(def|return|if|elif|else|for|while|in|not|and|or|import|from|class|function|const|let|var|true|false|null|None|True|False|print|console|int|float|str|void|public|private|static|new|try|catch|except|break|continue|switch|case|do|print)\b/;
  const hl=(p,t)=>{const re=new RegExp(`(#.*|//.*|"[^"]*"|'[^']*'|\\b\\d+\\.?\\d*\\b|${KW.source})`,'g');let i=0,m;while((m=re.exec(t))){if(m.index>i)p.appendChild(document.createTextNode(t.slice(i,m.index)));const x=m[0],k=/^(#|\/\/)/.test(x)?'cm':/^["']/.test(x)?'st':/^\d/.test(x)?'nu':'kw';el('span','c-'+k,p,x);i=m.index+x.length;if(!x.length)re.lastIndex++}if(i<t.length)p.appendChild(document.createTextNode(t.slice(i)))};
  const L=ls.slice(0,30);L.forEach((l,i)=>setTimeout(()=>{const r=put('c-row',w);hl(el('code','',r),String(l.c==null?'':l.c).slice(0,120)||' ');if(l.n)rich(el('span','c-note',r),l.n);reveal(r)},i*(L.some(l=>l.n)?900:150)));
  if(it.output){setTimeout(()=>{const r=put('c-out',w);el('small','',r,'Salida');el('code','',r,String(it.output).slice(0,300));reveal(r)},L.length*(L.some(l=>l.n)?900:150))}
  return L.length*(L.some(l=>l.n)?900:150)+600},
vocab(it){
  const w=el('div','t-vocab',sheet());if(it.title)rich(el('b','',w),it.title);const L=arr(it.items).slice(0,10);
  L.forEach((x,i)=>setTimeout(()=>{const r=put('vo-row',w),b=el('button','vo-play',r,'🔊');b.type='button';b.setAttribute('aria-label','Escuchar');
    b.onclick=()=>{try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(String(x.w||''));u.lang=it.lang||'en-US';u.rate=.85;speechSynthesis.speak(u)}catch(e){}};
    const c=el('div','vo-t',r);el('b','',c,T(x.w));el('span','vo-tr',c,' = '+T(x.t));if(x.ex)rich(el('div','vo-ex',c),x.ex);reveal(r)},i*700));
  return L.length*700+300},
order(it){
  const items=arr(it.items).map(String).slice(0,7);if(items.length<2)return 500;
  const d=put('t-quiz t-order');rich(el('b','',d),it.q||'Ordena los pasos');const pool=el('div','od-pool',d),msg=el('div','qres',d);let nxt=0,bad=0;
  items.map((x,i)=>[x,i]).sort(()=>Math.random()-.5).forEach(([x,i])=>{const b=el('button','',pool);b.type='button';rich(b,x);
    b.onclick=()=>{if(b.disabled)return;if(i===nxt){b.disabled=true;b.classList.add('good');el('small','',b,' '+(nxt+1));nxt++;if(nxt===items.length){msg.textContent=bad?'¡Ordenado! Con algunos intentos, ¡así se aprende!':'¡Perfecto, todo en orden a la primera!';d.appendChild(msg);done(!bad)}}
      else{bad++;b.classList.add('bad');setTimeout(()=>b.classList.remove('bad'),600)}}});
  el('div','hint',d,'Toca los pasos en el orden correcto');reveal(d);return 1200},
element(it){
  const ch=window.LumiTools&&LumiTools.chem;if(!ch)return E.note?500:500;const z=Math.max(1,Math.min(118,Math.round(+it.z)||1)),e=ch.EL[z-1],c=ch.CAT[ch.catOf(z)];
  const d=put('t-elem'),sq=el('div','el-sq',d);sq.style.background=c[1];el('small','',sq,String(z));el('b','',sq,e.s);el('span','',sq,String(e.m));
  const i=el('div','el-info',d);el('b','',i,e.n);el('div','',i,c[0]+' · '+(ch.GAS.includes(z)?'Gas':ch.LIQ.includes(z)?'Líquido':'Sólido'));
  const cf=el('div','el-cfg',i);ch.config(z).split(/(\d[spdf]\d+)/).forEach(x=>{const m=x.match(/^(\d[spdf])(\d+)$/);if(m){cf.appendChild(document.createTextNode(m[1]));el('sup','',cf,m[2])}else cf.appendChild(document.createTextNode(x))});
  if(it.caption)rich(el('div','t-note',i),it.caption);reveal(d);return 1300},
forces(it){
  const d=put('t-fig'),s=sv('svg',{viewBox:'0 0 360 270',class:'graph'},d),cx=180,cy=135,F=arr(it.forces).slice(0,6);
  const tx=(x,y,t,c,a)=>sv('text',{x,y,'text-anchor':a||'middle',style:`fill:${c};font-size:16px;font-weight:600`},s,clip(t,16));
  const arrow=(x2,y2,col,dash)=>{const a=Math.atan2(y2-cy,x2-cx),h=11;sv('line',{x1:cx,y1:cy,x2:x2-Math.cos(a)*6,y2:y2-Math.sin(a)*6,style:`stroke:${col};stroke-width:3.5;${dash?'stroke-dasharray:7 5':''}`},s);
    sv('polygon',{points:`${x2},${y2} ${x2-h*Math.cos(a-.4)},${y2-h*Math.sin(a-.4)} ${x2-h*Math.cos(a+.4)},${y2-h*Math.sin(a+.4)}`,style:`fill:${col}`},s)};
  sv('rect',{x:cx-34,y:cy-24,width:68,height:48,rx:6,style:'fill:var(--yel);fill-opacity:.15;stroke:var(--yel);stroke-width:3'},s);
  let nx=0,ny=0;F.forEach((f,i)=>{const a=(+f.angle||0)*Math.PI/180,m=Math.max(.5,Math.min(6,+f.mag||3)),L=Math.min(115,34+m*17),x2=cx+Math.cos(a)*L,y2=cy-Math.sin(a)*L,col=C[i%3];
    nx+=Math.cos(a)*(+f.mag||3);ny+=Math.sin(a)*(+f.mag||3);arrow(x2,y2,col);
    const lx=cx+Math.cos(a)*(L+14),ly=cy-Math.sin(a)*(L+14)+5;tx(Math.max(30,Math.min(330,lx)),Math.max(16,Math.min(262,ly)),f.label||'',col,Math.cos(a)>.3?'start':Math.cos(a)<-.3?'end':'middle')});
  tx(cx,cy+5,it.object||'','currentColor');
  if(it.net&&F.length>1){const mg=Math.hypot(nx,ny);if(mg<.05)tx(cx,cy+60,'Fuerza neta = 0 (equilibrio)','var(--pink)');else{const L=Math.min(115,34+mg*17);arrow(cx+nx/mg*L,cy-ny/mg*L,'var(--pink)',true);tx(cx+nx/mg*(L+16),cy-ny/mg*(L+16)+24,'F neta','var(--pink)')}}
  if(it.caption)rich(el('div','t-note',d),it.caption);reveal(d);return 1400},
reaction(it){
  const parse=f=>{const m=new Map(),st=[m];const re=/([A-Z][a-z]?)(\d*)|(\()|\)(\d*)/g;let x;f=String(f).replace(/[^A-Za-z0-9()]/g,'');
    while((x=re.exec(f))){if(x[1]){const c=st[st.length-1];c.set(x[1],(c.get(x[1])||0)+(+x[2]||1))}else if(x[3])st.push(new Map());else if(st.length>1){const t=st.pop(),k=+x[4]||1,c=st[st.length-1];t.forEach((v,e)=>c.set(e,(c.get(e)||0)+v*k))}}return m};
  const side=a=>arr(a).slice(0,5).map(String).map(t=>{const m=t.trim().match(/^(\d*)\s*(.*)$/);return{k:+m[1]||1,f:m[2]}});
  const R=side(it.reactants),P=side(it.products);if(!R.length||!P.length)return 500;
  const d=put('t-reaction'),eq=el('div','rx-eq',d);
  const fm=(p,f)=>{const re=/([A-Za-z)])(\d+)/g;let i=0,m;while((m=re.exec(f))){p.appendChild(document.createTextNode(f.slice(i,m.index+1)));el('sub','',p,m[2]);i=m.index+m[0].length}p.appendChild(document.createTextNode(f.slice(i)))};
  const show=(L)=>L.forEach((x,i)=>{if(i)el('span','rx-pl',eq,' + ');if(x.k>1)el('b','rx-k',eq,String(x.k));fm(el('span','rx-f',eq),x.f)});
  show(R);el('span','rx-ar',eq,it.reversible?' ⇌ ':' ⟶ ');show(P);
  const tot=L=>{const t=new Map();L.forEach(x=>parse(x.f).forEach((v,e)=>t.set(e,(t.get(e)||0)+v*x.k)));return t},a=tot(R),b=tot(P),els=[...new Set([...a.keys(),...b.keys()])];
  const tb=el('table','t-table rx-tb',d);const h=tb.insertRow();['Átomo','Reactivos','Productos',''].forEach(x=>el('th','',h,x));let all=true;
  els.forEach(e=>{const r=tb.insertRow(),ok=(a.get(e)||0)===(b.get(e)||0);all=all&&ok;[e,a.get(e)||0,b.get(e)||0,ok?'✔':'✘'].forEach((x,i)=>{const c=r.insertCell();c.textContent=x;if(i===3)c.className=ok?'okk':'nok'})});
  el('div','rx-res '+(all?'okk':'nok'),d,all?'✔ Ecuación balanceada: mismos átomos a cada lado':'✘ Todavía no está balanceada: ajusta los coeficientes');
  if(it.note)rich(el('div','t-note',d),it.note);reveal(d);return 1600},
unitcircle(it){
  const ang=((+it.angle||0)%360+360)%360,rad=ang*Math.PI/180,d=put('t-fig'),s=sv('svg',{viewBox:'0 0 360 270',class:'graph'},d),cx=130,cy=135,R=100;
  const tx=(x,y,t,c,a,z)=>sv('text',{x,y,'text-anchor':a||'middle',style:`fill:${c};font-size:${z||15}px;font-weight:600`},s,t);
  sv('line',{x1:cx-R-14,x2:cx+R+14,y1:cy,y2:cy,style:'stroke:currentColor;opacity:.6;stroke-width:1.5'},s);sv('line',{x1:cx,x2:cx,y1:cy-R-14,y2:cy+R+14,style:'stroke:currentColor;opacity:.6;stroke-width:1.5'},s);
  sv('circle',{cx,cy,r:R,style:'fill:none;stroke:var(--chalk);stroke-width:2.5'},s);
  const px=cx+R*Math.cos(rad),py=cy-R*Math.sin(rad),big=ang>180?1:0;
  if(ang>0)sv('path',{d:`M${cx+28} ${cy}A28 28 0 ${big} 0 ${cx+28*Math.cos(rad)} ${cy-28*Math.sin(rad)}`,style:'fill:none;stroke:var(--yel);stroke-width:3'},s);
  sv('line',{x1:cx,y1:cy,x2:px,y2:py,style:'stroke:var(--yel);stroke-width:3'},s);
  sv('line',{x1:px,y1:py,x2:px,y2:cy,style:'stroke:var(--pink);stroke-width:3.5'},s);sv('line',{x1:cx,y1:cy,x2:px,y2:cy,style:'stroke:var(--blue);stroke-width:3.5'},s);
  sv('circle',{cx:px,cy:py,r:6,style:'fill:var(--yel)'},s);
  const S=Math.sin(rad),Co=Math.cos(rad),ex=(v,k)=>{const a=Math.abs(v);let t=Math.abs(a)<1e-9?'0':Math.abs(a-1)<1e-9?'1':Math.abs(a-.5)<1e-9?'1/2':Math.abs(a-Math.SQRT1_2)<1e-9?'√2/2':Math.abs(a-Math.sqrt(3)/2)<1e-9?'√3/2':null;return t===null?String(+v.toFixed(3)):(v<0&&t!=='0'?'−':'')+t};
  const tan=Math.abs(Co)<1e-9?'no existe':Math.abs(Math.abs(S/Co)-1)<1e-9?(S/Co<0?'−1':'1'):Math.abs(S)<1e-9?'0':Math.abs(Math.abs(S/Co)-Math.sqrt(3))<1e-9?(S/Co<0?'−':'')+'√3':Math.abs(Math.abs(S/Co)-1/Math.sqrt(3))<1e-9?(S/Co<0?'−':'')+'√3/3':String(+(S/Co).toFixed(3));
  tx(250,100,'ángulo = '+(+ang.toFixed(2))+'°','var(--yel)','start',16);tx(250,130,'cos = '+ex(Co),'var(--blue)','start',17);tx(250,160,'sen = '+ex(S),'var(--pink)','start',17);tx(250,190,'tan = '+tan,'currentColor','start',17);
  if(it.caption)rich(el('div','t-note',d),it.caption);reveal(d);return 1400},
music(it){
  const NN=arr(it.notes).map(String).slice(0,12);if(!NN.length)return 500;const bass=it.clef==='bass',d=put('t-fig'),W=360,H=215,s=sv('svg',{viewBox:`0 0 ${W} ${H}`,class:'graph'},d),yb=120,base=bass?18:30;
  const IDX={C:0,D:1,E:2,F:3,G:4,A:5,B:6},SEMI={C:0,D:2,E:4,F:5,G:7,A:9,B:11};
  const pn=n=>{const m=n.match(/^([A-Ga-g])([#b♯♭]?)(-?\d)$/);if(!m)return null;const L=m[1].toUpperCase(),ac=/[#♯]/.test(m[2])?1:/[b♭]/.test(m[2])?-1:0,o=+m[3];return{L,ac,o,pos:o*7+IDX[L],midi:12*(o+1)+SEMI[L]+ac}};
  for(let i=0;i<5;i++)sv('line',{x1:20,x2:W-14,y1:yb-i*14,y2:yb-i*14,style:'stroke:currentColor;stroke-width:1.5;opacity:.8'},s);
  sv('text',{x:24,y:yb-6,style:'fill:var(--yel);font-size:17px;font-weight:700;font-style:italic'},s,bass?'Fa':'Sol');
  const ns=NN.map(pn),step=(W-80)/Math.max(ns.length,1);
  ns.forEach((n,i)=>{if(!n)return;const x=64+i*step+step/2-8,y=yb-(n.pos-base)*7;
    for(let p=base-2;p>=n.pos;p-=2)sv('line',{x1:x-13,x2:x+13,y1:yb-(p-base)*7,y2:yb-(p-base)*7,style:'stroke:currentColor;stroke-width:1.5'},s);
    for(let p=base+10;p<=n.pos;p+=2)sv('line',{x1:x-13,x2:x+13,y1:yb-(p-base)*7,y2:yb-(p-base)*7,style:'stroke:currentColor;stroke-width:1.5'},s);
    const up=n.pos<base+4;sv('line',{x1:x+(up?7:-7),x2:x+(up?7:-7),y1:y,y2:y+(up?-30:30),style:'stroke:var(--chalk);stroke-width:2'},s);
    sv('ellipse',{cx:x,cy:y,rx:8,ry:6,transform:`rotate(-20 ${x} ${y})`,style:'fill:var(--pink);stroke:var(--pink)'},s);
    if(n.ac)sv('text',{x:x-22,y:y+6,style:'fill:var(--chalk);font-size:18px;font-weight:700'},s,n.ac>0?'♯':'♭');
    sv('text',{x,y:H-6,'text-anchor':'middle',style:'fill:var(--blue);font-size:15px;font-weight:700'},s,n.L+(n.ac>0?'#':n.ac<0?'b':''))});
  const good=ns.filter(Boolean);
  if(good.length){const b=el('button','mu-play',d,'▶ Escuchar');b.type='button';b.onclick=()=>{try{const A=new(window.AudioContext||window.webkitAudioContext)(),t0=A.currentTime+.05,ch=!!it.chord;
    good.forEach((n,i)=>{const o=A.createOscillator(),g=A.createGain(),t=t0+(ch?0:i*.5),f=440*Math.pow(2,(n.midi-69)/12);o.type='triangle';o.frequency.value=f;o.connect(g);g.connect(A.destination);
      g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(ch?.12:.25,t+.03);g.gain.exponentialRampToValueAtTime(.001,t+(ch?1.6:.48));o.start(t);o.stop(t+1.7)})}catch(e){}}}
  if(it.caption)rich(el('div','t-note',d),it.caption);reveal(d);return 1400},
circuit(it){
  const d=put('t-fig'),s=sv('svg',{viewBox:'0 0 360 250',class:'graph'},d),P=arr(it.parts).slice(0,4),par=it.kind==='parallel'&&P.length>1,st='fill:none;stroke:var(--chalk);stroke-width:3;stroke-linecap:round;stroke-linejoin:round';
  const ln=(x1,y1,x2,y2,g)=>sv('line',{x1,y1,x2,y2,style:st},g||s),tx=(x,y,t,c,a)=>sv('text',{x,y,'text-anchor':a||'middle',style:`fill:${c||'var(--blue)'};font-size:15px;font-weight:600`},s,clip(t,14));
  const comp=(g,p)=>{const ty=String(p.type||'R').toUpperCase()[0];ln(-25,0,-14,0,g);ln(14,0,25,0,g);
    if(ty==='L'){sv('circle',{cx:0,cy:0,r:14,style:st+';stroke:var(--yel)'},g);sv('path',{d:'M-10 -10L10 10M-10 10L10 -10',style:st+';stroke:var(--yel);stroke-width:2'},g)}
    else if(ty==='S'){ln(-25,0,-12,0,g);ln(12,0,25,0,g);sv('circle',{cx:-12,cy:0,r:3,style:'fill:var(--pink)'},g);sv('circle',{cx:12,cy:0,r:3,style:'fill:var(--pink)'},g);ln(-12,0,p.open?9:12,p.open?-14:0,g)}
    else sv('path',{d:'M-14 0l4 0 3 -9 6 18 6 -18 6 18 3 -9 4 0',style:st+';stroke:var(--blue)'},g)};
  const L=40,Rr=320,T=50,B=200;ln(L,T,L,105);ln(L,125,L,B);sv('line',{x1:L-14,x2:L+14,y1:105,y2:105,style:st+';stroke-width:3'},s);sv('line',{x1:L-8,x2:L+8,y1:117,y2:117,style:st+';stroke-width:6'},s);
  tx(L+22,116,it.source||'','var(--pink)','start');tx(L-3,100,'+','var(--pink)','end');
  if(!par){const xs=P.map((_,i)=>L+(i+1)*(Rr-L)/(P.length+1));let cur=L;
    xs.forEach((x,i)=>{ln(cur,T,x-25,T);cur=x+25;const g=sv('g',{transform:`translate(${x} ${T})`},s);comp(g,P[i]);tx(x,T-22,P[i].label||'');});ln(cur,T,Rr,T);ln(Rr,T,Rr,B);ln(L,B,Rr,B)}
  else{const xs=P.map((_,i)=>96+i*(Rr-96)/(P.length-1));ln(L,T,Rr,T);ln(L,B,Rr,B);
    xs.forEach((x,i)=>{ln(x,T,x,125-25);ln(x,125+25,x,B);const g=sv('g',{transform:`translate(${x} 125) rotate(90)`},s);comp(g,P[i]);tx(x+(i===xs.length-1?-20:20),130,P[i].label||'','var(--blue)',i===xs.length-1?'end':'start')});ln(Rr,T,Rr,125-25>0?T:T);}
  if(it.caption)rich(el('div','t-note',d),it.caption);reveal(d);return 1500}
};
E.think=E.flash;E.concepts=E.concept;E.numberline=E.numline;E.bar=E.pie=it=>E.chart(it);
const old=Board.draw;
Board.draw=function(it){const f=it&&E[it.t];if(f){try{return f(it)}catch(e){console.warn('teach',e);return 600}}return old.call(Board,it)};
window.LumiTeach={types:Object.keys(E)};
})();
