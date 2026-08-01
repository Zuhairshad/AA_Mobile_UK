import {
  ArtworkSvg,
  BODY,
  CONTACT,
  DARK,
  FLEX,
  FLEX_EDGE,
  METAL_EDGE,
} from "./artworkShared"
import type { ToolArtworkKind } from "./toolArtworkMap"

/**
 * Illustrations for the tools and accessories we do not photograph.
 *
 * Fewer items than the parts, so these are mapped explicitly by product id in
 * `toolArtworkFor` rather than inferred — a wrong drawing on a tool is more
 * obviously wrong than on a generic part, and an explicit map is easy to check.
 */

export default function ToolArtwork({
  kind,
  className,
}: {
  kind: ToolArtworkKind
  className?: string
}) {
  return (
    <ArtworkSvg className={className}>
      {kind === "toolkit" ? <Toolkit /> : null}
      {kind === "fixkit" ? <FixKit /> : null}
      {kind === "driver" ? <Driver /> : null}
      {kind === "bit" ? <BitSet /> : null}
      {kind === "pick" ? <Picks /> : null}
      {kind === "spudger" ? <Spudger /> : null}
      {kind === "suction" ? <Suction /> : null}
      {kind === "heatpad" ? <HeatPad /> : null}
      {kind === "adhesive" ? <Adhesive /> : null}
      {kind === "wipes" ? <Wipes /> : null}
      {kind === "esd" ? <Esd /> : null}
      {kind === "cable" ? <Cable /> : null}
      {kind === "charger" ? <Charger /> : null}
      {kind === "earbuds" ? <Earbuds /> : null}
      {kind === "wallet" ? <Wallet /> : null}
    </ArtworkSvg>
  )
}

/** Open canvas roll with bits standing in their loops. */
function Toolkit() {
  return (
    <g>
      <rect
        x="34"
        y="70"
        width="172"
        height="106"
        rx="10"
        fill="#3f4a5a"
        stroke="#2b3442"
        strokeWidth="2"
      />
      {/* fold line */}
      <line x1="120" y1="70" x2="120" y2="176" stroke="#2b3442" strokeWidth="2" />
      {/* elastic loops with bits */}
      {Array.from({ length: 8 }, (_, i) => (
        <g key={i}>
          <rect
            x={44 + (i % 4) * 20}
            y={i < 4 ? 84 : 128}
            width="9"
            height="34"
            rx="4"
            fill="url(#pa-steel)"
          />
          <rect
            x={42 + (i % 4) * 20}
            y={i < 4 ? 104 : 148}
            width="13"
            height="5"
            rx="2"
            fill="#232b36"
          />
        </g>
      ))}
      {/* driver handle tucked in the right half */}
      <rect x="134" y="88" width="58" height="18" rx="9" fill="url(#pa-handle)" />
      <rect x="134" y="120" width="58" height="14" rx="7" fill="url(#pa-steel)" />
      <rect x="134" y="146" width="42" height="12" rx="6" fill={FLEX} stroke={FLEX_EDGE} />
      {/* tie strap */}
      <rect x="30" y="112" width="8" height="22" rx="4" fill="#232b36" />
    </g>
  )
}

/** Small zip pouch with a job's worth of tools. */
function FixKit() {
  return (
    <g>
      <rect
        x="46"
        y="82"
        width="148"
        height="88"
        rx="12"
        fill="#3f4a5a"
        stroke="#2b3442"
        strokeWidth="2"
      />
      {/* zip */}
      <line x1="46" y1="100" x2="194" y2="100" stroke="#8b95a1" strokeWidth="3" strokeDasharray="4 3" />
      <circle cx="188" cy="100" r="6" fill={CONTACT} />
      {/* one driver showing above the zip, rather than a jumble of shapes */}
      <g transform="rotate(-14 120 70)">
        <rect x="82" y="46" width="60" height="20" rx="10" fill="url(#pa-handle)" />
        <circle cx="82" cy="56" r="9" fill="url(#pa-steel)" stroke={METAL_EDGE} strokeWidth="1.4" />
        <rect x="142" y="51" width="34" height="10" rx="3" fill="url(#pa-steel)" />
      </g>
      {/* label */}
      <rect x="66" y="126" width="70" height="8" rx="4" fill="#8b95a1" opacity="0.6" />
      <rect x="66" y="142" width="46" height="7" rx="3.5" fill="#8b95a1" opacity="0.4" />
    </g>
  )
}

/** Single precision screwdriver, knurled handle with a swivel cap. */
function Driver() {
  return (
    <g transform="rotate(-32 120 120)">
      <rect x="60" y="108" width="76" height="26" rx="13" fill="url(#pa-handle)" />
      {/* knurling */}
      {Array.from({ length: 7 }, (_, i) => (
        <line
          key={i}
          x1={72 + i * 9}
          y1="112"
          x2={72 + i * 9}
          y2="130"
          stroke="#1c4d85"
          strokeWidth="1.6"
          opacity="0.7"
        />
      ))}
      <circle cx="60" cy="121" r="11" fill="url(#pa-steel)" stroke={METAL_EDGE} strokeWidth="1.5" />
      {/* shaft and tip */}
      <rect x="136" y="115" width="52" height="12" rx="3" fill="url(#pa-steel)" />
      <path d="M188 116 l14 5 -14 5 z" fill="#6b7480" />
    </g>
  )
}

/** Driver plus a tray of bits — the 24/64-bit sets. */
function BitSet() {
  return (
    <g>
      {/* bit tray */}
      <rect
        x="36"
        y="120"
        width="168"
        height="70"
        rx="10"
        fill={BODY}
        stroke={METAL_EDGE}
        strokeWidth="2"
      />
      {Array.from({ length: 2 }, (_, row) =>
        Array.from({ length: 9 }, (_, col) => (
          <g key={`${row}-${col}`}>
            <circle cx={50 + col * 18} cy={140 + row * 30} r="7" fill="#dfe4ea" stroke={METAL_EDGE} strokeWidth="1" />
            <circle cx={50 + col * 18} cy={140 + row * 30} r="3.2" fill={DARK} opacity="0.75" />
          </g>
        )),
      )}
      {/* driver lying above the tray */}
      <g transform="rotate(-8 120 80)">
        <rect x="62" y="66" width="80" height="24" rx="12" fill="url(#pa-handle)" />
        <circle cx="62" cy="78" r="10" fill="url(#pa-steel)" stroke={METAL_EDGE} strokeWidth="1.4" />
        <rect x="142" y="73" width="44" height="10" rx="3" fill="url(#pa-steel)" />
      </g>
    </g>
  )
}

/** Fanned opening picks. */
function Picks() {
  return (
    <g>
      {[-24, -8, 8, 24].map((deg, i) => (
        <g key={deg} transform={`rotate(${deg} 120 170)`}>
          <path
            d="M104 60 h32 a6 6 0 0 1 6 6 v92 a16 16 0 0 1 -22 15 a16 16 0 0 1 -22 -15 v-92 a6 6 0 0 1 6 -6 z"
            fill={i % 2 === 0 ? "#4f9ae0" : "#3c82cf"}
            stroke="#215691"
            strokeWidth="1.5"
            opacity="0.95"
          />
        </g>
      ))}
    </g>
  )
}

/** Metal spudger — flat blade one end, hooked pick the other. */
function Spudger() {
  return (
    <g transform="rotate(-38 120 120)">
      <rect x="46" y="112" width="148" height="16" rx="8" fill="url(#pa-steel)" stroke={METAL_EDGE} strokeWidth="1.4" />
      {/* grip knurl */}
      {Array.from({ length: 9 }, (_, i) => (
        <line key={i} x1={92 + i * 7} y1="114" x2={92 + i * 7} y2="126" stroke="#7c8592" strokeWidth="1.4" />
      ))}
      {/* flat blade */}
      <path d="M46 114 l-18 6 18 6 z" fill="#9aa4b1" />
      {/* hooked end */}
      <path d="M194 114 q22 6 12 22" fill="none" stroke="#9aa4b1" strokeWidth="7" strokeLinecap="round" />
    </g>
  )
}

/** Suction handle. */
function Suction() {
  return (
    <g>
      {/* cup */}
      <ellipse cx="120" cy="176" rx="62" ry="16" fill="#4f5b6b" />
      <path d="M58 176 q62 -34 124 0" fill="#3f4a5a" />
      {/* stem */}
      <rect x="113" y="96" width="14" height="52" rx="7" fill="url(#pa-steel)" />
      {/* handle bar */}
      <rect x="66" y="76" width="108" height="22" rx="11" fill="url(#pa-handle)" />
      <rect x="66" y="76" width="108" height="8" rx="4" fill="#ffffff" opacity="0.22" />
    </g>
  )
}

/** Heat pad with its USB-C lead. */
function HeatPad() {
  return (
    <g>
      <rect
        x="38"
        y="80"
        width="164"
        height="98"
        rx="12"
        fill="#3f4a5a"
        stroke="#2b3442"
        strokeWidth="2"
      />
      {/* heating element trace */}
      <path
        d="M58 106 h124 M58 128 h124 M58 150 h124"
        stroke="#e2704a"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.85"
      />
      {/* lead */}
      <path
        d="M202 129 q26 0 26 26 q0 22 -22 22"
        fill="none"
        stroke="#2b3442"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <rect x="176" y="168" width="22" height="12" rx="3" fill="#8b95a1" />
    </g>
  )
}

/** Pre-cut display adhesive on its backing sheet. */
function Adhesive() {
  return (
    <g>
      <rect
        x="62"
        y="34"
        width="116"
        height="172"
        rx="10"
        fill="#f6f2e8"
        stroke="#d9cfb8"
        strokeWidth="2"
      />
      {/* the cut frame itself */}
      <rect
        x="78"
        y="50"
        width="84"
        height="140"
        rx="12"
        fill="none"
        stroke={FLEX}
        strokeWidth="9"
      />
      <rect
        x="78"
        y="50"
        width="84"
        height="140"
        rx="12"
        fill="none"
        stroke={FLEX_EDGE}
        strokeWidth="1.2"
      />
      {/* peel corner */}
      <path d="M162 190 l16 16 -22 -2 z" fill="#e8e0cc" stroke="#d9cfb8" strokeWidth="1.2" />
    </g>
  )
}

/**
 * Sachet of isopropyl wipes. The serrated tear seam and the droplet do the
 * identifying work — an earlier attempt drew a wipe emerging from the slit and
 * it read as a leaf floating above a business card.
 */
function Wipes() {
  return (
    <g>
      {/* pack */}
      <rect
        x="66"
        y="58"
        width="108"
        height="134"
        rx="9"
        fill="#dfe7ef"
        stroke={METAL_EDGE}
        strokeWidth="2"
      />
      {/* crimped head with a serrated tear seam under it */}
      <path d="M66 66 a9 9 0 0 1 9 -8 h90 a9 9 0 0 1 9 8 v10 h-108 z" fill="#b9c5d2" />
      <path
        d="M69 80 l8 5 8 -5 8 5 8 -5 8 5 8 -5 8 5 8 -5 8 5 8 -5 8 5 8 -5"
        fill="none"
        stroke="#95a3b3"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      {/* resealable flap */}
      <ellipse cx="120" cy="114" rx="35" ry="15" fill="#eef3f8" stroke="#95a3b3" strokeWidth="1.7" />
      <path d="M92 112 q28 -11 56 0" fill="none" stroke="#95a3b3" strokeWidth="1.4" />

      {/* droplet — the clearest single cue that this is a wet wipe */}
      <path
        d="M120 140 q13 15 13 24 a13 13 0 0 1 -26 0 q0 -9 13 -24 z"
        fill="#2f6fb8"
        opacity="0.72"
      />

      {/* brand bar */}
      <rect x="86" y="178" width="68" height="7" rx="3.5" fill="#8b95a1" opacity="0.5" />
    </g>
  )
}

/** Anti-static wrist strap with its coiled lead and crocodile clip. */
function Esd() {
  return (
    <g>
      {/* band */}
      <path
        d="M64 96 a56 44 0 1 0 0 56"
        fill="none"
        stroke="#3f4a5a"
        strokeWidth="16"
        strokeLinecap="round"
      />
      {/* conductive plate */}
      <rect x="52" y="108" width="26" height="32" rx="6" fill="url(#pa-steel)" stroke={METAL_EDGE} strokeWidth="1.4" />
      {/* coiled lead */}
      <path
        d="M78 124 q12 -14 24 0 q12 14 24 0 q12 -14 24 0 q12 14 24 0"
        fill="none"
        stroke="#2b3442"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* crocodile clip */}
      <path d="M174 116 l24 8 -24 8 z" fill={CONTACT} stroke="#a9832f" strokeWidth="1.2" />
    </g>
  )
}

/** Braided USB-C cable, coiled. */
function Cable() {
  return (
    <g>
      <circle
        cx="120"
        cy="126"
        r="58"
        fill="none"
        stroke="#3f4a5a"
        strokeWidth="14"
        strokeDasharray="9 5"
      />
      <circle cx="120" cy="126" r="38" fill="none" stroke="#4f5b6b" strokeWidth="12" strokeDasharray="8 5" />
      {/* two connector heads */}
      <g>
        <rect x="98" y="42" width="26" height="30" rx="5" fill="url(#pa-steel)" stroke={METAL_EDGE} strokeWidth="1.4" />
        <rect x="104" y="48" width="14" height="7" rx="3.5" fill={DARK} />
      </g>
      <g>
        <rect x="150" y="182" width="26" height="30" rx="5" fill="url(#pa-steel)" stroke={METAL_EDGE} strokeWidth="1.4" />
        <rect x="156" y="198" width="14" height="7" rx="3.5" fill={DARK} />
      </g>
    </g>
  )
}

/** Dual-port car charger. */
function Charger() {
  return (
    <g>
      {/* barrel */}
      <rect x="70" y="58" width="100" height="124" rx="18" fill="#3f4a5a" stroke="#2b3442" strokeWidth="2" />
      <rect x="70" y="58" width="100" height="16" rx="8" fill="#4f5b6b" />
      {/* ports */}
      <rect x="90" y="92" width="28" height="13" rx="6.5" fill={DARK} />
      <rect x="126" y="92" width="28" height="13" rx="6.5" fill={DARK} />
      <rect x="96" y="126" width="48" height="9" rx="4.5" fill="#2f6fb8" opacity="0.8" />
      {/* contact spring at the base */}
      <rect x="110" y="182" width="20" height="14" rx="4" fill={CONTACT} />
      <rect x="86" y="176" width="12" height="6" rx="3" fill="#8b95a1" />
      <rect x="142" y="176" width="12" height="6" rx="3" fill="#8b95a1" />
    </g>
  )
}

/** Earbuds beside their case. */
function Earbuds() {
  return (
    <g>
      {/* case */}
      <rect x="34" y="104" width="86" height="72" rx="18" fill={BODY} stroke={METAL_EDGE} strokeWidth="2" />
      <line x1="34" y1="126" x2="120" y2="126" stroke={METAL_EDGE} strokeWidth="1.6" />
      <circle cx="77" cy="160" r="5" fill="#2f6fb8" opacity="0.7" />
      {/* two buds */}
      {[
        [150, 96],
        [190, 132],
      ].map(([bx, by]) => (
        <g key={`${bx}-${by}`}>
          <circle cx={bx} cy={by} r="20" fill="#f7f9fb" stroke={METAL_EDGE} strokeWidth="1.8" />
          <circle cx={bx} cy={by} r="9" fill="#d7e0e9" />
          <rect x={bx - 6} y={by + 14} width="12" height="34" rx="6" fill="#f7f9fb" stroke={METAL_EDGE} strokeWidth="1.8" />
        </g>
      ))}
    </g>
  )
}

/** MagSafe card wallet. */
function Wallet() {
  return (
    <g>
      {/* back plate */}
      <rect x="64" y="62" width="112" height="120" rx="14" fill="#3f4a5a" stroke="#2b3442" strokeWidth="2" />
      {/* magnet ring */}
      <circle cx="120" cy="122" r="30" fill="none" stroke="#5c6878" strokeWidth="8" />
      {/* cards fanned out of the pocket */}
      <rect x="80" y="52" width="96" height="60" rx="8" fill="#dfe6ee" stroke={METAL_EDGE} strokeWidth="1.6" transform="rotate(-6 128 82)" />
      <rect x="88" y="44" width="96" height="60" rx="8" fill="#f2f6fa" stroke={METAL_EDGE} strokeWidth="1.6" transform="rotate(4 136 74)" />
      <rect x="100" y="58" width="34" height="7" rx="3.5" fill="#8b95a1" opacity="0.7" transform="rotate(4 136 74)" />
    </g>
  )
}
