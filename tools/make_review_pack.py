"""Build the clinical review pack from the app's own content and the governance data.

Outputs (docs/clinical-review/):
  REVIEW_PACK.md   readable on GitHub, drawings as SVG files in art/
  REVIEW_PACK.pdf  printable, for a reviewer to mark up and sign
  art/*.svg        every drawing used in a step

Usage: python3 tools/make_review_pack.py    (needs Node; the PDF also needs Playwright + Chrome)
Rebuild after any content or governance change so the pack always matches the app.
"""
import html, json, os, re, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'docs', 'clinical-review')
ART_DIR = os.path.join(OUT, 'art')
os.makedirs(ART_DIR, exist_ok=True)

NODE = r'''
const fs = require('fs'), vm = require('vm'), root = process.argv[1];
const ctx = {}; vm.createContext(ctx);
for (const f of ['src/art.js', 'src/topics.js', 'src/flow.js'])
  vm.runInContext(fs.readFileSync(root + '/' + f, 'utf8').replace(/^var (ART|AZ|TOPICS|FLOW) =/gm, 'globalThis.$1 ='), ctx);
const arts = {};
const key = s => Array.isArray(s) ? s.join('--') : s;
for (const t of ctx.TOPICS) for (const s of [t.icon, ...t.steps.map(x => x.a)]) arts[key(s)] = ctx.ART.svg(s);
console.log(JSON.stringify({ topics: ctx.TOPICS, flow: ctx.FLOW, arts }));
'''
data = json.loads(subprocess.check_output(['node', '-e', NODE, ROOT]))
src = json.load(open(os.path.join(ROOT, 'data', 'clinical-sources.json')))
rev = json.load(open(os.path.join(ROOT, 'data', 'topic-reviews.json')))
fin = json.load(open(os.path.join(ROOT, 'data', 'source-findings.json')))
css = open(os.path.join(ROOT, 'src', 'style.css')).read()
# Light-theme tokens and illustration classes, so each SVG file renders on its own.
root_tokens = re.search(r':root\{(.*?)\n\}', css, re.S).group(1)
art_rules = '\n'.join(l for l in css.splitlines() if l.startswith('.art .'))
svg_style = '<style>svg{' + re.sub(r'/\*.*?\*/|--font-[^;]+;|color-scheme:[^;]+;', '', root_tokens, flags=re.S) + '}' + art_rules.replace('.art ', '') + '</style>'

def slug(k): return re.sub(r'[^a-z0-9-]+', '-', k.lower().replace('+', ' plus')).strip('-')
for k, svg in data['arts'].items():
    s = svg.replace('<svg class="art" ', '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="160" ', 1).replace(' aria-hidden="true" focusable="false"', '')
    s = s.replace('>', '>' + svg_style, 1)
    open(os.path.join(ART_DIR, slug(k) + '.svg'), 'w').write(s)

def text(h):  # app HTML to plain text with **bold**
    h = re.sub(r'</?(b|strong)>', '**', h)
    h = re.sub(r'<[^>]+>', '', h)
    return html.unescape(h).replace(' ', ' ').strip()
def akey(s): return slug('--'.join(s) if isinstance(s, list) else s)
items = {i['id']: i for i in rev['items']}
findings = fin['findings']
def topic_findings(tid): return [f for f in findings if f['topic'] == tid or (f['topic'] == 'all' and tid in [t['id'] for t in data['topics']])]
SEV = {'HIGH': 0, 'MEDIUM': 1, 'LOW': 2}

md = []
w = md.append
w('# Clinical Review Pack: First Aid Quick Guide\n')
w(f'Generated from the app\'s content on {fin["checkedOn"]}. Live site: https://nagagamoga-star.github.io/first-aid-quick-guide/\n')
w('## For the reviewer\n')
w('This pack contains every instruction, drawing, 3D caption and question in the app, exactly as users see them. Please mark each item **Approve**, **Change** (write the change) or **Remove**, and sign each section. Nothing is published as reviewed until you sign off.\n')
w('- **Who can review:** preferably a currently accredited first aid trainer with current practical teaching experience; otherwise a paramedic, emergency or critical care nurse, or emergency doctor whose current work involves first response or first aid training. General registration alone is not enough. You will also need to review the drawings and the question flow.')
w('- **What to check:** two questions for every item. Does it match current Australian first aid guidance (ANZCOR, and ASCIA for anaphylaxis)? And is it appropriate for a member of the public in Australia, with no training, to follow under stress? An item can match its source and still need changing. Also check that each drawing shows the step correctly.')
w('- **Findings:** an AI-assisted comparison against the official pages found the issues listed under each topic. Please confirm or reject each one. Three are marked HIGH and should be settled first. The proposed changes are drafts for you to accept, edit or reject, not recommendations.')
w('- **Basis:** each finding is marked **Source** (the guideline states it; check the app matches and reads well) or **Judgement** (the guideline does not settle it, so your clinical judgement decides what suits a general audience). %d of %d findings need judgement.' % (sum(f.get('basis') == 'judgement' for f in fin['findings']), len(fin['findings'])))
w('- **Item IDs:** W = "when to act" box, S1, S2… = steps, N = notes, D = "Don\'t" items.\n')
w('## Summary\n')
w('| Topic | Sources (version) | Findings H / M / L | Status |')
w('|---|---|---|---|')
for t in data['topics']:
    reg = next(x for x in src['topics'] if x['id'] == t['id'])
    srcs = '; '.join(f'{src["sources"][k]["organisation"]} {src["sources"][k]["guideline"]} ({src["sources"][k]["sourceUpdated"]})' for k in reg['sources'])
    tf = topic_findings(t['id']); c = [sum(1 for f in tf if f['severity'] == s) for s in ('HIGH', 'MEDIUM', 'LOW')]
    w(f'| [{t["title"]}](#{slug(t["title"])}) | {srcs} | {c[0]} / {c[1]} / {c[2]} | {items[t["id"]]["status"]} |')
w('\n### HIGH findings (settle first)\n')
for f in findings:
    if f['severity'] == 'HIGH': w(f'- **{f["id"]} ({f["topic"]}, {f["item"]}, {f["basis"].capitalize()}):** {f["finding"]} *Proposed:* {f["proposal"]}')
w('')
for t in data['topics']:
    reg = next(x for x in src['topics'] if x['id'] == t['id'])
    w(f'\n## {t["title"]}\n')
    w(f'*Severity:* {t["tag"]} · *Status:* {items[t["id"]]["status"]}\n')
    w('**Sources**\n')
    for k in reg['sources']:
        s = src['sources'][k]
        w(f'- [{s["organisation"]} {s["guideline"]}: {s["title"]}]({s["url"]}), version {s["sourceUpdated"]}' + (f', amended {s["amendments"]}' if s.get('amendments') else '') + f'. Checked {s["lastChecked"]}.')
    if t.get('when'): w(f'\n**W (when to act):** {text(t["when"])}\n')
    if t.get('extra') == 'cpr': w('**CPR depth table:** Adult: heel of one hand on the centre of the chest (lower half of the breastbone), other hand on top; at least 5 cm. Child 1 year and over: same spot, one or two hands; about 5 cm. Baby under 1: same spot, two fingers; about 4 cm. All: about one-third of the chest depth.\n')
    w('| ID | Drawing | Step as shown | Approve / Change / Remove | Comments |')
    w('|---|---|---|---|---|')
    last = None
    for i, s in enumerate(t['steps']):
        g = s.get('g')
        if g and g != last: w(f'| | | ***{g}*** | | |'); last = g
        w(f'| S{i+1} | <img src="art/{akey(s["a"])}.svg" width="120" alt="drawing {akey(s["a"])}"> | {text(s["t"])} | ☐ A ☐ C ☐ R | |')
    for i, n in enumerate(t.get('notes', [])): w(f'| N{i+1} | | {text(n)} | ☐ A ☐ C ☐ R | |')
    for i, n in enumerate(t.get('dont', [])): w(f'| D{i+1} | | Don\'t: {text(n)} | ☐ A ☐ C ☐ R | |')
    if t.get('body'): w(f'| 3D | | 3D view, "{t["body"]["title"]}": {text(t["body"]["caption"])} | ☐ A ☐ C ☐ R | |')
    tf = sorted(topic_findings(t['id']), key=lambda f: SEV[f['severity']])
    if tf:
        w('\n**Source check findings**\n')
        w('| ID | Severity | Basis | Item | Finding | Proposed change | Agree? |')
        w('|---|---|---|---|---|---|---|')
        for f in tf: w(f'| {f["id"]} | {f["severity"]} | {f["basis"].capitalize()} | {f["item"]} | {f["finding"]} | {f["proposal"]} | ☐ Yes ☐ No |')
    w('\n**Sign-off:** Reviewer name ______________________  Qualification ______________________  Date ____________  Signature ______________________\n')

w('\n## Question flow ("What\'s happening?")\n')
w('Each answer leads to the next question or to a result. Results restate topic steps and link to the topic.\n')
w('| Node | Question or result | Answers → next | Approve / Change / Remove |')
w('|---|---|---|---|')
for nid, n in data['flow'].items():
    if n.get('end'):
        call = 'Call 000 now. ' if n.get('call') is True else (text(n['call']) + ' ' if n.get('call') else '')
        w(f'| {nid} | **Result:** {text(n["h"])}. {call}{text(n["p"])} → topic: {n["topic"]} | | ☐ A ☐ C ☐ R |')
    else:
        ans = '<br>'.join(f'{text(a["t"])} → {a["go"]}' for a in n['a'])
        note = (' (' + text(n['note']) + ')') if n.get('note') else ''
        pre = '[Call 000 now shown] ' if n.get('call') else ''
        w(f'| {nid} | {pre}{text(n["q"])}{note} | {ans} | ☐ A ☐ C ☐ R |')
w('\n**Sign-off:** Reviewer name ______________________  Qualification ______________________  Date ____________  Signature ______________________\n')
for cid in ('question-flow', '3d-captions', 'illustrations'):
    for f in topic_findings(cid): w(f'- **{f["id"]} ({f["severity"]}, {f["basis"].capitalize()}):** {f["finding"]} *Proposed:* {f["proposal"]}')
w('\n## Recording the outcome (project owner)\n')
w('For each item the reviewer signs off, update `data/topic-reviews.json`: set `review.reviewer`, `review.qualification`, `review.reviewedAt`, `sourceCheck.confirmedBy`, mark each finding in `data/source-findings.json` as `accepted`, `rejected` or `resolved`, and set the status to `CLINICALLY REVIEWED`. Make any agreed content changes in a separate pull request. Then set `APPROVED FOR PUBLICATION` with `publication.approvedBy`, `publication.approvedAt`, `publication.contentHash` (from `node tests/release_gate.mjs --print-hashes`) and `nextReview` (within 12 months). The build refuses approval while HIGH findings are open or details are missing. Before promoting the guide as reviewed, run `node tests/release_gate.mjs`; it passes only when every item is approved, unchanged since approval, and every finding is decided. See `docs/CLINICAL_GOVERNANCE.md`.')
open(os.path.join(OUT, 'REVIEW_PACK.md'), 'w').write('\n'.join(md) + '\n')
print(f'wrote REVIEW_PACK.md and {len(data["arts"])} drawings')

# Printable PDF
try:
    from playwright.sync_api import sync_playwright
except ImportError:
    print('Playwright not installed: skipped PDF'); sys.exit(0)
def md_to_html(lines):
    out, table = [], False
    for l in lines:
        if l.startswith('|'):
            cells = [c.strip() for c in l.strip('|').split('|')]
            if set(''.join(cells)) <= set('-: '): continue
            if not table: out.append('<table>'); table = True; tag = 'th'
            else: tag = 'td'
            out.append('<tr>' + ''.join(f'<{tag}>{inline(c)}</{tag}>' for c in cells) + '</tr>'); continue
        if table: out.append('</table>'); table = False
        if l.startswith('### '): out.append(f'<h3>{inline(l[4:])}</h3>')
        elif l.startswith('## '): out.append(f'<h2>{inline(l[3:])}</h2>')
        elif l.startswith('# '): out.append(f'<h1>{inline(l[2:])}</h1>')
        elif l.startswith('- '): out.append(f'<p class="li">• {inline(l[2:])}</p>')
        elif l.strip(): out.append(f'<p>{inline(l)}</p>')
    if table: out.append('</table>')
    return '\n'.join(out)
def inline(s):
    svgs = []
    def keep(m):
        svgs.append(open(os.path.join(ART_DIR, m.group(1))).read().replace('width="240" height="160"', 'width="110" height="74"', 1))
        return f'@@SVG{len(svgs) - 1}@@'
    s = re.sub(r'<img src="art/([^"]+)"[^>]*>', keep, s)
    s = re.sub(r'\*\*\*(.+?)\*\*\*', r'<b><i>\1</i></b>', s); s = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', s); s = re.sub(r'\*(.+?)\*', r'<i>\1</i>', s)
    s = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2">\1</a>', s); s = re.sub(r'`([^`]+)`', r'<code>\1</code>', s)
    return re.sub(r'@@SVG(\d+)@@', lambda m: svgs[int(m.group(1))], s)
flat = '\n'.join(md).split('\n')
page = '<!DOCTYPE html><html><head><meta charset="utf-8"><style>@page{size:A4;margin:14mm 12mm}body{font:10.5pt/1.4 Arial,sans-serif;color:#20242b}h1{font-size:20pt}h2{font-size:15pt;margin-top:18pt;page-break-before:always}h2:first-of-type{page-break-before:auto}table{border-collapse:collapse;width:100%;margin:6pt 0;table-layout:auto}td svg{display:block;width:110px;height:74px}td,th{border:1px solid #b7c0c7;padding:4pt;vertical-align:top;text-align:left}th{background:#e9ecef}tr{page-break-inside:avoid}p.li{margin:2pt 0 2pt 10pt}a{color:#263b48}</style></head><body>' + md_to_html(flat) + '</body></html>'
hp = os.path.join(OUT, 'review-pack.html'); open(hp, 'w').write(page)
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get('CHROME', '/usr/bin/google-chrome'))
    pg = b.new_page(); pg.goto('file://' + hp); pg.wait_for_timeout(300)
    pg.pdf(path=os.path.join(OUT, 'REVIEW_PACK.pdf'), format='A4', print_background=True, display_header_footer=True,
           header_template='<div></div>', footer_template='<div style="font-size:8pt;width:100%;text-align:center;color:#68727d">First Aid Quick Guide clinical review pack · page <span class="pageNumber"></span> of <span class="totalPages"></span></div>',
           margin={'top': '14mm', 'bottom': '16mm', 'left': '12mm', 'right': '12mm'})
    b.close()
os.remove(hp)
print('wrote REVIEW_PACK.pdf')
