# Design Specification — "Beyond Code"

## Concept
A science-fiction title sequence that becomes a document. One persistent 3D sculpture — a faceted obsidian-glass core inside brushed-titanium orbital rings — lives behind the whole site and re-composes itself per section as the visitor scrolls. Typography carries the drama; blue light carries the hierarchy.

## Colour tokens (ratio ≈ 75 / 18 / 7)
| Token | Hex | Use |
|---|---|---|
| `--void` | #030406 | page background |
| `--ink` | #080B10 | panels, bands |
| `--graphite` | #10151D | surfaces, tiles |
| `--steel` | #8994A5 | secondary text, hairlines |
| `--white` | #FFFFFF | display type |
| `--soft` | #EDF2F8 | body type |
| `--blue` | #287BFF | accents, focus, active states only |
| `--ice` | #8FCBFF | edge light, highlights |
| `--blue-deep` | #185DCC | glow falloff |

## Type system
- **Display — Anton**: all section titles, the name, intro titles. Uppercase, `line-height .86`, tracking `-0.01em` at large sizes. Fluid `clamp()` scale: `display-xl` 10–19vw (name), `display-l` 4.2–9vw (section titles), `display-m` 2.6–5vw.
- **Secondary — Sora 600/700**: labels, eyebrows, card titles, buttons. Uppercase labels at `0.72rem`, tracking `0.32em`.
- **Body — Inter 400/500**: paragraphs, `1.0625rem / 1.7`, max 62ch.
- Title treatments: line mask reveal (each line rises from a clipped box), single light sweep across metallic text on entry, second line of key titles in outline + ice edge.

## Materials
- **Smoked glass**: `rgba(16,21,29,.55)` + `backdrop-filter: blur(18px) saturate(140%)`, 1px gradient border (white 14% → 2%), inner top specular line, soft drop shadow. Text always sits on ≥ 55% opacity glass.
- **Titanium**: linear gradient #1a212c → #0b0f15 with 1px top bevel highlight and 1px bottom shadow.
- **Chrome text**: vertical gradient #fff → #9aa6b8 → #fff, clipped to text.
- **Blue edge**: 1px `--blue` border segment + 12–24px `--blue-deep` glow at ≤ 35% opacity. Used on hover/active/focus only.

## Component library (`src/components/ui`)
- `Glyph` — 40 custom SVG geometries on a shared metallic gradient + bevel + edge-light filter set. No icon fonts, no emojis.
- `Tile` — dimensional skill/cert marker: titanium base plate, glass face, glyph, edge light on hover/select, pointer-driven 3D tilt.
- `Badge` — miniature glass plate with bevel and a blue status diode.
- `Button` — three variants (primary chrome, glass, ghost) with magnetic pull, pressed depth, light sweep on hover, visible focus ring.
- `SectionTitle` — eyebrow index + masked display lines.

## Motion language
- Easing: `expo.out` (cubic-bezier(.16,1,.3,1)) for entrances, `power2.inOut` for scene changes.
- Durations: 0.9 s titles, 0.7 s content, 0.35 s hover, stagger 0.08 s.
- Scroll: Lenis smoothing; GSAP ScrollTrigger reveals at 80 % viewport.
- 3D: sculpture drifts with scroll progress and mouse parallax; skill selection pulses the blue key light.
- `prefers-reduced-motion`: no intro sequence (static title card + Enter), no smooth scroll, no parallax, no auto-rotation, reveals render immediately.

## Responsive & fallbacks
- ≥ 1024 px: full scene, transmission glass, 1 800 particles.
- < 768 px: physical glass without transmission, 500 particles, DPR ≤ 1.5, single-column editorial layout.
- No WebGL: layered SVG sculpture with the same palette.
