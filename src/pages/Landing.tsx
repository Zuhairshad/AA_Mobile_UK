import { useState, type FormEvent } from "react"
import { Link } from "react-router-dom"
import GsapReveal from "../components/GsapReveal"
import Features from "../components/Features"
import ColorPicker from "../components/landing/ColorPicker"
import ScrollStory from "../components/landing/ScrollStory"
import SpecTable from "../components/landing/SpecTable"
import Testimonials from "../components/landing/Testimonials"
import FaqAccordion from "../components/landing/FaqAccordion"
import SiteFooter from "../components/landing/SiteFooter"
import { flagship } from "../data/flagship"
import flagshipCutout from "../assets/products/iphone-15-pro-max-cutout.webp"
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
          <img src={flagshipCutout} alt={flagship.name} className="landing-hero-image" />
        </div>

        <div className="landing-hero-meta">
          <p className="landing-hero-copy">
            Free next-day delivery, honest trade-in quotes, and every phone properly checked
            before it reaches you.
          </p>
          <button
            type="button"
            className="pill-button-ghost pill-button"
            onClick={() => scrollToId("story")}
          >
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

      <ScrollStory />

      <GsapReveal>
        <Features />
      </GsapReveal>

      {/* Style picker */}
      <section className="style-section">
        <GsapReveal className="section-eyebrow">Design &amp; finish</GsapReveal>
        <GsapReveal>
          <h2 className="section-heading">Choose your finish.</h2>
        </GsapReveal>
        <GsapReveal>
          <ColorPicker />
        </GsapReveal>
      </section>

      {/* Spec table */}
      <section className="spec-section">
        <div className="spec-section-inner">
          <GsapReveal className="section-eyebrow section-eyebrow-left">
            Technical specifications
          </GsapReveal>
          <GsapReveal>
            <h2 className="section-heading section-heading-left">Engineered to perform.</h2>
          </GsapReveal>
          <GsapReveal className="section-subhead section-subhead-left">
            All the details on our current top pick, the {flagship.name}.
          </GsapReveal>
          <GsapReveal>
            <SpecTable />
          </GsapReveal>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <GsapReveal className="section-subhead-center">
          Trusted by thousands of happy upgraders across the UK.
        </GsapReveal>
        <GsapReveal>
          <Testimonials />
        </GsapReveal>
      </section>

      {/* Pricing / pre-order */}
      <section className="pricing-section">
        <GsapReveal className="section-eyebrow">Pricing</GsapReveal>
        <GsapReveal>
          <h2 className="section-heading">Get the {flagship.name}.</h2>
        </GsapReveal>
        <GsapReveal className="section-subhead">
          Reserve yours today — trade in your old phone for even more off.
        </GsapReveal>

        <GsapReveal>
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
        </GsapReveal>
      </section>

      {/* FAQ */}
      <section className="faq-section">
        <GsapReveal className="section-eyebrow">FAQ</GsapReveal>
        <GsapReveal>
          <h2 className="section-heading">Got questions? We&rsquo;ve got answers.</h2>
        </GsapReveal>
        <GsapReveal>
          <FaqAccordion />
        </GsapReveal>
      </section>

      {/* Email capture band */}
      <section className="cta-band">
        <GsapReveal>
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
        </GsapReveal>
      </section>

      <SiteFooter />
    </>
  )
}
