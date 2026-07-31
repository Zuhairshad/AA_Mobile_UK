import { useState } from "react"
import { Link } from "react-router-dom"
import { footerColumns, paymentMethods, site } from "../../data/content"
import Logo from "./Logo"
import Button from "../ui/Button"
import Icon from "../ui/Icon"

/**
 * Real destinations rather than href="/" — every icon previously navigated to
 * the home page, which reads as a broken link. Handles match the ones used in
 * the social wall copy; swap them for the real accounts before launch.
 */
const socials = [
  { name: "Instagram", icon: "instagram", href: "https://www.instagram.com/aamobileuk" },
  { name: "Facebook", icon: "facebook", href: "https://www.facebook.com/aamobileuk" },
  { name: "X", icon: "x", href: "https://x.com/aamobileuk" },
  { name: "YouTube", icon: "youtube", href: "https://www.youtube.com/@aamobileuk" },
  { name: "TikTok", icon: "tiktok", href: "https://www.tiktok.com/@aamobileuk" },
] as const

export default function Footer() {
  const [email, setEmail] = useState("")
  const [signedUp, setSignedUp] = useState(false)

  return (
    <footer className="mt-16 bg-gray-950 py-12 text-gray-300">
      <div className="content-boundary">
        <Link
          to="/"
          className="mb-10 inline-block text-white"
          aria-label={`${site.name} home`}
        >
          <Logo
            markClassName="bg-white/10"
            className="[&_span:last-child_span]:text-gray-400"
          />
        </Link>

        <div className="flex flex-col gap-10 pb-10 md:flex-row md:justify-between">
          <div className="grid flex-1 grid-cols-2 gap-6 lg:grid-cols-3 lg:pr-16">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <p className="mb-3 text-base font-semibold text-white">
                  {column.title}
                </p>
                <ul className="space-y-2">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="text-sm text-gray-300 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="w-full md:max-w-sm">
            <p className="text-base font-semibold text-white">Stay in the loop</p>
            <p className="mt-1 text-sm text-gray-400">
              Repair guides, new stock and the odd teardown. Once a month, no more.
            </p>
            {signedUp ? (
              <p
                className="mt-4 flex items-center gap-2 text-sm text-green-400"
                role="status"
              >
                <Icon name="check" className="size-4" />
                Thanks — check your inbox to confirm.
              </p>
            ) : (
              <form
                className="mt-4 flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault()
                  setSignedUp(true)
                }}
              >
                <label className="sr-only" htmlFor="newsletter-email">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="min-w-0 flex-1 rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 !text-base text-white placeholder:text-gray-500 focus:border-brand-400 focus:ring-2 focus:ring-brand-400/40 focus:outline-none"
                />
                <Button type="submit">Subscribe</Button>
              </form>
            )}

            {/* size-9 rather than the bare 20px icon: a 20x20 target is below
                the 24x24 minimum and hard to hit on a phone. */}
            <div className="mt-6 flex flex-wrap gap-1">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`${site.name} on ${social.name}`}
                  className="flex size-9 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <Icon name={social.icon} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* gray-400 rather than gray-500: on near-black gray-500 measures 4.16:1. */}
        <div className="flex flex-col gap-4 border-t border-gray-800 pt-6 text-xs text-gray-400 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. Company no. 09284471. VAT
            GB 284 9917 03.
          </p>
          <ul className="flex flex-wrap gap-2">
            {paymentMethods.map((method) => (
              <li
                key={method}
                className="rounded border border-gray-800 bg-gray-900 px-2 py-1 text-[11px] text-gray-400"
              >
                {method}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
