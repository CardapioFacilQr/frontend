import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Spinner } from '../components/Spinner'
import { useAuth } from './useAuth'

/** Protege as rotas do painel: sem token, manda para o login e volta depois. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { token, loading } = useAuth()
  const location = useLocation()

  if (loading) return <Spinner label="Carregando sua conta…" />
  if (!token) return <Navigate to="/entrar" replace state={{ from: location.pathname }} />
  return children
}
