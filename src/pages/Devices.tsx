import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  brandSlug,
  deviceBrands,
  devices,
  devicesByFamily,
} from "../data/devices"
import { partsForDevice } from "../data/parts"
import { cx } from "../lib/cx"
import Breadcrumbs from "../components/ui/Breadcrumbs"
import Icon from "../components/ui/Icon"

export default function Devices() {
  const [query, setQuery] = useState("")
  const [brand, setBrand] = useState<string | null>(null)

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = devices.filter(
      (d) =>
        (!brand || d.brand === brand) &&
        (!q || d.name.toLowerCase().includes(q)),
    )
    return devicesByFamily(filtered)
  }, [query, brand])

  const total = groups.reduce((sum, g) => sum + g.items.length, 0)

  return (
    <>
      <div className="border-b border-line bg-white">
        <div className="content-boundary py-8 md:py-10">
          <Breadcrumbs
            trail={[{ label: "Home", to: "/" }, { label: "Devices" }]}
          />
          <h1 className="section-heading mt-4">Find your device</h1>
          <p className="section-lede mt-2">
            {devices.length} models we stock parts for and repair in store. Pick
            yours to see every part that fits it and what a fitted repair costs.
          </p>

          <div className="mt-6 max-w-md">
            <label className="sr-only" htmlFor="device-filter">
              Filter devices
            </label>
            <div className="relative">
              <Icon
                name="search"
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-500"
              />
              <input
                id="device-filter"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. iPhone 13, Galaxy S23, Pixel 7"
                className="field pl-10"
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setBrand(null)}
              aria-pressed={brand === null}
              className={cx(
                "btn btn-sm",
                brand === null ? "btn-primary" : "btn-outline",
              )}
            >
              All brands
            </button>
            {deviceBrands.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setBrand(b === brand ? null : b)}
                aria-pressed={b === brand}
                className={cx(
                  "btn btn-sm",
                  b === brand ? "btn-primary" : "btn-outline",
                )}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="content-boundary py-10">
        <p className="text-sm text-ink-500" role="status">
          {total} {total === 1 ? "model" : "models"}
        </p>

        {total === 0 ? (
          <p className="mt-8 border border-line bg-white p-8 text-center">
            No model matched. We service more than we list —{" "}
            <Link to="/about" className="text-primary hover:underline">
              ask us
            </Link>{" "}
            and we will check.
          </p>
        ) : (
          <div className="mt-6 space-y-10">
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
                              name={
                                device.kind === "tablet" ? "screen" : "phone"
                              }
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
        )}
      </div>

      <section className="border-t border-line bg-white">
        <div className="content-boundary py-12">
          <h2 className="section-heading-sm text-xl md:text-2xl">
            Browse by brand
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {deviceBrands.map((b) => (
              <li key={b}>
                <Link
                  to={`/brand/${brandSlug(b)}`}
                  className="btn btn-outline btn-md"
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
