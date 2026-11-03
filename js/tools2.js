/* Herramientas extra: tabla periódica y graficador 3D (se suman a la caja 🧰). */
(()=>{
const T=window.LumiTools;if(!T)return;const {esc,askBtn,compile}=T,$=(s,r=document)=>r.querySelector(s);

/* ---------- Tabla periódica ---------- */
const RAW=`H:Hidrógeno:1.008|He:Helio:4.0026|Li:Litio:6.94|Be:Berilio:9.0122|B:Boro:10.81|C:Carbono:12.011|N:Nitrógeno:14.007|O:Oxígeno:15.999|F:Flúor:18.998|Ne:Neón:20.180|Na:Sodio:22.990|Mg:Magnesio:24.305|Al:Aluminio:26.982|Si:Silicio:28.085|P:Fósforo:30.974|S:Azufre:32.06|Cl:Cloro:35.45|Ar:Argón:39.948|K:Potasio:39.098|Ca:Calcio:40.078|Sc:Escandio:44.956|Ti:Titanio:47.867|V:Vanadio:50.942|Cr:Cromo:51.996|Mn:Manganeso:54.938|Fe:Hierro:55.845|Co:Cobalto:58.933|Ni:Níquel:58.693|Cu:Cobre:63.546|Zn:Zinc:65.38|Ga:Galio:69.723|Ge:Germanio:72.630|As:Arsénico:74.922|Se:Selenio:78.971|Br:Bromo:79.904|Kr:Kriptón:83.798|Rb:Rubidio:85.468|Sr:Estroncio:87.62|Y:Itrio:88.906|Zr:Circonio:91.224|Nb:Niobio:92.906|Mo:Molibdeno:95.95|Tc:Tecnecio:98|Ru:Rutenio:101.07|Rh:Rodio:102.91|Pd:Paladio:106.42|Ag:Plata:107.87|Cd:Cadmio:112.41|In:Indio:114.82|Sn:Estaño:118.71|Sb:Antimonio:121.76|Te:Telurio:127.60|I:Yodo:126.90|Xe:Xenón:131.29|Cs:Cesio:132.91|Ba:Bario:137.33|La:Lantano:138.91|Ce:Cerio:140.12|Pr:Praseodimio:140.91|Nd:Neodimio:144.24|Pm:Prometio:145|Sm:Samario:150.36|Eu:Europio:151.96|Gd:Gadolinio:157.25|Tb:Terbio:158.93|Dy:Disprosio:162.50|Ho:Holmio:164.93|Er:Erbio:167.26|Tm:Tulio:168.93|Yb:Iterbio:173.05|Lu:Lutecio:174.97|Hf:Hafnio:178.49|Ta:Tántalo:180.95|W:Wolframio:183.84|Re:Renio:186.21|Os:Osmio:190.23|Ir:Iridio:192.22|Pt:Platino:195.08|Au:Oro:196.97|Hg:Mercurio:200.59|Tl:Talio:204.38|Pb:Plomo:207.2|Bi:Bismuto:208.98|Po:Polonio:209|At:Astato:210|Rn:Radón:222|Fr:Francio:223|Ra:Radio:226|Ac:Actinio:227|Th:Torio:232.04|Pa:Protactinio:231.04|U:Uranio:238.03|Np:Neptunio:237|Pu:Plutonio:244|Am:Americio:243|Cm:Curio:247|Bk:Berkelio:247|Cf:Californio:251|Es:Einstenio:252|Fm:Fermio:257|Md:Mendelevio:258|No:Nobelio:259|Lr:Lawrencio:266|Rf:Rutherfordio:267|Db:Dubnio:268|Sg:Seaborgio:269|Bh:Bohrio:270|Hs:Hasio:277|Mt:Meitnerio:278|Ds:Darmstatio:281|Rg:Roentgenio:282|Cn:Copernicio:285|Nh:Nihonio:286|Fl:Flerovio:289|Mc:Moscovio:290|Lv:Livermorio:293|Ts:Teneso:294|Og:Oganesón:294`;
const EL=RAW.split('|').map((e,i)=>{const [s,n,m]=e.split(':');return{z:i+1,s,n,m:+m}});
const CAT={alc:['Alcalinos','#ff8a65',[3,11,19,37,55,87]],alt:['Alcalinotérreos','#ffca28',[4,12,20,38,56,88]],tra:['Metales de transición','#4fc3f7',[...rg(21,30),...rg(39,48),...rg(72,80),...rg(104,112)]],
  pos:['Otros metales','#90a4ae',[13,31,49,50,81,82,83,84,113,114,115,116]],met:['Metaloides','#aed581',[5,14,32,33,51,52]],nom:['No metales','#81c784',[1,6,7,8,15,16,34]],hal:['Halógenos','#ba68c8',[9,17,35,53,85,117]],
  nob:['Gases nobles','#f48fb1',[2,10,18,36,54,86,118]],lan:['Lantánidos','#4db6ac',rg(57,71)],act:['Actínidos','#a1887f',rg(89,103)]};
function rg(a,b){const r=[];for(let i=a;i<=b;i++)r.push(i);return r}
const catOf=z=>Object.keys(CAT).find(k=>CAT[k][2].includes(z));
const GAS=[1,2,7,8,9,10,17,18,36,54,86],LIQ=[35,80];
function pos(z){if(z===1)return[1,1];if(z===2)return[1,18];if(z<=4)return[2,z-2];if(z<=10)return[2,z+8];if(z<=12)return[3,z-10];if(z<=18)return[3,z-0];
  if(z<=36)return[4,z-18];if(z<=54)return[5,z-36];if(z<=56)return[6,z-54];if(z<=71)return[9,z-54];if(z<=86)return[6,z-68];if(z<=88)return[7,z-86];if(z<=103)return[10,z-86];return[7,z-100]}
const ORD=[[1,'s'],[2,'s'],[2,'p'],[3,'s'],[3,'p'],[4,'s'],[3,'d'],[4,'p'],[5,'s'],[4,'d'],[5,'p'],[6,'s'],[4,'f'],[5,'d'],[6,'p'],[7,'s'],[5,'f'],[6,'d'],[7,'p']],CAPA={s:2,p:6,d:10,f:14};
const EXC={24:'[Ar] 3d5 4s1',29:'[Ar] 3d10 4s1',41:'[Kr] 4d4 5s1',42:'[Kr] 4d5 5s1',44:'[Kr] 4d7 5s1',45:'[Kr] 4d8 5s1',46:'[Kr] 4d10',47:'[Kr] 4d10 5s1',57:'[Xe] 5d1 6s2',58:'[Xe] 4f1 5d1 6s2',64:'[Xe] 4f7 5d1 6s2',78:'[Xe] 4f14 5d9 6s1',79:'[Xe] 4f14 5d10 6s1',89:'[Rn] 6d1 7s2',90:'[Rn] 6d2 7s2',91:'[Rn] 5f2 6d1 7s2',92:'[Rn] 5f3 6d1 7s2',93:'[Rn] 5f4 6d1 7s2',96:'[Rn] 5f7 6d1 7s2',103:'[Rn] 5f14 7s2 7p1'};
function config(z){if(EXC[z])return EXC[z];const NG=[[86,'Rn'],[54,'Xe'],[36,'Kr'],[18,'Ar'],[10,'Ne'],[2,'He']],core=NG.find(c=>c[0]<z),skip=core?core[0]:0;let left=z,cum=0,out=[];
  for(const [n,l] of ORD){if(left<=0)break;const e=Math.min(CAPA[l],left);left-=e;cum+=e;if(cum>skip||(cum-e>=skip))out.push(n+l+e)}
  // quita los subniveles que ya están dentro del núcleo noble
  if(core){let c2=0;out=[];left=z;for(const [n,l] of ORD){if(left<=0)break;const e=Math.min(CAPA[l],left);left-=e;if(c2>=skip)out.push(n+l+e);c2+=e}}
  const LO={s:0,p:1,d:2,f:3};out.sort((a,b)=>(a[0]-b[0])||(LO[a[1]]-LO[b[1]]));return(core?'['+core[1]+'] ':'')+out.join(' ')}
const sup=t=>esc(t).replace(/(\d[spdf])(\d+)/g,'$1<sup>$2</sup>');

function viewTabla(el){
  let sel=1,filt='',q='';
  el.innerHTML=`<input id="pq" placeholder="Buscar: nombre, símbolo o número…" autocomplete="off"><div id="pDet" class="pdet"></div><div class="pleg" id="pLeg"></div><div class="pwrap"><div id="pGrid" class="pgrid"></div></div><div id="pAsk"></div>`;
  $('#pLeg',el).innerHTML=Object.entries(CAT).map(([k,v])=>`<button type="button" data-c="${k}" style="--c:${v[1]}">${v[0]}</button>`).join('');
  const grid=$('#pGrid',el);
  grid.innerHTML=EL.map(e=>{const [r,c]=pos(e.z);return`<button type="button" class="pel" data-z="${e.z}" style="grid-row:${r};grid-column:${c};--c:${CAT[catOf(e.z)][1]}"><small>${e.z}</small><b>${e.s}</b></button>`}).join('');
  const det=()=>{const e=EL[sel-1],c=CAT[catOf(sel)],st=GAS.includes(sel)?'Gas':LIQ.includes(sel)?'Líquido':sel>=104||sel===85||sel===87||sel===61?'Desconocido / radiactivo':'Sólido',cf=config(sel),val=(()=>{const m=cf.replace(/^\[\w+\]\s*/,'').match(/\d[spdf]\d+/g)||[];return m.length?'':''})();
    $('#pDet',el).innerHTML=`<div class="big" style="background:${c[1]}"><small>${e.z}</small><b>${e.s}</b><span>${e.m}</span></div><div><h4>${esc(e.n)}</h4><div>${c[0]} · ${st}</div><div>Masa atómica: <b>${e.m}</b> u</div><div>Protones/electrones: <b>${e.z}</b> · Neutrones (aprox.): <b>${Math.round(e.m)-e.z}</b></div><div>Periodo: <b>${pos(e.z)[0]>7?(pos(e.z)[0]===9?6:7):pos(e.z)[0]}</b>${pos(e.z)[0]<8?' · Grupo: <b>'+pos(e.z)[1]+'</b>':''}</div><div>Configuración: <span class="cfg">${sup(cf)}</span></div></div>`;
    $('#pAsk',el).innerHTML=askBtn('');$('#pAsk .askL',el).dataset.ask=`Explícame el elemento ${e.n} (${e.s}, Z=${e.z}): sus propiedades, su configuración electrónica, por qué se comporta así y para qué se usa en la vida diaria.`;
    grid.querySelectorAll('.pel').forEach(b=>b.classList.toggle('sel',+b.dataset.z===sel))};
  const apply=()=>{const t=q.trim().toLowerCase();grid.querySelectorAll('.pel').forEach(b=>{const e=EL[b.dataset.z-1],ok=(!filt||catOf(e.z)===filt)&&(!t||e.n.toLowerCase().includes(t)||e.s.toLowerCase()===t||String(e.z)===t||e.n.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').includes(t));b.classList.toggle('dim',!ok)});
    $('#pLeg',el).querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.c===filt))};
  grid.onclick=e=>{const b=e.target.closest('.pel');if(b){sel=+b.dataset.z;det()}};
  $('#pLeg',el).onclick=e=>{const b=e.target.closest('[data-c]');if(b){filt=filt===b.dataset.c?'':b.dataset.c;apply()}};
  $('#pq',el).oninput=e=>{q=e.target.value;apply();const t=q.trim().toLowerCase(),m=EL.find(x=>x.s.toLowerCase()===t||x.n.toLowerCase()===t||String(x.z)===t);if(m){sel=m.z;det()}};
  det();
}

/* ---------- Graficador 3D ---------- */
const PRE=['x^2+y^2','sin(x)*cos(y)','sin(sqrt(x^2+y^2))','x*y','exp(-(x^2+y^2))*3','(x^2-y^2)/4','cos(x)+sin(y)','abs(x)+abs(y)'];
function view3d(el){
  const saved=Store.get('g3',{f:PRE[1],r:5,n:60});
  el.innerHTML=`<label>z = f(x, y)<input id="zf" value="${esc(saved.f)}" autocapitalize="off" autocomplete="off"></label><div class="pleg" id="zp">${PRE.map(p=>`<button type="button" data-p="${esc(p)}">${esc(p)}</button>`).join('')}</div>
  <div class="gtools"><label>Rango ±<select id="zr">${[2,5,10,20].map(v=>`<option${v===saved.r?' selected':''}>${v}</option>`).join('')}</select></label><label>Detalle<select id="zn"><option value="30">Bajo</option><option value="60">Medio</option><option value="100">Alto</option></select></label><label><input type="checkbox" id="zw"> Malla</label><label><input type="checkbox" id="zo"> Girar solo</label></div>
  <div id="z3"><p class="hint">Cargando 3D…</p></div><p class="hint" id="zi">Arrastra para girar · pellizca para acercar · dos dedos para mover.</p><div id="zerr" class="hint" style="color:#e11d48"></div>${askBtn('')}`;
  $('#zn',el).value=saved.n;let h=null,dead=false;const z3=$('#z3',el);
  const run=()=>{if(!h)return;const f=$('#zf',el).value.trim().replace(/^\s*z\s*=/,'');$('#zerr',el).textContent='';
    try{compile(f,false);h.build(f,+$('#zr',el).value,+$('#zn',el).value,$('#zw',el).checked);Store.set('g3',{f:$('#zf',el).value,r:+$('#zr',el).value,n:+$('#zn',el).value});
      $('.askL',el).dataset.ask=`Explícame la superficie z = ${f}: cómo se ve, sus cortes, máximos/mínimos, simetrías y qué significa cada parte.`}catch(e){$('#zerr',el).textContent=e.message}};
  window.Graf3D?window.Graf3D.mount(z3,compile,t=>{$('#zi',el).textContent=t}).then(x=>{if(dead){x.stop();return}z3.querySelector('p')?.remove();h=x;run()}).catch(er=>{window.__g3err=String(er&&er.message||er);z3.innerHTML='<p class="hint">El 3D necesita internet la primera vez (se guarda después) y un navegador con WebGL.</p>'}):z3.innerHTML='<p class="hint">No se pudo cargar el módulo 3D.</p>';
  let tm;el.oninput=e=>{if(e.target.id==='zf'){clearTimeout(tm);tm=setTimeout(run,350)}};
  el.onchange=e=>{if(e.target.id==='zw')h&&h.setWire(e.target.checked);else if(e.target.id==='zo')h&&h.setRotate(e.target.checked);else run()};
  $('#zp',el).onclick=e=>{const b=e.target.closest('[data-p]');if(b){$('#zf',el).value=b.dataset.p;run()}};
  T.setStop(()=>{dead=true;h&&h.stop();h=null;T.setStop(null)});
}
T.chem={EL,CAT,catOf,config,GAS,LIQ};
T.register('tabla','⚛️','Tabla periódica',viewTabla);
T.register('g3d','🧊','Gráfico 3D',view3d);
})();
