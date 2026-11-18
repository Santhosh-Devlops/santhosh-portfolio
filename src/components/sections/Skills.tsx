"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { projects, skillCategories, type ProjectId, type Skill } from "@/content/data";
import { pulseScene } from "@/lib/scene";
import { useTilt } from "@/lib/hooks";
import { Glyph } from "../ui/Glyph";
import { Badge, SectionTitle } from "../ui/Primitives";

const EASE = [0.16, 1, 0.3, 1] as const;

function SkillTile({ skill, selected, onSelect }: { skill: Skill; selected: boolean; onSelect: () => void }) {
  const ref = useTilt<HTMLButtonElement>(10);
  return (
    <button ref={ref} type="button" className="tile h-full w-full p-4" aria-pressed={selected} onClick={onSelect} data-testid={`skill-${skill.id}`}>
      <span className="tile-plate" aria-hidden />
      <span className="tile-face flex h-full flex-col gap-4">
        <span className="tile-well h-20 w-full">
          <Glyph name={skill.glyph} size={44} />
        </span>
        <span className="flex items-end justify-between gap-2">
          <span className="head text-[0.92rem] leading-tight">{skill.name}</span>
          {skill.projects.length > 0 && <span className="label shrink-0 text-[0.55rem] text-ice">{skill.projects.length} proj</span>}
        </span>
      </span>
    </button>
  );
}

export default function Skills({ onOpenProject }: { onOpenProject: (id: ProjectId) => void }) {
  const [catId, setCatId] = useState("ai");
  const cat = skillCategories.find((c) => c.id === catId)!;
  const [skillId, setSkillId] = useState(cat.skills[0].id);
  const skill = useMemo(() => skillCategories.flatMap((c) => c.skills).find((s) => s.id === skillId)!, [skillId]);
  const railRef = useRef<HTMLDivElement>(null);

  // On phones the category rail scrolls sideways: keep the active tab in view (without moving the page).
  useEffect(() => {
    const rail = railRef.current;
    const tab = rail?.querySelector<HTMLElement>('[aria-selected="true"]');
    if (!rail || !tab || rail.scrollWidth <= rail.clientWidth) return;
    rail.scrollTo({ left: Math.max(0, tab.offsetLeft - rail.clientWidth / 2 + tab.offsetWidth / 2), behavior: "smooth" });
  }, [catId]);

  const selectCat = (id: string) => {
    setCatId(id);
    setSkillId(skillCategories.find((c) => c.id === id)!.skills[0].id);
    pulseScene(0.5);
  };
  const selectSkill = (id: string) => {
    setSkillId(id);
    pulseScene(1);
  };

  return (
    <section id="skills" data-scene="back" className="section" aria-labelledby="skills-title">
      <div className="wrap">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionTitle id="skills-title" index="02" kicker="Skills" lines={["My technical", <span key="u" className="ice-edge">universe<span className="blue-dot">.</span></span>]} className="lg:col-span-8" />
          <p className="body lg:col-span-4" data-reveal>
            Every skill below links to where it is actually used — a repository, the resume or a certification. No percentages, no self-rated levels.
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-12">
          {/* category rail */}
          <div
            ref={railRef}
            role="tablist"
            aria-label="Skill categories"
            className="-mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] pb-2 [mask-image:linear-gradient(90deg,#000_85%,transparent)] [scrollbar-width:none] lg:col-span-3 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0 lg:[mask-image:none]"
            data-reveal
          >
            {skillCategories.map((c) => {
              const on = c.id === catId;
              return (
                <button
                  key={c.id}
                  role="tab"
                  type="button"
                  aria-selected={on}
                  aria-controls="skill-grid"
                  onClick={() => selectCat(c.id)}
                  className={`group relative flex shrink-0 items-center justify-between gap-6 rounded-xl px-4 py-3.5 text-left transition-all duration-300 lg:w-full ${on ? "titanium" : "hover:bg-white/[0.03]"}`}
                  data-testid={`cat-${c.id}`}
                >
                  {on && <span className="absolute inset-y-3 left-0 w-[2px] rounded bg-blue shadow-[0_0_10px_#287bff]" aria-hidden />}
                  <span className="flex items-baseline gap-3">
                    <span className={`label tabular-nums ${on ? "text-ice" : ""}`}>{c.index}</span>
                    <span className={`head text-[0.95rem] ${on ? "text-white" : "text-soft/60 group-hover:text-soft"}`}>{c.label}</span>
                  </span>
                  <span className="label tabular-nums">{String(c.skills.length).padStart(2, "0")}</span>
                </button>
              );
            })}
          </div>

          {/* tiles */}
          <div id="skill-grid" role="tabpanel" aria-label={cat.label} className="lg:col-span-5" style={{ perspective: 1200 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={catId}
                className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-2"
                initial={{ opacity: 0, rotateX: 12, y: 24 }}
                animate={{ opacity: 1, rotateX: 0, y: 0 }}
                exit={{ opacity: 0, rotateX: -8, y: -16, transition: { duration: 0.25 } }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                {cat.skills.map((s) => (
                  <SkillTile key={s.id} skill={s} selected={s.id === skillId} onSelect={() => selectSkill(s.id)} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* detail */}
          <div className="lg:col-span-4">
            <div className="glass sticky top-28 p-7" aria-live="polite" data-testid="skill-detail">
              <AnimatePresence mode="wait">
                <motion.div key={skill.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }} transition={{ duration: 0.5, ease: EASE }}>
                  <div className="flex items-start justify-between gap-4">
                    <span className="label text-ice">Selected</span>
                    <span className="tile-well h-16 w-16 shrink-0">
                      <Glyph name={skill.glyph} size={36} />
                    </span>
                  </div>
                  <h3 className="display mt-2 text-[clamp(2rem,3vw,2.9rem)] leading-[0.95]">{skill.name}</h3>
                  <p className="body mt-5">{skill.description}</p>

                  <p className="label mt-7">Evidence</p>
                  <p className="mt-2 text-[0.92rem] text-soft/80">{skill.evidence}</p>

                  <p className="label mt-7">Related</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {skill.related.map((r) => (
                      <Badge key={r} small>
                        {r}
                      </Badge>
                    ))}
                  </div>

                  {skill.projects.length > 0 && (
                    <>
                      <p className="label mt-7">Used in</p>
                      <ul className="mt-3 flex flex-col gap-2">
                        {skill.projects.map((pid) => {
                          const p = projects.find((x) => x.id === pid)!;
                          return (
                            <li key={pid}>
                              <button type="button" onClick={() => onOpenProject(pid)} className="group flex w-full items-center justify-between gap-3 rounded-lg border border-white/[0.06] bg-black/30 px-4 py-3 text-left transition hover:border-blue/70">
                                <span className="flex items-baseline gap-3">
                                  <span className="label tabular-nums text-ice">{p.index}</span>
                                  <span className="head text-[0.9rem]">{p.title}</span>
                                </span>
                                <Glyph name="arrow-up-right" size={16} strokeWidth={3} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* full index for quick scanning */}
        <div className="mt-20" data-reveal>
          <div className="rule" />
          <dl className="grid gap-x-10 gap-y-6 pt-8 sm:grid-cols-2 lg:grid-cols-5">
            {skillCategories.map((c) => (
              <div key={c.id}>
                <dt className="label flex items-center gap-2">
                  <span className="text-ice">{c.index}</span> {c.label}
                </dt>
                <dd className="mt-3 text-[0.92rem] leading-relaxed text-soft/75">{c.skills.map((s) => s.name).join(" · ")}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
