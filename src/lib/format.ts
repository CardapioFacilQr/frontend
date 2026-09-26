import type { SourceType } from './types'

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const date = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' })

export const formatPrice = (value: number) => currency.format(value)

export const formatDate = (iso: string) => date.format(new Date(iso))

export const SOURCE_LABEL: Record<SourceType, string> = {
  image: 'Imagem',
  pdf: 'PDF',
  manual: 'Itens',
}

export const ACCEPTED_FILES = 'image/jpeg,image/png,image/webp,application/pdf'
