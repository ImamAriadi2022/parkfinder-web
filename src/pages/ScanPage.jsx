import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Col, Container, Row } from 'react-bootstrap'
import ScanBackground from '../components/pages/ScanPage/ScanBackground'
import ScanDemoActions from '../components/pages/ScanPage/ScanDemoActions'
import ScanFooterBack from '../components/pages/ScanPage/ScanFooterBack'
import ScanFrame from '../components/pages/ScanPage/ScanFrame'
import ScanHeader from '../components/pages/ScanPage/ScanHeader'
import ScanManualInput from '../components/pages/ScanPage/ScanManualInput'
import '../styles/pages/ScanPage.css'

const CDN = 'https://storage.googleapis.com/parkfinderbucket'

export default function ScanPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const redirect = location.state?.redirect || '/parking'
  const parkingData = location.state?.parking || null

  const [code, setCode] = useState('')
  const [scanning, setScanning] = useState(false)
  const [scanned, setScanned] = useState(false)
  const [error, setError] = useState('')
  const [linePos, setLinePos] = useState(0)
  const animRef = useRef(null)
  const dirRef = useRef(1)

  useEffect(() => {
    const tick = () => {
      setLinePos(prev => {
        const next = prev + dirRef.current * 1.2
        if (next >= 100) { dirRef.current = -1; return 100 }
        if (next <= 0) { dirRef.current = 1; return 0 }
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
    setTimeout(() => {
      setScanning(false)
      setScanned(true)
      setTimeout(() => {
        navigate(redirect, { state: parkingData })
      }, 1600)
    }, 1800)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') handleScan()
  }

  const handleDemo = () => {
    setCode('PKF-DEMO1234')
    setTimeout(handleScan, 100)
  }

  return (
    <div className="scan-page" style={{ paddingTop: 'var(--nav-h)', minHeight: '100vh' }}>
      <ScanBackground cdn={CDN} />
      <Container className="position-relative" style={{ zIndex: 1, paddingTop: 40, paddingBottom: 60 }}>
        <Row className="justify-content-center">
          <Col md={10} lg={8} xl={6}>
            <ScanHeader cdn={CDN} />
            <ScanFrame scanning={scanning} scanned={scanned} linePos={linePos} />

            {!scanned && (
              <ScanManualInput
                code={code}
                scanning={scanning}
                error={error}
                onCodeChange={(event) => { setCode(event.target.value.toUpperCase()); setError('') }}
                onKeyDown={handleKeyDown}
                onScan={handleScan}
              />
            )}

            {!scanned && !scanning && (
              <ScanDemoActions
                onBooking={() => navigate('/parking')}
                onDemo={handleDemo}
              />
            )}

            <ScanFooterBack onBack={() => navigate('/')} />
          </Col>
        </Row>
      </Container>
    </div>
  )
}
