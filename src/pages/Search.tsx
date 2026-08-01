import { useMemo } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { searchAll } from "../lib/search"
import { formatCount } from "../lib/format"
import { categories } from "../data/taxonomy"
import { buttonClass } from "../components/ui/Button"
import ProductGrid from "../components/product/ProductGrid"

export default function Search() {
  const [params] = useSearchParams()
  const query = params.get("q") ?? ""

  // Ask for a generous cap here — the header dropdown wants eight, a results
  // page wants everything that matched.
  const hits = useMemo(() => searchAll(query, 100), [query])
  const products = hits
    .filter((hit) => hit.kind === "product")
    .map((hit) => hit.product)

  return (
    <div className="content-boundary py-10">
      <h1 className="section-heading">
        {products.length > 0 ? "Search results" : "No results"}
      </h1>
      <p className="section-lede mt-2">
        {products.length > 0
          ? `${formatCount(products.length)} ${products.length === 1 ? "match" : "matches"} for “${query}”`
          : `Nothing matched “${query}”.`}
      </p>

      {products.length > 0 ? (
        <div className="mt-8">
          <h2 className="sr-only">Matching products</h2>
          <ProductGrid products={products} />
        </div>
      ) : (
        <div className="mt-8">
          <p className="prose-body max-w-2xl">
            Try a model name on its own — “iPhone 13” or “Galaxy S23” — or browse
            a category:
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {categories.map((category) => (
              <Link
                key={category.slug}
                to={`/${category.slug}`}
                className={buttonClass("outline", "md")}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
