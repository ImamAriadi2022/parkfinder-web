import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button, Container } from 'react-bootstrap'
import { expireBooking } from '../utils/bookingStore'
import { GuestService } from '../services/api'
import CheckoutConfirmStep from '../components/pages/CheckoutPage/CheckoutConfirmStep'
import CheckoutHeader from '../components/pages/CheckoutPage/CheckoutHeader'
import CheckoutStepper from '../components/pages/CheckoutPage/CheckoutStepper'
import CheckoutSuccessStep from '../components/pages/CheckoutPage/CheckoutSuccessStep'
import '../styles/pages/CheckoutPage.css'

const CHECKOUT_STEPS = ['Konfirmasi Keluar', 'Selesai']

export default function CheckoutPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const booking = location.state

  const [step, setStep] = useState(0)
  const [processing, setProcessing] = useState(false)
  const [checkoutTime] = useState(new Date())

  if (!booking) {
    return (
      <div style={{ paddingTop: 86, minHeight: '100vh' }}>
        <Container className="py-5 text-center">
          <div style={{ fontSize: 56, marginBottom: 16 }}>⚠️</div>
          <h3 style={{ color: 'var(--pf-text)' }}>Tidak Ada Tiket Aktif</h3>
          <p className="mb-4">Anda tidak memiliki tiket parkir aktif untuk diproses.</p>
          <Button className="btn-pf-primary btn" onClick={() => navigate('/')}>Ke Beranda</Button>
        </Container>
      </div>
    )
  }

  const handleCheckout = async () => {
    setProcessing(true)
    try {
      if (booking.reservationId) {
        await GuestService.completeReservation(booking.reservationId)
      }
      expireBooking(booking.ticketCode)
      setProcessing(false)
      setStep(1)
    } catch (err) {
      console.error("Gagal checkout:", err)
      alert(err.message || "Gagal melakukan proses keluar parkir")
      setProcessing(false)
    }
  }

  return (
    <div style={{ paddingTop: 86, minHeight: '100vh' }}>
      <Container className="py-4">
        <CheckoutHeader step={step} onBack={() => navigate(-1)} />
        <CheckoutStepper steps={CHECKOUT_STEPS} step={step} />

        {step === 0 && (
          <CheckoutConfirmStep
            booking={booking}
            onBack={() => navigate(-1)}
            onConfirm={handleCheckout}
            processing={processing}
          />
        )}

        {step === 1 && (
          <CheckoutSuccessStep
            booking={booking}
            checkoutTime={checkoutTime}
            onBookingAgain={() => navigate('/parking')}
            onHome={() => navigate('/')}
          />
        )}
      </Container>
    </div>
  )
}
