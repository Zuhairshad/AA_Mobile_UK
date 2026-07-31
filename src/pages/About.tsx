import { Link } from "react-router-dom"
import { stats } from "../data/content"
import Accordion from "../components/ui/Accordion"
import Icon from "../components/ui/Icon"
import { buttonClass } from "../components/ui/Button"
import StatsBand from "../components/sections/StatsBand"

const policies = [
  {
    glyph: "shield" as const,
    title: "12-month guarantee",
    body: "Every part, tool and repair is covered for twelve months against failure in normal use. We replace the item or redo the work, and there is no diagnostic fee on a guarantee claim. It does not cover fresh physical damage or liquid ingress after the repair — we will always tell you honestly which of the two we think we are looking at.",
  },
  {
    glyph: "truck" as const,
    title: "Delivery",
    body: "Free UK delivery on orders over £65. Otherwise £3.95 tracked 48-hour or £5.95 next working day. Orders placed before 3pm on a working day are dispatched the same day from Birmingham, so there are no customs charges anywhere in the UK.",
  },
  {
    glyph: "recycle" as const,
    title: "Returns",
    body: "Thirty days from delivery to change your mind. Unopened items are refunded in full. Opened items are refunded less any loss of value, as the Consumer Contracts Regulations allow. Faulty items are refunded or replaced in full, and we cover the return postage.",
  },
  {
    glyph: "banknote" as const,
    title: "Trade & bulk",
    body: "If you run a shop, a school IT department or a fleet, we do wholesale parts pricing and contract repair. Volumes from twenty units a month. Ask for the trade price list.",
  },
]

const faqs = [
  {
    q: "Where are you?",
    a: "Birmingham city centre, five minutes from New Street. Open Monday to Saturday, 9am to 6pm. Walk-ins welcome — no appointment needed for a screen or battery.",
  },
  {
    q: "Are your parts genuine?",
    a: "Some are, some are not, and we always say which. Service-pack assemblies come from the manufacturer's own supply chain. Aftermarket parts are labelled as aftermarket and priced accordingly — for a five-year-old phone that is usually the sensible choice, and we will say so.",
  },
  {
    q: "Do you support the right to repair?",
    a: "Yes, and not just in principle. We publish part prices openly, we sell the same components we fit, and we will service a device you have already opened yourself. Locked-down hardware is bad for our customers and bad for our trade.",
  },
  {
    q: "How do I get in touch?",
    a: "Email hello@aamobile.co.uk, call 0121 496 0142, or come in. We answer email within a couple of hours during shop hours.",
  },
]

export default function About() {
  return (
    <>
      <section className="bg-gradient-to-br from-brand-700 via-brand-800 to-brand-950">
        <div className="content-boundary py-16 text-center md:py-20">
          <h1 className="font-display text-4xl font-bold tracking-tight text-white md:text-6xl">
            A repair shop that sells you the part
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-100 md:text-xl">
            We started on a market stall in 2015 fixing screens for a tenner. The
            principle has not changed: tell people the truth about what is wrong,
            charge a fair price, and sell them the part if they would rather do it
            themselves.
          </p>
        </div>
      </section>

      <StatsBand />

      <section className="section-y">
        <div className="content-boundary max-w-3xl">
          <h2 className="section-heading">How we got here</h2>
          <div className="prose-body mt-6">
            <p>
              AA Mobile began because the two of us kept being quoted more to fix a
              phone than the phone was worth. That is still the industry's default
              answer, and it is still usually wrong — a four-year-old handset with a
              fresh battery and a new screen is a perfectly good phone.
            </p>
            <p>
              So we do three things under one roof. We fix phones, quickly and for a
              price agreed before we start. We sell the exact parts and tools we use
              on the bench, at the price we pay for them, because a customer who
              wants to do it themselves is not a lost sale. And we buy phones back
              in any condition, because the worst outcome for everyone is a working
              device in a drawer.
            </p>
            <p>
              We have completed {stats[0].value} repairs since then. We still turn
              work away when a repair is not worth doing, and we still tell you when
              a cheaper aftermarket part is the sensible choice.
            </p>
          </div>
        </div>
      </section>

      <section className="section-y bg-gray-100">
        <div className="content-boundary">
          <h2 className="section-heading mb-10 text-center">The small print</h2>
          <ul className="grid gap-5 md:grid-cols-2">
            {policies.map((policy) => (
              <li
                key={policy.title}
                className="rounded-xl border border-gray-200 bg-white p-6"
              >
                <span className="flex size-11 items-center justify-center rounded-lg bg-brand-50 text-brand-500">
                  <Icon name={policy.glyph} className="size-6" />
                </span>
                <h3 className="mt-4 text-lg font-semibold">{policy.title}</h3>
                <p className="mt-2 text-sm text-gray-700">{policy.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-y">
        <div className="content-boundary max-w-3xl">
          <h2 className="section-heading mb-8 text-center">Anything else</h2>
          <Accordion items={faqs} />
        </div>
      </section>

      <section className="section-y bg-brand-50">
        <div className="content-boundary text-center">
          <h2 className="section-heading">Come and see us</h2>
          <p className="section-lede mx-auto mt-4 max-w-xl">
            Birmingham city centre, Monday to Saturday, 9am to 6pm. Free diagnostic
            whether or not you go ahead.
          </p>
          <dl className="mx-auto mt-8 grid max-w-2xl gap-6 sm:grid-cols-3">
            <div>
              <dt className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <Icon name="mapPin" className="size-4" />
                Shop
              </dt>
              <dd className="mt-1 text-sm font-medium">Birmingham B2</dd>
            </div>
            <div>
              <dt className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <Icon name="clock" className="size-4" />
                Hours
              </dt>
              <dd className="mt-1 text-sm font-medium">Mon – Sat, 9 – 6</dd>
            </div>
            <div>
              <dt className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <Icon name="mail" className="size-4" />
                Email
              </dt>
              <dd className="mt-1 text-sm font-medium">hello@aamobile.co.uk</dd>
            </div>
          </dl>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/repairs#book" className={buttonClass("primary", "lg")}>
              Book a repair
            </Link>
            <Link to="/parts" className={buttonClass("outline", "lg")}>
              Shop parts
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
