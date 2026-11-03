/* Graficador 3D de superficies z = f(x, y) con three.js (carga bajo demanda). Uso: Graf3D.mount(contenedor, compile) → función para detener. */
window.Graf3D={async mount(el,compile,onInfo){
  const THREE=await import('three'),{OrbitControls}=await import('three/addons/controls/OrbitControls.js');
  const W=Math.max(260,el.clientWidth||320),H=Math.min(Math.round(W*.9),380);
  const r=new THREE.WebGLRenderer({antialias:true,alpha:true});r.setPixelRatio(Math.min(devicePixelRatio||1,2));r.setSize(W,H);r.domElement.style.cssText='width:100%;border-radius:12px;touch-action:none;display:block';
  el.appendChild(r.domElement);
  const sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(50,W/H,.1,200);
  sc.add(new THREE.AmbientLight(0xffffff,.75));const dl=new THREE.DirectionalLight(0xffffff,.9);dl.position.set(6,12,8);sc.add(dl);
  const ctl=new OrbitControls(cam,r.domElement);ctl.enableDamping=false;ctl.autoRotateSpeed=2.5;
  let mesh,grid,axes,R=5,stopped=false,raf=0;
  const render=()=>r.render(sc,cam);ctl.addEventListener('change',render);
  const loop=()=>{if(stopped)return;if(ctl.autoRotate){ctl.update();render()}raf=requestAnimationFrame(loop)};
  function build(src,range,N,wire){
    R=range;if(mesh){sc.remove(mesh);mesh.geometry.dispose();mesh.material.dispose()}if(grid){sc.remove(grid)}if(axes){sc.remove(axes)}
    const f=compile(src,false),g=new THREE.PlaneGeometry(2*R,2*R,N,N);g.rotateX(-Math.PI/2);const pos=g.attributes.position,n=pos.count,z=new Float32Array(n);let zmax=1e-9;
    for(let i=0;i<n;i++){compile.y=-pos.getZ(i);let v;try{v=f(pos.getX(i))}catch(e){v=NaN}z[i]=isFinite(v)?v:NaN;if(isFinite(v)&&Math.abs(v)<1e6)zmax=Math.max(zmax,Math.abs(v))}
    const k=zmax>R*1.2?R/zmax:1,col=new Float32Array(n*3),c=new THREE.Color();let lo=1e9,hi=-1e9;
    for(let i=0;i<n;i++)if(isFinite(z[i])){lo=Math.min(lo,z[i]);hi=Math.max(hi,z[i])}
    for(let i=0;i<n;i++){let v=z[i];if(!isFinite(v)||Math.abs(v)>1e6){v=0;pos.setY(i,0)}else pos.setY(i,Math.max(-2*R,Math.min(2*R,v*k)));
      c.setHSL(.72-.72*((v-lo)/((hi-lo)||1)),.8,.52);col[i*3]=c.r;col[i*3+1]=c.g;col[i*3+2]=c.b}
    g.setAttribute('color',new THREE.BufferAttribute(col,3));g.computeVertexNormals();
    mesh=new THREE.Mesh(g,new THREE.MeshStandardMaterial({vertexColors:true,side:THREE.DoubleSide,wireframe:wire,roughness:.55,metalness:.05}));sc.add(mesh);
    grid=new THREE.GridHelper(2*R,10,0x888888,0xbbbbbb);grid.material.transparent=true;grid.material.opacity=.45;sc.add(grid);
    axes=new THREE.AxesHelper(R*1.1);sc.add(axes);
    const rad=R*2.6;if(!build.set){cam.position.set(rad,rad*.8,rad);build.set=true}ctl.target.set(0,0,0);ctl.update();render();
    onInfo&&onInfo(`x, y ∈ [−${R}, ${R}] · z de ${+lo.toFixed(2)} a ${+hi.toFixed(2)}${k<1?' · altura reducida ×'+(+k.toFixed(3)):''} · eje rojo = x, verde = z (altura)`);
  }
  loop();
  return{build,setRotate:v=>{ctl.autoRotate=v},setWire:v=>{if(mesh){mesh.material.wireframe=v;render()}},
    stop(){stopped=true;cancelAnimationFrame(raf);ctl.dispose();if(mesh){mesh.geometry.dispose();mesh.material.dispose()}r.dispose();r.domElement.remove()}};
}};
