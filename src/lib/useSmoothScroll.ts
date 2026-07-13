import { useEffect, useRef } from "react"
import Lenis from "lenis"

/**
 * Mounts a Lenis smooth-scroll instance for as long as the calling component
 * is on screen, and destroys it on unmount (i.e. scoped to one route).
 * Returns a scrollToId helper so CTAs can smooth-scroll to an anchor.
 */
export function useSmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true, lerp: 0.12 })
    lenisRef.current = lenis
    return () => {
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  function scrollToId(id: string) {
    const target = document.getElementById(id)
    if (!target) return
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { offset: -24 })
    } else {
      target.scrollIntoView({ behavior: "smooth" })
    }
  }

  return { scrollToId }
}
