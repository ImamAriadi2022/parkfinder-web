import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Container, Row, Col, Card, Button, Form, InputGroup } from 'react-bootstrap'
import './ScanPage.css'

const CDN = 'https://storage.googleapis.com/parkfinderbucket'

export default function ScanPage() {
  const navigate   = useNavigate()
  const location   = useLocation()
  const redirect   = location.state?.redirect || '/parking'
  const parkingData = location.state?.parking  || null

  const [code, setCode]         = useState('')
  const [scanning, setScanning] = useState(false)
  const [scanned, setScanned]   = useState(false)
  const [error, setError]       = useState('')
  const [linePos, setLinePos]   = useState(0)
  const animRef                 = useRef(null)
  const dirRef                  = useRef(1)

  // Animasi garis scan naik-turun
  useEffect(() => {
    const tick = () => {
      setLinePos(p => {
        const next = p + dirRef.current * 1.2
        if (next >= 100) { dirRef.current = -1; return 100 }
        if (next <= 0)   { dirRef.current =  1; return 0  }
        return next
      })
      animRef.current = requestAnimationFrame(tick)
    }
    animRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animRef.current)
  }, [])

  const handleScan = () => {
    if (!code.trim()) {
      setError('Masukkan kode tiket terlebih dahulu')
      return
    }
    setError('')
    setScanning(true)
    // Simulasi proses scan
    setTimeout(() => {
      setScanning(false)
      setScanned(true)
      // Lanjut ke halaman tujuan setelah 1.5 detik
      setTimeout(() => {
        navigate(redirect, { state: parkingData })
      }, 1600)
    }, 1800)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleScan()
  }

  return (
    <div className="scan-page" style={{ paddingTop: 'var(--nav-h)', minHeight:'100vh' }}>
      {/* Background */}
      <div className="scan-bg">
        <img src={`${CDN}/background/bg-wellcome-dark.png`} alt="" className="scan-bg-img"
          onError={e => { e.target.style.display='none' }} />
        <div className="scan-bg-overlay" />
      </div>

      <Container className="position-relative" style={{ zIndex:1, paddingTop:40, paddingBottom:60 }}>
        <Row className="justify-content-center">
          <Col md={10} lg={8} xl={6}>

            {/* Header */}
            <div className="text-center mb-5 animate-fade-up">
              <div className="scan-logo mb-3">
                <img
                  src={`${CDN}/foto/logo.png`}
                  alt="ParkFinder"
                  style={{ height: 52, width: 'auto', objectFit: 'contain' }}
                  onError={e => { e.target.style.display='none' }}
                />
              </div>
              <h1 className="scan-title">Scan Tiket Parkir</h1>
              <p style={{ color:'var(--pf-text2)', fontSize:15 }}>
                Masukkan kode tiket atau scan QR untuk mengakses sistem parkir
              </p>
            </div>

            {/* Scan Frame */}
            <div className="scan-frame-wrapper animate-fade-up delay-1">
              <div className={`scan-frame ${scanning ? 'scanning' : ''} ${scanned ? 'scanned' : ''}`}>
                {/* Corner brackets */}
                <div className="corner tl" />
                <div className="corner tr" />
                <div className="corner bl" />
                <div className="corner br" />

                {/* Scan line animation */}
                {!scanned && (
                  <div className="scan-line" style={{ top: `${linePos}%` }} />
                )}

                {/* Content inside frame */}
                <div className="scan-frame-content">
                  {scanned ? (
                    <div className="scan-success-content animate-fade-up">
                      <div className="success-check">✓</div>
                      <p className="success-text">Tiket Terverifikasi!</p>
                    </div>
                  ) : scanning ? (
                    <div className="scanning-content">
                      <div className="scan-spinner" />
                      <p style={{ color:'var(--pf-text2)', fontSize:14, marginTop:12 }}>Memverifikasi tiket...</p>
                    </div>
                  ) : (
                    <div className="scan-idle-content">
                      <div style={{ fontSize:56, marginBottom:12, opacity:0.4 }}>📷</div>
                      <p style={{ color:'var(--pf-text3)', fontSize:13, margin:0 }}>
                        Area scan QR
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Manual code input */}
            {!scanned && (
              <Card className="animate-fade-up delay-2" style={{ marginTop:24 }}>
                <Card.Body className="p-4">
                  <p className="mb-3" style={{ color:'var(--pf-text)', fontWeight:600, fontSize:15 }}>
                    Masukkan Kode Tiket
                  </p>
                  <InputGroup className="mb-2">
                    <InputGroup.Text>🎫</InputGroup.Text>
                    <Form.Control
                      placeholder="Contoh: PKF-A1B2C3D4"
                      value={code}
                      onChange={e => { setCode(e.target.value.toUpperCase()); setError('') }}
                      onKeyDown={handleKeyDown}
                      disabled={scanning}
                      style={{ textTransform:'uppercase', letterSpacing: 2, fontFamily:'monospace', fontSize:16 }}
                    />
                  </InputGroup>
                  {error && <small className="text-danger d-block mb-3">{error}</small>}

                  <Button
                    className="btn-pf-primary btn w-100 py-3"
                    onClick={handleScan}
                    disabled={scanning}
                  >
                    {scanning ? (
                      <span className="d-flex align-items-center justify-content-center gap-2">
                        <span className="mini-spinner" /> Memverifikasi...
                      </span>
                    ) : 'Verifikasi Tiket'}
                  </Button>
                </Card.Body>
              </Card>
            )}

            {/* Demo / Skip */}
            {!scanned && !scanning && (
              <div className="text-center mt-4 animate-fade-up delay-3">
                <p style={{ color:'var(--pf-text3)', fontSize:13, marginBottom:10 }}>
                  Belum punya tiket?
                </p>
                <div className="d-flex gap-3 justify-content-center">
                  <Button
                    className="btn-pf-outline btn btn-sm"
                    onClick={() => navigate('/parking')}
                  >
                    Cari & Booking Parkir
                  </Button>
                  <Button
                    className="btn-pf-ghost btn btn-sm"
                    onClick={() => { setCode('PKF-DEMO1234'); setTimeout(handleScan, 100) }}
                  >
                    Demo Scan
                  </Button>
                </div>
              </div>
            )}

            {/* Back button */}
            <div className="text-center mt-4">
              <Button
                variant="link"
                style={{ color:'var(--pf-text3)', fontSize:13, textDecoration:'none' }}
                onClick={() => navigate('/')}
              >
                ← Kembali ke Beranda
              </Button>
            </div>

          </Col>
        </Row>
      </Container>
    </div>
  )
}
