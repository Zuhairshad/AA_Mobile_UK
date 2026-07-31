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
          <span className="text-sm text-gray-500 line-through">
            {formatPrice(compareAt)}
          </span>
          <span className="sr-only">reduced from {formatPrice(compareAt)}</span>
        </>
      ) : null}
    </div>
  )
}
