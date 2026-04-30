import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Container, Row, Col, Card, Badge, Button, ProgressBar, Alert } from 'react-bootstrap'
import './SwapPage.css'

const CDN = 'https://storage.googleapis.com/parkfinderbucket'

const PARKINGS = [
  { id:1, name:'Jurusan Teknik Elektro Universitas Lampung', occupancy:78, slots:'4/5 Kosong',       distance:'0.3 km', tag:'Tersedia', tagClass:'green',  address:'Jl. Prof. Soemantri Brojonegoro, Bandar Lampung' },
  { id:2, name:'Mall Boemi Kedaton',                          occupancy:81, slots:'635/1384 Kosong', distance:'1.2 km', tag:'Ramai',    tagClass:'orange', address:'Jl. Z.A. Pagar Alam, Bandar Lampung' },
  { id:3, name:'Lampung City Mall',                           occupancy:81, slots:'635/1384 Kosong', distance:'2.1 km', tag:'Ramai',    tagClass:'orange', address:'Jl. Hayam Wuruk, Bandar Lampung' },
  { id:4, name:'Pasar Bambu Kuning',                          occupancy:45, slots:'120/220 Kosong',  distance:'0.8 km', tag:'Tersedia', tagClass:'green',  address:'Jl. Imam Bonjol, Bandar Lampung' },
  { id:5, name:'Stasiun Tanjungkarang',                       occupancy:55, slots:'90/200 Kosong',   distance:'1.8 km', tag:'Tersedia', tagClass:'green',  address:'Jl. Kepodang, Bandar Lampung' },
]

const FLOORS = [
  { id:'B1', slots:['B1-01','B1-02','B1-03','B1-04','B1-05','B1-06'], available:[true,true,false,true,false,true] },
  { id:'L1', slots:['A01','A02','A03','A04','A05','A06','A07','A08'], available:[false,true,false,false,true,true,false,true] },
  { id:'L2', slots:['B01','B02','B03','B04','B05','B06'],             available:[true,false,true,true,false,true] },
]

const SWAP_STEPS = ['Pilih Slot Baru', 'Konfirmasi Tukar', 'Selesai']

export default function SwapPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const booking  = location.state  // { ticketCode, name, plate, phone, parking }

  const [step, setStep]               = useState(0)
  const [selectedParking, setSelectedParking] = useState(null)
  const [floor, setFloor]             = useState('L1')
  const [newSlot, setNewSlot]         = useState(null)
  const [swapping, setSwapping]       = useState(false)
  const [newTicketCode]               = useState(`PKF-SW-${Date.now().toString(36).toUpperCase().slice(-6)}`)

  // Redirect if no booking data
  if (!booking) {
    return (
      <div style={{ paddingTop: 86, minHeight:'100vh' }}>
        <Container className="py-5 text-center">
          <div style={{ fontSize: 56, marginBottom: 16 }}>⚠️</div>
          <h3 style={{ color:'var(--pf-text)' }}>Tidak Ada Booking Aktif</h3>
          <p className="mb-4">Anda perlu melakukan booking terlebih dahulu untuk menggunakan fitur tukar slot.</p>
          <Button className="btn-pf-primary btn" onClick={() => navigate('/parking')}>
            Booking Sekarang
          </Button>
        </Container>
      </div>
    )
  }

  const currentFloor = FLOORS.find(f => f.id === floor) || FLOORS[1]
  const progressVariant = (occ) => occ >= 90 ? 'danger' : occ >= 75 ? 'warning' : 'info'

  const handleConfirmSwap = () => {
    setSwapping(true)
    setTimeout(() => {
      setSwapping(false)
      setStep(2)
    }, 1600)
  }

  return (
    <div style={{ paddingTop: 86, minHeight:'100vh' }}>
      <Container className="py-4">

        {/* Header */}
        <div className="d-flex align-items-center gap-3 mb-2">
          <Button variant="link" className="p-0 text-muted-pf" style={{ fontSize:20, textDecoration:'none' }}
            onClick={() => navigate(-1)}>←</Button>
          <div>
            <h1 className="fw-bold mb-0" style={{ color:'var(--pf-text)', fontSize:28 }}>Tukar Slot Parkir</h1>
            <p className="mb-0" style={{ fontSize:14 }}>Ganti slot parkir Anda ke lokasi yang diinginkan</p>
          </div>
        </div>

        {/* Current Booking Badge */}
        <Alert className="swap-current-alert mb-4" style={{ background:'rgba(0,210,255,0.07)', border:'1.5px solid var(--pf-border2)', borderRadius:12 }}>
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
            <div>
              <div style={{ fontSize:12, color:'var(--pf-text2)', marginBottom:4 }}>SLOT AKTIF SEKARANG</div>
              <div style={{ fontWeight:700, color:'var(--pf-text)', fontSize:15 }}>
                {booking.parking?.name}
              </div>
              <div style={{ fontSize:13, color:'var(--pf-text2)' }}>
                {booking.parking?.floor} / {booking.parking?.slot} · {booking.name} · {booking.plate}
              </div>
            </div>
            <Badge className="badge-pf-blue px-3 py-2" style={{ fontSize:12 }}>
              🎫 {booking.ticketCode}
            </Badge>
          </div>
        </Alert>

        {/* Stepper */}
        <div className="pf-stepper mb-4">
          {SWAP_STEPS.map((s, i) => (
            <div key={i} className={`pf-step ${i <= step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
              <div className="pf-step-circle">{i < step ? '✓' : i + 1}</div>
              <span className="pf-step-label">{s}</span>
              {i < SWAP_STEPS.length - 1 && <div className="pf-step-line" />}
            </div>
          ))}
        </div>

        {/* ── STEP 0: Pilih Slot Baru ── */}
        {step === 0 && (
          <Row className="g-4 animate-fade-up">
            {/* Parking list */}
            <Col lg={5}>
              <Card className="h-100">
                <Card.Header className="d-flex justify-content-between align-items-center bg-pf-card2 border-pf">
                  <span style={{ fontWeight:700, color:'var(--pf-text)' }}>Pilih Gedung Tujuan</span>
                  <Badge className="badge-pf-blue">{PARKINGS.length} lokasi</Badge>
                </Card.Header>
                <div style={{ overflowY:'auto', maxHeight:520 }}>
                  {PARKINGS.map(p => {
                    const isCurrent = booking.parking?.name === p.name
                    return (
                      <div
                        key={p.id}
                        className={`swap-list-item ${selectedParking?.id === p.id ? 'item-selected' : ''} ${isCurrent ? 'item-current' : ''}`}
                        onClick={() => !isCurrent && (setSelectedParking(p), setNewSlot(null))}
                      >
                        <div className="d-flex justify-content-between align-items-start mb-1">
                          <div>
                            <div className="item-name">{p.name}</div>
                            <small style={{ color:'var(--pf-text3)' }}>{p.address}</small>
                          </div>
                          <div className="d-flex flex-column align-items-end gap-1 ms-2">
                            <Badge className={`badge-pf-${p.tagClass}`}>{p.tag}</Badge>
                            {isCurrent && <Badge className="badge-pf-blue" style={{ fontSize:10 }}>Saat ini</Badge>}
                          </div>
                        </div>
                        <ProgressBar now={p.occupancy} variant={progressVariant(p.occupancy)} style={{ height:5, margin:'8px 0' }} />
                        <div className="d-flex justify-content-between">
                          <small style={{ color:'var(--pf-text2)' }}>{p.slots}</small>
                          <small style={{ color:'var(--pf-text2)' }}>{p.distance}</small>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>
            </Col>

            {/* Slot picker */}
            <Col lg={7}>
              <Card className="h-100">
                {!selectedParking ? (
                  <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center" style={{ minHeight:420 }}>
                    <div style={{ fontSize:52, marginBottom:12, opacity:0.35 }}>🔄</div>
                    <h5 style={{ color:'var(--pf-text)' }}>Pilih Gedung Tujuan</h5>
                    <p style={{ maxWidth:260, fontSize:14 }}>
                      Klik gedung di sebelah kiri untuk melihat slot yang bisa dituju
                    </p>
                  </Card.Body>
                ) : (
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h6 style={{ color:'var(--pf-text)', marginBottom:4 }}>{selectedParking.name}</h6>
                        <small style={{ color:'var(--pf-text3)' }}>{selectedParking.address}</small>
                      </div>
                      <Badge className={`badge-pf-${selectedParking.tagClass}`}>{selectedParking.tag}</Badge>
                    </div>

                    {/* Floor tabs */}
                    <div className="d-flex gap-2 mb-3 flex-wrap">
                      {FLOORS.map(f => (
                        <Button
                          key={f.id}
                          size="sm"
                          className={f.id === floor ? 'btn-pf-primary btn' : 'btn-pf-ghost btn'}
                          onClick={() => { setFloor(f.id); setNewSlot(null) }}
                        >
                          {f.id}
                        </Button>
                      ))}
                    </div>

                    {/* Legend */}
                    <div className="d-flex gap-4 mb-3">
                      {[['#4CAF50','Tersedia'],['#EF5350','Terisi'],['#00D2FF','Dipilih']].map(([c,l]) => (
                        <span key={l} className="d-flex align-items-center gap-1" style={{ fontSize:13, color:'var(--pf-text2)' }}>
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
                            className={`slot-btn w-100 ${!currentFloor.available[i] ? 'slot-taken' : ''} ${newSlot === slot ? 'slot-picked' : ''}`}
                            onClick={() => currentFloor.available[i] && setNewSlot(slot)}
                            disabled={!currentFloor.available[i]}
                          >
                            {slot}
                          </button>
                        </Col>
                      ))}
                    </Row>

                    {/* Action */}
                    {newSlot && (
                      <div className="slot-action-box">
                        <div className="swap-preview">
                          <div className="swap-preview-item">
                            <span style={{ fontSize:11, color:'var(--pf-text3)', display:'block', marginBottom:4 }}>DARI</span>
                            <span style={{ fontWeight:700, color:'var(--pf-text)', fontSize:14 }}>
                              {booking.parking?.floor} / {booking.parking?.slot}
                            </span>
                            <small style={{ display:'block', color:'var(--pf-text3)', fontSize:11 }}>{booking.parking?.name}</small>
                          </div>
                          <div className="swap-arrow">→</div>
                          <div className="swap-preview-item">
                            <span style={{ fontSize:11, color:'var(--pf-text3)', display:'block', marginBottom:4 }}>KE</span>
                            <span style={{ fontWeight:700, color:'var(--pf-accent)', fontSize:14 }}>
                              {floor} / {newSlot}
                            </span>
                            <small style={{ display:'block', color:'var(--pf-text3)', fontSize:11 }}>{selectedParking.name}</small>
                          </div>
                        </div>
                        <Button
                          className="btn-pf-primary btn w-100 mt-3"
                          onClick={() => setStep(1)}
                        >
                          Lanjut Konfirmasi Tukar →
                        </Button>
                      </div>
                    )}
                  </Card.Body>
                )}
              </Card>
            </Col>
          </Row>
        )}

        {/* ── STEP 1: Konfirmasi Tukar ── */}
        {step === 1 && (
          <Row className="justify-content-center animate-fade-up">
            <Col lg={7}>
              <Card>
                <Card.Body className="p-4">
                  <h5 className="mb-4" style={{ color:'var(--pf-text)' }}>Konfirmasi Tukar Slot</h5>

                  {/* Slot comparison */}
                  <div className="swap-compare-box mb-4">
                    <div className="swap-compare-side">
                      <div className="swap-compare-label">Slot Lama</div>
                      <div className="swap-compare-slot old">
                        <div className="sc-building">{booking.parking?.name}</div>
                        <div className="sc-slot">{booking.parking?.floor} / {booking.parking?.slot}</div>
                      </div>
                    </div>
                    <div className="swap-compare-arrow">🔄</div>
                    <div className="swap-compare-side">
                      <div className="swap-compare-label">Slot Baru</div>
                      <div className="swap-compare-slot new">
                        <div className="sc-building">{selectedParking?.name}</div>
                        <div className="sc-slot">{floor} / {newSlot}</div>
                      </div>
                    </div>
                  </div>

                  {/* User info */}
                  {[
                    ['Pemesan', booking.name],
                    ['Plat', booking.plate],
                    ['No. HP', booking.phone],
                    ['Kode Tiket Lama', booking.ticketCode],
                  ].map(([k,v]) => (
                    <div key={k} className="d-flex justify-content-between py-2 border-bottom border-pf gap-3">
                      <span style={{ color:'var(--pf-text2)', fontSize:14 }}>{k}</span>
                      <span style={{ color:'var(--pf-text)', fontWeight:600, fontSize:14, textAlign:'right', maxWidth:260 }}>{v}</span>
                    </div>
                  ))}

                  <Alert className="mt-3" style={{ background:'rgba(255,167,38,0.08)', border:'1px solid rgba(255,167,38,0.3)', borderRadius:10, padding:'12px 16px' }}>
                    <small style={{ color:'var(--pf-orange)' }}>
                      ⚠️ Setelah konfirmasi, slot lama akan dilepas dan tiket baru diterbitkan secara otomatis.
                    </small>
                  </Alert>

                  <div className="d-flex gap-3 justify-content-end mt-4">
                    <Button className="btn-pf-ghost btn" onClick={() => setStep(0)}>← Kembali</Button>
                    <Button
                      className="btn-pf-primary btn"
                      onClick={handleConfirmSwap}
                      disabled={swapping}
                    >
                      {swapping ? (
                        <span className="d-flex align-items-center gap-2">
                          <span className="mini-spinner" /> Memproses...
                        </span>
                      ) : '✅ Konfirmasi Tukar Slot'}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* ── STEP 2: Selesai ── */}
        {step === 2 && (
          <Row className="justify-content-center animate-fade-up">
            <Col lg={6}>
              <Card className="text-center shadow-glow">
                <Card.Body className="p-5">
                  <div style={{ fontSize:64, marginBottom:16 }}>🔄</div>
                  <h3 style={{ color:'var(--pf-text)' }}>Tukar Slot Berhasil!</h3>
                  <p className="mb-4">Slot parkir Anda telah berhasil ditukar. Tiket baru telah diterbitkan.</p>

                  <div className="ticket-box mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <img
                        src={`${CDN}/foto/logo.png`}
                        alt="ParkFinder"
                        style={{ height:28, width:'auto', objectFit:'contain' }}
                        onError={e => { e.target.style.display='none' }}
                      />
                      <Badge className="badge-pf-green px-2 py-1">Aktif</Badge>
                    </div>
                    <div className="ticket-code">{newTicketCode}</div>
                    <div className="pf-divider" />

                    {/* Old → New comparison */}
                    <div className="swap-result-compare mb-3">
                      <div className="src-side">
                        <small style={{ color:'var(--pf-text3)', fontSize:10 }}>DARI</small>
                        <div style={{ color:'var(--pf-text2)', fontWeight:600, fontSize:13 }}>
                          {booking.parking?.floor} / {booking.parking?.slot}
                        </div>
                        <div style={{ fontSize:11, color:'var(--pf-text3)' }}>{booking.parking?.name}</div>
                      </div>
                      <div style={{ fontSize:18, color:'var(--pf-accent)', fontWeight:700 }}>→</div>
                      <div className="src-side">
                        <small style={{ color:'var(--pf-text3)', fontSize:10 }}>KE</small>
                        <div style={{ color:'var(--pf-accent)', fontWeight:700, fontSize:13 }}>
                          {floor} / {newSlot}
                        </div>
                        <div style={{ fontSize:11, color:'var(--pf-text3)' }}>{selectedParking?.name}</div>
                      </div>
                    </div>

                    {[
                      ['Nama',  booking.name],
                      ['Plat',  booking.plate],
                    ].map(([k,v]) => (
                      <div key={k} className="d-flex justify-content-between mb-2">
                        <small style={{ color:'var(--pf-text2)' }}>{k}</small>
                        <small style={{ color:'var(--pf-text)', fontWeight:600 }}>{v}</small>
                      </div>
                    ))}
                    <div className="qr-box mt-3">
                      <span style={{ fontSize:40 }}>📱</span>
                      <p style={{ margin:0, fontSize:13, color:'var(--pf-text3)' }}>Scan QR baru saat tiba di slot tujuan</p>
                    </div>
                  </div>

                  <div className="d-flex gap-3 justify-content-center flex-wrap">
                    <Button className="btn-pf-outline btn" onClick={() => navigate('/parking')}>Cari Parkir Lain</Button>
                    <Button className="btn-pf-primary btn" onClick={() => navigate('/')}>Ke Beranda</Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  )
}
