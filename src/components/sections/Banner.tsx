import { Link } from "react-router-dom"
import { buttonClass } from "../ui/Button"

type Props = {
  heading: string
  body: string
  ctaLabel?: string
  ctaTo?: string
  label?: string
}

/**
 * Statement band: flat near-black, one very large heading, one pill. No
 * gradient and no radial glow — the flat field is what makes the type land.
 */
export default function Banner({
  heading,
  body,
  ctaLabel,
  ctaTo,
  label,
}: Props) {
  return (
    <section className="bg-dark">
      <div className="content-boundary section-y flex flex-col items-center gap-6 text-center">
        {label ? (
          <p className="micro-label micro-label-invert">{label}</p>
        ) : null}
        <h2 className="section-heading max-w-4xl text-dark-foreground">
          {heading}
        </h2>
        <p className="section-lede max-w-2xl text-dark-muted">{body}</p>
        {ctaLabel && ctaTo ? (
          <Link to={ctaTo} className={buttonClass("invert", "lg", "mt-2")}>
            {ctaLabel}
          </Link>
        ) : null}
      </div>
    </section>
  )
}
