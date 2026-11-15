# Vendored libraries

Self-hosted so the 3D views work offline once saved.

| Path | Library | Version | Source | Licence |
|---|---|---|---|---|
| `three/three.min.js` | three.js | 0.147.0 | npm `three@0.147.0`, `build/three.min.js` | MIT (`three/LICENSE`) |
| `three/OrbitControls.js` | three.js OrbitControls | 0.147.0 | npm `three@0.147.0`, `examples/js/controls/OrbitControls.js` | MIT (`three/LICENSE`) |

Unmodified. To upgrade, replace both files from the same three.js release and run the browser tests. Note that `examples/js` was removed in three.js r148, so a newer version needs a different loading approach.
