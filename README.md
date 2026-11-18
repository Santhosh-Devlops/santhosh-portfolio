# Santhosh Kumar K — "Beyond Code" portfolio

Cinematic 3D portfolio. Next.js 16 · React 19 · TypeScript · Tailwind 4 · Three.js / React Three Fiber / Drei · GSAP + ScrollTrigger · Lenis · Motion · Playwright.

## Run

```bash
npm install
npm run dev -- --port 3100     # http://localhost:3100
npm run build && npm start     # production
npx playwright test            # 32 tests, desktop + mobile (uses installed Microsoft Edge)
```

URL flags for review: `?intro=1` force the title sequence · `?intro=0` skip it · `?nowebgl` SVG fallback · `?forcewebgl` force 3D even on a software renderer.

## Where things live

| Path | What |
|---|---|
| `src/content/data.ts` | **Every fact on the site** (profile, skills + evidence, projects, education, certifications). Edit here. |
| `src/components/three/` | 3D scene (glass core, titanium rings, glass shards, GLSL particles + glow) and WebGL/SVG fallback |
| `src/components/ui/Glyph.tsx` | Custom dimensional icon library (40+ glyphs, no icon fonts, no emojis) |
| `src/components/ui/Primitives.tsx` | Button, Badge, SectionTitle |
| `src/app/globals.css` | Design tokens, materials (glass, titanium, chrome), type scale, motion |
| `src/components/sections/` | Hero, About, Skills, Projects, Journey, Credentials, Universe, Resume + Contact |
| `public/resume/` | Resume PDF (street address and phone redacted) + preview image |
| `docs/` | Project selection report and design specification |

## Behaviour notes
- The title sequence (~7.4 s, skippable, Esc works) plays once per browser session.
- `prefers-reduced-motion`: static title card, no smooth scroll, no parallax or auto-rotation.
- Software WebGL (e.g. no GPU) and browsers without WebGL get the SVG sculpture; slow GPUs drop to lighter materials automatically.
- The contact form stores nothing; it drafts an email in the visitor's mail app.
