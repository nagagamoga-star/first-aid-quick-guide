# Clinical Governance

How first aid content in this app is sourced, checked, reviewed, approved and kept current. Stage 2 of the enhancement brief.

**The rule:** no instruction is treated as reviewed until a qualified person has reviewed it and the project owner has recorded that review. Checking content against its source is necessary but is not clinical approval.

## 1. Roles

| Role | Who | Can do |
|---|---|---|
| Project owner | Naga Gamoga | Records reviews, approves publication, merges pull requests |
| Clinical reviewer | See "Who can review" below | Reviews content, drawings and question flow; signs the review pack |
| Contributor (person or AI coding agent) | Anyone | Proposes changes and source checks. Cannot mark anything as reviewed or approved, and must not change clinical text without a recorded review |

### Who can review

General professional registration is not enough on its own. In order of preference:

1. A currently accredited first aid trainer delivering the relevant HLTAID units through a registered training organisation, with current practical teaching experience.
2. A paramedic, emergency or critical care nurse, or emergency doctor whose current role includes first response, emergency care or first-aid education, and whose recent practice is relevant to the topics being reviewed.

**Match competence to the review scope.** Do not assume that one qualification automatically demonstrates current competence across every topic. The reviewer must identify any area outside their current scope and refer it to a second suitably experienced reviewer. Particular care is required for anaphylaxis and adrenaline devices, CPR and choking (including infants and children), poisoning and button batteries, marine envenomation, burns, and the clinical accuracy of diagrams. A second reviewer is recommended for the three HIGH findings and any specialist area outside the primary reviewer's regular practice.

The reviewer must assess the written instructions, illustrations, 3D captions and question flow, and judge whether each item is appropriate for an untrained member of the Australian public to follow under stress. Record the qualification category, relevant current experience and how credentials were verified in `review.qualification`. Verification should be performed privately (for example, confirming current RTO authorisation and relevant HLTAID scope, or confirming professional registration and relevant current practice). Do not put registration numbers, contact details, identity documents or signatures in the public repository. If the reviewer does not consent to public attribution, record an agreed role or reviewer code in the repository and retain the signed review pack securely outside GitHub.

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
| `data/source-findings.json` | Findings from source checks, with severity, basis (`source` or `judgement`, see section 5), proposed change and status (`open`, `accepted`, `rejected`, `resolved`) |
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

### Validation is not publication

The build check above is a **records check**. It passes today, with nothing reviewed, so that technical work (offline support, accessibility, fixes) can continue while clinical review is pending. Passing the build says nothing about whether the content is clinically approved.

The **release gate**, `node tests/release_gate.mjs`, is the publication control. It is not part of the build, and it fails unless:
- every topic and component is `APPROVED FOR PUBLICATION`, with reviewer, owner approval and a future next review date;
- each item's content is unchanged since approval (the owner records `publication.contentHash` from `node tests/release_gate.mjs --print-hashes` at approval; any later edit to that topic's text, steps, drawings keys, the CPR timing, the question flow, the 3D captions or the drawings changes the hash);
- no finding of any severity is still `open`;
- every source was checked in the last 45 days.

Run it before announcing or promoting the guide as reviewed, and before any "Clinical change" pull request is merged.

**Automation and limits.** `.github/workflows/clinical-release-gate.yml` runs on every pull request targeting `main`, so it can be selected as a required status check without leaving unrelated pull requests pending. It runs the full release gate when `src/topics.js`, `src/flow.js` or `src/art.js` changes, or when the CPR timing constants in `src/app.js` change; it reports a successful skip for other changes. A manual `workflow_dispatch` runs the full gate on demand. The workflow does not itself configure repository branch protection. The project owner must go to **Settings → Rules → Rulesets** (or **Settings → Branches**, depending on the repository's controls), create or edit the rule for `main`, enable required status checks, and select **`Clinical release gate / release-gate`**. Require the check before merging and do not allow routine bypasses. Until that repository setting is enabled, the script and workflow provide a check but do not technically prevent a merge or GitHub Pages deployment. The current content went live before this process existed; the in-app status line tells users it has not been reviewed.

## 5. Review process (per topic)

1. List every clinical statement (the review pack does this: W, S1…, N…, D…).
2. Name the source guideline for each statement.
3. Check the latest official version, including amendments and corrections (ANZCOR "Recent updates").
4. Compare the app's text with the source; record differences and omissions in `source-findings.json` with a proposed change. Mark each finding's basis:
   - `source`: the guideline states it; the reviewer checks the app matches and the wording works for the public.
   - `judgement`: the guideline doesn't settle it (the app's own wording, a choice whether to add something, two sources that differ, drawings). Matching a source is not enough; the reviewer decides what suits a general Australian first aid audience.
5. The reviewer reviews the pack: approves, changes or removes each item, and accepts or rejects each finding. For every item, the question is both "does this match current guidance?" and "is this appropriate for a member of the public in Australia to follow?".
6. The owner records the review in `topic-reviews.json` (status `CLINICALLY REVIEWED`).
7. Agreed content changes go in a **separate pull request** titled "Clinical change: …", which quotes the finding IDs it resolves. Then mark those findings `resolved`.
8. The owner sets `APPROVED FOR PUBLICATION` with a next review date no more than 12 months away and the content hash, runs the release gate, and merges.

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
- 40 findings: **3 HIGH** (F01, F02 anaphylaxis; F07 button battery), 14 MEDIUM, 23 LOW. 16 need clinical judgement rather than a source match.
- Release gate: blocked (expected until review is complete).

## 9. Stage 2 implementation boundary

Stage 2 establishes evidence records, reviewer instructions and technical controls only. It does not amend first-aid steps, the question flow, drawings or 3D captions. F01's current proposal already identifies EpiPen, Anapen and Jext autoinjectors, neffy nasal spray, and general-use devices with the associated ASCIA plan; this remains a reviewer proposal, not approved clinical wording. Any accepted wording or illustration change must be implemented in a separate clinical-change pull request after the reviewer records the decision. See `docs/clinical-review/STAGE2_REVIEW_ACTIONS.md` and `docs/clinical-review/REVIEWER_SCOPE_CHECKLIST.md`.
