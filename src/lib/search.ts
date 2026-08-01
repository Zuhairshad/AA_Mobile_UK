import { products, type Product } from "../data/catalogue"
import { categories } from "../data/taxonomy"
import { repairServices } from "../data/services"

export type SearchHit =
  | { kind: "product"; product: Product; to: string }
  | { kind: "category"; label: string; sub: string; to: string }
  | { kind: "service"; label: string; sub: string; to: string }

/**
 * Ranked substring search across product names, brands, compatibility and the
 * category tree. Deliberately simple — the catalogue is small enough that a
 * scored scan beats an index, and "iphone 13 battery" needs to match a part
 * whose name and compatibility hold different halves of the query.
 */
export function searchAll(query: string, limit = 8): SearchHit[] {
  const q = query.trim().toLowerCase()
  if (q.length < 2) return []
  const terms = q.split(/\s+/)

  const scored: Array<{ score: number; hit: SearchHit }> = []

  for (const product of products) {
    const haystack = [
      product.name,
      product.brand,
      product.subcategory,
      ...(product.compatibility ?? []),
    ]
      .join(" ")
      .toLowerCase()

    // Every term must appear somewhere, so multi-word queries narrow rather
    // than widen.
    if (!terms.every((t) => haystack.includes(t))) continue

    const name = product.name.toLowerCase()
    let score = 0
    if (name.startsWith(q)) score += 100
    else if (name.includes(q)) score += 60
    score += terms.filter((t) => name.includes(t)).length * 10
    if (product.bestseller !== undefined) score += 5
    if (product.stock === "out") score -= 20

    scored.push({
      score,
      hit: { kind: "product", product, to: `/product/${product.id}` },
    })
  }

  for (const category of categories) {
    if (!category.name.toLowerCase().includes(q)) continue
    scored.push({
      score: 80,
      hit: {
        kind: "category",
        label: category.name,
        sub: "Browse category",
        to: `/${category.slug}`,
      },
    })
  }

  for (const service of repairServices) {
    if (!service.name.toLowerCase().includes(q)) continue
    scored.push({
      score: 70,
      hit: {
        kind: "service",
        label: service.name,
        sub: "Repair service",
        to: "/repairs",
      },
    })
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.hit)
}
