# Stage 2 Follow-up Implementation Record

**Pull request:** #2 — Stage 2: clinical governance  
**Branch:** `clinical-governance` (stacked on `pwa-offline`)  
**Scope:** governance, documentation and automated release control only.

## Review recommendations and disposition

| Recommendation | Disposition | Implementation |
|---|---|---|
| F01 should cover Jext as well as EpiPen, Anapen and neffy | Already addressed in the Stage 2 source register and finding | Retained the existing four-device scope and ASCIA device source. The proposed wording remains a draft for clinical review. |
| Avoid wording that makes a first aider independently select a device | Addressed as a reviewer decision, not by changing app instructions | Reviewer pack asks the reviewer to settle exact device wording, prescribed/general-use device handling and whether a nasal-spray illustration is required. |
| Separate build validation from clinical publication approval | Already implemented; clarified and strengthened | Retained the normal governance build check and the separate `tests/release_gate.mjs`. |
| Make the clinical release gate run on pull requests | Implemented | Added `.github/workflows/clinical-release-gate.yml`, which runs on PRs to `main` and can be manually dispatched. It checks the built site matches `src/` and runs the per-item release gate (`--changed-since` the PR base); the full gate runs on manual dispatch. |
| Clarify branch protection | Configured | Branch protection rule on `main` requires the `release-gate` check, with no administrator bypass (15 November 2026). |
| Distinguish source evidence from clinical judgement | Already implemented | Retained each finding's `basis` and reviewer guidance. |
| Tighten reviewer qualification and scope | Implemented | Governance criteria now require current, relevant competence; scope matching; referral to a second reviewer where needed; private verification and no public credential identifiers. |
| Provide a structured reviewer scope record | Implemented | Added `REVIEWER_SCOPE_CHECKLIST.md` covering adult/paediatric BLS, devices, poisoning, marine and regional hazards, diagrams and question flow. |

## Clinical content boundary

No first-aid instruction, question-flow node, illustration, 3D caption or clinical procedure was changed by this follow-up. No finding was marked resolved and no topic was moved to a reviewed or approved status.

F01 already covers EpiPen, Anapen, Jext and neffy and remains a proposed reviewer decision. The reviewer must determine the precise lay wording and any device-specific visual changes.

## Required owner actions

1. Review the GitHub Actions workflow run on this PR.
2. Merge PR #2 into `pwa-offline` before PR #1, so PR #1 carries the workflow that `main` now requires.
3. Arrange the qualified reviewer and complete the private scope checklist.
4. Keep the signed reviewer pack and evidence privately; only non-sensitive reviewer metadata should be committed.

## Verification status

- Source and governance records: inspected.
- Existing F01 four-device proposal: verified in `data/source-findings.json` and `SOURCE_CHECK_2026-11.md`.
- GitHub Actions workflow: committed; live execution and branch-protection enforcement must be confirmed in GitHub.
- Browser suite and release-gate simulation: not rerun in this chat environment. Existing Stage 2 acceptance results remain as previously recorded.
- Clinical review: outstanding.
