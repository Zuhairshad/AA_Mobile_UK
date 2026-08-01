/**
 * Device roster — the models we stock parts for and repair in store.
 *
 * Model names and release years are taken from the public iFixit device
 * taxonomy (https://www.ifixit.com/api/2.0/categories), filtered down to the
 * ranges a UK high-street shop realistically sees. Names are facts; all
 * descriptive copy here is our own.
 *
 * `tier` and `panel` drive the generated part prices in parts.ts, so a device
 * added here immediately gains parts, a device page and repair pricing.
 */

export type DeviceKind = "phone" | "tablet"
export type Panel = "oled" | "lcd"

/** 3 = flagship, 2 = upper mid, 1 = budget. Scales part and repair pricing. */
export type Tier = 1 | 2 | 3

export type PartKind =
  | "screen"
  | "battery"
  | "charging"
  | "rear-camera"
  | "front-camera"
  | "back-glass"
  | "speaker"

export type Device = {
  slug: string
  name: string
  brand: string
  /** Groups models on the device index, e.g. "iPhone 13 series". */
  family: string
  kind: DeviceKind
  year: number
  panel: Panel
  tier: Tier
  parts: PartKind[]
  /** What actually comes through the door for this model. */
  commonFaults: string[]
  notes?: string
}

const PHONE_PARTS: PartKind[] = ["screen", "battery", "charging", "rear-camera", "speaker"]
const FLAGSHIP_PARTS: PartKind[] = [...PHONE_PARTS, "front-camera", "back-glass"]
const TABLET_PARTS: PartKind[] = ["screen", "battery", "charging"]

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[()"']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

type Seed = Omit<Device, "slug"> & { slug?: string }

function device(seed: Seed): Device {
  return { ...seed, slug: seed.slug ?? slugify(seed.name) }
}

/* -------------------------------------------------------------------------- */
/* Apple                                                                       */
/* -------------------------------------------------------------------------- */

const iphoneFaults = {
  modern: [
    "Cracked front glass after a drop",
    "Battery health below 80%",
    "Will not charge, or charges only at an angle",
  ],
  older: [
    "Battery draining by mid-afternoon",
    "Cracked screen with touch dead in places",
    "Charging port full of pocket lint",
  ],
}

const apple: Device[] = [
  { name: "iPhone 11", year: 2019, panel: "lcd", tier: 2 },
  { name: "iPhone 11 Pro", year: 2019, panel: "oled", tier: 3 },
  { name: "iPhone 11 Pro Max", year: 2019, panel: "oled", tier: 3 },
  { name: "iPhone SE 2020", year: 2020, panel: "lcd", tier: 1 },
  { name: "iPhone 12", year: 2020, panel: "oled", tier: 2 },
  { name: "iPhone 12 mini", year: 2020, panel: "oled", tier: 2 },
  { name: "iPhone 12 Pro", year: 2020, panel: "oled", tier: 3 },
  { name: "iPhone 12 Pro Max", year: 2020, panel: "oled", tier: 3 },
  { name: "iPhone 13", year: 2021, panel: "oled", tier: 2 },
  { name: "iPhone 13 mini", year: 2021, panel: "oled", tier: 2 },
  { name: "iPhone 13 Pro", year: 2021, panel: "oled", tier: 3 },
  { name: "iPhone 13 Pro Max", year: 2021, panel: "oled", tier: 3 },
  { name: "iPhone SE 2022", year: 2022, panel: "lcd", tier: 1 },
  { name: "iPhone 14", year: 2022, panel: "oled", tier: 2 },
  { name: "iPhone 14 Plus", year: 2022, panel: "oled", tier: 2 },
  { name: "iPhone 14 Pro", year: 2022, panel: "oled", tier: 3 },
  { name: "iPhone 14 Pro Max", year: 2022, panel: "oled", tier: 3 },
  { name: "iPhone 15", year: 2023, panel: "oled", tier: 2 },
  { name: "iPhone 15 Plus", year: 2023, panel: "oled", tier: 2 },
  { name: "iPhone 15 Pro", year: 2023, panel: "oled", tier: 3 },
  { name: "iPhone 15 Pro Max", year: 2023, panel: "oled", tier: 3 },
  { name: "iPhone 16", year: 2024, panel: "oled", tier: 2 },
  { name: "iPhone 16 Plus", year: 2024, panel: "oled", tier: 2 },
  { name: "iPhone 16 Pro", year: 2024, panel: "oled", tier: 3 },
  { name: "iPhone 16 Pro Max", year: 2024, panel: "oled", tier: 3 },
].map((m) =>
  device({
    ...m,
    brand: "Apple",
    family: `iPhone ${m.name.replace(/^iPhone (SE )?/, "").split(" ")[0]}`.trim(),
    kind: "phone",
    panel: m.panel as Panel,
    tier: m.tier as Tier,
    parts: m.tier === 3 ? FLAGSHIP_PARTS : PHONE_PARTS,
    commonFaults: m.year >= 2022 ? iphoneFaults.modern : iphoneFaults.older,
    notes:
      m.year >= 2023
        ? "USB-C from the iPhone 15 onward — the charge port flex is a different part from Lightning models."
        : undefined,
  }),
)

const ipads: Device[] = [
  { name: "iPad 9", year: 2021, tier: 1 as Tier },
  { name: "iPad 10", year: 2022, tier: 1 as Tier },
  { name: "iPad Air 5", year: 2022, tier: 2 as Tier },
  { name: "iPad Mini 6", year: 2021, tier: 2 as Tier },
  { name: 'iPad Pro 11" 4th Gen', year: 2022, tier: 3 as Tier },
].map((m) =>
  device({
    ...m,
    brand: "Apple",
    family: "iPad",
    kind: "tablet",
    panel: "lcd",
    parts: TABLET_PARTS,
    commonFaults: [
      "Cracked glass with the display underneath still working",
      "Battery no longer holding a full day",
      "Charge port worn loose",
    ],
    notes:
      "On most iPads the glass and digitiser break while the LCD survives, so the cheaper glass-only repair is usually the right one.",
  }),
)

/* -------------------------------------------------------------------------- */
/* Samsung                                                                     */
/* -------------------------------------------------------------------------- */

const samsungFaults = [
  "Cracked screen — the panel is bonded to the frame, so it is a full assembly swap",
  "Battery health dropping after two or three years",
  "USB-C port loose or not charging",
]

const samsung: Device[] = [
  { name: "Samsung Galaxy S21", year: 2021, tier: 3 as Tier },
  { name: "Samsung Galaxy S21 Plus", year: 2021, tier: 3 as Tier },
  { name: "Samsung Galaxy S21 Ultra", year: 2021, tier: 3 as Tier },
  { name: "Samsung Galaxy S22", year: 2022, tier: 3 as Tier },
  { name: "Samsung Galaxy S22 Plus", year: 2022, tier: 3 as Tier },
  { name: "Samsung Galaxy S22 Ultra", year: 2022, tier: 3 as Tier },
  { name: "Samsung Galaxy S23", year: 2023, tier: 3 as Tier },
  { name: "Samsung Galaxy S23 Plus", year: 2023, tier: 3 as Tier },
  { name: "Samsung Galaxy S23 Ultra", year: 2023, tier: 3 as Tier },
  { name: "Samsung Galaxy S24", year: 2024, tier: 3 as Tier },
  { name: "Samsung Galaxy S24 Plus", year: 2024, tier: 3 as Tier },
  { name: "Samsung Galaxy S24 Ultra", year: 2024, tier: 3 as Tier },
  { name: "Samsung Galaxy A52", year: 2021, tier: 1 as Tier },
  { name: "Samsung Galaxy A54", year: 2023, tier: 2 as Tier },
  { name: "Samsung Galaxy A55", year: 2024, tier: 2 as Tier },
].map((m) =>
  device({
    ...m,
    brand: "Samsung",
    family: m.name.includes(" A") ? "Galaxy A series" : `Galaxy ${m.name.split(" ")[2]}`,
    kind: "phone",
    panel: "oled",
    parts: m.tier === 3 ? FLAGSHIP_PARTS : PHONE_PARTS,
    commonFaults: samsungFaults,
  }),
)

const folds: Device[] = [
  { name: "Samsung Galaxy Z Flip 4", year: 2022 },
  { name: "Samsung Galaxy Z Flip 5", year: 2023 },
  { name: "Samsung Galaxy Z Fold3", year: 2021 },
  { name: "Samsung Galaxy Z Fold 6", year: 2024 },
].map((m) =>
  device({
    ...m,
    brand: "Samsung",
    family: "Galaxy Z fold and flip",
    kind: "phone",
    panel: "oled",
    tier: 3,
    parts: ["screen", "battery", "charging", "rear-camera"],
    commonFaults: [
      "Crease line failing across the inner display",
      "Hinge stiff or gritty",
      "Outer cover display cracked",
    ],
    notes:
      "Folding displays are a specialist job and we do not sell the inner panel for home fitting — bring it in and we will quote before starting.",
  }),
)

const galaxyTabs: Device[] = [
  { name: "Samsung Galaxy Tab S9", year: 2023, tier: 3 as Tier },
  { name: "Samsung Galaxy Tab A8", year: 2022, tier: 1 as Tier },
].map((m) =>
  device({
    ...m,
    brand: "Samsung",
    family: "Galaxy Tab",
    kind: "tablet",
    panel: "oled",
    parts: TABLET_PARTS,
    commonFaults: [
      "Cracked glass across a corner",
      "Battery down to a few hours",
      "Charge port worn",
    ],
  }),
)

/* -------------------------------------------------------------------------- */
/* Google, OnePlus, Xiaomi, Nothing, Motorola                                  */
/* -------------------------------------------------------------------------- */

const pixels: Device[] = [
  { name: "Google Pixel 6", year: 2021, tier: 2 as Tier },
  { name: "Google Pixel 6 Pro", year: 2021, tier: 3 as Tier },
  { name: "Google Pixel 6a", year: 2022, tier: 1 as Tier },
  { name: "Google Pixel 7", year: 2022, tier: 2 as Tier },
  { name: "Google Pixel 7 Pro", year: 2022, tier: 3 as Tier },
  { name: "Google Pixel 7a", year: 2023, tier: 1 as Tier },
  { name: "Google Pixel 8", year: 2023, tier: 2 as Tier },
  { name: "Google Pixel 8 Pro", year: 2023, tier: 3 as Tier },
  { name: "Google Pixel 8a", year: 2024, tier: 1 as Tier },
].map((m) =>
  device({
    ...m,
    brand: "Google",
    family: `Pixel ${m.name.replace("Google Pixel ", "").charAt(0)}`,
    kind: "phone",
    panel: "oled",
    parts: m.tier === 3 ? FLAGSHIP_PARTS : PHONE_PARTS,
    commonFaults: [
      "Cracked display",
      "Battery drain after a Tensor software update — usually still the cell",
      "Under-display fingerprint reader failing after a screen swap",
    ],
    notes:
      "The fingerprint reader is bonded to the display, so a replacement panel has to be the matched assembly or Face and touch unlock will not re-enrol.",
  }),
)

const others: Device[] = [
  device({
    name: "OnePlus 10 Pro 5G",
    brand: "OnePlus",
    family: "OnePlus",
    kind: "phone",
    year: 2022,
    panel: "oled",
    tier: 3,
    parts: PHONE_PARTS,
    commonFaults: ["Cracked curved display", "Charging slower than it was", "Loose alert slider"],
  }),
  device({
    name: "OnePlus 11",
    brand: "OnePlus",
    family: "OnePlus",
    kind: "phone",
    year: 2023,
    panel: "oled",
    tier: 3,
    parts: PHONE_PARTS,
    commonFaults: ["Cracked curved display", "Battery health after fast-charge cycling"],
  }),
  device({
    name: "OnePlus 12",
    brand: "OnePlus",
    family: "OnePlus",
    kind: "phone",
    year: 2024,
    panel: "oled",
    tier: 3,
    parts: PHONE_PARTS,
    commonFaults: ["Cracked display", "Charge port wear from 100W charging"],
  }),
  device({
    name: "OnePlus Nord 3",
    brand: "OnePlus",
    family: "OnePlus Nord",
    kind: "phone",
    year: 2023,
    panel: "oled",
    tier: 2,
    parts: PHONE_PARTS,
    commonFaults: ["Cracked display", "Battery drain"],
  }),
  device({
    name: "Xiaomi 13",
    brand: "Xiaomi",
    family: "Xiaomi flagship",
    kind: "phone",
    year: 2023,
    panel: "oled",
    tier: 3,
    parts: PHONE_PARTS,
    commonFaults: ["Cracked display", "Battery drain", "Charge port wear"],
  }),
  device({
    name: "Xiaomi 14",
    brand: "Xiaomi",
    family: "Xiaomi flagship",
    kind: "phone",
    year: 2024,
    panel: "oled",
    tier: 3,
    parts: PHONE_PARTS,
    commonFaults: ["Cracked display", "Battery drain"],
  }),
  device({
    name: "Xiaomi Redmi Note 12",
    brand: "Xiaomi",
    family: "Redmi Note",
    kind: "phone",
    year: 2023,
    panel: "oled",
    tier: 1,
    parts: PHONE_PARTS,
    commonFaults: ["Cracked screen", "Battery drain", "Charge port full of lint"],
    notes:
      "Redmi parts are aftermarket rather than service-pack. Cheaper, and on a phone at this price that is the sensible trade.",
  }),
  device({
    name: "Xiaomi Redmi Note 13",
    brand: "Xiaomi",
    family: "Redmi Note",
    kind: "phone",
    year: 2024,
    panel: "oled",
    tier: 1,
    parts: PHONE_PARTS,
    commonFaults: ["Cracked screen", "Battery drain"],
  }),
  device({
    name: "Nothing Phone (1)",
    brand: "Nothing",
    family: "Nothing Phone",
    kind: "phone",
    year: 2022,
    panel: "oled",
    tier: 2,
    parts: PHONE_PARTS,
    commonFaults: ["Cracked display", "Glyph LEDs partially dead", "Battery drain"],
  }),
  device({
    name: "Nothing Phone (2)",
    brand: "Nothing",
    family: "Nothing Phone",
    kind: "phone",
    year: 2023,
    panel: "oled",
    tier: 2,
    parts: PHONE_PARTS,
    commonFaults: ["Cracked display", "Cracked transparent rear panel", "Battery drain"],
  }),
  device({
    name: "Nothing Phone (2a)",
    brand: "Nothing",
    family: "Nothing Phone",
    kind: "phone",
    year: 2024,
    panel: "oled",
    tier: 1,
    parts: PHONE_PARTS,
    commonFaults: ["Cracked display", "Battery drain"],
  }),
  device({
    name: "Motorola Moto G53",
    brand: "Motorola",
    family: "Moto G",
    kind: "phone",
    year: 2023,
    panel: "lcd",
    tier: 1,
    parts: PHONE_PARTS,
    commonFaults: ["Cracked screen", "Battery drain", "Charge port wear"],
  }),
  device({
    name: "Motorola Edge 50",
    brand: "Motorola",
    family: "Motorola Edge",
    kind: "phone",
    year: 2024,
    panel: "oled",
    tier: 2,
    parts: PHONE_PARTS,
    commonFaults: ["Cracked curved display", "Battery drain"],
  }),
]

export const devices: Device[] = [
  ...apple,
  ...ipads,
  ...samsung,
  ...folds,
  ...galaxyTabs,
  ...pixels,
  ...others,
]

export const deviceBySlug = new Map(devices.map((d) => [d.slug, d]))

export const deviceBrands = [...new Set(devices.map((d) => d.brand))].sort()

export function brandSlug(brand: string): string {
  return slugify(brand)
}

export const deviceByBrandSlug = (slug: string) =>
  devices.filter((d) => brandSlug(d.brand) === slug)

/** Grouped for the device index, newest family first. */
export function devicesByFamily(list: Device[] = devices) {
  const groups = new Map<string, Device[]>()
  for (const d of list) {
    const existing = groups.get(d.family)
    if (existing) existing.push(d)
    else groups.set(d.family, [d])
  }
  return [...groups.entries()]
    .map(([family, items]) => ({
      family,
      items: [...items].sort((a, b) => b.year - a.year || a.name.localeCompare(b.name)),
      newest: Math.max(...items.map((i) => i.year)),
    }))
    .sort((a, b) => b.newest - a.newest || a.family.localeCompare(b.family))
}

export const partKindLabels: Record<PartKind, string> = {
  screen: "Screen",
  battery: "Battery",
  charging: "Charging port",
  "rear-camera": "Rear camera",
  "front-camera": "Front camera",
  "back-glass": "Back glass",
  speaker: "Loudspeaker",
}
