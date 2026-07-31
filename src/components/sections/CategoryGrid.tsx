import { Link } from "react-router-dom"
import { categories } from "../../data/taxonomy"
import { repairServices } from "../../data/services"
import { cx } from "../../lib/cx"
import Icon from "../ui/Icon"

/**
 * Twelve-column grid: the two lead branches get half-width cards with body
 * copy, everything else gets a compact quarter-width tile. Mirrors the
 * information hierarchy — most people arrive wanting a part or a handset.
 */
export default function CategoryGrid() {
  const featured = categories.filter((c) => c.feature)
  const rest = categories.filter((c) => !c.feature)

  return (
    <section className="content-boundary pb-12 md:pb-16">
      {/* The tiles are h3s; without this the page jumps h1 -> h3. */}
      <h2 className="sr-only">Browse by category</h2>
      <div className="grid grid-cols-12 gap-4">
        {featured.map((category) => (
          <div key={category.slug} className="col-span-12 md:col-span-6">
            <article className="group resource-card resource-card-lg h-full">
              <span className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
                <Icon name={category.glyph} className="size-8" />
              </span>
              <div className="min-w-0">
                <h3 className="text-lg font-semibold group-hover:text-primary">
                  <Link to={`/${category.slug}`} className="stretched-link">
                    {category.name}
                  </Link>
                </h3>
                <p className="mt-1 text-sm text-gray-600">{category.cardBlurb}</p>
              </div>
              <Icon
                name="chevronRight"
                className="ml-auto hidden shrink-0 text-gray-400 sm:block"
              />
            </article>
          </div>
        ))}

        {rest.map((category) => (
          <div key={category.slug} className="col-span-6 md:col-span-3">
            <CompactTile
              to={`/${category.slug}`}
              glyph={category.glyph}
              label={category.name}
            />
          </div>
        ))}

        <div className="col-span-6 md:col-span-3">
          <CompactTile to="/repairs" glyph="wrench" label="Book a repair" />
        </div>
        <div className="col-span-6 md:col-span-3">
          <CompactTile to="/sell" glyph="banknote" label="Sell or trade in" />
        </div>
        <div className="col-span-6 md:col-span-3">
          <CompactTile to="/devices" glyph="sliders" label="Find your device" />
        </div>
        <div className="col-span-6 md:col-span-3">
          <CompactTile to="/guides" glyph="toolkit" label="Repair guides" />
        </div>

        {/* Popular repairs get their own row: the fastest route from "my screen
            is cracked" to a price. */}
        {repairServices
          .filter((service) => service.popular)
          .map((service) => (
            <div key={service.id} className="col-span-6 md:col-span-3">
              <CompactTile
                to={`/repairs/${service.id}`}
                glyph={service.glyph}
                label={service.name}
                hint={`from £${service.fromPrice}`}
              />
            </div>
          ))}
      </div>
    </section>
  )
}

function CompactTile({
  to,
  glyph,
  label,
  hint,
  className,
}: {
  to: string
  glyph: Parameters<typeof Icon>[0]["name"]
  label: string
  hint?: string
  className?: string
}) {
  return (
    <article className={cx("group resource-card h-full gap-3", className)}>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-700 group-hover:bg-brand-50 group-hover:text-brand-500">
        <Icon name={glyph} />
      </span>
      <div className="min-w-0">
        <h3 className="truncate text-sm font-semibold group-hover:text-primary">
          <Link to={to} className="stretched-link">
            {label}
          </Link>
        </h3>
        {hint ? <p className="text-xs text-gray-600">{hint}</p> : null}
      </div>
    </article>
  )
}
