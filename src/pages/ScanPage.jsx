import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Col, Container, Row } from 'react-bootstrap'
import { Html5Qrcode } from 'html5-qrcode'
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

  const [manualCode, setManualCode] = useState('')

  useEffect(() => {
    let html5QrCode;
    
    const startScanner = async () => {
      try {
        html5QrCode = new Html5Qrcode("qr-reader");
        await html5QrCode.start(
          { facingMode: "environment" }, // Prefer back camera
          {
            fps: 10,
            qrbox: { width: 250, height: 250 }
          },
          onScanSuccess,
          (err) => { /* ignore background errors */ }
        );
      } catch (err) {
        console.error("Failed to start scanner automatically:", err);
      }
    };

    const onScanSuccess = async (decodedText) => {
      if (scanningRef.current || scannedRef.current) return;

      scanningRef.current = true;
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.pause()
      }
      setError('')
      setScanning(true)
      
      try {
        // Here we parse if it's JSON from our Dash QR, or just plain text
        let finalCode = decodedText.trim()
        try {
          const parsed = JSON.parse(finalCode)
          if (parsed.ticketCode) finalCode = parsed.ticketCode
        } catch (e) {
          // not json, use as is
        }

        const result = await GuestService.verifyTicket(finalCode)
        scanningRef.current = false;
        scannedRef.current = true;
        setScanning(false)
        setScanned(true)
        
        if (html5QrCode && html5QrCode.isScanning) {
          await html5QrCode.stop()
        }
        
        setTimeout(() => {
          navigate(redirect, { state: { ...parkingData, apiResult: result } })
        }, 1500)
      } catch (err) {
        scanningRef.current = false;
        setScanning(false)
        setError(err.message || 'Gagal verifikasi tiket')
        setTimeout(() => { 
          if(html5QrCode && html5QrCode.isScanning) {
            html5QrCode.resume() 
          }
        }, 2000)
      }
    }

    startScanner();

    return () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().then(() => {
          html5QrCode.clear();
        }).catch(err => console.error("Failed to clear scanner", err));
      }
    };
  }, [navigate, redirect, parkingData]);

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!manualCode.trim() || scanningRef.current || scannedRef.current) return;

    scanningRef.current = true;
    setError('')
    setScanning(true)
    
    try {
      const result = await GuestService.verifyTicket(manualCode.trim())
      scanningRef.current = false;
      scannedRef.current = true;
      setScanning(false)
      setScanned(true)
      
      setTimeout(() => {
        navigate(redirect, { state: { ...parkingData, apiResult: result } })
      }, 1500)
    } catch (err) {
      scanningRef.current = false;
      setScanning(false)
      setError(err.message || 'Gagal verifikasi tiket')
    }
  }

  return (
    <div className="scan-page" style={{ paddingTop: 'var(--nav-h)', minHeight: '100vh' }}>
      <ScanBackground cdn={CDN} />
      <Container className="position-relative" style={{ zIndex: 1, paddingTop: 40, paddingBottom: 60 }}>
        <Row className="justify-content-center">
          <Col md={10} lg={8} xl={6}>
            <ScanHeader cdn={CDN} />

            <div className="scan-container-glass animate-fade-up delay-1">
              {/* QR Reader DOM Element */}
              <div id="qr-reader" style={{ width: '100%', borderRadius: 16, overflow: 'hidden', border: '2px solid rgba(0, 212, 255, 0.3)' }}></div>
              
              <div className="mt-4 text-center">
                <p style={{ color: 'var(--pf-text2)', fontSize: 14 }}>Atau masukkan kode tiket manual:</p>
                <form onSubmit={handleManualSubmit} className="d-flex gap-2">
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Contoh: PKF-123456" 
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    disabled={scanning || scanned}
                    style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--pf-card-border)' }}
                  />
                  <button 
                    type="submit" 
                    className="btn btn-pf-primary" 
                    disabled={scanning || scanned || !manualCode.trim()}
                  >
                    Cek
                  </button>
                </form>
              </div>
              
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
