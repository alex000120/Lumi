/* Herramientas de enseñanza de Lumi · tanda 6: parts, geocoords, lens, bonds, probdice, fractionline.
   Se enganchan a Board.draw encima de teach.js, teach2.js y teach3.js. Todo el texto de la IA se inserta como texto (nunca HTML). */
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
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
const red=(n,d)=>{const g=gcd(n,d)||1;return[n/g,d/g]};
const fs=f=>f[1]===1?String(f[0]):f[0]+'/'+f[1];
const key=s=>String(s==null?'':s).normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[₀-₉]/g,c=>String(c.charCodeAt(0)-8320)).replace(/[^A-Za-z0-9]/g,'').toLowerCase();
const HALO='paint-order:stroke;stroke:var(--board,#243b2f);stroke-width:4px;stroke-linejoin:round;';
const sorry=t=>{const d=put('t-note');d.textContent=t;reveal(d);return 900};

/* ---------- parts: plantillas dibujadas con rótulos ---------- */
const sk=(c,w,f)=>`fill:${f||'none'};stroke:${c};stroke-width:${w}`;
const PT={
animalcell:{A:[
  {id:'retic',n:'Retículo',x:158,y:118,side:'l'},{id:'membrane',n:'Membrana',x:129,y:140,side:'l'},{id:'golgi',n:'Golgi',x:155,y:160,side:'l'},{id:'cytoplasm',n:'Citoplasma',x:160,y:184,side:'l'},
  {id:'ribo',n:'Ribosomas',x:240,y:114,side:'r'},{id:'nucleus',n:'Núcleo',x:225,y:135,side:'r'},{id:'mito',n:'Mitocondria',x:245,y:165,side:'r'},{id:'lyso',n:'Lisosoma',x:225,y:188,side:'r'}],
 draw(s){
  sv('ellipse',{cx:200,cy:140,rx:72,ry:62,style:sk('var(--yel)',4,'rgba(246,216,107,.1)')},s);
  sv('circle',{cx:200,cy:128,r:26,style:sk('var(--pink)',3,'rgba(245,154,180,.2)')},s);sv('circle',{cx:206,cy:122,r:7,style:'fill:var(--pink)'},s);
  sv('path',{d:'M160 105q-10 8 0 16q10 8 0 16',style:sk('var(--blue)',3)},s);sv('path',{d:'M166 105q-10 8 0 16q10 8 0 16',style:sk('var(--blue)',2)},s);
  [[140,150,15],[140,158,15],[142,166,13]].forEach(([x,y,w],i)=>sv('path',{d:`M${x} ${y}q${w} -8 ${w*2} 0`,style:sk('var(--chalk)',3)},s));
  sv('ellipse',{cx:245,cy:165,rx:16,ry:8,transform:'rotate(-25 245 165)',style:sk('var(--pink)',2.5,'rgba(245,154,180,.25)')},s);sv('path',{d:'M233 168q4 -6 7 0t7 -2t6 -4',style:sk('var(--pink)',1.5)},s);
  [[236,112],[242,120],[232,124],[246,110]].forEach(([x,y])=>sv('circle',{cx:x,cy:y,r:2.6,style:'fill:var(--blue)'},s));
  sv('circle',{cx:225,cy:188,r:6,style:sk('var(--yel)',2,'rgba(246,216,107,.4)')},s)}},
plantcell:{A:[
  {id:'nucleus',n:'Núcleo',x:140,y:100,side:'l'},{id:'wall',n:'Pared celular',x:125,y:150,side:'l'},{id:'cytoplasm',n:'Citoplasma',x:176,y:200,side:'l'},
  {id:'chloro',n:'Cloroplasto',x:262,y:110,side:'r'},{id:'membrane',n:'Membrana',x:269,y:140,side:'r'},{id:'vacuole',n:'Vacuola',x:232,y:150,side:'r'}],
 draw(s){
  sv('rect',{x:125,y:70,width:150,height:140,rx:14,style:sk('#6ec878',6)},s);sv('rect',{x:131,y:76,width:138,height:128,rx:10,style:sk('var(--blue)',2,'rgba(110,200,120,.1)')},s);
  sv('ellipse',{cx:200,cy:145,rx:38,ry:48,style:sk('var(--blue)',2.5,'rgba(143,208,232,.28)')},s);
  sv('circle',{cx:150,cy:105,r:14,style:sk('var(--pink)',3,'rgba(245,154,180,.2)')},s);sv('circle',{cx:153,cy:102,r:4,style:'fill:var(--pink)'},s);
  [[252,108,20],[152,182,-15],[250,184,10]].forEach(([x,y,a])=>{sv('ellipse',{cx:x,cy:y,rx:15,ry:8,transform:`rotate(${a} ${x} ${y})`,style:sk('#6ec878',2.5,'rgba(110,200,120,.5)')},s);sv('path',{d:`M${x-9} ${y}h18`,transform:`rotate(${a} ${x} ${y})`,style:sk('#6ec878',1.5)},s)})}},
flower:{A:[
  {id:'petal',n:'Pétalo',x:148,y:112,side:'l'},{id:'anther',n:'Antera',x:167,y:124,side:'l'},{id:'sepal',n:'Sépalo',x:176,y:189,side:'l'},{id:'stem',n:'Tallo',x:200,y:248,side:'l'},
  {id:'stigma',n:'Estigma',x:207,y:106,side:'r'},{id:'style',n:'Estilo',x:201,y:140,side:'r'},{id:'ovary',n:'Ovario',x:212,y:172,side:'r'},{id:'leaf',n:'Hoja',x:240,y:229,side:'r'}],
 draw(s){
  sv('line',{x1:200,y1:190,x2:200,y2:268,style:'stroke:#6ec878;stroke-width:7;stroke-linecap:round'},s);sv('ellipse',{cx:232,cy:232,rx:28,ry:12,transform:'rotate(-30 232 232)',style:sk('#6ec878',2.5,'rgba(110,200,120,.45)')},s);
  sv('ellipse',{cx:200,cy:100,rx:22,ry:38,style:sk('var(--pink)',2.5,'rgba(245,154,180,.35)')},s);
  sv('ellipse',{cx:158,cy:125,rx:20,ry:40,transform:'rotate(-28 158 125)',style:sk('var(--pink)',2.5,'rgba(245,154,180,.4)')},s);sv('ellipse',{cx:242,cy:125,rx:20,ry:40,transform:'rotate(28 242 125)',style:sk('var(--pink)',2.5,'rgba(245,154,180,.4)')},s);
  sv('ellipse',{cx:184,cy:186,rx:14,ry:6,transform:'rotate(-25 184 186)',style:sk('#6ec878',2.5,'rgba(110,200,120,.55)')},s);sv('ellipse',{cx:216,cy:186,rx:14,ry:6,transform:'rotate(25 216 186)',style:sk('#6ec878',2.5,'rgba(110,200,120,.55)')},s);
  sv('line',{x1:194,y1:168,x2:172,y2:128,style:'stroke:var(--chalk);stroke-width:3'},s);sv('line',{x1:206,y1:168,x2:228,y2:128,style:'stroke:var(--chalk);stroke-width:3'},s);
  sv('ellipse',{cx:170,cy:124,rx:6,ry:9,transform:'rotate(-25 170 124)',style:'fill:var(--yel)'},s);sv('ellipse',{cx:230,cy:124,rx:6,ry:9,transform:'rotate(25 230 124)',style:'fill:var(--yel)'},s);
  sv('line',{x1:200,y1:160,x2:200,y2:112,style:'stroke:var(--yel);stroke-width:4;stroke-linecap:round'},s);sv('circle',{cx:200,cy:108,r:7,style:'fill:var(--pink)'},s);
  sv('ellipse',{cx:200,cy:172,rx:12,ry:15,style:sk('var(--yel)',2.5,'rgba(246,216,107,.35)')},s)}},
earth:{A:[
  {id:'crust',n:'Corteza',x:104,y:123,side:'l'},{id:'mantle',n:'Manto',x:124,y:153,side:'l'},{id:'outer',n:'Núcleo externo',x:243,y:124,side:'r'},{id:'inner',n:'Núcleo interno',x:209,y:143,side:'r'}],
 draw(s){
  [[100,'#8b5e3c'],[94,'#e0803a'],[60,'#f2c04b'],[32,'#f6e27a']].forEach(([r,c])=>sv('circle',{cx:200,cy:140,r,style:`fill:${c};stroke:var(--board,#243b2f);stroke-width:2`},s))}}
};
const PALIAS={celula:'animalcell',celulaanimal:'animalcell',animal:'animalcell',cell:'animalcell',celulavegetal:'plantcell',vegetal:'plantcell',plant:'plantcell',flor:'flower',tierra:'earth',capasdelatierra:'earth',planeta:'earth'};

/* ---------- bonds: moléculas con enlaces y electrones ---------- */
const AT={H:['var(--chalk)',14],C:['#9aa0a6',20],N:['var(--blue)',20],O:['var(--pink)',20],Cl:['#6ec878',22],Na:['var(--yel)',24]};
const MOL={
h2:{a:[['H',130,100],['H',230,100]],b:[[0,1,1]],lp:[[],[]],i:'Enlace covalente simple, no polar · molécula lineal'},
o2:{a:[['O',125,100],['O',235,100]],b:[[0,1,2]],lp:[[110,250],[70,290]],i:'Enlace covalente doble, no polar · molécula lineal'},
n2:{a:[['N',125,100],['N',235,100]],b:[[0,1,3]],lp:[[180],[0]],i:'Enlace covalente triple, no polar · molécula lineal'},
cl2:{a:[['Cl',125,100],['Cl',235,100]],b:[[0,1,1]],lp:[[90,270,180],[90,270,0]],i:'Enlace covalente simple, no polar · molécula lineal'},
hcl:{a:[['H',120,100],['Cl',235,100]],b:[[0,1,1]],lp:[[],[90,270,0]],i:'Enlace covalente simple, polar (el cloro atrae más a los electrones) · molécula lineal'},
h2o:{a:[['O',180,75],['H',120,140],['H',240,140]],b:[[0,1,1],[0,2,1]],lp:[[65,115],[],[]],i:'Dos enlaces covalentes simples, polares · molécula angular (≈ 104,5°)'},
co2:{a:[['O',95,100],['C',180,100],['O',265,100]],b:[[0,1,2],[1,2,2]],lp:[[100,260],[],[80,280]],i:'Dos enlaces covalentes dobles · molécula lineal, apolar en conjunto'},
nh3:{a:[['N',180,70],['H',115,140],['H',180,155],['H',245,140]],b:[[0,1,1],[0,2,1],[0,3,1]],lp:[[90],[],[],[]],i:'Tres enlaces covalentes simples, polares · pirámide trigonal (≈ 107°)'},
ch4:{a:[['C',180,100],['H',180,32],['H',180,168],['H',108,100],['H',252,100]],b:[[0,1,1],[0,2,1],[0,3,1],[0,4,1]],lp:[[],[],[],[],[]],i:'Cuatro enlaces covalentes simples · forma tetraédrica (≈ 109,5°), apolar'}
};
const MALIAS={hidrogeno:'h2',oxigeno:'o2',nitrogeno:'n2',cloro:'cl2',acidoclorhidrico:'hcl',agua:'h2o',dioxidodecarbono:'co2',amoniaco:'nh3',metano:'ch4',sal:'nacl',clorurodesodio:'nacl',salcomun:'nacl'};

/* ---------- fracciones/decimales para fractionline ---------- */
function pv(x){x=String(x==null?'':x).trim().replace(',','.');let m;
  if((m=x.match(/^(-?)(\d+)\s+(\d+)\s*\/\s*(\d+)$/))&&+m[4])return{v:(m[1]?-1:1)*(+m[2]+m[3]/m[4]),t:x,k:'f'};
  if((m=x.match(/^(-?\d+)\s*\/\s*(\d+)$/))&&+m[2])return{v:+m[1]/+m[2],t:x.replace(/\s+/g,''),k:'f'};
  if((m=x.match(/^-?(\d*\.\d+|\d+)$/)))return{v:+x,t:x,k:'d'};
  return null}

const E={
parts(it){
  const id=PALIAS[key(it.template||it.what)]||key(it.template||it.what),P=PT[id];
  if(!P)return sorry('No tengo ese dibujo todavía (disponibles: célula animal, célula vegetal, flor y capas de la Tierra).');
  const show=Array.isArray(it.show)?it.show.map(String):null,hl=arr(it.highlight).map(String),lab=it.labels&&typeof it.labels==='object'?it.labels:{};
  const d=put('t-fig'),s=sv('svg',{viewBox:'0 0 400 285',class:'graph'},d);P.draw(s);
  ['l','r'].forEach(side=>{
    const L=P.A.filter(a=>a.side===side&&(!show||show.includes(a.id))).sort((a,b)=>a.y-b.y),ys=L.map(a=>a.y);
    for(let i=1;i<ys.length;i++)ys[i]=Math.max(ys[i],ys[i-1]+24);
    for(let i=ys.length-1;i>=0;i--){if(ys[i]>272)ys[i]=272;if(i<ys.length-1&&ys[i]>ys[i+1]-24)ys[i]=ys[i+1]-24}
    L.forEach((a,i)=>{const t=clip(lab[a.id]!=null?lab[a.id]:a.n,18),on=hl.includes(a.id),w=t.length*6.5+9,xe=side==='l'?6+w:394-w,col=on?'var(--pink)':'var(--chalk)',ly=Math.max(14,ys[i]);
      sv('line',{x1:a.x,y1:a.y,x2:xe,y2:ly,style:`stroke:${on?'var(--pink)':'var(--yel)'};stroke-width:1.8;opacity:.9`},s);
      sv('circle',{cx:a.x,cy:a.y,r:on?6:3.5,style:on?'fill:none;stroke:var(--pink);stroke-width:3':'fill:var(--yel)'},s);
      sv('text',{x:side==='l'?6:394,y:ly+5,'text-anchor':side==='l'?'start':'end',style:`fill:${col};font-size:14px;font-weight:${on?800:600};${HALO}`},s,t)})});
  cap(d,it);reveal(d);return 1800},

geocoords(it){
  const P=arr(it.points).slice(0,8).map(p=>({la:+(p&&p.lat),lo:+(p&&p.lon),l:String((p&&p.label)||'')})).filter(p=>isFinite(p.la)&&isFinite(p.lo)&&Math.abs(p.la)<=90&&Math.abs(p.lo)<=180);
  const d=put('t-fig'),s=sv('svg',{viewBox:'0 0 390 225',class:'graph'},d),x0=28,W=340,y0=12,Hh=170,X=lo=>x0+(lo+180)/360*W,Y=la=>y0+(90-la)/180*Hh;
  sv('rect',{x:x0,y:y0,width:W,height:Hh,style:'fill:rgba(143,208,232,.1);stroke:currentColor;stroke-width:1.5'},s);
  sv('rect',{x:x0,y:y0,width:W,height:Hh/2,style:'fill:rgba(246,216,107,.06)'},s);
  for(let la=-60;la<=60;la+=30){sv('line',{x1:x0,x2:x0+W,y1:Y(la),y2:Y(la),style:'stroke:currentColor;opacity:.2;stroke-width:1'},s);sv('text',{x:x0-3,y:Y(la)+4,'text-anchor':'end',style:'fill:currentColor;font-size:10px;opacity:.85'},s,la===0?'0°':Math.abs(la)+'°'+(la>0?'N':'S'))}
  for(let lo=-150;lo<=150;lo+=30){sv('line',{x1:X(lo),x2:X(lo),y1:y0,y2:y0+Hh,style:'stroke:currentColor;opacity:.2;stroke-width:1'},s);sv('text',{x:X(lo),y:y0+Hh+13,'text-anchor':'middle',style:'fill:currentColor;font-size:8.5px;opacity:.85'},s,lo===0?'0°':Math.abs(lo)+'°'+(lo>0?'E':'O'))}
  if(it.lines!==false){[23.44,-23.44,66.56,-66.56].forEach(la=>sv('line',{x1:x0,x2:x0+W,y1:Y(la),y2:Y(la),style:'stroke:var(--blue);stroke-width:1.5;stroke-dasharray:5 4;opacity:.8'},s));
    sv('text',{x:x0+4,y:Y(23.44)-3,style:'fill:var(--blue);font-size:9px'},s,'Trópico de Cáncer');sv('text',{x:x0+4,y:Y(-23.44)+11,style:'fill:var(--blue);font-size:9px'},s,'Trópico de Capricornio')}
  sv('line',{x1:x0,x2:x0+W,y1:Y(0),y2:Y(0),style:'stroke:var(--pink);stroke-width:3'},s);sv('line',{x1:X(0),x2:X(0),y1:y0,y2:y0+Hh,style:'stroke:var(--yel);stroke-width:3'},s);
  sv('text',{x:x0+4,y:Y(0)-4,style:'fill:var(--pink);font-size:11px;font-weight:700'},s,'Ecuador');sv('text',{x:X(0)+4,y:y0+11,style:'fill:var(--yel);font-size:11px;font-weight:700'},s,'Greenwich');
  sv('text',{x:x0+4,y:y0+24,style:'fill:currentColor;font-size:11px;opacity:.75'},s,'Hemisferio norte');sv('text',{x:x0+4,y:y0+Hh-6,style:'fill:currentColor;font-size:11px;opacity:.75'},s,'Hemisferio sur');
  P.forEach((p,i)=>{const x=X(p.lo),y=Y(p.la);sv('circle',{cx:x,cy:y,r:5,style:'fill:var(--pink);stroke:var(--chalk);stroke-width:1.5'},s);
    const t=clip((p.l?p.l+' ':'')+'('+fm(Math.abs(p.la))+'°'+(p.la>=0?'N':'S')+', '+fm(Math.abs(p.lo))+'°'+(p.lo>=0?'E':'O')+')',34),left=x>x0+W*.6;
    sv('text',{x:left?x-8:x+8,y:y+(i%2?15:-8),'text-anchor':left?'end':'start',style:`fill:var(--chalk);font-size:10.5px;font-weight:700;${HALO}`},s,t)});
  cap(d,it);reveal(d);return 1600},

lens(it){
  const f=+it.f,dO=+it.do;if(!isFinite(f)||!isFinite(dO)||f===0||dO<=0)return 500;
  const xl=200,yc=125,inf=Math.abs(1/f-1/dO)<1e-9,di=inf?Infinity:1/(1/f-1/dO),af=Math.abs(f),big=3*Math.max(dO,af),dc=inf?big:Math.min(Math.abs(di),big);
  const s=165/Math.max(dO,dc,af),M=inf?0:-di/dO;let hp=45;if(!inf&&Math.abs(M)*hp>95)hp=Math.max(8,95/Math.abs(M));
  const d=put('t-fig'),sg=sv('svg',{viewBox:'0 0 400 250',class:'graph'},d),xo=xl-dO*s,yo=yc-hp,xF=xl-f*s;
  const ln=(x1,y1,x2,y2,c,w,dash)=>sv('line',{x1,y1,x2,y2,style:`stroke:${c};stroke-width:${w||2.5};stroke-linecap:round;${dash?'stroke-dasharray:6 4':''}`},sg);
  const tx=(x,y,t,c,a)=>sv('text',{x,y,'text-anchor':a||'middle',style:`fill:${c};font-size:13px;font-weight:700;${HALO}`},sg,t);
  ln(15,yc,385,yc,'currentColor',1.5);
  if(f>0)sv('path',{d:`M${xl} ${yc-82}Q${xl+17} ${yc} ${xl} ${yc+82}Q${xl-17} ${yc} ${xl} ${yc-82}Z`,style:'fill:rgba(143,208,232,.25);stroke:var(--blue);stroke-width:3'},sg);
  else sv('path',{d:`M${xl-11} ${yc-82}L${xl+11} ${yc-82}Q${xl+1} ${yc} ${xl+11} ${yc+82}L${xl-11} ${yc+82}Q${xl-1} ${yc} ${xl-11} ${yc-82}Z`,style:'fill:rgba(143,208,232,.25);stroke:var(--blue);stroke-width:3'},sg);
  [[xl-af*s,'F'],[xl+af*s,'F′']].forEach(([x,t])=>{if(x>8&&x<392){sv('circle',{cx:x,cy:yc,r:3.5,style:'fill:var(--yel)'},sg);tx(x,yc+17,t,'var(--yel)')}});
  const arrow=(x,y1,y2,c,dash)=>{ln(x,y1,x,y2,c,3.5,dash);const u=y2<y1?1:-1;sv('polygon',{points:`${x},${y2} ${x-5},${y2+u*9} ${x+5},${y2+u*9}`,style:`fill:${c}`},sg)};
  arrow(xo,yc,yo,'var(--yel)');tx(xo,yc+30,'Objeto','var(--yel)');
  let info;
  if(inf){const sl=(yc-yo)/(xl-xo);
    ln(xo,yo,xl,yo,'var(--blue)');ln(xl,yo,xl+af*s,yc,'var(--blue)');ln(xl+af*s,yc,380,yc+(380-xl-af*s)*sl,'var(--blue)');
    ln(xo,yo,xl,yc,'var(--pink)');ln(xl,yc,380,yc+(380-xl)*sl,'var(--pink)');
    info='El objeto está justo en el foco: los rayos salen paralelos y la imagen se forma en el infinito.'}
  else{
    const xi=xl+di*s,yi=yc+M*(yo-yc),m=(yo-yc)/(xo-xF),y3=yc+m*(xl-xF),rays=[[yo,'var(--blue)'],[yc,'var(--pink)'],[y3,'var(--chalk)']];
    const ok=Math.abs(xi-xl)<=175&&Math.abs(yi-yc)<=118;
    rays.forEach(([yl,c])=>{ln(xo,yo,xl,yl,c);
      if(!ok){ln(xl,yl,380,yl+(380-xl)*(yl===yc?(yc-yo)/(xl-xo):0),c);return}
      if(di>0)ln(xl,yl,xi,yi,c);else{ln(xl,yl,xi,yi,c,2,true);const dx=xl-xi,dy=yl-yi,t=(380-xl)/dx;ln(xl,yl,380,yl+dy*t,c)}});
    if(ok){arrow(xi,yc,yi,'var(--pink)',di<0);tx(xi,yi<yc?yc+30:yc-24,'Imagen','var(--pink)')}
    info='Imagen '+(di>0?'real':'virtual')+(M<0?', invertida':', derecha')+(Math.abs(M)<.995?', más pequeña':Math.abs(M)>1.005?', más grande':', del mismo tamaño')+' · di = '+fm(di)+' · aumento = '+fm(M)+'×'+(ok?'':' (la imagen cae fuera del dibujo)');}
  const n=el('div','t-note',d);n.textContent=(f>0?'Lente convergente':'Lente divergente')+' (f = '+fm(f)+') · do = '+fm(dO)+'. '+info;
  el('div','t-note',d).textContent='1/f = 1/do + 1/di';cap(d,it);reveal(d);return 2000},

bonds(it){
  const k0=key(it.molecule||it.formula),k=MALIAS[k0]||k0,d=put('t-fig'),s=sv('svg',{viewBox:'0 0 360 200',class:'graph'},d);
  const atom=(sym,x,y,r,chg)=>{const c=AT[sym]||['var(--chalk)',20];sv('circle',{cx:x,cy:y,r:r||c[1],style:`fill:${c[0]};fill-opacity:.25;stroke:${c[0]};stroke-width:3`},s);
    sv('text',{x,y:y+6,'text-anchor':'middle',style:'fill:var(--chalk);font-size:17px;font-weight:800'},s,sym);
    if(chg)sv('text',{x:x+(r||c[1])*.8,y:y-(r||c[1])*.7,'text-anchor':'middle',style:`fill:${c[0]};font-size:17px;font-weight:800;${HALO}`},s,chg)};
  const pair=(x,y,r,deg)=>{const a=deg*Math.PI/180,cx=x+Math.cos(a)*(r+9),cy=y-Math.sin(a)*(r+9),px=Math.sin(a)*3.6,py=Math.cos(a)*3.6;
    [-1,1].forEach(q=>sv('circle',{cx:cx+q*px,cy:cy+q*py,r:2.5,style:'fill:var(--yel)'},s))};
  let info;
  if(k==='nacl'){atom('Na',115,115,26,'+');atom('Cl',265,115,26,'−');[90,0,270,180].forEach(a=>pair(265,115,26,a));
    sv('line',{x1:145,x2:232,y1:115,y2:115,style:'stroke:var(--chalk);stroke-width:2;stroke-dasharray:3 6;opacity:.8'},s);
    sv('path',{d:'M125 84Q190 30 255 84',style:'fill:none;stroke:var(--yel);stroke-width:3'},s);sv('polygon',{points:'255,84 244,82 250,72',style:'fill:var(--yel)'},s);
    sv('text',{x:190,y:48,'text-anchor':'middle',style:'fill:var(--yel);font-size:15px;font-weight:800'},s,'e⁻');
    info='Enlace iónico: el sodio cede 1 electrón al cloro; los iones Na⁺ y Cl⁻ se atraen por sus cargas opuestas.'}
  else{const M=MOL[k];if(!M){d.remove();return sorry('No tengo el dibujo de esa molécula todavía (disponibles: H2, O2, N2, Cl2, HCl, H2O, CO2, NH3, CH4 y NaCl).')}
    const r=i=>(AT[M.a[i][0]]||[0,20])[1];
    M.b.forEach(([i,j,o])=>{const a=M.a[i],b=M.a[j],dx=b[1]-a[1],dy=b[2]-a[2],L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L,nx=-uy,ny=ux,off=o===1?[0]:o===2?[-3.5,3.5]:[-6,0,6];
      off.forEach(q=>sv('line',{x1:a[1]+ux*r(i)+nx*q,y1:a[2]+uy*r(i)+ny*q,x2:b[1]-ux*r(j)+nx*q,y2:b[2]-uy*r(j)+ny*q,style:'stroke:var(--chalk);stroke-width:3;stroke-linecap:round'},s))});
    M.a.forEach((a,i)=>{atom(a[0],a[1],a[2]);(M.lp[i]||[]).forEach(g=>pair(a[1],a[2],r(i),g))});info=M.i}
  const n=el('div','t-note',d);n.textContent=info;el('div','t-note',d).textContent='Rayas = electrones compartidos · puntos = pares de electrones libres';cap(d,it);reveal(d);return 1700},

probdice(it){
  const kind=/^c/i.test(String(it.kind||'dice'))?'coin':'dice';let n=Math.round(+it.n||(kind==='dice'?2:3));n=kind==='dice'?Math.max(1,Math.min(2,n)):Math.max(1,Math.min(5,n));
  let vals,cnt,tot;
  if(kind==='dice'){if(n===1){vals=[1,2,3,4,5,6];cnt=[1,1,1,1,1,1];tot=6}else{vals=[2,3,4,5,6,7,8,9,10,11,12];cnt=[1,2,3,4,5,6,5,4,3,2,1];tot=36}}
  else{vals=[];cnt=[];for(let k=0;k<=n;k++){vals.push(k);let c=1;for(let j=0;j<k;j++)c=c*(n-j)/(j+1);cnt.push(Math.round(c))}tot=Math.pow(2,n)}
  const roll=()=>{if(kind==='dice')return 1+Math.floor(Math.random()*6)+(n===2?1+Math.floor(Math.random()*6):0);let h=0;for(let i=0;i<n;i++)if(Math.random()<.5)h++;return h};
  const hl=arr(it.highlight).map(Number).filter(v=>vals.includes(v));
  const d=put('t-fig pd'),s=sv('svg',{viewBox:'0 0 360 225',class:'graph'},d),W=330,x0=15,bw=W/vals.length,yb=170,ph=125,obs=vals.map(()=>0);let N=0;
  const pmax=Math.max(...cnt)/tot,scale=m=>ph/(Math.max(pmax,m)*1.12);
  sv('line',{x1:x0,x2:x0+W,y1:yb,y2:yb,style:'stroke:currentColor;stroke-width:2'},s);
  const th=[],eb=[];
  vals.forEach((v,i)=>{const x=x0+i*bw+bw*.15,w=bw*.7,on=hl.includes(v);
    eb.push(sv('rect',{x,y:yb,width:w,height:0,style:`fill:${on?'var(--yel)':'var(--blue)'};fill-opacity:.75`},s));
    th.push(sv('rect',{x,y:yb,width:w,height:0,style:'fill:none;stroke:var(--pink);stroke-width:2;stroke-dasharray:4 3'},s));
    sv('text',{x:x+w/2,y:yb+16,'text-anchor':'middle',style:`fill:${on?'var(--yel)':'currentColor'};font-size:${vals.length>8?11:14}px;font-weight:${on?800:600}`},s,String(v));
    sv('text',{x:x+w/2,y:yb+31,'text-anchor':'middle',style:'fill:var(--pink);font-size:9.5px;opacity:.95'},s,fs(red(cnt[i],tot)))});
  const nt=sv('text',{x:x0+W,y:14,'text-anchor':'end',style:'fill:var(--chalk);font-size:12px;font-weight:700'},s,'');
  const upd=()=>{const mo=N?Math.max(...obs)/N:0,sc=scale(mo);vals.forEach((v,i)=>{const ht=cnt[i]/tot*sc,ho=N?obs[i]/N*sc:0;
      th[i].setAttribute('y',yb-ht);th[i].setAttribute('height',ht);eb[i].setAttribute('y',yb-ho);eb[i].setAttribute('height',ho)});nt.textContent=N?N+' lanzamientos':'Aún no has lanzado'};
  upd();
  const bar=el('div','pd-bar',d),go=(k)=>{for(let i=0;i<k&&N<5000;i++){obs[vals.indexOf(roll())]++;N++}upd()};
  const ic=kind==='dice'?'🎲':'🪙';[[1,ic+' ×1'],[10,ic+' ×10'],[100,ic+' ×100']].forEach(([k,t])=>{const b=el('button','pd-btn',bar,t);b.type='button';b.onclick=()=>go(k)});
  const rb=el('button','pd-btn',bar,'↺');rb.type='button';rb.onclick=()=>{obs.fill(0);N=0;upd()};
  const q=el('div','t-note',d);q.textContent=(kind==='dice'?(n===1?'1 dado':'Suma de 2 dados'):'Número de caras en '+n+(n===1?' moneda':' monedas'))+' · barras: lo que sale · línea rosa punteada: lo esperado'
    +(hl.length?' · P('+hl.join(' o ')+') = '+fs(red(hl.reduce((a,v)=>a+cnt[vals.indexOf(v)],0),tot))+' ≈ '+(100*hl.reduce((a,v)=>a+cnt[vals.indexOf(v)],0)/tot).toFixed(1)+' %':'');
  cap(d,it);reveal(d);return 1800},

fractionline(it){
  let lo=isFinite(+it.min)&&it.min!=null?Math.floor(+it.min):0,hi=isFinite(+it.max)&&it.max!=null?Math.ceil(+it.max):1;hi=Math.max(hi,lo+1);hi=Math.min(hi,lo+6);
  const den=Math.max(1,Math.min(12,Math.round(+it.den||4)));
  const P=arr(it.points).slice(0,6).map(x=>{const o=pv(typeof x==='object'&&x?x.v:x);return o?{...o,l:typeof x==='object'&&x&&x.label?String(x.label):''}:null}).filter(p=>p&&p.v>=lo-1e-9&&p.v<=hi+1e-9);
  const d=put('t-fig'),s=sv('svg',{viewBox:'0 0 380 190',class:'graph'},d),yA=95,X=v=>30+(v-lo)/(hi-lo)*320;
  sv('line',{x1:20,x2:362,y1:yA,y2:yA,style:'stroke:currentColor;stroke-width:2.5'},s);
  for(let k=0;k<=(hi-lo)*den;k++){const v=lo+k/den,big=k%den===0;sv('line',{x1:X(v),x2:X(v),y1:yA-(big?10:6),y2:yA+(big?10:6),style:`stroke:currentColor;stroke-width:${big?2.5:1.5}`},s);
    if(big)sv('text',{x:X(v),y:yA+26,'text-anchor':'middle',style:'fill:currentColor;font-size:15px;font-weight:700'},s,String(v))}
  const dec=v=>{const t=fm(v);return t},eq=p=>p.k==='f'?dec(p.v):(()=>{const m=String(p.t).match(/\.(\d+)$/);if(m&&m[1].length<=3){const k=Math.pow(10,m[1].length),f=red(Math.round(Math.abs(p.v)*k),k);return(p.v<0?'−':'')+fs(f)}return''})();
  const S=[...P].sort((a,b)=>a.v-b.v);let last=[-99,-99];
  S.forEach((p,i)=>{const x=X(p.v);let lv=0;if(x-last[0]<62)lv=1;if(lv===1&&x-last[1]<62)lv=0;last[lv]=x;const y=lv?34:60;
    sv('circle',{cx:x,cy:yA,r:6,style:'fill:var(--pink);stroke:var(--chalk);stroke-width:2'},s);sv('line',{x1:x,x2:x,y1:y+5,y2:yA-8,style:'stroke:var(--pink);stroke-width:1.5;opacity:.8'},s);
    sv('text',{x:Math.max(30,Math.min(350,x)),y,'text-anchor':'middle',style:`fill:var(--pink);font-size:15px;font-weight:800;${HALO}`},s,clip((p.l?p.l+' = ':'')+p.t.replace(/^-/,'−'),14));
    const e=eq(p);sv('text',{x:Math.max(30,Math.min(350,x)),y:yA+50+(i%2?16:0),'text-anchor':'middle',style:'fill:var(--yel);font-size:13px;font-weight:700'},s,e?'= '+e:'')});
  const n=el('div','t-note',d);n.textContent='Cada unidad está dividida en '+den+' partes iguales.'+(S.length>1?' Orden de menor a mayor: '+S.map(p=>p.t).join(S.every((p,i)=>!i||Math.abs(p.v-S[i-1].v)>1e-9)?' < ':' ≤ ')+'.':'');
  cap(d,it);reveal(d);return 1600}
};
const old=Board.draw;
Board.draw=function(it){const f=it&&Object.prototype.hasOwnProperty.call(E,it.t)&&E[it.t];if(f){try{return f(it)}catch(e){console.warn('teach4',e);return 600}}return old.call(Board,it)};
window.LumiTeach4={types:Object.keys(E)};
})();
