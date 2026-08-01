import { useCallback, useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"
import Button from "./Button"
import Icon from "./Icon"

type Props = {
  /** Labelled by the section heading so the region is announced usefully. */
  labelledBy?: string
  children: ReactNode
}

/**
 * Scroll-snap carousel. The viewport bleeds to the window edges while items
 * stay aligned to the page gutter, so cards run off the side of the screen
 * instead of stopping short at the container edge.
 */
export default function Carousel({ labelledBy, children }: Props) {
  const viewport = useRef<HTMLDivElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const sync = useCallback(() => {
    const el = viewport.current
    if (!el) return
    // 2px slack: fractional scroll widths never land exactly on the boundary.
    setAtStart(el.scrollLeft <= 2)
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2)
  }, [])

  useEffect(() => {
    sync()
    const el = viewport.current
    if (!el) return
    const observer = new ResizeObserver(sync)
    observer.observe(el)
    return () => observer.disconnect()
  }, [sync])

  const scrollBy = (direction: 1 | -1) => {
    const el = viewport.current
    if (!el) return
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" })
  }

  return (
    <div
      className="relative flex flex-col gap-4"
      role="region"
      aria-roledescription="carousel"
      aria-labelledby={labelledBy}
    >
      <div
        ref={viewport}
        onScroll={sync}
        className="bleed-x snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex gap-6 pb-1">{children}</div>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => scrollBy(-1)}
          disabled={atStart}
          aria-label="Previous items"
        >
          <Icon name="chevronLeft" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => scrollBy(1)}
          disabled={atEnd}
          aria-label="Next items"
        >
          <Icon name="chevronRight" />
        </Button>
      </div>
    </div>
  )
}

export function CarouselItem({ children }: { children: ReactNode }) {
  return (
    <div
      className="min-w-0 shrink-0 grow-0 basis-auto snap-start"
      role="group"
      aria-roledescription="slide"
    >
      {children}
    </div>
  )
}
