// Review sheet for the Wikimedia Commons diagrams.
//   node tools/commons_review.mjs
// Writes docs/clinical-review/commons-review.html: for each accepted diagram,
// every step it replaces (step text, the drawing it replaces, the diagram), the
// ANZCOR point to check, the visual-check note and the licence. Rejected
// candidates and known gaps are listed with reasons. Not part of the app build.
import fs from 'node:fs';
import vm from 'node:vm';

const root = new URL('..', import.meta.url).pathname;
const ctx = {}; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(root + 'src/topics.js', 'utf8').replace(/^var (AZ|TOPICS) =/gm, 'globalThis.$1 ='), ctx);
vm.runInContext(fs.readFileSync(root + 'src/art.js', 'utf8').replace(/^var ART =/m, 'globalThis.ART ='), ctx);
const { TOPICS, ART } = ctx;
const media = JSON.parse(fs.readFileSync(root + 'data/media.json', 'utf8'));
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const keyOf = a => Array.isArray(a) ? a[0] : a;

let body = '', rows = 0;
for (const it of media.items.filter(i => i.decision === 'accepted')){
  body += `<section><h2>${esc(it.caption)}</h2>
  <div class="dg"><img src="../../${esc(it.file)}" alt="${esc(it.alt)}"></div>
  <p><b>Check against:</b> ${esc(it.anzcor)}</p>
  <p><b>Visual check:</b> ${esc(it.decisionNote)} <i>(${esc(it.checkedBy)})</i></p>
  <p class="meta"><a href="${esc(it.sourceUrl)}">${esc(it.commons)}</a> · ${esc(it.author)} · ${esc(it.licence)} · sha256 ${esc((it.sha256 || '').slice(0, 12))}</p>
  <h3>Steps where it replaces the drawing</h3>`;
  for (const t of TOPICS) t.steps.forEach((s, i) => {
    if (!it.keys.includes(keyOf(s.a)) && !(it.slots || []).includes(t.id + ':' + i)) return;
    rows++;
    body += `<article class="pair"><div><p class="meta">${t.id} · step ${i + 1}</p>${s.t}</div><figure><figcaption>Drawing it replaces</figcaption>${ART.svg(s.a)}</figure></article>`;
  });
  body += '<p class="ok">Reviewer: ☐ Approve for these steps &nbsp; ☐ Reject &nbsp; Notes: ____________________</p></section>';
}
body += '<section><h2>Rejected candidates</h2><ul>' + media.items.filter(i => i.decision === 'rejected')
  .map(i => `<li><b>${esc(i.commons)}</b>: ${esc(i.decisionNote)}</li>`).join('') + '</ul>';
body += '<h2>Gaps: no suitable Commons diagram</h2><ul>' + media.gaps.map(g => `<li>${esc(g)}</li>`).join('') + '</ul></section>';

const css = `body{margin:0;font:17px/1.45 system-ui,sans-serif;background:#f4f4f2;color:#1d2a33}
main{max-width:980px;margin:0 auto;padding:16px} .banner{background:#c4122f;color:#fff;padding:14px 16px;font-weight:700;margin:0}
section{background:#fff;border-radius:16px;padding:16px;margin:0 0 18px} h2{margin:0 0 10px}
.dg{background:#fff;border:1px solid #dde;border-radius:12px;padding:10px;max-width:560px} .dg img{width:100%;height:auto}
.meta{color:#56616b;font-size:14px} .pair{display:grid;grid-template-columns:1fr 240px;gap:12px;border-top:1px solid #e6e8ea;padding:10px 0}
.pair svg{width:100%;height:auto;background:#eef0ef;border-radius:10px} figure{margin:0} figcaption{font-size:12px;text-transform:uppercase;color:#56616b}
.ok{border-top:1px dashed #ccd;padding-top:10px;margin-top:10px}
.art .sk{fill:#c9a68a}.art .skd{fill:#ab886c}.art .skl{stroke:#c9a68a;fill:none;stroke-linecap:round}.art .pt{fill:#7a5346}.art .ptl{stroke:#7a5346;fill:none;stroke-linecap:round}
.art .rsl{stroke:#0e7c72;fill:none;stroke-linecap:round}.art .ar{stroke:#c05245;fill:none;stroke-width:4;stroke-linecap:round}.art .arf{fill:#c05245}.art .gr{stroke:#ccc;fill:none}
.art .tx{fill:#1d2a33;font-weight:700;font-family:sans-serif}.art .txa{fill:#c05245;font-weight:700;font-family:sans-serif}.art .ln{stroke:#1d2a33;fill:none;stroke-width:3}
.art .wh{fill:#fff}.art .ink{fill:#1d2a33}.art .pad,.art .bub{fill:#fff;stroke:#1d2a33;stroke-width:2.5}
@media(max-width:700px){.pair{grid-template-columns:1fr}}`;
const html = `<!DOCTYPE html><html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Commons diagrams: clinical review</title><style>${css}</style></head><body>
<p class="banner">Clinical review required. These diagrams are not approved.</p><main>
<h1>Wikimedia Commons diagrams</h1>
<p>Each diagram below replaces the drawing in the steps listed under it. Wikimedia Commons is not peer reviewed: please judge each picture against current ANZCOR guidance and whether it suits a member of the public in Australia. ${rows} step rows.</p>
${body}</main></body></html>
`;
fs.writeFileSync(root + 'docs/clinical-review/commons-review.html', html);
console.log('wrote docs/clinical-review/commons-review.html', rows, 'rows');
