import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { api, onUnauthorized, tokenStorage } from '../lib/api'
import type { AuthResponse, RegisterInput, User } from '../lib/types'
import { AuthContext } from './context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => tokenStorage.get())
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(() => tokenStorage.get() !== null)

  const logout = useCallback(() => {
    tokenStorage.clear()
    setToken(null)
    setUser(null)
  }, [])

  // Token expirado em qualquer chamada -> volta para o login.
  useEffect(() => {
    onUnauthorized(logout)
    return () => onUnauthorized(null)
  }, [logout])

  // Ao abrir o app com token salvo, confirma com a API e carrega o usuário.
  useEffect(() => {
    const saved = tokenStorage.get()
    if (!saved) return
    let active = true
    api
      .me()
      .then((me) => active && setUser(me))
      .catch(() => undefined) // 401 já dispara logout; erro de rede mantém a sessão
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [])

  const startSession = useCallback((res: AuthResponse) => {
    tokenStorage.set(res.accessToken)
    setToken(res.accessToken)
    setUser(res.user)
  }, [])

  const login = useCallback(
    async (email: string, password: string) => startSession(await api.login(email, password)),
    [startSession],
  )

  const register = useCallback(
    async (input: RegisterInput) => startSession(await api.register(input)),
    [startSession],
  )

  const value = useMemo(
    () => ({ token, user, loading, login, register, logout }),
    [token, user, loading, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
