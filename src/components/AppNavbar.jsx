import { useEffect, useState } from 'react'
import { Badge, Button, Container, Nav, Navbar } from 'react-bootstrap'
import { NavLink, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { getActiveBookings } from '../utils/bookingStore'

const CDN = 'https://storage.googleapis.com/parkfinderbucket'

function ThemeToggleButton() {
  const { theme, resolvedTheme, toggleTheme } = useTheme()

  const icon = theme === 'system' ? '💻' : resolvedTheme === 'dark' ? '🌙' : '☀️'
  const label = theme === 'system' ? 'System' : resolvedTheme === 'dark' ? 'Dark' : 'Light'

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      title={`Theme: ${label} (click to cycle)`}
      aria-label={`Switch theme, current: ${label}`}
    >
      <span className="theme-toggle-icon">{icon}</span>
    </button>
  )
}

export default function AppNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [activeCount, setActiveCount] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const update = () => setActiveCount(getActiveBookings().length)
    update()
    window.addEventListener('focus', update)
    return () => window.removeEventListener('focus', update)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNav = (path) => {
    navigate(path)
    setExpanded(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const NAV_LINKS = [
    { to: '/',           label: 'Kembali ke Beranda', end: false },
    { to: '/scan',       label: 'Scan Tiket',     end: false },
    { to: '/parking',    label: 'Cari Parkir',    end: false },
    { to: '/my-booking', label: 'Parkiran Aktif', end: false, badge: activeCount },
  ]

  return (
    <Navbar
      expand="lg"
      fixed="top"
      expanded={expanded}
      onToggle={setExpanded}
      className={`navbar-pf px-0 ${scrolled ? 'scrolled' : ''}`}
    >
      <Container>
        {/* Brand */}
        <Navbar.Brand
          onClick={() => handleNav('/parking')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
        >
          <img
            src={`${CDN}/foto/logo.png`}
            alt="ParkFinder"
            style={{ height: 38, width: 'auto', objectFit: 'contain' }}
            onError={e => { e.target.style.display = 'none' }}
          />
        </Navbar.Brand>

        {/* Mobile: theme toggle + hamburger */}
        <div className="d-flex align-items-center gap-2 d-lg-none">
          <ThemeToggleButton />
          <Navbar.Toggle aria-controls="pf-nav" />
        </div>

        <Navbar.Collapse id="pf-nav">
          <Nav className="mx-auto gap-1">
            {NAV_LINKS.map(({ to, label, end, badge }) => (
              <Nav.Link
                key={to}
                as={NavLink}
                to={to}
                end={end}
                onClick={() => setExpanded(false)}
                className="d-flex align-items-center gap-1"
              >
                {label}
                {badge > 0 && (
                  <Badge
                    pill
                    style={{
                      fontSize: 10,
                      background: 'var(--pf-accent)',
                      color: 'var(--pf-text-inv)',
                      fontWeight: 700,
                    }}
                  >
                    {badge}
                  </Badge>
                )}
              </Nav.Link>
            ))}
          </Nav>

          {/* Desktop: theme toggle + CTA */}
          <div className="d-flex align-items-center gap-3">
            <span className="d-none d-lg-flex">
              <ThemeToggleButton />
            </span>
            <Button
              className="btn-pf-primary btn"
              onClick={() => handleNav('/parking')}
            >
              Cari Parkir
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
