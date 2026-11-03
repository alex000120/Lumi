/* Guardado local (solo en este navegador). */
const Store={
  get(k,d){try{const v=localStorage.getItem('lumi.'+k);return v==null?d:JSON.parse(v)}catch(e){return d}},
  set(k,v){try{localStorage.setItem('lumi.'+k,JSON.stringify(v))}catch(e){}},
  del(k){try{localStorage.removeItem('lumi.'+k)}catch(e){}}
};
