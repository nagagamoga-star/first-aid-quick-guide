/* Content: every step summarised from the ANZCOR guidelines named in each topic's src. */
var AZ = 'https://www.anzcor.org/home/';
var TOPICS = [
{
  id:'collapse', sev:'crit', tag:'Life-threatening', title:'Someone has collapsed', short:'DRSABCD: the first 7 checks', icon:'shoulders',
  k:'collapsed unconscious not responding drsabcd fainted',
  steps:[
    {a:'danger', t:'<b>D: Danger.</b> Check it’s safe for you, bystanders and the person. Don’t put yourself at risk.'},
    {a:'shoulders', t:'<b>R: Response.</b> Say their name loudly and squeeze their shoulders. If they respond, make them comfortable and keep watching them.'},
    {a:'phone', t:'<b>S: Send for help.</b> No response: call 000, or get someone else to call. Stay on the line and follow the call-taker.'},
    {a:'airway', t:'<b>A: Airway.</b> Open their mouth. If you can see something in it, roll them onto their side and remove it. Then tilt the head back gently to open the airway.'},
    {a:'breathing', t:'<b>B: Breathing.</b> Look, listen and feel. Not breathing normally, or only occasional gasps: start CPR. Breathing normally: put them in the <a href="#unconscious">recovery position</a>.'},
    {a:'compress', t:'<b>C: CPR.</b> 30 chest compressions, then 2 breaths. Keep going. <a href="#cpr">How to do CPR</a>.'},
    {a:'aed', t:'<b>D: Defibrillation.</b> Attach an AED (defibrillator) as soon as one arrives and follow its voice prompts.'}
  ],
  src:'ANZCOR Basic Life Support Flowchart and <a href="'+AZ+'basic-life-support/guideline-8-cardiopulmonary-resuscitation-cpr">Guideline 8, CPR</a> (approved April 2021).'
},
{
  id:'cpr', sev:'crit', tag:'Life-threatening', title:'CPR', short:'Not responding and not breathing normally', icon:'compress', extra:'cpr',
  k:'cpr not breathing compressions heart stopped cardiac arrest resuscitation aed defibrillator',
  when:'<strong>Start CPR</strong> if the person isn’t responding and isn’t breathing normally. Occasional gasps are not normal breathing.',
  steps:[
    {a:'handpos', t:'Lay them on their back on a firm surface. Put your hands on the <b>centre of the chest, on the lower half of the breastbone</b>. See the depth for their age above.'},
    {a:'compress', t:'Push hard and fast: <b>100 to 120 compressions a minute</b>, almost 2 a second. Let the chest come all the way back up after each one.'},
    {a:'breaths', t:'After <b>30 compressions, give 2 breaths</b>: tilt the head back, lift the chin, seal your mouth over theirs and blow for about 1 second each, until the chest rises.'},
    {a:'compress', t:'If you can’t or won’t give breaths, <b>keep doing compressions without stopping</b>. Compressions alone still help.'},
    {a:'aed', t:'Attach an <b>AED</b> as soon as one arrives and do what it says.'},
    {a:['timer','Keep going'], t:'Don’t stop to check them. Keep going until they respond or breathe normally, a paramedic or health professional takes over, or you physically can’t continue.'}
  ],
  notes:['Swap with another person every couple of minutes if you can. This is common practice rather than part of the ANZCOR guidelines.'],
  src:'ANZCOR <a href="'+AZ+'basic-life-support/guideline-6-compressions">Guideline 6, Compressions</a> and <a href="'+AZ+'basic-life-support/guideline-8-cardiopulmonary-resuscitation-cpr">Guideline 8, CPR</a> (both approved April 2021).'
},
{
  id:'choking', sev:'crit', tag:'Life-threatening', title:'Choking', short:'Can’t cough, breathe or speak', icon:'backblows',
  k:'choking can’t breathe food stuck airway baby',
  when:'<strong>Can cough, talk or cry?</strong> Encourage them to keep coughing and stay with them. Call 000 if it doesn’t clear. The steps below are for when they <strong>can’t</strong> cough, breathe or speak.',
  steps:[
    {g:'Adult or child', a:'phone', t:'<b>Call 000.</b>'},
    {g:'Adult or child', a:'backblows', t:'Give <b>up to 5 sharp back blows</b> between the shoulder blades with the heel of your hand. Check after each one. Stop as soon as it clears.'},
    {g:'Adult or child', a:'handpos', t:'Still blocked: give <b>up to 5 chest thrusts</b> on the same spot as CPR compressions. Make them sharper and slower than compressions. Check after each one.'},
    {g:'Adult or child', a:'repeat55', t:'Keep <b>alternating 5 back blows and 5 chest thrusts</b> until it clears or help arrives.'},
    {g:'Adult or child', a:'compress', t:'If they stop responding, start <a href="#cpr">CPR</a>.'},
    {g:'Baby under 1', a:'infant', t:'<b>Back blows:</b> lay the baby face down across your lap, head lower than the body, supporting the head. Up to 5 back blows.'},
    {g:'Baby under 1', a:'twofinger', t:'<b>Chest thrusts:</b> turn the baby onto their back, head down along your thigh. Use two fingers on the CPR spot. Up to 5 thrusts. Keep alternating.'}
  ],
  dont:['Don’t use abdominal thrusts (the Heimlich). ANZCOR doesn’t recommend them because of the risk of serious injury.','Don’t sweep blindly inside the mouth. Only remove something you can see.'],
  src:'ANZCOR <a href="'+AZ+'basic-life-support/guideline-4-airway">Guideline 4, Airway</a> (approved April 2021).'
},
{
  id:'bleeding', sev:'crit', tag:'Life-threatening', title:'Severe bleeding', short:'Press hard, keep pressing', icon:'pressure',
  k:'bleeding blood cut wound tourniquet nosebleed',
  when:'<strong>Call 000</strong> if bleeding won’t stop with pressure, or the person looks pale, sweaty, confused or drowsy.',
  steps:[
    {g:'Heavy bleeding', a:'pressure', t:'Press <b>firmly and directly on the wound</b> with your hands or a pad. This stops most bleeding.'},
    {g:'Heavy bleeding', a:'pressure', t:'Still bleeding: add a second pad and bandage more firmly. Make sure the pad sits right over the bleeding point. One or two pads press harder than a thick stack.'},
    {g:'Heavy bleeding', a:'embedded', t:'Something stuck in the wound? <b>Leave it in.</b> Put pads on each side of it and press on the pads.'},
    {g:'Heavy bleeding', a:'tourniquet', t:'<b>Tourniquet</b>, only for life-threatening bleeding from an arm or leg that pressure can’t stop, and only if you have one and know how to use it. Put it above the wound (5 cm above if there are no instructions), tighten until the bleeding stops, <b>write down the time</b> and tell the paramedics. Don’t cover it.'},
    {g:'Nosebleed', a:'nose', t:'Sit them up and lean them forward. Pinch the soft part of the nose, below the bony bridge, for <b>at least 10 minutes</b> (20 on a hot day or after exercise). Spit out blood rather than swallow it. Get medical help if it bleeds for more than 20 minutes.'}
  ],
  dont:['Don’t rely on raising the limb. There’s no evidence it controls bleeding.'],
  src:'ANZCOR <a href="'+AZ+'first-aid/guideline-9-1-1-first-aid-for-management-of-bleeding">Guideline 9.1.1, Bleeding</a> (approved April 2021, tourniquet advice reconfirmed July 2025).'
},
{
  id:'anaphylaxis', sev:'crit', tag:'Life-threatening', title:'Anaphylaxis', short:'Severe allergic reaction', icon:'autoinjector',
  k:'anaphylaxis allergy allergic epipen anapen adrenaline swelling hives peanut bee',
  when:'<strong>Signs:</strong> difficult or noisy breathing, wheeze or persistent cough, swelling of the face, tongue or throat, hoarse voice or trouble talking, dizziness or collapse, a young child going pale and floppy. Vomiting, stomach pain, hives or welts can also be signs.',
  steps:[
    {a:'layflat', t:'<b>Lay them flat. Don’t let them stand or walk.</b> If breathing is hard, let them sit. Remove the trigger if you can.'},
    {a:'autoinjector', t:'<b>Give their adrenaline autoinjector</b> (EpiPen or Anapen) into the outer thigh. Follow their ASCIA Action Plan if they have one.'},
    {a:'phone', t:'<b>Call 000.</b>'},
    {a:'puffer', t:'If they have asthma, give their reliever puffer for breathing symptoms, <b>after</b> the adrenaline.'},
    {a:['timer','5 min'], t:'No improvement after <b>5 minutes</b>: give a second autoinjector if one is available.'},
    {a:'compress', t:'If they stop responding and aren’t breathing normally, start <a href="#cpr">CPR</a>.'}
  ],
  notes:['If someone with a known allergy and asthma suddenly has trouble breathing, ASCIA’s action plans say to give adrenaline first, then the asthma reliever.'],
  src:'ANZCOR <a href="'+AZ+'first-aid/guideline-9-2-7-first-aid-management-of-anaphylaxis">Guideline 9.2.7, Anaphylaxis</a> (approved 2019); <a href="https://www.allergy.org.au/hp/anaphylaxis/first-aid-for-anaphylaxis">ASCIA first aid for anaphylaxis</a>.'
},
{
  id:'heart', sev:'crit', tag:'Life-threatening', title:'Heart attack', short:'Chest pain, breathless, sweaty', icon:'chestpain',
  k:'heart attack chest pain aspirin angina',
  when:'<strong>Signs:</strong> pain or discomfort in the chest, neck, jaw or arms; shortness of breath; looking pale; sweating; nausea; dizziness. Women, older people, people with diabetes, and Aboriginal and Torres Strait Islander people may have mild or unusual symptoms, sometimes just breathlessness.',
  steps:[
    {a:'situp', t:'<b>Stop and rest</b> in whatever position is comfortable.'},
    {a:'spray', t:'If they have prescribed angina medicine (tablet or spray), help them take it as directed.'},
    {a:'phone', t:'<b>Call 000</b> if symptoms are severe, getting worse quickly, or have lasted more than 10 minutes. Stay with them.'},
    {a:'aspirin', t:'For an adult with chest pain not caused by an injury, offer <b>300 mg aspirin</b>, unless they’re allergic to aspirin.'},
    {a:'aedbox', t:'Find the nearest <b>AED</b> and bring it over.'},
    {a:'compress', t:'If they stop responding and aren’t breathing normally, start <a href="#cpr">CPR</a>.'}
  ],
  src:'ANZCOR <a href="'+AZ+'first-aid/guideline-9-2-1-recognition-and-first-aid-management-of-suspected-heart-attack">Guideline 9.2.1, Suspected heart attack</a> (approved April 2021).'
},
{
  id:'stroke', sev:'crit', tag:'Life-threatening', title:'Stroke', short:'Think F.A.S.T.', icon:'fast',
  k:'stroke fast face arm speech',
  when:'<strong>Any of these signs, call 000 now.</strong> Other signs include sudden numbness, loss of balance, loss of vision, a sudden severe headache, confusion or drowsiness.',
  steps:[
    {g:'Check F.A.S.T.', a:'fast', t:'<b>Face:</b> ask them to smile. Is one side drooping?'},
    {g:'Check F.A.S.T.', a:'arms', t:'<b>Arms:</b> can they lift both arms, or is one weak?'},
    {g:'Check F.A.S.T.', a:'speech', t:'<b>Speech:</b> is it slurred, or are they confused by what you say?'},
    {g:'Check F.A.S.T.', a:'phone', t:'<b>Time:</b> call 000 now, even if the signs went away.'},
    {g:'While you wait', a:'recovery', t:'Unconscious but breathing: roll them onto their side and keep the airway clear.'},
    {g:'While you wait', a:'compress', t:'Not breathing normally: start <a href="#cpr">CPR</a>.'}
  ],
  dont:['Don’t give them anything to eat or drink. They may not be able to swallow safely.'],
  src:'ANZCOR <a href="'+AZ+'first-aid/guideline-9-2-2-stroke">Guideline 9.2.2, Stroke</a> (approved April 2021).'
},
{
  id:'unconscious', sev:'crit', tag:'Needs an ambulance', title:'Unconscious, breathing', short:'Recovery position', icon:'recovery',
  k:'unconscious breathing recovery position side passed out',
  steps:[
    {a:'recovery', t:'Gently get them onto the ground and <b>roll them onto their side</b>, keeping the head tilted back so the airway stays open. Don’t leave them sitting in a chair or with their head between their knees.'},
    {a:'phone', t:'<b>Call 000.</b>'},
    {a:'pressure', t:'Deal with any heavy bleeding.'},
    {a:'breathing', t:'<b>Keep checking their breathing.</b> If they stop breathing normally, roll them onto their back and start <a href="#cpr">CPR</a>.'}
  ],
  notes:['If you think they’ve hurt their neck or back, move them as little as possible, but an open airway comes first.'],
  src:'ANZCOR <a href="'+AZ+'basic-life-support/guideline-3-recognition-and-first-aid-management-of-the-unconscious-person">Guideline 3, The unconscious person</a> (approved April 2021).'
},
{
  id:'snake', sev:'urgent', tag:'Urgent', title:'Snake bite', short:'Bandage, splint, keep still', icon:'bandage',
  k:'snake bite pressure bandage immobilisation taipan brown',
  when:'<strong>Call 000 for any suspected snake bite</strong>, even if there’s no pain or visible mark. Bites can show as a single scratch.',
  steps:[
    {a:'still', t:'<b>Keep them still and calm.</b> Don’t let them walk. Bring the ambulance to them.'},
    {a:'bitewrap', t:'<b>Bandage the bite firmly.</b> Use a broad elastic or crepe bandage (10 to 15 cm wide is ideal; clothing or towels will do). Wrap it directly over the bite, firm enough that you can’t easily slide a finger under it.'},
    {a:'bandage', t:'<b>Then bandage the whole limb.</b> Start at the fingers or toes and wrap upwards as far as you can go. Go over clothing rather than removing it.'},
    {a:'splint', t:'<b>Splint the limb</b> so the joints either side of the bite can’t move. For an arm, add a sling. Leave the bandages and splint on until they’re assessed in hospital.'},
    {a:'compress', t:'Watch closely. If they stop responding and aren’t breathing normally, start <a href="#cpr">CPR</a>. CPR won’t expose you to the venom.'}
  ],
  notes:['Bite on the body, head or neck: press firmly on the bite, but don’t restrict breathing or press on the neck or head.',
    'Warning signs include headache, vomiting, blurred or double vision, drooping eyelids, trouble speaking, swallowing or breathing, and weakness. Collapse can happen 10 to 60 minutes after a bite. After some brown snake bites, a person collapses and then seems to recover. They still need hospital.',
    'The same bandaging is used for funnel-web spider bites, blue-ringed octopus and cone shell stings.'],
  dont:['Don’t wash, cut or suck the bite.','Don’t use a tourniquet.','Don’t try to catch or kill the snake. Take a photo only if it’s safe.'],
  src:'ANZCOR <a href="'+AZ+'first-aid/guideline-9-4-1-first-aid-management-of-australian-snake-bite">Guideline 9.4.1, Snake bite</a> (approved April 2021) and <a href="'+AZ+'first-aid/guideline-9-4-8-envenomation-pressure-immobilisation-technique">Guideline 9.4.8, Pressure immobilisation</a>.'
},
{
  id:'marine', sev:'urgent', tag:'Urgent in the tropics', title:'Jellyfish and marine stings', short:'Box jellyfish, Irukandji, bluebottle', icon:'vinegar',
  k:'jellyfish box jellyfish irukandji stinger bluebottle vinegar stonefish stingray octopus cone shell marine beach',
  when:'<strong>Tropical waters (Bundaberg north, across the Top End to Geraldton WA)</strong> have box jellyfish and Irukandji, which can kill. If you can’t be sure a sting is from a harmless jellyfish or a bluebottle, treat it as dangerous and watch the person closely.',
  steps:[
    {g:'Box jellyfish and Irukandji', a:'beach', t:'<b>Get them out of the water.</b> Get a lifeguard if there is one.'},
    {g:'Box jellyfish and Irukandji', a:'phone', t:'<b>Call 000</b> if there’s more than one small sting, or they look or feel unwell.'},
    {g:'Box jellyfish and Irukandji', a:'compress', t:'If they stop responding and aren’t breathing normally, start <a href="#cpr">CPR</a>.'},
    {g:'Box jellyfish and Irukandji', a:'vinegar', t:'<b>Pour vinegar on the sting for 30 seconds</b>, then pick off any tentacles. Picking them off is safe for you.'},
    {g:'Box jellyfish and Irukandji', a:'seawater', t:'No vinegar? Pick off the tentacles and rinse with sea water. <b>Never fresh water</b>, which can make remaining stingers fire.'},
    {g:'Box jellyfish and Irukandji', a:'coldpack', t:'Use a cold pack, or ice in a dry plastic bag, for pain.'},
    {g:'Box jellyfish and Irukandji', a:['timer','Stay with them'], t:'<b>Stay with them.</b> Irukandji symptoms can start 5 to 40 minutes after a sting that seemed minor. Severe pain, sweating, vomiting or trouble breathing means call 000.'},
    {g:'Bluebottle', a:'seawater', t:'Only if you’re sure it’s a bluebottle, the sting is small and the person is well. Pick off tentacles and rinse with sea water. <b>No vinegar</b>, and don’t rub.'},
    {g:'Bluebottle', a:'hotwater', t:'Soak the area in <b>hot water, about 45°C, for 20 minutes</b>. Use water the person can tolerate without it burning them. No hot water, or it doesn’t help: use a cold pack.'},
    {g:'Bluebottle', a:'phone', t:'<b>Call 000</b> if pain spreads or won’t settle, the sting covers half a limb or more, or it’s near the eye.'},
    {g:'Stonefish and stingray', a:'phone', t:'<b>Call 000.</b>'},
    {g:'Stonefish and stingray', a:'embedded', t:'Don’t pull out a barb or spine. Pad around it and press on the padding. A stingray wound to the chest or stomach can cause hidden bleeding: keep them still.'},
    {g:'Stonefish and stingray', a:'hotwater', t:'For a limb, soak it in hot water, no hotter than you could comfortably keep your own hand in.'},
    {g:'Blue-ringed octopus and cone shell', a:'splint', t:'<b>Call 000.</b> Apply the pressure bandage and splint as for a <a href="#snake">snake bite</a>, and keep them still.'},
    {g:'Blue-ringed octopus and cone shell', a:'breathing', t:'The bite may be painless. Watch for numb lips and tongue and weakening breathing.'},
    {g:'Blue-ringed octopus and cone shell', a:'breaths', t:'They may stop breathing yet still hear you. Reassure them and keep up CPR until paramedics take over, even for a long time.'}
  ],
  dont:['Don’t use fresh water on a jellyfish sting.','Don’t use vinegar on a bluebottle sting.','Don’t use a pressure bandage for stonefish or stingray.'],
  src:'ANZCOR <a href="'+AZ+'first-aid/guideline-9-4-5-first-aid-management-of-marine-envenomation">Guideline 9.4.5, Marine envenomation</a> (approved June 2025); Irukandji warning signs from <a href="https://www.healthdirect.gov.au/jellyfish-stings">healthdirect, Jellyfish stings</a>.'
},
{
  id:'asthma', sev:'urgent', tag:'Urgent', title:'Asthma attack', short:'4 puffs, 4 breaths, 4 minutes', icon:'puffer',
  k:'asthma puffer ventolin asmol wheeze breathing spacer',
  when:'<strong>Call 000 straight away</strong> if they can only say one or two words per breath, are gasping, have blue lips, are pale and sweaty, are getting drowsy, or the puffer isn’t helping. Then keep doing the steps.',
  steps:[
    {a:'situp', t:'<b>Sit them upright.</b> Stay calm and stay with them.'},
    {a:'puffer', t:'Give <b>4 separate puffs</b> of a blue/grey reliever (like Ventolin or Asmol). Shake it, put 1 puff into a spacer, and have them take 4 breaths from the spacer. Repeat until 4 puffs are done. No spacer: use the puffer directly.'},
    {a:['timer','4 min'], t:'<b>Wait 4 minutes.</b> Not better: give 4 more puffs.'},
    {a:'phone', t:'Still not better: <b>call 000</b> and keep giving 4 puffs every 4 minutes until help arrives.'}
  ],
  notes:['Use their own puffer if possible, otherwise one from a first aid kit or borrowed from someone. If they have an Asthma Action Plan, follow that.'],
  src:'ANZCOR <a href="'+AZ+'first-aid/guideline-9-2-5-first-aid-for-asthma">Guideline 9.2.5, Asthma</a> (approved July 2023).'
},
{
  id:'burns', sev:'urgent', tag:'Urgent', title:'Burns and scalds', short:'20 minutes under cool running water', icon:['tap','20 min'],
  k:'burn scald fire chemical electrical',
  when:'<strong>Call 000</strong> for large or deep burns; burns to the face, hands, feet, genitals or a major joint; burns that go all the way round a limb; smoke, chemical or electrical burns; or burns on a baby or elderly person. <strong>Every burn on a child should be seen by a doctor.</strong>',
  steps:[
    {g:'Heat burns', a:'stopdrop', t:'<b>Stop the burning.</b> On fire: stop, drop, cover your face and roll, or smother the flames with a blanket.'},
    {g:'Heat burns', a:['tap','20 min'], t:'<b>Cool the burn under cool running water for 20 minutes.</b> It still helps up to 3 hours after the burn.'},
    {g:'Heat burns', a:'ring', t:'Take off rings, watches and wet or loose clothing near the burn, unless they’re stuck to it.'},
    {g:'Heat burns', a:'cling', t:'<b>Cover loosely</b> with cling film or a non-stick dressing. Lay it on; don’t wrap it round a limb, and don’t use it on the face.'},
    {g:'Heat burns', a:'blanket', t:'Keep the rest of them warm, especially small children, who chill quickly.'},
    {g:'Chemical burns', a:['tap','20+ min'], t:'Brush off any powder, then flush with running water for <b>at least 20 minutes</b>. Call the Poisons Information Centre on <b>13 11 26</b>.'},
    {g:'Electrical burns', a:'power', t:'<b>Turn off the power</b> before touching them. Stay at least 10 metres from fallen power lines.'}
  ],
  dont:['Don’t use ice or iced water.','Don’t put on creams, butter, ointments or powders.','Don’t break blisters or peel off anything stuck to the burn.'],
  src:'ANZCOR <a href="'+AZ+'first-aid/guideline-9-1-3-first-aid-for-burns">Guideline 9.1.3, Burns</a> (approved March 2023).'
},
{
  id:'seizure', sev:'urgent', tag:'Urgent', title:'Seizure', short:'Protect, time it, side position', icon:'seizure',
  k:'seizure fit epilepsy convulsion',
  when:'<strong>Call 000</strong> if the seizure lasts more than 5 minutes, another one starts, they don’t wake within 5 minutes, it happened in water, they’re injured or may be pregnant, it’s their first seizure, you don’t know them, or it’s different from their usual seizures.',
  steps:[
    {a:'seizure', t:'Ease their fall if you can and <b>move hard or sharp things away</b>. Put something soft and flat under their head, like a folded jumper. Follow their seizure plan if they have one.'},
    {a:['timer','Time it'], t:'<b>Time the seizure.</b>'},
    {a:'recovery', t:'Roll them onto their side when you can. When it stops, if they’re unresponsive but breathing, keep them in the <a href="#unconscious">recovery position</a> and reassure them as they come round.'}
  ],
  dont:['Don’t hold them down, unless it’s needed to stop an injury.','Don’t put anything in their mouth or force it open.','Don’t put a child in a bath to cool them.','No food or drink until they’re fully awake.'],
  src:'ANZCOR <a href="'+AZ+'first-aid/9-2-4-first-aid-management-of-a-seizure">Guideline 9.2.4, Seizure</a> (approved June 2024).'
},
{
  id:'heat', sev:'urgent', tag:'Urgent', title:'Heat illness', short:'Shade, then cool them fast', icon:'shade',
  k:'heat stroke exhaustion hot sun dehydration hyperthermia',
  when:'<strong>Call 000 early</strong> if they’re confused, very drowsy, having a seizure, have hot dry skin, or aren’t improving quickly. Don’t wait to cool them first. Early signs: hot, sweaty, breathless, dizzy or faint, nausea, can’t keep going.',
  steps:[
    {a:'shade', t:'<b>Move them into shade</b> or somewhere cool. Loosen or remove extra clothing.'},
    {a:'coolwater', t:'<b>Cool them fast.</b> Best for anyone over 5: lie them in cold water up to the neck for 15 minutes.'},
    {a:'icepacks', t:'No cold water bath? Wet them with a hose or shower, put ice packs on the groin, armpits, cheeks, palms and soles, keep wetting the skin and fan them non-stop.'},
    {a:'icepacks', t:'Children 5 and under: sponge them in a lukewarm bath, or keep wetting the skin and fanning.'},
    {a:'cup', t:'Fully awake and able to swallow: give cool water, or a sports drink after hard exercise.'},
    {a:'breathing', t:'Keep checking they’re conscious and breathing. Not breathing normally: start <a href="#cpr">CPR</a>.'}
  ],
  src:'ANZCOR <a href="'+AZ+'first-aid/guideline-9-3-4-heat-induced-illness-hyperthermia">Guideline 9.3.4, Heat induced illness</a> (approved September 2020).'
},
{
  id:'poison', sev:'urgent', tag:'Urgent', title:'Poisoning', short:'Call 13 11 26. Includes button batteries', icon:['phone','13 11 26'],
  k:'poison poisoning swallowed overdose chemical button battery medicine',
  when:'<strong>Poisons Information Centre: 13 11 26</strong>, 24 hours, for advice. <strong>Call 000</strong> if they’re drowsy, having trouble breathing, or you’re worried.',
  steps:[
    {g:'Poisons', a:'danger', t:'If it’s safe, move them away from the poison or the poison away from them.'},
    {g:'Poisons', a:'cup', t:'<b>Swallowed:</b> have them rinse their mouth with water.'},
    {g:'Poisons', a:['tap','Flush'], t:'<b>On the skin:</b> remove contaminated clothing and flush with running water.'},
    {g:'Poisons', a:'eye', t:'<b>In the eye:</b> hold the eyelids open and flush with cold water for 15 minutes.'},
    {g:'Poisons', a:'air', t:'<b>Breathed in:</b> get them into fresh air without breathing it yourself.'},
    {g:'Poisons', a:'bottle', t:'Find out what, how much and when. <b>Take the container</b> to hospital with them.'},
    {g:'Button battery', a:'hospital', t:'Suspect it if a device’s battery cover is open, or a child is drooling, vomiting or has chest pain. <b>Go to an emergency department or call 000 immediately.</b>'},
    {g:'Button battery', a:['honey','Honey: 10 mL every 10 min'], t:'On the way, if they can breathe and swallow without trouble: <b>over 1 year</b>, 2 teaspoons (10 mL) of honey every 10 minutes. Use jam if there’s no honey.'},
    {g:'Button battery', a:['honey','Jam: 10 mL every 10 min'], t:'<b>Under 1 year:</b> 2 teaspoons of jam every 10 minutes. <b>Never honey</b> for a baby. Nothing else by mouth, and don’t delay getting help to do this.'}
  ],
  dont:['Don’t make them vomit.','Don’t give anything to “neutralise” a chemical.'],
  src:'ANZCOR <a href="'+AZ+'first-aid/guideline-9-5-1-first-aid-management-of-poisoning">Guideline 9.5.1, Poisoning</a> (approved June 2025, amended July 2026).'
},
{
  id:'spider', sev:'calm', tag:'Usually not urgent', title:'Spider bite', short:'Funnel-web is the exception', icon:'spider',
  k:'spider redback funnel-web funnel web bite',
  steps:[
    {g:'Funnel-web', a:'phone', t:'Big black spider, mainly NSW and south-east Queensland. <b>Call 000 straight away.</b> Effects can start within 10 minutes.'},
    {g:'Funnel-web', a:'splint', t:'Apply the pressure bandage and splint as for a <a href="#snake">snake bite</a>, and keep them still.'},
    {g:'Redback and all others', a:['coldpack','Up to 20 min'], t:'Use an ice or cold pack for pain, for <b>no more than 20 minutes</b> at a time.'},
    {g:'Redback and all others', a:'nobandage', t:'<b>No pressure bandage.</b> It makes redback pain worse.'},
    {g:'Redback and all others', a:'hospital', t:'Get medical help if it’s a young child, the pain is severe, or they become unwell or collapse.'}
  ],
  src:'ANZCOR <a href="'+AZ+'first-aid/guideline-9-4-2-first-aid-management-of-spider-bite">Guideline 9.4.2, Spider bite</a> (approved April 2021).'
}
];
