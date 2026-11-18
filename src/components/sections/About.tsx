"use client";

import { about, profile, education } from "@/content/data";
import { useTilt } from "@/lib/hooks";
import { SectionTitle } from "../ui/Primitives";
import { Glyph } from "../ui/Glyph";

const traits = ["Curious", "Analytical", "Independent", "Creative", "Technically ambitious", "Builder of practical things"];

export default function About() {
  const frame = useTilt<HTMLDivElement>(5);
  const degree = education[0];
  return (
    <section id="about" data-scene="left" className="section" aria-labelledby="about-title">
      <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div ref={frame} className="tile cursor-default" data-reveal>
            <div className="glass overflow-hidden p-3">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[12px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profile.photo}
                  alt="Portrait of Santhosh Kumar K in a black suit"
                  className="h-full w-full object-cover object-[50%_18%]"
                  style={{ filter: "grayscale(1) contrast(1.12) brightness(.9)" }}
                  loading="lazy"
                  data-parallax="6"
                />
                <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(3,4,6,.0) 45%, rgba(3,4,6,.92) 100%), linear-gradient(90deg, rgba(40,123,255,.16), transparent 30%)" }} />
                <div className="corner-ticks" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
                  <div>
                    <p className="display text-[2rem] leading-none">S.K.K</p>
                    <p className="label mt-2 flex items-center gap-2">
                      <Glyph name="location" size={14} strokeWidth={3} /> {profile.location}
                    </p>
                  </div>
                  <span className="label text-ice">IT · {degree.years.replace(/ — /, "–")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 lg:pl-6">
          <SectionTitle id="about-title" index="01" kicker="About" lines={["The mind", <span key="b" className="outline-text">behind the builds<span className="blue-dot">.</span></span>]} />

          <p className="lead mt-12 max-w-[34ch] text-white" data-reveal>
            {about[0]}
          </p>
          <div className="mt-10 grid gap-8 md:grid-cols-2" data-stagger>
            {about.slice(1).map((p, i) => (
              <p key={i} className={`body ${i === 2 ? "md:col-span-2 border-l border-blue/60 pl-5 text-soft" : ""}`}>
                {p}
              </p>
            ))}
          </div>

          <dl className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/[0.06] md:grid-cols-4" data-stagger>
            {[
              { k: "Degree", v: "B.Tech IT" },
              { k: "College", v: "Mepco Schlenk" },
              { k: "Years", v: "2023–2027" },
              { k: "CGPA", v: "8.27 / 10" },
            ].map((f) => (
              <div key={f.k} className="bg-ink/90 p-5">
                <dt className="label">{f.k}</dt>
                <dd className="display mt-3 text-[1.7rem] leading-none text-white">{f.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* trait marquee */}
      <div className="relative mt-24 overflow-hidden border-y border-white/[0.06] py-6" aria-label={`Traits: ${traits.join(", ")}`}>
        <div className="marquee" aria-hidden>
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center">
              {traits.map((t, i) => (
                <span key={t} className="flex items-center">
                  <span className={`display px-8 text-[clamp(2.4rem,5vw,4.6rem)] ${i % 2 ? "outline-text" : "text-white/90"}`}>{t}</span>
                  <span className="h-2.5 w-2.5 rotate-45 bg-blue shadow-[0_0_12px_#287bff]" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
