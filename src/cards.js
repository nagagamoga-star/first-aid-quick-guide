/* Keyboard and buttons for the home-screen topic cards.
   The cards themselves are in the page (built from data/topic-cards.json),
   so they work without this script. Swipe is native scrolling. */
(function(){
  var sc = document.getElementById('deckScroller');
  if (!sc) return;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function list(){ return [].slice.call(sc.querySelectorAll('.deck-card')); }
  function index(){
    var mid = sc.scrollLeft + sc.clientWidth / 2, best = 0, bestD = 1e9;
    list().forEach(function(c, i){
      var d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid);
      if (d < bestD){ bestD = d; best = i; }
    });
    return best;
  }
  function go(dir){
    var items = list();
    var n = items[Math.max(0, Math.min(items.length - 1, index() + dir))];
    if (!n) return;
    var left = n.offsetLeft - (sc.clientWidth - n.offsetWidth) / 2;
    sc.scrollTo({ left: Math.max(0, left), behavior: reduce ? 'auto' : 'smooth' });
  }
  sc.addEventListener('keydown', function(e){
    if (e.key === 'ArrowRight'){ go(1); e.preventDefault(); }
    else if (e.key === 'ArrowLeft'){ go(-1); e.preventDefault(); }
    else if (e.key === 'Home'){ go(-999); e.preventDefault(); }
    else if (e.key === 'End'){ go(999); e.preventDefault(); }
  });
  var prev = document.getElementById('deckPrev'), next = document.getElementById('deckNext');
  if (prev) prev.addEventListener('click', function(){ go(-1); });
  if (next) next.addEventListener('click', function(){ go(1); });
})();
