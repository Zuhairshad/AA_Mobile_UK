import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { Outlet, useLocation } from "react-router-dom"
import Header from "./Header"
import Footer from "./Footer"
import Rails from "./Rails"
import { ArtworkPaintServers } from "../product/artworkShared"
import CartDrawer from "../cart/CartDrawer"
import Toaster from "../ui/Toaster"

export default function Layout() {
  const { pathname, hash } = useLocation()
  const frame = useRef<HTMLDivElement>(null)
  const [frameHeight, setFrameHeight] = useState(0)

  // Restore scroll on navigation, but let in-page anchors do their own thing.
  useEffect(() => {
    if (hash) return
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [pathname, hash])

  /**
   * How many tick marks the rails should draw, from the page's layout height.
   *
   * `offsetHeight` of this wrapper, deliberately — not `document.scrollHeight`.
   * The rails are absolutely positioned, and out-of-flow boxes contribute to
   * scrollHeight, so measuring the document meant the rails were part of the
   * number that sized them: a ratchet that could only grow. Navigating from a
   * tall page to a short one left thousands of pixels of dead scroll under the
   * footer until a reload reset the state. `offsetHeight` ignores out-of-flow
   * descendants, so the rails cannot feed back into their own measurement.
   *
   * Observed rather than measured once, because lazy images and the filter
   * drawer both change the height after first paint.
   */
  useLayoutEffect(() => {
    const el = frame.current
    if (!el) return
    const measure = () => setFrameHeight(el.offsetHeight)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    window.addEventListener("resize", measure)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [])

  return (
    <div ref={frame} className="relative flex min-h-dvh flex-col">
      <a
        href="#main"
        className="focus:ring-primary sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:ring-2"
      >
        Skip to content
      </a>
      <Rails height={frameHeight} />
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ArtworkPaintServers />
      <CartDrawer />
      <Toaster />
    </div>
  )
}
