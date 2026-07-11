import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children }) {
  const { accessToken, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#14161A] text-[#ECEAE4] flex items-center justify-center">
        <p className="text-sm text-[#8B8F97]">Cargando...</p>
      </div>
    )
  }

  if (!accessToken) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute