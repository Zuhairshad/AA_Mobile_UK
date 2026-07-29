import { valueProps } from "../../data/content"
import Icon from "../ui/Icon"

export default function ValueProps() {
  return (
    <section className="border-y border-brand-100 bg-brand-50">
      <ul className="content-boundary flex flex-col items-center gap-8 py-14 md:flex-row md:items-start md:justify-center md:gap-16">
        {valueProps.map((prop) => (
          <li
            key={prop.title}
            className="flex flex-col items-center gap-2 text-center md:w-52"
          >
            <Icon name={prop.glyph} className="size-8 text-brand-500" />
            <p className="font-semibold">{prop.title}</p>
            <p className="text-sm text-gray-700">{prop.body}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
