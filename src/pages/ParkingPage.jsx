import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Col, Container, Row } from 'react-bootstrap'
import ParkingHeader from '../components/pages/ParkingPage/ParkingHeader'
import ParkingList from '../components/pages/ParkingPage/ParkingList'
import ParkingSearch from '../components/pages/ParkingPage/ParkingSearch'
import ParkingSlotPanel from '../components/pages/ParkingPage/ParkingSlotPanel'
import { GuestService } from '../services/api'
import '../styles/pages/ParkingPage.css'

export default function ParkingPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const scannedQrCode = location.state?.scannedQrCode || null
  const apiResult = location.state?.apiResult || null

  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(location.state?.id ? location.state : null)
  const [floor, setFloor] = useState('')
  const [selectedSlot, setSelectedSlot] = useState(null)

  const [parkings, setParkings] = useState([])
  const [floors, setFloors] = useState([])

  useEffect(() => {
    GuestService.getAllAreas()
      .then(res => {
        if (res.success && res.data) {
          const formatted = res.data.map(p => ({
            id: p.id,
            name: p.name,
            occupancy: p.totalSlots > 0 ? Math.round(((p.totalSlots - p.availableSlots) / p.totalSlots) * 100) : 0,
            slots: `${p.availableSlots}/${p.totalSlots} Kosong`,
            distance: '0.0 km', // Jarak mock
            tag: p.availableSlots > 0 ? (p.availableSlots < p.totalSlots * 0.2 ? 'Ramai' : 'Tersedia') : 'Penuh',
            tagClass: p.availableSlots > 0 ? (p.availableSlots < p.totalSlots * 0.2 ? 'orange' : 'green') : 'red',
            address: p.address || 'Bandar Lampung'
          }))
          setParkings(formatted)
        }
      })
      .catch(err => console.error("Error fetching areas", err))
  }, [])

  useEffect(() => {
    if (selected?.id) {
      GuestService.getAllSlotsInArea(selected.id)
        .then(res => {
          if (res.success && res.data) {
            // Group slots by floor
            const floorGroups = {}
            res.data.forEach(slot => {
              const f = `L${slot.floor}`
              if (!floorGroups[f]) floorGroups[f] = { id: f, slots: [], available: [], rawSlots: [] }
              floorGroups[f].slots.push(slot.slotName)
              floorGroups[f].available.push(slot.appStatus === 'available')
              floorGroups[f].rawSlots.push(slot)
            })
            const floorArr = Object.values(floorGroups).sort((a,b) => a.id.localeCompare(b.id))
            setFloors(floorArr)
            if (floorArr.length > 0) {
              setFloor(floorArr[0].id)
            } else {
              setFloor('')
            }
          }
        })
        .catch(err => console.error("Error fetching slots", err))
    }
  }, [selected])

  const filtered = parkings.filter(parking => parking.name.toLowerCase().includes(search.toLowerCase()))
  const currentFloor = floors.find(item => item.id === floor) || { id: floor, slots: [], available: [], rawSlots: [] }

  const handleSearch = (value) => {
    setSearch(value)
    setSelected(null)
    setSelectedSlot(null)
    setFloors([])
    setFloor('')
  }

  return (
    <div style={{ paddingTop: 86, minHeight: '100vh' }}>
      <Container className="py-4">
        <ParkingHeader />
        <ParkingSearch search={search} onChange={handleSearch} onClear={() => handleSearch('')} />

        <Row className="g-4">
          <Col lg={5}>
            <ParkingList
              parkings={filtered}
              selectedId={selected?.id}
              search={search}
              onSelect={(parking) => {
                if (parking.tag !== 'Penuh') {
                  setSelected(parking)
                  setSelectedSlot(null)
                }
              }}
            />
          </Col>

          <Col lg={7}>
            {selected && (
              <ParkingSlotPanel
                selected={selected}
                floors={floors}
                floor={floor}
                onFloorChange={(value) => { setFloor(value); setSelectedSlot(null) }}
                currentFloor={currentFloor}
                selectedSlot={selectedSlot}
                onSelectSlot={setSelectedSlot}
                onBook={() => {
                   const slotData = currentFloor.rawSlots?.find(s => {
                     const name = s.slotName || s.slotNumber || s.label
                     return name === selectedSlot
                   })
                   navigate('/booking', {
                     state: {
                       ...selected,
                       slot: selectedSlot,
                       slotId: slotData?.id,
                       floor,
                       scannedQrCode,
                       apiResult,
                     },
                   })
                }}
              />
            )}
          </Col>
        </Row>
      </Container>
    </div>
  )
}
