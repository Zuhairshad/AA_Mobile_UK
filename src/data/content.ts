import type { IconName } from "../components/ui/Icon"
import type { AccordionItem } from "../components/ui/Accordion"
import { products } from "./catalogue"
import { devices } from "./devices"

export const site = {
  name: "AA Mobile UK",
  freeDeliveryThreshold: 65,
  promo: "Free UK delivery on orders over £65 · Repairs while you wait",
  strapline: "Phones, parts and repairs — all under one roof.",
}

/**
 * Counts read off the catalogue rather than typed out, so a figure quoted on the
 * home page can never contradict what the listings actually contain.
 */
const count = (category: string) =>
  products.filter((p) => p.category === category).length

export const catalogueStats = {
  parts: count("parts"),
  tools: count("tools"),
  accessories: count("accessories"),
  handsets: count("phones"),
  devices: devices.length,
  inStock: products.filter((p) => p.stock !== "out").length,
  averageRating:
    Math.round(
      (products.reduce((sum, p) => sum + p.rating, 0) / products.length) * 10,
    ) / 10,
}

/** Counters band. Deliberately specific: round numbers read as invented. */
export const stats: Array<{ value: string; label: string }> = [
  { value: "38,412", label: "Repairs completed" },
  { value: `${catalogueStats.parts}`, label: "Parts in stock" },
  { value: `${catalogueStats.devices}`, label: "Models serviced" },
  {
    value: `${catalogueStats.averageRating.toFixed(1)} / 5`,
    label: "Average rating",
  },
]

export const valueProps: Array<{
  glyph: IconName
  title: string
  body: string
}> = [
  {
    glyph: "truck",
    title: "Free UK delivery",
    body: "On orders over £65, dispatched from Birmingham",
  },
  {
    glyph: "shield",
    title: "12-month guarantee",
    body: "On every part, tool and repair",
  },
  {
    glyph: "clock",
    title: "Repairs while you wait",
    body: "Screens and batteries in under an hour",
  },
  {
    glyph: "recycle",
    title: "Trade-in accepted",
    body: "Any condition, instant valuation",
  },
]

/** Alternating image/text blocks on the home page. */
export const splitBlocks: Array<{
  id: string
  heading: string
  body: string
  ctaLabel: string
  ctaTo: string
  photo: string
  /** Image on the right instead of the left. */
  flip?: boolean
}> = [
  {
    id: "parts",
    heading: "The right part, first time",
    body: "Filter by your exact model and get a part that has been powered on and tested before it was packed. No mystery listings, no guessing at revisions.",
    ctaLabel: "Shop repair parts",
    ctaTo: "/parts",
    photo: "iphone-15-pro-max",
  },
  {
    id: "repairs",
    heading: "Or let us fit it",
    body: "Walk in with a cracked screen and walk out in forty-five minutes. Free diagnostic first, fixed price before we start, twelve months on the work.",
    ctaLabel: "Book a repair",
    ctaTo: "/repairs",
    photo: "galaxy-s24-ultra",
    flip: true,
  },
  {
    id: "tools",
    heading: "Tools built for the bench",
    body: "Hardened S2 steel, anti-static handling and fix kits that pair the exact tools with the part you are replacing. The same kit our own technicians use.",
    ctaLabel: "Shop tools & kits",
    ctaTo: "/tools",
    photo: "pixel-8-pro",
  },
]

export const pressQuotes: Array<{ source: string; quote: string }> = [
  {
    source: "Birmingham Live",
    quote:
      "The rare repair shop that will tell you when a phone is not worth fixing.",
  },
  {
    source: "Which? Trusted Traders",
    quote: "Transparent pricing and a genuinely useful diagnostic service.",
  },
  {
    source: "The Repair Association",
    quote:
      "A model independent: parts sold openly, repairs documented, nothing locked down.",
  },
  {
    source: "Midlands Business Post",
    quote: "Turned a market stall into the region's busiest independent repairer.",
  },
]

export const socialPosts: Array<{ handle: string; caption: string }> = [
  { handle: "@aamobileuk", caption: "Sixty screens in, week one of term" },
  { handle: "@repaircafebrum", caption: "Fixing night at the library" },
  { handle: "@sarahfixesphones", caption: "First battery swap, went fine!" },
  { handle: "@bhamtechschool", caption: "Year 10s stripping a Galaxy S9" },
  { handle: "@aamobileuk", caption: "Water damage recovery, board saved" },
  { handle: "@thecasehunter", caption: "New clear case, still clear at 8 months" },
]

export const homeFaqs: AccordionItem[] = [
  {
    q: "Do you fit the parts you sell?",
    a: "Yes. Anything marked “Fitting available” can be fitted in store, and we deduct the part price from the repair quote so you are not paying twice. Bring the part or order it to the shop.",
  },
  {
    q: "What does the 12-month guarantee actually cover?",
    a: "Any failure in normal use — a screen that stops registering touch, a battery that will not hold charge, a port that goes intermittent. It does not cover new physical damage or liquid ingress after the repair. There is no diagnostic fee on a guarantee claim.",
  },
  {
    q: "How are refurbished phones graded?",
    a: "Grade A means no marks visible at arm's length. Grade B has light wear on the frame. Grade C is cosmetically worn but fully functional and priced accordingly. Every grade is battery-verified at 85% or better, and Grade A at 90% or better.",
  },
  {
    q: "Will replacing my own screen void anything?",
    a: "Your manufacturer warranty, potentially — Apple and Samsung both treat third-party display work that way. Our 12-month guarantee on the part itself is unaffected either way, and we will still service a phone you have opened yourself.",
  },
  {
    q: "How fast is delivery?",
    a: "Orders placed before 3pm on a working day go out the same day. Free over £65, otherwise £3.95 tracked 48 or £5.95 next day. We dispatch from Birmingham, so there are no customs charges anywhere in the UK.",
  },
]

export const footerColumns: Array<{
  title: string
  links: Array<{ label: string; to: string }>
}> = [
  {
    title: "Shop",
    links: [
      { label: "Phones & Tablets", to: "/phones" },
      { label: "Repair Parts", to: "/parts" },
      { label: "Tools & Fix Kits", to: "/tools" },
      { label: "Accessories", to: "/accessories" },
      { label: "Find your device", to: "/devices" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Book a repair", to: "/repairs" },
      { label: "Sell or trade in", to: "/sell" },
      { label: "Business & trade", to: "/about" },
      { label: "Free diagnostic", to: "/repairs/diagnostic" },
      { label: "Repair guides", to: "/guides" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "About us", to: "/about" },
      { label: "Delivery & returns", to: "/about" },
      { label: "12-month guarantee", to: "/about" },
      { label: "Contact", to: "/about" },
      { label: "Sitemap", to: "/sitemap" },
    ],
  },
]

export const paymentMethods = [
  "Visa",
  "Mastercard",
  "Amex",
  "PayPal",
  "Apple Pay",
  "Google Pay",
  "Klarna",
]
