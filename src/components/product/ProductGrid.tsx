import type { Product } from "../../data/catalogue"
import ProductCard from "./ProductCard"

type Props = {
  products: Product[]
}

/**
 * Tight gutters and no card chrome, so the images sit almost against each other
 * and the grid reads as one block of imagery rather than a tray of floating
 * tiles.
 *
 * A fourth column from xl: the content column is 100rem wide, and without it a
 * 1440 laptop showed three 455px tiles per row — the extra width went into
 * inflating each photograph rather than into showing more of the catalogue. Four
 * across still renders a larger image than the old padded card did at three.
 *
 * Every cell is the same size. Promoting the first product to a full-width band
 * gave one item half the fold and left the space beside it empty, which is the
 * opposite of what a 401-product listing needs from its first screen.
 */
export default function ProductGrid({ products }: Props) {
  return (
    <ul className="grid grid-cols-2 gap-x-2 gap-y-10 md:grid-cols-3 xl:grid-cols-4">
      {products.map((product, i) => (
        <li key={product.id}>
          <ProductCard product={product} priority={i < 4} />
        </li>
      ))}
    </ul>
  )
}
