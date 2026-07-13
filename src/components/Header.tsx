import { useState } from "react"

type HeaderProps = {
  search: string
  onSearchChange: (value: string) => void
}

export default function Header({ search, onSearchChange }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="site-header">
      <a className="logo" href="#top">
        AA Mobile
      </a>

      <div className="search-box">
        <svg className="search-icon" viewBox="0 0 20 20" aria-hidden="true">
          <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <line x1="13.8" y1="13.8" x2="18" y2="18" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <input
          type="text"
          placeholder="Search phones"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search phones"
        />
        <kbd>S</kbd>
      </div>

      <nav className="header-nav">
        <a href="#about">About</a>
        <a className="pill-button" href="#trade-in">
          <span className="plus">+</span> Get a quote
        </a>
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
          <a href="#about" onClick={() => setMenuOpen(false)}>
            About
          </a>
          <a className="pill-button" href="#trade-in" onClick={() => setMenuOpen(false)}>
            <span className="plus">+</span> Get a quote
          </a>
        </div>
      )}
    </header>
  )
}
