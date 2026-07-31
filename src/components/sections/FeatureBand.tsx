import { Link } from "react-router-dom"
import { repairServices } from "../../data/services"
import { products } from "../../data/catalogue"
import { formatPrice } from "../../lib/format"
import ProductImage from "../product/ProductImage"
import SectionHead from "./SectionHead"
import { buttonClass } from "../ui/Button"

/**
 * The dark band: one full-width feature card and two half-width ones, each a
 * large image with the title lying over its bottom-left corner.
 *
 * This single band replaces three alternating photo-and-text sections and the
 * empty navy panel that sat where an image should have been. One dark stretch in
 * the page reads as deliberate; five of them read as a template.
 */
export default function FeatureBand() {
  // Popular ones lead, then fill to three so the one-plus-two layout always
  // resolves — only two services are flagged popular, and a lone half-width
  // card next to a gap is exactly the kind of half-built row this rebuild is
  // meant to remove.
  const featured = [...repairServices]
    .sort((a, b) => Number(Boolean(b.popular)) - Number(Boolean(a.popular)))
    .slice(0, 3)
  if (featured.length === 0) return null

  const [lead, ...rest] = featured

  return (
    <section className="bg-dark">
      <div className="content-boundary section-y flex flex-col gap-10 md:gap-12">
        <SectionHead
          invert
          label="Repairs while you wait"
          heading="Or let us fit it"
          lede="Free diagnostic first, a fixed price before we start, and twelve months on the work. Walk in or book a slot."
        />

        <div className="flex flex-col gap-4">
          <ServiceCard service={lead} tall />
          <div className="grid gap-4 md:grid-cols-2">
            {rest.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <Link to="/repairs" className={buttonClass("invert", "lg")}>
            All repair services
          </Link>
        </div>
      </div>
    </section>
  )
}

/** Which parts subcategory a service's part kind lives in. */
const subcategoryForPartKind: Record<string, string> = {
  screen: "screens",
  battery: "batteries",
  charging: "charging",
  "rear-camera": "cameras",
  "front-camera": "cameras",
  "back-glass": "housings",
  speaker: "audio",
}

function ServiceCard({
  service,
  tall,
}: {
  service: (typeof repairServices)[number]
  tall?: boolean
}) {
  // Show the part the repair actually fits, so the card carries a real object
  // rather than an icon.
  const sub = service.partKind
    ? subcategoryForPartKind[service.partKind]
    : undefined
  const face = sub
    ? products.find((p) => p.category === "parts" && p.subcategory === sub)
    : undefined

  return (
    <article className="group relative flex flex-col justify-end overflow-hidden bg-dark-card">
      <div
        className={
          "relative w-full " +
          (tall ? "aspect-[16/9] md:aspect-[21/9]" : "aspect-[4/3]")
        }
      >
        {/* The image gets the frame minus the caption's own band. Filling the
            whole frame ran the artwork behind the title, so a battery looked
            cropped at the card's bottom edge. */}
        <div className="absolute inset-x-0 top-0 bottom-24 md:bottom-28">
          {face ? <ProductImage product={face} /> : null}
        </div>
        {/* Scrim so the title stays legible over the light artwork field. */}
        <div
          className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/70 to-transparent"
          aria-hidden="true"
        />
        <div className="media-caption">
          <p className="micro-label micro-label-invert">
            From {formatPrice(service.fromPrice)} · {service.turnaround}
          </p>
          <h3 className="section-heading text-2xl text-white md:text-3xl">
            <Link to={`/repairs/${service.id}`} className="stretched-link">
              {service.name}
            </Link>
          </h3>
        </div>
      </div>
    </article>
  )
}
