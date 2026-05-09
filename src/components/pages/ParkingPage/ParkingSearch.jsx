import { Button, Form, InputGroup } from 'react-bootstrap'

export default function ParkingSearch({ search, onChange, onClear }) {
  return (
    <InputGroup className="mb-4">
      <InputGroup.Text>🔍</InputGroup.Text>
      <Form.Control
        placeholder="Cari nama gedung parkir..."
        value={search}
        onChange={e => onChange(e.target.value)}
      />
      {search && (
        <Button variant="outline-secondary" className="border-pf" onClick={onClear}>✕</Button>
      )}
    </InputGroup>
  )
}
