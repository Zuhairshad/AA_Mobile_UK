import PhoneIllustration from "./PhoneIllustration"
import type { Product } from "../data/products"

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card">
      {product.staffPick && (
        <span className="staff-pick">
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path
              d="M8 0c.4 2.8 2.2 4.6 5 5-2.8.4-4.6 2.2-5 5-.4-2.8-2.2-4.6-5-5 2.8-.4 4.6-2.2 5-5Z"
              fill="currentColor"
            />
          </svg>
          Staff picks
        </span>
      )}

      <div className="product-image">
        <PhoneIllustration accent={product.accent} variant={product.variant} label={product.name} />
      </div>

      <div className="product-meta">
        <p className="product-name">{product.name}</p>
        <div className="product-meta-row">
          <p className="product-brand">
            {product.brand} <span className="dot">_</span> {product.category}
          </p>
          <p className="product-price">£{product.price.toLocaleString("en-GB")}</p>
        </div>
      </div>
    </article>
  )
}
