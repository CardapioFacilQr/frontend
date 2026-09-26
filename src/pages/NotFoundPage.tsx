import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <main className="auth-page">
      <div className="card auth-card center">
        <h1>Página não encontrada</h1>
        <p className="muted">O endereço acessado não existe.</p>
        <Link className="btn btn-primary" to="/">
          Ir para o início
        </Link>
      </div>
    </main>
  )
}
