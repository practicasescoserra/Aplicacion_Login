import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  const initial = user?.username?.[0]?.toUpperCase() || '?'

  return (
    <div className="min-h-screen bg-[#14161A] text-[#ECEAE4] flex items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-2xl overflow-hidden border border-[#2A2D33] shadow-2xl">
        <div className="bg-[#1D2025] p-10 flex flex-col">

          <div className="w-12 h-12 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/30 flex items-center justify-center mb-6">
            <span className="font-display text-lg text-[#C9A227]">{initial}</span>
          </div>

          <div className="space-y-4 mb-8">
            <div>
              <p className="text-xs text-[#8B8F97] uppercase tracking-wide">Usuario</p>
              <p className="text-sm mt-0.5">{user?.username}</p>
            </div>
            <div>
              <p className="text-xs text-[#8B8F97] uppercase tracking-wide">Correo</p>
              <p className="text-sm mt-0.5">{user?.email}</p>
            </div>
            <div>
              <p className="text-xs text-[#8B8F97] uppercase tracking-wide">Nombre completo</p>
              <p className="text-sm mt-0.5">{user?.full_name || '—'}</p>
            </div>
          </div>

          <div className="h-px bg-[#2A2D33] mb-6"></div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full border border-[#2A2D33] hover:border-[#C9A227] hover:text-[#C9A227] rounded-lg py-2.5 text-sm transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage