# Flagship UI redesign

A navigation and presentation change for the Australian first aid guide. Protocol text, step order, question-flow nodes, captions, phone numbers and drawing geometry stay as they are in `src/topics.js`, `src/flow.js` and `src/art.js`. This document is the map for the new interface.

## What a stressed person should be able to do

From the first screen, with one thumb, without scrolling:

1. Call **000** (the largest control in the dock).
2. Open **CPR** if the person is not responding and not breathing normally.
3. Open the topic list (the Topics button, or Ctrl/Cmd+K, or `/`).

Everything else — the category grid, the question flow, the secondary flip-through — sits under those three.

## Navigation

```
load
  ├─ tap Call 000            tel:000          (always in the dock)
  ├─ tap 13 11 26            tel:131126       (always in the dock)
  ├─ tap Start CPR           #cpr             (first content block)
  ├─ tap Not sure…           #help            (question flow, unchanged)
  ├─ tap a topic tile        #topic-id        (category grid)
  ├─ Topics / Ctrl+K / /     command palette  (jump from any screen)
  └─ ‹ › under “Or flip through”              (secondary, kept)
```

Inside a topic:

```
← All topics
heading, “when” line, review status (at the foot, with the source)
step deck:  progress rail, recessed drawing, instruction, Back / Next
            swipe, or Left / Right while the deck is focused
Show all steps as a list     (ordered list, same words)
3D body view, where the topic has one, in the same kind of frame
previous / next topic        (secondary)
```

Without JavaScript the dock, the CPR link and a written ordered list of every topic still work. The list is generated from `src/topics.js` at build time (`src/noscript.mjs`), so it cannot drift from the interactive steps. The question flow and the CPR beat need JavaScript.

## Surfaces

| Surface | Role | Material |
|---|---|---|
| Dock | Calls, Topics, offline state | Floating, 94% slate, 16px blur. Solid slate if `backdrop-filter` is missing or `prefers-reduced-transparency: reduce`. |
| Paper | Page background | Warm off-white / near-black. Instructions never sit on the glass. |
| Card | Steps, tiles, questions | Opaque, raised, top highlight, press sinks 2px. |
| Illustration | Step drawing | Edge to edge on the step sheet. The sheet is a soft, uneven radius, not a bezel. The drawing’s own geometry is not changed in this pull request. |
| Body view | 3D anatomy | A soft stage beside or under the sheet. Not a device frame. |
| Palette | Jump list | Opaque sheet over a dim scrim, so names stay readable. Slides up on a phone; fades in from the top on a wide screen. Instant if reduced motion is set. |
| Alarm key | Call 000 | Solid red, white type, tallest control. Not translucent. |

Glass is only the dock. A translucent instruction card would put body text over moving content, so step text, “Don’t” lists and the question flow stay on solid cards.

## Colour

Light and dark follow `prefers-color-scheme`. Tokens live on `:root` in `src/style.css`.

| Token | Light | Dark | Use |
|---|---|---|---|
| Paper | `#f4f0e6` | `#12161b` | Page |
| Card | `#fffdf8` | `#1c222a` | Instructions |
| Ink | `#1c1917` | `#f4efe6` | Body text, 15:1 on paper |
| Muted | `#5c564c` | `#c8bfb2` | Secondary text, above 6:1 on paper and card |
| Alarm | `#c4122f` | `#ff6170` | 000, life-threatening, current step |
| Dock | `#1c2c3a` | `#1c2c3a` | Bar. Text `#f7f4ee` at 13:1 on the solid colour |
| Warn | `#7a5610` | `#e6c06a` | Urgent badges, “Don’t” |
| Calm | `#0f5e56` | `#6bd9c7` | Lower urgency, helper teal family |
| Focus | `#0b5cab` | `#9dccff` | 3px outline, offset, on every control |

Casualty and helper are paint only (CSS variables consumed by the existing classes in the drawings):

- Person (`.pt`, `.ptl`): clay `#7a5346` (light) / `#d2a08e` (dark)
- Helper (`.rsl`): teal `#0e7c72` / `#5dcec2`
- Skin tones are unchanged

A one-line key under the deck reads “Person” and “Helper”. It describes the colours. It does not add a technique.

Urgency on a topic tile is the topic’s existing `sev` and `tag`: a clay/red/amber/teal stripe and icon, plus the tag as a badge from 420px wide. The category heading carries the group name on a narrow screen so the badge cannot crush the title.

## Type

Body is **Atkinson Hyperlegible**, headings are **Inter**. Both are already self-hosted (Latin WOFF2, SIL Open Font License 1.1) and the offline check looks for them.

Figtree and Fraunces were the preferred pair elsewhere, and only if self-hosted and small. They are not used here. Adding two more families would grow the precache, and a display serif is a poor face for instructions read in a hurry. Phone numbers stay in Inter so the slashed Atkinson zero is not used for 000.

Body size is 18px, step text 20px, line-height 1.5. Headings use `text-wrap: balance`.

## Topic categories

The four groups are a menu. They do not change a topic’s tag, severity or steps. Each topic appears once.

| Category | Topics, in order |
|---|---|
| Life-threatening | Someone has collapsed, CPR, Choking, Severe bleeding, Anaphylaxis, Heart attack, Stroke, Unconscious but breathing |
| Bites & stings | Snake bite, Jellyfish and marine stings, Spider bite |
| Injuries & burns | Burns and scalds |
| Medical | Asthma attack, Seizure, Heat illness, Poisoning |

Severe bleeding stays under Life-threatening because that is how the topic is already tagged, and it is the place a person looks when blood will not stop. Burns is the only topic whose subject is an injury or a burn rather than a life-threatening protocol, a bite or sting, or an illness. Spider bite stays with the bites; its own tag still says “Usually not urgent”, and funnel-web is still inside that topic with the pressure bandage and splint.

## How the 16 topics and the step drawings appear

Every topic is reachable four ways: category tile, command palette, secondary flip-through, and previous/next at the foot of a topic. The question flow is a fifth door and is unchanged.

Menu symbols (`src/marks.js`) are original 24×24 drawings: 2px round strokes, a low-opacity duotone fill, coloured by urgency. They are used on tiles and in the palette only. They are not the step illustrations. Health Icons (healthicons.org) are CC0 and were the style reference; these paths were drawn for this guide and are not copies of that set. Credit sits in the footer.

## Illustration slot

`src/illustrate.js` is the only way the page asks for a picture.

```
slot = { id, topic, step, key, label, spec }
id   = "<topicId>:<stepIndex>"     stepIndex is "icon" for the topic symbol
```

`Illustrate.render(slot)` walks renderers registered with `Illustrate.use(fn)`. A renderer returns an HTML string or `""` to decline. The built-in renderer calls `ART.svg(spec)`, so the drawings in `src/art.js` still appear, unchanged. A later clinical set can register another renderer, or replace `src/art.js`, without the layout knowing about stroke width or canvas size.

The markup around a picture is only `<div class="illust" data-slot="cpr:0">`. It is edge to edge. It is not a viewport, a bezel or a frame copied from the current pictogram style.

Topics with a `body` field (CPR, choking, anaphylaxis, heart attack, stroke, asthma) also get the 3D view, in a soft stage, beside the sheet from 980px wide and under it on a phone.

The step keys below are what the built-in renderer still draws. They are not a layout contract.

| Topic | Menu symbol | Step drawings (unchanged keys) | 3D |
|---|---|---|---|
| collapse | person | danger, shoulders, phone, airway, breathing, compress, aed | no |
| cpr | press | handpos, compress, breaths, compress, aed, timer | yes |
| choking | throat | phone, backblows, handpos, repeat55, compress, infant, twofinger | yes |
| bleeding | drop | pressure, pressure, embedded, tourniquet, nose | no |
| anaphylaxis | pen | layflat, autoinjector, phone, puffer, timer, compress | yes |
| heart | heart | situp, spray, phone, aspirin, aedbox, compress | yes |
| stroke | face | fast, arms, speech, phone, recovery, compress | yes |
| unconscious | side-lying | recovery, phone, pressure, breathing | no |
| snake | snake | still, bitewrap, bandage, splint, compress | no |
| marine | jellyfish | beach, phone, compress, vinegar, seawater, coldpack, timer, seawater, hotwater, phone, phone, embedded, hotwater, splint, breathing, breaths | no |
| burns | flame | stopdrop, tap, ring, cling, blanket, tap, power | no |
| asthma | lungs | situp, puffer, timer, phone | yes |
| seizure | zigzag | seizure, timer, recovery | no |
| heat | sun | shade, coolwater, icepacks, icepacks, cup, breathing | no |
| poison | bottle | danger, cup, tap, eye, air, bottle, hospital, honey, honey | no |
| spider | spider | phone, splint, coldpack, nobandage, hospital | no |

Timed and labelled drawings (`timer`, `tap`, `honey`, `phone`, `coldpack`) still pass the same second argument through `ART.svg`. The viewport does not clip the label.

## Command palette

- Opens from **Topics**, **Ctrl+K** or **Cmd+K** (toggles), and **`/`** when focus is not in a field.
- Closes on Escape, the scrim, Close, or choosing a topic. Focus returns to Topics unless a topic heading is about to take focus.
- The input is a combobox (`aria-autocomplete="list"`, `aria-controls`, `aria-activedescendant`). The list is a `listbox` of `option`s grouped with `role="group"` and a visible category name.
- Empty query: all 16, in the category order above. A query hides non-matches and empty groups, and moves the active option to the best match.
- Matching is a short hand-rolled score: exact substring wins, then a subsequence that rewards consecutive letters and word starts. It searches title, short line, tag, keywords and id.
- Arrow keys, Home and End move. Enter opens. Options are at least 48px tall. The list scrolls inside the sheet; the page underneath does not.

The on-page field labelled “Filter topics” is separate. It filters the grid in place with a plain substring match, which is the right tool when you are already looking at the list.

## Step deck

The deck is one sheet with an uneven corner radius and two soft colour washes. It is not a stack of panels.

- A thin progress line (a 44px-tall progressbar, so it can be clicked) fills as you advance. Clicking it scrubs. Back and Next stay the large targets.
- The drawing runs edge to edge across the sheet. The instruction flows underneath, on the same surface, in the same column on a phone and on a desktop. There is no side-by-side “figure box”.
- Back / Next, the dot row (or a bar when there are more than ten steps), swipe, and Left/Right.
- “Show all steps as a list” reveals the same steps as an ordered list with the same drawings. That control is unchanged in behaviour.
- Motion: the card turns in from the side. `prefers-reduced-motion: reduce` drops the turn, the palette slide, the coverflow and the tilt, and the flip-through becomes a flat row.

## Layout

### Phone (320–430 wide)

```
┌────────────────────────────┐
│ First Aid        [Topics]  │  sticky frosted dock
│ ┌────────────────────────┐ │
│ │     CALL 000           │ │  tallest, full width
│ │     Ambulance          │ │
│ └────────────────────────┘ │
│ ┌────────────────────────┐ │
│ │  13 11 26    Poisons   │ │
│ └────────────────────────┘ │
└────────────────────────────┘
┌────────────────────────────┐
│ START CPR                  │  one tap, #cpr
│ Not responding and not     │
│ breathing normally      →  │
└────────────────────────────┘
 What to do in an emergency
 ┌────────────────────────┐
 │ call 000 first …       │
 └────────────────────────┘
 Not sure what to do?
 Life-threatening
 ┌──┐ Someone has collapsed
 ┌──┐ CPR
 ...
 Bites & stings / Injuries & burns / Medical
 [ Filter topics ________ ]
 Or flip through          (secondary  ‹  1 / 16  ›)
 About, licences, offline
```

### Topic, phone

```
┌ dock, Call 000 still full width ┐
 ← All topics
 CPR
 [████████░░░░]  step 2 of 6
 (drawing bleeds to the sheet edges)
 Step 2 of 6
 Push hard and fast…
 [ Back ]          [ Next ]
 Person ■   Helper ■
 3D frame (if this topic has one)
```

### Desktop (about 1000+)

```
┌ First Aid   [Topics  Ctrl K]     [CALL 000] [13 11 26] ┐
│ START CPR          Not sure?                            │
│ category grid, two columns                              │
│ secondary flip-through                                  │
Topic:
│ step deck (drawing | text)     │  3D viewport, sticky  │
```

Targets are at least 44px (step dots stay 24px, which meets WCAG 2.5.8, and sit on their own row on a narrow screen). The layout was checked at 320px wide so the dock and the CPR control do not overflow.

## Motion and fallbacks

| Preference | What happens |
|---|---|
| `prefers-reduced-motion: reduce` | Flat topic row, no tilt, no card turn, no palette slide, no rail tween. Pressed state changes at once. |
| `prefers-reduced-transparency: reduce` | Dock is fully opaque. |
| No `backdrop-filter` | Dock is fully opaque. |
| `forced-colors: active` | Keys, tiles and the dock get a real border, because shadows are dropped. |
| JavaScript off | Dock, CPR link, intro, and the generated ordered lists. |

## What this pass does not change

- Any string in `src/topics.js`, `src/flow.js` or `src/art.js`
- CPR timing (`60000/110`, breath pause) in `src/app.js`
- Review-status wording (it is still rendered from `data/topic-reviews.json`)
- 000 and 13 11 26, including `tel:` links
- ANZCOR source lines, BodyParts3D credit, the “not yet reviewed” line
- Australian particulars already in the steps (pressure immobilisation and splint for snake and funnel-web bites, no tourniquet for those bites, and the rest)

A further redraw of contact points or action arrows would be a clinical change. It is not in this interface. See `docs/proposals/art-redraw-v2.md`.
