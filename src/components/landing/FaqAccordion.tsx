import { useState } from "react"
import { faqs } from "../../data/flagship"

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="faq-list">
      {faqs.map((item, i) => {
        const isOpen = openIndex === i
        return (
          <div className={`faq-item${isOpen ? " is-open" : ""}`} key={item.q}>
            <button
              type="button"
              className="faq-question"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? null : i)}
            >
              <span>{item.q}</span>
              <span className="faq-icon" aria-hidden="true">
                {isOpen ? "−" : "+"}
              </span>
            </button>
            {isOpen && <p className="faq-answer">{item.a}</p>}
          </div>
        )
      })}
    </div>
  )
}
