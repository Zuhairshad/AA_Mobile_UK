import { useState } from "react"
import {
  facetGroups,
  type CategorySlug,
  type FacetKey,
} from "../../data/taxonomy"
import { facetOptions, type Selections } from "../../lib/facets"
import type { Product } from "../../data/catalogue"
import { formatCount } from "../../lib/format"
import Button from "../ui/Button"

const COLLAPSED_LIMIT = 6

type Props = {
  category: CategorySlug
  categoryProducts: Product[]
  selections: Selections
  selectedCount: number
  onToggle: (key: FacetKey, value: string) => void
  onClear: () => void
  /** Facets already fixed by the URL path, e.g. on a subcategory page. */
  hideGroups?: FacetKey[]
}

export default function FacetSidebar({
  category,
  categoryProducts,
  selections,
  selectedCount,
  onToggle,
  onClear,
  hideGroups,
}: Props) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  return (
    <div className="flex flex-col gap-6">
      {selectedCount > 0 ? (
        <Button variant="outline" size="sm" onClick={onClear}>
          Clear all filters ({selectedCount})
        </Button>
      ) : null}

      {facetGroups[category]
        .filter((group) => !hideGroups?.includes(group.key))
        .map((group) => {
          const options = facetOptions(
            categoryProducts,
            category,
            selections,
            group.key,
          )
          // A single-option group is noise — unless one of its options is the
          // filter currently narrowing the results, in which case hiding it would
          // strand the user with a filter they cannot see or remove.
          const hasSelection = options.some((o) => o.selected)
          if (options.length <= 1 && !hasSelection) return null

          const open = expanded[group.key]
          // Selected options are always visible: collapsing one out of sight
          // leaves the user unable to see — or clear — a filter they applied.
          const selected = options.filter((o) => o.selected)
          const unselected = options.filter((o) => !o.selected)
          const shown = open
            ? [...selected, ...unselected]
            : [
                ...selected,
                ...unselected.slice(
                  0,
                  Math.max(0, COLLAPSED_LIMIT - selected.length),
                ),
              ]
          const hidden = options.length - shown.length

          return (
            <fieldset key={group.key} className="border-0 p-0">
              <legend className="micro-label mb-3">{group.label}</legend>
              <ul className="space-y-1">
                {shown.map((option) => (
                  <li key={option.value}>
                    <label className="flex cursor-pointer items-center gap-2 rounded px-1 py-1 text-sm hover:bg-muted">
                      <input
                        type="checkbox"
                        checked={option.selected}
                        onChange={() => onToggle(group.key, option.value)}
                        className="size-4 shrink-0 accent-brand-500"
                      />
                      <span className="min-w-0 flex-1 truncate">
                        {option.label}
                      </span>
                      <span className="figure shrink-0 text-xs text-ink-500">
                        {formatCount(option.count)}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
              {hidden > 0 || open ? (
                <button
                  type="button"
                  onClick={() =>
                    setExpanded((prev) => ({
                      ...prev,
                      [group.key]: !prev[group.key],
                    }))
                  }
                  className="micro-label mt-2 px-1 py-2 text-primary hover:underline"
                >
                  {open ? "Show fewer" : `Show ${hidden} more`}
                </button>
              ) : null}
            </fieldset>
          )
        })}
    </div>
  )
}
