import { useEffect, useMemo, useState } from "react"
import { Link, useParams, useSearchParams } from "react-router-dom"
import { products } from "../data/catalogue"
import { categoryBySlug, type CategorySlug, type FacetKey } from "../data/taxonomy"
import {
  PAGE_SIZE,
  applyFacets,
  countSelected,
  paramFor,
  selectionsFromParams,
  sortOptions,
  sortProducts,
  type SortValue,
} from "../lib/facets"
import { formatCount } from "../lib/format"
import { cx } from "../lib/cx"
import Breadcrumbs from "../components/ui/Breadcrumbs"
import Button from "../components/ui/Button"
import Icon from "../components/ui/Icon"
import FacetSidebar from "../components/product/FacetSidebar"
import ProductGrid from "../components/product/ProductGrid"
import NotFound from "./NotFound"

export default function Category() {
  const { category: slug, subcategory: subSlug } = useParams<{
    category: string
    subcategory?: string
  }>()
  const [params, setParams] = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)

  const category = slug ? categoryBySlug.get(slug as CategorySlug) : undefined
  const sub = subSlug
    ? category?.subcategories.find((s) => s.slug === subSlug)
    : undefined

  const selections = useMemo(() => selectionsFromParams(params), [params])
  const selectedCount = countSelected(selections)
  const sort = (params.get("sort") as SortValue | null) ?? "featured"
  const page = Math.max(1, Number(params.get("page") ?? 1) || 1)

  /**
   * On a subcategory page the subcategory is part of the URL path rather than a
   * filter, so it is applied here and its facet group is hidden below.
   */
  const categoryProducts = useMemo(() => {
    if (!category) return []
    return products.filter(
      (p) =>
        p.category === category.slug && (!sub || p.subcategory === sub.slug),
    )
  }, [category, sub])

  const results = useMemo(() => {
    const filtered = applyFacets(categoryProducts, selections)
    return sortProducts(filtered, sort)
  }, [categoryProducts, selections, sort])

  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount)
  const pageItems = results.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  // A filter change can leave you past the last page; walk back rather than
  // showing an empty grid.
  useEffect(() => {
    if (page > pageCount) {
      const next = new URLSearchParams(params)
      next.delete("page")
      setParams(next, { replace: true })
    }
  }, [page, pageCount, params, setParams])

  if (!category) return <NotFound />
  if (subSlug && !sub) return <NotFound />

  const heading = sub ? sub.name : category.name
  const lede = sub
    ? `${sub.name} in ${category.name}. ${category.tagline}`
    : category.tagline

  const update = (mutate: (next: URLSearchParams) => void) => {
    const next = new URLSearchParams(params)
    mutate(next)
    next.delete("page")
    setParams(next)
  }

  const toggleFacet = (key: FacetKey, value: string) => {
    update((next) => {
      const name = paramFor[key]
      const current = (next.get(name) ?? "").split(",").filter(Boolean)
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      if (updated.length === 0) next.delete(name)
      else next.set(name, updated.join(","))
    })
  }

  const clearFacets = () =>
    update((next) => {
      for (const name of Object.values(paramFor)) next.delete(name)
    })

  const goToPage = (n: number) => {
    const next = new URLSearchParams(params)
    if (n <= 1) next.delete("page")
    else next.set("page", String(n))
    setParams(next)
  }

  const sidebar = (
    <FacetSidebar
      category={category.slug}
      categoryProducts={categoryProducts}
      selections={selections}
      selectedCount={selectedCount}
      onToggle={toggleFacet}
      onClear={clearFacets}
      hideGroups={sub ? ["subcategory"] : undefined}
    />
  )

  // Pagination gets unwieldy past a handful of pages; window it around current.
  const pageWindow = (() => {
    const span = 2
    const from = Math.max(1, safePage - span)
    const to = Math.min(pageCount, safePage + span)
    return Array.from({ length: to - from + 1 }, (_, i) => from + i)
  })()

  return (
    <>
      <div className="border-b border-gray-200 bg-white">
        <div className="content-boundary py-8 md:py-10">
          <Breadcrumbs
            trail={[
              { label: "Home", to: "/" },
              ...(sub
                ? [
                    { label: category.name, to: `/${category.slug}` },
                    { label: sub.name },
                  ]
                : [{ label: category.name }]),
            ]}
          />
          <h1 className="section-heading mt-4">{heading}</h1>
          <p className="section-lede mt-2">{lede}</p>
          {!sub ? (
            <p className="prose-body mt-4 max-w-3xl text-sm">{category.intro}</p>
          ) : null}
        </div>
      </div>

      {/* Canonical subcategory pages — a real URL per part type, rather than
          only a filter, so they can be linked and indexed. */}
      <div className="content-boundary pt-8">
        <ul className="flex flex-wrap gap-2">
          {category.subcategories.map((entry) => {
            const active = entry.slug === sub?.slug
            return (
              <li key={entry.slug}>
                <Link
                  to={
                    active
                      ? `/${category.slug}`
                      : `/${category.slug}/${entry.slug}`
                  }
                  aria-current={active ? "page" : undefined}
                  className={cx(
                    "btn btn-sm gap-2",
                    active ? "btn-primary" : "btn-outline",
                  )}
                >
                  <Icon name={entry.glyph} className="size-4" />
                  {entry.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="content-boundary py-8">
        <div className="flex gap-8">
          <aside className="hidden w-64 shrink-0 lg:block">
            <h2 className="mb-4 text-lg font-semibold">Filter</h2>
            {sidebar}
          </aside>

          <div className="min-w-0 flex-1">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-gray-600" role="status">
                {formatCount(results.length)}{" "}
                {results.length === 1 ? "result" : "results"}
                {selectedCount > 0 ? ` · ${selectedCount} filters applied` : ""}
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setFiltersOpen(true)}
                >
                  <Icon name="sliders" className="size-4" />
                  Filter{selectedCount > 0 ? ` (${selectedCount})` : ""}
                </Button>

                <label className="flex items-center gap-2 text-sm">
                  <span className="sr-only sm:not-sr-only sm:text-gray-600">
                    Sort by
                  </span>
                  <select
                    value={sort}
                    onChange={(e) =>
                      update((next) => {
                        if (e.target.value === "featured") next.delete("sort")
                        else next.set("sort", e.target.value)
                      })
                    }
                    className="h-8 rounded-lg border border-line bg-white px-2 text-sm focus:border-brand-500"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <h2 className="sr-only">
              {sub ? sub.name : category.name} products
            </h2>

            {pageItems.length === 0 ? (
              <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
                <p className="font-semibold">Nothing matches those filters</p>
                <p className="mt-2 text-sm text-gray-600">
                  Try removing a filter, or search for your model directly.
                </p>
                <Button variant="outline" className="mt-4" onClick={clearFacets}>
                  Clear all filters
                </Button>
              </div>
            ) : (
              <ProductGrid products={pageItems} />
            )}

            {pageCount > 1 ? (
              <nav
                className="mt-10 flex flex-wrap items-center justify-center gap-1"
                aria-label="Pagination"
              >
                <Button
                  variant="outline"
                  size="icon"
                  disabled={safePage === 1}
                  onClick={() => goToPage(safePage - 1)}
                  aria-label="Previous page"
                >
                  <Icon name="chevronLeft" />
                </Button>
                {pageWindow[0] > 1 ? (
                  <>
                    <Button variant="outline" size="icon" onClick={() => goToPage(1)}>
                      1
                    </Button>
                    {pageWindow[0] > 2 ? (
                      <span className="px-1 text-gray-500">…</span>
                    ) : null}
                  </>
                ) : null}
                {pageWindow.map((n) => (
                  <Button
                    key={n}
                    variant={n === safePage ? "primary" : "outline"}
                    size="icon"
                    onClick={() => goToPage(n)}
                    aria-label={`Page ${n}`}
                    aria-current={n === safePage ? "page" : undefined}
                  >
                    {n}
                  </Button>
                ))}
                {pageWindow[pageWindow.length - 1] < pageCount ? (
                  <>
                    {pageWindow[pageWindow.length - 1] < pageCount - 1 ? (
                      <span className="px-1 text-gray-500">…</span>
                    ) : null}
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => goToPage(pageCount)}
                    >
                      {pageCount}
                    </Button>
                  </>
                ) : null}
                <Button
                  variant="outline"
                  size="icon"
                  disabled={safePage === pageCount}
                  onClick={() => goToPage(safePage + 1)}
                  aria-label="Next page"
                >
                  <Icon name="chevronRight" />
                </Button>
              </nav>
            ) : null}

            {category.slug === "parts" ? (
              <p className="mt-8 text-sm text-gray-600">
                Looking for a specific model?{" "}
                <Link to="/devices" className="text-primary hover:underline">
                  Browse by device
                </Link>{" "}
                to see everything that fits it, with fitted repair prices.
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <section className="border-t border-gray-200 bg-white">
        <div className="content-boundary py-12 text-center">
          <h2 className="text-2xl font-semibold">Quality guaranteed</h2>
          <p className="prose-body mx-auto mt-3 max-w-2xl">
            We have spent years vetting suppliers so you do not have to gamble on
            a listing. Every part and tool is covered by our 12-month guarantee,
            and if something fails in normal use we replace it — no diagnostic
            fee.{" "}
            <Link to="/about" className="text-primary hover:underline">
              How our guarantee works
            </Link>
          </p>
        </div>
      </section>

      {filtersOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Close filters"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 flex w-80 max-w-[85vw] flex-col bg-white">
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 px-4">
              <span className="font-semibold">Filter</span>
              <button
                type="button"
                className="btn btn-ghost btn-icon"
                aria-label="Close filters"
                onClick={() => setFiltersOpen(false)}
              >
                <Icon name="close" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">{sidebar}</div>
            <div className="shrink-0 border-t border-gray-200 p-4">
              <Button className="w-full" onClick={() => setFiltersOpen(false)}>
                Show {formatCount(results.length)}{" "}
                {results.length === 1 ? "result" : "results"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
