export type NavItem = {
  label: string
  to: string
  description: string
}

export type NavMenu = {
  label: string
  items: NavItem[]
}

/**
 * Header dropdowns. Each item carries a description — a menu that explains
 * itself is worth more than a denser one, especially when "Parts" and
 * "Tools" sound interchangeable to someone who has never opened a phone.
 */
export const navMenus: NavMenu[] = [
  {
    label: "Shop",
    items: [
      {
        label: "Phones & Tablets",
        to: "/phones",
        description: "New and refurbished, battery-tested, 12-month warranty.",
      },
      {
        label: "Repair Parts",
        to: "/parts",
        description: "Screens, batteries and ports for your exact model.",
      },
      {
        label: "Tools & Fix Kits",
        to: "/tools",
        description: "Precision kit and fix kits matched to the repair.",
      },
      {
        label: "Accessories",
        to: "/accessories",
        description: "Charging, cases and audio worth keeping.",
      },
    ],
  },
  {
    label: "Repairs",
    items: [
      {
        label: "Book a repair",
        to: "/repairs",
        description: "Pick a slot, or walk in and wait.",
      },
      {
        label: "Screen replacement",
        to: "/repairs#screen-replacement",
        description: "From £59, done in forty-five minutes.",
      },
      {
        label: "Battery replacement",
        to: "/repairs#battery-replacement",
        description: "From £39, health reporting kept intact.",
      },
      {
        label: "Free diagnostic",
        to: "/repairs#diagnostic",
        description: "We will tell you if it is not worth fixing.",
      },
    ],
  },
  {
    label: "Sell & Trade",
    items: [
      {
        label: "Sell your phone",
        to: "/sell",
        description: "Any condition. Instant valuation, paid same day.",
      },
      {
        label: "Trade in",
        to: "/sell#trade-in",
        description: "Put the value straight against a new handset.",
      },
      {
        label: "Business & trade",
        to: "/about",
        description: "Bulk parts pricing and fleet repair contracts.",
      },
    ],
  },
]
