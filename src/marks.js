/* Menu symbols for topic tiles and the command palette.
   Original 24px drawings: 2px round strokes and a faint duotone fill,
   in the manner of Health Icons (healthicons.org, CC0). These paths were
   drawn for this guide; they are not copied from that set.
   They are not step illustrations. Step drawings live in src/art.js and
   are not modified here. */
var MARKS = (function(){
  function wrap(inner){
    return '<svg class="marksvg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + inner + '</svg>';
  }
  var I = {
    collapse: '<circle class="duo" cx="12" cy="7" r="2.6"/><path class="duo" d="M8.2 19v-1.5C8.2 15 9.8 13.4 12 13.4s3.8 1.6 3.8 4.1V19z"/><g class="line"><circle cx="12" cy="7" r="2.6"/><path d="M8.2 19v-1.5C8.2 15 9.8 13.4 12 13.4s3.8 1.6 3.8 4.1V19"/></g>',
    cpr: '<circle class="duo" cx="12" cy="14.5" r="4.2"/><g class="line"><circle cx="12" cy="14.5" r="4.2"/><path d="M12 3.2v5.2M9.2 6.2 12 8.8l2.8-2.6"/></g>',
    choking: '<circle class="duo" cx="8.5" cy="7.2" r="2.4"/><path class="duo" d="M13.2 9.6c1.6.9 2.6 2.2 2.6 3.8 0 1.8-1.4 3.2-3.2 3.2"/><g class="line"><circle cx="8.5" cy="7.2" r="2.4"/><path d="M6 19v-1.3C6 15.2 7.2 14 9.2 14h.8"/><path d="M13.2 9.6c1.6.9 2.6 2.2 2.6 3.8 0 1.8-1.4 3.2-3.2 3.2"/></g>',
    bleeding: '<path class="duo" d="M12 3.4S17.2 8.8 17.2 12.2a5.2 5.2 0 0 1-10.4 0C6.8 8.8 12 3.4 12 3.4z"/><path class="line" d="M12 3.4S17.2 8.8 17.2 12.2a5.2 5.2 0 0 1-10.4 0C6.8 8.8 12 3.4 12 3.4z"/>',
    anaphylaxis: '<path class="duo" d="M10 6.2h4V17h-4z"/><g class="line"><rect x="9" y="2.4" width="6" height="3.2" rx="1"/><rect x="10" y="5.6" width="4" height="11.2" rx="1"/><path d="M12 16.8v3.4"/></g>',
    heart: '<path class="duo" d="M12 18.6s-5.6-3.4-5.6-7.1A3.3 3.3 0 0 1 12 8.2a3.3 3.3 0 0 1 5.6 3.3c0 3.7-5.6 7.1-5.6 7.1z"/><path class="line" d="M12 18.6s-5.6-3.4-5.6-7.1A3.3 3.3 0 0 1 12 8.2a3.3 3.3 0 0 1 5.6 3.3c0 3.7-5.6 7.1-5.6 7.1z"/>',
    stroke: '<circle class="duo" cx="12" cy="12" r="7.2"/><g class="line"><circle cx="12" cy="12" r="7.2"/><path d="M9 10.2h.01M15 10.2h.01"/><path d="M8.8 15.2c.9.9 2 1.3 3.2 1.3"/><path d="M15.2 14.4c-.5.4-1 .5-1.5.5"/></g>',
    unconscious: '<circle class="duo" cx="6.2" cy="14.2" r="2.3"/><path class="duo" d="M8.4 14.2h6.8c2 0 3.6 1.2 4.2 2.8H10.2c-.2-1.2-.6-2-1.8-2.8z"/><g class="line"><circle cx="6.2" cy="14.2" r="2.3"/><path d="M8.4 14.2h6.8c2.2 0 4 1.3 4.6 3.2"/><path d="M10.2 14.2c.7 1.5.5 2.8-.6 3.8"/></g>',
    snake: '<path class="duo" d="M4 8.2c2.2-2.6 4.8-2.6 7 0s4.8 2.6 7 0c.4 1.2.2 2.2-.4 3-2.2 2.6-4.8 2.6-7 0s-4.8-2.6-7 0c-.6-.8-.8-1.8-.6-3z"/><g class="line"><path d="M4 8.6c2.2-2.8 5-2.8 7.2 0s5 2.8 7.2 0"/><path d="M4 14.8c2.2-2.8 5-2.8 7.2 0s5 2.8 7.2 0"/></g>',
    marine: '<path class="duo" d="M7 12.2a5 5 0 0 1 10 0H7z"/><g class="line"><path d="M7 12.2a5 5 0 0 1 10 0"/><path d="M8.2 12.2v4.8M12 12.2v6.4M15.8 12.2v4.8"/></g>',
    spider: '<circle class="duo" cx="12" cy="12" r="3"/><g class="line"><circle cx="12" cy="12" r="3"/><path d="M12 9 9.2 5.2M12 9l2.8-3.8M12 15l-2.8 3.8M12 15l2.8 3.8M9 12H4.6M15 12h4.4M9.6 10.2 6.2 7.2M14.4 10.2l3.4-3M9.6 13.8 6.2 16.8M14.4 13.8l3.4 3"/></g>',
    burns: '<path class="duo" d="M12 3.2c1.8 2.6 1.4 4-.2 5.4 2 .3 3.6 2 3.6 4.1A4.2 4.2 0 0 1 12 16.8a4.2 4.2 0 0 1-4.2-4.1c0-1.5.7-2.7 1.8-3.5.2 1.3 1.3 1.7 1.5.2.4-2 .8-3.6 1-6.2z"/><path class="line" d="M12 3.2c1.8 2.6 1.4 4-.2 5.4 2 .3 3.6 2 3.6 4.1A4.2 4.2 0 0 1 12 16.8a4.2 4.2 0 0 1-4.2-4.1c0-1.5.7-2.7 1.8-3.5.2 1.3 1.3 1.7 1.5.2.4-2 .8-3.6 1-6.2z"/>',
    asthma: '<path class="duo" d="M8.2 11.2c-1.6.4-2.8 2-2.8 4 0 2.2 1.4 3.8 3.2 3.8 1.2 0 2-.8 2.4-2.2V11l-2.8.2zm7.6 0c1.6.4 2.8 2 2.8 4 0 2.2-1.4 3.8-3.2 3.8-1.2 0-2-.8-2.4-2.2V11l2.8.2z"/><g class="line"><path d="M12 4.2v6.2"/><path d="M12 10.4c-1 0-4.2.8-4.6 4.6-.2 2.4 1.2 4 2.8 4 1.4 0 2.2-1.2 2.4-3.2"/><path d="M12 10.4c1 0 4.2.8 4.6 4.6.2 2.4-1.2 4-2.8 4-1.4 0-2.2-1.2-2.4-3.2"/></g>',
    seizure: '<circle class="duo" cx="12" cy="12" r="8"/><path class="line" d="M3.5 14.5 7 8.2l3.1 6.6 2.8-7.2 2.8 6.4L20.5 9"/>',
    heat: '<circle class="duo" cx="12" cy="12" r="3.4"/><g class="line"><circle cx="12" cy="12" r="3.4"/><path d="M12 2.8v2.3M12 18.9V21.2M2.8 12h2.3M18.9 12h2.3M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M18.8 5.2 17.2 6.8M6.8 17.2 5.2 18.8"/></g>',
    poison: '<path class="duo" d="M9.2 8.2h5.6V16a2 2 0 0 1-2 2h-1.6a2 2 0 0 1-2-2z"/><g class="line"><path d="M10 2.6h4V5h-4z"/><path d="M9 5h6l.8 2.6V16a2 2 0 0 1-2 2h-3.6a2 2 0 0 1-2-2V7.6z"/><path d="M12 10.2v4.2M10.4 12.3h3.2"/></g>'
  };
  return { svg: function(id){ return wrap(I[id] || I.cpr); }, ids: Object.keys(I) };
})();
