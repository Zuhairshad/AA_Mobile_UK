import ProductCard from "./ProductCard"
import type { Product } from "../data/products"

export default function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return <p className="empty-state">No phones match your search.</p>
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
