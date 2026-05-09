import { Badge, Button, Card, Col, Form, Row } from 'react-bootstrap'

export default function BookingFormStep({ form, errors, onFieldChange, parking, onContinue, onPickParking }) {
  return (
    <Row className="g-4 animate-fade-up">
      <Col lg={7}>
        <Card>
          <Card.Body className="p-4">
            <h5 className="mb-4" style={{ color: 'var(--pf-text)' }}>Informasi Pemesan</h5>

            <Form.Group className="mb-3">
              <Form.Label>Nama Pemesan</Form.Label>
              <Form.Control
                placeholder="Masukkan nama lengkap"
                value={form.name}
                isInvalid={!!errors.name}
                onChange={e => onFieldChange('name', e.target.value)}
              />
              <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nomor Plat Kendaraan</Form.Label>
              <Form.Control
                placeholder="Contoh: BE 1234 AB"
                value={form.plate}
                isInvalid={!!errors.plate}
                onChange={e => onFieldChange('plate', e.target.value.toUpperCase())}
              />
              <Form.Control.Feedback type="invalid">{errors.plate}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-1">
              <Form.Label>Nomor HP</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Contoh: 0812-3456-7890"
                value={form.phone}
                isInvalid={!!errors.phone}
                onChange={e => onFieldChange('phone', e.target.value)}
              />
              <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
            </Form.Group>
          </Card.Body>
        </Card>
      </Col>

      <Col lg={5}>
        <Card className="mb-3">
          <Card.Body>
            <h6 className="mb-3" style={{ color: 'var(--pf-text)' }}>Ringkasan Booking</h6>
            {[
              ['Gedung', parking?.name || '—'],
              ['Alamat', parking?.address || '—'],
              ['Slot',   parking ? `${parking.floor} / ${parking.slot}` : '—'],
            ].map(([key, value]) => (
              <div key={key} className="d-flex justify-content-between mb-2 gap-3">
                <small style={{ color: 'var(--pf-text2)', flexShrink: 0 }}>{key}</small>
                <small style={{ color: 'var(--pf-text)', fontWeight: 600, textAlign: 'right' }}>{value}</small>
              </div>
            ))}
          </Card.Body>
        </Card>

        {!parking && (
          <Card className="mb-3" style={{ borderColor: 'var(--pf-orange)', background: 'rgba(255,167,38,0.06)' }}>
            <Card.Body style={{ padding: '12px 16px' }}>
              <small style={{ color: 'var(--pf-orange)' }}>
                ⚠️ Belum ada parkir dipilih.{' '}
                <Button
                  variant="link"
                  className="p-0 text-accent"
                  style={{ fontSize: 13 }}
                  onClick={onPickParking}
                >
                  Cari parkir
                </Button>
              </small>
            </Card.Body>
          </Card>
        )}

        <Button
          className="btn-pf-primary btn w-100 py-3"
          onClick={onContinue}
          disabled={!parking}
        >
          Lanjutkan ke Konfirmasi →
        </Button>
      </Col>
    </Row>
  )
}
