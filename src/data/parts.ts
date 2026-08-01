import type { BadgeKey, Product, Spec, Stock } from "./catalogue"
import type { IconName } from "../components/ui/Icon"
import {
  devices,
  partKindLabels,
  type Device,
  type PartKind,
} from "./devices"

/**
 * The parts catalogue is derived from the device roster rather than typed out.
 *
 * A shop's parts list is the cross product of "devices we service" and "things
 * that break on them", so writing it by hand guarantees the two drift apart —
 * add a device and its parts appear here automatically, priced consistently.
 */

/** Trade price before tier and age adjustment, in pounds. */
const basePrice: Record<PartKind, number> = {
  screen: 0, // set from panel type below
  battery: 20,
  charging: 14,
  "rear-camera": 30,
  "front-camera": 15,
  "back-glass": 20,
  speaker: 10,
}

const tierMultiplier = { 1: 0.75, 2: 1, 3: 1.5 } as const

/** Bench labour added on top of the part when we fit it. */
const labour: Record<PartKind, number> = {
  screen: 35,
  battery: 20,
  charging: 25,
  "rear-camera": 25,
  "front-camera": 25,
  "back-glass": 30,
  speaker: 20,
}

const subcategoryFor: Record<PartKind, string> = {
  screen: "screens",
  battery: "batteries",
  charging: "charging",
  "rear-camera": "cameras",
  "front-camera": "cameras",
  "back-glass": "housings",
  speaker: "audio",
}

const glyphFor: Record<PartKind, IconName> = {
  screen: "screen",
  battery: "battery",
  charging: "port",
  "rear-camera": "camera",
  "front-camera": "camera",
  "back-glass": "glass",
  speaker: "speaker",
}

/**
 * Deterministic 0–1 from a string. Ratings and review counts have to be stable
 * across renders and reloads, so this stands in for the random numbers a real
 * dataset would have.
 */
function hash01(input: string, salt = ""): number {
  let h = 2166136261
  const s = input + salt
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return ((h >>> 0) % 100000) / 100000
}

/** Retail prices end in .99 — round to that rather than to whole pounds. */
function retail(pounds: number): number {
  return Math.max(4.99, Math.round(pounds) - 0.01)
}

export function partPrice(device: Device, kind: PartKind): number {
  const base = kind === "screen" ? (device.panel === "oled" ? 62 : 26) : basePrice[kind]
  const age = 1 + (device.year - 2019) * 0.13
  return retail(base * tierMultiplier[device.tier] * age)
}

/** Fitted price: the part plus bench labour, rounded to a retail-looking figure. */
export function repairPrice(device: Device, kind: PartKind): number {
  const total = partPrice(device, kind) + labour[kind]
  return Math.round(total / 5) * 5 - 1
}

export function partId(device: Device, kind: PartKind): string {
  return `${device.slug}-${kind}`
}

/** Service-pack parts carry the manufacturer's name; aftermarket carry ours. */
function supplierFor(device: Device): string {
  return device.tier === 3 ? device.brand : "AA Mobile"
}

const panelCopy = {
  oled: "Soft OLED panel, colour and brightness matched to the original.",
  lcd: "Incell LCD assembly — noticeably cheaper than OLED and the right call on a phone this age.",
}

const kindCopy: Record<PartKind, (d: Device) => string> = {
  screen: (d) =>
    `${panelCopy[d.panel]} Supplied as a full assembly with the frame and brackets already fitted, so there are no fiddly small parts to transfer across.`,
  battery: () =>
    "Fresh cell with the pull-tab adhesive strips in the box. Health reporting stays intact after fitting.",
  charging: (d) =>
    `Complete charge port flex${d.year >= 2023 && d.brand === "Apple" ? " (USB-C)" : ""}, with the microphone and antenna contacts on the same assembly. Nine times out of ten a phone that will not charge needs this rather than board work.`,
  "rear-camera": () =>
    "Rear camera module — fixes the rattling-and-blurry combination caused by a failed stabiliser.",
  "front-camera": () =>
    "Front camera on its sensor flex. Face unlock hardware is not included and cannot be transferred between boards.",
  "back-glass": () =>
    "Rear glass panel with the lens covers and pre-cut adhesive fitted.",
  speaker: () =>
    "Loudspeaker module with a fresh dust mesh, so it is not muffled from day one.",
}

const shortBlurb: Record<PartKind, (d: Device) => string> = {
  screen: (d) =>
    d.panel === "oled" ? "Full OLED assembly, frame fitted." : "Incell LCD assembly, frame fitted.",
  battery: () => "New cell with adhesive strips included.",
  charging: () => "Complete port flex — the usual cause of a phone that will not charge.",
  "rear-camera": () => "Rear module — fixes blurry, rattling photos.",
  "front-camera": () => "Front camera and sensor flex.",
  "back-glass": () => "Rear panel with lens covers and adhesive.",
  speaker: () => "Loudspeaker with a fresh dust mesh.",
}

/** A handful of parts we genuinely shift most of, promoted to the home rail. */
const bestsellerRanks: Record<string, number> = {
  "iphone-13-screen": 3,
  "iphone-13-battery": 7,
  "iphone-11-battery": 12,
  "iphone-12-screen": 13,
  "samsung-galaxy-s23-screen": 14,
}

function stockFor(id: string): Stock {
  const roll = hash01(id, "stock")
  if (roll > 0.94) return "out"
  if (roll > 0.82) return "low"
  return "in"
}

function makePart(device: Device, kind: PartKind): Product {
  const id = partId(device, kind)
  const price = partPrice(device, kind)
  const label = partKindLabels[kind]
  const rating = Math.round((4.1 + hash01(id, "r") * 0.8) * 10) / 10
  const reviews = 11 + Math.floor(hash01(id, "n") * 360)
  const stock = stockFor(id)

  // Older stock gets discounted rather than sitting at full price. Kept rare on
  // purpose: a catalogue where most things are "reduced" reads as fake.
  const onSale = device.year <= 2020 && hash01(id, "sale") > 0.85
  const compareAt = onSale ? retail(price * 1.22) : undefined

  const specs: Spec[] = [
    { label: "Fits", value: device.name },
    { label: "Part", value: label },
    ...(kind === "screen"
      ? [{ label: "Panel", value: device.panel === "oled" ? "Soft OLED" : "Incell LCD" }]
      : []),
    {
      label: "Supply",
      value: device.tier === 3 ? "Service pack" : "Aftermarket, tested",
    },
    { label: "Tested", value: "Function-tested before dispatch" },
    { label: "Guarantee", value: "12 months" },
  ]

  const badges: BadgeKey[] = []
  if (bestsellerRanks[id] !== undefined) badges.push("bestseller")
  if (device.year >= 2024) badges.push("newIn")

  return {
    id,
    name: `${device.name} ${label}`,
    category: "parts",
    subcategory: subcategoryFor[kind],
    brand: supplierFor(device),
    price,
    compareAt,
    rating,
    reviews,
    stock,
    compatibility: [device.name],
    glyph: glyphFor[kind],
    blurb: shortBlurb[kind](device),
    fittingAvailable: true,
    badges: badges.length > 0 ? badges : undefined,
    bestseller: bestsellerRanks[id],
    description: [
      kindCopy[kind](device),
      `Every part is powered on and function-tested on our bench before it is packed, so you are not diagnosing a dead component on top of the original fault.`,
      device.notes ??
        "Covered by our 12-month guarantee. If it fails in normal use we replace it — no diagnostic fee, no argument.",
    ],
    specs,
  }
}

export const generatedParts: Product[] = devices.flatMap((device) =>
  device.parts.map((kind) => makePart(device, kind)),
)

/** Parts that fit a given device, in a sensible repair order. */
const order: PartKind[] = [
  "screen",
  "battery",
  "charging",
  "rear-camera",
  "front-camera",
  "back-glass",
  "speaker",
]

export function partsForDevice(device: Device): Product[] {
  const byId = new Map(generatedParts.map((p) => [p.id, p]))
  return device.parts
    .slice()
    .sort((a, b) => order.indexOf(a) - order.indexOf(b))
    .map((kind) => byId.get(partId(device, kind)))
    .filter((p): p is Product => Boolean(p))
}

/** Every device this part fits, for cross-linking from a product page. */
export function devicesForPart(product: Product): Device[] {
  if (!product.compatibility) return []
  return devices.filter((d) => product.compatibility!.includes(d.name))
}
