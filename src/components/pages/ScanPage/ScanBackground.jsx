export default function ScanBackground({ cdn }) {
  return (
    <div className="scan-bg">
      <img
        src={`${cdn}/background/bg-wellcome-dark.png`}
        alt=""
        className="scan-bg-img"
        onError={e => { e.target.style.display = 'none' }}
      />
      <div className="scan-bg-overlay" />
    </div>
  )
}
