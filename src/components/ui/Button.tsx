import type { ButtonHTMLAttributes } from "react"
import { cx } from "../../lib/cx"

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "link"
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "icon"

/**
 * Class builder, exported separately so react-router `<Link>` elements can look
 * like buttons without wrapping an anchor in a button.
 */
export function buttonClass(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
) {
  return cx("btn", `btn-${variant}`, `btn-${size}`, className)
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
}

export default function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...rest
}: Props) {
  return (
    <button type={type} className={buttonClass(variant, size, className)} {...rest} />
  )
}
