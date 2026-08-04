import { useId } from "react"
import { Link } from "react-router-dom"
import type { Product } from "../../data/catalogue"
import { buttonClass } from "../ui/Button"
import ProductCard from "../product/ProductCard"
import SectionHead from "./SectionHead"

type Props = {
  heading: string
  label?: string
  lede?: string
  products: Product[]
  /** Where "see all" goes. Omitted when there is nothing more to see. */
  moreTo?: string
  moreLabel?: string
}

/**
 * A grid, not a carousel.
 *
 * A carousel of fixed-width cards capped how large any image could get and hid
 * most of the row off-screen; worse, when a rail held only two items the arrows
 * were still drawn with nothing to scroll. A plain grid lets each image take the
 * full cell width, and a short row simply looks short.
 */
export default function FeaturedProducts({
  heading,
  label = "Shop",
  lede,
  products,
  moreTo,
  moreLabel = "See all",
}: Props) {
  const headingId = useId()

  if (products.length === 0) return null

  return (
    <section className="section-y" aria-labelledby={headingId}>
      <div className="content-boundary flex flex-col gap-10 md:gap-12">
        <SectionHead
          id={headingId}
          label={label}
          heading={heading}
          lede={lede}
        />

        {/* Four across from xl, matching the listing grid and the category
            tiles — three column counts on one page made the same square card
            look like three different components. Items 7 and 8 exist only at
            that width; at three columns they would hang off the last row. */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3 xl:grid-cols-4">
          {products.slice(0, 8).map((product, i) => (
            <div key={product.id} className={i > 5 ? "hidden xl:block" : ""}>
              <ProductCard product={product} priority={i < 4} />
            </div>
          ))}
        </div>

        {moreTo ? (
          <div className="flex justify-center">
            <Link to={moreTo} className={buttonClass("outline", "lg")}>
              {moreLabel}
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  )
}
