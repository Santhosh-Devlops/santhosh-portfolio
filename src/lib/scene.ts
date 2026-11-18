"use client";

import type Lenis from "lenis";

/**
 * Shared, mutable state read by the 3D scene every frame and written by DOM
 * components. Kept outside React to avoid re-renders on every scroll tick.
 */
export const sceneState = {
  /** 0 → 1: sculpture assembly, driven by the intro. */
  formation: 0,
  /** 0 → 1: distant blue light at the start of the intro. */
  dawn: 0,
  /** Current composition target, chosen by the section nearest the viewport centre. */
  composition: "right" as Composition,
  /** Short-lived light pulse (skill selection, project open). Decays in the scene. */
  pulse: 0,
  /** Normalised pointer, -1..1. */
  pointer: { x: 0, y: 0 },
  /** Global scroll progress 0..1. */
  progress: 0,
  reducedMotion: false,
};

export type Composition = "right" | "left" | "center" | "back" | "far-right" | "far-left";

export function pulseScene(strength = 1) {
  sceneState.pulse = Math.min(1.4, sceneState.pulse + strength);
}

let lenisRef: Lenis | null = null;
export const setLenis = (l: Lenis | null) => {
  lenisRef = l;
};
export const getLenis = () => lenisRef;

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(el, { offset: id === "top" ? 0 : -20, duration: 1.6 });
  else el.scrollIntoView({ behavior: sceneState.reducedMotion ? "auto" : "smooth", block: "start" });
}

export function lockScroll(lock: boolean) {
  const lenis = getLenis();
  if (lenis) {
    if (lock) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = lock ? "hidden" : "";
}
