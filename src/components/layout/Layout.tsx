import { useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"
import Header from "./Header"
import Footer from "./Footer"
import CartDrawer from "../cart/CartDrawer"
import Toaster from "../ui/Toaster"

export default function Layout() {
  const { pathname, hash } = useLocation()

  // Restore scroll on navigation, but let in-page anchors do their own thing.
  useEffect(() => {
    if (hash) return
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [pathname, hash])

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow-lg"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <Toaster />
    </div>
  )
}
