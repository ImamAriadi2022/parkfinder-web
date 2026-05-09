export default function ScanHeader({ cdn }) {
  return (
    <div className="text-center mb-5 animate-fade-up">
      <div className="scan-logo mb-3">
        <img
          src={`${cdn}/foto/logo.png`}
          alt="ParkFinder"
          style={{ height: 52, width: 'auto', objectFit: 'contain' }}
          onError={e => { e.target.style.display = 'none' }}
        />
      </div>
      <h1 className="scan-title">Scan Tiket Parkir</h1>
      <p style={{ color: 'var(--pf-text2)', fontSize: 15 }}>
        Masukkan kode tiket atau scan QR untuk mengakses sistem parkir
      </p>
    </div>
  )
}
