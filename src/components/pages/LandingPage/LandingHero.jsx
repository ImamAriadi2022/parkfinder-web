import { Suspense, lazy } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'

const CarModel3D = lazy(() => import('../../3d/CarModel3D'))

function HeroCarFallback() {
  return (
    <div
      style={{
        width: '100%',
        minHeight: 550,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className="spinner-3d" />
    </div>
  )
}

export default function LandingHero({ onPrimaryCta }) {
  return (
    <section className="hero-section">
      <div className="hero-bg">
        <div className="hero-overlay" />
      </div>

      <Container
        className="position-relative"
        style={{ zIndex: 1, paddingTop: 120, paddingBottom: 100 }}
      >
        <Row className="align-items-center g-5">
          {/* Left – Content */}
          <Col lg={6}>
            <div className="animate-fade-up">
              <div className="hero-label mb-3">Smart Parking System</div>

              <h1 className="hero-title mb-3">
                Parkir Cerdas,<br />
                <span className="gradient-text">Tanpa Repot</span>
              </h1>

              <p className="hero-desc mb-4">
                ParkFinder adalah platform smart parking untuk membantu pengendara
                menemukan, memesan, dan mengelola parkir dengan lebih cepat.
                Jelajahi solusi kami lalu lanjut ke web app saat Anda siap.
              </p>

              {/* CTA Button */}
              <div className="d-flex flex-wrap gap-3">
                <Button
                  className="btn-pf-primary btn btn-lg"
                  onClick={onPrimaryCta}
                  id="hero-cta-primary"
                >
                  Coba Sekarang
                </Button>
              </div>
            </div>
          </Col>

          {/* Right – 3D Car */}
          <Col lg={6} className="animate-fade-up delay-2">
            <div className="hero-3d-container">
              <Suspense fallback={<HeroCarFallback />}>
                <CarModel3D
                  height={550}
                  scale={6.8}
                  autoRotate={true}
                  fov={14}
                  cameraPos={[0.9, 0.2, 0.9]}
                />
              </Suspense>

              {/* Floating badges – tanpa emoji */}
              <div className="hero-badge-float hero-badge-left animate-fade-up delay-4">
                <div className="hero-badge-dot hero-badge-dot--green" />
                <span>
                  <strong style={{ color: 'var(--pf-text)', display: 'block', fontSize: 13 }}>Slot Tersedia</strong>
                  <small style={{ color: 'var(--pf-text3)', fontSize: 11 }}>Real-time update</small>
                </span>
              </div>

              <div className="hero-badge-float hero-badge-right animate-fade-up delay-5">
                <div className="hero-badge-dot hero-badge-dot--accent" />
                <span>
                  <strong style={{ color: 'var(--pf-text)', display: 'block', fontSize: 13 }}>Booking Instan</strong>
                  <small style={{ color: 'var(--pf-text3)', fontSize: 11 }}>{'< 30 detik'}</small>
                </span>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}
