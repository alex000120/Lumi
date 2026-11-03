/* Pizarra con ritmo (js/beat.js + css/beat.css): cuando suena música, la pizarra "late" al compás.
   · Audios y videos de TU dispositivo (y enlaces que lo permitan): detecta de verdad los golpes graves (bombo/bajo)
     leyendo una copia del audio con captureStream + AnalyserNode (no toca el sonido ni el volumen).
   · YouTube (el navegador no deja leer su audio) y fuentes no analizables: latido suave de ambiente.
   Cada latido solo cambia una clase en #board (bA/bB alternas) y CSS hace una animación corta de transform/sombra:
   cero bucles de animación, se pausa con la pestaña oculta o con «reducir movimiento». Se activa con 🥁 en el reproductor. */
(()=>{
const $=s=>document.querySelector(s),calm=()=>{try{return matchMedia('(prefers-reduced-motion:reduce)').matches}catch(e){return false}};
const get=(k,d)=>{try{return Store.get(k,d)}catch(e){return d}},set=(k,v)=>{try{Store.set(k,v)}catch(e){}};
let on=get('beatfx',true)!==false,playing=false,kind=null,mode='off',ctx=null,an=null,src=null,buf=null,raf=0,
    wired=false,startT=0,wireT=0,seen=false,avg=0,last=0,lastF=0,n=0,tog=false;
const AC=window.AudioContext||window.webkitAudioContext;

function wire(){
  if(!AC)return false;const v=$('#mpV'),cs=v&&(v.captureStream||v.mozCaptureStream);if(!cs)return false;
  try{
    ctx=ctx||new AC();if(ctx.state==='suspended')ctx.resume().catch(()=>{});
    const tr=cs.call(v).getAudioTracks();if(!tr.length)return false;
    if(src)try{src.disconnect()}catch(e){}
    src=ctx.createMediaStreamSource(new MediaStream(tr));
    if(!an){an=ctx.createAnalyser();an.fftSize=1024;an.smoothingTimeConstant=.5;buf=new Uint8Array(an.frequencyBinCount)}
    src.connect(an);return true}      /* el analizador NO se conecta a la salida: el sonido no cambia */
  catch(e){return false}}

function clear(){const b=$('#board');if(b)b.classList.remove('bA','bB','bd','bs')}
function beat(soft){
  const b=$('#board');if(!b)return;n=(n+1)%4;tog=!tog;
  b.classList.remove(tog?'bB':'bA');b.classList.add(tog?'bA':'bB');
  b.classList.toggle('bs',!!soft);b.classList.toggle('bd',n===0&&!soft)}   /* bd = primer tiempo de cada 4: más marcado */

function frame(t){
  raf=requestAnimationFrame(frame);if(t-lastF<33||document.hidden)return;lastF=t;
  if(mode==='soft'){if(t-last>1300){last=t;beat(true)}return}
  if(!wired){if(t-startT>3500){mode='soft';return}if(t-wireT>400){wireT=t;wired=wire()}return}
  an.getByteFrequencyData(buf);
  let e=0;for(let i=1;i<=5;i++)e+=buf[i];e/=5;                     /* graves: ~40–250 Hz */
  if(e>6||buf[20]>6)seen=true;
  if(!seen&&t-startT>3500){mode='soft';return}                      /* sin señal (CORS, Safari…): latido suave */
  avg=avg*.95+e*.05;
  if(e>55&&e>avg*1.28&&t-last>260){last=t;beat(false)}}

function refresh(){
  const act=on&&playing&&!calm();
  cancelAnimationFrame(raf);raf=0;
  if(!act){mode='off';clear();return}
  startT=performance.now();wireT=0;seen=false;avg=0;last=0;
  wired=false;mode=(kind&&kind!=='yt')?'real':'soft';
  raf=requestAnimationFrame(frame)}

addEventListener('mp:state',e=>{playing=!!(e.detail&&e.detail.playing);if(e.detail&&e.detail.kind)kind=e.detail.kind;refresh()});
addEventListener('mp:track',e=>{kind=e.detail&&e.detail.kind;if(playing)refresh()});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&raf)lastF=0});
window.BeatFX={on:()=>on,toggle(){on=!on;set('beatfx',on);refresh();return on}};
try{dispatchEvent(new Event('beat:ready'))}catch(e){}
})();
