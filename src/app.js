(function(){
  /* Lighting for the drawings (see "Illustration lighting" in style.css): one
     hidden set of gradients, shared by every drawing on the page. Stop colours
     come from CSS variables, so they follow light and dark mode. */
  (function(){
    function lin(id, v){ return '<linearGradient id="fa-g-' + id + '" x1="0" y1="0" x2="0.35" y2="1"><stop offset="0" style="stop-color:var(--' + v + '-hi)"/><stop offset=".5" style="stop-color:var(--' + v + ')"/><stop offset="1" style="stop-color:var(--' + v + '-lo)"/></linearGradient>'; }
    function rad(id, v){ return '<radialGradient id="fa-g-' + id + '" cx=".36" cy=".3" r=".78"><stop offset="0" style="stop-color:var(--' + v + '-hi)"/><stop offset=".55" style="stop-color:var(--' + v + ')"/><stop offset="1" style="stop-color:var(--' + v + '-lo)"/></radialGradient>'; }
    var d = document.createElement('div');
    d.innerHTML = '<svg width="0" height="0" aria-hidden="true" focusable="false" style="position:absolute;width:0;height:0;overflow:hidden"><defs>' +
      rad('skin', 'skin') + rad('skind', 'skin-d') + lin('pt', 'pt') + lin('water', 'water') + lin('ice', 'ice') +
      lin('wood', 'wood') + lin('band', 'bandage') + lin('act', 'act') + lin('amber', 'amber-fill') + '</defs></svg>';
    document.body.insertBefore(d.firstChild, document.body.firstChild);
  })();
  var N = TOPICS.length;
  var byId = {}; TOPICS.forEach(function(t, i){ t.i = i; byId[t.id] = t; });
  /* Navigation only. Does not add or change a first-aid instruction. */
  var CATS = [
    ['Life-threatening', ['collapse','cpr','choking','bleeding','anaphylaxis','heart','stroke','unconscious']],
    ['Bites & stings', ['snake','marine','spider']],
    ['Injuries & burns', ['burns']],
    ['Medical', ['asthma','seizure','heat','poison']]
  ];
  (function(){
    var seen = {};
    CATS.forEach(function(c){ c[1].forEach(function(id){
      if (!byId[id] || seen[id]) throw new Error('topic map ' + id);
      seen[id] = 1;
    }); });
    if (Object.keys(seen).length !== N) throw new Error('topic map is missing a topic');
  })();
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
    b.innerHTML = picture(t.id, 'icon', t.icon) + '<div class="tbody ' + t.sev + '"><span class="tag">' + t.tag + '</span><h2>' + t.title + '</h2><p>' + t.short + '</p><span class="go">Show me the steps →</span></div>';
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
      // Active card: lifted 40px towards the viewer, plus the tilt/lean variables
      // set by the pointer handlers below (0 when idle). Others recede and turn.
      c.style.transform = d === 0
        ? 'translateZ(40px) translateX(var(--dx,0px)) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))'
        : 'translateX(' + (d * spread) + 'px) translateZ(' + (-a * 170) + 'px) rotateY(' + (d * -40) + 'deg)';
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

  /* Tactile hooks (skipped under reduced motion). They only set CSS variables
     on the active card; the transform and the spring transition live in CSS.
     Mouse: tilt towards the pointer, up to about 5 degrees.
     Touch: lean with the drag, so a swipe has weight before it turns the deck. */
  function tilt(rx, ry, dx){
    var c = cards[active];
    c.style.setProperty('--rx', rx.toFixed(2) + 'deg');
    c.style.setProperty('--ry', ry.toFixed(2) + 'deg');
    c.style.setProperty('--dx', dx.toFixed(1) + 'px');
  }
  function untilt(){ stage.classList.remove('tilting', 'dragging'); cards.forEach(function(c){ c.style.removeProperty('--rx'); c.style.removeProperty('--ry'); c.style.removeProperty('--dx'); }); }
  if (!reduce){
    var fine = window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches;
    var tx0 = null;
    stage.addEventListener('pointerdown', function(e){ if (e.pointerType !== 'mouse') tx0 = e.clientX; });
    stage.addEventListener('pointermove', function(e){
      if (e.pointerType === 'mouse'){
        if (!fine) return;
        var r = cards[active].getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        if (Math.abs(px) > 0.6 || Math.abs(py) > 0.6){ untilt(); return; }
        stage.classList.add('tilting'); tilt(-py * 8, px * 10, 0);
      } else if (tx0 !== null){
        var dx = Math.max(-120, Math.min(120, e.clientX - tx0));
        stage.classList.add('dragging'); tilt(0, dx * 0.08, dx * 0.3);
      }
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(function(ev){ stage.addEventListener(ev, function(){ tx0 = null; untilt(); }); });
  }
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

  /* ---------- Home: search and category tiles ---------- */
  var idx = $('chipsWrap');
  CATS.forEach(function(g){
    var d = document.createElement('div'); d.className = 'group';
    var links = g[1].map(function(id){
      var t = byId[id];
      var dk = (t.title + ' ' + t.k).toLowerCase().replace(/"/g, '');
      var tag = String(t.tag).replace(/"/g, '');
      return '<a class="tile ' + t.sev + '" href="#' + t.id + '" data-tag="' + tag + '" data-k="' + dk + '">' + MARKS.svg(t.id) + '<span class="tile-title">' + t.title + '</span></a>';
    }).join('');
    d.innerHTML = '<h2>' + g[0] + '</h2><div class="chips">' + links + '</div>';
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


  /* Clinical review status (from data/topic-reviews.json via build.py). */
  var MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  function monthYear(d){ var p = (d || '').split('-'); return p.length > 1 ? MONTHS[+p[1] - 1] + ' ' + p[0] : (d || ''); }
  function reviewLine(id){
    var r = (typeof REVIEWS !== 'undefined' && REVIEWS[id]) || null; if (!r) return '';
    var txt, cls = 'pending';
    if (r.status === 'APPROVED FOR PUBLICATION'){ txt = 'Reviewed by a ' + r.qualification + ' in ' + monthYear(r.reviewedAt) + '. Next review due ' + monthYear(r.nextReview) + '.'; cls = 'ok'; }
    else if (r.status === 'CLINICALLY REVIEWED') txt = 'Reviewed by a ' + r.qualification + ' in ' + monthYear(r.reviewedAt) + ', awaiting publication sign-off.';
    else if (r.status === 'REVIEW OVERDUE') txt = 'Review overdue. Last reviewed ' + monthYear(r.reviewedAt) + '.';
    else txt = 'Not yet reviewed by a qualified first aid trainer or clinician.';
    return '<p class="rstatus ' + cls + '">Review status: ' + txt + '</p>';
  }

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
    h += '<div class="deck-row"><div class="deck-main">';
    h += '<section class="player" id="player" tabindex="0" aria-label="Steps" aria-roledescription="step cards" aria-describedby="deckHint">' +
      '<div class="rail" id="rail" role="progressbar" aria-valuemin="1" aria-valuemax="' + t.steps.length + '" aria-valuenow="1" aria-label="Progress through the steps"><span id="railFill"></span></div>' +
      '<p class="sr-only" id="deckHint">Arrow keys move between steps. You can also swipe the drawing.</p>' +
      '<div class="pmeta"><span class="pg" id="pg"></span><span id="pc"></span></div>' +
      '<div class="pview" id="pview"><div class="pcard" id="pcard" aria-live="polite"></div></div>' +
      '<div class="pctl"><button type="button" class="pbtn" id="pPrev">← Back</button><div class="dots" id="dots"></div><button type="button" class="pbtn next" id="pNext">Next →</button></div></section>';
    h += '<ol class="list" id="list" hidden>' + listHtml(t) + '</ol>';
    h += '<button type="button" class="toggle" id="toggle" aria-expanded="false">Show all steps as a list</button>';
    h += '<p class="inkey"><span><i class="swatch pt"></i>Person</span><span><i class="swatch rs"></i>Helper</span></p>';
    h += '</div>';
    if (t.body) h += '<section class="v3d" id="v3d" aria-labelledby="v3dh">' +
      '<div class="v3d-head"><h2 id="v3dh">' + t.body.title + '</h2><span class="v3d-badge">3D</span></div>' +
      '<p class="v3d-cap">' + t.body.caption + '</p>' +
      '<div class="v3d-stage"><button type="button" class="v3d-load">Show in 3D</button></div>' +
      '<div class="v3d-tools" hidden><button type="button" data-v="front">Front</button><button type="button" data-v="side">Side</button><button type="button" data-v="whole">Whole body</button></div>' +
      '<p class="v3d-status" aria-live="polite">Loads a body model of about 0.5 MB.</p>' +
      '<p class="v3d-credit">Anatomy: <a href="https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html">BodyParts3D</a>, \u00a9 The Database Center for Life Science, CC BY 4.0, simplified from Human Atlas. The explanation is general anatomy, not part of the ANZCOR guidelines.</p></section>';
    h += '</div>';
    if (t.extra === 'cpr') h += $('tplBeat').innerHTML;
    if (t.dont) h += '<section class="dont"><h2>Don’t</h2><ul>' + t.dont.map(function(d){ return '<li>' + d + '</li>'; }).join('') + '</ul></section>';
    if (t.notes) h += '<ul class="notes">' + t.notes.map(function(n){ return '<li>' + n + '</li>'; }).join('') + '</ul>';
    h += '<p class="src">Source: ' + t.src + '</p>';
    h += reviewLine(t.id);
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
      if (e.target.tagName === 'A' || e.target.tagName === 'INPUT') return;
      if (e.key === 'ArrowLeft'){ show(step - 1, -1); e.preventDefault(); }
      if (e.key === 'ArrowRight'){ show(step + 1, 1); e.preventDefault(); }
      if (e.key === 'Home'){ show(0, -1); e.preventDefault(); }
      if (e.key === 'End'){ show(t.steps.length - 1, 1); e.preventDefault(); }
    });
    $('rail').addEventListener('click', function(e){
      var rect = this.getBoundingClientRect();
      if (!rect.width) return;
      var ratio = (e.clientX - rect.left) / rect.width;
      var i = Math.min(t.steps.length - 1, Math.max(0, Math.floor(ratio * t.steps.length)));
      show(i, i > step ? 1 : -1);
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
      out += '<li class="li">' + picture(t.id, i, s.a) + '<p><span class="n">' + (i+1) + '</span>' + s.t + '</p></li>';
    });
    return out;
  }

  function show(i, dir){
    var t = cur; if (!t) return;
    if (i < 0 || i >= t.steps.length) return;
    step = i;
    var s = t.steps[i], c = $('pcard');
    c.className = 'pcard';
    c.innerHTML = picture(t.id, i, s.a) + '<div class="pbody"><p class="pnum">Step ' + (i+1) + ' of ' + t.steps.length + '</p><p class="ptext">' + s.t + '</p></div>';
    if (dir){ void c.offsetWidth; c.className = 'pcard ' + (dir > 0 ? 'in-next' : 'in-prev'); }
    $('pg').textContent = s.g || t.title;
    $('pc').textContent = (i+1) + ' / ' + t.steps.length;
    $('pPrev').disabled = i === 0;
    var last = i === t.steps.length - 1;
    $('pNext').disabled = last;
    $('pNext').textContent = last ? 'Last step' : 'Next →';
    if ($('progBar')) $('progBar').style.width = ((i+1) / t.steps.length * 100) + '%';
    var rail = $('rail'), fill = $('railFill');
    if (rail && fill){
      rail.setAttribute('aria-valuenow', String(i + 1));
      rail.setAttribute('aria-valuetext', 'Step ' + (i + 1) + ' of ' + t.steps.length);
      fill.style.width = ((i + 1) / t.steps.length * 100) + '%';
    }
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
    h += reviewLine('question-flow');
    help.innerHTML = h; fixNumbers(help);
    [].forEach.call(help.querySelectorAll('.fbtn'), function(b){
      b.addEventListener('click', function(){ hist.push(id); renderFlow(n.a[+b.getAttribute('data-i')].go); focusFlow(); });
    });
    if ($('fBack')) $('fBack').addEventListener('click', function(){ renderFlow(hist.pop()); focusFlow(); });
    if ($('fRestart')) $('fRestart').addEventListener('click', function(){ hist = []; renderFlow('start'); focusFlow(); });
  }
  function focusFlow(){ window.scrollTo(0, 0); var q = help.querySelector('.fq'); if (q){ q.tabIndex = -1; q.focus({preventScroll:true}); } }

  /* A step picture. The slot id is the contract; the markup around it is layout. */
  function picture(topicId, stepIndex, spec){
    var s = Illustrate.slot(topicId, stepIndex, spec);
    // The diagram is a visual aid, not a replacement for the written instruction.
    // Keep the existing reviewed-content boundary: no drawing geometry or step text changes.
    if (stepIndex === 'icon') return '<div class="illust" data-slot="' + s.id + '">' + Illustrate.render(s) + '</div>';
    return '<figure class="illust step-illustration" data-slot="' + s.id + '">' +
      '<div class="diagram-heading" aria-hidden="true"><span class="diagram-heading-mark"></span>Step illustration</div>' +
      Illustrate.render(s) +
      '<figcaption class="diagram-key"><span><i class="key-swatch key-person"></i>Person</span>' +
      '<span><i class="key-swatch key-helper"></i>Helper</span>' +
      '<span><i class="key-swatch key-action"></i>Action / direction</span></figcaption>' +
      '</figure>';
  }

  /* ---------- Routing ---------- */
  function route(){
    if (typeof closePalette === 'function') closePalette(true);
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

  /* ---------- Command palette ---------- */
  var palette = $('palette'), pQ = $('paletteQ'), pList = $('paletteList'), pEmpty = $('paletteEmpty');
  var jumpBtn = $('jumpBtn');
  var options = [], visible = [], closeToken = 0;

  function fuzzy(q, hay){
    q = q.toLowerCase().trim();
    if (!q) return 1;
    var at = hay.indexOf(q);
    if (at === 0) return 120;
    if (at > 0) return 90 - Math.min(at, 30);
    var qi = 0, score = 0, prev = -2, run = 0;
    for (var n = 0; n < hay.length && qi < q.length; n++){
      if (hay[n] === q[qi]){
        run = (n === prev + 1) ? run + 1 : 1;
        score += 2 + run;
        if (n === 0 || hay[n - 1] === ' ') score += 3;
        prev = n; qi++;
      }
    }
    return qi === q.length ? score : 0;
  }
  CATS.forEach(function(g){
    var group = document.createElement('li');
    group.className = 'palette-group';
    group.setAttribute('role', 'presentation');
    var hid = 'cat-' + g[0].toLowerCase().replace(/[^a-z]+/g, '');
    group.innerHTML = '<div class="palette-cat" id="' + hid + '">' + g[0] + '</div><ul role="group" aria-labelledby="' + hid + '"></ul>';
    var ul = group.querySelector('ul');
    g[1].forEach(function(id){
      var t = byId[id];
      var li = document.createElement('li');
      li.id = 'opt-' + t.id;
      li.className = 'opt ' + t.sev;
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', 'false');
      li.dataset.id = t.id;
      li.innerHTML = MARKS.svg(t.id) + '<span class="opt-copy"><span class="opt-title"></span><span class="opt-short"></span></span>';
      li.querySelector('.opt-title').textContent = t.title;
      li.querySelector('.opt-short').textContent = t.short;
      ul.appendChild(li);
      options.push({ el: li, group: group, t: t, hay: (t.title + ' ' + t.short + ' ' + t.tag + ' ' + t.k + ' ' + t.id).toLowerCase() });
    });
    pList.appendChild(group);
  });
  function setActiveOpt(o){
    options.forEach(function(x){
      var on = x === o;
      x.el.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    pQ.setAttribute('aria-activedescendant', o ? o.el.id : '');
    if (o) o.el.scrollIntoView({ block: 'nearest' });
  }
  function applyFilter(q){
    var best = null, bestS = -1, shown = 0;
    options.forEach(function(o){
      var s = fuzzy(q, o.hay);
      o.el.hidden = !s;
      if (s){ shown++; if (s > bestS){ bestS = s; best = o; } }
    });
    [].forEach.call(pList.children, function(g){
      g.hidden = ![].some.call(g.querySelectorAll('[role="option"]'), function(o){ return !o.hidden; });
    });
    pEmpty.hidden = shown > 0;
    visible = options.filter(function(o){ return !o.el.hidden; });
    setActiveOpt((q.trim() && best) ? best : (visible[0] || null));
  }
  function moveOpt(d){
    if (!visible.length) return;
    var i = 0;
    visible.forEach(function(o, k){ if (o.el.getAttribute('aria-selected') === 'true') i = k; });
    setActiveOpt(visible[(i + d + visible.length) % visible.length]);
  }
  function chosen(){
    for (var i = 0; i < visible.length; i++) if (visible[i].el.getAttribute('aria-selected') === 'true') return visible[i];
    return null;
  }
  function goActive(){
    var o = chosen(); if (!o) return;
    closePalette(true);
    if (location.hash === '#' + o.t.id) route();
    else location.hash = o.t.id;
  }
  function typingTarget(el){
    if (!el || !el.tagName) return false;
    var tag = el.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable;
  }
  function openPalette(){
    closeToken++;
    palette.hidden = false;
    document.body.classList.add('palette-open');
    jumpBtn.setAttribute('aria-expanded', 'true');
    pQ.setAttribute('aria-expanded', 'true');
    pQ.value = '';
    applyFilter('');
    requestAnimationFrame(function(){ palette.classList.add('open'); });
    pQ.focus();
  }
  function closePalette(silent){
    if (!palette || (palette.hidden && !palette.classList.contains('open'))) return;
    var token = ++closeToken;
    palette.classList.remove('open');
    document.body.classList.remove('palette-open');
    jumpBtn.setAttribute('aria-expanded', 'false');
    pQ.setAttribute('aria-expanded', 'false');
    var finish = function(){ if (token === closeToken) palette.hidden = true; };
    if (reduce) finish(); else setTimeout(finish, 240);
    if (!silent) jumpBtn.focus();
  }
  jumpBtn.addEventListener('click', function(){ palette.hidden ? openPalette() : closePalette(); });
  $('paletteClose').addEventListener('click', function(){ closePalette(); });
  $('paletteScrim').addEventListener('click', function(){ closePalette(); });
  pQ.addEventListener('input', function(){ applyFilter(pQ.value); });
  pQ.addEventListener('keydown', function(e){
    if (e.key === 'ArrowDown'){ e.preventDefault(); moveOpt(1); }
    else if (e.key === 'ArrowUp'){ e.preventDefault(); moveOpt(-1); }
    else if (e.key === 'Home'){ e.preventDefault(); setActiveOpt(visible[0] || null); }
    else if (e.key === 'End'){ e.preventDefault(); setActiveOpt(visible[visible.length - 1] || null); }
    else if (e.key === 'Enter'){ e.preventDefault(); goActive(); }
    else if (e.key === 'Escape'){ e.preventDefault(); closePalette(); }
  });
  pList.addEventListener('click', function(e){
    var li = e.target.closest('[role="option"]');
    if (!li || li.hidden) return;
    closePalette(true);
    if (location.hash === '#' + li.dataset.id) route();
    else location.hash = li.dataset.id;
  });
  pList.addEventListener('mousemove', function(e){
    var li = e.target.closest('[role="option"]');
    if (!li || li.hidden) return;
    for (var i = 0; i < options.length; i++) if (options[i].el === li){ setActiveOpt(options[i]); break; }
  });
  document.addEventListener('keydown', function(e){
    var k = e.key.toLowerCase();
    if ((e.metaKey || e.ctrlKey) && k === 'k'){ e.preventDefault(); palette.hidden ? openPalette() : closePalette(); return; }
    if (e.key === '/' && palette.hidden && !typingTarget(e.target)){ e.preventDefault(); openPalette(); }
    else if (e.key === 'Escape' && !palette.hidden){ closePalette(); }
  });

  fixNumbers(document.body);
  setActive(0);
  route();
})();

/* Compact dock: after scrolling 64px on a phone, the dock folds into one row
   (style.css, ".dock.compact"); back at the top it unfolds. The gap between the
   two thresholds stops it flickering. Call 000 and 13 11 26 never leave the screen. */
(function(){
  var dock = document.querySelector('.dock'); if (!dock) return;
  var on = false, ticking = false;
  function update(){
    ticking = false;
    var y = window.scrollY || 0;
    if (!on && y > 64){ on = true; dock.classList.add('compact'); }
    else if (on && y < 16){ on = false; dock.classList.remove('compact'); }
  }
  window.addEventListener('scroll', function(){ if (!ticking){ ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
})();
