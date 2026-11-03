/* Detalles de tema en el habla y el texto de Lumi (js/themetalk.js + css/themetalk.css):
   estado («Lista para jugar ▶ nivel 1»), cajita de escritura, título de la pestaña y el subtítulo que reacciona al hablar.
   Todo local (cero créditos de IA). No cambia lo que Lumi dice: solo el «envoltorio» del tema. */
(()=>{
const $=s=>document.querySelector(s),root=document.documentElement;
const on=()=>{try{return Store.get('tfx',true)!==false}catch(e){return true}};
let theme=root.dataset.theme||'kawaii';

/* clave → [texto base, ...textos equivalentes]; variantes por tema en el mismo orden de claves */
const KEYS={ready:['Lista para enseñarte'],explain:['Explicando…'],listen:['Te escucho…','Te escucho: dime tu duda'],newchat:['Chat nuevo · empezamos de cero'],
  almost:['Casi… repasemos juntos'],offline:['Sin internet','Sin internet · puedes repasar tus clases 📖'],fail:['Algo falló'],resumed:['Chat retomado · escribe para seguir']};
const ST={
  kawaii:['Lista para brillar contigo ✨','Explicando con cariñito… 💖','Te escucho con las orejitas 🐰','Hoja nueva, ¡a empezar! 🌸','¡Casi casi! Repasemos 💕','Sin internet, pero aquí estoy 🌙','Ay, algo falló… ¡reintentemos! 🥺','Seguimos donde quedamos 🎀'],
  futurista:['SISTEMA LISTO ▸ en línea','Procesando explicación…','Canal de voz abierto…','Sesión reiniciada ▸ lista','Error mínimo detectado ▸ repasemos','Modo sin red ▸ repaso local','Fallo del sistema ▸ reintenta','Sesión restaurada ▸ continúa'],
  profesional:['Lista para la clase','Preparando la explicación…','Te escucho atentamente…','Nueva sesión · empecemos','Casi correcto · repasemos','Sin conexión · repaso disponible','Hubo un problema · reintenta','Sesión retomada'],
  gamer:['Lista para jugar ▶ nivel 1','Cargando explicación… ▮▮▮▯','Micrófono ON 🎙️ habla, jugador','Nueva partida ▶ ¡a jugar!','¡Casi! Reintenta, tú puedes ⚔','Modo offline ▶ práctica libre','Game over… ¡otra vez! 💥','Partida cargada ▶ continúa'],
  anime:['¡Lista para el próximo episodio!','Narrando el episodio… 🌸','Te escucho, protagonista ✨','Nuevo capítulo ▸ ¡comencemos!','¡Casi, no te rindas! 🔥','Sin internet… ¡episodio de repaso! 📖','¡Plot twist! Algo falló 😵','Continuará… ¡retomamos! 🌸'],
  oceano:['Lista para sumergirnos 🌊','Explicando con la marea… 🫧','Te escucho desde el fondo del mar 🐚','Nueva ola ▸ ¡a navegar!','Casi llegas a la orilla 🌊','Sin señal, a la deriva 🏝️','Una ola nos movió… reintenta 🌊','Volvemos a navegar ⛵'],
  atardecer:['Lista, con calma dorada 🌅','Explicando con calma… 🧡','Te escucho tranquila 🌇','Un nuevo atardecer, ¡empecemos!','Casi lo tienes, repasemos con calma','Sin internet, el sol sigue 🌅','Algo se nubló… reintenta ☁️','Retomamos donde quedamos 🌇'],
  medianoche:['Lista bajo las estrellas 🌙','Susurrando la explicación… ✨','Te escucho en voz baja 🌙','Cielo nuevo ▸ empecemos ✨','Casi… repasemos entre estrellas','Sin internet, pero hay luna 🌙','Una nube tapó la luna… reintenta','Seguimos entre estrellas ✨'],
  cafe:['Lista, con cafecito en mano ☕','Explicando mientras se enfría el café… ☕','Te escucho, soy toda oídos ☕','Taza nueva ▸ ¡a empezar!','Casi… repasemos con otro cafecito','Sin internet, pero hay café ☕','Se derramó el café… reintenta 😅','Retomamos la charla ☕'],
  bosque:['Lista para crecer contigo 🌿','Explicando bajo los árboles… 🍃','Te escucho entre las hojas 🌳','Semilla nueva ▸ ¡a plantar!','Casi brota… repasemos 🌱','Sin red, pero hay bosque 🌲','Una rama se cayó… reintenta 🍂','Seguimos el sendero 🌿']};
const ORDER=Object.keys(KEYS),MAP={};
ORDER.forEach(k=>KEYS[k].forEach(t=>MAP[t]=k));Object.values(ST).forEach(a=>a.forEach((t,i)=>MAP[t]=ORDER[i]));
const variant=k=>{const a=ST[theme];return a?a[ORDER.indexOf(k)]:null};

let busy=false;
function themed(){
  const s=$('#status');if(!s||busy)return;const k=MAP[s.textContent.trim()];if(!k)return;
  const t=on()?variant(k):KEYS[k][0];if(t&&s.textContent!==t){busy=true;s.textContent=t;busy=false}}

/* Cajita de escritura y título de la pestaña */
const PH={kawaii:'Cuéntame tu duda… ✨',futurista:'> escribe tu consulta_',profesional:'Escribe tu pregunta o sube una foto…',gamer:'Escribe tu comando… ▶',anime:'¿Qué episodio aprendemos hoy? 🌸',oceano:'Lanza tu pregunta al mar… 🌊',atardecer:'¿Qué te gustaría entender hoy? 🌅',medianoche:'Susurra tu duda… 🌙',cafe:'Tu duda, con un cafecito… ☕',bosque:'Planta tu pregunta aquí… 🌱'};
const EM={kawaii:'🌸',futurista:'🚀',profesional:'💼',gamer:'🎮',anime:'🎌',oceano:'🌊',atardecer:'🌅',medianoche:'🌙',cafe:'☕',bosque:'🌿'};
const baseTitle=document.title;
function skin(){
  const q=$('#q');if(q&&!q.disabled)q.placeholder=on()?(PH[theme]||PH.kawaii):PH.profesional;
  document.title=(on()?(EM[theme]||'')+' ':'')+baseTitle.trim();themed()}

/* El subtítulo «late» cada vez que Lumi dice algo nuevo */
let tk=0;
function watchSub(){const s=$('#subtitle');if(!s)return;
  new MutationObserver(()=>{const n=performance.now();if(n-tk<1400||!s.textContent)return;tk=n;s.classList.remove('tk');void s.offsetWidth;s.classList.add('tk')}).observe(s,{childList:true,characterData:true,subtree:true})}

function boot(){
  const s=$('#status');if(s)new MutationObserver(themed).observe(s,{childList:true,characterData:true,subtree:true});
  new MutationObserver(()=>{const t=root.dataset.theme;if(!t||t===theme)return;theme=t;skin()}).observe(root,{attributes:true,attributeFilter:['data-theme']});
  watchSub();skin();setInterval(skin,5000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
