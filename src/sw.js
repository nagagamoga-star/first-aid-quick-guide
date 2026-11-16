/* First Aid Quick Guide service worker. Generated from src/sw.js by src/build.py: edit that file, not sw.js.
   Two caches:
   - CORE: the page (all CSS, JS, illustrations and content are inside index.html), manifest, icons, fonts.
     Precached on install as one unit, so an update can never mix old and new parts.
   - 3D: three.js, OrbitControls and the anatomy model. Cached on first use, versioned separately,
     so app-only updates don't re-download them.
   - CARDS: the home-screen topic photographs and any per-step photographs.
     Not part of the install precache, so a failed or slow picture cannot block
     the steps. Saved the first time each one is fetched, then served from that cache. */
var CORE = 'fa-core-__CORE_VERSION__';
var THREE_D = 'fa-3d-__3D_VERSION__';
var CARDS = 'fa-cards-__CARDS_VERSION__';
var PRECACHE = __PRECACHE__;
var LAZY = __LAZY__;
var CARD_FILES = __CARDS__;

var scope = self.registration.scope;
var abs = function(u){ return new URL(u, scope).href; };
var APP = abs('./');
var PRE = PRECACHE.map(abs);
var LAZY_ABS = LAZY.map(abs);
var CARD_ABS = CARD_FILES.map(abs);

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
    return Promise.all(keys.filter(function(k){ return k.indexOf('fa-') === 0 && k !== CORE && k !== THREE_D && k !== CARDS; })
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
  if (CARD_ABS.indexOf(path) !== -1){ e.respondWith(fromCache(CARDS, path, req)); return; }

  /* Anything else in scope (README, docs): network first, then any saved copy, then the app for page loads. */
  e.respondWith(fetch(req).catch(function(){
    return caches.match(req).then(function(hit){
      if (hit) return hit;
      if (req.mode === 'navigate') return caches.open(CORE).then(function(c){ return c.match(APP); });
      return Response.error();
    });
  }));
});
