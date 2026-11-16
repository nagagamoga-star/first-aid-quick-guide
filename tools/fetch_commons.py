"""Download the diagrams listed in data/media.json from Wikimedia Commons.

For every item that is not 'rejected':
  - asks the Commons API for the file's licence, author, credit and original URL;
  - refuses the file if its licence is not in the manifest's allowlist
    (public domain, CC0, CC BY, CC BY-SA);
  - downloads it to assets/diagrams/<id>.<ext>. Raster images are resized to at
    most 1200px wide and saved as WebP (resizing and format change only; noted
    in the credit). SVGs are stored as they are and shown through <img>, so any
    script inside them never runs;
  - writes licence, author, credit, source URL, size and sha256 back into the
    manifest.

It never changes 'decision': a person still has to look at each picture and
accept it. Run: python3 tools/fetch_commons.py   (needs network and Pillow)
"""
import hashlib, html, io, json, os, re, sys, time, urllib.parse, urllib.request
from datetime import datetime, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MANIFEST = os.path.join(ROOT, 'data', 'media.json')
OUT = os.path.join(ROOT, 'assets', 'diagrams')
API = 'https://commons.wikimedia.org/w/api.php'
UA = 'FirstAidQuickGuide/1.0 (https://github.com/nagagamoga-star/first-aid-quick-guide)'
MAX_W = 1200

def get(url):
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()

def plain(s):
    s = re.sub(r'<[^>]+>', '', s or '')
    return html.unescape(s).strip()

def allowed(lic, allow):
    norm = lic.replace('-', ' ').upper()
    if norm.startswith('PUBLIC DOMAIN') or norm.startswith('PD'):
        return 'Public domain' in allow or 'PD' in allow
    if norm.startswith('CC0'):
        return 'CC0' in allow
    if norm.startswith('CC BY SA'):
        return 'CC BY-SA' in allow
    if norm.startswith('CC BY') and not any(x in norm for x in ('NC', 'ND')):
        return 'CC BY' in allow
    return False

def main():
    from PIL import Image
    man = json.load(open(MANIFEST, encoding='utf-8'))
    allow = man['licenceAllowlist']
    os.makedirs(OUT, exist_ok=True)
    problems = []
    for it in man['items']:
        if it['decision'] in ('rejected', 'hidden', 'retired') or not it.get('commons'):
            continue
        q = urllib.parse.urlencode({'action': 'query', 'format': 'json', 'titles': it['commons'], 'prop': 'imageinfo',
                                    'iiprop': 'url|size|mime|extmetadata', 'iiextmetadatalanguage': 'en'})
        data = json.loads(get(API + '?' + q))
        page = next(iter(data['query']['pages'].values()))
        if 'imageinfo' not in page:
            problems.append(f"{it['id']}: not found on Commons ({it['commons']})"); continue
        ii = page['imageinfo'][0]; md = ii.get('extmetadata', {})
        lic = plain(md.get('LicenseShortName', {}).get('value', ''))
        if not lic or not allowed(lic, allow):
            problems.append(f"{it['id']}: licence '{lic or 'unknown'}' is not allowed; file not downloaded")
            it.update(licence=None, file=None); continue
        raw = get(ii['url'])
        if ii['mime'] == 'image/svg+xml':
            name = it['id'] + '.svg'; body = raw; w, h = ii.get('width'), ii.get('height'); changed = ''
        else:
            im = Image.open(io.BytesIO(raw)); im.load()
            if im.mode not in ('RGB', 'RGBA'): im = im.convert('RGBA')
            if im.width > MAX_W: im = im.resize((MAX_W, round(im.height * MAX_W / im.width)), Image.LANCZOS)
            buf = io.BytesIO(); im.save(buf, 'WEBP', quality=82, method=6); body = buf.getvalue()
            name = it['id'] + '.webp'; w, h = im.size; changed = 'Resized and converted to WebP.'
        with open(os.path.join(OUT, name), 'wb') as f: f.write(body)
        it.update(file='assets/diagrams/' + name, licence=lic,
                  licenceUrl=plain(md.get('LicenseUrl', {}).get('value', '')) or None,
                  author=plain(md.get('Artist', {}).get('value', '')) or None,
                  credit=(plain(md.get('Credit', {}).get('value', '')) + (' ' + changed if changed else '')).strip() or None,
                  sourceUrl=ii.get('descriptionurl'), sha256=hashlib.sha256(body).hexdigest(), width=w, height=h,
                  fetchedAt=datetime.now(timezone.utc).strftime('%Y-%m-%d'))
        print(f"ok  {it['id']}: {lic}, {it['author']}, {len(body)//1024} KB")
        time.sleep(1)
    json.dump(man, open(MANIFEST, 'w', encoding='utf-8'), indent=2, ensure_ascii=False)
    open(MANIFEST, 'a').write('\n')
    for p in problems: print('PROBLEM ' + p)
    return 0

if __name__ == '__main__':
    sys.exit(main())
