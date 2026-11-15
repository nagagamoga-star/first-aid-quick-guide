# First Aid Quick Guide

An illustrated, step-by-step first aid guide for Australia. It's a single web page with no dependencies apart from Google Fonts.

- A 3D carousel of 16 topics, with search and quick links for when speed matters
- Illustrated step cards for each topic (swipe, tap or use the arrow keys), plus a list view
- An always-visible bar with 000 and the Poisons Information Centre (13 11 26)
- A CPR beat that beeps 110 times a minute and prompts for breaths after every 30 compressions
- North Queensland coverage: box jellyfish and Irukandji, snake bite, heat illness
- 3D "where on the body" views on six topics (CPR, choking, anaphylaxis, heart attack, stroke, asthma), using anatomy from BodyParts3D via the Human Atlas viewer. They load only when tapped, about 0.5 MB.
- Styled to match Human Atlas: cool clinical neutrals, slate, anatomy system colours and teal highlights. Emergency red is kept for 000 and life-threatening items.
- Works in light and dark mode, and falls back to a flat layout when the device is set to reduce motion

## Topics

Someone has collapsed (DRSABCD), CPR, choking, severe bleeding, anaphylaxis, heart attack, stroke, unconscious but breathing, snake bite, jellyfish and marine stings, asthma, burns, seizure, heat illness, poisoning and button batteries, spider bite.

## Sources

Every step is summarised from the guidelines of ANZCOR (Australian and New Zealand Committee on Resuscitation) at [anzcor.org](https://www.anzcor.org/). The guidelines were checked in November 2026. Each topic names its guideline and approval date on the page. A few points also cite [ASCIA](https://www.allergy.org.au/) and [healthdirect](https://www.healthdirect.gov.au/).

The 3D anatomy comes from BodyParts3D, © The Database Center for Life Science, licensed under CC Attribution 4.0 International. See [models/README.md](models/README.md). The captions beside the 3D views are general anatomy, not part of the ANZCOR guidelines.

## Review status

**This guide has not been reviewed by a clinician or first aid trainer.** The illustrations are simplified diagrams drawn for this project, not exact technique. Have a qualified trainer check the text and the drawings before anyone relies on it, especially CPR hand position, infant back blows and the snake-bite pressure bandage.

This is a quick reference. It doesn't replace a hands-on first aid and CPR course, and it isn't medical advice. In an emergency, call 000.

## Project layout

```
index.html        Built page
favicon.svg
models/           Simplified BodyParts3D anatomy for the 3D views (CC BY 4.0)
tools/
  build_anatomy.py  Rebuilds models/anatomy.b64.txt from Human Atlas model data
src/
  shell.html      Page markup and templates
  style.css       Styles and colour tokens (light and dark)
  art.js          Illustration library (inline SVG pictograms)
  topics.js       All first aid content and sources
  viewer.js       3D body viewer (three.js 0.147, loaded on demand from jsDelivr)
  app.js          Carousel, step player, routing, CPR beat
  build.py        Inlines src/ into index.html
```

## Editing

Change the files in `src/`, then rebuild:

```
python3 src/build.py
```

Content lives in `src/topics.js`. Each step has an illustration key (`a`), the text (`t`) and an optional group (`g`). A topic's optional `body` field sets its 3D view: the groups to show (`show`), the groups to highlight (`hi`) and the caption. Each topic's `src` field names the guideline the steps come from, so update it whenever the content changes.

## Hosting

Serve the folder from any static host, GitHub Pages included. The steps work from `index.html` alone. The 3D views also need `models/anatomy.b64.txt` next to it and an internet connection to load three.js, and they won't load if you open the file straight from disk (`file://`). To try it locally, run `python3 -m http.server` and open http://localhost:8000.
