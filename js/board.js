/* Pizarra: texto, fórmulas (KaTeX), desarrollo paso a paso, tablas y gráficos SVG. */
const Board=(()=>{
  const sheet=()=>document.getElementById('sheet'),box=()=>document.getElementById('board'),log=[];
  const reveal=el=>requestAnimationFrame(()=>requestAnimationFrame(()=>{el.classList.add('on','focus');setTimeout(()=>el.classList.remove('focus'),1800);box().scrollTop=box().scrollHeight}));
  const tex=(el,x,d=true)=>{x=Tex.norm(x).replace(/^\s*\$+|\$+\s*$/g,'');if(window.katex)try{katex.render(x,el,{throwOnError:false,displayMode:d,strict:'ignore',errorColor:'inherit'});return}catch(e){}el.textContent=Tex.conv(x)};
  function add(cls,text){const d=document.createElement('div');d.className='it '+cls;d.textContent=text;sheet().appendChild(d);reveal(d);return d}
  function steps(it){
    const w=document.createElement('div');w.className='t-steps';sheet().appendChild(w);
    (it.lines||[]).forEach((l,i)=>setTimeout(()=>{
      const r=document.createElement('div');r.className='it rs';const a=document.createElement('div');tex(a,l);r.appendChild(a);
      const n=(it.notes||[])[i];if(n){const s=document.createElement('span');rich(s,n);r.appendChild(s)}w.appendChild(r);reveal(r)},i*850));
    return (it.lines||[]).length*850+400;
  }
  function table(it){
    const t=document.createElement('table');t.className='it t-table';
    (it.rows||[]).forEach((row,i)=>{const tr=t.insertRow();row.forEach(c=>{const td=document.createElement(i?'td':'th');rich(td,c);tr.appendChild(td)})});
    sheet().appendChild(t);reveal(t);
  }
  const FN=['x','sin','cos','tan','sqrt','abs','ln','log','exp','pi','e'];
  function mkFn(expr){
    let s=String(expr).replace(/\s+/g,'').replace(/\^/g,'**').replace(/π/g,'pi').replace(/^y=/i,'');
    if(!/^[0-9a-z+\-*\/().,]*$/i.test(s)||!(s.match(/[a-z]+/gi)||[]).every(i=>FN.includes(i)))return null;
    s=s.replace(/(\d|\))(x|\(|sin|cos|tan|sqrt|abs|ln|log|exp|pi)/g,'$1*$2');
    try{return new Function('x','const{sin,cos,tan,sqrt,abs,exp,PI:pi,E:e}=Math;const ln=Math.log,log=Math.log10;return '+s)}catch(e){return null}
  }
  const nice=r=>{const raw=r/7,p=10**Math.floor(Math.log10(raw)),f=raw/p;return(f<=1?1:f<=2?2:f<=5?5:10)*p};
  const fmt=v=>String(+v.toFixed(6));let gid=0;
  function graph(it){
    const NS='http://www.w3.org/2000/svg',W=360,H=270,m=30,id='gc'+(gid++);
    const x0=+it.xmin||-5,x1=+it.xmax||5;let y0=+it.ymin,y1=+it.ymax;if(!(y1>y0)){y0=-5;y1=5}
    const fs=(Array.isArray(it.f)?it.f:[it.f]).map(mkFn).filter(Boolean);
    const sx=x=>m+(x-x0)/(x1-x0)*(W-2*m),sy=y=>H-m-(y-y0)/(y1-y0)*(H-2*m),cy=y=>Math.max(m-30,Math.min(H-m+30,sy(y)));
    const svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox',`0 0 ${W} ${H}`);svg.setAttribute('class','graph');
    const el=(n,a,t)=>{const e=document.createElementNS(NS,n);for(const k in a)e.setAttribute(k,a[k]);if(t!=null)e.textContent=t;svg.appendChild(e);return e};
    el('clipPath',{id}).appendChild(Object.assign(document.createElementNS(NS,'rect'),{}));
    const cp=svg.lastChild.firstChild;[['x',m],['y',m-6],['width',W-2*m],['height',H-2*m+12]].forEach(([k,v])=>cp.setAttribute(k,v));
    const tx=nice(x1-x0),ty=nice(y1-y0),ax=Math.min(H-m,Math.max(m,sy(0))),ay=Math.min(W-m,Math.max(m,sx(0)));
    for(let x=Math.ceil(x0/tx)*tx;x<=x1+1e-9;x+=tx){el('line',{class:'gr',x1:sx(x),x2:sx(x),y1:m,y2:H-m});if(Math.abs(x)>1e-9)el('text',{x:sx(x),y:Math.min(H-8,ax+14),'text-anchor':'middle'},fmt(x))}
    for(let y=Math.ceil(y0/ty)*ty;y<=y1+1e-9;y+=ty){el('line',{class:'gr',x1:m,x2:W-m,y1:sy(y),y2:sy(y)});if(Math.abs(y)>1e-9)el('text',{x:Math.max(m-4,ay-5),y:sy(y)+4,'text-anchor':'end'},fmt(y))}
    el('line',{class:'ax',x1:m-6,x2:W-m+8,y1:ax,y2:ax});el('line',{class:'ax',x1:ay,x2:ay,y1:H-m+6,y2:m-8});
    el('path',{class:'ax',d:`M${W-m+8} ${ax}l-7 -4v8zM${ay} ${m-8}l-4 7h8z`,fill:'currentColor'});
    el('text',{x:W-m+4,y:ax-8,'text-anchor':'end'},'x');el('text',{x:ay+8,y:m-2},'y');
    const g=el('g',{'clip-path':`url(#${id})`});const add=(n,a)=>{const e=document.createElementNS(NS,n);for(const k in a)e.setAttribute(k,a[k]);g.appendChild(e)};
    if(it.shade){const sf=mkFn(it.shade.f||(Array.isArray(it.f)?it.f[0]:it.f));if(sf){const a=+it.shade.from,b=+it.shade.to;let d=`M${sx(a)} ${sy(0)}`;for(let k=0;k<=80;k++){const x=a+(b-a)*k/80;let y=0;try{y=sf(x)}catch(e){}d+=`L${sx(x)} ${cy(y)}`}add('path',{class:'sh',d:d+`L${sx(b)} ${sy(0)}Z`})}}
    (it.vlines||[]).forEach(v=>add('line',{class:'ds',x1:sx(v),x2:sx(v),y1:0,y2:H}));(it.hlines||[]).forEach(v=>add('line',{class:'ds',x1:0,x2:W,y1:sy(v),y2:sy(v)}));
    fs.forEach((f,i)=>{let d='',pen=false,prev=null;
      for(let k=0;k<=300;k++){const x=x0+(x1-x0)*k/300;let y;try{y=f(x)}catch(e){y=NaN}
        if(!isFinite(y)||Math.abs(y)>1e6||(prev!==null&&Math.abs(y-prev)>(y1-y0)*3)){pen=false;prev=isFinite(y)?y:null;continue}
        d+=(pen?'L':'M')+sx(x).toFixed(1)+' '+cy(y).toFixed(1);pen=true;prev=y}
      add('path',{class:'cv c'+(i%3),d})});
    (it.points||[]).forEach(p=>{if(!isFinite(+p.x)||!isFinite(+p.y))return;el('circle',{class:'pt',cx:sx(+p.x),cy:sy(+p.y),r:4.5});if(p.label)el('text',{class:'pl',x:sx(+p.x)+7,y:sy(+p.y)-7},Tex.text(p.label))});
    (it.names||[]).forEach((n,i)=>el('text',{class:'l'+(i%3),x:m+6,y:m+12+i*15},Tex.text(n)));
    const w=document.createElement('div');w.className='it';w.appendChild(svg);
    if(it.label){const c=document.createElement('div');c.className='t-note';rich(c,it.label);w.appendChild(c)}
    sheet().appendChild(w);reveal(w);
  }

  /* Dibujos SVG generados por la IA: se limpian (lista blanca) y se animan como trazos de tiza. */
  const NS='http://www.w3.org/2000/svg',figs={};
  const OKE=new Set(['svg','g','path','circle','ellipse','rect','line','polyline','polygon','text','tspan','defs','lineargradient','radialgradient','stop','use','clippath','filter','fegaussianblur','fedropshadow']);
  const OKA=new Set(['d','cx','cy','r','rx','ry','fx','fy','x','y','x1','y1','x2','y2','width','height','points','transform','fill','stroke','stroke-width','stroke-linecap','stroke-linejoin','stroke-dasharray','opacity','fill-opacity','stroke-opacity','font-size','font-weight','font-style','text-anchor','dominant-baseline','id','offset','stop-color','stop-opacity','gradientunits','gradienttransform','spreadmethod','class','href','xlink:href','clip-path','filter','fill-rule','clip-rule','stroke-dashoffset','stddeviation','dx','dy','flood-color','flood-opacity','filterunits','clippathunits','letter-spacing','text-decoration']);
  const SH=new Set(['path','circle','ellipse','rect','line','polyline','polygon']);
  function cleanKids(src,dst,st){
    for(const c of src.children){
      const n=c.localName.toLowerCase();if(!OKE.has(n)||st.n>=700)continue;st.n++;
      const e=document.createElementNS(NS,c.localName);
      for(const a of c.attributes){
        const k=a.name.toLowerCase();let v=a.value.trim();
        if(!OKA.has(k)||v.length>2000||/javascript|data:|expression|@import/i.test(v))continue;
        if(/url\(/i.test(v)){if(!/^url\(#[\w-]+\)$/.test(v))continue;v=v.replace(/^url\(#([\w-]+)\)$/,(m,x)=>`url(#${st.uid}-${x})`)}
        if(k==='href'||k==='xlink:href'){if(!/^#[\w-]+$/.test(v))continue;e.setAttribute('href','#'+st.uid+'-'+v.slice(1));continue}
        if(k==='id')v=st.uid+'-'+v.replace(/[^\w-]/g,'');
        if(k==='class'&&!v.split(/\s+/).every(t=>/^((s|f)-(chalk|yel|blue|pink|none|green|red|orange|purple|white|sky|gray|teal|gold|brown|cream)|an-(float|spin|pulse|blink|sway|bounce|flow|twinkle|drift)|sh)$/.test(t)))continue;
        e.setAttribute(a.name,v);
      }
      const cl=e.getAttribute('class')||'';
      if(SH.has(n)){
        if(!e.hasAttribute('stroke')&&!/\bs-/.test(cl))e.setAttribute('stroke','currentColor');
        if(!e.hasAttribute('fill')&&!/\bf-/.test(cl))e.setAttribute('fill','none');
        if(!e.hasAttribute('stroke-width'))e.setAttribute('stroke-width','2');
        e.setAttribute('stroke-linecap','round');e.setAttribute('stroke-linejoin','round');
      }
      if(n==='text'||n==='tspan'){
        if(!e.hasAttribute('fill')&&!/\bf-/.test(cl))e.setAttribute('fill','currentColor');
        if(!e.hasAttribute('stroke')){e.style.paintOrder='stroke';e.style.stroke='var(--board,#243b2f)';e.style.strokeWidth='3px';e.style.strokeLinejoin='round'}
        for(const ch of c.childNodes)if(ch.nodeType===3)e.appendChild(document.createTextNode(Tex.text(ch.data).slice(0,90)));
      }
      cleanKids(c,e,st);dst.appendChild(e);
    }
  }
  const inDefs=e=>{for(let p=e.parentNode;p&&p.localName!=='svg';p=p.parentNode)if(/^(defs|clippath|mask|filter|marker|lineargradient|radialgradient)$/i.test(p.localName))return true;return false};
  function drawing(it){
    let s=String(it.svg||'').trim().slice(0,60000);if(!s)return 700;
    if(!/^<svg/i.test(s))s=`<svg viewBox="0 0 400 300">${s}</svg>`;
    if(!/xmlns=/.test(s))s=s.replace(/^<svg/i,'<svg xmlns="http://www.w3.org/2000/svg"');
    s=s.replace(/&(?!(amp|lt|gt|quot|apos|#\d+);)/g,'&amp;');
    const doc=new DOMParser().parseFromString(s,'image/svg+xml'),root=doc.documentElement;
    if(!root||root.localName!=='svg'||doc.querySelector('parsererror')){add('t-note','(No pude dibujar esta figura)');return 700}
    let fig=it.id&&figs[it.id];
    if(!fig){
      fig=document.createElement('div');fig.className='fig';fig.dataset.uid='f'+(gid++);
      const svg=document.createElementNS(NS,'svg'),vb=root.getAttribute('viewBox')||'';
      svg.setAttribute('viewBox',/^[\d.\s-]+$/.test(vb)?vb:'0 0 400 300');fig.appendChild(svg);
      if(it.id)figs[it.id]=fig;sheet().appendChild(fig);
    }
    const svg=fig.firstChild,before=svg.children.length;
    cleanKids(root,svg,{n:0,uid:fig.dataset.uid});
    if(it.caption){let c=fig.querySelector('.t-note');if(!c){c=document.createElement('div');c.className='t-note';fig.appendChild(c)}rich(c,it.caption)}
    const all=[...svg.children].slice(before).flatMap(c=>[c,...c.querySelectorAll('*')]).filter(e=>(SH.has(e.localName)||e.localName==='text')&&!inDefs(e));
    const step=Math.max(50,Math.min(200,4500/(all.length||1)));
    all.forEach((e,i)=>{
      if(e.localName==='text'){e.style.opacity=0;e.style.transition='opacity .5s';setTimeout(()=>e.style.opacity='',i*step+100);return}
      let L=0;try{L=e.getTotalLength()}catch(x){}
      e.style.fillOpacity=0;e.style.transition='stroke-dashoffset .8s ease-out,fill-opacity .6s';
      if(L){e.style.strokeDasharray=L;e.style.strokeDashoffset=L}
      setTimeout(()=>{e.style.strokeDashoffset=0;e.style.fillOpacity='';setTimeout(()=>{e.style.strokeDasharray='';e.style.transition=''},900)},i*step+60);
    });
    box().scrollTop=box().scrollHeight;setTimeout(()=>box().scrollTop=box().scrollHeight,600);
    return Math.min(7000,all.length*step+900);
  }

  /* Texto enriquecido: $fórmula$ en línea (KaTeX), **negrita** y un subconjunto seguro de HTML (b, i, ul, li, br...). */
  const OKT=new Set(['b','strong','i','em','u','ul','ol','li','br','p','span','sub','sup','code','div']),TAGS='b|strong|i|em|u|ul|ol|li|br|p|span|sub|sup|code|div';
  function rich(el,text){
    const maths=[];let s=Tex.fix(text);
    s=s.replace(/\$([^$]+)\$/g,(m,x)=>{if(Tex.money(x))return m.replace(/\$/g,'\uE002');maths.push(x);return '\uE000'+(maths.length-1)+'\uE001'});
    s=s.replace(new RegExp('&lt;(/?(?:'+TAGS+'))\\s*/?&gt;','gi'),'<$1>');
    s=s.replace(new RegExp('<(?!/?(?:'+TAGS+')\\b)','gi'),'&lt;');
    s=s.replace(/\*\*([^*\n]+)\*\*/g,'<b>$1</b>').replace(/\n/g,'<br>');
    const walk=(src,dst)=>{for(const n of src.childNodes){
      if(n.nodeType===3){n.data.split(/\uE000(\d+)\uE001/).forEach((p,i)=>{
        if(i%2){const sp=document.createElement('span');tex(sp,maths[+p],false);dst.appendChild(sp)}else if(p)dst.appendChild(document.createTextNode(p.replace(/\uE002/g,'$')))})}
      else if(n.nodeType===1){const t=n.localName;if(OKT.has(t)){const e=document.createElement(t==='strong'?'b':t==='em'?'i':t);walk(n,e);dst.appendChild(e)}else walk(n,dst)}}};
    walk(new DOMParser().parseFromString('<body>'+s,'text/html').body,el);
    return el;
  }
  const BOX={def:['Definición','def'],ex:['Ejemplo','ex'],warn:['¡Ojo!','warn'],sum:['Resumen','sum'],try:['Tu turno','try']};
  function boxEl(it){
    const k=BOX[it.kind]||BOX.def,d=document.createElement('div');d.className='it t-box '+k[1];
    const h=document.createElement('b');rich(h,it.title||k[0]);d.appendChild(h);
    const body=document.createElement('div');rich(body,it.x||'');d.appendChild(body);
    if(it.hint){const t=document.createElement('details');const q=document.createElement('summary');q.textContent='Pista';t.appendChild(q);rich(t.appendChild(document.createElement('div')),it.hint);d.appendChild(t)}
    sheet().appendChild(d);reveal(d);
  }
  function list(it){
    const ul=document.createElement(it.ordered?'ol':'ul');ul.className='t-list';sheet().appendChild(ul);
    (it.items||[]).forEach((x,i)=>setTimeout(()=>{const li=document.createElement('li');li.className='it';rich(li,x);ul.appendChild(li);reveal(li)},i*750));
    return (it.items||[]).length*750+300;
  }
  function quiz(it){
    const d=document.createElement('div');d.className='it t-quiz';const q=document.createElement('b');rich(q,'¿Entendiste? '+(it.q||''));d.appendChild(q);
    const res=document.createElement('div');res.className='qres';let done=false;
    (it.options||[]).slice(0,5).forEach((o,i)=>{const b=document.createElement('button');b.type='button';rich(b,o);
      b.onclick=()=>{if(done)return;done=true;const ok=i===+it.answer;b.classList.add(ok?'good':'bad');
        if(!ok)d.querySelectorAll('button')[+it.answer]?.classList.add('good');
        res.textContent=(ok?'¡Correcto! ':'Casi. ')+(it.why||'');d.appendChild(res);if(Board.onQuiz)Board.onQuiz(ok)};d.appendChild(b)});
    sheet().appendChild(d);reveal(d);
  }
  function erase(n){
    const kids=[...sheet().children].slice(-Math.max(1,Math.min(+n||1,6)));
    kids.forEach(k=>{k.style.transition='opacity .7s, transform .7s';k.style.opacity=0;k.style.transform='scale(.96)'});setTimeout(()=>kids.forEach(k=>k.remove()),750);
  }
  let stamped=false;
  return{
    draw(it){if(!it)return 900;const x=it.x==null?'':String(it.x);log.push(x||(it.lines||[]).join(' ')||it.caption||it.label||'');
      if(it.t==='draw')return drawing(it);
      if(it.t==='box'){boxEl(it);return 1100}
      if(it.t==='list')return list(it);
      if(it.t==='quiz'){quiz(it);return 1200}
      if(it.t==='erase'){erase(it.n);return 800}
      if(it.t==='viz3d'){if(!window.Viz3D){add('t-note','(El visor 3D no está disponible: revisa tu conexión)');return 800}const v=Viz3D.create(it);sheet().appendChild(v);reveal(v);return 1800}
      if(it.t==='graph'){graph(it);return 1400}
      if(it.t==='steps')return steps(it);
      if(it.t==='table'){table(it);return 1000}
      if(it.t==='formula'){const d=add('t-formula','');tex(d,x);return 1100}
      {const d=add(it.t==='title'?'t-title':it.t==='note'?'t-note':'t-text','');rich(d,x)}return 900},
    question(t){add('t-q','Tú: '+t)},photo(urls){const d=document.createElement('div');d.className='it t-photo';urls.forEach(u=>{const i=new Image();i.src=u;i.alt='Foto del alumno';d.appendChild(i)});sheet().appendChild(d);reveal(d)},note(t){add('t-note',t)},
    clear(){sheet().innerHTML='';log.length=0;stamped=false},stamp(){if(stamped)return;stamped=true;add('t-date',new Date().toLocaleDateString('es',{weekday:'long',day:'numeric',month:'long'}))},onQuiz:null,summary(){return log.join(' | ').slice(-1500)}
  };
})();
