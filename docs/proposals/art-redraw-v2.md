# Proposal: no further drawing change until F41 is reviewed

Status: **not implemented**. This file is not a clinical change. `src/art.js` is untouched.

## Why nothing was redrawn here

The interface pass (`docs/design/REDESIGN.md`) is allowed to change lighting, framing, palette and casualty-versus-helper colour, because those do not move a pose or a contact point. It is not allowed to change drawing geometry while the illustrations are `CLINICAL REVIEW REQUIRED`.

Findings still open on the drawings:

- **F40** (MEDIUM): the drawings are simplified diagrams with no clinical source. Highest risk called out there: CPR hand position, infant back blows, and the snake-bite bandage.
- **F41** (MEDIUM): six drawings were redrawn on 15 November 2026 (recovery position, head tilt, CPR compressions, adult back blows, infant back blows, pressure bandage) and merged without a recorded review. Labels were not changed. The finding asks a reviewer to approve each one or mark what to change.

A second redraw of those six, or new arrows that teach a technique, would replace the pictures F41 asks the reviewer to judge. That would make the review pack stale before anyone has signed it. So this proposal does not include replacement SVG, and no draft drawing branch was opened.

## What the interface pass did instead

Colour only, in `src/style.css`, plus a slot in `src/illustrate.js`:

- The person’s clothes (`.pt`, `.ptl`) paint in clay.
- The helper’s arms (`.rsl`) paint in teal.
- Skin, outlines, arrows and every path coordinate stay as they are in `src/art.js` on this branch.
- Each step is drawn by `Illustrate.render`, keyed as `<topic>:<step>`. The built-in renderer calls `ART.svg`. The wrapper is an edge-to-edge area, not a bezel.
- A replacement set belongs on its own branch. It should register through that slot or replace `src/art.js`, and it will fail the release gate until the drawings are approved.

The release gate hashes the whole of `src/art.js`. Any path edit fails that gate until the illustrations are approved. That is an additional reason the paths were left alone, not the clinical reason. The clinical reason is F40 and F41.

## If a reviewer wants a later redraw

Do it in a pull request titled `Clinical change: …`, after F41 is decided, quoting the finding ids it resolves. Sensible scope, only if the reviewer asks:

1. Decide F41 first (keep or revert the six drawings already in the file).
2. Only then consider extra cues that would change geometry: a contact-point mark, or an arrow whose direction is itself an instruction. Those are technique, not chrome.
3. Do not add a tourniquet to the snake or funnel-web pictures, and do not change the pressure-immobilisation bandage into a tourniquet. The written steps forbid a tourniquet for those bites.

Nothing in that list is drawn in this branch.
