"use client";

import type { ReactNode } from "react";
import { projects, type Project, type ProjectId } from "@/content/data";
import { useTilt } from "@/lib/hooks";
import { Badge, Button, SectionTitle } from "../ui/Primitives";
import { OracleSchematic, RagSchematic, RecruitWeights } from "./Schematics";

function Meta({ p }: { p: Project }) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
      <span className="label text-ice">{p.category}</span>
      <span className="label">Updated {p.updated}</span>
    </div>
  );
}

function Actions({ p, onOpen }: { p: Project; onOpen: () => void }) {
  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="primary" icon="arrow-right" onClick={onOpen} testId={`open-${p.id}`}>
        Case study
      </Button>
      <Button variant="glass" icon="github" href={p.repo} external>
        Repository
      </Button>
    </div>
  );
}

function Stack({ p, max = 7 }: { p: Project; max?: number }) {
  return (
    <div className="flex flex-wrap gap-2">
      {p.stack.slice(0, max).map((s) => (
        <Badge key={s} small>
          {s}
        </Badge>
      ))}
      {p.stack.length > max && (
        <Badge small quiet>
          +{p.stack.length - max}
        </Badge>
      )}
    </div>
  );
}

function Index({ n }: { n: string }) {
  return (
    <span className="display outline-text pointer-events-none select-none text-[clamp(7rem,18vw,17rem)] leading-[0.75] opacity-60" aria-hidden>
      {n}
    </span>
  );
}

function Caption({ children }: { children: ReactNode }) {
  return (
    <p className="label mt-4 flex items-center gap-2 text-[0.58rem]">
      <span className="h-1.5 w-1.5 rotate-45 bg-steel" aria-hidden /> {children}
    </p>
  );
}

function Vitrine({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useTilt<HTMLDivElement>(4);
  return (
    <div ref={ref} className={`tile cursor-default ${className}`}>
      <div className="glass p-5 sm:p-8">
        <div className="corner-ticks" />
        {children}
      </div>
    </div>
  );
}

/* ── 01: horizontal flow, index left, schematic across ── */
function ExhibitRag({ p, onOpen }: { p: Project; onOpen: () => void }) {
  return (
    <article className="relative py-20 lg:py-28" aria-labelledby={`t-${p.id}`} data-testid={`exhibit-${p.id}`}>
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Index n={p.index} />
          <div className="-mt-10 lg:-mt-16" data-reveal>
            <Meta p={p} />
            <h3 id={`t-${p.id}`} className="display display-m mt-4">
              {p.title}
            </h3>
            <p className="head mt-3 text-[1.05rem] text-soft/70">{p.codename}</p>
            <p className="lead mt-8 text-white">{p.tagline}</p>
            <p className="body mt-5">{p.solution}</p>
            <div className="mt-8">
              <Stack p={p} />
            </div>
            <div className="mt-10">
              <Actions p={p} onOpen={onOpen} />
            </div>
          </div>
        </div>
        <div className="lg:col-span-7 lg:pt-24" data-reveal>
          <Vitrine>
            <RagSchematic />
          </Vitrine>
          <Caption>{p.visual.caption}</Caption>
        </div>
      </div>
    </article>
  );
}

/* ── 02: mirrored, orbital agent topology left ── */
function ExhibitOracle({ p, onOpen }: { p: Project; onOpen: () => void }) {
  return (
    <article className="relative py-20 lg:py-28" aria-labelledby={`t-${p.id}`} data-testid={`exhibit-${p.id}`}>
      <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
        <div className="order-2 lg:order-1 lg:col-span-6" data-reveal>
          <Vitrine>
            <OracleSchematic />
          </Vitrine>
          <Caption>{p.visual.caption}</Caption>
        </div>
        <div className="order-1 lg:order-2 lg:col-span-6 lg:pl-10">
          <div className="flex items-end justify-between">
            <Index n={p.index} />
          </div>
          <div className="-mt-10 lg:-mt-16" data-reveal>
            <Meta p={p} />
            <h3 id={`t-${p.id}`} className="display mt-4 text-[clamp(4rem,10vw,10rem)] leading-[0.82] chrome-text">
              {p.title}
            </h3>
            <p className="head mt-3 text-[1.05rem] text-soft/70">{p.codename}</p>
            <blockquote className="mt-8 border-l-2 border-blue pl-5">
              <p className="lead text-white">{p.tagline}</p>
            </blockquote>
            <p className="body mt-5">{p.problem}</p>
            <div className="mt-8">
              <Stack p={p} max={6} />
            </div>
            <div className="mt-10">
              <Actions p={p} onOpen={onOpen} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ── 03: title across the full width, data panel beneath ── */
function ExhibitRecruit({ p, onOpen }: { p: Project; onOpen: () => void }) {
  return (
    <article className="relative py-20 lg:py-28" aria-labelledby={`t-${p.id}`} data-testid={`exhibit-${p.id}`}>
      <div className="flex flex-wrap items-end justify-between gap-6" data-reveal>
        <div>
          <Meta p={p} />
          <h3 id={`t-${p.id}`} className="display mt-4 text-[clamp(4rem,13vw,13.5rem)] leading-[0.8]">
            Recruit<span className="ice-edge">AI</span>
          </h3>
        </div>
        <Index n={p.index} />
      </div>
      <div className="rule-blue mt-6" aria-hidden />
      <div className="mt-12 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5" data-reveal>
          <p className="head text-[1.05rem] text-soft/70">{p.codename}</p>
          <p className="lead mt-6 text-white">{p.tagline}</p>
          <p className="body mt-5">{p.problem}</p>
          <p className="body mt-4">{p.solution}</p>
          <div className="mt-8">
            <Stack p={p} />
          </div>
          <div className="mt-10">
            <Actions p={p} onOpen={onOpen} />
          </div>
        </div>
        <div className="lg:col-span-7" data-reveal>
          <Vitrine>
            <div className="mb-6 flex items-center justify-between">
              <span className="label text-ice">Fit score — weights</span>
              <span className="label">Computed in Python, not by the LLM</span>
            </div>
            <RecruitWeights />
            <div className="mt-8 grid grid-cols-3 gap-px overflow-hidden rounded-xl bg-white/[0.06] text-center">
              {[
                { k: "80+", v: "Shortlisted", on: true },
                { k: "60–79", v: "Review" },
                { k: "< 60", v: "Low match" },
              ].map((s) => (
                <div key={s.k} className="bg-ink/95 px-2 py-4">
                  <p className={`display text-[1.6rem] leading-none ${s.on ? "ice-edge" : ""}`}>{s.k}</p>
                  <p className="label mt-2 text-[0.55rem]">{s.v}</p>
                </div>
              ))}
            </div>
          </Vitrine>
          <Caption>{p.visual.caption}</Caption>
        </div>
      </div>
    </article>
  );
}

/* ── 04: real output on a monitor, module chain beneath ── */
function ExhibitDymeter({ p, onOpen }: { p: Project; onOpen: () => void }) {
  const mods = [
    { k: "SCD", v: "Autoencoder" },
    { k: "IEC", v: "Evidential controller" },
    { k: "DSD", v: "Hypernetwork" },
    { k: "DTO", v: "Dynamic threshold" },
  ];
  return (
    <article className="relative py-20 lg:py-28" aria-labelledby={`t-${p.id}`} data-testid={`exhibit-${p.id}`}>
      <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-5" data-reveal>
          <Index n={p.index} />
          <div className="-mt-10 lg:-mt-16">
            <Meta p={p} />
            <h3 id={`t-${p.id}`} className="display display-l mt-4 sweep" data-sweep>
              {p.title}
            </h3>
            <p className="head mt-3 text-[1.05rem] text-soft/70">{p.codename}</p>
          </div>
        </div>
        <div className="lg:col-span-7" data-reveal>
          <p className="lead text-white">{p.tagline}</p>
          <p className="body mt-5">{p.solution}</p>
        </div>
      </div>

      <div className="mt-14 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8" data-reveal>
          <Vitrine>
            {p.visual.kind === "image" && (
              <figure className="group">
                <div className="overflow-hidden rounded-lg border border-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.visual.src}
                    alt={p.visual.alt}
                    className="w-full saturate-[.55] transition-[filter] duration-700 group-hover:saturate-100"
                    loading="lazy"
                    width={1600}
                    height={1000}
                  />
                </div>
                <figcaption className="sr-only">{p.visual.caption}</figcaption>
              </figure>
            )}
          </Vitrine>
          {p.visual.kind === "image" && <Caption>{p.visual.caption}</Caption>}
        </div>

        <div className="flex flex-col gap-6 lg:col-span-4">
          <ol className="relative flex flex-col gap-3" data-stagger>
            {mods.map((m, i) => (
              <li key={m.k} className="titanium relative flex items-center gap-5 rounded-xl px-5 py-4">
                <span className="label tabular-nums text-ice">0{i + 1}</span>
                <span className="display w-16 text-[2rem] leading-none">{m.k}</span>
                <span className="label text-[0.6rem]">{m.v}</span>
              </li>
            ))}
          </ol>
          <p className="label text-[0.6rem] leading-relaxed">Algorithm by Zhu et al., IEEE TPAMI 2026 — implemented and studied here.</p>
          <Actions p={p} onOpen={onOpen} />
        </div>
      </div>
    </article>
  );
}

const EXHIBITS: Record<ProjectId, (props: { p: Project; onOpen: () => void }) => ReactNode> = {
  "multidoc-rag": ExhibitRag,
  oracle: ExhibitOracle,
  recruitai: ExhibitRecruit,
  dymeter: ExhibitDymeter,
};

export default function Projects({ onOpenProject }: { onOpenProject: (id: ProjectId) => void }) {
  return (
    <section id="work" className="section" aria-labelledby="work-title">
      <div data-scene="back" className="wrap">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionTitle id="work-title" index="03" kicker="Selected work" lines={["Engineering", <span key="w" className="outline-text">what&apos;s next<span className="blue-dot">.</span></span>]} className="lg:col-span-8" />
          <p className="body lg:col-span-4" data-reveal>
            Four builds chosen after reviewing all sixteen public repositories — ranked by AI relevance, technical depth and how complete the implementation is.
          </p>
        </div>

        {projects.map((p, i) => {
          const Ex = EXHIBITS[p.id];
          return (
            <div key={p.id}>
              {i > 0 && <div className="rule" aria-hidden />}
              <Ex p={p} onOpen={() => onOpenProject(p.id)} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
