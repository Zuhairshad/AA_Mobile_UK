import { Link } from "react-router-dom"

const SOCIALS = ["Facebook", "Instagram", "X", "YouTube", "TikTok"]

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div>
          <p className="footer-logo">AA Mobile</p>
          <p className="footer-tagline">Phones, sorted.</p>
          <div className="footer-socials">
            {SOCIALS.map((s) => (
              <a key={s} href="#" aria-label={s} onClick={(e) => e.preventDefault()}>
                {s.charAt(0)}
              </a>
            ))}
          </div>
        </div>

        <div className="footer-column">
          <p className="footer-column-title">Quick links</p>
          <Link to="/shop">Shop</Link>
          <Link to="/about">About</Link>
          <Link to="/sell">Sell your phone</Link>
        </div>

        <div className="footer-column">
          <p className="footer-column-title">Pages</p>
          <Link to="/signup">Sign up</Link>
          <Link to="/about">Contact</Link>
          <Link to="/sell">Trade-in quote</Link>
        </div>
      </div>

      <p className="footer-wordmark" aria-hidden="true">
        AA MOBILE
      </p>

      <div className="footer-bottom">
        <p>AA Mobile © 2026 — demo build, not a real retailer.</p>
      </div>
    </footer>
  )
}
