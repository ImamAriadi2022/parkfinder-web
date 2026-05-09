import { Alert, Button, Card, Col, Row } from 'react-bootstrap'

export default function SwapConfirmStep({ booking, selectedParking, floor, newSlot, swapping, onBack, onConfirm }) {
  return (
    <Row className="justify-content-center animate-fade-up">
      <Col lg={7}>
        <Card>
          <Card.Body className="p-4">
            <h5 className="mb-4" style={{ color: 'var(--pf-text)' }}>Konfirmasi Tukar Slot</h5>

            <div className="swap-compare-box mb-4">
              <div className="swap-compare-side">
                <div className="swap-compare-label">Slot Lama</div>
                <div className="swap-compare-slot old">
                  <div className="sc-building">{booking.parking?.name}</div>
                  <div className="sc-slot">{booking.parking?.floor} / {booking.parking?.slot}</div>
                </div>
              </div>
              <div className="swap-compare-arrow">🔄</div>
              <div className="swap-compare-side">
                <div className="swap-compare-label">Slot Baru</div>
                <div className="swap-compare-slot new">
                  <div className="sc-building">{selectedParking?.name}</div>
                  <div className="sc-slot">{floor} / {newSlot}</div>
                </div>
              </div>
            </div>

            {[
              ['Pemesan', booking.name],
              ['Plat', booking.plate],
              ['No. HP', booking.phone],
              ['Kode Tiket Lama', booking.ticketCode],
            ].map(([key, value]) => (
              <div key={key} className="d-flex justify-content-between py-2 border-bottom border-pf gap-3">
                <span style={{ color: 'var(--pf-text2)', fontSize: 14 }}>{key}</span>
                <span style={{ color: 'var(--pf-text)', fontWeight: 600, fontSize: 14, textAlign: 'right', maxWidth: 260 }}>{value}</span>
              </div>
            ))}

            <Alert className="mt-3" style={{ background: 'rgba(255,167,38,0.08)', border: '1px solid rgba(255,167,38,0.3)', borderRadius: 10, padding: '12px 16px' }}>
              <small style={{ color: 'var(--pf-orange)' }}>
                ⚠️ Setelah konfirmasi, slot lama akan dilepas dan tiket baru diterbitkan secara otomatis.
              </small>
            </Alert>

            <div className="d-flex gap-3 justify-content-end mt-4">
              <Button className="btn-pf-ghost btn" onClick={onBack}>← Kembali</Button>
              <Button className="btn-pf-primary btn" onClick={onConfirm} disabled={swapping}>
                {swapping ? (
                  <span className="d-flex align-items-center gap-2">
                    <span className="mini-spinner" /> Memproses...
                  </span>
                ) : '✅ Konfirmasi Tukar Slot'}
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}
