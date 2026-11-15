/* Illustration library: simple pictograms on a 240 x 160 canvas.
   Patient wears slate (pt), rescuer wears teal (rs), alarm red marks the action. */
var ART = (function(){
  var G = '<path class="gr" d="M14 140H226"/>';
  function LY(){
    return '<circle class="sk" cx="46" cy="114" r="14"/>' +
      '<rect class="pt" x="60" y="102" width="86" height="26" rx="13"/>' +
      '<path class="ptl" stroke-width="12" d="M146 110L214 112M146 121L214 126"/>' +
      '<path class="skl" stroke-width="8" d="M84 127L134 131"/>';
  }
  var RB = '<circle class="sk" cx="106" cy="34" r="13"/><path class="rsl" stroke-width="22" d="M112 54L128 90L160 100"/>';
  function LIMB(y){ y = y || 104;
    return '<path class="skl" stroke-width="36" d="M16 ' + y + 'H196"/><circle class="sk" cx="204" cy="' + y + '" r="21"/>';
  }
  function T(x, y, s, txt, cls, anchor){
    return '<text class="' + (cls || 'tx') + '" x="' + x + '" y="' + y + '" font-size="' + s + '" text-anchor="' + (anchor || 'middle') + '">' + txt + '</text>';
  }
  function down(x, y1, y2){ return '<path class="ar" d="M' + x + ' ' + y1 + 'V' + y2 + 'M' + (x-8) + ' ' + (y2-8) + 'L' + x + ' ' + (y2+2) + 'L' + (x+8) + ' ' + (y2-8) + '"/>'; }
  function noSign(cx, cy, r){ return '<circle class="ar" stroke-width="7" cx="' + cx + '" cy="' + cy + '" r="' + r + '"/><path class="ar" stroke-width="7" d="M' + (cx - r*0.7) + ' ' + (cy + r*0.7) + 'L' + (cx + r*0.7) + ' ' + (cy - r*0.7) + '"/>'; }
  function bandageOn(x1, x2, y){
    var s = '<rect class="band" x="' + x1 + '" y="' + (y-21) + '" width="' + (x2-x1) + '" height="42" rx="8"/><path class="bandl" d="';
    for (var x = x1 + 14; x < x2; x += 15) s += 'M' + x + ' ' + (y-21) + 'l-10 42';
    return s + '"/>';
  }

  var A = {
    phone: function(l){ l = l || '000';
      return '<rect class="ink" x="88" y="14" width="64" height="124" rx="12"/><rect class="wh" x="95" y="28" width="50" height="90" rx="4"/>' +
        T(120, 80, l.length > 4 ? 12 : 24, l, 'txa') +
        '<path class="ar" d="M164 52q12 18 0 36M176 42q22 28 0 56"/>';
    },
    danger: function(){
      return '<path class="arf" d="M120 18L200 136H40Z" stroke-linejoin="round"/><rect class="wh" x="113" y="56" width="14" height="46" rx="7"/><circle class="wh" cx="120" cy="118" r="8"/>';
    },
    shoulders: function(){
      return G + RB + LY() + '<path class="skl" stroke-width="9" d="M110 60L64 102M116 62L74 108"/>' +
        '<rect class="bub" x="120" y="12" width="114" height="36" rx="10"/><path class="bub" d="M140 48l-10 12 22-12"/>' + T(177, 35, 12, 'Can you hear me?');
    },
    airway: function(){
      // Side view: one hand on the forehead, fingertips under the chin; the head tilts back
      // and the chin lifts, opening the airway.
      return G + '<rect class="pt" x="88" y="100" width="148" height="32" rx="14"/>' +
        '<circle class="sk" cx="68" cy="114" r="19"/><path class="sk" d="M58 100L38 90L46 116Z"/><circle class="sk" cx="58" cy="97" r="4"/>' +
        '<path class="skl" stroke-width="10" d="M140 28L92 92"/><ellipse class="sk" cx="82" cy="97" rx="15" ry="6" transform="rotate(-20 82 97)"/>' +
        '<path class="skl" stroke-width="10" d="M12 32L38 98"/><ellipse class="sk" cx="42" cy="100" rx="8" ry="5" transform="rotate(-25 42 100)"/>' +
        '<path class="ar" d="M96 72Q76 60 58 76M62 66L56 78L68 80"/>' + T(184, 66, 14, 'Tilt head back');
    },
    breathing: function(){
      return G + '<path class="rsl" stroke-width="22" d="M80 72L132 58L156 96"/><circle class="sk" cx="64" cy="80" r="13"/>' + LY() +
        '<path class="wtl" d="M44 96q-6-6 0-12M36 99q-9-9 0-18"/><path class="dash" d="M72 86L104 104"/>' + T(150, 26, 15, 'Look, listen, feel');
    },
    compress: function(){
      // Kneeling beside them, shoulders straight over the hands, arms straight,
      // heel of the hand on the centre of the chest; the arrow shows the push straight down.
      return G + '<path class="rsl" stroke-width="18" d="M122 84L150 98"/><path class="rsl" stroke-width="24" d="M98 50L122 86"/><circle class="sk" cx="96" cy="28" r="13"/>' +
        LY() + '<path class="skl" stroke-width="11" d="M98 52L94 96"/><ellipse class="sk" cx="94" cy="100" rx="13" ry="6"/><ellipse class="skd" cx="94" cy="97" rx="9" ry="4"/>' +
        down(64, 54, 92) + T(180, 34, 18, '100–120', 'txa') + T(180, 52, 13, 'a minute');
    },
    breaths: function(){
      return G + '<path class="rsl" stroke-width="22" d="M68 82L128 64L156 98"/><circle class="sk" cx="52" cy="90" r="13"/>' + LY() +
        '<path class="wtl" d="M38 94q-6-4-2-10M30 98q-8-6-2-14"/>' +
        '<path class="ar" d="M104 96V70M96 78L104 68L112 78"/>' + T(132, 26, 14, '2 breaths, 1 second each');
    },
    aed: function(){
      return G + LY() + '<rect class="pad" x="70" y="96" width="16" height="22" rx="3"/><rect class="pad" x="118" y="104" width="16" height="22" rx="3"/>' +
        '<path class="ln" d="M78 96C78 60 150 70 166 56M126 104C130 82 168 84 188 74"/>' +
        '<rect class="arf" x="158" y="20" width="62" height="50" rx="8"/><path class="wh" d="M194 26L180 48H192L186 64L204 40H192L198 26Z"/>';
    },
    aedbox: function(){
      return '<rect class="arf" x="70" y="22" width="100" height="94" rx="14"/>' +
        '<path class="wh" d="M120 104C80 80 82 50 102 50C112 50 118 58 120 62C122 58 128 50 138 50C158 50 160 80 120 104Z"/>' +
        '<path class="arf" d="M124 56L110 80H122L116 96L134 72H122L128 56Z"/>' + T(120, 146, 22, 'AED');
    },
    recovery: function(){
      // Lying on their side: lower leg straight, top leg bent at hip and knee so they
      // can't roll forward, top hand under the cheek, head tilted back.
      return G + '<path class="ptl" stroke-width="12" d="M138 128L214 130"/><ellipse class="sk" cx="220" cy="130" rx="8" ry="6"/>' +
        '<path class="ptl" stroke-width="26" d="M72 120L138 122"/>' +
        '<path class="ptl" stroke-width="14" d="M136 116L172 94L194 128"/><ellipse class="sk" cx="200" cy="130" rx="9" ry="6"/>' +
        '<circle class="sk" cx="50" cy="114" r="16"/><path class="sk" d="M38 104L24 96L30 114Z"/><path class="pt" d="M54 98a16 16 0 0 1 12 20l-6-1a10 10 0 0 0-8-13Z"/>' +
        '<path class="ptl" stroke-width="11" d="M82 114L72 132"/><path class="skl" stroke-width="8" d="M72 132H44"/><ellipse class="sk" cx="40" cy="132" rx="9" ry="5"/>' +
        T(120, 40, 14, 'On their side, head tilted back');
    },
    backblows: function(){
      // Person leaning well forward; heel of the hand strikes between the shoulder blades.
      return G + '<path class="ptl" stroke-width="12" d="M146 138V102M158 138V102"/><path class="ptl" stroke-width="28" d="M152 100L108 76"/>' +
        '<circle class="sk" cx="90" cy="76" r="13"/><path class="skl" stroke-width="8" d="M114 84L108 116"/>' +
        '<circle class="sk" cx="204" cy="28" r="13"/><path class="rsl" stroke-width="24" d="M204 48V100"/><path class="rsl" stroke-width="12" d="M198 100V138M210 100V138"/>' +
        '<path class="skl" stroke-width="9" d="M198 58L170 52L140 64"/><ellipse class="sk" cx="134" cy="66" rx="11" ry="6" transform="rotate(28 134 66)"/>' +
        '<path class="ar" d="M126 52l-6-10M138 50l2-12M114 60l-12-6"/>' + T(52, 34, 18, 'Up to 5', 'txa');
    },
    handpos: function(){
      return '<circle class="sk" cx="120" cy="26" r="16"/><rect class="pt" x="66" y="44" width="108" height="100" rx="34"/>' +
        '<path class="ln" opacity=".45" d="M120 54V118"/><ellipse class="sk" cx="120" cy="100" rx="22" ry="12"/><ellipse class="skd" cx="120" cy="95" rx="17" ry="9"/>' +
        '<path class="ar" d="M210 98H152M160 90L150 98L160 106"/>' + T(120, 158, 12, 'Lower half of breastbone');
    },
    repeat55: function(){
      return '<circle class="cl" cx="74" cy="80" r="44"/><circle class="cl" cx="166" cy="80" r="44"/>' +
        T(74, 84, 34, '5', 'txa') + T(74, 104, 11, 'back blows') + T(166, 84, 34, '5', 'txa') + T(166, 104, 11, 'chest thrusts') +
        '<path class="ar" d="M98 34Q120 18 142 34M134 26L144 35L132 38M142 126Q120 142 98 126M106 134L96 125L108 122"/>';
    },
    infant: function(){
      // Seated, baby face down along the forearm on the thigh, head lower than the body,
      // jaw supported by one hand; the heel of the other hand gives back blows.
      return '<circle class="sk" cx="210" cy="20" r="12"/><path class="rsl" stroke-width="24" d="M208 38L204 96"/>' +
        '<path class="rsl" stroke-width="26" d="M204 100L64 118"/><path class="rsl" stroke-width="22" d="M60 118V154"/>' +
        '<path class="skl" stroke-width="9" d="M168 98L92 108"/>' +
        '<path class="ptl" stroke-width="18" d="M154 82L98 94"/><path class="ptl" stroke-width="7" d="M154 82L178 80M154 86L176 90"/>' +
        '<circle class="sk" cx="84" cy="100" r="12"/><ellipse class="sk" cx="82" cy="112" rx="9" ry="5"/>' +
        '<path class="skl" stroke-width="9" d="M204 50L132 68"/><ellipse class="sk" cx="126" cy="72" rx="11" ry="6" transform="rotate(-12 126 72)"/>' +
        '<path class="ar" d="M114 60l-8-8M126 56v-12M138 60l8-8"/>' + T(52, 40, 14, 'Head lower', 'tx');
    },
    twofinger: function(){
      return G + '<circle class="sk" cx="70" cy="122" r="12"/><rect class="pt" x="82" y="112" width="56" height="22" rx="11"/>' +
        '<path class="ptl" stroke-width="9" d="M138 118L170 120M138 128L170 132"/>' +
        '<path class="skl" stroke-width="7" d="M150 30L108 108M160 32L116 110"/>' + down(84, 48, 86) + T(196, 48, 16, '2 fingers');
    },
    pressure: function(){
      return LIMB(104) + '<path class="arf" d="M84 126q-6 10 0 14q6-4 0-14Z"/><rect class="pad" x="88" y="82" width="56" height="40" rx="6"/>' +
        '<path class="skl" stroke-width="10" d="M108 62L94 10M126 62L142 10"/><ellipse class="skd" cx="116" cy="74" rx="30" ry="9"/><ellipse class="sk" cx="116" cy="65" rx="26" ry="9"/>' +
        down(178, 30, 66) + T(178, 22, 15, 'Press hard');
    },
    embedded: function(){
      return LIMB(108) + '<path class="ln" stroke-width="7" d="M118 100L136 38"/><rect class="pad" x="76" y="88" width="30" height="34" rx="5"/><rect class="pad" x="146" y="88" width="30" height="34" rx="5"/>' +
        down(91, 50, 78) + down(161, 50, 78) + T(120, 26, 15, 'Leave it in');
    },
    tourniquet: function(){
      return LIMB(104) + '<circle class="arf" cx="160" cy="104" r="8"/><rect class="ink" x="96" y="78" width="18" height="52" rx="4"/><path class="ln" stroke-width="6" d="M88 72L122 66"/>' +
        '<circle class="bub" cx="194" cy="36" r="20"/><path class="ln" d="M194 36V24M194 36L203 41"/>' + T(150, 40, 14, 'Note the time', 'tx', 'end');
    },
    nose: function(){
      return '<path class="ptl" stroke-width="34" d="M90 118L74 160"/><circle class="sk" cx="108" cy="72" r="38"/><path class="sk" d="M142 64l20 16-20 6Z"/>' +
        '<path class="skl" stroke-width="11" d="M154 92L186 150"/><ellipse class="skd" cx="152" cy="80" rx="10" ry="15"/>' +
        '<path class="ar" d="M54 34Q86 12 120 24M110 16L121 25L109 32"/>' + T(204, 40, 16, '10 min', 'txa');
    },
    layflat: function(){
      return G + LY() + '<circle class="sk" cx="196" cy="34" r="8"/><path class="ptl" stroke-width="9" d="M196 44V64M196 64L190 80M196 64L202 80"/>' +
        noSign(196, 54, 30) + T(80, 50, 16, 'Lie flat');
    },
    autoinjector: function(){
      return '<path class="ptl" stroke-width="44" d="M20 110H176"/><path class="ptl" stroke-width="34" d="M176 110V156"/>' +
        '<rect class="pen" x="104" y="22" width="22" height="62" rx="8"/><rect class="arf" x="108" y="80" width="14" height="10" rx="2"/>' +
        '<ellipse class="sk" cx="115" cy="44" rx="20" ry="16"/>' + down(76, 40, 78) + T(184, 40, 15, 'Outer thigh');
    },
    puffer: function(){
      return '<rect class="sp" x="44" y="70" width="118" height="40" rx="20"/><rect class="sp" x="22" y="80" width="26" height="20" rx="4"/>' +
        '<rect class="calmf" x="170" y="30" width="22" height="52" rx="6"/><path class="ln" stroke-width="4" d="M160 80H200V110H162"/>' +
        T(96, 40, 14, '1 puff, then 4 breaths') + T(110, 148, 24, '× 4', 'txa');
    },
    timer: function(l){
      return '<circle class="bub" cx="120" cy="80" r="52"/><rect class="ink" x="112" y="14" width="16" height="14" rx="3"/>' +
        '<path class="ln" stroke-width="5" d="M120 80V48M120 80L144 92"/>' + T(120, 156, 18, l || '', 'txa');
    },
    still: function(){
      return '<ellipse class="ink" cx="102" cy="94" rx="13" ry="22" transform="rotate(-12 102 94)"/><ellipse class="ink" cx="140" cy="70" rx="13" ry="22" transform="rotate(12 140 70)"/>' +
        noSign(120, 80, 56) + T(120, 156, 16, 'Keep still');
    },
    bitewrap: function(){
      return LIMB(100) + '<circle class="arf" cx="122" cy="98" r="4"/><circle class="arf" cx="136" cy="98" r="4"/>' +
        bandageOn(104, 160, 100).replace('class="band"', 'class="band" opacity=".9"') + T(130, 40, 15, 'Firm, over the bite first');
    },
    bandage: function(){
      // Bandage wound from the toes up the leg, each turn overlapping the last.
      // The roll is at the leading edge; the arrow shows the direction.
      var s = '<path class="skl" stroke-width="36" d="M16 100H186"/><path class="skl" stroke-width="30" d="M186 100L206 70"/>' +
        '<path class="band" d="M74 79H176L196 46L226 62L196 121H74Z"/><path class="bandl" stroke-width="2" d="';
      for (var x = 92; x < 190; x += 16) s += 'M' + x + ' 79l-12 42';
      return s + 'M190 64l16 12M198 52l16 12"/>' +
        '<ellipse class="band" cx="70" cy="100" rx="10" ry="23"/><ellipse class="bandl" stroke-width="2" cx="70" cy="100" rx="4" ry="9"/>' +
        '<path class="ar" d="M178 40H70M80 30L68 40L80 50"/>' + T(120, 146, 15, 'Start at the toes, wrap upwards');
    },
    splint: function(){
      return '<rect class="board" x="18" y="122" width="186" height="12" rx="3"/><path class="skl" stroke-width="36" d="M16 100H186"/><path class="skl" stroke-width="30" d="M186 100L206 70"/>' +
        bandageOn(24, 196, 100) + '<path class="ln" stroke-width="4" d="M60 76V134M120 76V134M172 76V134"/>' + T(120, 50, 15, 'Splint so joints can’t move');
    },
    beach: function(){
      return '<path class="wt" opacity=".75" d="M0 96q20-10 40 0t40 0t40 0V160H0Z"/><path class="sand" d="M120 124H240V160H120Z"/>' +
        '<circle class="sk" cx="176" cy="66" r="10"/><path class="ptl" stroke-width="12" d="M176 78V108M176 108L168 124M176 108L184 124"/>' +
        '<path class="ar" d="M60 64Q104 26 150 60M138 52L151 61L139 68"/>' + T(60, 40, 14, 'Out of the water');
    },
    vinegar: function(){
      return '<path class="skl" stroke-width="32" d="M16 124H200"/><path class="sting" d="M60 124q8-8 16 0t16 0t16 0t16 0t16 0"/>' +
        '<g transform="rotate(-48 70 54)"><rect class="bottle" x="50" y="22" width="40" height="70" rx="8"/><rect class="bottle" x="62" y="8" width="16" height="16" rx="3"/></g>' +
        '<path class="wtl" stroke-width="5" d="M106 62Q114 90 112 106"/>' + T(186, 40, 18, '30 seconds', 'txa') + T(186, 58, 13, 'of vinegar');
    },
    seawater: function(){
      return '<path class="skl" stroke-width="32" d="M16 124H200"/><path class="sting" d="M50 124q10-8 20 0t20 0t20 0q10-6 18-42"/>' +
        '<path class="skl" stroke-width="9" d="M178 14L136 74"/><ellipse class="sk" cx="132" cy="78" rx="11" ry="6"/>' +
        '<path class="wtl" d="M170 96q-4 8 0 10M186 104q-4 8 0 10M200 92q-4 8 0 10"/>' + T(60, 40, 15, 'Sea water only');
    },
    coldpack: function(l){
      return LIMB(108) + '<rect class="ice" x="90" y="78" width="64" height="46" rx="10"/><path class="wh-l" d="M122 88V114M110 94L134 108M134 94L110 108"/>' + T(120, 44, 16, l || 'Cold pack');
    },
    hotwater: function(){
      return '<path class="bub" d="M40 90H200Q196 146 120 146Q44 146 40 90Z"/><path class="wt" opacity=".55" d="M46 100H194Q186 140 120 140Q54 140 46 100Z"/>' +
        '<path class="skl" stroke-width="28" d="M224 26L146 112"/><path class="ar" stroke-width="3" d="M74 80q-8-10 0-20t0-20M100 80q-8-10 0-20t0-20"/>' +
        T(22, 30, 15, 'About 45°C', 'txa', 'start');
    },
    spider: function(){
      var legs = 'M100 70L64 48L44 66M98 84L54 80L36 100M100 98L58 112L46 136M106 110L80 134L78 154';
      var mirror = legs.replace(/(M|L)(\d+) /g, function(m, c, x){ return c + (240 - x) + ' '; });
      return '<path class="ln" stroke-width="5" d="' + legs + mirror + '"/><ellipse class="ink" cx="120" cy="92" rx="26" ry="32"/><circle class="ink" cx="120" cy="54" r="17"/>';
    },
    nobandage: function(){
      return '<path class="band" d="M110 124H210V96H110Z"/><circle class="band" cx="110" cy="84" r="40"/><circle class="bub" cx="110" cy="84" r="12"/>' + noSign(120, 84, 66);
    },
    hospital: function(){
      return G + '<rect class="bub" x="56" y="44" width="128" height="96"/><path class="ln" d="M48 44L120 14L192 44"/>' +
        '<path class="arf" d="M110 56h20v14h14v20h-14v14h-20v-14h-14v-20h14Z"/><rect class="ink" x="108" y="112" width="24" height="28"/>';
    },
    chestpain: function(){
      return '<circle class="sk" cx="120" cy="26" r="16"/><rect class="pt" x="66" y="44" width="108" height="104" rx="34"/>' +
        '<path class="skl" stroke-width="12" d="M168 150L146 92"/><ellipse class="sk" cx="140" cy="86" rx="16" ry="12"/>' +
        '<path class="ar" d="M98 72l-16-10M94 88H74M98 104l-16 10M150 18l12-8M90 22l-12-8"/>';
    },
    situp: function(){
      return G + '<path class="ln" stroke-width="5" d="M86 44V140M82 106H160M156 106V140"/>' +
        '<circle class="sk" cx="108" cy="40" r="13"/><path class="ptl" stroke-width="24" d="M106 60V98"/><path class="ptl" stroke-width="13" d="M106 98H148V138"/>' +
        '<path class="skl" stroke-width="8" d="M108 66L126 92"/>' + T(188, 50, 14, 'Upright, calm');
    },
    spray: function(){
      return '<rect class="calmf" x="100" y="52" width="40" height="86" rx="10"/><rect class="ink" x="108" y="34" width="24" height="20" rx="3"/>' +
        '<path class="ln" stroke-width="4" d="M108 42H86"/><path class="wtl" d="M74 34l-14-8M72 42h-16M74 50l-14 8"/>' + T(190, 90, 14, 'Their own', 'tx') + T(190, 106, 14, 'medicine', 'tx');
    },
    aspirin: function(){
      return '<circle class="bub" cx="120" cy="72" r="46"/><path class="ln" d="M82 72H158"/>' + T(120, 150, 24, '300 mg', 'txa');
    },
    fast: function(){
      return '<circle class="sk" cx="112" cy="80" r="58"/><circle class="ink" cx="90" cy="66" r="5"/><circle class="ink" cx="134" cy="70" r="5"/>' +
        '<path class="ln" stroke-width="4" d="M126 62L144 68M84 104Q100 112 116 108Q132 104 142 118"/><path class="ar" d="M214 134L158 120M168 114L156 120L166 128"/>';
    },
    arms: function(){
      return '<circle class="sk" cx="120" cy="28" r="14"/><rect class="pt" x="98" y="44" width="44" height="62" rx="12"/>' +
        '<path class="ptl" stroke-width="12" d="M110 106V148M130 106V148"/><path class="skl" stroke-width="10" d="M100 54L54 52M140 58L176 98"/>' +
        '<path class="ar" d="M200 62V96M192 88L200 98L208 88"/>';
    },
    speech: function(){
      return '<rect class="bub" x="34" y="26" width="172" height="80" rx="16"/><path class="bub" d="M70 106l-12 24 32-24"/>' +
        '<path class="ar" d="M56 66q10-18 20 0t20 0t20 0t20 0t20 0t20 0"/>';
    },
    seizure: function(){
      return G + '<rect class="pillow" x="20" y="124" width="56" height="13" rx="6"/>' + LY() +
        '<rect class="ink" x="160" y="34" width="28" height="28" rx="4"/><path class="ar" d="M194 48H226M218 40L228 48L218 56"/>' +
        '<path class="ar" stroke-width="3" d="M30 90q-8 8 0 16M150 92q8 8 0 16"/>' + T(80, 50, 15, 'Clear the space');
    },
    shade: function(){
      return G + '<circle class="sun" cx="40" cy="36" r="18"/><path class="sunl" d="M40 6v8M40 58v8M10 36h8M62 36h8M19 15l6 6M55 51l6 6M19 57l6-6M55 21l6-6"/>' +
        '<rect class="trunk" x="166" y="62" width="12" height="78"/><circle class="leaf" cx="172" cy="50" r="42"/>' +
        '<circle class="sk" cx="132" cy="100" r="10"/><path class="ptl" stroke-width="12" d="M132 112V130H104"/>';
    },
    coolwater: function(){
      return '<rect class="wt" opacity=".55" x="34" y="76" width="172" height="62" rx="10"/><path class="ln" stroke-width="4" d="M30 60V122Q30 142 50 142H190Q210 142 210 122V60"/>' +
        '<path class="pt" opacity=".5" d="M80 90H180V120H80Z"/><circle class="sk" cx="66" cy="70" r="14"/>' + T(176, 40, 18, '15 min', 'txa');
    },
    icepacks: function(){
      return G + LY() + '<rect class="ice" x="56" y="96" width="16" height="12" rx="3"/><rect class="ice" x="86" y="94" width="16" height="12" rx="3"/><rect class="ice" x="140" y="106" width="16" height="12" rx="3"/>' +
        '<path class="wtl" stroke-width="4" d="M190 30q10 10 0 22M204 24q16 16 0 34M218 18q22 22 0 46"/>' + T(80, 48, 15, 'Wet, ice, fan');
    },
    cup: function(){
      return '<path class="bub" d="M88 34H152L142 138H98Z"/><path class="wt" opacity=".55" d="M92 66H148L140 132H100Z"/>';
    },
    tap: function(l){
      return '<path class="ink" d="M30 26H118V42H98V60H78V42H30Z"/><rect class="wt" opacity=".75" x="80" y="60" width="16" height="42" rx="3"/>' +
        '<path class="skl" stroke-width="32" d="M16 120H206"/><path class="wtl" d="M70 104l-10-8M106 104l10-8"/>' + T(176, 48, 18, l || '', 'txa');
    },
    eye: function(){
      return '<path class="bub" d="M36 100Q120 34 204 100Q120 166 36 100Z"/><circle class="ink" cx="120" cy="100" r="22"/>' +
        '<path class="wtl" stroke-width="6" d="M156 8Q146 40 136 72"/>' + T(52, 36, 18, '15 min', 'txa');
    },
    air: function(){
      return '<rect class="bub" x="34" y="22" width="104" height="114" rx="4"/><path class="ln" d="M86 22V136M34 79H138"/>' +
        '<path class="wtl" stroke-width="4" d="M150 50q20-6 40 0t40 0M150 80q20-6 40 0t30 0M150 110q20-6 40 0"/>';
    },
    bottle: function(){
      return '<path class="bottle" d="M100 16h40v22l16 18v86q0 8-8 8h-56q-8 0-8-8V56l16-18Z"/><rect class="wh" x="90" y="76" width="60" height="48" rx="4"/>' +
        '<rect class="arf" x="115" y="84" width="10" height="24" rx="5"/><circle class="arf" cx="120" cy="116" r="5"/>' + T(196, 70, 13, 'Take it', 'tx') + T(196, 86, 13, 'with you', 'tx');
    },
    honey: function(l){
      return '<ellipse class="bub" cx="90" cy="86" rx="46" ry="28"/><ellipse class="honey" cx="90" cy="88" rx="36" ry="17"/><path class="ln" stroke-width="9" d="M134 78L222 46"/>' +
        T(120, 148, 16, l || '', 'txa');
    },
    stopdrop: function(){
      return G + LY() + '<path class="ar" d="M70 82A50 30 0 1 1 170 82M160 74L170 84L178 72"/>' + T(120, 28, 15, 'Stop, drop, cover, roll');
    },
    cling: function(){
      return LIMB(104) + '<ellipse class="burn" cx="118" cy="104" rx="30" ry="12"/><rect class="film" x="76" y="78" width="84" height="52" rx="4"/>' + T(118, 52, 15, 'Lay on loosely');
    },
    ring: function(){
      return '<rect class="sk" x="66" y="74" width="74" height="70" rx="22"/><path class="skl" stroke-width="16" d="M80 78V36M100 76V26M120 78V34M138 98L164 76"/>' +
        '<rect class="ringc" x="91" y="52" width="18" height="10" rx="3"/><path class="ar" d="M184 70V22M176 30L184 20L192 30"/>';
    },
    blanket: function(){
      return G + LY() + '<path class="blanket" d="M64 96H222V132H64Z"/><path class="ar" stroke-width="3" d="M100 82q-6-8 0-16t0-16M140 82q-6-8 0-16t0-16M180 82q-6-8 0-16t0-16"/>';
    },
    power: function(){
      return '<path class="ink" d="M128 30L96 86H118L108 132L150 70H126Z"/>' + noSign(120, 80, 60);
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
