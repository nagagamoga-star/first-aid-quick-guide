/* "What's happening?" question flow.
   Questions follow the ANZCOR DRSABCD sequence (Danger, Response, Send for help, Airway, Breathing).
   Every result only restates steps already in TOPICS, and links to that topic for the full steps.
   Node fields: q question, note hint, a answers [{t, go, alarm}]; results have end:true, h heading, p text,
   call: true (call 000 now) or a string (when to call), topic: id to link to. */
var FLOW = {
  start: { q: 'Is it safe for you to go to them?', note: 'Check for danger to you, bystanders and the person.',
    a: [ { t: 'Yes, it’s safe', go: 'respond' }, { t: 'No, or I’m not sure', go: 'r_unsafe', alarm: true } ] },
  r_unsafe: { end: true, call: true, h: 'Stay back and call 000', p: 'Don’t put yourself at risk. Tell the call-taker what you can see, and only go to them once it’s safe.', topic: 'collapse' },

  respond: { q: 'Do they respond when you say their name loudly and squeeze their shoulders?',
    a: [ { t: 'No response', go: 'breathing', alarm: true }, { t: 'Yes, they respond', go: 'what' } ] },
  breathing: { call: true, q: 'Open their airway by gently tilting the head back. Are they breathing normally?', note: 'Look, listen and feel. Occasional gasps are not normal breathing.',
    a: [ { t: 'No, or only gasping', go: 'r_cpr', alarm: true }, { t: 'Yes, breathing normally', go: 'r_unconscious' } ] },
  r_cpr: { end: true, call: true, h: 'Start CPR now', p: 'Push hard and fast on the centre of the chest, 100 to 120 times a minute: 30 compressions, then 2 breaths. Send someone for an AED (defibrillator).', topic: 'cpr' },
  r_unconscious: { end: true, call: true, h: 'Put them in the recovery position', p: 'Roll them onto their side with the head tilted back, and keep checking their breathing. If they stop breathing normally, start CPR.', topic: 'unconscious' },

  what: { q: 'What’s the main problem?',
    a: [
      { t: 'Choking: can’t cough, breathe or speak', go: 'r_choking', alarm: true },
      { t: 'Struggling to breathe', go: 'breath', alarm: true },
      { t: 'Heavy bleeding', go: 'r_bleeding', alarm: true },
      { t: 'Chest pain or discomfort', go: 'r_heart', alarm: true },
      { t: 'Face drooping, arm weak or speech slurred', go: 'r_stroke', alarm: true },
      { t: 'Having a seizure (fitting)', go: 'r_seizure' },
      { t: 'A bite or sting', go: 'bite' },
      { t: 'A burn or scald', go: 'r_burns' },
      { t: 'Swallowed or breathed in something harmful', go: 'r_poison' },
      { t: 'Overheated: hot, dizzy or confused', go: 'r_heat' },
      { t: 'Something else', go: 'r_other' }
    ] },

  breath: { q: 'Which fits best?',
    a: [
      { t: 'Allergy signs: swollen face, lips or tongue, hives, after a food, sting or medicine', go: 'r_ana', alarm: true },
      { t: 'They have asthma, are wheezing or need their puffer', go: 'r_asthma' },
      { t: 'Something is stuck in their throat', go: 'r_choking', alarm: true },
      { t: 'None of these, or not sure', go: 'r_breath_other', alarm: true }
    ] },
  r_breath_other: { end: true, call: true, h: 'Call 000', p: 'Stay with them and follow the call-taker’s instructions. If they stop responding and aren’t breathing normally, start CPR.', topic: 'collapse' },

  bite: { q: 'What bit or stung them?',
    a: [
      { t: 'A snake, or might have been', go: 'r_snake', alarm: true },
      { t: 'A jellyfish or other sea creature', go: 'r_marine' },
      { t: 'A spider', go: 'r_spider' },
      { t: 'Something else, and they have allergy signs (swelling, hives, trouble breathing)', go: 'r_ana', alarm: true },
      { t: 'Not sure', go: 'r_other' }
    ] },

  r_choking: { end: true, call: true, h: 'Back blows, then chest thrusts', p: 'Give up to 5 sharp back blows between the shoulder blades, then up to 5 chest thrusts. Keep alternating until it clears. If they can still cough, encourage them to keep coughing.', topic: 'choking' },
  r_bleeding: { end: true, call: 'Call 000 if pressure doesn’t stop the bleeding, or they look pale, sweaty, confused or drowsy.', h: 'Press hard on the wound', p: 'Press firmly and directly on the wound with your hands or a pad, and keep pressing. Leave anything stuck in the wound where it is.', topic: 'bleeding' },
  r_heart: { end: true, call: 'Call 000 if symptoms are severe, getting worse quickly, or have lasted more than 10 minutes.', h: 'Stop and rest', p: 'Have them rest in whatever position is comfortable. An adult with chest pain not caused by an injury can be offered 300 mg aspirin, unless they’re allergic to it.', topic: 'heart' },
  r_stroke: { end: true, call: true, h: 'Possible stroke: call 000 now', p: 'Call even if the signs go away. Don’t give them anything to eat or drink.', topic: 'stroke' },
  r_seizure: { end: true, call: 'Call 000 if it lasts more than 5 minutes, it’s their first seizure, they’re injured, or it happened in water. The steps list every reason to call.', h: 'Protect them and time it', p: 'Move hard or sharp things away and cushion their head. Don’t hold them down or put anything in their mouth.', topic: 'seizure' },
  r_ana: { end: true, call: true, h: 'Give their adrenaline autoinjector', p: 'Lay them flat, or let them sit if breathing is hard. Inject their EpiPen or Anapen into the outer thigh, then call 000.', topic: 'anaphylaxis' },
  r_asthma: { end: true, call: 'Call 000 straight away if they can only say one or two words per breath, have blue lips or are getting drowsy.', h: 'Asthma first aid: 4 x 4 x 4', p: 'Sit them upright. Give 4 separate puffs of a blue/grey reliever, with 4 breaths after each puff, then wait 4 minutes.', topic: 'asthma' },
  r_snake: { end: true, call: true, h: 'Keep them still and bandage the bite', p: 'Bandage firmly over the bite, then wrap the whole limb and splint it. Don’t wash, cut or suck the bite.', topic: 'snake' },
  r_marine: { end: true, call: 'Call 000 if there’s more than one small sting, or they look or feel unwell.', h: 'Get them out of the water', p: 'For a box jellyfish or Irukandji sting, pour vinegar on it for 30 seconds. Never use fresh water. For a bluebottle, skip the vinegar and use hot water.', topic: 'marine' },
  r_spider: { end: true, call: 'Funnel-web (big black spider, mainly NSW and south-east Queensland): call 000 straight away.', h: 'Cold pack for most spider bites', p: 'For redbacks and most other spiders, use a cold pack, with no pressure bandage. A funnel-web bite needs a pressure bandage and splint.', topic: 'spider' },
  r_burns: { end: true, call: 'Call 000 for large or deep burns, burns to the face, hands, feet or genitals, or electrical or chemical burns.', h: 'Cool it under running water for 20 minutes', p: 'Take off rings and loose clothing near the burn. No ice, creams or butter.', topic: 'burns' },
  r_poison: { end: true, call: 'Call 000 if they’re drowsy or having trouble breathing. Otherwise call the Poisons Information Centre on 13 11 26.', h: 'Get expert advice now', p: 'Don’t make them vomit, and keep the container. A swallowed button battery needs an emergency department straight away.', topic: 'poison' },
  r_heat: { end: true, call: 'Call 000 early if they’re confused, very drowsy, having a seizure, or not improving quickly.', h: 'Get them into shade and cool them fast', p: 'Cold water up to the neck is best. Otherwise, wet them, put ice packs on the groin and armpits, and fan them.', topic: 'heat' },
  r_other: { end: true, call: true, h: 'If you’re worried, call 000', p: 'Describe what you can see and the call-taker will tell you what to do. If they stop responding and aren’t breathing normally, start CPR.', topic: 'collapse' }
};
