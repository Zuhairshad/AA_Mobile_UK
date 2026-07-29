import { Link } from "react-router-dom"
import { cx } from "../../lib/cx"
import Icon from "./Icon"

export type Crumb = {
  label: string
  to?: string
}

type Props = {
  trail: Crumb[]
  /** "light" for use on the dark hero sections, where grey fails contrast. */
  tone?: "dark" | "light"
}

export default function Breadcrumbs({ trail, tone = "dark" }: Props) {
  const light = tone === "light"

  return (
    <nav aria-label="Breadcrumb">
      <ol
        className={cx(
          "flex flex-wrap items-center gap-1 text-sm",
          light ? "text-brand-100" : "text-gray-600",
        )}
      >
        {trail.map((crumb, i) => {
          const last = i === trail.length - 1
          return (
            <li key={crumb.label} className="flex items-center gap-1">
              {crumb.to && !last ? (
                <Link
                  to={crumb.to}
                  className={cx(
                    "hover:underline",
                    light ? "hover:text-white" : "hover:text-primary",
                  )}
                >
                  {crumb.label}
                </Link>
              ) : (
                <span
                  className={cx(
                    last && "font-medium",
                    last && (light ? "text-white" : "text-gray-900"),
                  )}
                >
                  {crumb.label}
                </span>
              )}
              {!last ? (
                <Icon
                  name="chevronRight"
                  className={cx("size-3.5", light ? "text-brand-300" : "text-gray-400")}
                />
              ) : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
