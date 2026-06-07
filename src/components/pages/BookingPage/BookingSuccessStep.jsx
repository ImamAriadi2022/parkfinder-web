import { Suspense, lazy, useEffect, useState } from 'react'
import { Badge, Button, Col, Row } from 'react-bootstrap'

const CarModel3D = lazy(() => import('../../3d/CarModel3D'))

const CONFETTI_COLORS = ['#00D2FF', '#6366F1', '#10B981', '#F59E0B', '#EF5350', '#8B5CF6', '#EC4899']

function Confetti() {
  const pieces = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    left: `${(i * 5.5 + Math.random() * 5).toFixed(1)}%`,
    delay: `${(i * 0.09).toFixed(2)}s`,
    duration: `${(1.6 + (i % 5) * 0.2).toFixed(1)}s`,
    size: i % 3 === 0 ? 10 : 7,
  }))

  return (
    <div className="confetti-container" aria-hidden="true">
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: p.left,
            top: '-10px',
            background: p.color,
            width: p.size,
            height: p.size,
            borderRadius: p.id % 2 === 0 ? '50%' : '2px',
            animationDuration: p.duration,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  )
}

export default function BookingSuccessStep({
  ticketCode,
  form,
  parking,
  onSwap,
  onCheckout,
  onMyBooking,
  onBookingAgain,
  onHome,
}) {
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 4000)
    return () => clearTimeout(t)
  }, [])

  const details = [
    ['Nama',   form.name],
    ['Plat',   form.plate],
    ['Gedung', parking?.name],
    ['Slot',   `${parking?.floor} – ${parking?.slot}`],
  ]

  return (
    <Row className="justify-content-center animate-fade-up">
      <Col lg={7} xl={6}>
        <div className="success-card">
          {showConfetti && <Confetti />}

          {/* 3D car */}
          <div className="success-3d-wrap">
            <Suspense
              fallback={
                <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div className="spinner-3d" />
                </div>
              }
            >
              <CarModel3D
                height={520}
                scale={7.8}
                autoRotate={true}
                fov={14}
                cameraPos={[0.9, 0.2, 0.9]}
              />
            </Suspense>
          </div>

          {/* Header */}
          <div className="text-center mb-4">
            <div className="success-check-wrap">
              <span className="success-check-icon">✓</span>
            </div>
            <h3 className="success-title">Booking Berhasil!</h3>
            <p style={{ color: 'var(--pf-text2)', marginBottom: 0 }}>
              Tiket parkir Anda telah dikonfirmasi. Simpan kode berikut.
            </p>
          </div>

          {/* Ticket */}
          <div className="ticket-box mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <strong style={{ color: 'var(--pf-text)', fontSize: 15 }}>ParkFinder</strong>
              <Badge className="badge-pf-green px-2 py-1">Aktif</Badge>
            </div>

            <div className="ticket-code mb-3">{ticketCode}</div>

            <div className="pf-divider" />

            {details.map(([key, value]) => (
              <div key={key} className="d-flex justify-content-between mb-2">
                <small style={{ color: 'var(--pf-text2)' }}>{key}</small>
                <small style={{ color: 'var(--pf-text)', fontWeight: 600, textAlign: 'right', maxWidth: 200 }}>
                  {value}
                </small>
              </div>
            ))}

            <div className="qr-box mt-3">
              <p style={{ margin: 0, fontSize: 13, color: 'var(--pf-text3)', fontWeight: 600 }}>
                Tunjukkan tiket ini saat tiba di lokasi
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="d-flex flex-wrap gap-2 justify-content-center">
            <Button className="btn-pf-primary btn" onClick={onMyBooking} id="success-view-booking">
              Lihat Parkiran Aktif
            </Button>
            <Button className="btn-pf-outline btn" onClick={onSwap} id="success-swap">
              Tukar Slot
            </Button>
            <Button className="btn btn-danger-pf" onClick={onCheckout} id="success-checkout">
              Keluar Parkir
            </Button>
            <Button className="btn-pf-ghost btn" onClick={onBookingAgain} id="success-book-again">
              Booking Lagi
            </Button>
            <Button className="btn-pf-ghost btn" onClick={onHome} id="success-home">
              Ke Beranda
            </Button>
          </div>
        </div>
      </Col>
    </Row>
  )
}
