import { useEffect, useRef, useState } from "react"
import { Link, NavLink, useLocation } from "react-router-dom"
import { navMenus } from "../../data/nav"
import { site } from "../../data/content"
import { useCart } from "../../lib/cart"
import { cx } from "../../lib/cx"
import Icon from "../ui/Icon"
import Logo from "./Logo"
import SearchBox from "./SearchBox"
import { buttonClass } from "../ui/Button"

export default function Header() {
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { count, openDrawer } = useCart()
  const location = useLocation()
  const nav = useRef<HTMLElement>(null)

  // Any navigation closes whatever was open.
  useEffect(() => {
    setOpenMenu(null)
    setMenuOpen(false)
    setSearchOpen(false)
  }, [location.pathname, location.hash])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null)
        setMenuOpen(false)
        setSearchOpen(false)
      }
      // "/" has to open the sheet, because the input it used to focus is no
      // longer in the DOM until the sheet exists.
      if (e.key === "/") {
        const el = e.target as HTMLElement | null
        if (el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return
        if (el?.isContentEditable) return
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [])

  useEffect(() => {
    if (!openMenu) return
    const onDown = (e: MouseEvent) => {
      if (!nav.current?.contains(e.target as Node)) setOpenMenu(null)
    }
    document.addEventListener("mousedown", onDown)
    return () => document.removeEventListener("mousedown", onDown)
  }, [openMenu])

  // Prevent the page scrolling behind the mobile drawer.
  useEffect(() => {
    document.body.style.overflow = menuOpen || searchOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [menuOpen, searchOpen])

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <p className="micro-label bg-ink-950 py-2.5 text-center text-white">
        {site.promo}
      </p>

      <div className="content-boundary flex h-16 items-center gap-3">
        <button
          type="button"
          className="btn btn-ghost btn-icon -ml-2 lg:hidden"
          aria-label="Open navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        >
          <Icon name="menu" />
        </button>

        <Link to="/" className="shrink-0" aria-label={`${site.name} home`}>
          <Logo className="hidden sm:flex" />
          <Logo markOnly className="sm:hidden" />
        </Link>

        {/* Centred absolutely: flexing it would shift the nav every time the
            cart badge appears or the wordmark changes width. */}
        <nav
          ref={nav}
          className="absolute left-1/2 hidden -translate-x-1/2 lg:block"
          aria-label="Main"
        >
          <ul className="flex items-center gap-2">
            {navMenus.map((menu) => {
              const open = openMenu === menu.label
              return (
                <li
                  key={menu.label}
                  className="relative"
                  onMouseEnter={() => setOpenMenu(menu.label)}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-haspopup="true"
                    onClick={() => setOpenMenu(open ? null : menu.label)}
                    className={cx(
                      "micro-label flex items-center gap-1.5 px-4 py-3 transition-colors",
                      open ? "text-ink-950" : "hover:text-ink-950",
                    )}
                  >
                    {menu.label}
                    <Icon
                      name="chevronDown"
                      className={cx(
                        "size-3 transition-transform",
                        open && "-rotate-180",
                      )}
                    />
                  </button>

                  {open ? (
                    <ul className="absolute top-full left-1/2 z-50 w-90 -translate-x-1/2 overflow-hidden border border-line bg-white p-2 shadow-lg">
                      {menu.items.map((item) => (
                        <li key={item.to + item.label}>
                          <Link
                            to={item.to}
                            className="block px-3 py-2.5 hover:bg-ink-50"
                          >
                            <span className="block text-sm font-semibold">
                              {item.label}
                            </span>
                            <span className="mt-0.5 block text-xs text-ink-500">
                              {item.description}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="micro-label flex items-center gap-2 border border-line px-3 py-2.5 transition-colors hover:border-ink-400 hover:text-ink-950"
            aria-label="Search phones, parts and tools"
          >
            <Icon name="search" className="size-4" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden bg-ink-100 px-1.5 py-0.5 font-mono text-[10px] leading-none text-ink-600 sm:block">
              /
            </kbd>
          </button>

          <button
            type="button"
            onClick={openDrawer}
            className="btn btn-ghost btn-icon relative"
            aria-label={
              count > 0 ? `Open basket, ${count} items` : "Open basket, empty"
            }
          >
            <Icon name="cart" />
            {count > 0 ? (
              <span className="absolute -top-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-white">
                {count > 99 ? "99+" : count}
              </span>
            ) : null}
          </button>

          <Link
            to="/repairs#book"
            className={buttonClass("primary", "md", "ml-1 hidden md:inline-flex")}
          >
            Book a repair
          </Link>
        </div>
      </div>

      {/* Search sheet. Opening it on demand is what frees the centre of the bar
          for the nav; the "/" shortcut opens it too, so the keycap on the
          button is a real affordance rather than decoration. */}
      {searchOpen ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-ink-950/40"
            aria-label="Close search"
            onClick={() => setSearchOpen(false)}
          />
          <div className="absolute inset-x-0 top-0 border-b border-line bg-white">
            <div className="content-boundary flex items-center gap-3 py-4">
              <div className="min-w-0 flex-1">
                <SearchBox variant="hero" autoFocus />
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-icon"
                aria-label="Close search"
                onClick={() => setSearchOpen(false)}
              >
                <Icon name="close" />
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {menuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink-950/50"
            aria-label="Close navigation menu"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-80 max-w-[85vw] flex-col overflow-y-auto bg-white">
            <div className="flex h-16 items-center justify-between border-b border-line px-4">
              <span className="micro-label text-ink-950">Menu</span>
              <button
                type="button"
                className="btn btn-ghost btn-icon"
                aria-label="Close navigation menu"
                onClick={() => setMenuOpen(false)}
              >
                <Icon name="close" />
              </button>
            </div>
            <nav className="flex-1 px-2 py-4" aria-label="Mobile">
              {navMenus.map((menu) => (
                <div key={menu.label} className="mb-5">
                  <p className="micro-label px-3 pb-2">{menu.label}</p>
                  <ul>
                    {menu.items.map((item) => (
                      <li key={item.to + item.label}>
                        <NavLink
                          to={item.to}
                          className={({ isActive }) =>
                            cx(
                              "block px-3 py-2.5 text-sm font-medium",
                              isActive ? "bg-ink-100" : "hover:bg-ink-50",
                            )
                          }
                        >
                          {item.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <Link
                to="/about"
                className="block px-3 py-2.5 text-sm font-medium hover:bg-ink-50"
              >
                About us
              </Link>
            </nav>
            {/* The header CTA is md-and-up only, so it lives here on a phone. */}
            <div className="border-t border-line p-4">
              <Link
                to="/repairs#book"
                className={buttonClass("primary", "lg", "w-full")}
              >
                Book a repair
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
