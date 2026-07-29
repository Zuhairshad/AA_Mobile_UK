import { heroCutout } from "../../data/images"
import SearchBox from "../layout/SearchBox"

export default function HeroSearch() {
  return (
    <section>
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-800 to-brand-950">
        {/* Decorative product render, cropped hard on mobile so it never
            competes with the heading. */}
        {heroCutout ? (
          <img
            src={heroCutout}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -bottom-10 hidden h-[130%] max-w-none object-contain opacity-40 md:block lg:right-8 lg:opacity-70"
          />
        ) : null}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"
          aria-hidden="true"
        />

        <div className="content-boundary relative py-20 text-center md:py-24 lg:text-left">
          <div className="max-w-2xl lg:max-w-xl">
            <h1 className="text-4xl font-semibold tracking-tight text-white md:text-6xl">
              What are you fixing?
            </h1>
            <p className="mt-3 text-lg font-medium text-brand-100 md:text-xl">
              Search 2,190 parts, 40 tools and every handset we have in stock —
              or book a repair and let us do it.
            </p>
          </div>
        </div>
      </div>

      {/* Search overlaps the hero edge, so it reads as the primary action
          rather than as part of the page below. */}
      <div className="content-boundary">
        <div className="flex -translate-y-1/2 justify-center">
          <div className="w-full md:w-[520px]">
            <SearchBox
              variant="hero"
              placeholder="Try “iPhone 13 battery” or “Galaxy S23 screen”"
            />
          </div>
        </div>
        <p className="-mt-3 text-center text-sm text-gray-600">
          or browse by category
        </p>
      </div>
    </section>
  )
}
