import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Spinner } from '../components/Spinner'
import { api, ApiError } from '../lib/api'
import { formatPrice } from '../lib/format'
import type { PublicMenu } from '../lib/types'

type Item = PublicMenu['items'][number]

function groupByCategory(items: Item[]) {
  const groups = new Map<string, Item[]>()
  for (const item of items) {
    const key = item.category?.trim() || 'Outros'
    groups.set(key, [...(groups.get(key) ?? []), item])
  }
  return [...groups.entries()]
}

/** Página aberta pelo QR Code: /m/:slug (sem login). */
export function PublicMenuPage() {
  const { slug = '' } = useParams()
  const [menu, setMenu] = useState<PublicMenu | null>(null)
  const [error, setError] = useState<'not-found' | 'failed' | null>(null)

  useEffect(() => {
    api
      .publicMenu(slug)
      .then((data) => {
        setMenu(data)
        document.title = `${data.restaurant.name} · ${data.title}`
      })
      .catch((err) => setError(err instanceof ApiError && err.status === 404 ? 'not-found' : 'failed'))
  }, [slug])

  if (error) {
    return (
      <main className="public-page">
        <div className="card center">
          <h1>{error === 'not-found' ? 'Cardápio não encontrado' : 'Não foi possível carregar'}</h1>
          <p className="muted">
            {error === 'not-found'
              ? 'Este QR Code não está mais ativo. Peça o cardápio ao atendente.'
              : 'Verifique sua conexão e tente de novo.'}
          </p>
          {error === 'failed' && (
            <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>
              Tentar novamente
            </button>
          )}
        </div>
      </main>
    )
  }
  if (!menu) return <Spinner label="Abrindo cardápio…" />

  const isPdf = menu.sourceType === 'pdf'
  const isImage = menu.sourceType === 'image'

  return (
    <main className="public-page">
      <header className="public-header">
        <p className="muted">{menu.restaurant.name}</p>
        <h1>{menu.title}</h1>
      </header>

      {isImage && menu.fileUrl && (
        <a href={menu.fileUrl} target="_blank" rel="noreferrer" className="public-image">
          <img src={menu.fileUrl} alt={`Cardápio ${menu.title}`} />
        </a>
      )}

      {isPdf && menu.fileUrl && (
        <section className="public-pdf">
          <a className="btn btn-primary btn-block" href={menu.fileUrl} target="_blank" rel="noreferrer">
            Abrir cardápio (PDF)
          </a>
          {/* Navegadores de celular costumam não exibir PDF embutido: o botão acima sempre funciona. */}
          <object data={menu.fileUrl} type="application/pdf" className="pdf-frame" aria-label="Cardápio em PDF" />
        </section>
      )}

      {menu.items.length > 0 &&
        groupByCategory(menu.items).map(([category, items]) => (
          <section key={category} className="public-category">
            <h2>{category}</h2>
            <ul>
              {items.map((item) => (
                <li key={item.id} className="public-item">
                  {item.photoUrl && <img src={item.photoUrl} alt="" loading="lazy" />}
                  <div>
                    <div className="public-item-head">
                      <strong>{item.name}</strong>
                      <span className="price">{formatPrice(item.price)}</span>
                    </div>
                    {item.description && <p className="muted">{item.description}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}

      {menu.sourceType === 'manual' && menu.items.length === 0 && (
        <p className="empty">Este cardápio ainda não tem itens.</p>
      )}
    </main>
  )
}
