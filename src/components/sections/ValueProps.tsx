import { valueProps } from "../../data/content"
import Icon from "../ui/Icon"

/**
 * Trust row: hairline-separated cells, mono label, one line of detail. Kept off
 * the home page — the hero's figures already carry that job there — but useful
 * at the foot of the repair, sell and basket pages.
 */
export default function ValueProps() {
  return (
    <section className="border-y border-line bg-muted">
      <ul className="content-boundary grid grid-cols-2 md:grid-cols-4">
        {valueProps.map((prop, i) => (
          <li
            key={prop.title}
            className={
              "flex flex-col gap-2 px-4 py-8 " +
              (i % 2 === 1 ? "border-l border-line " : "") +
              (i > 1 ? "border-t border-line md:border-t-0 " : "") +
              (i > 0 ? "md:border-l" : "")
            }
          >
            <Icon name={prop.glyph} className="size-5 text-ink-950" />
            <p className="micro-label text-ink-950">{prop.title}</p>
            <p className="text-sm text-ink-500">{prop.body}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
