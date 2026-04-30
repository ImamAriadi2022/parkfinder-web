import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Card, Badge, Button, ProgressBar } from 'react-bootstrap'
import './LandingPage.css'

const CDN = 'https://storage.googleapis.com/parkfinderbucket'

const STATS = [
  { value: '150+', label: 'Gedung Parkir' },
  { value: '50K+', label: 'Pengguna Aktif' },
  { value: '99%',  label: 'Tingkat Keberhasilan' },
  { value: '24/7', label: 'Layanan Tersedia' },
]

const FEATURES = [
  { icon: '🔍', title: 'Cari Parkir Real-time',  desc: 'Temukan slot parkir tersedia di sekitar Anda secara real-time.' },
  { icon: '⚡', title: 'Booking Instan',          desc: 'Amankan slot parkir favorit Anda dalam hitungan detik.' },
  { icon: '📱', title: 'QR Ticket',               desc: 'Scan QR code tiket parkir digital. Tanpa kertas, tanpa antre.' },
  { icon: '🗺️', title: 'Panduan Navigasi',        desc: 'Panduan langkah demi langkah menuju slot parkir Anda.' },
  { icon: '🔔', title: 'Notifikasi Aktif',        desc: 'Pengingat otomatis sebelum waktu booking Anda habis.' },
  { icon: '💳', title: 'Berbagai Pembayaran',     desc: 'Kartu, dompet digital, atau transfer bank. Semua tersedia.' },
]

const PARKINGS = [
  { name: 'Jurusan Teknik Elektro Universitas Lampung', occupancy: 78, slots: '4/5 Kosong',       distance: '0.3 km', price: 'Rp 3.000/jam', tag: 'Tersedia',  variant: 'success' },
  { name: 'Mall Boemi Kedaton',                          occupancy: 81, slots: '635/1384 Kosong', distance: '1.2 km', price: 'Rp 5.000/jam', tag: 'Ramai',     variant: 'warning' },
  { name: 'Lampung City Mall',                           occupancy: 81, slots: '635/1384 Kosong', distance: '2.1 km', price: 'Rp 5.000/jam', tag: 'Ramai',     variant: 'warning' },
]

const STEPS = [
  { num: '01', img: `${CDN}/foto/tutor1.png`, title: 'Cari Gedung Parkir',  desc: 'Gunakan pencarian untuk menemukan gedung parkir terdekat dan lihat ketersediaan slot secara real-time.' },
  { num: '02', img: `${CDN}/foto/tutor2.png`, title: 'Pilih & Booking Slot', desc: 'Pilih lantai dan nomor slot yang tersedia, lalu booking untuk mengamankan tempat Anda.' },
  { num: '03', img: `${CDN}/foto/tutor3.png`, title: 'Tiba & Scan Tiket',   desc: 'Ikuti panduan navigasi ke slot Anda. Scan QR tiket saat tiba untuk konfirmasi.' },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="landing">

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="hero-section">
        <div className="hero-bg">
          <img src={`${CDN}/background/bg-home.png`} alt="" className="hero-bg-img" />
          <div className="hero-overlay" />
        </div>

        <Container className="hero-content position-relative" style={{ zIndex: 1, paddingTop: 100, paddingBottom: 80 }}>
          <Row className="align-items-center g-5">
            <Col lg={6} className="animate-fade-up">
              <Badge className="badge-pf-blue mb-3 px-3 py-2" style={{ fontSize: 13 }}>🚗 Smart Parking System</Badge>
              <h1 className="hero-title mb-3">
                Parkir Cerdas,<br />
                <span className="gradient-text">Tanpa Repot</span>
              </h1>
              <p className="hero-desc mb-4">
                ParkFinder membantu Anda menemukan, memesan, dan mengelola parkir
                di berbagai lokasi secara real-time. Amankan tempat sebelum tiba.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Button className="btn-pf-primary btn btn-lg" onClick={() => navigate('/parking')}>
                  Cari Parkir Sekarang
                </Button>
                <Button className="btn-pf-outline btn btn-lg" onClick={() => navigate('/booking')}>
                  Cara Kerja
                </Button>
              </div>
            </Col>

            <Col lg={6} className="animate-fade-up delay-2">
              <div className="hero-car-container animate-float">
                <img src={`${CDN}/background/bg-home.png`} alt="Gedung Parkir" className="hero-building" />
                <img src={`${CDN}/foto/mclaren-depan.png`} alt="McLaren" className="hero-car animate-glow" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ── STATS ────────────────────────────────────────────── */}
      <section className="py-4" style={{ background: 'var(--pf-bg2)', borderTop: '1px solid var(--pf-border)', borderBottom: '1px solid var(--pf-border)' }}>
        <Container>
          <Row className="g-0">
            {STATS.map((s, i) => (
              <Col key={i} sm={6} lg={3} className={`text-center py-4 ${i < 3 ? 'border-end border-pf' : ''}`}>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ── AVAILABLE PARKINGS ───────────────────────────────── */}
      <section className="py-5">
        <Container>
          <div className="mb-4">
            <h2 className="fw-bold">Gedung Parkir yang Tersedia</h2>
            <p>Temukan tempat parkir terbaik di kota Anda</p>
          </div>

          <div className="d-flex flex-column gap-3">
            {PARKINGS.map((p, i) => (
              <Card key={i} className="animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <Card.Body>
                  <Row className="align-items-center">
                    <Col xs="auto">
                      <div className="parking-icon-box">🏢</div>
                    </Col>
                    <Col>
                      <h6 className="mb-1" style={{ color: 'var(--pf-text)' }}>{p.name}</h6>
                      <div className="d-flex flex-wrap gap-2 align-items-center mb-2">
                        <small className="text-muted-pf">📍 {p.distance}</small>
                        <small className="text-muted-pf">🕐 {p.price}</small>
                        <Badge bg={p.variant === 'success' ? '' : ''} className={`badge-pf-${p.variant === 'success' ? 'green' : 'orange'}`}>
                          {p.tag}
                        </Badge>
                      </div>
                      <ProgressBar now={p.occupancy} style={{ height: 6 }} />
                    </Col>
                    <Col xs="auto" className="text-center">
                      <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--pf-accent)' }}>{p.occupancy}%</div>
                      <div style={{ fontSize: 11, color: 'var(--pf-text3)' }}>Terisi</div>
                    </Col>
                    <Col xs={12} className="mt-3 d-flex justify-content-between align-items-center">
                      <small className="text-muted-pf">{p.slots}</small>
                      <Button
                        className="btn-pf-primary btn btn-sm"
                        onClick={() => navigate('/booking', { state: p })}
                      >
                        Booking Sekarang
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}
          </div>

          <div className="text-center mt-4">
            <Button className="btn-pf-outline btn" onClick={() => navigate('/parking')}>
              Lihat Semua Parkir →
            </Button>
          </div>
        </Container>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section className="py-5" style={{ background: 'var(--pf-bg2)' }}>
        <Container>
          <div className="mb-5 text-center">
            <h2 className="fw-bold">Fitur Unggulan</h2>
            <p>Semua yang Anda butuhkan untuk pengalaman parkir terbaik</p>
          </div>
          <Row className="g-4">
            {FEATURES.map((f, i) => (
              <Col key={i} md={6} lg={4}>
                <Card className="h-100 text-center animate-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
                  <Card.Body className="p-4">
                    <div style={{ fontSize: 36, marginBottom: 14 }}>{f.icon}</div>
                    <Card.Title style={{ fontSize: 17 }}>{f.title}</Card.Title>
                    <Card.Text style={{ fontSize: 14 }}>{f.desc}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section className="py-5">
        <Container>
          <div className="mb-5 text-center">
            <h2 className="fw-bold">3 Langkah Mudah</h2>
            <p>Amankan tempat parkir Anda sebelum tiba</p>
          </div>
          <Row className="g-4 justify-content-center">
            {STEPS.map((s, i) => (
              <Col key={i} md={4}>
                <div className="text-center position-relative">
                  <div className="step-number-big">{s.num}</div>
                  <div className="step-img-wrap mb-3">
                    <img src={s.img} alt={s.title} className="step-img" onError={e => { e.target.style.display = 'none' }} />
                  </div>
                  <h5 style={{ color: 'var(--pf-text)' }}>{s.title}</h5>
                  <p style={{ fontSize: 14 }}>{s.desc}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="py-5" style={{ background: 'var(--pf-bg2)' }}>
        <Container>
          <Card className="shadow-glow text-center py-5 px-3">
            <Card.Body>
              <h2 className="mb-3">Siap Parkir Lebih Cerdas?</h2>
              <p className="mb-4 mx-auto" style={{ maxWidth: 480, fontSize: 16 }}>
                Bergabung dengan ribuan pengguna yang sudah merasakan kemudahan ParkFinder.
                Tidak perlu registrasi untuk mulai mencari parkir.
              </p>
              <Button className="btn-pf-primary btn btn-lg" onClick={() => navigate('/parking')}>
                Mulai Cari Parkir
              </Button>
            </Card.Body>
          </Card>
        </Container>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer style={{ background: 'var(--pf-bg2)', borderTop: '1px solid var(--pf-border)', padding: '48px 0 24px' }}>
        <Container>
          <Row className="mb-4 g-4">
            <Col md={5}>
              <div className="d-flex align-items-center gap-2 mb-2">
                <span style={{ width:32,height:32,background:'linear-gradient(135deg,#00D2FF,#0066AA)',borderRadius:8,display:'inline-flex',alignItems:'center',justifyContent:'center',fontSize:17 }}>🅿</span>
                <span style={{ fontSize:18,fontWeight:800,color:'#fff' }}>ParkFinder</span>
              </div>
              <p style={{ fontSize: 14 }}>Solusi parkir cerdas untuk kota modern.</p>
            </Col>
            <Col md={3}>
              <h6 style={{ color: 'var(--pf-text)' }}>Layanan</h6>
              {[['Cari Parkir','/parking'],['Booking','/booking']].map(([l,p]) => (
                <div key={l}><Button variant="link" className="text-muted-pf p-0 text-decoration-none" style={{fontSize:14}} onClick={() => navigate(p)}>{l}</Button></div>
              ))}
            </Col>
            <Col md={4}>
              <h6 style={{ color: 'var(--pf-text)' }}>Kontak</h6>
              <p style={{ fontSize: 14, marginBottom: 4 }}>info@parkfinder.id</p>
              <p style={{ fontSize: 14 }}>+62 811 1234 5678</p>
            </Col>
          </Row>
          <hr style={{ borderColor: 'var(--pf-border)' }} />
          <p className="text-center" style={{ fontSize: 13, color: 'var(--pf-text3)', margin: 0 }}>
            © 2026 ParkFinder. All rights reserved.
          </p>
        </Container>
      </footer>
    </div>
  )
}
