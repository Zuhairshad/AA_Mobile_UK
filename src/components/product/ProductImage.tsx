import { productPhotos } from "../../data/images"
import type { Product } from "../../data/catalogue"
import { cx } from "../../lib/cx"
import Icon from "../ui/Icon"

type Props = {
  product: Product
  className?: string
  /** Rendered above the fold — skips lazy loading. */
  priority?: boolean
}

/**
 * Products we photograph get the photo; parts and tools we do not have
 * photography for get a drawn glyph instead of a grey box, so a listing of
 * mixed stock still reads as one deliberate set.
 */
export default function ProductImage({ product, className, priority }: Props) {
  const src = product.photo ? productPhotos[product.photo] : undefined

  if (src) {
    return (
      <img
        src={src}
        alt={product.name}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={cx("h-full w-full object-contain", className)}
      />
    )
  }

  return (
    <div
      className={cx(
        "flex h-full w-full items-center justify-center rounded-md bg-gradient-to-br from-brand-50 to-brand-100",
        className,
      )}
      role="img"
      aria-label={product.name}
    >
      <Icon
        name={product.glyph ?? "toolkit"}
        className="h-1/2 w-1/2 max-h-28 max-w-28 text-brand-400"
      />
    </div>
  )
}
