import { stats } from "../../data/content"

export default function StatsBand() {
  return (
    <section className="border-y border-brand-100 bg-brand-50">
      <div className="content-boundary">
        <dl className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-8 py-12 lg:gap-10">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              {/* Label first in the DOM so screen readers hear what the number
                  means before the number, then visually reordered. */}
              <dt className="order-2 text-center text-sm text-brand-700">
                {stat.label}
              </dt>
              <dd className="figure order-1 m-0 text-center text-3xl font-bold text-brand-500 md:text-4xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
