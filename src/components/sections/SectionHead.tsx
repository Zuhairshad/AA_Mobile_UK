import { cx } from "../../lib/cx"

type Props = {
  /** Mono uppercase kicker above the heading. */
  label: string
  heading: string
  lede?: string
  id?: string
  align?: "center" | "left"
  invert?: boolean
  className?: string
}

/**
 * The one section header used everywhere: mono micro-label, then a heavy
 * uppercase display heading, then an optional lede.
 *
 * Every section on the old home page had its own centred heading + lede + button
 * at identical weight, which is what made the page read as a stack of unrelated
 * slabs. Funnelling all of them through one component means the rhythm is set
 * in a single place.
 */
export default function SectionHead({
  label,
  heading,
  lede,
  id,
  align = "center",
  invert,
  className,
}: Props) {
  const centred = align === "center"
  return (
    <div
      className={cx(
        "flex flex-col gap-4",
        centred && "mx-auto max-w-3xl text-center",
        className,
      )}
    >
      <p className={cx("micro-label", invert && "micro-label-invert")}>
        {label}
      </p>
      <h2
        id={id}
        className={cx("section-heading", invert && "text-dark-foreground")}
      >
        {heading}
      </h2>
      {lede ? (
        <p
          className={cx(
            "section-lede",
            centred && "mx-auto",
            invert && "text-dark-muted",
          )}
        >
          {lede}
        </p>
      ) : null}
    </div>
  )
}
