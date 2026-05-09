import { Badge, Button, Card, Col, Row } from 'react-bootstrap'

export default function MyBookingCard({ booking, index, formatDate, onSwap, onCheckout, cdn }) {
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
              <Badge className={booking.expired ? 'badge-expired' : 'badge-pf-green'}>
                {booking.expired ? 'Tidak Aktif' : 'Aktif'}
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
            {booking.expired && booking.expiredAt && (
              <small style={{ color: 'var(--pf-red)', fontSize: 11, marginTop: 6, display: 'block' }}>
                ⏹ Keluar: {formatDate(booking.expiredAt)}
              </small>
            )}
          </Col>

          {!booking.expired && (
            <Col xs={12} md={3} className="d-flex flex-column gap-2">
              <Button size="sm" className="btn-pf-outline btn w-100" onClick={() => onSwap(booking)}>
                🔄 Tukar Slot
              </Button>
              <Button size="sm" className="btn btn-danger-pf w-100" onClick={() => onCheckout(booking)}>
                🚗 Keluar Parkir
              </Button>
            </Col>
          )}
        </Row>
      </Card.Body>
    </Card>
  )
}
