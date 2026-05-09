import { Badge, Button, Card, Col, Row } from 'react-bootstrap'

export default function CheckoutSuccessStep({ booking, checkoutTime, onBookingAgain, onHome }) {
  const fmtTime = (date) => date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const fmtDate = (date) => date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })

  return (
    <Row className="justify-content-center animate-fade-up">
      <Col lg={6}>
        <Card className="text-center">
          <Card.Body className="p-5">
            <div className="destroyed-ticket-container mb-4">
              <div className="destroyed-ticket">
                <div className="destroyed-stripe" />
                <div className="d-flex justify-content-between align-items-center mb-3 opacity-50">
                  <img
                    src="https://storage.googleapis.com/parkfinderbucket/foto/logo.png"
                    alt="ParkFinder"
                    style={{ height: 24, width: 'auto', objectFit: 'contain', filter: 'grayscale(1)' }}
                    onError={e => { e.target.style.display = 'none' }}
                  />
                  <Badge style={{ background: 'rgba(239,83,80,0.15)', color: 'var(--pf-red)', border: '1px solid rgba(239,83,80,0.3)' }} className="px-2 py-1">
                    Tidak Aktif
                  </Badge>
                </div>
                <div className="destroyed-code">{booking.ticketCode}</div>
                <div className="destroyed-stamp">EXPIRED</div>
              </div>
            </div>

            <h3 className="mb-2" style={{ color: 'var(--pf-text)' }}>Berhasil Keluar Parkir</h3>
            <p className="mb-4" style={{ fontSize: 15 }}>
              Tiket Anda telah dinonaktifkan. Slot parkir sudah dilepas dan tersedia untuk pengguna lain.
            </p>

            <Card className="mb-4" style={{ textAlign: 'left' }}>
              <Card.Body className="py-3 px-4">
                {[
                  ['Nama', booking.name],
                  ['Kendaraan', booking.plate],
                  ['Lokasi', booking.parking?.name],
                  ['Slot', `${booking.parking?.floor} / ${booking.parking?.slot}`],
                  ['Waktu Keluar', fmtTime(checkoutTime)],
                  ['Tanggal', fmtDate(checkoutTime)],
                ].map(([key, value]) => (
                  <div key={key} className="d-flex justify-content-between py-2 border-bottom border-pf gap-3">
                    <small style={{ color: 'var(--pf-text2)' }}>{key}</small>
                    <small style={{ color: 'var(--pf-text)', fontWeight: 600, textAlign: 'right', maxWidth: 220 }}>{value}</small>
                  </div>
                ))}
              </Card.Body>
            </Card>

            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <Button className="btn-pf-primary btn" onClick={onBookingAgain}>
                Booking Parkir Lagi
              </Button>
              <Button className="btn-pf-ghost btn" onClick={onHome}>
                Ke Beranda
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}
