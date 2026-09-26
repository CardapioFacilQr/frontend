import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Alert } from '../components/Alert'
import { ItemForm } from '../components/ItemForm'
import { QrCodeCard } from '../components/QrCodeCard'
import { Spinner } from '../components/Spinner'
import { api } from '../lib/api'
import { errorText } from '../lib/errors'
import { ACCEPTED_FILES, formatPrice, SOURCE_LABEL } from '../lib/format'
import type { Menu, MenuItem, MenuItemInput } from '../lib/types'

export function MenuDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()

  const [menu, setMenu] = useState<Menu | null>(null)
  const [items, setItems] = useState<MenuItem[]>([])
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    Promise.all([api.getMenu(id), api.listItems(id)])
      .then(([loadedMenu, loadedItems]) => {
        setMenu(loadedMenu)
        setItems(loadedItems)
      })
      .catch((err) => setLoadError(errorText(err)))
  }, [id])

  if (loadError) {
    return (
      <>
        <Alert>{loadError}</Alert>
        <Link to="/painel">← Voltar para meus cardápios</Link>
      </>
    )
  }
  if (!menu) return <Spinner label="Carregando cardápio…" />

  async function handleDelete() {
    if (!menu || !window.confirm(`Excluir o cardápio "${menu.title}"? O QR Code deixará de funcionar.`)) {
      return
    }
    try {
      await api.deleteMenu(menu.id)
      navigate('/painel', { replace: true })
    } catch (err) {
      window.alert(errorText(err))
    }
  }

  return (
    <>
      <Link to="/painel" className="back-link">
        ← Meus cardápios
      </Link>
      <h1>{menu.title}</h1>

      <div className="detail-layout">
        <div className="stack">
          <MenuSettings menu={menu} onSaved={setMenu} />
          <MenuItems menuId={menu.id} items={items} onChange={setItems} />
          <section className="card danger-zone">
            <h2>Excluir cardápio</h2>
            <p className="muted">Remove o cardápio, o arquivo e os itens. O QR Code impresso deixa de funcionar.</p>
            <button type="button" className="btn btn-danger" onClick={handleDelete}>
              Excluir cardápio
            </button>
          </section>
        </div>
        <QrCodeCard menu={menu} />
      </div>
    </>
  )
}

function MenuSettings({ menu, onSaved }: { menu: Menu; onSaved: (menu: Menu) => void }) {
  const [title, setTitle] = useState(menu.title)
  const [file, setFile] = useState<File | null>(null)
  const [fileKey, setFileKey] = useState(0) // recria o <input type=file> para limpá-lo
  const [message, setMessage] = useState<{ tone: 'error' | 'success'; text: string } | null>(null)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage(null)
    setSaving(true)
    try {
      const updated = await api.updateMenu(menu.id, { title: title.trim(), file })
      onSaved(updated)
      setFile(null)
      setFileKey((k) => k + 1)
      setMessage({ tone: 'success', text: 'Alterações salvas.' })
    } catch (err) {
      setMessage({ tone: 'error', text: errorText(err) })
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="card">
      <h2>Dados do cardápio</h2>
      <p className="muted">
        Tipo: <span className="badge">{SOURCE_LABEL[menu.sourceType]}</span>
        {menu.fileUrl && (
          <>
            {' · '}
            <a href={menu.fileUrl} target="_blank" rel="noreferrer">
              ver arquivo atual
            </a>
          </>
        )}
      </p>
      <form className="stack" onSubmit={handleSubmit}>
        <label>
          Título
          <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={150} required />
        </label>
        <label>
          <span>
            {menu.fileUrl ? 'Substituir arquivo' : 'Enviar arquivo'}{' '}
            <span className="muted">(JPG, PNG, WEBP ou PDF)</span>
          </span>
          <input
            key={fileKey}
            type="file"
            accept={ACCEPTED_FILES}
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>
        {message && <Alert tone={message.tone}>{message.text}</Alert>}
        <div className="actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Salvando…' : 'Salvar'}
          </button>
        </div>
      </form>
    </section>
  )
}

function MenuItems({
  menuId,
  items,
  onChange,
}: {
  menuId: string
  items: MenuItem[]
  onChange: (items: MenuItem[]) => void
}) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState('')

  async function create(input: MenuItemInput) {
    const created = await api.createItem(menuId, { ...input, position: items.length })
    onChange([...items, created])
  }

  async function update(itemId: string, input: MenuItemInput) {
    const updated = await api.updateItem(menuId, itemId, input)
    onChange(items.map((item) => (item.id === itemId ? updated : item)))
    setEditingId(null)
  }

  async function remove(item: MenuItem) {
    if (!window.confirm(`Remover "${item.name}"?`)) return
    setError('')
    try {
      await api.deleteItem(menuId, item.id)
      onChange(items.filter((i) => i.id !== item.id))
    } catch (err) {
      setError(errorText(err))
    }
  }

  return (
    <section className="card">
      <h2>Itens do cardápio</h2>
      <p className="muted">
        Opcional quando você já enviou um arquivo. Os itens aparecem na página pública, agrupados por
        categoria.
      </p>

      {items.length > 0 && (
        <ul className="item-list">
          {items.map((item) =>
            editingId === item.id ? (
              <li key={item.id}>
                <ItemForm
                  initial={item}
                  submitLabel="Salvar item"
                  onSubmit={(input) => update(item.id, input)}
                  onCancel={() => setEditingId(null)}
                />
              </li>
            ) : (
              <li key={item.id} className="item-row">
                <div>
                  <strong>{item.name}</strong>
                  {item.category && <span className="badge">{item.category}</span>}
                  {item.description && <p className="muted">{item.description}</p>}
                </div>
                <span className="price">{formatPrice(item.price)}</span>
                <div className="actions">
                  <button type="button" className="btn btn-ghost" onClick={() => setEditingId(item.id)}>
                    Editar
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={() => remove(item)}>
                    Remover
                  </button>
                </div>
              </li>
            ),
          )}
        </ul>
      )}
      <Alert>{error}</Alert>

      <h3>Adicionar item</h3>
      <ItemForm submitLabel="Adicionar item" onSubmit={create} />
    </section>
  )
}
