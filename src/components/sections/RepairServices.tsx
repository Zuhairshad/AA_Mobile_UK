import { Link } from "react-router-dom"
import { repairServices } from "../../data/services"
import { formatPrice } from "../../lib/format"
import Badge from "../ui/Badge"
import Icon from "../ui/Icon"
import { buttonClass } from "../ui/Button"

type Props = {
  /** Home page shows a trimmed set; the repairs page shows everything. */
  limit?: number
  showHeading?: boolean
}

export default function RepairServices({ limit, showHeading = true }: Props) {
  const services = limit ? repairServices.slice(0, limit) : repairServices

  return (
    <section className="section-y">
      <div className="content-boundary">
        {showHeading ? (
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <h2 className="section-heading">Repairs while you wait</h2>
            <p className="section-lede mt-4">
              Free diagnostic first, a fixed price before we start, and twelve
              months on the work. Walk in or book a slot.
            </p>
          </div>
        ) : (
          <h2 className="sr-only">Repair services</h2>
        )}

        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <li key={service.id} id={service.id} className="scroll-mt-32">
              <article className="flex h-full flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-500">
                    <Icon name={service.glyph} className="size-6" />
                  </span>
                  {service.popular ? (
                    <Badge tone="amber" icon="sparkle" size="sm">
                      Most booked
                    </Badge>
                  ) : null}
                </div>

                <h3 className="text-lg font-semibold">{service.name}</h3>
                <p className="text-sm text-gray-600">{service.blurb}</p>

                <dl className="mt-1 space-y-1 text-sm">
                  <div className="flex gap-2">
                    <dt className="text-gray-500">Price</dt>
                    <dd className="font-semibold">
                      {service.fromPrice === 0
                        ? "Free"
                        : `from ${formatPrice(service.fromPrice)}`}
                    </dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="text-gray-500">Turnaround</dt>
                    <dd>{service.turnaround}</dd>
                  </div>
                </dl>

                <p className="mt-1 text-xs text-gray-500">
                  Covers {service.covers.join(" · ")}
                </p>

                <Link
                  to={`/repairs/${service.id}`}
                  className={buttonClass("outline", "sm", "mt-auto")}
                >
                  Prices and details
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
