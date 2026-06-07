import { Button, Card, Col, Container, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import LandingDownloadCta from '../components/pages/LandingPage/LandingDownloadCta'

const CDN = 'https://storage.googleapis.com/parkfinderbucket'

export default function DownloadMobilePage() {
  const navigate = useNavigate()

  return (
    <div style={{ paddingTop: 86, minHeight: '100vh' }}>
      <Container className="py-5 pb-0">
        <Row className="justify-content-center">
          <Col lg={10}>
            <div className="section-label mb-3">Download Mobile</div>
            <h1 className="fw-bold mb-3">ParkFinder Mobile App</h1>
            <p style={{ maxWidth: 760 }}>
              Gunakan aplikasi mobile untuk pengalaman parkir yang lebih cepat di lapangan.
              Semua data tiket dan status reservasi tetap terhubung dengan layanan ParkFinder.
            </p>
          </Col>
        </Row>

        <Row className="g-4 mt-2">
          <Col md={4}>
            <Card className="h-100">
              <Card.Body>
                <h5 className="mb-2">Scan Cepat</h5>
                <p className="mb-0">Verifikasi tiket langsung dari kamera ponsel.</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100">
              <Card.Body>
                <h5 className="mb-2">Status Real-time</h5>
                <p className="mb-0">Pantau perubahan slot dan tiket aktif kapan saja.</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100">
              <Card.Body>
                <h5 className="mb-2">Akses Fleksibel</h5>
                <p className="mb-0">Cocok untuk pengguna yang sering parkir dari perangkat mobile.</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <LandingDownloadCta cdn={CDN} />

      <Container className="pb-5">
        <div className="d-flex flex-wrap gap-3 justify-content-center">
          <Button className="btn-pf-primary btn" onClick={() => navigate('/parking')}>
            Coba Web App Sekarang
          </Button>
          <Button className="btn-pf-outline btn" onClick={() => navigate('/tentang-project')}>
            Tentang Project
          </Button>
        </div>
      </Container>
    </div>
  )
}
