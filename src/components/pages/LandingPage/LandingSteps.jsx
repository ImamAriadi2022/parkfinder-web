import { Col, Container, Row } from 'react-bootstrap'

export default function LandingSteps({ steps }) {
  return (
    <section className="py-5">
      <Container>
        <div className="mb-5 text-center">
          <h2 className="fw-bold">3 Langkah Mudah</h2>
          <p>Amankan tempat parkir Anda sebelum tiba</p>
        </div>
        <Row className="g-4 justify-content-center">
          {steps.map(step => (
            <Col key={step.num} md={4}>
              <div className="text-center">
                <div className="step-number-big">{step.num}</div>
                <div className="step-img-wrap mb-3">
                  <img src={step.img} alt={step.title} className="step-img" onError={e => { e.target.style.display = 'none' }} />
                </div>
                <h5 style={{ color: 'var(--pf-text)' }}>{step.title}</h5>
                <p style={{ fontSize: 14 }}>{step.desc}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  )
}
