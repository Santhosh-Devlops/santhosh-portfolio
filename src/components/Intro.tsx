"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { sceneState, lockScroll } from "@/lib/scene";
import { Glyph } from "./ui/Glyph";

const EASE = [0.16, 1, 0.3, 1] as const;
// Scene timings (ms): darkness → formation → BEYOND CODE → BEYOND LIMITS → identity → statement → entry
const CUES = [0, 900, 2200, 3200, 4300, 5900, 7400];
const TOTAL = CUES[CUES.length - 1];

function Title({ children, k }: { children: React.ReactNode; k: string }) {
  return (
    <motion.h2
      key={k}
      className="display text-center text-[clamp(3.6rem,13vw,13rem)] leading-[0.85]"
      initial={{ opacity: 0, letterSpacing: "0.32em", filter: "blur(14px)", y: 10 }}
      animate={{ opacity: 1, letterSpacing: "0.01em", filter: "blur(0px)", y: 0 }}
      exit={{ opacity: 0, filter: "blur(10px)", scale: 1.06, transition: { duration: 0.45, ease: EASE } }}
      transition={{ duration: 1.1, ease: EASE }}
    >
      {children}
    </motion.h2>
  );
}

export default function Intro({ onDone, onClosed, reduced }: { onDone: () => void; onClosed: () => void; reduced: boolean }) {
  const [open, setOpen] = useState(true);
  const [phase, setPhase] = useState(0);
  const timers = useRef<number[]>([]);
  const enterRef = useRef<HTMLButtonElement>(null);

  const finish = useCallback(() => {
    timers.current.forEach(clearTimeout);
    sceneState.dawn = 1;
    sceneState.formation = 1;
    try {
      sessionStorage.setItem("skk-intro", "1");
    } catch {}
    setOpen(false);
    // Cross-fade: the site starts revealing while the overlay dissolves.
    onDone();
  }, [onDone]);

  useEffect(() => {
    lockScroll(true);
    if (reduced) {
      sceneState.dawn = 1;
      sceneState.formation = 1;
      // Reduced motion shows a single static title card, no timed sequence.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPhase(6);
      return;
    }
    sceneState.dawn = 0;
    sceneState.formation = 0;
    timers.current = [
      window.setTimeout(() => (sceneState.dawn = 1), 120),
      window.setTimeout(() => (sceneState.formation = 1), CUES[1]),
      ...CUES.slice(1).map((t, i) => window.setTimeout(() => setPhase(i + 1), t)),
    ];
    return () => timers.current.forEach(clearTimeout);
  }, [reduced]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [finish]);

  useEffect(() => {
    if (phase === 6) enterRef.current?.focus({ preventScroll: true });
  }, [phase]);

  return (
    <AnimatePresence
      onExitComplete={() => {
        lockScroll(false);
        onClosed();
      }}
    >
      {open && (
        <motion.div
          key="intro"
          role="dialog"
          aria-modal="true"
          aria-label="Introduction"
          data-testid="intro"
          className="fixed inset-0 z-[100] flex flex-col"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.9, ease: EASE } }}
          style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(3,4,6,0) 0%, rgba(3,4,6,.55) 60%, rgba(3,4,6,.92) 100%)" }}
        >
          {/* letterbox bars */}
          <motion.div className="pointer-events-none absolute inset-x-0 top-0 h-[7vh] bg-void" initial={{ y: 0 }} exit={{ y: "-100%", transition: { duration: 0.9, ease: EASE } }} />
          <motion.div className="pointer-events-none absolute inset-x-0 bottom-0 h-[7vh] bg-void" initial={{ y: 0 }} exit={{ y: "100%", transition: { duration: 0.9, ease: EASE } }} />

          <div className="relative z-10 flex items-center justify-between px-[var(--gutter)] pt-[calc(7vh+1rem)]">
            <div className="flex items-center gap-3">
              <Glyph name="monogram" size={30} />
              <span className="label hidden sm:inline">Title sequence — 2026</span>
            </div>
            {phase < 6 && (
              <button type="button" onClick={finish} className="btn btn-glass btn-sm" data-testid="skip-intro">
                Skip intro
              </button>
            )}
          </div>

          <div className="relative z-10 flex flex-1 items-center justify-center px-[var(--gutter)]">
            <AnimatePresence mode="wait">
              {phase === 2 && (
                <Title k="code">
                  Beyond code<span className="blue-dot">.</span>
                </Title>
              )}
              {phase === 3 && (
                <Title k="limits">
                  <span className="outline-text">Beyond</span> limits<span className="blue-dot">.</span>
                </Title>
              )}
              {phase === 4 && (
                <motion.div
                  key="identity"
                  className="text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, filter: "blur(10px)", transition: { duration: 0.45 } }}
                >
                  <motion.p
                    className="label mb-6 text-ice"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.8, ease: EASE }}
                  >
                    Presenting
                  </motion.p>
                  <motion.p
                    className="display sweep is-lit text-[clamp(3.4rem,11.5vw,12rem)] leading-[0.82]"
                    initial={{ opacity: 0, scale: 1.08, filter: "blur(16px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    transition={{ duration: 1.2, ease: EASE }}
                  >
                    Santhosh Kumar K
                  </motion.p>
                  <motion.ul
                    className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3"
                    initial="h"
                    animate="s"
                    variants={{ s: { transition: { staggerChildren: 0.12, delayChildren: 0.45 } } }}
                  >
                    {["AI Enthusiast", "Software Developer", "Independent Builder"].map((r, i) => (
                      <motion.li
                        key={r}
                        className="eyebrow flex items-center gap-5 text-soft"
                        variants={{ h: { opacity: 0, y: 10 }, s: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } }}
                      >
                        {i > 0 && <span className="inline-block h-1.5 w-1.5 rotate-45 bg-blue shadow-[0_0_8px_#287bff]" aria-hidden />}
                        {r}
                      </motion.li>
                    ))}
                  </motion.ul>
                </motion.div>
              )}
              {phase === 5 && (
                <motion.div
                  key="statement"
                  className="text-center"
                  initial="h"
                  animate="s"
                  exit={{ opacity: 0, filter: "blur(10px)", transition: { duration: 0.45 } }}
                  variants={{ s: { transition: { staggerChildren: 0.32 } } }}
                >
                  {["Exploring intelligence.", "Engineering possibilities.", "Building what comes next."].map((l, i) => (
                    <span key={l} className="mask-line">
                      <motion.span
                        className={`display block text-[clamp(2.4rem,6.6vw,6.6rem)] ${i === 2 ? "ice-edge" : i === 1 ? "outline-text" : ""}`}
                        variants={{ h: { y: "105%" }, s: { y: "0%", transition: { duration: 1, ease: EASE } } }}
                      >
                        {l}
                      </motion.span>
                    </span>
                  ))}
                </motion.div>
              )}
              {phase === 6 && (
                <motion.div
                  key="entry"
                  className="flex flex-col items-center text-center"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, ease: EASE }}
                >
                  <p className="display chrome-text text-[clamp(3rem,9vw,9rem)] leading-[0.85]">Santhosh Kumar K</p>
                  <p className="eyebrow mt-6 text-soft">Exploring intelligence · Engineering possibilities · Building what comes next</p>
                  <button
                    ref={enterRef}
                    type="button"
                    onClick={finish}
                    className="btn btn-primary mt-12 h-16 px-10"
                    data-testid="enter-experience"
                  >
                    <span>Enter experience</span>
                    <span className="btn-ico" aria-hidden>
                      <Glyph name="arrow-right" size={16} strokeWidth={3} flat tone="dark" />
                    </span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* sequence progress */}
          <div className="relative z-10 px-[var(--gutter)] pb-[calc(7vh+1.25rem)]">
            <div className="flex items-center justify-between">
              <span className="label tabular-nums">Scene 0{Math.min(6, phase + 1)} / 06</span>
              <span className="label hidden sm:inline">Press Esc to skip</span>
            </div>
            <div className="mt-3 h-px w-full bg-white/10">
              {!reduced && (
                <motion.div
                  className="h-px origin-left bg-blue shadow-[0_0_12px_#287bff]"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: TOTAL / 1000, ease: "linear" }}
                />
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
