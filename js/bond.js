/* Vínculo con Lumi: sube con las clases, los aciertos y los mimos; la racha cuenta los días seguidos que estudias. */
const Bond=(()=>{
  const LV=[[0,'Conocidas'],[30,'Compañeras'],[90,'Amigas'],[180,'Mejores amigas'],[320,'Inseparables'],[520,'Amigas eternas']];
  const dayNum=()=>Math.floor((Date.now()-new Date().getTimezoneOffset()*60000)/864e5);
  let B={xp:0,streak:0,last:0,...Store.get('bond',{})};
  const lvl=()=>{let l=0;LV.forEach((x,i)=>{if(B.xp>=x[0])l=i});return l},save=()=>Store.set('bond',B);
  function render(){
    const el=document.getElementById('bond');if(!el)return;const l=lvl(),a=LV[l],n=LV[l+1],pct=n?Math.round((B.xp-a[0])/(n[0]-a[0])*100):100;
    el.innerHTML='';const t=document.createElement('div'),bar=document.createElement('div'),i=document.createElement('i');
    t.textContent='💖 Nivel '+(l+1)+' · '+a[1]+(B.streak>1?' · 🔥 '+B.streak+' días':'');bar.className='bar';i.style.width=pct+'%';bar.appendChild(i);el.append(t,bar);
    el.title=n?(B.xp-a[0])+'/'+(n[0]-a[0])+' para el siguiente nivel':'¡Nivel máximo!';
  }
  return{
    init(){const t=dayNum();if(B.last!==t){B.streak=B.last===t-1?B.streak+1:1;B.last=t;B.xp+=5;save()}render();return{streak:B.streak}},
    add(n){const a=lvl();B.xp+=n;save();render();return lvl()>a},
    info(){const l=lvl();return{lvl:l,name:LV[l][1],streak:B.streak,xp:B.xp}}
  };
})();
