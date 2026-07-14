import { Link } from "react-router-dom"

export default function FloatingActions() {
  return (
    <div className="footer-bar">
      <Link className="pill-button" to="/sell">
        <span className="plus">+</span> Sell your phone
      </Link>
      <Link className="pill-button pill-button-solid" to="/signup">
        Sign up
      </Link>
    </div>
  )
}
