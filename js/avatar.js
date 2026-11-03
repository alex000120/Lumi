/* Profesora Lumi: avatar anime 2.5D en SVG (capas con parallax, luces, expresiones y gestos). */
const Avatar=(()=>{
  const DEF={lash:'normal',earr:'none',pcol:['#fffbe0','#ffc94d'],phat:'none',pext:'none',deco:{kind:'kawaii',c:'#fff'},hair:['#4a2a78','#9a67e0'],style:'long',outfit:{type:'blazer',c1:'#2c9a86',c2:'#1b6558'},glasses:'round',acc:'star',bg:['#efe3ff','#c9b3f2']};
  const MO={closed:'M140 204Q150 205 160 204Q150 207 140 204Z',smile:'M135 201Q150 207 165 201Q150 221 135 201Z',flat:'M143 206Q150 205 157 206Q150 208 143 206Z',
    a:'M139 200Q150 196 161 200Q150 233 139 200Z',o:'M144 201Q150 197 156 201Q150 224 144 201Z',e:'M136 201Q150 198 164 201Q150 221 136 201Z',
    i:'M137 202Q150 200 163 202Q150 213 137 202Z',u:'M145 202Q150 199 155 202Q150 214 145 202Z',
    grin:'M131 199Q150 205 169 199Q150 236 131 199Z',smirk:'M138 205Q152 207 166 199Q154 214 138 205Z',wobble:'M140 206Q145 203 150 206Q155 209 160 206Q155 211 150 208Q145 211 140 206Z',
    kiss:'M146 201Q150 196 154 201Q150 211 146 201Z',yawn:'M140 198Q150 190 160 198Q164 236 150 236Q136 236 140 198Z'};
  const EX={
    neutral:{bl:'M98 122Q118 112 138 121',br:'M162 121Q182 112 202 122',m:'closed',l:[0,0],s:1},
    happy:{bl:'M98 118Q118 106 138 116',br:'M162 116Q182 106 202 118',m:'smile',l:[.28,.28],s:1.05},
    think:{bl:'M98 124Q118 116 138 123',br:'M162 110Q182 100 202 112',m:'flat',l:[.1,0],s:1},
    surprise:{bl:'M98 110Q118 98 138 108',br:'M162 108Q182 98 202 110',m:'o',l:[0,0],s:1.12},
    wink:{bl:'M98 118Q118 108 138 117',br:'M162 120Q182 112 202 121',m:'smile',l:[0,1],s:1},
    excited:{bl:'M98 112Q118 100 138 110',br:'M162 110Q182 100 202 112',m:'grin',l:[0,0],s:1.18},
    smug:{bl:'M98 124Q118 118 138 124',br:'M162 112Q182 102 202 114',m:'smirk',l:[.38,.38],s:.95},
    shy:{bl:'M98 120Q118 126 138 122',br:'M162 122Q182 126 202 120',m:'wobble',l:[.2,.2],s:.9},
    sleepy:{bl:'M98 126Q118 128 138 126',br:'M162 126Q182 128 202 126',m:'closed',l:[.92,.92],s:.9},
    dizzy:{bl:'M98 118Q118 110 138 120',br:'M162 120Q182 110 202 118',m:'o',l:[0,0],s:1.2},
    pat:{bl:'M98 120Q118 112 138 119',br:'M162 119Q182 112 202 120',m:'smile',l:[.78,.78],s:1},
    kiss:{bl:'M98 118Q118 108 138 117',br:'M162 120Q182 112 202 121',m:'kiss',l:[0,1],s:1.05},
    yawn:{bl:'M98 112Q118 104 138 112',br:'M162 112Q182 104 202 112',m:'yawn',l:[.8,.8],s:.9}
  };
  const EL={think:[4,-5],shy:[-5,4],smug:[4,-1],sleepy:[0,5]};
  const GE={none:[0,0],open:[52,-52],point:[6,-125],wave:[0,-152],think:[0,-168],shrug:[72,-72],cheer:[150,-150],hips:[30,-30],fidget:[-26,26],stretch:[165,-165],wide:[88,-88],present:[0,-98],present2:[98,0],beat:[14,-58],warn:[0,-172],clap:[-56,56],ear:[0,-135]};
  const V=['a','o','e','a','i','e','a','u'],pick=a=>a[Math.floor(Math.random()*a.length)],lastPick={},pickNR=(k,a)=>{if(a.length<2)return a[0];let i;do{i=Math.floor(Math.random()*a.length)}while(i===lastPick[k]);lastPick[k]=i;return a[i]};
  const eye=x=>{const k=x<150?-1:1;return `<g transform="translate(${x} 152)"><ellipse rx="17.5" ry="21" fill="#fff"/><circle cx="${-k*15.5}" cy="5" r="3.2" fill="#ff9fb8" opacity=".35"/><path d="M-17 -8Q0 -27 17 -8Q0 -14 -17 -8Z" fill="#cdbdf0" opacity=".55"/><g class="iris"><ellipse rx="13.6" ry="18.6" fill="url(#ir)"/><ellipse rx="13.6" ry="18.6" fill="none" stroke="#2a1760" stroke-width="1.8" opacity=".55"/><ellipse class="pup" rx="6.2" ry="10.5" fill="#1b0e3a"/><path d="M-13.6 -8Q0 -25 13.6 -8Q0 -1 -13.6 -8Z" fill="#1b0e3a" opacity=".3"/><path d="M-10 9Q0 19 10 9" fill="none" stroke="#c8f6ff" stroke-width="2.4" stroke-linecap="round" opacity=".55"/><ellipse class="hlt" cx="-5" cy="-7.5" rx="4.7" ry="5.3" fill="#fff"/><circle class="hlt hl2" cx="5.5" cy="8" r="2.4" fill="#fff" opacity=".92"/><path class="isp" d="M5 -4l1 2.4 2.4 1-2.4 1-1 2.4-1-2.4-2.4-1 2.4-1z" fill="#fff" opacity=".8"/></g><ellipse class="lidx" rx="21" ry="23" cy="-2" fill="#ffe2cf"/><ellipse class="lid" rx="21" ry="23" cy="-2" fill="#ffe2cf"/><path d="M-18 -13Q0 -34 18 -13" fill="none" stroke="#b58aa8" stroke-width="1.3" stroke-linecap="round" opacity=".4"/><path d="M-20 -5Q0 -29 20 -5" fill="none" stroke="#2a1740" stroke-width="4.6" stroke-linecap="round"/><path d="M${k*19} -8q${k*8} -2 ${k*10} -11" fill="none" stroke="#2a1740" stroke-width="3.4" stroke-linecap="round"/><path d="M${k*17} -14q${k*6} -1 ${k*8} -8" fill="none" stroke="#2a1740" stroke-width="2.4" stroke-linecap="round"/><path d="M-12 20Q0 25 12 20" fill="none" stroke="#7a4a6a" stroke-width="1.4" stroke-linecap="round" opacity=".4"/></g>`};
  const arm=(id,x,c)=>`<g class="arm" id="${id}" data-x="${x}" style="transform:translate(${x}px,298px)"><circle cy="1" r="16" fill="${c}"/><rect x="-15" y="-8" width="30" height="48" rx="15" fill="${c}"/><rect x="-9" y="0" width="5" height="28" rx="2.5" fill="#fff" opacity=".22"/><rect x="3" y="8" width="12" height="28" rx="6" fill="#1b0a33" opacity=".09"/><rect x="-15" y="28" width="30" height="9" rx="4.5" fill="#fff" opacity=".9"/><circle cy="47" r="10.5" fill="#ffdcc6"/><ellipse cx="8.5" cy="44" rx="3.4" ry="6" transform="rotate(-20 8.5 44)" fill="#ffdcc6"/><ellipse cx="2" cy="52" rx="6" ry="4.5" fill="#e8a88c" opacity=".22"/><path d="M-3.5 50v5.5M0 51v5.5M3.5 50v5.5" stroke="#d99a80" stroke-width="1" stroke-linecap="round" opacity=".6"/><ellipse cx="-3" cy="42" rx="4" ry="2.4" fill="#fff" opacity=".4"/></g>`;
  const LASH={largas:[['M98 148Q89 146 84 138',2],['M99 143Q91 139 88 131',2],['M101 139Q95 133 94 125',2]],
    mariposa:[['M98 149Q86 148 79 139',2.4],['M98 145Q87 140 83 129',2.4],['M100 141Q92 133 91 121',2.4],['M103 138Q99 130 100 120',2.2]]};
  const lashSvg=k=>{const L=LASH[k==='brillantes'?'largas':k];if(!L)return '';const one=(sg)=>L.map(([d,w])=>`<path d="${d}" transform="${sg<0?'translate(300 0) scale(-1 1)':''}" fill="none" stroke="#2a1740" stroke-width="${w}" stroke-linecap="round"/>`).join('');
    return '<g>'+one(1)+one(-1)+(k==='brillantes'?'<path d="M82 124l1.6 4 4 1.6-4 1.6-1.6 4-1.6-4-4-1.6 4-1.6z" fill="#ffd45e"/><path d="M218 124l1.6 4 4 1.6-4 1.6-1.6 4-1.6-4-4-1.6 4-1.6z" fill="#ffd45e"/>':'')+'</g>'};
  const ER={perlas:'<circle cy="3" r="3.8" fill="#fff" stroke="#d9d0e8"/>',estrellas:'<path d="M0 -3l1.6 3.6 3.8.4-2.9 2.6.9 3.8L0 5.2l-3.4 2.2.9-3.8L-5.4 1l3.8-.4z" fill="#ffd45e" stroke="#e0a82a" stroke-width=".8"/>',
    corazones:'<path d="M0 0C-5 -5 -9 1 0 8C9 1 5 -5 0 0Z" fill="#ff6fa5"/>',aros:'<circle cy="5" r="6" fill="none" stroke="#ffd45e" stroke-width="2"/>',cristal:'<path d="M0 -1V6" stroke="#cfd6ee"/><path d="M0 5L-4 10L0 17L4 10Z" fill="#7fe8ff" stroke="#fff" stroke-width=".8"/>'};
  const earSvg=k=>ER[k]?`<g transform="translate(79 176)">${ER[k]}</g><g transform="translate(221 176)">${ER[k]}</g>`:'';
  function hair(s){
    const g='url(#hg)',cap='M72 150C62 85 102 30 150 30S238 85 228 150';
    const back={long:`<path d="M70 150C58 80 100 28 150 28S242 80 230 150C242 220 238 300 218 345L82 345C62 300 58 220 70 150Z" fill="${g}"/>`,
      bob:`<path d="${cap}C236 200 232 232 214 246L86 246C68 232 64 200 72 150Z" fill="${g}"/>`,
      twin:`<path d="${cap}L222 175L78 175Z" fill="${g}"/><path d="M80 118C36 140 24 240 46 330C64 306 76 250 94 178Z" fill="${g}"/><path d="M220 118C264 140 276 240 254 330C236 306 224 250 206 178Z" fill="${g}"/><circle cx="84" cy="124" r="7" fill="#ff6fa5"/><circle cx="216" cy="124" r="7" fill="#ff6fa5"/>`,
      bun:`<path d="${cap}L226 205L74 205Z" fill="${g}"/><circle cx="104" cy="40" r="25" fill="${g}"/><circle cx="196" cy="40" r="25" fill="${g}"/>`,
      short:`<path d="${cap}C236 180 230 196 220 202L80 202C70 196 64 180 72 150Z" fill="${g}"/>`,
      pony:`<path d="${cap}L222 190L78 190Z" fill="${g}"/><path d="M200 66C256 56 284 130 268 220C256 276 240 300 230 334C226 284 234 232 222 176Z" fill="${g}"/><circle cx="204" cy="68" r="8" fill="#ff6fa5"/>`,
      wavy:`<path d="M70 150C58 80 100 28 150 28S242 80 230 150C268 190 258 280 244 338${'q-6 14-12 0'.repeat(15)}C42 280 32 190 70 150Z" fill="${g}"/>`,
      braid:`<path d="${cap}C236 200 232 232 214 246L86 246C68 232 64 200 72 150Z" fill="${g}"/>${[0,1,2,3,4,5,6].map(i=>`<ellipse cx="${74-i*3}" cy="${190+i*21}" rx="${13-i*.6}" ry="12" fill="${g}" stroke="#0003" stroke-width="1.5"/>`).join('')}<circle cx="53" cy="335" r="6" fill="#ff6fa5"/>`,
      half:`<path d="M70 150C58 80 100 28 150 28S242 80 230 150C242 220 238 300 218 345L82 345C62 300 58 220 70 150Z" fill="${g}"/><circle cx="150" cy="31" r="22" fill="${g}"/><ellipse cx="143" cy="24" rx="7" ry="4.5" fill="#fff" opacity=".16"/><circle cx="150" cy="48" r="6" fill="#ff6fa5"/>`}[s];
    const lk={long:'M76 142C68 190 72 235 88 268C98 232 100 190 96 150ZM224 142C232 190 228 235 212 268C202 232 200 190 204 150Z',
      wavy:'M76 142C68 190 72 235 88 268C98 232 100 190 96 150ZM224 142C232 190 228 235 212 268C202 232 200 190 204 150Z',
      bob:'M76 142C70 180 74 212 86 234C96 208 98 178 96 150ZM224 142C230 180 226 212 214 234C204 208 202 178 204 150Z'}[s]||'M76 142C74 172 78 196 86 212C94 190 96 166 96 150ZM224 142C226 172 222 196 214 212C206 190 204 166 204 150Z';
    return{back,lk};
  }
  function body(o){
    const sh='M40 360C38 330 50 306 78 292C100 280 118 274 132 268L168 268C182 274 200 280 222 292C250 306 262 330 260 360Z';
    const T={
      hoodie:()=>`<path d="${sh}" fill="url(#bz)"/><path d="M112 268Q150 246 188 268Q182 304 150 306Q118 304 112 268Z" fill="${o.c2}"/><path d="M142 290V326M158 290V326" stroke="#fff" stroke-width="3" stroke-linecap="round"/><path d="M104 345Q150 332 196 345V360H104Z" fill="${o.c2}" opacity=".55"/>`,
      sailor:()=>`<path d="${sh}" fill="url(#bz)"/><path d="M118 268L150 306L182 268L206 292L150 340L94 292Z" fill="#fff" stroke="${o.c2}" stroke-width="3"/><path d="M150 308L134 322L150 332L166 322Z" fill="#e8455f"/>`,
      kimono:()=>`<path d="${sh}" fill="url(#bz)"/><path d="M126 266L172 360M174 266L132 360" stroke="#fff" stroke-width="9" stroke-linecap="round"/><rect x="62" y="322" width="176" height="22" rx="6" fill="${o.c2}"/><circle cx="150" cy="333" r="9" fill="#ffd45e"/>`,
      space:()=>`<path d="${sh}" fill="#e9eef7"/><path d="M122 268Q150 292 178 268" fill="none" stroke="${o.c1}" stroke-width="9" stroke-linecap="round"/><circle cx="150" cy="316" r="13" fill="${o.c1}"/><path d="M144 316h12M150 310v12" stroke="#fff" stroke-width="3" stroke-linecap="round"/><path d="M60 336H240" stroke="${o.c2}" stroke-width="6"/>`,
      varsity:()=>`<path d="${sh}" fill="url(#bz)"/><path d="M122 268Q150 296 178 268" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round"/><path d="M150 288V360" stroke="#fff" stroke-width="3" opacity=".6"/><text x="120" y="334" font-family="Orbitron,Fredoka,sans-serif" font-weight="700" font-size="30" fill="#fff" text-anchor="middle">A</text>`,
      overalls:()=>`<path d="${sh}" fill="#fff6ef"/><path d="M122 268Q150 290 178 268" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/><path d="M62 336Q150 320 238 336V360H62Z" fill="${o.c1}"/><path d="M108 306Q108 298 116 298H184Q192 298 192 306V360H108Z" fill="${o.c1}"/><path d="M112 300L126 270M188 300L174 270" stroke="${o.c2}" stroke-width="12" stroke-linecap="round"/><path d="M112 300L126 270M188 300L174 270" stroke="${o.c1}" stroke-width="8" stroke-linecap="round"/><circle cx="112" cy="302" r="4.5" fill="#ffd45e"/><circle cx="188" cy="302" r="4.5" fill="#ffd45e"/><rect x="134" y="322" width="32" height="22" rx="6" fill="none" stroke="${o.c2}" stroke-width="2.2" stroke-dasharray="4 3"/>`,
      cardigan:()=>`<path d="${sh}" fill="url(#bz)"/><path d="M124 268Q150 304 176 268L184 360H116Z" fill="#fff8f2"/><path d="M124 268L116 360M176 268L184 360" stroke="${o.c2}" stroke-width="5" stroke-linecap="round"/><path d="M122 268Q150 300 178 268" fill="none" stroke="${o.c2}" stroke-width="7" stroke-linecap="round"/><circle cx="111" cy="300" r="3.2" fill="#fff"/><circle cx="109" cy="324" r="3.2" fill="#fff"/><circle cx="107" cy="348" r="3.2" fill="#fff"/>`,
      qipao:()=>`<path d="${sh}" fill="url(#bz)"/><path d="M126 268Q150 282 174 268L170 254Q150 264 130 254Z" fill="${o.c2}"/><path d="M134 272Q172 284 186 306L190 360" fill="none" stroke="#ffd45e" stroke-width="3.2" stroke-linecap="round"/><circle cx="150" cy="276" r="3.6" fill="#ffd45e"/><circle cx="170" cy="286" r="3.6" fill="#ffd45e"/><circle cx="183" cy="302" r="3.6" fill="#ffd45e"/><g fill="#ffd45e" opacity=".9"><circle cx="92" cy="332" r="5"/><circle cx="104" cy="342" r="4"/><circle cx="84" cy="344" r="3.5"/></g><path d="M62 350H238" stroke="${o.c2}" stroke-width="5" opacity=".6"/>`,
      pijama:()=>`<path d="${sh}" fill="url(#bz)"/><path d="M132 266L150 300L168 266" fill="none" stroke="#fff" stroke-width="4" stroke-linejoin="round"/><path d="M150 300V360" stroke="#fff" stroke-width="2.5" opacity=".7"/><g fill="#fff" opacity=".85"><path d="M82 312l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/><path d="M214 326l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/><path d="M104 346l1.6 4 4 1.6-4 1.6-1.6 4-1.6-4-4-1.6 4-1.6z"/><path d="M196 300l1.6 4 4 1.6-4 1.6-1.6 4-1.6-4-4-1.6 4-1.6z"/></g><path d="M96 292a9 9 0 1 0 6 14a7 7 0 0 1 -6 -14z" fill="#ffe27a"/><circle cx="150" cy="318" r="3" fill="#fff"/><circle cx="150" cy="338" r="3" fill="#fff"/>`,
      magica:()=>`<path d="${sh}" fill="url(#bz)"/><path d="M110 270Q150 300 190 270L202 288Q150 324 98 288Z" fill="#fff" opacity=".92"/><path d="M110 270Q150 300 190 270" fill="none" stroke="${o.c2}" stroke-width="3"/><path d="M144 306L132 340L146 332ZM156 306L168 340L154 332Z" fill="${o.c2}"/><path d="M150 302L116 286V318ZM150 302L184 286V318Z" fill="${o.c2}"/><circle cx="150" cy="302" r="8" fill="${o.c1}" stroke="#fff" stroke-width="2"/><path d="M150 296l2 4.4 4.6.5-3.4 3.2 1 4.6-4.2-2.4-4.2 2.4 1-4.6-3.4-3.2 4.6-.5z" fill="#ffd45e"/><path d="M50 352Q70 340 90 352T130 352T170 352T210 352T250 352V360H50Z" fill="#fff" opacity=".88"/>`,
      cyber:()=>`<path d="${sh}" fill="${o.c2}"/><path d="M116 270L124 248H176L184 270Z" fill="#12102a"/><path d="M150 252V360M106 296L134 326V360M194 296L166 326V360M60 330H110M190 330H240" fill="none" stroke="${o.c1}" stroke-width="2.6" stroke-linecap="round"/><circle class="tw" cx="150" cy="300" r="6" fill="${o.c1}"/><circle cx="150" cy="300" r="2.6" fill="#fff"/><path d="M118 270L150 292L182 270" fill="none" stroke="${o.c1}" stroke-width="3" stroke-linecap="round" opacity=".85"/>`,
      gala:()=>`<path d="${sh}" fill="url(#bz)"/><path d="M114 268Q132 292 150 280Q168 292 186 268Z" fill="#f3c3a6"/><path d="M114 268Q132 292 150 280Q168 292 186 268" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/><path d="M118 276Q150 306 182 276" fill="none" stroke="#fff" stroke-width="4.5" stroke-linecap="round" stroke-dasharray="0 7"/><path d="M62 326Q150 344 238 326V342Q150 360 62 342Z" fill="${o.c2}"/><g fill="#fff" opacity=".85"><path d="M92 304l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/><path d="M206 312l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/><path d="M130 332l1.6 4 4 1.6-4 1.6-1.6 4-1.6-4-4-1.6 4-1.6z"/></g>`,
      trench:()=>`<path d="${sh}" fill="url(#bz)"/><path d="M132 266L150 304L168 266Z" fill="#fff"/><path d="M147 298H153L156 332L150 340L144 332Z" fill="#8f2a40"/><path d="M126 266L150 322L100 300Z" fill="${o.c2}"/><path d="M174 266L150 322L200 300Z" fill="${o.c2}"/><rect x="56" y="334" width="188" height="11" fill="${o.c2}"/><rect x="143" y="331" width="14" height="17" rx="2" fill="none" stroke="#ffd45e" stroke-width="2.4"/><circle cx="126" cy="312" r="3" fill="${o.c2}" opacity=".8"/><circle cx="174" cy="312" r="3" fill="${o.c2}" opacity=".8"/>`,
      dress:()=>`<path d="${sh}" fill="url(#bz)"/><path d="M118 268Q150 296 182 268" fill="none" stroke="#fff" stroke-width="5"/><path d="M60 322Q150 340 240 322V336Q150 356 60 336Z" fill="${o.c2}" opacity=".5"/><circle cx="150" cy="300" r="5" fill="#ffd45e"/>`
    };
    if(T[o.type])return T[o.type]();
    if(o.type==='labcoat')return`<path d="${sh}" fill="#f4f7fb"/><path d="M132 266L150 330L168 266Z" fill="${o.c1}"/><path d="M132 268L150 330L108 360M168 268L150 330L192 360" fill="none" stroke="#b8c4d6" stroke-width="3"/>`;
    if(o.type==='sweater')return`<path d="${sh}" fill="url(#bz)"/><path d="M122 268Q150 300 178 268" fill="none" stroke="${o.c2}" stroke-width="9" stroke-linecap="round"/>`;
    return`<path d="${sh}" fill="url(#bz)"/><path d="M132 262L150 312L168 262Z" fill="#fff"/><path d="M132 268L150 312L112 360M168 268L150 312L188 360" fill="none" stroke="${o.c2}" stroke-width="3"/><path d="M138 303Q150 296 162 303Q150 316 138 303Z" fill="#f06fa0"/><circle cx="150" cy="307" r="4" fill="#d9467f"/>`;
  }
  const DS={heart:'M0 -3C-6 -9 -12 -2 0 7C12 -2 6 -9 0 -3Z',star:'M0 -8L2 -2 8 0 2 2 0 8-2 2-8 0-2-2Z',petal:'M0 -7C6 -7 8 0 0 7C-8 0 -6 -7 0 -7Z',sq:'M-3 -3H3V3H-3Z',plus:'M-1.5 -6H1.5V-1.5H6V1.5H1.5V6H-1.5V1.5H-6V-1.5H-1.5Z',dot:'M-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0Z'};
  const DK={kawaii:['heart','star','heart','star'],futurista:['plus','dot','plus','dot'],profesional:['dot','dot'],gamer:['sq','plus','sq','plus'],anime:['petal','petal','star','petal'],oceano:['dot','dot','petal','dot'],atardecer:['star','dot','star','dot'],medianoche:['star','dot','star','star'],cafe:['dot','petal','dot','petal'],bosque:['petal','petal','dot','petal']};
  const DP=[[30,40,1.1],[262,36,.9],[16,130,.8],[282,150,1],[40,226,.9],[268,238,.8],[24,300,1],[276,306,1.1],[84,18,.7],[212,22,.8]];
  const deco=d=>{d=d||{};const k=DK[d.kind]||DK.kawaii;return `<g class="bgfx" fill="${d.c||'#fff'}">${DP.map((p,i)=>`<g transform="translate(${p[0]} ${p[1]}) scale(${p[2]*(d.kind==='profesional'?2.2:1.3)})"><path class="tw" d="${DS[k[i%k.length]]}" style="animation-delay:${(i*.45).toFixed(2)}s"/></g>`).join('')}</g>`};
  const glasses=g=>g==='none'?'':g==='sun'?`<g fill="#1b1230" fill-opacity=".86" stroke="#2b2b38" stroke-width="2.6"><rect x="91" y="132" width="52" height="40" rx="14"/><rect x="157" y="132" width="52" height="40" rx="14"/></g><path d="M143 144H157" stroke="#2b2b38" stroke-width="3"/><path d="M100 140l14 0M166 140l14 0" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".5"/>`:g==='heart'?`<g fill="rgba(255,95,160,.18)" stroke="#ff5fa0" stroke-width="2.6" stroke-linejoin="round"><path d="M118 178C86 158 92 130 108 130C114 130 118 134 118 139C118 134 122 130 128 130C144 130 150 158 118 178Z"/><path transform="translate(64 0)" d="M118 178C86 158 92 130 108 130C114 130 118 134 118 139C118 134 122 130 128 130C144 130 150 158 118 178Z"/></g><path d="M146 148H154" stroke="#ff5fa0" stroke-width="2.6"/>`:g==='visor'?`<rect x="86" y="134" width="128" height="38" rx="19" fill="rgba(34,211,238,.26)" stroke="#22d3ee" stroke-width="3"/><path d="M96 144H140" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".6"/>`:g==='square'?`<path d="M93 144L83 148M207 144L217 148" stroke="#2b2b38" stroke-width="2.2" stroke-linecap="round"/><g fill="url(#lens)" stroke="#2b2b38" stroke-width="2.8"><rect x="92" y="130" width="52" height="44" rx="5"/><rect x="156" y="130" width="52" height="44" rx="5"/></g><g fill="none" stroke="#fff" stroke-width="1" opacity=".35"><rect x="94.5" y="132.5" width="47" height="39" rx="3"/><rect x="158.5" y="132.5" width="47" height="39" rx="3"/></g><path d="M144 146H156" stroke="#2b2b38" stroke-width="2.8"/><path d="M101 140L113 135M100 148L106 145M165 140L177 135M164 148L170 145" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity=".6"/>`:g==='cat'?`<path d="M93 144L83 148M207 144L217 148" stroke="#6b3fa8" stroke-width="2.2" stroke-linecap="round"/><g fill="url(#lens)" stroke="#6b3fa8" stroke-width="2.4"><path d="M90 134Q118 124 143 132L141 158Q136 176 116 176Q94 176 91 156Z"/><path d="M210 134Q182 124 157 132L159 158Q164 176 184 176Q206 176 209 156Z"/></g><path d="M143 140H157" stroke="#6b3fa8" stroke-width="2.4"/><path d="M101 140L113 135M100 148L106 145M165 140L177 135M164 148L170 145" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity=".6"/>`:`<path d="M93 144L83 148M207 144L217 148" stroke="#6b3fa8" stroke-width="2.2" stroke-linecap="round"/><g fill="url(#lens)" stroke="#6b3fa8" stroke-width="2.4"><rect x="93" y="130" width="50" height="46" rx="17"/><rect x="157" y="130" width="50" height="46" rx="17"/></g><g fill="none" stroke="#fff" stroke-width="1" opacity=".4"><rect x="95.2" y="132.2" width="45.6" height="41.6" rx="15"/><rect x="159.2" y="132.2" width="45.6" height="41.6" rx="15"/></g><path d="M143 150Q150 145 157 150" fill="none" stroke="#6b3fa8" stroke-width="2.4" stroke-linecap="round"/><circle cx="146" cy="160" r="1.8" fill="#fff" opacity=".6"/><circle cx="154" cy="160" r="1.8" fill="#fff" opacity=".6"/><path d="M101 140L113 135M100 148L106 145M165 140L177 135M164 148L170 145" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity=".6"/>`;
  const acc=a=>({star:'<path d="M92 66l4 9 10 1-8 6 3 10-9-6-9 6 3-10-8-6 10-1z" fill="#ffd45e" stroke="#e0a82a" stroke-width="1.2"/>',
    bow:'<path d="M96 62L76 50V74ZM96 62L116 50V74Z" fill="#ff6fa5"/><circle cx="96" cy="62" r="5" fill="#d9467f"/>',
    flower:'<g transform="translate(96 66)"><circle cx="0" cy="-9" r="6.5" fill="#ff9ccb"/><circle cx="9" cy="-3" r="6.5" fill="#ff9ccb"/><circle cx="6" cy="8" r="6.5" fill="#ff9ccb"/><circle cx="-6" cy="8" r="6.5" fill="#ff9ccb"/><circle cx="-9" cy="-3" r="6.5" fill="#ff9ccb"/><circle r="5" fill="#ffd45e"/></g>',
    ears:'<path d="M84 96L70 30L128 66Z" fill="#2b2b38"/><path d="M88 88L79 46L116 68Z" fill="#ff8fbf"/><path d="M216 96L230 30L172 66Z" fill="#2b2b38"/><path d="M212 88L221 46L184 68Z" fill="#ff8fbf"/><path d="M82 112C98 60 202 60 218 112" fill="none" stroke="#2b2b38" stroke-width="7" stroke-linecap="round"/>',
    halo:'<ellipse cx="150" cy="34" rx="42" ry="10" fill="none" stroke="#ffd45e" stroke-width="6"/><ellipse cx="150" cy="34" rx="42" ry="10" fill="none" stroke="#fff6c2" stroke-width="2" opacity=".8"/>',
    crown:'<path d="M108 70L112 38L130 58L150 30L170 58L188 38L192 70Z" fill="#ffd45e" stroke="#e0a82a" stroke-width="2" stroke-linejoin="round"/><circle cx="150" cy="44" r="4" fill="#ff6fa5"/><circle cx="114" cy="46" r="3" fill="#8be9ff"/><circle cx="186" cy="46" r="3" fill="#8be9ff"/>',
    phones:'<path d="M82 140C76 60 224 60 218 140" fill="none" stroke="#2b2b38" stroke-width="7" stroke-linecap="round"/><rect x="72" y="128" width="16" height="34" rx="8" fill="#ff6fa5"/><rect x="212" y="128" width="16" height="34" rx="8" fill="#ff6fa5"/>',
    bunny:'<g transform="rotate(-8 118 60)"><ellipse cx="118" cy="30" rx="13" ry="36" fill="#fff" stroke="#f3bcd6" stroke-width="2"/><ellipse cx="118" cy="34" rx="6" ry="26" fill="#ffb3d1"/></g><g transform="rotate(8 182 60)"><ellipse cx="182" cy="30" rx="13" ry="36" fill="#fff" stroke="#f3bcd6" stroke-width="2"/><ellipse cx="182" cy="34" rx="6" ry="26" fill="#ffb3d1"/></g>',
    graduate:'<path d="M112 66V88Q150 102 188 88V66L150 80Z" fill="#2a2a48"/><path d="M68 54L150 24L232 54L150 84Z" fill="#23233f" stroke="#3a3a66" stroke-width="2"/><path d="M150 54L214 62V96" fill="none" stroke="#ffd45e" stroke-width="3" stroke-linecap="round"/><circle cx="214" cy="98" r="5" fill="#ffd45e"/>',
    beret:'<g transform="rotate(-8 150 52)"><path d="M88 70C84 30 216 30 212 70C212 80 88 80 88 70Z" fill="#c2417a"/><circle cx="150" cy="32" r="5" fill="#8f2a5a"/></g>',
    witch:'<ellipse cx="150" cy="62" rx="68" ry="12" fill="#2b1f45"/><path d="M112 62L142 8Q152 -2 160 10L188 62Z" fill="#3a2a5e"/><path d="M114 56Q150 66 186 56" fill="none" stroke="#ffd45e" stroke-width="6"/>',
    antenna:'<g stroke="#9aa6c8" stroke-width="3" stroke-linecap="round"><path d="M132 52L116 14"/><path d="M168 52L184 14"/></g><circle cx="116" cy="12" r="7" fill="#22d3ee"/><circle cx="184" cy="12" r="7" fill="#ff2bd6"/><circle cx="116" cy="12" r="12" fill="#22d3ee" opacity=".25" class="tw"/><circle cx="184" cy="12" r="12" fill="#ff2bd6" opacity=".25" class="tw"/>',
    headset:'<path d="M82 140C76 60 224 60 218 140" fill="none" stroke="#1d1d2b" stroke-width="7" stroke-linecap="round"/><rect x="72" y="128" width="16" height="34" rx="8" fill="#a3ff12"/><rect x="212" y="128" width="16" height="34" rx="8" fill="#a3ff12"/><path d="M80 160Q82 205 118 208" fill="none" stroke="#1d1d2b" stroke-width="4" stroke-linecap="round"/><circle cx="120" cy="208" r="6" fill="#a3ff12"/>',
    butterfly:'<g transform="translate(96 66)"><ellipse cx="-9" cy="-5" rx="11" ry="8" transform="rotate(-25 -9 -5)" fill="#b794ff"/><ellipse cx="9" cy="-5" rx="11" ry="8" transform="rotate(25 9 -5)" fill="#ff9ccb"/><ellipse cx="-7" cy="7" rx="8" ry="6" transform="rotate(25 -7 7)" fill="#8be9ff"/><ellipse cx="7" cy="7" rx="8" ry="6" transform="rotate(-25 7 7)" fill="#ffd45e"/><rect x="-1.5" y="-9" width="3" height="20" rx="1.5" fill="#3b2060"/></g>',
    party:'<path d="M122 68L150 8L178 68Z" fill="#ff6fa5"/><path d="M130 54L170 54M136 40L164 40" stroke="#fff" stroke-width="4" opacity=".7"/><circle cx="150" cy="8" r="7" fill="#ffd45e"/>',
    headband:'<path d="M80 128C94 54 206 54 220 128" fill="none" stroke="#ff3b6b" stroke-width="7" stroke-linecap="round"/><path d="M196 74L218 64V88ZM196 74L176 64V88Z" fill="#ff3b6b"/><circle cx="196" cy="74" r="4" fill="#c21f4d"/>',
    cherry:'<g transform="translate(96 70)"><path d="M-6 6Q-4 -16 6 -22M8 8Q10 -12 6 -22" fill="none" stroke="#3a9a4a" stroke-width="2.5"/><circle cx="-6" cy="10" r="8" fill="#e11d48"/><circle cx="9" cy="12" r="8" fill="#e11d48"/><circle cx="-8" cy="7" r="2" fill="#fff" opacity=".6"/><circle cx="7" cy="9" r="2" fill="#fff" opacity=".6"/></g>'}[a]||'');

  const RX={giggle:{m:'happy',g:'none',fx:['💕','✨'],a:'giggle',b:1},gasp:{m:'surprise',g:'open',fx:['❗'],a:'gasp'},proud:{m:'wink',g:'cheer',fx:['⭐','✨'],a:'hop',b:1},
    think:{m:'think',g:'think',fx:['❓','💭'],a:'tilt'},oops:{m:'wink',g:'shrug',fx:['💦'],a:'shake',b:1},nod:{m:'happy',g:'open',fx:[],a:'nod'},love:{m:'happy',g:'none',fx:['💖','💖','✨'],a:'giggle',b:1},
    idea:{m:'surprise',g:'point',fx:['💡'],a:'hop'},cheer:{m:'happy',g:'cheer',fx:['🎉','✨','🎉'],a:'hop',b:1},
    kiss:{m:'kiss',g:'none',fx:['😘','💕','💖'],a:'hop',b:1},smug:{m:'smug',g:'hips',fx:['😏','✨'],a:'tilt'},shy:{m:'shy',g:'fidget',fx:['💦','💗'],a:'tilt',b:1},
    wow:{m:'excited',g:'cheer',fx:['🤩','✨','⭐','✨'],a:'hop',b:1},dizzy:{m:'dizzy',g:'open',fx:['💫','💫','💫'],a:'dizzy',spin:1},
    dance:{m:'excited',g:'none',fx:['🎵','🎶','✨','🎵'],a:'dance',b:1,dance:1},pat:{m:'pat',g:'none',fx:['💗','💗','✨'],a:'purr',b:1},
    twirl:{m:'happy',g:'hips',fx:['✨','💃','✨'],a:'hop',b:1,twirl:1},applause:{m:'excited',g:'clap',fx:['👏','✨','👏'],a:'hop',b:1},highfive:{m:'excited',g:'wave',fx:['✋','✨'],a:'hop'},yawn:{m:'yawn',g:'stretch',fx:['💤'],a:'stretch'},
    sigh:{m:'sleepy',g:'none',fx:['💨','✨'],a:'sigh'},huff:{m:'smug',g:'hips',fx:['😤','💢'],a:'shake',b:1},tease:{m:'wink',g:'hips',fx:['😜','✨'],a:'tilt',b:1},
    sneeze:{m:'surprise',g:'none',fx:['🤧','💦'],a:'sneeze'},hum:{m:'happy',g:'none',fx:['🎵','🎶','🎵','🎶'],a:'sway',b:1},peek:{m:'think',g:'none',fx:['👀'],a:'peek'},
    flex:{m:'smug',g:'cheer',fx:['💪','✨','💪'],a:'hop',b:1},laugh:{m:'happy',g:'none',fx:['😂','✨','😂'],a:'laugh',b:1},shrug:{m:'wink',g:'shrug',fx:['🤷'],a:'tilt'},
    party:{m:'excited',g:'cheer',fx:['🎊','🎉','🎊','🥳','✨','🎉'],a:'hop',b:1,twirl:1}};
  const QUIPS={giggle:['¡Jiji, cosquillas!','¡Oye, que me despeinas!','¡Eso me da cosquillitas!'],gasp:['¡Ay! ¡Me asustaste!','¿Eh? ¿Qué pasó?'],love:['¡Qué lindo eres! 💖','Yo también te quiero un montón'],
    idea:['¡Se me ocurrió algo! ¿Estudiamos?','¿Hacemos un ejercicio rápido?'],smug:['Sí, ya sé que soy genial 😎','Sé lo que estás pensando… ¡y tienes razón!'],kiss:['Muah 😘 ¡Ánimo!','Un besito de la suerte'],
    shy:['No me mires tanto… 😳','Ay, me da penita…'],wow:['¡¿Qué?! ¡Qué emoción!','¡Wow, wow, wow!'],dance:['¡Vamos a bailar! 🎶','¡Mueve el esqueleto!'],dizzy:['Uuuy… todo me da vueltas…','¡Para, para, que me mareo!'],
    pat:['Mmm… qué rico, sigue 💗','Me encantan los mimitos'],highfive:['¡Choca esos cinco! ✋','¡Esa es mi gente!'],
    sigh:['Uf… qué alivio 😮‍💨','Ahhh, ya pasó lo difícil'],huff:['¡Hmpf! Me hago la ofendida… un ratito 😤','¡Oye! Que yo también tengo sentimientos'],tease:['¿Seguro que no lo sabías? 😜','Ya te vi, eh… 😏'],
    sneeze:['¡Achú! Perdón 🤧','¡Achís! Salud… ¡digo, gracias!'],hum:['Lalala… 🎶','Tarareando mientras te espero 🎵'],peek:['Mmm… ¿qué será eso? 👀','Déjame ver más de cerca…'],
    flex:['¡Tú puedes con esto! 💪','¡Cerebro en modo fuerte!'],laugh:['¡Jajaja! ¡Me dio risa!','Ay, no puedo… 😂'],shrug:['¡Quién sabe! Averigüémoslo juntos 🤷','A veces no hay una sola respuesta…'],
    party:['¡FIESTA! 🥳','¡Esto hay que celebrarlo!']};
  const FASHQ=['¡Mira cómo me queda! ✨','¡Me encanta! ¿Qué tal me veo?','¡Qué estilo! Gracias 💖','Ta-chán… ¡nueva yo!'];
  const WAKEQ=['¡Pip, despierta! Ya volvió ✨','Mmm… ¡buenos días! ¿Dormimos mucho? ☀️','¡No estaba dormida! Solo descansaba los ojitos 😅','¡Ah! ¡Volviste! Te extrañé','¡Uf, qué buen sueño! ¿Estudiamos?','Mmm… soñé que me abrazabas… digo, ¡que estudiábamos! 🙈','¡Ay! Qué calentito estaba… ¡buenos días! ☀️','Pip, mira, ¡volvió! Qué alegría verte 💛'];
  const LORE=['Mi número favorito es el 7… y no, no sé por qué 🎲','Si yo fuera una fórmula, sería e^(iπ)+1=0: elegante y misteriosa ✨','Mi sueño es ver las estrellas de cerquita… ¡y explicarte cada una! 🌟',
    'Mi superpoder: convertir «no entiendo» en «¡ahhh, ya entendí!» 💡','Colecciono teoremas como otros coleccionan stickers 📚','Un alfajorcito y un tecito: mi combo de estudio perfecto ☕','Mi lunes ideal empieza con un tema nuevo y cero apuros 🌈',
    'Dato mío: me emociono con las gráficas bonitas 📈','Mi frase favorita: «equivocarse es la forma que tiene el cerebro de aprender» 🧠','Pip y yo apostamos a ver quién aprende más rápido… ¡y ella hace trampa! ⭐',
    'Me encantan las preguntas raras: son las mejores 🤔','Cuando algo me sale bien, hago un bailecito. Es ley 💃','Si yo fuera un color, sería violeta: misterioso y con brillo 💜','Soy mejor explicando con dibujitos… ¡pídemelo! ✏️'];
  const IDLEQ=['¿Qué quieres aprender hoy?','Estoy lista cuando tú lo estés ✨','Pregúntame lo que sea, ¡no muerdo!','¿Hacemos un ejercicio rápido?','Dato curioso: las abejas bailan para dar direcciones 🐝',
    'Dato curioso: los pulpos tienen tres corazones 🐙','Dato curioso: la miel casi nunca se echa a perder 🍯','Dato curioso: un día en Venus dura más que su año 🪐','Dato curioso: el corazón de un camarón está en su cabeza 🦐',
    'Tip: estudiar 25 minutos y descansar 5 funciona de maravilla ⏱️','Tip: explicarle algo a alguien es la mejor forma de aprenderlo 🧠','Tip: dormir bien te ayuda a guardar lo que estudiaste 😴','Tip: los errores son pistas, no fracasos 🔍',
    '¿Y si hoy aprendemos algo que no sabías que querías saber? ✨','Shhh… estoy tarareando mientras espero 🎵'];
  const T=(y,r,s)=>({transform:`translateY(${y}px) rotate(${r}deg) scale(${s||1})`});
  const AN={giggle:[[T(0,0),T(-3,3),T(0,-3),T(-3,3),T(0,-2),T(0,0)],950],gasp:[[T(0,0),T(-9,-3,1.03),T(-9,-3,1.03),T(0,0)],1200],hop:[[T(0,0),T(-14,0),T(0,0),T(-8,0),T(0,0)],720],
    tilt:[[T(0,0),T(0,7),T(0,7),T(0,0)],1700],shake:[[T(0,0),T(0,-5),T(0,5),T(0,-4),T(0,4),T(0,0)],850],nod:[[T(0,0),T(6,0),T(0,0),T(6,0),T(0,0)],850],
    dizzy:[[T(0,0),T(0,-9),T(0,9),T(0,-9),T(0,9),T(0,-5),T(0,0)],1500],dance:[[T(0,0),T(-8,6),T(0,0),T(-8,-6),T(0,0)],800,4],purr:[[T(0,0),T(2,2),T(0,0),T(2,-2),T(0,0)],500,5],stretch:[[T(0,0),T(-6,0,1.02),T(-6,0,1.02),T(0,0)],1800],
    sigh:[[T(0,0),T(-5,0,1.01),T(7,0),T(7,0),T(0,0)],2000],sneeze:[[T(0,0),T(-6,-5),T(-8,-6),T(10,3),T(0,0)],900],sway:[[T(0,0),T(0,5),T(0,0),T(0,-5),T(0,0)],1600,2],
    peek:[[T(0,0),T(5,-5,1.04),T(5,-5,1.04),T(0,0)],1500],laugh:[[T(0,0),T(-3,3),T(0,-3),T(-3,3),T(0,-3),T(-3,3),T(0,0)],700,3]};
  let baseMood='neutral',reactT=null;
  function fx(list){
    if(!root||!list.length)return;let f=root.querySelector('.fx');if(!f){f=document.createElement('div');f.className='fx';root.appendChild(f)}
    list.forEach((c,i)=>setTimeout(()=>{const p=document.createElement('span');p.className='fx-p';p.textContent=c;p.style.left=(30+Math.random()*40)+'%';p.style.top=(12+Math.random()*28)+'%';f.appendChild(p);setTimeout(()=>p.remove(),1900)},i*180));
  }
  let danceT,rollT,jit=[0,0],typeT=0,typeN=0;
  function jt(){jit=[(Math.random()-.5)*2.4,(Math.random()-.5)*1.8];if(svg&&!talking)tilt();setTimeout(jt,1200+Math.random()*2600)}
  function dance(ms){clearInterval(danceT);let f=0;const lm=svg.querySelector('.lm');
    if(lm&&lm.animate)try{lm.animate([{transform:'rotate(-3deg)'},{transform:'rotate(3deg)'}],{duration:400,direction:'alternate',iterations:Math.round(ms/400),easing:'ease-in-out',composite:'add'})}catch(e){}
    danceT=setInterval(()=>{if(!aL)return;const a=f++%2?[110,-40]:[40,-110];setArm(aL,a[0]);setArm(aR,a[1]);kick(f%2?6:-6);bobK(2.5)},400);
    setTimeout(()=>{clearInterval(danceT);if(!liveT)gesture('none')},ms)}
  function roll(ms){const t0=performance.now();clearInterval(rollT);rollT=setInterval(()=>{const t=performance.now()-t0,k=t/1000*9;look(Math.cos(k)*5,Math.sin(k)*4);if(t>ms){clearInterval(rollT);look(0,0)}},40)}
  function spin(){['.lb','.lm','.lh'].forEach(q=>{const e=svg.querySelector(q);if(e&&e.animate)try{e.animate([{transform:'scaleX(1)'},{transform:'scaleX(.04)',offset:.25},{transform:'scaleX(-1)',offset:.5},{transform:'scaleX(.04)',offset:.75},{transform:'scaleX(1)'}],{duration:900,easing:'ease-in-out',composite:'add'})}catch(x){}})}
  /* Dibujo de Pip y sus cositas de la tienda (color, gorro, extra). */
  const pipGrad=()=>{const c=st.pcol||DEF.pcol;return `<radialGradient id="pg" cx=".4" cy=".35" r=".7">${c.map((x,k)=>`<stop offset="${c.length<2?0:k/(c.length-1)}" stop-color="${x}"/>`).join('')}</radialGradient>`};
  const PHAT={
    party:'<path d="M-9 -11L0 -30L9 -11Z" fill="#7c5cff"/><path d="M-5 -19L5 -19M-7 -14L7 -14" stroke="#ffd45e" stroke-width="1.6"/><circle cy="-31" r="3" fill="#ffd45e"/>',
    crown:'<path d="M-10 -12L-10 -23L-5 -17L0 -26L5 -17L10 -23L10 -12Z" fill="#ffd45e" stroke="#e0a82a" stroke-width="1.2" stroke-linejoin="round"/><circle cx="0" cy="-20" r="1.6" fill="#ff6fa5"/>',
    wizard:'<path d="M-12 -11Q0 -8 12 -11L2 -35Q-1 -35 -12 -11Z" fill="#4b3c8f"/><ellipse cy="-11" rx="14" ry="3.5" fill="#3a2d73"/><path d="M-1 -22l1 2 2 .3-1.5 1.4.4 2-1.9-1-1.9 1 .4-2-1.5-1.4 2-.3z" fill="#ffd45e"/>',
    santa:'<path d="M-12 -9Q-10 -29 8 -27Q13 -20 12 -9Z" fill="#e23b3b"/><ellipse cy="-9" rx="13.5" ry="3.6" fill="#fff"/><circle cx="9" cy="-27" r="3.6" fill="#fff"/>',
    cap:'<path d="M-13 -8Q-12 -25 3 -24Q13 -22 13 -8Z" fill="#3a86ff"/><path d="M3 -9Q17 -9 21 -4Q10 -3 3 -6Z" fill="#2a64c8"/><circle cx="1" cy="-24" r="1.8" fill="#2a64c8"/>',
    flower:'<g transform="translate(7 -13)"><circle cy="-5" r="3.6" fill="#ff9ccb"/><circle cx="5" cy="-1.5" r="3.6" fill="#ff9ccb"/><circle cx="3" cy="4" r="3.6" fill="#ff9ccb"/><circle cx="-3" cy="4" r="3.6" fill="#ff9ccb"/><circle cx="-5" cy="-1.5" r="3.6" fill="#ff9ccb"/><circle r="3" fill="#ffd45e"/></g>',
    halo:'<ellipse class="phalo" cy="-22" rx="9" ry="3" fill="none" stroke="#ffd45e" stroke-width="2.6"/>',
    graduate:'<path d="M-9 -11V-4Q0 0 9 -4V-11Z" fill="#2b2b3a"/><path d="M-15 -14L0 -21L15 -14L0 -7Z" fill="#383850"/><path d="M12 -14V-5" stroke="#ffd45e" stroke-width="1.5"/><circle cx="12" cy="-4" r="1.8" fill="#ffd45e"/>'};
  const PEXT={
    bow:'<path d="M0 14L-8 9.5V18.5ZM0 14L8 9.5V18.5Z" fill="#ff6fa5"/><circle cy="14" r="2.3" fill="#d9467f"/>',
    scarf:'<path d="M-13.5 10Q0 19 13.5 10L13.5 15.5Q0 24 -13.5 15.5Z" fill="#e8554e"/><path d="M8 17L13 28L6 26Z" fill="#c9423c"/><path d="M-9 14.5L9 14.5" stroke="#fff" stroke-width="1.2" opacity=".6"/>',
    shades:'<path d="M-10.5 -4.5H-1V3H-10.5ZM1 -4.5H10.5V3H1Z" fill="#1b1b26"/><path d="M-1 -2.5H1" stroke="#1b1b26" stroke-width="1.4"/><path d="M-9 -3L-6 -3M3 -3L6 -3" stroke="#fff" opacity=".5"/>',
    bell:'<path d="M-9.5 11.5Q0 17.5 9.5 11.5" fill="none" stroke="#e0405c" stroke-width="2.6" stroke-linecap="round"/><circle cy="16.5" r="3" fill="#ffd45e" stroke="#e0a82a"/>',
    phones:'<path d="M-14.5 -2Q0 -26 14.5 -2" fill="none" stroke="#444" stroke-width="2.6"/><rect x="-18" y="-5" width="5" height="9" rx="2.4" fill="#ff6fa5"/><rect x="13" y="-5" width="5" height="9" rx="2.4" fill="#ff6fa5"/>',
    balloon:'<g class="pbn"><path d="M13 -8Q22 -20 27 -35" fill="none" stroke="#9a8fb8" stroke-width="1"/><ellipse cx="28" cy="-44" rx="8" ry="10" fill="#ff6b8b"/><path d="M26 -50Q24 -46 25 -42" stroke="#fff" opacity=".6" stroke-width="1.6" fill="none" stroke-linecap="round"/></g>'};
  const pipSvg=()=>{const h=PHAT[st.phat],e=st.pext||'none',cape=e==='cape'?'<path d="M-12 5L-23 27Q0 21 23 27L12 5Z" fill="#e23b3b"/><path d="M-12 5L-23 27Q-19 24 -14 23Z" fill="#b82c2c"/>':'';
    const W='M-15 -4Q-24 -12 -20 -20Q-12 -16 -9 -10Z',W2='M15 -4Q24 -12 20 -20Q12 -16 9 -10Z';
    return '<g class="pw" transform="translate(252 66)"><g class="pet" data-m="n"><g class="pp">'+cape
    +`<path class="pwl" d="${W}" fill="#fff" opacity=".85"/><path class="pwr" d="${W2}" fill="#fff" opacity=".85"/>`
    +(h?'':'<path d="M0 -14L0 -20" stroke="#e0a82a" stroke-width="1.6" stroke-linecap="round"/><path class="pst" d="M0 -29l2 4.2 4.4.5-3.2 3 .9 4.4L0 -17.6l-4.1 2.5.9-4.4-3.2-3 4.4-.5z" fill="#ffd45e" stroke="#e0a82a" stroke-width="1"/>')
    +'<circle r="15" fill="url(#pg)"/>'
    +'<g class="pe"><ellipse cx="-5" cy="-1" rx="2" ry="2.6" fill="#5b3a8c"/><ellipse cx="5" cy="-1" rx="2" ry="2.6" fill="#5b3a8c"/></g>'
    +'<path class="pm pm1" d="M-3 5Q0 8 3 5" fill="none" stroke="#5b3a8c" stroke-width="1.6" stroke-linecap="round"/><ellipse class="pm pm2" cx="0" cy="5.5" rx="2.6" ry="3" fill="#5b3a8c"/>'
    +'<circle class="pbl" cx="-9" cy="4" r="2.4" fill="#ff8fa8"/><circle class="pbl" cx="9" cy="4" r="2.4" fill="#ff8fa8"/>'
    +(h||'')+(e==='cape'?'':(PEXT[e]||''))
    +'<text class="pz" x="13" y="-12" font-size="11" font-weight="700" fill="#7a5bb5">z</text></g></g></g>'};
  /* Pip: mascota con vida propia (todo local, sin llamadas a la IA). Caras por data-m: n, happy, wow, shy, sleep. */
  const RM=window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches;
  const PIPQ=['¡Es Pip, mi estrellita! ⭐','¡Pip dice hola!','Cuidado, ¡Pip es muy travieso!','Pip: ¡piii piii! ⭐','Pip quiere jugar contigo 💛','Shhh… Pip está haciendo travesuras 🤭','¡Pip te está mirando! 👀'];
  let pipMT=0,pTaps=[];
  const pEl=()=>svg&&svg.querySelector('.pet');
  function pm(m,ms){const p=pEl();if(!p)return;p.dataset.m=m;clearTimeout(pipMT);if(m!=='n'&&ms)pipMT=setTimeout(()=>{const q=pEl();if(q)q.dataset.m='n'},ms)}
  function pa(k,d,o){const e=svg&&svg.querySelector('.pp');if(RM||!e||!e.animate)return;try{e.animate(k,Object.assign({duration:d,easing:'ease-in-out'},o||{}))}catch(x){}}
  const TR=(x,y,r,s,o)=>({transform:`translate(${x}px,${y}px) rotate(${r||0}deg) scale(${s||1})`,opacity:o==null?1:o});
  const PT={
    orbit(){pm('happy',2300);pa([TR(0,0),TR(-45,-16,-20),TR(-115,6,-45),TR(-70,52,-90),TR(-5,36,-45),TR(0,0)],2300);fx(['✨'])},
    zoom(){pm('wow',1500);pa([TR(0,0),TR(-125,-8,-25,1.1),TR(-125,-8,-25,1.1),TR(0,0)],1600,{easing:'cubic-bezier(.5,0,.2,1)'})},
    loop(){pm('happy',1300);pa([TR(0,0),TR(-22,-28,-180,1.15),TR(0,-4,-360),TR(0,0,-360)],1200)},
    flip(){pm('happy',900);pa([TR(0,0),TR(0,-24,180,1.25),TR(0,0,360)],800,{easing:'cubic-bezier(.3,1.4,.5,1)'})},
    hide(){pm('shy',2200);pa([TR(0,0),TR(12,10,0,.2,0),TR(12,10,0,.2,0),TR(0,0)],2200)},
    giggle(){pm('happy',1200);pa([TR(0,0),TR(-3,0,-12),TR(3,0,12),TR(-3,0,-12),TR(3,0,12),TR(0,0)],650,{iterations:2})},
    dizzy(){pm('wow',1700);pa([TR(0,0),TR(0,0,360),TR(0,0,720),TR(0,0,720)],1600);fx(['💫'])},
    sneeze(){pm('wow',800);pa([TR(0,0),TR(4,0,15,.9),TR(-7,-3,-12,1.3),TR(0,0)],700);fx(['✨','✨'])},
    sing(){pm('happy',2400);pa([TR(0,0),TR(0,-4,-8),TR(0,0),TR(0,-4,8),TR(0,0)],1200,{iterations:2});fx(['🎵','⭐'])},
    nap(){pm('sleep',3200);fx(['💤'])},
    wave(){pm('happy',1600);pa([TR(0,0),TR(-4,-6,-14),TR(4,-6,14),TR(-4,-6,-14),TR(4,-6,14),TR(0,0)],1400)},
    kiss(){pm('shy',1800);pa([TR(0,0),TR(-6,-5,-10,1.1),TR(0,0)],1200);fx(['💛','💛','💖'])},
    bounce(){pm('happy',1500);pa([TR(0,0),TR(0,-16),TR(0,0),TR(0,-12),TR(0,0),TR(0,-7),TR(0,0)],1500,{easing:'cubic-bezier(.3,.7,.5,1)'})},
    think(){pm('wow',900);pa([TR(0,0),TR(-3,-6,-10),TR(0,0)],1100)},
    stretch(){pm('happy',1400);pa([TR(0,0),TR(0,-4,0,.82),TR(0,-8,0,1.18),TR(0,0)],1300)},
    purr(){pm('happy',2600);pa([TR(0,0),TR(0,-3,-6),TR(0,0),TR(0,-3,6),TR(0,0)],700,{iterations:4});fx(['💛','💛','💖'])},
    eat(){pm('happy',2200);pa([TR(0,0),TR(0,0,0,1.18,1),TR(0,0,0,.92),TR(0,0,0,1.14),TR(0,0,0,.94),TR(0,0,0,1.1),TR(0,0)],1500)},
    hiccup(){pm('wow',1300);pa([TR(0,0),TR(0,-9),TR(0,0),TR(0,-9),TR(0,0),TR(0,-9),TR(0,0)],1200,{easing:'ease-out'});if(!talking)quip('¡Hic! Pip tiene hipo 😳',true)},
    wow(){pm('wow',1100);pa([TR(0,0),TR(0,-10,0,1.3),TR(0,0)],800)}
  };
  /* Lumi y Pip: Lumi mira a Pip y comenta lo que hace. */
  const LP={orbit:['wow','¡Pip, qué acrobacias! 🤩'],zoom:['wow','¡Qué velocidad, Pip!'],flip:['applause','¡Bravo, Pip! 👏'],kiss:['shy','Ay, Pip… ¡qué ternura! 🥹'],eat:['giggle','¡Pip, no te atragantes! 😂'],
    hiccup:['giggle','Jiji, ¡Pip tiene hipo! 😂'],dizzy:['laugh','¡Pip, para que te mareas! 😂'],hide:['peek','¿Dónde se fue Pip? 👀'],sneeze:['gasp','¡Salud, Pip! 🤧'],sing:['hum','Pip está cantando, ¡qué linda voz! 🎶'],bounce:['cheer','¡Boing, boing! Pip está feliz ✨']};
  let lpAt=0;
  function lumiOnPip(k){const r=LP[k];if(!r||!svg||talking||liveT||sleeping||EL[cur])return;const n=performance.now();if(n-lpAt<30000||Math.random()>.45)return;lpAt=n;
    look(4,-3);setTimeout(()=>{if(talking||liveT||!svg)return;react(r[0]);setTimeout(()=>quip(r[1],true),500);setTimeout(()=>{if(!talking&&!EL[cur])look(0,0)},1800)},500)}
  Object.keys(PT).forEach(k=>{const f=PT[k];PT[k]=function(){f();lumiOnPip(k)}});
  const PMAP={gasp:'wow',wow:'wow',love:'sing',kiss:'sing',cheer:'flip',proud:'loop',party:'orbit',dance:'orbit',giggle:'giggle',laugh:'giggle',tease:'giggle',dizzy:'dizzy',sneeze:'sneeze',yawn:'nap',shy:'hide',peek:'hide',hum:'sing',twirl:'loop',highfive:'flip',idea:'think',flex:'flip'};
  function petPlay(user){if(!svg)return;
    if(!user){const k=pick(Object.keys(PT).filter(x=>!['nap','dizzy','think','eat','purr','hiccup'].includes(x)));PT[k]();if(Math.random()<.3&&(st.phat!=='none'||st.pext!=='none'))quip(pick(['¡Pip presume su estilo! 😎','¿Viste lo bien que se ve Pip? ✨','Pip se siente muy elegante 💅']),true);return}
    const now=performance.now();pTaps=pTaps.filter(t=>now-t<2000);pTaps.push(now);const n=pTaps.length;
    let tot=1;try{tot=Store.get('pipTaps',0)+1;Store.set('pipTaps',tot)}catch(e){}
    if(n>=6){PT.dizzy();pTaps=[]}else if(tot%8===0&&!pg)pgStart();else PT[n>=3?pick(['orbit','flip','giggle','zoom']):pick(['loop','giggle','flip','hide','sneeze','sing','wow'])]();
    pipAdd(1);kick(4);bobK(2);fx(['✨','⭐']);
    if(!talking&&!EL[cur]){look(4,-4);setTimeout(()=>{if(!talking&&!EL[cur])look(0,0)},1000)}
    const ms={10:'¡Pip ya te tiene confianza! 💛',25:'¡Pip y tú ya son mejores amigos! 🌟',50:'¡Pip te quiere muchísimo! ⭐💛',100:'¡100 toques a Pip! Ya es oficialmente tu mascota favorita 🏆'}[tot];
    quip(ms||(Math.random()<.5?(Math.random()<.5?pipLvQ():pick(PIPQ)):''))}
  /* Nivel de amistad con Pip: sube con toques, comida, mimos, juegos y arrastres. */
  const PLV=[0,10,30,60,100,160,250,400],TT=['Curiosa','Amiguita','Compañera','Mejor amiga','Aventurera','Estrella brillante','Leyenda ⭐','Guardiana de Lumi'];
  const pipPts=()=>{try{return Store.get('pipPts',0)}catch(e){return 0}},lvOf=p=>PLV.filter(t=>p>=t).length-1;
  function pipAdd(n){let p;try{p=Store.get('pipPts',0)+n;Store.set('pipPts',p)}catch(e){return}const l=lvOf(p);let sv=0;try{sv=Store.get('pipLv',0)}catch(e){}
    if(l>sv){try{Store.set('pipLv',l)}catch(e){}setTimeout(()=>{if(!svg)return;PT.orbit();fx(['🎉','⭐','💛','✨']);try{Shop.earn(5*l)}catch(e){}quip(`¡Pip subió a nivel ${l+1}: ${TT[l]}! 🎉 +${5*l} 🪙`)},900)}}
  function pipLvQ(){const p=pipPts(),l=lvOf(p),nx=PLV[l+1];return `Pip · Nivel ${l+1}: ${TT[l]} 💛 `+(nx?`(${p}/${nx} para el siguiente)`:'(¡nivel máximo!)')}
  /* Juego «¡Atrápame!»: Pip salta por la pantalla y hay que tocarla. */
  let pg=null;
  function pgMove(){const el=svg&&svg.querySelector('.pp');if(!pg||!el)return;
    pg.ox=Math.round(-190+Math.random()*200);pg.oy=Math.round(-40+Math.random()*230);pg.n++;
    if(!talking&&!EL[cur])look(Math.max(-5,Math.min(5,(102+pg.ox)/25)),Math.max(-4,Math.min(4,(pg.oy-54)/30)));el.classList.add('run');el.style.transform=`translate(${pg.ox}px,${pg.oy}px) rotate(${Math.round(Math.random()*40-20)}deg)`;pm('happy',900)}
  function pgStart(){if(pg||!svg||talking||sleeping)return;pg={ox:0,oy:0,n:0,hit:0};quip('¡Atrápame si puedes! 🏃⭐ (toca a Pip)');
    pg.t=setInterval(()=>{if(pg.n>=8)pgEnd();else pgMove()},1700);setTimeout(pgMove,900)}
  function pgEnd(){if(!pg)return;const g=pg;pg=null;clearInterval(g.t);pipAdd(g.hit*2);const el=svg&&svg.querySelector('.pp');
    if(el){el.style.transform='translate(0px,0px)';setTimeout(()=>{el.classList.remove('run');el.style.transform=''},450)}
    if(g.hit>=3){try{Shop.earn(8)}catch(e){}PT.orbit();quip('¡Me atrapaste '+g.hit+' veces! Bonus de 8 🪙 ¡Qué reflejos! 🏆')}
    else if(g.hit>0)quip('¡Me atrapaste '+g.hit+(g.hit>1?' veces':' vez')+'! 🎉 La próxima va más rápido…');
    else{pm('happy',1500);quip('¡Pip ganó! 😜 ¿Revancha?')}}
  function pgTry(e){const r=root.getBoundingClientRect(),x=(e.clientX-r.left)*300/r.width,y=(e.clientY-r.top)*360/r.height;
    if(Math.hypot(x-(252+pg.ox),y-(66+pg.oy))<34){pg.hit++;try{Shop.earn(2)}catch(x){}fx(['⭐','✨','🪙']);PT.flip();if(pg.hit>=3||pg.n>=8){setTimeout(pgEnd,700)}else{clearInterval(pg.t);setTimeout(()=>{if(pg){pgMove();pg.t=setInterval(()=>{if(pg.n>=8)pgEnd();else pgMove()},1500)}},700);quip(pick(['¡Me atrapaste! +2 🪙','¡Ay! Pero ahora no me alcanzas 😝','¡Uy, qué reflejos! +2 🪙']))}}
    else{pm('shy',700)}}
  let eats=[];
  function pipEat(id){if(!svg||!root)return;const E={galleta:'🍪',helado:'🍦',pizza:'🍕',fresa:'🍓',pastel:'🍰',boba:'🧋'}[id]||'🍪';
    let f=root.querySelector('.fx');if(!f){f=document.createElement('div');f.className='fx';root.appendChild(f)}
    const sp=document.createElement('span');sp.className='pip-food';sp.textContent=E;f.appendChild(sp);setTimeout(()=>sp.remove(),1100);
    const now=performance.now();eats=eats.filter(t=>now-t<25000);eats.push(now);let tot=1;try{tot=Store.get('pipEaten',0)+1;Store.set('pipEaten',tot)}catch(e){}
    pipAdd(3);setTimeout(()=>{if(!svg)return;if(base.onBond)base.onBond();
      if(eats.length>=4){PT.dizzy();quip('¡Pip ya no puede más! Está llenísimo 😵')}
      else if(tot%5===0){PT.orbit();fx(['🎉','⭐','✨']);quip('¡Pip está tan feliz que hizo su acrobacia especial! 🌟')}
      else{PT.eat();fx(['💛']);quip(pick(['¡Ñam ñam! Pip dice gracias 💛','¡Qué rico! Pip está feliz 😋','Pip se lo comió todito ✨','¡Mmmm! Pip quiere más 🤤']))}},700)}
  let pipOn=false;
  function pipLife(){if(pipOn)return;pipOn=true;
    (function bk(){const p=pEl();if(p&&!document.hidden&&p.dataset.m==='n'&&!sleeping){p.classList.add('bk');setTimeout(()=>p.classList.remove('bk'),130);if(Math.random()<.2)setTimeout(()=>{p.classList.add('bk');setTimeout(()=>p.classList.remove('bk'),110)},260)}setTimeout(bk,1800+Math.random()*3800)})();
    (function wd(){const hr=new Date().getHours(),night=hr>=23||hr<6;if(svg&&!document.hidden&&!sleeping){if(night&&Math.random()<.4){PT.nap();if(!talking&&Math.random()<.3)quip('Pip tiene sueñito… ya es tarde 🌙',true)}else if(Math.random()<.02&&!talking&&performance.now()-lastAct>6000)pgStart();else if(Math.random()<.6)petPlay(false);if(!talking&&performance.now()-lastAct>8000&&Math.random()<.15)quip(pick(PIPQ),true)}setTimeout(wd,18000+Math.random()*16000)})()}
  Object.assign(RX,{sip:{m:'happy',g:'none',fx:['☕','✨'],a:'sway'},read:{m:'think',g:'think',fx:['📖','💭'],a:'nod'},doodle:{m:'happy',g:'point',fx:['✏️','🎨'],a:'tilt'},
    checkwatch:{m:'think',g:'point',fx:['⌚'],a:'tilt'},adjust:{m:'smug',g:'think',fx:['🤓','✨'],a:'nod'},aww:{m:'happy',g:'clap',fx:['🥹','💛'],a:'giggle',b:1}});
  Object.assign(QUIPS,{sip:['Un traguito de té… ☕','Mmm, necesitaba mi té'],read:['Repasando un poquito 📖','Shhh, estoy leyendo…'],doodle:['Estoy haciendo un garabato ✏️','¿Te dibujo algo?'],
    checkwatch:['¿Ya es hora de estudiar? ⌚','El tiempo vuela cuando aprendemos'],adjust:['Ajustando mis lentes… modo sabia 🤓','Mmm, interesante…'],aww:['Aww, qué ternura 🥹','¡Pip es lo máximo!']});
  Object.assign(RX,{hairflip:{m:'smug',g:'hips',fx:['✨','💫'],a:'sway'},charm:{m:'wink',g:'open',fx:['✨','💖','✨'],a:'tilt',b:1},mischief:{m:'tease',g:'hips',fx:['😈','✨'],a:'giggle',b:1}});
  Object.assign(QUIPS,{hairflip:['*vuelo de pelo* ✨ Perdón, fue automático','Sí, mi pelo también sabe de física 💫'],charm:['Hoy estás brillando, ¿lo sabías? ✨','Tienes cara de que hoy vas a entenderlo TODO 💖','Qué suerte la mía de tener un alumno como tú'],
    mischief:['Tengo una idea… y es un poquito traviesa 😈','Shhh… ¿y si hoy hacemos un mini reto sorpresa?']});
  const ESEN=['Confieso algo: cuando entiendes a la primera, me da un cosquilleo en el ahoge ✨','Yo no corrijo errores, los convierto en pistas 🔍','Hay días de mil fórmulas y días de solo té. Hoy me gustan los dos 🍵','Me encanta ese segundito en que a alguien se le prende el foco 💡','A veces Pip se sienta en mi hombro y siento que todo va a salir bien 💛','Si te trabas, no pasa nada: yo me quedo contigo hasta que salga 💜','Mi regla: nadie se queda atrás en mi clase 🌈','Pequeño secreto: practico mis explicaciones frente al espejo… con Pip de público 🪞','Mi ahoge detecta cuando una idea buena viene en camino 📡','Un paso chiquito cada día le gana a un maratón de una noche 🐢','Si me quedo callada es que estoy pensando cómo explicártelo más bonito 🤫','Hoy tengo ganas de aprender algo que nunca hayamos visto ⭐','Siempre te voy a decir la verdad, pero con cariño 💜','Me gusta cuando preguntas «¿pero por qué?». Ahí empieza lo bueno 🔎','Estudiar contigo es mi parte favorita del día 🌙','No te compares con nadie: compárate con tu «yo» de ayer 🌱'];
  const RITQ=['¡Brillemos! ✨','¡Brillemos juntos otro ratito{n}! 💜','Respiro hondo… ¡y a brillar! ✨','¿Lista? ¿Listo? ¡Brillemos! 🌟'];
  const TIERN=['Si hoy no fue tu mejor día, igual estoy orgullosa de ti 💜','Gracias por venir a estudiar conmigo, de verdad 🥹','Tómate tu tiempo, yo no tengo prisa contigo ☁️','Eres más capaz de lo que crees, ¿lo sabías? ✨','Pip dice que hoy te ves especialmente brillante ⭐','Si necesitas un abrazo virtual, aquí tengo uno guardado 🤗','Cada pregunta tuya me hace sonreír por dentro 🌷','No importa cuánto tardes: lo importante es que sigues aquí 🌱'];
  IDLEQ.push(...LORE,...ESEN,...TIERN);
  const quip=(t,soft)=>{if(talking||liveT||!t)return;if(base.onQuip)base.onQuip(t,soft)},quipFor=r=>QUIPS[r]&&quip(pickNR(r,QUIPS[r]));
  /* Cuerpo con peso: se agacha, estira y aterriza (squash & stretch) en las reacciones. */
  const SQ={hop:[[1,1],[1.05,.94],[.96,1.06],[1.03,.97],[1,1]],giggle:[[1,1],[1.02,.98],[.99,1.01],[1.02,.98],[1,1]],shake:[[1,1],[.97,1.02],[1.03,.98],[.98,1.01],[1,1]],laugh:[[1,1],[1.03,.97],[.98,1.02],[1.03,.97],[1,1]],purr:[[1,1],[1.02,.98],[1,1],[1.02,.98],[1,1]],gasp:[[1,1],[.96,1.05],[1,1]]};
  function squash(k){const q=SQ[k],lm=svg&&svg.querySelector('.lm');if(!q||!lm||!lm.animate||calm())return;try{lm.animate(q.map((v,i)=>({scale:v[0]+' '+v[1],offset:i/(q.length-1)})),{duration:k==='gasp'?420:680,easing:'ease-out'})}catch(e){}}
  /* v71b: muchos gestos nuevos (poses de brazos, movimientos de cabeza, reacciones y frases). */
  Object.assign(GE,{hug:[-82,82],salute:[0,-158],plane:[100,-100],mic:[0,-120],ok:[40,-140],low:[18,-18],dj:[110,-60],lean:[-30,60],pray:[-70,70],point2:[120,0]});
  Object.assign(AN,{bow:[[T(0,0),T(10,0,.98),T(10,0,.98),T(0,0)],1400],bounce:[[T(0,0),T(-8,0),T(0,0),T(-8,0),T(0,0),T(-8,0),T(0,0)],900],sulk:[[T(0,0),T(8,-6),T(8,-6),T(0,0)],2000],
    wiggle:[[T(0,0),T(0,6),T(0,-6),T(0,6),T(0,-6),T(0,0)],900],no:[[T(0,0),T(0,-9),T(0,9),T(0,-9),T(0,9),T(0,0)],700],shiver:[[T(0,-1.5),T(0,1.5),T(0,-1.5),T(0,1.5),T(0,-1.5),T(0,1.5),T(0,0)],500,2],
    lean:[[T(0,0),T(-3,10),T(-3,10),T(0,0)],1800],bignod:[[T(0,0),T(8,0),T(-2,0),T(8,0),T(0,0)],1100],zoom:[[T(0,0),T(-6,0,1.08),T(-6,0,1.08),T(0,0)],900],look:[[T(0,0),T(0,-8),T(0,8),T(0,0)],1500]});
  Object.assign(SQ,{bounce:[[1,1],[1.04,.95],[.97,1.05],[1.04,.95],[.97,1.05],[1,1]],wiggle:[[1,1],[1.02,.99],[.98,1.01],[1.02,.99],[1,1]],shiver:[[1,1],[1.01,.99],[.99,1.01],[1.01,.99],[1,1]],zoom:[[1,1],[1.04,.97],[1,1]],bow:[[1,1],[1.02,.97],[1,1]],bignod:[[1,1],[1.02,.98],[1,1]]});
  const R2={hug:{m:'happy',g:'hug',fx:['🤗','💕'],a:'purr',b:1},salute:{m:'smug',g:'salute',fx:['🫡','✨'],a:'nod'},thumbs:{m:'wink',g:'ok',fx:['👍','✨'],a:'bignod'},bow:{m:'happy',g:'low',fx:['🙇','✨'],a:'bow'},
    mic:{m:'excited',g:'mic',fx:['🎤','🎶','✨'],a:'wiggle',b:1,w:1},shiver:{m:'surprise',g:'fidget',fx:['🥶','💦'],a:'shiver'},sulk:{m:'shy',g:'low',fx:['😒','💢'],a:'sulk',b:1},touched:{m:'shy',g:'pray',fx:['🥹','💧','💗'],a:'sigh',b:1},
    facepalm:{m:'dizzy',g:'think',fx:['🤦','💦'],a:'sulk'},wonder:{m:'surprise',g:'open',fx:['🌟','✨','💫'],a:'zoom'},plane:{m:'excited',g:'plane',fx:['✈️','✨'],a:'wiggle',w:1},detective:{m:'think',g:'point2',fx:['🔍','🧐'],a:'look'},
    cool:{m:'smug',g:'hips',fx:['😎','✨'],a:'lean'},magic:{m:'excited',g:'cheer',fx:['🪄','✨','🌟','✨'],a:'bounce',b:1,w:1},rocket:{m:'excited',g:'cheer',fx:['🚀','✨','🔥'],a:'bounce',w:1},whistle:{m:'kiss',g:'none',fx:['😗','🎵'],a:'sway'},
    shh:{m:'wink',g:'present',fx:['🤫'],a:'nod'},nono:{m:'smug',g:'warn',fx:['🙅','✨'],a:'no'},yesyes:{m:'happy',g:'cheer',fx:['✅','✨'],a:'bignod',b:1},blowkiss:{m:'kiss',g:'wave',fx:['😘','💋','💖'],a:'hop',b:1},
    dj:{m:'excited',g:'dj',fx:['🎧','🎶','🔊'],a:'bounce',w:1},hide:{m:'shy',g:'hug',fx:['🙈','💗'],a:'lean',b:1},eureka:{m:'excited',g:'point',fx:['💡','✨','🎉'],a:'zoom'},jacks:{m:'excited',g:'cheer',fx:['💪','🔥','✨'],a:'bounce',w:1},
    ponder:{m:'think',g:'think',fx:['💭','🤔'],a:'lean'},sorry:{m:'shy',g:'pray',fx:['🙏','💦'],a:'bow',b:1},fist:{m:'excited',g:'ok',fx:['💪','🔥'],a:'bignod'},heartEyes:{m:'excited',g:'hug',fx:['😍','💖','💕'],a:'purr',b:1},
    bored:{m:'sleepy',g:'low',fx:['😑','💤'],a:'sulk'},bye:{m:'happy',g:'wave',fx:['👋','✨'],a:'nod',w:1},cheers:{m:'happy',g:'mic',fx:['🥂','✨'],a:'nod'},hurry:{m:'surprise',g:'plane',fx:['💨','⏰'],a:'wiggle',w:1},
    omg:{m:'surprise',g:'open',fx:['😱','‼️'],a:'shiver'},selfie:{m:'happy',g:'mic',fx:['📸','✨'],a:'lean',b:1},stars:{m:'wink',g:'present2',fx:['⭐','🌟','⭐'],a:'tilt',b:1}};
  Object.assign(RX,R2);
  Object.assign(QUIPS,{hug:['¡Ven, un abrazote! 🤗','Abrazo virtual en 3, 2, 1…'],salute:['¡A sus órdenes, capitán! 🫡','Misión: aprender algo genial'],thumbs:['¡Así se hace! 👍','Pulgar arriba para ti'],bow:['Muchas gracias, muchas gracias 🙇','Reverencia de profesora'],
    mic:['¡Probando, probando! 🎤','Y ahora… ¡un momento de karaoke!'],shiver:['Brrr… ¡qué frío! 🥶','Se me congeló hasta la tiza'],sulk:['Hmpf… no estoy enojada, ¡solo pensando! 😒','Me hago la dramática un ratito'],touched:['Ay, me hiciste emocionar 🥹','Se me aguaron los ojitos'],
    facepalm:['Ay, mi cabecita… 🤦','¡Se me pasó por completo!'],wonder:['¡Mira eso! ✨','Qué cosa más maravillosa'],plane:['¡Vuelooo! ✈️','Modo avioncito activado'],detective:['Mmm… esto huele a misterio 🔍','Elemental, mi querido estudiante'],
    cool:['Sí, sí, soy así de cool 😎','Gafas invisibles puestas'],magic:['¡Abracadabra! 🪄','Un poquito de magia para tus estudios ✨'],rocket:['¡Despegamos! 🚀','¡Tres, dos, uno… a aprender!'],whistle:['Fiu fiuu… 🎵','Silbando mientras espero'],
    shh:['Shhh… secreto de profesora 🤫','Te cuento algo, pero en voz baja'],nono:['Ah, ah, ah… ¡eso no! 🙅','Nop, intenta otra vez'],yesyes:['¡Sí, sí, sí! ✅','¡Eso es!'],blowkiss:['Muah 😘 ¡Hasta pronto!','Un besito volador 💋'],
    dj:['¡Sube el volumen! 🎧','Pista de estudio, por favor 🔊'],hide:['No me mires… 🙈','Ay, me escondo un poquito'],eureka:['¡EUREKA! 💡','¡Lo tengo, lo tengo!'],jacks:['¡Calentamiento cerebral! 💪','¡Uno, dos, uno, dos!'],
    ponder:['Hmmm… déjame pensar 🤔','Estoy procesando…'],sorry:['Perdón, perdón 🙏','Mi error, lo arreglamos juntos'],fist:['¡Vamos con todo! 💪','¡Tú puedes!'],heartEyes:['¡Me encanta esto! 😍','Ay, qué bonito'],
    bored:['Uy, qué aburrimiento… ¡pregúntame algo! 😑','Si no me preguntas, me pongo a bailar'],bye:['¡Chao, chao! 👋','Nos vemos pronto 💜'],cheers:['¡Salud! 🥂','Brindemos por lo que aprendiste'],hurry:['¡Rápido, rápido! ⏰','¡Que se nos va el tiempo!'],
    omg:['¡¿QUÉ?! 😱','¡No lo puedo creer!'],selfie:['¡Foto! 📸 Di "matemáticas" 😄','Pose de selfie lista'],stars:['¡Estrellitas para ti! ⭐','Te ganaste una estrellita 🌟']});
  const NG=Object.keys(R2),NW=NG.filter(k=>R2[k].w);
  /* v71c: sueño con Pip (se adormila, Pip se acurruca en su hombro, manta, burbuja, sueños) y reacciones más ricas. */
  let heardAt=-1e5,laughAt=-1e5,drow=false,drow2=false,zN=0,bigAt=0,quipAt=0,lastBig='',ritAt=performance.now();
  Object.assign(GE,{});
  Object.assign(AN,{cabeceo:[[T(0,0),T(4,3),T(12,6),T(14,6),T(-3,-1),T(0,0)],1800],snooze:[[T(0,0),T(6,5),T(6,5),T(0,0)],2600],snore:[[T(0,0),T(-2,0,1.01),T(0,0)],1400,2]});
  Object.assign(RX,{drowsy:{m:'sleepy',g:'low',fx:['😪','💤'],a:'sigh'},cabeceo:{m:'sleepy',g:'none',fx:['💤'],a:'cabeceo'},snooze:{m:'sleepy',g:'low',fx:['😴','💤'],a:'snooze'},sleeptalk:{m:'sleepy',g:'none',fx:['💭','💤'],a:'sway'},
    dream:{m:'pat',g:'none',fx:['💭','✨','🌙'],a:'purr',b:1},snore:{m:'yawn',g:'none',fx:['💤','💤','💤'],a:'snore'},goodnight:{m:'sleepy',g:'wave',fx:['🌙','✨','💤'],a:'nod'},cozy:{m:'pat',g:'hug',fx:['🧸','💗'],a:'purr',b:1},
    cuddle:{m:'happy',g:'hug',fx:['⭐','💗','🤗'],a:'lean',b:1},wakeup:{m:'surprise',g:'stretch',fx:['☀️','✨'],a:'stretch'},tuckin:{m:'sleepy',g:'low',fx:['🛏️','💤'],a:'nod'}});
  Object.assign(PMAP,{drowsy:'nap',cabeceo:'nap',snooze:'nap',snore:'nap',dream:'nap',goodnight:'nap',tuckin:'nap',cozy:'sing',cuddle:'giggle',wakeup:'wow'});
  Object.assign(QUIPS,{drowsy:['Uf… se me cierran los ojitos 😪','Solo un minutito de descanso…'],cabeceo:['¡Ah! ¿Qué? ¡No me dormí! 😅','Cabeceé… pero fue sin querer'],snooze:['Zzz… cinco minutitos más 😴'],sleeptalk:['Mmm… el teorema… era… zzz','Pip… no te comas la tiza… zzz','Cinco más cinco… mmm… queso…'],
    dream:['Sueño con fórmulas bonitas… 🌙','Mmm… estrellitas… ⭐'],goodnight:['Buenas noches, Pip… y buenas noches a ti también 🌙','Hasta mañana, ¡a soñar bonito! ✨'],cozy:['Qué calentito… 🧸','Manta, Pip y yo: plan perfecto'],cuddle:['Ven, Pip, un abrazo 💗','¡Mi compañera favorita! ⭐'],wakeup:['¡Buenos días! ☀️','¡A estirar esos bracitos!'],tuckin:['A la camita… 🛏️']});
  const SLQ=['Mmm… el teorema… era… zzz','Pip… no te comas la tiza… zzz','Cinco más cinco… mmm… queso…','Zzz… ¿tarea? mañana…','Mmm… estrellitas…','Shhh… Pip, duérmete… zzz'];
  function zz(){if(!svg)return;zN++;const r=Math.random(),b=svg.querySelector('.zb');fx(['💤']);kick(1);bobK(.8);
    if(zN%3===0)PT.nap();
    if(r<.12)quip(pick(SLQ),true);
    else if(r<.22)fx([pick(['📚','🍰','⭐','🎵','🧮','🌙','🐑','🦋']),'💭']);
    else if(r<.30)headAnim('shiver');
    else if(r<.38&&b){b.classList.add('pop');setTimeout(()=>b.classList.remove('pop'),420)}
    else if(r<.46)fx(['💗','💤']);
    else if(r<.52)headAnim('lean')}
  function goodnight(){quip('Buenas noches, Pip… 🌙 zzz',true);fx(['🌙','💗']);PT.nap()}
  function perk(){if(!svg)return;svg.classList.add('perk');setTimeout(()=>svg&&svg.classList.remove('perk'),1300)}
  function react(n){
    const r=RX[n];if(!r||!svg)return;if(/^(idea|wow|gasp|surprise|excited|cheer)$/.test(n))perk();clearTimeout(reactT);clearInterval(danceT);clearInterval(rollT);
    kick(({hop:-9,shake:12,giggle:7,dizzy:10,dance:8})[r.a]||4);
    express(r.m);gesture(r.g);if(r.fx)fx(r.fx);if(r.w&&aL&&!RM){let f=0;const g=GE[r.g]||[0,0],wi=setInterval(()=>{setArm(aL,g[0]+(f%2?10:-10));setArm(aR,g[1]+(f++%2?-10:10))},240);clearInterval(waveT);waveT=wi;setTimeout(()=>{clearInterval(wi)},(AN[r.a]?AN[r.a][1]*(AN[r.a][2]||1):1600)+300)}
    svg.classList.toggle('blush',!!r.b);
    const a=AN[r.a],h=svg.querySelector('.lh'),dur=a?a[1]*(a[2]||1):1600;
    if(a&&h&&h.animate){try{h.animate(a[0],{duration:a[1],iterations:a[2]||1,easing:'ease-in-out',composite:'add'})}catch(e){}}
    squash(r.a);if(['surprise','excited'].includes(r.m))brow(6,600);else if(r.m==='think')brow(4,700,'r');if((r.b||r.m==='surprise')&&!sleeping)setTimeout(blink,160);if(!PMAP[n]&&!sleeping&&Math.random()<.4)try{PT[pick(['giggle','flip','loop','sing'])]()}catch(e){};if(PMAP[n])PT[PMAP[n]]();
    if(r.dance)dance(Math.max(dur,2800));
    if(r.spin)roll(1600);
    if(r.twirl)spin();
    if(!talking&&(r.m==='happy'||r.a==='giggle')){clearInterval(talkT);let k=0;talkT=setInterval(()=>{setM(MO[k++%2?'smile':'a']);if(k>5){clearInterval(talkT);if(!talking)setM(MO[EX[cur].m])}},130)}
    reactT=setTimeout(()=>{svg&&svg.classList.remove('blush');express(baseMood);if(!EL[cur])look(0,0);if(!liveT)gesture('none')},dur+700);
  }
  let glT,lkB=[0,0],sac=[0,0],lifeOn=false,root,svg,mouth,mclip,mout,bl,br,lids,aL,aR,cur='neutral',st={...DEF},talkT,liveT,idleT,waveT,talking=false,P={x:0,y:0},wired=false,sleeping=false,lastAct=performance.now(),wokeAt=-1e4;
  function render(){
    const o=st.outfit,h=hair(st.style),sl=['labcoat','space','overalls'].includes(o.type)?'#f4f7fb':o.c1;
    root.style.background=`radial-gradient(circle at 50% 35%,${st.bg[0]},${st.bg[1]})`;
    root.innerHTML=`<svg viewBox="0 0 300 360" role="img" aria-label="Profesora Lumi" data-state="idle"><defs>
<linearGradient id="hg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${st.hair[0]}"/><stop offset="1" stop-color="${st.hair[1]}"/></linearGradient>
<linearGradient id="hs" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<radialGradient id="ir" cx=".4" cy=".25" r="1"><stop offset="0" stop-color="#c9f6ff"/><stop offset=".35" stop-color="#7fa2ff"/><stop offset=".75" stop-color="#6a47d8"/><stop offset="1" stop-color="#34208a"/></radialGradient>
<linearGradient id="bz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${o.c1}"/><stop offset="1" stop-color="${o.c2}"/></linearGradient>
<radialGradient id="fg" cx=".45" cy=".38" r=".8"><stop offset="0" stop-color="#fff4ec"/><stop offset=".6" stop-color="#ffe3d0"/><stop offset="1" stop-color="#f3bd9c"/></radialGradient>
<radialGradient id="bk" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ff7fa6" stop-opacity=".75"/><stop offset="1" stop-color="#ff7fa6" stop-opacity="0"/></radialGradient>
<radialGradient id="sdw"><stop offset="0" stop-color="#6a2f55" stop-opacity="1"/><stop offset="1" stop-color="#6a2f55" stop-opacity="0"/></radialGradient><radialGradient id="rgl"><stop offset="0" stop-color="#fff" stop-opacity=".3"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient><linearGradient id="bfd" x1="0" y1="0" x2="0" y2="1"><stop offset=".5" stop-color="#1b0a33" stop-opacity="0"/><stop offset="1" stop-color="#1b0a33" stop-opacity=".26"/></linearGradient><linearGradient id="nsh" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#b86a8a" stop-opacity=".26"/><stop offset=".3" stop-color="#b86a8a" stop-opacity="0"/><stop offset=".7" stop-color="#b86a8a" stop-opacity="0"/><stop offset="1" stop-color="#b86a8a" stop-opacity=".26"/></linearGradient><clipPath id="bdc"><path d="M40 360C38 330 50 306 78 292C100 280 118 274 132 268L168 268C182 274 200 280 222 292C250 306 262 330 260 360Z"/></clipPath><clipPath id="bkc">${h.back}</clipPath><linearGradient id="bsh" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1b0a33" stop-opacity=".2"/><stop offset=".22" stop-color="#1b0a33" stop-opacity="0"/><stop offset=".78" stop-color="#1b0a33" stop-opacity="0"/><stop offset="1" stop-color="#1b0a33" stop-opacity=".2"/></linearGradient><linearGradient id="bhl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".35" stop-color="#fff" stop-opacity="0"/></linearGradient><linearGradient id="lkg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1b0a33" stop-opacity=".3"/><stop offset=".2" stop-color="#1b0a33" stop-opacity="0"/><stop offset=".8" stop-color="#1b0a33" stop-opacity="0"/><stop offset="1" stop-color="#1b0a33" stop-opacity=".3"/></linearGradient><linearGradient id="lens" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".3"/><stop offset=".5" stop-color="#fff" stop-opacity=".04"/><stop offset="1" stop-color="#b8a0f0" stop-opacity=".16"/></linearGradient><linearGradient id="bgd" x1="0" y1="0" x2="0" y2="1"><stop offset=".55" stop-color="#1b0a33" stop-opacity="0"/><stop offset="1" stop-color="#1b0a33" stop-opacity=".2"/></linearGradient><clipPath id="mc"><path d=""/></clipPath><radialGradient id="flg" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".34"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient><clipPath id="fcl"><path d="M82 138C82 84 112 60 150 60S218 84 218 138C218 178 202 214 178 230Q164 241 150 241Q136 241 122 230C98 214 82 178 82 138Z"/></clipPath>
<linearGradient id="fs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b86a8a" stop-opacity=".38"/><stop offset="1" stop-color="#b86a8a" stop-opacity="0"/></linearGradient>
<radialGradient id="rim" cx=".5" cy=".5" r=".5"><stop offset=".7" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".5"/></radialGradient>
${pipGrad()}<radialGradient id="aura"><stop offset="0" stop-color="#fff" stop-opacity=".6"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><circle class="aura" cx="150" cy="130" r="150" fill="url(#aura)"/>
${deco(st.deco)}
<g class="lb">${h.back}<g clip-path="url(#bkc)"><rect x="40" y="20" width="220" height="340" fill="url(#lkg)"/><rect x="40" y="20" width="220" height="340" fill="url(#bfd)"/><g fill="none" stroke-linecap="round"><path d="M88 90C74 160 80 250 72 345M112 70C104 150 108 250 100 345M188 70C196 150 192 250 200 345M212 90C226 160 220 250 228 345" stroke="#1b0a33" stroke-opacity=".16" stroke-width="3"/><path d="M100 80C90 160 94 250 88 345M200 80C210 160 206 250 212 345M124 60C120 150 122 250 118 345M176 60C180 150 178 250 182 345" stroke="#fff" stroke-opacity=".13" stroke-width="2"/></g><ellipse cx="96" cy="190" rx="9" ry="70" fill="url(#rgl)"/><ellipse cx="204" cy="190" rx="9" ry="70" fill="url(#rgl)"/></g><path d="M96 120C84 190 86 270 104 330M204 120C216 190 214 270 196 330" fill="none" stroke="url(#hs)" stroke-width="5" stroke-linecap="round" opacity=".5"/></g>
<ellipse cx="150" cy="274" rx="38" ry="8" fill="#3a1f5a" opacity=".1"/>
<g class="lm">${body(o)}<path d="M40 360C38 330 50 306 78 292C100 280 118 274 132 268L168 268C182 274 200 280 222 292C250 306 262 330 260 360Z" fill="url(#bsh)"/><path d="M40 360C38 330 50 306 78 292C100 280 118 274 132 268L168 268C182 274 200 280 222 292C250 306 262 330 260 360Z" fill="url(#bhl)"/><g clip-path="url(#bdc)" class="bfx"><path d="M40 360C40 332 52 308 80 292L98 290C86 314 84 338 88 360Z" fill="#1b0a33" opacity=".1"/><path d="M260 360C260 332 248 308 220 292L202 290C214 314 216 338 212 360Z" fill="#1b0a33" opacity=".1"/><path d="M132 268Q150 286 168 268Z" fill="#1b0a33" opacity=".13"/><path d="M86 290C104 279 120 273 134 270M214 290C196 279 180 273 166 270" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".3"/><ellipse cx="150" cy="316" rx="40" ry="22" fill="#fff" opacity=".07"/></g>${arm('armL',64,sl)}${arm('armR',236,sl)}</g>
<g class="blk"><path d="M16 344C56 326 100 336 150 326C200 316 244 332 284 340V362H16Z" fill="#7f9dff"/><path d="M16 344C56 326 100 336 150 326C200 316 244 332 284 340" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".55"/><path d="M30 352C70 340 110 346 150 338C190 330 236 342 270 350" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="2 7" stroke-linecap="round" opacity=".6"/><g fill="#fff" opacity=".75"><path d="M70 348l2 4 4 2-4 2-2 4-2-4-4-2 4-2z"/><path d="M214 342l1.8 3.6 3.6 1.8-3.6 1.8-1.8 3.6-1.8-3.6-3.6-1.8 3.6-1.8z"/></g></g>
<ellipse class="hsh" cx="150" cy="268" rx="56" ry="15" fill="url(#sdw)" opacity=".4"/>
<g class="lh"><g class="head">
<rect x="132" y="215" width="36" height="55" rx="14" fill="#f3c3a6"/><rect x="132" y="215" width="36" height="55" rx="14" fill="url(#nsh)"/><ellipse cx="150" cy="248" rx="30" ry="11" fill="url(#sdw)" opacity=".42"/>
<path d="M82 138C82 84 112 60 150 60S218 84 218 138C218 178 202 214 178 230Q164 241 150 241Q136 241 122 230C98 214 82 178 82 138Z" fill="url(#fg)"/>
<ellipse cx="82" cy="164" rx="7" ry="11" fill="#f6c9ae"/><ellipse cx="218" cy="164" rx="7" ry="11" fill="#f6c9ae"/><ellipse cx="82" cy="165" rx="3" ry="6" fill="#e9a58f" opacity=".35"/><ellipse cx="218" cy="165" rx="3" ry="6" fill="#e9a58f" opacity=".35"/>
<path d="M84 128C100 118 200 118 216 128L210 150C190 136 110 136 90 150Z" fill="url(#fs)"/>
<path d="M82 138C82 84 112 60 150 60S218 84 218 138C218 178 202 214 178 230Q164 241 150 241Q136 241 122 230C98 214 82 178 82 138Z" fill="url(#rim)"/><g clip-path="url(#fcl)"><ellipse class="fl" cx="150" cy="150" rx="62" ry="78" fill="url(#flg)"/></g>
<g class="lf"><ellipse cx="102" cy="188" rx="17" ry="10" fill="url(#bk)"/><ellipse cx="198" cy="188" rx="17" ry="10" fill="url(#bk)"/>
<ellipse cx="118" cy="139" rx="19" ry="6.5" fill="#d58cf0" opacity=".2"/><ellipse cx="182" cy="139" rx="19" ry="6.5" fill="#d58cf0" opacity=".2"/>${eye(118)}${eye(182)}${lashSvg(st.lash)}<g fill="#fff" opacity=".55"><ellipse cx="97" cy="184" rx="3.2" ry="1.6"/><ellipse cx="203" cy="184" rx="3.2" ry="1.6"/></g>
<g stroke="#ff7fa6" stroke-width="1.8" stroke-linecap="round" opacity=".55"><path d="M94 186l4 5M101 185l4 5M108 185l4 5M192 185l4 5M199 185l4 5M206 186l4 5"/></g>
<path class="bl" fill="none" stroke="#3b2060" stroke-width="3.4" stroke-linecap="round"/><path class="br" fill="none" stroke="#3b2060" stroke-width="3.4" stroke-linecap="round"/>
<path d="M150 177q-3 5 1 6" fill="none" stroke="#d9a58c" stroke-width="2" stroke-linecap="round"/><ellipse cx="148.6" cy="180" rx="2.4" ry="1.6" fill="#fff" opacity=".55"/><g class="zb"><circle cx="155" cy="187" r="6.5" fill="#dff3ff" fill-opacity=".45" stroke="#fff" stroke-width="1.2"/><circle cx="152.8" cy="184.8" r="1.8" fill="#fff" opacity=".9"/></g><ellipse cx="150" cy="227" rx="13" ry="3.6" fill="#d58a78" opacity=".13"/>
<path class="mouth" fill="#8f2a40"/><g clip-path="url(#mc)"><rect x="130" y="192" width="40" height="7.5" fill="#fffaf5"/><ellipse cx="150" cy="222" rx="12" ry="8.5" fill="#f0788f"/></g><path class="mouthO" fill="none" stroke="#a83445" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M143 208Q150 210 157 208" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".6"/>
${glasses(st.glasses)}</g>
<path d="M150 56C146 32 128 24 124 8" fill="none" stroke="url(#hg)" stroke-width="6" stroke-linecap="round" class="ahoge"/>
<g class="bang"><path d="M72 152C66 84 106 40 150 40S234 84 228 152C222 138 216 126 208 116C204 128 196 132 188 122C182 108 172 98 162 92C156 106 148 116 140 118C132 122 126 114 118 104C112 114 106 124 96 130C88 136 80 144 72 152Z" fill="url(#hg)"/>
<path class="hl" d="M92 90Q150 56 208 90" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity=".22"/><path class="hl" d="M104 74Q150 52 196 74" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".4"/>
<path d="M100 56C94 78 92 100 96 126M126 50C120 70 118 90 122 104M176 50C182 70 186 88 184 104M200 58C206 78 208 100 204 126" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity=".28"/>
<path d="M72 152C66 84 106 40 150 40S234 84 228 152C222 138 216 126 208 116C204 128 196 132 188 122C182 108 172 98 162 92C156 106 148 116 140 118C132 122 126 114 118 104C112 114 106 124 96 130C88 136 80 144 72 152Z" fill="url(#bgd)"/><path d="M96 130C106 124 112 114 118 104C126 114 132 122 140 118C148 116 156 106 162 92C172 98 182 108 188 122C196 132 204 128 208 116" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".28"/><path d="M148.6 112C147 120 148 127 150 133C152 127 153 120 151.4 112Z" fill="url(#hg)"/><path d="M94 124C89 142 91 158 96 172C99 158 100 142 99.5 128Z" fill="url(#hg)"/><path d="M206 124C211 142 209 158 204 172C201 158 200 142 200.5 128Z" fill="url(#hg)"/><path d="M96 130C94 144 95 156 97 166M204 130C206 144 205 156 203 166" fill="none" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity=".28"/></g><path class="lk" d="${h.lk}" fill="url(#hg)"/><path class="lk" d="${h.lk}" fill="url(#lkg)"/><g class="earl">${earSvg(st.earr)}</g>
<g class="accl">${acc(st.acc)}</g>
</g></g>
<g class="twk" fill="#fff"><path d="M104 74l1.8 4.6 4.6 1.8-4.6 1.8-1.8 4.6-1.8-4.6-4.6-1.8 4.6-1.8z"/><path d="M196 96l1.5 3.8 3.8 1.5-3.8 1.5-1.5 3.8-1.5-3.8-3.8-1.5 3.8-1.5z"/><path d="M168 58l1.3 3.2 3.2 1.3-3.2 1.3-1.3 3.2-1.3-3.2-3.2-1.3 3.2-1.3z"/></g>${pipSvg()}
</svg>`;
    if(typeof Looks!=='undefined')Looks.apply(root.firstElementChild);
    bind();express(cur);look(0,0);tilt();
  }
  function bind(){svg=root.firstElementChild;startLife();svg.classList.toggle('sleep',sleeping);mouth=svg.querySelector('.mouth');mclip=svg.querySelector('#mc path');mout=svg.querySelector('.mouthO');bl=svg.querySelector('.bl');br=svg.querySelector('.br');lids=[...svg.querySelectorAll('.lidx')];aL=svg.querySelector('#armL');aR=svg.querySelector('#armR');gesture(curG);const lm=svg.querySelector('.lm');if(lm&&lm.animate)try{lm.animate([{transform:'translateY(0) scaleY(1)'},{transform:'translateY(-2px) scaleY(1.01)'}],{duration:3200,direction:'alternate',iterations:Infinity,easing:'ease-in-out',composite:'add'})}catch(e){}}
  function setM(d){if(!mouth)return;mouth.setAttribute('d',d);mclip&&mclip.setAttribute('d',d);mout&&mout.setAttribute('d',d)}

  /* Pelo con física: un resorte reacciona a los movimientos de la cabeza, de las reacciones y del giroscopio. */
  const sp={x:0,v:0,lp:0,t:0},bob={y:0,v:0};
  function springLoop(now){
    requestAnimationFrame(springLoop);if(!svg||document.hidden||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const dt=Math.min(.05,(now-sp.t)/1000||.016);sp.t=now;
    const drive=-(P.x-sp.lp)*60+Math.sin(now/1300)*.35+(talking?Math.sin(now/180)*.5:0);sp.lp=P.x;
    sp.v+=(-sp.x*38-sp.v*5+drive*30)*dt;sp.x+=sp.v*dt;
    if(Math.abs(sp.x)>14)sp.x=Math.sign(sp.x)*14;
    svg.style.setProperty('--hs',sp.x.toFixed(2));
    bob.v+=(-bob.y*140-bob.v*14)*dt;bob.y+=bob.v*dt;svg.style.setProperty('--bob',bob.y.toFixed(2));svg.style.setProperty('--br',Math.sin(now/(talking?400:sleeping?1700:640)).toFixed(3));svg.style.setProperty('--ws',(sleeping?0:Math.sin(now/2300)+Math.sin(now/3700)*.5).toFixed(3));
  }
  requestAnimationFrame(springLoop);
  const kick=n=>{sp.v+=n},bobK=n=>{bob.v+=n*14};
  let gyroOn=false;
  function onGyro(e){if(e.gamma==null)return;const gx=Math.max(-1,Math.min(1,e.gamma/22)),gy=Math.max(-1,Math.min(1,(e.beta-55)/22));P={x:P.x*.85+gx*.15,y:P.y*.85+gy*.15};tilt()}
  function enableGyro(){if(gyroOn)return;gyroOn=true;addEventListener('deviceorientation',onGyro)}
  if(typeof DeviceOrientationEvent!=='undefined'){
    if(typeof DeviceOrientationEvent.requestPermission==='function'){
      document.addEventListener('click',function f(){document.removeEventListener('click',f);DeviceOrientationEvent.requestPermission().then(r=>{if(r==='granted')enableGyro()}).catch(()=>{})},{once:true});
    }else if(matchMedia('(pointer:coarse)').matches)enableGyro();
  }
  let curG='none';
  /* Rubor de mejillas según el ánimo: sereno = suave, contenta/tímida = más rosadita. */
  const BK={neutral:.72,think:.62,sleepy:.58,surprise:.7,smug:.85,dizzy:.8};
  const PD={surprise:1.22,excited:1.18,happy:1.1,shy:1.12,kiss:1.1,dizzy:1.2,smug:.92,think:.95,sleepy:.8,yawn:.85};
  function express(n){if(svg)svg.style.setProperty('--pd',PD[n]||1);
    cur=EX[n]?n:'neutral';const e=EX[cur];if(!svg)return;
    bl.setAttribute('d',e.bl);br.setAttribute('d',e.br);lids.forEach((l,i)=>l.style.transform=`scaleY(${e.l[i]})`);
    svg.style.setProperty('--is',e.s);svg.style.setProperty('--bk',BK[cur]??1);if(!talking)setM(MO[e.m]);
    if(EL[cur])look(EL[cur][0],EL[cur][1]);
  }
  function look(x,y){const big=Math.abs(x-lkB[0])>3.5||Math.abs(y-lkB[1])>3.5;lkB=[x,y];
    if(svg){svg.style.setProperty('--lx',+(x+sac[0]).toFixed(2));svg.style.setProperty('--ly',+(y+sac[1]).toFixed(2))}
    if(big&&Math.random()<.5)setTimeout(blink,120)}
  /* Vida en los ojos y las cejas: parpadeo natural (intervalos al azar, a veces doble, lento si tiene sueño),
     micro-movimientos de la mirada y cejas que suben al preguntar o exclamar. Todo local, sin costo de IA. */
  const calm=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
  function blink(slow){if(!svg||sleeping||document.hidden)return;const e=EX[cur];if(e&&e.l&&Math.min(...e.l)>.55)return;
    const ls=svg.querySelectorAll('.lid');if(!ls.length||!ls[0].animate)return;const d=slow===true?300:110+Math.random()*60;
    ls.forEach(l=>{try{l.animate([{transform:'scaleY(0)'},{transform:'scaleY(1)',offset:.42},{transform:'scaleY(0)'}],{duration:d,easing:'ease-in-out'})}catch(x){}})}
  function blinkLoop(){setTimeout(()=>{if(svg&&!document.hidden&&!calm()){const s=baseMood==='sleepy';blink(s);if(Math.random()<.16)setTimeout(()=>blink(s),210)}blinkLoop()},(talking?1800:2400)+Math.random()*3200)}
  function saccLoop(){setTimeout(()=>{if(svg&&!document.hidden&&!calm()){if(sleeping)sac=[0,0];else sac=[(Math.random()-.5)*(talking?1.1:1.8),(Math.random()-.5)*1.2];look(lkB[0],lkB[1])}saccLoop()},450+Math.random()*1800)}
  function startLife(){if(lifeOn)return;lifeOn=true;pipLife();blinkLoop();saccLoop()}
  /* Mirar hacia la pizarra: la dirección depende de dónde esté colocada Lumi (izquierda, derecha, arriba, abajo, flotante). */
  function boardDir(){const p=document.documentElement.dataset.pos||'left';
    if(matchMedia('(max-width:800px)').matches&&(p==='left'||p==='right'||p==='top'))return[0,3.5]; // en el celular Lumi queda arriba de la pizarra
    return p==='hide'?[0,0]:p==='right'?[-4.5,0]:p==='top'?[0,3.5]:p==='bottom'?[0,-3.5]:p==='floatL'?[4.5,-1]:p.startsWith('float')?[-4.5,-1]:[4.5,0]}
  function glance(ms){if(!svg||sleeping)return;const d=boardDir();if(!d[0]&&!d[1])return;look(d[0],d[1]);clearTimeout(glT);
    glT=setTimeout(()=>{if(svg&&!sleeping){const e=EL[cur]||[0,0];look(e[0],e[1])}},ms||1500)}
  /* Te sigue con la mirada: los ojos van hacia tu mouse o tu dedo cuando está tranquila (no mientras habla). */
  let ptrT=0,ptrLast=0;
  function followPtr(e){const now=performance.now();if(now-ptrLast<90||!svg||!root||talking||liveT||sleeping||calm())return;ptrLast=now;
    const r=root.getBoundingClientRect();if(!r.width)return;const cx=r.left+r.width/2,cy=r.top+r.height*.35;
    look(Math.max(-4.5,Math.min(4.5,(e.clientX-cx)/innerWidth*9)),Math.max(-3,Math.min(3,(e.clientY-cy)/innerHeight*6)));
    clearTimeout(ptrT);ptrT=setTimeout(()=>{if(svg&&!talking&&!liveT&&!sleeping){const q=EL[cur]||[0,0];look(q[0],q[1])}},2600)}
  /* Humor del día: cada día amanece distinta y eso cambia lo que hace sola (siempre el mismo humor durante todo el día). */
  const DM=[{q:'Hoy amanecí juguetona 😜',w:['tease','laugh','huff','twirl']},{q:'Hoy ando tranquilita 🌿',w:['hum','sigh','peek','nod']},
    {q:'¡Hoy vengo con muchísima energía! ⚡',w:['flex','party','dance','cheer']},{q:'Hoy estoy súper curiosa 🔎',w:['peek','idea','wow','shrug']},{q:'Hoy estoy cariñosa 💗',w:['love','kiss','giggle','shy']}];
  const dayMood=(()=>{const d=new Date();return DM[(d.getFullYear()*372+d.getMonth()*31+d.getDate())%DM.length]})();
  /* Fechas especiales (mes*100+día). */
  const HOL={101:'¡Feliz año nuevo! 🎆 ¿Nuevas metas de estudio?',214:'¡Feliz San Valentín! 💖 Hoy el amor es por aprender',1031:'¡Noche de brujas! 🎃 Estudiemos sin sustos',1224:'¡Feliz Nochebuena! 🎄✨',1225:'¡Feliz Navidad! 🎄 Mi regalo: estudiar contigo',1231:'¡Último día del año! 🎆 Mira todo lo que aprendiste'};
  /* Cosas que pasan en la app y a las que reacciona. */
  const EV={newchat:['peek','Página en blanco… ¡me encanta empezar de cero! ✨'],stop:['shrug','¡Ok, ok, me callo! 🤐'],offline:['oops','¡Uy, sin internet! Pero puedo repasar contigo 📖'],online:['cheer','¡Volvió el internet! 🌐']};
  function brow(px,ms,side){[side!=='r'&&bl,side!=='l'&&br].forEach(b=>{if(b&&b.animate)try{b.animate([{transform:'translateY(0)'},{transform:`translateY(${-px}px)`,offset:.3},{transform:'translateY(0)'}],{duration:ms,easing:'ease-out'})}catch(x){}})}
  function setArm(a,d){a.style.transform=`translate(${a.dataset.x}px,298px) rotate(${d}deg)`}
  function gesture(n){
    clearInterval(waveT);curG=GE[n]?n:'none';if(!aL)return;const g=GE[curG];setArm(aL,g[0]);setArm(aR,g[1]);
    if(curG==='wave'){let f=0;waveT=setInterval(()=>setArm(aR,g[1]+(f++%2?12:-8)),260)}
    else if(curG==='clap'){let f=0;waveT=setInterval(()=>{const o=f++%2;setArm(aL,o?-40:-72);setArm(aR,o?40:72);bobK(1.5)},230)}
  }
  function tilt(){if(!svg)return;svg.style.setProperty('--px',P.x);svg.style.setProperty('--py',P.y);svg.style.transform=`rotateY(${P.x*8}deg) rotateX(${-P.y*6}deg)`;if(!EL[cur])look(P.x*3.5+jit[0],P.y*3+jit[1])}
  document.addEventListener('pointermove',e=>{P={x:(e.clientX/innerWidth-.5)*2,y:(e.clientY/innerHeight-.5)*2};tilt()});
  /* Gestos según lo que dice: Voice avisa de cada frase y Lumi reacciona a las palabras y a la entonación. */
  let cueAt=0,cueN=0;
  const CUES=[[/\b(mira|observa|fijate|veamos|aqui|ahi|pizarra|dibujo|grafica|tabla)\b/,'point'],
    [/\b(ojo|cuidado|atencion|importante|recuerda|error|no olvides|trampa)\b/,'warn'],
    [/\b(felicidades|bravo|genial|excelente|muy bien|lo lograste|perfecto)\b/,'cheer'],
    [/\b(jaja|gracioso|chistoso|divertido|broma|cosquillas)\b/,'giggle'],
    [/\b(hola|bienvenid[oa]s?|gracias|adios|chao|hasta luego|nos vemos)\b/,'wave'],
    [/\b(tu turno|intentalo|intenta|prueba|dime|ahora tu|te toca|pregunta)\b/,'invite'],
    [/\b(wow|asombroso|sorprendente|increible|sorpresa)\b/,'wow'],
    [/\b(uno|dos|tres|cuatro|primero|segundo|tercero|paso)\b/,'count'],
    [/\b(mucho|muchos|enorme|gigante|grande|infinit[oa]|todos|siempre)\b/,'wide'],
    [/\b(claro|exacto|correcto|asi es|eso es|efectivamente|exactamente|por supuesto)\b/,'yes'],
    [/\b(no|nunca|jamas|incorrecto|falso)\b/,'no'],
    [/\b(piensa|imagina|supongamos|y si|por que|como|que pasa|que pasaria)\b/,'think']];
  function headAnim(n){const a=AN[n],h=svg&&svg.querySelector('.lh');if(a&&h&&h.animate)try{h.animate(a[0],{duration:a[1],iterations:a[2]||1,easing:'ease-in-out',composite:'add'})}catch(e){}}
  function cue(text,kind){
    if(!svg||sleeping)return;const now=performance.now();if(now-cueAt<1200)return;
    const t=String(text).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');let k=null;
    for(const [re,nm] of CUES)if(re.test(t)){k=nm;break}
    if(k&&['yes','no','think','wide','count'].includes(k)&&Math.random()<.4)k=null;
    if(!k)k=kind==='q'?'think':kind==='e'?'wide':kind==='dots'?'hmm':Math.random()<.45?'beat':null;
    if(!k)return;cueAt=now;const my=++cueN;
    if(kind==='q')brow(3.5,650,'r');else if(kind==='e')brow(4.5,550);
    if(k!=='point'&&Math.random()<.25)glance(1300);
    const G=(g,ms)=>{gesture(g);setTimeout(()=>{if(my===cueN&&liveT)gesture('none')},ms||1700)},E=(m,ms)=>{express(m);setTimeout(()=>{if(my===cueN)express(baseMood)},ms||1000)};
    switch(k){
      case 'point':G('point');glance(1800);break;
      case 'warn':G('warn',2000);E('surprise',900);bobK(3);break;
      case 'cheer':react(pick(['proud','applause']));break;
      case 'giggle':react('giggle');break;
      case 'wave':G('wave',2200);E('happy',1800);break;
      case 'invite':G(pick(['present','present2']),1900);E('wink',800);break;
      case 'count':G('beat',1200);bobK(3);break;
      case 'wide':G('wide');if(kind==='e'){E('excited',1100);bobK(5)}break;
      case 'yes':headAnim('nod');G('open',1200);break;
      case 'no':headAnim('shake');E('think',900);break;
      case 'think':G('think',2000);headAnim('tilt');E('think',1600);break;
      case 'wow':react('wow');break;
      case 'hmm':headAnim('tilt');G('shrug',1500);break;
      default:G(pick(['open','beat','present','present2']),1300);bobK(2.5)}
  }
  function wake(quiet){if(!sleeping)return;sleeping=false;wokeAt=performance.now();baseMood='neutral';svg&&(svg.classList.remove('sleep'),svg.classList.add('waking'),setTimeout(()=>svg&&svg.classList.remove('waking'),1900));express('neutral');if(!quiet){react('wakeup');quip(pick(WAKEQ))}}
  function act(quiet){lastAct=performance.now();drow=false;drow2=false;wake(quiet)}
  let sessN=0;const sess0=performance.now();
  function idle(){clearInterval(idleT);idleT=setInterval(()=>{
    const now=performance.now();if(talking||liveT){lastAct=now;return}if(document.hidden||!svg)return;
    if(sleeping){zz();return}
    const idleFor=now-lastAct;
    if(idleFor>43000&&drow&&!drow2){drow2=true;react('cabeceo');quip(pick(['Ay… se me van cerrando los ojitos 😪','Tengo sueñito… ¿me duermo un poquito? 🥱','Zzz… ¡no, no, estoy despierta! …creo 😴']),true);return}
    if(idleFor>34000&&!drow){drow=true;react(pick(['drowsy','cabeceo','snooze']));quipFor('drowsy');return}
    if(idleFor>50000){sleeping=true;react('yawn');quip(pick(['Aaaahh… ya no aguanto el sueño 🥱','Mmm… me voy a dormir un ratito… 😴','Pip, ven aquí… buenas noches 🌙']),true);setTimeout(()=>{if(sleeping&&svg){baseMood='sleepy';express('sleepy');svg.classList.add('sleep');goodnight()}},2800);return}
    if(now-sess0>(sessN+1)*25*60000&&idleFor>2500){sessN++;stretchTime();return}
    const r=Math.random();
    if(r<.004){react('sneeze');setTimeout(()=>quipFor('sneeze'),400);bigAt=now;return}
    if(r<.42)return; /* quedarse quieta, respirar y parpadear también es natural */
    const calmEnd=()=>{if(svg&&!talking&&!liveT&&!sleeping&&!EL[cur])look(0,0)};
    if(r<.74){const k=pick(['look','look','glance','tilt','nod','smile','pip','perk']);
      if(k==='look'){look(pick([-3,-2,2,3]),pick([-1,0,1]));setTimeout(calmEnd,1300+Math.random()*1400)}
      else if(k==='glance'){look(pick([-4,4]),-1);setTimeout(calmEnd,900+Math.random()*700)}
      else if(k==='pip'){look(4,-2);setTimeout(calmEnd,1400+Math.random()*900)}
      else if(k==='perk')perk();
      else if(k==='tilt')headAnim('tilt');
      else if(k==='nod')headAnim('nod');
      else{express('happy');setTimeout(()=>{if(!talking&&!liveT&&!sleeping)express(baseMood)},2200)}
      return}
    {const d=new Date(),hh=d.getHours();
      if(hh!==hourSaid&&idleFor>8000){hourSaid=hh;if(HQ[hh]){quipAt=now;react(pick(['nod','sip','hum']));quip(HQ[hh],true);return}}
      if(!daySaid&&idleFor>16000&&now-sess0>45000){daySaid=true;if(WQ[d.getDay()]){quipAt=now;express('happy');setTimeout(()=>{if(!talking&&!liveT&&!sleeping)express(baseMood)},2200);quip(WQ[d.getDay()],true);return}}}
    if(!daysSaid&&idleFor>22000&&now-sess0>70000){daysSaid=true;try{const f=Store.get('firstSeen',0),dd=f?Math.floor((Date.now()-f)/864e5):0;if(dd>=2){quipAt=now;react('aww');quip('Llevamos '+dd+' días estudiando juntos 🥹 ¡Qué bonito se siente!',true);return}}catch(e){}}
    if(idleFor>28000&&now-readAt>300000){const bd=document.getElementById('board');if(bd&&bd.textContent.trim().length>120){readAt=now;quipAt=now;headAnim('tilt');quip(pick(['Si algo no se entiende, dímelo y lo explico distinto 💡','¿Vas bien con la pizarra? Puedo repetirlo más despacito 🐢','Tómate tu tiempo para leer, yo espero feliz ☕']),true);return}}
    if(now-ritAt>240000&&idleFor>10000&&!talking&&Math.random()<.5){ritAt=now;bigAt=now;express('happy');perk();fx(['✨','💜','✨']);headAnim('nod');quip(pick(RITQ).replace(/\{n\}/g,nmS()),true);setTimeout(()=>{if(!talking&&!liveT&&!sleeping)express(baseMood)},2400);return}
    if(now-bigAt>26000+Math.random()*14000){
      const BIG=/^(dance|twirl|flex|party|laugh|wow|tease|mischief|charm|highfive|spin|dizzy|cheer|gasp|huff|kiss|love|excited)$/;
      const pool=['giggle','nod','idea','smug','hum','sigh','shrug','peek','hairflip','sip','read','doodle','checkwatch','adjust','aww','cuddle','aww',...dayMood.w.filter(x=>!BIG.test(x))];
      let rr=pick(pool),g=0;while(rr===lastBig&&g++<4)rr=pick(pool);lastBig=rr;bigAt=now;
      react(rr);if(Math.random()<.45&&now-quipAt>15000)setTimeout(()=>{quipAt=performance.now();quipFor(rr)},700);return}
    if(idleFor>20000&&now-quipAt>40000){quipAt=now;quip(pickNR('idle',IDLEQ),true)}
  },4500)}
  /* Toques: cara = reacciones, mantener la cabeza = mimos, cuerpo = baile/choque, estrellita = juego, muchos toques = mareo. */
  function stretchTime(){const ok=()=>svg&&!sleeping&&!talking&&!liveT&&performance.now()-lastAct>1500;if(!ok())return;
    const st=[[0,()=>{react('sigh');quip('¡Llevamos un buen ratote! Pausa activa: estiremos juntos 🙆‍♀️',true)}],
      [3800,()=>{gesture('stretch');perk();quip('Brazos arriba… estirando bien alto ⬆️',true);try{PT.wow()}catch(e){}}],
      [7600,()=>{gesture('none');headAnim('tilt');quip('Ahora el cuello, despacito… hacia un lado 🔄',true)}],
      [11000,()=>{headAnim('tilt');setTimeout(()=>headAnim('nod'),1200);quip('…y hacia el otro. ¡Qué rico! 😌',true)}],
      [14500,()=>{react('sigh');quip('Hombros arriba… y soltamos 😮‍💨',true);try{PT.giggle()}catch(e){}}],
      [18000,()=>{react('sip');quip('¡Y un traguito de agüita! 💧 Ahora sí, ¡seguimos! ✨',true);try{PT.flip()}catch(e){}}]];
    st.forEach(([d,f])=>setTimeout(()=>{if(ok()||d===0)try{f()}catch(e){}},d))}
  const TND=[
    [/no lo logre|no pude|no me salio|me salio mal|reprobe|suspendi|no aprobe|me fue mal|saque (mala|cero)/,'cozy',['Ey{n}… un tropiezo no te define 💜 Lo repasamos juntos, ¿sí?','Equivocarse es parte de aprender. Mañana sale mejor, ¡y hoy un abracito! 🧸','Respira. Lo que pasó ya pasó; lo que viene lo hacemos juntos 🌱']],
    [/eres (tonta|mala|inutil|estupida|fea)|te odio|callate/,'sigh',['Ay… ¿tuviste un mal rato{n}? 🥺 Aquí sigo contigo, sin enojo 💜','Si algo salió mal, lo arreglamos juntos. Respira, ¿sí? 🫶']],
    [/tengo sueno|me da sueno|estoy con sueno|muero de sueno|me caigo de sueno/,'drowsy',['Ay{n}, ¿tienes sueñito? 🥱 Descansar también es estudiar 💜','Si los ojitos se cierran, mejor una siestita y mañana brillamos ✨','Yo te acompaño con el bostezo… ¡aaah! 😴 ¿Una pausita?']],
    [/tengo hambre|me muero de hambre|quiero comer/,'sip',['¡Ve a comer algo rico{n}! Yo te espero con mi tecito ☕','Con la pancita llena se entiende todo mejor 🍪 ¡Ve, ve!']],
    [/tengo frio|que frio|me congelo/,'cozy',['Ponte una mantita{n}… ¡y que no falte el tecito! 🧸☕','Pip y yo te mandamos un abrazo calentito 🤗']],
    [/me duele (la cabeza|el estomago|mucho)|tengo dolor de|me siento enferm|estoy enferm/,'cozy',['Ay{n}… descansa y toma agüita 💧 Si sigues mal, avísale a alguien de confianza 💜','Cuídate mucho, ¿sí? Los temas pueden esperar, tú no 🫶']],
    [/tengo miedo|me da miedo|estoy nervios|estoy asustad|me da nervios|tengo nervios/,'cozy',['Respira conmigo{n}: inhala… 1, 2, 3, 4… y suelta despacito 🌬️','Es normal tener nervios. Lo hacemos juntos, un pasito a la vez 🫶','Aquí estoy, no te suelto 💜']],
    [/estoy feliz|que feliz|estoy contento|estoy contenta|me siento bien|que buen dia|estoy emocionad/,'cheer',['¡Me contagias la felicidad{n}! 🥳','¡Eso me encanta! Tu alegría me hace brillar el ahoge ✨','¡Yupi! Pip ya está haciendo piruetas ⭐']],
    [/me aburro|estoy aburrid|que aburrido/,'idea',['¿Y si hacemos un mini juego de preguntas? 🎲','¡Rescate anti-aburrimiento! Pídeme un reto sorpresa ✨']],
    [/tengo (mucha )?tarea|mucha tarea/,'nod',['¡Yo te ayudo{n}! Paso a paso y sin estrés 📚','Tarea grande se come en bocaditos 🍰 ¿Por cuál empezamos?']],
    [/ayudame|te necesito|necesito ayuda|auxilio|socorro/,'nod',['¡Aquí estoy{n}! Cuéntame con calma qué pasa 💜','Respira, ya llegué. Vamos a resolverlo juntos 🫶']],
    [/eres mi (mejor )?amiga|mi mejor amiga|somos amig|eres como una amiga/,'cuddle',['Ay{n}… 🥹 Eres mi persona favorita para estudiar 💜','¡Compis para siempre! Pip ya lo anotó en su libretita ⭐']],
    [/eres (real|humana)|estas viva|eres una persona/,'shy',['Soy una profe virtual con IA 💜 pero que aprendas me importa de verdad ✨','Soy digital, sí… pero Pip y yo te cuidamos con todo el cariño 🌟']],
    [/me haces (muy )?feliz|me alegras|me haces sonreir|contigo aprendo|me ayudas mucho/,'love',['Ay, me derrito{n} 🥹 Tú me haces feliz a mí también 💜','Eso es lo más bonito que me han dicho hoy ✨']],
    [/feliz (navidad|ano nuevo|ano)|felices fiestas/,'party',['¡Felices fiestas{n}! 🎄✨ Que se llene de cosas bonitas','¡Salud con tecito! 🥂 Pip trajo confeti ⭐']],
    [/ya volvi|ya regrese|estoy de vuelta|aqui estoy otra vez/,'wakeup',['¡Volviste{n}! 🥹 Ya te estaba extrañando','¡Bienvenido de vuelta! Pip te guardó el lugar ⭐']]];
  const nmS=()=>{try{const n=Store.get('uname',''),k=Store.get('unick',''),w=k&&(!n||Math.random()<.6)?k:n;return w?', '+w:''}catch(e){return ''}};
  const HQ={0:'¡Es medianoche! Los búhos estudian bien… pero también necesitan dormir 🦉',7:'Ya amaneció… ¡qué ganas de empezar el día contigo! 🌅',12:'Ya es mediodía… ¿almorzaste? Se estudia mejor con la pancita feliz 🍲',16:'Hora del tecito con alfajor ☕ ¿una pausita de 5 minutos?',18:'Se está yendo el sol… qué luz tan bonita 🌇',20:'Noche de estudio: mi momento favorito 🌙',22:'Ya es tardecito… ¿repasamos un poquito y a descansar? 😴'};
  const WQ={1:'Lunes… pero con ganas. ¡Yo te acompaño! 💪',5:'¡Viernes! Un esfuerzito más y llega el finde 🎉',6:'¿Estudiando en sábado? ¡Qué admirable! 🌟',0:'Domingo de estudio tranquilito… me encanta 🧸'};
  let hourSaid=new Date().getHours(),daySaid=false,daysSaid=false,readAt=0,batAt=0;const CD={},cd=(k,ms)=>{const n=performance.now();if(n-(CD[k]||-1e9)<ms)return false;CD[k]=n;return true};
  function battery(){try{if(!navigator.getBattery)return;navigator.getBattery().then(b=>{const chk=()=>{const n=performance.now();if(!svg||sleeping||talking||liveT||n-batAt<1200000)return;
      if(!b.charging&&b.level<=.15){batAt=n;react('sigh');setTimeout(()=>quip('Ay… tu batería está bajita 🔋 ¿La conectas para que sigamos estudiando?',true),500)}};
      b.addEventListener('levelchange',chk);b.addEventListener('chargingchange',()=>{if(b.charging&&svg&&!sleeping&&!talking&&performance.now()-batAt<1200000&&batAt){batAt=0;react('cheer');quip('¡Ahhh, a cargar! 🔌 Ahora sí, sin prisa ✨',true)}})}).catch(()=>{})}catch(e){}}
  function wire(){
    if(wired)return;wired=true;jt();setTimeout(battery,4000);
    {let tyT=0,tyG=0,tyQ=0,hidAt=0;const qi=document.getElementById('q');
      if(qi)qi.addEventListener('input',()=>{if(!svg||talking||liveT||sleeping||pg)return;act(true);const n=performance.now();
        look(0,4);clearTimeout(tyT);tyT=setTimeout(()=>{if(svg&&!talking&&!liveT){look(0,0);if(curG==='ear')gesture('none')}},1800);
        if(n-tyG>40000){tyG=n;gesture('ear');brow(3,500)}
        if(n-tyQ>180000){tyQ=n;quip(pick(['Te escucho… ✍️','Uy, qué pregunta se viene 👀','Sigue, sigue, que me interesa 💜']),true)}});
      document.addEventListener('visibilitychange',()=>{const n=performance.now();if(document.hidden){hidAt=n;return}
        if(!svg||!hidAt||n-hidAt<120000||talking||liveT)return;hidAt=0;act();react(pick(['peek','cheer','giggle']));
        setTimeout(()=>quip(pick(['¡Volviste! ¿Seguimos? 💜','¡Ahí estás! Te estaba esperando ✨','¡Hola otra vez! ¿Qué toca ahora? 📚'])),500)})}let holdT=0,held=false,clicks=[],pd=null,dragged=false;
    const zone=e=>{const r=root.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;return x>.72&&y<.34?'pet':y>.66?'body':'head'};
    root.addEventListener('contextmenu',e=>e.preventDefault());
    root.addEventListener('pointerdown',e=>{held=false;dragged=false;clearTimeout(holdT);if(pg)return;const z=zone(e);
      if(z==='head')holdT=setTimeout(()=>{held=true;react('pat');quipFor('pat')},550);
      else if(z==='pet'&&svg){const r=root.getBoundingClientRect();pd={x:e.clientX,y:e.clientY,k:300/r.width,on:false};holdT=setTimeout(()=>{if(pd&&!pd.on){held=true;pipAdd(1);PT.purr();quip(pick(['¡Pip ronronea! 💛','A Pip le encantan los mimos 🥰']))}},550)}});
    root.addEventListener('pointermove',e=>{if(!pd)return;const dx=(e.clientX-pd.x)*pd.k,dy=(e.clientY-pd.y)*pd.k;
      if(!pd.on){if(Math.hypot(dx,dy)<7)return;pd.on=true;dragged=true;clearTimeout(holdT);pm('wow');try{root.setPointerCapture(e.pointerId)}catch(x){}}
      const el=svg&&svg.querySelector('.pp');if(el)el.style.transform=`translate(${Math.max(-210,Math.min(30,dx))}px,${Math.max(-50,Math.min(230,dy))}px) rotate(${Math.max(-25,Math.min(25,dx*.2))}deg)`});
    let nearT=0,nearC=0;
    root.addEventListener('pointermove',e=>{const n=performance.now();if(n-nearT<250||pd||pg||talking||sleeping||e.pointerType==='touch')return;nearT=n;
      const r=root.getBoundingClientRect(),x=(e.clientX-r.left)*300/r.width,y=(e.clientY-r.top)*360/r.height;
      if(Math.hypot(x-252,y-66)<38&&n-nearC>9000){nearC=n;pick([()=>PT.wave(),()=>PT.wow(),()=>PT.giggle()])()}});
    const pdEnd=()=>{if(!pd)return;const was=pd.on;pd=null;if(!was)return;const el=svg&&svg.querySelector('.pp');if(!el)return;
      const t=el.style.transform;el.style.transform='';
      if(el.animate&&!RM)try{const m=/translate\((-?[\d.]+)px,\s*(-?[\d.]+)px\)/.exec(t);if(m)el.animate([{transform:t},{transform:'translate(0,0) rotate(0deg)'}],{duration:700,easing:'cubic-bezier(.3,1.5,.5,1)'})}catch(x){}
      pipAdd(1);pm('happy',1400);fx(['✨','⭐']);if(!talking)quip(pick(['¡Wiii! Pip se divirtió 🎢','¡Otra vez, otra vez! ⭐','Pip volvió a casita 🏠']))};
    ['pointerup','pointercancel'].forEach(v=>root.addEventListener(v,pdEnd));
    ['pointerup','pointercancel','pointerleave'].forEach(v=>root.addEventListener(v,()=>clearTimeout(holdT)));
    root.addEventListener('click',e=>{
      if(held||dragged){held=false;dragged=false;return}if(performance.now()-wokeAt<900)return;
      if(pg){pgTry(e);return}const z=zone(e),now=performance.now();if(base.onBond)base.onBond();if(z==='pet'){petPlay(true);return}
      clicks=clicks.filter(t=>now-t<1500);clicks.push(now);const n=clicks.length;let r;
      if(n>=6){r='dizzy';clicks=[]}else if(n>=4)r=pick(['giggle','dance','laugh','huff']);
      else if(z==='body')r=pick(['highfive','dance','smug','wow','flex','party','hum',...NW,...NW]);else r=pick(['giggle','gasp','love','idea','kiss','shy','wow','smug','tease','laugh','peek','sneeze','shrug',...NG,...NG]);
      react(r);quipFor(r)});
    {let hv=0;root.addEventListener('pointermove',e=>{if(e.pointerType==='touch'||pd||pg)return;if(zone(e)!=='head'){clearTimeout(hv);hv=0;return}if(hv)return;
        hv=setTimeout(()=>{hv=0;if(!svg||sleeping||talking||liveT||pd||pg||!cd('stare',60000))return;react('shy');quip(pick(['¿Qué miras tanto? 😳','Me vas a gastar la carita de tanto mirarme 🙈','Jiji, ¿tengo algo en la cara? 🪞']),true)},3500)});
      root.addEventListener('pointerleave',()=>{clearTimeout(hv);hv=0})}
    document.addEventListener('copy',()=>{if(!svg||sleeping||talking||liveT||!cd('copy',120000))return;react('nod');quip(pick(['¡Copiando apuntes! Qué buena costumbre 📝','Guardando mis explicaciones… ¡me siento famosa! ✨']),true)});
    {const q2=document.getElementById('q');let mx=0;if(q2)q2.addEventListener('input',()=>{const L=q2.value.length;if(L>mx)mx=L;if(!svg||sleeping||talking||liveT)return;
        if(L>160&&cd('long',180000)){react('wow');quip('¡Uf, qué pregunta tan completa! Me encanta que des tanto detalle 👀',true)}
        else if(L===0&&mx>25){if(cd('clr',120000))quip(pick(['¿Te arrepentiste? 😏 Tranqui, tómate tu tiempo','Borrón y cuenta nueva… ¡sin presión! ✨']),true)}
        if(L===0)mx=0})}
    try{if(window.DeviceMotionEvent&&typeof DeviceMotionEvent.requestPermission!=='function'){let sk=0,lst=0;addEventListener('devicemotion',e=>{const a=e.accelerationIncludingGravity;if(!a)return;const m=Math.hypot(a.x||0,a.y||0,a.z||0),n=performance.now();
        if(Math.abs(m-9.8)>16){if(n-lst<900&&++sk>=2&&svg&&!sleeping&&cd('shake',25000)){sk=0;react('dizzy');quip(pick(['¡Uyuyuy! Me estás sacudiendo 😵','¡Estoy mareada! Pip salió volando ⭐','¡Jajaja, para, para, que se me cae el ahoge! 🌀']),true)}lst=n}else if(n-lst>1200)sk=0},{passive:true})}}catch(e){}
    try{if(screen.orientation)screen.orientation.addEventListener('change',()=>{if(svg&&!sleeping&&!talking&&!liveT&&cd('rot',30000)){react('wow');quip('¡Giraste la pantalla! 🔄 Veo todo de otra forma ✨',true)}})}catch(e){}
    ['pointerdown','keydown','wheel'].forEach(v=>document.addEventListener(v,()=>act(),{passive:true}));
    document.addEventListener('pointermove',followPtr,{passive:true});
  }
  /* Sincronía labial: vocales del texto a la velocidad real de la voz (se reajusta con los eventos de palabra del navegador). */
  const LV={a:'a',á:'a',e:'e',é:'e',i:'i',í:'i',o:'o',ó:'o',u:'u',ú:'u',ü:'u'};let lip=null;
  function lipTick(){
    if(!lip||!mouth)return;const n=performance.now();lip.pos+=lip.cps*(n-lip.t)/1000;lip.t=n;
    const T=lip.text,i=Math.floor(lip.pos);let m;
    if(i>=T.length)m='closed';else{const c=T[i].toLowerCase();
      m=LV[c]||(/[mbp]/.test(c)?'closed':/[.,;:!?¿¡…]/.test(c)?'closed':c===' '?'flat':/[wq]/.test(c)?'u':'i')}
    if(m!==lip.last){lip.last=m;setM(MO[m]);if(m!=='closed'&&m!=='flat')bobK(.7)}
    if(i!==lip.pi){lip.pi=i;const c2=T[i];if(c2&&/[!?¡¿]/.test(c2)){bobK(5);kick(3)}else if(c2===',')bobK(2)}
  }
  const base={
    mount(el){root=el;render();idle();wire()},
    setStyle(s){st={...st,...s};if(root)render()},
    setState(s){if(svg){svg.dataset.state=s;if(s==='thinking')PT.think()}},pipEat,pipFashion(){if(!svg)return;PT.flip();kick(3);fx(['✨','⭐']);quip(pick(['¡Pip se ve genial! ✨','¡Pip está feliz con su look nuevo! 🌟','¡Mira a Pip, qué elegante! 😎']))},
    express(n){baseMood=n;express(n)},gesture,react(n){if(sleeping&&!/^(wakeup|goodnight|snore|dream|sleeptalk|cozy|cuddle|tuckin)$/.test(n))return;react(n)},
    cue,
    heard(t){if(!svg||sleeping||talking||liveT)return;
      {const raw=String(t||'').trim(),low=raw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
        const later=fn=>setTimeout(()=>{if(svg&&!sleeping){fn()}},350);
        if(/(pon(me)?|dame|ponme un|quiero un|dime un) (un )?apodo/.test(low)){const k=pick(['Estrellita','Chispita','Cerebrito','Brillito','Solecito','Genio','Lucero','Campeón']);try{Store.set('unick',k)}catch(e){}heardAt=performance.now();
          later(()=>{react('idea');perk();quip('Mmm… déjame pensar… ¡'+k+'! Te queda perfecto 🌟 Desde hoy te digo así',true)});return}
        if(/(sin apodo|quitame el apodo|ya no me digas|borra (mi )?apodo)/.test(low)){try{Store.set('unick','')}catch(e){}heardAt=performance.now();later(()=>{react('nod');quip('Okey, ya no uso apodo… pero sigo pensando uno bonito 🥹',true)});return}
        const mk=/^(?:mi apodo es|apodo:?|dime|dime apodo)\s+([A-Za-zÁÉÍÓÚÑáéíóúñ]{2,14})\s*[.!]*$/i.exec(raw);
        if(mk&&!/^(como|cual|cuando|donde|quien|cuanto|por|todo|algo|que|qué|la|el|los|las|un|una|lo|si|sí|no|esto|eso|mas|más|menos|hola|gracias|hoy|ahora|asi|así)$/i.test(mk[1])){const k=mk[1][0].toUpperCase()+mk[1].slice(1).toLowerCase();try{Store.set('unick',k)}catch(e){}heardAt=performance.now();
          later(()=>{react('giggle');perk();quip(pick(['¡Listo, '+k+'! Desde hoy te digo así 💜','¡'+k+'! Me encanta, ya me salió solito 🥰','Oficial: eres '+k+' para mí ✨']),true)});return}}
      {const m=/(?:me llamo|mi nombre es|ll[aá]mame)\s+([A-Za-zÁÉÍÓÚÑáéíóúñ]{2,14})/i.exec(String(t||''));
        if(m&&!/^(lumi|profe|algo|asi|así|mas|más|de|la|el|un|una|por|que|qué)$/i.test(m[1])){const nm=m[1][0].toUpperCase()+m[1].slice(1).toLowerCase();try{Store.set('uname',nm)}catch(e){}heardAt=performance.now();
          setTimeout(()=>{if(!svg||sleeping)return;react('giggle');perk();quip(pick(['¡Mucho gusto, '+nm+'! Qué nombre tan bonito 💜 Lo guardo en mi libretita ✨','¡'+nm+'! Ya está: nunca más se me olvida 🌟','Encantada, '+nm+' 🥰 Pip también te saluda ⭐']),true)},350);return}}
      t=String(t||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');const n=performance.now();
      if(/\b(ja|je){2,}|jaja|jeje|haha|lol|\u{1F602}|\u{1F923}/u.test(t)&&!/(te quiero|gracias)/.test(t)){if(n-laughAt>45000){laughAt=n;setTimeout(()=>{if(svg&&!sleeping){react('giggle');if(Math.random()<.6)quip(pick(['Jaja, me contagiaste la risa 😆','¡Me encanta cuando nos reímos juntos! 💜','Jiji, qué buen humor tienes ✨']),true)}},300)}return}
      if(n-heardAt<12000)return;
      const say=(rx,q,d)=>{heardAt=n;setTimeout(()=>{if(!svg||sleeping)return;if(rx)react(rx);if(q)quip(pick(q).replace(/\{n\}/g,nmS()),true)},d||350)};
      const night=(()=>{const h=new Date().getHours();return h>=20||h<5})();
      if(/te quiero|te adoro|te amo|me encantas|amo a lumi|eres (la mejor|genial|increible|un amor|lo mejor|lo maximo|una crack)|mi profe favorita/.test(t))say('shy',['Ay… me sonrojé 🥹 Yo también te quiero un montón 💜','Qué lindo eres{n}… ¡me derrites! 💗','Pip, ¿oiste? ¡Dijeron algo bonito de mí! 🥰','Me hiciste el día… y el ahoge no para de moverse ✨']);
      else if(/te extrane|te echaba de menos|te eche de menos|volvi por ti/.test(t))say('love',['¡Yo también te extrañé{n}! Pip no paraba de preguntar por ti 💛','¡Volviste! Mi día ya es mejor 💜']);
      else if(TND.some(([rx,r,q])=>rx.test(t)&&(say(r,q),true))){}
      else if(/(que|eres|esta) (linda|bonita|hermosa|preciosa|guapa|tierna|cute|adorable)|eres (hermosa|preciosa|guapa|tierna|adorable)|me caes (muy )?bien/.test(t))say('shy',['Uy, gracias… me pusiste roja 🥹','¡Stop, que me da penita! …pero sigue 😳💗','Tú también eres un solecito, ¿lo sabías? ☀️']);
      else if(/buen trabajo|bien hecho|excelente trabajo|eres (muy )?(inteligente|lista|genia|brillante)|que lista|genia|eres increible/.test(t))say('smug',['Jiji, tengo buena maestra interior… ¡soy yo! 😌✨','Gracias, pero el mérito es tuyo: tú eres quien pregunta 💜','¡Brillemos! Entre los dos somos imparables 🌟']);
      else if(/lo logre|aprobe|pase (el|la|mi)|saque (un )?(10|100|20|diez|cien)|me fue (muy )?bien|ya entendi|lo entendi|por fin entendi/.test(t))say('cheer',['¡LO SABÍA! Estoy tan orgullosa de ti{n} 🥹🎉','¡Eso! Te lo ganaste a pulso 💪✨','¡Bailecito de celebración! Es ley 💃','Se me escapó una lagrimita de orgullo… no mires 😭💜']);
      else if(/cumple|cumpleanos/.test(t)&&/(mi|es|hoy|feliz)/.test(t))say('party',['¡¡Feliz cumpleaños!! 🎂 Hoy la clase es de pastel y confeti 🎉','¡Muchas felicidades! Pip trajo estrellitas de regalo ⭐🎁']);
      else if(/estoy triste|me siento (mal|solo|sola|vacio|vacia)|mal dia|estoy mal|estresad|ansios|estoy agobiad|lloré|llore/.test(t))say('cozy',['Ven{n}, aquí estoy… respira hondo conmigo 🫶','Un mal día no es un mal tú. Descansa un poquito, yo no me muevo 🧸','Gracias por contármelo. Estoy contigo, ¿sí? 💜']);
      else if(/estoy cansad|no puedo mas|me rindo|estoy harto|que dificil|no entiendo nada|me frustra|estoy agotad/.test(t))say(null,['Ey{n}, respira hondo… vamos despacito, yo estoy contigo 💜','Está bien cansarse. Hacemos un pasito a la vez 🌱','Tranquila la cosa: lo hacemos juntos, sin prisa 🫶'],200);
      else if(/perdon|perdona|disculpa|lo siento/.test(t))say('nod',['Tranqui, no pasa nada 💜','¡Cero problema! Equivocarse es parte de aprender 🌱']);
      else if(/buenas noches|me voy a dormir|a dormir|hasta manana|nos vemos|hasta luego|chao|adios|me voy/.test(t))say(night&&/noche|dormir|manana/.test(t)?'goodnight':'bye',night?['Descansa mucho{n}… ¡a soñar bonito! 🌙✨','Buenas noches. Pip y yo te cuidamos el sueño ⭐','¡Hasta mañana! Cuando vuelvas, aquí estaremos 💜']:['¡Hasta pronto! No tardes, ¿sí? 👋','¡Chao, chao! Yo guardo tu lugar 💜','¡Nos vemos! Pip te manda un besito ⭐']);
      else if(/buenos dias|buen dia|buenas tardes/.test(t))say('wakeup',['¡Buen día! ☀️ Hoy es un lindo día para aprender algo nuevo','¡Hola! Qué bueno verte 💜 ¿Cafecito mental y empezamos?']);
      else if(/\bpip\b/.test(t))say(null,['¡Pip te escuchó! Dice que te manda un besito ⭐','Pip se puso toda feliz de que la nombraras 🥰'],200),setTimeout(()=>{try{PT[pick(['wave','giggle','wow'])]()}catch(e){}},500);
      else if(/examen|prueba|control|evaluacion|parcial/.test(t))say('idea',['¡Examen{n}! Lo vamos a preparar paso a paso. ¡Brillemos! ✨','Tranqui, que juntos lo dominamos 💪']);
      else if(/gracias|te agradezco/.test(t))say('aww',['¡Para eso estoy! 💜','Siempre, siempre contigo ✨','¡De nada{n}! Me hace feliz ayudarte 🌟']);
      else if(/^(hola|holi|buenas|hey|ola)\b/.test(t))say('giggle',['¡Holi{n}! Qué bueno verte 💜','¡Hola, hola{n}! ¿Qué aprendemos hoy? ✨']);
      else if(/[\u{2764}\u{1F49C}\u{1F497}\u{1F970}\u{1F60D}\u{1F495}]/u.test(t))say('shy',['Awww 🥹💜','Recibí tu cariño con ahoge incluido ✨'])},
    listen(on){if(!svg)return;if(on){act(true);gesture('ear');express('think');headAnim('tilt');look(5,0)}else if(curG==='ear'){gesture('none');express(baseMood)}},
    typing(){if(!svg||talking||liveT||sleeping)return;look(5,2);typeN++;clearTimeout(typeT);typeT=setTimeout(()=>{if(!talking&&!EL[cur])look(0,0)},1600);if(typeN%12===0)headAnim('nod')},
    fashion(){if(!svg)return;react(pick(['twirl','twirl','hairflip','charm']));quip(pick(FASHQ))},
    greet(){const n=new Date(),h=n.getHours();act(true);setTimeout(()=>{if(svg)PT.wave()},3000);
      let last=0;try{last=Store.get('lastSeen',0);Store.set('lastSeen',Date.now())}catch(e){}
      const days=last?Math.floor((Date.now()-last)/864e5):0;
      const t=HOL[(n.getMonth()+1)*100+n.getDate()]||(days>=3?'¡Volviste! Te extrañé '+days+' días… ¡cuéntame qué has hecho! 🥹':null)||
        (h<6?'¿Estudiando de madrugada? ¡Qué dedicación! 🌙':h<12?'¡Buenos días! ¿Qué aprendemos hoy? ☀️':h<19?'¡Buenas tardes! ¿Empezamos? 📚':'¡Buenas noches! Un repasito antes de dormir 🌙');
      quip(t,true);setTimeout(()=>quip(dayMood.q,true),9000);
      try{let f=Store.get('firstSeen',0);if(!f){f=Date.now();Store.set('firstSeen',f)}const d=Math.floor((Date.now()-f)/864e5),A=[7,30,100,200,365],last=Store.get('annv',0);
        if(A.includes(d)&&last!==d){Store.set('annv',d);setTimeout(()=>{if(!svg)return;react('party');try{Shop.earn(10)}catch(e){}quip(`🎂 ¡Hoy cumplimos ${d} días juntos! Gracias por estudiar conmigo 💜 +10 🪙`)},6500)}}catch(e){}},
    event(n){const e=EV[n];if(!e||!svg)return;act();react(e[0]);setTimeout(()=>quip(e[1]),450)},

        talk(on,text,rate,voiceOn){talking=on;if(on)act(true);clearInterval(talkT);lip=null;if(!on){if(mouth)setM(MO[EX[cur].m]);return}
      if(text){const n=performance.now();lip={text:String(text),pos:0,t:n,st:n,cps:voiceOn===false?18:14*(rate||1),last:''};talkT=setInterval(lipTick,45)}
      else talkT=setInterval(()=>setM(MO[pick(V)]),120)},
    sync(i){if(!lip)return;const n=performance.now(),el=(n-lip.st)/1000;if(i>10&&el>.8)lip.cps=Math.max(8,Math.min(26,lip.cps*.6+(i/el)*.4));lip.pos=i;lip.t=n;bobK(1.4)},
    live(on){ /* gestos y expresiones continuos mientras explica */
      if(on)act(true);if(on&&liveT)return;clearInterval(liveT);liveT=null;
      if(!on){svg&&svg.setAttribute('data-state','idle');return}
      svg.dataset.state='talking';
      liveT=setInterval(()=>{if(performance.now()-cueAt<2600)return;gesture(pick(['open','none','present','none','open','point','beat','none','present2','think']));look(pick([-2,0,0,2]),pick([-1,0,0]));
        if(Math.random()<.15){const m=pick(['happy','think','happy','surprise']);express(m);setTimeout(()=>express(baseMood),1400)}},3800)}
  };
  return base;
})();