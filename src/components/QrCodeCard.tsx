import { useState } from 'react'
import { qrCodeUrl } from '../lib/api'
import type { Menu } from '../lib/types'

export function QrCodeCard({ menu }: { menu: Menu }) {
  const [copied, setCopied] = useState(false)

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(menu.publicUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt('Copie o link:', menu.publicUrl)
    }
  }

  return (
    <section className="card qr-card">
      <h2>QR Code</h2>
      <img
        className="qr-image"
        src={qrCodeUrl(menu.publicSlug)}
        alt={`QR Code do cardápio ${menu.title}`}
        width="220"
        height="220"
      />
      <p className="qr-link">
        <a href={menu.publicUrl} target="_blank" rel="noreferrer">
          {menu.publicUrl}
        </a>
      </p>
      <div className="actions">
        <a className="btn btn-primary" href={qrCodeUrl(menu.publicSlug, 'png', true)}>
          Baixar PNG
        </a>
        <a className="btn" href={qrCodeUrl(menu.publicSlug, 'svg', true)}>
          Baixar SVG
        </a>
        <button type="button" className="btn" onClick={copyLink}>
          {copied ? 'Link copiado!' : 'Copiar link'}
        </button>
      </div>
      <p className="hint">Use o SVG para impressão em tamanho grande, sem perder qualidade.</p>
    </section>
  )
}
