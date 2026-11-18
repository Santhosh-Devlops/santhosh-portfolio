"use client";

import { useCallback, useEffect, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ProjectId } from "@/content/data";
import { sceneState, setLenis } from "@/lib/scene";
import { useReducedMotion } from "@/lib/hooks";
import Backdrop from "./three/Backdrop";
import Intro from "./Intro";
import Nav from "./Nav";
import ProjectDetail from "./ProjectDetail";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Projects from "./sections/Projects";
import Journey from "./sections/Journey";
import Credentials from "./sections/Credentials";
import Universe from "./sections/Universe";
import { Contact, Resume } from "./sections/ResumeContact";

gsap.registerPlugin(ScrollTrigger);

/** Lenis smooth scroll synced to GSAP's ticker. Disabled for reduced motion. */
function useSmoothScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 0.9 });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, [enabled]);
}

/** One reveal grammar for the whole site: masked lines, fades, staggers, sweeps, parallax, progress lines. */
function useReveals(ready: boolean, reduced: boolean) {
  useEffect(() => {
    if (!ready) return;
    if (reduced) {
      document.querySelectorAll("[data-sweep]").forEach((el) => el.classList.add("is-lit"));
      return;
    }
    const ease = "expo.out";
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-line]").forEach((el) => {
        gsap.from(el, { yPercent: 112, duration: 1.15, ease, scrollTrigger: { trigger: el.parentElement, start: "top 90%", once: true } });
      });
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, { y: 40, autoAlpha: 0, duration: 1, ease, scrollTrigger: { trigger: el, start: "top 90%", once: true } });
      });
      gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((el) => {
        gsap.from(el.children, { y: 34, autoAlpha: 0, duration: 0.9, ease, stagger: 0.08, scrollTrigger: { trigger: el, start: "top 88%", once: true } });
      });
      gsap.utils.toArray<HTMLElement>("[data-sweep]").forEach((el) => {
        ScrollTrigger.create({ trigger: el, start: "top 92%", once: true, onEnter: () => el.classList.add("is-lit") });
      });
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const amt = Number(el.dataset.parallax) || 8;
        gsap.fromTo(el, { yPercent: -amt, scale: 1.12 }, { yPercent: amt, scale: 1.12, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
      });
      gsap.utils.toArray<HTMLElement>("[data-progress-line]").forEach((el) => {
        gsap.fromTo(el, { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top 70%", end: "bottom 60%", scrub: true } });
      });
    });
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    // Images and fonts change the page height after first measure; keep trigger positions true.
    let t = 0;
    const ro = new ResizeObserver(() => {
      clearTimeout(t);
      t = window.setTimeout(() => ScrollTrigger.refresh(), 150);
    });
    ro.observe(document.body);
    return () => {
      cancelAnimationFrame(id);
      clearTimeout(t);
      ro.disconnect();
      ctx.revert();
    };
  }, [ready, reduced]);
}

export default function Experience() {
  const reduced = useReducedMotion();
  const [introOpen, setIntroOpen] = useState<boolean | null>(null);
  const [ready, setReady] = useState(false);
  const [project, setProject] = useState<ProjectId | null>(null);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("skk-intro") === "1";
    } catch {}
    if (new URLSearchParams(location.search).get("intro") === "0") seen = true;
    if (new URLSearchParams(location.search).get("intro") === "1") seen = false;
    if (seen) {
      sceneState.dawn = 1;
      sceneState.formation = 1;
      document.documentElement.classList.remove("intro-pending");
    }
    // Decided on the client only (sessionStorage / URL); SSR renders the site without the overlay.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIntroOpen(!seen);
    if (seen) setReady(true);
  }, []);

  useSmoothScroll(!reduced);
  useReveals(ready, reduced);

  const closeProject = useCallback(() => setProject(null), []);
  const onIntroDone = useCallback(() => {
    document.documentElement.classList.remove("intro-pending");
    setReady(true);
  }, []);
  const onIntroClosed = useCallback(() => setIntroOpen(false), []);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Backdrop />
      <div className="film" aria-hidden />
      <Nav />
      <main id="main" className="site-main relative">
        <Hero />
        <About />
        <Skills onOpenProject={setProject} />
        <Projects onOpenProject={setProject} />
        <Journey />
        <Credentials />
        <Universe />
        <Resume />
        <Contact />
      </main>
      <ProjectDetail id={project} onClose={closeProject} />
      {introOpen && <Intro reduced={reduced} onDone={onIntroDone} onClosed={onIntroClosed} />}
    </>
  );
}
