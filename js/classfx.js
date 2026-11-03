/* Esencia del tema en TODO el aula (js/classfx.js + css/classfx.css).
   Cada tema (kawaii, futurista, gamer, océano…) llena la pantalla de su propio ambiente: partículas, criaturas que cruzan,
   chispas al tocar, y un marco con adornos sobre la pizarra que acompaña lo que escribe Lumi.
   Todo se calcula en el navegador (cero créditos de IA). Respeta «reducir movimiento» y el interruptor de detalles del tema. */
(()=>{
const $=s=>document.querySelector(s),pick=a=>a[Math.floor(Math.random()*a.length)],rnd=(a,b)=>a+Math.random()*(b-a);
const on=()=>{try{return Store.get('tfx',true)!==false}catch(e){return true}};
const calm=()=>{try{return matchMedia('(prefers-reduced-motion:reduce)').matches}catch(e){return false}};
const root=document.documentElement;
let theme=root.dataset.theme||'kawaii',page=null,bfx=null,lastBurst=0,lastTap=0,crossT=0;

/* g: grupos de partículas (m = movimiento: rise sube, fall cae, twk titila, drift flota) · n: cantidad (página/pizarra) */
const TH={
  kawaii:{g:[{m:'rise',c:['♥','✦','♡','✧','🌸','💖'],n:11}],corner:['🎀','✨','💖','🌸'],cross:['🦄','🎈','☁️','🌈'],burst:['💖','✨','🌸','💕']},
  futurista:{g:[{m:'fall',c:['0','1','◇','+','01','⌬'],n:14}],corner:['◤','◥','◣','◢'],cross:['🛸','🤖','🛰️','⚡'],burst:['0','1','⚡','◇','01']},
  profesional:{g:[{m:'rise',c:['•','◦','+'],n:6}],corner:['┌','┐','└','┘'],cross:['📈','✈️','📎'],burst:['✓','•','+']},
  gamer:{g:[{m:'twk',c:['■','▲','●','◆','+1','♥'],n:13}],corner:['🕹️','⭐','💎','👾'],cross:['👾','🚀','🎮','🍄'],burst:['+10','⭐','💎','■','1UP']},
  anime:{g:[{m:'fall',c:['🌸','✿','❀','✦'],n:12}],corner:['🌸','✨','✨','🌸'],cross:['🐦','☄️','🌸','🏮'],burst:['🌸','✨','💫','🌸']},
  oceano:{g:[{m:'rise',c:['○','◯','🫧','○'],n:12}],corner:['🐚','🫧','🪸','🐠'],cross:['🐠','🐬','🐢','🐟','🦀'],burst:['🫧','○','🐚','🫧']},
  atardecer:{g:[{m:'twk',c:['✦','·','✧'],n:11}],corner:['🌅','☁️','🕊️','✨'],cross:['🕊️','🐦','🎈','☁️'],burst:['✨','🌅','·','🧡']},
  medianoche:{g:[{m:'twk',c:['✦','✧','·','⭐','✦'],n:16}],corner:['🌙','✨','⭐','✨'],cross:['🌠','🦉','☄️','🦇'],burst:['⭐','✨','🌙','💫']},
  cafe:{g:[{m:'rise',c:['~','♨','·'],n:6}],corner:['☕','🍪','📖','🥐'],cross:['☕','🥐','🐈','🍩'],burst:['☕','~','🍪','🤎']},
  bosque:{g:[{m:'fall',c:['🍃','🍂','🌿'],n:8},{m:'drift',c:['•'],n:7,cls:'ff'}],corner:['🍃','🌿','🍄','🦋'],cross:['🦋','🐿️','🦌','🐦','🐝'],burst:['🍃','🌿','✨','🍀']}
};
const T=()=>TH[theme]||TH.kawaii;

/* --- capas --- */
function mkLayer(host,id,small){
  const e=document.createElement('div');e.id=id;e.className='cfxl'+(small?' small':'');e.setAttribute('aria-hidden','true');host.appendChild(e);return e}
function fill(el,small){
  if(!el)return;el.innerHTML='';el.dataset.th=theme;
  T().g.forEach(g=>{const n=small?Math.max(3,Math.round(g.n/2.4)):g.n;
    for(let i=0;i<n;i++){const e=document.createElement('i');e.textContent=g.c[i%g.c.length];e.className='m-'+g.m+(g.cls?' '+g.cls:'');
      e.style.setProperty('--x',rnd(3,95).toFixed(0)+'%');e.style.setProperty('--y',rnd(6,92).toFixed(0)+'%');
      e.style.setProperty('--d',(-rnd(0,12)).toFixed(1)+'s');e.style.setProperty('--t',rnd(g.m==='twk'?3:7,g.m==='twk'?7:14).toFixed(1)+'s');
      e.style.setProperty('--s',rnd(.8,1.5).toFixed(2));e.style.setProperty('--sw',rnd(-26,26).toFixed(0)+'px');el.appendChild(e)}});
}
function buildBoard(){
  if(!bfx)return;bfx.dataset.th=theme;bfx.innerHTML='';
  T().corner.forEach((g,i)=>{const s=document.createElement('b');s.className='cr c'+i;s.textContent=g;s.style.setProperty('--d',(-i*.7)+'s');bfx.appendChild(s)});
  const amb=document.createElement('div');amb.className='cfxl small';amb.dataset.th=theme;bfx.appendChild(amb);fill(amb,true)}
function sync(){
  const b=$('#board');if(!b||!bfx)return;const cs=getComputedStyle(b);
  Object.assign(bfx.style,{left:b.offsetLeft+'px',top:b.offsetTop+'px',width:b.offsetWidth+'px',height:b.offsetHeight+'px',borderRadius:cs.borderRadius});
  bfx.style.setProperty('--tr',(b.offsetHeight+60)+'px');
  if(page)page.style.setProperty('--tr',(innerHeight+90)+'px')}
function ensure(){
  const cr=$('.classroom'),b=$('#board');if(!cr||!b)return false;
  if(!page||!page.isConnected){page=mkLayer(document.body,'cfx');page.classList.add('page');fill(page)}
  if(!bfx||!bfx.isConnected){bfx=document.createElement('div');bfx.id='bfx';cr.appendChild(bfx);buildBoard()}
  const show=on();page.hidden=bfx.hidden=!show;
  page.classList.toggle('still',calm());bfx.classList.toggle('still',calm());sync();return show}

/* --- efectos puntuales --- */
const spawn=(txt,cls,ms,css)=>{if(!page||page.hidden)return null;const e=document.createElement('b');e.className=cls;e.textContent=txt;Object.entries(css||{}).forEach(([k,v])=>e.style.setProperty(k,v));page.appendChild(e);setTimeout(()=>e.remove(),ms);return e};
function burst(x,y,n,list){
  if(calm()||!page||page.hidden)return;const L=list||T().burst;
  for(let i=0;i<n;i++){const a=rnd(0,Math.PI*2),d=rnd(34,90);
    spawn(pick(L),'cfx-b',1000,{left:x+'px',top:y+'px','--dx':Math.round(Math.cos(a)*d)+'px','--dy':Math.round(Math.sin(a)*d-18)+'px','--r':Math.round(rnd(-40,40))+'deg'})}}
function fly(){
  if(calm()||document.hidden||!page||page.hidden)return;
  const t=rnd(11,17),rev=Math.random()<.5;spawn(pick(T().cross),'cfx-x'+(rev?' rev':''),t*1000+300,{'--t':t+'s',top:rnd(8,78).toFixed(0)+'%'})}
function loopFly(){clearTimeout(crossT);crossT=setTimeout(()=>{fly();loopFly()},rnd(28,60)*1000)}

/* Al cambiar de tema: ráfaga de su esencia por toda la pantalla */
function enter(){
  ensure();fill(page);buildBoard();
  if(calm()||!page||page.hidden)return;
  for(let i=0;i<20;i++)setTimeout(()=>burst(rnd(innerWidth*.15,innerWidth*.85),rnd(innerHeight*.2,innerHeight*.8),1),i*45);
  setTimeout(fly,900)}

/* Lo que escribe Lumi en la pizarra desprende un poco de la esencia del tema */
function watchBoard(){
  const sh=$('#sheet');if(!sh)return;
  new MutationObserver(ms=>{
    const n=performance.now();if(n-lastBurst<1800||!on()||calm())return;
    const el=ms.flatMap(m=>[...m.addedNodes]).find(x=>x.nodeType===1);if(!el)return;lastBurst=n;
    setTimeout(()=>{const r=el.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;
      const y=Math.min(innerHeight-40,Math.max(60,r.top+Math.min(r.height,80)/2));
      for(let i=0;i<5;i++)setTimeout(()=>burst(rnd(r.left+20,Math.max(r.left+30,r.right-20)),y,1),i*90)},120)
  }).observe(sh,{childList:true});
}

function boot(){
  if(!$('#board'))return;ensure();
  const cr=$('.classroom'),b=$('#board');
  if(window.ResizeObserver){const ro=new ResizeObserver(sync);ro.observe(b);ro.observe(cr);ro.observe(document.body)}
  addEventListener('resize',sync);addEventListener('orientationchange',()=>setTimeout(sync,300));
  setTimeout(sync,600);setTimeout(sync,2000);
  new MutationObserver(()=>{const t=root.dataset.theme;if(!t||t===theme)return;theme=t;enter()}).observe(root,{attributes:true,attributeFilter:['data-theme']});
  new MutationObserver(()=>setTimeout(sync,60)).observe(root,{attributes:true,attributeFilter:['data-layout','data-dens','data-frame','data-tray','data-scene','data-pos']});
  document.addEventListener('pointerdown',e=>{const n=performance.now();if(n-lastTap<160||!on()||calm())return;lastTap=n;burst(e.clientX,e.clientY,5)},{passive:true});
  document.addEventListener('visibilitychange',()=>{const h=document.hidden;[page,bfx].forEach(x=>x&&x.classList.toggle('pause',h))});
  setInterval(()=>{const s=on();if(page&&page.hidden===s){ensure()}},4000);
  watchBoard();loopFly();setTimeout(fly,6000);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
