"""Browser regression and offline tests (Playwright + Chrome).

Serves the repo under /first-aid-quick-guide/ to match GitHub Pages, then runs
functional checks and, with --pwa, offline/service-worker checks.

Usage:
  python3 tests/browser_tests.py [--pwa] [--chrome /usr/bin/google-chrome] [--json out.json] [--shots DIR]
Network: requests to other hosts are blocked so tests show what works without them.
For the pre-PWA baseline, --cdn-dir can point at a local three.js package to stand in for jsDelivr.
"""
import argparse, json, os, sys, threading, time, tempfile, functools, http.server, socketserver
from playwright.sync_api import sync_playwright

ap = argparse.ArgumentParser()
ap.add_argument('--pwa', action='store_true')
ap.add_argument('--chrome', default='/usr/bin/google-chrome')
ap.add_argument('--json'); ap.add_argument('--shots')
ap.add_argument('--cdn-dir', help='folder holding build/three.min.js and examples/js/controls/OrbitControls.js')
ap.add_argument('--port', type=int, default=8790)
args = ap.parse_args()
repo = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
site = tempfile.mkdtemp(); os.symlink(repo, os.path.join(site, 'first-aid-quick-guide'))

class H(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache'); super().end_headers()
socketserver.TCPServer.allow_reuse_address = True
httpd = socketserver.ThreadingTCPServer(('127.0.0.1', args.port), functools.partial(H, directory=site))
threading.Thread(target=httpd.serve_forever, daemon=True).start()
BASE = f'http://127.0.0.1:{args.port}/first-aid-quick-guide/'
TOPICS = ['collapse','cpr','choking','bleeding','anaphylaxis','heart','stroke','unconscious','snake','marine','asthma','burns','seizure','heat','poison','spider']
BODY = ['cpr','choking','anaphylaxis','heart','stroke','asthma']
results = []; external = set()

def rec(area, name, passed, detail=''):
    results.append({'area': area, 'test': name, 'result': 'PASS' if passed else 'FAIL', 'detail': detail})
    print(('PASS ' if passed else 'FAIL ') + f'[{area}] {name}' + (f' :: {detail}' if detail else ''))

def router(route):
    u = route.request.url
    if u.startswith(f'http://127.0.0.1:{args.port}/'): return route.continue_()
    if args.cdn_dir and 'cdn.jsdelivr.net/npm/three@' in u:
        tail = u.split('three@')[1].split('/', 1)[1]
        return route.fulfill(path=os.path.join(args.cdn_dir, tail), content_type='text/javascript')
    external.add(u.split('/')[2]); return route.abort()

def safe(area, name, fn):
    try: fn()
    except Exception as e: rec(area, name, False, str(e).splitlines()[0][:200])

with sync_playwright() as p:
    b = p.chromium.launch(executable_path=args.chrome, args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
    ctx = b.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2)
    ctx.route('**/*', router)
    errs = []
    pg = ctx.new_page(); pg.on('pageerror', lambda e: errs.append(str(e)))

    def t_home():
        pg.goto(BASE); pg.wait_for_timeout(600)
        rec('core', 'Home loads with 000 and 13 11 26 bar', pg.is_visible('.call.e') and pg.is_visible('.call.p'))
        rec('core', '000 link targets tel:000', pg.get_attribute('.call.e', 'href') == 'tel:000')
        pg.click('#nextBtn'); pg.wait_for_timeout(500); a = pg.inner_text('#cpos'); pg.click('#prevBtn'); pg.wait_for_timeout(500)
        rec('core', 'Carousel next/previous', a == '2 / 16' and pg.inner_text('#cpos') == '1 / 16', a)
        pg.fill('#find', 'jellyfish'); pg.wait_for_timeout(100)
        vis = pg.eval_on_selector_all('#chipsWrap a', 'as => as.filter(a => !a.hidden).map(a => a.textContent)')
        rec('core', 'Search filters topics', vis == ['Jellyfish and marine stings'], str(vis))
        pg.fill('#find', '')
        if args.shots: pg.screenshot(path=os.path.join(args.shots, 'home.png'))
    safe('core', 'home', t_home)

    def t_topics():
        bad = []
        for t in TOPICS:
            pg.goto(BASE + '#' + t); pg.wait_for_timeout(120)
            n = int(pg.inner_text('#pc').split('/')[1])
            for _ in range(n - 1): pg.click('#pNext')
            if not pg.is_disabled('#pNext'): bad.append(t)
        rec('core', 'All 16 topics open and step to the last card', not bad, ','.join(bad))
        pg.goto(BASE + '#marine'); pg.wait_for_timeout(150); pg.click('#toggle')
        rec('core', 'List view shows all steps', pg.locator('#list .li').count() == 16)
        pg.goto(BASE + '#snake'); pg.reload(); pg.wait_for_timeout(300)
        rec('core', 'Refresh on a topic URL reopens that topic', pg.is_visible('#topic') and 'Snake' in pg.inner_text('#tTitle'))
    safe('core', 'topics', t_topics)

    def t_flow():
        pg.goto(BASE + '#help'); pg.wait_for_timeout(200)
        pg.click(".fbtn[data-i='0']"); pg.click(".fbtn[data-i='0']"); pg.click(".fbtn[data-i='0']")
        ok = 'Start CPR' in pg.inner_text('.fq') and pg.get_attribute('.fgo', 'href') == '#cpr'
        pg.click('#fBack'); back = 'breathing normally' in pg.inner_text('.fq')
        rec('core', 'Question flow reaches CPR, and Previous question works', ok and back)
    safe('core', 'flow', t_flow)

    def t_beat():
        pg.goto(BASE + '#cpr'); pg.wait_for_timeout(200); pg.click('#beatBtn'); pg.wait_for_timeout(2300)
        c = pg.inner_text('#beatCount'); pg.click('#beatBtn')
        rec('core', 'CPR beat counts compressions', c.strip().isdigit() and int(c) >= 3, c)
    safe('core', 'beat', t_beat)

    def t_3d(area='core', label='3D view loads'):
        pg.goto(BASE + '#anaphylaxis'); pg.wait_for_timeout(200); pg.click('.v3d-load'); pg.wait_for_timeout(4000)
        st = pg.inner_text('.v3d-status'); rec(area, label, 'Drag' in st, st)
        if args.shots and area == 'core': pg.locator('#v3d').screenshot(path=os.path.join(args.shots, '3d.png'))
    safe('core', '3d', t_3d)

    def t_review():
        pg.goto(BASE + '#anaphylaxis'); pg.wait_for_timeout(200)
        a = pg.inner_text('#topic .rstatus') if pg.locator('#topic .rstatus').count() else ''
        pg.goto(BASE + '#help'); pg.wait_for_timeout(200)
        b2 = pg.inner_text('#help .rstatus') if pg.locator('#help .rstatus').count() else ''
        rec('core', 'Review status shows on topics and the question flow', 'Not yet reviewed' in a and 'Not yet reviewed' in b2, a)
        if args.shots: pg.goto(BASE + '#anaphylaxis'); pg.wait_for_timeout(200); pg.locator('#topic .src').scroll_into_view_if_needed(); pg.screenshot(path=os.path.join(args.shots, 'review-status.png'))
    safe('core', 'review', t_review)

    def t_reduce():
        p2 = ctx.new_page(); p2.emulate_media(reduced_motion='reduce'); p2.goto(BASE); p2.wait_for_timeout(300)
        rec('core', 'Reduced motion gives a flat carousel', 'flat' in p2.eval_on_selector('#stage', 'e => e.className')); p2.close()
    safe('core', 'reduce', t_reduce)

    if args.pwa:
        def t_pwa():
            pg.goto(BASE); pg.wait_for_timeout(300)
            man = pg.evaluate("fetch(document.querySelector('link[rel=manifest]').href).then(r => r.json())")
            rec('pwa', 'Manifest loads with standalone display and scoped start URL', man.get('display') == 'standalone' and man.get('start_url') == './' and man.get('scope') == './', json.dumps({k: man.get(k) for k in ('start_url','scope','display')}))
            pg.wait_for_function('navigator.serviceWorker && navigator.serviceWorker.controller !== null || (location.reload(), false)', timeout=15000)
            pg.reload(); pg.wait_for_timeout(500)
            ctl = pg.evaluate('navigator.serviceWorker.controller && navigator.serviceWorker.controller.scriptURL')
            rec('pwa', 'Service worker controls the page, scoped to /first-aid-quick-guide/', bool(ctl) and ctl.endswith('/first-aid-quick-guide/sw.js'), ctl or '')
            # warm the 3D cache once online
            pg.goto(BASE + '#cpr'); pg.wait_for_timeout(200); pg.click('.v3d-load'); pg.wait_for_timeout(4000)
            ctx.set_offline(True)
            pg.goto(BASE); pg.wait_for_timeout(600)
            rec('pwa', 'Opens with no network (airplane mode)', pg.is_visible('#stage'))
            rec('pwa', 'Offline indicator shows', pg.is_visible('#netStatus') and 'Offline' in pg.inner_text('#netStatus'), pg.inner_text('#netStatus') if pg.locator('#netStatus').count() else 'missing')
            fonts = pg.evaluate("document.fonts.check('700 20px Inter') && document.fonts.check('400 17px \"Atkinson Hyperlegible\"')")
            rec('pwa', 'Fonts load offline (self-hosted)', fonts)
            pg.fill('#find', 'snake'); pg.wait_for_timeout(100)
            rec('pwa', 'Search works offline', pg.eval_on_selector_all('#chipsWrap a', 'as => as.filter(a => !a.hidden).length') == 1)
            bad = []
            for t in TOPICS:
                pg.goto(BASE + '#' + t); pg.wait_for_timeout(80)
                # A step shows a drawing (inline SVG) or a Commons diagram that loaded from the cache.
                pic = pg.is_visible('#pcard svg') or pg.evaluate("(()=>{const i=document.querySelector('#pcard .dg img');if(!i)return false;i.loading='eager';return new Promise(r=>{if(i.complete)return r(i.naturalWidth>0);i.onload=()=>r(true);i.onerror=()=>r(false)})})()")
                if not pic and not pg.query_selector('#pcard .pic-hidden'): bad.append(t)  # text-only steps are by design
            rec('pwa', 'All 16 topics and illustrations work offline', not bad, ','.join(bad))
            pg.goto(BASE + '#help'); pg.wait_for_timeout(150); pg.click(".fbtn[data-i='1']")
            rec('pwa', 'Question flow works offline', 'Stay back' in pg.inner_text('.fq'))
            pg.goto(BASE + '#cpr'); pg.wait_for_timeout(150); pg.click('#beatBtn'); pg.wait_for_timeout(1700); c = pg.inner_text('#beatCount'); pg.click('#beatBtn')
            rec('pwa', 'CPR beat works offline', c.strip().isdigit(), c)
            t_3d('pwa', '3D view works offline after first use')
            p3 = ctx.new_page(); p3.goto(BASE + '#heart'); p3.wait_for_timeout(500)
            rec('pwa', 'Deep link to a topic opens offline in a new tab', p3.is_visible('#topic') and 'Heart' in p3.inner_text('#tTitle')); p3.close()
            p4 = ctx.new_page(); p4.goto(BASE + 'index.html?utm=x#stroke'); p4.wait_for_timeout(400)
            rec('pwa', 'URL with query string falls back to the cached page offline', p4.is_visible('#topic')); p4.close()
            if args.shots: pg.goto(BASE); pg.wait_for_timeout(400); pg.screenshot(path=os.path.join(args.shots, 'offline-home.png'))
            ctx.set_offline(False)
            pg.goto(BASE); pg.wait_for_timeout(500)
            rec('pwa', 'Offline indicator clears when back online', not pg.is_visible('#netStatus'))
        safe('pwa', 'pwa', t_pwa)

        def t_fail3d():
            c2 = b.new_context(viewport={'width': 390, 'height': 844}); c2.route('**/*', lambda r: r.abort() if 'anatomy' in r.request.url else router(r))
            q = c2.new_page(); q.goto(BASE + '#anaphylaxis'); q.wait_for_timeout(300); q.click('.v3d-load'); q.wait_for_timeout(2500)
            rec('pwa', 'Failed 3D load leaves first aid steps working', 'cover everything' in q.inner_text('.v3d-status') and q.is_visible('#pcard'), q.inner_text('.v3d-status'))
            c2.close()
        safe('pwa', 'fail3d', t_fail3d)

        def t_update():
            swp = os.path.join(repo, 'sw.js'); orig = open(swp).read()
            c3 = b.new_context(viewport={'width': 390, 'height': 844}); c3.route('**/*', router)
            q = c3.new_page(); q.goto(BASE); q.wait_for_timeout(300)
            q.wait_for_function('navigator.serviceWorker.controller !== null || (location.reload(), false)', timeout=15000)
            q.wait_for_timeout(500)
            before = q.evaluate('caches.keys()')
            try:
                open(swp, 'w').write(orig.replace("var CORE = 'fa-core-", "var CORE = 'fa-core-t") + '\n// test update\n')
                q.evaluate('navigator.serviceWorker.getRegistration().then(r => r.update())')
                q.wait_for_selector('#updBar:not([hidden])', timeout=15000)
                rec('pwa', 'New version shows the "Reload" bar instead of switching mid-use', True)
                with q.expect_navigation(timeout=15000): q.click('#updBtn')
                q.wait_for_timeout(800)
                after = q.evaluate('caches.keys()')
                old_core = [k for k in before if k.startswith('fa-core-')]
                rec('pwa', 'Tapping Reload activates the new version and deletes the old cache',
                    any(k.startswith('fa-core-t') for k in after) and not any(k in after for k in old_core) and q.is_visible('#stage'),
                    f'before={before} after={after}')
            finally:
                open(swp, 'w').write(orig); c3.close()
        safe('pwa', 'update', t_update)

        def t_interrupted():
            blocked = {'on': True}
            def r2(r):
                if blocked['on'] and r.request.url.endswith('icons/icon-512.png'): return r.abort()
                return router(r)
            c4 = b.new_context(viewport={'width': 390, 'height': 844}); c4.route('**/*', r2)
            q = c4.new_page(); q.goto(BASE); q.wait_for_timeout(3000)
            first = q.evaluate('navigator.serviceWorker.controller === null') and q.is_visible('#stage')
            keys = q.evaluate('caches.keys()')
            blocked['on'] = False
            q.reload(); q.wait_for_function('navigator.serviceWorker.controller !== null || (location.reload(), false)', timeout=15000)
            rec('pwa', 'Interrupted install: page still works, nothing half-saved, next visit installs', first and not any(k.startswith('fa-core-') for k in keys), f'caches during failure={keys}')
            c4.close()
        safe('pwa', 'interrupted', t_interrupted)

        def t_cleared():
            c5 = b.new_context(viewport={'width': 390, 'height': 844}); c5.route('**/*', router)
            q = c5.new_page(); q.goto(BASE); q.wait_for_timeout(300)
            q.wait_for_function('navigator.serviceWorker.controller !== null || (location.reload(), false)', timeout=15000)
            q.evaluate('caches.keys().then(ks => Promise.all(ks.map(k => caches.delete(k))))')
            q.reload(); q.wait_for_timeout(800)
            online_ok = q.is_visible('#stage')
            c5.set_offline(True); q.reload(); q.wait_for_timeout(600)
            rec('pwa', 'Cleared cache: still loads online, re-saves itself, then works offline again', online_ok and q.is_visible('#stage'))
            c5.close()
        safe('pwa', 'cleared', t_cleared)

    rec('core', 'No JavaScript errors', not errs, '; '.join(errs)[:300])
    rec('info', 'External hosts requested (blocked in test)', True, ', '.join(sorted(external)) or 'none')
    b.close()
httpd.shutdown()
if args.json: json.dump(results, open(args.json, 'w'), indent=1)
fails = [r for r in results if r['result'] == 'FAIL']
print(f"\n{len(results) - len(fails)} passed, {len(fails)} failed")
sys.exit(1 if fails else 0)
