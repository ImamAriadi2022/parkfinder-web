import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import { getBookings } from '../utils/bookingStore'
import MyBookingEmptyState from '../components/pages/MyBookingPage/MyBookingEmptyState'
import MyBookingFilters from '../components/pages/MyBookingPage/MyBookingFilters'
import MyBookingHeader from '../components/pages/MyBookingPage/MyBookingHeader'
import MyBookingList from '../components/pages/MyBookingPage/MyBookingList'
import MyBookingStats from '../components/pages/MyBookingPage/MyBookingStats'
import '../styles/pages/MyBookingPage.css'

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
    navigate('/swap', { state: { ticketCode: booking.ticketCode, name: booking.name, plate: booking.plate, phone: booking.phone, parking: booking.parking } })
  }

  const handleCheckout = (booking) => {
    navigate('/checkout', { state: { ticketCode: booking.ticketCode, name: booking.name, plate: booking.plate, phone: booking.phone, parking: booking.parking } })
  }

  return (
    <div style={{ paddingTop: 86, minHeight: '100vh' }}>
      <Container className="py-4">
        <MyBookingHeader onNewBooking={() => navigate('/parking')} />
        <MyBookingStats activeCount={activeCount} expiredCount={expiredCount} totalCount={bookings.length} />
        <MyBookingFilters filter={filter} onChange={setFilter} activeCount={activeCount} totalCount={bookings.length} />

        {displayed.length === 0 ? (
          <MyBookingEmptyState filter={filter} onBooking={() => navigate('/parking')} />
        ) : (
          <MyBookingList
            bookings={displayed}
            onSwap={handleSwap}
            onCheckout={handleCheckout}
            formatDate={fmtDate}
            cdn={CDN}
          />
        )}
      </Container>
    </div>
  )
}
