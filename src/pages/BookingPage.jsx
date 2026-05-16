import { useEffect, useRef, useState } from 'react'
import { Button, Container } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import BookingConfirmStep from '../components/pages/BookingPage/BookingConfirmStep'
import BookingFormStep from '../components/pages/BookingPage/BookingFormStep'
import BookingHeader from '../components/pages/BookingPage/BookingHeader'
import BookingStepper from '../components/pages/BookingPage/BookingStepper'
import BookingSuccessStep from '../components/pages/BookingPage/BookingSuccessStep'
import { GuestService, extractReservationId, extractTicketId } from '../services/api'
import '../styles/pages/BookingPage.css'
import GuestActiveTicketBar from '../components/GuestActiveTicketBar'
import { saveBooking } from '../utils/bookingStore'
import { saveVerifiedTicketFromApi } from '../utils/guestTicketStore'

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
  const [submitting, setSubmitting] = useState(false)

  const resolvedTicketId = extractTicketId(apiResult)
  const guestSessionRef = useRef(
    apiResult?.data?.guestSessionId
    || apiResult?.guestSessionId
    || scannedQrCode
    || `PKF-${Date.now().toString(36).toUpperCase().slice(-8)}`
  )
  const guestSessionId = guestSessionRef.current
  const slotId = parking?.slotId

  useEffect(() => {
    if (apiResult && scannedQrCode) {
      saveVerifiedTicketFromApi(apiResult, scannedQrCode)
    }
  }, [apiResult, scannedQrCode])

  if (!parking?.id && !parking?.name) {
    return (
      <div style={{ paddingTop: 86, minHeight: '100vh' }}>
        <Container className="py-5 text-center">
          <div style={{ fontSize: 56, marginBottom: 16 }}>🅿️</div>
          <h3 style={{ color: 'var(--pf-text)' }}>Pilih Slot Parkir Dulu</h3>
          <p className="mb-4">Anda perlu memilih gedung dan slot sebelum booking.</p>
          <Button className="btn btn-pf-primary" onClick={() => navigate('/parking')}>
            Pilih Parkir
          </Button>
        </Container>
      </div>
    )
  }

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
      if (!resolvedTicketId) {
        alert('Tiket belum diverifikasi. Scan QR tiket parkir terlebih dahulu.')
        navigate('/scan', {
          state: {
            redirect: '/booking',
            parking: parking ? { ...parking, scannedQrCode, apiResult } : null,
          },
        })
        return
      }
      if (!slotId) {
        alert('Slot parkir belum dipilih. Kembali dan pilih slot yang tersedia.')
        navigate('/parking')
        return
      }

      setSubmitting(true)
      try {
        const payload = {
          ticketId: resolvedTicketId,
          slotId,
          name: form.name.trim(),
          plateNumber: form.plate.trim(),
        }
        const res = await GuestService.createReservation(payload)
        const resId = extractReservationId(res)
        if (!resId) {
          console.error('[BookingPage] createReservation: tidak ada reservation id', res)
          alert('Reservasi dibuat di server tapi ID tidak diterima. Hubungi admin atau coba lagi.')
          return
        }
        setReservationId(resId)

        saveBooking({
          ticketCode: guestSessionId,
          ticketId: resolvedTicketId,
          reservationId: resId,
          name: form.name,
          plate: form.plate,
          phone: form.phone,
          parking: {
            ...parking,
            id: parking?.id,
            slotId,
          },
        })

        setStep(2)
      } catch (err) {
        console.error('Gagal booking:', err)
        alert(err.message || 'Gagal membuat reservasi')
      } finally {
        setSubmitting(false)
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
        {step < 2 && <GuestActiveTicketBar className="mb-3" />}

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
            submitting={submitting}
            hasTicket={!!resolvedTicketId}
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
