import { flagshipSpecs } from "../../data/flagship"

export default function SpecTable() {
  return (
    <div className="spec-table">
      <div className="spec-row spec-row-head">
        <span>Feature</span>
        <span>Specification</span>
      </div>
      {flagshipSpecs.map((row) => (
        <div className="spec-row" key={row.feature}>
          <span className="spec-feature">{row.feature}</span>
          <span className="spec-value">{row.spec}</span>
        </div>
      ))}
    </div>
  )
}
