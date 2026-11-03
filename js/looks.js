/* Looks: cada tema le da a Lumi un aspecto propio (piel, ojos, rubor, aura y detalles), sin tocar lo que compras.
   Se aplica sobre el SVG ya dibujado: los adornos del tema van DEBAJO de accesorios y aretes, así tus cosas siempre se ven encima.
   Todo se calcula en el navegador (cero créditos de IA). */
const Looks=(()=>{
  const hex=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
  const mix=(a,b,t)=>{const A=hex(a),B=hex(b);return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('')};
  const SKIN=['#fff4ec','#ffe3d0','#f3bd9c','#ffe2cf','#ffdcc6','#f3c3a6','#f6c9ae'];
  const mir=s=>`<g transform="translate(300 0) scale(-1 1)">${s}</g>`;           // espejo para el lado derecho
  const star=(x,y,r,f,o)=>`<path d="M${x} ${y-r}l${r*.25} ${r*.75} ${r*.75} ${r*.25}-${r*.75} ${r*.25}-${r*.25} ${r*.75}-${r*.25}-${r*.75}-${r*.75}-${r*.25} ${r*.75}-${r*.25}z" fill="${f}" opacity="${o||1}"/>`;
  const petal=(x,y,a,s)=>`<path transform="translate(${x} ${y}) rotate(${a}) scale(${s||1})" d="M0 0C3-7 10-6 9 1C8 7 2 8 0 0Z" fill="#ffc6df" stroke="#ff9fc6" stroke-width=".8"/>`;

  const L={
    /* Dulce y pastel: mejillas rosadas, ojos rosa-lila y brillitos. */
    kawaii:{skin:['#ffd3e6',.16],iris:['#fff0f8','#ffb0da','#d867cf','#7c2a93'],ring:'#5a1f6e',pupil:'#2a0f3f',hi:'#ffe6f5',blush:['#ff6fa3',.95],hatch:.75,aura:'#ffd1ea',
      face:star(92,126,6,'#fff',.9)+star(209,121,5,'#fff',.9)},

    /* Androide: piel plateada, ojos de pantalla cian, paneles, LEDs, auriculares y antena. */
    futurista:{skin:['#dfeaf7',.72],iris:['#e9ffff','#3feaff','#0a9fd6','#05405e'],ring:'#0a3f5e',pupil:'#00182b',hi:'#d9ffff',blush:['#3feaff',.28],hatch:0,aura:'#7df9ff',
      irisFx:'<circle r="9.8" fill="none" stroke="#c9fbff" stroke-width="1" stroke-dasharray="2.4 2.2" opacity=".8"/><circle r="15.4" fill="none" stroke="#3feaff" stroke-width="1.1" opacity=".55"/>',
      neck:'<g stroke="#8fb0d4" stroke-width="1.7" stroke-linecap="round" opacity=".75"><path d="M135 249h30"/><path d="M135 256h30"/></g>',
      face:'<g fill="none" stroke="#5eeaff" stroke-width="1.4" stroke-linecap="round" opacity=".8"><path d="M87 174h12l5 7h12"/><path d="M92 198l6 6h12"/><path d="M104 231Q150 247 196 231" opacity=".4"/></g>'
        +mir('<g fill="none" stroke="#5eeaff" stroke-width="1.4" stroke-linecap="round" opacity=".8"><path d="M87 174h12l5 7h12"/><path d="M92 198l6 6h12"/></g>')
        +'<circle class="led" cx="88" cy="146" r="2.3" fill="#7df9ff"/><circle class="led" cx="212" cy="146" r="2.3" fill="#7df9ff"/>',
      ears:'<g><rect x="66" y="156" width="17" height="32" rx="7.5" fill="#1c2c58" stroke="#5eeaff" stroke-width="1.6"/><circle class="led" cx="74.5" cy="172" r="3" fill="#7df9ff"/></g>'
        +mir('<g><rect x="66" y="156" width="17" height="32" rx="7.5" fill="#1c2c58" stroke="#5eeaff" stroke-width="1.6"/><circle class="led" cx="74.5" cy="172" r="3" fill="#7df9ff"/></g>'),
      deco:'<path d="M76 104Q58 88 56 56" stroke="#9db9d9" stroke-width="3.6" fill="none" stroke-linecap="round"/><circle class="led" cx="56" cy="53" r="5.2" fill="#7df9ff"/><circle cx="56" cy="53" r="8.5" fill="none" stroke="#7df9ff" stroke-width="1" opacity=".5"/>',
      body:'<circle class="led" cx="150" cy="312" r="4.6" fill="#7df9ff"/><circle cx="150" cy="312" r="9" fill="none" stroke="#7df9ff" stroke-width="1.2" opacity=".5"/>'},

    /* Profesional: natural y sobrio. Sin brillitos, rubor suave, ojos tranquilos. */
    profesional:{skin:null,iris:['#e8eef6','#8aa3c4','#4a6a98','#233556'],ring:'#1f2d4a',pupil:'#0f1829',hi:'#e8f0ff',blush:['#e89aa8',.42],hatch:0,aura:'#ffffff'},

    /* Gamer: ojos lima, auriculares con micrófono y detalles de píxel. */
    gamer:{skin:['#e7dcff',.12],iris:['#f5ffd9','#b6ff3c','#38a100','#154000'],ring:'#0e3300',pupil:'#071a00',hi:'#eaffc4',blush:['#c06bff',.55],hatch:.3,aura:'#c7ff6a',
      irisFx:'<rect x="-2" y="-2" width="4" height="4" fill="#eaffc4" opacity=".7"/>',
      face:'<g fill="#a3ff12" opacity=".85"><rect x="88" y="128" width="4" height="4"/><rect x="95" y="134" width="3" height="3" opacity=".6"/></g>'
        +mir('<g fill="#a3ff12" opacity=".85"><rect x="88" y="128" width="4" height="4"/><rect x="95" y="134" width="3" height="3" opacity=".6"/></g>'),
      ears:'<g><rect x="62" y="150" width="21" height="40" rx="9.5" fill="#2a1760" stroke="#a3ff12" stroke-width="2"/><rect x="67" y="160" width="6" height="20" rx="3" fill="#a3ff12" opacity=".85"/></g>'
        +mir('<g><rect x="62" y="150" width="21" height="40" rx="9.5" fill="#2a1760" stroke="#a3ff12" stroke-width="2"/><rect x="67" y="160" width="6" height="20" rx="3" fill="#a3ff12" opacity=".85"/></g>'),
      deco:'<path d="M72 150C68 80 110 46 150 46S232 80 228 150" fill="none" stroke="#2a1760" stroke-width="5" stroke-linecap="round" opacity=".92"/><path d="M72 150C68 80 110 46 150 46S232 80 228 150" fill="none" stroke="#a3ff12" stroke-width="1.4" opacity=".8" transform="translate(0 -1.5)"/><path d="M64 190Q60 228 100 236" fill="none" stroke="#2a1760" stroke-width="3" stroke-linecap="round"/><circle cx="102" cy="236" r="5" fill="#2a1760" stroke="#a3ff12" stroke-width="1.6"/>',
      body:'<g fill="#a3ff12" opacity=".9"><rect x="146" y="306" width="4" height="4"/><rect x="152" y="306" width="4" height="4"/><rect x="143" y="310" width="16" height="4"/><rect x="146" y="314" width="10" height="4"/><rect x="149" y="318" width="4" height="3"/></g>'},

    /* Anime: ojos de cielo con muchos brillos y pétalos de sakura. */
    anime:{skin:null,iris:['#ffffff','#8fd3ff','#4a7cf5','#25318f'],ring:'#1c2470',pupil:'#10154a',hi:'#ffffff',blush:['#ff8fb4',.8],hatch:.6,aura:'#ffd6ec',
      irisFx:star(7,-9,3.2,'#fff',.95)+'<circle cx="-8" cy="10" r="1.5" fill="#fff" opacity=".85"/>',
      deco:'<g transform="translate(214 68)">'+[0,72,144,216,288].map(a=>petal(0,0,a,1.3)).join('')+'<circle r="2.8" fill="#ffd34d"/></g>'+petal(92,66,-30,1.1)+petal(236,120,70,1)+petal(60,128,-60,.9),
      body:petal(62,304,-20,1.1)+petal(238,300,50,1)},

    /* Océano: ojos aguamarina, aletas de sirena y burbujas. */
    oceano:{skin:['#e6f7ff',.14],iris:['#e8fffb','#6fe8da','#1e9cbc','#0b4666'],ring:'#0b3550',pupil:'#04202f',hi:'#e6fffb',blush:['#ff9ab0',.6],hatch:.4,aura:'#bdeeff',
      ears:'<path d="M84 148C66 146 52 126 54 104C72 112 84 128 90 144Z" fill="#7fe3e8" stroke="#34bcc9" stroke-width="1.3" opacity=".92"/><path d="M80 146C68 140 62 128 62 116" stroke="#e8fffb" stroke-width="1.2" fill="none" opacity=".7"/>'
        +mir('<path d="M84 148C66 146 52 126 54 104C72 112 84 128 90 144Z" fill="#7fe3e8" stroke="#34bcc9" stroke-width="1.3" opacity=".92"/><path d="M80 146C68 140 62 128 62 116" stroke="#e8fffb" stroke-width="1.2" fill="none" opacity=".7"/>'),
      deco:'<g fill="#fff" fill-opacity=".25" stroke="#fff" stroke-width="1.4" opacity=".9"><circle cx="240" cy="62" r="6"/><circle cx="254" cy="84" r="3.6"/><circle cx="230" cy="88" r="4.4"/></g>'},

    /* Atardecer: tonos dorados, pecas de sol y un broche de sol. */
    atardecer:{skin:['#ffd6a8',.16],iris:['#fff6da','#ffc47a','#ee7f4a','#8c2f2c'],ring:'#6b1f1f',pupil:'#2b0b0b',hi:'#fff0c9',blush:['#ff8a6a',.8],hatch:.6,aura:'#ffd08a',
      face:'<g fill="#d9784d" opacity=".55"><circle cx="108" cy="178" r="1.3"/><circle cx="116" cy="182" r="1.2"/><circle cx="102" cy="183" r="1.2"/><circle cx="192" cy="178" r="1.3"/><circle cx="184" cy="182" r="1.2"/><circle cx="198" cy="183" r="1.2"/></g>',
      deco:'<g transform="translate(216 66)"><g stroke="#ff9f4a" stroke-width="2.2" stroke-linecap="round"><path d="M0-14v-5M0 14v5M-14 0h-5M14 0h5M-10-10l-3.5-3.5M10 10l3.5 3.5M-10 10l-3.5 3.5M10-10l3.5-3.5"/></g><circle r="9" fill="#ffd27a" stroke="#ff9f4a" stroke-width="1.6"/><circle cx="-3" cy="-3" r="3" fill="#fff" opacity=".6"/></g>'},

    /* Medianoche: piel de luna, ojos violeta, luna creciente y estrellitas. */
    medianoche:{skin:['#e7e4ff',.16],iris:['#f3edff','#b3a4ff','#6b48e0','#271470'],ring:'#1b0e5c',pupil:'#0d0630',hi:'#efeaff',blush:['#d58cff',.6],hatch:.4,aura:'#b8a8ff',
      irisFx:star(7,-9,3,'#fff',.9),
      deco:'<path d="M214 50a15 15 0 1 0 14 23a12 12 0 1 1-14-23z" fill="#ffe28a" stroke="#f5b942" stroke-width="1.3"/>'+star(240,100,5,'#ffe9a8',.95)+star(62,96,4,'#ffe9a8',.8)},

    /* Café: tonos cálidos, pecas suaves y vapor de taza. */
    cafe:{skin:['#f2caa0',.14],iris:['#fff1de','#d9a066','#a0612c','#44250f'],ring:'#341c0b',pupil:'#1f0f05',hi:'#fff0dc',blush:['#e58b6a',.7],hatch:.5,aura:'#ffe2b8',
      face:'<g fill="#a8643a" opacity=".45"><circle cx="109" cy="179" r="1.2"/><circle cx="116" cy="183" r="1.1"/><circle cx="191" cy="179" r="1.2"/><circle cx="184" cy="183" r="1.1"/></g>',
      deco:'<g fill="none" stroke="#9a6a43" stroke-width="2.8" stroke-linecap="round" opacity=".55"><path d="M232 74q-7-8 0-16t0-16"/><path d="M245 80q-7-8 0-16t0-14"/></g>'},

    /* Bosque: orejas de elfa, hojitas y una florcita. */
    bosque:{skin:['#fff1d8',.1],iris:['#f2ffe0','#a1e98f','#3da35a','#12532a'],ring:'#0e3a1c',pupil:'#06200d',hi:'#eaffdf',blush:['#ff9a86',.6],hatch:.4,aura:'#c6f2c9',
      ears:'<path d="M86 146C74 140 62 130 52 114C66 138 68 160 84 178Z" fill="{S}" stroke="#e7b99b" stroke-width="1"/><path d="M80 150C72 144 66 138 60 128C68 144 70 156 80 168Z" fill="#ffb4a4" opacity=".45"/>'
        +mir('<path d="M86 146C74 140 62 130 52 114C66 138 68 160 84 178Z" fill="{S}" stroke="#e7b99b" stroke-width="1"/><path d="M80 150C72 144 66 138 60 128C68 144 70 156 80 168Z" fill="#ffb4a4" opacity=".45"/>'),
      deco:'<path d="M98 64C86 52 74 56 70 66C82 72 92 70 98 64Z" fill="#5cc26e" stroke="#2f8f47" stroke-width="1"/><path d="M112 54C102 42 90 44 86 52C98 60 106 60 112 54Z" fill="#74d483" stroke="#2f8f47" stroke-width="1"/>'
        +'<g transform="translate(214 66)"><g fill="#fff" stroke="#e5ecd8" stroke-width=".8"><circle cx="0" cy="-6" r="4.4"/><circle cx="5.7" cy="-1.8" r="4.4"/><circle cx="3.5" cy="4.8" r="4.4"/><circle cx="-3.5" cy="4.8" r="4.4"/><circle cx="-5.7" cy="-1.8" r="4.4"/></g><circle r="3.2" fill="#ffd34d"/></g>'}
  };

  function apply(svg){
    if(!svg)return;const id=document.documentElement.dataset.theme||'kawaii',k=L[id]||L.kawaii;svg.dataset.look=id;
    const S=k.skin?mix('#ffe3d0',k.skin[0],k.skin[1]):'#ffe3d0';
    /* piel: todos los tonos de piel se mezclan con el color del tema (la cara, el cuello, las manos y los párpados cambian juntos) */
    if(k.skin){const mp={};SKIN.forEach(c=>mp[c]=mix(c,k.skin[0],k.skin[1]));
      svg.querySelectorAll('*').forEach(e=>['fill','stroke','stop-color'].forEach(a=>{const v=e.getAttribute(a);if(v&&mp[v.toLowerCase()])e.setAttribute(a,mp[v.toLowerCase()])}))}
    /* ojos */
    const st=svg.querySelectorAll('#ir stop');k.iris.forEach((c,i)=>st[i]&&st[i].setAttribute('stop-color',c));
    const mi={'#2a1760':k.ring,'#1b0e3a':k.pupil,'#c8f6ff':k.hi};
    svg.querySelectorAll('.iris *').forEach(e=>['fill','stroke'].forEach(a=>{const v=e.getAttribute(a);if(v&&mi[v.toLowerCase()])e.setAttribute(a,mi[v.toLowerCase()])}));
    if(k.irisFx)svg.querySelectorAll('.iris').forEach(g=>g.insertAdjacentHTML('beforeend',k.irisFx));
    /* rubor, aura */
    const bs=svg.querySelectorAll('#bk stop');if(bs[0]){bs[0].setAttribute('stop-color',k.blush[0]);bs[0].setAttribute('stop-opacity',k.blush[1]);if(bs[1])bs[1].setAttribute('stop-color',k.blush[0])}
    const hh=svg.querySelector('.lf g[stroke="#ff7fa6"]');if(hh){hh.setAttribute('opacity',k.hatch);if(k.hatch)hh.setAttribute('stroke',k.blush[0])}
    const as=svg.querySelector('#aura stop');if(as)as.setAttribute('stop-color',k.aura);
    /* detalles: DEBAJO de aretes y accesorios que compres */
    const put=(sel,where,html)=>{if(!html)return;const t=svg.querySelector(sel);if(t)t.insertAdjacentHTML(where,html.split('{S}').join(S))};
    put('.head > rect','afterend',k.neck);
    put('.lf','beforeend',k.face);
    put('.earl','beforebegin',k.ears);
    put('.accl','beforebegin',k.deco);
    put('.lm','beforeend',k.body);
  }
  return{apply,list:L};
})();
