import { productPhotos } from "../../data/images"
import type { Product } from "../../data/catalogue"
import type { PartKind } from "../../data/devices"
import { cx } from "../../lib/cx"
import Icon from "../ui/Icon"
import PartArtwork from "./PartArtwork"
import ToolArtwork from "./ToolArtwork"
import { toolArtworkFor } from "./toolArtworkMap"

type Props = {
  product: Product
  className?: string
  /** Rendered above the fold — skips lazy loading. */
  priority?: boolean
}

/** Which drawing to use, from the subcategory the part sits in. */
const partKindFor: Record<string, PartKind> = {
  screens: "screen",
  batteries: "battery",
  charging: "charging",
  cameras: "rear-camera",
  housings: "back-glass",
  audio: "speaker",
}

/** Stable 0–1 from the product id, so a variant never changes between renders. */
function seedFrom(id: string): number {
  let h = 2166136261
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return ((h >>> 0) % 1000) / 1000
}

/**
 * Photography where we have it; a drawn technical illustration for parts, which
 * we do not photograph; a glyph for anything else. A listing of mixed stock
 * still reads as one deliberate set.
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

  if (product.category === "parts") {
    // Front cameras live in the same subcategory as rear ones; the name is the
    // only thing that distinguishes them.
    const kind: PartKind = /front camera/i.test(product.name)
      ? "front-camera"
      : (partKindFor[product.subcategory] ?? "screen")

    return (
      <div
        className={cx("flex h-full w-full items-center justify-center", className)}
        role="img"
        aria-label={product.name}
      >
        <PartArtwork kind={kind} seed={seedFrom(product.id)} />
      </div>
    )
  }

  const toolKind = toolArtworkFor[product.id]
  if (toolKind) {
    return (
      <div
        className={cx("flex h-full w-full items-center justify-center", className)}
        role="img"
        aria-label={product.name}
      >
        <ToolArtwork kind={toolKind} />
      </div>
    )
  }

  // Last resort for anything added without a photo or a mapped drawing.
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
