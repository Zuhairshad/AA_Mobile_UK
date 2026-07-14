import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import flagshipCutout from "../../assets/products/iphone-15-pro-max-cutout.webp"

gsap.registerPlugin(ScrollTrigger)

const LINES = [
  "A UK phone shop that blends fair prices, fast delivery, and honest trade-ins.",
  "Instant quotes, certified refurbished stock, and a fit for every budget.",
  "Just the phone you want, no distractions.",
]

export default function ScrollStory() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const lineRefs = useRef<(HTMLParagraphElement | null)[]>([])

  useGSAP(
    () => {
      const lines = lineRefs.current.filter(Boolean) as HTMLParagraphElement[]
      if (!sectionRef.current || lines.length === 0) return

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
        },
      })

      lines.forEach((line, i) => {
        tl.fromTo(
          line,
          { opacity: 0.15 },
          { opacity: 1, duration: 1 },
          i,
        )
      })
    },
    { scope: sectionRef },
  )

  return (
    <section className="scroll-story" id="story" ref={sectionRef}>
      <div className="story-grid">
        <div className="story-sticky-col">
          <img src={flagshipCutout} alt="" className="story-image" />
        </div>

        <div className="story-text-col">
          <p className="story-eyebrow">Meet AA Mobile</p>
          {LINES.map((line, i) => (
            <p
              key={line}
              className="story-line"
              ref={(el) => {
                lineRefs.current[i] = el
              }}
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
