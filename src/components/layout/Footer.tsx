import { useState } from "react"
import { Link } from "react-router-dom"
import { footerColumns, paymentMethods, site } from "../../data/content"
import Button from "../ui/Button"
import Icon from "../ui/Icon"

const socials = [
  { name: "Instagram", icon: "instagram" },
  { name: "Facebook", icon: "facebook" },
  { name: "X", icon: "x" },
  { name: "YouTube", icon: "youtube" },
  { name: "TikTok", icon: "tiktok" },
] as const

export default function Footer() {
  const [email, setEmail] = useState("")
  const [signedUp, setSignedUp] = useState(false)

  return (
    <footer className="mt-16 bg-gray-950 py-12 text-gray-300">
      <div className="content-boundary">
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

            <div className="mt-6 flex flex-wrap gap-3">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href="/"
                  aria-label={social.name}
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  <Icon name={social.icon} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-gray-800 pt-6 text-xs text-gray-500 md:flex-row md:items-center md:justify-between">
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
