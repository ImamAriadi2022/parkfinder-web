/**
 * bookingStore.js
 * Menyimpan daftar booking aktif di localStorage.
 * Tidak ada backend → state persisten di browser.
 */

const KEY = 'pf_active_bookings'

/** Ambil semua booking aktif */
export function getBookings() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}

/** Simpan satu booking baru */
export function saveBooking(booking) {
  const list = getBookings()
  // Hindari duplikat berdasarkan ticketCode
  const exists = list.findIndex(b => b.ticketCode === booking.ticketCode)
  if (exists === -1) {
    list.unshift({ ...booking, savedAt: new Date().toISOString() })
  } else {
    list[exists] = { ...booking, savedAt: new Date().toISOString() }
  }
  localStorage.setItem(KEY, JSON.stringify(list))
}

/** Batalkan booking (setelah PATCH /reservations/:id/cancel) */
export function cancelBooking(ticketCode) {
  const list = getBookings().map(b =>
    b.ticketCode === ticketCode
      ? {
          ...b,
          cancelled: true,
          expired: true,
          cancelledAt: new Date().toISOString(),
          expiredAt: new Date().toISOString(),
        }
      : b
  )
  localStorage.setItem(KEY, JSON.stringify(list))
}

/** Tandai booking sebagai tidak aktif (expired) */
export function expireBooking(ticketCode) {
  const list = getBookings().map(b =>
    b.ticketCode === ticketCode ? { ...b, expired: true, expiredAt: new Date().toISOString() } : b
  )
  localStorage.setItem(KEY, JSON.stringify(list))
}

/** Update booking (untuk swap) */
export function updateBooking(oldTicketCode, updatedBooking) {
  const list = getBookings().map(b =>
    b.ticketCode === oldTicketCode ? { ...b, ...updatedBooking, updatedAt: new Date().toISOString() } : b
  )
  localStorage.setItem(KEY, JSON.stringify(list))
}

/** Ambil hanya yang masih aktif */
export function getActiveBookings() {
  return getBookings().filter(b => !b.expired)
}

/** Tandai booking sebagai arrived (sudah sampai di slot) */
export function markBookingArrived(ticketCode) {
  const list = getBookings().map(b =>
    b.ticketCode === ticketCode ? { ...b, arrived: true, arrivedAt: new Date().toISOString() } : b
  )
  localStorage.setItem(KEY, JSON.stringify(list))
}

/**
 * Selesai parkir (PATCH /complete): slot dikosongkan, tiket masih aktif sampai keluar area.
 */
export function markParkingCompleted(ticketCode) {
  const list = getBookings().map(b =>
    b.ticketCode === ticketCode
      ? {
          ...b,
          completed: true,
          completedAt: new Date().toISOString(),
        }
      : b
  )
  localStorage.setItem(KEY, JSON.stringify(list))
}

/** Keluar dari area parkir: tiket & sesi dinonaktifkan di sisi client */
export function exitParking(ticketCode) {
  const list = getBookings().map(b =>
    b.ticketCode === ticketCode
      ? {
          ...b,
          expired: true,
          exited: true,
          exitedAt: new Date().toISOString(),
          expiredAt: new Date().toISOString(),
        }
      : b
  )
  localStorage.setItem(KEY, JSON.stringify(list))
}

/** @deprecated gunakan markParkingCompleted + exitParking */
export function completeBooking(ticketCode) {
  markParkingCompleted(ticketCode)
}
