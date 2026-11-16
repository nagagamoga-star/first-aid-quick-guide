# Mixed medical illustration library — production brief

**Status:** Planned; images require acquisition, visual inspection, licensing and qualified clinical review before publication.  
**Goal:** Make every illustrated first-aid step as understandable as the existing full-size CPR image: realistic human proportions, clearly visible hand/device placement, simple white/light backgrounds, useful captions and tap-to-enlarge.

## Current repository baseline (16 November 2026)

- `data/media.json` has **8 accepted**, **9 rejected** and **1 hidden-rule** entries.
- `src/media.js` already displays accepted licensed diagrams, provides a zoom dialog, records credits and falls back to `src/art.js` SVGs when images are unavailable.
- The accepted media include CPR compressions, recovery position, adult back blows, AED pad placement, spacer use, airway head tilt, nosebleed and autoinjector site.
- Existing hidden keys: `infant`, `twofinger`, `still`, `handpos`. Do not silently re-enable them; some were hidden for clinical/clarity reasons.
- Rejected media remain rejected: notably abdominal thrusts (not the ANZCOR approach), misleading infant head positioning, an unclear hand-position image and questionable source licensing.
- All medical illustrations remain subject to the `illustrations` clinical review record.

## Source-selection policy

1. **Prefer authoritative Australian source illustrations** where permitted for reuse, such as ANZCOR, ASCIA, Asthma Australia / National Asthma Council and Stroke Foundation. **Do not assume their images are freely licensed.** Seek written permission or a licence that permits republication.
2. **Then use appropriately licensed Wikimedia Commons diagrams** where both the licence and depicted action are suitable. Verify the original author, licence version, attribution and source file, not only the Commons metadata.
3. **Commission/generate original matching images** for gaps where no suitable licensed medical image exists. Generated images are unverified visual drafts, never evidence of medical correctness. Use a human clinical reviewer to approve precise anatomy, equipment, positioning and any text before accepting.
4. Preserve the current app's offline storage, zoom and attribution mechanisms. Never hotlink a third-party image at runtime.

## Consistent visual design

- Natural human proportions and realistic hands; plain white or very pale neutral background.
- Consistent patient clothing (blue) and helper clothing (teal), avoiding colour as the sole carrier of meaning.
- Show the whole action, including hand contact, equipment orientation and the affected body part. Avoid cut-off limbs where they obscure technique.
- Use one primary action per image; if a sequence is needed, use separately captioned numbered frames.
- Show correct direction/placement with restrained arrows or a small highlight, not decorative red warning symbols.
- No unsupported dosage, timings, emergency numbers, device brands or medical claims baked into the picture.
- No text embedded in generated artwork. Add accessible, editable HTML captions and alt text separately so corrections do not require redrawing.
- Render a large image on the card, with an accessible zoom dialog. Use `object-fit:contain`, never crop essential clinical details.
- Export responsive WebP/AVIF or SVG where appropriate; keep a high-quality source outside the runtime bundle and a compressed offline asset in `assets/diagrams/`.

## Priority production batches

| Batch | Illustration subjects | Special safety / review focus |
|---|---|---|
| A — Emergency basics | Danger assessment, responsiveness, airway, breathing, chest compressions, rescue breaths, AED, recovery position | Hands, shoulders, head positioning, pad placement, adult vs infant distinctions |
| B — Choking | Adult back blows, chest thrusts, infant support and back blows, infant chest thrusts | Do not show abdominal thrusts; infant head position and technique require current ANZCOR review |
| C — Bleeding and injury | Direct pressure, embedded object, bandage, splint, tourniquet, nosebleed | Placement, pressure and any tourniquet indication must be approved |
| D — Anaphylaxis and asthma | Device/site overview, separate EpiPen/Anapen/Jext/neffy illustrations if approved, spacer | Current ASCIA plans and device-specific instructions; unresolved F01/F02 |
| E — Bites, stings and environmental | Pressure immobilisation, marine stings, vinegar, seawater, hot-water immersion, cold packs, heat | Species-dependent advice, temperatures, positioning and regional Australian guidance |
| F — Remaining topics | Stroke/FAST, seizure, burns, poisoning, heart attack and other steps actually used by `src/topics.js` | Match every image to the exact step; avoid US 911 advice and unsupported generic illustrations |

## Asset register fields

For each new image record: `id`, exact `keys` or `slots`, `decision` (proposed / accepted / rejected / hidden), `file`, `sha256`, `width`, `height`, `alt`, `caption`, `author`, `sourceUrl`, `licence`, `licenceUrl`, `credit`, `clinicalSource`, `clinicalFindingIds`, `checkedBy`, `checkedAt`, `reviewerDecision`, `reviewedAt`. Existing `data/media.json` accepts only its established schema; expand validation and the build deliberately before adding new fields.

## Acceptance gates

- [ ] Inventory every illustrated step/slot from `src/topics.js` and the emergency question flow, with image coverage and priority.
- [ ] Confirm licence and attribution for each licensed image; keep rejected assets excluded.
- [ ] Human-inspect each generated image for anatomical errors, hand counts, equipment errors and misleading text.
- [ ] Qualified reviewer checks each proposed image against current Australian guidance and records approve/change/remove.
- [ ] Update `data/media.json` only after approval; store files locally with verified hashes.
- [ ] Rebuild `index.html` and `sw.js`; verify offline asset caching, zoom, alt text, captions, mobile sizing and credit links.
- [ ] Run automated tests and Android/iPhone visual checks.
- [ ] Publish via a separate clinical-change PR, not the Stage 2 governance PR; no live-site merge without owner approval.

## Important limits

The three-panel image concept generated in this conversation is a **visual style reference only**, not a reviewed instructional asset. Do not publish it as medical guidance without review. A realistic picture can be more persuasive than a pictogram while still depicting the wrong technique.
