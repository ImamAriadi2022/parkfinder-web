import { Button } from 'react-bootstrap'

export default function ScanDemoActions({ onBooking, onDemo }) {
  return (
    <div className="text-center mt-4 animate-fade-up delay-3">
      <p style={{ color: 'var(--pf-text3)', fontSize: 13, marginBottom: 10 }}>
        Belum punya tiket?
      </p>
      <div className="d-flex gap-3 justify-content-center">
        <Button className="btn-pf-outline btn btn-sm" onClick={onBooking}>
          Cari & Booking Parkir
        </Button>
        <Button className="btn-pf-ghost btn btn-sm" onClick={onDemo}>
          Demo Scan
        </Button>
      </div>
    </div>
  )
}
