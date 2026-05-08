import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Navbar, Nav, Container, Button, Badge } from 'react-bootstrap'
import { getActiveBookings } from '../utils/bookingStore'

const CDN = 'https://storage.googleapis.com/parkfinderbucket'

export default function AppNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [activeCount, setActiveCount] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const update = () => setActiveCount(getActiveBookings().length)
    update()
    // Refresh saat tab aktif kembali
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
          <img
            src={`${CDN}/foto/logo.png`}
            alt="ParkFinder"
            style={{ height: 38, width: 'auto', objectFit: 'contain' }}
            onError={e => { e.target.style.display='none' }}
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="pf-nav" />

        <Navbar.Collapse id="pf-nav">
          <Nav className="mx-auto gap-1">
            {[
              { to: '/',           label: 'Beranda' },
              { to: '/parking',    label: 'Cari Parkir' },
              { to: '/booking',    label: 'Booking' },
              { to: '/my-booking', label: 'Parkiran Aktif', badge: activeCount },
            ].map(({ to, label, badge }) => (
              <Nav.Link
                key={to}
                as={NavLink}
                to={to}
                end={to === '/'}
                onClick={() => setExpanded(false)}
                className="d-flex align-items-center gap-1"
              >
                {label}
                {badge > 0 && (
                  <Badge
                    pill
                    style={{ fontSize:10, background:'var(--pf-accent)', color:'#000', fontWeight:700 }}
                  >
                    {badge}
                  </Badge>
                )}
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
