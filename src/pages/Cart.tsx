import { Link } from "react-router-dom"
import { useCart } from "../lib/cart"
import { formatPrice } from "../lib/format"
import { site, valueProps } from "../data/content"
import { bestsellers } from "../data/catalogue"
import Button, { buttonClass } from "../components/ui/Button"
import Icon from "../components/ui/Icon"
import QuantityStepper from "../components/ui/QuantityStepper"
import ProductImage from "../components/product/ProductImage"
import FeaturedProducts from "../components/sections/FeaturedProducts"

export default function Cart() {
  const { lines, subtotal, delivery, total, toFreeDelivery, setQty, remove, clear } =
    useCart()

  if (lines.length === 0) {
    return (
      <>
        <div className="content-boundary py-20 text-center">
          <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-500">
            <Icon name="cart" className="size-8" />
          </span>
          <h1 className="section-heading mt-6">Your basket is empty</h1>
          <p className="section-lede mx-auto mt-4 max-w-md">
            Find a part for your model, pick up a fix kit, or book a repair and
            let us do it.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/parts" className={buttonClass("primary", "lg")}>
              Shop repair parts
            </Link>
            <Link to="/repairs" className={buttonClass("outline", "lg")}>
              Book a repair
            </Link>
          </div>
        </div>
        <FeaturedProducts heading="Bestsellers" products={bestsellers} />
      </>
    )
  }

  return (
    <div className="content-boundary py-10">
      <h1 className="section-heading">Your basket</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-3 lg:gap-16">
        <div className="lg:col-span-2">
          <ul className="divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white">
            {lines.map(({ product, qty }) => (
              <li key={product.id} className="flex flex-wrap gap-4 p-4">
                <Link
                  to={`/product/${product.id}`}
                  className="size-20 shrink-0 rounded-lg bg-gray-100 p-2"
                >
                  <ProductImage product={product} />
                </Link>

                <div className="min-w-0 flex-1">
                  <Link
                    to={`/product/${product.id}`}
                    className="font-semibold hover:text-primary"
                  >
                    {product.name}
                  </Link>
                  <p className="mt-0.5 text-sm text-gray-600">{product.brand}</p>
                  {product.stock === "low" ? (
                    <p className="mt-1 text-xs font-medium text-amber-700">
                      Low stock — order soon
                    </p>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => remove(product.id)}
                    className="mt-2 inline-flex items-center gap-1 text-sm text-gray-600 hover:text-red-700"
                  >
                    <Icon name="trash" className="size-4" />
                    Remove
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <QuantityStepper
                    value={qty}
                    onChange={(next) => setQty(product.id, next)}
                    min={0}
                    label={`Quantity for ${product.name}`}
                  />
                  <p className="w-20 text-right font-semibold">
                    {formatPrice(product.price * qty)}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-wrap justify-between gap-3">
            <Link to="/parts" className={buttonClass("outline", "md")}>
              Continue shopping
            </Link>
            <Button variant="ghost" onClick={clear}>
              Empty basket
            </Button>
          </div>
        </div>

        <aside className="lg:col-span-1">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-lg font-semibold">Order summary</h2>

            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-600">Subtotal</dt>
                <dd className="font-medium">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Delivery</dt>
                <dd className="font-medium">
                  {delivery === 0 ? "Free" : formatPrice(delivery)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-3 text-base">
                <dt className="font-semibold">Total</dt>
                <dd className="font-semibold">{formatPrice(total)}</dd>
              </div>
            </dl>

            {toFreeDelivery > 0 ? (
              <div className="mt-4 rounded-lg bg-brand-50 p-3 text-sm text-brand-900">
                <p>
                  Spend {formatPrice(toFreeDelivery)} more for free UK delivery.
                </p>
                {/* Progress toward the threshold, capped so it never overflows. */}
                <div
                  className="mt-2 h-1.5 overflow-hidden rounded-full bg-brand-200"
                  role="presentation"
                >
                  <div
                    className="h-full rounded-full bg-brand-500"
                    style={{
                      width: `${Math.min(100, (subtotal / site.freeDeliveryThreshold) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ) : (
              <p className="mt-4 flex items-center gap-2 text-sm font-medium text-green-700">
                <Icon name="check" className="size-4" />
                Free UK delivery applied
              </p>
            )}

            <Button size="lg" className="mt-5 w-full">
              Checkout
            </Button>
            <p className="mt-2 text-center text-xs text-gray-500">
              This is a demo storefront — no payment is taken.
            </p>
          </div>

          <ul className="mt-6 space-y-3">
            {valueProps.map((prop) => (
              <li key={prop.title} className="flex items-start gap-3 text-sm">
                <Icon name={prop.glyph} className="mt-0.5 size-5 text-brand-500" />
                <span>
                  <span className="block font-medium">{prop.title}</span>
                  <span className="block text-gray-600">{prop.body}</span>
                </span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  )
}
