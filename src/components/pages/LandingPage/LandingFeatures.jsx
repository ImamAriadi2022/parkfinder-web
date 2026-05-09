import { Card, Col, Container, Row } from 'react-bootstrap'

export default function LandingFeatures({ features }) {
  return (
    <section className="py-5" style={{ background: 'var(--pf-bg2)' }}>
      <Container>
        <div className="mb-5 text-center">
          <h2 className="fw-bold">Fitur Unggulan</h2>
          <p>Semua yang Anda butuhkan untuk pengalaman parkir terbaik</p>
        </div>
        <Row className="g-4">
          {features.map((feature, index) => (
            <Col key={feature.title} md={6} lg={4}>
              <Card className="h-100 text-center animate-fade-up" style={{ animationDelay: `${index * 0.08}s` }}>
                <Card.Body className="p-4">
                  <div style={{ fontSize: 36, marginBottom: 14 }}>{feature.icon}</div>
                  <Card.Title style={{ fontSize: 17 }}>{feature.title}</Card.Title>
                  <Card.Text style={{ fontSize: 14 }}>{feature.desc}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  )
}
