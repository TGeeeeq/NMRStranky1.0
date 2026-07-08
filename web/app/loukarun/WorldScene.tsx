/** Šest světů hry jako SVG mini-scény. Server-safe, animace jen přes CSS třídy. */

type World = { id: string; name: string; scene: React.ReactNode };

function Sky({ id, stops }: { id: string; stops: [string, string] }) {
  return (
    <defs>
      <linearGradient id={`sky-${id}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={stops[0]} />
        <stop offset="1" stopColor={stops[1]} />
      </linearGradient>
    </defs>
  );
}

const WORLDS: World[] = [
  {
    id: "louka",
    name: "Rozkvetlá louka",
    scene: (
      <>
        <Sky id="louka" stops={["#8ed4f7", "#d6f0fb"]} />
        <rect width="200" height="120" fill="url(#sky-louka)" />
        <circle cx="168" cy="22" r="13" fill="#fff3b0" />
        <path d="M0 72 Q 50 52 100 66 T 200 60 V120 H0 Z" fill="#6b8e6e" />
        <path d="M0 92 Q 60 74 120 88 T 200 84 V120 H0 Z" fill="#4a7c4e" />
        {[
          [26, 100, "#e8759a"], [58, 108, "#f0e892"], [96, 102, "#ffffff"],
          [138, 108, "#e8759a"], [172, 101, "#f0e892"],
        ].map(([x, y, c], i) => (
          <g key={i}>
            <circle cx={x as number} cy={y as number} r="3.4" fill={c as string} />
            <circle cx={x as number} cy={y as number} r="1.3" fill="#e8833a" />
          </g>
        ))}
      </>
    ),
  },
  {
    id: "sad",
    name: "Ovocný sad",
    scene: (
      <>
        <Sky id="sad" stops={["#aee0f2", "#e9f6d8"]} />
        <rect width="200" height="120" fill="url(#sky-sad)" />
        <path d="M0 88 Q 100 72 200 86 V120 H0 Z" fill="#5f8f5a" />
        {[35, 100, 165].map((x, i) => (
          <g key={i}>
            <rect x={x - 4} y={64 + (i % 2) * 4} width="8" height="26" rx="3" fill="#6f5540" />
            <circle cx={x} cy={54 + (i % 2) * 4} r="20" fill="#4a7c4e" />
            <circle cx={x - 8} cy={50 + (i % 2) * 4} r="3" fill="#d9534f" />
            <circle cx={x + 7} cy={58 + (i % 2) * 4} r="3" fill="#d9534f" />
            <circle cx={x + 1} cy={44 + (i % 2) * 4} r="3" fill="#e8833a" />
          </g>
        ))}
      </>
    ),
  },
  {
    id: "les",
    name: "Pohádkový les",
    scene: (
      <>
        <Sky id="les" stops={["#2f5f63", "#183b40"]} />
        <rect width="200" height="120" fill="url(#sky-les)" />
        {[15, 55, 95, 140, 180].map((x, i) => (
          <path
            key={i}
            d={`M${x} ${118} L${x} ${52 - (i % 3) * 10} L${x - 14} ${86} H${x - 5} L${x - 16} ${112} H${x + 16} L${x + 5} ${86} H${x + 14} L${x} ${52 - (i % 3) * 10}`}
            fill="#0f2b2e"
          />
        ))}
        {[
          [40, 66, 3.2, 0], [80, 92, 4.1, 1.2], [125, 60, 3.6, 0.5], [163, 84, 4.6, 2],
        ].map(([x, y, dur, delay], i) => (
          <circle
            key={i}
            className="lr-firefly"
            style={{ animationDuration: `${dur}s`, animationDelay: `${delay}s` }}
            cx={x}
            cy={y}
            r="2.2"
            fill="#f0e892"
          />
        ))}
      </>
    ),
  },
  {
    id: "vesnice",
    name: "Veselá vesnice",
    scene: (
      <>
        <Sky id="vesnice" stops={["#9fd8f2", "#f4e9cf"]} />
        <rect width="200" height="120" fill="url(#sky-vesnice)" />
        <path d="M0 96 Q 100 86 200 94 V120 H0 Z" fill="#6b8e6e" />
        {[
          [30, "#efe0c8"], [86, "#e6cfb0"], [148, "#efe0c8"],
        ].map(([x, wall], i) => (
          <g key={i}>
            <rect x={(x as number) - 18} y={72 - (i % 2) * 6} width="36" height="28" fill={wall as string} />
            <path
              d={`M${(x as number) - 22} ${72 - (i % 2) * 6} L${x} ${52 - (i % 2) * 6} L${(x as number) + 22} ${72 - (i % 2) * 6} Z`}
              fill="#b85c3c"
            />
            <rect x={(x as number) - 4} y={84 - (i % 2) * 6} width="9" height="16" fill="#6f5540" />
            <rect x={(x as number) + 8} y={78 - (i % 2) * 6} width="7" height="7" fill="#8ed4f7" stroke="#6f5540" strokeWidth="1" />
          </g>
        ))}
      </>
    ),
  },
  {
    id: "zapad",
    name: "Zlatá hodinka",
    scene: (
      <>
        <Sky id="zapad" stops={["#f6b352", "#e8833a"]} />
        <rect width="200" height="120" fill="url(#sky-zapad)" />
        <circle cx="100" cy="78" r="20" fill="#fff3b0" opacity="0.95" />
        <path d="M0 86 Q 60 70 120 84 T 200 80 V120 H0 Z" fill="#7c5232" opacity="0.8" />
        <path d="M0 100 Q 80 88 160 98 T 200 96 V120 H0 Z" fill="#4d3016" />
      </>
    ),
  },
  {
    id: "noc",
    name: "Hvězdná noc",
    scene: (
      <>
        <Sky id="noc" stops={["#1c2952", "#0e1631"]} />
        <rect width="200" height="120" fill="url(#sky-noc)" />
        <circle cx="158" cy="30" r="14" fill="#f4f1e4" />
        <circle cx="152" cy="26" r="12" fill="#1c2952" opacity="0.85" />
        {[
          [22, 22, 3, 0], [52, 44, 4, 1], [88, 18, 3.4, 0.4], [120, 50, 4.6, 1.6], [182, 62, 3.8, 0.9], [66, 70, 4.2, 2.1],
        ].map(([x, y, dur, delay], i) => (
          <circle
            key={i}
            className="lr-star"
            style={{ animationDuration: `${dur}s`, animationDelay: `${delay}s` }}
            cx={x}
            cy={y}
            r="1.7"
            fill="#f7f2e7"
          />
        ))}
        <path d="M0 98 Q 70 84 140 96 T 200 92 V120 H0 Z" fill="#0a1020" />
      </>
    ),
  },
];

export function WorldScenes() {
  return (
    <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
      {WORLDS.map((w) => (
        <figure key={w.id} className="overflow-hidden rounded-lg border border-cream/20 bg-cream/5 transition hover:-translate-y-1 hover:shadow-lg">
          <svg viewBox="0 0 200 120" className="block w-full" role="img" aria-label={w.name}>
            {w.scene}
          </svg>
          <figcaption className="px-4 py-3 text-sm font-medium text-cream">{w.name}</figcaption>
        </figure>
      ))}
    </div>
  );
}
