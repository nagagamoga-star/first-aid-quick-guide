// Structural checks on the app's data: topics, illustrations and the question flow.
// Checks structure only. It does not judge clinical content.
// Usage: node tests/validate_structure.mjs
import fs from 'node:fs';
import vm from 'node:vm';
const root = new URL('..', import.meta.url).pathname;
const ctx = {};
vm.createContext(ctx);
for (const f of ['src/art.js', 'src/topics.js', 'src/flow.js']) {
  vm.runInContext(fs.readFileSync(root + f, 'utf8').replace(/^var (ART|AZ|TOPICS|FLOW) =/gm, 'globalThis.$1 ='), ctx, { filename: f });
}
const { ART, TOPICS, FLOW } = ctx;
const errors = [], warn = [];
const ok = (c, m) => { if (!c) errors.push(m); };
const SEV = new Set(['crit', 'urgent', 'calm']);
const BODY = new Set(['skin', 'ribcage', 'sternum', 'heart', 'larynx', 'bronchi', 'thigh', 'brain']);
const ids = new Set();
const artKey = s => Array.isArray(s) ? s[0] : s;
for (const t of TOPICS) {
  ok(!ids.has(t.id), `duplicate topic id ${t.id}`); ids.add(t.id);
  for (const k of ['id', 'sev', 'tag', 'title', 'short', 'icon', 'steps', 'src']) ok(t[k] !== undefined, `${t.id}: missing ${k}`);
  ok(SEV.has(t.sev), `${t.id}: invalid severity ${t.sev}`);
  ok(/anzcor\.org|allergy\.org\.au|healthdirect\.gov\.au/.test(t.src || ''), `${t.id}: source has no recognised source link`);
  ok(ART.keys.includes(artKey(t.icon)), `${t.id}: unknown icon ${artKey(t.icon)}`);
  ok(Array.isArray(t.steps) && t.steps.length > 0, `${t.id}: no steps`);
  (t.steps || []).forEach((s, i) => { ok(ART.keys.includes(artKey(s.a)), `${t.id} step ${i + 1}: unknown illustration ${artKey(s.a)}`); ok(s.t && s.t.length > 3, `${t.id} step ${i + 1}: empty text`); });
  if (t.body) for (const g of [...(t.body.hi || []), ...(t.body.show || [])]) ok(BODY.has(g), `${t.id}: unknown 3D group ${g}`);
}
// internal links
for (const t of TOPICS) {
  const html = [t.when, ...(t.notes || []), ...(t.dont || []), ...t.steps.map(s => s.t)].join(' ');
  for (const m of html.matchAll(/href="#([^"]*)"/g)) ok(ids.has(m[1]), `${t.id}: link to unknown topic #${m[1]}`);
}
// question flow
ok(FLOW.start, 'flow: no start node');
const seen = new Set(), paths = [];
(function walk(id, path) {
  const n = FLOW[id]; ok(n, `flow: missing node ${id}`); if (!n) return;
  seen.add(id);
  if (n.end) { ok(ids.has(n.topic), `flow ${id}: result links to unknown topic ${n.topic}`); ok(n.h && n.p, `flow ${id}: result missing text`); ok(n.call !== undefined, `flow ${id}: result says nothing about calling 000`); paths.push(path.concat(id)); return; }
  ok(n.q && Array.isArray(n.a) && n.a.length, `flow ${id}: question has no answers`);
  if (path.includes(id)) { errors.push(`flow: loop at ${id}`); return; }
  for (const a of n.a || []) walk(a.go, path.concat(id));
})('start', []);
for (const id of Object.keys(FLOW)) if (!seen.has(id)) warn.push(`flow: unreachable node ${id}`);
for (const crit of ['r_cpr', 'r_unconscious', 'r_choking', 'r_ana', 'r_stroke']) ok(seen.has(crit), `flow: critical result ${crit} unreachable`);
console.log(`topics ${TOPICS.length}, steps ${TOPICS.reduce((n, t) => n + t.steps.length, 0)}, illustrations ${ART.keys.length}, flow nodes ${Object.keys(FLOW).length}, flow paths ${paths.length}`);
warn.forEach(w => console.log('WARN ' + w));
if (errors.length) { errors.forEach(e => console.log('FAIL ' + e)); process.exit(1); }
console.log('PASS structure');
