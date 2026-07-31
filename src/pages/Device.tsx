import { Link, useParams } from "react-router-dom"
import {
  brandSlug,
  deviceBySlug,
  devices,
  partKindLabels,
  type PartKind,
} from "../data/devices"
import { partId, partsForDevice, repairPrice } from "../data/parts"
import { guidesForDevice, difficultyTone } from "../data/guides"
import { productById, products } from "../data/catalogue"
import { formatPrice } from "../lib/format"
import Badge from "../components/ui/Badge"
import Breadcrumbs from "../components/ui/Breadcrumbs"
import Icon from "../components/ui/Icon"
import { buttonClass } from "../components/ui/Button"
import ProductGrid from "../components/product/ProductGrid"
import NotFound from "./NotFound"

/** Turnaround quoted per repair type, matching the in-store service times. */
const turnaround: Record<PartKind, string> = {
  screen: "45 minutes, while you wait",
  battery: "30 minutes, while you wait",
  charging: "Same day",
  "rear-camera": "Same day",
  "front-camera": "Same day",
  "back-glass": "1 – 2 working days",
  speaker: "Same day",
}

export default function Device() {
  const { slug } = useParams<{ slug: string }>()
  const device = slug ? deviceBySlug.get(slug) : undefined

  if (!device) return <NotFound />

  const parts = partsForDevice(device)
  const guides = guidesForDevice(device)

  // If we also sell this handset, link the listing and quote a trade-in.
  const forSale = products.find(
    (p) =>
      p.category === "phones" &&
      p.name === device.name.replace(/^Samsung |^Google /, ""),
  )
  const tradeIn = forSale
    ? Math.round((forSale.price * 0.45) / 5) * 5
    : undefined

  const siblings = devices
    .filter((d) => d.family === device.family && d.slug !== device.slug)
    .sort((a, b) => b.year - a.year)

  return (
    <>
      <div className="border-b border-line bg-white">
        <div className="content-boundary py-8 md:py-10">
          <Breadcrumbs
            trail={[
              { label: "Home", to: "/" },
              { label: "Devices", to: "/devices" },
              { label: device.brand, to: `/brand/${brandSlug(device.brand)}` },
              { label: device.name },
            ]}
          />

          <h1 className="section-heading mt-4">{device.name}</h1>
          <p className="section-lede mt-2">
            Parts, repairs and prices for the {device.name}. Everything on this
            page fits this model specifically.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge tone="gray">{device.brand}</Badge>
            <Badge tone="gray">Released {device.year}</Badge>
            <Badge tone="gray">
              {device.panel === "oled" ? "OLED display" : "LCD display"}
            </Badge>
            <Badge tone="gray">
              {device.kind === "tablet" ? "Tablet" : "Phone"}
            </Badge>
            <Badge tone="brand" icon="shield">
              12-month guarantee
            </Badge>
          </div>

          {device.notes ? (
            <p className="mt-5 flex max-w-3xl items-start gap-2 border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <Icon name="sparkle" className="mt-0.5 size-4 shrink-0" />
              <span>{device.notes}</span>
            </p>
          ) : null}
        </div>
      </div>

      {/* Repair pricing table: the answer most visitors actually came for. */}
      <section className="section-y">
        <div className="content-boundary">
          <h2 className="section-heading-sm text-xl md:text-2xl">
            {device.name} repair prices
          </h2>
          <p className="prose-body mt-2 max-w-3xl text-sm">
            Fitted prices include the part, the labour and the guarantee. Buy
            the part on its own if you would rather do it yourself — the
            diagnostic is free either way.
          </p>

          <div className="mt-6 overflow-x-auto border border-line bg-white">
            <table className="w-full min-w-160 text-sm">
              <thead className="bg-muted text-left">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Repair
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Part only
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Fitted in store
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Turnaround
                  </th>
                  <th scope="col" className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {device.parts.map((kind) => {
                  const part = productById.get(partId(device, kind))
                  return (
                    <tr key={kind}>
                      <th
                        scope="row"
                        className="px-4 py-3 text-left font-medium"
                      >
                        {partKindLabels[kind]}
                      </th>
                      <td className="px-4 py-3">
                        {part ? formatPrice(part.price) : "—"}
                      </td>
                      <td className="px-4 py-3 font-semibold">
                        {formatPrice(repairPrice(device, kind))}
                      </td>
                      <td className="px-4 py-3 text-ink-500">
                        {turnaround[kind]}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {part ? (
                          <Link
                            to={`/product/${part.id}`}
                            className="font-medium text-primary hover:underline"
                          >
                            View part
                          </Link>
                        ) : null}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/repairs#book" className={buttonClass("primary", "md")}>
              Book a repair for this model
            </Link>
            {tradeIn ? (
              <Link to="/sell" className={buttonClass("outline", "md")}>
                Trade it in — around {formatPrice(tradeIn)}
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <section className="section-y bg-muted">
        <div className="content-boundary">
          <h2 className="section-heading-sm text-xl md:text-2xl">
            What usually goes wrong with the {device.name}
          </h2>
          <ul className="mt-4 grid gap-3 md:grid-cols-3">
            {device.commonFaults.map((fault) => (
              <li
                key={fault}
                className="flex items-start gap-2 border border-line bg-white p-4 text-sm"
              >
                <Icon
                  name="wrench"
                  className="mt-0.5 size-4 shrink-0 text-ink-950"
                />
                {fault}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {parts.length > 0 ? (
        <section className="section-y">
          <div className="content-boundary">
            <h2 className="section-heading-sm text-xl md:text-2xl">
              Parts that fit the {device.name}
            </h2>
            <p className="prose-body mt-2 text-sm">
              {parts.length} {parts.length === 1 ? "part" : "parts"}, each
              tested before dispatch.
            </p>
            <div className="mt-6">
              <ProductGrid products={parts} />
            </div>
          </div>
        </section>
      ) : null}

      {guides.length > 0 ? (
        <section className="section-y bg-muted">
          <div className="content-boundary">
            <h2 className="section-heading-sm text-xl md:text-2xl">
              Guides for the {device.name}
            </h2>
            <ul className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {guides.map((guide) => (
                <li key={guide.slug}>
                  <article className="group resource-card h-full flex-col items-start gap-2">
                    <div className="flex w-full items-center justify-between gap-2">
                      <Badge tone={difficultyTone[guide.difficulty]} size="sm">
                        {guide.difficulty}
                      </Badge>
                      <span className="flex items-center gap-1 text-xs text-ink-500">
                        <Icon name="clock" className="size-3.5" />
                        {guide.time}
                      </span>
                    </div>
                    <h3 className="font-semibold group-hover:text-primary">
                      <Link
                        to={`/guide/${guide.slug}`}
                        className="stretched-link"
                      >
                        {guide.title}
                      </Link>
                    </h3>
                    <p className="line-clamp-3 text-sm text-ink-500">
                      {guide.summary}
                    </p>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {siblings.length > 0 ? (
        <section className="section-y">
          <div className="content-boundary">
            <h2 className="section-heading-sm text-xl md:text-2xl">
              Other {device.family} models
            </h2>
            <ul className="mt-5 flex flex-wrap gap-2">
              {siblings.map((sibling) => (
                <li key={sibling.slug}>
                  <Link
                    to={`/device/${sibling.slug}`}
                    className={buttonClass("outline", "sm")}
                  >
                    {sibling.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  )
}
