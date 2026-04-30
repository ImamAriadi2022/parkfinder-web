import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppNavbar from './components/AppNavbar'
import LandingPage from './pages/LandingPage'
import ScanPage from './pages/ScanPage'
import ParkingPage from './pages/ParkingPage'
import BookingPage from './pages/BookingPage'
import SwapPage from './pages/SwapPage'
import './index.css'

export default function App() {
  return (
    <BrowserRouter>
      <AppNavbar />
      <Routes>
        <Route path="/"        element={<LandingPage />} />
        <Route path="/scan"    element={<ScanPage />} />
        <Route path="/parking" element={<ParkingPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/swap"    element={<SwapPage />} />
        <Route path="*"        element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
