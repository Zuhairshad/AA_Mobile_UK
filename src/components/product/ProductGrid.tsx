import type { Product } from "../../data/catalogue"
import ProductCard from "./ProductCard"

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6">
      {products.map((product, i) => (
        <li key={product.id}>
          <ProductCard product={product} priority={i < 3} />
        </li>
      ))}
    </ul>
  )
}
