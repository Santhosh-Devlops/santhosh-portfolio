/* Diagrams drawn from each repository's README. Labelled as schematics on the page. */

const T = { fontFamily: "var(--font-sora)", fontSize: 10, letterSpacing: "0.16em", fill: "#8994a5", fontWeight: 600 } as const;
const W = { fontFamily: "var(--font-sora)", fontSize: 12.5, fill: "#edf2f8", fontWeight: 700 } as const;

function Plate({ x, y, w, h, label, sub, accent }: { x: number; y: number; w: number; h: number; label: string; sub?: string; accent?: boolean }) {
  return (
    <g>
      <rect x={x} y={y + 3} width={w} height={h} rx="9" fill="#020305" />
      <rect x={x} y={y} width={w} height={h} rx="9" fill="url(#sx-ti)" stroke={accent ? "#287bff" : "rgba(237,242,248,.12)"} />
      <path d={`M${x + 9} ${y + 0.5}H${x + w - 9}`} stroke="rgba(255,255,255,.18)" />
      <text x={x + 14} y={y + (sub ? h / 2 - 2 : h / 2 + 4)} style={W}>
        {label}
      </text>
      {sub && (
        <text x={x + 14} y={y + h / 2 + 14} style={{ ...T, fontSize: 8.5 }}>
          {sub}
        </text>
      )}
    </g>
  );
}

function Defs() {
  return (
    <defs>
      <linearGradient id="sx-ti" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1b2230" />
        <stop offset="1" stopColor="#0b0f15" />
      </linearGradient>
      <radialGradient id="sx-core">
        <stop offset="0" stopColor="#8fcbff" />
        <stop offset=".45" stopColor="#287bff" />
        <stop offset="1" stopColor="#185dcc" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="sx-line" x1="0" x2="1">
        <stop offset="0" stopColor="#8fcbff" stopOpacity=".1" />
        <stop offset=".5" stopColor="#8fcbff" />
        <stop offset="1" stopColor="#287bff" stopOpacity=".2" />
      </linearGradient>
    </defs>
  );
}

export function RagSchematic() {
  const lanes = ["Text + layout", "Images · BLIP", "Graphs", "Tables", "Equations", "Numbers"];
  return (
    <svg viewBox="0 0 640 380" className="h-auto w-full" role="img" aria-label="Schematic: a document passes through six extractors, is embedded with MiniLM, retrieved by agents and answered by Qwen2.5-7B">
      <Defs />
      {/* document stack */}
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${24 + i * 8} ${120 - i * 8})`}>
          <path d="M0 0h70l18 18v104H0z" fill="#0b0f15" stroke="rgba(237,242,248,.25)" />
          <path d="M70 0v18h18" fill="none" stroke="rgba(237,242,248,.25)" />
          {i === 2 && [30, 44, 58, 72, 86].map((y) => <path key={y} d={`M12 ${y}h${y === 58 ? 40 : 62}`} stroke="rgba(143,203,255,.5)" />)}
        </g>
      ))}
      <text x="30" y="276" style={T}>PDF</text>
      {/* lanes */}
      {lanes.map((l, i) => {
        const y = 28 + i * 54;
        return (
          <g key={l}>
            <path d={`M130 190 C 170 190, 170 ${y + 18}, 210 ${y + 18}`} fill="none" stroke="url(#sx-line)" strokeWidth="1.2" className="flow-line" />
            <Plate x={210} y={y} w={150} h={36} label={l} accent={i === 1} />
            <path d={`M360 ${y + 18} C 400 ${y + 18}, 400 190, 432 190`} fill="none" stroke="url(#sx-line)" strokeWidth="1.2" className="flow-line" />
          </g>
        );
      })}
      <Plate x={432} y={150} w={92} h={80} label="MiniLM" sub="384-D VECTORS" />
      <path d="M524 190h22" stroke="#287bff" strokeWidth="1.6" className="flow-line" />
      <circle cx="584" cy="190" r="44" fill="url(#sx-core)" opacity=".35" />
      <circle cx="584" cy="190" r="30" fill="#0b0f15" stroke="#287bff" strokeWidth="1.4" />
      <text x="584" y="187" textAnchor="middle" style={{ ...W, fontSize: 11 }}>Qwen</text>
      <text x="584" y="201" textAnchor="middle" style={{ ...T, fontSize: 8 }}>2.5 · 7B</text>
      <text x="584" y="256" textAnchor="middle" style={{ ...T, fontSize: 8.5 }}>
        GROUNDED
      </text>
      <text x="584" y="269" textAnchor="middle" style={{ ...T, fontSize: 8.5 }}>
        ANSWER
      </text>
    </svg>
  );
}

export function OracleSchematic() {
  const agents = ["Profiling", "SQL Analyst", "Statistics", "Anomaly", "Forecasting", "Strategy", "Critic"];
  const cx = 260;
  const cy = 210;
  const R = 150;
  return (
    <svg viewBox="0 0 520 420" className="h-auto w-full" role="img" aria-label="Schematic: a Supervisor agent coordinating seven specialist agents">
      <Defs />
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(237,242,248,.08)" />
      <g className="spin-slow">
        <circle cx={cx} cy={cy} r={R + 22} fill="none" stroke="rgba(143,203,255,.35)" strokeDasharray="2 9" />
      </g>
      <circle cx={cx} cy={cy} r={R - 60} fill="none" stroke="rgba(237,242,248,.06)" />
      {agents.map((a, i) => {
        const t = (i / agents.length) * Math.PI * 2 - Math.PI / 2;
        const x = cx + Math.cos(t) * R;
        const y = cy + Math.sin(t) * R;
        return (
          <g key={a}>
            <path d={`M${cx + Math.cos(t) * 48} ${cy + Math.sin(t) * 48}L${x - Math.cos(t) * 16} ${y - Math.sin(t) * 16}`} stroke="url(#sx-line)" strokeWidth="1.2" className="flow-line" />
            <rect x={x - 9} y={y - 9 + 2} width="18" height="18" rx="4" fill="#020305" transform={`rotate(45 ${x} ${y})`} />
            <rect x={x - 9} y={y - 9} width="18" height="18" rx="4" fill="url(#sx-ti)" stroke={i === 4 ? "#287bff" : "rgba(237,242,248,.3)"} transform={`rotate(45 ${x} ${y})`} />
            <text x={x} y={y + (Math.sin(t) > 0.2 ? 32 : -20)} textAnchor="middle" style={{ ...W, fontSize: 11 }}>
              {a}
            </text>
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r="70" fill="url(#sx-core)" opacity=".28" />
      <circle cx={cx} cy={cy} r="44" fill="#0b0f15" stroke="#287bff" strokeWidth="1.4" />
      <text x={cx} y={cy - 2} textAnchor="middle" style={{ ...W, fontSize: 12 }}>Supervisor</text>
      <text x={cx} y={cy + 13} textAnchor="middle" style={{ ...T, fontSize: 7.5 }}>AUDITED RUNS</text>
    </svg>
  );
}

export function RecruitWeights() {
  const rows = [
    { k: "Required technical skills", v: 40 },
    { k: "Project relevance", v: 25 },
    { k: "Preferred skills", v: 15 },
    { k: "Education", v: 10 },
    { k: "Soft-skill evidence", v: 10 },
  ];
  return (
    <div className="flex flex-col gap-4" role="img" aria-label="Score weights: technical 40, projects 25, preferred 15, education 10, soft-skill evidence 10">
      {rows.map((r, i) => (
        <div key={r.k} className="grid grid-cols-[minmax(0,1fr)_3rem] items-center gap-4">
          <div>
            <div className="mb-2 flex justify-between">
              <span className="head text-[0.85rem] text-soft/90">{r.k}</span>
            </div>
            <div className="relative h-3 rounded-full bg-black/60 shadow-[inset_0_1px_3px_rgba(0,0,0,.9),0_1px_0_rgba(255,255,255,.05)]">
              <div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  width: `${(r.v / 40) * 100}%`,
                  background: i === 0 ? "linear-gradient(90deg,#185dcc,#287bff 60%,#8fcbff)" : "linear-gradient(180deg,#e9eef5,#8994a5)",
                  boxShadow: i === 0 ? "0 0 16px rgba(40,123,255,.6), inset 0 1px 0 rgba(255,255,255,.5)" : "inset 0 1px 0 #fff",
                }}
              />
            </div>
          </div>
          <span className="display text-right text-[1.9rem] leading-none tabular-nums">{r.v}</span>
        </div>
      ))}
    </div>
  );
}
