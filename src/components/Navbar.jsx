import { useEffect, useState } from 'react'
import '../styles/components/navbar.css'

const CDN = 'https://storage.googleapis.com/parkfinderbucket'

export default function Navbar({ currentPage, navigate }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { id: 'landing', label: 'Beranda' },
    { id: 'parking', label: 'Cari Parkir' },
    { id: 'booking', label: 'Booking' },
  ]

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner container">
        {/* Logo */}
        <button className="nav-logo" onClick={() => navigate('landing')}>
          <span className="logo-icon">🅿</span>
          <span className="logo-text">ParkFinder</span>
        </button>

        {/* Desktop links */}
        <ul className="nav-links hide-mobile">
          {links.map(l => (
            <li key={l.id}>
              <button
                className={`nav-link ${currentPage === l.id ? 'active' : ''}`}
                onClick={() => navigate(l.id)}
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button
          className="btn btn-primary btn-sm hide-mobile"
          onClick={() => navigate('parking')}
        >
          Cari Parkir Sekarang
        </button>

        {/* Mobile hamburger */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span className={menuOpen ? 'open' : ''} />
          <span className={menuOpen ? 'open' : ''} />
          <span className={menuOpen ? 'open' : ''} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu">
          {links.map(l => (
            <button
              key={l.id}
              className={`mobile-link ${currentPage === l.id ? 'active' : ''}`}
              onClick={() => { navigate(l.id); setMenuOpen(false) }}
            >
              {l.label}
            </button>
          ))}
          <button
            className="btn btn-primary"
            style={{ margin: '8px 20px' }}
            onClick={() => { navigate('parking'); setMenuOpen(false) }}
          >
            Cari Parkir Sekarang
          </button>
        </div>
      )}
    </nav>
  )
}
