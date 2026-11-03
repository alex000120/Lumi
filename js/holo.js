/* Lumi · Hologramas 3D en la pizarra.
   - Board.draw({t:'holo',...}): proyecta un holograma que el alumno puede girar, separar por partes ("explosionar"),
     cortar, ocultar por capas y tocar para ver la explicación de cada parte.
   - Pestaña de herramientas «Hologramas»: biblioteca de figuras prediseñadas (se generan en el navegador: 0 llamadas a Gemini).
   Todo el texto de la IA se inserta como texto (nunca HTML). */
import * as THREE from 'three';

const NUM=(v,d)=>Number.isFinite(+v)?+v:d,clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const V=(a,d=[0,0,0])=>Array.isArray(a)?[NUM(a[0],d[0]),NUM(a[1],d[1]),NUM(a[2],d[2])]:d.slice();
const colr=c=>{try{return new THREE.Color(String(c||'#5ff3ff'))}catch(e){return new THREE.Color('#5ff3ff')}};
const el=(tag,cls,par,txt)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;if(par)par.appendChild(e);return e};
const askLumi=t=>{const q=document.getElementById('q');if(!q)return;q.value=t;const d=document.getElementById('toolsDlg');if(d&&d.open)d.close();q.form.requestSubmit?q.form.requestSubmit():q.form.dispatchEvent(new Event('submit',{cancelable:true}))};

/* ---------- progreso del alumno (solo en este navegador) ---------- */
const progGet=()=>{try{const o=typeof Store!=='undefined'?Store.get('holoProg',null):null;return{seen:{},best:{},classes:0,qOk:0,qN:0,...(o||{})}}catch(e){return{seen:{},best:{},classes:0,qOk:0,qN:0}}};
const progSet=o=>{try{typeof Store!=='undefined'&&Store.set('holoProg',o)}catch(e){}};
const keyOf=it=>String((it&&(it.id||it.title))||'holo').slice(0,40);

/* ---------- geometrías ---------- */
function geo(o){
  const r=clamp(NUM(o.r,.5),.01,20),h=clamp(NUM(o.h,1),.01,40),sd=clamp(Math.round(NUM(o.sides,32)),3,64);
  switch(o.shape){
    case'sphere':return new THREE.SphereGeometry(r,28,18);
    case'hemisphere':return new THREE.SphereGeometry(r,28,14,0,Math.PI*2,0,Math.PI/2);
    case'box':{const s=V(o.size,[1,1,1]).map(v=>clamp(v,.01,40));return new THREE.BoxGeometry(...s)}
    case'cylinder':return new THREE.CylinderGeometry(r,NUM(o.r2,r),h,sd);
    case'cone':return new THREE.ConeGeometry(r,h,sd);
    case'pyramid':{const g=new THREE.ConeGeometry(r,h,clamp(Math.round(NUM(o.sides,4)),3,12));if(NUM(o.sides,4)===4)g.rotateY(Math.PI/4);return g}
    case'torus':return new THREE.TorusGeometry(r,clamp(NUM(o.tube,.2),.01,10),16,48);
    case'ring':{const g=new THREE.RingGeometry(clamp(NUM(o.r1,r*.8),0,20),clamp(NUM(o.r2,r),.02,20),64);g.rotateX(-Math.PI/2);return g}
    case'plane':{const s=V(o.size,[2,0,2]);const g=new THREE.PlaneGeometry(clamp(s[0],.01,40),clamp(s[2]||s[1]||2,.01,40));g.rotateX(-Math.PI/2);return g}
    case'capsule':return new THREE.CapsuleGeometry(r,h,6,16);
    case'tetra':return new THREE.TetrahedronGeometry(r);
    case'octa':return new THREE.OctahedronGeometry(r);
    case'dodeca':return new THREE.DodecahedronGeometry(r);
    case'icosa':return new THREE.IcosahedronGeometry(r);
    case'lathe':{const p=(Array.isArray(o.profile)?o.profile:[]).slice(0,40).map(q=>new THREE.Vector2(Math.abs(NUM(q&&q[0],0)),NUM(q&&q[1],0)));return p.length>1?new THREE.LatheGeometry(p,40):null}
    case'helix':{const hh=clamp(NUM(o.h,4),.2,40),tn=clamp(NUM(o.turns,3),.25,12),ph=NUM(o.phase,0),pts=[];const n=Math.round(tn*20);
      for(let i=0;i<=n;i++){const t=i/n*tn*Math.PI*2;pts.push(new THREE.Vector3(r*Math.cos(t+ph),hh*(i/n)-hh/2,r*Math.sin(t+ph)))}
      return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),n*2,clamp(NUM(o.tube,.06),.01,2),6)}
    case'curve':{const p=(Array.isArray(o.points)?o.points:[]).slice(0,60).map(q=>new THREE.Vector3(...V(q)));if(p.length<2)return null;
      return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(p),p.length*8,clamp(NUM(o.tube,.05),.01,2),6)}
  }
  return null;
}
function label(text,size){
  const c=document.createElement('canvas');c.width=320;c.height=72;const g=c.getContext('2d');
  g.font='600 36px sans-serif';g.textAlign='center';g.textBaseline='middle';g.lineWidth=8;g.strokeStyle='rgba(0,20,40,.95)';
  const t=String(text).slice(0,26);g.strokeText(t,160,36);g.fillStyle='#d9ffff';g.fillText(t,160,36);
  const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),depthTest:false,transparent:true}));
  s.scale.set(size*4.4,size,1);s.renderOrder=9;return s;
}

/* ---------- visor ---------- */
const live=[];
function create(it){
  it=it||{};
  const wrap=el('div','holo it'),stage=el('div','holo-stage',wrap),cv=el('canvas','',stage);
  el('div','holo-scan',stage);
  if(it.title)el('div','holo-title',stage,String(it.title).slice(0,60));
  el('div','holo-hint',stage,'Arrastra para girar · pellizca para acercar · toca una parte');
  const ui=el('div','holo-ui',wrap),chips=el('div','holo-chips',ui),bar=el('div','holo-bar',ui),info=el('div','holo-info',ui,'👆 Toca una parte del holograma para ver qué es.');
  if(it.caption)el('div','t-note',wrap,String(it.caption).slice(0,300));

  const r=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true,preserveDrawingBuffer:true});
  const low=(typeof navigator!=='undefined'&&(navigator.hardwareConcurrency||4)<=4)||(typeof innerWidth!=='undefined'&&innerWidth<500);
  r.setPixelRatio(Math.min(devicePixelRatio||1,low?1.5:2));r.localClippingEnabled=true;
  const scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(40,4/3,.1,200);
  scene.add(new THREE.HemisphereLight(0xffffff,0x335577,1.3),new THREE.AmbientLight(0xffffff,.5));
  const dl=new THREE.DirectionalLight(0xffffff,1.8);dl.position.set(4,7,5);scene.add(dl);
  const clip=new THREE.Plane(new THREE.Vector3(0,-1,0),1e4),clipArr=[clip];
  const hg=new THREE.Group();scene.add(hg);
  const tint=colr(it.color||'#5ff3ff');

  /* partes */
  const parts=[];const list=(Array.isArray(it.parts)?it.parts:Array.isArray(it.objects)?it.objects:[]).slice(0,60);
  list.forEach((o,idx)=>{
    if(!o||typeof o!=='object')return;
    const pg=new THREE.Group(),base=V(o.pos),c=colr(o.color||tint),op=clamp(NUM(o.opacity,1),.05,1);
    const P={o,pg,base,c,op,name:String(o.name||o.label||'').slice(0,40),info:String(o.info||'').slice(0,260),group:o.group?String(o.group).slice(0,24):'',mesh:null,edges:null,line:null,top:.5,spin:NUM(o.spin,0),pulse:!!o.pulse,move:o.move&&typeof o.move==='object'?{d:V(o.move.to).map((v,i)=>v-base[i]),sp:NUM(o.move.speed,.5)}:null,bob:o.bob&&typeof o.bob==='object'?{amp:clamp(NUM(o.bob.amp,.3),-5,5),sp:NUM(o.bob.speed,2),ph:NUM(o.bob.phase,0)}:null,orbit:o.orbit&&typeof o.orbit==='object'?{r:clamp(NUM(o.orbit.r,2),.1,40),sp:NUM(o.orbit.speed,1),ph:NUM(o.orbit.phase,idx*1.3),tilt:NUM(o.orbit.tilt,0)}:null};
    if(o.shape==='line'||o.shape==='arrow'){
      const a=new THREE.Vector3(...V(o.from)),b=new THREE.Vector3(...V(o.to)),d=b.clone().sub(a);
      if(d.length()>1e-6){if(o.shape==='arrow'){pg.add(new THREE.ArrowHelper(d.clone().normalize(),a,d.length(),c.getHex(),.28,.15))}
        else pg.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([a,b]),new THREE.LineBasicMaterial({color:c,transparent:true,opacity:.9,blending:THREE.AdditiveBlending})))}
      P.base=[0,0,0];P.top=Math.max(a.y,b.y);
    }else if(o.shape==='text'){P.text=String(o.text||o.name||'').slice(0,26)}
    else{
      const g=geo(o);if(!g)return;
      P.hMat=new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:.2*op+.04,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,clippingPlanes:clipArr});
      P.sMat=new THREE.MeshStandardMaterial({color:c,roughness:.45,metalness:.08,transparent:op<1,opacity:op,side:THREE.DoubleSide,clippingPlanes:clipArr});
      P.mesh=new THREE.Mesh(g,P.hMat);P.mesh.userData.part=P;
      P.eMat=new THREE.LineBasicMaterial({color:c.clone().lerp(new THREE.Color('#ffffff'),.35),transparent:true,opacity:.95,blending:THREE.AdditiveBlending,clippingPlanes:clipArr});
      P.edges=new THREE.LineSegments(new THREE.EdgesGeometry(g,28),P.eMat);
      pg.add(P.mesh,P.edges);
      if(o.rot)pg.rotation.set(...V(o.rot));
      g.computeBoundingBox();P.top=g.boundingBox.max.y;
    }
    pg.position.set(...P.base);hg.add(pg);parts.push(P);
  });
  if(!parts.length){const g=new THREE.IcosahedronGeometry(1,1);const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({color:tint,transparent:true,opacity:.2,blending:THREE.AdditiveBlending}));hg.add(m,new THREE.LineSegments(new THREE.EdgesGeometry(g),new THREE.LineBasicMaterial({color:tint})))}

  /* encuadre: ocupa ~4 unidades de alto/ancho y se apoya sobre la base */
  const box=new THREE.Box3();
  parts.forEach(P=>{const pb=new THREE.Box3().setFromObject(P.pg);if(!pb.isEmpty())box.union(pb);
    if(P.orbit){const R=P.orbit.r;box.expandByPoint(new THREE.Vector3(R,-R*.3,R));box.expandByPoint(new THREE.Vector3(-R,R*.3,-R))}});
  if(box.isEmpty())box.set(new THREE.Vector3(-1,-1,-1),new THREE.Vector3(1,1,1));
  const sz=box.getSize(new THREE.Vector3()),ctr=box.getCenter(new THREE.Vector3()),mx=Math.max(sz.x,sz.y,sz.z,.1);
  const S=clamp(4/mx,.02,20);hg.scale.setScalar(S);
  const gap=.45,off=new THREE.Vector3(-ctr.x*S,-box.min.y*S+gap,-ctr.z*S);hg.position.copy(off);
  const Hh=sz.y*S,Rb=Math.max(sz.x,sz.z)*S*.5+.8;
  clip.constant=1e4;
  /* etiquetas (hijas de cada parte, tamaño constante en pantalla-mundo) */
  parts.forEach(P=>{const t=P.text||P.name;if(!t)return;const s=label(t,.42/S);s.position.set(0,P.top+.55/S,0);P.pg.add(s);P.label=s});

  /* base proyectora */
  const proj=new THREE.Group();scene.add(proj);const hc=tint;
  const ringM=(a,b,o)=>{const g=new THREE.RingGeometry(a,b,64);g.rotateX(-Math.PI/2);return new THREE.Mesh(g,new THREE.MeshBasicMaterial({color:hc,transparent:true,opacity:o,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,depthWrite:false}))};
  proj.add(ringM(Rb*.97,Rb,.9),ringM(Rb*.66,Rb*.675,.55),ringM(Rb*.33,Rb*.345,.45),ringM(0,Rb*.97,.07));
  const beamG=new THREE.CylinderGeometry(Rb*.98,Rb*.5,Hh+gap+.8,48,1,true);
  const beam=new THREE.Mesh(beamG,new THREE.MeshBasicMaterial({color:hc,transparent:true,opacity:.05,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,depthWrite:false}));beam.position.y=(Hh+gap+.8)/2;proj.add(beam);
  const pad=new THREE.Mesh(new THREE.CylinderGeometry(Rb*1.12,Rb*1.2,.12,48),new THREE.MeshStandardMaterial({color:0x0b1d2b,metalness:.6,roughness:.35}));pad.position.y=-.08;proj.add(pad);
  /* partículas */
  const NP=70,pp=new Float32Array(NP*3),pv=[];
  for(let i=0;i<NP;i++){const a=Math.random()*6.283,rr=Math.sqrt(Math.random())*Rb;pp[i*3]=Math.cos(a)*rr;pp[i*3+1]=Math.random()*(Hh+1);pp[i*3+2]=Math.sin(a)*rr;pv.push(.15+Math.random()*.35)}
  const pgeo=new THREE.BufferGeometry();pgeo.setAttribute('position',new THREE.BufferAttribute(pp,3));
  const pts=new THREE.Points(pgeo,new THREE.PointsMaterial({color:hc,size:.07,transparent:true,opacity:.8,blending:THREE.AdditiveBlending,depthWrite:false}));proj.add(pts);

  /* cámara */
  const cy=gap+Hh/2,radMin=Rb*1.1,radMax=Rb*6;
  let th=.7,ph=1.2,rad=clamp(Math.max(Hh,Rb*2)*1.9,radMin,radMax),auto=it.rotate!==false;

  /* estado de enseñanza */
  const ft=new THREE.Vector3(0,cy,0),goal=new THREE.Vector3(0,cy,0);let tour=0;
  const st={quizN:0,quizOk:0,streak:0,paid:0,solid:false,labels:true,explode:0,cut:100,sel:null,hidden:new Set(),t0:performance.now()};
  const groups=[...new Set(parts.map(p=>p.group).filter(Boolean))].slice(0,8);
  function refresh(){
    parts.forEach(P=>{
      const vis=!P.group||!st.hidden.has(P.group);P.pg.visible=vis;
      if(P.mesh){P.mesh.material=st.solid?P.sMat:P.hMat;const sel=st.sel===P,dim=st.sel&&!sel;
        P.hMat.opacity=(sel?.5:(dim?.07:.2))*P.op+.04;P.sMat.opacity=dim?Math.min(P.op,.3):P.op;P.sMat.transparent=P.op<1||!!dim;
        P.eMat.color.copy(sel?new THREE.Color('#ffffff'):P.c.clone().lerp(new THREE.Color('#ffffff'),.35));P.eMat.opacity=dim?.3:.95;
        P.sMat.emissive.set(sel?P.c:0x000000);P.sMat.emissiveIntensity=sel?.6:0}
      if(P.label)P.label.visible=st.labels;
    });
    clip.constant=st.cut>=98?1e4:gap+(Hh+.2)*(st.cut/100);
  }
  function select(P,silent){
    st.sel=(P&&st.sel!==P)?P:null;refresh();info.textContent='';
    if(!silent&&api.onSelect)api.onSelect(st.sel);
    if(!st.sel){info.textContent='👆 Toca una parte del holograma para ver qué es.';return}
    el('b','',info,st.sel.name||'Parte');
    if(st.sel.info)el('span','',info,' — '+st.sel.info);
    const b=el('button','askL holo-ask',info,'💬 Pregúntale a Lumi sobre esto');b.type='button';
    b.onclick=()=>askLumi(`Explícame con más detalle esta parte del holograma${it.title?' «'+it.title+'»':''}: ${st.sel.name||'la parte seleccionada'}. ¿Qué es, qué función tiene y cómo se relaciona con las demás partes?`);
  }

  const uniq=()=>{const seen=new Set();return parts.filter(p=>p.name&&p.info&&p.pg.visible&&!seen.has(p.name)&&seen.add(p.name))};
  const api={onView:null,onSelect:null,get:()=>({th,ph}),set:v=>{th=v.th;ph=v.ph;auto=false},
    names:()=>[...new Set(parts.map(p=>p.name).filter(Boolean))],
    selByName:n=>{const P=n&&parts.find(p=>p.name===n&&p.pg.visible);st.sel=null;if(P){select(P,true)}else{refresh();info.textContent=n?'«'+n+'» no aparece en este modelo.':'👆 Toca una parte del holograma para ver qué es.'}}};
  wrap.__api=api;
  const C=!!it.compact;

  /* controles */
  groups.forEach(g=>{const b=el('button','holo-chip on',chips,g);b.type='button';b.onclick=()=>{const off2=!st.hidden.has(g);off2?st.hidden.add(g):st.hidden.delete(g);b.classList.toggle('on',!off2);refresh()}});
  const btn=(txt,fn,on)=>{const b=el('button','holo-btn'+(on?' on':''),bar,txt);b.type='button';b.onclick=()=>{fn(b)};return b};
  btn('🔄 Girar',b=>{auto=!auto;b.classList.toggle('on',auto)},auto);
  btn('🧊 Sólido',b=>{st.solid=!st.solid;b.classList.toggle('on',st.solid);b.textContent=st.solid?'✨ Holograma':'🧊 Sólido';refresh()});
  if(parts.some(p=>p.name))btn('🏷️ Etiquetas',b=>{st.labels=!st.labels;b.classList.toggle('on',st.labels);refresh()},true);
  const sl=(txt,key,max,fn)=>{const l=el('label','holo-sl',bar);el('span','',l,txt);const i=el('input','',l);i.type='range';i.min=0;i.max=max;i.value=key==='cut'?max:0;i.oninput=()=>{fn(+i.value)}};
  if(parts.length>1)sl('💥 Separar','explode',100,v=>{st.explode=v/100});
  sl('✂️ Corte','cut',100,v=>{st.cut=v;refresh()});
  if(!C&&it.quiz!==false&&parts.some(p=>p.name))btn('🎯 ¿Dónde está?',b=>{
    const named=parts.filter(p=>p.name&&p.pg.visible);if(!named.length)return;
    const t=named[Math.floor(Math.random()*named.length)];st.quizT=t;select(null);info.textContent='';el('b','',info,'🎯 Toca: '+t.name);
  });

  const tourBtn=!C&&uniq().length>1?btn('🎓 Recorrido',()=>{tour?stopTour(true):runTour()}):null;
  const classBtn=!C&&uniq().length>2?btn('🏫 Modo clase',()=>{tour?stopTour(true):runClass()}):null;
  if(!C)btn('📸 Guardar',()=>{try{r.render(scene,cam);const a=document.createElement('a');a.href=cv.toDataURL('image/png');a.download='holograma-'+(String(it.title||'lumi').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,30)||'lumi')+'.png';a.click()}catch(e){}});
  const settings=()=>{try{return typeof Store!=='undefined'?Store.get('settings',{}):{}}catch(e){return{}}};
  const hush=()=>{try{if(typeof Voice!=='undefined')Voice.speak('',{enabled:true})}catch(e){}};
  const sleep=ms=>new Promise(rs=>setTimeout(rs,ms)),say=t=>{const S0=settings();if(S0.voice===false||typeof Voice==='undefined')return Promise.resolve();return Voice.speak(t,{enabled:true,rate:S0.rate||1,pitch:S0.pitch||1.1,mood:'happy',name:S0.voiceName||''}).catch(()=>{})};
  const mark=(b,t)=>{if(b){b.textContent=t;b.classList.add('on')}};
  function stopTour(clear){tour=0;st.quizT=null;if(st.qcb){const f=st.qcb;st.qcb=null;f(false)}
    if(tourBtn){tourBtn.textContent='🎓 Recorrido';tourBtn.classList.remove('on')}if(classBtn){classBtn.textContent='🏫 Modo clase';classBtn.classList.remove('on')}
    hush();if(clear){st.sel=null;refresh();info.textContent='👆 Toca una parte del holograma para ver qué es.'}}
  async function playParts(my){
    const S0=settings();
    for(const P of uniq()){
      if(my!==tour||dead)return false;st.sel=null;select(P);const txt=P.name+'. '+P.info,t0=performance.now(),min=2200+txt.length*38;
      if(S0.voice!==false)await say(txt);
      if(my!==tour)return false;const left=min-(performance.now()-t0);await sleep(S0.voice===false?min:Math.max(700,Math.min(left,2500)));
    }
    return my===tour;
  }
  async function runTour(){const my=++tour;auto=false;st.quizT=null;mark(tourBtn,'⏹ Detener');if(await playParts(my))stopTour(true)}
  async function runClass(){
    const my=++tour;auto=false;st.quizT=null;mark(classBtn,'⏹ Detener');
    info.textContent='';el('b','',info,'🏫 ¡Empieza la clase! Primero te presento las partes…');await say('¡Empezamos la clase! Primero te presento las partes.');
    if(!await playParts(my))return;
    const pool=uniq().sort(()=>Math.random()-.5).slice(0,4);let ok=0;
    for(let i=0;i<pool.length;i++){
      if(my!==tour||dead)return;const T=pool[i];st.sel=null;refresh();st.quizT=T;info.textContent='';
      el('b','',info,`🎯 Pregunta ${i+1} de ${pool.length}: toca «${T.name}»`);say('¿Dónde está '+T.name+'?');
      const res=await new Promise(rs=>{st.qcb=rs});if(my!==tour)return;if(res)ok++;await sleep(1900);
    }
    if(my!==tour)return;stopTour(false);st.sel=null;refresh();info.textContent='';
    const P0=progGet(),k0=keyOf(it),prev=P0.best[k0]||0;P0.best[k0]=Math.max(prev,ok/pool.length);P0.classes++;progSet(P0);
    let bonus='';if(ok===pool.length&&prev<1){if(typeof Shop!=='undefined'&&Shop.earn){try{Shop.earn(5);bonus=' +5 🪙 de bonus (¡primera vez perfecta!)'}catch(_){}}}
    el('b','',info,`🏆 Clase completada: ${ok} de ${pool.length} aciertos.${bonus}`);
    try{typeof Avatar!=='undefined'&&Avatar.react&&Avatar.react(ok===pool.length?'applause':ok>=pool.length/2?'proud':'shy')}catch(_){}
    say(ok===pool.length?'¡Perfecto! Lo acertaste todo.':`Acertaste ${ok} de ${pool.length}. ¡Repítelo y verás cómo mejoras!`);
  }

  /* interacción: arrastre, pellizco y toque */
  const ptr=new Map();let moved=0,pinch=0;const ray=new THREE.Raycaster(),mv=new THREE.Vector2();
  cv.addEventListener('pointerdown',e=>{ptr.set(e.pointerId,[e.clientX,e.clientY]);moved=0;cv.setPointerCapture(e.pointerId);if(ptr.size===2){const a=[...ptr.values()];pinch=Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1])}});
  cv.addEventListener('pointermove',e=>{const p=ptr.get(e.pointerId);if(!p)return;
    if(ptr.size===2){ptr.set(e.pointerId,[e.clientX,e.clientY]);const a=[...ptr.values()],d=Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1]);if(pinch){rad=clamp(rad*pinch/d,radMin,radMax)}pinch=d;moved=99;return}
    const dx=e.clientX-p[0],dy=e.clientY-p[1];moved+=Math.abs(dx)+Math.abs(dy);if(moved>6)auto=false;
    th-=dx*.01;ph=clamp(ph-dy*.01,.2,Math.PI-.25);ptr.set(e.pointerId,[e.clientX,e.clientY]);api.onView&&api.onView()});
  const up=e=>{const was=ptr.has(e.pointerId);if(tour&&!st.quizT&&moved<=6&&was)stopTour(false);ptr.delete(e.pointerId);pinch=0;if(!was||e.type==='pointercancel'||moved>6)return;
    const rc=cv.getBoundingClientRect();mv.set(((e.clientX-rc.left)/rc.width)*2-1,-((e.clientY-rc.top)/rc.height)*2+1);ray.setFromCamera(mv,cam);
    const hit=ray.intersectObjects(parts.filter(p=>p.mesh&&p.pg.visible).map(p=>p.mesh),false)[0];
    const P=hit&&hit.object.userData.part;
    if(st.quizT){const T=st.quizT,ok=P===T||(P&&P.name===T.name);st.quizT=null;st.sel=T;refresh();info.textContent='';st.quizN++;{const P0=progGet();P0.qN++;if(ok)P0.qOk++;progSet(P0)}
      if(ok){st.quizOk++;st.streak++;let extra='';if(typeof Shop!=='undefined'&&Shop.earn&&st.paid<10){const g=st.streak%3===0?5:2;st.paid+=g;try{Shop.earn(g);extra=' +'+g+' 🪙'}catch(_){}}
        el('b','',info,'✅ ¡Correcto! Es '+T.name+'.'+extra+(st.streak>1?' 🔥 Racha de '+st.streak:''));if(typeof Avatar!=='undefined'&&Avatar.react)try{Avatar.react(st.streak%3===0?'dance':'cheer')}catch(_){}}
      else{st.streak=0;el('b','',info,'❌ Casi. Era '+T.name+' (está resaltada).');if(typeof Avatar!=='undefined'&&Avatar.react)try{Avatar.react('oops')}catch(_){}}
      el('span','',info,'  Aciertos: '+st.quizOk+'/'+st.quizN);if(st.qcb){const f=st.qcb;st.qcb=null;f(ok)}return}
    select(P||null)};
  cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
  cv.addEventListener('wheel',e=>{e.preventDefault();rad=clamp(rad*(1+e.deltaY*.001),radMin,radMax)},{passive:false});

  /* bucle (máx. ~30 fps, se pausa fuera de pantalla) */
  let vis=true,dead=false,last=0;const ease=x=>1-Math.pow(1-x,3);
  new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(wrap);
  const cen=new THREE.Vector3(ctr.x,ctr.y,ctr.z);
  function frame(now){
    if(!vis||document.hidden||now-last<30)return;last=now;
    const t=(now-st.t0)/1000,k=ease(clamp(t/1.3,0,1));
    hg.scale.set(S,S*Math.max(k,.001),S);
    if(auto){th+=.006;api.onView&&api.onView()}
    if(st.sel&&st.sel.pg.visible)st.sel.pg.getWorldPosition(goal);else goal.set(0,cy,0);ft.lerp(goal,.12);
    cam.position.set(ft.x+rad*Math.sin(ph)*Math.sin(th),ft.y+rad*Math.cos(ph),ft.z+rad*Math.sin(ph)*Math.cos(th));cam.lookAt(ft);
    parts.forEach(P=>{
      let x=P.base[0],y=P.base[1],z=P.base[2];
      if(P.orbit){const a=P.orbit.ph+t*P.orbit.sp,R=P.orbit.r,cx=Math.cos(a)*R,cz=Math.sin(a)*R,ct=Math.cos(P.orbit.tilt),sn=Math.sin(P.orbit.tilt);x+=cx;y+=-cz*sn;z+=cz*ct}
      if(P.move){const f=(t*P.move.sp)%1;x+=P.move.d[0]*f;y+=P.move.d[1]*f;z+=P.move.d[2]*f}
      if(P.bob)y+=P.bob.amp*Math.sin(P.bob.ph+t*P.bob.sp);
      if(st.explode){const f=st.explode*.9;x+=(P.base[0]-cen.x)*f;y+=(P.base[1]-cen.y)*f;z+=(P.base[2]-cen.z)*f}
      P.pg.position.set(x,y,z);
      if(P.spin&&P.mesh){P.mesh.rotation.y=t*P.spin;P.edges.rotation.y=t*P.spin}
      if(P.pulse){const s=1+.12*Math.sin(t*3);P.pg.scale.setScalar(s)}
    });
    proj.children.forEach((m,i)=>{if(i<3)m.material.opacity=(i===0?.9:.5)*(.82+.18*Math.sin(t*2+i))});
    const a=pgeo.attributes.position;for(let i=0;i<NP;i++){let y=a.array[i*3+1]+pv[i]*.03;if(y>Hh+gap+.8)y=0;a.array[i*3+1]=y}a.needsUpdate=true;
    const w=cv.clientWidth||300,h=Math.round(w*.75);if(cv.width!==Math.round(w*r.getPixelRatio())){r.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()}
    r.render(scene,cam);
  }
  r.setAnimationLoop(frame);refresh();
  {const P0=progGet();if(!P0.seen[keyOf(it)]){P0.seen[keyOf(it)]=1;progSet(P0)}}
  const rec={r,cv,stop(){if(dead)return;dead=true;tour=0;try{const img=new Image();img.src=cv.toDataURL();img.className='holo-snap';r.setAnimationLoop(null);cv.replaceWith(img);r.dispose();r.forceContextLoss()}catch(e){}}};
  live.push(rec);while(live.length>6)live.shift().stop();
  wrap.__stop=()=>rec.stop();
  return wrap;
}

function createCompare(a,b,caption){
  const mk=x=>Object.assign({},x,{compact:true,quiz:false,rotate:true});
  a=a||{};b=b||{};const wrap=el('div','holo-cmp it'),grid=el('div','holo-cmpgrid',wrap),A=create(mk(a)),B=create(mk(b));A.classList.add('on');B.classList.add('on');grid.append(A,B);
  const pa=A.__api,pb=B.__api,sync=el('label','holo-sync',wrap),cb=el('input','',sync);cb.type='checkbox';cb.checked=true;el('span','',sync,'🔗 Girar los dos a la vez');
  wrap.__stop=()=>{try{A.__stop()}catch(e){}try{B.__stop()}catch(e){}};
  pa.onView=()=>{if(cb.checked)pb.set(pa.get())};pb.onView=()=>{if(cb.checked)pa.set(pb.get())};
  pa.onSelect=P=>pb.selByName(P&&P.name);pb.onSelect=P=>pa.selByName(P&&P.name);
  const na=pa.names(),nb=pb.names(),com=na.filter(n=>nb.includes(n)),oa=na.filter(n=>!nb.includes(n)),ob=nb.filter(n=>!na.includes(n));
  const panel=el('div','holo-diff',wrap);
  const row=(ic,tx,list,cls)=>{if(!list.length)return;const r=el('div','holo-diffrow',panel);el('b','',r,ic+' '+tx+': ');list.forEach(n=>{const c=el('button','holo-chip on '+cls,r,n);c.type='button';c.onclick=()=>{pa.selByName(n);pb.selByName(n)}})};
  row('🤝','En común',com,'');row('🅰️','Solo en «'+String(a.title||'A').slice(0,28)+'»',oa,'');row('🅱️','Solo en «'+String(b.title||'B').slice(0,28)+'»',ob,'');
  if(caption)el('div','t-note',wrap,String(caption).slice(0,300));
  const ab=el('button','askL',wrap,'💬 Pedirle a Lumi que las compare');ab.type='button';
  ab.onclick=()=>askLumi(`Compara «${a.title||'A'}» y «${b.title||'B'}»: semejanzas y diferencias principales, parte por parte, y qué debo recordar.`);
  return wrap;
}

/* ---------- figuras prediseñadas (sin gastar créditos) ---------- */
const P3=Math.PI;
function bond(a,b,c='#cfd8dc',tube=.06){return{shape:'curve',points:[a,b],color:c,tube,group:'Enlaces',name:'Enlace',info:'Enlace químico: une dos átomos compartiendo electrones.'}}
const PRE={
  platonicos:()=>({title:'Los 5 sólidos platónicos',caption:'Todos sus caras son polígonos regulares iguales.',rotate:true,parts:[
    {name:'Tetraedro',info:'4 caras triangulares, 6 aristas, 4 vértices.',shape:'tetra',pos:[-6,0,0],r:1.1,color:'#ff6b6b'},
    {name:'Cubo (hexaedro)',info:'6 caras cuadradas, 12 aristas, 8 vértices.',shape:'box',pos:[-3,0,0],size:[1.5,1.5,1.5],color:'#ffd166'},
    {name:'Octaedro',info:'8 caras triangulares, 12 aristas, 6 vértices.',shape:'octa',pos:[0,0,0],r:1.1,color:'#06d6a0'},
    {name:'Dodecaedro',info:'12 caras pentagonales, 30 aristas, 20 vértices.',shape:'dodeca',pos:[3,0,0],r:1.1,color:'#4dabf7'},
    {name:'Icosaedro',info:'20 caras triangulares, 30 aristas, 12 vértices.',shape:'icosa',pos:[6,0,0],r:1.1,color:'#c77dff'}]}),
  cubo:()=>{const p=[];for(const x of[-1,1])for(const y of[-1,1])for(const z of[-1,1])p.push({name:'Vértice',info:'Punto donde se unen 3 aristas. El cubo tiene 8.',shape:'sphere',pos:[x,y,z],r:.14,color:'#ffd166',group:'Vértices',pulse:true});
    return{title:'El cubo',caption:'Euler: caras − aristas + vértices = 2  →  6 − 12 + 8 = 2.',parts:[{name:'Caras (6)',info:'Seis cuadrados iguales. Área total = 6·a².',shape:'box',size:[2,2,2],color:'#4dabf7',group:'Caras'},...p]}},
  cilcono:()=>({title:'Cilindro, esfera y cono',caption:'Con el mismo radio y la misma altura (2r), sus volúmenes están en proporción 3 : 2 : 1.',parts:[
    {name:'Cilindro',info:'V = π·r²·h. Aquí vale 3 partes.',shape:'cylinder',pos:[-3,0,0],r:1,h:2,color:'#4dabf7'},
    {name:'Esfera',info:'V = 4/3·π·r³. Aquí vale 2 partes (⅔ del cilindro).',shape:'sphere',pos:[0,0,0],r:1,color:'#06d6a0'},
    {name:'Cono',info:'V = ⅓·π·r²·h. Aquí vale 1 parte (⅓ del cilindro).',shape:'cone',pos:[3,0,0],r:1,h:2,color:'#ffd166'}]}),
  toro:()=>({title:'El toro (dona)',caption:'V = 2π²·R·r²',parts:[{name:'Toro',info:'Se forma girando una circunferencia de radio r alrededor de un eje, a distancia R del centro.',shape:'torus',r:1.6,tube:.6,rot:[P3/2,0,0],color:'#ff9f43'},
    {name:'Radio mayor R',info:'Distancia del centro del toro al centro del tubo.',shape:'arrow',from:[0,0,0],to:[1.6,0,0],color:'#ffffff'}]}),
  atomo:()=>{const e=(R,ph,tl,sp)=>({name:'Electrón',info:'Carga negativa; gira en una capa alrededor del núcleo.',shape:'sphere',r:.13,color:'#4dd0ff',group:'Electrones',orbit:{r:R,speed:sp,phase:ph,tilt:tl}});
    const shell=(R,tl)=>({name:'Capa',info:'Nivel de energía donde se mueven los electrones.',shape:'ring',r1:R-.02,r2:R+.02,color:'#4dd0ff',opacity:.5,group:'Capas',rot:[tl,0,0]});
    return{title:'Átomo de carbono (modelo de Bohr)',caption:'6 protones, 6 neutrones y 6 electrones: 2 en la primera capa y 4 en la segunda.',parts:[
      {name:'Núcleo',info:'Protones (+) y neutrones (sin carga). Concentra casi toda la masa.',shape:'sphere',r:.45,color:'#ff6b6b',pulse:true},
      shell(1.3,0),shell(2.4,0),e(1.3,0,0,2.2),e(1.3,P3,0,2.2),e(2.4,0,0,1.3),e(2.4,P3/2,0,1.3),e(2.4,P3,0,1.3),e(2.4,3*P3/2,0,1.3)]}},
  agua:()=>({title:'Molécula de agua (H₂O)',caption:'Ángulo de 104,5°: por eso la molécula es polar.',parts:[
    {name:'Oxígeno (O)',info:'Más electronegativo: atrae los electrones y queda con carga parcial negativa (δ−).',shape:'sphere',pos:[0,0,0],r:.62,color:'#ff5252'},
    {name:'Hidrógeno (H)',info:'Carga parcial positiva (δ+).',shape:'sphere',pos:[-1.11,-.86,0],r:.38,color:'#f1f5f9',group:'Hidrógenos'},
    {name:'Hidrógeno (H)',info:'Carga parcial positiva (δ+).',shape:'sphere',pos:[1.11,-.86,0],r:.38,color:'#f1f5f9',group:'Hidrógenos'},
    bond([0,0,0],[-1.11,-.86,0]),bond([0,0,0],[1.11,-.86,0])]}),
  adn:()=>{const p=[],N=16,H=6,T=3;for(let i=0;i<N;i++){const y=-H/2+(i+.5)*H/N,t=(y+H/2)/H*T*P3*2,at=i%2===0;
      p.push({name:at?'Par A–T':'Par G–C',info:at?'Adenina con timina: 2 puentes de hidrógeno.':'Guanina con citosina: 3 puentes de hidrógeno.',shape:'curve',points:[[Math.cos(t),y,Math.sin(t)],[-Math.cos(t),y,-Math.sin(t)]],tube:.055,color:at?'#ffd166':'#06d6a0',group:'Bases'})}
    return{title:'ADN: doble hélice',caption:'Dos cadenas unidas por pares de bases complementarias: A–T y G–C.',parts:[
      {name:'Cadena 1',info:'Esqueleto de azúcar y fosfato.',shape:'helix',r:1,h:H,turns:T,tube:.09,color:'#4dabf7',group:'Cadenas'},
      {name:'Cadena 2',info:'Cadena complementaria, antiparalela a la primera.',shape:'helix',r:1,h:H,turns:T,phase:P3,tube:.09,color:'#ff6bd6',group:'Cadenas'},...p]}},
  solar:()=>{const pl=(n,i,r,c,R,sp,ph,tl)=>[{name:n,info:i,shape:'sphere',r,color:c,orbit:{r:R,speed:sp,phase:ph,tilt:tl},group:'Planetas'},
      {name:'Órbita',info:'Trayectoria casi circular alrededor del Sol.',shape:'ring',r1:R-.015,r2:R+.015,color:'#ffffff',opacity:.35,group:'Órbitas',rot:[tl,0,0]}];
    return{title:'Sistema solar (escala didáctica)',caption:'Distancias y tamaños no están a escala real.',parts:[
      {name:'Sol',info:'Estrella central: contiene el 99,8 % de la masa del sistema solar.',shape:'sphere',r:1,color:'#ffd166',pulse:true},
      ...pl('Mercurio','El más cercano al Sol; año de 88 días.',.16,'#b0bec5',2,2.4,0,.06),...pl('Venus','Atmósfera densa: el planeta más caliente.',.26,'#ffcc80',2.9,1.8,1.2,.05),
      ...pl('Tierra','Nuestro hogar; tarda 365 días en dar una vuelta.',.28,'#4dabf7',3.9,1.4,2.4,.04),...pl('Marte','El planeta rojo; tiene el volcán más alto conocido.',.2,'#ff7043',4.8,1.1,3.3,.05),
      ...pl('Júpiter','El mayor planeta, un gigante gaseoso.',.7,'#e0a96d',6.4,.7,.6,.03),...pl('Saturno','Famoso por sus anillos de hielo y roca.',.55,'#f4d58d',8,.5,4.4,.04)]}},
  tierra:()=>({title:'La Tierra por dentro',caption:'Usa ✂️ Corte para abrir el planeta y ver sus capas.',parts:[
    {name:'Corteza',info:'Capa rocosa externa y delgada (5–70 km). Aquí vivimos.',shape:'sphere',r:2,color:'#4dabf7',opacity:.55,group:'Capas'},
    {name:'Manto',info:'Roca caliente y viscosa; llega a unos 2.900 km de profundidad.',shape:'sphere',r:1.85,color:'#ff9f43',opacity:.7,group:'Capas'},
    {name:'Núcleo externo',info:'Hierro y níquel líquidos; sus movimientos generan el campo magnético.',shape:'sphere',r:1.1,color:'#ff6b6b',opacity:.85,group:'Capas'},
    {name:'Núcleo interno',info:'Esfera sólida de hierro, a más de 5.000 °C.',shape:'sphere',r:.5,color:'#ffe066',group:'Capas',pulse:true}]}),
  nacl:()=>{const p=[];for(let i=0;i<3;i++)for(let j=0;j<3;j++)for(let k=0;k<3;k++){const na=(i+j+k)%2===0;
      p.push(na?{name:'Ion sodio (Na⁺)',info:'Cede un electrón: carga +1. Es más pequeño.',shape:'sphere',pos:[(i-1)*1.2,(j-1)*1.2,(k-1)*1.2],r:.3,color:'#c77dff',group:'Na⁺'}
        :{name:'Ion cloruro (Cl⁻)',info:'Gana un electrón: carga −1. Es más grande.',shape:'sphere',pos:[(i-1)*1.2,(j-1)*1.2,(k-1)*1.2],r:.45,color:'#06d6a0',group:'Cl⁻'})}
    return{title:'Cristal de sal (NaCl)',caption:'Red cúbica: cada ion está rodeado por 6 iones de carga opuesta.',parts:p}},
  celula:()=>{const c=(n,i,o)=>({name:n,info:i,group:'Orgánulos',...o});const rib=[[1.2,.9,.8],[-1.4,.3,1.1],[.3,-1.5,1.0],[-.8,1.3,-1.2],[1.5,-.6,-.9],[-1.1,-1.1,-.5],[.2,1.6,.4],[1.0,.2,-1.5]].map(q=>c('Ribosoma','Fabrica proteínas leyendo las instrucciones del ARN.',{shape:'sphere',pos:q,r:.1,color:'#ff6bd6'}));
    return{title:'Célula animal',caption:'Usa ✂️ Corte para abrirla y ver sus orgánulos por dentro.',parts:[
      {name:'Membrana celular',info:'Envoltura que controla qué entra y qué sale de la célula.',shape:'sphere',r:2.3,color:'#4dd0ff',opacity:.3,group:'Membrana'},
      c('Núcleo','Guarda el ADN y dirige las actividades de la célula.',{shape:'sphere',pos:[0,.1,0],r:.85,color:'#9b6bff'}),
      c('Nucléolo','Dentro del núcleo; produce los ribosomas.',{shape:'sphere',pos:[.25,.2,.25],r:.28,color:'#5e3bd6'}),
      c('Mitocondria','Central de energía: produce ATP en la respiración celular.',{shape:'capsule',pos:[1.35,-.5,.4],r:.2,h:.55,color:'#ff9f43',rot:[0,0,1.0]}),
      c('Mitocondria','Central de energía: produce ATP en la respiración celular.',{shape:'capsule',pos:[-1.3,-.7,.6],r:.2,h:.55,color:'#ff9f43',rot:[.6,0,-.8]}),
      c('Mitocondria','Central de energía: produce ATP en la respiración celular.',{shape:'capsule',pos:[.2,1.5,-.9],r:.2,h:.55,color:'#ff9f43',rot:[1.2,0,.3]}),
      c('Retículo endoplasmático','Red de membranas que transporta y modifica proteínas.',{shape:'torus',pos:[-.2,.1,-.1],r:1.15,tube:.07,rot:[P3/2,0,0],color:'#ffd166'}),
      c('Retículo endoplasmático','Red de membranas que transporta y modifica proteínas.',{shape:'torus',pos:[-.2,.1,-.1],r:1.3,tube:.07,rot:[P3/2.4,0,0],color:'#ffd166'}),
      ...[0,1,2,3].map(i=>c('Aparato de Golgi','Empaqueta y envía las proteínas a su destino.',{shape:'torus',pos:[-1.25,-.9+i*.16,-.9],r:.45-i*.04,tube:.05,rot:[P3/2,0,0],color:'#06d6a0'})),
      c('Lisosoma','Bolsa de enzimas que digiere desechos.',{shape:'sphere',pos:[.9,1.1,.9],r:.2,color:'#8bd450'}),
      ...rib]}},
  corazon:()=>({title:'El corazón humano',caption:'Azul: sangre sin oxígeno · Rojo: sangre con oxígeno. Se ve de frente (el lado derecho del paciente queda a tu izquierda).',parts:[
    {name:'Aurícula derecha',info:'Recibe la sangre sin oxígeno del cuerpo (por las venas cavas).',shape:'sphere',pos:[-1.05,.95,0],r:.62,color:'#4d7cff',group:'Cámaras'},
    {name:'Ventrículo derecho',info:'Bombea la sangre sin oxígeno hacia los pulmones.',shape:'sphere',pos:[-.7,-.45,.25],r:.8,color:'#4d7cff',group:'Cámaras',pulse:true},
    {name:'Aurícula izquierda',info:'Recibe la sangre con oxígeno que vuelve de los pulmones.',shape:'sphere',pos:[1.05,.95,-.15],r:.58,color:'#ff5252',group:'Cámaras'},
    {name:'Ventrículo izquierdo',info:'El más fuerte: bombea la sangre con oxígeno a todo el cuerpo.',shape:'sphere',pos:[.7,-.5,-.15],r:.9,color:'#ff5252',group:'Cámaras',pulse:true},
    {name:'Aorta',info:'La arteria más grande: lleva la sangre oxigenada al cuerpo.',shape:'curve',points:[[.6,.2,-.1],[.5,1.6,-.1],[.1,2.3,0],[-.5,1.8,0]],tube:.24,color:'#ff7a7a',group:'Vasos'},
    {name:'Arteria pulmonar',info:'Lleva la sangre sin oxígeno del ventrículo derecho a los pulmones.',shape:'curve',points:[[-.5,.2,.55],[-.2,1.5,.55],[.7,2.1,.5]],tube:.2,color:'#7c9cff',group:'Vasos'},
    {name:'Vena cava superior',info:'Trae la sangre sin oxígeno de la mitad superior del cuerpo.',shape:'curve',points:[[-1.1,1.4,0],[-1.15,2.5,0]],tube:.2,color:'#4d7cff',group:'Vasos'},
    {name:'Venas pulmonares',info:'Traen la sangre con oxígeno desde los pulmones.',shape:'curve',points:[[1.5,1.2,-.3],[2.3,1.6,-.4]],tube:.15,color:'#ff7a7a',group:'Vasos'}]}),
  volcan:()=>({title:'Un volcán por dentro',caption:'Usa ✂️ Corte para abrirlo y ver el camino del magma.',parts:[
    {name:'Cono volcánico',info:'Montaña formada por capas de lava y ceniza que se han ido acumulando.',shape:'cylinder',pos:[0,1.5,0],r:.6,r2:3,h:3,color:'#8d6e63',opacity:.55,group:'Estructura'},
    {name:'Corteza terrestre',info:'Capa de roca sobre la que se apoya el volcán.',shape:'cylinder',pos:[0,-.2,0],r:3.9,r2:4,h:.4,color:'#6d4c41',opacity:.7,group:'Estructura'},
    {name:'Cámara magmática',info:'Depósito de roca fundida (magma) bajo tierra.',shape:'sphere',pos:[0,-1.7,0],r:1.15,color:'#ff6b2b',group:'Magma',pulse:true},
    {name:'Conducto',info:'Canal por donde sube el magma hasta la superficie.',shape:'cylinder',pos:[0,.9,0],r:.22,h:4,color:'#ff4d2b',group:'Magma'},
    {name:'Cráter',info:'Abertura en la cima por donde sale el material de la erupción.',shape:'torus',pos:[0,3,0],r:.6,tube:.1,rot:[P3/2,0,0],color:'#bcaaa4',group:'Estructura'},
    {name:'Flujo de lava',info:'La lava (magma ya fuera del volcán) baja por la ladera.',shape:'curve',points:[[.55,3,0],[1.2,2.1,.2],[1.9,1,.3],[2.6,.1,.3]],tube:.13,color:'#ff9f43',group:'Erupción'},
    {name:'Columna de ceniza',info:'Nube de gases, ceniza y fragmentos de roca que sube por el aire.',shape:'cone',pos:[0,4.6,0],r:1.1,h:2.6,rot:[P3,0,0],color:'#9e9e9e',opacity:.4,group:'Erupción'},
    {name:'Bomba volcánica',info:'Fragmento de lava que sale despedido y se solidifica en el aire.',shape:'sphere',pos:[-.8,4,.5],r:.15,color:'#ff7043',group:'Erupción',pulse:true},
    {name:'Bomba volcánica',info:'Fragmento de lava que sale despedido y se solidifica en el aire.',shape:'sphere',pos:[.9,4.4,-.4],r:.12,color:'#ff7043',group:'Erupción',pulse:true}]}),
  motor:()=>({title:'Motor de combustión (esquema)',caption:'Esquema simplificado: el pistón sube y baja al girar el cigüeñal.',parts:[
    {name:'Cilindro',info:'Tubo donde se mueve el pistón y se quema la mezcla.',shape:'cylinder',pos:[0,.7,0],r:.85,h:3.2,color:'#9ab',opacity:.25,group:'Bloque'},
    {name:'Culata',info:'Tapa superior: lleva las válvulas y la bujía.',shape:'box',pos:[0,2.45,0],size:[2.1,.4,2.1],color:'#78909c',group:'Bloque'},
    {name:'Pistón',info:'Sube y baja comprimiendo la mezcla y recibiendo la fuerza de la explosión.',shape:'cylinder',pos:[0,.5,0],r:.8,h:.6,color:'#4dabf7',bob:{amp:-.5,speed:4},group:'Piezas móviles'},
    {name:'Biela',info:'Une el pistón con el cigüeñal y transmite el movimiento.',shape:'cylinder',pos:[0,-.75,0],r:.09,h:1.9,color:'#cfd8dc',bob:{amp:-.5,speed:4},group:'Piezas móviles'},
    {name:'Cigüeñal',info:'Convierte el movimiento de subir y bajar en un giro continuo.',shape:'cylinder',pos:[0,-1.9,0],r:.95,h:.22,rot:[P3/2,0,0],color:'#ff9f43',opacity:.5,group:'Piezas móviles'},
    {name:'Muñequilla',info:'Punto del cigüeñal donde se sujeta la biela.',shape:'sphere',pos:[0,-1.9,0],r:.16,color:'#ffd166',orbit:{r:.5,speed:4,phase:0,tilt:P3/2},group:'Piezas móviles'},
    {name:'Válvula de admisión',info:'Se abre para dejar entrar la mezcla de aire y combustible.',shape:'cylinder',pos:[-.45,2.9,0],r:.1,h:.8,color:'#4d7cff',group:'Válvulas'},
    {name:'Válvula de escape',info:'Se abre para dejar salir los gases quemados.',shape:'cylinder',pos:[.45,2.9,0],r:.1,h:.8,color:'#ff5252',group:'Válvulas'},
    {name:'Bujía',info:'Produce la chispa que enciende la mezcla.',shape:'cylinder',pos:[0,3,0],r:.07,h:.9,color:'#e0e0e0',group:'Válvulas'},
    {name:'Chispa',info:'La explosión empuja el pistón hacia abajo: ese es el tiempo de fuerza.',shape:'sphere',pos:[0,2.2,0],r:.12,color:'#ffe066',pulse:true,group:'Válvulas'}]}),
  neurona:()=>{const den=[[[-.6,.3,0],[-1.4,.9,.2],[-2.2,1.3,.1]],[[-.6,-.2,.3],[-1.5,-.5,.7],[-2.3,-1.1,.9]],[[-.4,.5,-.4],[-1,1.2,-.9],[-1.7,1.8,-1.2]],[[-.5,-.4,-.4],[-1.3,-.9,-.8],[-2,-1.6,-1]]].map(pts=>({name:'Dendritas',info:'Reciben los mensajes de otras neuronas.',shape:'curve',points:pts,tube:.07,color:'#7ee081',group:'Dendritas'}));
    const myel=[1.7,2.9,4.1,5.3].map(x=>({name:'Vaina de mielina',info:'Capa grasa que aísla el axón y acelera el impulso.',shape:'capsule',pos:[x,.02,0],r:.2,h:.7,rot:[0,0,P3/2],color:'#ffa94d',group:'Mielina',opacity:.85}));
    const term=[[6.9,.5,0],[7,0,.4],[6.9,-.5,-.1]].map(q=>({name:'Terminales del axón',info:'Liberan neurotransmisores para pasar el mensaje a la siguiente célula.',shape:'sphere',pos:q,r:.17,color:'#ff6bd6',group:'Terminales',pulse:true}));
    return{title:'La neurona',caption:'La chispa amarilla es el impulso nervioso viajando por el axón.',parts:[
      {name:'Cuerpo celular (soma)',info:'Centro de la neurona: mantiene viva la célula.',shape:'sphere',pos:[0,0,0],r:.75,color:'#9b6bff'},
      {name:'Núcleo',info:'Contiene el ADN de la neurona.',shape:'sphere',pos:[0,0,0],r:.32,color:'#5e3bd6'},
      ...den,
      {name:'Axón',info:'Largo cable que lleva el impulso eléctrico lejos del cuerpo celular.',shape:'curve',points:[[.7,0,0],[2.5,.1,0],[4.5,-.1,0],[6.6,0,0]],tube:.1,color:'#ffd166',group:'Axón'},
      ...myel,...term,
      {name:'Impulso nervioso',info:'Señal eléctrica que viaja por el axón a gran velocidad.',shape:'sphere',pos:[.7,0,0],r:.2,color:'#ffffaa',move:{to:[6.6,0,0],speed:.45},group:'Axón'}]}},
  ojo:()=>({title:'El ojo humano',caption:'Usa ✂️ Corte para abrirlo. La luz entra por la córnea y se enfoca en la retina.',parts:[
    {name:'Globo ocular',info:'Esfera llena de humor vítreo, un gel transparente.',shape:'sphere',r:1.95,color:'#e8f4ff',opacity:.28,group:'Estructura'},
    {name:'Córnea',info:'Ventana transparente al frente: empieza a enfocar la luz.',shape:'sphere',pos:[0,0,1.55],r:.95,color:'#4dd0ff',opacity:.35,group:'Estructura'},
    {name:'Iris',info:'Parte de color del ojo; se cierra o abre para regular la luz.',shape:'ring',pos:[0,0,1.8],r1:.32,r2:.8,rot:[P3/2,0,0],color:'#8d5524',group:'Luz'},
    {name:'Pupila',info:'Agujero negro por donde entra la luz.',shape:'cylinder',pos:[0,0,1.82],r:.32,h:.05,rot:[P3/2,0,0],color:'#101820',group:'Luz'},
    {name:'Cristalino',info:'Lente que cambia de forma para enfocar objetos cercanos y lejanos.',shape:'sphere',pos:[0,0,1.2],r:.55,color:'#b9fbc0',opacity:.6,group:'Luz'},
    {name:'Retina',info:'Fondo del ojo: sus células convierten la luz en señales nerviosas.',shape:'hemisphere',r:1.93,rot:[-P3/2,0,0],color:'#ff6b6b',group:'Estructura'},
    {name:'Nervio óptico',info:'Lleva las señales de la retina hasta el cerebro.',shape:'cylinder',pos:[0,0,-2.6],r:.22,h:1.4,rot:[P3/2,0,0],color:'#ffd166',group:'Nervio'}]}),
  flor:()=>{const pet=[],est=[];for(let i=0;i<6;i++){const a=i/6*P3*2,c=Math.cos(a),n=Math.sin(a);
      pet.push({name:'Pétalos',info:'Coloridos: atraen a los insectos que polinizan.',shape:'capsule',pos:[c*.85,2.05,n*.85],r:.2,h:.7,rot:[n*.9,0,-c*.9],color:'#ff85c0',group:'Corola'});
      est.push({name:'Estambre',info:'Órgano masculino: el filamento sostiene la antera, que produce polen.',shape:'cylinder',pos:[c*.5,1.6,n*.5],r:.025,h:.9,color:'#cfe8a0',group:'Estambres'},
        {name:'Antera',info:'Guarda y libera el polen.',shape:'sphere',pos:[c*.5,2.1,n*.5],r:.09,color:'#ffd166',group:'Estambres'})}
    return{title:'Partes de una flor',caption:'Femenino: pistilo · Masculino: estambres.',parts:[
      {name:'Tallo',info:'Sostiene la flor y transporta agua y nutrientes.',shape:'cylinder',pos:[0,-.2,0],r:.1,h:2.6,color:'#4caf50',group:'Soporte'},
      {name:'Sépalos',info:'Hojitas verdes que protegen el capullo.',shape:'cone',pos:[0,1.1,0],r:.55,h:.4,rot:[P3,0,0],color:'#66bb6a',group:'Soporte'},
      {name:'Ovario',info:'Base del pistilo: guarda los óvulos y se convierte en fruto.',shape:'sphere',pos:[0,1.3,0],r:.28,color:'#a5d65a',group:'Pistilo'},
      {name:'Estilo',info:'Tubo que une el estigma con el ovario.',shape:'cylinder',pos:[0,1.75,0],r:.06,h:.8,color:'#a5d65a',group:'Pistilo'},
      {name:'Estigma',info:'Punta pegajosa que recibe el polen.',shape:'sphere',pos:[0,2.22,0],r:.13,color:'#ff9f43',group:'Pistilo'},...pet,...est]}},
  celulaveg:()=>{const c=(n,i,o)=>({name:n,info:i,group:'Orgánulos',...o});
    return{title:'Célula vegetal',caption:'Fíjate en lo que tiene de más: pared, cloroplastos y vacuola grande.',parts:[
      {name:'Pared celular',info:'Cubierta rígida de celulosa: da forma y protege (solo en vegetales).',shape:'box',size:[4.8,4.8,4.8],color:'#8bc34a',opacity:.25,group:'Envolturas'},
      {name:'Membrana celular',info:'Envoltura que controla qué entra y qué sale de la célula.',shape:'box',size:[4.35,4.35,4.35],color:'#4dd0ff',opacity:.3,group:'Envolturas'},
      c('Núcleo','Guarda el ADN y dirige las actividades de la célula.',{shape:'sphere',pos:[-1.2,.7,0],r:.7,color:'#9b6bff'}),
      c('Vacuola central','Gran depósito de agua que mantiene la célula firme (solo en vegetales).',{shape:'sphere',pos:[.7,-.3,0],r:1.25,color:'#7fd3ff',opacity:.5}),
      ...[[-1.4,-1.4,.8],[1.6,1.5,.7],[-.3,1.7,-1.3],[1.4,-1.5,-1.0]].map(q=>c('Cloroplasto','Hace la fotosíntesis: convierte luz en azúcar (solo en vegetales).',{shape:'capsule',pos:q,r:.22,h:.55,color:'#43d17a',rot:[.5,0,1.1]})),
      ...[[-1.5,-.2,1.4],[1.0,.8,-1.6]].map(q=>c('Mitocondria','Central de energía: produce ATP en la respiración celular.',{shape:'capsule',pos:q,r:.18,h:.5,color:'#ff9f43',rot:[1,0,.4]})),
      c('Retículo endoplasmático','Red de membranas que transporta y modifica proteínas.',{shape:'torus',pos:[-1.2,.7,0],r:.95,tube:.06,rot:[P3/2,0,0],color:'#ffd166'}),
      ...[0,1,2].map(i=>c('Aparato de Golgi','Empaqueta y envía las proteínas a su destino.',{shape:'torus',pos:[-1.6,-1.0+i*.15,-1.2],r:.4-i*.04,tube:.05,rot:[P3/2,0,0],color:'#06d6a0'})),
      ...[[.2,1.3,1.5],[-.5,-1.8,.2],[1.9,.1,1.3]].map(q=>c('Ribosoma','Fabrica proteínas leyendo las instrucciones del ARN.',{shape:'sphere',pos:q,r:.1,color:'#ff6bd6'}))]}}
};
const PRE_NAMES=[['platonicos','🔷','Sólidos platónicos'],['cubo','🎲','Cubo'],['cilcono','🥫','Cilindro·esfera·cono'],['toro','🍩','Toro'],['atomo','⚛️','Átomo de carbono'],['agua','💧','Agua H₂O'],['adn','🧬','ADN'],['solar','🪐','Sistema solar'],['tierra','🌍','Tierra por capas'],['nacl','🧂','Cristal de sal'],['celula','🔬','Célula animal'],['celulaveg','🌿','Célula vegetal'],['corazon','❤️','Corazón'],['volcan','🌋','Volcán'],['motor','⚙️','Motor'],['neurona','🧠','Neurona'],['ojo','👁️','Ojo humano'],['flor','🌸','Flor']];

const holoPrompt=t=>`Crea un holograma 3D de «${t}» en la pizarra usando un elemento "holo" con sus partes principales (cada una con name e info), y explícalo parte por parte.`;
const cmpPrompt=(a,b)=>`Crea un holograma comparativo (elemento "holocmp") de «${a}» frente a «${b}»: dos modelos 3D lado a lado, con el mismo nombre en las partes equivalentes, y explica semejanzas y diferencias.`;
const IDEAS=['Corazón humano','Célula vegetal','Sistema digestivo','Pirámide de Egipto','Molécula de glucosa','Volcán','Planeta Saturno','Neurona','Motor de coche','Ojo humano','Cono y sus cortes','Estructura de una flor'];
function openAsk(pref){
  let d=document.getElementById('holoDlg');
  if(!d){d=document.createElement('dialog');d.id='holoDlg';d.className='holo-dlg';
    el('h3','',d,'🔮 Pídele un holograma a Lumi');el('p','hint',d,'Escribe qué quieres ver en 3D. Lumi lo construye en la pizarra, por partes, y te lo explica.');
    const inp=el('input','',d);inp.id='holoTopic';inp.placeholder='Ej.: el corazón, una célula, un volcán…';inp.autocapitalize='off';
    const inp2=el('input','',d);inp2.id='holoTopic2';inp2.placeholder='Comparar con… (opcional)';inp2.autocapitalize='off';
    const ch=el('div','holo-chips',d);IDEAS.forEach(t=>{const b=el('button','holo-btn',ch,t);b.type='button';b.onclick=()=>{inp.value=t;inp.focus()}});
    const row=el('div','holo-acts',d);
    const ok=el('button','holo-btn on',row,'🪄 Que Lumi lo cree');ok.type='button';
    const no=el('button','holo-btn',row,'Cancelar');no.type='button';no.onclick=()=>d.close();
    el('p','hint',d,'💡 Las figuras ya hechas (átomo, ADN, Tierra…) están en Herramientas → 🔮 Hologramas y no gastan créditos.');
    const go=()=>{const t=inp.value.trim().slice(0,80),t2=inp2.value.trim().slice(0,80);if(!t){inp.focus();return}d.close();inp.value=inp2.value='';askLumi(t2?cmpPrompt(t,t2):holoPrompt(t))};
    ok.onclick=go;inp.onkeydown=inp2.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();go()}};
    d.addEventListener('click',e=>{if(e.target===d)d.close()});document.body.appendChild(d)}
  const q=document.getElementById('q');d.querySelector('#holoTopic').value=pref!=null?pref:(q&&q.value.trim().slice(0,80))||'';d.querySelector('#holoTopic2').value='';
  d.showModal();d.querySelector('#holoTopic').focus();
}
window.Holo={create,compare:createCompare,presets:PRE,names:PRE_NAMES,ask:openAsk};
(()=>{const f=document.getElementById('form'),q=document.getElementById('q');if(!f||!q||document.getElementById('holoBtn'))return;
  const b=el('button','ib holo-open');b.id='holoBtn';b.type='button';b.title='Pedir un holograma 3D';b.setAttribute('aria-label','Pedir un holograma 3D');
  el('span','holo-emo',b,'🔮');el('span','lbl',b,'Holograma');b.onclick=()=>openAsk();f.insertBefore(b,q)})();

/* ---------- pizarra ---------- */
if(typeof Board!=='undefined'){
  const old=Board.draw;
  Board.draw=function(it){
    if(it&&it.t==='holo'){
      try{const s=document.getElementById('sheet'),b=document.getElementById('board'),v=create(it);s.appendChild(v);
        requestAnimationFrame(()=>requestAnimationFrame(()=>{v.classList.add('on','focus');setTimeout(()=>v.classList.remove('focus'),1800);b.scrollTop=b.scrollHeight}));return 2200}
      catch(e){console.warn('holo',e)}
    }
    if(it&&it.t==='holocmp'&&it.a&&it.b){
      try{const s=document.getElementById('sheet'),b=document.getElementById('board'),v=createCompare(it.a,it.b,it.caption);s.appendChild(v);
        requestAnimationFrame(()=>requestAnimationFrame(()=>{v.classList.add('on','focus');setTimeout(()=>v.classList.remove('focus'),1800);b.scrollTop=b.scrollHeight}));return 2800}
      catch(e){console.warn('holocmp',e)}
    }
    return old.call(Board,it);
  };
}

/* ---------- pestaña de herramientas ---------- */
const LT=window.LumiTools;
if(LT){
  LT.register('holo','🔮','Hologramas',el0=>{
    let cur=null,h=null,item=null;
    el0.innerHTML='';
    el('p','hint',el0,'Elige una figura: se proyecta aquí al instante, sin gastar créditos.');
    const sum=el('div','holo-info',el0),pl=el('div','pleg',el0);
    const stage=el('div','',el0);
    const acts=el('div','holo-acts',el0);
    const proj=el('button','holo-btn',acts,'📌 Proyectar en la pizarra');proj.type='button';
    const askb=el('button','askL',acts,'💬 Pedirle a Lumi que lo explique');askb.type='button';
    el('div','hint',el0,'¿Otro tema? Escríbelo y Lumi creará un holograma nuevo en la pizarra (usa 1 consulta).');
    const row=el('div','holo-new',el0),inp=el('input','',row);inp.placeholder='Ej.: corazón humano, volcán, motor…';inp.autocapitalize='off';
    const go=el('button','holo-btn on',row,'🪄 Crear');go.type='button';
    const paint=()=>{const P0=progGet(),n=Object.keys(PRE).filter(k=>P0.seen[k]).length;
      sum.textContent=`📊 Hologramas vistos: ${n}/${Object.keys(PRE).length} · Clases completadas: ${P0.classes}`+(P0.qN?` · Aciertos: ${Math.round(100*P0.qOk/P0.qN)} %`:'');
      [...pl.children].forEach(b=>{const id=b.dataset.id,nm=PRE_NAMES.find(x=>x[0]===id);b.textContent=nm[1]+' '+nm[2]+(P0.best[id]>=1?' ⭐':P0.seen[id]?' ✓':'')})};
    const show=id=>{cur=id;item=PRE[id]();item.id=id;stage.innerHTML='';h=create(item);stage.appendChild(h);h.classList.add('on');
      [...pl.children].forEach(b=>b.classList.toggle('on',b.dataset.id===id));
      askb.dataset.ask=`Explícame el holograma «${item.title}»: qué es cada parte, cómo se relacionan y qué debo recordar.`;paint()};
    PRE_NAMES.forEach(([id,ic,nm])=>{const b=el('button','',pl,ic+' '+nm);b.type='button';b.dataset.id=id;b.onclick=()=>show(id)});
    proj.onclick=()=>{if(!item||typeof Board==='undefined')return;const d=document.getElementById('toolsDlg');d&&d.open&&d.close();Board.draw(JSON.parse(JSON.stringify({...item,t:'holo'})))};
    go.onclick=()=>{const t=inp.value.trim();if(t)askLumi(holoPrompt(t))};
    inp.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();go.click()}};
    show('atomo');pl.addEventListener('click',()=>setTimeout(paint,50));stage.addEventListener('click',()=>setTimeout(paint,50));acts.addEventListener('click',()=>setTimeout(paint,50));
    LT.setStop(()=>{try{h&&h.__stop&&h.__stop()}catch(e){}LT.setStop(null)});
  });
}

if(LT){
  LT.register('holocmp','⚖️','Comparar hologramas',el0=>{
    let item=null;el0.innerHTML='';
    el('p','hint',el0,'Elige dos figuras y míralas lado a lado (gratis). Al tocar una parte en un modelo, se resalta la equivalente en el otro.');
    const ra=el('div','holo-new',el0),sa=(()=>{const x=el('select','',ra);PRE_NAMES.forEach(([id,ic,nm])=>{const o=el('option','',x,ic+' '+nm);o.value=id});return x})();
    el('span','',ra,'vs');const sb=(()=>{const x=el('select','',ra);PRE_NAMES.forEach(([id,ic,nm])=>{const o=el('option','',x,ic+' '+nm);o.value=id});return x})();
    sa.value='celula';sb.value='celulaveg';
    const go=el('button','holo-btn on',ra,'⚖️ Comparar');go.type='button';
    const stage=el('div','',el0),acts=el('div','holo-acts',el0);
    const proj=el('button','holo-btn',acts,'📌 Proyectar en la pizarra');proj.type='button';
    el('div','hint',el0,'¿Otros temas? Pídele a Lumi una comparación nueva (usa 1 consulta).');
    const r2=el('div','holo-new',el0),i1=el('input','',r2),i2=el('input','',r2);i1.placeholder='Tema A';i2.placeholder='Tema B';
    const g2=el('button','holo-btn on',r2,'🪄 Crear');g2.type='button';
    let cur=null;const run=()=>{try{cur&&cur.__stop&&cur.__stop()}catch(e){}const a=PRE[sa.value](),b=PRE[sb.value]();a.id=sa.value;b.id=sb.value;item={t:'holocmp',a,b};stage.innerHTML='';cur=createCompare(a,b,'');stage.appendChild(cur)};
    go.onclick=run;
    proj.onclick=()=>{if(!item||typeof Board==='undefined')return;const d=document.getElementById('toolsDlg');d&&d.open&&d.close();Board.draw(JSON.parse(JSON.stringify(item)))};
    g2.onclick=()=>{const a=i1.value.trim(),b=i2.value.trim();if(a&&b)askLumi(cmpPrompt(a,b))};
    run();
    LT.setStop(()=>{try{cur&&cur.__stop&&cur.__stop()}catch(e){}LT.setStop(null)});
  });
}
