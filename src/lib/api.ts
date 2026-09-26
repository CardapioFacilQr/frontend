import type {
  AuthResponse,
  Menu,
  MenuItem,
  MenuItemInput,
  PublicMenu,
  RegisterInput,
  User,
} from './types'

/**
 * Endereço da API. Em produção vem de VITE_API_URL (.env.production);
 * em desenvolvimento fica vazio e o proxy do Vite encaminha /api para o backend.
 */
export const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '')

const TOKEN_KEY = 'cardapio.token'

// localStorage pode falhar (aba anônima, armazenamento bloqueado): nunca deixa quebrar a tela.
export const tokenStorage = {
  get(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY)
    } catch {
      return null
    }
  },
  set(token: string) {
    try {
      localStorage.setItem(TOKEN_KEY, token)
    } catch {
      /* segue só em memória */
    }
  },
  clear() {
    try {
      localStorage.removeItem(TOKEN_KEY)
    } catch {
      /* nada a limpar */
    }
  },
}

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

let unauthorizedHandler: (() => void) | null = null

/** Chamado quando a API recusa o token (expirado/inválido). */
export function onUnauthorized(handler: (() => void) | null) {
  unauthorizedHandler = handler
}

interface RequestOptions {
  method?: string
  body?: unknown
  /** false = não envia o token (rotas públicas, login e cadastro). */
  auth?: boolean
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = true } = options
  const headers: Record<string, string> = {}
  let payload: BodyInit | undefined

  if (body instanceof FormData) {
    payload = body // o navegador define o Content-Type multipart com boundary
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
    payload = JSON.stringify(body)
  }

  const token = auth ? tokenStorage.get() : null
  if (token) headers.Authorization = `Bearer ${token}`

  let res: Response
  try {
    res = await fetch(`${API_URL}${path}`, { method, headers, body: payload })
  } catch {
    throw new ApiError(0, 'Não foi possível conectar ao servidor. Verifique sua internet.')
  }

  if (res.status === 204) return undefined as T
  const data: unknown = await res.json().catch(() => null)

  if (!res.ok) {
    if (res.status === 401 && token) unauthorizedHandler?.()
    throw new ApiError(res.status, errorMessage(res.status, data))
  }
  return data as T
}

function errorMessage(status: number, data: unknown): string {
  if (status === 413) return 'Arquivo muito grande.'
  const message = (data as { message?: unknown } | null)?.message
  if (Array.isArray(message)) return message.join('\n')
  if (typeof message === 'string') return message
  return `Erro inesperado (${status}). Tente novamente.`
}

function menuFormData(fields: { title?: string; file?: File | null }) {
  const form = new FormData()
  if (fields.title !== undefined) form.append('title', fields.title)
  if (fields.file) form.append('file', fields.file)
  return form
}

export const api = {
  register: (input: RegisterInput) =>
    request<AuthResponse>('/api/auth/register', { method: 'POST', body: input, auth: false }),

  login: (email: string, password: string) =>
    request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: { email, password },
      auth: false,
    }),

  me: () => request<User>('/api/auth/me'),

  listMenus: () => request<Menu[]>('/api/menus'),

  getMenu: (id: string) => request<Menu>(`/api/menus/${id}`),

  createMenu: (title: string, file?: File | null) =>
    request<Menu>('/api/menus', { method: 'POST', body: menuFormData({ title, file }) }),

  updateMenu: (id: string, fields: { title?: string; file?: File | null }) =>
    request<Menu>(`/api/menus/${id}`, { method: 'PATCH', body: menuFormData(fields) }),

  deleteMenu: (id: string) => request<void>(`/api/menus/${id}`, { method: 'DELETE' }),

  listItems: (menuId: string) => request<MenuItem[]>(`/api/menus/${menuId}/items`),

  createItem: (menuId: string, input: MenuItemInput) =>
    request<MenuItem>(`/api/menus/${menuId}/items`, { method: 'POST', body: input }),

  updateItem: (menuId: string, itemId: string, input: Partial<MenuItemInput>) =>
    request<MenuItem>(`/api/menus/${menuId}/items/${itemId}`, { method: 'PATCH', body: input }),

  deleteItem: (menuId: string, itemId: string) =>
    request<void>(`/api/menus/${menuId}/items/${itemId}`, { method: 'DELETE' }),

  publicMenu: (slug: string) =>
    request<PublicMenu>(`/api/public/menus/${encodeURIComponent(slug)}`, { auth: false }),
}

/** URL da imagem do QR Code (rota pública da API, serve direto em <img> e em links de download). */
export function qrCodeUrl(slug: string, format: 'png' | 'svg' = 'png', download = false) {
  const params = new URLSearchParams({ format, size: '512' })
  if (download) params.set('download', 'true')
  return `${API_URL}/api/public/menus/${encodeURIComponent(slug)}/qrcode?${params}`
}
