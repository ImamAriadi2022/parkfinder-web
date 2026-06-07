import { useEffect, useState } from 'react'
import { Button, Container } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import SwapConfirmStep from '../components/pages/SwapPage/SwapConfirmStep'
import SwapCurrentAlert from '../components/pages/SwapPage/SwapCurrentAlert'
import SwapHeader from '../components/pages/SwapPage/SwapHeader'
import SwapSelectStep from '../components/pages/SwapPage/SwapSelectStep'
import SwapStepper from '../components/pages/SwapPage/SwapStepper'
import SwapSuccessStep from '../components/pages/SwapPage/SwapSuccessStep'
import { GuestService } from '../services/api'
import '../styles/pages/SwapPage.css'
import { updateBooking } from '../utils/bookingStore'

const SWAP_STEPS = ['Pilih Slot Baru', 'Konfirmasi Tukar', 'Selesai']

const getSlotName = (slot, index) =>
  slot.slotName || slot.slotNumber || slot.label || `Slot ${index + 1}`

const getSlotAvailable = (slot) => {
  const status = String(slot.appStatus || slot.status || '').toLowerCase()
  return status === 'available' || status === 'empty' || status === 'tersedia'
}

/** Backend kadang { success, data }, kadang array/object langsung — supaya swap tidak kosong di produksi */
function unwrapList(res) {
  if (res == null) return null
  if (Array.isArray(res)) return res
  if (Array.isArray(res?.data)) return res.data
  if (res?.success !== false && res?.data != null) return res.data
  return null
}

function unwrapArea(res) {
  const raw = unwrapList(res) ?? res
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) return raw
  return null
}

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
  const [newTicketCode, setNewTicketCode] = useState('')

  // Fetch only the current parking area for swap to enforce same-building only
  useEffect(() => {
    if (booking?.parking?.id) {
      GuestService.getAreaById(booking.parking.id)
        .then(res => {
          const p = unwrapArea(res)
          if (p?.id) {
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
    if (!selectedParking?.id) return undefined

    let active = true
    GuestService.getAllSlotsInArea(selectedParking.id)
      .then(res => {
        if (!active) return

        const list = unwrapList(res)
        if (!Array.isArray(list)) {
          setFloors([])
          setFloor('')
          return
        }

        const floorGroups = {}
        list.forEach((slot, index) => {
          const f = slot.floor !== undefined && slot.floor !== null ? `L${slot.floor}` : 'L1'
          const displayName = getSlotName(slot, index)
          const slotKey = String(slot.id ?? `${selectedParking.id}-${f}-${displayName}-${index}`)
          const normalizedSlot = {
            ...slot,
            displayName,
            slotKey,
            isAvailable: getSlotAvailable(slot),
          }

          if (!floorGroups[f]) floorGroups[f] = { id: f, slots: [], available: [], rawSlots: [] }
          floorGroups[f].slots.push(displayName)
          floorGroups[f].available.push(normalizedSlot.isAvailable)
          floorGroups[f].rawSlots.push(normalizedSlot)
        })

        const floorArr = Object.values(floorGroups).sort((a, b) =>
          a.id.localeCompare(b.id, undefined, { numeric: true })
        )
        setFloors(floorArr)
        setFloor(floorArr[0]?.id || '')
      })
      .catch(err => {
        if (!active) return
        console.error("Error fetching slots", err)
        setFloors([])
        setFloor('')
      })

    return () => {
      active = false
    }
  }, [selectedParking?.id])

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
      const slotData = newSlot
      
      if (!booking.reservationId) {
        throw new Error('ID reservasi tidak ada. Buat booking ulang lalu coba tukar slot lagi.')
      }
      if (!slotData?.id) {
        throw new Error('Slot tujuan tidak valid. Kembali dan pilih slot lagi.')
      }

      await GuestService.swapSlot(booking.reservationId, slotData.id)
      const nextTicketCode = `PKF-SW-${Date.now().toString(36).toUpperCase().slice(-6)}`
      setNewTicketCode(nextTicketCode)
      
      updateBooking(booking.ticketCode, { 
        ticketCode: nextTicketCode, 
        reservationId: booking.reservationId,
        parking: { ...booking.parking, slot: slotData.displayName, floor } 
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
            onSelectParking={(parking) => { setSelectedParking(parking); setNewSlot(null); setFloors([]); setFloor('') }}
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
            onGoHome={() => navigate('/parking')}
          />
        )}
      </Container>
    </div>
  )
}
