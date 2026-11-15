"""Build the small anatomy model used by the guide's 3D viewer.

Input: Human Atlas model data (BodyParts3D 4.0): atlas.json and decoded chunk .bin files.
Output: models/anatomy.b64.txt (gzip + base64 of a small binary).

BodyParts3D, (c) The Database Center for Life Science, licensed under CC Attribution 4.0 International.
Usage: python3 tools/build_anatomy.py ATLAS_DIR OUT_FILE
"""
import sys, json, re, gzip, base64, struct
import numpy as np
import fast_simplification

atlas_dir, out = sys.argv[1], sys.argv[2]
A = json.load(open(f'{atlas_dir}/atlas.json'))
P = A['parts']
chunks = {}
def chunk(n):
    if n not in chunks:
        chunks[n] = open(f'{atlas_dir}/chunks/body-{n}.bin', 'rb').read()
    return chunks[n]

def part_mesh(p):
    b = chunk(p['chunk'])
    v = np.frombuffer(b, np.float32, p['vertexCount'] * 3, p['positions']).reshape(-1, 3)
    f = np.frombuffer(b, np.uint32, p['indexCount'], p['indices']).reshape(-1, 3)
    return v.astype(np.float64), f.astype(np.int64)

def centre_y(p):
    return (p['bounds'][0][1] + p['bounds'][1][1]) / 2

def pick(test):
    seen, out = set(), []
    for p in P:
        if test(p) and p['id'] not in seen:
            seen.add(p['id']); out.append(p)
    return out

N = lambda *names: (lambda p: p['name'] in names)
GROUPS = [
  # id, parts, target triangles
  ('skin',    pick(N('Skin')), 9000),
  ('ribcage', pick(lambda p: re.search(r'\brib\b|costal cartilage', p['name'].lower()) is not None or p['name'] in ('Manubrium', 'Xiphoid process')), 9000),
  ('sternum', pick(N('Body of sternum')), 1600),
  ('heart',   pick(N('Wall of ventricle', 'Wall of left atrium', 'Wall of right atrium')), 6000),
  ('larynx',  pick(N('Trachea', 'Thyroid cartilage', 'Cricoid cartilage')), 3500),
  ('bronchi', pick(lambda p: p['system'] == 'respiratory' and ('bronch' in p['name'].lower())), 9000),
  ('thigh',   pick(N('Right vastus lateralis', 'Left vastus lateralis')), 2400),
  ('brain',   pick(lambda p: p['system'] == 'nervous' and p['chunk'] in (5, 6) and centre_y(p) > 1.5
                   and not re.search(r'nerve|ganglion|canal|aqueduct|ventricle|foramen', p['name'].lower())
                   and p['indexCount'] // 3 >= 400), 14000),
]

meshes = []
for gid, parts, target in GROUPS:
    vs, fs, off = [], [], 0
    for p in parts:
        v, f = part_mesh(p); vs.append(v); fs.append(f + off); off += len(v)
    v = np.vstack(vs); f = np.vstack(fs)
    src = len(f)
    if len(f) > target:
        v, f = fast_simplification.simplify(v, f, target_reduction=1 - target / len(f))
    meshes.append((gid, v, f, [p['name'] for p in parts], src))
    print(f'{gid:8s} parts={len(parts):3d} tris {src:6d} -> {len(f):6d}')

allv = np.vstack([m[1] for m in meshes])
lo, hi = allv.min(0), allv.max(0)
header = {'source': 'BodyParts3D 4.0 via Human Atlas', 'licence': 'CC BY 4.0, (c) The Database Center for Life Science',
          'min': lo.round(5).tolist(), 'max': hi.round(5).tolist(), 'groups': []}
blob = bytearray()
def align():
    while len(blob) % 4: blob.append(0)
for gid, v, f, names, src in meshes:
    q = np.round((v - lo) / (hi - lo) * 65535).clip(0, 65535).astype('<u2')
    idx32 = len(v) > 65535
    align(); voff = len(blob); blob.extend(q.tobytes())
    align(); ioff = len(blob); blob.extend(f.astype('<u4' if idx32 else '<u2').tobytes())
    header['groups'].append({'id': gid, 'v': int(len(v)), 'i': int(f.size), 'idx32': idx32, 'voff': voff, 'ioff': ioff, 'parts': len(names)})
hj = json.dumps(header, separators=(',', ':')).encode()
pad = (4 - (4 + len(hj)) % 4) % 4
data = struct.pack('<I', len(hj) + pad) + hj + b' ' * pad + bytes(blob)
gz = gzip.compress(data, 9)
open(out, 'w').write(base64.b64encode(gz).decode())
print('raw', len(data), 'gzip', len(gz), 'b64', len(base64.b64encode(gz)))
json.dump({m[0]: m[3] for m in meshes}, open(out.replace('.b64.txt', '.parts.json'), 'w'), indent=1)
