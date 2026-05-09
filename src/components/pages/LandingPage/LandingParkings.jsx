import { Badge, Button, Card, Col, Container, ProgressBar, Row } from 'react-bootstrap'

export default function LandingParkings({ parkings, onBooking, onSeeAll }) {
  return (
    <section className="py-5">
      <Container>
        <div className="mb-4">
          <h2 className="fw-bold">Gedung Parkir yang Tersedia</h2>
          <p>Temukan tempat parkir terbaik di kota Anda</p>
        </div>
        <div className="d-flex flex-column gap-3">
          {parkings.map((parking, index) => (
            <Card key={parking.name} className="animate-fade-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <Card.Body>
                <Row className="align-items-center">
                  <Col xs="auto">
                    <div className="parking-icon-box">🏢</div>
                  </Col>
                  <Col>
                    <h6 className="mb-1" style={{ color: 'var(--pf-text)' }}>{parking.name}</h6>
                    <div className="d-flex flex-wrap gap-2 align-items-center mb-2">
                      <small className="text-muted-pf">📍 {parking.distance}</small>
                      <Badge className={`badge-pf-${parking.tagClass}`}>{parking.tag}</Badge>
                    </div>
                    <ProgressBar now={parking.occupancy} variant={parking.variant} style={{ height: 6 }} />
                  </Col>
                  <Col xs="auto" className="text-center">
                    <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--pf-accent)' }}>{parking.occupancy}%</div>
                    <div style={{ fontSize: 11, color: 'var(--pf-text3)' }}>Terisi</div>
                  </Col>
                  <Col xs={12} className="mt-3 d-flex justify-content-between align-items-center">
                    <small className="text-muted-pf">{parking.slots}</small>
                    <Button
                      className="btn-pf-primary btn btn-sm"
                      onClick={() => onBooking(parking)}
                    >
                      Booking Sekarang
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </div>
        <div className="text-center mt-4">
          <Button className="btn-pf-outline btn" onClick={onSeeAll}>
            Lihat Semua Parkir →
          </Button>
        </div>
      </Container>
    </section>
  )
}
