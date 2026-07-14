import { useEffect, useRef } from "react"
import Lenis from "lenis"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import "lenis/dist/lenis.css"

gsap.registerPlugin(ScrollTrigger)

/**
 * Mounts a Lenis smooth-scroll instance wired into GSAP's ticker/ScrollTrigger
 * (per lenis.dev's documented integration) for as long as the calling
 * component is on screen, and tears everything down on unmount.
 * Returns a scrollToId helper so CTAs can smooth-scroll to an anchor.
 */
export function useSmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1, duration: 1.2 })
    lenisRef.current = lenis

    lenis.on("scroll", ScrollTrigger.update)

    const tick = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
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
