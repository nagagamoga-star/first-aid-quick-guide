// Release gate: may this content be presented as clinically reviewed and approved?
//
// This is NOT part of the normal build. The build (src/build.py) checks that the
// governance records are complete and consistent, so technical work can carry on
// while clinical review is pending. This gate answers a different question and
// fails until every topic and component has been reviewed, approved, and not
// changed since approval.
//
// Usage:
//   node tests/release_gate.mjs                  run the gate (exit 1 on any failure)
//   node tests/release_gate.mjs --print-hashes   print current content hashes, to record at approval
//   node tests/release_gate.mjs --today YYYY-MM-DD
//
// It does not stop GitHub Pages deploying main. To make it binding, run it as a
// required check on pull requests that change clinical content (see
// docs/CLINICAL_GOVERNANCE.md, "Validation is not publication").
import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';

const root = new URL('..', import.meta.url).pathname;
const text = f => fs.readFileSync(root + f, 'utf8');
const json = f => JSON.parse(text(f));
const arg = n => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : null; };
const today = arg('--today') || new Date().toISOString().slice(0, 10);
const SOURCE_CHECK_MAX_DAYS = 45; // monthly check, with two weeks' grace

const ctx = {}; vm.createContext(ctx);
vm.runInContext(text('src/topics.js').replace(/^var (AZ|TOPICS) =/gm, 'globalThis.$1 ='), ctx);
vm.runInContext(text('src/flow.js').replace(/^var FLOW =/m, 'globalThis.FLOW ='), ctx);
const { TOPICS, FLOW } = ctx;

// What each review item covers. A hash change means the reviewed text changed.
const sha = s => crypto.createHash('sha256').update(s).digest('hex').slice(0, 16);
const app = text('src/app.js');
const cprTiming = (app.match(/60000\s*\/\s*\d+|BREATHS_MS\s*=\s*\d+/g) || []).join(';');
const content = {};
for (const t of TOPICS) {
  const { body, ...rest } = t; // captions are reviewed under 3d-captions
  content[t.id] = JSON.stringify(rest) + (t.id === 'cpr' ? '|' + cprTiming : '');
}
content['question-flow'] = JSON.stringify(FLOW);
content['3d-captions'] = JSON.stringify(TOPICS.filter(t => t.body).map(t => [t.id, t.body]));
content['illustrations'] = text('src/art.js');
const hashes = Object.fromEntries(Object.entries(content).map(([k, v]) => [k, sha(v)]));

if (process.argv.includes('--print-hashes')) {
  for (const [k, h] of Object.entries(hashes)) console.log(`${k.padEnd(14)} ${h}`);
  process.exit(0);
}

const rev = json('data/topic-reviews.json'), fin = json('data/source-findings.json'), src = json('data/clinical-sources.json');
const fails = [];
const fail = m => fails.push(m);

for (const id of Object.keys(hashes)) {
  const it = rev.items.find(i => i.id === id);
  if (!it) { fail(`${id}: not in the review register`); continue; }
  if (it.status !== 'APPROVED FOR PUBLICATION') { fail(`${id}: status is ${it.status}`); continue; }
  if (!it.review.reviewer || !it.review.qualification || !it.review.reviewedAt) fail(`${id}: reviewer details incomplete`);
  if (!it.sourceCheck.confirmedBy) fail(`${id}: source check not confirmed by a person`);
  if (!it.publication.approvedBy || !it.publication.approvedAt) fail(`${id}: owner approval not recorded`);
  if (!it.nextReview || it.nextReview < today) fail(`${id}: next review ${it.nextReview || 'not set'} is not in the future`);
  if (it.publication.contentHash !== hashes[id]) fail(`${id}: content changed since approval (approved ${it.publication.contentHash || 'no hash'}, now ${hashes[id]})`);
}

// Every finding must be decided. Open findings of any severity block release.
for (const f of fin.findings) if (f.status === 'open') fail(`${f.id} (${f.severity}, ${f.topic}): still open`);

// Sources must have been checked recently (monthly check).
for (const [k, s] of Object.entries(src.sources)) {
  const age = (Date.parse(today) - Date.parse(s.lastChecked)) / 864e5;
  if (!(age <= SOURCE_CHECK_MAX_DAYS)) fail(`source ${k}: last checked ${s.lastChecked}, more than ${SOURCE_CHECK_MAX_DAYS} days ago`);
}

if (fails.length) {
  const shown = fails.slice(0, 25);
  shown.forEach(m => console.log('BLOCK ' + m));
  if (fails.length > shown.length) console.log(`... and ${fails.length - shown.length} more`);
  console.log(`RELEASE GATE: BLOCKED (${fails.length} issues). The content is not cleared for clinical publication.`);
  process.exit(1);
}
console.log('RELEASE GATE: PASS. Every item is reviewed, approved and unchanged since approval.');
