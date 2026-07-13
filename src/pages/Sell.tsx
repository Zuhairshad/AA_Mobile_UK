import { useMemo, useState, type FormEvent } from "react"
import { products } from "../data/products"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const CONDITIONS = [
  { label: "Like new", multiplier: 0.6 },
  { label: "Good — light wear", multiplier: 0.45 },
  { label: "Fair — visible scratches", multiplier: 0.3 },
  { label: "Poor — cracked or faulty", multiplier: 0.12 },
]

const brands = Array.from(new Set(products.map((product) => product.brand))).sort()

export default function Sell() {
  const [brand, setBrand] = useState(brands[0])
  const [modelId, setModelId] = useState("")
  const [condition, setCondition] = useState(CONDITIONS[0].label)
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [quote, setQuote] = useState<number | null>(null)

  const modelsForBrand = useMemo(() => products.filter((product) => product.brand === brand), [brand])

  function handleBrandChange(next: string) {
    setBrand(next)
    setModelId("")
    setQuote(null)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")
    setQuote(null)

    const model = products.find((product) => product.id === modelId)
    if (!model) {
      setError("Choose your phone model.")
      return
    }
    if (!EMAIL_RE.test(email)) {
      setError("Enter a valid email address.")
      return
    }

    const multiplier = CONDITIONS.find((c) => c.label === condition)?.multiplier ?? 0.3
    setQuote(Math.round(model.price * multiplier))
  }

  if (quote !== null) {
    const model = products.find((product) => product.id === modelId)
    return (
      <section className="auth-page">
        <div className="auth-card">
          <span className="badge">Estimated quote</span>
          <h1>£{quote.toLocaleString("en-GB")}</h1>
          <p>
            That's our estimate for your {model?.name} in {condition.toLowerCase()} condition.
            We'll email the final offer and a free postage label to {email} within 24 hours.
          </p>
          <button
            type="button"
            className="pill-button"
            onClick={() => {
              setQuote(null)
              setModelId("")
              setEmail("")
            }}
          >
            Get another quote
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <span className="badge">Sell your phone</span>
        <h1>Get an instant trade-in quote</h1>
        <p className="auth-subhead">
          Tell us about your current phone and we'll estimate what it's worth towards your next
          upgrade.
        </p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label>
            Brand
            <select value={brand} onChange={(e) => handleBrandChange(e.target.value)}>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </label>

          <label>
            Model
            <select value={modelId} onChange={(e) => setModelId(e.target.value)}>
              <option value="">Select your model&hellip;</option>
              {modelsForBrand.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Condition
            <select value={condition} onChange={(e) => setCondition(e.target.value)}>
              {CONDITIONS.map((c) => (
                <option key={c.label} value={c.label}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hi@example.com"
              autoComplete="email"
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="pill-button pill-button-solid auth-submit">
            Get my quote
          </button>
        </form>
      </div>
    </section>
  )
}
