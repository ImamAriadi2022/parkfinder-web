import { Badge, Button, Card, Col, ProgressBar, Row } from 'react-bootstrap'

export default function SwapSelectStep({
  booking,
  parkings,
  floors,
  selectedParking,
  floor,
  newSlot,
  onSelectParking,
  onFloorChange,
  onSelectSlot,
  onNext,
}) {
  // Jangan pakai floors[1] — jika hanya ada satu lantai atau floors kosong, itu undefined dan bikin crash (layar hitam).
  const currentFloor = floors.find(item => item.id === floor) || {
    id: floor || '—',
    slots: [],
    available: [],
    rawSlots: [],
  }
  const progressVariant = (occupancy) => occupancy >= 90 ? 'danger' : occupancy >= 75 ? 'warning' : 'info'

  return (
    <Row className="g-4 animate-fade-up">
      <Col lg={5}>
        <Card className="h-100">
          <Card.Header className="d-flex justify-content-between align-items-center bg-pf-card2 border-pf">
            <span style={{ fontWeight: 700, color: 'var(--pf-text)' }}>Pilih Gedung Tujuan</span>
            <Badge className="badge-pf-blue">{parkings.length} lokasi</Badge>
          </Card.Header>
          <div style={{ overflowY: 'auto', maxHeight: 520 }}>
            {parkings.map(parking => {
              const isCurrent = booking.parking?.name === parking.name
              return (
                <div
                  key={parking.id}
                  className={`swap-list-item ${selectedParking?.id === parking.id ? 'item-selected' : ''}`}
                  onClick={() => onSelectParking(parking)}
                >
                  <div className="d-flex justify-content-between align-items-start mb-1">
                    <div>
                      <div className="item-name">{parking.name}</div>
                      <small style={{ color: 'var(--pf-text3)' }}>{parking.address}</small>
                    </div>
                    <div className="d-flex flex-column align-items-end gap-1 ms-2">
                      <Badge className={`badge-pf-${parking.tagClass}`}>{parking.tag}</Badge>
                      {isCurrent && <Badge className="badge-pf-blue" style={{ fontSize: 10 }}>Gedung Saat Ini</Badge>}
                    </div>
                  </div>
                  <ProgressBar now={parking.occupancy} variant={progressVariant(parking.occupancy)} style={{ height: 5, margin: '8px 0' }} />
                  <div className="d-flex justify-content-between">
                    <small style={{ color: 'var(--pf-text2)' }}>{parking.slots}</small>
                    <small style={{ color: 'var(--pf-text2)' }}>{parking.distance}</small>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </Col>

      <Col lg={7}>
        <Card className="h-100">
          {!selectedParking ? (
            <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center" style={{ minHeight: 420 }}>
              <div style={{ fontSize: 52, marginBottom: 12, opacity: 0.35 }}>🔄</div>
              <h5 style={{ color: 'var(--pf-text)' }}>Pilih Gedung Tujuan</h5>
              <p style={{ maxWidth: 260, fontSize: 14 }}>
                Klik gedung di sebelah kiri untuk melihat slot yang bisa dituju
              </p>
            </Card.Body>
          ) : (
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h6 style={{ color: 'var(--pf-text)', marginBottom: 4 }}>{selectedParking.name}</h6>
                  <small style={{ color: 'var(--pf-text3)' }}>{selectedParking.address}</small>
                </div>
                <Badge className={`badge-pf-${selectedParking.tagClass}`}>{selectedParking.tag}</Badge>
              </div>

              <div className="d-flex gap-2 mb-3 flex-wrap">
                {floors.map(item => (
                  <Button
                    key={item.id}
                    size="sm"
                    className={item.id === floor ? 'btn-pf-primary btn' : 'btn-pf-ghost btn'}
                    onClick={() => onFloorChange(item.id)}
                  >
                    {item.id}
                  </Button>
                ))}
              </div>

              <div className="d-flex gap-4 mb-3">
                {[['#4CAF50', 'Tersedia'], ['#EF5350', 'Terisi'], ['#00D2FF', 'Dipilih']].map(([color, label]) => (
                  <span key={label} className="d-flex align-items-center gap-1" style={{ fontSize: 13, color: 'var(--pf-text2)' }}>
                    <span style={{ width: 12, height: 12, background: color, borderRadius: 3, display: 'inline-block' }} />
                    {label}
                  </span>
                ))}
              </div>

              <Row className="g-2 mb-4">
                {currentFloor.slots.map((slot, index) => (
                  <Col xs={4} sm={3} key={slot}>
                    <button
                      className={`slot-btn w-100 ${!currentFloor.available[index] ? 'slot-taken' : ''} ${newSlot === slot ? 'slot-picked' : ''}`}
                      onClick={() => currentFloor.available[index] && onSelectSlot(slot)}
                      disabled={!currentFloor.available[index]}
                    >
                      {slot}
                    </button>
                  </Col>
                ))}
              </Row>

              {newSlot && (
                <div className="slot-action-box">
                  <div className="swap-preview">
                    <div className="swap-preview-item">
                      <span style={{ fontSize: 11, color: 'var(--pf-text3)', display: 'block', marginBottom: 4 }}>DARI</span>
                      <span style={{ fontWeight: 700, color: 'var(--pf-text)', fontSize: 14 }}>
                        {booking.parking?.floor} / {booking.parking?.slot}
                      </span>

                      <small style={{ display: 'block', color: 'var(--pf-text3)', fontSize: 11 }}>{booking.parking?.name}</small>
                    </div>
                    <div className="swap-arrow">→</div>
                    <div className="swap-preview-item">
                      <span style={{ fontSize: 11, color: 'var(--pf-text3)', display: 'block', marginBottom: 4 }}>KE</span>
                      <span style={{ fontWeight: 700, color: 'var(--pf-accent)', fontSize: 14 }}>
                        {floor} / {newSlot}
                      </span>
                      <small style={{ display: 'block', color: 'var(--pf-text3)', fontSize: 11 }}>{selectedParking.name}</small>
                    </div>
                  </div>
                  <Button className="btn-pf-primary btn w-100 mt-3" onClick={onNext}>
                    Lanjut Konfirmasi Tukar →
                  </Button>
                </div>
              )}
            </Card.Body>
          )}
        </Card>
      </Col>
    </Row>
  )
}
