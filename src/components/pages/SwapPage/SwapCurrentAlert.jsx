import { Alert, Badge } from 'react-bootstrap'

export default function SwapCurrentAlert({ booking }) {
  return (
    <Alert className="swap-current-alert mb-4" style={{ background: 'rgba(0,210,255,0.07)', border: '1.5px solid var(--pf-border2)', borderRadius: 12 }}>
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
        <div>
          <div style={{ fontSize: 12, color: 'var(--pf-text2)', marginBottom: 4 }}>SLOT AKTIF SEKARANG</div>
          <div style={{ fontWeight: 700, color: 'var(--pf-text)', fontSize: 15 }}>
            {booking.parking?.name}
          </div>
          <div style={{ fontSize: 13, color: 'var(--pf-text2)' }}>
            {booking.parking?.floor} / {booking.parking?.slot} · {booking.name} · {booking.plate}
          </div>
        </div>
        <Badge className="badge-pf-blue px-3 py-2" style={{ fontSize: 12 }}>
          🎫 {booking.ticketCode}
        </Badge>
      </div>
    </Alert>
  )
}
