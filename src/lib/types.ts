// Formatos devolvidos pela API (cardapio-api).

export type SourceType = 'image' | 'pdf' | 'manual'

export interface User {
  id: string
  name: string
  email: string
  createdAt?: string
}

export interface Restaurant {
  id: string
  name: string
  slug: string
  ownerId: string
  createdAt: string
}

export interface AuthResponse {
  accessToken: string
  tokenType: 'Bearer'
  user: User
  restaurant?: Restaurant | null
}

export interface Menu {
  id: string
  restaurantId: string
  title: string
  sourceType: SourceType
  fileUrl: string | null
  fileMimeType: string | null
  publicSlug: string
  /** Endereço que o QR Code abre. */
  publicUrl: string
  createdAt: string
  updatedAt: string
}

export interface MenuItem {
  id: string
  menuId: string
  name: string
  description: string | null
  price: number
  photoUrl: string | null
  category: string | null
  position: number
}

export interface MenuItemInput {
  name: string
  description?: string
  price: number
  photoUrl?: string
  category?: string
  position?: number
}

export interface PublicMenu {
  title: string
  publicSlug: string
  sourceType: SourceType
  fileUrl: string | null
  fileMimeType: string | null
  restaurant: { name: string; slug: string }
  items: Omit<MenuItem, 'menuId'>[]
  updatedAt: string
}

export interface RegisterInput {
  name: string
  email: string
  password: string
  restaurantName?: string
}
