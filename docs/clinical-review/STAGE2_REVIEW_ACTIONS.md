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
| Make the clinical release gate run on pull requests | Implemented | Added `.github/workflows/clinical-release-gate.yml`, which runs on PRs to `main` and can be manually dispatched. It runs the full release gate for clinical text, flow, illustrations and CPR timing changes; unrelated PRs receive an explicit successful skip. |
| Clarify branch protection | Documented; owner action remains | Governance instructions identify the check name `Clinical release gate / release-gate` and explain that a repository ruleset/branch protection rule must require it. This repository setting is not changed by this PR. |
| Distinguish source evidence from clinical judgement | Already implemented | Retained each finding's `basis` and reviewer guidance. |
| Tighten reviewer qualification and scope | Implemented | Governance criteria now require current, relevant competence; scope matching; referral to a second reviewer where needed; private verification and no public credential identifiers. |
| Provide a structured reviewer scope record | Implemented | Added `REVIEWER_SCOPE_CHECKLIST.md` covering adult/paediatric BLS, devices, poisoning, marine and regional hazards, diagrams and question flow. |

## Clinical content boundary

No first-aid instruction, question-flow node, illustration, 3D caption or clinical procedure was changed by this follow-up. No finding was marked resolved and no topic was moved to a reviewed or approved status.

F01 already covers EpiPen, Anapen, Jext and neffy and remains a proposed reviewer decision. The reviewer must determine the precise lay wording and any device-specific visual changes.

## Required owner action after merge

1. Review the GitHub Actions workflow run on this PR.
2. In repository Settings, create or update a ruleset for `main` and require `Clinical release gate / release-gate`.
3. Confirm the required check is reported by GitHub before selecting it in branch protection.
4. Arrange the qualified reviewer and complete the private scope checklist.
5. Keep the signed reviewer pack and evidence privately; only non-sensitive reviewer metadata should be committed.

## Verification status

- Source and governance records: inspected.
- Existing F01 four-device proposal: verified in `data/source-findings.json` and `SOURCE_CHECK_2026-11.md`.
- GitHub Actions workflow: committed; live execution and branch-protection enforcement must be confirmed in GitHub.
- Browser suite and release-gate simulation: not rerun in this chat environment. Existing Stage 2 acceptance results remain as previously recorded.
- Clinical review: outstanding.
