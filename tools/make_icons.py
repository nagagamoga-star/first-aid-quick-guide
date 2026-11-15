"""Render the app icons (PNG) from the favicon design. Usage: python3 tools/make_icons.py"""
import os
from playwright.sync_api import sync_playwright
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CROSS = '<path d="M26 14h12v12h12v12H38v12H26V38H14V26h12z" fill="#f3f4f4"/><circle cx="32" cy="32" r="5" fill="#6bd9c7"/>'
def svg(rounded, scale):
    bg = f'<rect width="64" height="64" rx="{13 if rounded else 0}" fill="#263b48"/>'
    t = (1 - scale) * 32
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">{bg}<g transform="translate({t} {t}) scale({scale})">{CROSS}</g></svg>'
ICONS = [('icon-192.png', 192, True, 1.0), ('icon-512.png', 512, True, 1.0),
         ('icon-maskable-512.png', 512, False, 0.62),  # content inside the 80% safe zone
         ('apple-touch-icon.png', 180, False, 0.86)]   # iOS rounds the corners itself
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome')
    for name, size, rounded, scale in ICONS:
        pg = b.new_page(viewport={'width': size, 'height': size})
        pg.set_content(f'<html><body style="margin:0;background:transparent">{svg(rounded, scale).replace("<svg ", f"<svg width=\"{size}\" height=\"{size}\" ")}</body></html>')
        pg.screenshot(path=os.path.join(root, 'icons', name), omit_background=rounded)
        pg.close(); print('wrote icons/' + name)
    b.close()
