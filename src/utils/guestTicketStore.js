import { extractGuestSessionId, extractTicketId } from '../services/api'
import { getActiveBookings } from './bookingStore'

const KEY = 'pf_guest_ticket'

/** Simpan tiket guest setelah verify QR (belum/tanpa reservasi) */
export function saveVerifiedTicket({ ticketId, guestSessionId, qrCode }) {
  const payload = {
    ticketId: ticketId || null,
    guestSessionId: guestSessionId || qrCode || null,
    qrCode: qrCode || null,
    verifiedAt: new Date().toISOString(),
  }
  if (!payload.ticketId && !payload.guestSessionId) return
  localStorage.setItem(KEY, JSON.stringify(payload))
}

export function saveVerifiedTicketFromApi(apiResult, qrCode) {
  const ticketId = extractTicketId(apiResult)
  const guestSessionId = extractGuestSessionId(apiResult, qrCode)
  saveVerifiedTicket({
    ticketId,
    guestSessionId,
    qrCode: qrCode || guestSessionId,
  })
}

export function getVerifiedTicket() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || 'null')
  } catch {
    return null
  }
}

export function clearVerifiedTicket() {
  localStorage.removeItem(KEY)
}

export function hasActiveGuestTicket() {
  const t = getVerifiedTicket()
  return !!(t?.ticketId || t?.guestSessionId)
}

/** Apakah tiket ini sudah punya booking aktif di localStorage */
export function hasActiveBookingForGuestTicket() {
  const t = getVerifiedTicket()
  if (!t) return false
  return getActiveBookings().some(b => {
    if (b.expired) return false
    if (t.ticketId && (b.ticketId === t.ticketId || b.ticketCode === t.ticketId)) return true
    if (t.guestSessionId && b.ticketCode === t.guestSessionId) return true
    return false
  })
}

/** Konteks tiket untuk navigasi booking (tanpa scan ulang jika tiket masih tersimpan) */
export function getGuestTicketContextForBooking() {
  const t = getVerifiedTicket()
  if (!t) {
    return { ticketId: null, guestSessionId: null, scannedQrCode: null, apiResult: null }
  }
  const guestSessionId = t.guestSessionId || t.qrCode || null
  const ticketId = t.ticketId || null
  return {
    ticketId,
    guestSessionId,
    scannedQrCode: t.qrCode || guestSessionId,
    apiResult: {
      data: {
        ticketId,
        guestSessionId,
      },
    },
  }
}
