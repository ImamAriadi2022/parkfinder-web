import { Badge, Button } from 'react-bootstrap'

export default function MyBookingFilters({ filter, onChange, activeCount, totalCount, onClearAll }) {
  const filters = [
    { key: 'active', label: 'Aktif', count: activeCount },
    { key: 'all', label: 'Semua', count: totalCount },
  ]

  return (
    <div className="d-flex gap-2 mb-4 align-items-center flex-wrap">
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

      {totalCount > 0 && onClearAll && (
        <Button
          size="sm"
          variant="outline-danger"
          className="ms-auto btn-pf-danger-outline"
          onClick={onClearAll}
          style={{ fontSize: 13, borderRadius: 10, padding: '6px 14px' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="me-1" style={{ verticalAlign: 'text-bottom' }}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          Hapus Semua
        </Button>
      )}
    </div>
  )
}
