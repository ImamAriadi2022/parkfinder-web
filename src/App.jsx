import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppNavbar from './components/AppNavbar'
import BookingPage from './pages/BookingPage'
import CheckoutPage from './pages/CheckoutPage'
import LandingPage from './pages/LandingPage'
import MyBookingPage from './pages/MyBookingPage'
import ParkingPage from './pages/ParkingPage'
import ScanPage from './pages/ScanPage'
import SwapPage from './pages/SwapPage'
import './styles/index.css'

export default function App() {
  return (
    <BrowserRouter>
      <AppNavbar />
      <Routes>
        <Route path="/"        element={<LandingPage />} />
        <Route path="/scan"    element={<ScanPage />} />
        <Route path="/parking" element={<ParkingPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/swap"     element={<SwapPage />} />
        <Route path="/checkout"   element={<CheckoutPage />} />
        <Route path="/my-booking" element={<MyBookingPage />} />
        <Route path="*"        element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
