/* Herramientas de enseñanza de Lumi · tanda 5: wave, sentence, longdiv, ph, angles, stats.
   Se enganchan a Board.draw encima de teach.js y teach2.js. Todo el texto de la IA se inserta como texto (nunca HTML). */
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

const E={
/* Onda: amplitud, longitud de onda, cresta y valle (y una segunda onda opcional para comparar) */
wave(it){
  const cyc=Math.max(1,Math.min(4,Math.round(+it.cycles||2))),A=Math.max(.5,Math.min(2.5,+it.amp||1.8))*30,x0=20,W=320,yc=120;
  const d=put('t-fig'),s=sv('svg',{viewBox:'0 0 360 240',class:'graph'},d);
  const path=(a,c,col,dash)=>{let p='';for(let i=0;i<=200;i++){p+=(i?'L':'M')+(x0+W*i/200).toFixed(1)+' '+(yc-a*Math.sin(2*Math.PI*c*i/200)).toFixed(1)}
    return sv('path',{d:p,style:`fill:none;stroke:${col};stroke-width:3.5;stroke-linecap:round;${dash?'stroke-dasharray:8 6':''}`},s)};
  const tx=(x,y,t,c,a,z)=>sv('text',{x,y,'text-anchor':a||'middle',style:`fill:${c};font-size:${z||14}px;font-weight:600;paint-order:stroke;stroke:var(--board,#243b2f);stroke-width:4px;stroke-linejoin:round;`},s,t);
  sv('line',{x1:x0-6,x2:x0+W+6,y1:yc,y2:yc,style:'stroke:currentColor;opacity:.55;stroke-width:1.5;stroke-dasharray:4 4'},s);
  path(A,cyc,'var(--blue)');
  const sec=it.second&&typeof it.second==='object'?it.second:null;
  if(sec)path(Math.max(.5,Math.min(2.5,+sec.amp||1))*30,Math.max(1,Math.min(6,Math.round(+sec.cycles||cyc*2))),'var(--pink)',true);
  if(it.labels!==false){
    const cx=x0+W/(4*cyc),vx=x0+3*W/(4*cyc),yw=yc+A+28;
    sv('line',{x1:cx,x2:cx,y1:yc,y2:yc-A,style:'stroke:var(--yel);stroke-width:2.5;stroke-dasharray:5 3'},s);
    tx(cx+8,yc-A/2+5,'amplitud','var(--yel)','start');tx(cx,Math.max(13,yc-A-8),'cresta','var(--chalk)');tx(vx,yc+A+16,'valle','var(--chalk)');
    const xe=x0+W/cyc;sv('line',{x1:x0,x2:xe,y1:yw,y2:yw,style:'stroke:var(--pink);stroke-width:2.5'},s);
    [x0,xe].forEach(x=>sv('line',{x1:x,x2:x,y1:yw-6,y2:yw+6,style:'stroke:var(--pink);stroke-width:2.5'},s));
    tx((x0+xe)/2,yw+17,'longitud de onda (λ)','var(--pink)')}
  cap(d,it);reveal(d);return 1500},

/* Análisis de la oración: cada parte con su función, en colores */
sentence(it){
  const P=arr(it.parts).slice(0,8).map(p=>typeof p==='string'?{text:p,role:''}:{text:String((p&&p.text)||''),role:String((p&&p.role)||'')}).filter(p=>p.text);
  if(!P.length)return 500;
  const d=put('t-sent'),row=el('div','st-row',d),roles=[];
  P.forEach((p,i)=>{let k=roles.indexOf(p.role);if(k<0){roles.push(p.role);k=roles.length-1}
    const c=el('div','st-p',row);c.style.setProperty('--sc',C[k%3]);c.style.animationDelay=(i*.35)+'s';
    rich(el('div','st-w',c),p.text);if(p.role)rich(el('div','st-r',c),clip(p.role,22))});
  if(it.translation)rich(el('div','t-note st-tr',d),it.translation);cap(d,it);reveal(d);return P.length*350+900},

/* División larga (con decimales opcionales cuando sobra resto) */
longdiv(it){
  const A=String(it.dividend==null?'':it.dividend).replace(/\D/g,'').replace(/^0+(?=\d)/,'').slice(0,7),B=String(it.divisor==null?'':it.divisor).replace(/\D/g,'').replace(/^0+/,'').slice(0,4);
  if(!A||!B)return 500;
  const b=+B,dec=Math.max(0,Math.min(3,Math.round(+it.decimals||0))),n0=A.length,hasDec=dec>0&&(+A)%b!==0;
  const dg=[...A].map(Number).concat(hasDec?Array(dec).fill(0):[]),n=dg.length,Wd=n+(hasDec?1:0),col=i=>i+(hasDec&&i>=n0?1:0);
  let rem=0,s=-1;const st=[];
  for(let i=0;i<n;i++){const cur=rem*10+dg[i],q=Math.floor(cur/b),pr=q*b;if(s<0&&(cur>=b||i===n0-1))s=i;if(s>=0)st.push({i,cur,q,pr,r:cur-pr});rem=cur-pr}
  const P=B.length+3,ch=Array(Wd).fill(' ');st.forEach(x=>{ch[col(x.i)]=String(x.q)});if(hasDec)ch[n0]='.';
  const at=(txt,i)=>' '.repeat(Math.max(0,P+col(i)+1-txt.length))+txt,L=[];
  L.push({t:' '.repeat(P)+ch.join(''),c:'ld-q'});L.push({t:' '.repeat(P-1)+'─'.repeat(Wd+1),c:'ld-r'});
  L.push({t:B+' ) '+A+(hasDec?'.'+'0'.repeat(dec):''),c:''});
  st.forEach((x,k)=>{const pt='−'+x.pr,w=Math.max(pt.length,String(x.cur).length);
    L.push({t:at(pt,x.i),c:'ld-p'});L.push({t:at('─'.repeat(w),x.i),c:'ld-r'});
    if(k<st.length-1)L.push({t:at(String(x.r*10+dg[st[k+1].i]),st[k+1].i),c:''});
    else L.push({t:at(String(x.r),x.i),c:'ld-ans'})});
  const qs=ch.join('').trim(),last=st[st.length-1],w=el('div','t-ldiv',sheet());
  L.forEach((l,i)=>setTimeout(()=>{const r=put('ld-l '+l.c,w);r.textContent=l.t;reveal(r)},i*600));
  setTimeout(()=>{const r=put('t-note ld-sum',w);r.textContent=A+' ÷ '+B+' = '+qs+(last.r&&!hasDec?'  (resto '+last.r+')':'');reveal(r);
    if(it.caption)setTimeout(()=>{const n=put('t-note',w);rich(n,it.caption);reveal(n)},300)},L.length*600);
  return L.length*600+900},

/* Escala de pH de 0 a 14 con sustancias marcadas */
ph(it){
  const M=arr(it.marks).slice(0,6).map(m=>({v:+(m&&m.ph),l:String((m&&m.label)||'')})).filter(m=>isFinite(m.v)).map(m=>({v:Math.max(0,Math.min(14,m.v)),l:m.l})).sort((a,b)=>a.v-b.v);
  if(!M.length)return 500;
  const id='phg'+(++uid),d=put('t-fig'),s=sv('svg',{viewBox:'0 0 360 205',class:'graph'},d),defs=sv('defs',{},s),g=sv('linearGradient',{id,x1:0,x2:1,y1:0,y2:0},defs);
  [[0,'#e0453a'],[2,'#f08a3c'],[4,'#f2d54b'],[6,'#9ed05a'],[7,'#4fb86a'],[8,'#3fb5a8'],[10,'#3d8fd6'],[12,'#5b5bd0'],[14,'#7a3fb0']].forEach(([v,c])=>sv('stop',{offset:v/14,'stop-color':c},g));
  const X=v=>20+320*v/14;sv('rect',{x:20,y:100,width:320,height:34,rx:8,style:`fill:url(#${id})`},s);
  for(let v=0;v<=14;v++)sv('text',{x:X(v),y:152,'text-anchor':'middle',style:'fill:currentColor;font-size:12px;opacity:.85'},s,String(v));
  [['Ácido',80],['Neutro',180],['Básico',280]].forEach(([t,x])=>sv('text',{x,y:176,'text-anchor':'middle',style:'fill:var(--yel);font-size:14px;font-weight:700'},s,t));
  let lastX=[-999,-999];const lab=[];
  M.forEach((m,i)=>{const x=X(m.v);let lv=0;if(x-lastX[0]<80)lv=1;if(lv===1&&x-lastX[1]<80)lv=0;lastX[lv]=x;
    const y=lv?44:72;sv('polygon',{points:`${x-6},88 ${x+6},88 ${x},99`,style:'fill:var(--chalk)'},s);
    if(lv)sv('line',{x1:x,x2:x,y1:y+4,y2:88,style:'stroke:var(--chalk);stroke-width:1.5;opacity:.7'},s);
    lab.push([Math.max(46,Math.min(314,x)),y,clip(m.l,14)+' ('+fm(m.v)+')'])});
  lab.forEach(([x,y,t])=>sv('text',{x,y,'text-anchor':'middle',style:'fill:var(--chalk);font-size:13px;font-weight:700;paint-order:stroke;stroke:var(--board,#243b2f);stroke-width:4px;stroke-linejoin:round;'},s,t));
  cap(d,it);reveal(d);return 1500},

/* Ángulo con su medida, tipo, complemento y suplemento */
angles(it){
  let deg=+it.deg;if(!isFinite(deg)||deg<=0)return 500;deg=Math.min(360,deg);
  const d=put('t-fig'),s=sv('svg',{viewBox:'0 0 360 230',class:'graph'},d),vx=180,vy=115,L=100,r=36,rad=deg*Math.PI/180,ex=vx+L*Math.cos(rad),ey=vy-L*Math.sin(rad);
  if(deg===90)sv('path',{d:`M${vx+r/2} ${vy}L${vx+r/2} ${vy-r/2}L${vx} ${vy-r/2}L${vx} ${vy}Z`,style:'fill:var(--yel);fill-opacity:.25;stroke:var(--yel);stroke-width:2.5'},s);
  else if(deg>=360)sv('circle',{cx:vx,cy:vy,r,style:'fill:var(--yel);fill-opacity:.2;stroke:var(--yel);stroke-width:3'},s);
  else sv('path',{d:`M${vx} ${vy}L${vx+r} ${vy}A${r} ${r} 0 ${deg>180?1:0} 0 ${vx+r*Math.cos(rad)} ${vy-r*Math.sin(rad)}Z`,style:'fill:var(--yel);fill-opacity:.22;stroke:var(--yel);stroke-width:3'},s);
  sv('line',{x1:vx,y1:vy,x2:vx+L,y2:vy,style:'stroke:var(--blue);stroke-width:4;stroke-linecap:round'},s);
  sv('line',{x1:vx,y1:vy,x2:ex,y2:ey,style:'stroke:var(--pink);stroke-width:4;stroke-linecap:round'},s);
  sv('circle',{cx:vx,cy:vy,r:5,style:'fill:var(--chalk)'},s);
  const mid=rad/2;sv('text',{x:vx+66*Math.cos(mid),y:vy-66*Math.sin(mid)+5,'text-anchor':'middle',style:'fill:var(--yel);font-size:18px;font-weight:700'},s,(it.label?clip(it.label,4)+' = ':'')+fm(deg)+'°');
  const tipo=deg<90?'agudo (menor de 90°)':deg===90?'recto (90°)':deg<180?'obtuso (entre 90° y 180°)':deg===180?'llano (180°)':deg<360?'cóncavo o reflejo (mayor de 180°)':'completo (360°)';
  const n=el('div','t-note',d);n.textContent='Ángulo '+tipo+(it.extra!==false?(deg<90?' · Complemento: '+fm(90-deg)+'°':'')+(deg<180?' · Suplemento: '+fm(180-deg)+'°':''):'');
  cap(d,it);reveal(d);return 1500},

/* Estadística: media, mediana, moda y rango con diagrama de puntos */
stats(it){
  const V=arr(it.values).map(Number).filter(isFinite).slice(0,20);if(V.length<2)return 500;
  const S=[...V].sort((a,b)=>a-b),n=S.length,sum=S.reduce((a,b)=>a+b,0),mean=sum/n,med=n%2?S[(n-1)/2]:(S[n/2-1]+S[n/2])/2,lo=S[0],hi=S[n-1];
  const f=new Map();S.forEach(v=>f.set(v,(f.get(v)||0)+1));const mf=Math.max(...f.values()),modes=mf>1?[...f].filter(([,c])=>c===mf).map(([v])=>v):[];
  const a=lo===hi?lo-1:lo,b=lo===hi?hi+1:hi,X=v=>30+(v-a)/(b-a)*300,yA=122,rr=Math.max(3,Math.min(8,(96/mf-2)/2));
  const d=put('t-fig'),s=sv('svg',{viewBox:'0 0 360 204',class:'graph'},d);
  sv('line',{x1:20,x2:340,y1:yA,y2:yA,style:'stroke:currentColor;stroke-width:2'},s);
  for(let k=0;k<=5;k++){const v=a+(b-a)*k/5;sv('line',{x1:X(v),x2:X(v),y1:yA,y2:yA+5,style:'stroke:currentColor;stroke-width:1.5'},s);sv('text',{x:X(v),y:yA+19,'text-anchor':'middle',style:'fill:currentColor;font-size:11px;opacity:.8'},s,fm(v))}
  f.forEach((c,v)=>{for(let j=0;j<c;j++)sv('circle',{cx:X(v),cy:yA-rr-2-j*(2*rr+2),r:rr,style:`fill:${modes.includes(v)?'var(--yel)':'var(--blue)'}`},s)});
  sv('polygon',{points:`${X(mean)},${yA+28} ${X(mean)-6},${yA+40} ${X(mean)+6},${yA+40}`,style:'fill:var(--pink)'},s);
  sv('circle',{cx:X(med),cy:yA+34,r:5,style:'fill:none;stroke:var(--yel);stroke-width:3'},s);
  sv('text',{x:Math.max(60,Math.min(300,X(mean))),y:yA+57,'text-anchor':'middle',style:'fill:var(--pink);font-size:13px;font-weight:700'},s,'media = '+fm(mean));
  sv('text',{x:Math.max(60,Math.min(300,X(med))),y:yA+74,'text-anchor':'middle',style:'fill:var(--yel);font-size:13px;font-weight:700'},s,'mediana = '+fm(med));
  const tb=el('table','t-table st-tb',d),row=(k,v)=>{const r=tb.insertRow();el('th','',r,k);r.insertCell().textContent=v};
  row('Media','('+(n>8?S.slice(0,8).join(' + ')+' + …':S.join(' + '))+') ÷ '+n+' = '+fm(mean));row('Mediana','valor central de los datos ordenados = '+fm(med));
  row('Moda',modes.length?modes.map(fm).join(', ')+' (aparece '+mf+' veces)':'no hay moda (ningún dato se repite)');row('Rango',fm(hi)+' − '+fm(lo)+' = '+fm(hi-lo));
  cap(d,it);reveal(d);return 1700}
};
const old=Board.draw;
Board.draw=function(it){const f=it&&Object.prototype.hasOwnProperty.call(E,it.t)&&E[it.t];if(f){try{return f(it)}catch(e){console.warn('teach3',e);return 600}}return old.call(Board,it)};
window.LumiTeach3={types:Object.keys(E)};
})();
