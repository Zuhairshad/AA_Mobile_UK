import { Link } from "react-router-dom"
import { buttonClass } from "../ui/Button"

type Props = {
  heading: string
  body: string
  ctaLabel?: string
  ctaTo?: string
}

/** Full-bleed statement band with a dark scrim, used to break up the page. */
export default function Banner({ heading, body, ctaLabel, ctaTo }: Props) {
  return (
    <section className="relative flex w-full items-center overflow-hidden bg-gradient-to-r from-brand-900 to-brand-700 py-16 md:py-24">
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.14),transparent_55%)]"
        aria-hidden="true"
      />
      <div className="content-boundary relative text-center">
        <h2 className="section-heading text-white">{heading}</h2>
        <p className="mx-auto mt-4 max-w-3xl text-lg text-brand-100 md:text-xl">
          {body}
        </p>
        {ctaLabel && ctaTo ? (
          <Link
            to={ctaTo}
            className={buttonClass(
              "outline",
              "lg",
              "mt-6 border-transparent text-brand-800",
            )}
          >
            {ctaLabel}
          </Link>
        ) : null}
      </div>
    </section>
  )
}
