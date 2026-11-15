# First Aid Quick Guide

An illustrated, step-by-step first aid guide for Australia. It's a single web page with no dependencies apart from Google Fonts.

- A 3D carousel of 16 topics, with search and quick links for when speed matters
- Illustrated step cards for each topic (swipe, tap or use the arrow keys), plus a list view
- An always-visible bar with 000 and the Poisons Information Centre (13 11 26)
- A CPR beat that beeps 110 times a minute and prompts for breaths after every 30 compressions
- North Queensland coverage: box jellyfish and Irukandji, snake bite, heat illness
- Works in light and dark mode, and falls back to a flat layout when the device is set to reduce motion

## Topics

Someone has collapsed (DRSABCD), CPR, choking, severe bleeding, anaphylaxis, heart attack, stroke, unconscious but breathing, snake bite, jellyfish and marine stings, asthma, burns, seizure, heat illness, poisoning and button batteries, spider bite.

## Sources

Every step is summarised from the guidelines of ANZCOR (Australian and New Zealand Committee on Resuscitation) at [anzcor.org](https://www.anzcor.org/). The guidelines were checked in November 2026. Each topic names its guideline and approval date on the page. A few points also cite [ASCIA](https://www.allergy.org.au/) and [healthdirect](https://www.healthdirect.gov.au/).

## Review status

**This guide has not been reviewed by a clinician or first aid trainer.** The illustrations are simplified diagrams drawn for this project, not exact technique. Have a qualified trainer check the text and the drawings before anyone relies on it, especially CPR hand position, infant back blows and the snake-bite pressure bandage.

This is a quick reference. It doesn't replace a hands-on first aid and CPR course, and it isn't medical advice. In an emergency, call 000.

## Project layout

```
index.html        Built page: open it directly or host it anywhere
src/
  shell.html      Page markup and templates
  style.css       Styles and colour tokens (light and dark)
  art.js          Illustration library (inline SVG pictograms)
  topics.js       All first aid content and sources
  app.js          Carousel, step player, routing, CPR beat
  build.py        Inlines src/ into index.html
```

## Editing

Change the files in `src/`, then rebuild:

```
python3 src/build.py
```

Content lives in `src/topics.js`. Each step has an illustration key (`a`), the text (`t`) and an optional group (`g`). Each topic's `src` field names the guideline the steps come from, so update it whenever the content changes.

## Hosting

`index.html` is self-contained, so any static host will serve it, GitHub Pages included.
