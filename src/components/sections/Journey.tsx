"use client";

import { achievements, education } from "@/content/data";
import { Glyph, type GlyphName } from "../ui/Glyph";
import { SectionTitle } from "../ui/Primitives";

type Item = { date: string; title: string; place: string; detail?: string; glyph: GlyphName; kind: string; highlight?: boolean };

const items: Item[] = [
  { date: education[1].years, title: education[1].title, place: education[1].place, detail: education[1].detail, glyph: "cap", kind: "Education" },
  { date: education[0].years, title: education[0].title, place: education[0].place, detail: education[0].detail, glyph: "cap", kind: "Education", highlight: true },
  { date: achievements[0].date, title: achievements[0].title, place: achievements[0].place, glyph: "trophy", kind: "Achievement" },
  { date: achievements[1].date, title: achievements[1].title, place: achievements[1].place, glyph: "trophy", kind: "Achievement", highlight: true },
  { date: achievements[2].date, title: achievements[2].title, place: achievements[2].place, glyph: "spark", kind: "Hackathon" },
];

export function Marker({ glyph, lit }: { glyph: GlyphName; lit?: boolean }) {
  return (
    <span className="relative grid h-14 w-14 shrink-0 place-items-center" aria-hidden>
      <span
        className="absolute inset-[7px] rotate-45 rounded-[10px]"
        style={{
          background: "linear-gradient(135deg,#2a3445 0%,#121823 45%,#07090d 100%)",
          boxShadow: `inset 0 1px 0 rgba(255,255,255,.18), inset 0 -1px 0 rgba(0,0,0,.7), 0 3px 0 #04060a, 0 12px 24px -10px #000${lit ? ", 0 0 0 1px rgba(40,123,255,.8), 0 0 22px -2px rgba(40,123,255,.6)" : ", 0 0 0 1px rgba(255,255,255,.08)"}`,
        }}
      />
      <Glyph name={glyph} size={24} strokeWidth={2.4} className="relative" />
    </span>
  );
}

export default function Journey() {
  return (
    <section id="journey" data-scene="far-left" className="section" aria-labelledby="journey-title">
      <div className="wrap">
        <SectionTitle id="journey-title" index="04" kicker="Education & achievements" lines={["The journey", <span key="j" className="outline-text">of building<span className="blue-dot">.</span></span>]} />

        <div className="relative mt-20">
          {/* spine */}
          <div className="absolute bottom-0 left-7 top-0 w-px bg-white/[0.08] md:left-1/2" aria-hidden>
            <div data-progress-line className="h-full w-full origin-top bg-gradient-to-b from-ice via-blue to-blue-deep shadow-[0_0_14px_#287bff]" />
          </div>

          <ol className="flex flex-col gap-14 md:gap-6">
            {items.map((it) => {
              return (
                <li key={it.title} className="relative grid grid-cols-[3.5rem_1fr] gap-6 md:grid-cols-[1fr_3.5rem_1fr] md:gap-10" data-reveal>
                  <div className="hidden pt-2 md:block">
                    <p className="display text-right text-[clamp(2.4rem,4.4vw,4.4rem)] leading-none text-white/90">{it.date}</p>
                  </div>
                  <div className="relative z-10">
                    <Marker glyph={it.glyph} lit={it.highlight} />
                  </div>
                  <div>
                    <p className="display text-[2rem] leading-none text-white/90 md:hidden">{it.date}</p>
                    <div className="glass mt-4 p-6 md:mt-0">
                      <p className="label text-ice">{it.kind}</p>
                      <h3 className="head mt-3 text-[1.25rem] leading-snug">{it.title}</h3>
                      <p className="mt-2 text-[0.95rem] text-soft/70">{it.place}</p>
                      {it.detail && <p className="display mt-5 text-[2.4rem] leading-none chrome-text">{it.detail}</p>}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
