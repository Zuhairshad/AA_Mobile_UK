import { stats } from "../../data/content"
import SectionHead from "./SectionHead"

/**
 * Three or four big figures in the accent colour, mono caption underneath.
 *
 * The reference template uses this pattern once per page and it is the only
 * place colour appears in its chrome — which is precisely why the figures read
 * as important. Same rule here.
 */
export default function StatsBand() {
  return (
    <section className="section-y border-y border-line bg-muted">
      <div className="content-boundary flex flex-col gap-10 md:gap-12">
        <SectionHead
          label="By the numbers"
          heading="Nine years on the same bench"
          lede="Not a marketplace reselling other people's listings — one workshop, one set of standards."
        />

        <dl className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-10">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-2">
              {/* Label second visually but first for screen readers, so the
                  number is never announced without its meaning. */}
              <dt className="micro-label order-2 text-center">{stat.label}</dt>
              <dd className="figure order-1 m-0 text-center text-4xl font-extrabold text-primary md:text-5xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
