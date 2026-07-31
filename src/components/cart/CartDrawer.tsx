import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { useCart } from "../../lib/cart"
import { formatPrice } from "../../lib/format"
import { site } from "../../data/content"
import Button, { buttonClass } from "../ui/Button"
import Icon from "../ui/Icon"
import QuantityStepper from "../ui/QuantityStepper"
import ProductImage from "../product/ProductImage"

/**
 * Slide-over basket. Adding from a listing shouldn't cost you your place on the
 * page, so the header opens this instead of navigating; /cart stays a real route
 * for deep links and for anyone who prefers a full page.
 */
export default function CartDrawer() {
  const {
    drawerOpen,
    closeDrawer,
    lines,
    subtotal,
    delivery,
    total,
    toFreeDelivery,
    setQty,
    remove,
  } = useCart()
  const panel = useRef<HTMLDivElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  const returnFocusTo = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!drawerOpen) return

    // Remember what opened it so focus can go back there on close.
    returnFocusTo.current = document.activeElement as HTMLElement | null

    const focusable = () =>
      [
        ...(panel.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])',
        ) ?? []),
      ].filter((el) => el.offsetParent !== null)

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeDrawer()
        return
      }
      // Trap: the panel is aria-modal, so Tab must not walk out into the page
      // behind it. Without this, focus silently leaves the dialog and a keyboard
      // user is tabbing through content they cannot see.
      if (e.key !== "Tab") return
      const items = focusable()
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement
      if (
        e.shiftKey &&
        (active === first || !panel.current?.contains(active))
      ) {
        e.preventDefault()
        last.focus()
      } else if (
        !e.shiftKey &&
        (active === last || !panel.current?.contains(active))
      ) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    closeButton.current?.focus()

    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
      returnFocusTo.current?.focus?.()
    }
  }, [drawerOpen, closeDrawer])

  if (!drawerOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Close basket"
        onClick={closeDrawer}
      />

      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Basket"
        className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl"
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-4">
          <h2 className="section-heading-sm">
            Your basket
            {lines.length > 0 ? (
              <span className="ml-2 text-sm font-normal text-ink-500">
                {lines.length} {lines.length === 1 ? "item" : "items"}
              </span>
            ) : null}
          </h2>
          <button
            ref={closeButton}
            type="button"
            className="btn btn-ghost btn-icon"
            aria-label="Close basket"
            onClick={closeDrawer}
          >
            <Icon name="close" />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <span className="flex size-14 items-center justify-center bg-muted text-ink-500">
              <Icon name="cart" className="size-7" />
            </span>
            <p className="font-semibold">Nothing in your basket yet</p>
            <p className="text-sm text-ink-500">
              Find the part for your model, or book a repair and let us do it.
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              <Link
                to="/devices"
                onClick={closeDrawer}
                className={buttonClass("primary", "md")}
              >
                Find your device
              </Link>
              <Link
                to="/repairs"
                onClick={closeDrawer}
                className={buttonClass("outline", "md")}
              >
                Book a repair
              </Link>
            </div>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto">
              {lines.map(({ product, qty }) => (
                <li key={product.id} className="flex gap-3 p-4">
                  <Link
                    to={`/product/${product.id}`}
                    onClick={closeDrawer}
                    className="relative size-16 shrink-0 overflow-hidden bg-ink-50"
                  >
                    <ProductImage product={product} />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/product/${product.id}`}
                      onClick={closeDrawer}
                      className="line-clamp-2 text-sm font-semibold hover:text-primary"
                    >
                      {product.name}
                    </Link>
                    <p className="mt-0.5 text-sm text-ink-500">
                      {formatPrice(product.price)}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <QuantityStepper
                        value={qty}
                        min={0}
                        onChange={(next) => setQty(product.id, next)}
                        label={`Quantity for ${product.name}`}
                      />
                      <button
                        type="button"
                        onClick={() => remove(product.id)}
                        aria-label={`Remove ${product.name}`}
                        className="btn btn-ghost size-8 px-0 text-ink-500 hover:text-red-700"
                      >
                        <Icon name="trash" className="size-4" />
                      </button>
                    </div>
                  </div>

                  <p className="shrink-0 text-sm font-semibold">
                    {formatPrice(product.price * qty)}
                  </p>
                </li>
              ))}
            </ul>

            <div className="shrink-0 border-t border-line p-4">
              {toFreeDelivery > 0 ? (
                <div className="mb-4 bg-muted p-3 text-sm text-brand-900">
                  <p>
                    Spend {formatPrice(toFreeDelivery)} more for free UK
                    delivery.
                  </p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-brand-200">
                    <div
                      className="h-full rounded-full bg-primary transition-[width] duration-300"
                      style={{
                        width: `${Math.min(100, (subtotal / site.freeDeliveryThreshold) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ) : (
                <p className="mb-4 flex items-center gap-2 text-sm font-medium text-green-700">
                  <Icon name="check" className="size-4" />
                  Free UK delivery applied
                </p>
              )}

              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink-500">Subtotal</dt>
                  <dd className="font-medium">{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-500">Delivery</dt>
                  <dd className="font-medium">
                    {delivery === 0 ? "Free" : formatPrice(delivery)}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-line pt-2 text-base">
                  <dt className="font-semibold">Total</dt>
                  <dd className="font-semibold">{formatPrice(total)}</dd>
                </div>
              </dl>

              {/* See Cart.tsx: there is no checkout to reach. */}
              <Button size="lg" className="mt-4 w-full" disabled>
                Checkout unavailable
              </Button>
              <Link
                to="/cart"
                onClick={closeDrawer}
                className={buttonClass("outline", "md", "mt-2 w-full")}
              >
                View full basket
              </Link>
              <p className="mt-2 text-center text-xs text-ink-500">
                No payment processing yet — orders cannot be placed.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
