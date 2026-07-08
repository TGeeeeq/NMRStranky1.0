/** Vektorové sprity běžců v barvách ze hry (public/loukarun/app/js/data.js).
 *  Nohy se hýbou jen uvnitř .is-running nebo .lr-runner (viz loukarun.css). */

export type RunnerId = "karel" | "pogo" | "avala" | "flicek" | "yakul" | "kveta";

type Cfg = {
  body: string;
  belly: string;
  mane: string;
  muzzle: string;
  earIn: string;
  hoof: string;
  legs?: string;
  wool?: boolean;
  pig?: boolean;
  horns?: string;
  patches?: string;
  eyePatch?: string;
  forelock?: string;
};

const CFG: Record<RunnerId, Cfg> = {
  karel: { body: "#45403c", belly: "#93887f", mane: "#211d1a", muzzle: "#efe7da", earIn: "#b5a89a", hoof: "#26221e" },
  pogo: { body: "#f2ede2", belly: "#ffffff", mane: "#e2d8c6", muzzle: "#9a8268", earIn: "#c2a888", legs: "#8a7460", hoof: "#463c32", wool: true },
  avala: { body: "#9a5226", belly: "#f2e7d4", mane: "#5e3418", muzzle: "#efb9a2", earIn: "#d3a284", hoof: "#3d3128", patches: "#f2ead9" },
  flicek: { body: "#b3aaa1", belly: "#cec5bc", mane: "#8a817a", muzzle: "#d9a9a0", earIn: "#756c66", hoof: "#46403a", pig: true },
  yakul: { body: "#6b4830", belly: "#e6dac6", mane: "#4c3120", muzzle: "#e9dfcd", earIn: "#c2996f", legs: "#5a3c28", hoof: "#31261e", horns: "#c7ad85" },
  kveta: { body: "#9a5226", belly: "#f2e7d4", mane: "#5e3418", muzzle: "#efb9a2", earIn: "#d3a284", hoof: "#3d3128", patches: "#f2ead9", eyePatch: "#552a12", forelock: "#f7f2e6" },
};

function Leg({ x, cls, color, hoof }: { x: number; cls: string; color: string; hoof: string }) {
  return (
    <g transform={`translate(${x} 74)`}>
      <g className={cls}>
        <rect x="-5" y="0" width="10" height="34" rx="4.5" fill={color} />
        <rect x="-5" y="27" width="10" height="7" rx="3" fill={hoof} />
      </g>
    </g>
  );
}

export function RunnerSprite({ id, className }: { id: RunnerId; className?: string }) {
  const c = CFG[id];
  const legColor = c.legs ?? c.body;
  return (
    <svg viewBox="0 0 160 120" className={className} aria-hidden="true">
      <Leg x={52} cls="run-leg-a" color={legColor} hoof={c.hoof} />
      <Leg x={70} cls="run-leg-b" color={legColor} hoof={c.hoof} />
      <Leg x={94} cls="run-leg-b" color={legColor} hoof={c.hoof} />
      <Leg x={110} cls="run-leg-a" color={legColor} hoof={c.hoof} />

      <g className="run-body">
        {/* ocas */}
        {c.pig ? (
          <path d="M36 58 q-9 -3 -6 -10 q3 -6 9 -2" stroke={c.body} strokeWidth="4" fill="none" strokeLinecap="round" />
        ) : c.wool ? (
          <circle cx="34" cy="58" r="8" fill={c.body} />
        ) : (
          <g>
            <path d="M40 60 Q28 68 30 82" stroke={c.body} strokeWidth="5.5" fill="none" strokeLinecap="round" />
            <ellipse cx="30" cy="85" rx="6" ry="8" fill={c.mane} />
          </g>
        )}

        {/* tělo */}
        <ellipse cx="80" cy="60" rx="44" ry="27" fill={c.body} />
        <ellipse cx="80" cy="71" rx="29" ry="14" fill={c.belly} />
        {c.wool && (
          <g fill={c.body}>
            <circle cx="46" cy="46" r="12" /><circle cx="64" cy="38" r="13" /><circle cx="84" cy="36" r="13" />
            <circle cx="103" cy="42" r="12" /><circle cx="112" cy="56" r="11" /><circle cx="44" cy="62" r="11" />
          </g>
        )}
        {c.patches && (
          <g fill={c.patches}>
            <ellipse cx="66" cy="50" rx="14" ry="10" transform="rotate(-12 66 50)" />
            <ellipse cx="97" cy="66" rx="11" ry="8" transform="rotate(9 97 66)" />
          </g>
        )}
        {id === "flicek" && (
          <g fill="#38342f" opacity="0.85">
            <ellipse cx="70" cy="52" rx="7" ry="5" transform="rotate(-14 70 52)" />
            <ellipse cx="94" cy="63" rx="5" ry="4" transform="rotate(20 94 63)" />
          </g>
        )}

        {/* ucho (za hlavou) */}
        <g>
          <ellipse cx="116" cy="16" rx="6.5" ry={c.wool || c.pig ? 12 : 17} fill={c.body} transform="rotate(-14 116 16)" />
          <ellipse cx="116" cy="18" rx="3" ry={c.wool || c.pig ? 7 : 11} fill={c.earIn} transform="rotate(-14 116 18)" />
        </g>

        {/* hlava */}
        <circle cx="126" cy="34" r="21" fill={c.body} />
        {c.wool && <circle cx="120" cy="20" r="10" fill={c.mane} />}
        {c.forelock && <ellipse cx="120" cy="18" rx="9" ry="6" fill={c.forelock} />}
        {!c.wool && !c.forelock && (
          <path d="M108 22 Q114 12 121 19 Q127 10 133 18 L130 26 Q118 20 110 28 Z" fill={c.mane} />
        )}
        {c.horns && (
          <path d="M113 18 Q104 8 112 2 Q120 -2 121 8" stroke={c.horns} strokeWidth="6" fill="none" strokeLinecap="round" />
        )}

        {/* čumák / rypáček */}
        {c.pig ? (
          <g>
            <ellipse cx="144" cy="40" rx="10" ry="8" fill={c.muzzle} />
            <circle cx="141" cy="40" r="1.6" fill={c.hoof} />
            <circle cx="147" cy="40" r="1.6" fill={c.hoof} />
          </g>
        ) : (
          <g>
            <ellipse cx="141" cy="43" rx="13" ry="10" fill={c.muzzle} />
            <ellipse cx="146" cy="41" rx="2" ry="2.8" fill={c.hoof} transform="rotate(12 146 41)" />
            <path d="M136 48 Q141 51.5 146 48" stroke={c.hoof} strokeWidth="1.8" fill="none" strokeLinecap="round" />
          </g>
        )}

        {/* oko */}
        {c.eyePatch && <circle cx="121" cy="30" r="8" fill={c.eyePatch} />}
        {id === "karel" && <circle cx="121" cy="30" r="6.5" fill="#c6bab0" />}
        <circle cx="121" cy="30" r="3.2" fill="#1a1f1c" />
        <circle cx="122.2" cy="28.8" r="1" fill="#ffffff" />
      </g>
    </svg>
  );
}
