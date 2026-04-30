import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Navbar, Nav, Container, Button } from 'react-bootstrap'

export default function AppNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const navigate = useNavigate()

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
          onClick={() => handleNav('/')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
        >
          <span style={{
            width: 38, height: 38, background: 'linear-gradient(135deg,#00D2FF,#0066AA)',
            borderRadius: 10, display: 'inline-flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 20
          }}>🅿</span>
          <span style={{ fontSize: 20, fontWeight: 800, color: '#fff', fontFamily: 'Inter,sans-serif' }}>
            ParkFinder
          </span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="pf-nav" />

        <Navbar.Collapse id="pf-nav">
          <Nav className="mx-auto gap-1">
            {[
              { to: '/',        label: 'Beranda' },
              { to: '/parking', label: 'Cari Parkir' },
              { to: '/booking', label: 'Booking' },
            ].map(({ to, label }) => (
              <Nav.Link
                key={to}
                as={NavLink}
                to={to}
                end={to === '/'}
                onClick={() => setExpanded(false)}
              >
                {label}
              </Nav.Link>
            ))}
          </Nav>

          <Button
            className="btn-pf-primary btn"
            onClick={() => handleNav('/parking')}
          >
            Cari Parkir Sekarang
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
