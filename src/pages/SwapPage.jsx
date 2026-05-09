import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button, Container } from 'react-bootstrap'
import SwapConfirmStep from '../components/pages/SwapPage/SwapConfirmStep'
import SwapCurrentAlert from '../components/pages/SwapPage/SwapCurrentAlert'
import SwapHeader from '../components/pages/SwapPage/SwapHeader'
import SwapSelectStep from '../components/pages/SwapPage/SwapSelectStep'
import SwapStepper from '../components/pages/SwapPage/SwapStepper'
import SwapSuccessStep from '../components/pages/SwapPage/SwapSuccessStep'
import '../styles/pages/SwapPage.css'

const PARKINGS = [
  { id: 1, name: 'Jurusan Teknik Elektro Universitas Lampung', occupancy: 78, slots: '4/5 Kosong', distance: '0.3 km', tag: 'Tersedia', tagClass: 'green', address: 'Jl. Prof. Soemantri Brojonegoro, Bandar Lampung' },
  { id: 2, name: 'Mall Boemi Kedaton', occupancy: 81, slots: '635/1384 Kosong', distance: '1.2 km', tag: 'Ramai', tagClass: 'orange', address: 'Jl. Z.A. Pagar Alam, Bandar Lampung' },
  { id: 3, name: 'Lampung City Mall', occupancy: 81, slots: '635/1384 Kosong', distance: '2.1 km', tag: 'Ramai', tagClass: 'orange', address: 'Jl. Hayam Wuruk, Bandar Lampung' },
  { id: 4, name: 'Pasar Bambu Kuning', occupancy: 45, slots: '120/220 Kosong', distance: '0.8 km', tag: 'Tersedia', tagClass: 'green', address: 'Jl. Imam Bonjol, Bandar Lampung' },
  { id: 5, name: 'Stasiun Tanjungkarang', occupancy: 55, slots: '90/200 Kosong', distance: '1.8 km', tag: 'Tersedia', tagClass: 'green', address: 'Jl. Kepodang, Bandar Lampung' },
]

const FLOORS = [
  { id: 'B1', slots: ['B1-01', 'B1-02', 'B1-03', 'B1-04', 'B1-05', 'B1-06'], available: [true, true, false, true, false, true] },
  { id: 'L1', slots: ['A01', 'A02', 'A03', 'A04', 'A05', 'A06', 'A07', 'A08'], available: [false, true, false, false, true, true, false, true] },
  { id: 'L2', slots: ['B01', 'B02', 'B03', 'B04', 'B05', 'B06'], available: [true, false, true, true, false, true] },
]

const SWAP_STEPS = ['Pilih Slot Baru', 'Konfirmasi Tukar', 'Selesai']

export default function SwapPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const booking = location.state

  const allowedParkings = booking?.parking ? PARKINGS.filter(p => p.name === booking.parking.name) : PARKINGS

  const [step, setStep] = useState(0)
  const [selectedParking, setSelectedParking] = useState(allowedParkings.length === 1 ? allowedParkings[0] : null)
  const [floor, setFloor] = useState('L1')
  const [newSlot, setNewSlot] = useState(null)
  const [swapping, setSwapping] = useState(false)
  const [newTicketCode] = useState(`PKF-SW-${Date.now().toString(36).toUpperCase().slice(-6)}`)

  if (!booking) {
    return (
      <div style={{ paddingTop: 86, minHeight: '100vh' }}>
        <Container className="py-5 text-center">
          <div style={{ fontSize: 56, marginBottom: 16 }}>⚠️</div>
          <h3 style={{ color: 'var(--pf-text)' }}>Tidak Ada Booking Aktif</h3>
          <p className="mb-4">Anda perlu melakukan booking terlebih dahulu untuk menggunakan fitur tukar slot.</p>
          <Button className="btn-pf-primary btn" onClick={() => navigate('/parking')}>
            Booking Sekarang
          </Button>
        </Container>
      </div>
    )
  }

  const handleConfirmSwap = () => {
    setSwapping(true)
    setTimeout(() => {
      setSwapping(false)
      setStep(2)
    }, 1600)
  }

  return (
    <div style={{ paddingTop: 86, minHeight: '100vh' }}>
      <Container className="py-4">
        <SwapHeader onBack={() => navigate(-1)} />
        <SwapCurrentAlert booking={booking} />
        <SwapStepper steps={SWAP_STEPS} step={step} />

        {step === 0 && (
          <SwapSelectStep
            booking={booking}
            parkings={allowedParkings}
            floors={FLOORS}
            selectedParking={selectedParking}
            floor={floor}
            newSlot={newSlot}
            onSelectParking={(parking) => { setSelectedParking(parking); setNewSlot(null) }}
            onFloorChange={(value) => { setFloor(value); setNewSlot(null) }}
            onSelectSlot={setNewSlot}
            onNext={() => setStep(1)}
          />
        )}

        {step === 1 && (
          <SwapConfirmStep
            booking={booking}
            selectedParking={selectedParking}
            floor={floor}
            newSlot={newSlot}
            swapping={swapping}
            onBack={() => setStep(0)}
            onConfirm={handleConfirmSwap}
          />
        )}

        {step === 2 && (
          <SwapSuccessStep
            booking={booking}
            selectedParking={selectedParking}
            floor={floor}
            newSlot={newSlot}
            newTicketCode={newTicketCode}
            onGoParking={() => navigate('/parking')}
            onGoHome={() => navigate('/')}
          />
        )}
      </Container>
    </div>
  )
}
