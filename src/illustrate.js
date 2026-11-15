/* Illustration slots.
   The page asks for a picture by topic and step, not by a drawing's internal
   style. A slot id is "<topicId>:<stepIndex>" (stepIndex is "icon" for the
   topic's own symbol).
   Illustrate.use(fn) adds a renderer. A renderer receives the slot and returns
   an HTML string, or "" to decline. The last renderer to return HTML wins.
   The built-in renderer draws whatever ART.svg currently is, so the reviewed
   drawings stay in place until a clinical change replaces them. */
var Illustrate = (function(){
  var layers = [];
  function parts(spec){
    if (Array.isArray(spec)) return { key: spec[0], label: spec[1] == null ? '' : String(spec[1]) };
    return { key: spec, label: '' };
  }
  function slot(topicId, stepIndex, spec){
    var p = parts(spec);
    return { id: topicId + ':' + stepIndex, topic: topicId, step: stepIndex, key: p.key, label: p.label, spec: spec };
  }
  function use(fn){ layers.push(fn); }
  function render(s){
    var html = '';
    for (var i = 0; i < layers.length; i++){
      var next = layers[i](s);
      if (next) html = next;
    }
    return html;
  }
  use(function(s){
    if (typeof ART === 'undefined' || !ART.svg) return '';
    return ART.svg(s.spec);
  });
  return { slot: slot, use: use, render: render };
})();
