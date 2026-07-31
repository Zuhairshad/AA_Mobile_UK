import { Link } from "react-router-dom"
import { buttonClass } from "../components/ui/Button"

export default function NotFound() {
  return (
    <div className="content-boundary py-24 text-center">
      <p className="font-mono text-sm font-semibold text-ink-950">404</p>
      <h1 className="section-heading mt-2">We could not find that page</h1>
      <p className="section-lede mx-auto mt-4 max-w-lg">
        The link may be out of date. Try searching for your model, or start from
        one of the shop categories.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className={buttonClass("primary", "lg")}>
          Back to the shop
        </Link>
        <Link to="/repairs" className={buttonClass("outline", "lg")}>
          Book a repair
        </Link>
      </div>
    </div>
  )
}
