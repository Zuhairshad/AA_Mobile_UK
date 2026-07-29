import { Link } from "react-router-dom"
import Icon from "./Icon"

export type Crumb = {
  label: string
  to?: string
}

export default function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-600">
        {trail.map((crumb, i) => {
          const last = i === trail.length - 1
          return (
            <li key={crumb.label} className="flex items-center gap-1">
              {crumb.to && !last ? (
                <Link to={crumb.to} className="hover:text-primary hover:underline">
                  {crumb.label}
                </Link>
              ) : (
                <span className={last ? "font-medium text-gray-900" : undefined}>
                  {crumb.label}
                </span>
              )}
              {!last ? (
                <Icon name="chevronRight" className="size-3.5 text-gray-400" />
              ) : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
