import { Badge, Button, Card, Col, Row } from 'react-bootstrap'

export default function SwapSuccessStep({ booking, selectedParking, floor, newSlot, newTicketCode, onGoParking, onGoHome }) {
  return (
    <Row className="justify-content-center animate-fade-up">
      <Col lg={6}>
        <Card className="text-center shadow-glow">
          <Card.Body className="p-5">
            <div style={{ fontSize: 64, marginBottom: 16 }}>🔄</div>
            <h3 style={{ color: 'var(--pf-text)' }}>Tukar Slot Berhasil!</h3>
            <p className="mb-4">Slot parkir Anda telah berhasil ditukar. Tiket baru telah diterbitkan.</p>

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
              <div className="ticket-code">{newTicketCode}</div>
              <div className="pf-divider" />

              <div className="swap-result-compare mb-3">
                <div className="src-side">
                  <small style={{ color: 'var(--pf-text3)', fontSize: 10 }}>DARI</small>
                  <div style={{ color: 'var(--pf-text2)', fontWeight: 600, fontSize: 13 }}>
                    {booking.parking?.floor} / {booking.parking?.slot}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--pf-text3)' }}>{booking.parking?.name}</div>
                </div>
                <div style={{ fontSize: 18, color: 'var(--pf-accent)', fontWeight: 700 }}>→</div>
                <div className="src-side">
                  <small style={{ color: 'var(--pf-text3)', fontSize: 10 }}>KE</small>
                  <div style={{ color: 'var(--pf-accent)', fontWeight: 700, fontSize: 13 }}>
                    {floor} / {newSlot}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--pf-text3)' }}>{selectedParking?.name}</div>
                </div>
              </div>

              {[
                ['Nama', booking.name],
                ['Plat', booking.plate],
              ].map(([key, value]) => (
                <div key={key} className="d-flex justify-content-between mb-2">
                  <small style={{ color: 'var(--pf-text2)' }}>{key}</small>
                  <small style={{ color: 'var(--pf-text)', fontWeight: 600 }}>{value}</small>
                </div>
              ))}
              <div className="qr-box mt-3">
                <span style={{ fontSize: 40 }}>📱</span>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--pf-text3)' }}>Scan QR baru saat tiba di slot tujuan</p>
              </div>
            </div>

            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <Button className="btn-pf-outline btn" onClick={onGoParking}>Cari Parkir Lain</Button>
              <Button className="btn-pf-primary btn" onClick={onGoHome}>Ke Beranda</Button>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}
