// Clinical governance checks: the source register, the review register and the findings list.
// These check that records are complete and consistent. They can't judge clinical content.
// Usage: node tests/validate_governance.mjs [--today YYYY-MM-DD]
import fs from 'node:fs';
import vm from 'node:vm';
const root = new URL('..', import.meta.url).pathname;
const read = f => JSON.parse(fs.readFileSync(root + f, 'utf8'));
const ctx = {}; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(root + 'src/topics.js', 'utf8').replace(/^var (AZ|TOPICS) =/gm, 'globalThis.$1 ='), ctx);
const TOPICS = ctx.TOPICS;
const src = read('data/clinical-sources.json'), rev = read('data/topic-reviews.json'), fin = read('data/source-findings.json');
const ai = process.argv.indexOf('--today');
const today = ai > 0 ? process.argv[ai + 1] : new Date().toISOString().slice(0, 10);
const errors = [], warn = [];
const ok = (c, m) => { if (!c) errors.push(m); };
const DATE = /^\d{4}-\d{2}-\d{2}$/;

// Source register
const topicIds = TOPICS.map(t => t.id);
const regTopics = src.topics.map(t => t.id);
const compIds = src.components.map(c => c.id);
for (const id of topicIds) ok(regTopics.includes(id), `source register: topic ${id} missing`);
for (const id of regTopics) ok(topicIds.includes(id), `source register: ${id} is not a topic in the app`);
for (const [k, s] of Object.entries(src.sources)) {
  for (const f of ['organisation', 'title', 'url', 'sourceUpdated', 'lastChecked']) ok(s[f], `source ${k}: missing ${f}`);
  ok(/^https:\/\//.test(s.url || ''), `source ${k}: url must be https`);
  ok(DATE.test(s.lastChecked || ''), `source ${k}: lastChecked must be YYYY-MM-DD`);
  if (s.lastChecked) {
    const ageDays = (Date.parse(today) - Date.parse(s.lastChecked)) / 864e5;
    if (ageDays > 365) warn.push(`source ${k}: last checked ${s.lastChecked}, more than 12 months ago`);
  }
}
for (const t of [...src.topics, ...src.components]) for (const k of t.sources) ok(src.sources[k], `${t.id}: unknown source ${k}`);
// Every guideline link the app shows must be in the register
for (const t of TOPICS) {
  const reg = src.topics.find(x => x.id === t.id); if (!reg) continue;
  const urls = reg.sources.map(k => src.sources[k] && src.sources[k].url);
  for (const m of (t.src || '').matchAll(/href="([^"]+)"/g)) {
    const u = m[1].replace("'+AZ+'", 'https://www.anzcor.org/home/');
    ok(urls.includes(u), `${t.id}: app links to a source not in its register entry: ${u}`);
  }
}

// Review register
const STAT = new Set(rev.statuses);
const items = rev.items.map(i => i.id);
for (const id of [...topicIds, ...compIds]) ok(items.includes(id), `review register: ${id} missing`);
for (const it of rev.items) {
  ok(STAT.has(it.status), `${it.id}: invalid status "${it.status}"`);
  ok(it.sourceCheck && DATE.test(it.sourceCheck.date || ''), `${it.id}: source check date missing`);
  const reviewed = ['CLINICALLY REVIEWED', 'APPROVED FOR PUBLICATION', 'REVIEW OVERDUE'].includes(it.status);
  if (reviewed) {
    ok(it.review.reviewer && it.review.qualification && DATE.test(it.review.reviewedAt || ''), `${it.id}: ${it.status} needs reviewer, qualification and reviewedAt`);
    ok(it.sourceCheck.confirmedBy, `${it.id}: ${it.status} needs the source check confirmed by a person`);
    const high = (it.openFindings || []).map(f => fin.findings.find(x => x.id === f)).filter(f => f && f.severity === 'HIGH' && f.status === 'open');
    ok(high.length === 0, `${it.id}: cannot be ${it.status} with open HIGH findings (${high.map(f => f.id).join(', ')})`);
  }
  if (it.status === 'APPROVED FOR PUBLICATION') {
    ok(it.publication.approvedBy && DATE.test(it.publication.approvedAt || ''), `${it.id}: approval needs approvedBy and approvedAt`);
    ok(DATE.test(it.nextReview || ''), `${it.id}: approval needs nextReview`);
    if (it.nextReview && it.nextReview < today) errors.push(`${it.id}: review was due ${it.nextReview}; set status to REVIEW OVERDUE and arrange a review`);
  }
  for (const f of it.openFindings || []) ok(fin.findings.some(x => x.id === f), `${it.id}: unknown finding ${f}`);
  ok(Array.isArray(it.history) && it.history.length, `${it.id}: history missing`);
}

// Findings
const fids = new Set();
for (const f of fin.findings) {
  ok(!fids.has(f.id), `duplicate finding ${f.id}`); fids.add(f.id);
  ok(['HIGH', 'MEDIUM', 'LOW'].includes(f.severity), `${f.id}: bad severity`);
  ok(['open', 'accepted', 'rejected', 'resolved'].includes(f.status), `${f.id}: bad status`);
  ok(f.topic === 'all' || topicIds.includes(f.topic) || compIds.includes(f.topic), `${f.id}: unknown topic ${f.topic}`);
  ok(!f.source || src.sources[f.source], `${f.id}: unknown source ${f.source}`);
}

const counts = rev.items.reduce((a, i) => (a[i.status] = (a[i.status] || 0) + 1, a), {});
const openHigh = fin.findings.filter(f => f.severity === 'HIGH' && f.status === 'open').length;
console.log(`governance: ${Object.entries(counts).map(([k, v]) => `${v} ${k}`).join(', ')}; findings ${fin.findings.length} (${openHigh} open HIGH)`);
warn.forEach(w => console.log('WARN ' + w));
if (errors.length) { errors.forEach(e => console.log('FAIL ' + e)); process.exit(1); }
console.log('PASS governance');
