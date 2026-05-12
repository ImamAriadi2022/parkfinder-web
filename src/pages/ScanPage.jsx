import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Col, Container, Row } from 'react-bootstrap'
import { Html5QrcodeScanner } from 'html5-qrcode'
import ScanBackground from '../components/pages/ScanPage/ScanBackground'
import ScanFooterBack from '../components/pages/ScanPage/ScanFooterBack'
import ScanHeader from '../components/pages/ScanPage/ScanHeader'
import { GuestService } from '../services/api'
import '../styles/pages/ScanPage.css'

const CDN = 'https://storage.googleapis.com/parkfinderbucket'

export default function ScanPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const redirect = location.state?.redirect || '/parking'
  const parkingData = location.state?.parking || null

  const [scanning, setScanning] = useState(false)
  const [scanned, setScanned] = useState(false)
  const [error, setError] = useState('')

  const scanningRef = useRef(false)
  const scannedRef = useRef(false)

  useEffect(() => {
    // Initialize the scanner only once
    const scanner = new Html5QrcodeScanner("qr-reader", { 
      fps: 10, 
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
      showTorchButtonIfSupported: true,
    }, false);

    const onScanSuccess = async (decodedText) => {
      if (scanningRef.current || scannedRef.current) return; // Prevent multiple scans at once

      scanningRef.current = true;
      scanner.pause()
      setError('')
      setScanning(true)
      
      try {
        const result = await GuestService.verifyTicket(decodedText.trim())
        scanningRef.current = false;
        scannedRef.current = true;
        setScanning(false)
        setScanned(true)
        
        scanner.clear() // Clean up the scanner UI
        
        // Redirect on success
        setTimeout(() => {
          navigate(redirect, { state: { ...parkingData, apiResult: result } })
        }, 1500)
      } catch (err) {
        scanningRef.current = false;
        setScanning(false)
        setError(err.message || 'Gagal verifikasi tiket')
        // Resume scanning after a short delay so user can try again
        setTimeout(() => { 
          if(scanner.getState() === 2) { // if paused
            scanner.resume() 
          }
        }, 2000)
      }
    }

    const onScanError = (errorMessage) => {
      // This runs continuously as it tries to scan, so ignore background errors
    }

    scanner.render(onScanSuccess, onScanError);

    // Cleanup scanner on unmount
    return () => {
      scanner.clear().catch(err => console.error("Failed to clear scanner", err));
    };
  }, [navigate, redirect, parkingData]); // Removed scanning and scanned to prevent re-initialization

  return (
    <div className="scan-page" style={{ paddingTop: 'var(--nav-h)', minHeight: '100vh' }}>
      <ScanBackground cdn={CDN} />
      <Container className="position-relative" style={{ zIndex: 1, paddingTop: 40, paddingBottom: 60 }}>
        <Row className="justify-content-center">
          <Col md={10} lg={8} xl={6}>
            <ScanHeader cdn={CDN} />

            <div className="scan-container-glass animate-fade-up delay-1">
              {/* QR Reader DOM Element */}
              <div id="qr-reader" style={{ width: '100%', borderRadius: 16, overflow: 'hidden' }}></div>
              
              {/* Status Messages */}
              {error && (
                <div className="text-danger text-center mt-3 animate-fade-up" style={{ fontSize: 15, fontWeight: 500 }}>
                  ⚠️ {error}
                </div>
              )}
              {scanning && (
                <div className="text-info text-center mt-3 animate-fade-up" style={{ fontSize: 15, fontWeight: 500 }}>
                  <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                  Memverifikasi tiket...
                </div>
              )}
              {scanned && (
                <div className="text-success text-center mt-3 animate-fade-up" style={{ fontSize: 18, fontWeight: 'bold' }}>
                  ✓ Tiket Terverifikasi!
                </div>
              )}
            </div>

            <ScanFooterBack onBack={() => navigate('/')} />
          </Col>
        </Row>
      </Container>
    </div>
  )
}
