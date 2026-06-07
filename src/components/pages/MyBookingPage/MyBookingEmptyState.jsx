import { Suspense, lazy } from 'react'
import { Button } from 'react-bootstrap'

const CarModel3D = lazy(() => import('../../3d/CarModel3D'))

export default function MyBookingEmptyState({ filter, onBooking }) {
  const isActive = filter === 'active'
  const title = isActive ? 'Belum Ada Parkiran Aktif' : 'Belum Ada Riwayat Booking'
  const message = isActive
    ? 'Booking slot parkir terlebih dahulu untuk mulai sesi parkir Anda.'
    : 'Semua booking yang pernah Anda lakukan akan muncul di sini.'

  return (
    <div className="empty-state-card">
      {/* 3D Car – larger canvas */}
      <div style={{ width: '100%', maxWidth: 700, margin: '0 auto 8px' }}>
        <Suspense
          fallback={
            <div style={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="spinner-3d" />
            </div>
          }
        >
          <CarModel3D
            height={600}
            scale={7.2}
            autoRotate={true}
            fov={14}
            cameraPos={[0.95, 0.25, 0.95]}
          />
        </Suspense>
      </div>

      <div className="empty-state-body">
        <div className="empty-state-icon">{isActive ? '🅿️' : '📋'}</div>
        <h5 className="empty-state-title">{title}</h5>
        <p className="empty-state-message">{message}</p>

        <Button
          className="btn-pf-primary btn"
          onClick={onBooking}
          id="empty-state-booking-btn"
        >
          🅿️ {isActive ? 'Booking Sekarang' : 'Lihat Parkir Tersedia'}
        </Button>
      </div>
    </div>
  )
}
