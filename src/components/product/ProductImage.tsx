import { productPhotos } from "../../data/images"
import { partPhotoFor } from "../../data/partPhotos"
import { photoTints } from "../../data/photoTints"
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
    /**
     * Photographs sit on a tile tinted to their own edge colour. Most of our
     * shots are lifestyle images with their own backdrop, and letterboxing one
     * inside a white well shows two nested backgrounds — the thing that made a
     * mixed grid look unfinished. Matching the tile merges photo and tile into a
     * single block, the way an illustration sits on its own field, and unlike a
     * cover-crop it cannot cut the product out of frame.
     */
    const tint = product.photo ? photoTints[product.photo] : undefined
    return (
      <div
        className={cx("absolute inset-0 overflow-hidden", className)}
        style={tint ? { backgroundColor: tint } : undefined}
      >
        <img
          src={src}
          alt={product.name}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="h-full w-full object-contain"
        />
      </div>
    )
  }

  /**
   * A photograph of the part itself, where we have one. These are shot on white,
   * so the tile goes white too — on the ink-50 tile the photo's edge showed as a
   * faint rectangle, which is the nested-background problem again in miniature.
   */
  if (product.partOf) {
    const photo = partPhotoFor(product.partOf.device, product.partOf.kind)
    if (photo) {
      return (
        <div className={cx("absolute inset-0 overflow-hidden bg-white", className)}>
          <img
            src={photo.src}
            alt={product.name}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            className="h-full w-full object-contain"
          />
        </div>
      )
    }
  }

  if (product.category === "parts") {
    // Front cameras live in the same subcategory as rear ones; the name is the
    // only thing that distinguishes them.
    const kind: PartKind = /front camera/i.test(product.name)
      ? "front-camera"
      : (partKindFor[product.subcategory] ?? "screen")

    return (
      <div
        className={cx(
          "absolute inset-0 flex items-center justify-center p-6",
          className,
        )}
        role="img"
        aria-label={product.name}
      >
        <PartArtwork kind={kind} seed={seedFrom(product.id)} />
      </div>
    )
  }

  // Tools are drawn, not photographed. Every tool photograph available to us is
  // of somebody else's product, so a listing for our own kit would be showing a
  // different item — a problem cropping the logo out would hide rather than fix.
  const toolKind = toolArtworkFor[product.id]
  if (toolKind) {
    return (
      <div
        className={cx(
          "absolute inset-0 flex items-center justify-center p-6",
          className,
        )}
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
        "absolute inset-0 flex items-center justify-center bg-ink-100",
        className,
      )}
      role="img"
      aria-label={product.name}
    >
      <Icon
        name={product.glyph ?? "toolkit"}
        className="h-1/2 w-1/2 max-h-28 max-w-28 text-ink-400"
      />
    </div>
  )
}
