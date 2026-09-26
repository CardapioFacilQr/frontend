export function Spinner({ label = 'Carregando…' }: { label?: string }) {
  return (
    <div className="spinner" role="status">
      <span className="spinner-ring" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}
