import { formatCount } from "../../lib/format"
import { cx } from "../../lib/cx"
import Icon from "./Icon"

type Props = {
  value: number
  reviews?: number
  className?: string
}

/**
 * Five stars with a clipped overlay for the fractional part, so 4.3 reads as
 * 4.3 rather than rounding to a whole star. The numeric value is exposed to
 * assistive tech via aria-label; the stars themselves are decorative.
 */
export default function Rating({ value, reviews, className }: Props) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100))

  return (
    <div className={cx("flex items-end gap-2", className)}>
      <div
        className="relative inline-flex"
        role="img"
        aria-label={`Rated ${value} out of 5 stars`}
      >
        <div className="flex text-ink-300">
          {Array.from({ length: 5 }, (_, i) => (
            <Icon key={i} name="starSolid" className="size-4" />
          ))}
        </div>
        <div
          className="absolute inset-0 flex overflow-hidden text-amber-500"
          style={{ width: `${pct}%` }}
        >
          {Array.from({ length: 5 }, (_, i) => (
            <Icon key={i} name="starSolid" className="size-4" />
          ))}
        </div>
      </div>
      {reviews !== undefined ? (
        <span className="text-sm leading-none text-ink-500">
          {formatCount(reviews)}
        </span>
      ) : null}
    </div>
  )
}
