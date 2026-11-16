# Batch A — generated illustration review queue

**Production status:** Four original realistic-style drafts have been generated and packaged separately for the owner. They are **not yet uploaded to this repository**, mapped to the live media manifest or clinically approved.

| Draft file | Existing guide concept | Clinical review required |
|---|---|---|
| `adult-cpr-compressions.webp` | Adult chest compressions | Confirm hand placement, posture, patient positioning and suitability against current ANZCOR |
| `recovery-position.webp` | Recovery position | Confirm arm, leg, head and airway positioning |
| `check-responsiveness.webp` | Checking responsiveness | Confirm appropriate contact, approach and patient positioning |
| `aed-pad-placement.webp` | AED use | **Confirm precise pad locations** and whether the depiction is appropriate for lay first aid; do not publish if misleading |

## Why the images are not live

The existing repository's `data/media.json` contains accepted licensed images, including adult CPR, recovery position and AED pads. Replacing those with generated drafts without clinical approval could reduce accuracy. This stage produces review candidates, not clinical instructions.

The batch is packaged with a JSON manifest and hashes in `first_aid_illustration_batch_A.zip` in the associated ChatGPT deliverables. The ZIP is not a repository asset. A subsequent implementation change must add only approved images to `assets/diagrams/`, update `data/media.json`, rebuild the generated site and offline service worker, and run the mobile and clinical checks.

## Next implementation batches

- **B:** Adult choking and infant choking, prioritising current ANZCOR techniques.
- **C:** Direct pressure, embedded objects, bandages and splints.
- **D:** Anaphylaxis devices (EpiPen, Anapen, Jext and neffy) and asthma.
- **E:** Australian bites, stings and environmental injuries.
- **F:** Remaining topics and emergency question-flow visuals.

Every draft must be assessed individually. Do not infer that the AI-generated artwork is anatomically correct.


## Batch B–F draft image cards (17 November 2026)

A further **38 original image-card candidates** have been produced, cropped to individual WebP cards and packaged with SHA-256 hashes in `first_aid_illustration_batches_B_F.zip` in the associated ChatGPT deliverables. These are **not** uploaded to GitHub, clinically approved, or connected to `data/media.json`.

Coverage includes emergency calls, airway and breathing, AED, adult/infant choking, severe bleeding, embedded objects, bandages, splints, tourniquets, anaphylaxis, asthma, burns, poisoning, button batteries, snake bites, spiders, marine stings, nosebleeds and chest pain.

**Important clinical risks:** The AI-generated drafts are not reliable evidence of correct technique. Some may be inaccurate or unsafe, particularly for infant choking, anaphylaxis devices, poisoning/button batteries, marine stings, AED pad placement, chemical burns and embedded objects. Do not publish these drafts merely because they look realistic. A qualified reviewer must compare each candidate against the relevant current Australian guidance, reject misleading images, and approve the final image and its accessible caption. Some drafts contain baked-in text; final production images should use separate HTML captions and alt text.

**Implementation status:** Draft image creation and export complete; licence handling for the existing accepted Commons media is unchanged. Clinical review, production artwork selection, repo asset upload, manifest integration, offline rebuild, tests and owner approval remain outstanding.
