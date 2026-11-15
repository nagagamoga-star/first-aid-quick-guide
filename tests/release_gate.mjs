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
//   node tests/release_gate.mjs --changed-since <git ref>
//       per-item mode, used on pull requests: only items whose content or review
//       record changed since <ref> are checked. Changed content must be approved
//       with a matching hash; unchanged items are not required to be approved yet.
//       This lets a single reviewed fix (say F07) merge without waiting for every
//       other topic to be reviewed.
//
// It does not stop GitHub Pages deploying main. To make it binding, run it as a
// required check on pull requests that change clinical content (see
// docs/CLINICAL_GOVERNANCE.md, "Validation is not publication").
import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const root = new URL('..', import.meta.url).pathname;
const text = f => fs.readFileSync(root + f, 'utf8');
const json = f => JSON.parse(text(f));
const arg = n => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : null; };
const today = arg('--today') || new Date().toISOString().slice(0, 10);
const SOURCE_CHECK_MAX_DAYS = 45; // monthly check, with two weeks' grace

const sha = s => crypto.createHash('sha256').update(s).digest('hex').slice(0, 16);

// What each review item covers. A hash change means the reviewed text changed.
function contentHashes(read) {
  const ctx = {}; vm.createContext(ctx);
  vm.runInContext(read('src/topics.js').replace(/^var (AZ|TOPICS) =/gm, 'globalThis.$1 ='), ctx);
  vm.runInContext(read('src/flow.js').replace(/^var FLOW =/m, 'globalThis.FLOW ='), ctx);
  const { TOPICS, FLOW } = ctx;
  const cprTiming = (read('src/app.js').match(/60000\s*\/\s*\d+|BREATHS_MS\s*=\s*\d+/g) || []).join(';');
  const content = {};
  for (const t of TOPICS) {
    const { body, ...rest } = t; // captions are reviewed under 3d-captions
    content[t.id] = JSON.stringify(rest) + (t.id === 'cpr' ? '|' + cprTiming : '');
  }
  content['question-flow'] = JSON.stringify(FLOW);
  content['3d-captions'] = JSON.stringify(TOPICS.filter(t => t.body).map(t => [t.id, t.body]));
  // Drawings plus any accepted Commons diagrams (manifest entry and file hash),
  // so swapping a picture is a clinical change just like editing a drawing.
  let media = '';
  try {
    const m = JSON.parse(read('data/media.json'));
    media = JSON.stringify(m.items.filter(i => i.decision === 'accepted' || i.decision === 'hidden').map(i => [i.id, i.decision, i.keys, i.slots, i.file, i.sha256, i.alt, i.caption]));
  } catch { /* no manifest at this ref */ }
  let art2 = ''; try { art2 = read('src/art2.js'); } catch { /* not at this ref */ }
  content['illustrations'] = read('src/art.js') + (art2 ? '|' + art2 : '') + (media && media !== '[]' ? '|' + media : '');
  return Object.fromEntries(Object.entries(content).map(([k, v]) => [k, sha(v)]));
}
const hashes = contentHashes(text);

if (process.argv.includes('--print-hashes')) {
  for (const [k, h] of Object.entries(hashes)) console.log(`${k.padEnd(14)} ${h}`);
  process.exit(0);
}

const rev = json('data/topic-reviews.json'), fin = json('data/source-findings.json'), src = json('data/clinical-sources.json');
const fails = [];
const fail = m => fails.push(m);

function checkItem(id) {
  const it = rev.items.find(i => i.id === id);
  if (!it) { fail(`${id}: not in the review register`); return; }
  if (it.status !== 'APPROVED FOR PUBLICATION') { fail(`${id}: status is ${it.status}`); return; }
  if (!it.review.reviewer || !it.review.qualification || !it.review.reviewedAt) fail(`${id}: reviewer details incomplete`);
  if (!it.sourceCheck.confirmedBy) fail(`${id}: source check not confirmed by a person`);
  if (!it.publication.approvedBy || !it.publication.approvedAt) fail(`${id}: owner approval not recorded`);
  if (!it.nextReview || it.nextReview < today) fail(`${id}: next review ${it.nextReview || 'not set'} is not in the future`);
  if (it.publication.contentHash !== hashes[id]) fail(`${id}: content changed since approval (approved ${it.publication.contentHash || 'no hash'}, now ${hashes[id]})`);
}
const sourcesFresh = keys => {
  for (const k of keys) {
    const s = src.sources[k]; if (!s) continue;
    const age = (Date.parse(today) - Date.parse(s.lastChecked)) / 864e5;
    if (!(age <= SOURCE_CHECK_MAX_DAYS)) fail(`source ${k}: last checked ${s.lastChecked}, more than ${SOURCE_CHECK_MAX_DAYS} days ago`);
  }
};

const base = arg('--changed-since');
if (base) {
  const atBase = f => { try { return execFileSync('git', ['show', `${base}:${f}`], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }); } catch { return null; } };
  let baseHashes = {};
  try { baseHashes = contentHashes(f => { const t = atBase(f); if (t === null) throw new Error(f); return t; }); } catch { /* no comparable content at base: treat all as changed */ }
  let baseRev = null; try { baseRev = JSON.parse(atBase('data/topic-reviews.json')); } catch {}
  const recordAt = (r, id) => JSON.stringify(r && r.items.find(i => i.id === id) || null);
  const changed = [], recordOnly = [];
  for (const id of Object.keys(hashes)) {
    if (baseHashes[id] !== hashes[id]) changed.push(id);
    else if (recordAt(baseRev, id) !== recordAt(rev, id)) recordOnly.push(id);
  }
  const reg = [...src.topics, ...src.components];
  const overridden = [];
  const toCheck = [...changed, ...recordOnly.filter(id => (rev.items.find(i => i.id === id) || {}).status === 'APPROVED FOR PUBLICATION')];
  for (const id of toCheck) {
    // Owner override: the project owner may publish an item before clinical
    // review, on the record. It must name who, when and why, and match the
    // exact content being merged. It never changes the item's status, so the
    // app still says "not yet reviewed" and the full gate still fails.
    const it = rev.items.find(i => i.id === id) || {};
    const ov = it.ownerOverride;
    if (it.status !== 'APPROVED FOR PUBLICATION' && ov) {
      if (!ov.by || !ov.at || !ov.reason) fail(`${id}: owner override must record by, at and reason`);
      else if (ov.contentHash !== hashes[id]) fail(`${id}: owner override covers ${ov.contentHash}, content is now ${hashes[id]}`);
      else { overridden.push(id); console.log(`OVERRIDE ${id}: published by ${ov.by} on ${ov.at} before clinical review. Reason: ${ov.reason}`); continue; }
      continue;
    }
    checkItem(id);
    for (const f of fin.findings) if (f.status === 'open' && (f.topic === id || f.topic === 'all')) fail(`${f.id} (${f.severity}, ${f.topic}): still open`);
    sourcesFresh((reg.find(r => r.id === id) || { sources: [] }).sources);
  }
  console.log(`changed since ${base.slice(0, 12)}: content ${changed.join(', ') || 'none'}; approval records ${recordOnly.join(', ') || 'none'}`);
  report(overridden.length
    ? `Owner override for ${overridden.join(', ')}: published by the owner, NOT clinically reviewed. Other changed items are reviewed and approved.`
    : `Changed items are reviewed, approved and match their approved content.`);
}

for (const id of Object.keys(hashes)) checkItem(id);

// Every finding must be decided. Open findings of any severity block release.
for (const f of fin.findings) if (f.status === 'open') fail(`${f.id} (${f.severity}, ${f.topic}): still open`);

// Sources must have been checked recently (monthly check).
sourcesFresh(Object.keys(src.sources));
report('Every item is reviewed, approved and unchanged since approval.');

function report(okMsg) {
  if (!fails.length) { console.log('RELEASE GATE: PASS. ' + okMsg); process.exit(0); }
  const shown = fails.slice(0, 25);
  shown.forEach(m => console.log('BLOCK ' + m));
  if (fails.length > shown.length) console.log(`... and ${fails.length - shown.length} more`);
  console.log(`RELEASE GATE: BLOCKED (${fails.length} issues). The content is not cleared for clinical publication.`);
  process.exit(1);
}
