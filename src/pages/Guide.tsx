import { Link, useParams } from "react-router-dom"
import { devicesForGuide, difficultyTone, guideBySlug, guides } from "../data/guides"
import { devices, partKindLabels } from "../data/devices"
import { productById } from "../data/catalogue"
import { formatPrice } from "../lib/format"
import Badge from "../components/ui/Badge"
import Breadcrumbs from "../components/ui/Breadcrumbs"
import Icon from "../components/ui/Icon"
import Button, { buttonClass } from "../components/ui/Button"
import { useCart } from "../lib/cart"
import ProductImage from "../components/product/ProductImage"
import NotFound from "./NotFound"

export default function Guide() {
  const { slug } = useParams<{ slug: string }>()
  const guide = slug ? guideBySlug.get(slug) : undefined
  const { add } = useCart()

  if (!guide) return <NotFound />

  const tools = guide.toolIds
    .map((id) => productById.get(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
  const covered = devicesForGuide(guide, devices)
  const related = guides.filter((g) => g.slug !== guide.slug).slice(0, 3)

  const addAllTools = () => tools.forEach((tool) => add(tool.id))
  const toolTotal = tools.reduce((sum, tool) => sum + tool.price, 0)

  return (
    <>
      <div className="border-b border-gray-200 bg-white">
        <div className="content-boundary py-8 md:py-10">
          <Breadcrumbs
            trail={[
              { label: "Home", to: "/" },
              { label: "Repair guides", to: "/guides" },
              { label: guide.title },
            ]}
          />
          <h1 className="section-heading mt-4">{guide.title}</h1>
          <p className="section-lede mt-3 max-w-3xl">{guide.summary}</p>

          <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <div>
              <dt className="text-gray-500">Difficulty</dt>
              <dd className="mt-1">
                <Badge tone={difficultyTone[guide.difficulty]}>
                  {guide.difficulty}
                </Badge>
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">Time</dt>
              <dd className="mt-1 flex items-center gap-1 font-medium">
                <Icon name="clock" className="size-4 text-gray-500" />
                {guide.time}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">Repair</dt>
              <dd className="mt-1 font-medium">{partKindLabels[guide.partKind]}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Steps</dt>
              <dd className="mt-1 font-medium">{guide.steps.length}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="content-boundary grid gap-10 py-10 lg:grid-cols-3 lg:gap-16">
        <div className="min-w-0 lg:col-span-2">
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <Icon name="shield" className="mt-0.5 size-5 shrink-0" />
            <p>
              Work on a powered-down phone, never one that is plugged in, and never
              puncture or fold a lithium cell — a damaged battery can vent and
              catch fire minutes later. If a step goes wrong, stop and bring it in.
              A half-finished teardown is not a problem and the diagnostic is free.
            </p>
          </div>

          <ol className="mt-8 space-y-8">
            {guide.steps.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-500 font-mono text-sm font-bold text-white">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-semibold">{step.title}</h2>
                  <p className="prose-body mt-2">{step.body}</p>
                  {step.warning ? (
                    <p className="mt-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-900">
                      <Icon name="shield" className="mt-0.5 size-4 shrink-0" />
                      <span>
                        <strong className="font-semibold">Careful: </strong>
                        {step.warning}
                      </span>
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>

          {guide.aftercare.length > 0 ? (
            <section className="mt-12">
              <h2 className="text-2xl font-semibold">Afterwards</h2>
              <ul className="mt-4 space-y-2">
                {guide.aftercare.map((item) => (
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

          {covered.length > 0 ? (
            <section className="mt-12">
              <h2 className="text-2xl font-semibold">Models this covers</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {covered.slice(0, 40).map((device) => (
                  <li key={device.slug}>
                    <Link
                      to={`/device/${device.slug}`}
                      className={buttonClass("outline", "sm")}
                    >
                      {device.name}
                    </Link>
                  </li>
                ))}
              </ul>
              {covered.length > 40 ? (
                <p className="mt-3 text-sm text-gray-600">
                  …and {covered.length - 40} more.{" "}
                  <Link to="/devices" className="text-primary hover:underline">
                    Browse all devices
                  </Link>
                </p>
              ) : null}
            </section>
          ) : null}
        </div>

        <aside className="min-w-0 lg:col-span-1">
          {tools.length > 0 ? (
            <section className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="text-lg font-semibold">Tools you will need</h2>
              <ul className="mt-4 space-y-3">
                {tools.map((tool) => (
                  <li key={tool.id} className="flex items-center gap-3">
                    <span className="size-12 shrink-0 rounded-lg bg-gray-100 p-1.5">
                      <ProductImage product={tool} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <Link
                        to={`/product/${tool.id}`}
                        className="block truncate text-sm font-medium hover:text-primary"
                      >
                        {tool.name}
                      </Link>
                      <span className="text-sm text-gray-600">
                        {formatPrice(tool.price)}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
              <Button className="mt-4 w-full" onClick={addAllTools}>
                Add all {tools.length} · {formatPrice(toolTotal)}
              </Button>
            </section>
          ) : null}

          <section className="mt-6 rounded-xl border border-brand-200 bg-brand-50 p-5">
            <h2 className="text-lg font-semibold text-brand-900">
              Would rather we did it?
            </h2>
            <p className="mt-2 text-sm text-brand-800">
              Most of these repairs are done in store while you wait, and we deduct
              the part price from the quote if you already bought it from us.
            </p>
            <Link
              to="/repairs#book"
              className={buttonClass("primary", "md", "mt-4 w-full")}
            >
              Book a repair
            </Link>
          </section>

          {related.length > 0 ? (
            <section className="mt-6">
              <h2 className="text-lg font-semibold">Other guides</h2>
              <ul className="mt-3 space-y-2">
                {related.map((other) => (
                  <li key={other.slug}>
                    <Link
                      to={`/guide/${other.slug}`}
                      className="flex items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white p-3 text-sm font-medium hover:border-gray-400 hover:text-primary"
                    >
                      {other.title}
                      <Icon name="chevronRight" className="size-4 text-gray-400" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </aside>
      </div>
    </>
  )
}
