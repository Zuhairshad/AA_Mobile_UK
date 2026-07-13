type PhoneIllustrationProps = {
  accent: string
  variant?: "bar" | "notch" | "punch-hole" | "flip" | "tablet"
  label?: string
}

/**
 * Stylised line-art phone renders used in place of licensed product photography,
 * matching the desaturated single-object-on-dark-card look of the reference design.
 */
export default function PhoneIllustration({
  accent,
  variant = "punch-hole",
  label,
}: PhoneIllustrationProps) {
  const bodyWidth = variant === "tablet" ? 128 : 96
  const bodyHeight = variant === "tablet" ? 168 : 200
  const x = (220 - bodyWidth) / 2
  const y = (220 - bodyHeight) / 2

  return (
    <svg
      viewBox="0 0 220 220"
      className="phone-illustration"
      role="img"
      aria-label={label ?? "Phone"}
    >
      <defs>
        <linearGradient id={`shine-${accent.replace("#", "")}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.9" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.55" />
        </linearGradient>
      </defs>

      <rect
        x={x}
        y={y}
        width={bodyWidth}
        height={bodyHeight}
        rx={variant === "tablet" ? 14 : 22}
        fill="#0c0c0d"
        stroke={`url(#shine-${accent.replace("#", "")})`}
        strokeWidth="2.5"
      />

      <rect
        x={x + 6}
        y={y + (variant === "flip" ? bodyHeight * 0.52 : 10)}
        width={bodyWidth - 12}
        height={variant === "flip" ? bodyHeight * 0.42 : bodyHeight - 20}
        rx={variant === "tablet" ? 8 : 12}
        fill="#17181a"
      />

      {variant === "flip" && (
        <line
          x1={x + 4}
          x2={x + bodyWidth - 4}
          y1={y + bodyHeight * 0.5}
          y2={y + bodyHeight * 0.5}
          stroke={accent}
          strokeWidth="2"
          opacity="0.6"
        />
      )}

      {variant === "notch" && (
        <rect
          x={x + bodyWidth / 2 - 14}
          y={y + 10}
          width="28"
          height="8"
          rx="4"
          fill="#0c0c0d"
        />
      )}

      {variant === "punch-hole" && (
        <circle cx={x + bodyWidth / 2} cy={y + 18} r="3.5" fill="#0c0c0d" stroke={accent} strokeWidth="1" />
      )}

      {variant === "bar" && (
        <rect
          x={x + bodyWidth / 2 - 16}
          y={y + bodyHeight - 14}
          width="32"
          height="4"
          rx="2"
          fill={accent}
          opacity="0.7"
        />
      )}

      {/* camera module */}
      <rect
        x={x + bodyWidth - 26}
        y={y + 16}
        width="18"
        height="18"
        rx="5"
        fill="#0c0c0d"
        stroke={accent}
        strokeWidth="1.5"
        opacity="0.8"
      />
      <circle cx={x + bodyWidth - 21} cy={y + 21} r="2" fill={accent} />
      <circle cx={x + bodyWidth - 13} cy={y + 29} r="2" fill={accent} />
    </svg>
  )
}
