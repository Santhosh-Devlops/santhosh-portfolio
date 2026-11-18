"use client";

import { certifications, internships, type Cert } from "@/content/data";
import { useTilt } from "@/lib/hooks";
import { Glyph } from "../ui/Glyph";
import { SectionTitle } from "../ui/Primitives";
import { Marker } from "./Journey";

function CertPlate({ c, featured }: { c: Cert; featured?: boolean }) {
  const ref = useTilt<HTMLLIElement>(7);
  return (
    <li ref={ref} className={`tile cursor-default ${featured ? "sm:col-span-2 lg:row-span-2" : ""}`} data-testid="cert">
      <span className="tile-plate" aria-hidden />
      <div className={`tile-face flex h-full flex-col justify-between gap-8 p-6 ${featured ? "lg:p-9" : ""}`}>
        <div className="flex items-start justify-between gap-4">
          <span className={`tile-well ${featured ? "h-24 w-24" : "h-16 w-16"}`}>
            <Glyph name={c.glyph} size={featured ? 54 : 36} />
          </span>
          <span className="label tabular-nums">{c.date}</span>
        </div>
        <div>
          <p className="label text-ice">{c.issuer}</p>
          <h3 className={`mt-3 ${featured ? "display text-[clamp(2.4rem,4vw,4rem)] leading-[0.9]" : "head text-[1.08rem] leading-snug"}`}>{c.title}</h3>
          {featured && <p className="body mt-5 text-[0.95rem]">Industry certification covering AI and ML concepts, generative AI, AWS AI services and responsible AI practice.</p>}
        </div>
      </div>
    </li>
  );
}

export default function Credentials() {
  const [featured, ...rest] = certifications;
  return (
    <section id="credentials" data-scene="far-right" className="section" aria-labelledby="cred-title">
      <div className="wrap">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionTitle id="cred-title" index="05" kicker="Certifications & internships" lines={["Built with", <span key="c" className="ice-edge">curiosity<span className="blue-dot">.</span></span>]} className="lg:col-span-8" />
          <p className="body lg:col-span-4" data-reveal>
            Nine certifications and two virtual internships, as listed on the resume — with AI and machine learning at the centre.
          </p>
        </div>

        <ul className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" style={{ perspective: 1400 }} data-stagger>
          <CertPlate c={featured} featured />
          {rest.map((c) => (
            <CertPlate key={c.title} c={c} />
          ))}
        </ul>

        <div className="mt-16" data-reveal>
          <p className="label mb-6 flex items-center gap-3">
            <span className="h-px w-10 bg-gradient-to-r from-blue to-transparent" /> Virtual internships
          </p>
          <ul className="grid gap-4 md:grid-cols-2">
            {internships.map((it) => (
              <li key={it.title} className="glass flex items-center gap-6 p-6">
                <Marker glyph="briefcase" lit />
                <div className="min-w-0 flex-1">
                  <p className="label text-ice">
                    {it.issuer} · {it.kind}
                  </p>
                  <h3 className="head mt-2 text-[1.15rem]">{it.title}</h3>
                </div>
                <span className="label hidden tabular-nums sm:block">{it.date}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
