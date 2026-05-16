import MyBookingCard from './MyBookingCard'

export default function MyBookingList({ bookings, onSwap, onCheckout, onArrive, formatDate, cdn }) {
  return (
    <div className="d-flex flex-column gap-3">
      {bookings.map((booking, index) => (
        <MyBookingCard
          key={booking.ticketCode}
          booking={booking}
          index={index}
          onSwap={onSwap}
          onCheckout={onCheckout}
          onArrive={onArrive}
          formatDate={formatDate}
          cdn={cdn}
        />
      ))}
    </div>
  )
}
