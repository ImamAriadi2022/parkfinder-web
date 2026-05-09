export default function ScanFrame({ scanning, scanned, linePos }) {
  return (
    <div className="scan-frame-wrapper animate-fade-up delay-1">
      <div className={`scan-frame ${scanning ? 'scanning' : ''} ${scanned ? 'scanned' : ''}`}>
        <div className="corner tl" />
        <div className="corner tr" />
        <div className="corner bl" />
        <div className="corner br" />

        {!scanned && (
          <div className="scan-line" style={{ top: `${linePos}%` }} />
        )}

        <div className="scan-frame-content">
          {scanned ? (
            <div className="scan-success-content animate-fade-up">
              <div className="success-check">✓</div>
              <p className="success-text">Tiket Terverifikasi!</p>
            </div>
          ) : scanning ? (
            <div className="scanning-content">
              <div className="scan-spinner" />
              <p style={{ color: 'var(--pf-text2)', fontSize: 14, marginTop: 12 }}>Memverifikasi tiket...</p>
            </div>
          ) : (
            <div className="scan-idle-content">
              <div style={{ fontSize: 56, marginBottom: 12, opacity: 0.4 }}>📷</div>
              <p style={{ color: 'var(--pf-text3)', fontSize: 13, margin: 0 }}>
                Area scan QR
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
