import { useEffect, useRef, useState } from "react"
import { Link, useParams } from "react-router-dom"
import {
  badgeMeta,
  badgesFor,
  boughtTogether,
  productById,
  relatedTo,
} from "../data/catalogue"
import { categoryBySlug, subcategoryName } from "../data/taxonomy"
import { formatPrice } from "../lib/format"
import { useCart } from "../lib/cart"
import { useToast } from "../lib/toast"
import { recentlyViewed, recordView } from "../lib/recentlyViewed"
import Accordion from "../components/ui/Accordion"
import Badge from "../components/ui/Badge"
import Breadcrumbs from "../components/ui/Breadcrumbs"
import Button, { buttonClass } from "../components/ui/Button"
import Icon from "../components/ui/Icon"
import PriceTag from "../components/ui/PriceTag"
import QuantityStepper from "../components/ui/QuantityStepper"
import Rating from "../components/ui/Rating"
import FeaturedProducts from "../components/sections/FeaturedProducts"
import ProductImage from "../components/product/ProductImage"
import { partPhotoFor } from "../data/partPhotos"
import NotFound from "./NotFound"

const stockCopy = {
  in: {
    tone: "green" as const,
    label: "In stock",
    detail: "Dispatched from Birmingham within 24 hours on working days.",
  },
  low: {
    tone: "amber" as const,
    label: "Low stock",
    detail: "Only a few left. Order before 3pm for same-day dispatch.",
  },
  out: {
    tone: "gray" as const,
    label: "Out of stock",
    detail:
      "Back in stock within 7 – 10 days. Nothing is charged until we ship.",
  },
}

export default function Product() {
  const { id } = useParams<{ id: string }>()
  const product = id ? productById.get(id) : undefined
  const { add, openDrawer } = useCart()
  const { push } = useToast()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [showStickyBar, setShowStickyBar] = useState(false)
  const buyRow = useRef<HTMLDivElement>(null)

  // Reset the quantity when navigating between products, otherwise a "3" from
  // the last item silently carries over to the next one.
  useEffect(() => {
    setQty(1)
    setAdded(false)
  }, [id])

  useEffect(() => {
    if (id) recordView(id)
  }, [id])

  /**
   * Sticky buy bar appears once the real one has scrolled up behind the header.
   *
   * Sampled on scroll rather than with an IntersectionObserver on purpose: an
   * observer only reports threshold *crossings*, and at the moment of crossing
   * the row is still just below the viewport top, so a "has it gone past yet"
   * test evaluated in the callback is always false and never re-runs.
   */
  useEffect(() => {
    let frame = 0
    const measure = () => {
      frame = 0
      const el = buyRow.current
      if (!el) return
      setShowStickyBar(el.getBoundingClientRect().bottom < 72)
    }
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [id])

  if (!product) return <NotFound />

  const category = categoryBySlug.get(product.category)
  const subName = subcategoryName(product.category, product.subcategory)
  const photoMatch = product.partOf
    ? partPhotoFor(product.partOf.device, product.partOf.kind)?.match
    : undefined
  const stock = stockCopy[product.stock]
  const soldOut = product.stock === "out"
  const badges = badgesFor(product)
  const pairs = boughtTogether(product)
  const related = relatedTo(product)

  /**
   * The mono label/value strip under the banner, mirroring the reference
   * template's "ROLE IN PROJECT / PROJECT YEAR" meta row. Four cells so the row
   * divides evenly at every breakpoint.
   */
  const metaStrip = [
    { label: "Price", value: formatPrice(product.price) },
    { label: "Category", value: subName ?? category?.name ?? "Shop" },
    {
      label: "Availability",
      value: stock.label,
    },
    {
      label: product.compatibility?.length ? "Fits" : "Guarantee",
      value: product.compatibility?.length
        ? `${product.compatibility.length} model${product.compatibility.length === 1 ? "" : "s"}`
        : "12 months",
    },
  ]

  const faqs = [
    {
      q: "What does the 12-month guarantee cover?",
      a: "Any failure in normal use. We replace the item and there is no diagnostic fee on a guarantee claim. It does not cover new physical damage or liquid ingress.",
    },
    {
      q: "How fast will it arrive?",
      a: "Orders placed before 3pm on a working day are dispatched the same day. Free over £65, otherwise £3.95 tracked 48 or £5.95 next day.",
    },
    product.fittingAvailable
      ? {
          q: "Can you fit this for me?",
          a: "Yes. Bring it to the Birmingham shop or order it to us, and we will deduct the price of the part from the repair quote so you are not paying for it twice.",
        }
      : {
          q: "Can I return it if I change my mind?",
          a: "You have 30 days from delivery. Unopened items are refunded in full; opened items are refunded less any loss of value, as the Consumer Contracts Regulations allow.",
        },
  ]

  const recent = recentlyViewed(product.id)

  const addToCart = () => {
    add(product.id, qty)
    setAdded(true)
    push({
      title: qty > 1 ? `${qty} added to basket` : "Added to basket",
      detail: product.name,
      action: { label: "View basket", to: "/cart" },
    })
    window.setTimeout(() => setAdded(false), 2500)
  }

  return (
    <>
      <div className="content-boundary pt-6">
        <Breadcrumbs
          trail={[
            { label: "Home", to: "/" },
            { label: category?.name ?? "Shop", to: `/${product.category}` },
            ...(subName
              ? [
                  {
                    label: subName,
                    to: `/${product.category}?type=${product.subcategory}`,
                  },
                ]
              : []),
            { label: product.name },
          ]}
        />
      </div>

      {/* Wide banner image, a black caption slab under it, then the mono
          label/value meta strip — the reference template's detail-page opening.
          A square image in a half-width column was a shop layout wearing the
          design's clothes; this is the design's own composition.

          The name sits in the slab rather than over the picture. It was over the
          picture, on a gradient scrim, and the scrim had to be dark enough for
          white type — so the bottom half of every product faded into black. A
          solid band keeps the type legible without touching the photograph. */}
      <div className="content-boundary pt-4">
        {/* Slab beside the image on desktop, under it on mobile. A full-width
            21/9 banner put a 590px band of empty grey either side of a centred
            product and pushed the price below the fold; this spends the same
            width on the name instead. */}
        <div className="md:grid md:grid-cols-[2fr_1fr]">
          <div className="relative">
            <div className="media-frame aspect-[4/3] md:aspect-[16/10]">
              <ProductImage product={product} priority />
            </div>

            {/* Said out loud when the photograph is of the same component from a
                near neighbour rather than this exact model. A battery or a
                charging flex is the same object across a maker's range, but the
                customer should not have to work out that the picture is a
                stand-in. */}
            {photoMatch && photoMatch !== "exact" ? (
              <p className="micro-label absolute bottom-3 left-3 bg-white/85 px-2 py-1.5">
                Representative image
              </p>
            ) : null}
          </div>

          <div className="flex flex-col justify-end bg-ink-950 px-6 py-6 md:px-8 md:py-8">
            <p className="micro-label text-white">
              {product.brand}
              {subName ? ` // ${subName}` : ""}
            </p>
            <h1 className="section-heading mt-3 text-white">{product.name}</h1>
          </div>
        </div>

        <dl className="grid grid-cols-2 border-b border-line md:grid-cols-4">
          {metaStrip.map((item, i) => (
            <div
              key={item.label}
              className={
                "flex flex-col gap-1.5 py-5 " +
                (i % 2 === 1 ? "border-l border-line pl-4 " : "") +
                (i > 1 ? "border-t border-line md:border-t-0 " : "") +
                (i > 0 ? "md:border-l md:pl-4" : "")
              }
            >
              <dt className="micro-label">{item.label}</dt>
              <dd className="figure m-0 text-base font-extrabold">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="content-boundary grid gap-10 py-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div className="prose-body min-w-0">
          <p className="text-lg text-ink-800">{product.blurb}</p>
          {product.description?.map((para) => <p key={para}>{para}</p>)}
        </div>

        <div className="flex min-w-0 flex-col gap-5">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Rating value={product.rating} />
            <span className="text-sm text-ink-500">
              {product.rating} out of 5 · {product.reviews} reviews
            </span>
          </div>

          <PriceTag
            price={product.price}
            compareAt={product.compareAt}
            size="lg"
          />

          <div className="flex flex-wrap gap-2">
            {badges.map((key) => (
              <Badge
                key={key}
                tone={badgeMeta[key].tone}
                icon={badgeMeta[key].icon}
              >
                {badgeMeta[key].label}
              </Badge>
            ))}
            {product.grade ? (
              <Badge tone="gray">Grade {product.grade}</Badge>
            ) : null}
          </div>

          <div className="border border-line bg-white p-4">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <span
                className={
                  product.stock === "out"
                    ? "size-2 rounded-full bg-ink-400"
                    : product.stock === "low"
                      ? "size-2 rounded-full bg-amber-500"
                      : "size-2 rounded-full bg-green-600"
                }
                aria-hidden="true"
              />
              {stock.label}
            </p>
            <p className="mt-1 text-sm text-ink-500">{stock.detail}</p>
          </div>

          <div ref={buyRow} className="flex flex-wrap items-center gap-3">
            <QuantityStepper value={qty} onChange={setQty} />
            <Button
              size="lg"
              variant={soldOut ? "outline" : "primary"}
              disabled={soldOut}
              onClick={addToCart}
              className="min-w-44 flex-1 sm:flex-none"
            >
              {soldOut ? (
                "Out of stock"
              ) : added ? (
                <>
                  <Icon name="check" className="size-5" />
                  Added to basket
                </>
              ) : (
                `Add to basket · ${formatPrice(product.price * qty)}`
              )}
            </Button>
          </div>

          {added ? (
            <p role="status" className="text-sm">
              <Link
                to="/cart"
                className="font-medium text-primary hover:underline"
              >
                View basket and check out →
              </Link>
            </p>
          ) : null}

          {product.fittingAvailable ? (
            <div className="flex items-start gap-3 border border-brand-200 bg-muted p-4">
              <Icon
                name="wrench"
                className="mt-0.5 size-5 shrink-0 text-brand-600"
              />
              <div className="text-sm">
                <p className="font-semibold text-brand-900">
                  Would rather we fitted it?
                </p>
                <p className="mt-1 text-brand-800">
                  We deduct the price of the part from the repair quote, so you
                  are not paying for it twice.
                </p>
                <Link
                  to="/repairs#book"
                  className="mt-2 inline-block py-1 font-medium text-primary hover:underline"
                >
                  Book a fitting →
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="content-boundary grid gap-10 py-8 lg:grid-cols-3 lg:gap-16">
        <div className="min-w-0 lg:col-span-2">
          {product.includes ? (
            <section>
              <h2 className="section-heading-sm text-xl md:text-2xl">
                What is in the kit
              </h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {product.includes.map((item) => (
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

          {product.compatibility ? (
            <section className="mt-10">
              <h2 className="section-heading-sm text-xl md:text-2xl">
                Fits these models
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {product.compatibility.map((model) => (
                  <li key={model}>
                    <Badge tone="brand" size="lg">
                      {model}
                    </Badge>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm text-ink-500">
                Not sure which model you have? Bring it in and we will check for
                free, or{" "}
                <Link to="/repairs" className="text-primary hover:underline">
                  book a free diagnostic
                </Link>
                .
              </p>
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

        <div className="min-w-0 lg:col-span-1">
          {product.specs ? (
            <section>
              <h2 className="section-heading-sm text-xl md:text-2xl">
                Specifications
              </h2>
              <dl className="mt-4 overflow-hidden border border-line bg-white">
                {product.specs.map((spec, i) => (
                  <div
                    key={spec.label}
                    className={
                      i % 2 === 0
                        ? "grid grid-cols-2 gap-3 bg-muted px-4 py-3 text-sm"
                        : "grid grid-cols-2 gap-3 px-4 py-3 text-sm"
                    }
                  >
                    <dt className="text-ink-500">{spec.label}</dt>
                    <dd className="font-medium">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}

          {pairs.length > 0 ? (
            <section className="mt-10">
              <h2 className="section-heading-sm text-xl md:text-2xl">
                Often bought with
              </h2>
              <ul className="mt-4 space-y-3">
                {pairs.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center gap-3 border border-line bg-white p-3"
                  >
                    <span className="relative size-14 shrink-0 overflow-hidden bg-ink-50">
                      <ProductImage product={item} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <Link
                        to={`/product/${item.id}`}
                        className="block truncate text-sm font-medium hover:text-primary"
                      >
                        {item.name}
                      </Link>
                      <span className="text-sm text-ink-500">
                        {formatPrice(item.price)}
                      </span>
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => add(item.id)}
                      aria-label={`Add ${item.name} to basket`}
                    >
                      Add
                    </Button>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </div>

      {related.length > 0 ? (
        <FeaturedProducts heading="You might also need" products={related} />
      ) : null}

      {recent.length > 0 ? (
        <FeaturedProducts heading="Recently viewed" products={recent} />
      ) : null}

      <div className="content-boundary pb-16 text-center">
        <Link
          to={`/${product.category}`}
          className={buttonClass("outline", "lg")}
        >
          Back to {category?.name ?? "the shop"}
        </Link>
      </div>

      {/* Sticky buy bar. On a page this long the price and the button are
          otherwise a full scroll away by the time you have read the specs. */}
      {showStickyBar && !soldOut ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur">
          <div className="content-boundary flex items-center gap-4 py-3">
            <span className="relative hidden size-11 shrink-0 overflow-hidden bg-ink-50 sm:block">
              <ProductImage product={product} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{product.name}</p>
              <p className="text-sm text-ink-500">
                {formatPrice(product.price)}
                {product.stock === "low" ? (
                  <span className="ml-2 text-amber-700">Low stock</span>
                ) : null}
              </p>
            </div>
            <div className="hidden sm:block">
              <QuantityStepper value={qty} onChange={setQty} />
            </div>
            <Button
              onClick={() => {
                addToCart()
                openDrawer()
              }}
            >
              Add · {formatPrice(product.price * qty)}
            </Button>
          </div>
        </div>
      ) : null}
    </>
  )
}
