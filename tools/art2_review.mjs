// Review sheet for the house-style step illustrations (src/art2.js).
//   node tools/art2_review.mjs
// Writes docs/clinical-review/art2-review.html: every step, its text, and the
// picture the guide now shows. Steps without a house-style scene keep their
// symbol from art.js and are marked. Not part of the app build.
import fs from 'node:fs';
import vm from 'node:vm';

const root = new URL('..', import.meta.url).pathname;
const ctx = {}; vm.createContext(ctx);
const run = (f, re, rep) => vm.runInContext(fs.readFileSync(root + f, 'utf8').replace(re, rep), ctx, { filename: f });
run('src/topics.js', /^var (AZ|TOPICS) =/gm, 'globalThis.$1 =');
run('src/art.js', /^var ART =/m, 'globalThis.ART =');
run('src/art2.js', /^var ART2 =/m, 'globalThis.ART2 =');
const { TOPICS, ART, ART2 } = ctx;
const keyOf = a => Array.isArray(a) ? a[0] : a;

let body = '', rows = 0, scenes = 0;
for (const t of TOPICS){
  body += `<h2 id="${t.id}">${t.title}</h2>`;
  t.steps.forEach((s, i) => {
    rows++;
    const pic = ART2.svg(s.a);
    if (pic) scenes++;
    body += `<article><p class="meta">${t.id} · step ${i + 1} · ${keyOf(s.a)}${pic ? '' : ' · symbol, unchanged'}</p>
      <div class="pic${pic ? '' : ' sym'}">${pic || ART.svg(s.a)}</div><p>${s.t}</p>
      <p class="ok">☐ Approve &nbsp; ☐ Change: __________________</p></article>`;
  });
}

const css = `body{margin:0;font:16px/1.45 system-ui,-apple-system,"Segoe UI",sans-serif;background:#f3f4f4;color:#1d2a33}
main{max-width:560px;margin:0 auto;padding:12px}
.banner{background:#c4122f;color:#fff;padding:12px 14px;font-weight:700;margin:0}
h1{font-size:22px;margin:10px 0 4px} h2{font-size:19px;margin:22px 0 8px}
article{background:#fff;border-radius:16px;padding:10px;margin:0 0 12px;box-shadow:0 2px 8px rgba(16,28,38,.07)}
.pic svg{display:block;width:100%;height:auto;border-radius:12px}
.pic.sym{max-width:220px;background:#eef0ef;border-radius:12px}
.meta{color:#56616b;font-size:13px;margin:0 0 6px} .ok{color:#56616b;font-size:13px;border-top:1px dashed #ccd;padding-top:6px;margin:8px 0 0}
.art .sk{fill:#c9a68a}.art .skd{fill:#ab886c}.art .skl{stroke:#c9a68a;fill:none;stroke-linecap:round}.art .pt{fill:#7a5346}.art .ptl{stroke:#7a5346;fill:none;stroke-linecap:round}
.art .rsl{stroke:#0e7c72;fill:none;stroke-linecap:round}.art .ar{stroke:#c05245;fill:none;stroke-width:4;stroke-linecap:round}.art .arf{fill:#c05245}.art .gr{stroke:#ccc;fill:none}
.art .tx{fill:#1d2a33;font-weight:700;font-family:sans-serif}.art .txa{fill:#c05245;font-weight:700;font-family:sans-serif}.art .ln{stroke:#1d2a33;fill:none;stroke-width:3}
.art .wh{fill:#fff}.art .ink{fill:#1d2a33}.art .pad,.art .bub,.art .bottle,.art .sp{fill:#fff;stroke:#1d2a33;stroke-width:2.5}.art .cl{fill:#e7f3f1;stroke:#0e7c72;stroke-width:4}
.art .calmf,.art .wt{fill:#527c9f}.art .honey,.art .pen,.art .sun{fill:#d8b565}.art .wh-l{stroke:#fff;stroke-width:3;fill:none}`;
const html = `<!DOCTYPE html><html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Step illustrations: house style</title><style>${css}</style></head><body>
<p class="banner">Not clinically reviewed. For the owner's style check and the reviewer.</p><main>
<h1>Step illustrations, house style</h1>
<p>${scenes} of ${rows} steps use the new style. The rest are symbols (phone, timer, danger sign and similar), kept as they were. Words on the pictures are the same words the old drawings or the step text used.</p>
${body}</main></body></html>
`;
fs.writeFileSync(root + 'docs/clinical-review/art2-review.html', html);
console.log('wrote docs/clinical-review/art2-review.html', rows, 'rows,', scenes, 'scenes');
