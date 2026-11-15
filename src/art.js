/* Illustration set, version 2. Awaiting clinical review. Not approved.
   Same keys and the same words as the previous pictograms (tools/art-previous.js).
   What changed is the drawing: one stroke weight, the person in clay, the helper
   in teal, a red ring on the contact, and a red arrow for the direction.
   Poses for the steps a reviewer has already been asked about:
   - compress: arms straight, shoulders over the hands, heel of the hand on the
     lower half of the breastbone, arrow straight down.
   - handpos: same spot, shown from the front.
   - airway: one hand on the forehead, fingertips under the chin, head tilted back.
   - recovery: on the side, top leg bent at hip and knee, top hand under the cheek,
     head tilted back.
   - backblows: heel of the hand between the shoulder blades, person leaning forward.
   - infant: face down along the forearm, head lower than the body, jaw supported.
   - bandage: overlapping turns from the toes upward. This is not a tourniquet.
   - bitewrap: firm bandage over the bite first, before the rest of the limb.
   Labels are the same strings the previous file drew. */
var ART = (function(){
  function T(x, y, s, txt, cls, anchor){
    return '<text class="' + (cls || 'tx') + '" x="' + x + '" y="' + y + '" font-size="' + s + '" text-anchor="' + (anchor || 'middle') + '">' + txt + '</text>';
  }
  function n(v){ return Math.round(v * 10) / 10; }
  function arrow(x1, y1, x2, y2){
    var dx = x2 - x1, dy = y2 - y1, L = Math.sqrt(dx * dx + dy * dy) || 1;
    var ux = dx / L, uy = dy / L;
    var bx = x2 - ux * 13, by = y2 - uy * 13, px = -uy * 7, py = ux * 7;
    return '<path class="ar" d="M' + n(x1) + ' ' + n(y1) + 'L' + n(bx) + ' ' + n(by) + '"/>' +
      '<path class="arf" d="M' + n(x2) + ' ' + n(y2) + 'L' + n(bx + px) + ' ' + n(by + py) + 'L' + n(bx - px) + ' ' + n(by - py) + 'Z"/>';
  }
  function ring(x, y, r){
    return '<circle class="ar" cx="' + x + '" cy="' + y + '" r="' + (r || 12) + '"/>';
  }
  /* Person on their back, head to the left. Chest runs from about x=70 to x=140.
     The lower half of that chest is around x=118. */
  function supine(y){
    y = y || 108;
    return '<circle class="sk" cx="40" cy="' + (y - 8) + '" r="16"/>' +
      '<path class="sk" d="M52 ' + (y - 14) + 'l10 2 -2 8z"/>' +
      '<path class="ptl" stroke-width="16" d="M56 ' + y + 'H146"/>' +
      '<path class="ptl" stroke-width="9" d="M146 ' + (y + 2) + 'H220"/>';
  }
  /* Helper kneeling, shoulders directly over straight arms, hands at (x, y). */
  function overHands(x, y){
    return '<circle class="sk" cx="' + x + '" cy="' + (y - 58) + '" r="12"/>' +
      '<path class="rsl" stroke-width="9" d="M' + (x - 10) + ' ' + (y - 46) + 'L' + x + ' ' + (y - 34) + 'L' + (x + 10) + ' ' + (y - 46) + '"/>' +
      '<path class="rsl" stroke-width="8" d="M' + x + ' ' + (y - 34) + 'V' + (y - 6) + '"/>' +
      '<ellipse class="sk" cx="' + x + '" cy="' + y + '" rx="16" ry="7"/>';
  }
  function limb(y){
    return '<path class="skl" stroke-width="18" d="M28 ' + y + 'H200"/>' +
      '<circle class="sk" cx="206" cy="' + y + '" r="14"/>';
  }

  var A = {
    phone: function(l){ l = l || '000';
      return '<rect class="ink" x="86" y="16" width="68" height="124" rx="14"/>' +
        '<rect class="wh" x="94" y="30" width="52" height="90" rx="6"/>' +
        T(120, 82, l.length > 4 ? 13 : 26, l, 'txa') +
        '<path class="ar" d="M166 50c12 12 12 26 0 38M180 38c20 20 20 48 0 68"/>';
    },
    danger: function(){
      return '<path class="arf" d="M120 18L206 150H34Z"/>' +
        '<rect class="wh" x="112" y="62" width="16" height="48" rx="8"/>' +
        '<circle class="wh" cx="120" cy="128" r="8"/>';
    },
    shoulders: function(){
      return supine(112) +
        '<circle class="sk" cx="118" cy="36" r="12"/>' +
        '<path class="rsl" stroke-width="8" d="M118 48L78 96M118 48L96 100"/>' +
        '<ellipse class="sk" cx="74" cy="100" rx="10" ry="6"/>' +
        '<ellipse class="sk" cx="98" cy="104" rx="10" ry="6"/>' +
        '<rect class="bub" x="138" y="16" width="96" height="32" rx="10"/>' +
        T(186, 37, 12, 'Can you hear me?');
    },
    airway: function(){
      /* Profile. Palm on the forehead, fingertips under the chin, head tilted back. */
      return '<circle class="sk" cx="120" cy="88" r="32"/>' +
        '<path class="sk" d="M138 104c12 10 24 6 28-4"/>' +
        '<path class="rsl" stroke-width="8" d="M46 42L90 58"/>' +
        '<ellipse class="sk" cx="104" cy="54" rx="18" ry="8" transform="rotate(-16 104 54)"/>' +
        '<path class="rsl" stroke-width="7" d="M188 128L152 110"/>' +
        '<ellipse class="sk" cx="144" cy="112" rx="11" ry="5" transform="rotate(18 144 112)"/>' +
        arrow(62, 128, 108, 108) +
        T(188, 36, 14, 'Tilt head back');
    },
    breathing: function(){
      return supine(116) +
        '<circle class="sk" cx="78" cy="62" r="12"/>' +
        '<path class="rsl" stroke-width="9" d="M78 74L96 100"/>' +
        '<path class="ar" d="M28 78c-8-10 0-20 0-28M40 84c-10-12 0-24 0-34"/>' +
        T(168, 36, 15, 'Look, listen, feel');
    },
    compress: function(){
      /* Straight arms, shoulders over the hands, heel of the hand on the lower
         half of the breastbone. The arrow is straight down. */
      return supine(118) + overHands(118, 108) + ring(118, 108, 14) +
        arrow(156, 28, 132, 96) +
        T(186, 32, 18, '100–120', 'txa') + T(186, 50, 13, 'a minute');
    },
    breaths: function(){
      return supine(118) +
        '<circle class="sk" cx="70" cy="70" r="12"/>' +
        '<path class="rsl" stroke-width="9" d="M78 80L96 104"/>' +
        arrow(96, 104, 70, 100) +
        T(168, 36, 14, '2 breaths, 1 second each');
    },
    aed: function(){
      return supine(118) +
        '<rect class="pad" x="96" y="100" width="18" height="22" rx="4"/>' +
        '<rect class="pad" x="132" y="108" width="18" height="22" rx="4"/>' +
        '<path class="ln" d="M105 100C100 70 168 78 188 58M141 108C150 86 180 90 200 74"/>' +
        '<rect class="arf" x="168" y="22" width="58" height="46" rx="8"/>' +
        '<path class="wh" d="M198 30l-12 16h10l-6 14 16-18h-10l6-12z"/>';
    },
    aedbox: function(){
      return '<rect class="arf" x="62" y="28" width="116" height="100" rx="16"/>' +
        '<path class="wh" d="M120 108c-36-22-34-48-16-48 8 0 14 8 16 12 2-4 8-12 16-12 18 0 20 26 16 48-12 8-22 8-32 0z"/>' +
        T(120, 154, 22, 'AED');
    },
    recovery: function(){
      /* On the side: lower leg straight, top leg bent at the hip and the knee,
         top hand under the cheek, head tilted back. */
      return '<circle class="sk" cx="46" cy="86" r="16"/>' +
        '<path class="sk" d="M58 74l14 2 -4 8z"/>' +
        '<ellipse class="sk" cx="40" cy="98" rx="11" ry="5"/>' +
        '<path class="skl" stroke-width="6" d="M70 90L44 98"/>' +
        '<path class="ptl" stroke-width="16" d="M62 96H148"/>' +
        '<path class="ptl" stroke-width="9" d="M148 102H214"/>' +
        '<path class="ptl" stroke-width="9" d="M132 88L170 58L206 96"/>' +
        '<circle class="sk" cx="206" cy="100" r="7"/>' +
        T(150, 32, 13, 'On their side, head tilted back');
    },
    backblows: function(){
      /* Leaning forward. Heel of the hand between the shoulder blades. */
      return '<circle class="sk" cx="62" cy="112" r="14"/>' +
        '<path class="ptl" stroke-width="16" d="M76 104L150 70"/>' +
        '<path class="ptl" stroke-width="9" d="M150 78V132M162 78V132"/>' +
        '<circle class="sk" cx="196" cy="36" r="12"/>' +
        '<path class="rsl" stroke-width="9" d="M196 48V108"/>' +
        '<path class="rsl" stroke-width="7" d="M188 108V140M204 108V140"/>' +
        '<path class="skl" stroke-width="7" d="M184 62L112 96"/>' +
        '<ellipse class="sk" cx="104" cy="100" rx="12" ry="6" transform="rotate(28 104 100)"/>' +
        ring(100, 98, 11) + arrow(86, 72, 98, 90) +
        T(48, 36, 18, 'Up to 5', 'txa');
    },
    handpos: function(){
      return '<circle class="sk" cx="120" cy="22" r="14"/>' +
        '<path class="ptl" stroke-width="36" d="M120 40V124"/>' +
        '<path class="ln" d="M120 48V118" opacity=".35"/>' +
        '<ellipse class="sk" cx="120" cy="102" rx="20" ry="10"/>' +
        '<ellipse class="skd" cx="120" cy="99" rx="12" ry="6"/>' +
        ring(120, 102, 16) + arrow(196, 102, 148, 102) +
        T(120, 152, 13, 'Lower half of breastbone');
    },
    repeat55: function(){
      return '<circle class="cl" cx="70" cy="78" r="46"/><circle class="cl" cx="170" cy="78" r="46"/>' +
        T(70, 78, 32, '5', 'txa') + T(70, 98, 11, 'back blows') +
        T(170, 78, 32, '5', 'txa') + T(170, 98, 11, 'chest thrusts') +
        arrow(108, 40, 132, 40) + arrow(132, 118, 108, 118);
    },
    infant: function(){
      /* Baby face down on the forearm, head lower than the chest, jaw supported.
         The other hand strikes the upper back. */
      return '<circle class="sk" cx="200" cy="28" r="11"/>' +
        '<path class="rsl" stroke-width="10" d="M198 40V92"/>' +
        '<path class="rsl" stroke-width="16" d="M196 96L70 118"/>' +
        '<path class="rsl" stroke-width="12" d="M66 118V150"/>' +
        '<path class="ptl" stroke-width="12" d="M168 86L108 102"/>' +
        '<circle class="sk" cx="96" cy="108" r="11"/>' +
        '<path class="skl" stroke-width="6" d="M188 58L150 78"/>' +
        '<ellipse class="sk" cx="146" cy="82" rx="8" ry="4"/>' +
        '<path class="skl" stroke-width="6" d="M168 48L124 74"/>' +
        '<ellipse class="sk" cx="118" cy="78" rx="10" ry="5" transform="rotate(-16 118 78)"/>' +
        ring(130, 80, 10) + arrow(112, 58, 124, 74) +
        T(52, 40, 15, 'Head lower');
    },
    twofinger: function(){
      return '<circle class="sk" cx="56" cy="112" r="12"/>' +
        '<path class="ptl" stroke-width="14" d="M70 116H150"/>' +
        '<path class="skl" stroke-width="5" d="M116 36V102M132 34V102"/>' +
        ring(124, 108, 13) + arrow(100, 24, 118, 70) +
        T(190, 56, 16, '2 fingers');
    },
    pressure: function(){
      return limb(108) +
        '<path class="arf" d="M108 124c-4 8 0 12 0 12s4-4 0-12z"/>' +
        '<ellipse class="sk" cx="112" cy="96" rx="22" ry="10"/>' +
        '<path class="skl" stroke-width="6" d="M100 86V46M124 86V44"/>' +
        ring(112, 104, 14) + arrow(150, 28, 124, 78) +
        T(176, 28, 15, 'Press hard');
    },
    embedded: function(){
      return limb(110) +
        '<path class="ln" stroke-width="6" d="M124 104L140 40"/>' +
        '<rect class="pad" x="78" y="90" width="28" height="32" rx="5"/>' +
        '<rect class="pad" x="148" y="90" width="28" height="32" rx="5"/>' +
        arrow(92, 48, 92, 82) + arrow(162, 48, 162, 82) +
        T(120, 28, 15, 'Leave it in');
    },
    tourniquet: function(){
      return limb(108) +
        '<circle class="arf" cx="150" cy="108" r="6"/>' +
        '<rect class="ink" x="96" y="86" width="16" height="44" rx="4"/>' +
        '<path class="ln" stroke-width="5" d="M90 80L118 72"/>' +
        '<circle class="bub" cx="196" cy="40" r="18"/>' +
        '<path class="ln" d="M196 40V28M196 40l8 6"/>' +
        T(150, 36, 14, 'Note the time', 'tx', 'end');
    },
    nose: function(){
      return '<circle class="sk" cx="108" cy="78" r="36"/>' +
        '<path class="sk" d="M138 70l16 10 -14 6z"/>' +
        '<path class="ptl" stroke-width="16" d="M96 112L78 152"/>' +
        '<ellipse class="skd" cx="128" cy="86" rx="8" ry="12"/>' +
        '<path class="skl" stroke-width="6" d="M150 96L176 70"/>' +
        arrow(70, 36, 96, 58) +
        T(196, 48, 16, '10 min', 'txa');
    },
    layflat: function(){
      return supine(118) +
        '<circle class="sk" cx="196" cy="40" r="10"/>' +
        '<path class="ptl" stroke-width="8" d="M196 50V78M196 78l-8 16M196 78l8 16"/>' +
        '<circle class="ar" cx="196" cy="64" r="24"/>' +
        '<path class="ar" d="M180 80L212 48"/>' +
        T(70, 40, 16, 'Lie flat');
    },
    autoinjector: function(){
      return '<path class="ptl" stroke-width="28" d="M24 112H168"/>' +
        '<path class="ptl" stroke-width="22" d="M168 112V152"/>' +
        '<rect class="pen" x="108" y="28" width="20" height="58" rx="8"/>' +
        '<rect class="arf" x="112" y="82" width="12" height="12" rx="2"/>' +
        ring(118, 96, 14) + arrow(78, 48, 100, 80) +
        T(190, 48, 15, 'Outer thigh');
    },
    puffer: function(){
      return '<rect class="sp" x="36" y="78" width="120" height="36" rx="18"/>' +
        '<rect class="sp" x="16" y="86" width="24" height="20" rx="4"/>' +
        '<rect class="calmf" x="164" y="36" width="22" height="52" rx="6"/>' +
        '<path class="ln" stroke-width="4" d="M154 92H186V118H156"/>' +
        T(96, 40, 14, '1 puff, then 4 breaths') +
        T(120, 150, 24, '× 4', 'txa');
    },
    timer: function(l){
      return '<circle class="bub" cx="120" cy="74" r="48"/>' +
        '<rect class="ink" x="112" y="14" width="16" height="14" rx="3"/>' +
        '<path class="ln" stroke-width="5" d="M120 74V46M120 74L142 88"/>' +
        T(120, 150, 16, l || '', 'txa');
    },
    still: function(){
      return '<path class="ptl" stroke-width="10" d="M70 120L86 70M150 120L134 70"/>' +
        '<circle class="sk" cx="110" cy="52" r="14"/>' +
        '<path class="ptl" stroke-width="12" d="M110 66V100"/>' +
        '<circle class="ar" cx="120" cy="88" r="52"/>' +
        '<path class="ar" stroke-width="7" d="M84 124L156 52"/>' +
        T(120, 154, 16, 'Keep still');
    },
    bitewrap: function(){
      return limb(104) +
        '<circle class="arf" cx="118" cy="100" r="3.5"/>' +
        '<circle class="arf" cx="132" cy="100" r="3.5"/>' +
        '<rect class="band" x="100" y="82" width="52" height="44" rx="8"/>' +
        '<path class="bandl" d="M114 82l-8 44M128 82l-8 44M142 82l-8 44"/>' +
        ring(124, 104, 16) +
        T(120, 36, 14, 'Firm, over the bite first');
    },
    bandage: function(){
      /* Overlapping turns from the toes (left) up the limb. The roll is at the
         leading edge, on the right. Not a tourniquet. */
      var s = '<path class="skl" stroke-width="16" d="M36 104H186"/>' +
        '<ellipse class="sk" cx="28" cy="108" rx="10" ry="16"/>' +
        '<path class="band" d="M48 86H150L176 70L196 96L168 122H48Z"/>' +
        '<path class="bandl" d="';
      var x;
      for (x = 64; x < 160; x += 16) s += 'M' + x + ' 86l-10 36';
      s += '"/>' +
        '<ellipse class="band" cx="176" cy="96" rx="14" ry="18"/>' +
        arrow(78, 48, 156, 48) +
        T(120, 150, 14, 'Start at the toes, wrap upwards');
      return s;
    },
    splint: function(){
      return '<rect class="board" x="24" y="118" width="180" height="12" rx="3"/>' +
        '<path class="skl" stroke-width="16" d="M30 100H190"/>' +
        '<circle class="sk" cx="200" cy="96" r="12"/>' +
        '<rect class="band" x="40" y="84" width="22" height="40" rx="4"/>' +
        '<rect class="band" x="108" y="84" width="22" height="40" rx="4"/>' +
        '<rect class="band" x="164" y="84" width="22" height="40" rx="4"/>' +
        T(120, 48, 14, 'Splint so joints can’t move');
    },
    beach: function(){
      return '<path class="wt" d="M0 108c16-12 32-12 48 0s32 12 48 0V160H0Z"/>' +
        '<path class="sand" d="M96 128H240V160H96Z"/>' +
        '<circle class="sk" cx="168" cy="78" r="12"/>' +
        '<path class="ptl" stroke-width="10" d="M168 90V118M168 118l-10 16M168 118l10 16"/>' +
        arrow(70, 70, 140, 86) +
        T(64, 40, 14, 'Out of the water');
    },
    vinegar: function(){
      return limb(120) +
        '<path class="sting" d="M70 120c8-8 16 0 24 0s16 8 24 0 16 8 24 0"/>' +
        '<g transform="rotate(-40 78 60)"><rect class="bottle" x="58" y="24" width="36" height="64" rx="8"/><rect class="bottle" x="68" y="10" width="16" height="16" rx="3"/></g>' +
        '<path class="wtl" stroke-width="4" d="M108 70C114 96 112 110 110 116"/>' +
        T(186, 40, 16, '30 seconds', 'txa') + T(186, 58, 13, 'of vinegar');
    },
    seawater: function(){
      return limb(122) +
        '<path class="sting" d="M60 122c10-8 18 0 28 0s18 8 28 0"/>' +
        '<path class="wtl" d="M150 70c-6 10 0 16 0 16M166 78c-6 10 0 16 0 16M182 66c-6 10 0 16 0 16"/>' +
        '<path class="skl" stroke-width="6" d="M176 28L140 78"/>' +
        '<ellipse class="sk" cx="136" cy="84" rx="10" ry="5"/>' +
        T(70, 40, 15, 'Sea water only');
    },
    coldpack: function(l){
      return limb(112) +
        '<rect class="ice" x="96" y="86" width="64" height="40" rx="10"/>' +
        '<path class="wh-l" d="M128 96V116M116 100L140 112M140 100L116 112"/>' +
        T(120, 44, 16, l || 'Cold pack');
    },
    hotwater: function(){
      return '<path class="bub" d="M36 96H196c-4 48-36 52-76 52S40 144 36 96Z"/>' +
        '<path class="wt" opacity=".55" d="M48 106H184c-6 36-28 40-68 40s-62-4-68-40Z"/>' +
        '<path class="skl" stroke-width="14" d="M214 36L150 108"/>' +
        '<path class="ar" d="M70 78c-6-8 0-16 0-24M96 78c-6-8 0-16 0-24"/>' +
        T(24, 36, 15, 'About 45°C', 'txa', 'start');
    },
    spider: function(){
      return '<circle class="ink" cx="120" cy="78" r="16"/>' +
        '<ellipse class="ink" cx="120" cy="108" rx="18" ry="22"/>' +
        '<path class="ln" stroke-width="3" d="M108 70L72 40M132 70L168 40M104 84L60 78M136 84L180 78M104 100L64 112M136 100L176 112M110 118L80 146M130 118L160 146"/>';
    },
    nobandage: function(){
      return '<path class="band" d="M120 130H214V100H120Z"/>' +
        '<circle class="band" cx="112" cy="88" r="36"/>' +
        '<circle class="ar" cx="120" cy="90" r="58"/>' +
        '<path class="ar" stroke-width="7" d="M80 130L160 50"/>';
    },
    hospital: function(){
      return '<path class="bub" d="M48 56H192V140H48Z"/>' +
        '<path class="ln" d="M40 56L120 18L200 56"/>' +
        '<path class="arf" d="M108 70h24v16h16v24h-16v16h-24v-16H92V86h16Z"/>';
    },
    chestpain: function(){
      return '<circle class="sk" cx="120" cy="28" r="14"/>' +
        '<path class="ptl" stroke-width="34" d="M120 46V130"/>' +
        '<path class="skl" stroke-width="8" d="M150 70L168 110"/>' +
        '<ellipse class="sk" cx="146" cy="68" rx="14" ry="9"/>' +
        ring(132, 86, 12) +
        '<path class="ar" d="M78 40l-14-12M74 64H52M80 88l-16 10"/>';
    },
    situp: function(){
      return '<path class="ln" stroke-width="4" d="M78 48V140M74 108H156M152 108V140"/>' +
        '<circle class="sk" cx="104" cy="40" r="13"/>' +
        '<path class="ptl" stroke-width="14" d="M104 54V100"/>' +
        '<path class="ptl" stroke-width="10" d="M104 100H148V136"/>' +
        T(190, 56, 14, 'Upright, calm');
    },
    spray: function(){
      return '<rect class="calmf" x="108" y="48" width="36" height="84" rx="10"/>' +
        '<rect class="ink" x="114" y="30" width="24" height="20" rx="3"/>' +
        '<path class="ln" d="M114 40H90"/>' +
        '<path class="wtl" d="M78 32l-14-8M76 42H58M78 52l-14 8"/>' +
        T(196, 80, 14, 'Their own') + T(196, 98, 14, 'medicine');
    },
    aspirin: function(){
      return '<circle class="bub" cx="120" cy="70" r="42"/>' +
        '<path class="ln" d="M86 70H154"/>' +
        T(120, 146, 24, '300 mg', 'txa');
    },
    fast: function(){
      return '<circle class="sk" cx="110" cy="84" r="52"/>' +
        '<circle class="ink" cx="92" cy="74" r="4"/>' +
        '<circle class="ink" cx="128" cy="78" r="4"/>' +
        '<path class="ln" stroke-width="4" d="M86 108c12 6 22 4 30-2"/>' +
        '<path class="ln" stroke-width="4" d="M124 100c8 10 16 8 22 2"/>' +
        arrow(200, 120, 156, 108);
    },
    arms: function(){
      return '<circle class="sk" cx="120" cy="28" r="13"/>' +
        '<path class="ptl" stroke-width="18" d="M120 42V108"/>' +
        '<path class="ptl" stroke-width="8" d="M112 108V146M128 108V146"/>' +
        '<path class="skl" stroke-width="7" d="M108 52L52 48"/>' +
        '<path class="skl" stroke-width="7" d="M132 56L176 100"/>' +
        arrow(204, 48, 204, 96);
    },
    speech: function(){
      return '<rect class="bub" x="28" y="28" width="184" height="78" rx="16"/>' +
        '<path class="bub" d="M70 106l-8 22 28-22"/>' +
        '<path class="ar" d="M52 68c8-16 16-16 24 0s16 16 24 0 16-16 24 0 16 16 24 0 16-16 24 0"/>';
    },
    seizure: function(){
      return supine(118) +
        '<rect class="pillow" x="16" y="112" width="40" height="14" rx="6"/>' +
        '<rect class="ink" x="170" y="36" width="26" height="26" rx="4"/>' +
        arrow(196, 48, 226, 48) +
        T(78, 40, 15, 'Clear the space');
    },
    shade: function(){
      return '<circle class="sun" cx="40" cy="40" r="16"/>' +
        '<path class="sunl" d="M40 12v8M40 60v8M12 40h8M60 40h8M20 20l6 6M54 54l6 6M20 60l6-6M54 26l6-6"/>' +
        '<rect class="trunk" x="176" y="70" width="10" height="70"/>' +
        '<circle class="leaf" cx="181" cy="58" r="36"/>' +
        '<circle class="sk" cx="130" cy="100" r="12"/>' +
        '<path class="ptl" stroke-width="10" d="M130 112V132H104"/>' +
        arrow(70, 100, 112, 112);
    },
    coolwater: function(){
      return '<path class="ln" d="M28 64V128c0 16 16 20 28 20H184c12 0 28-4 28-20V64"/>' +
        '<path class="wt" opacity=".55" d="M36 80H204V124c0 10-12 14-24 14H60c-12 0-24-4-24-14Z"/>' +
        '<circle class="sk" cx="70" cy="74" r="14"/>' +
        '<path class="pt" opacity=".7" d="M84 96H176V120H84Z"/>' +
        T(176, 40, 18, '15 min', 'txa');
    },
    icepacks: function(){
      return supine(116) +
        '<rect class="ice" x="70" y="100" width="18" height="14" rx="3"/>' +
        '<rect class="ice" x="108" y="98" width="18" height="14" rx="3"/>' +
        '<rect class="ice" x="150" y="108" width="18" height="14" rx="3"/>' +
        '<path class="wtl" d="M190 40c8 8 0 18 0 18M206 32c12 12 0 26 0 26"/>' +
        T(70, 40, 15, 'Wet, ice, fan');
    },
    cup: function(){
      return '<path class="bub" d="M86 36H154L144 140H96Z"/>' +
        '<path class="wt" opacity=".55" d="M94 70H146L138 132H102Z"/>';
    },
    tap: function(l){
      return '<path class="ink" d="M28 28H116V44H96V62H76V44H28Z"/>' +
        '<rect class="wt" x="80" y="62" width="14" height="40" rx="4"/>' +
        limb(122) +
        '<path class="wtl" d="M70 108l-8-8M108 108l8-8"/>' +
        T(176, 48, 18, l || '', 'txa');
    },
    eye: function(){
      return '<path class="bub" d="M28 96C70 40 170 40 212 96C170 152 70 152 28 96Z"/>' +
        '<circle class="ink" cx="120" cy="96" r="18"/>' +
        '<path class="wtl" stroke-width="5" d="M168 16C156 48 148 70 140 84"/>' +
        T(48, 36, 18, '15 min', 'txa');
    },
    air: function(){
      return '<rect class="bub" x="28" y="24" width="100" height="112" rx="4"/>' +
        '<path class="ln" d="M78 24V136M28 80H128"/>' +
        '<path class="wtl" stroke-width="4" d="M146 52c16-6 32-6 48 0M146 80c16-6 28-6 40 0M146 108c16-6 32-6 48 0"/>';
    },
    bottle: function(){
      return '<path class="bottle" d="M96 18h40v20l14 16v84c0 8-8 10-8 10H90s-8-2-8-10V54l14-16Z"/>' +
        '<rect class="wh" x="86" y="78" width="60" height="44" rx="4"/>' +
        '<rect class="arf" x="112" y="86" width="8" height="22" rx="4"/>' +
        '<circle class="arf" cx="116" cy="114" r="5"/>' +
        T(196, 72, 13, 'Take it') + T(196, 90, 13, 'with you');
    },
    honey: function(l){
      return '<ellipse class="bub" cx="78" cy="84" rx="42" ry="26"/>' +
        '<ellipse class="honey" cx="78" cy="86" rx="30" ry="14"/>' +
        '<path class="ln" stroke-width="8" d="M118 78L200 48"/>' +
        T(120, 140, 13, l || '', 'txa');
    },
    stopdrop: function(){
      return supine(118) +
        '<path class="ar" d="M70 70a46 28 0 1 1 100 8"/>' +
        arrow(168, 86, 184, 96) +
        T(120, 32, 14, 'Stop, drop, cover, roll');
    },
    cling: function(){
      return limb(108) +
        '<ellipse class="burn" cx="116" cy="108" rx="28" ry="12"/>' +
        '<rect class="film" x="78" y="82" width="76" height="48" rx="6"/>' +
        T(120, 44, 15, 'Lay on loosely');
    },
    ring: function(){
      return '<rect class="sk" x="70" y="78" width="70" height="64" rx="20"/>' +
        '<path class="skl" stroke-width="10" d="M84 78V40M104 76V30M122 78V42"/>' +
        '<rect class="ringc" x="94" y="52" width="16" height="10" rx="3"/>' +
        arrow(168, 70, 168, 28);
    },
    blanket: function(){
      return supine(118) +
        '<path class="blanket" d="M70 100H220V132H70Z"/>' +
        '<path class="ar" d="M100 78c-4-8 0-16 0-24M140 78c-4-8 0-16 0-24M180 78c-4-8 0-16 0-24"/>';
    },
    power: function(){
      return '<path class="ink" d="M128 28L96 84H118L108 132L152 72H128L138 28Z"/>' +
        '<circle class="ar" cx="120" cy="80" r="56"/>' +
        '<path class="ar" stroke-width="7" d="M82 118L158 42"/>';
    }
  };

  function svg(spec){
    var k = spec, arg;
    if (Array.isArray(spec)){ k = spec[0]; arg = spec[1]; }
    var f = A[k];
    if (!f) return '';
    return '<svg class="art" viewBox="0 0 240 160" aria-hidden="true" focusable="false">' + f(arg) + '</svg>';
  }
  return { svg: svg, keys: Object.keys(A) };
})();
