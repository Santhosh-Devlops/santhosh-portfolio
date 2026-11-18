"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { nav, profile } from "@/content/data";
import { lockScroll, scrollToId } from "@/lib/scene";
import { Glyph } from "./ui/Glyph";

const EASE = [0.16, 1, 0.3, 1] as const;

function useActiveSection() {
  const [active, setActive] = useState<string>("top");
  useEffect(() => {
    const ids = ["top", ...nav.map((n) => n.id)];
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return active;
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const active = useActiveSection();

  useEffect(() => {
    const on = () => setScrolled(scrollY > 40);
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    if (!menu) return;
    lockScroll(true);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    addEventListener("keydown", onKey);
    return () => {
      lockScroll(false);
      removeEventListener("keydown", onKey);
    };
  }, [menu]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMenu(false);
    // let the menu close before scrolling
    requestAnimationFrame(() => scrollToId(id));
  };

  return (
    <>
      <nav className={`nav ${scrolled ? "is-scrolled" : ""}`} aria-label="Primary">
        <div className="wrap flex h-[4.5rem] items-center justify-between gap-6">
          <a href="#top" onClick={go("top")} className="group flex items-center gap-3" aria-label="Santhosh Kumar K — back to top">
            <Glyph name="monogram" size={34} />
            <span className="hidden flex-col whitespace-nowrap leading-none sm:flex lg:hidden xl:flex">
              <span className="head text-[0.78rem] tracking-[0.2em]">SANTHOSH KUMAR K</span>
              <span className="label mt-1 text-[0.56rem]">AI · Software · Full Stack</span>
            </span>
          </a>

          <ul className="hidden items-center gap-7 lg:flex">
            {nav.map((n, i) => (
              <li key={n.id}>
                <a href={`#${n.id}`} onClick={go(n.id)} className="nav-link" aria-current={active === n.id ? "true" : undefined}>
                  <sup>0{i + 1}</sup>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <a href={profile.resumePdf} target="_blank" rel="noopener noreferrer" className="btn btn-glass btn-sm hidden sm:inline-flex">
              <span>Resume</span>
              <span className="btn-ico" aria-hidden>
                <Glyph name="arrow-up-right" size={14} strokeWidth={3} />
              </span>
            </a>
            <button
              type="button"
              className="icon-btn titanium lg:hidden"
              aria-label="Open menu"
              aria-expanded={menu}
              aria-controls="mobile-menu"
              onClick={() => setMenu(true)}
              data-testid="menu-open"
            >
              <Glyph name="menu" size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* section rail */}
      <ol className="rail fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-3 xl:flex" aria-label="Section progress">
        {[{ id: "top", label: "Intro" }, ...nav].map((n) => (
          <li key={n.id}>
            <a href={`#${n.id}`} onClick={go(n.id)} className="rail-item group flex items-center gap-3 py-1" aria-current={active === n.id ? "true" : undefined} aria-label={n.label}>
              <span className="label text-[0.55rem] opacity-0 transition-opacity duration-300 group-hover:opacity-100">{n.label}</span>
              <span className="rail-tick" />
            </a>
          </li>
        ))}
      </ol>

      <AnimatePresence>
        {menu && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-[70] flex flex-col bg-void/95 backdrop-blur-xl"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <div className="wrap flex h-[4.5rem] items-center justify-between">
              <Glyph name="monogram" size={34} />
              <button type="button" className="icon-btn titanium" aria-label="Close menu" onClick={() => setMenu(false)} autoFocus>
                <Glyph name="close" size={20} />
              </button>
            </div>
            <ul className="wrap mt-6 flex flex-1 flex-col justify-center gap-1">
              {nav.map((n, i) => (
                <motion.li key={n.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05, duration: 0.6, ease: EASE }}>
                  <a href={`#${n.id}`} onClick={go(n.id)} className="flex items-baseline gap-4 border-b border-white/5 py-3">
                    <span className="label tabular-nums text-ice">0{i + 1}</span>
                    <span className="display text-[clamp(2.6rem,11vw,4.5rem)]">{n.label}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="wrap pb-8">
              <a href={profile.resumePdf} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full">
                <span>Open resume</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
