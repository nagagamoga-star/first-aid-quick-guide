// Side-by-side sheet for the illustration redraw.
//   node tools/illustration_review.mjs
// Writes docs/clinical-review/illustration-review.html from tools/art-previous.js
// (the drawings on main) and src/art.js (this branch). Not part of the app build.
import fs from 'node:fs';
import vm from 'node:vm';

const root = new URL('..', import.meta.url).pathname;
function loadArt(file){
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(root + file, 'utf8').replace(/^var ART =/m, 'globalThis.ART ='), ctx, { filename: file });
  return ctx.ART;
}
const ctx = {};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(root + 'src/topics.js', 'utf8').replace(/^var (AZ|TOPICS) =/gm, 'globalThis.$1 ='), ctx);
const oldA = loadArt('tools/art-previous.js');
const newA = loadArt('src/art.js');
const { TOPICS } = ctx;

const css = `
:root{--ink:#1c1917;--muted:#5c564c;--paper:#f4f0e6;--card:#fffdf8;--pt:#7a5346;--res:#0e7c72;--skin:#c9a68a;--skin-d:#ab886c;--act:#c05245;--water:#527c9f;--ice:#b0c8ce;--wood:#b8916b;--sand:#e2d9ba;--sting:#8f6aa6;--leaf:#879f7c;--bandage:#f4f1e8;--calm:#0f5e56;--calm-bg:#e7f3f1;--amber-fill:#d8b565;--line:rgba(28,25,23,.16)}
*{box-sizing:border-box} body{margin:0;font:17px/1.45 "Atkinson Hyperlegible",Georgia,serif;background:var(--paper);color:var(--ink)}
header,main{max-width:1100px;margin:0 auto;padding:20px 16px}
.banner{background:#c4122f;color:#fff;padding:14px 16px;font-weight:700}
h1{font-size:32px;margin:0 0 8px} h2{margin:28px 0 8px} p{margin:0 0 8px}
.legend{display:flex;flex-wrap:wrap;gap:14px;margin:10px 0 18px}
.legend i{display:inline-block;width:14px;height:14px;border-radius:4px;vertical-align:-2px;margin-right:6px}
.pair{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;align-items:start;background:var(--card);border-radius:16px;padding:12px;margin:0 0 12px}
.step{font-size:15px} .meta{color:var(--muted);font-size:13px;margin-bottom:6px}
figure{margin:0} figcaption{font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);margin-bottom:4px}
.art{width:100%;height:auto;background:color-mix(in srgb,#e7e2d6 70%,white);border-radius:12px}
.art .gr{stroke:var(--line);fill:none;stroke-linecap:round}
.art .sk{fill:var(--skin)} .art .skd{fill:var(--skin-d)}
.art .skl{stroke:var(--skin);fill:none;stroke-linecap:round;stroke-linejoin:round}
.art .pt{fill:var(--pt)} .art .ptl{stroke:var(--pt);fill:none;stroke-linecap:round;stroke-linejoin:round}
.art .rsl{stroke:var(--res);fill:none;stroke-linecap:round;stroke-linejoin:round}
.art .ln{stroke:var(--ink);fill:none;stroke-width:3;stroke-linecap:round}
.art .ar{stroke:var(--act);fill:none;stroke-width:4;stroke-linecap:round;stroke-linejoin:round}
.art .arf{fill:var(--act)} .art .ink{fill:var(--ink)} .art .wh{fill:#fff}
.art .bub,.art .pad,.art .sp,.art .bottle{fill:#fff;stroke:var(--ink);stroke-width:2.5}
.art .band{fill:var(--bandage);stroke:var(--ink);stroke-width:2}
.art .bandl{stroke:var(--ink);stroke-width:1.5;opacity:.45;fill:none}
.art .board,.art .trunk{fill:var(--wood)} .art .ice{fill:var(--ice);stroke:var(--water);stroke-width:2}
.art .wt{fill:var(--water)} .art .wtl{stroke:var(--water);fill:none;stroke-width:3;stroke-linecap:round}
.art .calmf{fill:var(--water)} .art .pen{fill:var(--amber-fill);stroke:var(--ink);stroke-width:2}
.art .sting{stroke:var(--sting);stroke-width:4;fill:none} .art .sand{fill:var(--sand)}
.art .sun{fill:var(--amber-fill)} .art .sunl{stroke:var(--amber-fill);stroke-width:4}
.art .leaf{fill:var(--leaf)} .art .honey{fill:var(--amber-fill)}
.art .burn{fill:var(--act);opacity:.4}
.art .film{fill:var(--water);fill-opacity:.15;stroke:var(--water);stroke-width:2.5;stroke-dasharray:7 5}
.art .pillow{fill:var(--water);opacity:.5} .art .blanket{fill:var(--leaf);opacity:.75}
.art .ringc{fill:var(--amber-fill);stroke:var(--ink);stroke-width:1.5}
.art .cl{fill:var(--calm-bg);stroke:var(--calm);stroke-width:4}
.art .wh-l{stroke:#fff;stroke-width:3;fill:none;stroke-linecap:round}
.art .tx{fill:var(--ink);font-family:Georgia,serif;font-weight:700}
.art .txa{fill:var(--act);font-family:Georgia,serif;font-weight:700}
.cardpic{width:100%;height:auto;border-radius:12px;background:#fff}
@media(max-width:800px){.pair{grid-template-columns:1fr}}
`;

function specId(spec){ return Array.isArray(spec) ? spec[0] + ' / ' + spec[1] : String(spec); }
let body = '';
let n = 0;
for (const t of TOPICS){
  body += '<h2>' + t.title + '</h2>';
  const rows = [{ label: 'Topic symbol', spec: t.icon, text: t.short }].concat(t.steps.map((s, i) => ({
    label: 'Step ' + (i + 1), spec: s.a, text: s.t
  })));
  for (const row of rows){
    n++;
    body += '<article class="pair" id="item-' + n + '">' +
      '<div class="step"><p class="meta">' + t.id + ' · ' + row.label + ' · ' + specId(row.spec) + '</p><div>' + row.text + '</div></div>' +
      '<figure><figcaption>Previous</figcaption>' + oldA.svg(row.spec) + '</figure>' +
      '<figure><figcaption>This pull request</figcaption>' + newA.svg(row.spec) + '</figure>' +
      '</article>';
  }
}

let cardsHtml = '';
try {
  const cards = JSON.parse(fs.readFileSync(root + 'data/topic-cards.json', 'utf8')).cards || [];
  cardsHtml = '<h2>Topic cards, not reviewed</h2><p>These 17 pictures are the home-screen flip deck. They are AI-generated. The words in the alt text are taken from the written steps in src/topics.js. Text drawn on the picture is not the instruction. None of these cards is clinically approved.</p>';
  for (const c of cards) {
    const notes = (c.reviewNotes || []).map(x => '<li>' + x + '</li>').join('');
    cardsHtml += '<article class="pair"><div class="step"><p class="meta">' + c.id + (c.topic ? ' · #' + c.topic : ' · cover') + '</p><p>' + c.alt + '</p>' +
      (notes ? '<ul>' + notes + '</ul>' : '') + '</div>' +
      '<figure><figcaption>This pull request</figcaption><img class="cardpic" src="../../' + c.file + '" alt=""></figure>' +
      '<figure><figcaption>Not approved</figcaption><p>Picture not yet clinically reviewed.</p></figure></article>';
  }
} catch (e) { cardsHtml = ''; }

const html = '<!DOCTYPE html><html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Illustration review, not approved</title><style>' + css + '</style></head><body>' +
  '<p class="banner">Clinical review required. These drawings are not approved. Do not treat this page as the guide.</p>' +
  '<header><h1>Old and new illustrations</h1>' +
  '<p>Each row is one step. The words are the step text already in the guide. The left picture is the drawing on main. The right picture is this pull request. Judge the pose, the contact and the arrow. The words on the pictures are unchanged.</p>' +
  '<p class="legend"><span><i style="background:#7a5346"></i>Person</span><span><i style="background:#0e7c72"></i>Helper</span><span><i style="background:#c9a68a"></i>Skin</span><span><i style="background:#c05245"></i>Action and contact</span></p>' +
  '<p>' + n + ' rows. ' + newA.keys.length + ' symbols. Snake and funnel-web bandages are pressure immobilisation from the toes upward, not a tourniquet.</p></header><main>' +
  body + cardsHtml + '</main></body></html>\n';

const out = root + 'docs/clinical-review/illustration-review.html';
fs.writeFileSync(out, html);
console.log('wrote', out, html.length, 'rows', n);
