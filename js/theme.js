/* Temas visuales: kawaii, futurista, profesional, gamer, anime, océano, atardecer, medianoche, café y bosque. Los colores viven en css/ui.css. */
const Theme=(()=>{
  const L=[
    {id:'kawaii',n:'Kawaii',e:'🌸',d:'Dulce y pastel',bg:['#ffe3f1','#e8c9ff'],deco:'#ffffff',meta:'#fff0f7',sw:'linear-gradient(135deg,#ffc2dd,#d8b4ff)'},
    {id:'futurista',n:'Futurista',e:'🚀',d:'Neón y holograma',bg:['#10306b','#050a1f'],deco:'#7df9ff',meta:'#060a18',sw:'linear-gradient(135deg,#22d3ee,#4338ca)'},
    {id:'profesional',n:'Profesional',e:'💼',d:'Limpio y sobrio',bg:['#eaf0fb','#c9d6ee'],deco:'#ffffff',meta:'#f1f4f9',sw:'linear-gradient(135deg,#dbe4f3,#2563eb)'},
    {id:'gamer',n:'Gamer',e:'🎮',d:'Neón y píxeles',bg:['#2d1060','#0b0720'],deco:'#a3ff12',meta:'#09050f',sw:'linear-gradient(135deg,#a3ff12,#7c3aed)'},
    {id:'anime',n:'Anime',e:'🎌',d:'Cielo y sakura',bg:['#cfe3ff','#ffd6ec'],deco:'#ffffff',meta:'#e9f1ff',sw:'linear-gradient(135deg,#9ec5ff,#ffb3d6)'},
    {id:'oceano',n:'Océano',e:'🌊',d:'Mar y burbujas',bg:['#d6f4ff','#9fd8f5'],deco:'#ffffff',meta:'#e8f8ff',sw:'linear-gradient(135deg,#7dd3fc,#14b8a6)'},
    {id:'atardecer',n:'Atardecer',e:'🌇',d:'Cálido y dorado',bg:['#ffd9b0','#ff9fb5'],deco:'#fff3d6',meta:'#fff1e6',sw:'linear-gradient(135deg,#fdba74,#f472b6)'},
    {id:'medianoche',n:'Medianoche',e:'🌙',d:'Estrellas y calma',bg:['#2b2466','#0d0a2a'],deco:'#ffe9a8',meta:'#0d0a2a',sw:'linear-gradient(135deg,#a78bfa,#1e1b4b)'},
    {id:'cafe',n:'Café',e:'☕',d:'Acogedor y cálido',bg:['#f6e4cd','#d8b48a'],deco:'#fff7ea',meta:'#f8ecdb',sw:'linear-gradient(135deg,#e7c8a0,#b4693a)'},
    {id:'bosque',n:'Bosque',e:'🌿',d:'Natural y fresco',bg:['#d8f5dc','#8fd19e'],deco:'#ffffff',meta:'#eaf8ec',sw:'linear-gradient(135deg,#86efac,#16a34a)'}
  ];
  let id=Store.get('theme','kawaii');if(!L.some(t=>t.id===id))id='kawaii';
  const cur=()=>L.find(t=>t.id===id);
  function apply(){document.documentElement.dataset.theme=id;const m=document.querySelector('meta[name=theme-color]');if(m)m.content=cur().meta}
  apply();
  return{list:L,cur,get id(){return id},set(n){if(!L.some(t=>t.id===n))return;id=n;Store.set('theme',n);apply();typeof Shop!=='undefined'&&Shop.refresh()}};
})();
