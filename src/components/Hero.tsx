import { useState, type FormEvent } from "react"
import { Link } from "react-router-dom"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type HeroProps = {
  onBrowseClick: () => void
}

export default function Hero({ onBrowseClick }: HeroProps) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (EMAIL_RE.test(email)) {
      setStatus("success")
      setEmail("")
    } else {
      setStatus("error")
    }
  }

  return (
    <section className="hero" id="top">
      <span className="badge">Updated weekly</span>
      <h1>
        The UK&rsquo;s best value
        <br />
        mobile phone deals.
      </h1>
      <p className="hero-subhead">
        Compare the latest iPhones, Galaxy, and Pixel phones, trade in your old handset, and get
        notified the moment prices drop.
      </p>

      <div className="hero-ctas">
        <button type="button" className="pill-button" onClick={onBrowseClick}>
          Browse phones
        </button>
        <Link className="pill-button pill-button-ghost" to="/signup">
          Create a free account
        </Link>
      </div>

      <form className="subscribe-form" onSubmit={handleSubmit} noValidate>
        <input
          type="email"
          placeholder="hi@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            setStatus("idle")
          }}
          aria-label="Email address"
        />
        <button type="submit">Subscribe</button>
      </form>

      <p className={`subscribe-note${status === "error" ? " is-error" : ""}`}>
        {status === "success"
          ? "You're subscribed. Watch your inbox for deals."
          : status === "error"
            ? "Enter a valid email address."
            : "Free. No spam. Unsubscribe anytime."}
      </p>
    </section>
  )
}
