import { Link, useParams } from "react-router-dom"
import {
  brandSlug,
  deviceBrands,
  deviceByBrandSlug,
  devicesByFamily,
} from "../data/devices"
import { partsForDevice } from "../data/parts"
import { products } from "../data/catalogue"
import { formatPrice } from "../lib/format"
import Breadcrumbs from "../components/ui/Breadcrumbs"
import Icon from "../components/ui/Icon"
import { buttonClass } from "../components/ui/Button"
import ProductGrid from "../components/product/ProductGrid"
import NotFound from "./NotFound"

export default function Brand() {
  const { slug } = useParams<{ slug: string }>()
  const brandDevices = slug ? deviceByBrandSlug(slug) : []

  if (brandDevices.length === 0) return <NotFound />

  const brand = brandDevices[0].brand
  const groups = devicesByFamily(brandDevices)
  const partCount = brandDevices.reduce(
    (sum, d) => sum + partsForDevice(d).length,
    0,
  )

  // Handsets of this brand we sell outright.
  const handsets = products.filter(
    (p) => p.category === "phones" && p.brand === brand,
  )
  const cheapestScreenRepair = Math.min(
    ...brandDevices.flatMap((d) =>
      partsForDevice(d)
        .filter((p) => p.subcategory === "screens")
        .map((p) => p.price),
    ),
  )

  return (
    <>
      <div className="border-b border-line bg-white">
        <div className="content-boundary py-8 md:py-10">
          <Breadcrumbs
            trail={[
              { label: "Home", to: "/" },
              { label: "Devices", to: "/devices" },
              { label: brand },
            ]}
          />
          <h1 className="section-heading mt-4">{brand} parts and repairs</h1>
          <p className="section-lede mt-2">
            {brandDevices.length} {brand} models serviced, {partCount} parts in
            stock
            {Number.isFinite(cheapestScreenRepair)
              ? `, screens from ${formatPrice(cheapestScreenRepair)}`
              : ""}
            .
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/repairs#book" className={buttonClass("primary", "md")}>
              Book a repair
            </Link>
            <Link to="/parts" className={buttonClass("outline", "md")}>
              All repair parts
            </Link>
          </div>
        </div>
      </div>

      <div className="content-boundary py-10">
        <div className="space-y-10">
          {groups.map((group) => (
            <section key={group.family}>
              <h2 className="section-heading-sm">{group.family}</h2>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((device) => {
                  const count = partsForDevice(device).length
                  return (
                    <li key={device.slug}>
                      <article className="group resource-card h-full gap-3">
                        <span className="flex size-10 shrink-0 items-center justify-center bg-muted text-ink-600 group-hover:bg-muted group-hover:text-ink-950">
                          <Icon
                            name={device.kind === "tablet" ? "screen" : "phone"}
                          />
                        </span>
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-semibold group-hover:text-primary">
                            <Link
                              to={`/device/${device.slug}`}
                              className="stretched-link"
                            >
                              {device.name}
                            </Link>
                          </h3>
                          <p className="text-xs text-ink-500">
                            {device.year} · {count}{" "}
                            {count === 1 ? "part" : "parts"}
                          </p>
                        </div>
                      </article>
                    </li>
                  )
                })}
              </ul>
            </section>
          ))}
        </div>
      </div>

      {handsets.length > 0 ? (
        <section className="section-y bg-muted">
          <div className="content-boundary">
            <h2 className="section-heading-sm text-xl md:text-2xl">
              {brand} handsets we sell
            </h2>
            <div className="mt-6">
              <ProductGrid products={handsets} />
            </div>
          </div>
        </section>
      ) : null}

      <section className="border-t border-line bg-white">
        <div className="content-boundary py-12">
          <h2 className="section-heading-sm text-xl md:text-2xl">
            Other brands
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {deviceBrands
              .filter((b) => b !== brand)
              .map((b) => (
                <li key={b}>
                  <Link
                    to={`/brand/${brandSlug(b)}`}
                    className={buttonClass("outline", "md")}
                  >
                    {b}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </section>
    </>
  )
}
