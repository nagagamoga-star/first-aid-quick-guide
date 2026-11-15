# Stage 2 Acceptance Report: Clinical Governance

Branch `clinical-governance`, stacked on `pwa-offline` (Stage 1, PR #1). 15 November 2026.

**Result:** the governance structure is in place and enforced by the build. All 16 topics and 3 components are recorded as `CLINICAL REVIEW REQUIRED`. **No clinical content was changed.** The stage can't be completed without a person: a qualified reviewer must review the content, and the owner must record it.

## Deliverables against the brief (§5)

| Brief requirement | Delivered | Where |
|---|---|---|
| 5.1 Source hierarchy | Recorded and documented | `data/clinical-sources.json` (`hierarchy`), `docs/CLINICAL_GOVERNANCE.md` §2 |
| 5.2 Structured clinical metadata per topic | 19 sources with version, amendments and last-checked dates; sources mapped to each topic and component | `data/clinical-sources.json` |
| 5.3 Controlled review statuses | The 7 statuses from the brief, with entry rules enforced by the build | `data/topic-reviews.json`, `tests/validate_governance.mjs` |
| 5.3 Don't treat a source check as approval | Approval needs a named reviewer, qualification, date, a person confirming the source check, and no open HIGH findings | `tests/validate_governance.mjs` |
| 5.4 Steps 1–4: statements, sources, latest version, comparison | Every statement compared with its live source (AI-assisted, needs human confirmation) | `docs/clinical-review/SOURCE_CHECK_2026-11.md`, `data/source-findings.json` |
| 5.4 Steps 5–7: discrepancies and proposed corrections | 40 findings (3 HIGH, 14 MEDIUM, 23 LOW), each with a proposed change | same |
| 5.4 Step 8: qualified review | Review pack with every item, drawing, finding and sign-off field | `docs/clinical-review/REVIEW_PACK.pdf` (39 pages) and `.md` |
| 5.4 Steps 9–10: record reviewer, publish only after approval | Fields and rules in place; nothing marked reviewed | `data/topic-reviews.json` |
| 5.4 Don't silently rewrite content | `src/topics.js`, `src/flow.js`, `src/art.js` unchanged | git diff against `00e83fb` |
| 5.5 Source currency | Version and amendment dates, ANZCOR 2025–2026 updates checked, monthly and 12-monthly process, 12-month staleness warning | `docs/CLINICAL_GOVERNANCE.md` §6, build warning |

Also: each topic and the question flow now show their review status in the app (screenshot below).

## Tests

| Check | Result |
|---|---|
| Governance: every topic and component recorded, valid statuses, sources registered, app source links match the register | Pass |
| Governance rules refuse unsafe records: approval with missing reviewer, unconfirmed source check, open HIGH finding, or missing approval details (tried on "poison") | All four refused |
| Governance rule refuses an app source link missing from the register (tried on "anaphylaxis") | Refused |
| Build runs the governance check and stops on failure | Pass |
| Browser suite: Stage 0 and Stage 1 checks plus "review status shows on topics and the question flow" | 32 of 32 passed (`acceptance/results.json`) |

![Review status line on a topic](acceptance/review-status.png)

## HIGH findings (for the reviewer first)

- **F01 Anaphylaxis device:** ASCIA's 2026 plans cover adrenaline devices including a nasal spray (neffy). The app describes only thigh autoinjectors.
- **F02 Anaphylaxis:** ASCIA says "if in doubt, give adrenaline device". The app doesn't say this.
- **F07 Button battery:** ANZCOR 9.5.1 says nothing by mouth if there's difficulty breathing *or bleeding*. The app's honey and jam step doesn't mention bleeding.

These are live on the current site. Fixing them needs a reviewer's agreement (brief §5.4 and §14), then a separate "Clinical change" pull request.

## Known limits

1. The source check was AI-assisted. A person must confirm it (`sourceCheck.confirmedBy`) before any topic can be marked reviewed.
2. The ASCIA page couldn't be fetched directly; it was checked through ASCIA's published 2026 plan PDFs.
3. The drawings and 3D captions have no clinical source by nature. They need reviewer approval (F38, F40).
4. Reviewer names are kept in the repo's records, not shown in the app. If the reviewer prefers not to be named in a public repo, record a role and keep the signed pack privately.
