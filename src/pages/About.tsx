export default function About() {
  return (
    <section className="about-page">
      <span className="badge">About us</span>
      <h1>We&rsquo;re AA Mobile.</h1>
      <p className="about-lede">
        This is demo copy for a portfolio build — AA Mobile isn&rsquo;t a real retailer. Everything
        below exists to show what a fleshed-out About page looks like on this template.
      </p>

      <div className="about-grid">
        <div>
          <h2>Our story</h2>
          <p>
            AA Mobile started in 2019 as a two-person operation refurbishing traded-in handsets out
            of a lock-up in Manchester. Since then we&rsquo;ve grown into a UK-wide phone retailer,
            but we&rsquo;ve kept the same promise: honest pricing, no hidden contracts, and phones
            that are properly checked before they reach you.
          </p>
        </div>

        <div>
          <h2>What we do</h2>
          <p>
            We sell new and certified refurbished phones from Apple, Samsung, Google, and more,
            and we buy back your old handset the same day you upgrade. Every refurbished device
            passes a 40-point check and ships with a 12-month warranty.
          </p>
        </div>

        <div>
          <h2>Why customers stick around</h2>
          <p>
            Free next-day delivery, a 14-day return window, and a price-match promise on every
            listing. If a price drops within 30 days of your order, we&rsquo;ll refund the
            difference automatically.
          </p>
        </div>

        <div>
          <h2>Get in touch</h2>
          <p>
            hello@aamobile.example
            <br />
            0800 123 4567
            <br />
            Mon&ndash;Fri, 9am&ndash;6pm
          </p>
        </div>
      </div>
    </section>
  )
}
