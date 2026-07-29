import Icon from "./Icon"

export type AccordionItem = {
  q: string
  a: string
}

type Props = {
  items: AccordionItem[]
}

/**
 * Built on native <details>/<summary>: keyboard support, screen-reader
 * semantics and in-page find all work without any JS state.
 */
export default function Accordion({ items }: Props) {
  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white">
      {items.map((item) => (
        <details key={item.q} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium hover:bg-gray-50 [&::-webkit-details-marker]:hidden">
            {item.q}
            <Icon
              name="chevronDown"
              className="size-5 shrink-0 text-gray-500 transition-transform group-open:-rotate-180"
            />
          </summary>
          <div className="prose-body px-5 pb-5 text-sm">{item.a}</div>
        </details>
      ))}
    </div>
  )
}
