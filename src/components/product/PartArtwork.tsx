import type { PartKind } from "../../data/devices"
import {
  ArtworkSvg,
  BODY,
  CONTACT,
  Connector,
  DARK,
  Flex,
  METAL,
  METAL_EDGE,
  FLEX,
} from "./artworkShared"

/**
 * Technical illustrations for repair parts.
 *
 * We have no photography for the 400-odd generated parts, and a UI icon scaled
 * up reads as a missing image. These are drawn to look like the component in
 * the hand instead — a display bonded to a frame with its flex tail, a cell with
 * pull tabs, a port on a ribbon — so a listing of parts looks like stock rather
 * than placeholders.
 *
 * `seed` (0–1, derived from the product id) picks between variants so a grid of
 * screens is not twelve identical drawings.
 */

type Props = {
  kind: PartKind
  seed?: number
  className?: string
}

export default function PartArtwork({ kind, seed = 0, className }: Props) {
  return (
    <ArtworkSvg className={className}>
      {kind === "screen" ? <Screen seed={seed} /> : null}
      {kind === "battery" ? <Battery seed={seed} /> : null}
      {kind === "charging" ? <ChargePort seed={seed} /> : null}
      {kind === "rear-camera" ? <RearCamera seed={seed} /> : null}
      {kind === "front-camera" ? <FrontCamera /> : null}
      {kind === "back-glass" ? <BackGlass seed={seed} /> : null}
      {kind === "speaker" ? <Speaker /> : null}
    </ArtworkSvg>
  )
}

function Screen({ seed }: { seed: number }) {
  const punchHole = seed > 0.5
  return (
    <g>
      {/* frame */}
      <rect
        x="72"
        y="20"
        width="96"
        height="168"
        rx="15"
        fill={BODY}
        stroke={METAL_EDGE}
        strokeWidth="2"
      />
      {/* glass */}
      <rect x="78" y="26" width="84" height="150" rx="11" fill="url(#pa-glass)" />
      <rect x="78" y="26" width="84" height="150" rx="11" fill="url(#pa-sheen)" />

      {punchHole ? (
        <circle cx="120" cy="38" r="4" fill="#05080d" />
      ) : (
        <rect x="103" y="26" width="34" height="11" rx="5.5" fill="#05080d" />
      )}

      {/* earpiece mesh */}
      <rect x="108" y="168" width="24" height="3" rx="1.5" fill="#111a26" />

      {/* flex tail out of the bottom, tucking right */}
      <Flex x="112" y="186" w="16" h="26" vertical />
      <Connector x="104" y="208" />
    </g>
  )
}

function Battery({ seed }: { seed: number }) {
  const tabs = seed > 0.5 ? 2 : 1
  return (
    <g>
      {/* cell */}
      <rect
        x="60"
        y="42"
        width="120"
        height="136"
        rx="9"
        fill="url(#pa-metal)"
        stroke={METAL_EDGE}
        strokeWidth="2"
      />
      {/* foil seam */}
      <line x1="60" y1="60" x2="180" y2="60" stroke={METAL_EDGE} strokeWidth="1.2" opacity="0.7" />
      {/* printed label block */}
      <rect x="76" y="76" width="60" height="8" rx="4" fill={METAL_EDGE} opacity="0.45" />
      <rect x="76" y="90" width="42" height="6" rx="3" fill={METAL_EDGE} opacity="0.3" />

      {/* Adhesive pull tabs: laid along the face of the cell with only the
          grab tab protruding, rather than hanging off the bottom edge. */}
      {Array.from({ length: tabs }, (_, i) => (
        <g key={i}>
          <rect
            x={80 + i * 48}
            y="132"
            width="36"
            height="42"
            rx="3"
            fill="#39414f"
            opacity="0.72"
          />
          {/* folded lip where you grip it */}
          <rect
            x={80 + i * 48}
            y="132"
            width="36"
            height="7"
            rx="3"
            fill="#5b6472"
            opacity="0.85"
          />
        </g>
      ))}

      {/* flex up and over to a connector */}
      <Flex x="150" y="18" w="16" h="26" vertical />
      <Connector x="141" y="12" w="34" h="13" />
    </g>
  )
}

function ChargePort({ seed }: { seed: number }) {
  const usbC = seed > 0.4
  return (
    <g>
      {/* ribbon running across */}
      <Flex x="46" y="106" w="148" h="28" />

      {/* port housing at the left */}
      <rect
        x="34"
        y="94"
        width="42"
        height="52"
        rx="7"
        fill={METAL}
        stroke={METAL_EDGE}
        strokeWidth="2"
      />
      {usbC ? (
        <rect x="43" y="112" width="24" height="12" rx="6" fill={DARK} />
      ) : (
        <rect x="44" y="113" width="22" height="9" rx="4.5" fill={DARK} />
      )}

      {/* microphone can and a solder pad midway */}
      <circle cx="118" cy="120" r="9" fill={METAL} stroke={METAL_EDGE} strokeWidth="1.5" />
      <circle cx="118" cy="120" r="3.5" fill={DARK} opacity="0.7" />

      {/* board connector at the right */}
      <rect x="182" y="98" width="30" height="44" rx="4" fill="#3d4a5c" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x="186" y={104 + i * 10} width="22" height="4" rx="2" fill={CONTACT} />
      ))}
    </g>
  )
}

function RearCamera({ seed }: { seed: number }) {
  const lenses = seed > 0.55 ? 3 : 2

  /**
   * Lens placement matters more than it sounds: two same-height circles with a
   * centred tail below reads unmistakably as a face. Stacking them down the left
   * and taking the flex out of the right-hand edge avoids that.
   */
  const centres: Array<[number, number]> =
    lenses === 3
      ? [
          [92, 74],
          [92, 122],
          [136, 98],
        ]
      : [
          [92, 84],
          [92, 132],
        ]

  return (
    <g>
      {/* module body */}
      <rect
        x="52"
        y="44"
        width="120"
        height="124"
        rx="16"
        fill={BODY}
        stroke={METAL_EDGE}
        strokeWidth="2"
      />

      {centres.map(([cx2, cy2], i) => (
        <g key={i}>
          <circle cx={cx2} cy={cy2} r="20" fill={METAL} stroke={METAL_EDGE} strokeWidth="1.5" />
          <circle cx={cx2} cy={cy2} r="13" fill="url(#pa-glass)" />
          {/* crescent reflection, not a pupil */}
          <path
            d={`M ${cx2 - 9} ${cy2 - 3} a 11 11 0 0 1 7 -7`}
            fill="none"
            stroke="#cfe0ff"
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity="0.45"
          />
        </g>
      ))}

      {/* flash and a laser-focus window, which also break the symmetry */}
      {lenses === 2 ? (
        <>
          <circle cx="140" cy="86" r="8" fill="#f4e3b8" stroke={METAL_EDGE} strokeWidth="1.4" />
          <rect x="132" y="118" width="16" height="16" rx="4" fill={DARK} opacity="0.6" />
        </>
      ) : (
        <circle cx="136" cy="146" r="7" fill="#f4e3b8" stroke={METAL_EDGE} strokeWidth="1.4" />
      )}

      {/* flex leaves the right-hand edge */}
      <Flex x="170" y="96" w="30" h="20" />
      <Connector x="196" y="94" w="26" h="24" />
    </g>
  )
}

function FrontCamera() {
  return (
    <g>
      <Flex x="52" y="112" w="136" h="20" />
      {/* lens barrel */}
      <circle cx="76" cy="122" r="20" fill={METAL} stroke={METAL_EDGE} strokeWidth="1.8" />
      <circle cx="76" cy="122" r="12" fill="url(#pa-glass)" />
      <circle cx="72" cy="118" r="3.5" fill="#8fb6ff" opacity="0.6" />
      {/* proximity sensor cluster */}
      <rect x="112" y="106" width="26" height="32" rx="4" fill={METAL} stroke={METAL_EDGE} strokeWidth="1.5" />
      <circle cx="125" cy="122" r="5" fill={DARK} opacity="0.75" />
      <Connector x="172" y="112" w="30" h="20" />
    </g>
  )
}

function BackGlass({ seed }: { seed: number }) {
  const lenses = seed > 0.5 ? 3 : 2
  return (
    <g>
      {/* panel */}
      <rect
        x="70"
        y="24"
        width="100"
        height="192"
        rx="16"
        fill="url(#pa-metal)"
        stroke={METAL_EDGE}
        strokeWidth="2"
      />
      <rect x="70" y="24" width="100" height="192" rx="16" fill="url(#pa-sheen)" />

      {/* camera bump cut-out */}
      <rect
        x="84"
        y="38"
        width="56"
        height="56"
        rx="14"
        fill={BODY}
        stroke={METAL_EDGE}
        strokeWidth="1.5"
      />
      {(lenses === 3
        ? ([
            [100, 54],
            [124, 54],
            [112, 78],
          ] as Array<[number, number]>)
        : ([
            [102, 58],
            [122, 76],
          ] as Array<[number, number]>)
      ).map(([cx2, cy2], i) => (
        <circle key={i} cx={cx2} cy={cy2} r="9" fill={DARK} opacity="0.85" />
      ))}

      {/* adhesive perimeter, pre-cut */}
      <rect
        x="78"
        y="32"
        width="84"
        height="176"
        rx="12"
        fill="none"
        stroke={FLEX}
        strokeWidth="2"
        strokeDasharray="7 6"
        opacity="0.7"
      />
    </g>
  )
}

function Speaker() {
  return (
    <g>
      <rect
        x="56"
        y="80"
        width="128"
        height="80"
        rx="10"
        fill={BODY}
        stroke={METAL_EDGE}
        strokeWidth="2"
      />
      {/* grille mesh */}
      <g fill={METAL_EDGE} opacity="0.55">
        {Array.from({ length: 5 }, (_, row) =>
          Array.from({ length: 9 }, (_, col) => (
            <circle key={`${row}-${col}`} cx={74 + col * 12} cy={96 + row * 12} r="2.6" />
          )),
        )}
      </g>
      {/* contacts */}
      <rect x="60" y="150" width="20" height="6" rx="3" fill={CONTACT} />
      <rect x="160" y="150" width="20" height="6" rx="3" fill={CONTACT} />
    </g>
  )
}
