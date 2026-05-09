import { Button } from 'react-bootstrap'

export default function ScanFooterBack({ onBack }) {
  return (
    <div className="text-center mt-4">
      <Button
        variant="link"
        style={{ color: 'var(--pf-text3)', fontSize: 13, textDecoration: 'none' }}
        onClick={onBack}
      >
        ← Kembali ke Beranda
      </Button>
    </div>
  )
}
