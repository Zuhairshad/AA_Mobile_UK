import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { products } from "../data/catalogue"
import { formatPrice } from "../lib/format"
import Accordion from "../components/ui/Accordion"
import Button, { buttonClass } from "../components/ui/Button"
import Icon from "../components/ui/Icon"
import ValueProps from "../components/sections/ValueProps"

/**
 * Trade-in value as a share of what we sell the same handset for. Derived from
 * the catalogue rather than a separate price list, so the two cannot drift apart.
 */
const conditions = [
  {
    id: "flawless",
    label: "Flawless",
    detail: "No marks at all, screen perfect, battery healthy.",
    factor: 0.55,
  },
  {
    id: "good",
    label: "Good",
    detail: "Light wear on the frame, screen intact, everything works.",
    factor: 0.45,
  },
  {
    id: "worn",
    label: "Worn",
    detail: "Visible scuffs or dents, screen intact, everything works.",
    factor: 0.32,
  },
  {
    id: "cracked",
    label: "Cracked screen",
    detail: "Glass is broken but the phone powers on and works.",
    factor: 0.2,
  },
  {
    id: "dead",
    label: "Not powering on",
    detail: "Will not turn on, water damaged, or unknown fault.",
    factor: 0.1,
  },
] as const

type ConditionId = (typeof conditions)[number]["id"]

const tradeInEligible = products.filter(
  (p) => p.category === "phones" && p.condition === "new",
)

const faqs = [
  {
    q: "How do you pay?",
    a: "Bank transfer the same working day we receive and check the device, or cash if you bring it into the shop. If you are trading in against a new handset the value comes straight off the price.",
  },
  {
    q: "What if your check disagrees with my valuation?",
    a: "We tell you before anything is paid, with photos of what we found. You can accept the revised offer or have the phone posted back free of charge.",
  },
  {
    q: "Do you take phones that do not work?",
    a: "Yes. A phone that will not power on is still worth something for parts, and we would rather it came to us than went to landfill. Water-damaged boards included.",
  },
  {
    q: "What about my data?",
    a: "Wipe it first if you can — sign out of your account and factory reset. If the screen is broken and you cannot, we will wipe it for you and send written confirmation once it is done.",
  },
  {
    q: "Do I need the box and charger?",
    a: "No, and they do not change the valuation. Bring them if you want them recycled properly.",
  },
]

export default function Sell() {
  const [modelId, setModelId] = useState(tradeInEligible[0]?.id ?? "")
  const [conditionId, setConditionId] = useState<ConditionId>("good")
  const [quoted, setQuoted] = useState(false)

  const estimate = useMemo(() => {
    const model = products.find((p) => p.id === modelId)
    const condition = conditions.find((c) => c.id === conditionId)
    if (!model || !condition) return 0
    // Round to the nearest £5 — a quote of £312.47 reads as fake precision.
    return Math.round((model.price * condition.factor) / 5) * 5
  }, [modelId, conditionId])

  return (
    <>
      <section className="bg-dark">
        <div className="content-boundary py-16 text-center md:py-20">
          <h1 className="section-heading text-dark-foreground">
            Sell us the phone in your drawer
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-dark-muted md:text-xl">
            Any condition — cracked, dead, or perfect. Valued in ninety seconds,
            paid the same day, or put straight against something newer.
          </p>
        </div>
      </section>

      <section className="section-y">
        <div className="content-boundary max-w-3xl">
          <div className="border border-line bg-white p-6 md:p-8">
            <h2 className="section-heading-sm text-xl md:text-2xl">
              Get a valuation
            </h2>

            <div className="mt-6 grid gap-5">
              <div>
                <label className="field-label" htmlFor="sell-model">
                  Which phone or tablet?
                </label>
                <select
                  id="sell-model"
                  value={modelId}
                  onChange={(e) => {
                    setModelId(e.target.value)
                    setQuoted(false)
                  }}
                  className="field"
                >
                  {tradeInEligible.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1.5 text-xs text-ink-500">
                  Not listed? We still buy it —{" "}
                  <Link to="/about" className="text-primary hover:underline">
                    get in touch
                  </Link>{" "}
                  for a manual quote.
                </p>
              </div>

              <fieldset className="border-0 p-0">
                <legend className="field-label">
                  What condition is it in?
                </legend>
                <div className="mt-1 grid gap-2">
                  {conditions.map((condition) => (
                    <label
                      key={condition.id}
                      className={
                        conditionId === condition.id
                          ? "flex cursor-pointer items-start gap-3  border border-brand-500 bg-muted p-3"
                          : "flex cursor-pointer items-start gap-3  border border-line p-3 hover:bg-muted"
                      }
                    >
                      <input
                        type="radio"
                        name="condition"
                        value={condition.id}
                        checked={conditionId === condition.id}
                        onChange={() => {
                          setConditionId(condition.id)
                          setQuoted(false)
                        }}
                        className="mt-0.5 size-4 shrink-0 accent-brand-500"
                      />
                      <span className="text-sm">
                        <span className="block font-medium">
                          {condition.label}
                        </span>
                        <span className="block text-ink-500">
                          {condition.detail}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            <div className="mt-6 bg-muted p-5">
              <p className="text-sm text-ink-500">Estimated value</p>
              <p className="mt-1 text-4xl font-semibold">
                {estimate > 0 ? formatPrice(estimate) : "—"}
              </p>
              <p className="mt-2 text-sm text-ink-500">
                Final offer confirmed once we have checked the device. We tell
                you before anything is paid, and we post it back free if you
                would rather keep it.
              </p>
            </div>

            {quoted ? (
              <div
                className="mt-5 border border-green-200 bg-green-50 p-5"
                role="status"
              >
                <p className="flex items-center gap-2 font-semibold text-green-900">
                  <Icon name="check" className="size-5" />
                  Quote locked for 14 days
                </p>
                <p className="mt-2 text-sm text-green-800">
                  Post it free with the label we email you, or bring it into the
                  Birmingham shop and walk out with the cash.
                </p>
                <p className="mt-2 text-xs text-green-700">
                  This is a demo storefront — nothing has actually been sent.
                </p>
              </div>
            ) : (
              <Button
                size="lg"
                className="mt-5 w-full"
                onClick={() => setQuoted(true)}
                disabled={estimate === 0}
              >
                Lock this quote for 14 days
              </Button>
            )}
          </div>
        </div>
      </section>

      <section id="trade-in" className="section-y scroll-mt-32 bg-muted">
        <div className="content-boundary">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="section-heading">Or trade up instead</h2>
            <p className="section-lede mt-4">
              Put the valuation straight against a new or refurbished handset.
              The value comes off at the till, so there is nothing to claim back
              and no waiting for a transfer.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/phones" className={buttonClass("primary", "lg")}>
              Browse handsets
            </Link>
            <Link
              to="/phones?condition=refurbished"
              className={buttonClass("outline", "lg")}
            >
              See refurbished stock
            </Link>
          </div>
        </div>
      </section>

      <ValueProps />

      <section className="section-y">
        <div className="content-boundary max-w-3xl">
          <h2 className="section-heading mb-8 text-center">
            Questions about selling
          </h2>
          <Accordion items={faqs} />
        </div>
      </section>
    </>
  )
}
