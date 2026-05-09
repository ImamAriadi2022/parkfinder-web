import { Button, Card, Col, Row } from 'react-bootstrap'

export default function BookingConfirmStep({ form, parking, onBack, onConfirm }) {
  return (
    <Row className="justify-content-center animate-fade-up">
      <Col lg={7}>
        <Card>
          <Card.Body className="p-4">
            <h5 className="mb-4" style={{ color: 'var(--pf-text)' }}>Konfirmasi Booking</h5>
            {[
              ['Nama',   form.name],
              ['Plat',   form.plate],
              ['No. HP', form.phone],
              ['Gedung', parking?.name],
              ['Slot',   `${parking?.floor} / ${parking?.slot}`],
            ].map(([key, value]) => (
              <div key={key} className="d-flex justify-content-between py-2 border-bottom border-pf gap-3">
                <span style={{ color: 'var(--pf-text2)', fontSize: 14 }}>{key}</span>
                <span style={{ color: 'var(--pf-text)', fontWeight: 600, fontSize: 14, textAlign: 'right', maxWidth: 300 }}>{value}</span>
              </div>
            ))}

            <div className="d-flex gap-3 justify-content-end mt-4">
              <Button className="btn-pf-ghost btn" onClick={onBack}>← Kembali</Button>
              <Button className="btn-pf-primary btn" onClick={onConfirm}>Konfirmasi Booking</Button>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}
