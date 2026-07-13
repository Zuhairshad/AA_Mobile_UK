import { useState, type FormEvent } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useSearch } from "../lib/SearchContext"

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { search, setSearch } = useSearch()
  const navigate = useNavigate()
  const location = useLocation()

  function handleSearchSubmit(e: FormEvent) {
    e.preventDefault()
    if (location.pathname !== "/") {
      navigate("/")
    }
  }

  return (
    <header className="site-header">
      <Link className="logo" to="/">
        AA Mobile
      </Link>

      <form className="search-box" onSubmit={handleSearchSubmit} role="search">
        <svg className="search-icon" viewBox="0 0 20 20" aria-hidden="true">
          <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <line x1="13.8" y1="13.8" x2="18" y2="18" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <input
          type="text"
          placeholder="Search phones"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search phones"
        />
        <kbd>S</kbd>
      </form>

      <nav className="header-nav">
        <Link to="/about">About</Link>
        <Link className="pill-button" to="/sell">
          <span className="plus">+</span> Get a quote
        </Link>
      </nav>

      <button
        className={`header-menu-button${menuOpen ? " is-open" : ""}`}
        aria-label="Menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        +
      </button>

      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/about" onClick={() => setMenuOpen(false)}>
            About
          </Link>
          <Link to="/signup" onClick={() => setMenuOpen(false)}>
            Sign up
          </Link>
          <Link className="pill-button" to="/sell" onClick={() => setMenuOpen(false)}>
            <span className="plus">+</span> Get a quote
          </Link>
        </div>
      )}
    </header>
  )
}
