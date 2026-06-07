import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import AppNavbar from './components/AppNavbar'
import HelpWidget from './components/HelpWidget'
import LandingNavbar from './components/LandingNavbar'
import { ThemeProvider } from './context/ThemeContext'
import AboutProjectPage from './pages/AboutProjectPage'
import BookingPage from './pages/BookingPage'
import CheckoutPage from './pages/CheckoutPage'
import DownloadMobilePage from './pages/DownloadMobilePage'
import LandingPage from './pages/LandingPage'
import MyBookingPage from './pages/MyBookingPage'
import ParkingPage from './pages/ParkingPage'
import ScanPage from './pages/ScanPage'
import SwapPage from './pages/SwapPage'
import './styles/index.css'

function AppShell() {
  const location = useLocation()
  const isMarketingPage = ['/', '/tentang-project', '/download-mobile'].includes(location.pathname)

  return (
    <>
      {isMarketingPage ? <LandingNavbar /> : <AppNavbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/tentang-project" element={<AboutProjectPage />} />
        <Route path="/download-mobile" element={<DownloadMobilePage />} />
        <Route path="/scan" element={<ScanPage />} />
        <Route path="/parking" element={<ParkingPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/swap" element={<SwapPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/my-booking" element={<MyBookingPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!isMarketingPage && <HelpWidget />}
    </>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </ThemeProvider>
  )
}
