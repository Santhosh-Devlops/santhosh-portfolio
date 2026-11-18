import type { ReactNode } from "react";

/*
 * Custom dimensional glyph system.
 * Each glyph is drawn once as geometry and rendered twice:
 *   1. an offset black "extrusion" layer (depth),
 *   2. the face, stroked with brushed-silver gradient and electric-blue accents.
 * Gradients live in <GlyphDefs/> (mounted once in the layout) and use
 * userSpaceOnUse so straight lines render correctly.
 */

type Paint = { m: string; a: string; f: string; fa: string };
type Draw = (p: Paint) => ReactNode;

const glyphs = {
  java: ({ m, a }) => (
    <>
      <path d="M11 21h22v8.5a8.5 8.5 0 0 1-8.5 8.5h-5A8.5 8.5 0 0 1 11 29.5z" stroke={m} />
      <path d="M33 24h2.5a4 4 0 0 1 0 8H33" stroke={m} />
      <path d="M8 43h28" stroke={m} />
      <path d="M18.5 6c-2.4 3 2.4 5.4 0 9M25.5 6c-2.4 3 2.4 5.4 0 9" stroke={a} />
    </>
  ),
  python: ({ m, a }) => (
    <>
      <path d="M33 21v-9a6 6 0 0 0-6-6h-6a6 6 0 0 0-6 6v4.5h10M15 16.5h-4a6 6 0 0 0-6 6V27a6 6 0 0 0 6 6h3.5v-5a6 6 0 0 1 6-6H27a6 6 0 0 0 6-6" stroke={m} />
      <path d="M15 27v9a6 6 0 0 0 6 6h6a6 6 0 0 0 6-6v-4.5H23M33 31.5h4a6 6 0 0 0 6-6V21a6 6 0 0 0-6-6h-3.5v5a6 6 0 0 1-6 6H21a6 6 0 0 0-6 6" stroke={a} />
      <circle cx="20" cy="11" r="1.4" fill={m} stroke="none" />
      <circle cx="28" cy="37" r="1.4" fill={a} stroke="none" />
    </>
  ),
  c: ({ m, a, f }) => (
    <>
      <path d="M24 4l17.3 10v20L24 44 6.7 34V14z" stroke={m} />
      <path d="M24 9.5l12.5 7.2" stroke={a} />
      <text x="24" y="32.5" textAnchor="middle" fontSize="21" fill={f} stroke="none" className="glyph-text">C</text>
    </>
  ),
  cpp: ({ m, a, f }) => (
    <>
      <path d="M24 4l17.3 10v20L24 44 6.7 34V14z" stroke={m} />
      <text x="19" y="32.5" textAnchor="middle" fontSize="21" fill={f} stroke="none" className="glyph-text">C</text>
      <path d="M29 24h6M32 21v6M29 31.5h6M32 28.5v6" stroke={a} strokeWidth="1.6" />
    </>
  ),
  javascript: ({ m, a, f }) => (
    <>
      <path d="M6 6h28l8 8v28H6z" stroke={m} />
      <path d="M34 6v8h8" stroke={a} />
      <text x="25" y="38" textAnchor="middle" fontSize="19" fill={f} stroke="none" className="glyph-text" letterSpacing="0.5">JS</text>
    </>
  ),
  react: ({ m, a, fa }) => (
    <>
      <ellipse cx="24" cy="24" rx="19" ry="7.2" stroke={m} />
      <ellipse cx="24" cy="24" rx="19" ry="7.2" stroke={m} transform="rotate(60 24 24)" />
      <ellipse cx="24" cy="24" rx="19" ry="7.2" stroke={a} transform="rotate(120 24 24)" />
      <circle cx="24" cy="24" r="3.4" fill={fa} stroke="none" />
    </>
  ),
  node: ({ m, a }) => (
    <>
      <path d="M24 4l17.3 10v20L24 44 6.7 34V14z" stroke={m} />
      <path d="M24 14.5l8.6 5v10L24 34.5l-8.6-5v-10z" stroke={a} />
      <path d="M24 4v10.5M24 34.5V44" stroke={m} strokeWidth="1.2" />
    </>
  ),
  graphql: ({ m, a, fa }) => (
    <>
      <path d="M24 5l16.5 9.5v19L24 43 7.5 33.5v-19z" stroke={m} />
      <path d="M24 5L40.5 33.5H7.5z" stroke={a} />
      {[
        [24, 5], [40.5, 14.5], [40.5, 33.5], [24, 43], [7.5, 33.5], [7.5, 14.5],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="2.6" fill={fa} stroke="none" />
      ))}
    </>
  ),
  html: ({ m, a }) => (
    <>
      <path d="M16 13L5 24l11 11M32 13l11 11-11 11" stroke={m} />
      <path d="M27.5 9l-7 30" stroke={a} />
    </>
  ),
  css: ({ m, a, fa }) => (
    <>
      <path d="M16 6c-4 0-5 2-5 5v7c0 3-2 5-5 6 3 1 5 3 5 6v7c0 3 1 5 5 5M32 6c4 0 5 2 5 5v7c0 3 2 5 5 6-3 1-5 3-5 6v7c0 3-1 5-5 5" stroke={m} />
      <circle cx="19" cy="24" r="2.3" fill={fa} stroke="none" />
      <circle cx="29" cy="24" r="2.3" fill={fa} stroke="none" />
      <path d="M24 18v12" stroke={a} />
    </>
  ),
  database: ({ m, a }) => (
    <>
      <ellipse cx="24" cy="10" rx="15" ry="5" stroke={m} />
      <path d="M9 10v28c0 2.8 6.7 5 15 5s15-2.2 15-5V10" stroke={m} />
      <path d="M9 19.5c0 2.8 6.7 5 15 5s15-2.2 15-5" stroke={a} />
      <path d="M9 29c0 2.8 6.7 5 15 5s15-2.2 15-5" stroke={m} />
    </>
  ),
  "document-db": ({ m, a }) => (
    <>
      <path d="M24 4c7.5 8 11 15.5 11 22.5S30.5 39 24 43c-6.5-4-11-9.5-11-16.5S16.5 12 24 4z" stroke={m} />
      <path d="M24 10v37" stroke={a} />
      <path d="M24 26l5-5M24 33l-4.5-4.5" stroke={m} strokeWidth="1.3" />
    </>
  ),
  graph: ({ m, fa, a }) => (
    <>
      <path d="M24 10L13 24M24 10l11 14M13 24l-5 14M13 24l6 14M35 24l-5 14M35 24l5 14" stroke={m} strokeWidth="1.6" />
      <circle cx="24" cy="9" r="4" stroke={a} />
      {[
        [13, 24], [35, 24],
      ].map(([x, y]) => (
        <circle key={`${x}`} cx={x} cy={y} r="3.2" fill={fa} stroke="none" />
      ))}
      {[8, 19, 30, 40].map((x) => (
        <circle key={x} cx={x} cy="39.5" r="2.4" stroke={m} strokeWidth="1.6" />
      ))}
    </>
  ),
  cubes: ({ m, a }) => (
    <>
      <path d="M24 5l17 9.5v19L24 43 7 33.5v-19z" stroke={m} />
      <path d="M7 14.5l17 9.5 17-9.5M24 24v19" stroke={m} strokeWidth="1.4" />
      <path d="M24 14.5l6.5 3.6v7.3L24 29l-6.5-3.6v-7.3z" stroke={a} />
    </>
  ),
  layers: ({ m, a }) => (
    <>
      <path d="M24 6l19 9.5L24 25 5 15.5z" stroke={m} />
      <path d="M5 23.5L24 33l19-9.5" stroke={m} />
      <path d="M5 31.5L24 41l19-9.5" stroke={a} />
    </>
  ),
  key: ({ m, a, fa }) => (
    <>
      <path d="M15 21v-6a9 9 0 0 1 18 0v6" stroke={m} />
      <rect x="9" y="21" width="30" height="22" rx="5" stroke={m} />
      <circle cx="24" cy="30" r="3" fill={fa} stroke="none" />
      <path d="M24 32.5v5" stroke={a} />
    </>
  ),
  neural: ({ m, fa, a }) => {
    const L = [[8, 14], [8, 34]];
    const M = [[24, 8], [24, 24], [24, 40]];
    const R = [[40, 16], [40, 32]];
    return (
      <>
        {L.flatMap(([x1, y1]) => M.map(([x2, y2]) => <path key={`l${y1}${y2}`} d={`M${x1} ${y1}L${x2} ${y2}`} stroke={m} strokeWidth="1" />))}
        {M.flatMap(([x1, y1]) => R.map(([x2, y2]) => <path key={`r${y1}${y2}`} d={`M${x1} ${y1}L${x2} ${y2}`} stroke={m} strokeWidth="1" />))}
        {L.concat(R).map(([x, y]) => <circle key={`n${x}${y}`} cx={x} cy={y} r="3.2" stroke={m} fill="#0b0f15" />)}
        {M.map(([x, y]) => <circle key={`c${y}`} cx={x} cy={y} r="3.6" fill={fa} stroke={a} strokeWidth="1" />)}
      </>
    );
  },
  agents: ({ m, a, fa }) => (
    <>
      {Array.from({ length: 6 }, (_, i) => {
        const t = (i / 6) * Math.PI * 2 - Math.PI / 2;
        const x = 24 + Math.cos(t) * 16.5;
        const y = 24 + Math.sin(t) * 16.5;
        return (
          <g key={i}>
            <path d={`M${24 + Math.cos(t) * 6.5} ${24 + Math.sin(t) * 6.5}L${24 + Math.cos(t) * 13.5} ${24 + Math.sin(t) * 13.5}`} stroke={m} strokeWidth="1.2" />
            <circle cx={x} cy={y} r="3.2" stroke={m} />
          </g>
        );
      })}
      <circle cx="24" cy="24" r="5" fill={fa} stroke={a} />
    </>
  ),
  vector: ({ m, a }) => (
    <>
      <path d="M8 40h34M8 40V6" stroke={m} strokeWidth="1.3" />
      <path d="M8 40L36 14M8 40L40 30" stroke={a} />
      <path d="M31 13.5l5 .5-.5 5M35.5 27.6l4.5 2.4-3.6 3.5" stroke={a} />
      <path d="M19 30a13 13 0 0 1 4 6.5" stroke={m} strokeWidth="1.3" />
    </>
  ),
  spark: ({ m, a }) => (
    <>
      <path d="M22 6c1.6 11.5 3.6 13.5 15 16-11.4 2.5-13.4 4.5-15 16-1.6-11.5-3.6-13.5-15-16 11.4-2.5 13.4-4.5 15-16z" stroke={m} />
      <path d="M38 5c.6 4 1.3 4.7 5 5.5-3.7.8-4.4 1.5-5 5.5-.6-4-1.3-4.7-5-5.5 3.7-.8 4.4-1.5 5-5.5z" stroke={a} strokeWidth="1.4" />
    </>
  ),
  wave: ({ m, a, fa }) => (
    <>
      <path d="M4 32l5-4 5 3 5-6 4 3 4-19 4 22 5-5 4 3 4-2" stroke={m} />
      <path d="M4 20h40" stroke={a} strokeDasharray="2 3" strokeWidth="1.4" />
      <circle cx="27" cy="9" r="2.8" fill={fa} stroke="none" />
    </>
  ),
  bars: ({ m, a }) => (
    <>
      <path d="M6 42h36" stroke={m} />
      <rect x="9" y="28" width="6" height="10" rx="1.2" stroke={m} />
      <rect x="18.5" y="21" width="6" height="17" rx="1.2" stroke={m} />
      <rect x="28" y="24" width="6" height="14" rx="1.2" stroke={m} />
      <path d="M8 22l11-9 9 4 13-11" stroke={a} />
      <path d="M36 6h5v5" stroke={a} />
    </>
  ),
  eye: ({ m, fa, a }) => (
    <>
      <path d="M3 24C9 13.5 16 8.5 24 8.5S39 13.5 45 24c-6 10.5-13 15.5-21 15.5S9 34.5 3 24z" stroke={m} />
      <circle cx="24" cy="24" r="8" stroke={a} />
      <circle cx="24" cy="24" r="3.2" fill={fa} stroke="none" />
    </>
  ),
  cloud: ({ m, a }) => (
    <>
      <path d="M13.5 37h22a8.5 8.5 0 0 0 1-17 11.5 11.5 0 0 0-22-3.5A10.3 10.3 0 0 0 13.5 37z" stroke={m} />
      <path d="M17 29.5a6 6 0 0 1 6-6M21 18.5a8 8 0 0 1 9 2" stroke={a} />
    </>
  ),
  signal: ({ m, a }) => (
    <>
      <path d="M8 21v6M14 15v18M26 17v14M32 11v26M38 19v10" stroke={m} />
      <path d="M20 8v32" stroke={a} />
    </>
  ),
  github: ({ f }) => (
    <path
      transform="translate(2.2 2.2) scale(1.82)"
      fill={f}
      stroke="none"
      fillRule="evenodd"
      d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3z"
    />
  ),
  linkedin: ({ m, a, fa }) => (
    <>
      <rect x="5" y="5" width="38" height="38" rx="8" stroke={m} />
      <circle cx="15.5" cy="15" r="2.6" fill={fa} stroke="none" />
      <path d="M15.5 21.5V35" stroke={m} strokeWidth="3" />
      <path d="M23 35V21.5M23 28a6 6 0 0 1 12 0v7" stroke={m} strokeWidth="3" />
      <path d="M5 13V13" stroke={a} />
    </>
  ),
  leetcode: ({ m, a }) => (
    <>
      <path d="M29 6L13.5 21.5a3.6 3.6 0 0 0 0 5L27 40" stroke={m} strokeWidth="2.6" />
      <path d="M21 29.5h17" stroke={a} strokeWidth="2.6" />
      <path d="M27 40l5.5-5.5M29 6l5 5" stroke={m} strokeWidth="1.6" />
    </>
  ),
  hackerrank: ({ m, a }) => (
    <>
      <path d="M24 4l17.3 10v20L24 44 6.7 34V14z" stroke={m} />
      <path d="M18.5 15v18M29.5 15v18" stroke={m} strokeWidth="2.4" />
      <path d="M18.5 24h11" stroke={a} strokeWidth="2.4" />
    </>
  ),
  mail: ({ m, a }) => (
    <>
      <rect x="5" y="10" width="38" height="28" rx="5" stroke={m} />
      <path d="M7 13l17 13 17-13" stroke={a} />
    </>
  ),
  gmail: ({ m, a }) => (
    <>
      <path d="M6 37V14a3.5 3.5 0 0 1 5.6-2.8L24 20.5l12.4-9.3A3.5 3.5 0 0 1 42 14v23a3 3 0 0 1-3 3h-5V23.5l-10 7.5-10-7.5V40H9a3 3 0 0 1-3-3z" stroke={m} />
      <path d="M14 23.5L24 31l10-7.5" stroke={a} />
    </>
  ),
  copy: ({ m, a }) => (
    <>
      <rect x="15" y="15" width="26" height="28" rx="5" stroke={m} />
      <path d="M33 15v-4a5 5 0 0 0-5-5H12a5 5 0 0 0-5 5v19a5 5 0 0 0 5 5h3" stroke={a} />
    </>
  ),
  check: ({ a }) => <path d="M9 25l9.5 9.5L39 14" stroke={a} strokeWidth="3" />,
  "arrow-right": ({ m, a }) => (
    <>
      <path d="M7 24h32" stroke={m} strokeWidth="2.6" />
      <path d="M28 13l11 11-11 11" stroke={a} strokeWidth="2.6" />
    </>
  ),
  "arrow-up-right": ({ m, a }) => (
    <>
      <path d="M12 36L35 13" stroke={m} strokeWidth="2.6" />
      <path d="M17 13h18v18" stroke={a} strokeWidth="2.6" />
    </>
  ),
  "arrow-down": ({ m, a }) => (
    <>
      <path d="M24 6v34" stroke={m} strokeWidth="2.6" />
      <path d="M13 29l11 11 11-11" stroke={a} strokeWidth="2.6" />
    </>
  ),
  "arrow-up": ({ m, a }) => (
    <>
      <path d="M24 42V8" stroke={m} strokeWidth="2.6" />
      <path d="M13 19L24 8l11 11" stroke={a} strokeWidth="2.6" />
    </>
  ),
  download: ({ m, a }) => (
    <>
      <path d="M24 6v24" stroke={m} strokeWidth="2.6" />
      <path d="M14 21l10 10 10-10" stroke={a} strokeWidth="2.6" />
      <path d="M8 34v5a3 3 0 0 0 3 3h26a3 3 0 0 0 3-3v-5" stroke={m} strokeWidth="2.6" />
    </>
  ),
  document: ({ m, a }) => (
    <>
      <path d="M11 5h18l9 9v29H11z" stroke={m} />
      <path d="M29 5v9h9" stroke={m} />
      <path d="M17 24h15M17 30h15M17 36h9" stroke={a} />
    </>
  ),
  close: ({ m, a }) => (
    <>
      <path d="M12 12l24 24" stroke={m} strokeWidth="2.8" />
      <path d="M36 12L12 36" stroke={a} strokeWidth="2.8" />
    </>
  ),
  menu: ({ m, a }) => (
    <>
      <path d="M8 16h32" stroke={m} strokeWidth="2.6" />
      <path d="M8 24h32" stroke={a} strokeWidth="2.6" />
      <path d="M8 32h20" stroke={m} strokeWidth="2.6" />
    </>
  ),
  location: ({ m, a, fa }) => (
    <>
      <path d="M24 44s14-12.5 14-24a14 14 0 0 0-28 0c0 11.5 14 24 14 24z" stroke={m} />
      <circle cx="24" cy="20" r="5" fill={fa} stroke={a} />
    </>
  ),
  trophy: ({ m, a }) => (
    <>
      <path d="M15 6h18v12a9 9 0 0 1-18 0z" stroke={m} />
      <path d="M15 10H8v3a7 7 0 0 0 7 7M33 10h7v3a7 7 0 0 1-7 7" stroke={m} strokeWidth="1.6" />
      <path d="M24 27v8M16 42h16M18 42l1.5-7h9L30 42" stroke={m} />
      <path d="M24 10v8" stroke={a} />
    </>
  ),
  cap: ({ m, a }) => (
    <>
      <path d="M3 18L24 8l21 10-21 10z" stroke={m} />
      <path d="M11 22v10c4 4 22 4 26 0V22" stroke={m} />
      <path d="M45 18v12" stroke={a} />
    </>
  ),
  briefcase: ({ m, a }) => (
    <>
      <rect x="5" y="14" width="38" height="27" rx="5" stroke={m} />
      <path d="M17 14v-3a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v3" stroke={m} />
      <path d="M5 25h38" stroke={a} />
    </>
  ),
  monogram: ({ m, a, f }) => (
    <>
      <path d="M24 2.5l19 11v21L24 45.5 5 34.5v-21z" stroke={m} />
      <path d="M24 2.5l19 11" stroke={a} />
      <text x="24" y="31.5" textAnchor="middle" fontSize="18" fill={f} stroke="none" className="glyph-text" letterSpacing="0.5">SK</text>
    </>
  ),
} satisfies Record<string, Draw>;

export type GlyphName = keyof typeof glyphs;

export function Glyph({
  name,
  size = 40,
  className = "",
  title,
  strokeWidth = 2,
  flat = false,
  tone = "metal",
}: {
  name: GlyphName;
  size?: number;
  className?: string;
  title?: string;
  strokeWidth?: number;
  flat?: boolean;
  /** "dark" engraves the glyph for use on chrome/white surfaces. */
  tone?: "metal" | "dark";
}) {
  const draw = glyphs[name] as Draw;
  const shadow: Paint = { m: "#000", a: "#000", f: "#000", fa: "#000" };
  const face: Paint =
    tone === "dark"
      ? { m: "#0a0e14", a: "#185dcc", f: "#0a0e14", fa: "#185dcc" }
      : { m: "url(#g-metal)", a: "url(#g-blue)", f: "url(#g-metal-fill)", fa: "url(#g-blue-fill)" };
  return (
    <svg
      className={`glyph ${className}`}
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {!flat && (
        <g transform="translate(0.8 1.6)" opacity="0.85">
          {draw(shadow)}
        </g>
      )}
      <g>{draw(face)}</g>
    </svg>
  );
}

/** Shared gradients. Mounted once; never display:none (breaks gradient refs). */
export function GlyphDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden focusable="false">
      <defs>
        <linearGradient id="g-metal" gradientUnits="userSpaceOnUse" x1="0" y1="2" x2="0" y2="46">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.42" stopColor="#d5dde8" />
          <stop offset="0.62" stopColor="#8994a5" />
          <stop offset="1" stopColor="#e9eef5" />
        </linearGradient>
        <linearGradient id="g-metal-fill" gradientUnits="userSpaceOnUse" x1="0" y1="4" x2="0" y2="44">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.5" stopColor="#c9d2de" />
          <stop offset="0.56" stopColor="#7f8a9b" />
          <stop offset="1" stopColor="#dfe5ee" />
        </linearGradient>
        <linearGradient id="g-blue" gradientUnits="userSpaceOnUse" x1="4" y1="4" x2="44" y2="44">
          <stop offset="0" stopColor="#c8e6ff" />
          <stop offset="0.45" stopColor="#8fcbff" />
          <stop offset="1" stopColor="#287bff" />
        </linearGradient>
        <radialGradient id="g-blue-fill" gradientUnits="userSpaceOnUse" cx="22" cy="20" r="26">
          <stop offset="0" stopColor="#d6edff" />
          <stop offset="0.35" stopColor="#8fcbff" />
          <stop offset="1" stopColor="#185dcc" />
        </radialGradient>
      </defs>
    </svg>
  );
}
