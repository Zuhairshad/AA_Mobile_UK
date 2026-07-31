import { cx } from "../../lib/cx"

/**
 * Brand mark: a driver held inside a phone outline.
 *
 * A plain "AA" monogram said nothing about the business. The first attempt ran
 * the driver corner to corner across the phone, which read as a crossed-out
 * phone — a "no phones" sign, exactly the wrong message for a repair shop. The
 * tool is now contained within the body, which reads as working on the inside.
 *
 * Drawn with `currentColor` so the same mark serves the light header and the
 * dark footer, and legible down to a 16px favicon.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cx("size-8", className)}
      aria-hidden="true"
      focusable="false"
    >
      {/* phone body */}
      <rect
        x="8"
        y="3"
        width="16"
        height="26"
        rx="4.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
      />

      {/* driver, wholly inside the body: handle top-right, tip bottom-left */}
      <path
        d="M19.6 9.4 L13.9 20.4"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M17.6 7.2 L21.9 9.4 L20.4 12.3 Z"
        fill="currentColor"
        opacity="0.55"
      />
      {/* tip */}
      <path d="M12.2 23.6 L13.1 19.6 L15.4 20.8 Z" fill="currentColor" />
    </svg>
  )
}

type Props = {
  /** Hide the wordmark, e.g. in tight mobile headers. */
  markOnly?: boolean
  className?: string
  markClassName?: string
}

export default function Logo({ markOnly, className, markClassName }: Props) {
  return (
    <span className={cx("flex items-center gap-2.5", className)}>
      <span
        className={cx(
          "flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-500 text-white",
          markClassName,
        )}
      >
        <LogoMark className="size-6" />
      </span>
      {!markOnly ? (
        <span className="font-display text-lg leading-none font-bold tracking-tight">
          AA Mobile
          <span className="mt-0.5 block text-[11px] font-medium tracking-[0.14em] text-gray-500 uppercase">
            Repairs &amp; Parts
          </span>
        </span>
      ) : null}
    </span>
  )
}
