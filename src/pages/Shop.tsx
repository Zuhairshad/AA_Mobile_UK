import { useEffect, useMemo, useState } from "react"
import CategoryTabs from "../components/CategoryTabs"
import ProductGrid from "../components/ProductGrid"
import { categories, products, type Category } from "../data/products"
import { useSearch } from "../lib/SearchContext"

export default function Shop() {
  const { search } = useSearch()
  const [activeCategory, setActiveCategory] = useState<Category | "Latest">("Latest")

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase()

    return products.filter((product) => {
      const matchesCategory = activeCategory === "Latest" || product.category === activeCategory
      const matchesSearch =
        query === "" ||
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query)

      return matchesCategory && matchesSearch
    })
  }, [search, activeCategory])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <section className="shop-page">
      <h1 className="shop-heading">All phones</h1>
      <CategoryTabs categories={categories} active={activeCategory} onChange={setActiveCategory} />
      <ProductGrid products={visibleProducts} />
    </section>
  )
}
