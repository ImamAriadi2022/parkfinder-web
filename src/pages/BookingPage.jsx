import { useRef, useState } from 'react'
import { Container } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import BookingConfirmStep from '../components/pages/BookingPage/BookingConfirmStep'
import BookingFormStep from '../components/pages/BookingPage/BookingFormStep'
import BookingHeader from '../components/pages/BookingPage/BookingHeader'
import BookingStepper from '../components/pages/BookingPage/BookingStepper'
import BookingSuccessStep from '../components/pages/BookingPage/BookingSuccessStep'
import { GuestService } from '../services/api'
import '../styles/pages/BookingPage.css'
import { saveBooking } from '../utils/bookingStore'

const STEPS = ['Detail Booking', 'Konfirmasi', 'Selesai']

export default function BookingPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const parking = location.state || null
  const scannedQrCode = location.state?.scannedQrCode || null
  const apiResult = location.state?.apiResult || null

  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ name: '', plate: '', phone: '' })
  const [errors, setErrors] = useState({})
  const [reservationId, setReservationId] = useState(null)

  // Debug: log all received data
  console.log('[BookingPage] location.state:', location.state)
  console.log('[BookingPage] apiResult:', apiResult)
  console.log('[BookingPage] scannedQrCode:', scannedQrCode)

  // Extract ticketId from apiResult (try all possible response shapes)
  const ticketId = apiResult?.data?.ticketId
    || apiResult?.ticketId
    || apiResult?.data?.ticket?.id
    || scannedQrCode

  // Use guestSessionId from api if available
  const guestSessionRef = useRef(
    apiResult?.data?.guestSessionId
    || apiResult?.guestSessionId
    || scannedQrCode
    || `PKF-${Date.now().toString(36).toUpperCase().slice(-8)}`
  )
  const guestSessionId = guestSessionRef.current

  console.log('[BookingPage] resolved ticketId:', ticketId)
  console.log('[BookingPage] resolved guestSessionId:', guestSessionId)

  const validate = () => {
    const nextErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Nama wajib diisi'
    if (!form.plate.trim()) nextErrors.plate = 'Nomor kendaraan wajib diisi'
    if (!form.phone.trim()) nextErrors.phone = 'Nomor HP wajib diisi'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const setField = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }))
  }

  const nextStep = async () => {
    if (step === 0 && !validate()) return
    
    if (step === 1) {
      try {
        const payload = {
          slotId: parking?.slotId || 'UNKNOWN_SLOT',
          ticketId: ticketId || guestSessionId,
          name: form.name,
          plateNumber: form.plate
        }
        console.log('[BookingPage] createReservation payload:', payload)
        const res = await GuestService.createReservation(payload)
        console.log('[BookingPage] createReservation response:', res)
        
        const resId = res?.data?.id || res?.data?.reservationId || res?.id
        setReservationId(resId)
        
        saveBooking({
          ticketCode: guestSessionId,
          reservationId: resId,
          name: form.name,
          plate: form.plate,
          phone: form.phone,
          parking,
        })
        
        setStep(2)
      } catch (err) {
        console.error("Gagal booking:", err)
        alert(err.message || 'Gagal membuat booking')
      }
      return
    }

    const target = step + 1
    if (target <= STEPS.length - 1) {
      setStep(target)
    }
  }

  return (
    <div style={{ paddingTop: 86, minHeight: '100vh' }}>
      <Container className="py-4">
        <BookingHeader title="Booking Parkir" subtitle="Amankan slot parkir Anda sekarang" />
        <BookingStepper steps={STEPS} step={step} />

        {step === 0 && (
          <BookingFormStep
            form={form}
            errors={errors}
            onFieldChange={setField}
            parking={parking}
            onContinue={nextStep}
            onPickParking={() => navigate('/parking')}
          />
        )}

        {step === 1 && (
          <BookingConfirmStep
            form={form}
            parking={parking}
            onBack={() => setStep(0)}
            onConfirm={nextStep}
          />
        )}

        {step === 2 && (
          <BookingSuccessStep
            ticketCode={guestSessionId}
            form={form}
            parking={parking}
            onSwap={() => navigate('/swap', { state: { ticketCode: guestSessionId, reservationId, name: form.name, plate: form.plate, phone: form.phone, parking } })}
            onCheckout={() => navigate('/checkout', { state: { ticketCode: guestSessionId, reservationId, name: form.name, plate: form.plate, phone: form.phone, parking } })}
            onMyBooking={() => navigate('/my-booking')}
            onBookingAgain={() => navigate('/parking')}
            onHome={() => navigate('/')}
          />
        )}
      </Container>
    </div>
  )
}
