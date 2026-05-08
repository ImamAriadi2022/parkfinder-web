import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap'
import { getBookings, expireBooking } from '../utils/bookingStore'
import './MyBookingPage.css'

const CDN = 'https://storage.googleapis.com/parkfinderbucket'

export default function MyBookingPage() {
  const navigate  = useNavigate()
  const [bookings, setBookings] = useState([])
  const [filter, setFilter]     = useState('active') // 'active' | 'all'

  const reload = () => setBookings(getBookings())

  useEffect(() => { reload() }, [])

  const displayed = filter === 'active'
    ? bookings.filter(b => !b.expired)
    : bookings

  const activeCount   = bookings.filter(b => !b.expired).length
  const expiredCount  = bookings.filter(b => b.expired).length

  const fmtDate = (iso) => {
    if (!iso) return '—'
    const d = new Date(iso)
    return d.toLocaleDateString('id-ID', { day:'2-digit', month:'short', year:'numeric' }) +
      ' ' + d.toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit' })
  }

  const handleExpire = (ticketCode) => {
    expireBooking(ticketCode)
    reload()
  }

  return (
    <div style={{ paddingTop: 86, minHeight:'100vh' }}>
      <Container className="py-4">

        {/* Header */}
        <div className="d-flex align-items-start justify-content-between flex-wrap gap-3 mb-4">
          <div>
            <h1 className="fw-bold mb-1" style={{ color:'var(--pf-text)', fontSize:28 }}>Parkiran Aktif</h1>
            <p className="mb-0">Kelola semua booking parkir Anda</p>
          </div>
          <Button className="btn-pf-primary btn btn-sm" onClick={() => navigate('/parking')}>
            + Booking Baru
          </Button>
        </div>

        {/* Stats bar */}
        <Row className="g-3 mb-4">
          {[
            { label:'Aktif',    value: activeCount,  color:'var(--pf-accent)',  bg:'rgba(0,210,255,0.08)',  border:'var(--pf-border2)' },
            { label:'Selesai',  value: expiredCount, color:'var(--pf-text3)',   bg:'transparent',           border:'var(--pf-border)'  },
            { label:'Total',    value: bookings.length, color:'var(--pf-text)', bg:'transparent',           border:'var(--pf-border)'  },
          ].map(s => (
            <Col xs={4} key={s.label}>
              <div className="stat-card" style={{ background:s.bg, borderColor:s.border }}>
                <div className="stat-card-value" style={{ color:s.color }}>{s.value}</div>
                <div className="stat-card-label">{s.label}</div>
              </div>
            </Col>
          ))}
        </Row>

        {/* Filter tabs */}
        <div className="d-flex gap-2 mb-4">
          {[['active','Aktif'],['all','Semua']].map(([v,l]) => (
            <Button
              key={v}
              size="sm"
              className={filter === v ? 'btn-pf-primary btn' : 'btn-pf-ghost btn'}
              onClick={() => setFilter(v)}
            >
              {l}
              <Badge className={`ms-2 ${filter === v ? '' : 'badge-pf-blue'}`} bg={filter === v ? 'light' : ''} style={{ color: filter === v ? 'var(--pf-accent)' : undefined }}>
                {v === 'active' ? activeCount : bookings.length}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Empty state */}
        {displayed.length === 0 && (
          <Card className="text-center py-5">
            <Card.Body>
              <div style={{ fontSize:52, marginBottom:16 }}>🅿️</div>
              <h5 style={{ color:'var(--pf-text)' }}>
                {filter === 'active' ? 'Tidak ada parkiran aktif' : 'Belum ada riwayat booking'}
              </h5>
              <p className="mb-4">
                {filter === 'active'
                  ? 'Booking parkir terlebih dahulu untuk melihat tiket aktif Anda.'
                  : 'Semua booking yang pernah Anda lakukan akan muncul di sini.'}
              </p>
              <Button className="btn-pf-primary btn" onClick={() => navigate('/parking')}>
                Booking Sekarang
              </Button>
            </Card.Body>
          </Card>
        )}

        {/* Booking cards */}
        <div className="d-flex flex-column gap-3">
          {displayed.map((b, i) => (
            <Card
              key={b.ticketCode}
              className={`booking-card animate-fade-up ${b.expired ? 'booking-card-expired' : 'booking-card-active'}`}
              style={{ animationDelay:`${i * 0.07}s` }}
            >
              <Card.Body className="p-4">
                <Row className="align-items-start g-3">

                  {/* Left: logo + code */}
                  <Col xs={12} md={4}>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <img
                        src={`${CDN}/foto/logo.png`}
                        alt="ParkFinder"
                        style={{ height:22, width:'auto', objectFit:'contain', ...(b.expired ? { filter:'grayscale(1)', opacity:0.5 } : {}) }}
                        onError={e => { e.target.style.display='none' }}
                      />
                      <Badge className={b.expired ? 'badge-expired' : 'badge-pf-green'}>
                        {b.expired ? 'Tidak Aktif' : 'Aktif'}
                      </Badge>
                    </div>
                    <div className={`booking-code ${b.expired ? 'booking-code-expired' : ''}`}>
                      {b.ticketCode}
                    </div>
                    <small style={{ color:'var(--pf-text3)', fontSize:11 }}>
                      Dibooking: {fmtDate(b.savedAt)}
                    </small>
                  </Col>

                  {/* Middle: details */}
                  <Col xs={12} md={5}>
                    <div className="booking-detail-grid">
                      {[
                        ['Pemesan', b.name],
                        ['Plat',    b.plate],
                        ['Gedung',  b.parking?.name],
                        ['Slot',    `${b.parking?.floor} / ${b.parking?.slot}`],
                      ].map(([k, v]) => (
                        <div key={k} className="bd-item">
                          <span className="bd-key">{k}</span>
                          <span className="bd-val">{v || '—'}</span>
                        </div>
                      ))}
                    </div>
                    {b.expired && b.expiredAt && (
                      <small style={{ color:'var(--pf-red)', fontSize:11, marginTop:6, display:'block' }}>
                        ⏹ Keluar: {fmtDate(b.expiredAt)}
                      </small>
                    )}
                  </Col>

                  {/* Right: actions */}
                  {!b.expired && (
                    <Col xs={12} md={3} className="d-flex flex-column gap-2">
                      <Button
                        size="sm"
                        className="btn-pf-outline btn w-100"
                        onClick={() => navigate('/swap', { state: { ticketCode: b.ticketCode, name: b.name, plate: b.plate, phone: b.phone, parking: b.parking } })}
                      >
                        🔄 Tukar Slot
                      </Button>
                      <Button
                        size="sm"
                        className="btn btn-danger-pf w-100"
                        onClick={() => navigate('/checkout', { state: { ticketCode: b.ticketCode, name: b.name, plate: b.plate, phone: b.phone, parking: b.parking } })}
                      >
                        🚗 Keluar Parkir
                      </Button>
                    </Col>
                  )}
                </Row>
              </Card.Body>
            </Card>
          ))}
        </div>

      </Container>
    </div>
  )
}
