import { Badge, Button, Card, Col, Row } from 'react-bootstrap'

export default function BookingSuccessStep({ ticketCode, form, parking, onSwap, onCheckout, onMyBooking, onBookingAgain, onHome }) {
  return (
    <Row className="justify-content-center animate-fade-up">
      <Col lg={6}>
        <Card className="text-center shadow-glow">
          <Card.Body className="p-5">
            <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
            <h3 style={{ color: 'var(--pf-text)' }}>Booking Berhasil!</h3>
            <p className="mb-4">Tiket parkir Anda telah dikonfirmasi. Simpan kode berikut.</p>

            <div className="ticket-box mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <img
                  src="https://storage.googleapis.com/parkfinderbucket/foto/logo.png"
                  alt="ParkFinder"
                  style={{ height: 28, width: 'auto', objectFit: 'contain' }}
                  onError={e => { e.target.style.display = 'none' }}
                />
                <Badge className="badge-pf-green px-2 py-1">Aktif</Badge>
              </div>
              <div className="ticket-code">{ticketCode}</div>
              <div className="pf-divider" />
              {[
                ['Nama',   form.name],
                ['Plat',   form.plate],
                ['Gedung', parking?.name],
                ['Slot',   `${parking?.floor} – ${parking?.slot}`],
              ].map(([key, value]) => (
                <div key={key} className="d-flex justify-content-between mb-2">
                  <small style={{ color: 'var(--pf-text2)' }}>{key}</small>
                  <small style={{ color: 'var(--pf-text)', fontWeight: 600, textAlign: 'right', maxWidth: 200 }}>{value}</small>
                </div>
              ))}
              <div className="qr-box mt-3">
                <span style={{ fontSize: 48 }}>📱</span>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--pf-text3)' }}>Scan QR ini saat tiba di lokasi</p>
              </div>
            </div>

            <div className="d-flex flex-wrap gap-3 justify-content-center">
              <Button className="btn-pf-outline btn" onClick={onSwap}>
                🔄 Tukar Slot
              </Button>
              <Button className="btn btn-danger-pf" onClick={onCheckout}>
                🚗 Keluar Parkir
              </Button>
              <Button className="btn-pf-primary btn" onClick={onMyBooking}>
                📋 Lihat Parkiran Aktif
              </Button>
              <Button className="btn-pf-ghost btn" onClick={onBookingAgain}>Booking Lagi</Button>
              <Button className="btn-pf-ghost btn" onClick={onHome}>Ke Beranda</Button>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}
