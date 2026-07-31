import { pressQuotes } from "../../data/content"
import SectionHead from "./SectionHead"

export default function PressStrip() {
  return (
    <section className="section-y">
      <div className="content-boundary flex flex-col gap-10 md:gap-12">
        <SectionHead label="Coverage" heading="In the press" />

        {/* Hairline-separated columns rather than four floating blocks: the
            rules do the grouping that whitespace alone was failing to do. */}
        <ul className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          {pressQuotes.map((item, i) => (
            <li
              key={item.source}
              className={
                i > 0 ? "lg:border-l lg:border-line lg:pl-8" : "lg:pr-8"
              }
            >
              <figure className="flex h-full flex-col gap-3">
                <figcaption className="micro-label">{item.source}</figcaption>
                <blockquote className="text-ink-800">“{item.quote}”</blockquote>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
