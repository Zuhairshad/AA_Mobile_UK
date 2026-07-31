import { Link } from "react-router-dom"
import { footerColumns, paymentMethods, site } from "../../data/content"
import Logo from "./Logo"
import Icon from "../ui/Icon"

/**
 * Real destinations rather than href="/" — every icon previously navigated to
 * the home page, which reads as a broken link. Handles match the ones used in
 * the social wall copy; swap them for the real accounts before launch.
 */
const socials = [
  {
    name: "Instagram",
    icon: "instagram",
    href: "https://www.instagram.com/aamobileuk",
  },
  {
    name: "Facebook",
    icon: "facebook",
    href: "https://www.facebook.com/aamobileuk",
  },
  { name: "X", icon: "x", href: "https://x.com/aamobileuk" },
  {
    name: "YouTube",
    icon: "youtube",
    href: "https://www.youtube.com/@aamobileuk",
  },
  {
    name: "TikTok",
    icon: "tiktok",
    href: "https://www.tiktok.com/@aamobileuk",
  },
] as const

/** The bottom bar's two link cells. Real routes only — no placeholder hrefs. */
const barLinks = [
  { to: "/", label: "Home" },
  { to: "/parts", label: "Shop" },
  { to: "/repairs", label: "Repairs" },
  { to: "/guides", label: "Guides" },
]

const barLinksSecondary = [
  { to: "/about", label: "About" },
  { to: "/sitemap", label: "Sitemap" },
  { to: "/sell", label: "Trade in" },
]

export default function Footer() {
  return (
    <footer className="bg-dark pt-14 text-dark-muted">
      <div className="content-boundary">
        <Link
          to="/"
          className="mb-12 inline-block text-white"
          aria-label={`${site.name} home`}
        >
          <Logo
            markClassName="bg-white/10"
            className="[&_span:last-child_span]:text-ink-400"
          />
        </Link>

        <div className="flex flex-col gap-10 pb-10 md:flex-row md:justify-between">
          <div className="grid flex-1 grid-cols-2 gap-6 lg:grid-cols-3 lg:pr-16">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <p className="micro-label micro-label-invert mb-4">
                  {column.title}
                </p>
                <ul className="space-y-2">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="text-sm text-dark-muted transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* The newsletter signup is gone. It set a local flag and showed a
              confirmation — it never subscribed anyone, so it was a form that
              lied about what it did. It comes back when there is a list behind
              it. The socials keep their 36px hit areas; a bare 20px icon is
              under the 24px minimum and hard to hit on a phone. */}
          <div className="flex flex-wrap gap-1 md:items-start">
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`${site.name} on ${social.name}`}
                className="flex size-9 items-center justify-center text-dark-muted transition-colors hover:bg-white/10 hover:text-white"
              >
                <Icon name={social.icon} />
              </a>
            ))}
          </div>
        </div>

        <ul className="flex flex-wrap gap-2 border-t border-white/15 pt-8">
          {paymentMethods.map((method) => (
            <li
              key={method}
              className="micro-label micro-label-invert border border-white/15 px-2 py-1.5"
            >
              {method}
            </li>
          ))}
        </ul>
      </div>

      {/* Single-row bar with dotted dividers, as on the reference template:
          three cells of mono links with the legal line in the middle. */}
      <div className="mt-12 border-t border-white/15">
        <div className="content-boundary grid divide-y divide-dotted divide-white/20 md:grid-cols-3 md:divide-x md:divide-y-0">
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-5 md:justify-start">
            {barLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="micro-label micro-label-invert transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Deliberately not a well-formed company/VAT number. A plausible one
              here reads as fact and could point at a real registration, so the
              placeholder is left obvious until the real details are supplied. */}
          <p className="micro-label micro-label-invert flex items-center justify-center py-5 text-center">
            © {new Date().getFullYear()} {site.name} · Co. no. [COMPANY NUMBER] ·
            VAT [VAT NUMBER]
          </p>

          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-5 md:justify-end">
            {barLinksSecondary.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="micro-label micro-label-invert transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
