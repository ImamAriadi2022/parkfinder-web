import { Col, Row } from 'react-bootstrap'

export default function MyBookingStats({ activeCount, expiredCount, totalCount }) {
  const items = [
    { label: 'Aktif', value: activeCount, color: 'var(--pf-accent)', bg: 'rgba(0,210,255,0.08)', border: 'var(--pf-border2)' },
    { label: 'Selesai', value: expiredCount, color: 'var(--pf-text3)', bg: 'transparent', border: 'var(--pf-border)' },
    { label: 'Total', value: totalCount, color: 'var(--pf-text)', bg: 'transparent', border: 'var(--pf-border)' },
  ]

  return (
    <Row className="g-3 mb-4">
      {items.map(item => (
        <Col xs={4} key={item.label}>
          <div className="stat-card" style={{ background: item.bg, borderColor: item.border }}>
            <div className="stat-card-value" style={{ color: item.color }}>{item.value}</div>
            <div className="stat-card-label">{item.label}</div>
          </div>
        </Col>
      ))}
    </Row>
  )
}
