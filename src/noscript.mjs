// Builds the no-JavaScript copy of the guide from src/topics.js and the review
// register. The words are the topic records; this file only wraps them in an
// ordered list. Run by src/build.py. Not shipped as its own file.
import fs from 'node:fs';
import vm from 'node:vm';

const root = new URL('..', import.meta.url).pathname;
const read = f => fs.readFileSync(root + f, 'utf8');
const ctx = {};
vm.createContext(ctx);
vm.runInContext(read('src/topics.js').replace(/^var (AZ|TOPICS) =/gm, 'globalThis.$1 ='), ctx);
const { TOPICS } = ctx;
const rev = JSON.parse(read('data/topic-reviews.json'));
const reviews = Object.fromEntries(rev.items.map(i => [i.id, i]));

const CATS = [
  ['Life-threatening', ['collapse', 'cpr', 'choking', 'bleeding', 'anaphylaxis', 'heart', 'stroke', 'unconscious']],
  ['Bites & stings', ['snake', 'marine', 'spider']],
  ['Injuries & burns', ['burns']],
  ['Medical', ['asthma', 'seizure', 'heat', 'poison']]
];
const byId = Object.fromEntries(TOPICS.map(t => [t.id, t]));
const seen = new Set();
for (const [, ids] of CATS) for (const id of ids) {
  if (!byId[id] || seen.has(id)) { console.error('topic map ' + id); process.exit(1); }
  seen.add(id);
}
if (seen.size !== TOPICS.length) { console.error('topic map does not cover every topic'); process.exit(1); }

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const esc = s => String(s == null ? '' : s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
function monthYear(d) {
  const p = String(d || '').split('-');
  return p.length > 1 ? MONTHS[+p[1] - 1] + ' ' + p[0] : (d || '');
}
function reviewText(id) {
  const r = reviews[id];
  if (!r) return '';
  if (r.status === 'APPROVED FOR PUBLICATION') return 'Reviewed by a ' + r.review.qualification + ' in ' + monthYear(r.review.reviewedAt) + '. Next review due ' + monthYear(r.nextReview) + '.';
  if (r.status === 'CLINICALLY REVIEWED') return 'Reviewed by a ' + r.review.qualification + ' in ' + monthYear(r.review.reviewedAt) + ', awaiting publication sign-off.';
  if (r.status === 'REVIEW OVERDUE') return 'Review overdue. Last reviewed ' + monthYear(r.review.reviewedAt) + '.';
  return 'Not yet reviewed by a qualified first aid trainer or clinician.';
}

let html = '<noscript><div class="nojs"><h2>All topics, written out</h2><p>The buttons and the question flow need JavaScript. The steps themselves are below, in the same words as the guide.</p>';
for (const [cat, ids] of CATS) {
  html += '<h2 class="nojs-cat">' + esc(cat) + '</h2>';
  for (const id of ids) {
    const t = byId[id];
    html += '<section class="nojs-topic" id="' + t.id + '">';
    html += '<p class="tag">' + esc(t.tag) + '</p><h3>' + esc(t.title) + '</h3>';
    if (t.when) html += '<div class="when">' + t.when + '</div>';
    let n = 0, lastG = null, open = false;
    const openList = () => { if (!open) { html += '<ol>'; open = true; } };
    const closeList = () => { if (open) { html += '</ol>'; open = false; } };
    for (const s of t.steps) {
      n += 1;
      if (s.g && s.g !== lastG) { closeList(); html += '<h4>' + esc(s.g) + '</h4>'; lastG = s.g; }
      openList();
      html += '<li value="' + n + '">' + s.t + '</li>';
    }
    closeList();
    if (t.dont) html += '<section class="dont"><h4>Don’t</h4><ul>' + t.dont.map(d => '<li>' + esc(d) + '</li>').join('') + '</ul></section>';
    if (t.notes) html += '<ul class="notes">' + t.notes.map(d => '<li>' + esc(d) + '</li>').join('') + '</ul>';
    html += '<p class="src">Source: ' + t.src + '</p>';
    html += '<p class="rstatus">Review status: ' + esc(reviewText(t.id)) + '</p>';
    html += '</section>';
  }
}
html += '</div></noscript>\n';
process.stdout.write(html);
