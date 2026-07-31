import type { ReactNode } from "react"
import { cx } from "../../lib/cx"

/**
 * Shared pieces for the drawn product illustrations.
 *
 * The gradients live here rather than in each artwork file because SVG ids are
 * document-global: two inline SVGs defining `pa-glass` on the same page would
 * collide, and the first one rendered would silently win for both.
 */

export const FLEX = "#d9a15b" // polyimide ribbon
export const FLEX_EDGE = "#a97534"
export const METAL = "#cbd2da"
export const METAL_EDGE = "#8b95a1"
export const BODY = "#eef1f4"
export const CONTACT = "#d8b055"
export const DARK = "#1e2939"
export const STEEL = "#aab3bf"
export const HANDLE = "#2f6fb8"

/** SVG attributes accept either, and the call sites read better as strings. */
export type Coord = number | string

export function ArtworkDefs() {
  return (
    <defs>
      <linearGradient id="pa-glass" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#243044" />
        <stop offset="55%" stopColor="#16202f" />
        <stop offset="100%" stopColor="#2b3a52" />
      </linearGradient>
      <linearGradient id="pa-metal" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#f6f8fa" />
        <stop offset="45%" stopColor="#dbe1e8" />
        <stop offset="100%" stopColor="#c3cbd5" />
      </linearGradient>
      <linearGradient id="pa-sheen" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
        <stop offset="60%" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="pa-steel" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#e3e8ee" />
        <stop offset="50%" stopColor="#b6bfcb" />
        <stop offset="100%" stopColor="#8f99a6" />
      </linearGradient>
      <linearGradient id="pa-handle" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#3c82cf" />
        <stop offset="50%" stopColor="#2f6fb8" />
        <stop offset="100%" stopColor="#215691" />
      </linearGradient>
    </defs>
  )
}

/**
 * Paint-server host. Mounted once near the root so the gradient ids exist
 * exactly once in the document — every artwork SVG referencing its own copy
 * meant a listing page carried twelve duplicates of each id, which is invalid
 * HTML and relies on the browser picking the first definition.
 *
 * Must not be display:none, or the gradients stop resolving; a zero-sized
 * absolutely positioned SVG is the standard way to keep them live.
 */
export function ArtworkPaintServers() {
  return (
    <svg
      width="0"
      height="0"
      aria-hidden="true"
      focusable="false"
      style={{ position: "absolute" }}
    >
      <ArtworkDefs />
    </svg>
  )
}

/** Square canvas every illustration is drawn on. */
export function ArtworkSvg({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <svg
      viewBox="0 0 240 240"
      className={cx("h-full w-full", className)}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  )
}

/** Ribbon cable. */
export function Flex({
  x,
  y,
  w,
  h,
  vertical = false,
}: {
  x: Coord
  y: Coord
  w: Coord
  h: Coord
  vertical?: boolean
}) {
  const [nx, ny, nw, nh] = [x, y, w, h].map(Number)
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={3}
        fill={FLEX}
        stroke={FLEX_EDGE}
        strokeWidth="1.5"
      />
      {[0.3, 0.5, 0.7].map((f) =>
        vertical ? (
          <line
            key={f}
            x1={nx + nw * f}
            y1={ny + 4}
            x2={nx + nw * f}
            y2={ny + nh - 4}
            stroke={FLEX_EDGE}
            strokeWidth="1"
            opacity="0.6"
          />
        ) : (
          <line
            key={f}
            x1={nx + 4}
            y1={ny + nh * f}
            x2={nx + nw - 4}
            y2={ny + nh * f}
            stroke={FLEX_EDGE}
            strokeWidth="1"
            opacity="0.6"
          />
        ),
      )}
    </g>
  )
}

/** Board connector with gold contacts. */
export function Connector({
  x,
  y,
  w = 34,
  h = 15,
}: {
  x: Coord
  y: Coord
  w?: Coord
  h?: Coord
}) {
  const [nx, ny, nw, nh] = [x, y, w, h].map(Number)
  const pins = 5
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={3} fill="#3d4a5c" />
      {Array.from({ length: pins }, (_, i) => (
        <rect
          key={i}
          x={nx + 4 + i * ((nw - 8) / pins)}
          y={ny + nh - 4}
          width={(nw - 8) / pins - 2}
          height={3}
          fill={CONTACT}
        />
      ))}
    </g>
  )
}
