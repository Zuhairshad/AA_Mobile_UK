import { cx } from "../../lib/cx"

/**
 * Single inline icon set. Line icons share a 24x24 box and 1.75 stroke so they
 * stay optically consistent at any size; the few solid glyphs (star, brand
 * marks) are flagged and rendered with fill instead.
 */
const strokePaths = {
  search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM20 20l-4.2-4.2",
  cart: "M3 4h2l2.4 10.4a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 8H6M10 20a1 1 0 1 0 0-.001M17 20a1 1 0 1 0 0-.001",
  menu: "M4 7h16M4 12h16M4 17h16",
  close: "M6 6l12 12M18 6L6 18",
  chevronDown: "M6 9.5l6 6 6-6",
  chevronRight: "M9.5 6l6 6-6 6",
  chevronLeft: "M14.5 6l-6 6 6 6",
  arrowRight: "M4 12h15M13 6l6 6-6 6",
  check: "M5 12.5l4.5 4.5L19 7",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  trash: "M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13M10 11v6M14 11v6",
  shield: "M12 3l7.5 3v5.5c0 4.4-3.1 8.3-7.5 9.5-4.4-1.2-7.5-5.1-7.5-9.5V6L12 3Z",
  truck: "M3 7h11v9H3V7ZM14 10h4l3 3v3h-7v-6ZM7 19a1.5 1.5 0 1 0 0-.001M17.5 19a1.5 1.5 0 1 0 0-.001",
  wrench:
    "M14.5 6.5a4 4 0 1 0 4.9 4.9l-2.4-2.4 1.4-1.4 2.4 2.4A4 4 0 0 0 14.5 6.5ZM13 10L4.5 18.5l1.5 1.5L14.5 11.5",
  banknote: "M3 7h18v10H3V7ZM12 12a1.5 1.5 0 1 0 0-.001M6 10v4M18 10v4",
  recycle:
    "M7 8l2-3.5 2.5 4.2M17 11l2 3.5-4 .5M9.5 19.5L7 16l4-1M5 13.5 7 8h4.5M19 14.5 17 11h-4.5M9.5 19.5H15l1-3",
  star: "M12 3.5l2.6 5.6 6 .8-4.4 4.2 1.1 6-5.3-3-5.3 3 1.1-6L3.4 9.9l6-.8L12 3.5Z",
  phone: "M7 3h10v18H7V3ZM10.5 5.5h3",
  battery: "M3 8h14v8H3V8ZM19 11v2M6 11v2",
  screen: "M4 5h16v11H4V5ZM9 20h6M12 16v4",
  camera:
    "M4 8h3l1.5-2h7L17 8h3v11H4V8ZM12 16.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  port: "M8 3h8v6l2 2v10H6V11l2-2V3ZM10 6h4",
  speaker: "M6 5h12v14H6V5ZM12 9.5a1 1 0 1 0 0-.001M12 15.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  toolkit: "M3 8h18v12H3V8ZM8 8V5h8v3M3 13h18M10.5 13v2.5h3V13",
  glass: "M5 4h14v16H5V4ZM8.5 7.5h7v9h-7Z",
  headphones:
    "M5 15v-3a7 7 0 0 1 14 0v3M3.5 15h3v5h-3v-5ZM17.5 15h3v5h-3v-5Z",
  clock: "M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16ZM12 8v4.5l3 1.8",
  mapPin: "M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11ZM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  mail: "M3 6h18v12H3V6ZM3 7l9 6.5L21 7",
  sliders: "M4 7h10M18 7h2M4 12h3M11 12h9M4 17h7M15 17h5M14 5v4M7 10v4M11 15v4",
  sparkle: "M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6L12 4Z",
  ukFlag: "M3 6h18v12H3V6ZM3 6l18 12M21 6L3 18M12 6v12M3 12h18",
} as const

const solidPaths = {
  starSolid:
    "M12 2.6l2.9 6 6.6.9-4.8 4.6 1.2 6.6L12 17.6l-5.9 3.1 1.2-6.6L2.5 9.5l6.6-.9L12 2.6Z",
  instagram:
    "M12 2.2c-2.7 0-3 0-4.1.1-1 0-1.8.2-2.4.5a4.9 4.9 0 0 0-1.8 1.1 4.9 4.9 0 0 0-1.1 1.8c-.3.6-.4 1.4-.5 2.4 0 1-.1 1.4-.1 4.1s0 3 .1 4.1c0 1 .2 1.8.5 2.4a4.9 4.9 0 0 0 1.1 1.8 4.9 4.9 0 0 0 1.8 1.1c.6.3 1.4.4 2.4.5 1 0 1.4.1 4.1.1s3 0 4.1-.1c1 0 1.8-.2 2.4-.5a5 5 0 0 0 2.9-2.9c.3-.6.4-1.4.5-2.4 0-1 .1-1.4.1-4.1s0-3-.1-4.1c0-1-.2-1.8-.5-2.4a4.9 4.9 0 0 0-1.1-1.8 4.9 4.9 0 0 0-1.8-1.1c-.6-.3-1.4-.4-2.4-.5-1 0-1.4-.1-4.1-.1Zm0 1.8c2.7 0 3 0 4 .1.8 0 1.3.2 1.6.3.4.2.7.4 1 .7.3.3.5.6.7 1 .1.3.3.8.3 1.6 0 1 .1 1.3.1 4s0 3-.1 4c0 .8-.2 1.3-.3 1.6-.2.4-.4.7-.7 1-.3.3-.6.5-1 .7-.3.1-.8.3-1.6.3-1 0-1.3.1-4 .1s-3 0-4-.1c-.8 0-1.3-.2-1.6-.3-.4-.2-.7-.4-1-.7-.3-.3-.5-.6-.7-1-.1-.3-.3-.8-.3-1.6 0-1-.1-1.3-.1-4s0-3 .1-4c0-.8.2-1.3.3-1.6.2-.4.4-.7.7-1 .3-.3.6-.5 1-.7.3-.1.8-.3 1.6-.3 1 0 1.3-.1 4-.1Zm0 3.1a5.1 5.1 0 1 0 0 10.2 5.1 5.1 0 0 0 0-10.2Zm0 8.4a3.3 3.3 0 1 1 0-6.6 3.3 3.3 0 0 1 0 6.6Zm6.5-8.6a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0Z",
  facebook:
    "M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12Z",
  x: "M17.5 3h3.1l-6.8 7.7L21.9 21h-5.8l-4.5-5.9L6.2 21H3.1l7.2-8.2L2.9 3h5.9l4.2 5.6L17.5 3Zm-1.1 16.1h1.7L7.4 4.8H5.6l10.8 14.3Z",
  youtube:
    "M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4a2.5 2.5 0 0 0-1.8 1.8A26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15.2V8.8l5.2 3.2-5.2 3.2Z",
  tiktok:
    "M16.6 2h-3v13.1a2.6 2.6 0 1 1-1.9-2.5V9.5a5.7 5.7 0 1 0 4.9 5.6V8.6a6 6 0 0 0 3.5 1.1V6.6a3.5 3.5 0 0 1-3.5-3.5V2Z",
} as const

export type IconName = keyof typeof strokePaths | keyof typeof solidPaths

type Props = {
  name: IconName
  className?: string
  title?: string
}

export default function Icon({ name, className, title }: Props) {
  const solid = name in solidPaths
  const d = solid
    ? solidPaths[name as keyof typeof solidPaths]
    : strokePaths[name as keyof typeof strokePaths]

  return (
    <svg
      viewBox="0 0 24 24"
      // Default size comes from the attributes, not a `size-5` class: a CSS
      // size utility from the caller always beats an attribute, whereas two
      // competing `size-*` classes resolve by stylesheet order and would make
      // the caller's value unreliable.
      width={20}
      height={20}
      className={cx("shrink-0", className)}
      fill={solid ? "currentColor" : "none"}
      stroke={solid ? "none" : "currentColor"}
      strokeWidth={solid ? undefined : 1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
    >
      {title ? <title>{title}</title> : null}
      <path d={d} />
    </svg>
  )
}
