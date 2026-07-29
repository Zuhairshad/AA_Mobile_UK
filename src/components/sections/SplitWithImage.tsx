import { Link } from "react-router-dom"
import { productPhotos } from "../../data/images"
import { buttonClass } from "../ui/Button"
import { cx } from "../../lib/cx"

type Props = {
  heading: string
  body: string
  ctaLabel: string
  ctaTo: string
  photo: string
  flip?: boolean
}

/**
 * Half-and-half marketing block. On desktop the image is absolutely positioned
 * to a half so it bleeds to the window edge; on mobile it stacks above the copy
 * at a fixed height.
 */
export default function SplitWithImage({
  heading,
  body,
  ctaLabel,
  ctaTo,
  photo,
  flip,
}: Props) {
  const src = productPhotos[photo]

  return (
    <section className="relative w-full">
      <div
        className={cx(
          "relative h-72 w-full bg-gradient-to-br from-brand-800 to-brand-950 lg:absolute lg:h-full lg:w-1/2",
          flip ? "lg:right-0" : "lg:left-0",
        )}
      >
        {/* object-cover so the photo fills the half rather than sitting as a
            light rectangle on the dark panel. */}
        {src ? (
          <img
            src={src}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : null}
      </div>

      <div className="content-boundary">
        <div className={cx("flex", flip ? "justify-start" : "justify-end")}>
          <div
            className={cx(
              "w-full py-12 lg:w-1/2 lg:py-28",
              flip ? "lg:pr-16" : "lg:pl-16",
            )}
          >
            <h2 className="section-heading">{heading}</h2>
            <p className="section-lede mt-4">{body}</p>
            <Link to={ctaTo} className={buttonClass("primary", "lg", "mt-6")}>
              {ctaLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
