import { useState } from "react"
import { flagshipColors } from "../../data/flagship"
import phoneImage from "../../assets/products/iphone-15-pro-max.jpg"

export default function ColorPicker() {
  const [active, setActive] = useState(0)
  const color = flagshipColors[active]

  return (
    <div className="style-picker">
      <div className="style-image-wrap">
        <div className="style-backdrop" style={{ background: color.hex }} aria-hidden="true" />
        <img
          src={phoneImage}
          alt="AA Mobile flagship phone"
          className="style-image"
          style={{ boxShadow: `0 50px 90px -30px ${color.hex}80` }}
        />
      </div>

      <p className="style-color-name">{color.name}</p>

      <div className="swatch-row">
        {flagshipColors.map((c, i) => (
          <button
            key={c.name}
            type="button"
            className={`swatch${i === active ? " is-active" : ""}`}
            style={{ background: c.hex }}
            aria-label={c.name}
            aria-pressed={i === active}
            onClick={() => setActive(i)}
          />
        ))}
      </div>
    </div>
  )
}
