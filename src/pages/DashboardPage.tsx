import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Alert } from '../components/Alert'
import { Spinner } from '../components/Spinner'
import { api, qrCodeUrl } from '../lib/api'
import { errorText } from '../lib/errors'
import { ACCEPTED_FILES, formatDate, SOURCE_LABEL } from '../lib/format'
import type { Menu } from '../lib/types'

export function DashboardPage() {
  const navigate = useNavigate()
  const [menus, setMenus] = useState<Menu[] | null>(null)
  const [loadError, setLoadError] = useState('')

  const [title, setTitle] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [createError, setCreateError] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    api
      .listMenus()
      .then(setMenus)
      .catch((err) => setLoadError(errorText(err)))
  }, [])

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setCreateError('')
    setCreating(true)
    try {
      const menu = await api.createMenu(title.trim(), file)
      navigate(`/painel/cardapios/${menu.id}`)
    } catch (err) {
      setCreateError(errorText(err))
      setCreating(false)
    }
  }

  return (
    <>
      <h1>Meus cardápios</h1>

      <section className="card">
        <h2>Novo cardápio</h2>
        <form className="stack" onSubmit={handleCreate}>
          <label>
            Título
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex.: Cardápio de Almoço"
              maxLength={150}
              required
            />
          </label>
          <label>
            <span>
              Arquivo do cardápio <span className="muted">(JPG, PNG, WEBP ou PDF)</span>
            </span>
            <input
              type="file"
              accept={ACCEPTED_FILES}
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>
          <p className="hint">
            Sem arquivo? Crie assim mesmo e cadastre os pratos um a um na próxima tela.
          </p>
          <Alert>{createError}</Alert>
          <div className="actions">
            <button type="submit" className="btn btn-primary" disabled={creating}>
              {creating ? 'Enviando…' : 'Criar e gerar QR Code'}
            </button>
          </div>
        </form>
      </section>

      <Alert>{loadError}</Alert>
      {!menus && !loadError && <Spinner label="Carregando cardápios…" />}
      {menus?.length === 0 && (
        <p className="empty">Você ainda não tem cardápios. Crie o primeiro acima.</p>
      )}

      {menus && menus.length > 0 && (
        <ul className="menu-grid">
          {menus.map((menu) => (
            <li key={menu.id} className="card menu-card">
              <img
                src={qrCodeUrl(menu.publicSlug)}
                alt=""
                width="96"
                height="96"
                className="menu-card-qr"
                loading="lazy"
              />
              <div className="menu-card-body">
                <h3>{menu.title}</h3>
                <p className="muted">
                  <span className="badge">{SOURCE_LABEL[menu.sourceType]}</span> · criado em{' '}
                  {formatDate(menu.createdAt)}
                </p>
                <div className="actions">
                  <Link className="btn btn-primary" to={`/painel/cardapios/${menu.id}`}>
                    Gerenciar
                  </Link>
                  <a className="btn" href={menu.publicUrl} target="_blank" rel="noreferrer">
                    Ver público
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
