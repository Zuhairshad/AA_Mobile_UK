import { useEffect, useRef, useState } from "react"
import { Link, NavLink, useLocation } from "react-router-dom"
import { navMenus } from "../../data/nav"
import { site } from "../../data/content"
import { useCart } from "../../lib/cart"
import { cx } from "../../lib/cx"
import Icon from "../ui/Icon"
import Logo from "./Logo"
import SearchBox from "./SearchBox"

export default function Header() {
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const { count, openDrawer } = useCart()
  const location = useLocation()
  const nav = useRef<HTMLElement>(null)

  // Any navigation closes whatever was open.
  useEffect(() => {
    setOpenMenu(null)
    setMenuOpen(false)
  }, [location.pathname, location.hash])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null)
        setMenuOpen(false)
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
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <p className="micro-label bg-ink-950 py-2.5 text-center text-white">
        {site.promo}
      </p>

      <div className="content-boundary flex h-16 items-center gap-3">
        <button
          type="button"
          className="btn btn-ghost btn-icon lg:hidden"
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

        <nav ref={nav} className="hidden lg:block" aria-label="Main">
          <ul className="flex items-center gap-1">
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
                      "btn btn-ghost btn-md font-mono",
                      open && "bg-ink-100",
                    )}
                  >
                    {menu.label}
                    <Icon
                      name="chevronDown"
                      className={cx(
                        "size-4 transition-transform",
                        open && "-rotate-180",
                      )}
                    />
                  </button>

                  {open ? (
                    <ul className="absolute top-full left-0 z-50 w-90 overflow-hidden border border-line bg-white p-2 shadow-lg">
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

        <div className="ml-auto hidden max-w-md flex-1 lg:block">
          <SearchBox />
        </div>

        <button
          type="button"
          onClick={openDrawer}
          className="btn btn-ghost btn-icon relative ml-auto lg:ml-0"
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
      </div>

      {/* Mobile: search sits on its own row so it gets full width. */}
      <div className="content-boundary pb-3 lg:hidden">
        <SearchBox placeholder="Search phones, parts and tools" />
      </div>

      {menuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
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
          </div>
        </div>
      ) : null}
    </header>
  )
}
