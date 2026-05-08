import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Container, Row, Col, Card, Badge, Button, Alert } from 'react-bootstrap'
import { expireBooking } from '../utils/bookingStore'
import './CheckoutPage.css'

const CDN = 'https://storage.googleapis.com/parkfinderbucket'

const CHECKOUT_STEPS = ['Konfirmasi Keluar', 'Selesai']

export default function CheckoutPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const booking  = location.state  // { ticketCode, name, plate, phone, parking }

  const [step, setStep]           = useState(0)
  const [processing, setProcessing] = useState(false)
  const [checkoutTime]            = useState(new Date())

  // Guard: no booking
  if (!booking) {
    return (
      <div style={{ paddingTop: 86, minHeight:'100vh' }}>
        <Container className="py-5 text-center">
          <div style={{ fontSize: 56, marginBottom: 16 }}>⚠️</div>
          <h3 style={{ color:'var(--pf-text)' }}>Tidak Ada Tiket Aktif</h3>
          <p className="mb-4">Anda tidak memiliki tiket parkir aktif untuk diproses.</p>
          <Button className="btn-pf-primary btn" onClick={() => navigate('/')}>Ke Beranda</Button>
        </Container>
      </div>
    )
  }

  const handleCheckout = () => {
    setProcessing(true)
    setTimeout(() => {
      expireBooking(booking.ticketCode)
      setProcessing(false)
      setStep(1)
    }, 2000)
  }

  const fmtTime = (d) => d.toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit', second:'2-digit' })
  const fmtDate = (d) => d.toLocaleDateString('id-ID', { day:'2-digit', month:'long', year:'numeric' })

  return (
    <div style={{ paddingTop: 86, minHeight:'100vh' }}>
      <Container className="py-4">

        {/* Header */}
        <div className="d-flex align-items-center gap-3 mb-4">
          {step === 0 && (
            <Button variant="link" className="p-0 text-muted-pf" style={{ fontSize:20, textDecoration:'none' }}
              onClick={() => navigate(-1)}>←</Button>
          )}
          <div>
            <h1 className="fw-bold mb-0" style={{ color:'var(--pf-text)', fontSize:28 }}>Keluar Parkir</h1>
            <p className="mb-0" style={{ fontSize:14 }}>
              {step === 0 ? 'Konfirmasi untuk menonaktifkan tiket Anda' : 'Tiket parkir telah dinonaktifkan'}
            </p>
          </div>
        </div>

        {/* Stepper */}
        <div className="pf-stepper mb-4">
          {CHECKOUT_STEPS.map((s, i) => (
            <div key={i} className={`pf-step ${i <= step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
              <div className="pf-step-circle">{i < step ? '✓' : i + 1}</div>
              <span className="pf-step-label">{s}</span>
              {i < CHECKOUT_STEPS.length - 1 && <div className="pf-step-line" />}
            </div>
          ))}
        </div>

        {/* ── STEP 0: Konfirmasi ── */}
        {step === 0 && (
          <Row className="justify-content-center animate-fade-up">
            <Col lg={7}>

              {/* Active ticket card */}
              <Card className="mb-4 checkout-ticket-card">
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <img
                      src={`${CDN}/foto/logo.png`}
                      alt="ParkFinder"
                      style={{ height:28, width:'auto', objectFit:'contain' }}
                      onError={e => { e.target.style.display='none' }}
                    />
                    <Badge className="badge-pf-green px-2 py-1">Tiket Aktif</Badge>
                  </div>

                  <div className="checkout-code">{booking.ticketCode}</div>

                  <div className="pf-divider" />

                  <Row className="g-2">
                    {[
                      ['Pemesan', booking.name],
                      ['Nomor Plat', booking.plate],
                      ['Gedung', booking.parking?.name],
                      ['Lantai / Slot', `${booking.parking?.floor} / ${booking.parking?.slot}`],
                    ].map(([k, v]) => (
                      <Col xs={6} key={k}>
                        <div className="checkout-info-cell">
                          <div className="checkout-info-key">{k}</div>
                          <div className="checkout-info-val">{v || '—'}</div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>

              {/* Warning */}
              <Alert className="checkout-warning mb-4">
                <div className="d-flex gap-3 align-items-start">
                  <span style={{ fontSize: 28, flexShrink:0 }}>⚠️</span>
                  <div>
                    <strong style={{ color:'var(--pf-orange)', display:'block', marginBottom:6 }}>
                      Perhatian!
                    </strong>
                    <p style={{ margin:0, fontSize:14, color:'var(--pf-text2)', lineHeight:1.6 }}>
                      Tindakan ini akan <strong style={{ color:'var(--pf-red)' }}>menonaktifkan tiket secara permanen</strong>.
                      Slot parkir Anda akan dilepas dan tidak dapat diaktifkan kembali.
                      Pastikan kendaraan Anda sudah keluar dari area parkir sebelum melanjutkan.
                    </p>
                  </div>
                </div>
              </Alert>

              {/* Checklist */}
              <Card className="mb-4">
                <Card.Body className="p-4">
                  <h6 className="mb-3" style={{ color:'var(--pf-text)' }}>Pastikan sebelum keluar:</h6>
                  {[
                    'Kendaraan sudah keluar dari area parkir',
                    'Tidak ada barang bawaan yang tertinggal di slot',
                    'Gate keluar sudah terbuka',
                  ].map((item, i) => (
                    <div key={i} className="d-flex align-items-center gap-3 mb-3">
                      <div className="checkout-check-icon">✓</div>
                      <span style={{ fontSize:14, color:'var(--pf-text2)' }}>{item}</span>
                    </div>
                  ))}
                </Card.Body>
              </Card>

              {/* Actions */}
              <div className="d-flex gap-3 justify-content-between">
                <Button
                  className="btn-pf-ghost btn"
                  onClick={() => navigate(-1)}
                  disabled={processing}
                >
                  ← Batal
                </Button>
                <Button
                  className="btn btn-danger-pf btn-lg"
                  onClick={handleCheckout}
                  disabled={processing}
                  style={{ flex:1, maxWidth:320 }}
                >
                  {processing ? (
                    <span className="d-flex align-items-center justify-content-center gap-2">
                      <span className="mini-spinner" /> Memproses Keluar...
                    </span>
                  ) : '🚗 Konfirmasi Keluar Parkir'}
                </Button>
              </div>
            </Col>
          </Row>
        )}

        {/* ── STEP 1: Selesai ── */}
        {step === 1 && (
          <Row className="justify-content-center animate-fade-up">
            <Col lg={6}>
              <Card className="text-center">
                <Card.Body className="p-5">

                  {/* Destroyed ticket visual */}
                  <div className="destroyed-ticket-container mb-4">
                    <div className="destroyed-ticket">
                      <div className="destroyed-stripe" />
                      <div className="d-flex justify-content-between align-items-center mb-3 opacity-50">
                        <img
                          src={`${CDN}/foto/logo.png`}
                          alt="ParkFinder"
                          style={{ height:24, width:'auto', objectFit:'contain', filter:'grayscale(1)' }}
                          onError={e => { e.target.style.display='none' }}
                        />
                        <Badge style={{ background:'rgba(239,83,80,0.15)', color:'var(--pf-red)', border:'1px solid rgba(239,83,80,0.3)' }} className="px-2 py-1">
                          Tidak Aktif
                        </Badge>
                      </div>
                      <div className="destroyed-code">{booking.ticketCode}</div>
                      <div className="destroyed-stamp">EXPIRED</div>
                    </div>
                  </div>

                  <h3 className="mb-2" style={{ color:'var(--pf-text)' }}>Berhasil Keluar Parkir</h3>
                  <p className="mb-4" style={{ fontSize:15 }}>
                    Tiket Anda telah dinonaktifkan. Slot parkir sudah dilepas dan tersedia untuk pengguna lain.
                  </p>

                  {/* Summary */}
                  <Card className="mb-4" style={{ textAlign:'left' }}>
                    <Card.Body className="py-3 px-4">
                      {[
                        ['Nama',        booking.name],
                        ['Kendaraan',   booking.plate],
                        ['Lokasi',      booking.parking?.name],
                        ['Slot',        `${booking.parking?.floor} / ${booking.parking?.slot}`],
                        ['Waktu Keluar', fmtTime(checkoutTime)],
                        ['Tanggal',     fmtDate(checkoutTime)],
                      ].map(([k, v]) => (
                        <div key={k} className="d-flex justify-content-between py-2 border-bottom border-pf gap-3">
                          <small style={{ color:'var(--pf-text2)' }}>{k}</small>
                          <small style={{ color:'var(--pf-text)', fontWeight:600, textAlign:'right', maxWidth:220 }}>{v}</small>
                        </div>
                      ))}
                    </Card.Body>
                  </Card>

                  <div className="d-flex gap-3 justify-content-center flex-wrap">
                    <Button className="btn-pf-primary btn" onClick={() => navigate('/parking')}>
                      Booking Parkir Lagi
                    </Button>
                    <Button className="btn-pf-ghost btn" onClick={() => navigate('/')}>
                      Ke Beranda
                    </Button>
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
