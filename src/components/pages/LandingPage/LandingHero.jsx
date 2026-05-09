import { Badge, Button, Col, Container, Row } from 'react-bootstrap'

export default function LandingHero({ cdn, onPrimaryCta, onSecondaryCta }) {
  return (
    <section className="hero-section">
      <div className="hero-bg">
        <img src={`${cdn}/background/bg-home.png`} alt="" className="hero-bg-img" />
        <div className="hero-overlay" />
      </div>

      <Container className="position-relative" style={{ zIndex: 1, paddingTop: 110, paddingBottom: 90 }}>
        <Row className="align-items-center g-5">
          <Col lg={6} className="animate-fade-up">
            <Badge className="badge-pf-blue mb-3 px-3 py-2" style={{ fontSize: 13 }}>
              🚗 Smart Parking System
            </Badge>
            <h1 className="hero-title mb-3">
              Parkir Cerdas,<br />
              <span className="gradient-text">Tanpa Repot</span>
            </h1>
            <p className="hero-desc mb-4">
              ParkFinder membantu Anda menemukan dan memesan parkir di berbagai
              lokasi secara real-time. Amankan tempat sebelum tiba.
            </p>

            <div className="d-flex flex-wrap gap-3 mb-5">
              <Button className="btn-pf-primary btn btn-lg" onClick={onPrimaryCta}>
                Masuk & Scan Tiket
              </Button>
              <Button className="btn-pf-outline btn btn-lg" onClick={onSecondaryCta}>
                Cari Parkir
              </Button>
            </div>

            <div className="download-section">
              <p className="download-label">Download Aplikasi</p>
              <div className="d-flex flex-wrap gap-3">
                {['android', 'ios'].map(platform => (
                  <a key={platform} href="#" className="download-btn" onClick={e => e.preventDefault()}>
                    <span className="download-btn-icon">
                      <img
                        src={`${cdn}/foto/${platform}.png`}
                        alt={platform}
                        style={{ width: 24, height: 24, objectFit: 'contain' }}
                      />
                    </span>
                    <span className="download-btn-text">
                      <small>Download via</small>
                      <strong>{platform === 'android' ? 'Android' : 'iOS'}</strong>
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </Col>

          <Col lg={6} className="animate-fade-up delay-2">
            <div className="hero-car-container animate-float">
              <img src={`${cdn}/background/bg-home.png`} alt="Gedung Parkir" className="hero-building" />
              <img src={`${cdn}/foto/mclaren-depan.png`} alt="McLaren" className="hero-car animate-glow" />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}
