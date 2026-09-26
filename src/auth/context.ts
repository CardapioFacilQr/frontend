import { createContext } from 'react'
import type { RegisterInput, User } from '../lib/types'

export interface AuthContextValue {
  token: string | null
  user: User | null
  /** true enquanto valida o token salvo ao abrir o app. */
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (input: RegisterInput) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
