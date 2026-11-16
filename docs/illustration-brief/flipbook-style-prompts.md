# Flipbook-style step pictures: ChatGPT prompt pack

Owner request (17 Nov 2026): step pictures in the style of the "First Aid Quick Guide" flipbook reference.
Generate one picture per prompt. Save each with the file name shown (for example `compress.png`) in one folder, then ask Claude to import the folder. Each file name is the drawing key the app already uses, so the import maps it to every step with that key.

Every pose below is taken from the app's own step text (`src/topics.js`). It is not a clinical source. A qualified reviewer still approves each picture.

## Paste this first in every new chat (style block)

> Flat vector cartoon illustration in a clean modern first-aid manual style: bold smooth outlines, soft cel shading, warm friendly faces, natural adult proportions, realistic hands with five fingers. The first aider is a woman with a brown ponytail in a plain red polo shirt with no logo, cross or badge, navy trousers, blue disposable gloves when touching a wound or body fluids. The injured or ill person is an adult man with short dark hair in a plain grey or blue T-shirt and jeans, unless the prompt says otherwise. Pure white background, no scenery unless the prompt says so, subject centred with margin around it. One action per picture, shown clearly from the angle that best shows hand and body position. Use at most one simple red arrow, only where the prompt asks for it. **No text, letters, numbers, labels, logos, watermarks or speech bubbles anywhere in the image.** Square 1024 × 1024.

Then send one line per picture: `Picture: <prompt>`.

## Things the reference gets wrong (do not copy)

- The "Choking, Adult" panel shows abdominal thrusts (fist under the ribs from behind). ANZCOR teaches back blows then chest thrusts; abdominal thrusts are not used. See `data/media.json` (`abdominal-thrusts`, rejected).
- The uniform has a white cross on red. Leave the shirt plain (no cross, no emblem, no St John or Red Cross look).
- Bee sting: the app has no bee topic.
- Text inside pictures ("30 chest compressions", "000"): keep text out so captions stay editable and correct.

## Prompts

### Someone has collapsed / CPR
| File | Prompt |
|---|---|
| `danger.png` | First aider standing at a distance, one hand raised in a "stop" gesture, looking left and right to check the area is safe before approaching a man lying on the ground. |
| `shoulders.png` | First aider kneeling beside a man lying on his back, both hands squeezing his shoulders, leaning in and speaking loudly to him. |
| `phone.png` | First aider kneeling beside a man lying on the ground, holding a mobile phone to her ear, calling for an ambulance. |
| `airway.png` | Side view: first aider kneeling at the head of a man lying on his back, one hand on his forehead and two fingertips under the bony part of his chin, tilting his head back so the chin points up. Small red curved arrow showing the head tilting back. |
| `breathing.png` | Side view: first aider kneeling beside a man lying on his back, her cheek close to his mouth and nose, eyes looking along his chest to watch it rise. |
| `handpos.png` | Close-up from above: heel of one hand on the centre of a man's bare chest, on the lower half of the breastbone, the other hand on top with fingers interlaced and lifted off the ribs. |
| `compress.png` | Side view: first aider kneeling beside a man lying on his back on the floor, arms straight and locked, shoulders directly over her hands, heel of the hand on the centre of his chest. Short red arrow pointing straight down. |
| `breaths.png` | Side view: first aider kneeling at a man's head, one hand on his forehead tilting it back and pinching his nose, the other lifting his chin, her mouth sealed over his mouth, his chest slightly risen. |
| `aed.png` | A man lying on his back with his shirt open: one AED pad on the upper right chest below the collarbone, the other on the left side of the chest below the armpit; wires lead to an open yellow AED beside him. First aider kneeling, hands off the man. |
| `aedbox.png` | A wall-mounted green AED cabinet with a defibrillator inside, the first aider opening the door. No text on the cabinet. |
| `timer.png` | First aider kneeling beside a person, glancing at a wristwatch on her wrist. |
| `recovery.png` | A man lying on his side on the floor: top leg bent forward at hip and knee resting on the ground, top hand under his cheek, head tilted back, mouth angled down. First aider kneeling behind him. |

### Choking
| File | Prompt |
|---|---|
| `backblows.png` | A man standing and leaning well forward, hands at his throat; the first aider stands slightly behind and to his side, supporting his chest with one hand and raising the heel of her other hand to strike between his shoulder blades. |
| `repeat55.png` | Two small side-by-side panels with no text: left, a back blow between the shoulder blades of a man leaning forward; right, the same man with the first aider's hand on the centre of his chest for a chest thrust. A curved red arrow loops between them. |
| `infant.png` | Seated first aider with a baby lying face down along her thigh, the baby's head lower than its body, her hand supporting the baby's jaw; her other hand raised to give a back blow between the baby's shoulder blades. |
| `twofinger.png` | Seated first aider with a baby lying face up along her thigh, head lower than the body, supported by her hand; two fingertips of her other hand on the centre of the baby's chest, just below the nipple line. |

### Bleeding
| File | Prompt |
|---|---|
| `pressure.png` | Gloved hands pressing a folded white pad firmly onto a bleeding wound on a forearm. |
| `embedded.png` | A forearm with a short object stuck in a wound, left in place; gloved hands pressing rolled pads on either side of it, not on the object. |
| `tourniquet.png` | A black tourniquet strap fastened around a thigh a hand's width above a wound, gloved hands tightening the windlass. |
| `nose.png` | A man sitting up and leaning forward, pinching the soft part of his nose below the bony bridge with thumb and finger. |

### Severe allergic reaction, asthma, heart
| File | Prompt |
|---|---|
| `layflat.png` | A woman lying flat on her back on the floor, legs straight; the first aider kneeling beside her, one hand gently on her shoulder. |
| `autoinjector.png` | Close-up: a hand pressing an adrenaline autoinjector straight down, at a right angle, into the outer middle of a thigh through trousers. The tip of the injector is against the thigh. |
| `puffer.png` | A man sitting upright breathing through a clear spacer attached to a blue reliever puffer, his hand on the puffer. |
| `situp.png` | A man sitting upright on a chair, leaning slightly forward with hands on his knees, the first aider crouched beside him. |
| `spray.png` | A seated man holding a small medicine spray bottle under his tongue, the first aider beside him. |
| `aspirin.png` | First aider handing a seated man a single tablet and a glass of water. |
| `fast.png` | Close-up of a man's face with one side of the mouth drooping when he tries to smile. |
| `arms.png` | A man trying to lift both arms in front of him; one arm drifts down lower than the other. |
| `speech.png` | First aider talking to a confused-looking seated man who is trying to speak, his mouth slightly slack. |

### Snake bite, spiders, marine stings
| File | Prompt |
|---|---|
| `still.png` | A man lying still on his back on the ground, the first aider kneeling beside him, one hand on his shoulder, calming him. |
| `bitewrap.png` | Two small puncture marks on a lower leg; a wide elastic bandage being wrapped firmly directly over the bite. |
| `bandage.png` | A whole leg wrapped in a wide elastic bandage from the toes up to the upper thigh, the turns overlapping, the roll at the top. |
| `splint.png` | A bandaged leg tied to a padded board splint with several ties, so the knee and ankle cannot move. |
| `nobandage.png` | A spider bite mark on a forearm with a cold pack held on it, and a rolled bandage set aside beside it. |
| `coldpack.png` | A cold pack wrapped in a cloth held on a forearm. |
| `beach.png` | First aider helping a man walk out of the shallow sea onto the sand. |
| `vinegar.png` | Vinegar being poured from a bottle over red sting lines on a lower leg, at the beach. |
| `seawater.png` | Gloved fingers picking a blue tentacle off a forearm, then sea water poured over it from a cupped hand. |
| `hotwater.png` | A forearm resting in a bowl of steaming hot water. |

### Burns, seizures, heat, poisons
| File | Prompt |
|---|---|
| `stopdrop.png` | A man lying on the ground rolling, arms crossed over his face, small flames on his sleeve going out. |
| `tap.png` | A burnt forearm held under cool running water from a tap. |
| `ring.png` | Fingers gently sliding a ring off a swollen finger near a burn. |
| `cling.png` | Cling film laid loosely over a burn on a forearm, not wrapped around it. |
| `blanket.png` | A child sitting with a blanket around the shoulders, a burnt arm left uncovered under a loose dressing. |
| `power.png` | A hand switching off a power switch at a wall power point. |
| `seizure.png` | A man on the floor having a seizure; the first aider kneeling nearby has slid a folded jacket under his head and moved a chair away, not holding him. |
| `shade.png` | First aider helping a hot, flushed man sit down in the shade of a tree. |
| `coolwater.png` | A man lying in a bath of cold water up to his neck, first aider beside the bath supporting his head. |
| `icepacks.png` | A man lying down with ice packs placed in his armpits and at his neck, the first aider holding a wet cloth. |
| `cup.png` | A seated person sipping from a cup of water. |
| `eye.png` | First aider holding a man's eyelids open with gloved fingers while pouring a gentle stream of water from a jug across the eye, from the inner corner outwards, head tilted to the side. |
| `air.png` | First aider helping a coughing man out through an open door into fresh air. |
| `bottle.png` | A hand holding a medicine bottle and a household chemical bottle side by side, ready to take to hospital. |
| `hospital.png` | A parent carrying a small child towards a hospital emergency entrance (no text on the building). |
| `honey.png` | A parent giving a toddler a teaspoon of honey. |

## After generating

1. Check each picture against its step before importing. Regenerate any with text, extra fingers, wrong hand position or a cross on the shirt.
2. Put the PNGs in one folder (for example `Downloads/flipbook`) and ask Claude to import it. Claude converts to WebP, records each in `data/media.json` (origin `generated`) and opens a PR.
3. Pictures stay "not clinically reviewed" until a qualified reviewer approves them.
