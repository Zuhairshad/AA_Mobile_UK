/**
 * Which drawing each tool or accessory uses.
 *
 * Kept in its own module (no component export) so the artwork component file
 * stays fast-refresh friendly, and so the mapping is easy to scan on its own.
 * Mapped explicitly by product id rather than inferred: a wrong drawing on a
 * named tool is more obviously wrong than on a generic part.
 */
export type ToolArtworkKind =
  | "toolkit"
  | "fixkit"
  | "driver"
  | "bit"
  | "pick"
  | "spudger"
  | "suction"
  | "heatpad"
  | "adhesive"
  | "wipes"
  | "esd"
  | "cable"
  | "charger"
  | "earbuds"
  | "wallet"

/** Anything unmapped falls back to the plain glyph. */
export const toolArtworkFor: Record<string, ToolArtworkKind> = {
  "bench-pro-toolkit": "toolkit",
  "essential-repair-toolkit": "toolkit",
  "screen-fix-kit": "fixkit",
  "battery-fix-kit": "fixkit",
  "precision-driver-64": "bit",
  "precision-driver-24": "bit",
  "pentalobe-driver": "driver",
  "opening-pick-set": "pick",
  "suction-handle": "suction",
  "metal-spudger": "spudger",
  "heat-pad": "heatpad",
  "adhesive-strips": "adhesive",
  "isopropyl-wipes": "wipes",
  "esd-wrist-strap": "esd",
  "braided-usbc-cable": "cable",
  "car-charger-30w": "charger",
  "earbuds-lite": "earbuds",
  "magsafe-wallet": "wallet",
}
