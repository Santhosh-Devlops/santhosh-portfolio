"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { sceneState, type Composition } from "@/lib/scene";
import { useCoarsePointer, useIsMobile, useReducedMotion } from "@/lib/hooks";

const Scene = dynamic(() => import("./Scene"), { ssr: false });

/**
 * "full": hardware WebGL. "none": no WebGL, or a software rasteriser
 * (SwiftShader / llvmpipe / Microsoft Basic Render) that would stall the page.
 */
function detectWebGL(): "full" | "none" {
  try {
    const c = document.createElement("canvas");
    const gl = (c.getContext("webgl2") || c.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return "none";
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : "";
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    if (/swiftshader|llvmpipe|softpipe|basic render|software/i.test(renderer)) return "none";
    return "full";
  } catch {
    return "none";
  }
}

/** Static SVG sculpture used when WebGL is unavailable. Same palette, same silhouette. */
function FallbackSculpture() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-void" aria-hidden data-testid="webgl-fallback">
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 70% 45%, rgba(24,93,204,.22), transparent 55%)" }} />
      <svg viewBox="0 0 400 400" className="absolute right-[-6vw] top-1/2 w-[min(70vw,720px)] -translate-y-1/2 opacity-80">
        <defs>
          <linearGradient id="fb-face-a" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2a3647" />
            <stop offset="1" stopColor="#090c12" />
          </linearGradient>
          <linearGradient id="fb-face-b" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4a5a72" />
            <stop offset="1" stopColor="#0d121a" />
          </linearGradient>
          <radialGradient id="fb-core">
            <stop offset="0" stopColor="#8fcbff" />
            <stop offset=".4" stopColor="#287bff" stopOpacity=".7" />
            <stop offset="1" stopColor="#287bff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g fill="none" strokeWidth="1.4">
          <ellipse cx="200" cy="200" rx="170" ry="52" stroke="#b9c3d1" strokeOpacity=".5" transform="rotate(-18 200 200)" />
          <ellipse cx="200" cy="200" rx="150" ry="70" stroke="#8fcbff" strokeOpacity=".7" transform="rotate(32 200 200)" />
          <ellipse cx="200" cy="200" rx="185" ry="34" stroke="#b9c3d1" strokeOpacity=".35" transform="rotate(70 200 200)" />
        </g>
        <polygon points="200,92 286,150 286,250 200,308 114,250 114,150" fill="url(#fb-face-a)" />
        <polygon points="200,92 286,150 200,200" fill="url(#fb-face-b)" />
        <polygon points="114,250 200,200 200,308" fill="#0b1018" />
        <polygon points="286,250 200,200 200,308" fill="url(#fb-face-b)" opacity=".6" />
        <circle cx="200" cy="200" r="60" fill="url(#fb-core)" />
        <g stroke="#edf2f8" strokeOpacity=".25" fill="none">
          <polygon points="200,92 286,150 286,250 200,308 114,250 114,150" />
          <path d="M200 92 200 200 286 150M200 200 114 150M200 200 200 308M200 200 286 250M200 200 114 250" />
        </g>
      </svg>
    </div>
  );
}

export default function Backdrop() {
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const reduced = useReducedMotion();
  const coarse = useCoarsePointer();
  const mobile = useIsMobile();

  useEffect(() => {
    // Feature detection must run on the client after mount.
    const q = new URLSearchParams(location.search);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWebgl(q.has("nowebgl") ? false : q.has("forcewebgl") ? true : detectWebGL() === "full");
  }, []);

  useEffect(() => {
    sceneState.reducedMotion = reduced;
  }, [reduced]);

  useEffect(() => {
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      sceneState.pointer.x = (e.clientX / innerWidth) * 2 - 1;
      sceneState.pointer.y = -((e.clientY / innerHeight) * 2 - 1);
    };
    const update = () => {
      raf = 0;
      const vh = innerHeight;
      const max = document.documentElement.scrollHeight - vh;
      sceneState.progress = max > 0 ? Math.min(1, scrollY / max) : 0;
      // Last match wins, so a nested [data-scene] overrides its section.
      const nodes = document.querySelectorAll<HTMLElement>("[data-scene]");
      for (const n of nodes) {
        const r = n.getBoundingClientRect();
        if (r.top <= vh * 0.5 && r.bottom >= vh * 0.5) {
          sceneState.composition = (n.dataset.scene as Composition) || "right";
        }
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    addEventListener("pointermove", onMove, { passive: true });
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      removeEventListener("pointermove", onMove);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (webgl === null) return <div className="fixed inset-0 z-0 bg-void" aria-hidden />;
  if (!webgl) return <FallbackSculpture />;
  return <Scene quality={mobile || coarse ? "low" : "high"} mobile={mobile} />;
}
