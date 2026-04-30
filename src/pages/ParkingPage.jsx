import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Card, Badge, Button, InputGroup, Form, ProgressBar } from 'react-bootstrap'
import './ParkingPage.css'

const PARKINGS = [
  { id:1, name:'Jurusan Teknik Elektro Universitas Lampung', occupancy:78, slots:'4/5 Kosong',       distance:'0.3 km', price:'Rp 3.000/jam', price_num:3000,  tag:'Tersedia', tagClass:'green', address:'Jl. Prof. Soemantri Brojonegoro, Bandar Lampung' },
  { id:2, name:'Mall Boemi Kedaton',                          occupancy:81, slots:'635/1384 Kosong', distance:'1.2 km', price:'Rp 5.000/jam', price_num:5000,  tag:'Ramai',    tagClass:'orange',address:'Jl. Z.A. Pagar Alam, Bandar Lampung' },
  { id:3, name:'Lampung City Mall',                           occupancy:81, slots:'635/1384 Kosong', distance:'2.1 km', price:'Rp 5.000/jam', price_num:5000,  tag:'Ramai',    tagClass:'orange',address:'Jl. Hayam Wuruk, Bandar Lampung' },
  { id:4, name:'Pasar Bambu Kuning',                          occupancy:45, slots:'120/220 Kosong',  distance:'0.8 km', price:'Rp 2.000/jam', price_num:2000,  tag:'Tersedia', tagClass:'green', address:'Jl. Imam Bonjol, Bandar Lampung' },
  { id:5, name:'RSUD Abdul Moeloek',                          occupancy:92, slots:'18/220 Kosong',   distance:'3.2 km', price:'Rp 3.000/jam', price_num:3000,  tag:'Penuh',    tagClass:'red',   address:'Jl. Dr. Rivai, Bandar Lampung' },
  { id:6, name:'Stasiun Tanjungkarang',                       occupancy:55, slots:'90/200 Kosong',   distance:'1.8 km', price:'Rp 4.000/jam', price_num:4000,  tag:'Tersedia', tagClass:'green', address:'Jl. Kepodang, Bandar Lampung' },
]

const FLOORS = [
  { id:'B1', slots:['B1-01','B1-02','B1-03','B1-04','B1-05','B1-06'], available:[true,true,false,true,false,true] },
  { id:'L1', slots:['A01','A02','A03','A04','A05','A06','A07','A08'], available:[false,true,false,false,true,true,false,true] },
  { id:'L2', slots:['B01','B02','B03','B04','B05','B06'],             available:[true,false,true,true,false,true] },
]

export default function ParkingPage() {
  const navigate = useNavigate()
  const [search, setSearch]         = useState('')
  const [selected, setSelected]     = useState(null)
  const [floor, setFloor]           = useState('L1')
  const [selectedSlot, setSelectedSlot] = useState(null)

  const filtered = PARKINGS.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
  const currentFloor = FLOORS.find(f => f.id === floor) || FLOORS[1]

  const progressVariant = (occ) => occ >= 90 ? 'danger' : occ >= 75 ? 'warning' : 'info'

  return (
    <div style={{ paddingTop: 86, minHeight: '100vh' }}>
      <Container className="py-4">
        <h1 className="fw-bold mb-1" style={{ color: 'var(--pf-text)' }}>Cari Gedung Parkir</h1>
        <p className="mb-4">Temukan slot parkir tersedia di sekitar Anda</p>

        {/* Search */}
        <InputGroup className="mb-4">
          <InputGroup.Text>🔍</InputGroup.Text>
          <Form.Control
            placeholder="Cari nama gedung parkir..."
            value={search}
            onChange={e => { setSearch(e.target.value); setSelected(null); setSelectedSlot(null) }}
          />
          {search && (
            <Button variant="outline-secondary" className="border-pf" onClick={() => setSearch('')}>✕</Button>
          )}
        </InputGroup>

        <Row className="g-4">
          {/* ── List Panel ── */}
          <Col lg={5}>
            <Card className="h-100">
              <Card.Header className="d-flex justify-content-between align-items-center bg-pf-card2 border-pf">
                <span style={{ fontWeight: 700, color: 'var(--pf-text)' }}>Gedung Tersedia</span>
                <Badge className="badge-pf-blue">{filtered.length} lokasi</Badge>
              </Card.Header>
              <div style={{ overflowY: 'auto', maxHeight: 580 }}>
                {filtered.length === 0 ? (
                  <div className="text-center py-5">
                    <span style={{ fontSize: 40 }}>🔍</span>
                    <p className="mt-2">Tidak ditemukan: "{search}"</p>
                  </div>
                ) : filtered.map(p => (
                  <div
                    key={p.id}
                    className={`parking-list-item ${selected?.id === p.id ? 'item-selected' : ''} ${p.occupancy >= 90 ? 'item-disabled' : ''}`}
                    onClick={() => p.occupancy < 90 && (setSelected(p), setSelectedSlot(null))}
                  >
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <div>
                        <div className="item-name">{p.name}</div>
                        <small style={{ color: 'var(--pf-text3)' }}>{p.address}</small>
                      </div>
                      <Badge className={`badge-pf-${p.tagClass} ms-2 flex-shrink-0`}>{p.tag}</Badge>
                    </div>
                    <ProgressBar now={p.occupancy} variant={progressVariant(p.occupancy)} style={{ height: 5, margin: '8px 0' }} />
                    <div className="d-flex justify-content-between">
                      <small style={{ color: 'var(--pf-text2)' }}>{p.slots}</small>
                      <small style={{ color: 'var(--pf-text2)' }}>{p.distance} · {p.price}</small>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </Col>

          {/* ── Slot Panel ── */}
          <Col lg={7}>
            <Card className="h-100">
              {!selected ? (
                <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center" style={{ minHeight: 420 }}>
                  <div style={{ fontSize: 60, marginBottom: 16 }}>🏢</div>
                  <h5 style={{ color: 'var(--pf-text)' }}>Pilih Gedung Parkir</h5>
                  <p style={{ maxWidth: 280 }}>Klik gedung di sebelah kiri untuk melihat slot yang tersedia</p>
                </Card.Body>
              ) : (
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h6 style={{ color: 'var(--pf-text)', marginBottom: 4 }}>{selected.name}</h6>
                      <small style={{ color: 'var(--pf-text3)' }}>{selected.address}</small>
                    </div>
                    <Badge className={`badge-pf-${selected.tagClass}`}>{selected.tag}</Badge>
                  </div>

                  {/* Floor tabs */}
                  <div className="d-flex gap-2 mb-3 flex-wrap">
                    {FLOORS.map(f => (
                      <Button
                        key={f.id}
                        size="sm"
                        className={f.id === floor ? 'btn-pf-primary btn' : 'btn-pf-ghost btn'}
                        onClick={() => { setFloor(f.id); setSelectedSlot(null) }}
                      >
                        {f.id}
                      </Button>
                    ))}
                  </div>

                  {/* Legend */}
                  <div className="d-flex gap-4 mb-3">
                    {[['#4CAF50','Tersedia'],['#EF5350','Terisi'],['#00D2FF','Dipilih']].map(([c,l]) => (
                      <span key={l} className="d-flex align-items-center gap-1" style={{ fontSize: 13, color: 'var(--pf-text2)' }}>
                        <span style={{ width:12,height:12,background:c,borderRadius:3,display:'inline-block' }} />
                        {l}
                      </span>
                    ))}
                  </div>

                  {/* Slots */}
                  <Row className="g-2 mb-4">
                    {currentFloor.slots.map((slot, i) => (
                      <Col xs={4} sm={3} key={slot}>
                        <button
                          className={`slot-btn w-100 ${!currentFloor.available[i] ? 'slot-taken' : ''} ${selectedSlot === slot ? 'slot-picked' : ''}`}
                          onClick={() => currentFloor.available[i] && setSelectedSlot(slot)}
                          disabled={!currentFloor.available[i]}
                        >
                          {slot}
                        </button>
                      </Col>
                    ))}
                  </Row>

                  {/* Book action */}
                  {selectedSlot && (
                    <div className="slot-action-box">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span style={{ fontSize: 14, color: 'var(--pf-text2)' }}>Slot dipilih:</span>
                        <strong style={{ color: 'var(--pf-accent)', fontSize: 16 }}>{selectedSlot} – {floor}</strong>
                      </div>
                      <Button
                        className="btn-pf-primary btn w-100"
                        onClick={() => navigate('/booking', { state: { ...selected, slot: selectedSlot, floor } })}
                      >
                        Pesan Sekarang
                      </Button>
                    </div>
                  )}
                </Card.Body>
              )}
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
