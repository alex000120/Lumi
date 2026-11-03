/* Voz: habla (SpeechSynthesis) y escucha (SpeechRecognition) con el navegador.
   La voz es expresiva: divide el texto en frases, ajusta tono y velocidad según la puntuación (¿?, ¡!, …) y el ánimo
   de Lumi, y hace pausas naturales entre frases. */
const Voice=(()=>{
  const ss=window.speechSynthesis,SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  let rec=null,run=0,cancelRun=null;
  const lang0=(navigator.language||'es-ES').toLowerCase().replace('_','-');
  const esVoices=()=>(ss?ss.getVoices():[]).filter(v=>v.lang.toLowerCase().startsWith('es'));
  const female=/m[óo]nica|paulina|helena|sabina|laura|luc[íi]a|elvira|dalia|elena|camila|salome|salomé|paloma|marisol|female|mujer/i;
  const male=/\b(jorge|diego|carlos|pablo|alvaro|álvaro|enrique|juan|miguel|raul|raúl|andres|andrés|tomas|tomás|male|hombre)\b/i;
  /* Puntaje: prefiere voces naturales/neuronales, femeninas y de tu región. */
  const score=v=>{const n=v.name.toLowerCase(),l=v.lang.toLowerCase().replace('_','-');let s=0;
    if(/natural|neural|online|premium|enhanced|siri|google/.test(n))s+=5;if(/natural|neural/.test(n))s+=3;
    if(female.test(n))s+=3;if(male.test(n))s-=4;
    if(l===lang0)s+=4;else if(l.startsWith('es')&&lang0.startsWith('es'))s+=1;
    if(v.localService===false)s+=1;return s};
  const sorted=()=>esVoices().sort((a,b)=>score(b)-score(a));
  /* ánimo -> [tono, velocidad, volumen] */
  const MOOD={happy:[.04,.03,1],excited:[.1,.1,1],think:[-.06,-.1,1],surprise:[.12,.05,1],wink:[.05,0,1],smug:[-.03,-.04,1],shy:[.03,-.08,.85],neutral:[0,0,1]};
  const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
  const GAP={c:90,s:240,q:280,e:230,dots:400};
  /* Divide en frases conservando la posición de cada una en el texto original (para sincronizar los labios). */
  function chunks(text){
    const T=text.replace(/(\d)\.(?=\d)/g,'$1\u0001'),out=[],re=/[^.!?…]+(?:[.!?…]+|$)/g;let m;
    while((m=re.exec(T))){
      const raw=m[0],lead=raw.length-raw.trimStart().length,t=raw.trim();if(!t)continue;const st=m.index+lead;
      if(t.length>110){const r2=/[^,;:]+(?:[,;:]+|$)/g;let k,buf='',bs=st;
        while((k=r2.exec(t))){if(buf&&(buf+k[0]).length>110){out.push({t:buf.trim(),s:bs});buf=''}if(!buf)bs=st+k.index;buf+=k[0]}
        if(buf.trim())out.push({t:buf.trim(),s:bs})}
      else out.push({t,s:st});
    }
    return out.map(c=>{const t=c.t.replace(/\u0001/g,'.');return{text:t,start:c.s,kind:/\?$/.test(t)?'q':/!$/.test(t)?'e':/(…|\.\.\.)$/.test(t)?'dots':/[,;:]$/.test(t)?'c':'s'}});
  }
  return{
    hasMic:!!SR,
    voices:sorted,
    _chunks:chunks,
    speak(text,{enabled=true,rate=1,pitch=1.1,mood='neutral',name='',onBoundary,onChunk,onChunkStart,onChunkEnd}={}){
      text=String(text||'');const my=++run;if(cancelRun)cancelRun();
      return new Promise(res=>{
        let cancelled=false,tm=null;
        cancelRun=()=>{cancelled=true;clearTimeout(tm);res()};
        const list=chunks(text),M=MOOD[mood]||MOOD.neutral;let i=0;
        const vs=esVoices(),v=enabled&&ss?(vs.find(x=>x.name===name)||sorted()[0]):null;
        let wasBusy=false;if(enabled&&ss&&(ss.speaking||ss.pending)){wasBusy=true;try{ss.cancel()}catch(e){}}
        const next=()=>{
          if(cancelled||my!==run)return;
          if(i>=list.length){cancelRun=null;res();return}
          const c=list[i++];if(onChunk)onChunk(c);if(onBoundary)onBoundary(c.start);
          const after=()=>{tm=setTimeout(next,GAP[c.kind]+Math.random()*60)};
          if(!enabled||!ss){const ms=Math.max(500,c.text.length*65/Math.max(.5,rate));if(onChunkStart)onChunkStart(c);tm=setTimeout(()=>{if(onChunkEnd)onChunkEnd(c,ms);after()},ms);return}
          let tries=0;
          const go=()=>{
            if(cancelled||my!==run)return;
            const u=new SpeechSynthesisUtterance(c.text);u.lang=v?v.lang:'es-ES';if(v)u.voice=v;
            u.pitch=clamp(pitch+M[0]+({q:.08,e:.06}[c.kind]||0)+(Math.random()-.5)*.06,.5,2);
            u.rate=clamp(rate*(1+M[1]+({e:.04,c:.02,dots:-.08}[c.kind]||0)+(Math.random()-.5)*.04),.5,2);u.volume=M[2];
            /* Inicio REAL de la frase (cuando suena), con respaldo por si el navegador no avisa. */
            let started=false,t1=0,sw=null;
            const begin=()=>{if(started||cancelled||my!==run)return;started=true;t1=Date.now();clearTimeout(sw);if(onChunkStart)onChunkStart(c)};
            u.onstart=begin;sw=setTimeout(begin,900);
            u.onboundary=e=>{begin();if(e.name==='word'||e.name===undefined)if(onBoundary)onBoundary(c.start+e.charIndex)};
            /* Tiempo mínimo razonable que tarda en decirse esta frase. Si el navegador la "termina" mucho antes
               (voz cancelada o con error), NO damos el paso por hablado: reintentamos o esperamos ese tiempo. */
            const need=Math.max(450,c.text.length*50/u.rate),t0=Date.now();
            let ended=false,wd=null;
            const fin=()=>{if(ended)return;ended=true;clearTimeout(wd);clearTimeout(sw);
              if(cancelled||my!==run)return;
              const el=Date.now()-t0;
              if(el>=need*.35){begin();if(onChunkEnd)onChunkEnd(c,Date.now()-(t1||t0))}
              if(el<need*.35){
                if(tries++<1){try{ss.cancel()}catch(e){}tm=setTimeout(go,250);return}
                tm=setTimeout(after,need-el);return}
              after()};
            u.onend=u.onerror=fin;wd=setTimeout(fin,3000+c.text.length*120/u.rate);
            try{ss.resume()}catch(e){}
            ss.speak(u);
          };
          go();
        };
        if(wasBusy)tm=setTimeout(next,200);else next();
      });
    },
    stop(){run++;try{ss&&ss.cancel()}catch(e){}if(cancelRun)cancelRun();try{rec&&rec.abort()}catch(e){}},
    listen({onStart,onResult,onError,onEnd}){
      if(!SR){onError('Tu navegador no permite dictado: escribe tu pregunta.');return}
      rec=new SR();rec.lang=/^es/i.test(navigator.language)?navigator.language:'es-ES';
      rec.onstart=onStart;rec.onend=()=>onEnd&&onEnd();rec.onresult=e=>onResult(e.results[0][0].transcript);
      rec.onerror=()=>onError('No pude usar el micrófono: escribe tu pregunta.');
      try{rec.start()}catch(e){}
    }
  };
})();
