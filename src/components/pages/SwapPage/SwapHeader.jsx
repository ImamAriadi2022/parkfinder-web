import { Button } from 'react-bootstrap'

export default function SwapHeader({ onBack }) {
  return (
    <div className="d-flex align-items-center gap-3 mb-2">
      <Button
        variant="link"
        className="p-0 text-muted-pf"
        style={{ fontSize: 20, textDecoration: 'none' }}
        onClick={onBack}
      >
        ←
      </Button>
      <div>
        <h1 className="fw-bold mb-0" style={{ color: 'var(--pf-text)', fontSize: 28 }}>Tukar Slot Parkir</h1>
        <p className="mb-0" style={{ fontSize: 14 }}>Ganti slot parkir Anda ke lokasi yang diinginkan</p>
      </div>
    </div>
  )
}
