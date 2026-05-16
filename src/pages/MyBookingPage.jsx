import { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import MyBookingEmptyState from '../components/pages/MyBookingPage/MyBookingEmptyState'
import MyBookingFilters from '../components/pages/MyBookingPage/MyBookingFilters'
import MyBookingHeader from '../components/pages/MyBookingPage/MyBookingHeader'
import MyBookingList from '../components/pages/MyBookingPage/MyBookingList'
import MyBookingStats from '../components/pages/MyBookingPage/MyBookingStats'
import { GuestService } from '../services/api'
import '../styles/pages/MyBookingPage.css'
import { cancelBooking, getBookings, markBookingArrived, markParkingCompleted } from '../utils/bookingStore'
import { hasActiveGuestTicket, saveVerifiedTicket } from '../utils/guestTicketStore'

const CDN = 'https://storage.googleapis.com/parkfinderbucket'

export default function MyBookingPage() {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [filter, setFilter] = useState('active')

  const reload = () => setBookings(getBookings())

  useEffect(() => { reload() }, [])

  const displayed = filter === 'active'
    ? bookings.filter(item => !item.expired)
    : bookings

  const activeCount = bookings.filter(item => !item.expired).length
  const expiredCount = bookings.filter(item => item.expired).length

  const fmtDate = (iso) => {
    if (!iso) return '—'
    const date = new Date(iso)
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
      + ' ' + date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  }

  const handleSwap = (booking) => {
    navigate('/swap', {
      state: {
        ticketCode: booking.ticketCode,
        reservationId: booking.reservationId,
        name: booking.name,
        plate: booking.plate,
        phone: booking.phone,
        parking: booking.parking,
      },
    })
  }

  const handleCompletePark = async (booking) => {
    if (!booking.reservationId) {
      alert('ID reservasi tidak ada. Buat booking baru lalu coba lagi.')
      return
    }
    if (!booking.arrived) {
      alert('Konfirmasi "Sudah Sampai" di slot terlebih dahulu.')
      return
    }
    if (!window.confirm('Selesai parkir? Slot akan dikosongkan. Tiket tetap aktif sampai Anda keluar dari area.')) return

    try {
      await GuestService.completeReservation(booking.reservationId)
      markParkingCompleted(booking.ticketCode)
      reload()
      alert('✓ Parkir selesai. Slot dikosongkan. Saat keluar area, tekan "Keluar Parkir".')
    } catch (error) {
      console.error('Error complete park:', error)
      alert(error?.message || 'Gagal menyelesaikan parkir.')
    }
  }

  const handleCheckout = (booking) => {
    if (!booking.completed) {
      alert('Tekan "Selesai Parkir" terlebih dahulu untuk mengosongkan slot, baru keluar area.')
      return
    }
    navigate('/checkout', {
      state: {
        ticketCode: booking.ticketCode,
        ticketId: booking.ticketId,
        reservationId: booking.reservationId,
        completed: booking.completed,
        name: booking.name,
        plate: booking.plate,
        phone: booking.phone,
        parking: booking.parking,
      },
    })
  }

  const handleCancel = async (booking) => {
    if (!booking.reservationId) {
      alert('ID reservasi tidak ada. Booking lama tidak bisa dibatalkan lewat API — hapus dari daftar atau buat booking baru.')
      return
    }
    if (!window.confirm('Batalkan reservasi parkir ini? Slot akan dilepas.')) return

    try {
      await GuestService.cancelReservation(booking.reservationId)
      cancelBooking(booking.ticketCode)
      if (!hasActiveGuestTicket()) {
        saveVerifiedTicket({
          ticketId: booking.ticketId || null,
          guestSessionId: booking.ticketCode || booking.reservationId || null,
          qrCode: booking.ticketCode || booking.ticketId || booking.reservationId || null,
        })
      }
      reload()
      alert('✓ Reservasi berhasil dibatalkan.')
    } catch (error) {
      console.error('Error cancel reservation:', error)
      alert(error?.message || 'Gagal membatalkan reservasi.')
    }
  }

  const handleArrive = async (booking) => {
    const reservationId = booking.reservationId
    if (!reservationId) {
      alert(
        'ID reservasi tidak ada di data booking ini (mungkin booking lama sebelum integrasi API). ' +
          'Buat booking ulang dari alur parkir, lalu tekan "sudah sampai" lagi.'
      )
      return
    }

    try {
      await GuestService.arriveInSlot(reservationId)
      markBookingArrived(booking.ticketCode)
      reload()
      alert('✓ Anda sudah tiba di slot parkir!')
    } catch (error) {
      console.error('Error marking as arrived:', error)
      alert(error?.message || 'Gagal mengirim konfirmasi ke server. Periksa jaringan atau coba lagi.')
    }
  }

  return (
    <div style={{ paddingTop: 86, minHeight: '100vh' }}>
      <Container className="py-4">
        <MyBookingHeader
          onNewBooking={() => {
            const hasTicket = hasActiveGuestTicket()
            if (!hasTicket) {
              navigate('/scan', { state: { redirect: '/parking' } })
              return
            }
            navigate('/parking')
          }}
        />
        <MyBookingStats activeCount={activeCount} expiredCount={expiredCount} totalCount={bookings.length} />
        <MyBookingFilters filter={filter} onChange={setFilter} activeCount={activeCount} totalCount={bookings.length} />

        {displayed.length === 0 ? (
          <MyBookingEmptyState filter={filter} onBooking={() => navigate('/parking')} />
        ) : (
          <MyBookingList
            bookings={displayed}
            onSwap={handleSwap}
            onCheckout={handleCheckout}
            onCompletePark={handleCompletePark}
            onCancel={handleCancel}
            onArrive={handleArrive}
            formatDate={fmtDate}
            cdn={CDN}
          />
        )}
      </Container>
    </div>
  )
}
