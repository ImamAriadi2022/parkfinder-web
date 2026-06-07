import { useState } from 'react'
import { Button, Container, Nav, Navbar } from 'react-bootstrap'
import { NavLink, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

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

export default function LandingNavbar() {
  const [expanded, setExpanded] = useState(false)
  const navigate = useNavigate()

  const handleNav = (path, state) => {
    navigate(path, state ? { state } : undefined)
    setExpanded(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <Navbar
      expand="lg"
      fixed="top"
      expanded={expanded}
      onToggle={setExpanded}
      className="navbar-pf px-0"
    >
      <Container>
        <Navbar.Brand
          onClick={() => handleNav('/')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
        >
          <img
            src={`${CDN}/foto/logo.png`}
            alt="ParkFinder"
            style={{ height: 38, width: 'auto', objectFit: 'contain' }}
            onError={e => { e.target.style.display = 'none' }}
          />
        </Navbar.Brand>

        <div className="d-flex align-items-center gap-2 d-lg-none">
          <ThemeToggleButton />
          <Navbar.Toggle aria-controls="landing-nav" />
        </div>

        <Navbar.Collapse id="landing-nav">
          <Nav className="mx-auto gap-1">
            <Nav.Link as={NavLink} to="/" end onClick={() => setExpanded(false)}>Beranda</Nav.Link>
            <Nav.Link as={NavLink} to="/tentang-project" onClick={() => setExpanded(false)}>Tentang Project</Nav.Link>
            <Nav.Link as={NavLink} to="/download-mobile" onClick={() => setExpanded(false)}>Download Mobile</Nav.Link>
          </Nav>

          <div className="d-flex align-items-center gap-3">
            <span className="d-none d-lg-flex">
              <ThemeToggleButton />
            </span>
            <Button className="btn-pf-primary btn" onClick={() => handleNav('/scan', { redirect: '/parking' })}>
              Coba Sekarang
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
