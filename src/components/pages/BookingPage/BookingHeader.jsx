export default function BookingHeader({ title, subtitle }) {
  return (
    <>
      <h1 className="fw-bold mb-1" style={{ color: 'var(--pf-text)' }}>{title}</h1>
      <p className="mb-4">{subtitle}</p>
    </>
  )
}
