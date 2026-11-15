/* Offline support: service worker registration, offline label, update bar and optional install.
   Everything here is optional. If any of it fails (old browser, Claude artifact frame, file://),
   the guide works exactly as before. */
(function(){
  var $ = function(id){ return document.getElementById(id); };
  var net = $('netStatus'), upd = $('updBar'), saved = $('savedStatus'), installBtn = $('installBtn'), iosHint = $('iosHint');

  /* Offline label. It only reports the connection; it says nothing about how current the content is. */
  function setNet(){ if (net) net.hidden = navigator.onLine !== false; }
  window.addEventListener('online', setNet);
  window.addEventListener('offline', setNet);
  setNet();

  var standalone = (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;

  /* Install: only offered when the browser offers it. No pop-ups, nothing repeats. */
  var deferred = null;
  window.addEventListener('beforeinstallprompt', function(e){
    e.preventDefault(); deferred = e;
    if (installBtn && !standalone) installBtn.hidden = false;
  });
  if (installBtn) installBtn.addEventListener('click', function(){
    if (!deferred) return;
    installBtn.hidden = true;
    try { deferred.prompt(); } catch(e){}
    deferred = null;
  });
  window.addEventListener('appinstalled', function(){ if (installBtn) installBtn.hidden = true; });
  var ua = navigator.userAgent || '';
  var ios = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  if (ios && !standalone && iosHint) iosHint.hidden = false;

  /* Service worker */
  var canSW = 'serviceWorker' in navigator && window.isSecureContext && /^https?:$/.test(location.protocol);
  if (!canSW) return;
  var wantReload = false;

  function showUpdate(worker){
    if (!upd) return;
    upd.hidden = false;
    $('updBtn').onclick = function(){ wantReload = true; worker.postMessage('SKIP_WAITING'); };
  }
  function markSaved(){
    if (saved && navigator.serviceWorker.controller){
      saved.innerHTML = '<span class="saved">Saved on this device.</span> The steps work without signal.';
    }
  }

  try {
    navigator.serviceWorker.addEventListener('controllerchange', function(){
      markSaved();
      if (wantReload){ wantReload = false; location.reload(); }
    });
    navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).then(function(reg){
      if (reg.waiting && navigator.serviceWorker.controller) showUpdate(reg.waiting);
      reg.addEventListener('updatefound', function(){
        var w = reg.installing; if (!w) return;
        w.addEventListener('statechange', function(){
          if (w.state === 'installed' && navigator.serviceWorker.controller) showUpdate(w);
          if (w.state === 'activated') markSaved();
        });
      });
      window.addEventListener('online', function(){ reg.update().catch(function(){}); });
      markSaved();
    }).catch(function(){ /* blocked (e.g. inside the Claude artifact frame): carry on without it */ });
  } catch(e){}
})();
