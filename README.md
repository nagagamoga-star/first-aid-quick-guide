# First Aid Quick Guide

A free, illustrated, step-by-step first aid guide for Australia. It works on a phone, installs as an app and works offline.

**Live site:** https://nagagamoga-star.github.io/first-aid-quick-guide/

> **Status: in development. Not yet reviewed by a clinician or first aid trainer.**
> The written steps are summarised from the ANZCOR guidelines and link to them, but no qualified person has checked them yet. Many pictures are AI-generated and some show technique that doesn't match the steps (see [Known issues](#known-issues)). It doesn't replace a first aid course. In an emergency, call **000**.

## Why this exists

I'm an IT professional in Townsville, not a medical educator or an illustrator. I wanted a first aid guide that is free, quick to use on a phone, covers North Queensland risks like box jellyfish, Irukandji, snakes and heat, and still works without signal. I built it with AI tools to see whether they can help one person make something useful that otherwise wouldn't get made, with the checks that a health resource needs.

## What it does

- **Flip through** illustrated topic cards at the top of the home page, or filter the topic list
- **"What's happening?"** a few questions that follow ANZCOR's first steps (DRSABCD) and lead to the right topic, with when to call 000
- **Step cards** for each topic: swipe or tap through, or show all steps as a list. Topics that cover several emergencies (for example bluebottle, stonefish and box jellyfish) keep each one separate.
- **000 and the Poisons Information Centre (13 11 26)** always on screen
- **CPR beat:** beeps 110 times a minute and prompts for 2 breaths after every 30 compressions
- **3D "where on the body" views** on six topics, using BodyParts3D anatomy. They load only when tapped (about 0.5 MB).
- **Offline:** after one visit with a connection, every topic, the question flow and the CPR beat work without signal. Fonts and three.js are self-hosted, so the app requests nothing from other sites.
- Light and dark mode; a flat layout when the device is set to reduce motion

**Topics:** someone has collapsed (DRSABCD), CPR, choking, severe bleeding, anaphylaxis, heart attack, stroke, unconscious but breathing, snake bite, jellyfish and marine stings, asthma, burns, seizure, heat illness, poisoning and button batteries, spider bite.

## How AI was used

I'd rather say this plainly than have anyone find it.

| Part | How it was made |
|---|---|
| Code | Written with AI coding assistants (Claude and Cursor), working from my briefs. I set the requirements, looked at the results on my phone and approved every merge. |
| First aid text | Summarised from the named guidelines with AI help, then checked statement by statement against the live guideline pages. The guidelines are the source, not the AI. Every topic names its guideline and approval date. |
| Pictures | Step pictures, topic cards and the spider step pictures were generated with ChatGPT. Each one is labelled in the app as AI-generated and not clinically reviewed. |
| Checks | Automated tests check structure and behaviour, not medical accuracy. Medical accuracy needs a qualified person, and that review hasn't happened yet. |

What AI is **not** used for: deciding what the first aid steps are without a published source, or signing off its own work. Generated pictures are treated as drafts, not evidence of correct technique.

## Safeguards

- **Sources on every topic:** ANZCOR guidelines from [anzcor.org](https://www.anzcor.org/), with a few points from [ASCIA](https://www.allergy.org.au/) and [healthdirect](https://www.healthdirect.gov.au/). Checked against the live pages in November 2026.
- **Review status in the app:** each topic shows whether a qualified first aid trainer or clinician has reviewed it. Today none has.
- **Findings register** (`data/source-findings.json`): every place the app differs from, goes beyond or is unclear against its source, with a proposed fix for the reviewer. 43 are open, 4 of them high.
- **Release gate** (`tests/release_gate.mjs`): every change to medical content or pictures needs either a recorded clinical approval or a recorded owner decision before it can go live. The required GitHub check enforces it on `main`.
- **Owner decisions are logged, not hidden:** where I published something before review (the pictures), `data/topic-reviews.json` records who, when, why and exactly which content.

How content is sourced, checked and approved: [docs/CLINICAL_GOVERNANCE.md](docs/CLINICAL_GOVERNANCE.md).

## Known issues

- **No clinical review yet.** Every topic and picture is waiting for a qualified reviewer.
- **High findings open:**
  - anaphylaxis: the app names only EpiPen and Anapen, but four adrenaline devices are now approved in Australia, including a nasal spray (F01);
  - anaphylaxis: it doesn't say "if in doubt, give adrenaline" (F02);
  - button batteries: it misses the "nothing by mouth if there is bleeding" condition (F07);
  - pictures: the AI-generated pictures are unreviewed (F44).
- **Pictures that may show the wrong technique:**
  - infant back blows: the head is not clearly lower than the body;
  - adrenaline injector: held flat along the thigh in one picture;
  - nosebleed: pinching the bony bridge, not the soft part;
  - airway: no clear head tilt and chin lift;
  - recovery position: the knee is not clearly bent.
- **Inconsistent picture styles:** photo-style pictures, illustrated cards and older line drawings are mixed. Some pictures have words printed in them, which can't be corrected without regenerating the picture.

## Feedback wanted

Most useful, in this order:

1. **Accuracy:** especially from first aid trainers, paramedics, nurses and doctors. Anything that is wrong, unsafe, out of date or unclear.
2. **Accessibility:** screen readers, contrast, text size, motion, plain language.
3. **Usability:** can you find what you need fast on a phone, under stress, with poor signal?

Please [open an issue](https://github.com/nagagamoga-star/first-aid-quick-guide/issues). If you're qualified and willing to review a topic, say so in the issue.

## Credits

- First aid content summarised from **ANZCOR**, **ASCIA** and **healthdirect**, linked on each topic. This project isn't affiliated with or endorsed by any of them.
- 3D anatomy: **BodyParts3D**, © The Database Center for Life Science, [CC BY 4.0](https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html), simplified from the Human Atlas viewer. See [models/README.md](models/README.md).
- Fonts: Inter and Atkinson Hyperlegible (SIL Open Font License 1.1). three.js (MIT).
- Pictures: AI-generated with ChatGPT for this project (see `data/media.json`, `data/topic-cards.json` and `data/step-cards.json`). Earlier Wikimedia Commons diagrams are kept in `data/media.json` with their licences, but are no longer shown.

**Licence:** not chosen yet. Until there is one, please ask before reusing the code or pictures.

---

## For developers

### Project layout

```
index.html, sw.js   Built files (generated by src/build.py; committed because GitHub Pages serves them)
src/
  shell.html        Page markup and templates
  style.css         Styles and colour tokens (light and dark)
  topics.js         All first aid content and sources
  flow.js           Question flow
  app.js            Flip-through, step player, routing, CPR beat
  art.js            Line drawings (fallback when a picture can't load)
  media.js          Step pictures from data/media.json
  stepcards.js      Per-step picture cards from data/step-cards.json
  viewer.js         3D body viewer
  pwa.js, sw.js     Offline support, updates, install
  build.py          Checks and builds index.html and sw.js
data/               Content registers: sources, reviews, findings, pictures, cards
assets/             Pictures (diagrams/ and cards/)
tests/              Structure, governance, release gate and browser tests
tools/              Picture import, review sheets, review pack, icons, anatomy
docs/               Governance, review packs, audits and design notes
.github/workflows/  Release gate check; Commons diagram fetch
```

### Build

Change files in `src/` or `data/`, then:

```
python3 src/build.py
```

The build stops without writing anything if a file is missing, a check fails, or the output refers to a missing file or an outside site. Needs Python 3 (with Pillow for picture tools) and Node for the checks.

### Test

```
node tests/validate_structure.mjs          # structure
node tests/validate_governance.mjs         # source and review records
node tests/release_gate.mjs --changed-since origin/main   # what a pull request would need
python3 tests/browser_tests.py --pwa       # browser and offline suite (Playwright and Chrome)
```

The browser suite serves the repo under `/first-aid-quick-guide/` like GitHub Pages and blocks every other host. It covers navigation, search, all 16 topics, grouped steps, the question flow, the CPR beat, 3D, reduced motion and offline behaviour. It does not check whether the first aid is correct.

### Host

Any static host works; all paths are relative. Offline support needs HTTPS or `localhost`. To try it locally, run `python3 -m http.server` in the parent folder and open http://localhost:8000/first-aid-quick-guide/.
