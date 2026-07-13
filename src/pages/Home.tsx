import { useEffect, useMemo, useState } from "react"
import { useLocation } from "react-router-dom"
import Hero from "../components/Hero"
import Features from "../components/Features"
import CategoryTabs from "../components/CategoryTabs"
import ProductGrid from "../components/ProductGrid"
import { categories, products, type Category } from "../data/products"
import { useSearch } from "../lib/SearchContext"
import { useSmoothScroll } from "../lib/useSmoothScroll"

export default function Home() {
  const { search } = useSearch()
  const { scrollToId } = useSmoothScroll()
  const location = useLocation()
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
    const targetId = location.hash ? location.hash.slice(1) : search.trim() ? "shop" : null
    if (!targetId) return
    const timeout = setTimeout(() => scrollToId(targetId), 120)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.hash])

  return (
    <>
      <Hero onBrowseClick={() => scrollToId("shop")} />
      <Features />

      <section id="shop">
        <CategoryTabs categories={categories} active={activeCategory} onChange={setActiveCategory} />
        <ProductGrid products={visibleProducts} />
      </section>
    </>
  )
}
