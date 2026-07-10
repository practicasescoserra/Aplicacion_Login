import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { apiRequest } from '../api/client'

function RegisterPage() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [fullName, setFullName] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            await apiRequest('/auth/register', {
                method: 'POST',
                body: JSON.stringify({
                    username,
                    email,
                    full_name: fullName,
                    password,
                }),
            })
            navigate('/login')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }


    return (
    <div className="min-h-screen bg-[#14161A] text-[#ECEAE4] flex items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-2xl overflow-hidden border border-[#2A2D33] shadow-2xl">
        <div className="bg-[#1D2025] p-10 flex flex-col justify-center">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm text-[#B8BBC2] mb-1.5">
                Usuario
              </label>
              <input
                id="username"
                type="text"
                placeholder="sebastian123"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#14161A] border border-[#2A2D33] rounded-lg px-3.5 py-2.5 text-sm placeholder-[#5A5D64] focus:border-[#C9A227] transition-colors"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm text-[#B8BBC2] mb-1.5">
                Correo
              </label>
              <input
                id="email"
                type="email"
                placeholder="tucorreo@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#14161A] border border-[#2A2D33] rounded-lg px-3.5 py-2.5 text-sm placeholder-[#5A5D64] focus:border-[#C9A227] transition-colors"
              />
            </div>

            <div>
              <label htmlFor="full_name" className="block text-sm text-[#B8BBC2] mb-1.5">
                Nombre completo
              </label>
              <input
                id="full_name"
                type="text"
                placeholder="Sebastian Pérez"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#14161A] border border-[#2A2D33] rounded-lg px-3.5 py-2.5 text-sm placeholder-[#5A5D64] focus:border-[#C9A227] transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-[#B8BBC2] mb-1.5">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#14161A] border border-[#2A2D33] rounded-lg px-3.5 py-2.5 text-sm placeholder-[#5A5D64] focus:border-[#C9A227] transition-colors"
              />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C9A227] hover:bg-[#DBB438] disabled:opacity-50 text-[#14161A] font-medium rounded-lg py-2.5 text-sm transition-colors"
            >
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>

          <p className="text-center text-sm text-[#8B8F97] mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-[#ECEAE4] underline underline-offset-2 hover:text-[#C9A227]">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage