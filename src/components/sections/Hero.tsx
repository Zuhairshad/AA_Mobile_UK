import { Link } from "react-router-dom"
import { catalogueStats } from "../../data/content"
import { buttonClass } from "../ui/Button"
import SearchBox from "../layout/SearchBox"

/** Figures worth stating in the fold, all derived from the catalogue. */
const proof = [
  { value: catalogueStats.parts, label: "Parts in stock" },
  { value: catalogueStats.devices, label: "Models covered" },
  { value: catalogueStats.tools, label: "Tools & kits" },
  { value: `${catalogueStats.averageRating} / 5`, label: "Average rating" },
]

/**
 * White, quiet, and built around one very large piece of type.
 *
 * The previous hero was a dark gradient band with a stock phone render bleeding
 * out of the corner and a search box straddling the boundary — three competing
 * focal points, none of which said what the shop sells. This says it once, in
 * the largest type on the site, and puts the search directly underneath.
 */
export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="content-boundary">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 py-16 text-center md:gap-8 md:py-24">
          <p className="micro-label">Repairs &amp; parts · Birmingham</p>

          <h1
            className="section-heading text-[clamp(2.5rem,7vw,5.5rem)]"
            style={{ lineHeight: 0.95 }}
          >
            Fix it once.
            <br />
            Fix it properly.
          </h1>

          <p className="section-lede mx-auto max-w-xl">
            Screens, batteries and boards for {catalogueStats.devices} models —
            tested on arrival, graded honestly, and fitted while you wait.
          </p>

          <div className="w-full max-w-xl">
            <SearchBox
              variant="hero"
              placeholder="Try “iPhone 13 battery” or “Galaxy S23 screen”"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/parts" className={buttonClass("primary", "lg")}>
              Shop parts
            </Link>
            <Link to="/repairs" className={buttonClass("outline", "lg")}>
              Book a repair
            </Link>
          </div>
        </div>

        {/* Proof row, mono and small, sitting on a hairline like the reference
            template's "trusted by" strip. */}
        <dl className="grid grid-cols-2 border-t border-line md:grid-cols-4">
          {proof.map((item, i) => (
            <div
              key={item.label}
              className={
                "flex flex-col items-center gap-1 px-4 py-6 " +
                // Hairlines between cells, never on the outer edge.
                (i % 2 === 1 ? "border-l border-line " : "") +
                (i > 1 ? "border-t border-line md:border-t-0 " : "") +
                (i > 0 ? "md:border-l" : "")
              }
            >
              {/* Label after the figure in the DOM would read as a bare
                  number; screen readers get the meaning first. */}
              <dt className="micro-label order-2 text-center">{item.label}</dt>
              <dd className="figure order-1 m-0 text-2xl font-extrabold md:text-3xl">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
