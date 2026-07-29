import type { Product } from "../data/catalogue"
import {
  priceBandFor,
  priceBands,
  subcategoryName,
  type CategorySlug,
  type FacetKey,
} from "../data/taxonomy"

/** Search-param name for each facet — short, readable URLs. */
export const paramFor: Record<FacetKey, string> = {
  subcategory: "type",
  brand: "brand",
  compatibility: "fits",
  condition: "condition",
  priceBand: "price",
}

export type Selections = Partial<Record<FacetKey, string[]>>

export const PAGE_SIZE = 12

export const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
  { value: "reviews", label: "Most reviewed" },
] as const

export type SortValue = (typeof sortOptions)[number]["value"]

/** The facet values a product carries for a given key. */
function valuesOf(product: Product, key: FacetKey): string[] {
  switch (key) {
    case "subcategory":
      return [product.subcategory]
    case "brand":
      return [product.brand]
    case "compatibility":
      return product.compatibility ?? []
    case "condition":
      return product.condition ? [product.condition] : []
    case "priceBand":
      return [priceBandFor(product.price)]
  }
}

function matches(product: Product, key: FacetKey, chosen: string[]): boolean {
  if (chosen.length === 0) return true
  const values = valuesOf(product, key)
  return chosen.some((c) => values.includes(c))
}

/** Apply every selection except the ones for `skip`. */
function filter(
  products: Product[],
  selections: Selections,
  skip?: FacetKey,
): Product[] {
  return products.filter((product) =>
    (Object.keys(paramFor) as FacetKey[]).every((key) =>
      key === skip ? true : matches(product, key, selections[key] ?? []),
    ),
  )
}

export function applyFacets(products: Product[], selections: Selections) {
  return filter(products, selections)
}

export type FacetOption = {
  value: string
  label: string
  count: number
  selected: boolean
}

function labelFor(category: CategorySlug, key: FacetKey, value: string): string {
  if (key === "subcategory") return subcategoryName(category, value) ?? value
  if (key === "priceBand")
    return priceBands.find((b) => b.slug === value)?.label ?? value
  if (key === "condition")
    return value === "refurbished" ? "Refurbished" : "New"
  return value
}

/**
 * Options for one facet group, counted against the set filtered by every
 * *other* facet. Selecting "Screens" therefore leaves the sibling part types
 * still showing their real counts instead of collapsing to zero.
 */
export function facetOptions(
  categoryProducts: Product[],
  category: CategorySlug,
  selections: Selections,
  key: FacetKey,
): FacetOption[] {
  const scope = filter(categoryProducts, selections, key)
  const counts = new Map<string, number>()

  for (const product of scope) {
    for (const value of valuesOf(product, key)) {
      counts.set(value, (counts.get(value) ?? 0) + 1)
    }
  }

  const chosen = selections[key] ?? []

  // Always surface a chosen option, even if the other facets have cut it to
  // zero — otherwise the user cannot see (or clear) their own filter.
  for (const value of chosen) {
    if (!counts.has(value)) counts.set(value, 0)
  }

  const options = [...counts.entries()].map(([value, count]) => ({
    value,
    label: labelFor(category, key, value),
    count,
    selected: chosen.includes(value),
  }))

  if (key === "priceBand") {
    const order: string[] = priceBands.map((b) => b.slug)
    return options.sort((a, b) => order.indexOf(a.value) - order.indexOf(b.value))
  }

  return options.sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
}

export function sortProducts(products: Product[], sort: SortValue): Product[] {
  const copy = [...products]
  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => a.price - b.price)
    case "price-desc":
      return copy.sort((a, b) => b.price - a.price)
    case "rating":
      return copy.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews)
    case "reviews":
      return copy.sort((a, b) => b.reviews - a.reviews)
    case "featured":
    default:
      // Curated first, then by review volume as a proxy for popularity.
      return copy.sort((a, b) => {
        const rank = (p: Product) => p.bestseller ?? Number.MAX_SAFE_INTEGER
        return rank(a) - rank(b) || b.reviews - a.reviews
      })
  }
}

/** Read selections out of the URL. */
export function selectionsFromParams(params: URLSearchParams): Selections {
  const selections: Selections = {}
  for (const key of Object.keys(paramFor) as FacetKey[]) {
    const raw = params.get(paramFor[key])
    if (raw) selections[key] = raw.split(",").filter(Boolean)
  }
  return selections
}

export function countSelected(selections: Selections): number {
  return Object.values(selections).reduce(
    (sum, values) => sum + (values?.length ?? 0),
    0,
  )
}
