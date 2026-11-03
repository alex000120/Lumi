/* Matemática legible: arregla el LaTeX que llega de la IA y lo convierte a texto normal cuando no se puede dibujar con KaTeX
   (rótulos de dibujos SVG, subtítulos, voz). Nadie debería ver nunca barras, llaves ni signos de dólar. */
const Tex=(()=>{
  const G={alpha:'α',beta:'β',gamma:'γ',delta:'δ',epsilon:'ε',varepsilon:'ε',theta:'θ',lambda:'λ',mu:'μ',pi:'π',rho:'ρ',sigma:'σ',tau:'τ',phi:'φ',varphi:'φ',omega:'ω',Delta:'Δ',Sigma:'Σ',Omega:'Ω',Pi:'Π',Phi:'Φ',Theta:'Θ',Lambda:'Λ'};
  const S={times:'×',div:'÷',cdot:'·',pm:'±',mp:'∓',leq:'≤',le:'≤',geq:'≥',ge:'≥',neq:'≠',ne:'≠',approx:'≈',infty:'∞',to:'→',rightarrow:'→',Rightarrow:'⇒',leftarrow:'←',leftrightarrow:'↔',degree:'°',circ:'°',sum:'∑',int:'∫',prod:'∏',partial:'∂',nabla:'∇',in:'∈',notin:'∉',subset:'⊂',cup:'∪',cap:'∩',forall:'∀',exists:'∃',ldots:'…',dots:'…',cdots:'…',angle:'∠',triangle:'△',perp:'⊥',parallel:'∥',equiv:'≡',sim:'∼',propto:'∝',therefore:'∴',lt:'<',gt:'>'};
  const SUP={'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹','+':'⁺','-':'⁻','n':'ⁿ','x':'ˣ','i':'ⁱ','(':'⁽',')':'⁾'};
  const SUB={'0':'₀','1':'₁','2':'₂','3':'₃','4':'₄','5':'₅','6':'₆','7':'₇','8':'₈','9':'₉','+':'₊','-':'₋','n':'ₙ','x':'ₓ','i':'ᵢ','(':'₍',')':'₎'};
  const FR={'1/2':'½','1/3':'⅓','2/3':'⅔','1/4':'¼','3/4':'¾','1/5':'⅕','2/5':'⅖','3/5':'⅗','4/5':'⅘','1/6':'⅙','5/6':'⅚','1/8':'⅛','3/8':'⅜','5/8':'⅝','7/8':'⅞'};
  const CMD='frac|dfrac|tfrac|sqrt|times|div|cdot|pm|mp|leq|geq|le|ge|neq|ne|approx|infty|to|rightarrow|Rightarrow|leftarrow|text|textbf|mathrm|mathbf|boxed|color|left|right|sum|int|prod|lim|sin|cos|tan|log|ln|alpha|beta|gamma|delta|theta|lambda|mu|pi|sigma|omega|Delta|Sigma|Omega|phi|rho|tau|vec|overline|hat|bar|degree|circ|angle|cdots|ldots|dots|begin|end|binom|operatorname';

  /* 1) Arregla escapes rotos: \\frac, \f convertido en salto de página, \( \), $$ $$ … */
  function norm(s){
    s=String(s==null?'':s);
    s=s.replace(/\f/g,'\\f').replace(/\x08/g,'\\b').replace(/\t(?=imes|heta|ext|au\b|ilde|an\b|riangle|herefore|o\b)/g,'\\t').replace(/\r(?=ho\b|ight|ightarrow)/g,'\\r').replace(/\n(?=eq\b|abla|e\b|u\b|otin)/g,'\\n').replace(/\v/g,'\\v');
    s=s.replace(/\\{2,}(?=[a-zA-Z])/g,'\\');
    s=s.replace(/\\\[([\s\S]+?)\\\]/g,(m,x)=>'$'+x.trim()+'$').replace(/\\\(([\s\S]+?)\\\)/g,(m,x)=>'$'+x.trim()+'$');
    s=s.replace(/\$\$([\s\S]+?)\$\$/g,(m,x)=>'$'+x.trim()+'$');
    s=s.replace(/\\\$/g,'\uE002');
    return s;
  }
  const money=x=>!/[\\^_={}+*\/]/.test(x)&&/\s/.test(x.trim())&&/\p{L}{2,}/u.test(x)||/^\s*[\d.,]+\s+\p{L}{2,}/u.test(x)&&!/[\\^_={}]/.test(x);

  /* 2) LaTeX suelto fuera de $…$: lo envuelve para que KaTeX lo dibuje. */
  const TOK='\\\\[a-zA-Z]+(?:\\s*\\{(?:[^{}]|\\{[^{}]*\\})*\\})*',NUM='[0-9]+(?:[.,][0-9]+)?',OP='[=+\\-*/^_<>]';
  const RUN=new RegExp('(?:'+TOK+'|'+NUM+'|[A-Za-z](?=\\s*'+OP+'))(?:(?:\\s*'+OP+'\\s*|\\s+(?=\\\\[a-zA-Z]))(?:'+TOK+'|'+NUM+'|[A-Za-z]))*','g');
  function wrapBare(s){
    return s.split(/(\$[^$]+\$)/).map(p=>{
      if(p[0]==='$'&&p.length>1)return p;
      if(!/\\[a-zA-Z]/.test(p))return p;
      return p.replace(RUN,m=>new RegExp('\\\\(?:'+CMD+')').test(m)?'$'+m.trim()+'$':m);
    }).join('');
  }
  const fix=s=>wrapBare(norm(s));

  /* 3) LaTeX → texto plano con Unicode. mode='say' lo deja listo para leer en voz alta. */
  const grp=(s,i)=>{ // lee {…} balanceado desde i; devuelve [contenido, siguiente]
    while(s[i]===' ')i++;
    if(s[i]!=='{'){const m=/^(\\[a-zA-Z]+|.)/.exec(s.slice(i));return m?[m[1],i+m[1].length]:['',i]}
    let d=0,j=i;for(;j<s.length;j++){if(s[j]==='{')d++;else if(s[j]==='}'&&--d===0)break}
    return [s.slice(i+1,j),j+1];
  };
  const map=(t,T)=>[...t].every(c=>T[c])?[...t].map(c=>T[c]).join(''):null;
  function conv(s,say){
    let o='',i=0;
    while(i<s.length){
      const c=s[i];
      if(c==='\\'){
        const m=/^\\([a-zA-Z]+|.)/.exec(s.slice(i));if(!m){i++;continue}
        const n=m[1];i+=m[0].length;
        if(/^(frac|dfrac|tfrac)$/.test(n)){let a,b;[a,i]=grp(s,i);[b,i]=grp(s,i);a=conv(a,say);b=conv(b,say);
          if(say){const w={'1/2':'un medio','1/3':'un tercio','1/4':'un cuarto','1/5':'un quinto','2/3':'dos tercios','3/4':'tres cuartos','2/5':'dos quintos','3/5':'tres quintos','4/5':'cuatro quintos'}[a+'/'+b];o+=' '+(w||`${a} sobre ${b}`)+' ';continue}
          const k=FR[a+'/'+b];if(k){o+=k;continue}
          const w=x=>/^[\w.,]+$/.test(x)?x:'('+x+')';o+=w(a)+'/'+w(b);continue}
        if(n==='sqrt'){let r='';if(s[i]==='['){const e=s.indexOf(']',i);r=s.slice(i+1,e);i=e+1}let a;[a,i]=grp(s,i);a=conv(a,say);
          o+=say?(r?`raíz de índice ${r} de ${a}`:`raíz cuadrada de ${a}`):(r==='3'?'∛':r==='4'?'∜':'√')+(/^[\w.]+$/.test(a)?a:'('+a+')');continue}
        if(n==='binom'){let a,b;[a,i]=grp(s,i);[b,i]=grp(s,i);o+=`C(${conv(a,say)}, ${conv(b,say)})`;continue}
        if(/^(text|textbf|mathrm|mathbf|boxed|vec|overline|hat|bar|operatorname)$/.test(n)){let a;[a,i]=grp(s,i);o+=conv(a,say);continue}
        if(n==='color'){[,i]=grp(s,i);continue}
        if(n==='left'||n==='right'){if(s[i]==='.')i++;continue}
        if(n==='begin'||n==='end'){[,i]=grp(s,i);continue}
        if(G[n]){o+=say?({pi:'pi'}[n]||n):G[n];continue}
        if(S[n]){const sym=S[n];o+=say?({'×':' por ','÷':' dividido entre ','±':' más menos ','≤':' menor o igual que ','≥':' mayor o igual que ','≠':' distinto de ','≈':' aproximadamente ','∞':'infinito','→':' entonces ','·':' por ','°':' grados'}[sym]||sym):sym;continue}
        if(/^[,;:! ]$/.test(n)){o+=' ';continue}
        if(/^(sin|cos|tan|log|ln|lim)$/.test(n)){o+=n;continue}
        continue;
      }
      if(c==='^'||c==='_'){let a;[a,i]=grp(s,i+1);a=conv(a,say);
        if(say){o+=c==='^'?(a==='2'?' al cuadrado':a==='3'?' al cubo':` elevado a ${a}`):` sub ${a}`;continue}
        const k=map(a,c==='^'?SUP:SUB);o+=k||(c==='^'?'^('+a+')':'_('+a+')');continue}
      if(c==='{'||c==='}'){i++;continue}
      if(say){o+=c==='='?' igual a ':c==='+'?' más ':c==='-'||c==='−'?' menos ':c==='*'?' por ':c==='/'?' entre ':c;i++;continue}
      o+=c==='-'&&/[\d\w)]\s*$/.test(o)&&/^\s*[\d\w(]/.test(s.slice(i+1))?'−':c;i++;
    }
    return o.replace(/\s+/g,' ').trim();
  }
  /* Texto con $…$ y LaTeX suelto → texto plano. */
  function text(s,say){
    s=fix(s);
    s=s.replace(/\$([^$]+)\$/g,(m,x)=>money(x)?m:conv(x,say)).replace(/\uE002/g,'$');
    if(/\\[a-zA-Z]/.test(s))s=conv(s,say);
    return s;
  }
  return{norm,fix,text,speech:s=>text(s,true),money,conv};
})();
