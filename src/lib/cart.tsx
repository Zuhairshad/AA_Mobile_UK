import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import type { ReactNode } from "react"
import { productById, type Product } from "../data/catalogue"
import { site } from "../data/content"

const STORAGE_KEY = "aa-mobile-cart"

export type CartLine = {
  product: Product
  qty: number
}

type StoredLine = { id: string; qty: number }

type CartValue = {
  lines: CartLine[]
  /** Drawer visibility lives with the cart: everything that opens it is a cart action. */
  drawerOpen: boolean
  openDrawer: () => void
  closeDrawer: () => void
  count: number
  subtotal: number
  delivery: number
  total: number
  /** How much more to spend to clear the free-delivery threshold. */
  toFreeDelivery: number
  add: (id: string, qty?: number) => void
  setQty: (id: string, qty: number) => void
  remove: (id: string) => void
  clear: () => void
}

const CartContext = createContext<CartValue | null>(null)

function read(): StoredLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    // Drop anything that no longer exists in the catalogue.
    return parsed.filter(
      (l): l is StoredLine =>
        typeof l === "object" &&
        l !== null &&
        typeof (l as StoredLine).id === "string" &&
        typeof (l as StoredLine).qty === "number" &&
        productById.has((l as StoredLine).id),
    )
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [stored, setStored] = useState<StoredLine[]>(read)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
  }, [stored])

  const add = useCallback((id: string, qty = 1) => {
    if (!productById.has(id)) return
    setStored((prev) => {
      const existing = prev.find((l) => l.id === id)
      if (existing) {
        return prev.map((l) =>
          l.id === id ? { ...l, qty: Math.min(l.qty + qty, 99) } : l,
        )
      }
      return [...prev, { id, qty: Math.min(qty, 99) }]
    })
  }, [])

  const setQty = useCallback((id: string, qty: number) => {
    setStored((prev) =>
      qty <= 0
        ? prev.filter((l) => l.id !== id)
        : prev.map((l) => (l.id === id ? { ...l, qty: Math.min(qty, 99) } : l)),
    )
  }, [])

  const remove = useCallback((id: string) => {
    setStored((prev) => prev.filter((l) => l.id !== id))
  }, [])

  const clear = useCallback(() => setStored([]), [])
  const openDrawer = useCallback(() => setDrawerOpen(true), [])
  const closeDrawer = useCallback(() => setDrawerOpen(false), [])

  const value = useMemo<CartValue>(() => {
    const lines = stored
      .map((l) => {
        const product = productById.get(l.id)
        return product ? { product, qty: l.qty } : null
      })
      .filter((l): l is CartLine => l !== null)

    const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.qty, 0)
    const free = subtotal >= site.freeDeliveryThreshold
    const delivery = lines.length === 0 || free ? 0 : 3.95

    return {
      lines,
      count: lines.reduce((sum, l) => sum + l.qty, 0),
      subtotal,
      delivery,
      total: subtotal + delivery,
      toFreeDelivery: free ? 0 : site.freeDeliveryThreshold - subtotal,
      drawerOpen,
      openDrawer,
      closeDrawer,
      add,
      setQty,
      remove,
      clear,
    }
  }, [stored, drawerOpen, openDrawer, closeDrawer, add, setQty, remove, clear])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used inside a CartProvider")
  return ctx
}
