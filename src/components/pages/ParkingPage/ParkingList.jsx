import { Badge, Card, ProgressBar } from 'react-bootstrap'

export default function ParkingList({ parkings, selectedId, search, onSelect }) {
  const progressVariant = (occupancy) => occupancy >= 90 ? 'danger' : occupancy >= 75 ? 'warning' : 'info'

  return (
    <Card className="h-100">
      <Card.Header className="d-flex justify-content-between align-items-center bg-pf-card2 border-pf">
        <span style={{ fontWeight: 700, color: 'var(--pf-text)' }}>Gedung Tersedia</span>
        <Badge className="badge-pf-blue">{parkings.length} lokasi</Badge>
      </Card.Header>
      <div style={{ overflowY: 'auto', maxHeight: 580 }}>
        {parkings.length === 0 ? (
          <div className="text-center py-5">
            <span style={{ fontSize: 40 }}>🔍</span>
            <p className="mt-2">Tidak ditemukan: "{search}"</p>
          </div>
        ) : parkings.map(parking => (
          <div
            key={parking.id}
            className={`parking-list-item ${selectedId === parking.id ? 'item-selected' : ''} ${parking.occupancy >= 90 ? 'item-disabled' : ''}`}
            onClick={() => parking.occupancy < 90 && onSelect(parking)}
          >
            <div className="d-flex justify-content-between align-items-start mb-1">
              <div>
                <div className="item-name">{parking.name}</div>
                <small style={{ color: 'var(--pf-text3)' }}>{parking.address}</small>
              </div>
              <Badge className={`badge-pf-${parking.tagClass} ms-2 flex-shrink-0`}>{parking.tag}</Badge>
            </div>
            <ProgressBar now={parking.occupancy} variant={progressVariant(parking.occupancy)} style={{ height: 5, margin: '8px 0' }} />
            <div className="d-flex justify-content-between">
              <small style={{ color: 'var(--pf-text2)' }}>{parking.slots}</small>
              <small style={{ color: 'var(--pf-text2)' }}>{parking.distance}</small>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
