import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button, Container } from 'react-bootstrap'
import { GuestService } from '../services/api'
import { updateBooking } from '../utils/bookingStore'
import SwapConfirmStep from '../components/pages/SwapPage/SwapConfirmStep'
import SwapCurrentAlert from '../components/pages/SwapPage/SwapCurrentAlert'
import SwapHeader from '../components/pages/SwapPage/SwapHeader'
import SwapSelectStep from '../components/pages/SwapPage/SwapSelectStep'
import SwapStepper from '../components/pages/SwapPage/SwapStepper'
import SwapSuccessStep from '../components/pages/SwapPage/SwapSuccessStep'
import '../styles/pages/SwapPage.css'

const SWAP_STEPS = ['Pilih Slot Baru', 'Konfirmasi Tukar', 'Selesai']

export default function SwapPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const booking = location.state

  const [step, setStep] = useState(0)
  
  const [parkings, setParkings] = useState([])
  const [selectedParking, setSelectedParking] = useState(null)
  
  const [floors, setFloors] = useState([])
  const [floor, setFloor] = useState('')
  const [newSlot, setNewSlot] = useState(null)
  
  const [swapping, setSwapping] = useState(false)
  const [newTicketCode] = useState(`PKF-SW-${Date.now().toString(36).toUpperCase().slice(-6)}`)

  // Fetch only the current parking area for swap to enforce same-building only
  useEffect(() => {
    if (booking?.parking?.id) {
      GuestService.getAreaById(booking.parking.id)
        .then(res => {
          if (res.success && res.data) {
            const p = res.data;
            const formatted = {
              id: p.id,
              name: p.name,
              occupancy: p.totalSlots > 0 ? Math.round(((p.totalSlots - p.availableSlots) / p.totalSlots) * 100) : 0,
              slots: `${p.availableSlots}/${p.totalSlots} Kosong`,
              distance: '0.0 km',
              tag: p.availableSlots > 0 ? (p.availableSlots < p.totalSlots * 0.2 ? 'Ramai' : 'Tersedia') : 'Penuh',
              tagClass: p.availableSlots > 0 ? (p.availableSlots < p.totalSlots * 0.2 ? 'orange' : 'green') : 'red',
              address: p.address || 'Bandar Lampung'
            };
            setParkings([formatted])
            setSelectedParking(formatted)
          }
        })
        .catch(err => console.error("Error fetching area for swap", err))
    }
  }, [booking])

  // Fetch slots for selected parking
  useEffect(() => {
    if (selectedParking?.id) {
      GuestService.getAllSlotsInArea(selectedParking.id)
        .then(res => {
          if (res.success && res.data) {
            const floorGroups = {}
            res.data.forEach(slot => {
              const f = `L${slot.floor}`
              if (!floorGroups[f]) floorGroups[f] = { id: f, slots: [], available: [], rawSlots: [] }
              floorGroups[f].slots.push(slot.slotName)
              // Only consider available if it's not the user's current slot
              floorGroups[f].available.push(slot.appStatus === 'available')
              floorGroups[f].rawSlots.push(slot)
            })
            const floorArr = Object.values(floorGroups).sort((a,b) => a.id.localeCompare(b.id))
            setFloors(floorArr)
            if (floorArr.length > 0) {
              setFloor(floorArr[0].id)
            }
          }
        })
        .catch(err => console.error("Error fetching slots", err))
    }
  }, [selectedParking])

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

  const handleConfirmSwap = async () => {
    setSwapping(true)
    try {
      const currentFloorData = floors.find(f => f.id === floor)
      const slotData = currentFloorData?.rawSlots?.find(s => s.slotName === newSlot)
      
      if (booking.reservationId && slotData?.id) {
        await GuestService.swapSlot(booking.reservationId, slotData.id)
      }
      
      updateBooking(booking.ticketCode, { 
        ticketCode: newTicketCode, 
        parking: { ...booking.parking, slot: newSlot, floor } 
      })
      
      setSwapping(false)
      setStep(2)
    } catch (err) {
      console.error("Gagal swap:", err)
      alert(err.message || "Gagal memproses tukar slot parkir")
      setSwapping(false)
    }
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
            parkings={parkings}
            floors={floors}
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
