import { useMemo, useState } from "react"
import Header from "./components/Header"
import Hero from "./components/Hero"
import CategoryTabs from "./components/CategoryTabs"
import ProductGrid from "./components/ProductGrid"
import Footer from "./components/Footer"
import { categories, products, type Category } from "./data/products"
import "./App.css"

function App() {
  const [search, setSearch] = useState("")
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

  return (
    <div className="page">
      <Header search={search} onSearchChange={setSearch} />
      <Hero />

      <main>
        <CategoryTabs categories={categories} active={activeCategory} onChange={setActiveCategory} />
        <ProductGrid products={visibleProducts} />
      </main>

      <Footer />
    </div>
  )
}

export default App
