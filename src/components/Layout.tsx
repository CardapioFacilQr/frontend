import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

/** Moldura das telas do dono (painel). */
export function Layout() {
  const { user, logout } = useAuth()

  return (
    <>
      <header className="topbar">
        <Link to="/painel" className="brand">
          <img src="/favicon.svg" alt="" width="24" height="24" />
          Cardápio Fácil
        </Link>
        <div className="topbar-user">
          {user && <span className="muted">{user.name}</span>}
          <button type="button" className="btn btn-ghost" onClick={logout}>
            Sair
          </button>
        </div>
      </header>
      <main className="container">
        <Outlet />
      </main>
    </>
  )
}
