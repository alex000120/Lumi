/* Herramientas de enseñanza de Lumi · tanda 4: eqsteps, coords, venn, tree, punnett, arith.
   Se enganchan a Board.draw encima de teach.js. Todo el texto de la IA se inserta como texto (nunca HTML). */
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
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
const red=(n,d)=>{const g=gcd(n,d)||1;return[n/g,d/g]};
const fs=f=>f[1]===1?String(f[0]):f[0]+'/'+f[1];
/* "1/2", "0.3", "30%" -> [n,d] reducida, o null */
const pf=p=>{p=String(p==null?'':p).trim().replace(',','.');let m;
  if((m=p.match(/^(\d+)\s*\/\s*(\d+)$/))&&+m[2])return red(+m[1],+m[2]);
  if((m=p.match(/^(\d*\.\d+|\d+)\s*(%?)$/))){const dec=(m[1].split('.')[1]||'').length,k=Math.pow(10,dec);return red(Math.round(+m[1]*k),k*(m[2]?100:1))}
  return null};

const E={
/* Ecuaciones paso a paso, con la operación aplicada en cada línea */
eqsteps(it){
  const st=arr(it.steps).slice(0,8);if(!st.length)return 500;
  const wr=s=>{s=String(s==null?'':s);return/\$/.test(s)?s:'$'+s+'$'};
  const w=el('div','t-eqs',sheet());if(it.title)rich(el('b','',w),it.title);
  st.forEach((s,i)=>setTimeout(()=>{
    const o=typeof s==='object'&&s?s:{eq:s},r=put('eq-row'+(i===st.length-1&&st.length>1?' last':''),w);
    rich(el('div','eq-m',r),wr(o.eq));if(o.do)rich(el('div','eq-do',r),'↳ '+o.do);
    if(i===st.length-1&&it.caption)rich(el('div','t-note',r),it.caption);reveal(r)},i*1000));
  return st.length*1000+400},

/* Plano cartesiano: puntos, segmentos, polígono y medidas */
coords(it){
  const P=arr(it.points).slice(0,10).map(p=>({x:+(p&&p.x),y:+(p&&p.y),l:String((p&&p.label)||'')})).filter(p=>isFinite(p.x)&&isFinite(p.y));
  if(!P.length)return 500;
  let lo=it.min!=null&&isFinite(+it.min)?+it.min:-6,hi=it.max!=null&&isFinite(+it.max)?+it.max:6;
  P.forEach(p=>{lo=Math.min(lo,Math.floor(p.x-1),Math.floor(p.y-1));hi=Math.max(hi,Math.ceil(p.x+1),Math.ceil(p.y+1))});
  if(lo>0)lo=0;if(hi<0)hi=0;if(hi-lo>40){lo=Math.max(lo,-20);hi=Math.min(hi,20)}if(hi===lo)hi=lo+1;
  const d=put('t-fig'),s=sv('svg',{viewBox:'0 0 350 350',class:'graph'},d),M=26,Z=300,sx=v=>M+(v-lo)/(hi-lo)*Z,sy=v=>M+Z-(v-lo)/(hi-lo)*Z,step=Math.max(1,Math.ceil((hi-lo)/12));
  for(let v=Math.ceil(lo/step)*step;v<=hi;v+=step){
    sv('line',{x1:sx(v),x2:sx(v),y1:sy(lo),y2:sy(hi),style:'stroke:currentColor;opacity:.15;stroke-width:1'},s);sv('line',{x1:sx(lo),x2:sx(hi),y1:sy(v),y2:sy(v),style:'stroke:currentColor;opacity:.15;stroke-width:1'},s);
    if(v!==0){sv('text',{x:sx(v),y:sy(0)+14,'text-anchor':'middle',style:'fill:currentColor;opacity:.7;font-size:11px'},s,String(v));sv('text',{x:sx(0)-5,y:sy(v)+4,'text-anchor':'end',style:'fill:currentColor;opacity:.7;font-size:11px'},s,String(v))}}
  sv('line',{x1:sx(lo),x2:sx(hi),y1:sy(0),y2:sy(0),style:'stroke:currentColor;stroke-width:2'},s);sv('line',{x1:sx(0),x2:sx(0),y1:sy(lo),y2:sy(hi),style:'stroke:currentColor;stroke-width:2'},s);
  sv('text',{x:344,y:sy(0)-5,'text-anchor':'end',style:'fill:currentColor;font-size:13px;font-style:italic'},s,'x');sv('text',{x:sx(0)+6,y:14,style:'fill:currentColor;font-size:13px;font-style:italic'},s,'y');
  const ref=r=>typeof r==='number'?P[r]:P.find(p=>p.l&&p.l===String(r));
  const poly=arr(it.polygon).map(ref).filter(Boolean);
  if(poly.length>=3)sv('polygon',{points:poly.map(p=>sx(p.x)+','+sy(p.y)).join(' '),style:'fill:var(--yel);fill-opacity:.2;stroke:var(--yel);stroke-width:3;stroke-linejoin:round'},s);
  arr(it.segments).slice(0,12).forEach((sg,i)=>{const a=ref(arr(sg)[0]),b=ref(arr(sg)[1]);if(!a||!b)return;
    sv('line',{x1:sx(a.x),y1:sy(a.y),x2:sx(b.x),y2:sy(b.y),style:`stroke:${C[i%3]};stroke-width:3;stroke-linecap:round`},s);
    if(it.measure)sv('text',{x:(sx(a.x)+sx(b.x))/2,y:(sy(a.y)+sy(b.y))/2-6,'text-anchor':'middle',style:'fill:var(--pink);font-size:13px;font-weight:700'},s,String(+Math.hypot(a.x-b.x,a.y-b.y).toFixed(2)))});
  const cy=P.reduce((a,p)=>a+p.y,0)/P.length;
  P.forEach(p=>{const x=sx(p.x),y=sy(p.y);sv('circle',{cx:x,cy:y,r:5,style:'fill:var(--pink)'},s);
    const t=clip((p.l?p.l:'')+'('+(+p.x.toFixed(2))+', '+(+p.y.toFixed(2))+')',20),up=P.length<2||p.y>=cy;
    sv('text',{x:Math.max(34,Math.min(316,x)),y:up?Math.max(13,y-10):Math.min(344,y+19),'text-anchor':'middle',style:'fill:var(--chalk);font-size:12px;font-weight:600'},s,t)});
  cap(d,it);reveal(d);return 1500},

/* Diagrama de Venn de 2 o 3 conjuntos */
venn(it){
  const S=arr(it.sets).slice(0,3).map(x=>typeof x==='object'&&x?x.name:x);if(S.length<2)return 500;
  const R=it.regions||{},three=S.length===3,H=three?262:240,d=put('t-fig'),s=sv('svg',{viewBox:`0 0 360 ${H}`,class:'graph'},d);
  const cir=three?[[140,100],[220,100],[180,165]]:[[125,125],[235,125]],r=three?70:88,col=['var(--blue)','var(--yel)','var(--pink)'];
  sv('rect',{x:3,y:3,width:354,height:H-6,rx:10,style:'fill:none;stroke:currentColor;opacity:.35;stroke-width:1.5'},s);
  cir.forEach((c,i)=>{sv('circle',{cx:c[0],cy:c[1],r,style:`fill:${col[i]};fill-opacity:.2;stroke:${col[i]};stroke-width:3`},s)});
  const nm=three?[[95,26],[265,26],[180,H-8]]:[[100,28],[260,28]];
  S.forEach((n,i)=>sv('text',{x:nm[i][0],y:nm[i][1],'text-anchor':'middle',style:`fill:${col[i]};font-size:15px;font-weight:700`},s,clip(n,16)));
  const items=(x,y,list,per,max)=>{const L=arr(list).map(v=>clip(v,10));if(!L.length)return;const ln=[];for(let i=0;i<L.length;i+=per)ln.push(L.slice(i,i+per).join(', '));
    const sh=ln.slice(0,max);if(ln.length>max)sh[max-1]+=' …';
    sh.forEach((t,i)=>sv('text',{x,y:y+(i-(sh.length-1)/2)*15+4,'text-anchor':'middle',style:'fill:currentColor;font-size:13px'},s,t))};
  if(three){items(110,85,R.a,2,4);items(250,85,R.b,2,4);items(180,208,R.c,2,3);items(180,66,R.ab,1,2);items(140,150,R.ac,1,3);items(220,150,R.bc,1,3);items(180,118,R.abc,1,3)}
  else{items(88,125,R.a,2,5);items(272,125,R.b,2,5);items(180,125,R.ab,1,5)}
  if(arr(it.out).length){sv('text',{x:12,y:H-10,style:'fill:var(--chalk);font-size:12px;opacity:.9'},s,clip('Fuera: '+arr(it.out).slice(0,6).join(', '),30))}
  cap(d,it);reveal(d);return 1500},

/* Diagrama de árbol de probabilidad (calcula los resultados y comprueba que sumen 1) */
tree(it){
  const L1=arr(it.branches).slice(0,3).filter(b=>b&&typeof b==='object');if(!L1.length)return 500;
  const subs=L1.map(b=>arr(b.branches).slice(0,3).filter(c=>c&&typeof c==='object')),deep=subs.some(x=>x.length);
  const rows=subs.map(x=>deep?Math.max(1,x.length):1),n=rows.reduce((a,b)=>a+b,0),RH=34,H=Math.max(150,n*RH+24);
  const d=put('t-fig'),s=sv('svg',{viewBox:`0 0 360 ${H}`,class:'graph'},d),x0=30,x1=deep?150:240,x2=262;
  const tx=(x,y,t,c,a,z,w)=>sv('text',{x,y,'text-anchor':a||'start',style:`fill:${c||'currentColor'};font-size:${z||13}px;font-weight:${w||600}`},s,t);
  const dot=(x,y,c)=>sv('circle',{cx:x,cy:y,r:5,style:`fill:${c||'var(--chalk)'}`},s);
  const edge=(xa,ya,xb,yb,c,p)=>{sv('line',{x1:xa,y1:ya,x2:xb,y2:yb,style:`stroke:${c};stroke-width:2.5`},s);if(p!=null&&p!=='')tx((xa+xb)/2,(ya+yb)/2-5,clip(p,6),'var(--yel)','middle',12,700)};
  let ri=0;const y1s=[],lv=[];
  L1.forEach((b,i)=>{const k=rows[i],ys=[];for(let j=0;j<k;j++)ys.push(12+(ri+j)*RH+RH/2);ri+=k;y1s.push((ys[0]+ys[k-1])/2);lv.push(ys)});
  const yr=(y1s[0]+y1s[y1s.length-1])/2,prods=[];
  L1.forEach((b,i)=>{const col=C[i%3],y1=y1s[i],f1=pf(b.p);edge(x0,yr,x1,y1,col,b.p);dot(x1,y1,col);
    if(deep&&subs[i].length){tx(x1,y1-10,clip(b.label,9),col,'middle');
      subs[i].forEach((c,j)=>{const y2=lv[i][j],f2=pf(c.p);edge(x1,y1,x2,y2,col,c.p);dot(x2,y2,col);tx(x2+9,y2+5,clip(c.label,8));
        const f=f1&&f2?red(f1[0]*f2[0],f1[1]*f2[1]):null;prods.push(f);if(f)tx(352,y2+5,'= '+fs(f),'var(--pink)','end',14,700)})}
    else{tx(x1+9,y1+5,clip(b.label,deep?8:10));prods.push(f1);if(f1)tx(352,y1+5,'= '+fs(f1),'var(--pink)','end',14,700)}});
  dot(x0,yr);tx(x0-8,Math.max(14,yr-12),clip(it.root||'Inicio',9));
  if(prods.length&&prods.every(Boolean)){const sum=prods.reduce((a,f)=>a+f[0]/f[1],0),nt=el('div','t-note',d);
    nt.textContent=Math.abs(sum-1)<1e-6?'✔ Todos los resultados suman 1':'Suma de los resultados = '+(+sum.toFixed(4))}
  cap(d,it);reveal(d);return 1700},

/* Cuadro de Punnett (genética de un gen) */
punnett(it){
  const g=x=>{x=String(x||'').replace(/[^A-Za-z]/g,'');return x.length===2&&x[0].toLowerCase()===x[1].toLowerCase()?x:null};
  const p1=g(it.p1),p2=g(it.p2);if(!p1||!p2||p1[0].toLowerCase()!==p2[0].toLowerCase())return 500;
  const d=put('t-pun');el('div','pu-top',d,'Cruce: '+p1+' × '+p2);
  const tb=el('table','t-table pu-tb',d),h=tb.insertRow();el('th','',h,'');[p1[0],p1[1]].forEach(a=>el('th','pu-g',h,a));
  const cnt=new Map();let dom=0,rec=0;
  [p2[0],p2[1]].forEach(b=>{const r=tb.insertRow(),hc=document.createElement('th');hc.className='pu-g';hc.textContent=b;r.appendChild(hc);
    [p1[0],p1[1]].forEach(a=>{const gt=[a,b].sort().join(''),c=r.insertCell();c.textContent=gt;const isD=/[A-Z]/.test(gt);c.className=isD?'pu-d':'pu-r';isD?dom++:rec++;cnt.set(gt,(cnt.get(gt)||0)+1)})});
  el('div','pu-res',d,'Genotipos: '+[...cnt].map(([k,v])=>v+' '+k).join(' · '));
  const dn=T(it.dom||'dominante'),rn=T(it.rec||'recesivo'),ph=[];if(dom)ph.push(dom+' ('+dom*25+' %) '+dn);if(rec)ph.push(rec+' ('+rec*25+' %) '+rn);
  el('div','pu-res',d,'Fenotipos: '+ph.join(' · '));cap(d,it);reveal(d);return 1500},

/* Operaciones en columna: suma (con acarreos), resta y multiplicación */
arith(it){
  const op=String(it.op||'add').toLowerCase(),A=String(it.a==null?'':it.a).replace(/\D/g,'').slice(0,7),B=String(it.b==null?'':it.b).replace(/\D/g,'').slice(0,7);
  if(!A||!B)return 500;const a=+A,b=+B,m=op==='mul'||op==='x'||op==='×',sb=op==='sub'||op==='-'||op==='−',sym=m?'×':sb?'−':'+';
  const res=m?a*b:sb?a-b:a+b;if(res<0)return 500;const R=String(res),L=[];
  let W=Math.max(R.length,A.length,B.length+1);
  const parts=[];if(m&&B.length>1)[...B].reverse().forEach((c,k)=>parts.push(String(a*+c)+' '.repeat(k)));
  parts.forEach(p=>{W=Math.max(W,p.length)});W+=2;
  if(!m&&!sb){const da=[...A].reverse().map(Number),db=[...B].reverse().map(Number),car=[0],k=Math.max(da.length,db.length),row=Array(W).fill(' ');let any=false;
    for(let i=0;i<k;i++){const t=(da[i]||0)+(db[i]||0)+car[i];car.push(t>9?1:0);if(t>9&&i+1<W){row[W-1-(i+1)]='1';any=true}}
    if(any)L.push({t:row.join(''),c:'ar-c'})}
  L.push({t:A.padStart(W),c:''});L.push({t:(sym+B.padStart(W-1)),c:''});L.push({t:'─'.repeat(W),c:'ar-r'});
  if(parts.length){parts.forEach(p=>L.push({t:p.padStart(W),c:'ar-p'}));L.push({t:'─'.repeat(W),c:'ar-r'})}
  L.push({t:R.padStart(W),c:'ar-ans'});
  const w=el('div','t-arith',sheet());
  L.forEach((l,i)=>setTimeout(()=>{const r=put('ar-l '+l.c,w);r.textContent=l.t;reveal(r);
    if(i===L.length-1&&it.caption)setTimeout(()=>{const n=put('t-note',w);rich(n,it.caption);reveal(n)},300)},i*650));
  return L.length*650+500}
};
const old=Board.draw;
Board.draw=function(it){const f=it&&Object.prototype.hasOwnProperty.call(E,it.t)&&E[it.t];if(f){try{return f(it)}catch(e){console.warn('teach2',e);return 600}}return old.call(Board,it)};
window.LumiTeach2={types:Object.keys(E)};
})();
