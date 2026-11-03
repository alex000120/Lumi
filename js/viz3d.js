/* Visualizador 3D interactivo para explicaciones: superficies z=f(x,y), sólidos, moléculas, sistemas, vectores. */
import * as THREE from 'three';
const FN=['x','y','sin','cos','tan','sqrt','abs','ln','log','exp','pi','e'];
function mkF(expr){
  let s=String(expr).replace(/\s+/g,'').replace(/\^/g,'**').replace(/π/g,'pi').replace(/^z=/i,'');
  if(!/^[0-9a-z+\-*\/().,]*$/i.test(s)||!(s.match(/[a-z]+/gi)||[]).every(i=>FN.includes(i)))return null;
  s=s.replace(/(\d|\))(x|y|\(|sin|cos|tan|sqrt|abs|ln|log|exp|pi)/g,'$1*$2');
  try{return new Function('x','y','const{sin,cos,tan,sqrt,abs,exp,PI:pi,E:e}=Math;const ln=Math.log,log=Math.log10;return '+s)}catch(e){return null}
}
const num=(v,d)=>Number.isFinite(+v)?+v:d,vec=(a,d=[0,0,0])=>Array.isArray(a)?[num(a[0],d[0]),num(a[1],d[1]),num(a[2],d[2])]:d;
const col=c=>{try{return new THREE.Color(String(c||'#8be9ff'))}catch(e){return new THREE.Color('#8be9ff')}};
const mat=(c,o=1)=>new THREE.MeshStandardMaterial({color:col(c),roughness:.45,metalness:.05,transparent:o<1,opacity:o});
function label(text,pos,size=.5){
  const c=document.createElement('canvas');c.width=256;c.height=64;const g=c.getContext('2d');
  g.font='600 34px sans-serif';g.textAlign='center';g.textBaseline='middle';g.lineWidth=7;g.strokeStyle='rgba(10,20,30,.9)';g.strokeText(String(text).slice(0,24),128,32);g.fillStyle='#fff';g.fillText(String(text).slice(0,24),128,32);
  const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),depthTest:false,transparent:true}));
  s.position.set(...pos);s.scale.set(size*4,size,1);s.renderOrder=9;return s;
}
function line(a,b,c='#ffffff'){return new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(...a),new THREE.Vector3(...b)]),new THREE.LineBasicMaterial({color:col(c)}))}
function surface(it,g){
  const f=mkF(it.f)||(()=>0),R=num(it.range,3),n=56,geo=new THREE.PlaneGeometry(2*R,2*R,n,n);geo.rotateX(-Math.PI/2);
  const p=geo.attributes.position,zs=[];
  for(let i=0;i<p.count;i++){let z=0;try{z=f(p.getX(i),-p.getZ(i))}catch(e){}zs.push(Number.isFinite(z)?clamp(z,-1e3,1e3):0)}
  const zm=Math.max(...zs.map(Math.abs))||1,k=R*.7/zm*(zm>R*.7?1:Math.min(1,R*.7/zm)),sc=zm>R*.7?k:1,colors=[];
  for(let i=0;i<p.count;i++){p.setY(i,zs[i]*sc);const t=(zs[i]/zm+1)/2,c=new THREE.Color().setHSL(.62-.55*t,.85,.5);colors.push(c.r,c.g,c.b)}
  geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geo.computeVertexNormals();
  g.add(new THREE.Mesh(geo,new THREE.MeshStandardMaterial({vertexColors:true,side:THREE.DoubleSide,roughness:.5})));
  g.add(new THREE.LineSegments(new THREE.WireframeGeometry(geo),new THREE.LineBasicMaterial({color:0xffffff,transparent:true,opacity:.18})));
  return R;
}
function objects(list,g){
  (Array.isArray(list)?list:[]).slice(0,80).forEach(o=>{
    const pos=vec(o.pos),c=o.color;let m=null;
    switch(o.shape){
      case'sphere':m=new THREE.Mesh(new THREE.SphereGeometry(num(o.r,.5),32,20),mat(c,num(o.opacity,1)));break;
      case'box':{const s=vec(o.size,[1,1,1]);m=new THREE.Mesh(new THREE.BoxGeometry(...s),mat(c,num(o.opacity,1)));break}
      case'cylinder':m=new THREE.Mesh(new THREE.CylinderGeometry(num(o.r,.5),num(o.r,.5),num(o.h,1),32),mat(c,num(o.opacity,1)));break;
      case'cone':m=new THREE.Mesh(new THREE.ConeGeometry(num(o.r,.5),num(o.h,1),o.sides?num(o.sides,32):32),mat(c,num(o.opacity,1)));break;
      case'pyramid':m=new THREE.Mesh(new THREE.ConeGeometry(num(o.r,.7),num(o.h,1),4),mat(c,num(o.opacity,1)));m.rotation.y=Math.PI/4;break;
      case'torus':m=new THREE.Mesh(new THREE.TorusGeometry(num(o.r,.8),num(o.tube,.25),20,48),mat(c,num(o.opacity,1)));break;
      case'line':g.add(line(vec(o.from),vec(o.to),c));break;
      case'arrow':{const a=new THREE.Vector3(...vec(o.from)),b=new THREE.Vector3(...vec(o.to)),d=b.clone().sub(a);if(d.length()>1e-6)g.add(new THREE.ArrowHelper(d.clone().normalize(),a,d.length(),col(c).getHex(),.25,.14));break}
      case'text':g.add(label(o.text||'',pos,num(o.size,.5)));break;
    }
    if(m){m.position.set(...pos);if(o.rot)m.rotation.set(...vec(o.rot));g.add(m)}
    if(o.label&&o.shape!=='text')g.add(label(o.label,[pos[0],pos[1]+num(o.r,.5)+.45,pos[2]]));
  });
}
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const live=[];
function create(it){
  const wrap=document.createElement('div');wrap.className='viz it';
  const cv=document.createElement('canvas');wrap.appendChild(cv);
  const hint=document.createElement('div');hint.className='viz-hint';hint.textContent='Arrastra para girar · rueda o pellizco para acercar';wrap.appendChild(hint);
  if(it.caption){const c=document.createElement('div');c.className='t-note';c.textContent=it.caption;wrap.appendChild(c)}
  const r=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true,preserveDrawingBuffer:true});r.setPixelRatio(Math.min(devicePixelRatio,2));
  const scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(40,4/3,.1,200);
  scene.add(new THREE.HemisphereLight(0xffffff,0x8899bb,1.4),new THREE.AmbientLight(0xffffff,.4));
  const dl=new THREE.DirectionalLight(0xffffff,2.2);dl.position.set(4,6,5);scene.add(dl);
  const g=new THREE.Group();scene.add(g);let R=num(it.range,3);
  if(it.kind==='surface')R=surface(it,g);else objects(it.objects,g);
  if(it.axes!==false){const L=R*1.15;g.add(line([-L,0,0],[L,0,0],'#ff7b7b'),line([0,-L,0],[0,L,0],'#7bff9a'),line([0,0,-L],[0,0,L],'#7bb6ff'));
    g.add(label('x',[L+.3,0,0],.4),label(it.kind==='surface'?'z':'y',[0,L+.3,0],.4),label(it.kind==='surface'?'y':'z',[0,0,L+.3],.4))}
  let th=.8,ph=1.15,rad=num(it.dist,R*3.2),auto=it.rotate!==false,drag=false,lx=0,ly=0,vis=true;
  cv.addEventListener('pointerdown',e=>{drag=true;auto=false;lx=e.clientX;ly=e.clientY;cv.setPointerCapture(e.pointerId)});
  cv.addEventListener('pointermove',e=>{if(!drag)return;th-=(e.clientX-lx)*.01;ph=clamp(ph-(e.clientY-ly)*.01,.15,Math.PI-.15);lx=e.clientX;ly=e.clientY});
  cv.addEventListener('pointerup',()=>drag=false);
  cv.addEventListener('wheel',e=>{e.preventDefault();rad=clamp(rad*(1+e.deltaY*.001),R*1.2,R*8)},{passive:false});
  const ty=it.kind==='surface'?0:num(it.cy,0);
  function draw(){
    if(auto)th+=.005;cam.position.set(rad*Math.sin(ph)*Math.sin(th),ty+rad*Math.cos(ph),rad*Math.sin(ph)*Math.cos(th));cam.lookAt(0,ty,0);
    const w=cv.clientWidth||300,h=Math.round(w*.75);if(cv.width!==Math.round(w*r.getPixelRatio())){r.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()}
    r.render(scene,cam);
  }
  new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(wrap);
  r.setAnimationLoop(()=>{if(vis)draw()});
  live.push({r,cv,wrap});
  if(live.length>5){const o=live.shift();try{const img=new Image();img.src=o.cv.toDataURL();img.className='viz-snap';o.r.setAnimationLoop(null);o.cv.replaceWith(img);o.r.dispose();o.r.forceContextLoss()}catch(e){}}
  return wrap;
}
window.Viz3D={create};
