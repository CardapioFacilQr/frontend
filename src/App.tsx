import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthProvider'
import { RequireAuth } from './auth/RequireAuth'
import { Layout } from './components/Layout'
import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/LoginPage'
import { MenuDetailPage } from './pages/MenuDetailPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { PublicMenuPage } from './pages/PublicMenuPage'
import { RegisterPage } from './pages/RegisterPage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Público */}
          <Route path="/m/:slug" element={<PublicMenuPage />} />
          <Route path="/entrar" element={<LoginPage />} />
          <Route path="/cadastro" element={<RegisterPage />} />

          {/* Painel do dono (requer login) */}
          <Route
            element={
              <RequireAuth>
                <Layout />
              </RequireAuth>
            }
          >
            <Route path="/painel" element={<DashboardPage />} />
            <Route path="/painel/cardapios/:id" element={<MenuDetailPage />} />
          </Route>

          <Route path="/" element={<Navigate to="/painel" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
