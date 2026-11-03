/* Panel «Diseño»: ubicación y tamaño de Lumi y la pizarra, tipografía, marco, espaciado. Se guarda en este dispositivo. */
const Layout=(()=>{
  const D={pos:'left',av:290,bz:100,sz:100,tb:'top',frame:'normal',dens:'normal',rad:'theme',bf:'tiza',wide:'std',sub:'on',tips:'on',tray:'on'};
  let S={...D,...Store.get('layout',{})};const R=document.documentElement;
  const SEG=[
    {k:'pos',t:'Dónde está Lumi (en pantallas grandes)',o:[['left','⬅️ Izquierda'],['right','Derecha ➡️'],['top','⬆️ Arriba'],['bottom','⬇️ Abajo'],['float','🪟 Flotante der.'],['floatL','🪟 Flotante izq.'],['hide','🙈 Oculta']]},
    {k:'tb',t:'Barra de botones',o:[['top','Arriba'],['bottom','Abajo']]},
    {k:'bf',t:'Letra de la pizarra',o:[['tiza','✍️ Tiza'],['redonda','Redondita'],['clara','Clara'],['serif','Clásica'],['mono','Código'],['futuro','Futurista']]},
    {k:'frame',t:'Marco de la pizarra',o:[['none','Sin marco'],['thin','Fino'],['normal','Normal'],['thick','Grueso']]},
    {k:'rad',t:'Esquinas',o:[['sharp','Rectas'],['theme','Del tema'],['round','Muy redondas']]},
    {k:'dens',t:'Espaciado',o:[['compact','Compacto'],['normal','Normal'],['roomy','Amplio']]},
    {k:'wide',t:'Ancho de la pantalla',o:[['std','Centrado'],['full','Todo el ancho']]},
    {k:'sub',t:'Lo que dice Lumi (subtítulos)',o:[['on','Mostrar'],['off','Ocultar']]},
    {k:'tips',t:'Consejos del panel de Lumi',o:[['on','Mostrar'],['off','Ocultar']]},
    {k:'tray',t:'Repisa de la pizarra (tizas)',o:[['on','Mostrar'],['off','Ocultar']]}
  ];
  const SL=[{k:'av',t:'Tamaño de Lumi',min:180,max:420,step:10,u:'px'},{k:'bz',t:'Tamaño de la letra y dibujos de la pizarra',min:70,max:180,step:5,u:'%'},{k:'sz',t:'Tamaño de lo que dice Lumi',min:80,max:170,step:5,u:'%'}];
  const PRE=[
    ['Clásico','Lumi a la izquierda',{}],
    ['Lumi a la derecha','Pizarra a la izquierda',{pos:'right'}],
    ['Pizarra gigante','Lumi flotando, todo ancho',{pos:'float',wide:'full',bz:125,dens:'compact',tips:'off'}],
    ['Estilo cine','Lumi arriba, mucho aire',{pos:'top',wide:'full',dens:'roomy',frame:'thin',av:340}],
    ['Modo enfoque','Solo la pizarra',{pos:'hide',wide:'full',bz:115,tray:'off'}],
    ['Para niños','Todo grande y redondo',{av:380,bz:140,sz:130,rad:'round',bf:'redonda',dens:'roomy'}]
  ];
  function apply(){const d=R.dataset;SEG.forEach(s=>d[s.k]=S[s.k]);R.style.setProperty('--av',S.av+'px');R.style.setProperty('--bz',S.bz/100);R.style.setProperty('--sz',S.sz/100)}
  const save=()=>{Store.set('layout',S);apply()};
  let dlg;
  function render(){
    const b=dlg.querySelector('#lyBody');b.innerHTML='';
    const h=t=>{const e=document.createElement('h4');e.textContent=t;b.appendChild(e)};
    h('Combinaciones listas');const pre=document.createElement('div');pre.className='pre';
    PRE.forEach(([n,d,v])=>{const x=document.createElement('button');x.type='button';x.innerHTML='<b></b><small></small>';x.firstChild.textContent=n;x.lastChild.textContent=d;x.onclick=()=>{S={...D,...v};save();render()};pre.appendChild(x)});b.appendChild(pre);
    SEG.forEach(s=>{h(s.t);const g=document.createElement('div');g.className='seg';
      s.o.forEach(([v,l])=>{const x=document.createElement('button');x.type='button';x.textContent=l;x.setAttribute('aria-pressed',S[s.k]===v);x.onclick=()=>{S[s.k]=v;save();render()};g.appendChild(x)});b.appendChild(g)});
    SL.forEach(s=>{const w=document.createElement('div');w.className='sl';w.style.marginTop='14px';
      w.innerHTML='<label></label><output></output><input type="range">';const i=w.querySelector('input'),o=w.querySelector('output');
      w.querySelector('label').textContent=s.t;i.min=s.min;i.max=s.max;i.step=s.step;i.value=S[s.k];o.textContent=S[s.k]+s.u;
      i.oninput=()=>{S[s.k]=+i.value;o.textContent=i.value+s.u;apply()};i.onchange=save;b.appendChild(w)});
  }
  function init(){
    apply();dlg=document.createElement('dialog');dlg.id='layoutDlg';
    dlg.innerHTML='<h3>Diseño a tu gusto</h3><p class="hint">Mueve y cambia el tamaño de todo. Se guarda en este dispositivo. En el celular algunas ubicaciones no cambian por falta de espacio.</p><div id="lyBody"></div><div class="row"><button type="button" id="lyReset">Volver a lo original</button><button type="button" id="lyClose" class="primary">Listo</button></div>';
    document.body.appendChild(dlg);
    dlg.querySelector('#lyClose').onclick=()=>dlg.close();dlg.querySelector('#lyReset').onclick=()=>{S={...D};save();render()};
    const bt=document.getElementById('layoutBtn');if(bt)bt.onclick=()=>{render();dlg.showModal()};
  }
  return{init,get:()=>S};
})();
document.addEventListener('DOMContentLoaded',()=>Layout.init());
