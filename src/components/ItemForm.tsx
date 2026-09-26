import { useState, type FormEvent } from 'react'
import type { MenuItem, MenuItemInput } from '../lib/types'
import { errorText } from '../lib/errors'
import { Alert } from './Alert'

interface Props {
  initial?: MenuItem
  submitLabel: string
  onSubmit: (input: MenuItemInput) => Promise<void>
  onCancel?: () => void
}

/** Formulário de item do cardápio (usado para criar e para editar). */
export function ItemForm({ initial, submitLabel, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? '')
  const [price, setPrice] = useState(initial ? String(initial.price) : '')
  const [category, setCategory] = useState(initial?.category ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const parsedPrice = Number(price.replace(',', '.'))
    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      setError('Informe um preço válido, por exemplo 29,90.')
      return
    }

    setError('')
    setSaving(true)
    try {
      await onSubmit({
        name: name.trim(),
        price: Math.round(parsedPrice * 100) / 100,
        category: category.trim() || undefined,
        description: description.trim() || undefined,
      })
      if (!initial) {
        setName('')
        setPrice('')
        setDescription('')
      }
    } catch (err) {
      setError(errorText(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="item-form" onSubmit={handleSubmit}>
      <div className="grid-2">
        <label>
          Nome
          <input value={name} onChange={(e) => setName(e.target.value)} required maxLength={150} />
        </label>
        <label>
          Preço (R$)
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            inputMode="decimal"
            placeholder="29,90"
            required
          />
        </label>
      </div>
      <label>
        <span>
          Categoria <span className="muted">(opcional)</span>
        </span>
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Ex.: Massas, Bebidas"
          maxLength={80}
        />
      </label>
      <label>
        <span>
          Descrição <span className="muted">(opcional)</span>
        </span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          maxLength={2000}
        />
      </label>
      <Alert>{error}</Alert>
      <div className="actions">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Salvando…' : submitLabel}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}
