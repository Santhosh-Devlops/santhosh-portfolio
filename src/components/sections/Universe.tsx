"use client";

import { universe } from "@/content/data";
import { SectionTitle } from "../ui/Primitives";

const links: [string, string][] = [
  ["ai", "ml"],
  ["ai", "auto"],
  ["ml", "auto"],
  ["se", "fs"],
  ["fs", "pd"],
  ["ps", "se"],
  ["pd", "ai"],
  ["ps", "ml"],
];

const statements: [string, string][] = [
  ["Curious by nature.", "Technical by practice."],
  ["Independent in exploration.", "Collaborative in innovation."],
  ["Every idea is an", "opportunity to build."],
];

export default function Universe() {
  const cx = 500;
  const cy = 300;
  const pos = Object.fromEntries(
    universe.map((u, i) => {
      const t = (i / universe.length) * Math.PI * 2 - Math.PI / 2;
      return [u.id, { x: cx + Math.cos(t) * 330, y: cy + Math.sin(t) * 205, t }];
    }),
  );

  return (
    <section id="universe" data-scene="center" className="section overflow-hidden" aria-labelledby="universe-title">
      <div className="wrap">
        <SectionTitle id="universe-title" index="06" kicker="Range" lines={["One developer.", <span key="u" className="outline-text">An expanding universe<span className="blue-dot">.</span></span>]} />

        <div className="relative mt-16 hidden md:block" data-reveal>
          <svg viewBox="0 0 1000 600" className="h-auto w-full" role="img" aria-label={`Connected areas: ${universe.map((u) => u.label).join(", ")}`}>
            <defs>
              <radialGradient id="uv-core">
                <stop offset="0" stopColor="#8fcbff" stopOpacity=".9" />
                <stop offset=".35" stopColor="#287bff" stopOpacity=".35" />
                <stop offset="1" stopColor="#185dcc" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="uv-ti" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#2a3445" />
                <stop offset=".5" stopColor="#121823" />
                <stop offset="1" stopColor="#07090d" />
              </linearGradient>
            </defs>
            <ellipse cx={cx} cy={cy} rx="330" ry="205" fill="none" stroke="rgba(237,242,248,.07)" />
            <ellipse cx={cx} cy={cy} rx="230" ry="128" fill="none" stroke="rgba(237,242,248,.05)" strokeDasharray="2 8" />
            {universe.map((u) => (
              <path key={`s-${u.id}`} d={`M${cx} ${cy}L${pos[u.id].x} ${pos[u.id].y}`} stroke="rgba(143,203,255,.28)" strokeWidth="1" className="flow-line" />
            ))}
            {links.map(([a, b]) => (
              <path key={`${a}-${b}`} d={`M${pos[a].x} ${pos[a].y}Q${cx} ${cy} ${pos[b].x} ${pos[b].y}`} fill="none" stroke="rgba(237,242,248,.09)" />
            ))}
            <circle cx={cx} cy={cy} r="90" fill="url(#uv-core)" />
            <g transform={`translate(${cx} ${cy})`}>
              <rect x="-30" y="-30" width="60" height="60" rx="10" transform="rotate(45)" fill="url(#uv-ti)" stroke="#287bff" />
              <text y="8" textAnchor="middle" fill="#fff" style={{ fontFamily: "var(--font-anton)", fontSize: 24, letterSpacing: 1 }}>
                SKK
              </text>
            </g>
            {universe.map((u) => {
              const p = pos[u.id];
              // Labels sit centred above or below each node so nothing runs off the canvas.
              const above = Math.sin(p.t) < -0.5;
              const anchor = "middle";
              const dx = 0;
              const dy = above ? -40 : 40;
              return (
                <g key={u.id}>
                  <rect x={p.x - 11} y={p.y - 9} width="22" height="22" rx="5" transform={`rotate(45 ${p.x} ${p.y + 2})`} fill="#020305" />
                  <rect x={p.x - 11} y={p.y - 11} width="22" height="22" rx="5" transform={`rotate(45 ${p.x} ${p.y})`} fill="url(#uv-ti)" stroke={u.id === "ai" ? "#287bff" : "rgba(237,242,248,.3)"} />
                  <text x={p.x + dx} y={p.y + dy} textAnchor={anchor} fill="#fff" style={{ fontFamily: "var(--font-anton)", fontSize: 24, letterSpacing: 0.5, textTransform: "uppercase", paintOrder: "stroke", stroke: "#030406", strokeWidth: 6 }}>
                    {u.label}
                  </text>
                  <text x={p.x + dx} y={p.y + dy + 20} textAnchor={anchor} fill="#8994a5" style={{ fontFamily: "var(--font-sora)", fontSize: 11, letterSpacing: "0.18em", fontWeight: 600, textTransform: "uppercase", paintOrder: "stroke", stroke: "#030406", strokeWidth: 4 }}>
                    {u.note}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <ul className="mt-12 grid gap-3 md:hidden" data-stagger>
          {universe.map((u) => (
            <li key={u.id} className="titanium flex items-center justify-between gap-4 rounded-xl px-5 py-4">
              <span className="display text-[1.5rem] leading-none">{u.label}</span>
              <span className="label text-right text-[0.55rem]">{u.note}</span>
            </li>
          ))}
        </ul>

        <div className="mt-28 flex flex-col gap-20" data-scene="back">
          {statements.map(([a, b], i) => (
            <p key={a} className={`display text-[clamp(2.6rem,7vw,7.4rem)] leading-[0.88] ${i === 1 ? "text-right" : ""}`}>
              <span className="mask-line">
                <span data-line>{a}</span>
              </span>
              <span className="mask-line">
                <span data-line className={i === 2 ? "ice-edge" : "outline-text"}>
                  {b}
                </span>
              </span>
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
