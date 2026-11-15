# Baseline Technical Audit

Stage 0 of the enhancement brief (15 November 2026). This records the application as it stood before any Stage 1 changes. **No clinical content was changed.**

| Item | Value |
|---|---|
| Baseline commit | `00e83fb37b7970980943682cdd853ed903c6975c` ("Add 'What's happening?' question flow") on `main` |
| Development branch | `pwa-offline` |
| Live site | https://nagagamoga-star.github.io/first-aid-quick-guide/ |
| Audit environment | Linux, Chrome (headless, SwiftShader WebGL), Playwright, Node 22, Python 3.13 |
| Baseline test results | [`baseline/results.json`](baseline/results.json): 13 of 13 checks passed |

## 1. Repository structure

| Path | Role |
|---|---|
| `index.html` | Built single-page app. Pages serves this file, so it has to be committed. |
| `favicon.svg` | Site icon |
| `src/shell.html` | Page markup, `<template>`s for the CPR depth table and CPR beat |
| `src/style.css` | Tokens (light/dark), layout, illustrations, viewer, question flow |
| `src/art.js` | 57 inline SVG illustrations (`ART.svg(key)`) |
| `src/viewer.js` | 3D viewer (`Anatomy.mount/dispose`), lazy-loads three.js and the model |
| `src/topics.js` | 16 topics, 102 steps, sources and approval dates |
| `src/flow.js` | Question flow: 24 nodes, 21 paths |
| `src/app.js` | Carousel, search, step player, list view, routing, CPR beat, number styling |
| `src/build.py` | Inlines CSS and JS into `index.html` (no checks) |
| `models/anatomy.b64.txt` | 0.5 MB simplified BodyParts3D model (CC BY 4.0), `models/README.md` credit |
| `tools/build_anatomy.py` | Rebuilds the model from Human Atlas data |
| `tests/` (new in this stage) | `validate_structure.mjs`, `browser_tests.py` |

The brief says `src/flow.js` is missing from the README. The README already listed it at the baseline commit (added in `00e83fb`), so the brief's copy was probably taken before that commit.

## 2. Existing features (verified)

| Feature | How verified | Result |
|---|---|---|
| Persistent 000 and 13 11 26 bar, `tel:` links | Browser test | Pass |
| 3D topic carousel, previous/next, swipe, arrow keys | Browser test (buttons); swipe and keys checked manually earlier | Pass |
| Search and quick topic links | Browser test ("jellyfish" leaves one topic) | Pass |
| Illustrated step cards, all 16 topics to the last step | Browser test | Pass |
| List view | Browser test (16 steps on Marine) | Pass |
| Direct topic URLs and refresh on a topic URL | Browser test (`#snake` + reload) | Pass |
| Question flow, back and restart | Browser test; all 21 paths walked in an earlier session | Pass |
| CPR beat (110 a minute, breaths prompt after 30) | Browser test (counter advances) | Pass |
| Age-specific CPR depths | Present in CPR topic | Pass |
| 3D anatomy views (6 topics), lazy loading | Browser test (anaphylaxis) | Pass |
| Light and dark themes | Screenshots and accessibility scan in both | Pass |
| Reduced motion (flat carousel, no flips, no auto-rotate) | Browser test | Pass |
| BodyParts3D credit (CC BY 4.0) | Footer, each 3D panel, `models/README.md` | Present |

Structure check (`node tests/validate_structure.mjs`): unique topic IDs, required fields, valid severities, known illustration keys, known 3D groups, valid internal links, every flow destination exists, no loops, no unreachable nodes, every result links to a real topic. **Pass.**

## 3. Dependencies

| Dependency | Loaded from | When | Needed for | Offline today |
|---|---|---|---|---|
| Inter, Atkinson Hyperlegible | Google Fonts | Every load | Typography (falls back to system fonts) | No, falls back |
| three.js 0.147.0 + OrbitControls | jsDelivr | On "Show in 3D" | 3D views | No |
| `models/anatomy.b64.txt` | Same site | On "Show in 3D" | 3D views | No |
| Browser APIs | n/a | n/a | `DecompressionStream` (3D), WebGL (3D), Web Audio (CPR beat), `color-mix()` (CSS) | n/a |

No Subresource Integrity hashes are used on the jsDelivr scripts. No analytics, cookies, accounts or storage are used, and no personal data is collected.

## 4. Hosting configuration

- GitHub Pages, "Deploy from a branch": `main`, folder `/`. The built-in "pages build and deployment" workflow has succeeded on every commit so far.
- Site path: `/first-aid-quick-guide/`. All app paths are already relative (`models/anatomy.b64.txt`, `favicon.svg`), so the subdirectory works.
- No `.nojekyll`, so Pages runs Jekyll over the repo. It works today, but Jekyll skips files and folders starting with `_` and adds build time. Recommend adding `.nojekyll`.
- The app is also published as a Claude artifact. That host blocks service workers and `tel:` links inside its frame, so PWA features can only work on GitHub Pages and must fail quietly in the artifact.

## 5. Browser compatibility (from APIs used; not device-tested)

| Capability | Chrome/Edge | Safari (iOS/macOS) | Firefox | Effect if missing |
|---|---|---|---|---|
| Core page, steps, flow | Modern versions | Modern versions | Modern versions | n/a |
| `color-mix()` backgrounds | 111+ | 16.2+ | 113+ | Some tinted boxes lose their tint; text stays readable |
| `DecompressionStream` (3D) | 80+ | 16.4+ | 113+ | 3D panel says it's unavailable; steps unaffected |
| WebGL (3D) | Yes | Yes | Yes | Same as above |
| Web Audio (CPR beat) | Yes | Yes (needs a tap) | Yes | Counter still shows on screen |

**Not yet tested on real devices:** Android Chrome, iPhone Safari, tablets. That's an open item for Stage 6.

## 6. Accessibility observations (axe-core 4.10 scan, plus manual checks)

Existing strengths: visible focus rings, `aria-live` on the step card, CPR counter and flow, labelled controls, reduced-motion support, real buttons and links, `lang="en-AU"`.

| Finding | Where | Severity | Recommendation |
|---|---|---|---|
| Muted grey text `#68727d` on `#f3f4f4` is 4.44:1, just under 4.5:1 | Intro text, carousel position, notes, sources, tags (light theme) | Serious (WCAG 1.4.3) | Darken muted text slightly, e.g. `#5f6974` |
| Step counter `#68727d` on `#e9ecef` is 4.12:1 | Step player header | Serious | Same token fix |
| Red bold text on tinted red box is 4.31:1 in dark theme | "When to call 000" boxes | Serious | Lighten dark-theme red in that box, or use body ink with a red rule |
| Heading jumps from h1 to h3 | CPR depth cards | Moderate | Use h2 for the depth cards, or add an h2 wrapper |
| Touch targets under 44 px high (37–38 px) | Group jump chips, 3D view buttons, some links | WCAG 2.2 AA passes (24 px minimum); below the 44 px best practice | Increase padding to 44 px for emergency use |
| 3D views have no text alternative beyond the caption | 3D panels | Minor; the caption describes what's highlighted | Keep the caption as the text alternative; add `aria-describedby` |

These are recorded for Stage 6. None were fixed in Stage 0.

## 7. Performance observations

| Asset | Size | Gzip | When |
|---|---|---|---|
| `index.html` (all CSS, JS, 57 illustrations, content) | 107 KB | 33 KB | First load |
| Google Fonts (2 families, 6 weights) | ~150 KB (estimate) | n/a | First load, from Google |
| three.js + OrbitControls | 634 KB | ~160 KB | First 3D view |
| Anatomy model | 546 KB | (already compressed) | First 3D view |

The first load is light: one HTML request plus fonts. The 3D cost of about 1.2 MB is paid only on request.

## 8. Build process

`src/build.py` replaces two markers in `shell.html` with the CSS and the concatenated JS. It has no checks: a missing file or a syntax error in one script still produces an `index.html`, and that error breaks the whole page. Recommended (done in Stage 1): required-file checks, JavaScript syntax check with `node --check`, a check that the output contains no unreplaced markers, the structure check, and a summary report.

## 9. Technical risks

| Risk | Likelihood | Impact | Note |
|---|---|---|---|
| Content not clinically reviewed (steps, drawings, 3D captions, flow wording) | Certain (current state) | High | Stage 2 governance; needs a qualified human reviewer |
| No offline support: no signal means no guide | Likely in remote or marine settings | High | Stage 1 |
| CPR beat uses `setInterval`: drift, throttled in background tabs, audio suspends on screen lock | Likely on phones | Medium | Schedule beeps with Web Audio's clock; keep the on-screen counter; tell users to keep the screen on |
| A top-level JS error stops the whole app (single bundle) | Low | High | Build-time syntax check (Stage 1) and the test harness |
| `innerHTML` rendering | Low | Medium | Every string comes from repo source files. The search box is only used for matching and is never rendered. Keep that boundary: never feed user, URL or remote text into these templates. |
| Third-party CDNs (fonts, jsDelivr) unavailable or changed | Low | Medium (styling, 3D) | Self-host in Stage 1 |
| Jekyll processing of the repo | Low | Low | Add `.nojekyll` |
| `tel:` links don't dial inside the Claude artifact frame | Certain there | Medium | Numbers are shown as text; Pages is the primary host |

## 10. Missing documentation

- No contributor or testing instructions (added: `tests/` usage in README in Stage 1).
- No record of clinical review status per topic (Stage 2).
- No changelog or release process.
- No diagram of the question flow (Stage 3).

## 11. Recommended changes (by stage)

1. **Stage 1 (this branch):** manifest, icons, service worker, self-hosted fonts and three.js, offline indicator, update prompt, optional install, build validation, `.nojekyll`.
2. **Stage 2:** per-topic source and review register (`data/clinical-sources.json`), statuses as in the brief, reviewer sign-off.
3. **Stage 3:** flow diagram, flow checks in CI.
4. **Stage 5:** move the CPR beat to Web Audio scheduling; add mute and a larger display.
5. **Stage 6:** fix the contrast, heading and touch-target findings above; real-device testing.
