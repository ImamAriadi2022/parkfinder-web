import { Button, Card, Col, Container, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const DEVELOPERS = [
  {
    name: 'Imam Ariadi',
    role: 'Frontend Developer',
    focus: 'React UI, routing, dan UX flow',
  },
  {
    name: 'Backend Team',
    role: 'API & System Integration',
    focus: 'Reservasi, verifikasi tiket, dan layanan data parkir',
  },
  {
    name: 'Product Team',
    role: 'Product & Research',
    focus: 'Validasi kebutuhan pengguna dan roadmap fitur',
  },
]

export default function AboutProjectPage() {
  const navigate = useNavigate()

  return (
    <div style={{ paddingTop: 86, minHeight: '100vh' }}>
      <Container className="py-5">
        <Row className="justify-content-center mb-4">
          <Col lg={10}>
            <div className="section-label mb-3">Tentang Project</div>
            <h1 className="fw-bold mb-3">ParkFinder Smart Parking Platform</h1>
            <p style={{ maxWidth: 760 }}>
              ParkFinder dikembangkan untuk mengurangi waktu mencari parkir,
              menekan antrean di area gedung, dan memberikan pengalaman parkir
              yang lebih efisien lewat reservasi slot, tiket digital, dan alur
              keluar masuk yang lebih rapi.
            </p>
          </Col>
        </Row>

        <Row className="g-4 mb-5">
          <Col md={4}>
            <Card className="h-100">
              <Card.Body>
                <h5 className="mb-2">Misi</h5>
                <p className="mb-0">Membuat proses parkir lebih cepat, jelas, dan minim stres.</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100">
              <Card.Body>
                <h5 className="mb-2">Ruang Lingkup</h5>
                <p className="mb-0">Web app untuk pengguna tamu dan mobile app untuk akses praktis.</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100">
              <Card.Body>
                <h5 className="mb-2">Nilai Utama</h5>
                <p className="mb-0">Real-time visibility, alur sederhana, dan keamanan data tiket.</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className="mb-3 section-label">Developer</div>
        <Row className="g-4">
          {DEVELOPERS.map((dev) => (
            <Col key={dev.name} md={6} lg={4}>
              <Card className="h-100">
                <Card.Body>
                  <h5 className="mb-1">{dev.name}</h5>
                  <p className="mb-2" style={{ color: 'var(--pf-accent)', fontWeight: 600 }}>
                    {dev.role}
                  </p>
                  <p className="mb-0">{dev.focus}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <div className="mt-5 d-flex flex-wrap gap-3">
          <Button className="btn-pf-primary btn" onClick={() => navigate('/parking')}>
            Coba Sekarang
          </Button>
          <Button className="btn-pf-outline btn" onClick={() => navigate('/download-mobile')}>
            Lihat Download Mobile
          </Button>
        </div>
      </Container>
    </div>
  )
}
