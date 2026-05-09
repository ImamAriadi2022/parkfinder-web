import { Badge, Button } from 'react-bootstrap'

export default function MyBookingFilters({ filter, onChange, activeCount, totalCount }) {
  const filters = [
    { key: 'active', label: 'Aktif', count: activeCount },
    { key: 'all', label: 'Semua', count: totalCount },
  ]

  return (
    <div className="d-flex gap-2 mb-4">
      {filters.map(item => (
        <Button
          key={item.key}
          size="sm"
          className={filter === item.key ? 'btn-pf-primary btn' : 'btn-pf-ghost btn'}
          onClick={() => onChange(item.key)}
        >
          {item.label}
          <Badge
            className={`ms-2 ${filter === item.key ? '' : 'badge-pf-blue'}`}
            bg={filter === item.key ? 'light' : ''}
            style={{ color: filter === item.key ? 'var(--pf-accent)' : undefined }}
          >
            {item.count}
          </Badge>
        </Button>
      ))}
    </div>
  )
}
