/* First Aid Quick Guide service worker. Generated from src/sw.js by src/build.py: edit that file, not sw.js.
   Two caches:
   - CORE: the page (all CSS, JS, illustrations and content are inside index.html), manifest, icons, fonts.
     Precached on install as one unit, so an update can never mix old and new parts.
   - 3D: three.js, OrbitControls and the anatomy model. Cached on first use, versioned separately,
     so app-only updates don't re-download them.
   - CARDS: the home-screen topic photographs and any per-step photographs.
     Not part of the install precache, so a failed or slow picture cannot block
     the steps. Saved the first time each one is fetched, then served from that cache. */
var CORE = 'fa-core-0e5b564ee647';
var THREE_D = 'fa-3d-5e5903f3730d';
var CARDS = 'fa-cards-667e46e42c39';
var PRECACHE = ["./", "index.html", "manifest.webmanifest", "favicon.svg", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png", "icons/apple-touch-icon.png", "fonts/atkinson-hyperlegible-latin-400-italic.woff2", "fonts/atkinson-hyperlegible-latin-400-normal.woff2", "fonts/atkinson-hyperlegible-latin-700-italic.woff2", "fonts/atkinson-hyperlegible-latin-700-normal.woff2", "fonts/inter-latin-500-normal.woff2", "fonts/inter-latin-600-normal.woff2", "fonts/inter-latin-700-normal.woff2", "assets/diagrams/gen-cpr-compressions.webp", "assets/diagrams/gen-check-response.webp", "assets/diagrams/gen-recovery.webp", "assets/diagrams/gen-aed-pads.webp", "assets/diagrams/gen-call-000.webp", "assets/diagrams/gen-check-breathing.webp", "assets/diagrams/gen-rescue-breaths.webp", "assets/diagrams/gen-direct-pressure.webp", "assets/diagrams/gen-pressure-bandage.webp", "assets/diagrams/gen-embedded.webp", "assets/diagrams/gen-tourniquet.webp", "assets/diagrams/gen-spacer.webp", "assets/diagrams/gen-cool-burn.webp", "assets/diagrams/gen-vinegar.webp", "assets/diagrams/gen-bluebottle.webp", "assets/diagrams/gen-back-blows.webp", "assets/diagrams/gen-splint.webp", "assets/diagrams/gen-chest-pain.webp", "assets/diagrams/gen-bandage-limb.webp", "assets/diagrams/gen-bite-bandage.webp", "assets/diagrams/gen-open-airway.webp", "assets/diagrams/gen-infant-back-blows.webp", "assets/diagrams/gen-adrenaline-thigh.webp", "assets/diagrams/gen-anaphylaxis-device.webp", "assets/diagrams/gen-nosebleed.webp", "assets/diagrams/gen-eye-rinse.webp", "assets/diagrams/gen-button-battery.webp", "assets/diagrams/gen-spider-coldpack.webp"];
var LAZY = ["vendor/three/three.min.js", "vendor/three/OrbitControls.js", "models/anatomy.b64.txt"];
var CARD_FILES = ["assets/cards/cover.webp", "assets/cards/collapse.webp", "assets/cards/cpr.webp", "assets/cards/choking.webp", "assets/cards/bleeding.webp", "assets/cards/anaphylaxis.webp", "assets/cards/heart.webp", "assets/cards/stroke.webp", "assets/cards/unconscious.webp", "assets/cards/snake.webp", "assets/cards/marine.webp", "assets/cards/spider.webp", "assets/cards/burns.webp", "assets/cards/asthma.webp", "assets/cards/seizure.webp", "assets/cards/heat.webp", "assets/cards/poison.webp", "assets/cards/extra-bites-stings.webp", "assets/cards/extra-medical.webp", "assets/cards/steps/spider-1-call.webp", "assets/cards/steps/spider-2-bandage-splint.webp", "assets/cards/steps/spider-3-coldpack.webp", "assets/cards/steps/spider-4-no-bandage.webp", "assets/cards/steps/spider-5-medical-help.webp"];

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
