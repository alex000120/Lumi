/* Modo Sorpresa de cumpleaños (v72)
   Lumi prepara una sorpresa con el nombre de tu amiga: dibuja pastel, globos y regalitos en la pizarra,
   le canta el cumpleaños (con la letra apareciendo al ritmo de su voz), pide un deseo y cierra con tu mensaje.
   Todo está escrito a mano aquí: NO usa Gemini, así que sale igual de bien siempre y funciona sin API key.
   Reutiliza el motor de clases de app.js (play) y el Director, por eso la pizarra y la voz van sincronizadas.
   Tres formas de lanzarla:
     1) Botón 🎂 de la barra superior (formulario con nombre, de parte de y mensaje).
     2) Escribirle a Lumi, por ejemplo: «Lumi, ella es mi amiga Ana, hazle una sorpresa» (también por micrófono).
     3) Un link:  tu-app/?cumple=Ana&de=Karla&msg=Tu+mensaje  (muestra un sobre; al tocarlo empieza). */
(()=>{
const q=s=>document.querySelector(s);
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const bad=/[<>&$\\{}"`]/g;
const nice=s=>{s=String(s||'').replace(bad,'').replace(/\s+/g,' ').trim().slice(0,26);return s?s[0].toUpperCase()+s.slice(1):''};
const reduced=()=>window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
let running=false;

/* ---------- Sonido: cajita de música (Cumpleaños feliz es de dominio público) ---------- */
let AC=null;
function ac(){try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();return AC}catch(e){return null}}
function tone(f,t0,dur,vol){
  const c=AC,o=c.createOscillator(),o2=c.createOscillator(),g=c.createGain(),g2=c.createGain();
  o.type='sine';o2.type='triangle';o.frequency.value=f;o2.frequency.value=f*2;g2.gain.value=.3;
  g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(vol,t0+.012);g.gain.exponentialRampToValueAtTime(.0008,t0+dur);
  o.connect(g);o2.connect(g2);g2.connect(g);g.connect(c.destination);
  o.start(t0);o2.start(t0);o.stop(t0+dur+.05);o2.stop(t0+dur+.05)}
function chime(){if(!ac())return;const t=AC.currentTime+.05;[523.25,659.25,783.99,1046.5].forEach((f,i)=>tone(f,t+i*.14,.9,.12))}
const TUNE=[[392,.75],[392,.25],[440,1],[392,1],[523.25,1],[493.88,2],[392,.75],[392,.25],[440,1],[392,1],[587.33,1],[523.25,2],
  [392,.75],[392,.25],[783.99,1],[659.25,1],[523.25,1],[493.88,1],[440,1],[698.46,.75],[698.46,.25],[659.25,1],[523.25,1],[587.33,1],[523.25,2]];
function melody(){if(!ac())return 0;const beat=.5;let t=AC.currentTime+.1;TUNE.forEach(([f,b])=>{tone(f,t,b*beat+.45,.16);t+=b*beat});return t-AC.currentTime}

/* ---------- Confeti ---------- */
function confetti(n){
  n=reduced()?Math.ceil(n/3):n;
  let fx=q('#partyFx');if(!fx){fx=document.createElement('div');fx.id='partyFx';fx.setAttribute('aria-hidden','true');document.body.appendChild(fx)}
  const em=['🎉','🎊','✨','⭐','💖','🎈'],cols=['#ff6fb5','#ffd166','#6ec6ff','#8be28b','#c79bff','#ff9f5a'];
  for(let i=0;i<n;i++){
    const e=document.createElement('i'),r=Math.random();
    if(r<.35){e.textContent=em[i%em.length];e.style.fontSize=(16+Math.random()*14)+'px'}
    else{e.className='sq';e.style.background=cols[i%cols.length];e.style.setProperty('--s',(6+Math.random()*7)+'px')}
    e.style.left=(Math.random()*100)+'%';
    e.style.setProperty('--d',(3+Math.random()*2.8)+'s');e.style.setProperty('--w',(Math.random()*1.2)+'s');
    e.style.setProperty('--dx',((Math.random()-.5)*240)+'px');e.style.setProperty('--r',((Math.random()-.5)*1080)+'deg');
    fx.appendChild(e)}
  clearTimeout(confetti.t);confetti.t=setTimeout(()=>{const f=q('#partyFx');if(f)f.remove()},8500)}

/* ---------- Dibujos para la pizarra (lienzo 100 × 75, formas del elemento «scene») ---------- */
const cake=(flames,a)=>{
  const s=[
    {k:'ellipse',x:50,y:64,rx:35,ry:4.5,fill:'white',c:'gray',sw:.4,at:a},
    {k:'rect',x:24,y:47,w:52,h:16,r:3,fill:'pink',c:'chalk',sw:.5,sh:1,at:a},
    {k:'wave',x1:24,x2:76,y:47,amp:1.6,len:8,c:'white',sw:1.3,at:a},
    {k:'circle',x:30,y:55,r:.9,fill:'yel',rep:{n:5,dx:9,dy:0},at:a},
    {k:'rect',x:32,y:34,w:36,h:13.5,r:3,fill:'yel',c:'chalk',sw:.5,at:a},
    {k:'wave',x1:32,x2:68,y:34,amp:1.4,len:7,c:'white',sw:1.2,at:a},
    {k:'stamp',n:'heart',x:50,y:41,sc:.55,anim:'pulse',at:a},
    {k:'rect',x:39,y:23,w:22,h:11.5,r:3,fill:'sky',c:'chalk',sw:.5,at:a+1},
    {k:'wave',x1:39,x2:61,y:23,amp:1.1,len:5.5,c:'white',sw:1.1,at:a+1}];
  [[44,'red'],[50,'blue'],[56,'green']].forEach(([x,c])=>s.push({k:'rect',x:x-1.2,y:14.5,w:2.4,h:8.5,r:.5,fill:c,c:'chalk',sw:.3,at:a+1}));
  if(flames)[44,50,56].forEach(x=>s.push({k:'ellipse',x,y:11.6,rx:1.5,ry:2.6,fill:'orange',c:'gold',sw:.4,anim:'pulse',at:a+1}));
  else[44,50,56].forEach(x=>s.push({k:'curve',pts:[[x,12],[x-2.5,8],[x+2,4.5],[x-1,1.5]],c:'gray',sw:.5,op:.7,anim:'drift',at:a+1}));
  return s};

const balloons=(a,N)=>{
  const cols=['pink','sky','yel','green','purple','orange','red'],s=[{k:'curve',pts:[[0,5],[50,13],[100,5]],c:'chalk',sw:.5,at:a}];
  for(let i=0;i<9;i++){const x=6+i*11,y=5+8*(1-Math.pow((x-50)/50,2));
    s.push({k:'poly',pts:[[x-3.5,y],[x+3.5,y],[x,y+7]],close:true,fill:cols[i%7],c:'chalk',sw:.3,at:a})}
  [[14,40],[30,35],[46,42],[62,34],[78,41],[90,36],[22,50]].forEach(([x,y],i)=>{
    s.push({k:'curve',pts:[[x,y+6.4],[x-2,y+12],[x+2,y+18],[x,y+24]],c:'chalk',sw:.3,at:a+1});
    s.push({k:'ellipse',x,y,rx:5,ry:6.4,fill:cols[(i+2)%7],c:'chalk',sw:.4,anim:'float',at:a+1});
    s.push({k:'ellipse',x:x-1.8,y:y-2.4,rx:1,ry:1.6,fill:'white',fo:.6,sw:0,at:a+1})});
  s.push({k:'text',x:50,y:25,s:'¡Hoy se celebra a '+N+'!',size:4.4,a:'middle',c:'gold',at:a+2});
  return s};

const gifts=(a)=>{
  const defs=[[20,'pink','🤗','Un abrazo\ngigante'],[50,'sky','😄','Mil risas\npara todo el año'],[80,'green','✨','Un año lleno\nde aventuras']],s=[];
  defs.forEach(([x,c])=>{
    s.push({k:'rect',x:x-9,y:40,w:18,h:18,r:1.2,fill:c,c:'chalk',sw:.5,sh:1,at:a});
    s.push({k:'rect',x:x-10.5,y:35.5,w:21,h:5.5,r:1.2,fill:c,c:'chalk',sw:.5,at:a});
    s.push({k:'rect',x:x-1.6,y:35.5,w:3.2,h:22.5,fill:'yel',sw:0,at:a});
    s.push({k:'ellipse',x:x-3.4,y:33.2,rx:3.4,ry:2.1,rot:-25,fill:'yel',c:'gold',sw:.4,at:a});
    s.push({k:'ellipse',x:x+3.4,y:33.2,rx:3.4,ry:2.1,rot:25,fill:'yel',c:'gold',sw:.4,at:a});
    s.push({k:'circle',x,y:33.8,r:1.2,fill:'gold',sw:0,at:a})});
  defs.forEach(([x,,e,l],i)=>{
    s.push({k:'emoji',x,y:22,s:e,size:9,anim:'float',at:a+1+i});
    s.push({k:'text',x,y:65,s:l,size:3.2,a:'middle',c:'chalk',at:a+1+i})});
  return s};

/* ---------- El guion ---------- */
function steps(N,from,msg){
  const base={rate:S.rate,pitch:S.pitch},who=from||'Alguien que te quiere mucho';
  const def='Que este nuevo año venga lleno de risas, abrazos y cosas bonitas. ¡Gracias por ser como eres!';
  const text=msg||def,card=text+(from?'  — '+from:'');
  /* «say» es un getter: justo cuando empieza el paso, ajusta la voz (canto) y lanza confeti/sonido. */
  const mk=(o,say,fx)=>{Object.defineProperty(o,'say',{get(){try{fx&&fx()}catch(e){}return say},enumerable:true});return o};
  const speed=(r,p)=>()=>{S.rate=base.rate*r;S.pitch=Math.min(1.6,base.pitch+p)};
  const later=(ms,fn)=>{const my=token;setTimeout(()=>{if(my===token)fn()},ms)};
  return[
    mk({mood:'excited',gesture:'wave',react:'wow',board:[
      {t:'title',x:'🎁 ¡Una sorpresa para '+N+'!'},
      {t:'scene',bg:'night',shapes:[
        {k:'stamp',n:'moon',x:86,y:17,sc:1.2,anim:'float',at:1},
        {k:'stamp',n:'star',x:12,y:14,sc:.7,anim:'twinkle',at:1},{k:'stamp',n:'star',x:32,y:8,sc:.5,anim:'twinkle',at:1},
        {k:'stamp',n:'star',x:68,y:10,sc:.6,anim:'twinkle',at:1},{k:'stamp',n:'star',x:18,y:44,sc:.5,anim:'twinkle',at:1},{k:'stamp',n:'star',x:90,y:48,sc:.6,anim:'twinkle',at:1},
        {k:'emoji',x:50,y:36,s:'🎁',size:22,anim:'bounce',at:2},
        {k:'text',x:50,y:62,s:'Para '+N,size:7,a:'middle',c:'gold',at:3}]}]},
      '¡Shhh! Hola, '+N+'. Soy Lumi, la profe de esta aula. '+who+' me pidió preparar algo muy especial, solo para ti.',chime),

    mk({mood:'excited',gesture:'present',react:'party',board:[
      {t:'title',x:'🎂 ¡Feliz cumpleaños, '+N+'!'},
      {t:'scene',bg:'room',shapes:[...cake(true,1),{k:'text',x:50,y:71,s:'¡'+N+', hoy brillas tú!',size:4.6,a:'middle',c:'gold',at:3}]}]},
      'Hoy es un día muy especial: ¡tu cumpleaños! Mira el pastel que dibujé para ti, con velitas y todo. ¡Hoy brillas tú!',
      ()=>later(2800,()=>confetti(45))),

    mk({mood:'happy',gesture:'open',react:'dance',board:[
      {t:'scene',bg:'day',shapes:balloons(1,N)}]},
      'Y como toda fiesta que se respeta, ¡con globos! Muchos globos de colores. ¡Uno por cada deseo bonito que te mandamos!'),

    mk({mood:'happy',gesture:'present',react:'love',board:[
      {t:'note',x:'Tus regalitos 🎁'},
      {t:'scene',bg:'sunset',shapes:[...gifts(1),
        {k:'stamp',n:'star',x:8,y:10,sc:.6,anim:'twinkle',at:1},{k:'stamp',n:'star',x:92,y:12,sc:.6,anim:'twinkle',at:1}]}]},
      'Te preparé tres regalitos virtuales. El primero, un abrazo gigante. El segundo, mil risas para todo el año. Y el tercero, un año lleno de aventuras.'),

    mk({mood:'excited',gesture:'cheer',react:'hum',board:[
      {t:'title',x:'🎶 ¡Cumpleaños feliz! 🎶'},
      {t:'list',items:['Cumpleaños feliz,','te deseamos a ti,','cumpleaños querida '+N+',','¡cumpleaños feliz! 🎉']},
      {t:'scene',bg:'night',ratio:'wide',shapes:[
        {k:'emoji',x:14,y:30,s:'🎵',size:9,anim:'float',at:1},{k:'emoji',x:34,y:16,s:'🎶',size:9,anim:'bounce',at:2},
        {k:'emoji',x:66,y:16,s:'🎶',size:9,anim:'bounce',at:3},{k:'emoji',x:86,y:30,s:'🎵',size:9,anim:'float',at:3},
        {k:'emoji',x:50,y:34,s:'🎂',size:16,anim:'pulse',at:4}]}]},
      'Cumpleaños feliz. Te deseamos a ti. Cumpleaños querida '+N+'. ¡Cumpleaños feliz!',speed(.8,.25)),

    mk({mood:'wink',gesture:'present',react:'wow',board:[
      {t:'scene',bg:'night',shapes:[...cake(false,1),
        {k:'stamp',n:'star',x:12,y:14,sc:.7,anim:'twinkle',at:2},{k:'stamp',n:'star',x:88,y:20,sc:.6,anim:'twinkle',at:2},
        {k:'arrow',x1:90,y1:4,x2:74,y2:16,c:'gold',sw:.8,anim:'drift',at:2},
        {k:'text',x:50,y:71,s:'✨ ¡Deseo pedido! ✨',size:4.6,a:'middle',c:'gold',at:3}]}]},
      'Ahora cierra los ojos y pide un deseo. Uno, dos, tres… ¡sopla las velitas! Listo. Ese deseo ya va en camino.',
      ()=>{S.rate=base.rate;S.pitch=base.pitch}),

    mk({mood:'excited',gesture:'cheer',react:'party',board:[
      {t:'box',kind:'sum',title:'💌 Para '+N,x:card},
      {t:'scene',bg:'sunset',ratio:'wide',shapes:[
        {k:'stamp',n:'heart',x:50,y:22,sc:2.2,anim:'pulse',at:1},
        {k:'text',x:50,y:47,s:'¡Feliz cumple, '+N+'!',size:6,a:'middle',c:'gold',at:2},
        {k:'emoji',x:18,y:14,s:'🥳',size:11,anim:'bounce',at:3},{k:'emoji',x:82,y:14,s:'🎉',size:11,anim:'bounce',at:3},
        {k:'emoji',x:10,y:38,s:'🎈',size:9,anim:'float',at:3},{k:'emoji',x:90,y:38,s:'🎈',size:9,anim:'float',at:3}]}]},
      '¡Feliz cumpleaños, '+N+'! '+text+(from?' Con mucho cariño, '+from+'.':''),
      ()=>{later(1200,()=>confetti(90))})
  ]}

/* ---------- Orquestación ---------- */
async function show(o){
  const N=nice(o.name);if(!N||running)return;
  if(typeof play!=='function'||typeof stopAll!=='function'){alert('No pude iniciar la sorpresa en esta versión.');return}
  const from=nice(o.from),msg=String(o.msg||'').replace(bad,'').replace(/\s+/g,' ').trim().slice(0,220);
  try{Store.set('party',{name:N,from,msg})}catch(e){}
  running=true;
  stopAll();const my=token;busy=true;
  const b=q('#stop');if(b)b.hidden=false;const em=q('#empty');if(em)em.style.display='none';
  Board.clear();Board.stamp();
  const keep={voice:S.voice,rate:S.rate,pitch:S.pitch};S.voice=true;
  try{
    ac();
    status('¡Sorpresa para '+N+'! 🎁');
    await play(steps(N,from,msg),my,false);
    if(my!==token)return;
    /* Final: la melodía de cajita de música y lluvia de confeti mientras Lumi baila. */
    status('¡Feliz cumpleaños, '+N+'! 🎂');
    Avatar.react('dance');confetti(70);
    const secs=melody();
    for(let i=0;i<3&&my===token;i++){await sleep(Math.max(1,(secs||9)/3)*1000);if(my===token&&i<2)confetti(40)}
    if(my===token){Avatar.react('kiss');await sleep(900)}
  }finally{
    Object.assign(S,keep);running=false;
    if(my===token){busy=false;rest();status('¡Feliz cumpleaños, '+N+'! 🎂 · escríbele a Lumi para seguir')}
  }}

/* ---------- Diálogo ---------- */
function dlg(){
  let d=q('#partyDlg');
  if(!d){d=document.createElement('dialog');d.id='partyDlg';d.setAttribute('aria-label','Sorpresa de cumpleaños');document.body.appendChild(d)}
  return d}
function open(d){try{d.showModal()}catch(e){d.setAttribute('open','')}}
function link(o){
  const u=new URL(location.href);u.hash='';u.search='';
  u.searchParams.set('cumple',nice(o.name));if(nice(o.from))u.searchParams.set('de',nice(o.from));
  if(o.msg)u.searchParams.set('msg',String(o.msg).replace(bad,'').slice(0,220));
  return u.toString()}
function form(pre){
  pre=pre||{};let last={};try{last=Store.get('party',{})||{}}catch(e){}
  const d=dlg(),esc=s=>String(s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  d.innerHTML=`<div class="pbox"><h3>🎂 Sorpresa de cumpleaños</h3>
    <p>Lumi le dibuja un pastel, globos y regalitos en la pizarra, le canta con su nombre y le lee tu mensaje.</p>
    <label>Nombre de tu amiga<input id="pName" maxlength="26" autocomplete="off" value="${esc(pre.name||'')}" placeholder="Ana"></label>
    <label>De parte de (opcional)<input id="pFrom" maxlength="26" autocomplete="off" value="${esc(pre.from||last.from||'')}" placeholder="Tu nombre"></label>
    <label>Tu mensaje (opcional)<textarea id="pMsg" rows="3" maxlength="220" placeholder="Algo cortito y bonito para ella…">${esc(pre.msg||last.msg||'')}</textarea></label>
    <div class="prow"><button class="go" id="pGo" type="button">🎁 Empezar sorpresa</button><button class="alt" id="pCopy" type="button">🔗 Copiar link</button></div>
    <button class="x" id="pNo" type="button">Cancelar</button>
    <div class="ptip">Tip: con el link, ella lo abre en su celular y la sorpresa empieza sola al tocar el sobre (la app debe estar publicada).</div></div>`;
  const get=()=>({name:q('#pName').value,from:q('#pFrom').value,msg:q('#pMsg').value});
  q('#pGo').onclick=()=>{const o=get();if(!nice(o.name)){q('#pName').focus();return}d.close();show(o)};
  q('#pNo').onclick=()=>d.close();
  q('#pCopy').onclick=async()=>{const o=get();if(!nice(o.name)){q('#pName').focus();return}
    const u=link(o),b=q('#pCopy');
    try{await navigator.clipboard.writeText(u);b.textContent='✅ ¡Link copiado!'}catch(e){window.prompt('Copia este link:',u)}};
  open(d);setTimeout(()=>{const i=q('#pName');if(i&&!i.value)i.focus()},60)}
function envelope(o){
  const d=dlg(),N=nice(o.name);
  d.innerHTML=`<div class="pbox"><div class="env" aria-hidden="true">💌</div>
    <h3>¡${N}, tienes una sorpresa!</h3><p>Alguien preparó algo especial para ti. Sube un poquito el volumen y toca para abrirla.</p>
    <div class="prow"><button class="go" id="pOpen" type="button">🎁 Abrir mi sorpresa</button></div>
    <button class="x" id="pLater" type="button">Ahora no</button></div>`;
  q('#pOpen').onclick=()=>{d.close();show(o)};q('#pLater').onclick=()=>d.close();
  d.addEventListener('cancel',e=>e.preventDefault());   // que no se cierre sin querer con Esc
  open(d)}

/* ---------- Entradas: botón, link y texto ---------- */
const STOP=new Set(['mi','mis','ella','el','él','la','una','un','hoy','que','es','ti','ellos','cumpleaños','cumple','sorpresa','amiga','amigo','hazle','y','lumi','de','para','a','se','llama','mía','mio','mío','está','esta','si','por']);
function parseAsk(t){
  t=String(t||'');
  if(!/sorpresa|cumplea[ñn]os|cumple\b/i.test(t))return null;
  if(/\bmi\s+(cumple|cumplea[ñn]os)\b/i.test(t)&&!/sorpresa/i.test(t))return null;   // «hoy es mi cumpleaños»: ya lo maneja Lumi
  if(!/sorpresa|hazle|para\s+\p{L}|amig[oa]|prim[oa]|herman[oa]|novi[oa]|ella|se llama/iu.test(t))return null;
  const pats=[/se llama\s+(\p{L}+)/giu,/(?:amig[oa]|prim[oa]|herman[oa]|novi[oa]|mam[aá]|pap[aá]|compa[ñn]er[oa])\s+(\p{L}+)/giu,/(?:para|de)\s+(\p{L}+)/giu];
  for(const re of pats)for(const m of t.matchAll(re))if(!STOP.has(m[1].toLowerCase()))return{name:nice(m[1])};
  return{name:''}}

function init(){
  const util=q('.topbar .grp.util');
  if(util&&!q('#partyBtn')){const b=document.createElement('button');b.id='partyBtn';b.className='tb';b.type='button';b.title='Sorpresa de cumpleaños';b.setAttribute('aria-label','Sorpresa de cumpleaños');b.textContent='🎂';b.onclick=()=>form();util.prepend(b)}
  /* Lumi entiende «hazle una sorpresa a mi amiga Ana» aunque lo escribas o lo digas por micrófono. */
  if(typeof window.ask==='function'){const orig=window.ask;
    window.ask=function(text){const i=parseAsk(text);
      if(i){const qq=q('#q');if(qq)qq.value='';if(i.name)show(i);else form(i);return}
      return orig.apply(this,arguments)}}
  const p=new URLSearchParams(location.search),n=nice(p.get('cumple'));
  if(n){setTimeout(()=>{const st=q('#settings');if(st&&st.open)st.close();envelope({name:n,from:p.get('de'),msg:p.get('msg')})},1100)}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
window.Party={show,form,confetti};
})();
