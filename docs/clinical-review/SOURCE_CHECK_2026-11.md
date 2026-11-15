# Source Check, November 2026

Every clinical statement in the app compared with the current official source, 15 November 2026. **No app content was changed.** Findings are proposals for the clinical reviewer.

**Method:** AI-assisted. Each topic's statements were checked against the live page of each cited guideline (ANZCOR, ASCIA, healthdirect), with section references, and each guideline's approval and amendment dates were recorded. ANZCOR's Recent Updates list was checked for 2025 to 2026 changes. This is not clinical review, and a person should confirm the findings. Machine-readable version: `data/source-findings.json`.

**Revised 15 November 2026** after a second review of this check: F01 now covers all four approved devices (EpiPen, Anapen, Jext, neffy) and general use devices, with ASCIA's device instructions page added as a source; F20's proposal now includes hydrogel dressings, as the guideline says; and each finding is marked as **source** (the guideline states it) or **judgement** (the reviewer decides what suits a general audience). 16 findings need judgement: F01, F06, F08, F11, F13, F16, F19, F25, F26, F28, F30, F33, F37, F38, F39, F40.

## Summary

- 40 findings: **3 HIGH**, 14 MEDIUM, 23 LOW.
- Most statements are supported by their source. Most findings are wording, precision or attribution.
- **Three HIGH findings** could change what a rescuer does:
  - **F01** (anaphylaxis): The 2026 ASCIA plans say "give adrenaline device". Four devices are approved in Australia: EpiPen, Anapen and Jext injectors, and neffy nasal spray (Jext PBS listed from 1 June 2026, neffy from 1 July 2026). Each has its own instructions. General use devices in first aid kits are given when the person has no prescribed device, with the ASCIA First Aid Plan stored beside them. The app only describes an EpiPen or Anapen injected into the outer thigh. ANZCOR 9.2.7 dates from 2019, before neffy and Jext.
  - **F02** (anaphylaxis): ASCIA plans say "if in doubt, give adrenaline device". The app does not say this. ANZCOR 9.2.7 does not include it either.
  - **F07** (poison): ANZCOR 9.5.1 (section 4.6) says to give nothing by mouth if there is difficulty breathing or bleeding. The app only says to give honey or jam if they can breathe and swallow without trouble, so it misses the bleeding condition.

## Source currency

| Source | Version | Note |
|---|---|---|
| [ANZCOR 3](https://www.anzcor.org/home/basic-life-support/guideline-3-recognition-and-first-aid-management-of-the-unconscious-person) | 2021-04 |  |
| [ANZCOR 4](https://www.anzcor.org/home/basic-life-support/guideline-4-airway) | 2021-04 |  |
| [ANZCOR 6](https://www.anzcor.org/home/basic-life-support/guideline-6-compressions) | 2021-04 |  |
| [ANZCOR 8](https://www.anzcor.org/home/basic-life-support/guideline-8-cardiopulmonary-resuscitation-cpr) | 2021-04 |  |
| [ANZCOR 9.1.1](https://www.anzcor.org/home/first-aid/guideline-9-1-1-first-aid-for-management-of-bleeding) | 2021-04, amended 2025-07 editorial update (prolonged tourniquet use) |  |
| [ANZCOR 9.1.3](https://www.anzcor.org/home/first-aid/guideline-9-1-3-first-aid-for-burns) | 2023-03 |  |
| [ANZCOR 9.2.1](https://www.anzcor.org/home/first-aid/guideline-9-2-1-recognition-and-first-aid-management-of-suspected-heart-attack) | 2021-04 |  |
| [ANZCOR 9.2.2](https://www.anzcor.org/home/first-aid/guideline-9-2-2-stroke) | 2021-04 |  |
| [ANZCOR 9.2.4](https://www.anzcor.org/home/first-aid/9-2-4-first-aid-management-of-a-seizure) | 2024-06, amended undated minor wording clarification after a seizure |  |
| [ANZCOR 9.2.5](https://www.anzcor.org/home/first-aid/guideline-9-2-5-first-aid-for-asthma) | 2023-07 |  |
| [ANZCOR 9.2.7](https://www.anzcor.org/home/first-aid/guideline-9-2-7-first-aid-management-of-anaphylaxis) | 2019 | Oldest clinical guideline in use after 9.4.8; ASCIA updated its plans in 2026 (F06) |
| [ANZCOR 9.3.4](https://www.anzcor.org/home/first-aid/guideline-9-3-4-heat-induced-illness-hyperthermia) | 2020-09 | Approved 2020 |
| [ANZCOR 9.4.1](https://www.anzcor.org/home/first-aid/guideline-9-4-1-first-aid-management-of-australian-snake-bite) | 2021-04 |  |
| [ANZCOR 9.4.2](https://www.anzcor.org/home/first-aid/guideline-9-4-2-first-aid-management-of-spider-bite) | 2021-04 |  |
| [ANZCOR 9.4.5](https://www.anzcor.org/home/first-aid/guideline-9-4-5-first-aid-management-of-marine-envenomation) | 2025-06 |  |
| [ANZCOR 9.4.8](https://www.anzcor.org/home/first-aid/guideline-9-4-8-envenomation-pressure-immobilisation-technique) | 2011 | Approved 2011, oldest source in use (F33) |
| [ANZCOR 9.5.1](https://www.anzcor.org/home/first-aid/guideline-9-5-1-first-aid-management-of-poisoning) | 2025-06, amended 2026-07 (button battery: jam, not honey, under 1 year) | Amended July 2026; the app already reflects the jam-not-honey change |
| [ASCIA First Aid Plan 2026](https://www.allergy.org.au/hp/anaphylaxis/first-aid-for-anaphylaxis) | 2026 | 2026 plans cover four devices, including nasal adrenaline (F01) |
| [healthdirect n/a](https://www.healthdirect.gov.au/jellyfish-stings) | 2024-10 (last reviewed) | Doesn't list all the Irukandji signs the app credits to it (F17) |

ANZCOR updates in 2025 and 2026 that the app uses: 9.4.5 marine envenomation (June 2025), 9.5.1 poisoning (June 2025, amended July 2026), 9.1.1 bleeding (editorial, July 2025). Other 2026 updates were to advanced life support and paediatric guidelines for health professionals (11.x, 12.x, 14.2). ANZCOR's 2026 paediatric update added a section on choking in children, which the reviewer should compare with the lay choking steps (F37).

For Stage 3 (new topics): ANZCOR updated 9.3.3 Hypothermia and Cold-Related Injuries in March 2026, and combined its shock and sepsis guidance into one guideline.

## All findings

### HIGH

| ID | Topic | Item | Type | Finding | Proposed change |
|---|---|---|---|---|---|
| F01 | anaphylaxis | S2; flow r_ana | currency | The 2026 ASCIA plans say "give adrenaline device". Four devices are approved in Australia: EpiPen, Anapen and Jext injectors, and neffy nasal spray (Jext PBS listed from 1 June 2026, neffy from 1 July 2026). Each has its own instructions. General use devices in first aid kits are given when the person has no prescribed device, with the ASCIA First Aid Plan stored beside them. The app only describes an EpiPen or Anapen injected into the outer thigh. ANZCOR 9.2.7 dates from 2019, before neffy and Jext. *(ASCIA device instructions 2026)* | Draft for the reviewer, not final: Give an adrenaline device: their own if they have one, or a general use one from a first aid kit. Follow the instructions on the device and on their ASCIA Action Plan (or the ASCIA First Aid Plan kept with a general use device). Injectors (EpiPen, Anapen, Jext) go into the outer mid-thigh; neffy is sprayed into a nostril. Reviewer to decide the final wording, whether to name devices at all, and whether the drawings need a nasal spray version. Apply the same change to the question flow result. |
| F02 | anaphylaxis | new | omission | ASCIA plans say "if in doubt, give adrenaline device". The app does not say this. ANZCOR 9.2.7 does not include it either. *(ASCIA First Aid Plan 2026)* | Add: If in doubt, give the adrenaline device. |
| F07 | poison | S8 | discrepancy | ANZCOR 9.5.1 (section 4.6) says to give nothing by mouth if there is difficulty breathing or bleeding. The app only says to give honey or jam if they can breathe and swallow without trouble, so it misses the bleeding condition. *(ANZCOR 9.5.1)* | On the way, if they have no trouble breathing and no bleeding (including vomiting blood): over 1 year, 2 teaspoons (10 mL) of honey every 10 minutes... |

### MEDIUM

| ID | Topic | Item | Type | Finding | Proposed change |
|---|---|---|---|---|---|
| F03 | anaphylaxis | S1 | omission | ASCIA positioning detail is missing: hold young children flat, not upright; if unconscious or pregnant, use the recovery position (left side if pregnant); if breathing is hard, sit with legs outstretched. *(ASCIA First Aid Plan 2026)* | Add the three positioning points to step 1. |
| F04 | anaphylaxis | new | omission | ASCIA plans say to transfer the person to hospital for at least 4 hours of observation. The app does not say they need hospital after adrenaline. *(ASCIA First Aid Plan 2026)* | Add: They need to go to hospital to be watched for at least 4 hours, even if they seem better. |
| F06 | anaphylaxis | all | currency | ANZCOR 9.2.7 was approved in 2019. ASCIA updated its plans in 2026 and its acute management guidelines in October 2026. Where they differ, the reviewer must decide which to follow. *(ANZCOR 9.2.7)* | Reviewer decision: name ASCIA 2026 as the primary source for anaphylaxis, with ANZCOR 9.2.7 as secondary. |
| F08 | poison | W | not-in-source | The ambulance triggers "drowsy, trouble breathing, or you’re worried" are the app’s own. The guideline says to send for an ambulance promptly in its listed circumstances. *(ANZCOR 9.5.1)* | Reviewer to confirm or replace the 000 triggers. |
| F11 | collapse | S4 | discrepancy | The app says: if you can see something in the mouth, roll them onto their side and remove it, then tilt the head back. Guideline 4 says the person should not be routinely rolled onto the side, describes removing visible material with the head turned slightly downwards, and keeps rolling for fluid or matter blocking the airway. *(ANZCOR 4)* | Reviewer to confirm the airway step wording against Guideline 4 and the BLS flowchart. |
| F16 | marine | S4 | not-in-source | The current guideline (June 2025) says to liberally douse or spray with vinegar. The "30 seconds" duration was not found in it. *(ANZCOR 9.4.5)* | Reviewer to confirm. Possible wording: Pour plenty of vinegar over the sting, then pick off any tentacles. |
| F19 | marine | W | not-in-source | The geographic range "Bundaberg north, across the Top End to Geraldton WA" was not found in the current guideline, which refers to the tropical coastline. *(ANZCOR 9.4.5)* | Reviewer to confirm the range, or source it from Queensland or Surf Life Saving guidance, or replace with "tropical waters of northern Australia". |
| F20 | burns | S6 | omission | The guideline says not to apply cling wrap or hydrogel dressings to chemical burns. The app’s chemical burn step does not say this. *(ANZCOR 9.1.3)* | Add to the chemical burn step: Don’t cover it with cling wrap or a burn gel (hydrogel) dressing. |
| F29 | seizure | W | omission | The guideline’s reasons to call an ambulance also include: there is no seizure management plan, and you are concerned about any aspect of their care. *(ANZCOR 9.2.4)* | Add both to the "Call 000 if" list. |
| F33 | snake | all | currency | The pressure immobilisation guideline (9.4.8) was approved in 2011, the oldest source the app uses. It also lists sea snakes, which the app does not mention. *(ANZCOR 9.4.8)* | Reviewer to confirm 9.4.8 is still current; consider adding sea snakes to the note on which bites use this bandage. |
| F37 | choking | S7 | currency | "Two fingers" for infant chest thrusts comes from Guideline 6 (compressions), not Guideline 4. ANZCOR’s 2026 paediatric updates added a section on choking in children (health professional guideline); the reviewer should check the lay steps still agree. *(ANZCOR 4)* | Reviewer to check against the 2026 paediatric update. |
| F38 | 3d-captions | all | not-in-source | The six 3D captions are general anatomy written for the app and have no clinical source. | Reviewer to approve or rewrite each caption. |
| F39 | question-flow | all | not-in-source | The question flow’s questions and answer groupings are the app’s own wording. Results restate topic steps, so findings F01, F07 and F29 also affect it. *(ANZCOR 8)* | Reviewer to approve every node; apply topic corrections to matching results. |
| F40 | illustrations | all | not-in-source | The 57 drawings are simplified diagrams with no clinical source. Highest risk: CPR hand position, infant back blows, and the snake-bite bandage. | Reviewer to approve each drawing used in a step. |

### LOW

| ID | Topic | Item | Type | Finding | Proposed change |
|---|---|---|---|---|---|
| F05 | anaphylaxis | S1 | wording | ANZCOR says prevent further exposure to the trigger; ASCIA says flick out an insect sting if visible. The app says remove the trigger. *(ANZCOR 9.2.7)* | Stop further contact with the trigger if you can (for an insect sting, flick it out). |
| F09 | poison | S4 | omission | The guideline also allows saline or contact lens solution for flushing the eye. *(ANZCOR 9.5.1)* | In the eye: hold the eyelids open and flush with cold water, saline or contact lens solution for 15 minutes. |
| F10 | poison | S7 | wording | The guideline describes the battery compartment being open, and treats chest pain as a sign only alongside other circumstances. *(ANZCOR 9.5.1)* | Reviewer to confirm wording. |
| F12 | collapse | S2 | wording | ANZCOR describes "talk and touch" (for example "open your eyes") and squeezing the shoulders. The app says to say their name loudly. *(ANZCOR 3)* | Reviewer to confirm wording. |
| F13 | cpr | N1 | not-in-source | Swapping rescuers every couple of minutes is not in Guideline 8. The app already says so. *(ANZCOR 8)* | Reviewer to decide whether to keep it. |
| F14 | cpr | table | wording | Guideline 6 gives depth as one-third of the chest, about 4 cm (infant) and 5 cm (child), and more than 5 cm for adults. Age bands are not defined there. *(ANZCOR 6)* | Reviewer to confirm the depth table wording. |
| F15 | cpr | S6 | omission | Guideline 8 also lists stopping when a health professional directs that CPR be stopped. *(ANZCOR 8)* | Keep going until ... a paramedic or health professional takes over or tells you to stop ... |
| F17 | marine | S7; src | attribution | The Irukandji symptoms in step 7 (sweating, trouble breathing) are in ANZCOR 9.4.5 section 2.2 but not on the healthdirect page the app credits. *(ANZCOR 9.4.5)* | Credit ANZCOR 9.4.5 for the symptoms; keep healthdirect only if it supports something else. |
| F18 | marine | S9 | wording | The guideline summary says 45°C for 20 minutes; its body says 43 to 45°C for up to 30 minutes. The app matches the summary. *(ANZCOR 9.4.5)* | Reviewer to confirm. |
| F21 | burns | S2 | wording | The guideline says cool for at least 20 minutes. *(ANZCOR 9.1.3)* | Cool the burn under cool running water for at least 20 minutes. |
| F22 | burns | S6; S7 | omission | Chemical burns: the guideline allows flushing up to an hour, until stinging stops. Electrical: it gives 10 m as the maximum recommended distance and notes authorities differ. *(ANZCOR 9.1.3)* | Reviewer to confirm wording. |
| F23 | burns | S3 | wording | The guideline says remove wet, non-adherent clothing and jewellery without causing further damage. *(ANZCOR 9.1.3)* | Reviewer to confirm wording. |
| F24 | bleeding | W | wording | The app’s shock signs (pale, sweaty, confused, drowsy) are looser than the guideline’s criteria. *(ANZCOR 9.1.1)* | Reviewer to confirm wording. |
| F25 | bleeding | S4 | wording | The guideline places a tourniquet above the bleeding point. A July 2025 editorial covers prolonged tourniquet use. *(ANZCOR 9.1.1)* | Reviewer to confirm whether anything from the 2025 editorial belongs in a lay guide. |
| F26 | heart | S4 | wording | Aspirin is a weak recommendation ("suggests"); the guideline’s exclusion is known aspirin allergy (anaphylaxis). The app’s "unless they’re allergic" is more cautious. *(ANZCOR 9.2.1)* | Reviewer to confirm. |
| F27 | heart | W | omission | The guideline’s list of people with milder or unusual symptoms also includes people with chronic inflammatory conditions. *(ANZCOR 9.2.1)* | Reviewer to confirm the list. |
| F28 | stroke | D1 | omission | The guideline allows treating measured low blood glucose in a fully conscious person who can swallow. The app gives a blanket "nothing to eat or drink". *(ANZCOR 9.2.2)* | Reviewer to decide whether the exception belongs in a lay guide. |
| F30 | heat | W | not-in-source | "Very drowsy" and "hot dry skin" are not listed as ambulance triggers (dry skin is listed as a red flag sign). *(ANZCOR 9.3.4)* | Reviewer to confirm wording. |
| F31 | spider | S3 | wording | The 20-minute limit on cold packs is stated for redback bites only. *(ANZCOR 9.4.2)* | Reviewer to confirm. |
| F32 | snake | D2 | wording | The guideline says not to use an arterial tourniquet. The app’s "don’t use a tourniquet" is broader and does not conflict. *(ANZCOR 9.4.1)* | None needed unless the reviewer prefers the exact term. |
| F34 | asthma | S2 | not-in-source | "Shake it" is a device instruction, not in the guideline. *(ANZCOR 9.2.5)* | Reviewer to confirm. |
| F35 | unconscious | S1; S4 | attribution | Head tilt and rolling onto the back to start CPR come from Guidelines 4 and 8, not Guideline 3. *(ANZCOR 3)* | Credit Guidelines 4 and 8 as well. |
| F36 | all | 000 | attribution | ANZCOR covers Australia and New Zealand and gives no phone numbers. The 000 number is not sourced in the app. | Add the Australian Government Triple Zero site as the source for 000. |

## What was supported

Across the 16 topics, the core actions matched their sources: DRSABCD and when to start CPR; 30:2 at 100 to 120 a minute; back blows then chest thrusts, and no abdominal thrusts; direct pressure and tourniquet use; lay flat and adrenaline first for anaphylaxis; rest and aspirin for suspected heart attack; F.A.S.T. and calling even if signs resolve; the pressure bandage technique; vinegar for box jellyfish and hot water for bluebottles; 4 x 4 x 4 for asthma; 20 minutes of cool running water for burns; the seizure steps; cooling for heat stroke; jam, not honey, for babies after a button battery; and cold packs, not bandages, for redback bites.
