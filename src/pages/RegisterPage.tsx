import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { Alert } from '../components/Alert'
import { errorText } from '../lib/errors'

export function RegisterPage() {
  const { token, register } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [restaurantName, setRestaurantName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)

  if (token) return <Navigate to="/painel" replace />

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSending(true)
    try {
      await register({ name, email, password, restaurantName })
      navigate('/painel', { replace: true })
    } catch (err) {
      setError(errorText(err))
      setSending(false)
    }
  }

  return (
    <main className="auth-page">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <img src="/favicon.svg" alt="" width="40" height="40" />
        <h1>Criar conta</h1>
        <p className="muted">Cadastre seu restaurante e gere o QR Code do cardápio.</p>
        <label>
          Seu nome
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            minLength={2}
            required
          />
        </label>
        <label>
          Nome do restaurante
          <input
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
            minLength={2}
            required
          />
        </label>
        <label>
          E-mail
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </label>
        <label>
          <span>
            Senha <span className="muted">(mínimo 8 caracteres)</span>
          </span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            minLength={8}
            maxLength={72}
            required
          />
        </label>
        <Alert>{error}</Alert>
        <button type="submit" className="btn btn-primary btn-block" disabled={sending}>
          {sending ? 'Criando conta…' : 'Criar conta'}
        </button>
        <p className="muted center">
          Já tem conta? <Link to="/entrar">Entrar</Link>
        </p>
      </form>
    </main>
  )
}
