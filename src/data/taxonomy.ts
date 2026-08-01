import type { IconName } from "../components/ui/Icon"

export type CategorySlug = "phones" | "parts" | "tools" | "accessories"

export type Subcategory = {
  slug: string
  name: string
  blurb?: string
  glyph: IconName
}

export type Category = {
  slug: CategorySlug
  name: string
  /** Shown under the H1 on the category page. */
  tagline: string
  /** Longer intro paragraph, also used as the meta description. */
  intro: string
  /** Card copy on the home page category grid. */
  cardBlurb: string
  glyph: IconName
  /** The two lead branches get double-width cards in the home grid. */
  feature?: boolean
  subcategories: Subcategory[]
}

export const categories: Category[] = [
  {
    slug: "phones",
    name: "Phones & Tablets",
    tagline: "New and refurbished, every handset checked in Birmingham.",
    intro:
      "Every device we sell is inspected across 40 checkpoints, battery-tested to at least 85% original capacity, and covered by a 12-month AA Mobile warranty. Refurbished stock is graded honestly — what you see in the grade is what arrives.",
    cardBlurb:
      "New and refurbished handsets and tablets, battery-tested and warranty-backed.",
    glyph: "phone",
    feature: true,
    subcategories: [
      { slug: "apple", name: "iPhone & iPad", glyph: "phone" },
      { slug: "samsung", name: "Samsung Galaxy", glyph: "phone" },
      { slug: "google", name: "Google Pixel", glyph: "phone" },
      { slug: "other-android", name: "Other Android", glyph: "phone" },
    ],
  },
  {
    slug: "parts",
    name: "Repair Parts",
    tagline: "Screens, batteries and boards backed by our quality guarantee.",
    intro:
      "We have spent years vetting suppliers so you do not have to gamble on a listing. Every part is tested on arrival, graded for origin, and comes with a 12-month guarantee. Not sure which part fits? Filter by your exact model.",
    cardBlurb:
      "Screens, batteries, charging ports and cameras for the models people actually break.",
    glyph: "screen",
    feature: true,
    subcategories: [
      { slug: "screens", name: "Screens & Displays", glyph: "screen" },
      { slug: "batteries", name: "Batteries", glyph: "battery" },
      { slug: "charging", name: "Charging Ports", glyph: "port" },
      { slug: "cameras", name: "Cameras", glyph: "camera" },
      { slug: "audio", name: "Speakers & Earpieces", glyph: "speaker" },
      { slug: "housings", name: "Back Glass & Housings", glyph: "glass" },
    ],
  },
  {
    slug: "tools",
    name: "Tools & Fix Kits",
    tagline: "Precision tools that outlast the devices you open with them.",
    intro:
      "The kit our own bench technicians use. Hardened S2 steel bits, anti-static handling, and fix kits that pair the exact tools with the part you are replacing.",
    cardBlurb: "Precision kit for the bench, and fix kits matched to a repair.",
    glyph: "toolkit",
    subcategories: [
      { slug: "toolkits", name: "Toolkits", glyph: "toolkit" },
      { slug: "screwdrivers", name: "Screwdrivers & Bits", glyph: "wrench" },
      { slug: "opening", name: "Prying & Opening", glyph: "sliders" },
      { slug: "consumables", name: "Adhesives & Consumables", glyph: "sparkle" },
    ],
  },
  {
    slug: "accessories",
    name: "Accessories",
    tagline: "Cases, charging and audio that will not let you down.",
    intro:
      "Everyday accessories we are happy to put our own name on: charging that meets spec, cases that survive a real drop, and audio worth keeping.",
    cardBlurb: "Charging, protection and audio — the everyday essentials.",
    glyph: "headphones",
    subcategories: [
      { slug: "cases", name: "Cases & Covers", glyph: "glass" },
      { slug: "charging-acc", name: "Chargers & Cables", glyph: "port" },
      { slug: "audio-acc", name: "Audio", glyph: "headphones" },
      { slug: "power", name: "Power Banks", glyph: "battery" },
      { slug: "protection", name: "Screen Protection", glyph: "shield" },
    ],
  },
]

export const categoryBySlug = new Map(categories.map((c) => [c.slug, c]))

export function subcategoryName(
  category: CategorySlug,
  slug: string,
): string | undefined {
  return categoryBySlug
    .get(category)
    ?.subcategories.find((s) => s.slug === slug)?.name
}

/**
 * Which facet groups a given category exposes. Parts get compatibility because
 * "does this fit my phone" is the only question that matters there; phones get
 * condition because new vs refurbished drives the decision.
 */
export type FacetKey =
  | "subcategory"
  | "brand"
  | "compatibility"
  | "condition"
  | "priceBand"

export const facetGroups: Record<
  CategorySlug,
  Array<{ key: FacetKey; label: string }>
> = {
  phones: [
    { key: "subcategory", label: "Range" },
    { key: "condition", label: "Condition" },
    { key: "brand", label: "Brand" },
    { key: "priceBand", label: "Price" },
  ],
  parts: [
    { key: "subcategory", label: "Part Type" },
    { key: "compatibility", label: "Fits" },
    { key: "brand", label: "Brand" },
    { key: "priceBand", label: "Price" },
  ],
  tools: [
    { key: "subcategory", label: "Tool Category" },
    { key: "brand", label: "Brand" },
    { key: "priceBand", label: "Price" },
  ],
  accessories: [
    { key: "subcategory", label: "Type" },
    { key: "brand", label: "Brand" },
    { key: "priceBand", label: "Price" },
  ],
}

export const priceBands = [
  { slug: "under-25", label: "Under £25", min: 0, max: 25 },
  { slug: "25-75", label: "£25 – £75", min: 25, max: 75 },
  { slug: "75-200", label: "£75 – £200", min: 75, max: 200 },
  { slug: "200-600", label: "£200 – £600", min: 200, max: 600 },
  { slug: "over-600", label: "Over £600", min: 600, max: Infinity },
] as const

export function priceBandFor(price: number): string {
  return (
    priceBands.find((b) => price >= b.min && price < b.max)?.slug ?? "over-600"
  )
}
