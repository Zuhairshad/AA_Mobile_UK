import { useState } from "react"
import { bookingSteps, repairServices } from "../data/services"
import Accordion from "../components/ui/Accordion"
import Banner from "../components/sections/Banner"
import Button from "../components/ui/Button"
import Icon from "../components/ui/Icon"
import RepairServices from "../components/sections/RepairServices"
import ValueProps from "../components/sections/ValueProps"

const faqs = [
  {
    q: "Do I need an appointment?",
    a: "No — walk-ins are welcome and screens and batteries are usually done while you wait. Booking a slot just means you skip the queue at busy times, which in term time is most Saturdays.",
  },
  {
    q: "Will I lose my data?",
    a: "No. A screen, battery or port repair does not touch your storage. We still recommend a backup before any repair, because that is sensible advice for any device that is about to be opened.",
  },
  {
    q: "What if you cannot fix it?",
    a: "You pay nothing. The diagnostic is free whether or not you go ahead, and if we start a repair and cannot complete it we do not charge for the labour.",
  },
  {
    q: "Is the repair guaranteed?",
    a: "Twelve months on parts and labour. If the same fault returns in normal use, bring it back and we will put it right with no diagnostic fee.",
  },
  {
    q: "Can you repair a phone I did not buy from you?",
    a: "Of course — most of what comes through the door was bought elsewhere. We will also service a phone you have already opened yourself.",
  },
]

export default function Repairs() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <>
      <section className="bg-gradient-to-br from-brand-700 via-brand-800 to-brand-950">
        <div className="content-boundary py-16 text-center md:py-20">
          <h1 className="font-display text-4xl font-bold tracking-tight text-white md:text-6xl">
            Repairs while you wait
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-100 md:text-xl">
            Free diagnostic, fixed price before we start, twelve months on the
            work. Most screens and batteries are done in under an hour.
          </p>
          <dl className="mx-auto mt-10 grid max-w-2xl grid-cols-3 gap-6 text-white">
            <div>
              <dd className="font-mono text-2xl font-bold md:text-3xl">45 min</dd>
              <dt className="text-sm text-brand-200">Typical screen repair</dt>
            </div>
            <div>
              <dd className="font-mono text-2xl font-bold md:text-3xl">Free</dd>
              <dt className="text-sm text-brand-200">Diagnostic, always</dt>
            </div>
            <div>
              <dd className="font-mono text-2xl font-bold md:text-3xl">12 mo</dd>
              <dt className="text-sm text-brand-200">Guarantee</dt>
            </div>
          </dl>
        </div>
      </section>

      <RepairServices showHeading={false} />

      <ValueProps />

      <section className="section-y">
        <div className="content-boundary">
          <h2 className="section-heading mb-10 text-center">How it works</h2>
          <ol className="grid gap-6 md:grid-cols-3">
            {bookingSteps.map((step, i) => (
              <li
                key={step.title}
                className="rounded-xl border border-gray-200 bg-white p-6"
              >
                <span className="flex size-9 items-center justify-center rounded-full bg-brand-500 font-mono text-sm font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="book" className="section-y scroll-mt-32 bg-gray-100">
        <div className="content-boundary max-w-2xl">
          <h2 className="section-heading text-center">Book a repair</h2>
          <p className="section-lede mt-3 text-center">
            Tell us what is wrong and we will confirm the price and a slot by
            return.
          </p>

          {submitted ? (
            <div
              className="mt-8 rounded-xl border border-green-200 bg-green-50 p-6 text-center"
              role="status"
            >
              <Icon name="check" className="mx-auto size-8 text-green-700" />
              <p className="mt-3 text-lg font-semibold text-green-900">
                Booking request received
              </p>
              <p className="mt-2 text-sm text-green-800">
                We will confirm your slot and the price by email within a couple of
                hours during shop hours. Nothing is charged until the repair is
                agreed.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setSubmitted(false)}
              >
                Book another repair
              </Button>
            </div>
          ) : (
            <form
              className="mt-8 rounded-xl border border-gray-200 bg-white p-6"
              onSubmit={(e) => {
                e.preventDefault()
                setSubmitted(true)
              }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="field-label" htmlFor="repair-name">
                    Your name
                  </label>
                  <input id="repair-name" required className="field" />
                </div>
                <div>
                  <label className="field-label" htmlFor="repair-email">
                    Email
                  </label>
                  <input
                    id="repair-email"
                    type="email"
                    required
                    className="field"
                  />
                </div>
                <div>
                  <label className="field-label" htmlFor="repair-device">
                    Device
                  </label>
                  <input
                    id="repair-device"
                    required
                    placeholder="e.g. iPhone 13"
                    className="field"
                  />
                </div>
                <div>
                  <label className="field-label" htmlFor="repair-service">
                    What needs doing
                  </label>
                  <select id="repair-service" className="field">
                    {repairServices.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                    <option value="other">Something else</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="field-label" htmlFor="repair-notes">
                    Anything else we should know
                  </label>
                  <textarea id="repair-notes" rows={4} className="field" />
                </div>
              </div>

              <Button type="submit" size="lg" className="mt-5 w-full">
                Request a slot
              </Button>
              <p className="mt-3 text-center text-xs text-gray-500">
                This is a demo storefront — the form does not send anything.
              </p>
            </form>
          )}
        </div>
      </section>

      <Banner
        heading="Prefer to fix it yourself?"
        body="Every part we fit is on the shelf at the same price we pay for it, with the fix kit to match. If you get stuck, bring it in and we will finish the job."
        ctaLabel="Shop repair parts"
        ctaTo="/parts"
      />

      <section className="section-y">
        <div className="content-boundary max-w-3xl">
          <h2 className="section-heading mb-8 text-center">
            Questions about repairs
          </h2>
          <Accordion items={faqs} />
        </div>
      </section>
    </>
  )
}
