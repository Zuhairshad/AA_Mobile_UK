import { pressQuotes } from "../../data/content"

export default function PressStrip() {
  return (
    <section className="section-y">
      <div className="content-boundary">
        <h2 className="section-heading mb-10 text-center">In the press</h2>
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {pressQuotes.map((item) => (
            <li key={item.source}>
              <figure className="flex h-full flex-col gap-3 text-center">
                <figcaption className="text-sm font-semibold tracking-wide text-gray-500 uppercase">
                  {item.source}
                </figcaption>
                <blockquote className="text-gray-800">“{item.quote}”</blockquote>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
