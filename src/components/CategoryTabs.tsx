import type { Category } from "../data/products"

type CategoryTabsProps = {
  categories: Category[]
  active: Category | "Latest"
  onChange: (category: Category | "Latest") => void
}

export default function CategoryTabs({ categories, active, onChange }: CategoryTabsProps) {
  const tabs: (Category | "Latest")[] = ["Latest", ...categories]

  return (
    <nav className="category-tabs" aria-label="Product categories">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`category-tab${active === tab ? " is-active" : ""}`}
          onClick={() => onChange(tab)}
        >
          {tab}
        </button>
      ))}
    </nav>
  )
}
