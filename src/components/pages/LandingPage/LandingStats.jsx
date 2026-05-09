import { Col, Container, Row } from 'react-bootstrap'

export default function LandingStats({ stats }) {
  return (
    <section className="py-4" style={{ background: 'var(--pf-bg2)', borderTop: '1px solid var(--pf-border)', borderBottom: '1px solid var(--pf-border)' }}>
      <Container>
        <Row className="g-0">
          {stats.map((stat, index) => (
            <Col key={stat.label} sm={6} lg={3} className={`text-center py-4 ${index < stats.length - 1 ? 'border-end border-pf' : ''}`}>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  )
}
