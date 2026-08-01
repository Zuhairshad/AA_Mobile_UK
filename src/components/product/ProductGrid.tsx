import type { Product } from "../../data/catalogue"
import ProductCard from "./ProductCard"

type Props = {
  products: Product[]
  /**
   * Give the first item the full row width, as the reference template's
   * collection pages do. Off for filtered or deep-paged views, where promoting
   * whatever happens to sort first is arbitrary.
   */
  feature?: boolean
}

/**
 * Tight gutters and no card chrome, so the images sit almost against each other
 * and the grid reads as one block of imagery rather than a tray of floating
 * tiles.
 */
export default function ProductGrid({ products, feature }: Props) {
  const [lead, ...rest] = products
  // Below four items a promoted lead leaves a visibly short row underneath,
  // which is the sort of half-built grid this rebuild is meant to remove.
  const showFeature = Boolean(feature) && products.length > 3

  return (
    <div className="flex flex-col gap-10">
      {showFeature && lead ? (
        <ProductCard product={lead} priority aspect="wide" />
      ) : null}

      <ul className="grid grid-cols-2 gap-x-2 gap-y-10 md:grid-cols-3">
        {(showFeature ? rest : products).map((product, i) => (
          <li key={product.id}>
            <ProductCard product={product} priority={!showFeature && i < 3} />
          </li>
        ))}
      </ul>
    </div>
  )
}
