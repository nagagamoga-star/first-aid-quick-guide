/* First Aid Quick Guide service worker. Generated from src/sw.js by src/build.py: edit that file, not sw.js.
   Two caches:
   - CORE: the page (all CSS, JS, illustrations and content are inside index.html), manifest, icons, fonts.
     Precached on install as one unit, so an update can never mix old and new parts.
   - 3D: three.js, OrbitControls and the anatomy model. Cached on first use, versioned separately,
     so app-only updates don't re-download them. */
var CORE = 'fa-core-982e2bdfc4a5';
var THREE_D = 'fa-3d-5e5903f3730d';
var PRECACHE = ["./", "index.html", "manifest.webmanifest", "favicon.svg", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png", "icons/apple-touch-icon.png", "fonts/atkinson-hyperlegible-latin-400-italic.woff2", "fonts/atkinson-hyperlegible-latin-400-normal.woff2", "fonts/atkinson-hyperlegible-latin-700-italic.woff2", "fonts/atkinson-hyperlegible-latin-700-normal.woff2", "fonts/inter-latin-500-normal.woff2", "fonts/inter-latin-600-normal.woff2", "fonts/inter-latin-700-normal.woff2", "assets/diagrams/airway-blausen.webp", "assets/diagrams/nosebleed.webp", "assets/diagrams/autoinjector-site.webp", "assets/diagrams/gen-cpr-compressions.webp", "assets/diagrams/gen-check-response.webp", "assets/diagrams/gen-recovery.webp", "assets/diagrams/gen-aed-pads.webp", "assets/diagrams/gen-call-000.webp", "assets/diagrams/gen-check-breathing.webp", "assets/diagrams/gen-rescue-breaths.webp", "assets/diagrams/gen-direct-pressure.webp", "assets/diagrams/gen-pressure-bandage.webp", "assets/diagrams/gen-embedded.webp", "assets/diagrams/gen-tourniquet.webp", "assets/diagrams/gen-spacer.webp", "assets/diagrams/gen-cool-burn.webp", "assets/diagrams/gen-vinegar.webp", "assets/diagrams/gen-bluebottle.webp", "assets/diagrams/gen-back-blows.webp", "assets/diagrams/gen-splint.webp", "assets/diagrams/gen-chest-pain.webp", "assets/diagrams/gen-bandage-limb.webp", "assets/diagrams/gen-bite-bandage.webp"];
var LAZY = ["vendor/three/three.min.js", "vendor/three/OrbitControls.js", "models/anatomy.b64.txt"];

var scope = self.registration.scope;
var abs = function(u){ return new URL(u, scope).href; };
var APP = abs('./');
var PRE = PRECACHE.map(abs);
var LAZY_ABS = LAZY.map(abs);

self.addEventListener('install', function(e){
  /* cache: 'reload' skips the browser's HTTP cache so a stale file can't be saved into a new version.
     If any file fails, the install fails, the old version keeps working, and the browser retries later. */
  e.waitUntil(caches.open(CORE).then(function(c){
    return c.addAll(PRECACHE.map(function(u){ return new Request(abs(u), { cache: 'reload' }); }));
  }).catch(function(err){
    /* Leave nothing half-saved behind. */
    return caches.delete(CORE).then(function(){ throw err; });
  }));
});

self.addEventListener('message', function(e){
  if (e.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){ return k.indexOf('fa-') === 0 && k !== CORE && k !== THREE_D; })
      .map(function(k){ return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});

function fromCache(cacheName, key, req){
  return caches.open(cacheName).then(function(c){
    return c.match(key).then(function(hit){
      if (hit) return hit;
      /* Cache was cleared or this file isn't saved yet: fetch it and save it. */
      return fetch(req).then(function(res){
        if (res && res.ok) c.put(key, res.clone());
        return res;
      });
    });
  });
}

self.addEventListener('fetch', function(e){
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin || url.href.indexOf(scope) !== 0) return;
  var path = url.origin + url.pathname;

  /* The app page: any navigation to the scope root or index.html, with or without a query string. */
  if (req.mode === 'navigate' && (path === APP || path === abs('index.html'))){
    e.respondWith(fromCache(CORE, APP, new Request(APP, { cache: 'no-cache' })));
    return;
  }
  if (PRE.indexOf(path) !== -1){ e.respondWith(fromCache(CORE, path, req)); return; }
  if (LAZY_ABS.indexOf(path) !== -1){ e.respondWith(fromCache(THREE_D, path, req)); return; }

  /* Anything else in scope (README, docs): network first, then any saved copy, then the app for page loads. */
  e.respondWith(fetch(req).catch(function(){
    return caches.match(req).then(function(hit){
      if (hit) return hit;
      if (req.mode === 'navigate') return caches.open(CORE).then(function(c){ return c.match(APP); });
      return Response.error();
    });
  }));
});
