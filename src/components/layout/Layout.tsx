import { useEffect, useLayoutEffect, useState } from "react"
import { Outlet, useLocation } from "react-router-dom"
import Header from "./Header"
import Footer from "./Footer"
import Rails from "./Rails"
import { ArtworkPaintServers } from "../product/artworkShared"
import CartDrawer from "../cart/CartDrawer"
import Toaster from "../ui/Toaster"

export default function Layout() {
  const { pathname, hash } = useLocation()
  const [docHeight, setDocHeight] = useState(0)

  // Restore scroll on navigation, but let in-page anchors do their own thing.
  useEffect(() => {
    if (hash) return
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [pathname, hash])

  /**
   * The rails have to span the whole document, and the document's height is not
   * knowable from CSS alone — a fixed overlay would clip at the viewport and an
   * `inset-0` absolute one stops at the flex container's own height, which lazy
   * images and the facet sidebar both change after first paint. Observed rather
   * than measured once, so the rails stay the right length as content settles.
   */
  useLayoutEffect(() => {
    const measure = () =>
      setDocHeight(
        Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
      )
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(document.body)
    window.addEventListener("resize", measure)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [pathname])

  return (
    <div className="relative flex min-h-dvh flex-col">
      <a
        href="#main"
        className="focus:ring-primary sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:ring-2"
      >
        Skip to content
      </a>
      <Rails height={docHeight} />
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
