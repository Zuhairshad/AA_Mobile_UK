import { productById, type Product } from "../data/catalogue"

const KEY = "aa-mobile-recent"
const LIMIT = 8

function read(): string[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    // Drop ids that no longer exist so a changed catalogue cannot break the rail.
    return parsed.filter(
      (id): id is string => typeof id === "string" && productById.has(id),
    )
  } catch {
    return []
  }
}

/** Record a view, most recent first, without duplicates. */
export function recordView(id: string): void {
  if (!productById.has(id)) return
  try {
    const next = [id, ...read().filter((existing) => existing !== id)].slice(0, LIMIT)
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    // Private browsing with storage disabled — the rail simply stays empty.
  }
}

/** Recently viewed products, optionally excluding the one being looked at. */
export function recentlyViewed(excludeId?: string): Product[] {
  return read()
    .filter((id) => id !== excludeId)
    .map((id) => productById.get(id))
    .filter((p): p is Product => Boolean(p))
}
