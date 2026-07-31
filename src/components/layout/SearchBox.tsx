import { useEffect, useId, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { searchAll } from "../../lib/search"
import { formatPrice } from "../../lib/format"
import { cx } from "../../lib/cx"
import Icon from "../ui/Icon"
import ProductImage from "../product/ProductImage"

type Props = {
  /** Larger, shadowed treatment used in the home page hero. */
  variant?: "header" | "hero"
  placeholder?: string
  className?: string
}

export default function SearchBox({
  variant = "header",
  placeholder = "Search phones, parts and tools",
  className,
}: Props) {
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  const wrapper = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const listId = useId()

  const hits = useMemo(() => searchAll(query), [query])

  // "/" focuses search from anywhere, unless the user is already typing.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/") return
      const el = e.target as HTMLElement | null
      if (el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return
      if (el?.isContentEditable) return
      e.preventDefault()
      input.current?.focus()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  // Close on outside click.
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!wrapper.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onDown)
    return () => document.removeEventListener("mousedown", onDown)
  }, [open])

  const go = (index: number) => {
    const hit = hits[index]
    if (!hit) return
    navigate(hit.to)
    setOpen(false)
    setQuery("")
    input.current?.blur()
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false)
      input.current?.blur()
      return
    }
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, hits.length - 1))
      return
    }
    if (e.key === "ArrowUp") {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
      return
    }
    if (e.key === "Enter") {
      e.preventDefault()
      if (hits.length > 0) go(active)
      else if (query.trim())
        navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const showList = open && query.trim().length >= 2

  return (
    <div ref={wrapper} className={cx("relative w-full", className)}>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault()
          if (hits.length > 0) go(active)
          else if (query.trim())
            navigate(`/search?q=${encodeURIComponent(query.trim())}`)
        }}
      >
        <div className="relative">
          <Icon
            name="search"
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-500"
          />
          <input
            ref={input}
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setOpen(true)
              setActive(0)
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            aria-label="Search"
            aria-expanded={showList}
            aria-controls={showList ? listId : undefined}
            autoComplete="off"
            spellCheck={false}
            className={cx(
              "w-full border border-transparent py-2 pr-12 pl-10 !text-base text-ink-950 placeholder:text-ink-500 focus:outline-none",
              "focus:border-brand-500 focus:ring-2 focus:ring-brand-500/40",
              variant === "hero"
                ? " bg-white shadow-lg"
                : "rounded-full bg-muted",
            )}
          />
          {/* Shortcut hint doubles as the affordance for the "/" binding. */}
          <span className="pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 rounded-full bg-ink-200 px-2 py-0.5 text-xs text-ink-600 md:block">
            /
          </span>
        </div>
      </form>

      {showList ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute top-full right-0 left-0 z-50 mt-2 max-h-96 overflow-auto border border-line bg-white py-1 shadow-xl"
        >
          {hits.length === 0 ? (
            <li className="px-4 py-3 text-sm text-ink-500">
              Nothing matched “{query.trim()}”. Try a model name, like “iPhone
              13”.
            </li>
          ) : (
            hits.map((hit, i) => (
              <li
                key={
                  hit.kind === "product" ? hit.product.id : hit.to + hit.kind
                }
              >
                <button
                  type="button"
                  role="option"
                  aria-selected={i === active}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(i)}
                  className={cx(
                    "flex w-full items-center gap-3 px-3 py-2 text-left",
                    i === active ? "bg-muted" : "hover:bg-muted",
                  )}
                >
                  {hit.kind === "product" ? (
                    <>
                      <span className="relative size-10 shrink-0 overflow-hidden bg-ink-50">
                        <ProductImage product={hit.product} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">
                          {hit.product.name}
                        </span>
                        <span className="block truncate text-xs text-ink-500">
                          {hit.product.brand}
                        </span>
                      </span>
                      <span className="text-sm font-semibold">
                        {formatPrice(hit.product.price)}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="flex size-10 shrink-0 items-center justify-center bg-muted text-ink-950">
                        <Icon
                          name={hit.kind === "service" ? "wrench" : "sliders"}
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">
                          {hit.label}
                        </span>
                        <span className="block truncate text-xs text-ink-500">
                          {hit.sub}
                        </span>
                      </span>
                    </>
                  )}
                </button>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  )
}
