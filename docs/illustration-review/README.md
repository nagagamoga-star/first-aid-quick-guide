# Illustration integration — review gate

The generated 42-image review gallery is a **candidate asset collection**, not clinically approved first-aid instruction. Existing licensed images remain the preferred live media until each replacement is approved.

## Review-to-release workflow

1. Download and extract the 42-image review gallery ZIP delivered in ChatGPT. Keep the images and the gallery `manifest.json` together.
2. A qualified reviewer examines **every image** against current Australian first-aid guidance, including anatomy, hand/device placement, age-specific techniques, visible text and the associated guide step. Record approve/change/reject and any corrections. Refer topics outside their current competence to an appropriate second reviewer.
3. The owner records publication approval **after** the qualified clinical review. Keep signed evidence, contact details and registration numbers outside this public repository.
4. Fill in a private copy of `approvals-template.json` using actual reviewer decisions and exact image hashes. Never fill in dummy approvals.
5. From a checkout of this branch, validate without modifying files:

   ```sh
   python3 tools/import_reviewed_illustrations.py --repo . --gallery /path/to/first_aid_illustration_review_implementation --decisions /path/to/private-decisions.json
   ```

6. After successful validation, repeat with `--stage`. This copies only approved WebP images to `assets/diagrams/review-approved/` and creates `data/approved-illustration-import.json`. It does **not** change the live `data/media.json` mapping or the public website.
7. Open a separate **clinical-change** PR to integrate only the approved images into `data/media.json` and `src/media.js`, including original-work attribution, accurate alt text and zoom. Rebuild `index.html` and `sw.js`; test offline caching, accessibility, all 16 topics, Android and iPhone. The clinical release gate and owner publication sign-off must pass before merging.

## Why not automatically replace all 42 images?

The new artwork is AI-generated and may contain misleading technique, especially for infant choking, AED pads, adrenaline devices, burns, poisoning and marine stings. Visual realism does not establish clinical correctness. Some current licensed images have already been accepted for use and should not be displaced without evidence that the replacement is more accurate.

## Repository integration status

- **Implemented:** review and staging script; approval template; documented release workflow.
- **Not implemented:** upload of the binary image gallery into GitHub; qualified clinical decisions; live image replacements; regenerated public site.
- **Do not merge a clinical image change** solely on the basis of this staging script.

The public `data/media.json` is intentionally unchanged. This work belongs to a separate branch, not the Stage 2 governance PR.
