import { Card, Col, Container, Row } from 'react-bootstrap'

export default function LandingDownloadCta({ cdn }) {
  return (
    <section className="py-5" style={{ background: 'var(--pf-bg2)' }}>
      <Container>
        <Card className="shadow-glow">
          <Card.Body className="p-5">
            <Row className="align-items-center g-4">
              <Col lg={7}>
                <h2 className="fw-bold mb-3">Download Aplikasi ParkFinder</h2>
                <p className="mb-4" style={{ fontSize: 16 }}>
                  Nikmati pengalaman parkir yang lebih mudah dengan aplikasi mobile kami.
                  Scan tiket, navigasi ke slot, dan kelola parkir Anda di mana saja.
                </p>
                <div className="d-flex flex-wrap gap-3">
                  {['android', 'ios'].map(platform => (
                    <a key={platform} href="#" className="download-btn download-btn-lg" onClick={e => e.preventDefault()}>
                      <span className="download-btn-icon">
                        <img
                          src={`${cdn}/foto/${platform}.png`}
                          alt={platform}
                          style={{ width: 28, height: 28, objectFit: 'contain' }}
                        />
                      </span>
                      <span className="download-btn-text">
                        <small>Download via</small>
                        <strong>{platform === 'android' ? 'Android' : 'iOS'}</strong>
                      </span>
                    </a>
                  ))}
                </div>
              </Col>
              <Col lg={5} className="text-center">
                <img
                  src={`${cdn}/foto/mclaren-depan.png`}
                  alt="App Preview"
                  style={{ maxWidth: 280, filter: 'drop-shadow(0 8px 24px rgba(0,210,255,0.35))' }}
                  onError={e => { e.target.style.display = 'none' }}
                />
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </section>
  )
}
