/* Director de la clase: sincroniza la pizarra con lo que Lumi dice y marca con un brillito lo que está explicando.

   Cómo funciona
   1. Lo que dice Lumi en cada paso se parte en frases (las mismas que usa la voz).
   2. Cada elemento de la pizarra se reparte entre las frases, EN ORDEN: aparece (se escribe) cuando Lumi empieza a decir su frase.
      Si un elemento se escribe por partes (pasos, listas, líneas de una resolución, trazos de un dibujo…), sus partes se
      reparten a lo largo de lo que Lumi tarda en explicarlo, en vez de ir a su propio ritmo.
   3. Un "cabezal" avanza con la voz real: inicio de cada frase (utterance.onstart), palabras (onboundary) y, si el navegador
      no avisa, una estimación que se calibra sola con lo que tarda de verdad cada frase.
   4. Un brillito (#spot) rodea lo que se acaba de escribir: así se sabe de qué está hablando justo ahora.

   No hace falta tocar los elementos de la pizarra (board.js, teach*.js): el Director dibuja cada uno en su momento y
   "retiene" sus temporizadores internos (setTimeout / requestAnimationFrame) mientras se construye, para reprogramarlos al ritmo de la voz. */
const Director=(()=>{
  const $=id=>document.getElementById(id),sheet=()=>$('sheet'),box=()=>$('board');
  const ST=window.setTimeout.bind(window),RAF=window.requestAnimationFrame.bind(window);
  const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
  let gen=0,mpc=0;                       // gen: invalida todo lo anterior al cancelar · mpc: ms por letra (se calibra con la voz real)
  const runs=new Set();
  let spotEl=null,spotTargets=[],spotTimer=0,hideTimer=0,mo=null;

  /* ───────── Brillito ───────── */
  function ensureSpot(){
    if(spotEl&&spotEl.isConnected)return spotEl;
    const b=box();if(!b)return null;
    const d=document.createElement('div');d.id='spot';d.setAttribute('aria-hidden','true');
    d.innerHTML='<i class="sh"></i><i class="sp a">✦</i><i class="sp b">✧</i><i class="sp c">✦</i>';
    b.appendChild(d);spotEl=d;return d;
  }
  function union(els){
    let L=1e9,T=1e9,R=-1e9,B=-1e9,n=0;
    for(const e of els){
      if(!e||!e.isConnected)continue;
      const r=e.getBoundingClientRect();if(r.width<2||r.height<2)continue;
      L=Math.min(L,r.left);T=Math.min(T,r.top);R=Math.max(R,r.right);B=Math.max(B,r.bottom);n++;
    }
    return n?{l:L,t:T,r:R,b:B}:null;
  }
  function place(){
    const d=spotEl;if(!d||!spotTargets.length)return false;
    const u=union(spotTargets);if(!u){d.classList.remove('on');return false}
    const b=box(),br=b.getBoundingClientRect(),pad=7;
    const left=u.l-br.left-b.clientLeft+b.scrollLeft-pad,top=u.t-br.top-b.clientTop+b.scrollTop-pad;
    const w=Math.min(u.r-u.l+pad*2,b.scrollWidth-Math.max(0,left)-2);
    d.style.left=left+'px';d.style.top=top+'px';d.style.width=Math.max(20,w)+'px';d.style.height=(u.b-u.t+pad*2)+'px';
    return true;
  }
  let viewAt=0;
  function keepInView(){
    const now=performance.now();if(now-viewAt<400)return;viewAt=now;
    const u=union(spotTargets);if(!u)return;
    const b=box(),br=b.getBoundingClientRect(),top=u.t-br.top,bot=u.b-br.top,h=b.clientHeight;
    if(top<8||bot>h-8){
      const want=b.scrollTop+top-Math.max(14,(h-(u.b-u.t))*.3);
      b.scrollTo({top:Math.max(0,want),behavior:'smooth'});
    }
  }
  function setSpot(els){
    const d=ensureSpot();if(!d)return;
    const t=els.filter(Boolean);if(!t.length||!union(t))return;   // nada visible todavía: se queda donde estaba
    clearTimeout(hideTimer);spotTargets=t;
    if(!d.classList.contains('on')){d.classList.add('snap');place();void d.offsetWidth;d.classList.remove('snap');d.classList.add('on')}
    else place();
    keepInView();ST(()=>{if(spotTargets===t)keepInView()},700);
    if(!spotTimer)spotTimer=setInterval(()=>{if(spotEl&&spotEl.isConnected&&spotTargets.length)place()},350);
  }
  function hide(ms){
    clearTimeout(hideTimer);
    hideTimer=ST(()=>{spotTargets=[];if(spotEl)spotEl.classList.remove('on');clearInterval(spotTimer);spotTimer=0},ms||0);
  }

  /* ───────── Retener los temporizadores de un elemento mientras se dibuja ───────── */
  function capture(fn){
    const ev=[],st=window.setTimeout,raf=window.requestAnimationFrame;
    window.setTimeout=(f,d,...a)=>{if(typeof f!=='function')return st.call(window,f,d,...a);ev.push({k:'t',f,d:Math.max(0,+d||0),a});return -ev.length};
    window.requestAnimationFrame=f=>{ev.push({k:'r',f,d:0});return -ev.length};
    try{fn()}catch(e){console.warn('Director: no pude dibujar',e)}
    finally{window.setTimeout=st;window.requestAnimationFrame=raf}
    return ev;
  }
  function watch(){
    const s=sheet();if(mo&&mo._el===s)return mo;
    if(mo)mo.disconnect();mo=new MutationObserver(()=>{});mo._el=s;mo.observe(s,{childList:true,subtree:true,attributes:true,attributeFilter:['style']});return mo;
  }
  /* Lo que cambió desde la última vez: elementos nuevos (added) y trazos de un dibujo que acaban de aparecer (styled). */
  const taken=()=>{
    const added=[],styled=[];
    for(const r of watch().takeRecords()){
      if(r.type==='childList')r.addedNodes.forEach(n=>{if(n.nodeType===1)added.push(n)});
      else if(r.target instanceof SVGElement&&r.target.localName!=='svg'&&!styled.includes(r.target))styled.push(r.target);
    }
    return{added,styled};
  };

  /* Cuántas "partes" tiene un elemento (para darle más frases a los que se escriben por partes). */
  function weight(it){
    const n=a=>Array.isArray(a)?a.length:0;
    if(it.t==='draw')return 2+Math.min(4,Math.floor(String(it.svg||'').length/900));
    if(it.t==='scene')return 2+Math.min(4,Math.floor(n(it.shapes)/7));
    return 1+Math.min(6,Math.max(n(it.lines),n(it.items),n(it.events),n(it.steps),n(it.nodes),n(it.pairs),n(it.parts),n(it.rows)>3?2:0));
  }

  /* ───────── Una pasada de explicación (un paso de la clase) ───────── */
  function begin(o){
    const my=gen,text=String(o.text||''),len=Math.max(1,text.length),useSpot=o.spot!==false;
    if(!mpc)mpc=66/Math.max(.5,o.rate||1);
    const chunks=Voice._chunks(text);chunks.forEach(c=>c.end=c.start+c.text.length);
    const cleanText=String(o.clean||''),cchunks=cleanText?Voice._chunks(cleanText):[];
    /* "Borrar" no consume una frase: actúa justo antes del elemento siguiente (o al final si no hay más). */
    const items=[],pres=[],tail=[];let hold=[];
    (o.board||[]).filter(Boolean).forEach(it=>{if(it.t==='erase')hold.push(it);else{items.push(it);pres.push(hold);hold=[]}});
    hold.forEach(e=>tail.push(e));
    const M=chunks.length,N=items.length;
    const R={};let head=0,cur=null,t0=0,ended=false,gate=true,settling=false,tk=null,done;
    const finished=new Promise(r=>done=r),pending=[];

    /* Subtítulo: la frase que se está diciendo ahora (con los símbolos de la pizarra, no con la lectura hablada). */
    /* La voz parte el texto por su cuenta: sus frases son otros objetos, así que se emparejan por posición. */
    const mine=c=>{const k=chunks.findIndex(x=>x.start===c.start);return k>=0?k:chunks.findIndex(x=>c.start>=x.start&&c.start<x.end)};
    function subFor(c){
      if(!cchunks.length)return cleanText||text;
      if(cchunks.length===M){const k=mine(c);return(cchunks[k>=0?k:0]||cchunks[0]).text}
      const pos=c.start/len*cleanText.length;let b=cchunks[0];for(const k of cchunks)if(k.start<=pos)b=k;return b.text;
    }

    /* Reparto: a cada elemento, un tramo de texto (desde dónde empieza hasta dónde termina su explicación). */
    const plan=[];
    if(!M)items.forEach((it,i)=>plan.push({it,pre:pres[i],pos:0,end:len}));
    else if(N<=M){
      const w=items.map(weight),al=items.map(()=>1);
      for(let x=M-N;x>0;x--){let bi=0,bv=-1;w.forEach((v,i)=>{const q=v/(al[i]+1);if(q>bv){bv=q;bi=i}});al[bi]++}   // las frases que sobran van a los elementos con más partes
      let k=0;items.forEach((it,i)=>{plan.push({it,pre:pres[i],pos:chunks[k].start,end:chunks[k+al[i]-1].end});k+=al[i]});
    }else{                                                                                  // más elementos que frases: comparten frase
      const g=chunks.map(()=>[]);items.forEach((it,i)=>g[Math.min(M-1,Math.floor(i*M/N))].push(it));
      let q=0;g.forEach((a,gi)=>{const c=chunks[gi];a.forEach((it,j)=>plan.push({it,pre:pres[q++],pos:c.start+j/a.length*(c.end-c.start),end:c.start+(j+1)/a.length*(c.end-c.start)}))});
    }
    const add=(pos,run)=>{let i=pending.length;while(i&&pending[i-1].pos>pos)i--;pending.splice(i,0,{pos,run})};   // ordenado por posición, estable

    /* Dibuja un elemento justo cuando Lumi llega a su frase y programa sus partes a lo largo de su explicación. */
    function drawItem(p){
      if(my!==gen)return;
      const it=p.it,isDraw=it.t==='draw'||it.t==='scene';
      if((p.pre||[]).length){p.pre.forEach(e=>{try{Board.draw(e)}catch(x){console.warn(x)}});if(useSpot)hide(250)}
      taken();
      const ev=capture(()=>Board.draw(it)),ts=ev.filter(e=>e.k==='t');
      ev.forEach(e=>{if(e.k==='r')RAF(e.f)});                                        // la aparición del elemento (se "escribe" ya)
      const fresh=taken().added;if(useSpot&&!isDraw)setSpot(fresh);
      /* Las partes (líneas, ítems, trazos…) se agrupan por el momento en que el elemento las habría escrito y se reparten entre las frases. */
      const ds=[...new Set(ts.map(e=>e.d))].sort((a,b)=>a-b),G=ds.length;if(!G)return;
      const cs=chunks.filter(c=>c.start>=p.pos-1&&c.end<=p.end+1),cnt=cs.length,span=Math.max(1,p.end-p.pos);
      const posOf=g=>{
        if(G===1)return p.pos;
        if(cnt&&G<=cnt){                                                              // una frase por parte; si hay frase(s) de introducción, las partes van al final
          const k=cnt-G<G?cnt-G+g:Math.floor(g*cnt/G);return cs[Math.min(cnt-1,k)].start;
        }
        let pos=p.pos+g/G*span;const ch=cs.find(c=>pos>=c.start&&pos<c.end);        // más partes que frases: reparto continuo
        if(ch&&pos-ch.start<(ch.end-ch.start)*.25)pos=ch.start;return pos;
      };
      const recent=[];                                                                 // trazos de los últimos instantes (para el brillito de un dibujo)
      ts.forEach(e=>{
        add(posOf(ds.indexOf(e.d)),()=>{
          taken();try{e.f(...e.a)}catch(x){console.warn(x)}const t=taken();if(!useSpot)return;
          if(isDraw){const now=performance.now();t.styled.forEach(el=>recent.push({el,t:now}));while(recent.length&&now-recent[0].t>1300)recent.shift();setSpot(recent.map(r=>r.el))}
          else setSpot(t.added);
        });
      });
    }
    plan.forEach(p=>add(p.pos,()=>drawItem(p)));
    if(tail.length)add(len,()=>{tail.forEach(e=>{try{Board.draw(e)}catch(x){console.warn(x)}});if(useSpot)hide(250)});

    /* Cabezal: avanza con la voz. */
    const tick=()=>{
      if(my!==gen){R.kill();return}
      const now=performance.now();
      if(!ended&&!gate&&cur)head=Math.max(head,Math.min(cur.end-.5,cur.start+(now-t0)/mpc));
      if(ended)head=1e9;
      let nextAt=0;
      while(pending.length&&(!gate||ended)&&pending[0].pos<=head+.01){
        if(ended&&now<nextAt)break;
        pending.shift().run();
        if(ended)nextAt=now+clamp(3500/Math.max(1,pending.length+1),30,420);      // terminó de hablar: lo que falte se escribe rápido pero sin amontonarse
        if(ended)break;
      }
      if(ended&&!pending.length&&!settling){settling=true;ST(()=>{if(my===gen){stop();done()}},500)}
    };
    const stop=()=>{clearInterval(tk);tk=null;runs.delete(R)};
    R.kill=()=>{stop();done()};
    runs.add(R);tk=setInterval(tick,40);
    ST(()=>{gate=false},1400);                                                      // por si la voz no avisa (voz apagada o con fallo)
    if(chunks[0]&&o.sub)o.sub(subFor(chunks[0]));
    tick();

    return{
      finished,
      hooks:{
        onChunkStart(c){if(my!==gen)return;const k=mine(c);c=chunks[k]||{...c,end:c.start+c.text.length};gate=false;cur=c;t0=performance.now();head=Math.max(head,c.start);if(o.sub)o.sub(subFor(c));tick()},
        onChunkEnd(c,ms){if(my!==gen)return;mpc=clamp(mpc*.55+(ms/Math.max(8,c.text.length))*.45,30,170);head=Math.max(head,c.start+c.text.length)},
        onBoundary(i){if(my!==gen||!cur||i<cur.start||i>=cur.end)return;head=Math.max(head,i)}
      },
      speechEnded(){if(my!==gen)return;ended=true;gate=false;tick()}
    };
  }

  return{
    begin,
    hide,
    /* Detiene todo lo programado (al parar la clase o empezar otra). */
    cancel(){gen++;runs.forEach(r=>r.kill());runs.clear();hide(0)}
  };
})();
