import { formatPrice } from "../../lib/format"
import { cx } from "../../lib/cx"

type Props = {
  price: number
  compareAt?: number
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizes = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-3xl",
} as const

export default function PriceTag({
  price,
  compareAt,
  size = "md",
  className,
}: Props) {
  const discounted = compareAt !== undefined && compareAt > price

  return (
    <div className={cx("flex items-baseline gap-2", className)}>
      <span
        className={cx(
          "figure font-semibold leading-tight",
          sizes[size],
          discounted && "text-red-700",
        )}
      >
        {formatPrice(price)}
      </span>
      {discounted ? (
        <>
          {/* ink-500 on white measures 5.7:1, clear of the 4.5 minimum for
              body text — the struck-through original still has to be legible. */}
          <span className="text-sm text-ink-500 line-through">
            {formatPrice(compareAt)}
          </span>
          <span className="sr-only">reduced from {formatPrice(compareAt)}</span>
        </>
      ) : null}
    </div>
  )
}
