import { Badge, Button, Card, Col, Row } from 'react-bootstrap'

export default function MyBookingCard({ booking, index, formatDate, onSwap, onCheckout, onCompletePark, onCancel, onArrive, cdn }) {
  const statusBadge = booking.expired
    ? { label: 'Tidak Aktif', className: 'badge-expired' }
    : booking.completed
      ? { label: 'Menunggu Keluar', className: 'badge-pf-orange' }
      : booking.arrived
        ? { label: 'Di Slot', className: 'badge-pf-blue' }
        : { label: 'Aktif', className: 'badge-pf-green' }
  return (
    <Card
      className={`booking-card animate-fade-up ${booking.expired ? 'booking-card-expired' : 'booking-card-active'}`}
      style={{ animationDelay: `${index * 0.07}s` }}
    >
      <Card.Body className="p-4">
        <Row className="align-items-start g-3">
          <Col xs={12} md={4}>
            <div className="d-flex align-items-center gap-2 mb-2">
              <img
                src={`${cdn}/foto/logo.png`}
                alt="ParkFinder"
                style={{ height: 22, width: 'auto', objectFit: 'contain', ...(booking.expired ? { filter: 'grayscale(1)', opacity: 0.5 } : {}) }}
                onError={e => { e.target.style.display = 'none' }}
              />
              <Badge className={statusBadge.className}>
                {statusBadge.label}
              </Badge>
            </div>
            <div className={`booking-code ${booking.expired ? 'booking-code-expired' : ''}`}>
              {booking.ticketCode}
            </div>
            <small style={{ color: 'var(--pf-text3)', fontSize: 11 }}>
              Dibooking: {formatDate(booking.savedAt)}
            </small>
          </Col>

          <Col xs={12} md={5}>
            <div className="booking-detail-grid">
              {[
                ['Pemesan', booking.name],
                ['Plat', booking.plate],
                ['Gedung', booking.parking?.name],
                ['Slot', `${booking.parking?.floor} / ${booking.parking?.slot}`],
              ].map(([key, value]) => (
                <div key={key} className="bd-item">
                  <span className="bd-key">{key}</span>
                  <span className="bd-val">{value || '—'}</span>
                </div>
              ))}
            </div>
            {booking.completedAt && !booking.expired && (
              <small style={{ color: 'var(--pf-orange)', fontSize: 11, marginTop: 6, display: 'block' }}>
                ✓ Parkir selesai: {formatDate(booking.completedAt)} — tiket masih aktif
              </small>
            )}
            {booking.expired && booking.expiredAt && (
              <small style={{ color: 'var(--pf-red)', fontSize: 11, marginTop: 6, display: 'block' }}>
                ⏹ Keluar area: {formatDate(booking.expiredAt)}
              </small>
            )}
          </Col>

          {!booking.expired && (
            <Col xs={12} md={3} className="d-flex flex-column gap-2">
              {!booking.arrived ? (
                <Button size="sm" className="btn btn-success w-100" onClick={() => onArrive?.(booking)} style={{ backgroundColor: '#28a745', borderColor: '#28a745' }}>
                  ✓ Sudah Sampai
                </Button>
              ) : (
                <Badge className="badge-pf-blue w-100" style={{ padding: '0.5rem', backgroundColor: '#007bff' }}>
                  ✓ Sudah Tiba di Slot
                </Badge>
              )}
              {!booking.arrived && !booking.completed && booking.reservationId && (
                <Button size="sm" className="btn-pf-outline btn w-100" onClick={() => onSwap(booking)}>
                  🔄 Tukar Slot
                </Button>
              )}
              {booking.arrived && !booking.completed && (
                <Button size="sm" className="btn btn-warning w-100 text-dark" onClick={() => onCompletePark?.(booking)}>
                  🅿️ Selesai Parkir
                </Button>
              )}
              {booking.completed && (
                <Badge className="badge-pf-orange w-100" style={{ padding: '0.5rem' }}>
                  Slot sudah dikosongkan
                </Badge>
              )}
              {!booking.arrived && !booking.completed && (
                <Button
                  size="sm"
                  variant="outline-danger"
                  className="btn w-100"
                  onClick={() => onCancel?.(booking)}
                >
                  ✕ Batalkan Reservasi
                </Button>
              )}
              <Button
                size="sm"
                className="btn btn-danger-pf w-100"
                onClick={() => onCheckout(booking)}
                disabled={!booking.completed}
                title={!booking.completed ? 'Selesaikan parkir terlebih dahulu' : undefined}
              >
                🚗 Keluar Parkir
              </Button>
            </Col>
          )}
        </Row>
      </Card.Body>
    </Card>
  )
}
