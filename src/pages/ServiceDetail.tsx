import { Link, useParams } from "react-router-dom"
import { repairServices } from "../data/services"
import { devices } from "../data/devices"
import { partId, repairPrice } from "../data/parts"
import { productById } from "../data/catalogue"
import { guides } from "../data/guides"
import { formatPrice } from "../lib/format"
import Accordion from "../components/ui/Accordion"
import Badge from "../components/ui/Badge"
import Breadcrumbs from "../components/ui/Breadcrumbs"
import Icon from "../components/ui/Icon"
import { buttonClass } from "../components/ui/Button"
import ValueProps from "../components/sections/ValueProps"
import NotFound from "./NotFound"

const faqs = [
  {
    q: "Do I need an appointment?",
    a: "No. Walk-ins are welcome and we work through them in order. Booking a slot online just means you skip the queue at busy times.",
  },
  {
    q: "Is the price on this page what I will pay?",
    a: "Yes, unless the diagnostic turns up a second fault — in which case we tell you before we start and you decide. We do not add anything after the fact.",
  },
  {
    q: "What is guaranteed?",
    a: "Twelve months on both the part and the labour. If the same fault comes back in normal use there is no diagnostic fee and no argument.",
  },
  {
    q: "Can I supply my own part?",
    a: "Yes. We will fit a part you bought elsewhere, but the 12-month guarantee then covers our labour only — we cannot stand behind a component we have not tested.",
  },
]

export default function ServiceDetail() {
  const { service: slug } = useParams<{ service: string }>()
  const service = repairServices.find((s) => s.id === slug)

  if (!service) return <NotFound />

  // Devices this repair is priced for, cheapest first.
  const priced = service.partKind
    ? devices
        .filter((d) => d.parts.includes(service.partKind!))
        .map((device) => ({
          device,
          fitted: repairPrice(device, service.partKind!),
          part: productById.get(partId(device, service.partKind!)),
        }))
        .sort((a, b) => a.fitted - b.fitted)
    : []

  const relatedGuides = service.partKind
    ? guides.filter((g) => g.partKind === service.partKind)
    : []

  const cheapest = priced.length > 0 ? priced[0].fitted : service.fromPrice

  return (
    <>
      <section className="bg-dark">
        <div className="content-boundary py-14 md:py-20">
          <Breadcrumbs
            tone="light"
            trail={[
              { label: "Home", to: "/" },
              { label: "Repairs", to: "/repairs" },
              { label: service.name },
            ]}
          />
          <h1 className="font-display mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
            {service.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-dark-muted md:text-xl">
            {service.blurb}
          </p>

          <dl className="mt-8 flex flex-wrap gap-x-12 gap-y-4 text-white">
            <div>
              <dt className="text-sm text-brand-200">Price</dt>
              <dd className="mt-1 font-mono text-2xl font-bold">
                {service.fromPrice === 0
                  ? "Free"
                  : `from ${formatPrice(cheapest)}`}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-brand-200">Turnaround</dt>
              <dd className="mt-1 font-mono text-2xl font-bold">
                {service.turnaround.split(",")[0]}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-brand-200">Guarantee</dt>
              <dd className="mt-1 font-mono text-2xl font-bold">12 months</dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/repairs#book"
              className={buttonClass("outline", "lg", "border-transparent")}
            >
              Book this repair
            </Link>
            <Link
              to="/devices"
              className={buttonClass(
                "ghost",
                "lg",
                "text-white hover:bg-white/10",
              )}
            >
              Find your device
            </Link>
          </div>
        </div>
      </section>

      <div className="content-boundary grid gap-10 py-12 lg:grid-cols-3 lg:gap-16">
        <div className="min-w-0 lg:col-span-2">
          <h2 className="section-heading-sm text-xl md:text-2xl">
            What this covers
          </h2>
          <div className="prose-body mt-4">
            {(service.detail ?? [service.blurb]).map((para) => (
              <p key={para}>{para}</p>
            ))}
          </div>

          <p className="mt-6 text-sm text-ink-500">
            Devices covered: {service.covers.join(" · ")}
          </p>

          {priced.length > 0 ? (
            <section className="mt-10">
              <h2 className="section-heading-sm text-xl md:text-2xl">
                Price by model
              </h2>
              <p className="prose-body mt-2 text-sm">
                {priced.length} models priced. Fitted prices include the part,
                the labour and the guarantee.
              </p>
              <div className="mt-5 overflow-x-auto border border-line bg-white">
                <table className="w-full min-w-120 text-sm">
                  <thead className="bg-muted text-left">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Model
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Part only
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Fitted
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {priced.map(({ device, fitted, part }) => (
                      <tr key={device.slug}>
                        <th
                          scope="row"
                          className="px-4 py-3 text-left font-medium"
                        >
                          <Link
                            to={`/device/${device.slug}`}
                            className="hover:text-primary hover:underline"
                          >
                            {device.name}
                          </Link>
                        </th>
                        <td className="px-4 py-3">
                          {part ? (
                            <Link
                              to={`/product/${part.id}`}
                              className="hover:text-primary hover:underline"
                            >
                              {formatPrice(part.price)}
                            </Link>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="px-4 py-3 font-semibold">
                          {formatPrice(fitted)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          <section className="mt-10">
            <h2 className="section-heading-sm text-xl md:text-2xl">
              Questions
            </h2>
            <div className="mt-4">
              <Accordion items={faqs} />
            </div>
          </section>
        </div>

        <aside className="min-w-0 lg:col-span-1">
          {service.includes ? (
            <section className="border border-line bg-white p-5">
              <h2 className="section-heading-sm">What is included</h2>
              <ul className="mt-4 space-y-2">
                {service.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <Icon
                      name="check"
                      className="mt-0.5 size-4 shrink-0 text-green-600"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {relatedGuides.length > 0 ? (
            <section className="mt-6 border border-brand-200 bg-muted p-5">
              <h2 className="text-lg font-semibold text-brand-900">
                Or do it yourself
              </h2>
              <p className="mt-2 text-sm text-brand-800">
                We publish the same process we follow on the bench, and sell the
                parts at the price we pay for them.
              </p>
              <ul className="mt-4 space-y-2">
                {relatedGuides.map((guide) => (
                  <li key={guide.slug}>
                    <Link
                      to={`/guide/${guide.slug}`}
                      className="flex items-center justify-between gap-2 bg-white p-3 text-sm font-medium hover:text-primary"
                    >
                      <span className="min-w-0 flex-1 truncate">
                        {guide.title}
                      </span>
                      <Badge tone="gray" size="sm">
                        {guide.difficulty}
                      </Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="mt-6">
            <h2 className="section-heading-sm">Other repairs</h2>
            <ul className="mt-3 space-y-2">
              {repairServices
                .filter((s) => s.id !== service.id)
                .map((other) => (
                  <li key={other.id}>
                    <Link
                      to={`/repairs/${other.id}`}
                      className="flex items-center justify-between gap-2 border border-line bg-white p-3 text-sm font-medium hover:border-ink-400 hover:text-primary"
                    >
                      <span className="flex items-center gap-2">
                        <Icon
                          name={other.glyph}
                          className="size-4 text-ink-950"
                        />
                        {other.name}
                      </span>
                      <span className="text-xs text-ink-500">
                        {other.fromPrice === 0
                          ? "Free"
                          : `from £${other.fromPrice}`}
                      </span>
                    </Link>
                  </li>
                ))}
            </ul>
          </section>
        </aside>
      </div>

      <ValueProps />
    </>
  )
}
