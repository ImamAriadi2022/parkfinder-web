import { Button, Col, Container, Row } from 'react-bootstrap'

export default function LandingFooter({ cdn, onNavigate }) {
  return (
    <footer style={{ background: 'var(--pf-bg2)', borderTop: '1px solid var(--pf-border)', padding: '48px 0 24px' }}>
      <Container>
        <Row className="mb-4 g-4">
          <Col md={5}>
            <div className="mb-2">
              <img
                src={`${cdn}/foto/logo.png`}
                alt="ParkFinder"
                style={{ height: 36, width: 'auto', objectFit: 'contain' }}
                onError={e => { e.target.style.display = 'none' }}
              />
            </div>
            <p style={{ fontSize: 14 }}>Solusi parkir cerdas untuk kota modern.</p>
          </Col>
          <Col md={3}>
            <h6 style={{ color: 'var(--pf-text)' }}>Layanan</h6>
            {[['Scan Tiket', '/scan'], ['Cari Parkir', '/parking'], ['Booking', '/booking']].map(([label, path]) => (
              <div key={label}>
                <Button
                  variant="link"
                  className="text-muted-pf p-0 text-decoration-none d-block"
                  style={{ fontSize: 14 }}
                  onClick={() => onNavigate(path)}
                >
                  {label}
                </Button>
              </div>
            ))}
          </Col>
          <Col md={4}>
            <h6 style={{ color: 'var(--pf-text)' }}>Kontak</h6>
            <p style={{ fontSize: 14, marginBottom: 4 }}>info@parkfinder.id</p>
            <p style={{ fontSize: 14 }}>+62 811 1234 5678</p>
          </Col>
        </Row>
        <hr style={{ borderColor: 'var(--pf-border)' }} />
        <p className="text-center" style={{ fontSize: 13, color: 'var(--pf-text3)', margin: 0 }}>© 2026 ParkFinder. All rights reserved.</p>
      </Container>
    </footer>
  )
}
