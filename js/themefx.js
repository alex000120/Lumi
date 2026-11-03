/* Detalles y gestos de Lumi según el tema (kawaii, futurista, gamer…).
   Todo ocurre en el navegador: no llama a la IA ni gasta cupo. Usa las reacciones y frases que Lumi ya tiene (Avatar.react / Avatar.onQuip)
   y una capa de adornos sobre el avatar (css/themefx.css). Se apaga en Ajustes («Detalles y gestos según el tema»). */
(()=>{
const $=s=>document.querySelector(s),pick=a=>a[Math.floor(Math.random()*a.length)],rnd=(a,b)=>a+Math.random()*(b-a);
const on=()=>{try{return Store.get('tfx',true)!==false}catch(e){return true}};
const calm=()=>{try{return matchMedia('(prefers-reduced-motion:reduce)').matches}catch(e){return false}};
let layer=null,theme=document.documentElement.dataset.theme||'kawaii',lastUser=performance.now(),lastAct=0,booted=false;

/* Partículas suaves que flotan siempre (solo CSS): n = cuántas, c = caracteres, x = rango horizontal (%) */
const AMB={kawaii:{n:7,c:['♥','✦','♡','✧']},futurista:{n:6,c:['0','1','◇','+']},profesional:{n:5,c:['•','+','◦']},gamer:{n:8,c:['■','▲','●','◆']},anime:{n:6,c:['✿','❀','✦']},
  oceano:{n:7,c:['○','◯']},atardecer:{n:7,c:['✦','·','•']},medianoche:{n:9,c:['✦','✧','·']},cafe:{n:3,c:['~'],x:[10,34]},bosque:{n:7,c:['•','❦','✿']}};

function ensure(){
  const av=$('#avatar');if(!av)return null;
  if(!layer||!layer.isConnected||layer.parentNode!==av){layer=document.createElement('div');layer.className='tfx';layer.setAttribute('aria-hidden','true');av.appendChild(layer);build()}
  layer.hidden=!on()||calm();return layer}
function build(){
  if(!layer)return;layer.innerHTML='';layer.dataset.th=theme;const a=AMB[theme]||AMB.kawaii,x=a.x||[6,92];
  for(let i=0;i<a.n;i++){const e=document.createElement('i');e.textContent=a.c[i%a.c.length];
    e.style.setProperty('--x',rnd(x[0],x[1]).toFixed(0)+'%');e.style.setProperty('--y',rnd(8,86).toFixed(0)+'%');
    e.style.setProperty('--d',(-rnd(0,9)).toFixed(1)+'s');e.style.setProperty('--t',rnd(5,10).toFixed(1)+'s');e.style.setProperty('--s',rnd(.8,1.4).toFixed(2));layer.appendChild(e)}}

/* Efectos puntuales */
const add=(tag,cls,txt,ms)=>{if(!ensure()||layer.hidden)return null;const e=document.createElement(tag);e.className=cls;e.textContent=txt;layer.appendChild(e);setTimeout(()=>e.remove(),ms);return e};
const pop=(t,x,y,c,ms)=>{const e=add('b','tfx-pop '+(c||''),t,ms||1800);if(e){e.style.left=x+'%';e.style.top=y+'%'}};
const cross=(t,y,ms,rev)=>{const e=add('b','tfx-cross'+(rev?' rev':''),t,ms+150);if(e){e.style.top=y+'%';e.style.setProperty('--ms',ms+'ms')}};
const burst=(cs,n,cx,cy)=>{for(let i=0;i<n;i++){const e=add('b','tfx-bst',pick(cs),1500);if(!e)return;const a=Math.PI*2*i/n+rnd(-.3,.3),r=rnd(38,72);
  e.style.left=cx+'%';e.style.top=cy+'%';e.style.setProperty('--dx',(Math.cos(a)*r).toFixed(0)+'px');e.style.setProperty('--dy',(Math.sin(a)*r).toFixed(0)+'px')}};
const rain=(cs,n)=>{for(let i=0;i<n;i++){const e=add('b','tfx-rain',pick(cs),3000);if(!e)return;e.style.left=rnd(6,90).toFixed(0)+'%';e.style.animationDelay=rnd(0,1).toFixed(2)+'s'}};
const ring=c=>{const e=add('b','tfx-ring','',1200);if(e)e.style.setProperty('--rc',c||'#fff')};
const flash=(c,ms)=>{if(!ensure()||layer.hidden)return;layer.classList.add(c);setTimeout(()=>layer&&layer.classList.remove(c),ms)};
const glitch=ms=>{const s=$('#avatar svg');if(!s||calm()||!on())return;s.classList.add('tfx-glitch');setTimeout(()=>s.classList.remove('tfx-glitch'),ms)};

/* Gestos y detallitos por tema: r = reacción de Lumi, q = frase (a veces), f = adorno visual */
const ACTS={
kawaii:[
 {r:'kiss',q:'¡Muah! 💋 Para que estudies feliz',f:()=>burst(['💖','✨','💕'],7,50,32)},
 {r:'giggle',q:'Uwu~ ¡qué día tan lindo! 🌸',f:()=>burst(['♥','✨'],5,50,30)},
 {r:'twirl',f:()=>burst(['🌸','✨','🎀'],8,50,45)},
 {r:'shy',q:'Nyaa~ 🐱 ¿me miraste? Jiji',f:()=>pop('🐱',72,24)},
 {r:'aww',q:'¡Kyaa! ¡Qué ternura! 🧸',f:()=>pop('🎀',50,12)},
 {r:'love',f:()=>burst(['💗'],6,50,34)},
 {q:'¡Mira, un unicornio pasó volando! 🦄🌈',f:()=>cross('🦄',70,5200)},
 {r:'hairflip',q:'*vuelo de pelo kawaii* ✨'}],
futurista:[
 {r:'wow',q:'Reiniciando… ¡listo! ✅ Todo bajo control 🤖',f:()=>glitch(500)},
 {r:'think',q:'Escaneando cerebro del alumno… 100 % genial 🧠⚡',f:()=>flash('fl-scan',1700)},
 {r:'nod',q:'Sistemas en línea 🛰️',f:()=>pop('SYS OK',50,14,'hud')},
 {r:'idea',q:'Procesando a velocidad cuántica ⚡',f:()=>burst(['⚡','🔷','💠'],6,50,34)},
 {q:'¡Un OVNI! Ah no, es mi dron de apuntes 🛸',f:()=>cross('🛸',16,5000)},
 {r:'flex',f:()=>{glitch(350);pop('POWER 100 %',50,20,'hud')}},
 {r:'smug',q:'Hablo binario: 01101100 01110101 01101101 01101001 😎',f:()=>pop('01101100',50,12,'hud')}],
profesional:[
 {r:'adjust',q:'Revisemos los puntos clave ✅'},
 {r:'nod',f:()=>pop('✅',50,16)},
 {r:'proud',q:'Tu progreso va en aumento 📈',f:()=>pop('📈',70,24)},
 {r:'idea',q:'Una idea brillante 💡',f:()=>pop('💡',50,12)},
 {r:'checkwatch',q:'Vamos en horario ⏱️, ¡bien!'},
 {r:'read',q:'Repaso rápido de los apuntes 📎',f:()=>pop('📎',30,20)}],
gamer:[
 {r:'cheer',q:'¡+10 XP! 🎮',f:()=>pop('+10 XP',50,18,'px')},
 {r:'proud',q:'¡Subiste de nivel mental! ⬆️',f:()=>pop('LEVEL UP!',50,16,'px big')},
 {r:'flex',f:()=>pop('COMBO x2',50,20,'px')},
 {q:'¡Cuidado, un bug salvaje apareció! 👾',f:()=>cross('👾',18,4600)},
 {r:'dance',q:'¡Monedas por todos lados! 🪙',f:()=>burst(['🪙','⭐'],6,50,34)},
 {r:'applause',q:'GG, buen estudio 🏆',f:()=>pop('GG',50,16,'px big')},
 {r:'smug',q:'Checkpoint guardado 💾 Respira y seguimos.'},
 {r:'wow',f:()=>pop('PRESS START',50,16,'px')}],
anime:[
 {r:'cheer',q:'¡Yosh! ¡Ganbatte! 💪✨',f:()=>{flash('fl-speed',900);burst(['✨'],6,50,34)}},
 {r:'oops',q:'Etto… ¡jeje! (っ´ω`)っ',f:()=>pop('💧',68,22)},
 {r:'gasp',q:'¡Nani?! 😲',f:()=>{flash('fl-speed',700);pop('!!',50,16,'kana')}},
 {r:'twirl',q:'¡Sakura! 🌸 Qué bonito~',f:()=>burst(['🌸'],8,50,40)},
 {r:'proud',q:'¡Sugoi! 🌟',f:()=>pop('✨',36,30)},
 {r:'shy',q:'Kya~ ¡no me mires tanto! 🙈'},
 {r:'smug',q:'(Aura de protagonista activada) 🔥',f:()=>pop('ゴゴゴ',50,18,'kana')}],
oceano:[
 {q:'¡Un pececito pasó nadando! 🐠',f:()=>cross('🐠',78,5200)},
 {r:'giggle',q:'¡Burbujas! 🫧',f:()=>burst(['🫧'],7,50,60)},
 {r:'wow',q:'¡Un delfín! 🐬 ¡Qué salto!',f:()=>cross('🐬',20,4800,true)},
 {r:'hum',q:'Estudiar es como nadar: un poquito cada día 🌊',f:()=>pop('🌊',50,70)},
 {r:'aww',q:'Encontré una conchita 🐚',f:()=>pop('🐚',24,72)},
 {q:'La tortuga dice: despacito, pero seguro 🐢',f:()=>cross('🐢',82,7000)}],
atardecer:[
 {r:'sigh',q:'Qué luz tan linda hoy… 🌇',f:()=>flash('fl-glow',2200)},
 {r:'aww',q:'Hora dorada para estudiar ✨',f:()=>pop('☀️',72,16)},
 {r:'hum',f:()=>burst(['🧡','🍂'],6,50,36)},
 {q:'Los pajaritos vuelan a casa 🐦',f:()=>cross('🐦',14,5000)},
 {r:'charm',q:'Todo se ve más lindo con esta luz 🧡'},
 {r:'nod',q:'Un ratito más y descansamos 🌅',f:()=>flash('fl-glow',1800)}],
medianoche:[
 {r:'wow',q:'¡Una estrella fugaz! Pide un deseo… 🌠',f:()=>cross('🌠',10,2200)},
 {r:'peek',q:'Shhh… el búho sabio nos observa 🦉',f:()=>pop('🦉',78,18)},
 {r:'hum',q:'Las estrellas también estudian ✨',f:()=>burst(['⭐','✨'],6,50,30)},
 {r:'yawn',q:'*bostezo* ¡pero un poquito más! 😴'},
 {r:'aww',q:'La noche es linda para pensar 🌙',f:()=>pop('🌙',24,16)},
 {f:()=>cross('🦇',20,4200,true)}],
cafe:[
 {r:'sip',q:'Un cafecito y seguimos ☕',f:()=>pop('☕',22,66)},
 {r:'aww',q:'¡Galletita de recompensa! 🍪',f:()=>pop('🍪',74,66)},
 {r:'read',q:'Un capítulo mientras se enfría el café 📖',f:()=>pop('📖',24,70)},
 {r:'hum',q:'Huele a croissant recién hecho 🥐',f:()=>pop('🥐',50,70)},
 {r:'giggle',q:'Un gatito curioso se asomó 🐱',f:()=>pop('🐱',76,70)}],
bosque:[
 {r:'wow',q:'¡Una mariposa! 🦋',f:()=>cross('🦋',30,6000)},
 {r:'hum',q:'Respira hondo: aire fresquito 🌿',f:()=>burst(['🍃','🌿'],7,50,34)},
 {r:'peek',q:'¡Mira un hongo! 🍄 (no lo comas, jeje)',f:()=>pop('🍄',24,72)},
 {r:'giggle',q:'¡Una mariquita en mi hombro! 🐞',f:()=>pop('🐞',72,70)},
 {q:'¡Una ardillita pasó corriendo! 🐿️',f:()=>cross('🐿️',76,5000,true)},
 {r:'aww',q:'Las luciérnagas vinieron a ver la clase ✨',f:()=>burst(['✨'],6,50,34)}]};
const MORE={
kawaii:[{r:'twirl',q:'¡Lluvia de corazones! 💕',f:()=>rain(['💕','💖','✨'],9)},{r:'giggle',q:'Hoy tengo ganas de abrazar a alguien 🤗',f:()=>pop('🤗',50,14)},{r:'charm',q:'¿Soy kawaii o soy kawaii? 😚',f:()=>ring('#ff7eb6')},
  {r:'aww',q:'Te preparé un pastelito 🍰',f:()=>pop('🍰',74,66)},{r:'wow',q:'Un arcoíris para tu estudio 🌈',f:()=>cross('🌈',22,5200)},{r:'dance',q:'♪ Bailecito kawaii ♪',f:()=>burst(['🎵','💗','🎀'],7,50,40)},{r:'shy',q:'Te regalo una florcita 🌷',f:()=>pop('🌷',26,70)}],
futurista:[{r:'think',q:'Calculando la trayectoria del conocimiento… 📡',f:()=>ring('#22d3ee')},{r:'wow',q:'Activando escudo de concentración 🛡️',f:()=>{ring('#22d3ee');pop('SHIELD ON',50,16,'hud')}},
  {r:'idea',q:'Descargando sabiduría… 87 % ⬇️',f:()=>rain(['0','1'],12)},{q:'Detecté una señal desde Marte 🔴👽',f:()=>cross('🛰️',24,5000,true)},{r:'flex',q:'Modo turbo activado 🚀',f:()=>{glitch(400);burst(['🚀','⚡'],6,50,40)}},
  {r:'nod',q:'Actualización completada ✅',f:()=>pop('AI v2.0',50,14,'hud')},{r:'smug',q:'Soy 100 % holograma, 0 % sueño 😎',f:()=>flash('fl-scan',1700)}],
profesional:[{r:'proud',q:'Excelente trabajo: objetivos cumplidos 🎯',f:()=>pop('🎯',50,14)},{r:'read',q:'Anotemos esto en la agenda 🗓️',f:()=>pop('🗓️',28,20)},{r:'idea',q:'Propuesta: un descansito de 5 minutos ☕',f:()=>pop('⏸️',50,14)},
  {r:'nod',q:'Buen ritmo. Sigamos con constancia 💼',f:()=>burst(['✅'],5,50,34)},{r:'adjust',q:'Mantengamos el enfoque 🔍',f:()=>pop('🔍',70,20)},{r:'checkwatch',q:'Sesión de estudio: asistencia al 100 % ✔️',f:()=>ring('#2563eb')},{r:'smug',q:'Presentación impecable, si se me permite 😌',f:()=>pop('⭐',50,14)}],
gamer:[{r:'dance',q:'¡Power-up! 🍄',f:()=>pop('🍄',50,16)},{r:'cheer',q:'¡Logro desbloqueado! 🏅',f:()=>pop('ACHIEVEMENT',50,16,'px')},{r:'wow',q:'¡Jefe final a la vista! 🐉',f:()=>cross('🐉',18,5000,true)},
  {r:'flex',q:'Vida llena. ¡A estudiar! ❤️',f:()=>pop('HP 100/100',50,16,'px')},{r:'proud',q:'¡Racha de aciertos! 🔥',f:()=>rain(['⭐','🪙'],9)},{r:'smug',q:'No necesito trucos, solo práctica 🕹️',f:()=>ring('#a3ff12')},
  {r:'oops',q:'Uy, lag mental… ya reinicio 🔄',f:()=>glitch(350)},{r:'applause',q:'¡Nuevo récord personal! 🏆',f:()=>pop('NEW RECORD',50,16,'px')}],
anime:[{r:'wow',q:'¡Poder de la amistad al máximo! 🔥',f:()=>{flash('fl-speed',900);pop('🔥',50,14)}},{r:'giggle',q:'Ehehe~ ¡qué vergüenza! 😳',f:()=>pop('💦',70,22)},{r:'twirl',q:'¡Transformación de chica mágica! 🌟',f:()=>{burst(['⭐','🌸','✨'],9,50,40);ring('#ff9ec8')}},
  {r:'proud',q:'¡Con esfuerzo se logra todo! 💪',f:()=>pop('頑張れ',50,16,'kana')},{r:'shy',q:'Ara ara~ 🌸',f:()=>rain(['🌸'],8)},{r:'gasp',q:'¡Un giro de trama inesperado! 😱',f:()=>{flash('fl-speed',700);pop('!?',50,16,'kana')}},{r:'cheer',q:'Próximo capítulo: ¡a repasar! 📖',f:()=>burst(['✨','⭐'],6,50,36)}],
oceano:[{r:'hum',q:'Glu glu glu… ¡hablo en burbuja! 🫧',f:()=>rain(['🫧'],9)},{r:'wow',q:'¡Una ballena! 🐋',f:()=>cross('🐋',30,7000)},{r:'giggle',q:'Me hace cosquillas el agua 🌊',f:()=>burst(['💧','🫧'],6,50,60)},
  {r:'aww',q:'¡Una estrellita de mar! 🌟',f:()=>pop('🌟',26,72)},{r:'peek',q:'¡Un pulpito se escondió! 🐙',f:()=>pop('🐙',74,70)},{r:'nod',q:'Marea alta de ganas de aprender 🌊',f:()=>ring('#5bc8ee')},{r:'charm',q:'Brillo como una perla 🦪✨',f:()=>pop('🦪',50,72)}],
atardecer:[{r:'sigh',q:'Pasa el tiempo, pero lo aprendido se queda 🌅',f:()=>flash('fl-glow',2400)},{r:'hum',q:'♪ La la la… cielito naranja ♪',f:()=>burst(['🎵','🧡'],6,50,40)},{r:'wow',q:'¡Mira esas nubes color rosa! ☁️',f:()=>cross('☁️',14,7000)},
  {r:'aww',q:'Se siente calentito, ¿no? 🧡',f:()=>pop('☀️',28,16)},{r:'charm',q:'Selfie con el atardecer 📸',f:()=>{pop('📸',72,22);flash('fl-glow',1200)}},{r:'nod',q:'Hojitas doradas de otoño 🍂',f:()=>rain(['🍂'],8)},{r:'shy',f:()=>burst(['🌇','✨'],5,50,34)}],
medianoche:[{r:'wow',q:'¡Mira, la luna está enorme! 🌕',f:()=>pop('🌕',74,16)},{r:'hum',q:'♪ Canción de cuna de estudio ♪',f:()=>burst(['🎵','⭐'],6,50,36)},{r:'peek',q:'Un gatito nocturno asoma 🐈‍⬛',f:()=>pop('🐈‍⬛',74,70)},
  {r:'think',q:'A estas horas se piensa mejor… ¿o es el sueño? 🤔',f:()=>rain(['✨','⭐'],9)},{r:'yawn',q:'Zzz… ¡no, no! Sigo despierta 💤',f:()=>pop('💤',70,22)},{r:'aww',q:'Las luciérnagas de la noche ✨',f:()=>ring('#ffe9a8')},{r:'giggle',q:'¡Una constelación con tu nombre! ⭐',f:()=>burst(['⭐'],8,50,30)}],
cafe:[{r:'sip',q:'Mmm… latte con espuma de conocimiento ☕',f:()=>burst(['☕','♨️'],5,50,66)},{r:'read',q:'Este libro huele a páginas nuevas 📚',f:()=>pop('📚',74,66)},{r:'aww',q:'¡Una tostadita con mermelada! 🍞',f:()=>pop('🍞',26,70)},
  {r:'hum',q:'♪ Música de cafetería ♪',f:()=>burst(['🎵','🎶'],6,50,40)},{r:'giggle',q:'¡Se me derramó un poquito! 🫠',f:()=>pop('💦',70,66)},{r:'nod',q:'Cafecito y repaso: la mejor combinación ☕📖',f:()=>ring('#b4693a')},{r:'charm',q:'¡Arte latte con forma de corazón! 💗',f:()=>pop('💗',50,70)}],
bosque:[{r:'hum',q:'♪ Los pajaritos cantan ♪',f:()=>cross('🐦',14,5000)},{r:'wow',q:'¡Un ciervito entre los árboles! 🦌',f:()=>cross('🦌',76,7000)},{r:'giggle',q:'¡Hojas por todas partes! 🍂',f:()=>rain(['🍃','🍂'],9)},
  {r:'aww',q:'Una florcita silvestre 🌼',f:()=>pop('🌼',26,72)},{r:'peek',q:'¡Un búho entre las ramas! 🦉',f:()=>pop('🦉',76,16)},{r:'nod',q:'La naturaleza también enseña 🌳',f:()=>ring('#4ade80')},{r:'shy',q:'¡Un conejito! 🐇',f:()=>cross('🐇',78,4800,true)}]};
Object.keys(MORE).forEach(k=>ACTS[k].push(...MORE[k]));
/* Al cambiar de tema, Lumi lo celebra a su manera */
const ENTER={kawaii:{r:'twirl',q:'¡Modo kawaii activado! 💖',f:()=>burst(['💖','🌸','✨'],8,50,40)},futurista:{r:'wow',q:'Sistemas actualizados 🚀 Bienvenido al futuro',f:()=>glitch(700)},
  profesional:{r:'adjust',q:'Modo profesional: ¡manos a la obra! 💼'},gamer:{r:'cheer',q:'¡Jugador 1 listo! 🎮',f:()=>pop('START!',50,16,'px big')},anime:{r:'cheer',q:'¡Comienza el episodio de hoy! ✨',f:()=>flash('fl-speed',900)},
  oceano:{r:'giggle',q:'¡Al agua! 🌊',f:()=>burst(['🫧'],7,50,60)},atardecer:{r:'sigh',q:'Qué bonita hora del día 🌇',f:()=>flash('fl-glow',2200)},medianoche:{r:'yawn',q:'Buenas noches… 🌙',f:()=>cross('🌠',10,2200)},
  cafe:{r:'sip',q:'Ahhh, un cafecito ☕',f:()=>pop('☕',22,66)},bosque:{r:'hum',q:'Respira el aire del bosque 🌿',f:()=>burst(['🍃'],7,50,34)}};

/* Celebración o consuelo del tema cuando el alumno acierta o falla un ejercicio */
const WIN={kawaii:{r:'cheer',q:'¡Kyaa, lo lograste! 🎉💖',f:()=>rain(['💖','🎉','✨'],12)},futurista:{r:'proud',q:'Respuesta verificada ✅ ¡Excelente!',f:()=>{pop('CORRECTO',50,14,'hud');ring('#22d3ee')}},
 profesional:{r:'nod',q:'Correcto. Muy buen razonamiento ✅',f:()=>pop('✅',50,14)},gamer:{r:'cheer',q:'¡Combo perfecto! 🎮',f:()=>{pop('PERFECT!',50,16,'px big');rain(['🪙','⭐'],10)}},
 anime:{r:'cheer',q:'¡SUGOI! ¡Lo lograste! 🌟',f:()=>{flash('fl-speed',900);pop('やった!',50,16,'kana')}},oceano:{r:'cheer',q:'¡Ola perfecta! 🏄🌊',f:()=>burst(['🫧','🐬','🌊'],8,50,50)},
 atardecer:{r:'proud',q:'¡Brillaste como el sol! 🌅',f:()=>{flash('fl-glow',1800);burst(['☀️','✨'],6,50,34)}},medianoche:{r:'proud',q:'¡Como una estrella fugaz! 🌠',f:()=>cross('🌠',10,1800)},
 cafe:{r:'cheer',q:'¡Eso merece una galletita! 🍪',f:()=>pop('🍪',50,16)},bosque:{r:'cheer',q:'¡Floreciste! 🌸🌿',f:()=>rain(['🌸','🍃'],10)}};
const OOPS={kawaii:{r:'oops',q:'¡Casi! No pasa nada, uwu 🌸',f:()=>pop('💧',68,22)},futurista:{r:'think',q:'Error 404 de respuesta… ¡reintentemos! 🔄',f:()=>glitch(400)},profesional:{r:'nod',q:'Casi. Revisemos el razonamiento juntos 🔍'},
 gamer:{r:'oops',q:'Game over… ¡pero hay revancha! 🔄',f:()=>pop('TRY AGAIN',50,16,'px')},anime:{r:'oops',q:'¡Ganbatte! La próxima sale seguro 💪',f:()=>pop('💦',70,22)},oceano:{r:'nod',q:'La marea sube y baja: ¡otra vez! 🌊'},
 atardecer:{r:'aww',q:'Todo se aprende con calma 🧡'},medianoche:{r:'aww',q:'Hasta las estrellas se equivocan de lugar a veces ✨'},cafe:{r:'sip',q:'Un traguito de café y lo intentamos de nuevo ☕'},bosque:{r:'aww',q:'Las plantas también crecen despacito 🌱'}};
/* Texto de «pensando…» de cada tema (mientras llega la respuesta de la IA) */
const THINK={kawaii:'pensando… 💭',futurista:'PROCESANDO ▮▮▯',profesional:'analizando…',gamer:'LOADING ▰▰▱',anime:'hmm… ¡ya casi! ✨',oceano:'buceando ideas 🫧',atardecer:'pensando con calma 🌇',medianoche:'consultando las estrellas ✨',cafe:'preparando la respuesta ☕',bosque:'preguntándole al búho 🦉'};
/* Estado de Lumi: «pensando» → pastilla del tema; «hablando» → ecualizador del tema */
function sync(){
  const s=$('#avatar svg'),st=s&&s.dataset.state;if(!ensure())return;
  let th=layer.querySelector('.tfx-think'),eq=layer.querySelector('.tfx-eq');
  if(st==='thinking'&&on()&&!calm()){if(!th){th=document.createElement('div');th.className='tfx-think';layer.appendChild(th)}const tx=THINK[theme]||THINK.kawaii;if(th.textContent!==tx)th.textContent=tx}else if(th)th.remove();
  if(st==='talking'&&on()&&!calm()){if(!eq){eq=document.createElement('div');eq.className='tfx-eq';for(let i=0;i<7;i++){const b=document.createElement('s');b.style.animationDelay=(-i*.13).toFixed(2)+'s';eq.appendChild(b)}layer.appendChild(eq)}}else if(eq)eq.remove()}
/* Aciertos y fallos: se detectan por las clases good/bad que ponen los ejercicios de la pizarra */
function watchBoard(){
  const sh=$('#sheet');if(!sh)return;let gT=0,good=false,bad=false;
  new MutationObserver(ms=>{ms.forEach(m=>{const t=m.target,c=t.className&&t.className.baseVal===undefined?String(t.className):'',o=m.oldValue||'';
      if(/\bgood\b/.test(c)&&!/\bgood\b/.test(o))good=true;if(/\bbad\b/.test(c)&&!/\bbad\b/.test(o))bad=true});
    if(!good&&!bad)return;clearTimeout(gT);gT=setTimeout(()=>{const isBad=bad,a=isBad?OOPS[theme]:WIN[theme];good=bad=false;if(a)setTimeout(()=>{LOG.push(isBad?'oops':'win');run(a)},500)},140)}).observe(sh,{subtree:true,attributes:true,attributeFilter:['class'],attributeOldValue:true})}
const LOG=[];
function run(a){
  if(!a||!on()||calm())return;lastAct=performance.now();
  try{if(a.f)a.f()}catch(e){}
  if(a.r&&typeof Avatar!=='undefined'&&Avatar.react)Avatar.react(a.r);
  if(a.q&&typeof Avatar!=='undefined'&&Avatar.onQuip)setTimeout(()=>{if(performance.now()-lastAct<4000)Avatar.onQuip(a.q,true)},700)}

/* Cada ~8 s decide si hace algo (en promedio una vez cada 30–40 s) y solo mientras estás por ahí */
function tick(){
  if(document.hidden||!on()||calm()||!ensure())return;
  const s=$('#avatar svg'),now=performance.now();
  if(!s||s.dataset.state!=='idle'||s.classList.contains('sleep'))return;
  if(now-lastUser>60000||now-lastAct<22000||Math.random()>.5)return;
  run(pick(ACTS[theme]||ACTS.kawaii))}

['pointerdown','keydown','input','touchstart'].forEach(e=>addEventListener(e,()=>{lastUser=performance.now()},{passive:true,capture:true}));
function boot(){
  ensure();
  const av=$('#avatar');if(av)new MutationObserver(()=>{if(!layer||layer.parentNode!==av)ensure()}).observe(av,{childList:true});
  new MutationObserver(()=>{const t=document.documentElement.dataset.theme;if(!t||t===theme)return;theme=t;build();setTimeout(()=>run(ENTER[theme]),700)}).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
  const cb=$('#sTfx');if(cb){cb.checked=on();cb.addEventListener('change',()=>{try{Store.set('tfx',cb.checked)}catch(e){}ensure()})}
  /* al tocar a Lumi, a veces (1 de cada 3, con pausa de 7 s) también hace algo de su tema */
  let tapAt=0;if(av)av.addEventListener('pointerup',()=>{const n=performance.now();if(n-tapAt<7000||Math.random()>.34||!on()||calm())return;tapAt=n;setTimeout(()=>{const sv=$('#avatar svg');if(sv&&!sv.classList.contains('sleep'))run(pick(ACTS[theme]||ACTS.kawaii))},650)});
  if(av)new MutationObserver(ms=>{if(ms.some(m=>!(m.target.closest&&m.target.closest('.tfx'))))sync()}).observe(av,{subtree:true,attributes:true,attributeFilter:['data-state'],childList:true});
  watchBoard();
  setInterval(tick,8000);booted=true}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
window.LumiThemeFx={run,acts:ACTS,log:LOG,sync};
})();
