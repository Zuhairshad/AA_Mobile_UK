import type { IconName } from "../components/ui/Icon"

export type RepairService = {
  id: string
  name: string
  glyph: IconName
  /** Cheapest model in range — prices are quoted "from". */
  fromPrice: number
  turnaround: string
  blurb: string
  covers: string[]
  popular?: boolean
}

export const repairServices: RepairService[] = [
  {
    id: "screen-replacement",
    name: "Screen replacement",
    glyph: "screen",
    fromPrice: 59,
    turnaround: "45 minutes, while you wait",
    blurb:
      "Cracked glass, dead pixels, unresponsive touch. The commonest repair we do and the one we are fastest at.",
    covers: ["iPhone 11 and newer", "Galaxy S21 and newer", "Pixel 6 and newer", "iPad"],
    popular: true,
  },
  {
    id: "battery-replacement",
    name: "Battery replacement",
    glyph: "battery",
    fromPrice: 39,
    turnaround: "30 minutes, while you wait",
    blurb:
      "If your phone dies by mid-afternoon it is almost always the cell, not the software. Health reporting stays intact.",
    covers: ["iPhone 8 and newer", "Most Galaxy and Pixel models", "iPad"],
    popular: true,
  },
  {
    id: "charging-port",
    name: "Charging port repair",
    glyph: "port",
    fromPrice: 45,
    turnaround: "Same day",
    blurb:
      "Cable falls out, charges only at one angle, or will not charge at all. Usually the port flex rather than the board.",
    covers: ["iPhone", "Samsung Galaxy", "Google Pixel"],
  },
  {
    id: "water-damage",
    name: "Water damage recovery",
    glyph: "recycle",
    fromPrice: 45,
    turnaround: "2 – 3 working days",
    blurb:
      "Ultrasonic board clean and component-level diagnosis. The £45 covers the attempt and the report — you only pay for parts if we can save it.",
    covers: ["Any phone or tablet"],
  },
  {
    id: "data-recovery",
    name: "Data recovery",
    glyph: "sparkle",
    fromPrice: 79,
    turnaround: "3 – 5 working days",
    blurb:
      "For a phone that will not boot and was never backed up. We recover to an encrypted drive you keep.",
    covers: ["iPhone", "Android", "Water-damaged boards"],
  },
  {
    id: "diagnostic",
    name: "Full diagnostic",
    glyph: "sliders",
    fromPrice: 0,
    turnaround: "20 minutes",
    blurb:
      "Free, and free whether or not you go ahead with the repair. We will tell you if a phone is not worth fixing.",
    covers: ["Any phone or tablet"],
  },
]

export const bookingSteps = [
  {
    title: "Book a slot",
    body: "Pick a time online or walk in. Screens and batteries are usually done while you wait.",
  },
  {
    title: "Free diagnostic",
    body: "We confirm the fault and the price before we touch anything. No surprises on collection.",
  },
  {
    title: "Fixed and tested",
    body: "Every repair is function-tested end to end, then guaranteed for 12 months.",
  },
]
