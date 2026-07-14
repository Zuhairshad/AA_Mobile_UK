import { useState } from "react"
import { testimonials } from "../../data/flagship"

const PAGE_SIZE = 3

export default function Testimonials() {
  const [start, setStart] = useState(0)
  const pageCount = Math.ceil(testimonials.length / PAGE_SIZE)
  const page = Math.floor(start / PAGE_SIZE)

  const visible = Array.from(
    { length: PAGE_SIZE },
    (_, i) => testimonials[(start + i) % testimonials.length],
  )

  function goPrev() {
    setStart((s) => (s - PAGE_SIZE + testimonials.length) % testimonials.length)
  }

  function goNext() {
    setStart((s) => (s + PAGE_SIZE) % testimonials.length)
  }

  return (
    <div className="testimonials">
      <div className="testimonial-grid">
        {visible.map((t) => (
          <div className="testimonial-card" key={t.handle}>
            <span className="testimonial-quote-mark">&ldquo;&rdquo;</span>
            <p>{t.quote}</p>
            <div className="testimonial-author">
              <span className="testimonial-avatar" aria-hidden="true">
                {t.name.charAt(0)}
              </span>
              <div>
                <p className="testimonial-name">{t.name}</p>
                <p className="testimonial-handle">{t.handle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="carousel-controls">
        <button type="button" aria-label="Previous testimonials" onClick={goPrev}>
          &larr;
        </button>
        <span className="carousel-dots">
          {Array.from({ length: pageCount }, (_, i) => (
            <span key={i} className={`carousel-dot${i === page ? " is-active" : ""}`} />
          ))}
        </span>
        <button type="button" aria-label="Next testimonials" onClick={goNext}>
          &rarr;
        </button>
      </div>
    </div>
  )
}
