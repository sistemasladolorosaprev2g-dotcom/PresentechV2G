import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function AdminRoute({ children }) {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  // Verificar si el usuario tiene el rol de admin
  if (user?.rol !== 'admin') {
    return <Navigate to="/clases" replace />
  }

  return children
}
