# Clinical Governance

How first aid content in this app is sourced, checked, reviewed, approved and kept current. Stage 2 of the enhancement brief.

**The rule:** no instruction is treated as reviewed until a qualified person has reviewed it and the project owner has recorded that review. Checking content against its source is necessary but is not clinical approval.

## 1. Roles

| Role | Who | Can do |
|---|---|---|
| Project owner | Naga Gamoga | Records reviews, approves publication, merges pull requests |
| Clinical reviewer | A currently accredited first aid trainer, or a registered nurse, paramedic or doctor with current first aid and CPR knowledge | Reviews content, drawings and question flow; signs the review pack |
| Contributor (person or AI coding agent) | Anyone | Proposes changes and source checks. Cannot mark anything as reviewed or approved, and must not change clinical text without a recorded review |

## 2. Source hierarchy

1. ANZCOR (Australian and New Zealand Committee on Resuscitation)
2. ASCIA (Australasian Society of Clinical Immunology and Allergy), for allergy and anaphylaxis
3. healthdirect
4. State and territory health departments
5. Queensland Ambulance Service and Queensland Health
6. Other recognised Australian clinical organisations

International sources don't override Australian ones without a written clinical reason. **Where two Australian sources disagree, the reviewer decides and the decision is recorded.** For example, ANZCOR's anaphylaxis guideline (2019) predates ASCIA's 2026 plans (finding F06).

## 3. Records

| File | Holds |
|---|---|
| `data/clinical-sources.json` | Every source: organisation, guideline, title, URL, version or approval date, amendments, date last checked. Which sources each topic and component uses. |
| `data/topic-reviews.json` | Review status of each topic and component (question flow, 3D captions, drawings), who reviewed it, when, publication approval, next review date, history |
| `data/source-findings.json` | Findings from source checks, with severity, proposed change and status (`open`, `accepted`, `rejected`, `resolved`) |
| `docs/clinical-review/REVIEW_PACK.md` / `.pdf` | Generated pack for the reviewer: every item as users see it, with drawings, findings and sign-off fields |
| `docs/clinical-review/SOURCE_CHECK_2026-11.md` | Readable report of the November 2026 source check |

## 4. Statuses

| Status | Meaning | Required to enter |
|---|---|---|
| `DRAFT` | New content, not yet sourced | — |
| `SOURCE CHECK REQUIRED` | Sources not yet compared with their current version, or a source has changed | — |
| `CLINICAL REVIEW REQUIRED` | Compared with current sources; waiting for a qualified reviewer | Source check date and method |
| `CLINICALLY REVIEWED` | A qualified reviewer has reviewed it; agreed changes made | Reviewer, qualification, date; source check confirmed by a person; **no open HIGH findings** |
| `APPROVED FOR PUBLICATION` | Owner has approved the reviewed content for the live site | All of the above, plus approved by, approval date, next review date |
| `REVIEW OVERDUE` | Next review date has passed | Set by the owner when the build reports it |
| `SUPERSEDED` | Retired, or replaced by a new version | — |

`tests/validate_governance.mjs` runs in every build and **refuses to build** if:
- a topic or component has no source or review record, or an unknown status;
- the app links to a source that isn't in the register;
- anything is marked reviewed or approved without the required details, or with an open HIGH finding;
- an approved item is past its next review date.

A source not checked for 12 months triggers a build warning.

## 5. Review process (per topic)

1. List every clinical statement (the review pack does this: W, S1…, N…, D…).
2. Name the source guideline for each statement.
3. Check the latest official version, including amendments and corrections (ANZCOR "Recent updates").
4. Compare the app's text with the source; record differences and omissions in `source-findings.json` with a proposed change.
5. The reviewer reviews the pack: approves, changes or removes each item, and accepts or rejects each finding.
6. The owner records the review in `topic-reviews.json` (status `CLINICALLY REVIEWED`).
7. Agreed content changes go in a **separate pull request** titled "Clinical change: …", which quotes the finding IDs it resolves. Then mark those findings `resolved`.
8. The owner sets `APPROVED FOR PUBLICATION` with a next review date no more than 12 months away, and merges.

AI tools may help with steps 1 to 4 and with drafting proposals. They must not mark anything reviewed or approved, and must not change clinical text outside step 7.

## 6. Keeping sources current

- **Monthly:** check ANZCOR's Recent Updates page and ASCIA's information updates for any guideline in the register. If one changed, set the affected topics to `SOURCE CHECK REQUIRED` and repeat steps 3 to 8. A source review must look at what actually changed, not just update a date.
- **Every 12 months:** full review of every topic, even without source changes.
- **Immediately:** if anyone reports a possible error, add a finding and assess its severity.

Finding severity:
- **HIGH:** could change what a rescuer does in a way that matters for safety. Fix before wider promotion.
- **MEDIUM:** missing or unsourced information a reviewer should decide on.
- **LOW:** wording, attribution or precision.

## 7. In the app

Each topic and the question flow show their review status under the source line. Until a topic is approved, it reads: "Not yet reviewed by a qualified first aid trainer or clinician." Once approved, it shows the reviewer's qualification, the review month and the next review month. Reviewer names aren't shown publicly.

## 8. Current state (15 November 2026)

- All 16 topics and 3 components: `CLINICAL REVIEW REQUIRED`.
- Source check: AI-assisted, against the live official pages, 15 November 2026. Needs confirmation by a person.
- 40 findings: **3 HIGH** (F01, F02 anaphylaxis; F07 button battery), 14 MEDIUM, 23 LOW.
