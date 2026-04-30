import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Container, Row, Col, Card, Badge, Button, Form, ProgressBar } from 'react-bootstrap'
import './BookingPage.css'

const STEPS = ['Detail Booking', 'Konfirmasi', 'Selesai']

export default function BookingPage() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const parking   = location.state || null

  const [step, setStep]               = useState(0)
  const [form, setForm]               = useState({ name:'', plate:'', phone:'', duration:'2', vehicle:'Mobil' })
  const [errors, setErrors]           = useState({})
  const [payMethod, setPayMethod]     = useState('GoPay')

  const pricePerHour = parking?.price_num || 5000
  const totalPrice   = pricePerHour * parseInt(form.duration)
  const ticketCode   = `PKF-${Date.now().toString(36).toUpperCase().slice(-8)}`

  const validate = () => {
    const e = {}
    if (!form.name.trim())  e.name  = 'Nama wajib diisi'
    if (!form.plate.trim()) e.plate = 'Nomor kendaraan wajib diisi'
    if (!form.phone.trim()) e.phone = 'Nomor HP wajib diisi'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const setField = (k, v) => {
    setForm(f => ({ ...f, [k]: v }))
    if (errors[k]) setErrors(e => ({ ...e, [k]: undefined }))
  }

  const next = () => {
    if (step === 0 && !validate()) return
    if (step < STEPS.length - 1) setStep(s => s + 1)
  }

  return (
    <div style={{ paddingTop: 86, minHeight: '100vh' }}>
      <Container className="py-4">
        <h1 className="fw-bold mb-1" style={{ color: 'var(--pf-text)' }}>Booking Parkir</h1>
        <p className="mb-4">Amankan slot parkir Anda sekarang</p>

        {/* ── Stepper ── */}
        <div className="pf-stepper mb-4">
          {STEPS.map((s, i) => (
            <div key={i} className={`pf-step ${i <= step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
              <div className="pf-step-circle">{i < step ? '✓' : i + 1}</div>
              <span className="pf-step-label">{s}</span>
              {i < STEPS.length - 1 && <div className="pf-step-line" />}
            </div>
          ))}
        </div>

        {/* ── STEP 0: Form ── */}
        {step === 0 && (
          <Row className="g-4 animate-fade-up">
            <Col lg={7}>
              <Card>
                <Card.Body className="p-4">
                  <h5 className="mb-4" style={{ color: 'var(--pf-text)' }}>Informasi Kendaraan</h5>

                  {/* Nama */}
                  <Form.Group className="mb-3">
                    <Form.Label>Nama Pemesan</Form.Label>
                    <Form.Control
                      placeholder="Masukkan nama lengkap"
                      value={form.name}
                      isInvalid={!!errors.name}
                      onChange={e => setField('name', e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                  </Form.Group>

                  {/* Jenis kendaraan */}
                  <Form.Group className="mb-3">
                    <Form.Label>Jenis Kendaraan</Form.Label>
                    <div className="d-flex gap-2">
                      {['Mobil','Motor'].map(v => (
                        <Button
                          key={v}
                          className={`flex-fill ${form.vehicle === v ? 'btn-pf-primary' : 'btn-pf-ghost'} btn`}
                          onClick={() => setField('vehicle', v)}
                        >
                          {v === 'Mobil' ? '🚗' : '🏍️'} {v}
                        </Button>
                      ))}
                    </div>
                  </Form.Group>

                  {/* Plat */}
                  <Form.Group className="mb-3">
                    <Form.Label>Nomor Plat Kendaraan</Form.Label>
                    <Form.Control
                      placeholder="Contoh: BE 1234 AB"
                      value={form.plate}
                      isInvalid={!!errors.plate}
                      onChange={e => setField('plate', e.target.value.toUpperCase())}
                    />
                    <Form.Control.Feedback type="invalid">{errors.plate}</Form.Control.Feedback>
                  </Form.Group>

                  {/* HP */}
                  <Form.Group className="mb-3">
                    <Form.Label>Nomor HP</Form.Label>
                    <Form.Control
                      type="tel"
                      placeholder="Contoh: 0812-3456-7890"
                      value={form.phone}
                      isInvalid={!!errors.phone}
                      onChange={e => setField('phone', e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
                  </Form.Group>

                  {/* Durasi */}
                  <Form.Group className="mb-2">
                    <Form.Label>Durasi Parkir (jam)</Form.Label>
                    <div className="d-flex flex-wrap gap-2">
                      {['1','2','3','4','6','8'].map(d => (
                        <Button
                          key={d}
                          className={`duration-btn ${form.duration === d ? 'btn-pf-primary' : 'btn-pf-ghost'} btn btn-sm`}
                          onClick={() => setField('duration', d)}
                        >
                          {d} jam
                        </Button>
                      ))}
                    </div>
                  </Form.Group>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={5}>
              <Card className="mb-3">
                <Card.Body>
                  <h6 className="mb-3" style={{ color: 'var(--pf-text)' }}>Ringkasan Booking</h6>
                  {[
                    ['Gedung',    parking?.name || '—'],
                    ['Slot',      parking ? `${parking.floor} / ${parking.slot}` : '—'],
                    ['Durasi',    `${form.duration} jam`],
                    ['Tarif',     parking?.price || '—'],
                  ].map(([k,v]) => (
                    <div key={k} className="d-flex justify-content-between mb-2">
                      <small style={{ color:'var(--pf-text2)' }}>{k}</small>
                      <small style={{ color:'var(--pf-text)', fontWeight:600, textAlign:'right', maxWidth:200 }}>{v}</small>
                    </div>
                  ))}
                  <hr style={{ borderColor:'var(--pf-border)' }} />
                  <div className="d-flex justify-content-between align-items-center">
                    <span style={{ fontWeight:600, color:'var(--pf-text)' }}>Total</span>
                    <span style={{ fontSize:22, fontWeight:800, color:'var(--pf-accent)' }}>
                      Rp {totalPrice.toLocaleString('id-ID')}
                    </span>
                  </div>
                </Card.Body>
              </Card>

              {!parking && (
                <Card className="mb-3" style={{ borderColor:'var(--pf-orange)', background:'rgba(255,167,38,0.06)' }}>
                  <Card.Body style={{ padding:'12px 16px' }}>
                    <small style={{ color:'var(--pf-orange)' }}>
                      ⚠️ Belum ada parkir dipilih.{' '}
                      <Button variant="link" className="p-0 text-accent" style={{ fontSize:13 }} onClick={() => navigate('/parking')}>
                        Cari parkir
                      </Button>
                    </small>
                  </Card.Body>
                </Card>
              )}

              <Button
                className="btn-pf-primary btn w-100"
                onClick={next}
                disabled={!parking}
              >
                Lanjutkan →
              </Button>
            </Col>
          </Row>
        )}

        {/* ── STEP 1: Konfirmasi ── */}
        {step === 1 && (
          <Row className="justify-content-center animate-fade-up">
            <Col lg={7}>
              <Card>
                <Card.Body className="p-4">
                  <h5 className="mb-4" style={{ color:'var(--pf-text)' }}>Konfirmasi Booking</h5>
                  {[
                    ['Nama',       form.name],
                    ['Kendaraan',  `${form.vehicle} – ${form.plate}`],
                    ['No. HP',     form.phone],
                    ['Gedung',     parking?.name],
                    ['Slot',       `${parking?.floor} / ${parking?.slot}`],
                    ['Durasi',     `${form.duration} jam`],
                    ['Total',      `Rp ${totalPrice.toLocaleString('id-ID')}`],
                  ].map(([k,v]) => (
                    <div key={k} className="d-flex justify-content-between py-2 border-bottom border-pf">
                      <span style={{ color:'var(--pf-text2)', fontSize:14 }}>{k}</span>
                      <span style={{ color:'var(--pf-text)', fontWeight:600, fontSize:14, textAlign:'right', maxWidth:280 }}>{v}</span>
                    </div>
                  ))}

                  <div className="mt-4">
                    <p style={{ fontWeight:600, color:'var(--pf-text)', marginBottom:12 }}>Metode Pembayaran</p>
                    <div className="d-flex flex-wrap gap-2">
                      {['GoPay','OVO','Dana','Kartu Kredit'].map(m => (
                        <Button
                          key={m}
                          className={`${payMethod === m ? 'btn-pf-primary' : 'btn-pf-ghost'} btn btn-sm`}
                          onClick={() => setPayMethod(m)}
                        >
                          {m}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="d-flex gap-3 justify-content-end mt-4">
                    <Button className="btn-pf-ghost btn" onClick={() => setStep(0)}>← Kembali</Button>
                    <Button className="btn-pf-primary btn" onClick={next}>Konfirmasi & Bayar</Button>
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
                  <div style={{ fontSize:64, marginBottom:16 }}>✅</div>
                  <h3 style={{ color:'var(--pf-text)' }}>Booking Berhasil!</h3>
                  <p className="mb-4">Tiket parkir Anda telah dikonfirmasi. Simpan kode berikut.</p>

                  <div className="ticket-box mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span style={{ fontSize:16, fontWeight:800, color:'var(--pf-accent)' }}>🅿 ParkFinder</span>
                      <Badge className="badge-pf-green px-2 py-1">Aktif</Badge>
                    </div>
                    <div className="ticket-code">{ticketCode}</div>
                    <div className="pf-divider" />
                    {[
                      ['Nama',    form.name],
                      ['Slot',    `${parking?.floor} – ${parking?.slot}`],
                      ['Durasi',  `${form.duration} jam`],
                      ['Bayar',   payMethod],
                    ].map(([k,v]) => (
                      <div key={k} className="d-flex justify-content-between mb-2">
                        <small style={{ color:'var(--pf-text2)' }}>{k}</small>
                        <small style={{ color:'var(--pf-text)', fontWeight:600 }}>{v}</small>
                      </div>
                    ))}
                    <div className="qr-box mt-3">
                      <span style={{ fontSize:48 }}>📱</span>
                      <p style={{ margin:0, fontSize:13, color:'var(--pf-text3)' }}>Scan QR saat tiba di lokasi</p>
                    </div>
                  </div>

                  <div className="d-flex gap-3 justify-content-center">
                    <Button className="btn-pf-outline btn" onClick={() => navigate('/parking')}>Booking Lagi</Button>
                    <Button className="btn-pf-primary btn"  onClick={() => navigate('/')}>Ke Beranda</Button>
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
