import type { Product } from "../../data/catalogue"
import ProductCard from "./ProductCard"

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-4">
      {products.map((product, i) => (
        <li key={product.id}>
          <ProductCard product={product} priority={i < 4} />
        </li>
      ))}
    </ul>
  )
}
