import Icon from "./Icon"

type Props = {
  value: number
  onChange: (next: number) => void
  min?: number
  max?: number
  label?: string
}

export default function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  label = "Quantity",
}: Props) {
  return (
    <div className="inline-flex items-center rounded-lg border border-line bg-white">
      <button
        type="button"
        className="btn btn-ghost btn-icon rounded-r-none"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <Icon name="minus" className="size-4" />
      </button>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        aria-label={label}
        onChange={(e) => {
          const next = Number(e.target.value)
          if (Number.isFinite(next)) {
            onChange(Math.min(max, Math.max(min, Math.round(next))))
          }
        }}
        className="w-12 border-0 bg-transparent py-2 text-center !text-base font-medium [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        className="btn btn-ghost btn-icon rounded-l-none"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <Icon name="plus" className="size-4" />
      </button>
    </div>
  )
}
