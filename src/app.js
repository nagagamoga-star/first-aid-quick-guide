(function(){
  var N = TOPICS.length;
  var byId = {}; TOPICS.forEach(function(t, i){ t.i = i; byId[t.id] = t; });
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function(id){ return document.getElementById(id); };
  var home = $('home'), view = $('topic');
  var active = 0;

  /* ---------- Home: 3D coverflow ---------- */
  var stage = $('stage'), ring = $('ring');
  TOPICS.forEach(function(t, i){
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'tcard ' + t.sev;
    b.setAttribute('data-i', i);
    b.innerHTML = ART.svg(t.icon) + '<div class="tbody ' + t.sev + '"><span class="tag">' + t.tag + '</span><h2>' + t.title + '</h2><p>' + t.short + '</p><span class="go">Show me the steps →</span></div>';
    b.addEventListener('click', function(){
      if (dragged) return;
      if (reduce || i === active) go(t.id); else setActive(i);
    });
    ring.appendChild(b);
  });
  var cards = [].slice.call(ring.children);
  if (reduce) stage.classList.add('flat');

  function layout(){
    if (reduce) return;
    var w = stage.clientWidth;
    var spread = Math.max(120, Math.min(200, w * 0.36));
    cards.forEach(function(c, i){
      var d = ((i - active) % N + N + Math.floor(N/2)) % N - Math.floor(N/2);
      var a = Math.abs(d);
      c.style.transform = 'translateX(' + (d * spread) + 'px) translateZ(' + (-a * 170) + 'px) rotateY(' + (d * -40) + 'deg)';
      c.style.opacity = a > 2 ? 0 : (1 - a * 0.22);
      c.style.visibility = a > 2 ? 'hidden' : 'visible';
      c.style.zIndex = 10 - a;
      c.setAttribute('aria-current', d === 0 ? 'true' : 'false');
      c.tabIndex = d === 0 ? 0 : -1;
    });
  }
  function setActive(i){
    active = (i + N) % N;
    layout();
    $('cpos').textContent = (active + 1) + ' / ' + N;
    $('openBtn').textContent = 'Open: ' + TOPICS[active].title;
  }
  $('prevBtn').addEventListener('click', function(){ setActive(active - 1); });
  $('nextBtn').addEventListener('click', function(){ setActive(active + 1); });
  $('openBtn').addEventListener('click', function(){ go(TOPICS[active].id); });
  stage.addEventListener('keydown', function(e){
    if (e.key === 'ArrowLeft'){ setActive(active - 1); e.preventDefault(); }
    if (e.key === 'ArrowRight'){ setActive(active + 1); e.preventDefault(); }
  });
  var dragged = false;
  swipe(stage, function(dir){ if (!reduce) setActive(active + dir); });
  window.addEventListener('resize', layout);

  function swipe(el, cb){
    var x0 = null, y0 = 0;
    el.addEventListener('pointerdown', function(e){ x0 = e.clientX; y0 = e.clientY; dragged = false; });
    el.addEventListener('pointerup', function(e){
      if (x0 === null) return;
      var dx = e.clientX - x0, dy = e.clientY - y0; x0 = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)){
        dragged = true; cb(dx < 0 ? 1 : -1);
        setTimeout(function(){ dragged = false; }, 50);
      }
    });
    el.addEventListener('pointercancel', function(){ x0 = null; });
  }

  /* ---------- Home: search and chips ---------- */
  var groups = [['Life-threatening', function(t){ return t.sev === 'crit'; }], ['Urgent and other', function(t){ return t.sev !== 'crit'; }]];
  var idx = $('chipsWrap');
  groups.forEach(function(g){
    var d = document.createElement('div'); d.className = 'group';
    d.innerHTML = '<h2>' + g[0] + '</h2><div class="chips">' + TOPICS.filter(g[1]).map(function(t){
      return '<a class="' + (t.sev === 'crit' ? 'crit' : '') + '" href="#' + t.id + '" data-k="' + (t.title + ' ' + t.k).toLowerCase().replace(/"/g, '') + '">' + t.title + '</a>';
    }).join('') + '</div>';
    idx.appendChild(d);
  });
  var chips = [].slice.call(idx.querySelectorAll('a'));
  $('find').addEventListener('input', function(){
    var q = this.value.trim().toLowerCase(), first = null, shown = 0;
    chips.forEach(function(a){
      var hit = !q || a.getAttribute('data-k').indexOf(q) > -1;
      a.hidden = !hit;
      if (hit){ shown++; if (!first) first = a.getAttribute('href').slice(1); }
    });
    [].forEach.call(idx.querySelectorAll('.group'), function(g){
      g.hidden = ![].some.call(g.querySelectorAll('a'), function(a){ return !a.hidden; });
    });
    $('nomatch').hidden = shown > 0;
    if (q && first) setActive(byId[first].i);
  });

  /* ---------- Topic view ---------- */
  var cur = null, step = 0;
  function go(id){ location.hash = id; }

  function renderTopic(t){
    stopBeat();
    Anatomy.dispose();
    cur = t; step = 0;
    var h = '<a class="back" href="#">← All topics</a>';
    h += '<header class="thead ' + t.sev + '"><span class="tag">' + t.tag + '</span><h1 id="tTitle" tabindex="-1">' + t.title + '</h1></header>';
    if (t.when) h += '<p class="when' + (t.sev !== 'calm' ? ' crit-when' : '') + '">' + t.when + '</p>';
    if (t.extra === 'cpr') h += $('tplAges').innerHTML;
    var gs = [];
    t.steps.forEach(function(s){ if (s.g && gs.indexOf(s.g) < 0) gs.push(s.g); });
    if (gs.length > 1) h += '<div class="gchips" id="gchips" role="group" aria-label="Jump to">' + gs.map(function(g){ return '<button type="button" data-g="' + g + '" aria-pressed="false">' + g + '</button>'; }).join('') + '</div>';
    h += '<section class="player" id="player" aria-label="Steps" aria-roledescription="step cards">' +
      '<div class="pmeta"><span class="pg" id="pg"></span><span id="pc"></span></div>' +
      '<div class="pview" id="pview"><div class="pcard" id="pcard" aria-live="polite"></div></div>' +
      '<div class="pctl"><button type="button" class="pbtn" id="pPrev">← Back</button><div class="dots" id="dots"></div><button type="button" class="pbtn next" id="pNext">Next →</button></div></section>';
    h += '<ol class="list" id="list" hidden>' + listHtml(t) + '</ol>';
    h += '<button type="button" class="toggle" id="toggle" aria-expanded="false">Show all steps as a list</button>';
    if (t.body) h += '<section class="v3d" id="v3d" aria-labelledby="v3dh">' +
      '<div class="v3d-head"><h2 id="v3dh">' + t.body.title + '</h2><span class="v3d-badge">3D</span></div>' +
      '<p class="v3d-cap">' + t.body.caption + '</p>' +
      '<div class="v3d-stage"><button type="button" class="v3d-load">Show in 3D</button></div>' +
      '<div class="v3d-tools" hidden><button type="button" data-v="front">Front</button><button type="button" data-v="side">Side</button><button type="button" data-v="whole">Whole body</button></div>' +
      '<p class="v3d-status" aria-live="polite">Loads a body model of about 0.5 MB.</p>' +
      '<p class="v3d-credit">Anatomy: <a href="https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html">BodyParts3D</a>, \u00a9 The Database Center for Life Science, CC BY 4.0, simplified from Human Atlas. The explanation is general anatomy, not part of the ANZCOR guidelines.</p></section>';
    if (t.extra === 'cpr') h += $('tplBeat').innerHTML;
    if (t.dont) h += '<section class="dont"><h2>Don’t</h2><ul>' + t.dont.map(function(d){ return '<li>' + d + '</li>'; }).join('') + '</ul></section>';
    if (t.notes) h += '<ul class="notes">' + t.notes.map(function(n){ return '<li>' + n + '</li>'; }).join('') + '</ul>';
    h += '<p class="src">Source: ' + t.src + '</p>';
    var prev = TOPICS[(t.i - 1 + N) % N], next = TOPICS[(t.i + 1) % N];
    h += '<nav class="nexttopic" aria-label="More topics"><a href="#' + prev.id + '">← ' + prev.title + '</a><a href="#' + next.id + '">' + next.title + ' →</a></nav>';
    view.innerHTML = h;
    fixNumbers(view);

    if (t.steps.length <= 10) $('dots').innerHTML = t.steps.map(function(s, i){ return '<button type="button" aria-label="Step ' + (i+1) + '"></button>'; }).join('');
    else $('dots').innerHTML = '<div class="prog" style="width:100%" aria-hidden="true"><span id="progBar"></span></div>';
    if (!$('progBar')) [].forEach.call($('dots').children, function(b, i){ b.addEventListener('click', function(){ show(i, i > step ? 1 : -1); }); });
    $('pPrev').addEventListener('click', function(){ show(step - 1, -1); });
    $('pNext').addEventListener('click', function(){ show(step + 1, 1); });
    $('player').addEventListener('keydown', function(e){
      if (e.target.tagName === 'A') return;
      if (e.key === 'ArrowLeft') show(step - 1, -1);
      if (e.key === 'ArrowRight') show(step + 1, 1);
    });
    swipe($('pview'), function(dir){ show(step + dir, dir); });
    if ($('gchips')) [].forEach.call($('gchips').children, function(b){
      b.addEventListener('click', function(){
        var g = b.getAttribute('data-g');
        for (var i = 0; i < t.steps.length; i++) if (t.steps[i].g === g){ show(i, i >= step ? 1 : -1); break; }
        if (!$('list').hidden){ var hd = $('list').querySelector('[data-g="' + g + '"]'); if (hd) hd.scrollIntoView({block:'start'}); }
      });
    });
    $('toggle').addEventListener('click', function(){
      var listOn = $('list').hidden;
      $('list').hidden = !listOn; $('player').hidden = listOn;
      this.textContent = listOn ? 'Show step by step' : 'Show all steps as a list';
      this.setAttribute('aria-expanded', listOn ? 'true' : 'false');
    });
    if (t.extra === 'cpr') beatSetup();
    if (t.body){
      var lb = view.querySelector('.v3d-load');
      lb.addEventListener('click', function(){ lb.hidden = true; Anatomy.mount($('v3d'), t.body, reduce); });
    }
    show(0, 0);
  }

  function listHtml(t){
    var out = '', lastG = null;
    t.steps.forEach(function(s, i){
      if (s.g && s.g !== lastG){ out += '<li><h3 data-g="' + s.g + '">' + s.g + '</h3></li>'; lastG = s.g; }
      out += '<li class="li">' + ART.svg(s.a) + '<p><span class="n">' + (i+1) + '.</span>' + s.t + '</p></li>';
    });
    return out;
  }

  function show(i, dir){
    var t = cur; if (!t) return;
    if (i < 0 || i >= t.steps.length) return;
    step = i;
    var s = t.steps[i], c = $('pcard');
    c.className = 'pcard';
    c.innerHTML = ART.svg(s.a) + '<div><p class="pnum">Step ' + (i+1) + ' of ' + t.steps.length + '</p><p class="ptext">' + s.t + '</p></div>';
    if (dir){ void c.offsetWidth; c.className = 'pcard ' + (dir > 0 ? 'in-next' : 'in-prev'); }
    $('pg').textContent = s.g || t.title;
    $('pc').textContent = (i+1) + ' / ' + t.steps.length;
    $('pPrev').disabled = i === 0;
    var last = i === t.steps.length - 1;
    $('pNext').disabled = last;
    $('pNext').textContent = last ? 'Last step' : 'Next →';
    if ($('progBar')) $('progBar').style.width = ((i+1) / t.steps.length * 100) + '%';
    else [].forEach.call($('dots').children, function(b, k){ b.setAttribute('aria-current', k === i ? 'true' : 'false'); });
    if ($('gchips')) [].forEach.call($('gchips').children, function(b){ b.setAttribute('aria-pressed', b.getAttribute('data-g') === s.g ? 'true' : 'false'); });
  }

  /* Atkinson Hyperlegible slashes its zeros, which makes 000 read badly: set phone numbers in the display face. */
  function fixNumbers(root){
    var re = /(^|[^\d])(000|13 11 26)(?![\d])/;
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: function(n){
      var p = n.parentNode;
      if (!p || p.closest('svg,script,style,textarea,input,.num,.call')) return NodeFilter.FILTER_REJECT;
      return re.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }});
    var nodes = []; while (w.nextNode()) nodes.push(w.currentNode);
    nodes.forEach(function(n){
      var frag = document.createDocumentFragment(), text = n.nodeValue, m;
      while ((m = re.exec(text))){
        var at = m.index + m[1].length;
        frag.appendChild(document.createTextNode(text.slice(0, at)));
        var sp = document.createElement('span'); sp.className = 'num'; sp.textContent = m[2]; frag.appendChild(sp);
        text = text.slice(at + m[2].length);
      }
      frag.appendChild(document.createTextNode(text));
      n.parentNode.replaceChild(frag, n);
    });
  }


  /* ---------- "What's happening?" question flow ---------- */
  var help = $('help'), hist = [];
  function renderFlow(id){
    var n = FLOW[id], h = '<a class="back" href="#">\u2190 All topics</a>';
    h += '<header class="fhead"><span class="tag">Answer a few questions</span><h1 id="fTitle" tabindex="-1">What\u2019s happening?</h1></header>';
    h += '<section class="fcard' + (n.end ? ' fresult' : '') + '" aria-live="polite">';
    if (n.call === true) h += '<p class="fcall"><strong>Call 000 now</strong>, or get someone else to call while you stay with them.</p>';
    else if (n.call) h += '<p class="fcall soft">' + n.call + '</p>';
    if (!n.end){
      h += '<h2 class="fq">' + n.q + '</h2>';
      if (n.note) h += '<p class="fnote">' + n.note + '</p>';
      h += '<div class="fans">' + n.a.map(function(x, i){ return '<button type="button" class="fbtn' + (x.alarm ? ' alarm' : '') + '" data-i="' + i + '">' + x.t + '</button>'; }).join('') + '</div>';
    } else {
      var t = byId[n.topic];
      h += '<h2 class="fq">' + n.h + '</h2><p class="fp">' + n.p + '</p>';
      if (t) h += '<a class="fgo" href="#' + t.id + '">' + (t.id === 'collapse' ? 'Go to: Someone has collapsed (DRSABCD)' : 'Go to the full steps: ' + t.title) + ' \u2192</a>';
    }
    h += '</section><div class="fnav">' + (hist.length ? '<button type="button" class="pbtn" id="fBack">\u2190 Previous question</button>' : '') +
      (id !== 'start' ? '<button type="button" class="pbtn" id="fRestart">Start again</button>' : '') + '</div>';
    h += '<p class="src">These questions follow the ANZCOR first-steps sequence (DRSABCD). Each answer leads to the full steps and their sources.</p>';
    help.innerHTML = h; fixNumbers(help);
    [].forEach.call(help.querySelectorAll('.fbtn'), function(b){
      b.addEventListener('click', function(){ hist.push(id); renderFlow(n.a[+b.getAttribute('data-i')].go); focusFlow(); });
    });
    if ($('fBack')) $('fBack').addEventListener('click', function(){ renderFlow(hist.pop()); focusFlow(); });
    if ($('fRestart')) $('fRestart').addEventListener('click', function(){ hist = []; renderFlow('start'); focusFlow(); });
  }
  function focusFlow(){ window.scrollTo(0, 0); var q = help.querySelector('.fq'); if (q){ q.tabIndex = -1; q.focus({preventScroll:true}); } }

  /* ---------- Routing ---------- */
  function route(){
    var id = location.hash.replace('#', '');
    var t = byId[id];
    if (id === 'help'){
      stopBeat(); Anatomy.dispose();
      home.hidden = true; view.hidden = true; help.hidden = false; cur = null; view.innerHTML = '';
      hist = []; renderFlow('start'); window.scrollTo(0, 0);
      var ft = $('fTitle'); if (ft) ft.focus({preventScroll:true});
      document.title = 'What\u2019s happening? | First Aid Quick Guide';
      return;
    }
    help.hidden = true;
    if (t){
      home.hidden = true; view.hidden = false;
      if (cur !== t || view.innerHTML === '') renderTopic(t);
      setActive(t.i);
      window.scrollTo(0, 0);
      var h = $('tTitle'); if (h) h.focus({preventScroll:true});
      document.title = t.title + ' | First Aid Quick Guide';
    } else {
      stopBeat(); Anatomy.dispose();
      view.hidden = true; home.hidden = false; cur = null; view.innerHTML = '';
      document.title = 'First Aid Quick Guide';
      layout();
    }
  }
  window.addEventListener('hashchange', route);

  /* ---------- CPR beat ---------- */
  var ctx = null, timer = null, n = 0, pauseUntil = 0, INTERVAL = 60000/110, BREATHS_MS = 4000;
  function beep(freq, len){
    if (!ctx) return;
    try {
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.value = freq; o.type = 'square';
      g.gain.setValueAtTime(0.18, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + len);
      o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + len);
    } catch(e){}
  }
  function setCount(text, breathe){
    var el = $('beatCount'); if (!el) return;
    el.innerHTML = '<span class="pulse" id="pulse"></span>' + text;
    el.classList.toggle('breathe', !!breathe);
  }
  function tick(){
    var now = Date.now(); if (now < pauseUntil) return;
    n++;
    var p = $('pulse'); if (p){ p.classList.add('on'); setTimeout(function(){ p.classList.remove('on'); }, 120); }
    if (n >= 30){ beep(520, 0.35); setCount('30: give 2 breaths', true); pauseUntil = now + BREATHS_MS; n = 0; }
    else { beep(n === 1 ? 1100 : 880, 0.06); setCount(String(n), false); }
  }
  function stopBeat(){
    if (timer){ clearInterval(timer); timer = null; }
    var b = $('beatBtn'); if (b){ b.textContent = 'Start CPR beat'; b.setAttribute('aria-pressed', 'false'); setCount('Ready', false); }
  }
  function beatSetup(){
    $('beatBtn').addEventListener('click', function(){
      if (timer){ stopBeat(); return; }
      try { var AC = window.AudioContext || window.webkitAudioContext; if (AC){ ctx = ctx || new AC(); if (ctx.state === 'suspended') ctx.resume(); } } catch(e){ ctx = null; }
      if (!ctx) $('beatNote').textContent = 'Sound is blocked here. Follow the counter on screen instead.';
      n = 0; pauseUntil = 0;
      this.textContent = 'Stop'; this.setAttribute('aria-pressed', 'true');
      setCount('Push', false);
      timer = setInterval(tick, INTERVAL);
    });
  }

  fixNumbers(document.body);
  setActive(0);
  route();
})();
