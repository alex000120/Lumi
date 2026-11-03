/* Orquestación: pregunta → Gemini → pizarra + voz + avatar + monedas. */
(()=>{
const $=s=>document.querySelector(s);
/* Ajustes: S.provider elige el servicio de IA y S.cfg guarda key, modelo y dirección de cada servicio por separado. */
let S=(()=>{const o=Store.get('settings',{}),s={provider:'gemini',level:'secundaria',voice:true,spot:true,rate:1,pitch:1.1,voiceName:'',...o};s.cfg={...(o.cfg||{})};
  if(o.apiKey&&!s.cfg.gemini)s.cfg.gemini={key:o.apiKey,model:o.model};delete s.apiKey;delete s.model;if(!Gemini.PROVIDERS[s.provider])s.provider='gemini';return s})();
const cfg=()=>({provider:S.provider,...(S.cfg[S.provider]||{})});
const needKey=()=>{const c=cfg(),P=Gemini.prov(c);return !P.nokey&&!c.key};
let token=0,busy=false,fetching=false,quietPlay=false;
/* Rendimiento del alumno (solo local): últimos 12 ejercicios y temas donde falló. Se envía como 1 línea corta, sin llamadas extra. */
let perf=Store.get('perf',{r:[],weak:[]});
function perfAdd(ok){const t=String(lastQ||'').replace(/\s+/g,' ').slice(0,40);perf.r.push(ok?1:0);perf.r=perf.r.slice(-12);
  if(!ok&&t&&!perf.weak.includes(t))perf.weak.push(t);if(ok&&t&&!perf.r.slice(-3).includes(0))perf.weak=perf.weak.filter(x=>x!==t);perf.weak=perf.weak.slice(-4);Store.set('perf',perf)}
function perfText(){const n=perf.r.length;if(n<2)return '(aún sin datos)';const h=perf.r.reduce((x,y)=>x+y,0);return h+' de '+n+' ejercicios correctos.'+(perf.weak.length?' Temas con errores: '+perf.weak.map(x=>'«'+x+'»').join(', ')+'.':'')}
const strip=t=>String(t==null?'':t).replace(/<[^>]*>/g,' ').replace(/\*\*/g,''),clean=t=>Tex.text(strip(t)).replace(/\s+/g,' ').trim(),spoken=t=>Tex.speech(strip(t)).replace(/\s+/g,' ').trim();
let photos=[];
const status=t=>$('#status').textContent=t,sub=t=>$('#subtitle').textContent=t||'';

Avatar.mount($('#avatar'));Shop.init();
const rndOf=l=>l[Math.floor(Math.random()*l.length)];
/* Frases de Lumi cuando le haces cosquillas, la acaricias o la despiertas (con voz si la tienes activada). */
let qT=0,qN=0,qSpeak=false;
Avatar.onQuip=async(t,soft)=>{if(busy)return;const k=++qN;sub(t);clearTimeout(qT);
  if(S.voice&&!soft&&!qSpeak){qSpeak=true;const sp=spoken(t.replace(/[\u{1F300}-\u{1FAFF}\u2600-\u27BF]/gu,'')).trim();Avatar.talk(true,sp,S.rate,true);
    try{await Voice.speak(sp,{enabled:true,rate:S.rate,pitch:S.pitch,mood:'happy',name:S.voiceName,onBoundary:i=>Avatar.sync(i)})}catch(e){}
    qSpeak=false;if(!busy)Avatar.talk(false)}
  qT=setTimeout(()=>{if(!busy&&k===qN)sub('')},S.voice&&!soft?900:3200)};
/* Vínculo y racha: sube con clases, aciertos y mimos. Devuelve un texto si subió de nivel. */
function bondAdd(n){if(!Bond.add(n))return '';const i=Bond.info(),rw=10*i.lvl;Shop.earn(rw);
  setTimeout(()=>{Avatar.react('applause');if(Avatar.onQuip)Avatar.onQuip('¡Ya somos '+i.name.toLowerCase()+'! 💖',false)},1500);return '💖 ¡Nivel '+(i.lvl+1)+'! +'+rw+' 🪙'}
let touchXp=0;Avatar.onBond=()=>{if(touchXp<15){touchXp++;if(touchXp%3===0)bondAdd(1)}};
const bd=Bond.init();try{const M=[3,7,14,30,60,100];if(M.includes(bd.streak)&&Store.get('streakAnn',0)!==bd.streak){Store.set('streakAnn',bd.streak);setTimeout(()=>{if(Avatar.react)Avatar.react('cheer');if(Avatar.onQuip)Avatar.onQuip('🔥 ¡'+bd.streak+' días seguidos! Eres constante como una constante matemática 💜 +'+(bd.streak>=30?15:5)+' 🪙',true);try{Shop.earn(bd.streak>=30?15:5)}catch(e){}},7000)}}catch(e){}
if(bd.streak>=2)setTimeout(()=>{if(Avatar.onQuip)Avatar.onQuip('🔥 ¡Llevas '+bd.streak+' días seguidos estudiando conmigo!',true)},4200);
$('#q').addEventListener('input',()=>Avatar.typing());
[['🧬','Explícame la célula con dibujitos en la pizarra'],['📈','Grafica y = x² − 4 y marca las raíces'],['✏️','Desglosa la derivada de x³ paso a paso'],['🌐','Muéstrame en 3D la superficie z = sin(x)·cos(y)'],['🪐','Explícame el sistema solar con un visor 3D'],['📷','Sube una foto de tu tarea y te la explico']].forEach(([e,t],i)=>{
  const b=document.createElement('button');b.type='button';b.className='chip';b.innerHTML='<i></i><span></span>';b.firstChild.textContent=e;b.lastChild.textContent=t;
  b.onclick=()=>i===5?$('#photo').click():ask(t);$('#chips').appendChild(b);
});
function rest(){$('#stop').hidden=true;Avatar.talk(false);Avatar.live(false);Avatar.gesture('none');Avatar.express('neutral');Avatar.setState('idle')}
function stopAll(){token++;fetching=false;quietPlay=false;Director.cancel();Voice.stop();rest()}
/* h (opcional): ganchos del Director para sincronizar la pizarra con cada frase que se dice. */
async function say(text,mood,h){text=spoken(text);Avatar.setState('talking');Avatar.talk(true,text,S.rate,S.voice&&!quietPlay);Avatar.live(true);
  await Voice.speak(text,{enabled:S.voice&&!quietPlay,rate:S.rate,pitch:S.pitch,mood,name:S.voiceName,
    onBoundary:i=>{Avatar.sync(i);if(h)h.onBoundary(i)},onChunk:c=>Avatar.cue(c.text,c.kind),
    onChunkStart:c=>{if(h)h.onChunkStart(c)},onChunkEnd:(c,ms)=>{if(h)h.onChunkEnd(c,ms)}});Avatar.talk(false)}

function renderStrip(){
  const st=$('#photoStrip');st.innerHTML='';st.hidden=!photos.length;
  photos.forEach((p,i)=>{const w=document.createElement('div');w.className='ph';const im=new Image();im.src=p.url;im.alt='Foto adjunta';
    const x=document.createElement('button');x.type='button';x.textContent='×';x.setAttribute('aria-label','Quitar foto');x.onclick=()=>{photos.splice(i,1);renderStrip()};w.append(im,x);st.appendChild(w)});
  if(photos.length)$('#photoBtn').dataset.n=photos.length;else delete $('#photoBtn').dataset.n;
}
function loadImg(file){return new Promise((res,rej)=>{const u=URL.createObjectURL(file),im=new Image();
  im.onload=()=>{const k=Math.min(1,1280/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);
    const g=c.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,c.width,c.height);g.drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(u);
    const url=c.toDataURL('image/jpeg',.85);res({url,data:url.split(',')[1],mime:'image/jpeg'})};
  im.onerror=()=>{URL.revokeObjectURL(u);rej()};im.src=u})}
$('#photoBtn').onclick=()=>$('#photo').click();
$('#photo').onchange=async e=>{const fs=[...e.target.files];e.target.value='';
  for(const f of fs){if(photos.length>=3){status('Máximo 3 fotos por pregunta');break}try{photos.push(await loadImg(f))}catch(x){status('No pude leer esa foto (prueba con JPG o PNG)')}}
  renderStrip();if(photos.length){Avatar.react('gasp');status('¡Foto lista! Escribe qué quieres o toca Enviar')}};


/* v70: reacción de respaldo según el tipo de elemento de la pizarra; nunca en pasos seguidos y solo a veces. */
let lastAuto=-9;
function autoReact(s,i,n){
  if(i-lastAuto<2&&i>0)return null;
  const b=Array.isArray(s.board)?s.board:[];let r=null;
  for(const e of b){if(!e)continue;
    if(e.t==='box'&&e.kind==='warn')r='oops';
    else if(e.t==='box'&&e.kind==='try')r='peek';
    else if(e.t==='box'&&e.kind==='sum')r='proud';
    else if(e.t==='fix')r='oops';
    else if(e.t==='mnemonic')r='idea';
    else if(e.t==='quiz'||e.t==='tf'||e.t==='blank')r='think';
    if(r)break}
  if(!r&&i===n-1&&n>3)r='nod';
  if(r&&Math.random()<.8){lastAuto=i;return r}return null}
/* Reproduce los pasos de una clase (nueva o guardada). */
async function play(steps,my,fresh,quiet){
  quietPlay=!!quiet;status('Explicando…');
  for(let i=0;i<steps.length;i++){
    if(my!==token)return;const s=steps[i];
    if(i===0&&s.clear&&fresh){Board.clear();Board.stamp();Board.question(lastQ)}
    Avatar.express(s.mood||'happy');if(s.gesture)Avatar.gesture(s.gesture);
    /* v70: si la IA no pide reacción, la cara acompaña lo que se escribe en la pizarra (pregunta, error común, resumen…). */
    let rx=s.react&&s.react!=='none'?s.react:autoReact(s,i,steps.length);if(rx)Avatar.react(rx);
    /* La pizarra se escribe al ritmo de la voz: el Director dibuja cada elemento cuando Lumi llega a su frase. */
    const raw=String(s.say||''),D=Director.begin({text:spoken(raw),clean:clean(raw),board:s.board||[],sub,spot:S.spot!==false,rate:S.rate});
    const talking=say(raw,s.mood,D.hooks).then(()=>{if(my===token)D.speechEnded()});
    const minT=new Promise(r=>setTimeout(r,900));
    await Promise.all([talking,D.finished,minT]);
  }
  if(my!==token)return;
  quietPlay=false;Director.hide(1600);sub('');rest();Avatar.react('proud');
  if(fresh){Shop.earn(5);const bm=bondAdd(10);status('¡Muy bien! +5 🪙'+(bm?' · '+bm:'')+' · ¿Alguna duda?')}else status('Chat retomado · escribe para seguir');
}
let lastQ='';
/* Chats: cada chat guarda sus propios mensajes y la IA recibe SOLO el contexto del chat activo (así los chats no se mezclan).
   Se guardan en este dispositivo: puedes retomarlos más tarde, incluso sin perder el hilo, y repasarlos sin internet. */
const Chats=(()=>{
  let L=Store.get('chats',null);
  if(!L){L=(Store.get('classes',[])||[]).map(c=>({id:c.id,title:c.q,date:c.date,upd:c.date,turns:[{q:c.q,a:'',steps:c.steps}]}));Store.del('memory');Store.del('classes')}
  let act=L.find(c=>c.id===Store.get('chat.cur',null))||null;
  const sv=()=>{try{
    L.sort((x,y)=>String(y.upd).localeCompare(String(x.upd)));L=L.slice(0,12);
    const big=()=>JSON.stringify(L).length>3.5e6;
    if(big())L.forEach(c=>c.turns.forEach((t,i)=>{if(i<c.turns.length-2)delete t.steps}));
    while(L.length>1&&big())L.pop();
    Store.set('chats',L);Store.set('chat.cur',act&&L.includes(act)?act.id:null)}catch(e){}};
  sv();
  return{list:()=>L,cur:()=>act,
    start(title){const n=new Date().toISOString();return{id:Date.now(),title:String(title||'Chat').replace(/\s+/g,' ').slice(0,60),date:n,upd:n,turns:[]}},
    setCur(c){act=c||null;sv()},
    addTurn(c,q,a,steps){if(!L.includes(c))L.unshift(c);c.turns.push({q:String(q).slice(0,300),a,steps});c.turns=c.turns.slice(-30);c.upd=new Date().toISOString();sv()},
    ctx(c,n=8){const t=c?c.turns.slice(-n):[];return t.length?t.map(m=>`- Alumno: ${m.q}\n  Tú explicaste: ${m.a||'(clase guardada)'}`).join('\n'):'(primera pregunta de este chat)'},
    remove(c){L=L.filter(x=>x!==c);if(act===c)act=null;sv()},
    wipe(){L=[];act=null;Store.del('chats');Store.del('chat.cur');Store.del('classes')}};
})();
function syncChat(){const c=Chats.cur(),b=$('#chatBar');if(!b)return;const n=c?c.turns.length:0;b.hidden=!n;
  if(n)$('#chatTitle').textContent='Continuando: «'+c.title+'» · '+n+(n===1?' mensaje':' mensajes')}

/* Indicaciones extra según lo que pide el alumno (solo local, sin llamadas extra): ayudan a Lumi a elegir cómo enseñar. */
function lessonHint(t,imgs,chat){
  const s=String(t||'').toLowerCase().trim(),words=s?s.split(/\s+/).length:0,n=chat?chat.turns.length:0,h=[];
  if(imgs&&imgs.length)h.push('Hay foto: primero escribe en la pizarra lo que lees (datos y qué se pide), resuélvelo enseñando el método y deja un ejercicio parecido.');
  if(/no (te )?entend|no comprend|no me qued|otra vez|de nuevo|m[aá]s f[aá]cil|me confund|expl[ií]came mejor/.test(s))h.push('No entendió: NO repitas lo mismo. Normaliza, busca el prerrequisito que le falta, reexplica por otro camino (analogía, dibujo o ejemplo más simple) en pasos más chicos y termina comprobando con un ejercicio breve.');
  else if(n&&words<=7&&!/^(hola|buenas|gracias|ok|vale|listo)\b/.test(s))h.push('Parece una pregunta de seguimiento: continúa el hilo de este chat sin repetir lo ya explicado y profundiza justo en lo que pregunta.');
  if(/examen|simulacro|ponme a prueba|ev[aá]lua|eval[uú]ame|hazme (un )?(test|quiz|examen)/.test(s))h.push('MODO EXAMEN: una pregunta por paso, de fácil a difícil (recordar, aplicar, analizar), sin revelar las respuestas al plantearlas, y un cierre con lo que domina y lo que debe repasar.');
  else if(/prueba|control|repasar|repaso|estudiar|quiz/.test(s))h.push('Prepara una mini sesión de estudio: resumen, regla mnemotécnica y práctica variada para recordar (flash, match, quiz).');
  if(/resuelve|resolver|calcula|calcular|halla|hallar|ejercicio|problema/.test(s))h.push('Resuelve con método, comprueba el resultado y deja un ejercicio parecido para que lo intente.');
  if(/soy (muy )?(malo|mala|tonto|tonta|torpe)|me rindo|estoy frustrad|no puedo m[aá]s|odio (esto|las|los|la|el)\b/.test(s))h.push('El alumno se siente frustrado: valídalo con calidez, baja un peldaño, usa pasos muy pequeños y celebra un logro real suyo.');
  if(/^(hola|buenas|hey|hello|hi)\b/.test(s)&&words<=4)h.push('Es un saludo: responde en 1 o 2 pasos, cálida y breve, y ofrece 2 o 3 temas concretos para empezar.');
  return h.length?'\n\nIndicaciones para esta consulta: '+h.join(' '):'';
}

/* Descripción corta del nivel elegido, bajo el menú de Ajustes. */
const LV_TXT={primaria:'Frases muy cortas, muchos dibujos y juegos, y tono alegre.',secundaria:'Intuición primero y luego el método, con ejemplos de la vida diaria.',bachillerato:'Más rigor: el porqué de cada resultado, notación formal y problemas de varios pasos.',universidad:'Terminología técnica, definiciones formales, demostraciones y problemas de análisis.'};
function lvHint(){const e=$('#sLevelHint'),l=$('#sLevel');if(e&&l)e.textContent=LV_TXT[l.value]||''}
{const l=$('#sLevel');if(l)l.addEventListener('change',lvHint)}

async function ask(text){
  text=(text||'').trim();const imgs=photos.slice();if(!text&&!imgs.length)return;
  if(fetching){status('Lumi aún está pensando… espera un momento o toca ⏹');return}
  if(!navigator.onLine){status('Sin internet');Board.note('No hay internet, así que no puedo preparar una clase nueva. Toca el libro 📖 para repasar tus clases guardadas.');return}
  if(needKey()){openSettings('Elige tu servicio de IA y pega tu API key para empezar (con Gemini es gratis).');return}
  try{Avatar.heard&&Avatar.heard(text)}catch(e){}
  stopAll();const my=token;busy=true;fetching=true;$('#stop').hidden=false;$('#empty').style.display='none';$('#q').value='';
  /* El chat se fija AL ENVIAR: la respuesta se guarda siempre en este chat, aunque luego cambies de chat. */
  let chat=Chats.cur();if(!chat){chat=Chats.start(text||'Clase con foto');Chats.setCur(chat)}
  photos=[];renderStrip();const shown=text||'(te mandé una foto)',showQ=()=>{Board.question(shown);if(imgs.length)Board.photo(imgs.map(i=>i.url))};
  lastQ=shown;Board.stamp();showQ();Avatar.react(imgs.length?'gasp':'think');status(imgs.length?'Mirando tu foto…':'Pensando…');sub('');
  try{
    const ctx=Chats.ctx(chat);
    const out=await Gemini.ask({settings:cfg(),onModel:m=>{S.cfg[S.provider]={...(S.cfg[S.provider]||{}),model:m};Store.set('settings',S);if(my===token)Board.note('El modelo que tenías ya no está disponible, así que usé «'+m+'» y lo dejé guardado.')},images:imgs,prompt:`Nivel del alumno: ${S.level}.\nPerfil del nivel: ${Gemini.levelGuide(S.level)}\nRendimiento reciente: ${perfText()}\n\nHistorial de ESTE chat (úsalo como contexto y continúa el hilo; no mezcles temas de otros chats):\n${ctx}\n\nLo que hay ahora en la pizarra: ${Board.summary()||'(vacía)'}\n\nPregunta del alumno: ${text||'(sin texto)'}${imgs.length?`\n\nEl alumno adjuntó ${imgs.length} foto(s): míralas con atención, deduce qué quiere aprender o resolver y enséñaselo.`:''}${lessonHint(text,imgs,chat)}`});
    const steps=(out&&out.steps)||[],sum=steps.map(s=>clean(s.say)).join(' ').slice(0,420);
    /* Si cambiaste de chat mientras llegaba la respuesta, se guarda en SU chat sin tocar la pizarra actual. */
    if(my!==token){if(steps.length&&chat!==Chats.cur())Chats.addTurn(chat,text||'[foto]',sum,steps);return}
    fetching=false;
    if(!steps.length)throw new Error('No pude armar la explicación. Inténtalo de nuevo.');
    Chats.addTurn(chat,text||'[foto]',sum,steps);syncChat();
    await play(steps,my,true);
  }catch(e){
    if(my===token){fetching=false;if(!chat.turns.length&&Chats.cur()===chat){Chats.setCur(null);syncChat()}rest();status('Algo falló');Board.note(e.message||'No pude responder. Inténtalo de nuevo.');if(/key/i.test(e.message||''))openSettings(e.message)}
  }finally{if(my===token)busy=false}
}

$('#form').onsubmit=e=>{e.preventDefault();ask($('#q').value)};
$('#stop').onclick=()=>{stopAll();busy=false;sub('');status('Lista para enseñarte');Avatar.event('stop')};
$('#newClass').onclick=()=>{stopAll();busy=false;photos=[];renderStrip();Chats.setCur(null);lastQ='';Board.clear();$('#empty').style.display='';syncChat();sub('');status('Chat nuevo · empezamos de cero');Avatar.event('newchat')};
if($('#chatNew'))$('#chatNew').onclick=()=>$('#newClass').click();
syncChat();
$('#mic').onclick=()=>{stopAll();busy=false;Voice.listen({
  onStart:()=>{$('#mic').classList.add('listening');status('Te escucho…');Avatar.listen(true)},onEnd:()=>{$('#mic').classList.remove('listening');Avatar.listen(false)},
  onResult:t=>{$('#q').value=t;ask(t)},onError:m=>{$('#mic').classList.remove('listening');Avatar.listen(false);status(m)}})};

let qStreak=0;
Board.onQuiz=ok=>{qStreak=ok?qStreak+1:0;perfAdd(ok);
  if(ok&&qStreak%3===0){Avatar.react('dance');Shop.earn(8);bondAdd(6);status('¡Racha de '+qStreak+' aciertos! +8 🪙 🔥')}
  else{Avatar.react(ok?rndOf(['cheer','wow','proud','applause']):rndOf(['oops','shy']));if(ok){Shop.earn(3);const m=bondAdd(4);status('¡Correcto! +3 🪙'+(m?' · '+m:''))}else status('Casi… repasemos juntos')}};
$('#hand').onclick=async()=>{stopAll();busy=false;Avatar.express('happy');Avatar.gesture('open');status('Te escucho: dime tu duda');sub('¡Claro! Dime tu duda.');$('#q').focus();await say('¡Claro! Dime tu duda.');rest();sub('')};
const xd=$('#exportDlg');$('#exportBtn').onclick=()=>{$('#expNote').textContent='Guarda toda la pizarra tal como está ahora.';xd.showModal()};$('#expClose').onclick=()=>xd.close();
xd.querySelectorAll('[data-f]').forEach(b=>b.onclick=async()=>{const n=$('#expNote');n.textContent='Generando…';try{await Export[b.dataset.f]();n.textContent='¡Listo! Revisa tus descargas.'}catch(e){n.textContent=e.message||'No pude exportar.'}});
const isFS=()=>document.fullscreenElement||document.webkitFullscreenElement;
$('#fsBtn').onclick=async()=>{const el=document.documentElement;try{
  if(isFS())await(document.exitFullscreen||document.webkitExitFullscreen).call(document);
  else{const f=el.requestFullscreen||el.webkitRequestFullscreen;if(!f){status('Tu navegador no permite pantalla completa. En el menú elige «Añadir a pantalla de inicio».');return}await f.call(el,{navigationUI:'hide'})}
}catch(e){status('No pude activar la pantalla completa')}};
['fullscreenchange','webkitfullscreenchange'].forEach(ev=>document.addEventListener(ev,()=>{const on=!!isFS(),b=$('#fsBtn');b.classList.toggle('on',on);b.querySelector('use').setAttribute('href',on?'#i-shrink':'#i-expand');b.title=on?'Salir de pantalla completa':'Pantalla completa'}));
const td=$('#themeDlg');
function themeCards(){const g=$('#themeGrid');g.innerHTML='';Theme.list.forEach(t=>{const b=document.createElement('button');b.type='button';b.className='tcard'+(t.id===Theme.id?' on':'');
  b.innerHTML='<span class="sw"></span><b></b><small></small>';b.querySelector('.sw').style.background=t.sw;b.querySelector('.sw').textContent=t.e;b.querySelector('b').textContent=t.n;b.querySelector('small').textContent=t.d;
  b.onclick=()=>{Theme.set(t.id);themeCards();Avatar.react('love');status('Tema '+t.n+' activado')};g.appendChild(b)})}
$('#themeBtn').onclick=()=>{themeCards();td.showModal()};$('#themeClose').onclick=()=>td.close();
const dlg=$('#settings');
function fillVoices(){
  const sel=$('#sVName');sel.innerHTML='<option value="">Automática</option>';
  Voice.voices().forEach(v=>{const o=document.createElement('option');o.value=o.textContent=v.name;sel.appendChild(o)});sel.value=S.voiceName;
}
let sp='gemini',draft={};
const fillProv=()=>{const g=$('#sProv');g.innerHTML='';Object.entries(Gemini.PROVIDERS).forEach(([k,p])=>g.appendChild(new Option(p.n,k)))};
const readF=()=>({key:$('#sKey').value.trim(),model:$('#sModel').value.trim(),base:$('#sBase').value.trim()});
function setModels(ids,cur){const g=$('#sModelSel');g.innerHTML='';g.appendChild(new Option(ids.length?'— elige un modelo —':'— toca «Cargar modelos» —',''));ids.forEach(id=>g.appendChild(new Option(id,id)));g.value=ids.includes(cur)?cur:''}
function showProv(k){const P=Gemini.PROVIDERS[k],c=draft[k]||{};
  $('#sProvHint').textContent=P.hint||'';const l=$('#sKeyLink');l.hidden=!P.link;if(P.link)l.href=P.link;
  $('#sKey').value=c.key||'';$('#sKey').disabled=!!P.nokey;$('#sKey').placeholder=P.nokey?'No hace falta key':'Pega tu key…';
  $('#sBaseWrap').hidden=!(k==='local'||k==='custom');$('#sBase').value=c.base||P.base||'';
  const m=c.model||P.def||'';$('#sModel').value=m;setModels(m?[m]:[],m);$('#sTest').textContent=''}
function openSettings(note){
  draft=JSON.parse(JSON.stringify(S.cfg));sp=S.provider;fillProv();$('#sProv').value=sp;showProv(sp);
  $('#sLevel').value=S.level;lvHint();$('#sVoice').checked=S.voice;$('#sSpot').checked=S.spot!==false;$('#sRate').value=S.rate;$('#sPitch').value=S.pitch;fillVoices();
  $('#sNote').textContent=note||'Tu API key se guarda solo en este dispositivo.';dlg.showModal();
}
$('#sProv').onchange=e=>{draft[sp]=readF();sp=e.target.value;showProv(sp)};
$('#sModelSel').onchange=e=>{if(e.target.value)$('#sModel').value=e.target.value};
$('#sLoad').onclick=async()=>{
  const c={provider:sp,...readF()},P=Gemini.PROVIDERS[sp],t=$('#sTest');
  if(!c.key&&!P.nokey){t.textContent='Primero pega tu API key.';return}
  if(!c.base&&!P.base&&P.kind==='openai'){t.textContent='Primero escribe la dirección del servicio.';return}
  t.textContent='Buscando modelos disponibles…';
  try{const L=await Gemini.models(c);if(!L.length)throw new Error('El servicio no devolvió modelos.');
    const ids=L.map(m=>m.id),cur=c.model,pick=ids.includes(cur)?cur:Gemini.best(L,c);
    setModels(ids,pick);$('#sModel').value=pick;
    t.textContent='✓ Funciona · '+ids.length+' modelos disponibles'+(cur&&cur!==pick?' · «'+cur+'» ya no está disponible, elegí «'+pick+'»':'');
  }catch(e){t.textContent='✗ '+Gemini.friendly(e,c,c.model).message}
};
$('#sKey').onchange=()=>{if($('#sKey').value.trim())$('#sLoad').click()};
$('#openSettings').onclick=()=>openSettings();
$('#sform').onsubmit=()=>{draft[sp]=readF();const P=Gemini.PROVIDERS[sp];if(!draft[sp].model&&P.def)draft[sp].model=P.def;
  S={...S,provider:sp,cfg:draft,level:$('#sLevel').value,voice:$('#sVoice').checked,spot:$('#sSpot').checked,rate:+$('#sRate').value,pitch:+$('#sPitch').value,voiceName:$('#sVName').value};Store.set('settings',S);status('Lista para enseñarte')};
$('#sVTest').onclick=async()=>{stopAll();busy=false;const old=S;S={...S,voice:true,rate:+$('#sRate').value,pitch:+$('#sPitch').value,voiceName:$('#sVName').value};
  try{await say('¡Hola! Soy Lumi. ¿Listo para aprender algo increíble hoy? Mira, ¡esto te va a encantar!','excited')}finally{S=old;rest()}};
$('#wipe').onclick=()=>{Chats.wipe();perf={r:[],weak:[]};Store.del('perf');syncChat();status('Memoria y chats borrados')};
if(window.speechSynthesis)speechSynthesis.onvoiceschanged=fillVoices;
setTimeout(()=>{Avatar.express('happy');Avatar.gesture('wave');Avatar.greet();setTimeout(()=>Avatar.gesture('none'),2800)},700);
if(needKey())setTimeout(()=>openSettings('Bienvenido. Elige tu servicio de IA y pega tu API key (con Gemini es gratis).'),900);

/* Mis clases (offline) */
const cd=$('#classesDlg');
function openChat(c){cd.close();stopAll();Chats.setCur(c);const last=c.turns[c.turns.length-1],my=token,n=c.turns.length;busy=true;
  $('#empty').style.display='none';Board.clear();Board.stamp();lastQ=last.q;Board.question(last.q);syncChat();
  Board.note('💬 Retomaste este chat ('+n+(n===1?' mensaje':' mensajes')+'). Sigo con todo lo que hablamos: escribe tu siguiente pregunta.');
  if(last.steps)play(last.steps,my,false,true).finally(()=>{if(my===token)busy=false});else{busy=false;status('Chat retomado · escribe para seguir')}}
function classList(){const g=$('#classList');g.innerHTML='';const L=Chats.list().filter(c=>c.turns.length);
  if(!L.length){const p=document.createElement('p');p.className='hint';p.textContent='Aún no hay chats guardados. Haz una pregunta y aparecerá aquí.';g.appendChild(p);return}
  L.forEach(c=>{const row=document.createElement('div');row.style.cssText='display:flex;gap:6px;align-items:stretch';
    const b=document.createElement('button');b.type='button';b.className='card';b.style.cssText='text-align:left;padding:10px 12px;flex:1;min-width:0';
    const t=document.createElement('b');t.textContent=(c===Chats.cur()?'💬 ':'')+c.title;const d=document.createElement('small');
    d.textContent=new Date(c.upd).toLocaleString('es',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})+' · '+c.turns.length+(c.turns.length===1?' mensaje':' mensajes');
    b.append(t,document.createElement('br'),d);b.onclick=()=>openChat(c);
    const x=document.createElement('button');x.type='button';x.className='card';x.textContent='✕';x.title='Borrar este chat';x.setAttribute('aria-label','Borrar este chat');x.style.cssText='padding:0 14px';
    x.onclick=()=>{Chats.remove(c);syncChat();classList()};row.append(b,x);g.appendChild(row)})}
$('#classesBtn').onclick=()=>{classList();cd.showModal()};$('#classClose').onclick=()=>cd.close();$('#classWipe').onclick=()=>{Chats.wipe();syncChat();classList()};

/* Instalar como app (PWA) + modo sin conexión */
const standalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
let installEv=null;const ib=$('#installBtn'),idg=$('#installDlg');
if(!standalone())ib.hidden=false;
addEventListener('beforeinstallprompt',e=>{e.preventDefault();installEv=e;if(!standalone())ib.hidden=false});
addEventListener('appinstalled',()=>{installEv=null;ib.hidden=true;status('¡Lumi instalada! 🎉');Avatar.react('cheer')});
ib.onclick=async()=>{if(installEv){installEv.prompt();try{await installEv.userChoice}catch(e){}installEv=null;return}
  $('#installNote').textContent='Tu navegador no mostró el instalador automático; sigue estos pasos:';idg.showModal()};
$('#installClose').onclick=()=>idg.close();
const net=()=>{const off=!navigator.onLine;document.body.classList.toggle('offline',off);if(off&&!busy)status('Sin internet · puedes repasar tus clases 📖');else if(!off&&!busy)status('Lista para enseñarte')};
addEventListener('online',net);addEventListener('offline',net);net();
addEventListener('offline',()=>Avatar.event('offline'));addEventListener('online',()=>Avatar.event('online'));
if('serviceWorker' in navigator&&location.protocol!=='file:')addEventListener('load',()=>navigator.serviceWorker.register('sw.js').then(r=>{
  r.addEventListener('updatefound',()=>{const w=r.installing;w&&w.addEventListener('statechange',()=>{if(w.state==='installed'&&navigator.serviceWorker.controller)status('Hay una versión nueva: recarga para actualizar')})})}).catch(()=>{}));
})();

/* v70: tocar un elemento de la pizarra lo marca con marcador (para subrayar lo importante al estudiar). */
(function(){const b=document.getElementById('board');if(b)b.addEventListener('click',e=>{if(e.target.closest('button,summary,a,input,textarea,svg,canvas,details'))return;const t=e.target.closest('.it');if(t&&b.contains(t))t.classList.toggle('pin')})})();
