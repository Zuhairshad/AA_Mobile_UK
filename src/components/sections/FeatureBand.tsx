import { Link } from "react-router-dom"
import { repairServices } from "../../data/services"
import { products } from "../../data/catalogue"
import { formatPrice } from "../../lib/format"
import ProductImage from "../product/ProductImage"
import SectionHead from "./SectionHead"
import { buttonClass } from "../ui/Button"

/**
 * The dark band: three repair cards, each a window frame around the part the
 * repair fits, with the price and the service name under it.
 *
 * This single band replaces three alternating photo-and-text sections and the
 * empty navy panel that sat where an image should have been. One dark stretch in
 * the page reads as deliberate; five of them read as a template.
 */
export default function FeatureBand() {
  // Popular ones lead, then fill to three so the row always resolves — only two
  // services are flagged popular, and a lone card next to a gap is exactly the
  // kind of half-built row this rebuild is meant to remove.
  const featured = [...repairServices]
    .sort((a, b) => Number(Boolean(b.popular)) - Number(Boolean(a.popular)))
    .slice(0, 3)
  if (featured.length === 0) return null

  return (
    <section className="bg-dark">
      <div className="content-boundary section-y flex flex-col gap-10 md:gap-12">
        <SectionHead
          invert
          label="Repairs while you wait"
          heading="Or let us fit it"
          lede="Free diagnostic first, a fixed price before we start, and twelve months on the work. Walk in or book a slot."
        />

        {/* Three equal cards, not one wide card over two half-width ones. The
            part drawings are square, so the full-width lead spent a 1376×478
            frame on a 430px drawing — two thirds of it empty black — and at
            phone width the same card left the image 118px of height to live in.
            Equal cells keep every drawing at the same scale at every width.

            Three across only from lg. At md the same row gave each card 229px,
            which put the drawings back down to 124px tall — the tablet range is
            better served by three stacked cards at full width. */}
        <div className="grid gap-4 lg:grid-cols-3">
          {featured.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
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

function ServiceCard({ service }: { service: (typeof repairServices)[number] }) {
  // Show the part the repair actually fits, so the card carries a real object
  // rather than an icon.
  const sub = service.partKind
    ? subcategoryForPartKind[service.partKind]
    : undefined
  const face = sub
    ? products.find((p) => p.category === "parts" && p.subcategory === sub)
    : undefined

  /**
   * Header, image, caption — three blocks in normal flow.
   *
   * Every part of this card used to be absolutely positioned inside one
   * fixed-aspect box: the image was inset to `bottom-24` to leave room for the
   * title, and the symptom line was pinned at `top-11` over the image. Neither
   * offset knows how tall the card actually is, so at phone width the image was
   * squeezed to 118px and the symptom line landed on top of the drawing. In flow
   * the image keeps its own aspect ratio and the text blocks take the height
   * they need, at any width.
   */
  return (
    <article className="group relative flex flex-col overflow-hidden bg-dark-card">
      <div className="flex flex-col gap-3 px-6 pt-5">
        {/* Window chrome, straight off the reference's work cards. Decorative
            only, so it is out of the accessibility tree. */}
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="size-2 rounded-full bg-[#e0564a]" />
          <span className="size-2 rounded-full bg-[#4a4a4a]" />
          <span className="size-2 rounded-full bg-[#3fa855]" />
        </div>
        {/* Two clamped lines with a floor, so a long symptom list wraps instead
            of being cut mid-word and all three cards line their images up. */}
        <p className="micro-label micro-label-invert line-clamp-3 min-h-8 leading-4 lg:line-clamp-2">
          {service.blurb.split(".")[0]}
        </p>
      </div>

      {/* Drawn, not photographed. The photographs are shot on white and this card
          is black, so a photo arrives as a bright panel between the black header
          and the black caption — three bands of alternating tone instead of one
          object. The drawings carry no background and sit on the card. */}
      <div className="relative aspect-[4/3] w-full">
        {face ? <ProductImage product={face} drawn /> : null}
      </div>

      <div className="mt-auto flex flex-col gap-2 px-6 pb-6">
        <p className="micro-label micro-label-invert">
          From {formatPrice(service.fromPrice)} · {service.turnaround}
        </p>
        <h3 className="section-heading-sm text-xl text-white md:text-2xl">
          <Link to={`/repairs/${service.id}`} className="stretched-link">
            {service.name}
          </Link>
        </h3>
      </div>
    </article>
  )
}
