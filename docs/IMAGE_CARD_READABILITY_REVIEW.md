# Image card readability refresh — implementation and review

## Goal
Make the existing first-aid SVG image cards easier to interpret on mobile and desktop without changing any clinical instructions or illustration poses.

## Changes
- A distinct, softly bordered illustration panel makes the image visually separate from the step instruction.
- The drawing uses more of the available card width and retains its full SVG viewBox.
- A small, visible colour key identifies the existing palette: person (slate), helper (teal), action/direction (red).
- Step text has more breathing room beneath the image.
- Topic carousel thumbnails have a consistent inset background.
- The all-steps list uses compact rectangular image frames rather than irregular blob clipping.
- Responsive sizing and forced-colour mode adjustments are included.

## Clinical boundaries
- No edits to `src/art.js`, `src/topics.js`, `src/flow.js`, `src/viewer.js`, or clinical review records.
- The visual key is a presentation aid; it is not a substitute for the written first-aid instructions.
- Existing illustrations remain marked as not clinically reviewed. This PR does not approve any drawing or technique.
- A qualified reviewer should confirm the key is unambiguous and the increased size does not create a false impression of clinical approval.

## Build and QA before merge
The GitHub Pages deployment uses generated `index.html` and `sw.js`, which **must be rebuilt and committed** after changing `src/app.js` and `src/style.css`.

Run in a local checkout of this branch:

```bash
python3 src/build.py
git add index.html sw.js
git commit -m "Build generated site for clearer image cards"
```

Then run the repository browser suite, inspect the PR checks, and visually verify:
- 360px-wide Android viewport and desktop
- light and dark mode
- home carousel thumbnails, step-by-step player, and all-steps list
- long labels and captions stay inside their diagrams
- screen reader and forced-colour rendering
- offline PWA refresh and cached update behaviour

The generated files were not modified as part of this initial source-only PR. **Do not merge until they are rebuilt and checked.**
