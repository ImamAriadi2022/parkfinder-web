import { Button, Card, Form, InputGroup } from 'react-bootstrap'

export default function ScanManualInput({ code, scanning, error, onCodeChange, onKeyDown, onScan }) {
  return (
    <Card className="animate-fade-up delay-2" style={{ marginTop: 24 }}>
      <Card.Body className="p-4">
        <p className="mb-3" style={{ color: 'var(--pf-text)', fontWeight: 600, fontSize: 15 }}>
          Masukkan Kode Tiket
        </p>
        <InputGroup className="mb-2">
          <InputGroup.Text>🎫</InputGroup.Text>
          <Form.Control
            placeholder="Contoh: PKF-A1B2C3D4"
            value={code}
            onChange={onCodeChange}
            onKeyDown={onKeyDown}
            disabled={scanning}
            style={{ textTransform: 'uppercase', letterSpacing: 2, fontFamily: 'monospace', fontSize: 16 }}
          />
        </InputGroup>
        {error && <small className="text-danger d-block mb-3">{error}</small>}

        <Button className="btn-pf-primary btn w-100 py-3" onClick={onScan} disabled={scanning}>
          {scanning ? (
            <span className="d-flex align-items-center justify-content-center gap-2">
              <span className="mini-spinner" /> Memverifikasi...
            </span>
          ) : 'Verifikasi Tiket'}
        </Button>
      </Card.Body>
    </Card>
  )
}
