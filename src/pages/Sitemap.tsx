import { Link } from "react-router-dom"
import { categories } from "../data/taxonomy"
import {
  brandSlug,
  deviceBrands,
  devices,
  devicesByFamily,
} from "../data/devices"
import { guides } from "../data/guides"
import { repairServices } from "../data/services"
import { products } from "../data/catalogue"
import Breadcrumbs from "../components/ui/Breadcrumbs"

const staticPages = [
  { to: "/", label: "Home" },
  { to: "/devices", label: "Find your device" },
  { to: "/guides", label: "Repair guides" },
  { to: "/repairs", label: "Repairs" },
  { to: "/sell", label: "Sell or trade in" },
  { to: "/about", label: "About us" },
  { to: "/cart", label: "Basket" },
  { to: "/search", label: "Search" },
]

/**
 * Every page on the site, generated from the same data the pages are. Useful as
 * a link map, and it makes an accidentally orphaned page type obvious.
 */
export default function Sitemap() {
  const subcategoryCount = categories.reduce(
    (sum, c) => sum + c.subcategories.length,
    0,
  )
  const total =
    staticPages.length +
    categories.length +
    subcategoryCount +
    products.length +
    devices.length +
    deviceBrands.length +
    repairServices.length +
    guides.length +
    1 // this page

  const families = devicesByFamily()

  return (
    <div className="content-boundary py-10">
      <Breadcrumbs trail={[{ label: "Home", to: "/" }, { label: "Sitemap" }]} />
      <h1 className="section-heading mt-4">Sitemap</h1>
      <p className="section-lede mt-2">
        {total} pages in total — {products.length} products, {devices.length}{" "}
        devices, {guides.length} guides.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <section>
          <h2 className="section-heading-sm">Main pages</h2>
          <ul className="mt-3 grid grid-cols-2 gap-1 text-sm">
            {staticPages.map((page) => (
              <li key={page.to}>
                <Link to={page.to} className="text-primary hover:underline">
                  {page.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/sitemap" className="text-primary hover:underline">
                Sitemap
              </Link>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="section-heading-sm">Repair services</h2>
          <ul className="mt-3 grid grid-cols-2 gap-1 text-sm">
            {repairServices.map((service) => (
              <li key={service.id}>
                <Link
                  to={`/repairs/${service.id}`}
                  className="text-primary hover:underline"
                >
                  {service.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="lg:col-span-2">
          <h2 className="section-heading-sm">Shop</h2>
          <div className="mt-3 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <div key={category.slug}>
                <Link
                  to={`/${category.slug}`}
                  className="inline-block py-1 text-sm font-semibold text-primary hover:underline"
                >
                  {category.name}
                </Link>
                <ul className="mt-1 space-y-0.5 text-sm">
                  {category.subcategories.map((sub) => (
                    <li key={sub.slug}>
                      <Link
                        to={`/${category.slug}/${sub.slug}`}
                        className="text-ink-600 hover:text-primary hover:underline"
                      >
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="lg:col-span-2">
          <h2 className="section-heading-sm">Brands</h2>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {deviceBrands.map((brand) => (
              <li key={brand}>
                <Link
                  to={`/brand/${brandSlug(brand)}`}
                  className="text-primary hover:underline"
                >
                  {brand}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="lg:col-span-2">
          <h2 className="section-heading-sm">Devices ({devices.length})</h2>
          <div className="mt-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {families.map((group) => (
              <div key={group.family}>
                <p className="text-sm font-semibold">{group.family}</p>
                <ul className="mt-1 space-y-0.5 text-sm">
                  {group.items.map((device) => (
                    <li key={device.slug}>
                      <Link
                        to={`/device/${device.slug}`}
                        className="text-ink-600 hover:text-primary hover:underline"
                      >
                        {device.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="lg:col-span-2">
          <h2 className="section-heading-sm">Guides ({guides.length})</h2>
          <ul className="mt-3 grid gap-1 text-sm sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((guide) => (
              <li key={guide.slug}>
                <Link
                  to={`/guide/${guide.slug}`}
                  className="text-primary hover:underline"
                >
                  {guide.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="lg:col-span-2">
          <h2 className="section-heading-sm">Products ({products.length})</h2>
          <p className="mt-1 text-sm text-ink-500">
            Every product has its own page. Listed here grouped by category.
          </p>
          <div className="mt-3 grid gap-6 lg:grid-cols-2">
            {categories.map((category) => {
              const items = products.filter((p) => p.category === category.slug)
              return (
                <div key={category.slug}>
                  <p className="text-sm font-semibold">
                    {category.name} ({items.length})
                  </p>
                  <ul className="mt-1 grid gap-0.5 text-sm sm:grid-cols-2">
                    {items.map((product) => (
                      <li key={product.id}>
                        <Link
                          to={`/product/${product.id}`}
                          className="text-ink-600 hover:text-primary hover:underline"
                        >
                          {product.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}
