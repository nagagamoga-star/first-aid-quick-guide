/* 3D "where on the body" viewer.
   Model: a small cut of BodyParts3D 4.0 taken from Human Atlas (see models/README.md).
   BodyParts3D, (c) The Database Center for Life Science, licensed under CC Attribution 4.0 International.
   Loaded only when someone taps "Show in 3D", so the steps stay fast. */
var Anatomy = (function(){
  var THREE_URL = 'vendor/three/three.min.js';  /* three.js 0.147.0, MIT, self-hosted */
  var ORBIT_URL = 'vendor/three/OrbitControls.js';
  var MODEL_URL = 'models/anatomy.b64.txt';
  /* Human Atlas system colours */
  var COLOURS = { skin:'#ba9b7d', ribcage:'#e2d9ba', sternum:'#e2d9ba', heart:'#b96760', larynx:'#b98991', bronchi:'#b98991', thigh:'#a85b50', brain:'#d8b565' };
  var SELECT = '#6bd9c7';   /* Human Atlas selection teal */
  var libs = null, model = null, current = null;

  function script(src){
    return new Promise(function(res, rej){
      var s = document.createElement('script'); s.src = src; s.async = true;
      s.onload = res; s.onerror = function(){ rej(new Error('Could not load the 3D library. Check your connection and try again.')); };
      document.head.appendChild(s);
    });
  }
  function loadLibs(){
    if (!libs) libs = (window.THREE ? Promise.resolve() : script(THREE_URL)).then(function(){ return THREE.OrbitControls ? null : script(ORBIT_URL); });
    return libs;
  }
  function loadModel(){
    if (model) return model;
    model = fetch(MODEL_URL).catch(function(){ throw new Error('Could not load the body model. Check your connection and try again.'); }).then(function(r){
      if (!r.ok) throw new Error('Could not load the body model (' + r.status + ').');
      return r.text();
    }).then(function(txt){
      var bin = atob(txt.trim()), bytes = new Uint8Array(bin.length);
      for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      return new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
    }).then(parse).catch(function(e){ model = null; throw e; });
    return model;
  }
  function parse(buf){
    var dv = new DataView(buf), hlen = dv.getUint32(0, true);
    var head = JSON.parse(new TextDecoder().decode(new Uint8Array(buf, 4, hlen)));
    var base = 4 + hlen, lo = head.min, hi = head.max, out = { bounds: head, groups: {} };
    head.groups.forEach(function(g){
      var q = new Uint16Array(buf.slice(base + g.voff, base + g.voff + g.v * 6));
      var pos = new Float32Array(g.v * 3);
      for (var i = 0; i < g.v * 3; i++){ var a = i % 3; pos[i] = lo[a] + q[i] / 65535 * (hi[a] - lo[a]); }
      var idx = g.idx32 ? new Uint32Array(buf.slice(base + g.ioff, base + g.ioff + g.i * 4)) : new Uint16Array(buf.slice(base + g.ioff, base + g.ioff + g.i * 2));
      out.groups[g.id] = { pos: pos, idx: idx };
    });
    return out;
  }

  function supported(){
    if (typeof DecompressionStream === 'undefined') return false;
    try { var c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch(e){ return false; }
  }

  function dispose(){
    if (!current) return;
    cancelAnimationFrame(current.raf);
    if (current.ro) current.ro.disconnect();
    current.controls.dispose();
    current.scene.traverse(function(o){ if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
    current.renderer.dispose();
    try { current.renderer.forceContextLoss(); } catch(e){}
    current = null;
  }

  function mount(host, spec, reduce){
    dispose();
    var status = host.querySelector('.v3d-status');
    var stageEl = host.querySelector('.v3d-stage');
    if (!supported()){ status.textContent = '3D isn’t available in this browser. The steps above cover everything you need.'; return; }
    status.textContent = 'Loading the body model (about 0.5 MB)…';
    Promise.all([loadLibs(), loadModel()]).then(function(r){ build(host, stageEl, status, spec, r[1], reduce); })
      .catch(function(e){ status.textContent = (navigator.onLine === false ? 'You\u2019re offline, and this 3D view hasn\u2019t been saved yet. It needs a connection the first time.' : e.message) + ' The steps above cover everything you need.'; host.querySelector('.v3d-load').hidden = false; });
  }

  function mix(a, b, t){ var c = new THREE.Color(a); return c.lerp(new THREE.Color(b), t); }

  function build(host, stageEl, status, spec, M, reduce){
    if (THREE.ColorManagement) THREE.ColorManagement.legacyMode = false;
    var css = getComputedStyle(document.documentElement);
    var bg = (css.getPropertyValue('--stage') || '#f2f3f3').trim();
    var renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, innerWidth < 768 ? 1.5 : 2));
    renderer.setClearColor(bg);
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.12;
    renderer.outputEncoding = THREE.sRGBEncoding;
    stageEl.innerHTML = ''; stageEl.appendChild(renderer.domElement);

    var scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight(0xffffff, 0x9aa3a8, 0.85));
    var key = new THREE.DirectionalLight(0xffffff, 1.25); key.position.set(1.4, 2.6, 2.4); scene.add(key);
    var fill = new THREE.DirectionalLight(0xffffff, 0.4); fill.position.set(-2, 1.4, -1.6); scene.add(fill);
    [[0.63, 0x8c969f, 0.4], [0.55, 0xa4aeb8, 0.16]].forEach(function(r){
      var ring = new THREE.Mesh(new THREE.RingGeometry(r[0], r[0] + 0.004, 128), new THREE.MeshBasicMaterial({ color: r[1], transparent: true, opacity: r[2], side: THREE.DoubleSide }));
      ring.rotation.x = -Math.PI / 2; ring.position.y = 0.001; scene.add(ring);
    });

    var hiBox = new THREE.Box3(), hiMats = [], meshes = {};
    function add(id, role){
      var g = M.groups[id]; if (!g) return;
      var geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(g.pos, 3));
      geo.setIndex(new THREE.BufferAttribute(g.idx, 1));
      geo.computeVertexNormals(); geo.computeBoundingBox();
      var mat;
      if (role === 'skin') mat = new THREE.MeshStandardMaterial({ color: COLOURS.skin, roughness: 0.55, metalness: 0.05, transparent: true, opacity: 0.1, depthWrite: false, side: THREE.DoubleSide });
      else if (role === 'hi'){ mat = new THREE.MeshStandardMaterial({ color: mix(COLOURS[id], SELECT, 0.6), emissive: new THREE.Color(SELECT), emissiveIntensity: 0.06, roughness: 0.45, metalness: 0.06 }); hiMats.push(mat); hiBox.union(geo.boundingBox); }
      else mat = new THREE.MeshStandardMaterial({ color: COLOURS[id], roughness: 0.55, metalness: 0.06, transparent: true, opacity: 0.5, depthWrite: false });
      var m = new THREE.Mesh(geo, mat); m.renderOrder = role === 'skin' ? 3 : role === 'hi' ? 1 : 2;
      scene.add(m); meshes[id] = m;
    }
    add('skin', 'skin');
    (spec.show || []).forEach(function(id){ add(id, 'ctx'); });
    (spec.hi || []).forEach(function(id){ add(id, 'hi'); });

    if (spec.marker === 'sternum' && meshes.sternum){
      var sb = meshes.sternum.geometry.boundingBox;
      var ring = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.004, 12, 48), new THREE.MeshBasicMaterial({ color: '#c05245' }));
      ring.position.set((sb.min.x + sb.max.x) / 2, sb.min.y + (sb.max.y - sb.min.y) * 0.3, sb.max.z + 0.035);
      scene.add(ring); hiBox.expandByPoint(ring.position);
    }

    var camera = new THREE.PerspectiveCamera(32, 1, 0.01, 20);
    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; controls.dampingFactor = 0.08; controls.minDistance = 0.12; controls.maxDistance = 3.2; controls.enablePan = false;
    controls.autoRotate = !reduce; controls.autoRotateSpeed = 1.4;
    renderer.domElement.addEventListener('pointerdown', function(){ controls.autoRotate = false; });

    var whole = meshes.skin.geometry.boundingBox.clone();
    function frame(box, dir){
      var c = box.getCenter(new THREE.Vector3()), s = box.getSize(new THREE.Vector3());
      var r = Math.max(spec.minR || 0.14, Math.max(s.x, s.y, s.z) * 0.75);
      var dist = r / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * 1.05;
      controls.target.copy(c);
      camera.position.copy(c).add(dir.clone().normalize().multiplyScalar(dist));
      controls.update();
    }
    var front = new THREE.Vector3(0.38, 0.12, 1), side = new THREE.Vector3(1, 0.1, 0.02);
    function focus(dir){ frame(hiBox.isEmpty() ? whole : hiBox.clone().expandByScalar(0.05), dir); }
    focus(front);
    host.querySelector('[data-v="front"]').onclick = function(){ controls.autoRotate = false; focus(front); };
    host.querySelector('[data-v="side"]').onclick = function(){ controls.autoRotate = false; focus(side); };
    host.querySelector('[data-v="whole"]').onclick = function(){ controls.autoRotate = false; frame(whole, front); };

    function size(){
      var w = stageEl.clientWidth, h = stageEl.clientHeight;
      renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    }
    size();
    var ro = window.ResizeObserver ? new ResizeObserver(size) : null; if (ro) ro.observe(stageEl);
    var t0 = performance.now();
    current = { renderer: renderer, scene: scene, controls: controls, ro: ro, raf: 0 };
    (function loop(){
      if (!current) return;
      current.raf = requestAnimationFrame(loop);
      if (!reduce){ var k = 0.04 + 0.1 * (1 + Math.sin((performance.now() - t0) / 450)) / 2; hiMats.forEach(function(m){ m.emissiveIntensity = k; }); }
      controls.update(); renderer.render(scene, camera);
    })();
    status.textContent = 'Drag to turn, pinch or scroll to zoom.';
    host.querySelector('.v3d-tools').hidden = false;
  }

  return { mount: mount, dispose: dispose };
})();
