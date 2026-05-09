import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Col, Container, Row } from 'react-bootstrap'
import ParkingHeader from '../components/pages/ParkingPage/ParkingHeader'
import ParkingList from '../components/pages/ParkingPage/ParkingList'
import ParkingSearch from '../components/pages/ParkingPage/ParkingSearch'
import ParkingSlotPanel from '../components/pages/ParkingPage/ParkingSlotPanel'
import '../styles/pages/ParkingPage.css'

const PARKINGS = [
  { id: 1, name: 'Jurusan Teknik Elektro Universitas Lampung', occupancy: 78, slots: '4/5 Kosong', distance: '0.3 km', tag: 'Tersedia', tagClass: 'green', address: 'Jl. Prof. Soemantri Brojonegoro, Bandar Lampung' },
  { id: 2, name: 'Mall Boemi Kedaton', occupancy: 81, slots: '635/1384 Kosong', distance: '1.2 km', tag: 'Ramai', tagClass: 'orange', address: 'Jl. Z.A. Pagar Alam, Bandar Lampung' },
  { id: 3, name: 'Lampung City Mall', occupancy: 81, slots: '635/1384 Kosong', distance: '2.1 km', tag: 'Ramai', tagClass: 'orange', address: 'Jl. Hayam Wuruk, Bandar Lampung' },
  { id: 4, name: 'Pasar Bambu Kuning', occupancy: 45, slots: '120/220 Kosong', distance: '0.8 km', tag: 'Tersedia', tagClass: 'green', address: 'Jl. Imam Bonjol, Bandar Lampung' },
  { id: 5, name: 'RSUD Abdul Moeloek', occupancy: 92, slots: '18/220 Kosong', distance: '3.2 km', tag: 'Penuh', tagClass: 'red', address: 'Jl. Dr. Rivai, Bandar Lampung' },
  { id: 6, name: 'Stasiun Tanjungkarang', occupancy: 55, slots: '90/200 Kosong', distance: '1.8 km', tag: 'Tersedia', tagClass: 'green', address: 'Jl. Kepodang, Bandar Lampung' },
]

const FLOORS = [
  { id: 'B1', slots: ['B1-01', 'B1-02', 'B1-03', 'B1-04', 'B1-05', 'B1-06'], available: [true, true, false, true, false, true] },
  { id: 'L1', slots: ['A01', 'A02', 'A03', 'A04', 'A05', 'A06', 'A07', 'A08'], available: [false, true, false, false, true, true, false, true] },
  { id: 'L2', slots: ['B01', 'B02', 'B03', 'B04', 'B05', 'B06'], available: [true, false, true, true, false, true] },
]

export default function ParkingPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [floor, setFloor] = useState('L1')
  const [selectedSlot, setSelectedSlot] = useState(null)

  const filtered = PARKINGS.filter(parking => parking.name.toLowerCase().includes(search.toLowerCase()))
  const currentFloor = FLOORS.find(item => item.id === floor) || FLOORS[1]

  const handleSearch = (value) => {
    setSearch(value)
    setSelected(null)
    setSelectedSlot(null)
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
                if (parking.occupancy < 90) {
                  setSelected(parking)
                  setSelectedSlot(null)
                }
              }}
            />
          </Col>

          <Col lg={7}>
            <ParkingSlotPanel
              selected={selected}
              floors={FLOORS}
              floor={floor}
              onFloorChange={(value) => { setFloor(value); setSelectedSlot(null) }}
              currentFloor={currentFloor}
              selectedSlot={selectedSlot}
              onSelectSlot={setSelectedSlot}
              onBook={() => navigate('/booking', { state: { ...selected, slot: selectedSlot, floor } })}
            />
          </Col>
        </Row>
      </Container>
    </div>
  )
}
