import type { IconName } from "../components/ui/Icon"
import type { PartKind } from "./devices"

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
  /** Links the service to generated part prices, where one part drives it. */
  partKind?: PartKind
  /** Longer copy for the service's own page. */
  detail?: string[]
  includes?: string[]
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
    partKind: "screen",
    detail: [
      "A cracked screen is the repair we do most, and on most models it is done while you wait. We use a full display assembly rather than re-laminating glass onto your old panel, because a re-lamination that fails six weeks later is not a repair.",
      "On iPhones that means True Tone survives. On Samsung it means a service-pack assembly bonded to a fresh frame. On Pixels it means a matched fingerprint reader, so unlock still works after the swap.",
      "We test touch across the whole panel, brightness, the earpiece and the front camera before you collect it.",
    ],
    includes: [
      "Free diagnostic before we start",
      "Full display assembly, not a re-laminated panel",
      "Fresh perimeter adhesive",
      "Function test across touch, brightness, earpiece and camera",
      "12-month guarantee on the part and the labour",
    ],
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
    partKind: "battery",
    detail: [
      "If your phone dies by mid-afternoon, or shuts down in the cold at 40%, it is the cell rather than the software. A battery is the cheapest way to make an older phone usable again, and it is the repair we most often recommend instead of a new handset.",
      "We check reported health before and after, and we will show you the reading. On iPhones the capacity and cycle count keep reporting correctly after the swap.",
    ],
    includes: [
      "Free battery health check",
      "New cell, not a refurbished one",
      "Fresh adhesive",
      "Charge and discharge test before collection",
      "12-month guarantee",
    ],
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
    partKind: "charging",
    detail: [
      "Cable falls out, charges only at one angle, or has stopped charging altogether. We always clean the port first — a surprising share of dead-charging phones are just full of pocket lint, and if that fixes it we do not charge you for a part.",
      "If the port itself has failed it is usually the flex or sub-board rather than the mainboard, which keeps this a same-day job.",
    ],
    includes: [
      "Free diagnostic, including a port clean",
      "Replacement port flex or sub-board",
      "Charge test with a real cable and charger",
      "Microphone and speaker check, since they share the assembly",
      "12-month guarantee",
    ],
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
