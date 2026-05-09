import { Button, Card } from 'react-bootstrap'

export default function MyBookingEmptyState({ filter, onBooking }) {
  const title = filter === 'active' ? 'Tidak ada parkiran aktif' : 'Belum ada riwayat booking'
  const message = filter === 'active'
    ? 'Booking parkir terlebih dahulu untuk melihat tiket aktif Anda.'
    : 'Semua booking yang pernah Anda lakukan akan muncul di sini.'

  return (
    <Card className="text-center py-5">
      <Card.Body>
        <div style={{ fontSize: 52, marginBottom: 16 }}>🅿️</div>
        <h5 style={{ color: 'var(--pf-text)' }}>{title}</h5>
        <p className="mb-4">{message}</p>
        <Button className="btn-pf-primary btn" onClick={onBooking}>
          Booking Sekarang
        </Button>
      </Card.Body>
    </Card>
  )
}
