import type { ReactNode } from "react"
import { cx } from "../../lib/cx"
import Icon, { type IconName } from "./Icon"

export type BadgeTone = "brand" | "gray" | "green" | "amber" | "red" | "accent"

type Props = {
  tone?: BadgeTone
  size?: "sm" | "md" | "lg"
  icon?: IconName
  className?: string
  children: ReactNode
}

export default function Badge({
  tone = "gray",
  size = "md",
  icon,
  className,
  children,
}: Props) {
  return (
    <span className={cx("badge", `badge-${tone}`, `badge-${size}`, className)}>
      {icon ? <Icon name={icon} className="size-3.5" /> : null}
      {children}
    </span>
  )
}
