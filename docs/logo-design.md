# AXERO.JS Logo Design Brief

## Brand

- **Nama:** Axero.js
- **Tagline:** *"Build real-time apps like breathing."*
- **Konsep:** *Axel* (sumbu rotasi — real-time, selalu bergerak) + *Zero* (latensi mendekati nol — ringan, presisi)
- **Persona:** Developer-focused, technical, tidak ribet — framework untuk builder yang ingin cepat dan bersih

## Style

- **Modern, technical, minimal** — bukan playful, bukan enterprise
- **Geometric** — bentuk dasar (karan, garis, titik), bukan organik
- **Dark theme friendly** — harus terbaca di background `#09090b`
- **Single accent** — satu warna aksen (emerald), tidak lebih
- **Scalable** — terbaca di 16px (favicon) dan 256px (social)

## Warna

| Token | Hex | Usage |
| :--- | :--- | :--- |
| `--accent` | `#10b981` | Warna utama logo |
| `--accent-hover` | `#34d399` | Highlight / gradient stop (jika perlu) |
| `--bg` | `#09090b` | Background dark |
| `--text` | `#f4f4f5` | Teks light |
| `--muted` | `#71717a` | Teks secondary |

## Deliverables

1. **SVG logo** — geometric mark, single file, scalable
2. **Favicon** — 32x32 + 16x16 (ICO/PNG dari SVG)
3. **Wordmark** — "Axero" text + icon, horizontal lockup
4. **Lockup variants:**
   - Icon only (untuk favicon, avatar)
   - Horizontal (icon + text, untuk navbar)
   - Stacked (icon di atas text, untuk social/og)

## Usage

- Navbar (website, docs)
- README badge
- Favicon browser tab
- Social media (Twitter/X, GitHub)
- OG image (jika diperlukan)

## References

- Design tokens: [README.md](../README.md)
- Website design: [website/index.html](../website/index.html)
- Landing page: [website/index.html](../website/index.html)

---

## Final Logo — Axis Point

**Concept:** Satu titik pusat (axis) dengan dua arc yang offset — rotasi di sekitar titik nol.

**Files:**

| File | Usage |
| :--- | :--- |
| `brand/logo-dark.svg` | Logo utama — putih + emerald, untuk dark bg |
| `brand/logo-light.svg` | Reversed — hitam + emerald, untuk light bg |
| `brand/wordmark.svg` | Icon + "Axero" text, horizontal lockup |
| `brand/favicon.svg` | Favicon SVG |
| `brand/favicon.ico` | Favicon ICO (16/32/48px) |
| `brand/icon-192.png` | PWA icon 192px |
| `brand/icon-512.png` | PWA icon 512px |
| `brand/apple-touch-icon.png` | Apple touch icon |
| `brand/site.webmanifest` | PWA manifest |
| `brand/head-snippet.html` | `<link>` tags untuk HTML head |

**Colors:**

| Token | Hex | Usage |
| :--- | :--- | :--- |
| Primary (dark) | `#f4f4f5` | Logo di dark bg |
| Primary (light) | `#09090b` | Logo di light bg |
| Accent | `#10b981` | Dot (axis point) — signature emerald |
| Accent hover | `#34d399` | Hover state |

**Construction:**
- Canvas: 256×256 viewBox
- Axis dot: circle r=10 di (128,128)
- Arc 1: 3/4 lingkaran r=90, stroke→filled path
- Arc 2: 1/4 lingkaran r=90, offset 90° via rotate transform
- Grid: 8px base unit, arcs snap ke 45°/90°

**Usage:**
- Navbar: `logo-dark.svg` (dark) / `logo-light.svg` (light)
- README: `logo-dark.svg` di dark section
- Favicon: `favicon.ico` atau `favicon.svg`
- PWA: `icon-192.png` + `icon-512.png` + `site.webmanifest`
- Social: `logo-dark.svg` atau `wordmark.svg`
