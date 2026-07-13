import { useState, type FormEvent } from "react"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Hero() {
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
