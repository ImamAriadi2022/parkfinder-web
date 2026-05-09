import { Button } from 'react-bootstrap'

export default function MyBookingHeader({ onNewBooking }) {
  return (
    <div className="d-flex align-items-start justify-content-between flex-wrap gap-3 mb-4">
      <div>
        <h1 className="fw-bold mb-1" style={{ color: 'var(--pf-text)', fontSize: 28 }}>Parkiran Aktif</h1>
        <p className="mb-0">Kelola semua booking parkir Anda</p>
      </div>
      <Button className="btn-pf-primary btn btn-sm" onClick={onNewBooking}>
        + Booking Baru
      </Button>
    </div>
  )
}
