/* Minireproductor de música y videos (js/player.js + css/player.css).
   YouTube por enlace (API oficial de iframe), enlaces directos a audio/video y archivos de tu dispositivo (no se suben a ningún lado).
   Flotante, arrastrable y minimizable. Baja el volumen solo cuando Lumi habla o te escucha, y Lumi/Pip reaccionan a la música.
   Todo ocurre en el navegador (cero créditos de IA). */
(()=>{
const $=s=>document.querySelector(s),pick=a=>a[Math.floor(Math.random()*a.length)];
const calm=()=>{try{return matchMedia('(prefers-reduced-motion:reduce)').matches}catch(e){return false}};
const get=(k,d)=>{try{return Store.get(k,d)}catch(e){return d}},set=(k,v)=>{try{Store.set(k,v)}catch(e){}};
const S={items:[],idx:-1,vol:70,open:false,mode:'full',pos:null,shuf:false,rep:'all',spd:1,mute:false,...get('mp',{})};
S.items=(Array.isArray(S.items)?S.items:[]).filter(i=>i&&i.t!=='file');S.idx=-1;
const save=()=>set('mp',{items:S.items.filter(i=>i.t!=='file').map(({id,t,ref,list,title,kind})=>({id,t,ref,list,title,kind})),vol:S.vol,open:S.open,mode:S.mode,pos:S.pos,shuf:S.shuf,rep:S.rep,spd:S.spd,mute:S.mute});
let root,yt=null,ytReady=false,ytPending=null,ytLoading=null,cur=null,playing=false,duck=1,duckTo=1,duckT=0,talk=false,listen=false,seeking=false,pollT=0,noteT=0,reactT=0,uid=Date.now(),greeted=false;
const fmt=s=>{s=Math.max(0,Math.floor(s||0));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* --- v70: aleatorio, repetir, velocidad, silencio, temporizador de estudio, teclado y controles del sistema --- */
const SPD=[.75,1,1.25,1.5,2],SLP=[0,15,25,45,60],REP=['all','one','off'],MODES=['full','bar','pill'];
const REPI={all:'🔁',one:'🔂',off:'➡️'},REPT={all:'Repetir toda la lista',one:'Repetir esta canción',off:'No repetir'},MI={full:'🎬',bar:'🎧',pill:'📌'},MT={full:'vista con video',bar:'vista solo audio',pill:'vista mini'};
if(!SPD.includes(S.spd))S.spd=1;if(!REP.includes(S.rep))S.rep='all';if(!MODES.includes(S.mode))S.mode='full';
let sl={t:0,end:0,mins:0},fade=1,fadeT=0,clrT=0;
function nextIdx(){const n=S.items.length;if(S.shuf&&n>1){let j;do{j=Math.floor(Math.random()*n)}while(j===S.idx);return j}return(S.idx+1)%n}
function ended(){
  if(S.rep==='one'&&cur){if(cur.t==='yt'){try{yt.seekTo(0,true);yt.playVideo()}catch(e){}}else{const v=$('#mpV');v.currentTime=0;v.play().catch(()=>{})}return}
  if(S.rep==='off'&&!S.shuf&&S.idx>=S.items.length-1){setPlaying(false);return}
  next()}
function applySpd(){try{const v=$('#mpV');if(v){v.defaultPlaybackRate=S.spd;v.playbackRate=S.spd}}catch(e){}try{if(yt&&ytReady&&yt.setPlaybackRate)yt.setPlaybackRate(S.spd)}catch(e){}}
function ui(){if(!root)return;const t=(id,f)=>{const e=$(id);if(e)f(e)};
  t('#mpShuf',e=>{e.classList.toggle('on',S.shuf);e.setAttribute('aria-pressed',String(S.shuf));e.title=S.shuf?'Aleatorio: activado':'Aleatorio: desactivado'});
  t('#mpRep',e=>{e.textContent=REPI[S.rep];e.title=REPT[S.rep];e.setAttribute('aria-label',REPT[S.rep]);e.classList.toggle('on',S.rep!=='off')});
  t('#mpSpd',e=>{e.textContent=S.spd+'x';e.classList.toggle('on',S.spd!==1)});
  t('#mpMute',e=>{e.textContent=S.mute?'🔇':'🔊';e.setAttribute('aria-pressed',String(S.mute));e.title=S.mute?'Quitar el silencio':'Silenciar'});
  t('#mpSl',e=>{const m=sl.mins?Math.max(1,Math.ceil((sl.end-Date.now())/60000)):0;e.textContent=m?'⏲'+m+"'":'⏲';e.classList.toggle('on',!!m);e.title=m?'Temporizador: se detiene en '+m+' min (toca para cambiar)':'Temporizador de estudio: 15, 25 (pomodoro), 45 o 60 min';e.setAttribute('aria-label',e.title)});
  t('#mpBt',e=>{const o=window.BeatFX?BeatFX.on():true;e.classList.toggle('on',o);e.setAttribute('aria-pressed',String(o));e.title=o?'La pizarra late con la música: activado':'La pizarra late con la música: desactivado';e.setAttribute('aria-label',e.title)});
  t('#mpMode',e=>{e.textContent=MI[S.mode];e.title='Vista actual: '+MT[S.mode]+' (toca para cambiar)'})}
function meta(){try{if(cur&&'mediaSession' in navigator&&window.MediaMetadata)navigator.mediaSession.metadata=new MediaMetadata({title:cur.title||'Aula Lumi',artist:'Estudiando con Lumi',album:'Aula Lumi'})}catch(e){}}
function startSleep(m){clearInterval(sl.t);sl.t=0;clearInterval(fadeT);fade=1;applyVol();sl.mins=m;
  if(m){sl.end=Date.now()+m*60000;sl.t=setInterval(()=>{if(sl.end-Date.now()<=0){clearInterval(sl.t);sl.t=0;sleepEnd()}ui()},1000)}ui()}
function sleepEnd(){const m=sl.mins;sl.mins=0;ui();let k=0;clearInterval(fadeT);
  fadeT=setInterval(()=>{k++;fade=Math.max(0,1-k/20);applyVol();if(k<20)return;clearInterval(fadeT);if(playing)toggle();setTimeout(()=>{fade=1;applyVol()},500);
    try{if(typeof Avatar!=='undefined'){Avatar.react(m===25?'proud':'sigh');if(Avatar.onQuip)Avatar.onQuip(m===25?'🍅 ¡Pomodoro listo! Descansa 5 minutos, estírate y volvemos':'Se acabó el tiempo de música… ¡buen trabajo hoy! 💤',true)}}catch(e){}},100)}
function clearAll(){const b=$('#mpClr');if(!S.items.length)return;
  if(!clrT){b.textContent='¿Vaciar?';clrT=setTimeout(()=>{clrT=0;b.textContent='🗑'},3000);return}
  clearTimeout(clrT);clrT=0;b.textContent='🗑';S.items.forEach(i=>{if(i.t==='file')try{URL.revokeObjectURL(i.ref)}catch(e){}});
  stopAll();cur=null;S.idx=-1;S.items=[];setPlaying(false);save();render()}
function keys(e){
  if(e.altKey&&!e.ctrlKey&&!e.metaKey&&String(e.key).toLowerCase()==='p'){e.preventDefault();toggle();return}
  if(!root||root.hidden||!root.contains(document.activeElement)||e.ctrlKey||e.metaKey||e.altKey)return;
  const t=e.target,isIn=t.matches&&t.matches('input'),isBtn=t.matches&&t.matches('button');if(isIn&&!(t.type==='range'))return;
  const k=e.key,K=String(k).toLowerCase();
  if(k===' '&&!isBtn&&!isIn){e.preventDefault();toggle()}
  else if((k==='ArrowRight'||k==='ArrowLeft')&&!isIn){e.preventDefault();seek(Math.max(0,pos()+(k==='ArrowRight'?5:-5)))}
  else if((k==='ArrowUp'||k==='ArrowDown')&&!isIn){e.preventDefault();S.vol=Math.min(100,Math.max(0,S.vol+(k==='ArrowUp'?5:-5)));$('#mpVol').value=S.vol;if(S.mute)S.mute=false;applyVol();ui();save()}
  else if(!isIn&&K==='m'){S.mute=!S.mute;applyVol();ui();save()}
  else if(!isIn&&K==='n')next();else if(!isIn&&K==='p')prev();else if(!isIn&&K==='s'){S.shuf=!S.shuf;ui();save()}}

/* --- enlaces --- */
function parseYT(s){let u;try{u=new URL(String(s).trim())}catch(e){return null}
  const h=u.hostname.replace(/^www\.|^m\./,'');let id=null;const list=u.searchParams.get('list');
  if(h==='youtu.be')id=u.pathname.slice(1).split('/')[0];
  else if(h==='youtube.com'||h==='youtube-nocookie.com'||h==='music.youtube.com'){
    if(u.pathname==='/watch')id=u.searchParams.get('v');else{const m=u.pathname.match(/^\/(shorts|embed|live|v)\/([\w-]{6,})/);if(m)id=m[2]}}
  else return null;
  if(id&&!/^[\w-]{6,}$/.test(id))id=null;if(!id&&!(list&&/^[\w-]{6,}$/.test(list)))return null;
  return{id,list:id?null:list}}
const AUD=/\.(mp3|m4a|ogg|oga|wav|aac|flac|opus)(\?.*)?$/i,VID=/\.(mp4|webm|ogv|mov|m4v)(\?.*)?$/i;

/* --- interfaz --- */
function build(){
  if(root)return;root=document.createElement('div');root.id='mp';root.className='mp';root.hidden=!S.open;root.dataset.mode=S.mode;
  root.setAttribute('role','region');root.setAttribute('aria-label','Minireproductor de música y videos');
  root.innerHTML=`<div class="mp-h" id="mpH"><span class="mp-t" id="mpT">🎵 Música y videos</span>
    <button type="button" class="mp-hp" id="mpHp" title="Anterior" aria-label="Anterior">⏮</button><button type="button" class="mp-hp" id="mpHpl" title="Reproducir o pausar" aria-label="Reproducir o pausar">▶</button><button type="button" class="mp-hp" id="mpHn" title="Siguiente" aria-label="Siguiente">⏭</button>
    <button type="button" id="mpMode" title="Cambiar la vista" aria-label="Cambiar la vista">🎬</button>
    <button type="button" id="mpMin" title="Cerrar (la música sigue sonando)" aria-label="Cerrar el reproductor">✕</button></div>
  <div class="mp-pg" aria-hidden="true"><i id="mpPg"></i></div>
  <div class="mp-m" id="mpM"><div class="mp-yt" id="mpYw" hidden><div id="mpYT"></div></div><video id="mpV" playsinline hidden></video>
    <div class="mp-disc" id="mpDisc" hidden><b>🎵</b></div>
    <div class="mp-eq" id="mpEq" hidden><i></i><i></i><i></i><i></i><i></i></div><p class="mp-msg" id="mpMsg">Pega un enlace de YouTube o abre tus archivos</p></div>
  <div class="mp-c"><button type="button" id="mpShuf" aria-pressed="false">🔀</button><button type="button" id="mpPrev" title="Anterior" aria-label="Anterior">⏮</button><button type="button" id="mpPlay" class="big" title="Reproducir o pausar" aria-label="Reproducir o pausar">▶</button><button type="button" id="mpNext" title="Siguiente" aria-label="Siguiente">⏭</button><button type="button" id="mpRep">🔁</button></div>
  <div class="mp-s"><input type="range" id="mpSeek" min="0" max="1000" value="0" aria-label="Posición"><span class="mp-time" id="mpTime">0:00</span></div>
  <div class="mp-c2"><button type="button" id="mpMute" aria-pressed="false">🔊</button><input type="range" id="mpVol" min="0" max="100" aria-label="Volumen"><button type="button" id="mpSpd" title="Velocidad" aria-label="Velocidad">1x</button><button type="button" id="mpSl">⏲</button><button type="button" id="mpBt" aria-pressed="true">🥁</button><button type="button" id="mpList" title="Ver la lista" aria-label="Ver la lista">☰</button><button type="button" id="mpClr" title="Vaciar la lista" aria-label="Vaciar la lista">🗑</button></div>
  <ul class="mp-pl" id="mpPl"></ul>
  <form class="mp-add" id="mpAdd" autocomplete="off"><input id="mpIn" placeholder="Enlace de YouTube o .mp3 / .mp4…" aria-label="Pega un enlace"><button type="submit" title="Agregar" aria-label="Agregar">＋</button>
    <button type="button" id="mpFile" title="Abrir archivos de tu dispositivo" aria-label="Abrir archivos">📁</button><input type="file" id="mpFl" accept="audio/*,video/*" multiple hidden></form>`;
  document.body.appendChild(root);
  $('#mpVol').value=S.vol;
  const v=$('#mpV');
  v.addEventListener('ended',ended);v.addEventListener('play',()=>setPlaying(true));v.addEventListener('pause',()=>{if(cur&&cur.t!=='yt')setPlaying(false)});
  v.addEventListener('error',()=>{if(cur&&cur.t!=='yt'){msg('No pude reproducir este archivo');setPlaying(false)}});
  $('#mpPlay').onclick=toggle;$('#mpNext').onclick=next;$('#mpPrev').onclick=prev;
  $('#mpMin').onclick=()=>show(false);
  $('#mpMode').onclick=()=>{S.mode=MODES[(MODES.indexOf(S.mode)+1)%MODES.length];root.dataset.mode=S.mode;ui();save();place()};
  $('#mpList').onclick=()=>root.classList.toggle('nolist');
  $('#mpVol').oninput=e=>{S.vol=+e.target.value;if(S.mute){S.mute=false;ui()}applyVol();save()};
  const sk=$('#mpSeek');sk.oninput=()=>{seeking=true;const d=dur();if(d)$('#mpTime').textContent=fmt(sk.value/1000*d)+' / '+fmt(d)};
  sk.onchange=()=>{const d=dur();if(d)seek(sk.value/1000*d);seeking=false};
  $('#mpAdd').onsubmit=e=>{e.preventDefault();addLink($('#mpIn').value);$('#mpIn').value=''};
  $('#mpFile').onclick=()=>$('#mpFl').click();
  $('#mpFl').onchange=e=>{addFiles([...e.target.files]);e.target.value=''};
  $('#mpHp').onclick=prev;$('#mpHpl').onclick=toggle;$('#mpHn').onclick=next;
  $('#mpShuf').onclick=()=>{S.shuf=!S.shuf;ui();save()};
  $('#mpRep').onclick=()=>{S.rep=REP[(REP.indexOf(S.rep)+1)%REP.length];ui();save()};
  $('#mpSpd').onclick=()=>{S.spd=SPD[(SPD.indexOf(S.spd)+1)%SPD.length];applySpd();ui();save()};
  $('#mpMute').onclick=()=>{S.mute=!S.mute;applyVol();ui();save()};
  $('#mpSl').onclick=()=>startSleep(SLP[(SLP.indexOf(sl.mins)+1)%SLP.length]);
  $('#mpClr').onclick=clearAll;
  $('#mpBt').onclick=()=>{if(window.BeatFX)BeatFX.toggle();ui()};
  root.addEventListener('dragover',e=>{e.preventDefault();root.classList.add('dz')});root.addEventListener('dragleave',()=>root.classList.remove('dz'));
  root.addEventListener('drop',e=>{e.preventDefault();root.classList.remove('dz');const fs=[...((e.dataTransfer&&e.dataTransfer.files)||[])];if(fs.length)addFiles(fs);else{const t=e.dataTransfer&&e.dataTransfer.getData('text');if(t)addLink(t)}});
  drag();render();ui();place();
}
function msg(t){const m=$('#mpMsg');if(m){m.textContent=t||'';m.hidden=!t}}
function show(b){S.open=b;build();root.hidden=!b;save();const bt=$('#mpBtn');if(bt)bt.setAttribute('aria-pressed',String(b));if(b)place()}

/* --- posición y arrastre --- */
function place(){
  if(!root)return;const w=root.offsetWidth||320,h=root.offsetHeight||300,W=innerWidth,H=innerHeight;
  if(S.pos){const x=Math.min(Math.max(4,S.pos.x),Math.max(4,W-w-4)),y=Math.min(Math.max(4,S.pos.y),Math.max(4,H-60));Object.assign(root.style,{left:x+'px',top:y+'px',right:'auto',bottom:'auto'})}
  else Object.assign(root.style,{left:'',top:'',right:'',bottom:''})}
function drag(){
  const h=$('#mpH');let sx,sy,ox,oy,on=false;
  h.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;on=true;const r=root.getBoundingClientRect();sx=e.clientX;sy=e.clientY;ox=r.left;oy=r.top;h.setPointerCapture(e.pointerId);root.classList.add('drag')});
  h.addEventListener('pointermove',e=>{if(!on)return;S.pos={x:ox+e.clientX-sx,y:oy+e.clientY-sy};place()});
  const end=()=>{if(!on)return;on=false;root.classList.remove('drag');save()};
  h.addEventListener('pointerup',end);h.addEventListener('pointercancel',end);
  addEventListener('resize',place)}

/* --- lista --- */
function render(){
  if(!root)return;const ul=$('#mpPl');ul.innerHTML='';
  S.items.forEach((it,i)=>{const li=document.createElement('li');li.className=i===S.idx?'on':'';
    li.innerHTML=`<button type="button" class="n" title="Reproducir">${it.t==='yt'?'▶':it.kind==='video'?'🎬':'🎵'} ${esc(it.title)}</button><button type="button" class="x" title="Quitar" aria-label="Quitar de la lista">✕</button>`;
    li.firstChild.onclick=()=>play(i);li.lastChild.onclick=()=>remove(i);ul.appendChild(li)});
  ul.hidden=!S.items.length;$('#mpT').textContent='🎵 '+(cur?cur.title:'Música y videos');
  root.classList.toggle('playing',playing);const bt=$('#mpBtn');if(bt)bt.classList.toggle('on',playing)}
function add(it){it.id='i'+(++uid);S.items.push(it);save();render();if(!cur)play(S.items.length-1);return it}
function addLink(t){t=String(t||'').trim();if(!t)return;
  const y=parseYT(t);if(y)return add({t:'yt',ref:y.id,list:y.list,title:y.list&&!y.id?'Lista de YouTube':'YouTube · '+y.id});
  if(/^https?:\/\//i.test(t)&&(AUD.test(t)||VID.test(t)))return add({t:'url',ref:t,kind:VID.test(t)?'video':'audio',title:decodeURIComponent(t.split('?')[0].split('/').pop()||'Enlace').replace(/\.[^.]+$/,'')});
  msg('Pega un enlace de YouTube o de un archivo (.mp3, .mp4…)');setTimeout(()=>{if($('#mpMsg').textContent.startsWith('Pega'))msg('')},3500)}
function addFiles(fs){fs.filter(f=>/^(audio|video)\//.test(f.type)||/\.(mp3|m4a|ogg|wav|aac|flac|opus|mp4|webm|mov)$/i.test(f.name)).forEach(f=>
  add({t:'file',ref:URL.createObjectURL(f),kind:/^video\//.test(f.type)||/\.(mp4|webm|mov)$/i.test(f.name)?'video':'audio',title:f.name.replace(/\.[^.]+$/,'')}))}
function remove(i){const it=S.items[i];if(!it)return;if(i===S.idx){stopAll();cur=null;S.idx=-1;setPlaying(false)}else if(i<S.idx)S.idx--;
  if(it.t==='file')try{URL.revokeObjectURL(it.ref)}catch(e){}S.items.splice(i,1);save();render()}

/* --- reproducción --- */
const dur=()=>cur?(cur.t==='yt'?(yt&&ytReady&&yt.getDuration?yt.getDuration():0):$('#mpV').duration||0):0;
const pos=()=>cur?(cur.t==='yt'?(yt&&ytReady&&yt.getCurrentTime?yt.getCurrentTime():0):$('#mpV').currentTime||0):0;
function seek(t){if(!cur)return;if(cur.t==='yt'){if(yt&&ytReady)yt.seekTo(t,true)}else $('#mpV').currentTime=t}
function stopAll(){const v=$('#mpV');try{v.pause()}catch(e){}v.removeAttribute('src');v.load();try{if(yt&&ytReady)yt.stopVideo()}catch(e){}}
function play(i){
  const it=S.items[i];if(!it)return;stopAll();cur=it;S.idx=i;msg('');render();meta();try{dispatchEvent(new CustomEvent('mp:track',{detail:{kind:it.t}}))}catch(e){}
  const v=$('#mpV'),yw=$('#mpYw'),eq=$('#mpEq');
  if(it.t==='yt'){v.hidden=true;eq.hidden=true;$('#mpDisc').hidden=true;yw.hidden=false;playYT(it);return}
  yw.hidden=true;v.hidden=it.kind!=='video';eq.hidden=it.kind==='video';$('#mpDisc').hidden=it.kind==='video';
  v.src=it.ref;applyVol();applySpd();v.play().catch(()=>{msg('Toca ▶ para empezar');setPlaying(false)})}
function ytLoad(){
  if(window.YT&&YT.Player)return Promise.resolve();if(ytLoading)return ytLoading;
  ytLoading=new Promise((res,rej)=>{const s=document.createElement('script');s.src='https://www.youtube.com/iframe_api';s.async=true;
    const to=setTimeout(()=>{ytLoading=null;rej(new Error('timeout'))},9000);
    window.onYouTubeIframeAPIReady=()=>{clearTimeout(to);res()};s.onerror=()=>{clearTimeout(to);ytLoading=null;rej(new Error('offline'))};document.head.appendChild(s)});
  return ytLoading}
function playYT(it){
  msg('Cargando YouTube…');
  ytLoad().then(()=>{if(cur!==it)return;msg('');
    if(yt&&ytReady){loadYT(it);return}
    ytPending=it;if(yt)return;
    const pv={playsinline:1,rel:0,modestbranding:1};if(/^https?:/.test(location.protocol))pv.origin=location.origin;
    yt=new YT.Player('mpYT',{width:'100%',height:'100%',playerVars:pv,events:{
      onReady:()=>{ytReady=true;applyVol();if(ytPending){const p=ytPending;ytPending=null;if(cur===p)loadYT(p)}},
      onStateChange:e=>{const s=e.data;
        if(s===1){setPlaying(true);applySpd();try{const t=yt.getVideoData().title;if(t&&cur&&cur.t==='yt'&&cur.title!==t){cur.title=t;save();render();meta()}}catch(x){}}
        else if(s===2)setPlaying(false);
        else if(s===0){try{const l=yt.getPlaylist&&yt.getPlaylist();if(l&&l.length&&yt.getPlaylistIndex()<l.length-1)return}catch(x){}ended()}},
      onError:e=>{const c=e.data;msg(c===101||c===150?'Este video no permite reproducirse aquí':c===100?'No encontré ese video':'No pude reproducir este video');setPlaying(false);setTimeout(()=>{if(S.items.length>1)next()},2200)}}})
  }).catch(()=>{msg('Para YouTube necesito internet. Prueba con tus archivos 📁');setPlaying(false)})}
function loadYT(it){applyVol();applySpd();try{if(it.list&&!it.ref)yt.loadPlaylist({list:it.list,listType:'playlist'});else yt.loadVideoById(it.ref)}catch(e){msg('No pude cargar este video')}}
function toggle(){
  if(!cur){if(S.items.length)play(S.idx>=0?S.idx:0);else{msg('Pega un enlace o abre tus archivos');$('#mpIn').focus()}return}
  if(cur.t==='yt'){if(yt&&ytReady){playing?yt.pauseVideo():yt.playVideo()}}
  else{const v=$('#mpV');if(playing)v.pause();else v.play().catch(()=>{})}}
const next=()=>{if(S.items.length)play(nextIdx())},prev=()=>{if(!S.items.length)return;if(pos()>4){seek(0);return}play((S.idx-1+S.items.length)%S.items.length)};

/* --- volumen y «bajar cuando Lumi habla» --- */
function applyVol(){const k=S.mute?0:S.vol*duck*fade;try{if(yt&&ytReady&&yt.setVolume)yt.setVolume(Math.round(k))}catch(e){}const mv=$('#mpV');if(mv)mv.volume=Math.min(1,Math.max(0,k/100))}
function setDuck(){duckTo=(talk||listen)?.2:1;clearInterval(duckT);duckT=setInterval(()=>{duck+=(duckTo-duck)*.35;if(Math.abs(duckTo-duck)<.02){duck=duckTo;clearInterval(duckT)}applyVol()},60)}

/* --- estado, progreso y reacciones de Lumi --- */
function setPlaying(b){
  if(playing===b)return;playing=b;const p=$('#mpPlay');if(p)p.textContent=b?'⏸':'▶';const hp=$('#mpHpl');if(hp)hp.textContent=b?'⏸':'▶';try{dispatchEvent(new CustomEvent('mp:state',{detail:{playing:b,kind:cur?cur.t:null}}))}catch(e){}try{if(navigator.mediaSession)navigator.mediaSession.playbackState=b?'playing':'paused'}catch(e){}root&&root.classList.toggle('playing',b);
  document.body.classList.toggle('music',b);const bt=$('#mpBtn');if(bt)bt.classList.toggle('on',b);
  clearInterval(pollT);clearInterval(noteT);clearInterval(reactT);
  if(b){pollT=setInterval(poll,500);poll();
    noteT=setInterval(()=>{if(calm()||document.hidden||!root||root.hidden)return;const n=document.createElement('i');n.className='mp-n';n.textContent=pick(['♪','♫','♬']);n.style.left=(10+Math.random()*80)+'%';root.appendChild(n);setTimeout(()=>n.remove(),2600)},1700);
    cheer();reactT=setInterval(vibe,32000)}}
function poll(){if(seeking||!root)return;const d=dur(),t=pos();$('#mpSeek').value=d?Math.round(t/d*1000):0;const pg=$('#mpPg');if(pg)pg.style.transform='scaleX('+(d?Math.min(1,t/d):0)+')';$('#mpTime').textContent=d?fmt(t)+' / '+fmt(d):fmt(t)}
function cheer(){if(typeof Avatar==='undefined')return;try{Avatar.react('hum');if(!greeted&&Avatar.onQuip){greeted=true;setTimeout(()=>Avatar.onQuip(pick(['¡Música! 🎶 Yo me encargo de bajar el volumen cuando hable','¡Qué buena onda! Estudiar con música es lo mejor 🎧','¡Suena bien! Cuando te explique, bajo el volumen solita 🎵']),true),900)}}catch(e){}}
function vibe(){if(!playing||talk||listen||document.hidden||typeof Avatar==='undefined'||calm())return;try{Avatar.react(pick(['hum','hum','dance','giggle']))}catch(e){}}

function boot(){
  const bt=$('#mpBtn');if(bt){bt.onclick=()=>show(!(root&&!root.hidden));bt.setAttribute('aria-pressed',String(S.open))}
  if(typeof Avatar!=='undefined'){const t=Avatar.talk,l=Avatar.listen;
    if(t)Avatar.talk=function(on){talk=!!on;setDuck();return t.apply(this,arguments)};
    if(l)Avatar.listen=function(on){listen=!!on;setDuck();return l.apply(this,arguments)}}
  addEventListener('keydown',e=>{if(e.key==='Escape'&&root&&!root.hidden&&root.contains(document.activeElement))show(false)});
  addEventListener('keydown',keys);addEventListener('beat:ready',ui);
  try{const ms=navigator.mediaSession;if(ms){const h=(n,f)=>{try{ms.setActionHandler(n,f)}catch(e){}};h('play',()=>{if(!playing)toggle()});h('pause',()=>{if(playing)toggle()});h('nexttrack',next);h('previoustrack',prev);h('seekto',d=>{if(d&&d.seekTime!=null)seek(d.seekTime)})}}catch(e){}
  if(S.open)build();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
