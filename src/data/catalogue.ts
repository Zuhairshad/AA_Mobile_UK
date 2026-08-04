import type { IconName } from "../components/ui/Icon"
import type { BadgeTone } from "../components/ui/Badge"
import type { CategorySlug } from "./taxonomy"
import type { PartKind } from "./devices"
import { generatedParts } from "./parts"

export type Stock = "in" | "low" | "out"
export type Condition = "new" | "refurbished"

export type Spec = { label: string; value: string }

export type Product = {
  id: string
  name: string
  category: CategorySlug
  subcategory: string
  brand: string
  price: number
  /** Original price when the item is reduced. */
  compareAt?: number
  rating: number
  reviews: number
  stock: Stock
  condition?: Condition
  /** Refurbished cosmetic grade, e.g. "A — as new". */
  grade?: string
  /** Models this part fits. Drives the "Fits" facet on the parts listing. */
  compatibility?: string[]
  /** Photo basename in src/assets/products. Falls back to `glyph` when absent. */
  photo?: string
  /** Set on generated parts: which model and component this is, for photo lookup. */
  partOf?: { device: string; kind: PartKind }
  glyph?: IconName
  blurb: string
  description?: string[]
  specs?: Spec[]
  /** Kit contents, listed on the product page. */
  includes?: string[]
  /** Manually curated badges; guarantee and stock badges are derived. */
  badges?: BadgeKey[]
  /** Position in the home page bestsellers rail. Lower sorts first. */
  bestseller?: number
  /** Eligible for the "fitted in store" upsell. */
  fittingAvailable?: boolean
}

export type BadgeKey =
  | "guarantee"
  | "bestseller"
  | "sale"
  | "refurbished"
  | "newIn"
  | "lowStock"
  | "outOfStock"
  | "fitting"

export const badgeMeta: Record<
  BadgeKey,
  { label: string; tone: BadgeTone; icon?: IconName }
> = {
  guarantee: { label: "12-month guarantee", tone: "brand", icon: "shield" },
  bestseller: { label: "Bestseller", tone: "accent", icon: "sparkle" },
  sale: { label: "Sale", tone: "red" },
  refurbished: { label: "Refurbished", tone: "green", icon: "recycle" },
  newIn: { label: "New in", tone: "brand" },
  lowStock: { label: "Low stock", tone: "amber" },
  outOfStock: { label: "Out of stock", tone: "gray" },
  fitting: { label: "Fitting available", tone: "green", icon: "wrench" },
}

/**
 * Badges shown on a card, most important first. The card only renders the
 * leading badge; the product page shows all of them.
 */
export function badgesFor(product: Product): BadgeKey[] {
  const derived: BadgeKey[] = []
  if (product.stock === "out") derived.push("outOfStock")
  else if (product.stock === "low") derived.push("lowStock")
  if (product.compareAt && product.compareAt > product.price) derived.push("sale")
  if (product.condition === "refurbished") derived.push("refurbished")

  const manual = product.badges ?? []
  const all = [...derived, ...manual, "guarantee" as BadgeKey]
  return [...new Set(all)]
}

/* -------------------------------------------------------------------------- */
/* Phones & tablets                                                            */
/* -------------------------------------------------------------------------- */

const phones: Product[] = [
  {
    id: "iphone-15-pro-max",
    name: "iPhone 15 Pro Max",
    category: "phones",
    subcategory: "apple",
    brand: "Apple",
    price: 1199,
    rating: 4.9,
    reviews: 412,
    stock: "in",
    condition: "new",
    photo: "iphone-15-pro-max",
    blurb: "Titanium body, 5x tetraprism telephoto, USB-C at last.",
    badges: ["bestseller"],
    bestseller: 1,
    description: [
      "The Pro Max is the one to buy if the camera matters. The 5x tetraprism telephoto is the only reason to choose it over the Pro, and it is a very good reason.",
      "Sold new and unlocked, with a 12-month AA Mobile warranty on top of the manufacturer cover.",
    ],
    specs: [
      { label: "Display", value: "6.7in Super Retina XDR, 120Hz" },
      { label: "Chip", value: "A17 Pro" },
      { label: "Rear cameras", value: "48MP main, 12MP 5x tele, 12MP ultrawide" },
      { label: "Storage", value: "256GB" },
      { label: "Battery", value: "4,441mAh" },
      { label: "Port", value: "USB-C (USB 3, 10Gb/s)" },
      { label: "Network", value: "Unlocked, 5G" },
    ],
  },
  {
    id: "iphone-15",
    name: "iPhone 15",
    category: "phones",
    subcategory: "apple",
    brand: "Apple",
    price: 799,
    rating: 4.8,
    reviews: 286,
    stock: "in",
    condition: "new",
    photo: "iphone-15",
    blurb: "The sensible iPhone. 48MP main camera and Dynamic Island.",
    specs: [
      { label: "Display", value: "6.1in Super Retina XDR, 60Hz" },
      { label: "Chip", value: "A16 Bionic" },
      { label: "Rear cameras", value: "48MP main, 12MP ultrawide" },
      { label: "Storage", value: "128GB" },
      { label: "Port", value: "USB-C" },
      { label: "Network", value: "Unlocked, 5G" },
    ],
  },
  {
    id: "iphone-15-refurb",
    name: "iPhone 15 (Refurbished)",
    category: "phones",
    subcategory: "apple",
    brand: "Apple",
    price: 629,
    compareAt: 799,
    rating: 4.7,
    reviews: 158,
    stock: "low",
    condition: "refurbished",
    grade: "A — as new",
    photo: "iphone-15",
    blurb: "Grade A refurbished. Battery at 90%+ or we replace it.",
    bestseller: 4,
    description: [
      "Grade A means no visible marks at arm's length. We are strict about this — if a unit would disappoint you out of the box it gets graded down, not talked up.",
      "Battery health is verified at 90% or better. Anything below that gets a new cell fitted before it goes on sale, at our cost.",
      "Comes with a braided USB-C cable, a 12-month AA Mobile warranty, and 30 days to change your mind.",
    ],
    specs: [
      { label: "Cosmetic grade", value: "A — as new" },
      { label: "Battery health", value: "90% or better, verified" },
      { label: "Display", value: "6.1in Super Retina XDR" },
      { label: "Storage", value: "128GB" },
      { label: "In the box", value: "Handset, USB-C cable" },
      { label: "Warranty", value: "12 months" },
    ],
  },
  {
    id: "iphone-se",
    name: "iPhone SE (3rd gen)",
    category: "phones",
    subcategory: "apple",
    brand: "Apple",
    price: 429,
    rating: 4.4,
    reviews: 96,
    stock: "in",
    condition: "new",
    photo: "iphone-se",
    blurb: "Touch ID, small hands, A15 chip. Still the best cheap iPhone.",
    specs: [
      { label: "Display", value: "4.7in Retina HD" },
      { label: "Chip", value: "A15 Bionic" },
      { label: "Biometrics", value: "Touch ID" },
      { label: "Storage", value: "64GB" },
      { label: "Port", value: "Lightning" },
    ],
  },
  {
    id: "ipad-mini",
    name: "iPad Mini",
    category: "phones",
    subcategory: "apple",
    brand: "Apple",
    price: 499,
    rating: 4.7,
    reviews: 134,
    stock: "in",
    condition: "new",
    photo: "ipad-mini",
    blurb: "The tablet people actually carry. Apple Pencil support included.",
    specs: [
      { label: "Display", value: "8.3in Liquid Retina" },
      { label: "Chip", value: "A15 Bionic" },
      { label: "Storage", value: "64GB" },
      { label: "Stylus", value: "Apple Pencil (2nd gen) compatible" },
    ],
  },
  {
    id: "galaxy-s24-ultra",
    name: "Galaxy S24 Ultra",
    category: "phones",
    subcategory: "samsung",
    brand: "Samsung",
    price: 1249,
    rating: 4.9,
    reviews: 358,
    stock: "in",
    condition: "new",
    photo: "galaxy-s24-ultra",
    blurb: "Titanium frame, built-in S Pen, 200MP main sensor.",
    badges: ["bestseller"],
    bestseller: 2,
    description: [
      "Samsung's kitchen-sink flagship, and the only current flagship with a stylus in the body. The flat display finally makes the S Pen genuinely pleasant to use.",
      "Sold new and unlocked with a 12-month AA Mobile warranty.",
    ],
    specs: [
      { label: "Display", value: "6.8in QHD+ Dynamic AMOLED 2X, 120Hz" },
      { label: "Chip", value: "Snapdragon 8 Gen 3" },
      { label: "Rear cameras", value: "200MP main, 50MP 5x, 10MP 3x, 12MP ultrawide" },
      { label: "Storage", value: "256GB" },
      { label: "Battery", value: "5,000mAh" },
      { label: "Stylus", value: "S Pen, in-body" },
    ],
  },
  {
    id: "galaxy-s24",
    name: "Galaxy S24",
    category: "phones",
    subcategory: "samsung",
    brand: "Samsung",
    price: 799,
    rating: 4.7,
    reviews: 201,
    stock: "in",
    condition: "new",
    photo: "galaxy-s24",
    blurb: "Compact flagship with seven years of Android updates.",
    specs: [
      { label: "Display", value: "6.2in FHD+ AMOLED, 120Hz" },
      { label: "Chip", value: "Exynos 2400" },
      { label: "Storage", value: "128GB" },
      { label: "Software support", value: "7 years of OS updates" },
    ],
  },
  {
    id: "galaxy-s24-refurb",
    name: "Galaxy S24 (Refurbished)",
    category: "phones",
    subcategory: "samsung",
    brand: "Samsung",
    price: 599,
    compareAt: 799,
    rating: 4.6,
    reviews: 88,
    stock: "in",
    condition: "refurbished",
    grade: "A — as new",
    photo: "galaxy-s24",
    blurb: "Grade A refurbished, battery verified, 12-month warranty.",
    specs: [
      { label: "Cosmetic grade", value: "A — as new" },
      { label: "Battery health", value: "90% or better, verified" },
      { label: "Storage", value: "128GB" },
      { label: "Warranty", value: "12 months" },
    ],
  },
  {
    id: "galaxy-z-flip-5",
    name: "Galaxy Z Flip 5",
    category: "phones",
    subcategory: "samsung",
    brand: "Samsung",
    price: 899,
    compareAt: 1049,
    rating: 4.5,
    reviews: 143,
    stock: "low",
    condition: "new",
    photo: "galaxy-z-flip-5",
    blurb: "Folds to pocket size. Flex Window actually useful this time.",
    bestseller: 6,
    specs: [
      { label: "Main display", value: "6.7in FHD+ AMOLED, 120Hz" },
      { label: "Cover display", value: "3.4in Super AMOLED" },
      { label: "Chip", value: "Snapdragon 8 Gen 2" },
      { label: "Folded size", value: "85.1 x 71.9 x 15.1mm" },
    ],
  },
  {
    id: "galaxy-a55",
    name: "Galaxy A55",
    category: "phones",
    subcategory: "samsung",
    brand: "Samsung",
    price: 439,
    rating: 4.4,
    reviews: 176,
    stock: "in",
    condition: "new",
    photo: "galaxy-a55",
    blurb: "Mid-range done properly: metal frame, 120Hz, four years of updates.",
    specs: [
      { label: "Display", value: "6.6in FHD+ Super AMOLED, 120Hz" },
      { label: "Chip", value: "Exynos 1480" },
      { label: "Battery", value: "5,000mAh" },
    ],
  },
  {
    id: "galaxy-tab-s9",
    name: "Galaxy Tab S9",
    category: "phones",
    subcategory: "samsung",
    brand: "Samsung",
    price: 699,
    rating: 4.6,
    reviews: 74,
    stock: "in",
    condition: "new",
    photo: "galaxy-tab-s9",
    blurb: "AMOLED tablet with an S Pen in the box, not sold separately.",
    specs: [
      { label: "Display", value: "11in Dynamic AMOLED 2X, 120Hz" },
      { label: "Chip", value: "Snapdragon 8 Gen 2" },
      { label: "Stylus", value: "S Pen included" },
      { label: "Water resistance", value: "IP68" },
    ],
  },
  {
    id: "pixel-8-pro",
    name: "Pixel 8 Pro",
    category: "phones",
    subcategory: "google",
    brand: "Google",
    price: 999,
    rating: 4.7,
    reviews: 221,
    stock: "in",
    condition: "new",
    photo: "pixel-8-pro",
    blurb: "Seven years of updates and the best point-and-shoot camera going.",
    bestseller: 5,
    specs: [
      { label: "Display", value: "6.7in LTPO OLED, 120Hz" },
      { label: "Chip", value: "Google Tensor G3" },
      { label: "Rear cameras", value: "50MP main, 48MP 5x, 48MP ultrawide" },
      { label: "Software support", value: "7 years of OS and security updates" },
    ],
  },
  {
    id: "pixel-8",
    name: "Pixel 8",
    category: "phones",
    subcategory: "google",
    brand: "Google",
    price: 699,
    rating: 4.6,
    reviews: 189,
    stock: "in",
    condition: "new",
    photo: "pixel-8",
    blurb: "Compact, clever, and supported until 2030.",
    specs: [
      { label: "Display", value: "6.2in OLED, 120Hz" },
      { label: "Chip", value: "Google Tensor G3" },
      { label: "Storage", value: "128GB" },
    ],
  },
  {
    id: "pixel-8a",
    name: "Pixel 8a",
    category: "phones",
    subcategory: "google",
    brand: "Google",
    price: 499,
    rating: 4.5,
    reviews: 152,
    stock: "in",
    condition: "new",
    photo: "pixel-8a",
    blurb: "Flagship camera processing at half the flagship price.",
    badges: ["newIn"],
    specs: [
      { label: "Display", value: "6.1in Actua OLED, 120Hz" },
      { label: "Chip", value: "Google Tensor G3" },
      { label: "Software support", value: "7 years" },
    ],
  },
  {
    id: "oneplus-12",
    name: "OnePlus 12",
    category: "phones",
    subcategory: "other-android",
    brand: "OnePlus",
    price: 849,
    rating: 4.6,
    reviews: 118,
    stock: "in",
    condition: "new",
    photo: "oneplus-12",
    blurb: "100W wired charging. Empty to full while you have a coffee.",
    specs: [
      { label: "Display", value: "6.82in QHD+ AMOLED, 120Hz" },
      { label: "Chip", value: "Snapdragon 8 Gen 3" },
      { label: "Charging", value: "100W wired, 50W wireless" },
      { label: "Battery", value: "5,400mAh" },
    ],
  },
  {
    id: "xiaomi-14",
    name: "Xiaomi 14",
    category: "phones",
    subcategory: "other-android",
    brand: "Xiaomi",
    price: 799,
    rating: 4.5,
    reviews: 97,
    stock: "in",
    condition: "new",
    photo: "xiaomi-14",
    blurb: "Leica-tuned optics in a genuinely compact body.",
    specs: [
      { label: "Display", value: "6.36in LTPO AMOLED, 120Hz" },
      { label: "Chip", value: "Snapdragon 8 Gen 3" },
      { label: "Cameras", value: "Leica-tuned triple 50MP" },
    ],
  },
  {
    id: "nothing-phone-2",
    name: "Nothing Phone (2)",
    category: "phones",
    subcategory: "other-android",
    brand: "Nothing",
    price: 579,
    rating: 4.3,
    reviews: 132,
    stock: "in",
    condition: "new",
    photo: "nothing-phone-2",
    blurb: "The transparent one. Glyph lights are more useful than they look.",
    specs: [
      { label: "Display", value: "6.7in LTPO OLED, 120Hz" },
      { label: "Chip", value: "Snapdragon 8+ Gen 1" },
      { label: "Rear", value: "Glyph LED interface" },
    ],
  },
  {
    id: "motorola-edge-50",
    name: "Motorola Edge 50",
    category: "phones",
    subcategory: "other-android",
    brand: "Motorola",
    price: 449,
    rating: 4.2,
    reviews: 64,
    stock: "in",
    condition: "new",
    photo: "motorola-edge-50",
    blurb: "Big battery, clean Android, priced to undercut the mid-range.",
    specs: [
      { label: "Display", value: "6.67in pOLED, 144Hz" },
      { label: "Battery", value: "5,000mAh" },
      { label: "Charging", value: "68W wired" },
    ],
  },
]

/* -------------------------------------------------------------------------- */
/* Repair parts are derived from the device roster — see ./parts.ts            */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/* Tools & fix kits                                                            */
/* -------------------------------------------------------------------------- */

const tools: Product[] = [
  {
    id: "bench-pro-toolkit",
    name: "Bench Pro Toolkit",
    category: "tools",
    subcategory: "toolkits",
    brand: "AA Mobile",
    price: 74.99,
    rating: 4.9,
    reviews: 187,
    stock: "in",
    glyph: "toolkit",
    blurb: "The kit on our own benches. 64 bits, anti-static, in a roll that closes.",
    badges: ["bestseller"],
    bestseller: 8,
    description: [
      "This is not a marketing bundle — it is the kit our technicians are issued on their first day, sold at the price we pay for it plus the case.",
      "Sixteen drive types across 64 hardened S2 steel bits, which covers every fastener you will meet on a phone or tablet built in the last decade. The roll closes with the bits captive, so nothing migrates into the bottom of a bag.",
    ],
    specs: [
      { label: "Bits", value: "64, hardened S2 steel" },
      { label: "Drive types", value: "16 including pentalobe, tri-point, Torx" },
      { label: "Driver", value: "Anodised aluminium, magnetised shaft" },
      { label: "Case", value: "Roll-up canvas, bits captive" },
      { label: "Guarantee", value: "Lifetime on hand tools" },
    ],
    includes: [
      "64-bit precision driver with flex extension",
      "Anti-static wrist strap",
      "Metal spudger and halberd spudger",
      "Angled and blunt tweezers",
      "Suction handle",
      "Opening picks (6)",
      "Plastic opening tool set",
      "Roll-up canvas case",
    ],
  },
  {
    id: "essential-repair-toolkit",
    name: "Essential Repair Toolkit",
    category: "tools",
    subcategory: "toolkits",
    brand: "AA Mobile",
    price: 29.99,
    rating: 4.7,
    reviews: 264,
    stock: "in",
    glyph: "toolkit",
    blurb: "Everything for a first repair, nothing you will never use.",
    bestseller: 9,
    description: [
      "If you are replacing one battery or one screen, buy this instead of the Bench Pro. It has the twenty bits that actually come up and none of the twenty that do not.",
    ],
    specs: [
      { label: "Bits", value: "20, hardened S2 steel" },
      { label: "Drive types", value: "Pentalobe, tri-point, Phillips, Torx, flathead" },
      { label: "Case", value: "Hard shell with moulded tray" },
    ],
    includes: [
      "20-bit precision driver",
      "Anti-static wrist strap",
      "Metal spudger",
      "Angled tweezers",
      "Suction cup",
      "Opening picks (3)",
    ],
  },
  {
    id: "screen-fix-kit",
    name: "Screen Fix Kit",
    category: "tools",
    subcategory: "toolkits",
    brand: "AA Mobile",
    price: 19.99,
    rating: 4.6,
    reviews: 121,
    stock: "in",
    glyph: "toolkit",
    blurb: "Pair it with any screen — the exact tools for that one job.",
    description: [
      "A screen swap needs a heat source, a way in, and a way to hold the display while the adhesive lets go. This has all three and stops there.",
    ],
    includes: [
      "Suction handle",
      "Opening picks (4)",
      "Pentalobe and tri-point drivers",
      "Reusable heat pad",
      "Display adhesive strip",
    ],
  },
  {
    id: "battery-fix-kit",
    name: "Battery Fix Kit",
    category: "tools",
    subcategory: "toolkits",
    brand: "AA Mobile",
    price: 14.99,
    rating: 4.5,
    reviews: 98,
    stock: "in",
    glyph: "toolkit",
    blurb: "Adhesive remover, picks and drivers for a battery swap.",
    includes: [
      "Pentalobe driver",
      "Tri-point driver",
      "Plastic spudger",
      "Adhesive remover solution",
      "Replacement adhesive strips",
    ],
  },
  {
    id: "precision-driver-64",
    name: "64-Bit Precision Driver Set",
    category: "tools",
    subcategory: "screwdrivers",
    brand: "AA Mobile",
    price: 39.99,
    rating: 4.8,
    reviews: 156,
    stock: "in",
    glyph: "wrench",
    blurb: "Sixteen drive types, hardened S2 steel, knurled aluminium handle.",
    specs: [
      { label: "Bits", value: "64" },
      { label: "Material", value: "Hardened S2 steel" },
      { label: "Handle", value: "Knurled anodised aluminium, swivel top" },
      { label: "Guarantee", value: "Lifetime" },
    ],
  },
  {
    id: "precision-driver-24",
    name: "24-Bit Precision Driver Set",
    category: "tools",
    subcategory: "screwdrivers",
    brand: "AA Mobile",
    price: 22.99,
    rating: 4.6,
    reviews: 134,
    stock: "in",
    glyph: "wrench",
    blurb: "The 24 bits that cover 95% of phone repairs.",
  },
  {
    id: "pentalobe-driver",
    name: "Pentalobe P2 Driver",
    category: "tools",
    subcategory: "screwdrivers",
    brand: "AA Mobile",
    price: 8.99,
    rating: 4.5,
    reviews: 212,
    stock: "in",
    glyph: "wrench",
    blurb: "The two screws standing between you and every iPhone.",
  },
  {
    id: "opening-pick-set",
    name: "Opening Pick Set (6)",
    category: "tools",
    subcategory: "opening",
    brand: "AA Mobile",
    price: 6.99,
    rating: 4.4,
    reviews: 187,
    stock: "in",
    glyph: "sliders",
    blurb: "Thin enough to get under adhesive, blunt enough not to cut a cable.",
  },
  {
    id: "suction-handle",
    name: "Suction Handle",
    category: "tools",
    subcategory: "opening",
    brand: "AA Mobile",
    price: 9.99,
    rating: 4.5,
    reviews: 143,
    stock: "in",
    glyph: "sliders",
    blurb: "Lifts a warmed display squarely, which a bare suction cup will not.",
  },
  {
    id: "metal-spudger",
    name: "Metal Spudger",
    category: "tools",
    subcategory: "opening",
    brand: "AA Mobile",
    price: 7.99,
    rating: 4.6,
    reviews: 121,
    stock: "in",
    glyph: "sliders",
    blurb: "For connectors and brackets where plastic flexes and slips.",
  },
  {
    id: "heat-pad",
    name: "Reusable Screen Heat Pad",
    category: "tools",
    subcategory: "opening",
    brand: "AA Mobile",
    price: 34.99,
    rating: 4.7,
    reviews: 76,
    stock: "in",
    glyph: "sliders",
    blurb: "Even 80°C across the whole display. Safer than a heat gun in a hurry.",
    specs: [
      { label: "Temperature", value: "Fixed 80°C" },
      { label: "Pad size", value: "180 x 105mm" },
      { label: "Power", value: "USB-C, 30W" },
    ],
  },
  {
    id: "adhesive-strips",
    name: "Display Adhesive Strips (5 pack)",
    category: "tools",
    subcategory: "consumables",
    brand: "AA Mobile",
    price: 5.99,
    rating: 4.3,
    reviews: 254,
    stock: "in",
    glyph: "sparkle",
    blurb: "Pre-cut per model. Reusing the old adhesive never works.",
  },
  {
    id: "isopropyl-wipes",
    name: "Isopropyl Cleaning Wipes (30)",
    category: "tools",
    subcategory: "consumables",
    brand: "AA Mobile",
    price: 7.99,
    rating: 4.4,
    reviews: 98,
    stock: "in",
    glyph: "sparkle",
    blurb: "99.9% IPA. Lifts old adhesive without leaving a residue.",
  },
  {
    id: "esd-wrist-strap",
    name: "Anti-Static Wrist Strap",
    category: "tools",
    subcategory: "consumables",
    brand: "AA Mobile",
    price: 11.99,
    rating: 4.5,
    reviews: 87,
    stock: "in",
    glyph: "sparkle",
    blurb: "Cheap insurance against the fault you cannot see.",
  },
]

/* -------------------------------------------------------------------------- */
/* Accessories                                                                 */
/* -------------------------------------------------------------------------- */

const accessories: Product[] = [
  {
    id: "clear-case-15",
    name: "Clear Case for iPhone 15",
    category: "accessories",
    subcategory: "cases",
    brand: "AA Mobile",
    price: 19,
    rating: 4.4,
    reviews: 176,
    stock: "in",
    photo: "clear-case-15",
    blurb: "Anti-yellow coating that actually holds up past six months.",
    specs: [
      { label: "Drop rating", value: "2m, MIL-STD-810G" },
      { label: "Material", value: "Anti-yellow TPU with hard back" },
      { label: "Wireless charging", value: "MagSafe compatible" },
    ],
  },
  {
    id: "magsafe-wallet",
    name: "MagSafe Card Wallet",
    category: "accessories",
    subcategory: "cases",
    brand: "AA Mobile",
    price: 24.99,
    rating: 4.2,
    reviews: 64,
    stock: "in",
    glyph: "glass",
    blurb: "Holds three cards and stays put when you pull it out of a pocket.",
  },
  {
    id: "magsafe-charger",
    name: "MagSafe Charger",
    category: "accessories",
    subcategory: "charging-acc",
    brand: "Apple",
    price: 39,
    rating: 4.6,
    reviews: 232,
    stock: "in",
    photo: "magsafe-charger",
    blurb: "15W magnetic charging, genuine Apple part.",
    specs: [
      { label: "Output", value: "15W with a 20W+ USB-C adapter" },
      { label: "Cable", value: "1m, captive" },
    ],
  },
  {
    id: "25w-fast-charger",
    name: "25W USB-C Fast Charger",
    category: "accessories",
    subcategory: "charging-acc",
    brand: "Samsung",
    price: 25,
    rating: 4.5,
    reviews: 198,
    stock: "in",
    photo: "25w-fast-charger",
    blurb: "PD 3.0 with PPS, so it fast-charges Galaxy handsets properly.",
    specs: [
      { label: "Output", value: "25W, PD 3.0 with PPS" },
      { label: "Plug", value: "UK three-pin" },
    ],
  },
  {
    id: "braided-usbc-cable",
    name: "Braided USB-C Cable (2m)",
    category: "accessories",
    subcategory: "charging-acc",
    brand: "AA Mobile",
    price: 12.99,
    rating: 4.6,
    reviews: 341,
    stock: "in",
    glyph: "port",
    blurb: "240W rated, 480Mb/s data, and the strain relief does its job.",
    bestseller: 10,
    specs: [
      { label: "Power", value: "240W (48V/5A) rated" },
      { label: "Data", value: "USB 2.0, 480Mb/s" },
      { label: "Length", value: "2m" },
    ],
  },
  {
    id: "car-charger-30w",
    name: "30W Dual-Port Car Charger",
    category: "accessories",
    subcategory: "charging-acc",
    brand: "AA Mobile",
    price: 18.99,
    rating: 4.3,
    reviews: 87,
    stock: "in",
    glyph: "port",
    blurb: "USB-C and USB-A, so the passenger stops complaining.",
  },
  {
    id: "wireless-earbuds-pro",
    name: "Wireless Earbuds Pro",
    category: "accessories",
    subcategory: "audio-acc",
    brand: "AA Mobile",
    price: 89,
    rating: 4.4,
    reviews: 156,
    stock: "in",
    photo: "wireless-earbuds-pro",
    blurb: "Hybrid ANC, 8 hours a charge, and a case that charges wirelessly.",
    specs: [
      { label: "Noise cancelling", value: "Hybrid ANC, 40dB" },
      { label: "Battery", value: "8h buds, 32h with case" },
      { label: "Water resistance", value: "IPX5" },
      { label: "Codecs", value: "SBC, AAC, LDAC" },
    ],
  },
  {
    id: "earbuds-lite",
    name: "Earbuds Lite",
    category: "accessories",
    subcategory: "audio-acc",
    brand: "AA Mobile",
    price: 39.99,
    rating: 4.1,
    reviews: 112,
    stock: "in",
    glyph: "headphones",
    blurb: "No ANC, no nonsense, ten hours a charge.",
  },
  {
    id: "power-bank-20000",
    name: "20,000mAh Power Bank",
    category: "accessories",
    subcategory: "power",
    brand: "Anker",
    price: 45,
    rating: 4.7,
    reviews: 289,
    stock: "in",
    photo: "power-bank-20000",
    blurb: "Two full phone charges and a laptop top-up. Airline safe.",
    specs: [
      { label: "Capacity", value: "20,000mAh / 74Wh" },
      { label: "Output", value: "65W USB-C PD, 22.5W USB-A" },
      { label: "Air travel", value: "Under the 100Wh cabin limit" },
    ],
  },
  {
    id: "screen-protector",
    name: "Tempered Glass Screen Protector",
    category: "accessories",
    subcategory: "protection",
    brand: "AA Mobile",
    price: 12,
    rating: 4.5,
    reviews: 421,
    stock: "in",
    photo: "screen-protector",
    blurb: "9H glass with an alignment frame, so it goes on straight first time.",
    bestseller: 11,
    fittingAvailable: true,
    specs: [
      { label: "Hardness", value: "9H" },
      { label: "Fitting", value: "Alignment frame included" },
      { label: "Thickness", value: "0.33mm" },
    ],
  },
]

export const products: Product[] = [
  ...phones,
  ...generatedParts,
  ...tools,
  ...accessories,
]

export const productById = new Map(products.map((p) => [p.id, p]))

export const bestsellers = products
  .filter((p) => p.bestseller !== undefined)
  .sort((a, b) => a.bestseller! - b.bestseller!)

export function relatedTo(product: Product, limit = 6): Product[] {
  const sameSub = products.filter(
    (p) => p.id !== product.id && p.subcategory === product.subcategory,
  )
  const sameCat = products.filter(
    (p) =>
      p.id !== product.id &&
      p.category === product.category &&
      p.subcategory !== product.subcategory,
  )
  return [...sameSub, ...sameCat].slice(0, limit)
}

/**
 * Parts and tools pair naturally: buying a screen means you need a way to open
 * the phone. Falls back to accessories for devices.
 */
export function boughtTogether(product: Product): Product[] {
  const pick = (...ids: string[]) =>
    ids.map((id) => productById.get(id)).filter((p): p is Product => Boolean(p))

  if (product.category === "parts") {
    if (product.subcategory === "screens")
      return pick("screen-fix-kit", "adhesive-strips")
    if (product.subcategory === "batteries")
      return pick("battery-fix-kit", "isopropyl-wipes")
    return pick("essential-repair-toolkit", "opening-pick-set")
  }
  if (product.category === "tools") return pick("esd-wrist-strap", "isopropyl-wipes")
  return pick("screen-protector", "braided-usbc-cable")
}
