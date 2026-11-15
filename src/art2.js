/* Step illustrations, house style (from the CPR pilot, 16 Nov 2026).
   Flat vector, 360x240, on a light panel in both themes.
   - Responder: unbranded teal uniform, green gloves.
   - Casualty: neutral clothes, skin tone kept plain, landmarks where they matter.
   - Red is only for force, direction and the spot that matters. Pills carry
     the words that were already drawn on the old pictures; no new instructions.
   ART2.svg(spec) returns '' for keys it doesn't draw, so the older drawing
   (art.js) or a Commons diagram is used instead. */
var ART2 = (function(){
  var C = {
    panel:'#F5F7F7', floor:'#E6EBEC', floorLine:'#CBD3D6', ink:'#1F2937', mute:'#334155',
    red:'#D61F3A', uni:'#0F766E', uni2:'#0B5F59', uniLine:'#0A4F4A', uniHi:'#15948A',
    glove:'#10B981', glove2:'#0D9488', gloveLine:'#0B7A70',
    skin:'#D9B08C', skin2:'#C99A75', skinLine:'#B48766', hair:'#5A4636',
    rSkin:'#B9825C', rSkinLine:'#8E6142', rHair:'#3A2A22',
    shirt:'#A9B4C0', shirt2:'#8C98A6', pants:'#4B5866', bone:'#5E6B78',
    water:'#5B9BD5', waterHi:'#A9D0F0', band:'#F4F1E8', bandLine:'#B9B2A0', wood:'#B8916B'
  };
  var uid = 0;

  /* ---------- primitives ---------- */
  function wrap(inner, ids){
    return '<svg class="art art2" viewBox="0 0 360 240" aria-hidden="true" focusable="false">' +
      '<defs>' +
        '<linearGradient id="' + ids.uni + '" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="' + C.uni + '"/><stop offset="1" stop-color="' + C.uni2 + '"/></linearGradient>' +
        '<linearGradient id="' + ids.shirt + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B4BEC9"/><stop offset="1" stop-color="' + C.shirt2 + '"/></linearGradient>' +
        '<linearGradient id="' + ids.glove + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#34D399"/><stop offset="1" stop-color="' + C.glove2 + '"/></linearGradient>' +
      '</defs>' +
      '<rect width="360" height="240" rx="18" fill="' + C.panel + '"/>' + inner + '</svg>';
  }
  function ids(){ uid++; return { uni:'a2u' + uid, shirt:'a2s' + uid, glove:'a2g' + uid }; }
  function floor(y){ y = y || 203; return '<rect x="0" y="' + y + '" width="360" height="' + (240 - y) + '" fill="' + C.floor + '"/><path d="M0 ' + y + 'H360" stroke="' + C.floorLine + '" stroke-width="2"/>'; }
  function shadow(cx, rx, y){ return '<ellipse cx="' + cx + '" cy="' + (y || 204) + '" rx="' + rx + '" ry="5" fill="#0B1F2A" opacity=".10"/>'; }
  function head(x, y, dx, dy, len, w){ // arrowhead at (x,y) pointing along (dx,dy)
    var L = Math.sqrt(dx * dx + dy * dy) || 1, ux = dx / L, uy = dy / L, px = -uy, py = ux;
    len = len || 16; w = w || 10;
    var bx = x - ux * len, by = y - uy * len;
    return '<path d="M' + r(x) + ' ' + r(y) + 'L' + r(bx + px * w) + ' ' + r(by + py * w) + 'L' + r(bx - px * w) + ' ' + r(by - py * w) + 'Z" fill="' + C.red + '"/>';
  }
  function r(v){ return Math.round(v * 10) / 10; }
  function arrow(x1, y1, x2, y2, w){
    w = w || 6;
    var dx = x2 - x1, dy = y2 - y1, L = Math.sqrt(dx * dx + dy * dy) || 1, k = (L - 12) / L;
    return '<path d="M' + x1 + ' ' + y1 + 'L' + r(x1 + dx * k) + ' ' + r(y1 + dy * k) + '" stroke="' + C.red + '" stroke-width="' + w + '" stroke-linecap="round"/>' + head(x2, y2, dx, dy, 18, w * 1.8);
  }
  // Curved arrow: quadratic from (x1,y1) via (cx,cy) to (x2,y2), head at the end.
  function carrow(x1, y1, cx, cy, x2, y2, w){
    w = w || 5;
    return '<path d="M' + x1 + ' ' + y1 + 'Q' + cx + ' ' + cy + ' ' + x2 + ' ' + y2 + '" stroke="' + C.red + '" stroke-width="' + w + '" stroke-linecap="round" fill="none"/>' + head(x2, y2, x2 - cx, y2 - cy, 15, w * 1.9);
  }
  function hits(x, y){ // impact marks around (x,y)
    return '<path d="M' + (x - 14) + ' ' + (y - 10) + 'l-8 -8M' + x + ' ' + (y - 16) + 'v-11M' + (x + 14) + ' ' + (y - 10) + 'l8 -8" stroke="' + C.red + '" stroke-width="3.5" stroke-linecap="round"/>';
  }
  function pill(x, y, txt, o){
    o = o || {};
    var s = o.size || 12.5, w = Math.round(String(txt).replace(/&[a-z#0-9]+;/gi, 'x').length * s * 0.58 + 24), h = Math.round(s * 2.2);
    var left = o.anchor === 'start' ? x : o.anchor === 'end' ? x - w : x - w / 2;
    if (left < 8) left = 8; if (left + w > 352) left = 352 - w;
    var fill = o.fill || C.ink;
    return '<rect x="' + r(left) + '" y="' + (y - h / 2) + '" width="' + w + '" height="' + h + '" rx="' + h / 2 + '" fill="' + fill + '"/>' +
      '<text x="' + r(left + w / 2) + '" y="' + r(y + s * 0.36) + '" font-size="' + s + '" fill="#fff" text-anchor="middle" font-family="Inter, \'Segoe UI\', system-ui, sans-serif" font-weight="700">' + txt + '</text>';
  }
  function note(x, y, txt, anchor){
    return '<text x="' + x + '" y="' + y + '" font-size="11.5" fill="' + C.mute + '" text-anchor="' + (anchor || 'start') + '" font-family="Inter, \'Segoe UI\', system-ui, sans-serif" font-weight="600">' + txt + '</text>';
  }
  function leader(x1, y1, x2, y2, red){ return '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + (red ? C.red : C.ink) + '" stroke-width="1.6" stroke-dasharray="3 3" fill="none"/>'; }
  function glove(cx, cy, rx, ry, rot, g){ return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" transform="rotate(' + (rot || 0) + ' ' + cx + ' ' + cy + ')" fill="url(#' + g.glove + ')" stroke="' + C.gloveLine + '" stroke-width="1.2"/>'; }
  function sleeve(x1, y1, x2, y2, w){ w = w || 12; return '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + C.uniLine + '" stroke-width="' + (w + 4) + '" stroke-linecap="round"/><path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + C.uniHi + '" stroke-width="' + w + '" stroke-linecap="round"/>'; }
  function cuff(x1, y1, x2, y2, w){ w = w || 12; return '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + C.glove + '" stroke-width="' + w + '" stroke-linecap="round"/>'; }
  function rHead(cx, cy, face){ // responder head; face: 'left' | 'down' | 'right'
    var f = face === 'right' ? 1 : -1;
    return '<circle cx="' + cx + '" cy="' + cy + '" r="15" fill="' + C.rSkin + '"/>' +
      '<path d="M' + (cx - 14 * -f) + ' ' + (cy - 4) + 'C' + (cx - 13 * -f) + ' ' + (cy - 14) + ' ' + (cx - 4 * -f) + ' ' + (cy - 19) + ' ' + (cx + 5 * -f) + ' ' + (cy - 17) + 'C' + (cx + 13 * -f) + ' ' + (cy - 16) + ' ' + (cx + 16 * -f) + ' ' + (cy - 9) + ' ' + (cx + 15 * -f) + ' ' + (cy - 3) + 'C' + (cx + 9 * -f) + ' ' + (cy - 7) + ' ' + (cx - 3 * -f) + ' ' + (cy - 9) + ' ' + (cx - 14 * -f) + ' ' + (cy - 4) + 'Z" fill="' + C.rHair + '"/>' +
      '<path d="M' + (cx + 14 * f) + ' ' + (cy + 2) + 'l' + (4 * f) + ' 4l' + (-5 * f) + ' 1" fill="' + C.rSkin + '" stroke="' + C.rSkinLine + '" stroke-width="1.5" stroke-linejoin="round"/>' +
      '<path d="M' + (cx + 11 * f) + ' ' + (cy - 1) + 'h' + (-5 * f) + '" stroke="' + C.rHair + '" stroke-width="2" stroke-linecap="round"/>' +
      '<path d="M' + (cx + 12 * f) + ' ' + (cy + 10) + 'q' + (-4 * f) + ' 2 ' + (-8 * f) + ' 0" stroke="' + C.rSkinLine + '" stroke-width="1.8" stroke-linecap="round" fill="none"/>';
  }

  /* ---------- figures ---------- */
  // Casualty on their back, head to the left, chin up. dx shifts it.
  function supine(g, dx, o){
    o = o || {};
    var s = '<g transform="translate(' + (dx || 0) + ' 0)">' +
      '<path d="M222 168C250 166 300 170 336 176L338 196C300 198 250 199 222 198Z" fill="' + C.pants + '"/>' +
      '<path d="M332 176C340 166 348 160 352 164C355 168 350 180 342 192Z" fill="' + C.skin + '"/>' +
      '<path d="M84 176C92 160 108 152 128 150C152 148 176 150 196 156C212 160 222 164 228 168L228 198H84Z" fill="url(#' + g.shirt + ')"/>';
    if (o.ribs !== false) s += '<g fill="none" stroke="' + C.bone + '" stroke-linecap="round" stroke-width="2" opacity=".28"><path d="M112 196C108 182 112 164 118 154"/><path d="M126 196C122 180 126 162 132 152"/><path d="M140 196C137 180 140 162 146 151"/><path d="M154 196C152 181 155 164 162 152"/><path d="M168 196C167 183 170 168 178 154"/><path d="M182 196C182 186 186 172 192 157"/></g>' +
      '<path d="M110 154C120 151 130 150 140 149" stroke="' + C.bone + '" stroke-width="5" stroke-linecap="round" fill="none" opacity=".55"/>' +
      '<path d="M140 149C152 148 164 149 176 151" stroke="' + (o.mark === false ? C.bone : C.red) + '" stroke-width="5" stroke-linecap="round" fill="none"' + (o.mark === false ? ' opacity=".55"' : '') + '/>';
    if (o.arm !== false) s += '<path d="M96 182C130 190 170 192 200 192" stroke="#9AA6B3" stroke-width="11" stroke-linecap="round" fill="none"/><ellipse cx="206" cy="192" rx="8" ry="5.5" fill="' + C.skin + '"/>';
    s += '<path d="M74 172C80 166 88 166 94 170L94 192H74Z" fill="' + C.skin + '"/>' +
      '<path d="M36 182C34 168 44 158 56 156L60 150C62 147 66 147 67 150L70 156C76 157 80 162 82 168C86 170 87 175 84 178C82 190 72 198 58 198C46 198 38 192 36 182Z" fill="' + C.skin + '"/>' +
      '<path d="M38 188C34 176 38 164 48 158C44 168 44 180 50 194Z" fill="' + C.hair + '"/>' +
      '<path d="M56 165C59 163 63 163 66 165" stroke="' + C.hair + '" stroke-width="2" stroke-linecap="round" fill="none"/>' +
      '<ellipse cx="54" cy="182" rx="5" ry="6.5" fill="' + C.skin2 + '"/></g>';
    return s;
  }
  // Responder kneeling behind a lying casualty, arms straight down to (hx, 147).
  function kneelBehind(g, hx){
    var t = hx - 152;
    return '<g transform="translate(' + t + ' 0)">' +
      '<path d="M188 128C198 138 202 152 203 168H173C172 156 170 146 168 136Z" fill="' + C.uni2 + '"/>' +
      '<path d="M146 64C160 58 176 62 182 76L190 132C176 142 156 142 150 132L138 84C136 74 139 67 146 64Z" fill="url(#' + g.uni + ')"/>' +
      '<path d="M146 64C150 60 158 58 164 60" stroke="' + C.uniLine + '" stroke-width="4" stroke-linecap="round" fill="none"/>' +
      rHead(150, 44, 'left') +
      '<path d="M158 72L156 140" stroke="' + C.uni2 + '" stroke-width="12" stroke-linecap="round"/></g>';
  }
  function kneelArms(g, hx){
    var t = hx - 152;
    return '<g transform="translate(' + t + ' 0)">' + sleeve(152, 72, 150, 130, 12) + cuff(150, 128, 150, 138, 12) +
      '<path d="M136 147C138 140 146 136 156 137C164 138 169 142 169 148C160 151 146 151 136 147Z" fill="url(#' + g.glove + ')"/>' +
      '<path d="M140 140C146 136 154 135 162 137" stroke="' + C.gloveLine + '" stroke-width="2" fill="none" stroke-linecap="round"/>' +
      '<path d="M146 139V146M152 138V146M158 139V146" stroke="' + C.gloveLine + '" stroke-width="1.6" stroke-linecap="round"/></g>';
  }
  // A leg lying along the floor, foot to the right (toes up). Returns its skin.
  function legH(y){
    y = y || 150;
    return '<path d="M8 ' + (y - 24) + 'C80 ' + (y - 26) + ' 150 ' + (y - 22) + ' 214 ' + (y - 16) + 'C236 ' + (y - 14) + ' 252 ' + (y - 16) + ' 266 ' + (y - 30) + 'C276 ' + (y - 42) + ' 292 ' + (y - 40) + ' 294 ' + (y - 28) + 'C296 ' + (y - 12) + ' 288 ' + (y + 10) + ' 270 ' + (y + 18) + 'C246 ' + (y + 26) + ' 160 ' + (y + 24) + ' 8 ' + (y + 26) + 'Z" fill="' + C.skin + '"/>' +
      '<path d="M120 ' + (y - 8) + 'q14 6 28 0" stroke="' + C.skinLine + '" stroke-width="1.6" fill="none" opacity=".6"/>';
  }
  // An arm lying across the picture, hand to the right.
  function armH(y){
    y = y || 130;
    return '<path d="M6 ' + (y - 22) + 'C90 ' + (y - 22) + ' 180 ' + (y - 18) + ' 250 ' + (y - 14) + 'C272 ' + (y - 13) + ' 300 ' + (y - 18) + ' 318 ' + (y - 10) + 'C334 ' + (y - 3) + ' 334 ' + (y + 12) + ' 316 ' + (y + 16) + 'C296 ' + (y + 20) + ' 270 ' + (y + 16) + ' 250 ' + (y + 16) + 'C180 ' + (y + 18) + ' 90 ' + (y + 22) + ' 6 ' + (y + 22) + 'Z" fill="' + C.skin + '"/>' +
      '<path d="M318 ' + (y - 10) + 'C328 ' + (y - 14) + ' 344 ' + (y - 12) + ' 346 ' + (y - 4) + 'M320 ' + (y + 2) + 'C332 ' + (y) + ' 344 ' + (y + 2) + ' 346 ' + (y + 8) + '" stroke="' + C.skinLine + '" stroke-width="1.6" fill="none" opacity=".7"/>';
  }

  /* ---------- scenes ---------- */
  var S = {};
  S.compress = function(g){
    return floor() + shadow(190, 150) + kneelBehind(g, 152) + supine(g, 0) + kneelArms(g, 152) +
      arrow(120, 66, 120, 128) +
      '<g stroke="' + C.ink + '" stroke-width="2.2" stroke-linecap="round"><path d="M186 152V167M181 152H191M181 167H191"/><path d="M186 167V198" stroke-dasharray="3 4" opacity=".45"/><path d="M192 159L222 128" stroke-width="1.6"/></g>' +
      pill(280, 120, '⅓ of chest depth') + pill(264, 33, '100–120 compressions/min', { fill: C.red }) +
      note(16, 226, 'Lower half of breastbone') + leader(158, 156, 112, 214, true);
  };
  S.handpos = function(g){
    // Front view of the chest: ribcage and breastbone; heel of the hand on the lower half, fingers off the ribs.
    return '<path d="M120 16C128 8 152 6 160 18L162 40H118Z" fill="' + C.skin + '"/>' +
      '<path d="M60 238C56 150 64 70 96 52C112 44 126 42 140 42C154 42 168 44 184 52C216 70 224 150 220 238Z" fill="url(#' + g.shirt + ')"/>' +
      '<path d="M120 40C126 50 154 50 160 40" stroke="' + C.shirt2 + '" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      '<g fill="none" stroke="' + C.bone + '" stroke-width="3" stroke-linecap="round" opacity=".35">' +
        '<path d="M134 74C112 72 92 80 84 96"/><path d="M146 74C168 72 188 80 196 96"/>' +
        '<path d="M134 96C110 94 88 104 80 122"/><path d="M146 96C170 94 192 104 200 122"/>' +
        '<path d="M134 118C108 118 86 130 80 150"/><path d="M146 118C172 118 194 130 200 150"/>' +
        '<path d="M134 140C110 142 92 156 88 176"/><path d="M146 140C170 142 188 156 192 176"/>' +
      '</g>' +
      '<rect x="133" y="64" width="14" height="44" rx="6" fill="' + C.bone + '" opacity=".45"/>' +
      '<rect x="133" y="108" width="14" height="46" rx="6" fill="' + C.red + '"/>' +
      // arm from the responder on the right, wrist at the breastbone, fingers across to the far side
      sleeve(356, 168, 182, 136, 22) + cuff(182, 136, 160, 132, 22) +
      '<path d="M158 118C162 124 162 140 156 146C140 152 112 150 100 146C94 144 94 120 100 116C114 112 144 112 158 118Z" fill="url(#' + g.glove + ')" stroke="' + C.gloveLine + '" stroke-width="1.4"/>' +
      '<g stroke="' + C.gloveLine + '" stroke-width="1.2" fill="url(#' + g.glove + ')">' +
        '<rect x="66" y="114" width="40" height="9" rx="4.5"/><rect x="62" y="124" width="44" height="9" rx="4.5"/><rect x="64" y="134" width="42" height="9" rx="4.5"/><rect x="70" y="144" width="36" height="8" rx="4"/>' +
      '</g>' +
      '<path d="M140 116C132 104 122 98 112 98C106 98 106 106 112 108C120 110 126 114 130 118Z" fill="url(#' + g.glove + ')" stroke="' + C.gloveLine + '" stroke-width="1.2"/>' +
      '<circle cx="144" cy="132" r="15" fill="none" stroke="' + C.red + '" stroke-width="3"/>' +
      pill(250, 200, 'Lower half of breastbone') + leader(152, 146, 210, 190, true) ;
  };

  S.airway = function(g){
    // Head and shoulders, on their back: hand on the forehead, fingertips under the chin.
    var s = floor(214) + shadow(170, 160, 215) +
      '<path d="M176 132C200 124 260 122 300 126C330 128 352 132 360 134V214H176Z" fill="url(#' + g.shirt + ')"/>' +
      '<path d="M146 150C152 136 166 130 182 132L186 196H150Z" fill="' + C.skin + '"/>' +
      // head, chin lifted: back of the head on the floor, face up and back
      '<path d="M60 176C56 146 76 120 104 114C108 104 116 100 122 104L126 112C140 112 152 122 158 136C164 138 166 146 160 150C158 170 146 196 112 204C84 208 64 198 60 176Z" fill="' + C.skin + '"/>' +
      '<path d="M64 186C56 164 62 140 80 126C72 146 72 168 82 198Z" fill="' + C.hair + '"/>' +
      '<path d="M104 128C110 125 118 125 124 128" stroke="' + C.hair + '" stroke-width="2.4" stroke-linecap="round" fill="none"/>' +
      '<ellipse cx="96" cy="170" rx="9" ry="12" fill="' + C.skin2 + '"/>' +
      '<path d="M138 140C144 138 150 139 154 142" stroke="' + C.skinLine + '" stroke-width="2" stroke-linecap="round" fill="none"/>' +
      // hand on the forehead (from upper left)
      sleeve(14, 26, 62, 92, 16) + cuff(62, 92, 70, 102, 16) +
      '<path d="M66 100C76 92 96 92 112 100C118 104 116 112 108 114C94 116 78 114 68 110C62 108 62 103 66 100Z" fill="url(#' + g.glove + ')" stroke="' + C.gloveLine + '" stroke-width="1.4"/>' +
      // fingertips under the chin (from above right)
      sleeve(232, 30, 182, 100, 14) + cuff(182, 100, 174, 112, 14) +
      '<path d="M176 108C170 116 166 128 162 140C160 146 166 150 170 146C176 138 180 128 184 118Z" fill="url(#' + g.glove + ')" stroke="' + C.gloveLine + '" stroke-width="1.4"/>' +
      carrow(112, 82, 80, 66, 52, 84) + arrow(176, 176, 172, 152, 5) +
      pill(240, 30, 'Tilt head back', { fill: C.red });
    // inset: cross-section, airway open
    s += '<g transform="translate(250 112)">' +
      '<circle cx="48" cy="48" r="50" fill="#fff" stroke="#CBD3D6" stroke-width="2"/>' +
      '<path d="M14 66C10 44 22 22 44 18C48 12 54 12 56 18C66 20 74 28 78 38C82 40 82 46 78 48C76 60 66 72 50 76L52 96H22C18 86 16 76 14 66Z" fill="' + C.skin + '" opacity=".55"/>' +
      '<path d="M58 44C66 46 72 50 74 56L70 62C64 58 58 56 52 56Z" fill="#E58C8C"/>' +
      '<path d="M62 34C56 40 52 52 50 66L46 96" stroke="' + C.water + '" stroke-width="8" stroke-linecap="round" fill="none"/>' +
      '<path d="M62 34C56 40 52 52 50 66L46 96" stroke="' + C.waterHi + '" stroke-width="3" stroke-linecap="round" fill="none"/>' +
      '</g>' + note(298, 232, 'Airway open', 'middle');
    return s;
  };
  S.recovery = function(g){
    // On their side, facing us: top leg bent at hip and knee, top hand under the cheek, head tilted back.
    return floor() + shadow(180, 160) +
      // lower leg, straight
      '<path d="M178 184C220 186 280 188 326 190L326 202C280 202 220 202 178 202Z" fill="' + C.pants + '"/>' +
      '<path d="M322 188C334 184 346 188 346 194C344 200 334 202 324 202Z" fill="' + C.skin + '"/>' +
      // torso on its side
      '<path d="M78 202C74 186 82 170 100 166C130 162 160 164 182 172C192 178 192 194 186 202Z" fill="url(#' + g.shirt + ')"/>' +
      // top leg: thigh up to the knee, shin back down: knee bent so they can't roll forward
      '<path d="M176 180C196 168 220 150 238 140C246 136 254 142 250 150C238 166 216 184 196 194Z" fill="' + C.pants + '"/>' +
      '<path d="M238 140C252 156 264 176 272 196L258 202C250 184 240 166 230 152Z" fill="' + C.pants + '"/>' +
      '<path d="M258 194C268 190 280 194 282 200C278 203 266 203 258 202Z" fill="' + C.skin + '"/>' +
      // top arm: elbow on the floor in front, hand under the cheek
      '<path d="M104 172C112 184 120 194 126 200" stroke="#9AA6B3" stroke-width="12" stroke-linecap="round" fill="none"/>' +
      '<path d="M126 200C104 200 82 200 64 198" stroke="' + C.skin + '" stroke-width="10" stroke-linecap="round"/>' +
      // head in profile facing left, chin forward and up, mouth towards the floor
      '<path d="M76 180C78 164 68 150 52 148C38 148 26 156 24 170C22 174 18 178 20 182L24 186C24 194 30 202 44 202C60 204 74 194 76 180Z" fill="' + C.skin + '"/>' +
      '<path d="M76 178C80 160 70 146 54 144C62 152 66 164 64 178Z" fill="' + C.hair + '"/>' +
      '<path d="M34 166C38 165 42 165 44 167" stroke="' + C.hair + '" stroke-width="2" stroke-linecap="round" fill="none"/>' +
      '<path d="M26 188C30 190 34 190 36 188" stroke="' + C.skinLine + '" stroke-width="2" stroke-linecap="round" fill="none"/>' +
      '<ellipse cx="58" cy="176" rx="5" ry="6" fill="' + C.skin2 + '"/>' +
      carrow(40, 128, 16, 132, 14, 156, 4) +
      pill(190, 34, 'On their side, head tilted back');
  };

  S.backblows = function(g){
    // Leaning well forward; heel of the hand between the shoulder blades.
    return floor() + shadow(180, 110) +
      // casualty: legs, bent-forward torso, head lower
      '<path d="M178 202L182 132H198L200 202Z" fill="' + C.pants + '"/>' +
      '<path d="M200 140C186 112 152 92 112 88C100 88 94 96 98 106C104 120 140 136 180 150Z" fill="url(#' + g.shirt + ')"/>' +
      '<path d="M98 100C86 98 78 104 78 114C78 124 86 130 96 128C104 126 108 118 106 110Z" fill="' + C.skin + '"/>' +
      '<path d="M80 108C80 100 88 96 96 98C90 104 88 112 92 122Z" fill="' + C.hair + '"/>' +
      '<path d="M122 106C118 124 116 142 118 160" stroke="#9AA6B3" stroke-width="11" stroke-linecap="round" fill="none"/>' +
      // responder standing to the side and behind
      '<path d="M252 202L250 140H274L272 202Z" fill="' + C.uni2 + '"/>' +
      '<path d="M238 74C252 66 272 68 280 82L282 146H244Z" fill="url(#' + g.uni + ')"/>' +
      rHead(258, 52, 'left') +
      // supporting hand on the chest, under the casualty
      sleeve(244, 96, 196, 132, 12) + cuff(196, 132, 186, 136, 12) + glove(176, 136, 12, 7, -10, g) +
      // striking hand: heel between the shoulder blades
      sleeve(260, 90, 196, 74, 12) + cuff(196, 74, 184, 74, 12) + glove(168, 84, 14, 8, 20, g) +
      hits(160, 80) +
      pill(64, 40, 'Up to 5', { fill: C.red, size: 15 }) + note(160, 228, 'Between the shoulder blades', 'middle') + leader(160, 216, 160, 96);
  };
  S.infant = function(g){
    // Seated; baby face down along the forearm on the thigh, head lower than the body, jaw supported.
    var baby = '#F7E08A', babyLine = '#C9AE4E';
    return floor() + shadow(220, 120) +
      '<rect x="236" y="152" width="104" height="10" rx="4" fill="' + C.wood + '"/><path d="M246 162V202M330 162V202" stroke="' + C.wood + '" stroke-width="8"/>' +
      '<path d="M262 66C276 58 296 62 302 78L306 152H258Z" fill="url(#' + g.uni + ')"/>' + rHead(280, 44, 'left') +
      // thigh sloping down to the knee, lower leg to the floor
      '<path d="M300 140C250 146 190 160 150 172L156 196C200 184 256 170 304 164Z" fill="' + C.uni2 + '"/>' +
      '<path d="M150 172L144 202H170L170 186Z" fill="' + C.uni2 + '"/>' +
      // supporting arm: upper arm, forearm along the thigh, hand at the jaw
      sleeve(270, 90, 238, 138, 12) + sleeve(238, 140, 176, 158, 12) + cuff(176, 158, 164, 161, 12) + glove(152, 162, 11, 6, -10, g) +
      // baby face down along the forearm, head lower (left)
      '<path d="M246 126C228 124 192 132 172 142C160 148 164 158 176 158C200 156 232 148 248 142C258 138 256 128 246 126Z" fill="' + baby + '" stroke="' + babyLine + '" stroke-width="1.5"/>' +
      '<path d="M248 130C258 130 266 136 268 142M246 140C254 144 260 150 260 156" stroke="' + C.skin + '" stroke-width="7" stroke-linecap="round" fill="none"/>' +
      '<circle cx="160" cy="152" r="16" fill="' + C.skin + '"/><path d="M150 140C156 134 168 136 174 144C166 142 158 142 152 148Z" fill="' + C.hair + '"/>' +
      // heel of the other hand between the shoulder blades
      sleeve(288, 86, 218, 112, 12) + cuff(218, 112, 208, 116, 12) + glove(196, 124, 13, 7, 15, g) + hits(194, 118) +
      pill(76, 44, 'Head lower', { fill: C.red }) + leader(100, 56, 154, 140, true) +
      pill(90, 224, 'Up to 5 back blows');
  };

  S.twofinger = function(g){
    // Baby on their back along the forearm, head lower; two fingers on the lower half of the breastbone.
    return floor() + shadow(180, 140) +
      '<path d="M340 150C290 154 200 162 120 176L118 194C200 186 290 176 342 172Z" fill="' + C.uni2 + '"/>' +
      sleeve(352, 160, 250, 170, 12) + '<path d="M250 170C210 174 170 178 140 182" stroke="' + C.glove + '" stroke-width="10" stroke-linecap="round"/>' +
      // baby on its back, head lower to the left
      '<path d="M150 158C170 146 220 140 260 144C270 146 270 160 262 164C224 170 182 172 156 172C146 170 144 162 150 158Z" fill="#F2E6D8"/>' +
      '<path d="M260 148C274 146 286 150 290 156M262 160C276 162 288 164 292 170" stroke="' + C.skin + '" stroke-width="7" stroke-linecap="round" fill="none"/>' +
      '<circle cx="138" cy="170" r="17" fill="' + C.skin + '"/><path d="M124 176C120 166 126 156 136 154C130 162 128 170 132 180Z" fill="' + C.hair + '"/>' +
      '<path d="M146 162C148 160 152 160 154 162" stroke="' + C.hair + '" stroke-width="1.8" fill="none" stroke-linecap="round"/>' +
      '<path d="M196 150C200 148 214 148 222 150" stroke="' + C.red + '" stroke-width="4" stroke-linecap="round"/>' +
      // two fingers from above
      sleeve(250, 20, 216, 92, 14) + cuff(216, 92, 212, 100, 14) +
      '<path d="M204 100C202 114 202 130 204 146M216 100C216 114 216 130 216 146" stroke="url(#' + g.glove + ')" stroke-width="8" stroke-linecap="round"/>' +
      '<path d="M204 100C202 114 202 130 204 146M216 100C216 114 216 130 216 146" stroke="' + C.gloveLine + '" stroke-width="1" stroke-linecap="round" fill="none" opacity=".5"/>' +
      arrow(182, 70, 182, 128, 5) + pill(290, 52, '2 fingers', { fill: C.red }) + note(210, 226, 'Lower half of breastbone', 'middle') + leader(210, 214, 208, 156, true);
  };
  S.bitewrap = function(g){
    return floor(222) + legH(130) +
      '<circle cx="168" cy="122" r="3.5" fill="' + C.red + '"/><circle cx="182" cy="121" r="3.5" fill="' + C.red + '"/>' +
      // broad bandage over the bite, a few turns
      '<path d="M138 100H212V158H138Z" fill="' + C.band + '" stroke="' + C.bandLine + '" stroke-width="1.6"/>' +
      '<path d="M150 100L140 158M166 100L156 158M182 100L172 158M198 100L188 158M212 104L204 158" stroke="' + C.bandLine + '" stroke-width="1.6"/>' +
      '<path d="M174 108L174 150" stroke="' + C.red + '" stroke-width="0"/>' +
      sleeve(260, 20, 214, 84, 14) + cuff(214, 84, 208, 92, 14) + glove(196, 98, 18, 9, 20, g) +
      arrow(240, 104, 222, 112, 5) +
      pill(180, 36, 'Firm, over the bite first', { fill: C.red }) + pill(180, 200, '10–15 cm bandage');
  };
  S.bandage = function(g){
    // Whole limb from the toes up, overlapping turns, roll at the leading edge.
    var s = floor(222) + legH(130);
    s += '<path d="M70 106C140 104 200 108 214 112C236 114 252 112 266 100C276 88 292 90 294 102C296 118 288 140 270 148C246 156 160 154 70 156Z" fill="' + C.band + '" stroke="' + C.bandLine + '" stroke-width="1.6"/>';
    for (var x = 86; x < 262; x += 18) s += '<path d="M' + x + ' 106L' + (x - 12) + ' 156" stroke="' + C.bandLine + '" stroke-width="1.6"/>';
    s += '<path d="M270 96L286 108M276 90L292 102" stroke="' + C.bandLine + '" stroke-width="1.6"/>' +
      '<ellipse cx="66" cy="131" rx="12" ry="27" fill="' + C.band + '" stroke="' + C.bandLine + '" stroke-width="1.6"/><ellipse cx="66" cy="131" rx="5" ry="11" fill="none" stroke="' + C.bandLine + '" stroke-width="1.6"/>' +
      arrow(250, 70, 90, 70, 6) +
      pill(180, 196, 'Start at the toes, wrap upwards');
    return s;
  };
  S.splint = function(g){
    var s = floor(222) + '<rect x="18" y="160" width="290" height="14" rx="4" fill="' + C.wood + '"/>' + legH(130);
    s += '<path d="M24 106C140 104 200 108 214 112C236 114 252 112 266 100C276 88 292 90 294 102C296 118 288 140 270 148C246 156 160 154 24 156Z" fill="' + C.band + '" stroke="' + C.bandLine + '" stroke-width="1.6"/>';
    for (var x = 40; x < 262; x += 18) s += '<path d="M' + x + ' 106L' + (x - 12) + ' 156" stroke="' + C.bandLine + '" stroke-width="1.6"/>';
    s += '<g fill="' + C.uni + '"><rect x="60" y="100" width="16" height="78" rx="4"/><rect x="150" y="100" width="16" height="78" rx="4"/><rect x="236" y="104" width="16" height="74" rx="4"/></g>' +
      pill(180, 50, 'Splint so joints can’t move') + note(100, 200, 'Splint', 'middle') + leader(100, 190, 100, 176);
    return s;
  };


  /* ---------- more figures ---------- */
  // Casualty sitting on a chair, facing right. o.lean: lean forward (deg-ish).
  function seated(g, x, o){
    o = o || {};
    var lean = o.lean || 0;
    return '<rect x="' + (x - 8) + '" y="150" width="70" height="10" rx="4" fill="' + C.wood + '"/><path d="M' + x + ' 160V202M' + (x + 54) + ' 160V202M' + (x - 6) + ' 150V96" stroke="' + C.wood + '" stroke-width="7" stroke-linecap="round"/>' +
      '<path d="M' + (x + 4) + ' 146C' + (x + 30) + ' 142 ' + (x + 70) + ' 142 ' + (x + 88) + ' 146L' + (x + 90) + ' 160C' + (x + 60) + ' 162 ' + (x + 30) + ' 162 ' + (x + 6) + ' 160Z" fill="' + C.pants + '"/>' +
      '<path d="M' + (x + 82) + ' 150L' + (x + 86) + ' 200" stroke="' + C.pants + '" stroke-width="16" stroke-linecap="round"/>' +
      '<path d="M' + (x + 80) + ' 200h18" stroke="#3B4652" stroke-width="8" stroke-linecap="round"/>' +
      '<path d="M' + (x + 4) + ' 150C' + (x + 2 + lean) + ' 120 ' + (x + 6 + lean) + ' 92 ' + (x + 18 + lean * 1.6) + ' 82C' + (x + 34 + lean * 1.6) + ' 76 ' + (x + 46 + lean * 1.4) + ' 84 ' + (x + 48 + lean) + ' 96L' + (x + 46) + ' 150Z" fill="url(#' + g.shirt + ')"/>' +
      faceR(x + 30 + lean * 1.7, 62 + Math.abs(lean) * 0.4);
  }
  // Casualty head in profile facing right.
  function faceR(cx, cy, o){
    o = o || {};
    return '<path d="M' + (cx - 16) + ' ' + cy + 'C' + (cx - 16) + ' ' + (cy - 12) + ' ' + (cx - 6) + ' ' + (cy - 18) + ' ' + (cx + 4) + ' ' + (cy - 18) + 'C' + (cx + 14) + ' ' + (cy - 18) + ' ' + (cx + 18) + ' ' + (cy - 8) + ' ' + (cx + 18) + ' ' + (cy - 2) + 'L' + (cx + 23) + ' ' + (cy + 4) + 'L' + (cx + 18) + ' ' + (cy + 6) + 'C' + (cx + 18) + ' ' + (cy + 12) + ' ' + (cx + 14) + ' ' + (cy + 18) + ' ' + (cx + 4) + ' ' + (cy + 18) + 'C' + (cx - 8) + ' ' + (cy + 18) + ' ' + (cx - 16) + ' ' + (cy + 10) + ' ' + (cx - 16) + ' ' + cy + 'Z" fill="' + C.skin + '"/>' +
      '<path d="M' + (cx - 16) + ' ' + (cy + 4) + 'C' + (cx - 18) + ' ' + (cy - 12) + ' ' + (cx - 6) + ' ' + (cy - 20) + ' ' + (cx + 6) + ' ' + (cy - 19) + 'C' + (cx + 14) + ' ' + (cy - 18) + ' ' + (cx + 18) + ' ' + (cy - 12) + ' ' + (cx + 17) + ' ' + (cy - 8) + 'C' + (cx + 6) + ' ' + (cy - 12) + ' ' + (cx - 4) + ' ' + (cy - 8) + ' ' + (cx - 8) + ' ' + (cy + 8) + 'Z" fill="' + C.hair + '"/>' +
      '<path d="M' + (cx + 8) + ' ' + (cy - 3) + 'h5" stroke="' + C.hair + '" stroke-width="2" stroke-linecap="round"/>' +
      (o.mouth === false ? '' : '<path d="M' + (cx + 12) + ' ' + (cy + 11) + 'h4" stroke="' + C.skinLine + '" stroke-width="1.8" stroke-linecap="round"/>') +
      '<ellipse cx="' + (cx - 4) + '" cy="' + (cy + 2) + '" rx="3.5" ry="4.5" fill="' + C.skin2 + '"/>';
  }
  // Responder kneeling beside the casualty, leaning over the head (for breathing checks and breaths).
  function leanBody(g){
    return '<path d="M200 140C204 152 206 164 206 174H178C178 164 176 154 172 146Z" fill="' + C.uni2 + '"/>' +
      '<path d="M198 140C186 114 152 94 122 92C108 92 102 102 108 112C124 128 162 142 184 150Z" fill="url(#' + g.uni + ')"/>';
  }
  function leanHead(hx, hy, rot){ return '<g transform="rotate(' + rot + ' ' + hx + ' ' + hy + ')">' + rHead(hx, hy, 'right') + '</g>'; }
  function leanOver(g, hx, hy, rot){ return leanBody(g) + leanHead(hx, hy, rot); }
  // Responder kneeling at the casualty's head (left), leaning over.
  function kneelAtHead(g, lean){
    return '<path d="M20 202L26 150H62L60 202Z" fill="' + C.uni2 + '"/>' +
      '<path d="M22 150C20 120 32 92 58 84C74 80 86 88 88 100L66 150Z" fill="url(#' + g.uni + ')"/>';
  }
  function tentacle(x1, y, x2){ return '<path d="M' + x1 + ' ' + y + 'q12 -10 24 0t24 0t24 0t24 0" transform="translate(' + 0 + ' 0)" stroke="#8B5CF6" stroke-width="4" fill="none" stroke-linecap="round" opacity=".85"/>'; }
  function burnMark(cx, cy){ return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="34" ry="11" fill="#E8735A" opacity=".55"/><ellipse cx="' + cx + '" cy="' + cy + '" rx="20" ry="6" fill="#D84E3A" opacity=".5"/>'; }
  function wound(cx, cy){ return '<path d="M' + (cx - 16) + ' ' + cy + 'q16 -6 32 0" stroke="#B3261E" stroke-width="5" stroke-linecap="round" fill="none"/>'; }

  /* ---------- more scenes ---------- */
  S.shoulders = function(g){
    return floor() + shadow(190, 150) + kneelBehind(g, 110) + supine(g, 0, { ribs: false, mark: false }) +
      '<g transform="translate(-42 0)">' + sleeve(152, 72, 128, 132, 12) + cuff(128, 132, 124, 140, 12) + '</g>' + glove(84, 160, 12, 7, -30, g) +
      sleeve(166, 76, 150, 136, 12) + cuff(150, 136, 146, 144, 12) + glove(140, 152, 12, 7, 20, g) +
      '<path d="M150 104C150 92 160 84 176 84H274C290 84 300 92 300 104C300 116 290 124 274 124H196L182 136L184 124H176C160 124 150 116 150 104Z" fill="#fff" stroke="' + C.ink + '" stroke-width="2.2"/>' +
      '<text x="225" y="110" font-size="15" font-weight="700" fill="' + C.ink + '" text-anchor="middle" font-family="Inter, \'Segoe UI\', system-ui, sans-serif">Can you hear me?</text>' +
      note(100, 226, 'Squeeze both shoulders', 'middle');
  };
  S.breathing = function(g){
    // Cheek over the mouth, eyes on the chest.
    return floor() + shadow(190, 150) + leanBody(g) + supine(g, 0, { ribs: false, mark: false }) + '<path d="M112 100C100 110 92 118 88 124" stroke="' + C.uni + '" stroke-width="14" stroke-linecap="round"/>' + leanHead(84, 130, 35) +
      '<path d="M74 148q4 -5 0 -10M82 150q6 -7 0 -14" stroke="' + C.water + '" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
      '<path d="M98 132C120 132 140 138 152 146" stroke="' + C.ink + '" stroke-width="1.6" stroke-dasharray="3 4" fill="none"/>' +
      carrow(160, 124, 168, 110, 176, 124, 3.5) +
      pill(250, 40, 'Look, listen, feel');
  };

  S.breaths = function(g){
    return floor() + shadow(190, 150) + leanBody(g) + supine(g, 0, { ribs: false, mark: false }) + '<path d="M112 100C100 112 90 122 84 130" stroke="' + C.uni + '" stroke-width="14" stroke-linecap="round"/>' + leanHead(76, 134, 70) +
      sleeve(104, 104, 58, 142, 11) + glove(50, 152, 10, 6, 0, g) +
      carrow(150, 140, 160, 120, 176, 132, 4) +
      pill(240, 40, '2 breaths, 1 second each') + note(170, 226, 'Until the chest rises', 'middle') + leader(170, 216, 162, 156);
  };

  S.aed = function(g){
    // Bare chest from the front: one pad below the right collarbone, one on the left side below the armpit.
    return '<path d="M120 16C128 8 152 6 160 18L162 40H118Z" fill="' + C.skin + '"/>' +
      '<path d="M60 238C56 150 64 70 96 52C112 44 126 42 140 42C154 42 168 44 184 52C216 70 224 150 220 238Z" fill="' + C.skin + '"/>' +
      '<path d="M96 60C112 66 126 68 138 66M184 60C168 66 154 68 142 66" stroke="' + C.skinLine + '" stroke-width="2" fill="none" opacity=".7"/>' +
      '<path d="M140 70V150" stroke="' + C.skinLine + '" stroke-width="2" opacity=".5"/>' +
      '<rect x="78" y="74" width="44" height="34" rx="6" fill="#fff" stroke="' + C.ink + '" stroke-width="2"/><path d="M92 91h16M100 83v16" stroke="' + C.red + '" stroke-width="3"/>' +
      '<rect x="176" y="132" width="40" height="46" rx="6" fill="#fff" stroke="' + C.ink + '" stroke-width="2" transform="rotate(-12 196 155)"/><path d="M188 155h16M196 147v16" stroke="' + C.red + '" stroke-width="3" transform="rotate(-12 196 155)"/>' +
      '<path d="M100 74C100 40 230 30 270 70M198 132C230 110 250 100 276 96" stroke="' + C.ink + '" stroke-width="2" fill="none"/>' +
      '<rect x="262" y="70" width="80" height="96" rx="14" fill="#2BB673"/><rect x="274" y="84" width="56" height="30" rx="5" fill="#E9F7EF"/><path d="M302 124C292 118 290 110 296 108C300 106 302 110 302 112C302 110 304 106 308 108C314 110 312 118 302 124Z" fill="' + C.red + '"/><circle cx="302" cy="148" r="9" fill="#F5C518"/>' +
      note(302, 186, 'AED', 'middle');
  };
  S.layflat = function(g){
    return floor() + shadow(190, 150) + supine(g, 0, { ribs: false, mark: false }) +
      '<g transform="translate(270 40)"><circle cx="34" cy="34" r="32" fill="#fff" stroke="' + C.red + '" stroke-width="5"/><circle cx="34" cy="16" r="6" fill="' + C.bone + '"/><path d="M34 24V46M34 46L26 60M34 46L42 60M24 32H44" stroke="' + C.bone + '" stroke-width="5" stroke-linecap="round"/><path d="M12 12L56 56" stroke="' + C.red + '" stroke-width="5"/></g>' +
      pill(140, 50, 'Lie flat');
  };
  S.still = function(g){
    return floor() + shadow(190, 150) + kneelBehind(g, 104) + supine(g, 0, { ribs: false, mark: false }) +
      '<g transform="translate(-48 0)">' + sleeve(152, 72, 140, 132, 12) + cuff(140, 132, 138, 140, 12) + '</g>' + glove(90, 158, 12, 7, -10, g) +
      '<circle cx="300" cy="186" r="5" fill="' + C.red + '"/><circle cx="312" cy="186" r="5" fill="' + C.red + '"/>' +
      pill(250, 50, 'Keep still') + note(306, 226, 'Bite', 'middle') + leader(306, 216, 306, 194, true);
  };
  S.seizure = function(g){
    return floor() + shadow(190, 150) + supine(g, 30, { ribs: false, mark: false }) +
      '<path d="M40 196C40 188 50 184 70 184C90 184 102 188 102 196Z" fill="#7FB3D5"/>' +
      '<g transform="translate(296 150)"><rect x="0" y="10" width="40" height="40" rx="4" fill="#B98B5E"/><path d="M0 10L20 0L40 10" fill="#C9A27A"/></g>' + arrow(290, 170, 330, 150, 5) +
      '<g transform="translate(6 60)"><rect x="0" y="0" width="34" height="24" rx="3" fill="#94A3B8"/></g>' + arrow(46, 74, 20, 50, 5) +
      pill(190, 40, 'Clear the space') + note(16, 228, 'Something soft under the head') + leader(70, 218, 70, 194);
  };
  S.situp = function(g){
    return floor() + shadow(170, 90) + seated(g, 120) +
      '<path d="M162 96C176 104 186 116 190 128" stroke="#9AA6B3" stroke-width="11" stroke-linecap="round" fill="none"/>' +
      '<path d="M262 202L262 150H292L292 202Z" fill="' + C.uni2 + '"/><path d="M252 150C250 112 260 92 278 88C292 86 302 96 302 110L300 150Z" fill="url(#' + g.uni + ')"/>' + rHead(278, 66, 'left') +
      sleeve(262, 108, 214, 118, 11) + glove(204, 120, 10, 6, 0, g) +
      pill(180, 34, 'Upright, calm');
  };
  S.autoinjector = function(g){
    // Lying down, leg through clothing: injector into the outer thigh.
    return floor() + shadow(180, 160) +
      '<path d="M10 150C60 146 120 146 170 150C190 146 210 150 230 160C260 166 300 168 320 170L322 196C280 198 200 198 150 196C100 196 50 198 10 198Z" fill="' + C.pants + '"/>' +
      '<path d="M318 168C330 160 346 162 348 174C350 186 340 196 322 196Z" fill="#3B4652"/>' +
      '<path d="M170 150C176 158 178 168 176 178" stroke="#3B4652" stroke-width="2" fill="none" opacity=".6"/>' +
      '<rect x="80" y="76" width="20" height="62" rx="6" fill="#F5A524" stroke="' + C.ink + '" stroke-width="2"/><rect x="83" y="134" width="14" height="10" rx="3" fill="#F28C28" stroke="' + C.ink + '" stroke-width="1.5"/>' +
      sleeve(200, 40, 116, 104, 14) + glove(98, 108, 16, 9, 80, g) +
      arrow(54, 84, 76, 126, 5) +
      pill(90, 40, 'Outer thigh', { fill: C.red });
  };

  S.puffer = function(g){
    return floor() + shadow(160, 90) + seated(g, 92) +
      '<path d="M134 96C150 100 164 98 174 92" stroke="#9AA6B3" stroke-width="11" stroke-linecap="round" fill="none"/>' +
      '<rect x="140" y="54" width="86" height="28" rx="14" fill="#E8F1F8" stroke="#7FA7C6" stroke-width="2.4"/>' +
      '<rect x="224" y="40" width="20" height="40" rx="5" fill="#5B8DB8"/><rect x="220" y="76" width="26" height="12" rx="4" fill="#3E6D96"/>' +
      glove(234, 92, 12, 7, 0, g) + sleeve(300, 140, 246, 100, 11) +
      pill(318, 190, '× 4', { fill: C.red, size: 15 }) + pill(180, 224, '1 puff, then 4 breaths');
  };
  S.nose = function(g){
    return floor() + shadow(170, 90) + seated(g, 110, { lean: 16 }) +
      '<path d="M162 100C176 96 180 84 176 72" stroke="#9AA6B3" stroke-width="10" stroke-linecap="round" fill="none"/>' + glove(178, 66, 7, 9, 0, { glove: g.glove }).replace('url(#' + g.glove + ')', C.skin) +
      arrow(98, 50, 120, 70, 4) + pill(70, 40, 'Lean forward') + pill(250, 60, '10 min', { fill: C.red }) + note(250, 92, 'Pinch the soft part', 'middle') + leader(214, 84, 184, 70);
  };
  S.eye = function(g){
    return '<path d="M80 238C80 170 92 110 132 86C150 76 174 76 192 86C230 108 244 170 244 238Z" fill="url(#' + g.shirt + ')"/>' +
      '<g transform="rotate(-24 170 80)">' + faceR(170, 80) + '</g>' +
      '<path d="M190 70C186 66 192 62 196 66" stroke="' + C.ink + '" stroke-width="2" fill="none"/>' +
      '<path d="M240 16H286V30H252V40" stroke="#94A3B8" stroke-width="10" fill="none" stroke-linejoin="round"/>' +
      '<path d="M250 44C246 52 232 58 214 62C206 64 196 66 192 70C190 80 196 96 200 120" stroke="' + C.water + '" stroke-width="6" fill="none" stroke-linecap="round" opacity=".85"/>' +
      pill(90, 40, '15 min', { fill: C.red }) + note(280, 140, 'Hold the eyelids open', 'middle');
  };
  S.fast = function(g){
    // Face from the front: one side of the mouth and eye drooping.
    return '<path d="M120 238C120 190 140 170 180 170C220 170 240 190 240 238Z" fill="url(#' + g.shirt + ')"/>' +
      '<ellipse cx="180" cy="104" rx="54" ry="64" fill="' + C.skin + '"/>' +
      '<path d="M126 92C126 52 152 36 180 36C208 36 234 52 234 92C222 70 204 62 180 62C156 62 138 70 126 92Z" fill="' + C.hair + '"/>' +
      '<path d="M150 96h18" stroke="' + C.ink + '" stroke-width="4" stroke-linecap="round"/><path d="M192 102l18 4" stroke="' + C.ink + '" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M156 136C164 144 176 144 184 140C192 140 198 146 204 152" stroke="#9A4B3C" stroke-width="5" fill="none" stroke-linecap="round"/>' +
      arrow(240, 120, 232, 156, 4) + note(290, 196, 'One side drooping?', 'middle');
  };
  S.arms = function(g){
    return floor() + shadow(180, 70) +
      '<path d="M150 202L152 150H208L210 202Z" fill="' + C.pants + '"/>' +
      '<path d="M150 150C148 110 156 84 180 80C204 84 212 110 210 150Z" fill="url(#' + g.shirt + ')"/>' +
      '<g transform="translate(180 58)">' + '<ellipse cx="0" cy="0" rx="18" ry="22" fill="' + C.skin + '"/><path d="M-18 -4C-18 -18 -8 -24 0 -24C8 -24 18 -18 18 -4C12 -12 6 -14 0 -14C-6 -14 -12 -12 -18 -4Z" fill="' + C.hair + '"/>' + '</g>' +
      '<path d="M156 92L80 92" stroke="#9AA6B3" stroke-width="12" stroke-linecap="round"/><ellipse cx="72" cy="92" rx="9" ry="7" fill="' + C.skin + '"/>' +
      '<path d="M204 92L276 118" stroke="#9AA6B3" stroke-width="12" stroke-linecap="round"/><ellipse cx="284" cy="121" rx="9" ry="7" fill="' + C.skin + '"/>' +
            arrow(304, 88, 304, 132, 4) + note(180, 228, 'One arm drifts down?', 'middle');
  };
  S.speech = function(g){
    return '<path d="M30 238C30 180 52 150 90 146C128 150 150 180 150 238Z" fill="url(#' + g.shirt + ')"/>' + faceR(92, 110) +
      '<path d="M140 70C140 52 154 42 176 42H300C322 42 336 52 336 70V110C336 128 322 138 300 138H190L168 156L172 138C152 136 140 126 140 110Z" fill="#fff" stroke="' + C.ink + '" stroke-width="2.2"/>' +
      '<path d="M162 92C176 76 186 108 200 90S222 74 236 94S258 108 272 88S296 80 312 94" stroke="' + C.red + '" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      note(238, 188, 'Slurred or confused?', 'middle');
  };
  S.pressure = function(g){
    return floor(222) + armH(140) + wound(160, 134) +
      '<rect x="128" y="112" width="66" height="22" rx="5" fill="#fff" stroke="' + C.bandLine + '" stroke-width="1.6"/>' +
      sleeve(120, 20, 150, 92, 16) + sleeve(230, 20, 186, 92, 16) +
      glove(158, 104, 22, 10, -8, g) + glove(176, 98, 22, 10, 8, g) +
      arrow(250, 60, 250, 110, 6) + pill(270, 36, 'Press hard', { fill: C.red });
  };
  S.embedded = function(g){
    return floor(222) + armH(150) +
      '<path d="M178 140L196 60" stroke="#8A6A4A" stroke-width="7" stroke-linecap="round"/>' +
      '<rect x="134" y="120" width="34" height="26" rx="6" fill="#fff" stroke="' + C.bandLine + '" stroke-width="1.6"/><rect x="198" y="122" width="34" height="26" rx="6" fill="#fff" stroke="' + C.bandLine + '" stroke-width="1.6"/>' +
      sleeve(90, 30, 140, 100, 14) + glove(150, 110, 18, 9, 30, g) + sleeve(290, 30, 226, 100, 14) + glove(216, 112, 18, 9, -30, g) +
      arrow(150, 64, 150, 96, 4) + arrow(216, 64, 216, 98, 4) +
      pill(270, 190, 'Leave it in', { fill: C.red }) + note(100, 200, 'Pads on each side', 'middle');
  };
  S.tourniquet = function(g){
    // Above the wound (about 5 cm if there are no instructions); write down the time.
    return floor(222) + armH(140) + wound(262, 136) +
      '<rect x="206" y="114" width="26" height="50" rx="5" fill="#1F2937"/><rect x="212" y="98" width="14" height="18" rx="3" fill="#4B5563"/><path d="M219 98V84" stroke="#4B5563" stroke-width="6" stroke-linecap="round"/>' +
      '<g stroke="' + C.ink + '" stroke-width="2" stroke-linecap="round"><path d="M232 176H262M232 171V181M262 171V181"/></g>' + note(247, 196, '5 cm', 'middle') +
      '<rect x="40" y="64" width="64" height="22" rx="5" fill="#fff" stroke="' + C.ink + '" stroke-width="1.5"/><text x="72" y="80" font-size="12" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-weight="700" fill="' + C.ink + '">12:05</text>' +
      pill(220, 40, 'Note the time', { fill: C.red }) + note(120, 228, 'Above the wound', 'middle');
  };

  S.tap = function(g, lab){
    return '<rect x="0" y="210" width="360" height="30" fill="' + C.floor + '"/>' +
      '<path d="M120 20H236V40H200V58H176V40H120Z" fill="#94A3B8"/><rect x="176" y="56" width="24" height="10" rx="2" fill="#64748B"/>' +
      '<path d="M186 66C184 92 184 112 188 132M192 66C192 92 194 112 196 132" stroke="' + C.water + '" stroke-width="10" stroke-linecap="round" opacity=".75"/>' +
      armH(150) + burnMark(192, 140) +
      '<path d="M160 160q8 10 0 20M210 162q8 10 0 20" stroke="' + C.water + '" stroke-width="4" fill="none" stroke-linecap="round" opacity=".7"/>' +
      pill(290, 40, lab || '20 min', { fill: C.red, size: 15 });
  };
  S.ring = function(g){
    return '<path d="M110 238C110 200 120 170 140 150C160 132 200 130 220 150C240 170 246 200 246 238Z" fill="' + C.skin + '"/>' +
      '<g fill="' + C.skin + '"><rect x="132" y="60" width="22" height="100" rx="11"/><rect x="158" y="44" width="22" height="110" rx="11"/><rect x="184" y="52" width="22" height="104" rx="11"/><rect x="210" y="72" width="20" height="90" rx="10"/></g>' +
      '<path d="M108 170C96 150 96 130 104 118" stroke="' + C.skin + '" stroke-width="22" stroke-linecap="round"/>' +
      '<rect x="182" y="96" width="26" height="10" rx="4" fill="#E2B33C" stroke="#A57F1C" stroke-width="1.5" transform="translate(0 -26)"/>' +
      arrow(196, 64, 196, 22, 5) + burnMark(176, 200);
  };
  S.cling = function(g){
    return floor(222) + armH(140) + burnMark(170, 136) +
      '<path d="M100 104C150 98 210 98 250 104L252 164C210 170 150 170 102 164Z" fill="#9CC9E8" fill-opacity=".28" stroke="' + C.water + '" stroke-width="2.4" stroke-dasharray="7 5"/>' +
      arrow(176, 40, 176, 90, 5) + pill(176, 200, 'Lay on loosely');
  };
  S.coldpack = function(g, lab){
    return floor(222) + armH(140) +
      '<rect x="140" y="100" width="80" height="44" rx="10" fill="#8FC6E8" stroke="#4A8DB7" stroke-width="2"/><path d="M180 108v28M168 114l24 16M192 114l-24 16" stroke="#fff" stroke-width="3" stroke-linecap="round"/>' +
      pill(180, 40, lab || 'Cold pack');
  };
  S.hotwater = function(g){
    return '<rect x="0" y="206" width="360" height="34" fill="' + C.floor + '"/>' +
      '<path d="M70 120H290L272 204H88Z" fill="#E2E8F0" stroke="#94A3B8" stroke-width="3"/><path d="M76 140H284L272 200H88Z" fill="' + C.water + '" opacity=".55"/>' +
      '<path d="M10 92C90 94 150 104 196 128C212 136 220 152 214 164C200 172 176 170 150 160C110 146 60 132 10 128Z" fill="' + C.skin + '"/>' +
      '<path d="M120 100q-8 -14 0 -28M150 104q-8 -14 0 -28M180 112q-8 -14 0 -28" stroke="#E8735A" stroke-width="3.5" fill="none" stroke-linecap="round"/>' +
      pill(270, 40, 'About 45°C', { fill: C.red });
  };
  S.vinegar = function(g){
    return floor(222) + armH(150) + '<g transform="translate(110 148)">' + tentacle(0, 0, 0) + '</g>' +
      '<g transform="rotate(-50 110 60)"><rect x="80" y="30" width="56" height="90" rx="12" fill="#F3F0E6" stroke="' + C.ink + '" stroke-width="2"/><rect x="96" y="14" width="24" height="20" rx="4" fill="#E2DCC8" stroke="' + C.ink + '" stroke-width="2"/><text x="108" y="84" font-size="11" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-weight="700" fill="' + C.ink + '">VINEGAR</text></g>' +
      '<path d="M150 50C160 80 166 110 166 136" stroke="#C9B26A" stroke-width="6" fill="none" stroke-linecap="round" opacity=".8"/>' +
      pill(270, 40, '30 seconds of vinegar', { fill: C.red });
  };
  S.seawater = function(g){
    return floor(222) + armH(150) + '<g transform="translate(130 148)">' + tentacle(0, 0, 0) + '</g>' +
      sleeve(290, 30, 230, 100, 13) + glove(222, 112, 10, 6, 40, g) + arrow(236, 122, 280, 92, 4) +
      '<path d="M60 40C70 64 80 100 120 134" stroke="' + C.water + '" stroke-width="7" fill="none" stroke-linecap="round" opacity=".7"/><path d="M30 20H90L82 44H38Z" fill="#94A3B8"/>' +
      pill(170, 40, 'Sea water only');
  };
  S.beach = function(g){
    return '<rect x="0" y="0" width="360" height="240" rx="18" fill="#EAF4FA"/><path d="M0 150C40 140 80 160 120 150S200 140 220 150V240H0Z" fill="' + C.water + '" opacity=".7"/><path d="M200 168C240 158 300 156 360 160V240H200Z" fill="#E8D7A8"/>' +
      '<path d="M268 170L272 120H296L298 170" fill="' + C.uni2 + '"/><path d="M262 120C260 92 270 76 284 74C298 76 306 92 304 120Z" fill="url(#' + g.uni + ')"/>' + rHead(284, 54, 'left') +
      '<path d="M232 176L238 132H256L258 176" fill="' + C.pants + '"/><path d="M228 134C226 108 234 94 246 92C258 94 264 108 262 134Z" fill="url(#' + g.shirt + ')"/>' + faceR(246, 74) +
      sleeve(272, 96, 256, 112, 10) + arrow(150, 120, 214, 120, 6) + pill(110, 40, 'Out of the water');
  };
  S.stopdrop = function(g){
    return floor() + shadow(180, 120) + supine(g, 20, { ribs: false, mark: false, arm: false }) +
      '<path d="M140 140q10 -20 0 -40q20 18 12 40M190 138q8 -16 0 -32q18 14 10 32" fill="#F59E0B" opacity=".75"/>' +
      carrow(150, 90, 200, 50, 250, 90, 5) + pill(180, 30, 'Stop, drop, cover, roll');
  };
  S.blanket = function(g){
    return floor() + shadow(190, 150) + supine(g, 0, { ribs: false, mark: false, arm: false }) +
      '<path d="M100 172C140 150 260 150 340 168L340 200H100Z" fill="#6E9F6A"/><path d="M110 176C150 160 250 160 330 174" stroke="#557F52" stroke-width="2" fill="none"/>' +
      note(220, 120, 'Keep the rest of them warm', 'middle');
  };
  S.shade = function(g){
    return floor() + '<circle cx="50" cy="44" r="20" fill="#F5C518"/><path d="M50 12v-8M50 84v-8M18 44h-8M90 44h-8M28 22l-6-6M78 72l6 6M28 66l-6 6M78 16l6-6" stroke="#F5C518" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M318 202V100" stroke="#8A6A4A" stroke-width="16"/><ellipse cx="270" cy="84" rx="94" ry="54" fill="#7FB069"/><ellipse cx="262" cy="204" rx="96" ry="6" fill="#557F52" opacity=".25"/>' +
      '<g transform="translate(150 94) scale(.55)">' + supine(g, 0, { ribs: false, mark: false }) + '</g>' +
      arrow(96, 170, 152, 170, 5);
  };

  S.coolwater = function(g){
    return '<rect x="0" y="206" width="360" height="34" fill="' + C.floor + '"/>' +
      '<path d="M40 110H320C320 170 290 204 250 204H110C70 204 40 170 40 110Z" fill="#E2E8F0" stroke="#94A3B8" stroke-width="3"/>' +
      '<g transform="translate(70 70)">' + faceR(14, 40, { mouth: true }) + '</g>' +
      '<path d="M50 118H310C306 160 284 196 250 196H110C76 196 54 160 50 118Z" fill="' + C.water + '" opacity=".6"/>' +
      pill(270, 40, '15 min', { fill: C.red }) + note(180, 230, 'Cold water up to the neck', 'middle');
  };
  S.icepacks = function(g){
    var ice = function(x, y){ return '<rect x="' + x + '" y="' + y + '" width="22" height="16" rx="4" fill="#8FC6E8" stroke="#4A8DB7" stroke-width="1.5"/>'; };
    return floor() + shadow(190, 150) + supine(g, 0, { ribs: false, mark: false }) + ice(86, 162) + ice(196, 178) + ice(226, 172) + ice(340, 168) +
      '<path d="M120 100q-6 10 0 20M136 96q-6 12 0 24M152 100q-6 10 0 20" stroke="' + C.water + '" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      pill(250, 40, 'Wet, ice, fan');
  };

  var KEYS = Object.keys(S);
  function svg(spec){
    var key = Array.isArray(spec) ? spec[0] : spec;
    var f = S[key];
    if (!f) return '';
    return wrap(f(ids(), Array.isArray(spec) ? spec[1] : null), ids.last = null || ids());
  }
  // wrap() needs the same ids the scene used, so build in one pass.
  svg = function(spec){
    var key = Array.isArray(spec) ? spec[0] : spec;
    var f = S[key]; if (!f) return '';
    var g = ids();
    return wrap(f(g, Array.isArray(spec) ? spec[1] : null), g);
  };
  return { svg: svg, keys: KEYS, colours: C };
})();

/* Steps use the house-style scene when there is one. Topic symbols on the home
   screen (step "icon") stay as the small drawings from art.js. Registered last,
   so it wins over art.js and over any Commons diagram for the same key. */
if (typeof Illustrate !== 'undefined') Illustrate.use(function(s){ return s.step === 'icon' ? '' : ART2.svg(s.spec); });
