/* Exportar la pizarra completa a PNG, JPG o PDF. */
const Export=(()=>{
  const load=src=>new Promise((res,rej)=>{if(document.querySelector(`script[src="${src}"]`))return res();const s=document.createElement('script');s.src=src;s.onload=res;s.onerror=()=>rej(new Error('No pude cargar la librería de exportación (revisa tu conexión).'));document.head.appendChild(s)});
  async function snap(){
    await load('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js');
    const b=document.getElementById('board');
    return html2canvas(b,{scale:2,backgroundColor:null,useCORS:true,scrollX:0,scrollY:0,windowWidth:b.clientWidth,windowHeight:b.scrollHeight,
      onclone:d=>{const sp=d.getElementById('spot');if(sp)sp.remove();const c=d.getElementById('board');c.style.height='auto';c.style.maxHeight='none';c.style.overflow='visible';c.style.flex='none';
        d.querySelectorAll('#board .it').forEach(e=>{e.style.clipPath='none';e.style.transition='none'});d.querySelectorAll('#board .fig *').forEach(e=>{e.style.transition='none'})}});
  }
  const save=(href,name)=>{const a=document.createElement('a');a.href=href;a.download=name;document.body.appendChild(a);a.click();a.remove()};
  const stamp=()=>new Date().toISOString().slice(0,10);
  return{
    async png(){const c=await snap();save(c.toDataURL('image/png'),`pizarra-lumi-${stamp()}.png`)},
    async jpg(){const c=await snap(),o=document.createElement('canvas');o.width=c.width;o.height=c.height;const g=o.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,o.width,o.height);g.drawImage(c,0,0);save(o.toDataURL('image/jpeg',.92),`pizarra-lumi-${stamp()}.jpg`)},
    async pdf(){
      const c=await snap();await load('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js');
      const pdf=new window.jspdf.jsPDF({unit:'mm',format:'a4'}),W=210,H=297,m=10,cw=W-2*m,k=c.width/cw;
      let y=0,first=true;
      while(y<c.height){
        const top=first?m+9:m,ph=Math.floor((H-m-top)*k),sl=Math.min(ph,c.height-y),p=document.createElement('canvas');p.width=c.width;p.height=sl;
        p.getContext('2d').drawImage(c,0,y,c.width,sl,0,0,c.width,sl);
        if(!first)pdf.addPage();
        if(first){pdf.setFontSize(13);pdf.text('Aula Lumi · Pizarra',m,m+4);pdf.setFontSize(9);pdf.text(new Date().toLocaleDateString('es'),W-m,m+4,{align:'right'})}
        pdf.addImage(p.toDataURL('image/jpeg',.92),'JPEG',m,top,cw,sl/k);y+=sl;first=false;
      }
      pdf.save(`pizarra-lumi-${stamp()}.pdf`);
    }
  };
})();
