/** Digitální Karel — černý osel s bílým čumákem, barvy 1:1 ze hry.
 *  Mrkání, stříhání ušima a ocas řeší třídy z loukarun.css. */

const C = {
  body: "#45403c",
  belly: "#93887f",
  mane: "#211d1a",
  muzzle: "#efe7da",
  earIn: "#b5a89a",
  eyeRing: "#c6bab0",
  hoof: "#26221e",
};

export function KarelSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 170" className={className} aria-hidden="true">
      {/* ocas */}
      <g className="karel-tail">
        <path d="M40 82 Q22 92 24 112" stroke={C.body} strokeWidth="7" fill="none" strokeLinecap="round" />
        <ellipse cx="24" cy="116" rx="8" ry="11" fill={C.mane} />
      </g>

      {/* nohy */}
      <g fill={C.body}>
        <rect x="56" y="112" width="12" height="42" rx="5.5" />
        <rect x="76" y="115" width="12" height="40" rx="5.5" />
        <rect x="102" y="115" width="12" height="40" rx="5.5" />
        <rect x="120" y="112" width="12" height="42" rx="5.5" />
      </g>
      <g fill={C.hoof}>
        <rect x="56" y="146" width="12" height="9" rx="4" />
        <rect x="76" y="147" width="12" height="9" rx="4" />
        <rect x="102" y="147" width="12" height="9" rx="4" />
        <rect x="120" y="146" width="12" height="9" rx="4" />
      </g>

      {/* tělo */}
      <ellipse cx="90" cy="93" rx="55" ry="35" fill={C.body} />
      <ellipse cx="90" cy="108" rx="36" ry="18" fill={C.belly} />

      {/* uši (za hlavou) */}
      <g className="karel-ear-l">
        <ellipse cx="130" cy="24" rx="9" ry="25" fill={C.body} transform="rotate(-18 130 24)" />
        <ellipse cx="130" cy="27" rx="4.5" ry="16" fill={C.earIn} transform="rotate(-18 130 27)" />
      </g>
      <g className="karel-ear-r">
        <ellipse cx="160" cy="26" rx="9" ry="25" fill={C.body} transform="rotate(16 160 26)" />
        <ellipse cx="160" cy="29" rx="4.5" ry="16" fill={C.earIn} transform="rotate(16 160 29)" />
      </g>

      {/* hlava */}
      <ellipse cx="145" cy="60" rx="31" ry="27" fill={C.body} />
      {/* hříva */}
      <path d="M120 42 Q126 30 133 40 Q138 28 146 38 Q153 28 159 40 L156 48 Q140 38 122 50 Z" fill={C.mane} />
      {/* čumák */}
      <ellipse cx="163" cy="74" rx="21" ry="15" fill={C.muzzle} />
      <ellipse cx="171" cy="71" rx="3" ry="4" fill={C.hoof} transform="rotate(14 171 71)" />
      <path d="M158 81 Q165 86 172 81" stroke={C.hoof} strokeWidth="2.4" fill="none" strokeLinecap="round" />

      {/* oko s kroužkem + mrkací víčko */}
      <circle cx="139" cy="56" r="8.5" fill={C.eyeRing} />
      <circle cx="139" cy="56" r="4.2" fill="#1a1f1c" />
      <circle cx="140.6" cy="54.4" r="1.4" fill="#ffffff" />
      <g transform="translate(139 56)">
        <circle className="karel-eyelid" r="8.6" fill={C.body} />
      </g>
    </svg>
  );
}
