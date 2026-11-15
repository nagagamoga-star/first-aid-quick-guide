# Anatomy model

`anatomy.b64.txt` is a small, simplified cut of the BodyParts3D 4.0 model (adult male reference anatomy). It's used by the guide's 3D "where on the body" views. It was taken from the Human Atlas viewer's copy of the data and built with `tools/build_anatomy.py`.

It holds eight groups: skin, rib cage, breastbone, heart walls, windpipe and voice box, airways (bronchial tree), outer thigh muscles and brain. Each group is merged and simplified to a few thousand triangles. The file is about 0.5 MB, against roughly 43 MB for the full Human Atlas model. `anatomy.parts.json` lists the source parts in each group.

## Format

The text is base64 of a gzip stream. Inside is a little-endian uint32 header length, then a JSON header (bounds plus each group's vertex count, index count and byte offsets), then the data. Positions are uint16, quantised to the header bounds. Indices are uint16, or uint32 when a group has more than 65,535 vertices.

## Licence and credit

BodyParts3D, © The Database Center for Life Science, licensed under [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/).

Source: https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html

Changes: selected parts only, merged into groups, simplified, and re-encoded. This licence covers the model data in this folder. It doesn't cover the rest of the repository.
