"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

function mediaStore(query: string) {
  return {
    subscribe(cb: () => void) {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    get: () => window.matchMedia(query).matches,
  };
}

const rm = mediaStore("(prefers-reduced-motion: reduce)");
const coarse = mediaStore("(pointer: coarse)");
const mobile = mediaStore("(max-width: 767px)");

export const useReducedMotion = () => useSyncExternalStore(rm.subscribe, rm.get, () => false);
export const useCoarsePointer = () => useSyncExternalStore(coarse.subscribe, coarse.get, () => false);
export const useIsMobile = () => useSyncExternalStore(mobile.subscribe, mobile.get, () => false);

/** Pointer-driven 3D tilt + specular position, written as CSS variables. */
export function useTilt<T extends HTMLElement>(max = 8) {
  const ref = useRef<T>(null);
  const reduced = useReducedMotion();
  const isCoarse = useCoarsePointer();
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || isCoarse) return;
    let raf = 0;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--ry", `${(px - 0.5) * max * 2}deg`);
        el.style.setProperty("--rx", `${(0.5 - py) * max * 2}deg`);
        el.style.setProperty("--mx", `${px * 100}%`);
        el.style.setProperty("--my", `${py * 100}%`);
      });
    };
    const leave = () => {
      cancelAnimationFrame(raf);
      el.style.setProperty("--ry", "0deg");
      el.style.setProperty("--rx", "0deg");
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [max, reduced, isCoarse]);
  return ref;
}

/** Refined magnetic pull toward the pointer (buttons). */
export function useMagnetic<T extends HTMLElement>(strength = 0.22) {
  const ref = useRef<T>(null);
  const reduced = useReducedMotion();
  const isCoarse = useCoarsePointer();
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || isCoarse) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.setProperty("--bx", `${dx * strength}px`);
      el.style.setProperty("--by", `${dy * strength}px`);
    };
    const leave = () => {
      el.style.setProperty("--bx", "0px");
      el.style.setProperty("--by", "0px");
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [strength, reduced, isCoarse]);
  return ref;
}
