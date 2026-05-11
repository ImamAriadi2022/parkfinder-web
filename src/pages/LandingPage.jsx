import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import LandingDownloadCta from '../components/pages/LandingPage/LandingDownloadCta'
import LandingFeatures from '../components/pages/LandingPage/LandingFeatures'
import LandingFooter from '../components/pages/LandingPage/LandingFooter'
import LandingHero from '../components/pages/LandingPage/LandingHero'
import LandingParkings from '../components/pages/LandingPage/LandingParkings'
import LandingStats from '../components/pages/LandingPage/LandingStats'
import LandingSteps from '../components/pages/LandingPage/LandingSteps'
import { GuestService } from '../services/api'
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



const STEPS = [
  { num: '01', img: `${CDN}/foto/tutor1.png`, title: 'Cari Gedung Parkir', desc: 'Gunakan pencarian untuk menemukan gedung parkir terdekat dan lihat slot secara real-time.' },
  { num: '02', img: `${CDN}/foto/tutor2.png`, title: 'Pilih & Booking Slot', desc: 'Pilih lantai dan nomor slot tersedia, lalu booking untuk amankan tempat Anda.' },
  { num: '03', img: `${CDN}/foto/tutor3.png`, title: 'Scan & Masuk', desc: 'Tiba di lokasi, scan QR tiket digital Anda untuk mengaktifkan sesi parkir.' },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const [parkings, setParkings] = useState([])

  useEffect(() => {
    GuestService.getAllAreas()
      .then(res => {
        if (res.success && res.data) {
          const formatted = res.data.slice(0, 3).map(p => ({
            id: p.id,
            name: p.name,
            occupancy: p.totalSlots > 0 ? Math.round(((p.totalSlots - p.availableSlots) / p.totalSlots) * 100) : 0,
            slots: `${p.availableSlots}/${p.totalSlots} Kosong`,
            distance: '1.2 km', // Mock distance
            tag: p.availableSlots > 0 ? (p.availableSlots < p.totalSlots * 0.2 ? 'Ramai' : 'Tersedia') : 'Penuh',
            tagClass: p.availableSlots > 0 ? (p.availableSlots < p.totalSlots * 0.2 ? 'orange' : 'green') : 'red',
            variant: p.availableSlots > 0 ? (p.availableSlots < p.totalSlots * 0.2 ? 'warning' : 'info') : 'danger',
          }))
          setParkings(formatted)
        }
      })
      .catch(err => console.error("Error fetching areas", err))
  }, [])

  return (
    <div className="landing">
      <LandingHero
        cdn={CDN}
        onPrimaryCta={() => navigate('/scan')}
        onSecondaryCta={() => navigate('/parking')}
      />
      <LandingStats stats={STATS} />
      <LandingParkings
        parkings={parkings}
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
