"""Make the phone-sized topic cards from assets/cards/source/*.jpg.

Writes assets/cards/<id>.webp and data/topic-cards.json (alts and review notes
live here; the script fills width, height and sha256). Originals stay in
assets/cards/source/ and are not referenced by the app.

Usage: python3 tools/build_topic_cards.py
"""
import hashlib, json, os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'assets', 'cards', 'source')
OUT = os.path.join(ROOT, 'assets', 'cards')
MAX_W = 640
QUALITY = 68

# Alt text is written from the steps in src/topics.js. Wording printed on the
# picture is not the instruction.
CARDS = [
  {
    'id': 'cover', 'topic': None, 'title': 'First Aid Quick Guide', 'source': '00-cover.jpg',
    'alt': 'Cover of the First Aid Quick Guide. A helper gives chest compressions to a person lying on their back. The written steps are the instruction, not this picture.',
    'reviewNotes': ['AI-generated. Needs clinical sign-off before the unreviewed label can be removed.']
  },
  {
    'id': 'collapse', 'topic': 'collapse', 'title': 'Someone has collapsed', 'source': 'collapse.jpg',
    'alt': 'Someone has collapsed. Check it is safe, check for a response, call 000, open the airway, look listen and feel for breathing, start CPR if they are not breathing normally, and use an AED when one arrives.',
    'reviewNotes': ['AI-generated. Needs clinical sign-off before the unreviewed label can be removed.']
  },
  {
    'id': 'cpr', 'topic': 'cpr', 'title': 'CPR', 'source': 'cpr.jpg',
    'alt': 'CPR. Lay them on their back on a firm surface. Hands on the centre of the chest, on the lower half of the breastbone. Push hard and fast, 100 to 120 times a minute, then 2 breaths. Keep going.',
    'reviewNotes': ['AI-generated. Needs clinical sign-off before the unreviewed label can be removed.']
  },
  {
    'id': 'choking', 'topic': 'choking', 'title': 'Choking', 'source': 'choking.jpg',
    'alt': 'Choking, when they cannot cough, breathe or speak. Call 000. Up to 5 back blows between the shoulder blades, then up to 5 chest thrusts. For a baby, lay them face down with the head lower than the body.',
    'reviewNotes': [
      'The infant panel does not clearly show the head lower than the body.',
      'AI-generated. Needs clinical sign-off before the unreviewed label can be removed.'
    ]
  },
  {
    'id': 'bleeding', 'topic': 'bleeding', 'title': 'Severe bleeding', 'source': 'bleeding.jpg',
    'alt': 'Severe bleeding. Press firmly and directly on the wound. Leave anything stuck in the wound and press beside it. A tourniquet is only for life-threatening bleeding from an arm or leg that pressure cannot stop.',
    'reviewNotes': ['AI-generated. Needs clinical sign-off before the unreviewed label can be removed.']
  },
  {
    'id': 'anaphylaxis', 'topic': 'anaphylaxis', 'title': 'Anaphylaxis', 'source': 'anaphylaxis.jpg',
    'alt': 'Anaphylaxis. Lay them flat and do not let them stand or walk. Give their adrenaline autoinjector into the outer thigh, then call 000.',
    'reviewNotes': ['AI-generated. Needs clinical sign-off before the unreviewed label can be removed.']
  },
  {
    'id': 'heart', 'topic': 'heart', 'title': 'Heart attack', 'source': 'heart.jpg',
    'alt': 'Heart attack. Help them rest, help with their own angina medicine, call 000, and for an adult offer 300 mg aspirin unless they are allergic. Bring an AED.',
    'reviewNotes': ['AI-generated. Needs clinical sign-off before the unreviewed label can be removed.']
  },
  {
    'id': 'stroke', 'topic': 'stroke', 'title': 'Stroke', 'source': 'stroke.jpg',
    'alt': 'Stroke. Face: is one side drooping? Arms: is one weak? Speech: is it slurred? Time: call 000 now. Do not give them anything to eat or drink.',
    'reviewNotes': ['AI-generated. Needs clinical sign-off before the unreviewed label can be removed.']
  },
  {
    'id': 'unconscious', 'topic': 'unconscious', 'title': 'Unconscious, breathing', 'source': 'unconscious.jpg',
    'alt': 'Unconscious but breathing. Roll them onto their side, head tilted back so the airway stays open, and call 000. Keep checking their breathing.',
    'reviewNotes': [
      'The recovery position does not clearly show the top knee bent forward.',
      'AI-generated. Needs clinical sign-off before the unreviewed label can be removed.'
    ]
  },
  {
    'id': 'snake', 'topic': 'snake', 'title': 'Snake bite', 'source': 'snake.jpg',
    'alt': 'Snake bite. Keep them still. Bandage firmly over the bite, then bandage the whole limb from the fingers or toes upward, and splint it. Do not use a tourniquet. Call 000.',
    'reviewNotes': ['AI-generated. Needs clinical sign-off before the unreviewed label can be removed.']
  },
  {
    'id': 'marine', 'topic': 'marine', 'title': 'Jellyfish and marine stings', 'source': 'marine.jpg',
    'alt': 'Jellyfish and marine stings. For box jellyfish and Irukandji, pour vinegar on the sting for 30 seconds. For a bluebottle, rinse with sea water and soak in hot water, not vinegar. For a blue-ringed octopus or cone shell, use the pressure bandage and splint, as for a snake bite.',
    'reviewNotes': ['AI-generated. Needs clinical sign-off before the unreviewed label can be removed.']
  },
  {
    'id': 'spider', 'topic': 'spider', 'title': 'Spider bite', 'source': 'spider.jpg',
    'alt': 'Spider bite. Funnel-web: call 000 and apply the pressure bandage and splint, as for a snake bite. Redback and other spiders: a cold pack for pain, and no pressure bandage.',
    'reviewNotes': ['AI-generated. Needs clinical sign-off before the unreviewed label can be removed.']
  },
  {
    'id': 'burns', 'topic': 'burns', 'title': 'Burns and scalds', 'source': 'burns.jpg',
    'alt': 'Burns and scalds. Cool the burn under cool running water for 20 minutes. Cover it loosely. Keep the rest of the person warm.',
    'reviewNotes': ['AI-generated. Needs clinical sign-off before the unreviewed label can be removed.']
  },
  {
    'id': 'asthma', 'topic': 'asthma', 'title': 'Asthma attack', 'source': 'asthma.jpg',
    'alt': 'Asthma attack. Sit them upright. Give 4 separate puffs of their blue or grey reliever, one puff at a time into a spacer with 4 breaths from the spacer. Wait 4 minutes. If they are not better, call 000 and keep giving 4 puffs every 4 minutes.',
    'reviewNotes': [
      'The spacer is drawn small.',
      'AI-generated. Needs clinical sign-off before the unreviewed label can be removed.'
    ]
  },
  {
    'id': 'seizure', 'topic': 'seizure', 'title': 'Seizure', 'source': 'seizure.jpg',
    'alt': 'Seizure. Move hard or sharp things away, put something soft under their head, and time the seizure. When it stops, roll them onto their side. Do not hold them down or put anything in their mouth.',
    'reviewNotes': [
      'Step 2 shows the rescuer touching the leg while timing the seizure.',
      'Step 3, the recovery position, does not clearly show the top knee bent.',
      'AI-generated. Needs clinical sign-off before the unreviewed label can be removed.'
    ]
  },
  {
    'id': 'heat', 'topic': 'heat', 'title': 'Heat illness', 'source': 'heat.jpg',
    'alt': 'Heat illness. Move them into the shade, loosen extra clothing, and cool them fast. Call 000 if they are confused, very drowsy, or not improving quickly.',
    'reviewNotes': ['AI-generated. Needs clinical sign-off before the unreviewed label can be removed.']
  },
  {
    'id': 'poison', 'topic': 'poison', 'title': 'Poisoning', 'source': 'poison.jpg',
    'alt': 'Poisoning, including button batteries. Call the Poisons Information Centre on 13 11 26, and call 000 if they are drowsy or having trouble breathing. Do not make them vomit. A swallowed button battery needs an emergency department straight away.',
    'reviewNotes': ['AI-generated. Needs clinical sign-off before the unreviewed label can be removed.']
  },
  {
    'id': 'extra-bites-stings', 'topic': 'bites', 'title': 'Bites and stings', 'source': 'extra-bites-stings.jpg',
    'alt': 'Bites and stings. Snake bite: keep them still, bandage firmly over the bite, then the whole limb from the fingers or toes upward, and splint. No tourniquet. Box jellyfish: vinegar for 30 seconds. A bluebottle: sea water and hot water, not vinegar. Funnel-web spider: the same pressure bandage and splint as a snake bite. Other spiders: a cold pack, and no pressure bandage.',
    'reviewNotes': ['Summary card for bites and stings. AI-generated. Needs clinical sign-off before the unreviewed label can be removed.']
  },
  {
    'id': 'extra-medical', 'topic': 'medical', 'title': 'Heart, asthma, anaphylaxis', 'source': 'extra-medical.jpg',
    'alt': 'Heart attack, asthma and anaphylaxis. Heart attack: rest, help with their own angina medicine, call 000, and offer 300 mg aspirin to an adult who is not allergic. Asthma: sit upright and give 4 puffs of reliever through a spacer, 4 breaths each puff, then wait 4 minutes. Anaphylaxis: lay them flat and give their adrenaline autoinjector into the outer thigh, then call 000.',
    'reviewNotes': ['Summary card for heart attack, asthma and anaphylaxis. AI-generated. Needs clinical sign-off before the unreviewed label can be removed.']
  },
]

os.makedirs(OUT, exist_ok=True)
out_cards = []
total = 0
for c in CARDS:
    src = os.path.join(SRC, c['source'])
    name = c['id'] + '.webp'
    dest = os.path.join(OUT, name)
    if not os.path.isfile(dest):
        im = Image.open(src).convert('RGB')
        im.thumbnail((MAX_W, MAX_W * 2), Image.Resampling.LANCZOS)
        im.save(dest, 'WEBP', quality=QUALITY, method=6)
    im = Image.open(dest)
    raw = open(dest, 'rb').read()
    total += len(raw)
    out_cards.append({
        'id': c['id'],
        'topic': c['topic'],
        'title': c['title'],
        'file': 'assets/cards/' + name,
        'width': im.size[0],
        'height': im.size[1],
        'sha256': hashlib.sha256(raw).hexdigest(),
        'alt': c['alt'],
        'reviewNotes': c['reviewNotes'],
    })
    print(f"{name:20} {im.size[0]}x{im.size[1]}  {len(raw)/1024:6.1f} KB")

doc = {
    'note': 'Home-screen flip cards. WebP is what the app loads. assets/cards/source/*.jpg are the originals and are not in the service worker. Cached on first view, not in the install precache, so the offline steps stay lean. Alt text is from the written steps. Unreviewed.',
    'cards': out_cards,
}
path = os.path.join(ROOT, 'data', 'topic-cards.json')
json.dump(doc, open(path, 'w', encoding='utf-8'), indent=2, ensure_ascii=False)
open(path, 'a', encoding='utf-8').write('\n')
print(f'total webp {total/1024:.0f} KB')
