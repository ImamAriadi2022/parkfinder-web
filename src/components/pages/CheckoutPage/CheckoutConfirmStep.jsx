import { Alert, Badge, Button, Card, Col, Row } from 'react-bootstrap'

export default function CheckoutConfirmStep({ booking, onBack, onConfirm, processing }) {
  return (
    <Row className="justify-content-center animate-fade-up">
      <Col lg={7}>
        <Card className="mb-4 checkout-ticket-card">
          <Card.Body className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <img
                src="https://storage.googleapis.com/parkfinderbucket/foto/logo.png"
                alt="ParkFinder"
                style={{ height: 28, width: 'auto', objectFit: 'contain' }}
                onError={e => { e.target.style.display = 'none' }}
              />
              <Badge className="badge-pf-green px-2 py-1">Tiket Aktif</Badge>
            </div>

            <div className="checkout-code">{booking.ticketCode}</div>

            <div className="pf-divider" />

            <Row className="g-2">
              {[
                ['Pemesan', booking.name],
                ['Nomor Plat', booking.plate],
                ['Gedung', booking.parking?.name],
                ['Lantai / Slot', `${booking.parking?.floor} / ${booking.parking?.slot}`],
              ].map(([key, value]) => (
                <Col xs={6} key={key}>
                  <div className="checkout-info-cell">
                    <div className="checkout-info-key">{key}</div>
                    <div className="checkout-info-val">{value || '—'}</div>
                  </div>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>

        <Alert className="checkout-warning mb-4">
          <div className="d-flex gap-3 align-items-start">
            <span style={{ fontSize: 28, flexShrink: 0 }}>⚠️</span>
            <div>
              <strong style={{ color: 'var(--pf-orange)', display: 'block', marginBottom: 6 }}>
                Perhatian!
              </strong>
              <p style={{ margin: 0, fontSize: 14, color: 'var(--pf-text2)', lineHeight: 1.6 }}>
                Tindakan ini akan <strong style={{ color: 'var(--pf-red)' }}>menonaktifkan tiket secara permanen</strong>.
                Slot parkir Anda akan dilepas dan tidak dapat diaktifkan kembali.
                Pastikan kendaraan Anda sudah keluar dari area parkir sebelum melanjutkan.
              </p>
            </div>
          </div>
        </Alert>

        <Card className="mb-4">
          <Card.Body className="p-4">
            <h6 className="mb-3" style={{ color: 'var(--pf-text)' }}>Pastikan sebelum keluar:</h6>
            {[
              'Kendaraan sudah keluar dari area parkir',
              'Tidak ada barang bawaan yang tertinggal di slot',
              'Gate keluar sudah terbuka',
            ].map(item => (
              <div key={item} className="d-flex align-items-center gap-3 mb-3">
                <div className="checkout-check-icon">✓</div>
                <span style={{ fontSize: 14, color: 'var(--pf-text2)' }}>{item}</span>
              </div>
            ))}
          </Card.Body>
        </Card>

        <div className="d-flex gap-3 justify-content-between">
          <Button className="btn-pf-ghost btn" onClick={onBack} disabled={processing}>
            ← Batal
          </Button>
          <Button className="btn btn-danger-pf btn-lg" onClick={onConfirm} disabled={processing} style={{ flex: 1, maxWidth: 320 }}>
            {processing ? (
              <span className="d-flex align-items-center justify-content-center gap-2">
                <span className="mini-spinner" /> Memproses Keluar...
              </span>
            ) : '🚗 Konfirmasi Keluar Parkir'}
          </Button>
        </div>
      </Col>
    </Row>
  )
}
