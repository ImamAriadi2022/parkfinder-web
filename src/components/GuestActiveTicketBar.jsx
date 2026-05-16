import { useState } from 'react'
import { Alert, Button } from 'react-bootstrap'
import { GuestService } from '../services/api'
import {
  clearVerifiedTicket,
  getVerifiedTicket,
  hasActiveBookingForGuestTicket,
} from '../utils/guestTicketStore'

/**
 * Banner: batalkan tiket guest yang sudah diverifikasi tapi belum punya reservasi aktif.
 */
export default function GuestActiveTicketBar({ onCancelled, className = 'mb-4' }) {
  const [hidden, setHidden] = useState(false)
  const [cancelling, setCancelling] = useState(false)

  const ticket = getVerifiedTicket()
  const hasReservation = hasActiveBookingForGuestTicket()

  if (hidden || !ticket || hasReservation) return null

  const displayCode = ticket.qrCode || ticket.guestSessionId || ticket.ticketId || '—'

  const handleCancel = async () => {
    if (!window.confirm('Batalkan tiket parkir ini? Tiket akan dinonaktifkan (tanpa perlu reservasi).')) {
      return
    }
    setCancelling(true)
    try {
      await GuestService.cancelTicket({
        ticketId: ticket.ticketId || undefined,
        guestSessionId: ticket.guestSessionId || ticket.qrCode || undefined,
      })
      clearVerifiedTicket()
      setHidden(true)
      onCancelled?.()
      alert('✓ Tiket berhasil dibatalkan.')
    } catch (err) {
      console.error('cancelTicket:', err)
      alert(err?.message || 'Gagal membatalkan tiket.')
    } finally {
      setCancelling(false)
    }
  }

  return (
    <Alert
      className={className}
      style={{
        background: 'rgba(0,210,255,0.08)',
        border: '1.5px solid var(--pf-border2)',
        borderRadius: 12,
      }}
    >
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
        <div>
          <div style={{ fontSize: 12, color: 'var(--pf-text2)', marginBottom: 4 }}>TIKET AKTIF (BELUM RESERVASI)</div>
          <div style={{ fontWeight: 700, color: 'var(--pf-text)', fontFamily: 'monospace', fontSize: 14 }}>
            {displayCode}
          </div>
          <small style={{ color: 'var(--pf-text3)', fontSize: 11 }}>
            Batalkan tiket jika tidak jadi parkir — tanpa booking slot
          </small>
        </div>
        <Button
          variant="outline-danger"
          size="sm"
          className="btn"
          onClick={handleCancel}
          disabled={cancelling}
        >
          {cancelling ? 'Membatalkan...' : '✕ Batalkan Tiket'}
        </Button>
      </div>
    </Alert>
  )
}
