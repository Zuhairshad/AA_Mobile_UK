import { useState, type FormEvent } from "react"
import { Link } from "react-router-dom"
import Reveal from "../components/Reveal"
import Features from "../components/Features"
import ColorPicker from "../components/landing/ColorPicker"
import SpecTable from "../components/landing/SpecTable"
import Testimonials from "../components/landing/Testimonials"
import FaqAccordion from "../components/landing/FaqAccordion"
import SiteFooter from "../components/landing/SiteFooter"
import { flagship } from "../data/flagship"
import { productImages } from "../data/productImages"
import { useSmoothScroll } from "../lib/useSmoothScroll"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Landing() {
  const { scrollToId } = useSmoothScroll()
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")

  function handleSubscribe(e: FormEvent) {
    e.preventDefault()
    if (EMAIL_RE.test(email)) {
      setStatus("success")
      setEmail("")
    } else {
      setStatus("error")
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="landing-hero" id="top">
        <p className="landing-wordmark" aria-hidden="true">
          AA MOBILE
        </p>

        <div className="landing-hero-inner">
          <span className="badge">In stock today</span>
          <img
            src={productImages[flagship.id]}
            alt={flagship.name}
            className="landing-hero-image"
          />
        </div>

        <div className="landing-hero-meta">
          <p className="landing-hero-copy">
            Free next-day delivery, honest trade-in quotes, and every phone properly checked
            before it reaches you.
          </p>
          <button type="button" className="pill-button-ghost pill-button" onClick={() => scrollToId("story")}>
            See how trade-in works
          </button>
          <p className="landing-hero-tagline">
            Fast. <span className="accent-text">Fair.</span> Founder-run.
          </p>
          <p className="landing-hero-availability">
            {flagship.name} in stock &middot; Ships next working day
          </p>
        </div>
      </section>

      {/* Scroll story */}
      <section className="scroll-story" id="story">
        <div className="story-sticky">
          <img src={productImages[flagship.id]} alt="" className="story-image" />
        </div>

        <div className="story-text">
          <Reveal className="story-eyebrow">Meet AA Mobile</Reveal>
          <Reveal className="story-line" delay={80}>
            A UK phone shop that blends fair prices, fast delivery, and honest trade-ins —
          </Reveal>
          <Reveal className="story-line" delay={160}>
            featuring instant quotes, certified refurbished stock, and a fit for every budget.
          </Reveal>
          <Reveal className="story-line" delay={240}>
            Just the phone you want, no distractions.
          </Reveal>
        </div>
      </section>

      <Reveal>
        <Features />
      </Reveal>

      {/* Style picker */}
      <section className="style-section">
        <Reveal className="section-eyebrow">Design &amp; finish</Reveal>
        <Reveal>
          <h2 className="section-heading">Choose your finish.</h2>
        </Reveal>
        <Reveal>
          <ColorPicker />
        </Reveal>
      </section>

      {/* Spec table */}
      <section className="spec-section">
        <Reveal className="section-eyebrow">Technical specifications</Reveal>
        <Reveal>
          <h2 className="section-heading">Engineered to perform.</h2>
        </Reveal>
        <Reveal className="section-subhead">
          All the details on our current top pick, the {flagship.name}.
        </Reveal>
        <Reveal>
          <SpecTable />
        </Reveal>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <Reveal className="section-subhead-center">
          Trusted by thousands of happy upgraders across the UK.
        </Reveal>
        <Reveal>
          <Testimonials />
        </Reveal>
      </section>

      {/* Pricing / pre-order */}
      <section className="pricing-section">
        <Reveal className="section-eyebrow">Pricing</Reveal>
        <Reveal>
          <h2 className="section-heading">Get the {flagship.name}.</h2>
        </Reveal>
        <Reveal className="section-subhead">
          Reserve yours today — trade in your old phone for even more off.
        </Reveal>

        <Reveal>
          <div className="price-card">
            <p className="price-amount">£{flagship.price.toLocaleString("en-GB")}</p>
            <p className="price-note">or less with a trade-in</p>
            <div className="price-ctas">
              <Link className="pill-button pill-button-solid" to="/signup">
                Reserve now
              </Link>
              <Link className="pill-button pill-button-ghost" to="/sell">
                Get trade-in value
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* FAQ */}
      <section className="faq-section">
        <Reveal className="section-eyebrow" delay={0}>
          FAQ
        </Reveal>
        <Reveal>
          <h2 className="section-heading">Got questions? We&rsquo;ve got answers.</h2>
        </Reveal>
        <Reveal>
          <FaqAccordion />
        </Reveal>
      </section>

      {/* Email capture band */}
      <section className="cta-band">
        <Reveal>
          <h2>Stay ahead of every price drop.</h2>
          <form className="cta-band-form" onSubmit={handleSubscribe} noValidate>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setStatus("idle")
              }}
              aria-label="Email address"
            />
            <button type="submit">Join the deals club</button>
          </form>
          <p className={`cta-band-note${status === "error" ? " is-error" : ""}`}>
            {status === "success"
              ? "You're subscribed. Watch your inbox for deals."
              : status === "error"
                ? "Enter a valid email address."
                : "Free. No spam. Unsubscribe anytime."}
          </p>
        </Reveal>
      </section>

      <SiteFooter />
    </>
  )
}
