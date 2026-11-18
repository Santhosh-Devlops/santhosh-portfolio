"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { projects, type ProjectId } from "@/content/data";
import { lockScroll, pulseScene } from "@/lib/scene";
import { Glyph } from "./ui/Glyph";
import { Badge, Button } from "./ui/Primitives";
import { OracleSchematic, RagSchematic, RecruitWeights } from "./sections/Schematics";

const EASE = [0.16, 1, 0.3, 1] as const;

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-white/[0.07] py-8 md:grid md:grid-cols-[12rem_1fr] md:gap-10">
      <h4 className="label mb-4 text-ice md:mb-0">{label}</h4>
      <div>{children}</div>
    </section>
  );
}

export default function ProjectDetail({ id, onClose }: { id: ProjectId | null; onClose: () => void }) {
  const p = projects.find((x) => x.id === id) ?? null;
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!p) return;
    lastFocus.current = document.activeElement as HTMLElement;
    lockScroll(true);
    pulseScene(1.2);
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    addEventListener("keydown", onKey);
    return () => {
      removeEventListener("keydown", onKey);
      lockScroll(false);
      lastFocus.current?.focus?.({ preventScroll: true });
    };
  }, [p, onClose]);

  return (
    <AnimatePresence>
      {p && (
        <motion.div
          key={p.id}
          className="fixed inset-0 z-[90]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="detail-title"
          data-testid="project-detail"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
        >
          <div className="absolute inset-0 bg-void/80 backdrop-blur-md" onClick={onClose} aria-hidden />
          <motion.div
            className="absolute inset-0 overflow-y-auto overscroll-contain md:inset-4 md:rounded-3xl"
            data-lenis-prevent
            initial={{ clipPath: "inset(48% 0 48% 0 round 24px)" }}
            animate={{ clipPath: "inset(0% 0 0% 0 round 24px)" }}
            exit={{ clipPath: "inset(50% 0 50% 0 round 24px)", transition: { duration: 0.5, ease: EASE } }}
            transition={{ duration: 0.9, ease: EASE }}
            style={{ background: "linear-gradient(180deg, #0a0e14 0%, #05070a 100%)", boxShadow: "0 0 0 1px rgba(255,255,255,.08), 0 40px 120px -20px #000" }}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/[0.06] bg-[#080b10]/85 px-[var(--gutter)] py-4 backdrop-blur-xl">
              <span className="label">
                <span className="text-ice">Case study {p.index}</span> · {p.category}
              </span>
              <button ref={closeRef} type="button" onClick={onClose} className="icon-btn titanium" aria-label="Close case study" data-testid="close-detail">
                <Glyph name="close" size={18} />
              </button>
            </div>

            <div className="mx-auto max-w-6xl px-[var(--gutter)] pb-24 pt-12">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.9, ease: EASE }}>
                <p className="head text-[1.05rem] text-soft/70">{p.codename}</p>
                <h3 id="detail-title" className="display mt-3 text-[clamp(3.6rem,11vw,10rem)] leading-[0.82] chrome-text">
                  {p.title}
                </h3>
                <p className="lead mt-8 max-w-3xl text-white">{p.tagline}</p>
              </motion.div>

              <motion.div className="mt-12" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.9, ease: EASE }}>
                <div className="glass p-5 sm:p-8">
                  <div className="corner-ticks" />
                  {p.id === "multidoc-rag" && <RagSchematic />}
                  {p.id === "oracle" && (
                    <div className="mx-auto max-w-xl">
                      <OracleSchematic />
                    </div>
                  )}
                  {p.id === "recruitai" && <RecruitWeights />}
                  {p.visual.kind === "image" && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.visual.src} alt={p.visual.alt} className="w-full rounded-lg border border-white/10" />
                  )}
                </div>
                <p className="label mt-4 text-[0.58rem]">{p.visual.caption}</p>
              </motion.div>

              <div className="mt-14">
                <Block label="Problem">
                  <p className="body text-soft/85">{p.problem}</p>
                </Block>
                <Block label="Solution">
                  <p className="body text-soft/85">{p.solution}</p>
                </Block>
                <Block label="Key features">
                  <ul className="grid gap-3 md:grid-cols-2">
                    {p.features.map((f) => (
                      <li key={f} className="flex gap-3 text-[0.95rem] text-soft/85">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-blue shadow-[0_0_8px_#287bff]" aria-hidden />
                        {f}
                      </li>
                    ))}
                  </ul>
                </Block>
                <Block label="Technology stack">
                  <div className="flex flex-wrap gap-2">
                    {p.stack.map((s) => (
                      <Badge key={s} small>
                        {s}
                      </Badge>
                    ))}
                  </div>
                </Block>
                <Block label="Architecture">
                  <ol className="flex flex-col gap-2">
                    {p.architecture.map((a, i) => (
                      <li key={a} className="titanium flex items-baseline gap-4 rounded-lg px-4 py-3">
                        <span className="label tabular-nums text-ice">{String(i + 1).padStart(2, "0")}</span>
                        <span className="text-[0.95rem] text-soft/90">{a}</span>
                      </li>
                    ))}
                  </ol>
                </Block>
                <Block label="My contribution">
                  <p className="body text-soft/85">{p.contribution}</p>
                </Block>
                <Block label="Links">
                  <div className="flex flex-wrap items-center gap-3">
                    <Button variant="primary" icon="github" href={p.repo} external>
                      GitHub repository
                    </Button>
                    {p.relatedRepos?.map((r) => (
                      <Button key={r.href} variant="glass" size="sm" icon="arrow-up-right" href={r.href} external>
                        {r.label}
                      </Button>
                    ))}
                  </div>
                  <p className="label mt-5 text-[0.6rem]">Live demo — {p.demo ? "available" : "not publicly deployed; run locally from the repository"}</p>
                </Block>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
