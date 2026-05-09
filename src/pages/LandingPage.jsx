import { useNavigate } from 'react-router-dom'
import LandingDownloadCta from '../components/pages/LandingPage/LandingDownloadCta'
import LandingFeatures from '../components/pages/LandingPage/LandingFeatures'
import LandingFooter from '../components/pages/LandingPage/LandingFooter'
import LandingHero from '../components/pages/LandingPage/LandingHero'
import LandingParkings from '../components/pages/LandingPage/LandingParkings'
import LandingStats from '../components/pages/LandingPage/LandingStats'
import LandingSteps from '../components/pages/LandingPage/LandingSteps'
import '../styles/pages/LandingPage.css'

const CDN = 'https://storage.googleapis.com/parkfinderbucket'

const STATS = [
  { value: '150+', label: 'Gedung Parkir' },
  { value: '50K+', label: 'Pengguna Aktif' },
  { value: '99%', label: 'Tingkat Keberhasilan' },
  { value: '24/7', label: 'Layanan Tersedia' },
]

const FEATURES = [
  { icon: '🔍', title: 'Cari Parkir Real-time', desc: 'Temukan slot parkir tersedia di sekitar Anda secara real-time.' },
  { icon: '⚡', title: 'Booking Instan', desc: 'Amankan slot parkir favorit Anda dalam hitungan detik.' },
  { icon: '📱', title: 'QR Ticket', desc: 'Scan QR code tiket parkir digital. Tanpa kertas, tanpa antre.' },
  { icon: '🗺️', title: 'Panduan Navigasi', desc: 'Panduan langkah demi langkah menuju slot parkir Anda.' },
  { icon: '🔔', title: 'Notifikasi Aktif', desc: 'Pengingat otomatis sebelum waktu booking Anda habis.' },
  { icon: '🔒', title: 'Slot Terjamin Aman', desc: 'Slot yang sudah di-booking tidak bisa diambil orang lain.' },
]

const PARKINGS = [
  { name: 'Jurusan Teknik Elektro Universitas Lampung', occupancy: 78, slots: '4/5 Kosong', distance: '0.3 km', tag: 'Tersedia', tagClass: 'green', variant: 'info' },
  { name: 'Mall Boemi Kedaton', occupancy: 81, slots: '635/1384 Kosong', distance: '1.2 km', tag: 'Ramai', tagClass: 'orange', variant: 'warning' },
  { name: 'Lampung City Mall', occupancy: 81, slots: '635/1384 Kosong', distance: '2.1 km', tag: 'Ramai', tagClass: 'orange', variant: 'warning' },
]

const STEPS = [
  { num: '01', img: `${CDN}/foto/tutor1.png`, title: 'Cari Gedung Parkir', desc: 'Gunakan pencarian untuk menemukan gedung parkir terdekat dan lihat slot secara real-time.' },
  { num: '02', img: `${CDN}/foto/tutor2.png`, title: 'Pilih & Booking Slot', desc: 'Pilih lantai dan nomor slot tersedia, lalu booking untuk amankan tempat Anda.' },
  { num: '03', img: `${CDN}/foto/tutor3.png`, title: 'Scan & Masuk', desc: 'Tiba di lokasi, scan QR tiket digital Anda untuk mengaktifkan sesi parkir.' },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="landing">
      <LandingHero
        cdn={CDN}
        onPrimaryCta={() => navigate('/scan')}
        onSecondaryCta={() => navigate('/parking')}
      />
      <LandingStats stats={STATS} />
      <LandingParkings
        parkings={PARKINGS}
        onBooking={(parking) => navigate('/scan', { state: { redirect: '/booking', parking } })}
        onSeeAll={() => navigate('/parking')}
      />
      <LandingFeatures features={FEATURES} />
      <LandingSteps steps={STEPS} />
      <LandingDownloadCta cdn={CDN} />
      <LandingFooter cdn={CDN} onNavigate={path => navigate(path)} />
    </div>
  )
}
