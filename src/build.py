"""Build index.html and sw.js from src/, with checks.

Usage: python3 src/build.py
Exits non-zero, writing nothing, if any check fails.

Steps
1. Required files exist (sources, fonts, icons, vendored three.js, model, manifest).
2. Each script passes `node --check` (skipped with a warning if Node isn't installed).
3. Structure check: tests/validate_structure.mjs (topics, illustrations, question flow).
   Governance check: tests/validate_governance.mjs (source register, review register, findings).
4. Assemble index.html (CSS + scripts inlined) and sw.js (precache list + versions).
5. Output checks: no leftover markers, no CDN references, every precached file exists, manifest is valid JSON.
6. Report.
"""
import hashlib, json, os, re, shutil, subprocess, sys, tempfile

SRC = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(SRC)
SCRIPTS = ['art.js', 'illustrate.js', 'media.js', 'viewer.js', 'topics.js', 'flow.js', 'marks.js', 'app.js', 'pwa.js']  # order matters
FONTS = sorted(f for f in os.listdir(os.path.join(ROOT, 'fonts')) if f.endswith('.woff2')) if os.path.isdir(os.path.join(ROOT, 'fonts')) else []
# Precached as one unit (CORE). './' and 'index.html' are the app page.
PRECACHE = ['./', 'index.html', 'manifest.webmanifest', 'favicon.svg',
            'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/apple-touch-icon.png'] + ['fonts/' + f for f in FONTS]
# Commons diagrams accepted in data/media.json: precached, so they work offline like the drawings.
_media = json.load(open(os.path.join(ROOT, 'data', 'media.json'), encoding='utf-8'))
MEDIA_FILES = [i['file'] for i in _media['items'] if i['decision'] == 'accepted' and i.get('file')]
PRECACHE += MEDIA_FILES
# Cached on first use (3D).
LAZY = ['vendor/three/three.min.js', 'vendor/three/OrbitControls.js', 'models/anatomy.b64.txt']

errors, warnings = [], []
def fail(msg): errors.append(msg)
def read(*p): return open(os.path.join(*p), encoding='utf-8').read()

# 1. required files
required = [os.path.join('src', f) for f in ['shell.html', 'style.css', 'sw.js', 'noscript.mjs'] + SCRIPTS] + ['data/clinical-sources.json', 'data/topic-reviews.json', 'data/source-findings.json', 'data/media.json']
required += [p for p in PRECACHE + LAZY if p not in ('./', 'index.html')]
for rel in required:
    if not os.path.isfile(os.path.join(ROOT, rel)): fail(f'missing file: {rel}')
if len(FONTS) < 7: fail(f'expected 7 font files in fonts/, found {len(FONTS)}')
dupes = {p for p in PRECACHE if PRECACHE.count(p) > 1}
if dupes: fail(f'duplicate precache entries: {sorted(dupes)}')
if errors: print('\n'.join('FAIL ' + e for e in errors)); sys.exit(1)

# 2. syntax
node = shutil.which('node')
if node:
    for f in SCRIPTS:
        r = subprocess.run([node, '--check', os.path.join(SRC, f)], capture_output=True, text=True)
        if r.returncode:
            lines = [l for l in r.stderr.splitlines() if 'Error' in l or ':' in l]
            fail(f'syntax error in src/{f}: ' + ' | '.join(lines[:2]))
    # 3. structure
    r = subprocess.run([node, os.path.join(ROOT, 'tests', 'validate_structure.mjs')], capture_output=True, text=True)
    if r.returncode: fail('structure check failed:\n' + r.stdout.strip())
    else: structure = r.stdout.strip().splitlines()[0]
    r = subprocess.run([node, os.path.join(ROOT, 'tests', 'validate_governance.mjs')], capture_output=True, text=True)
    if r.returncode: fail('governance check failed:\n' + r.stdout.strip())
    else:
        governance = r.stdout.strip().splitlines()[0]
        warnings.extend(l[5:] for l in r.stdout.splitlines() if l.startswith('WARN '))
else:
    warnings.append('node not found: skipped syntax, structure and governance checks'); structure = governance = 'skipped'
if errors: print('\n'.join('FAIL ' + e for e in errors)); sys.exit(1)

# 4. assemble
shell = read(SRC, 'shell.html')
for marker in ('/*CSS*/', '/*JS*/'):
    if shell.count(marker) != 1: fail(f'shell.html must contain {marker} exactly once')
if shell.count('<!--NOJS-->') != 1: fail('shell.html must contain <!--NOJS--> exactly once')
if node:
    r = subprocess.run([node, os.path.join(SRC, 'noscript.mjs')], capture_output=True, text=True)
    if r.returncode: fail('no-JavaScript guide failed:\n' + (r.stderr or r.stdout).strip())
    else:
        nos = r.stdout
        if nos.count('class="nojs-topic"') != 16 or '<noscript>' not in nos: fail('no-JavaScript guide did not include all 16 topics')
        shell = shell.replace('<!--NOJS-->', nos)
if '<!--NOJS-->' in shell: fail('no-JavaScript guide was not inserted')
if errors: print('\n'.join('FAIL ' + e for e in errors)); sys.exit(1)
# Review status for display (from data/topic-reviews.json). Display only: the register itself is the record.
rev = json.loads(read(ROOT, 'data', 'topic-reviews.json'))
reviews = {i['id']: {'status': i['status'], 'qualification': i['review'].get('qualification'),
                     'reviewedAt': i['review'].get('reviewedAt'), 'nextReview': i.get('nextReview')} for i in rev['items']}
reviews_js = '/* Generated by build.py from data/topic-reviews.json */\nvar REVIEWS = ' + json.dumps(reviews, separators=(',', ':')) + ';'
# Diagrams (from data/media.json): only accepted items, each with a licence the
# fetch tool confirmed, an allowed licence, a file on disk and a matching sha256.
ALLOW = ('PUBLIC DOMAIN', 'PD', 'CC0', 'CC BY ', 'CC BY-SA')
media_items = []
for it in _media['items']:
    if it['decision'] != 'accepted': continue
    lic = (it.get('licence') or '').upper() + ' '
    path = os.path.join(ROOT, it.get('file') or '')
    if not it.get('licence') or not lic.startswith(ALLOW) or ' NC' in lic or ' ND' in lic: fail(f"media {it['id']}: licence '{it.get('licence')}' not verified or not allowed"); continue
    if not it.get('file') or not os.path.isfile(path): fail(f"media {it['id']}: file missing"); continue
    if hashlib.sha256(open(path, 'rb').read()).hexdigest() != it.get('sha256'): fail(f"media {it['id']}: file does not match its recorded sha256"); continue
    if not it.get('alt') or not it.get('author') or not it.get('sourceUrl'): fail(f"media {it['id']}: alt text, author and source are required"); continue
    media_items.append({k: it.get(k) for k in ('id', 'keys', 'slots', 'file', 'width', 'height', 'alt', 'caption', 'commons', 'author', 'licence', 'licenceUrl', 'sourceUrl', 'credit')})
if errors: print('\n'.join('FAIL ' + e for e in errors)); sys.exit(1)
media_js = '/* Generated by build.py from data/media.json */\nvar MEDIA = ' + json.dumps({'items': media_items}, separators=(',', ':'), ensure_ascii=False) + ';'
js_parts = [read(SRC, f) for f in SCRIPTS]
js_parts.insert(SCRIPTS.index('app.js'), reviews_js)
js_parts.insert(SCRIPTS.index('media.js'), media_js)
html = shell.replace('/*CSS*/', read(SRC, 'style.css')).replace('/*JS*/', '\n'.join(js_parts))

def digest(paths, extra=b''):
    h = hashlib.sha256(extra)
    for p in paths: h.update(open(os.path.join(ROOT, p), 'rb').read())
    return h.hexdigest()[:12]
core_v = digest([p for p in PRECACHE if p not in ('./', 'index.html')], html.encode('utf-8'))
lazy_v = digest(LAZY)
sw = read(SRC, 'sw.js')
sw = (sw.replace('__CORE_VERSION__', core_v).replace('__3D_VERSION__', lazy_v)
        .replace('__PRECACHE__', json.dumps(PRECACHE)).replace('__LAZY__', json.dumps(LAZY)))

# 5. output checks
if re.search(r'/\*(CSS|JS)\*/', html): fail('index.html has an unreplaced marker')
if re.search(r'__[A-Z0-9_]+__', sw): fail('sw.js has an unreplaced placeholder')
for bad in ('cdn.jsdelivr.net', 'fonts.googleapis.com', 'fonts.gstatic.com', 'unpkg.com'):
    if bad in html: fail(f'index.html still references {bad}')
for ref in re.findall(r'(?:href|src)="((?:fonts|icons|vendor|models)/[^"#?]+)"', html) + ['manifest.webmanifest']:
    if not os.path.isfile(os.path.join(ROOT, ref)): fail(f'index.html refers to missing file {ref}')
try:
    man = json.loads(read(ROOT, 'manifest.webmanifest'))
    if man.get('start_url') != './' or man.get('scope') != './': fail('manifest start_url and scope must be "./" for the /first-aid-quick-guide/ path')
    for ic in man.get('icons', []):
        if not os.path.isfile(os.path.join(ROOT, ic['src'])): fail(f'manifest icon missing: {ic["src"]}')
except ValueError as e: fail(f'manifest.webmanifest is not valid JSON: {e}')
if node:
    with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False) as t: t.write(sw)
    r = subprocess.run([node, '--check', t.name], capture_output=True, text=True); os.unlink(t.name)
    if r.returncode: fail('generated sw.js has a syntax error')
if errors: print('\n'.join('FAIL ' + e for e in errors)); sys.exit(1)

open(os.path.join(ROOT, 'index.html'), 'w', encoding='utf-8').write(html)
open(os.path.join(ROOT, 'sw.js'), 'w', encoding='utf-8').write(sw)

# 6. report
size = lambda p: os.path.getsize(os.path.join(ROOT, p))
pre_bytes = len(html.encode()) + sum(size(p) for p in PRECACHE if p not in ('./', 'index.html'))
print(f'index.html  {len(html.encode()) / 1024:.0f} KB')
print(f'sw.js       core {core_v}, 3D {lazy_v}')
print(f'precache    {len(PRECACHE)} entries, about {pre_bytes / 1024:.0f} KB')
print(f'diagrams    {len(media_items)} from Wikimedia Commons ({", ".join(i["id"] for i in media_items)})')
print(f'3D on use   {len(LAZY)} files, {sum(size(p) for p in LAZY) / 1024:.0f} KB')
print(f'structure   {structure}')
print(f'{governance}')
for w in warnings: print('WARN ' + w)
print('BUILD OK')
