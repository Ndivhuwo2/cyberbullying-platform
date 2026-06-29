import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerUser, setToken } from '../api/client'

function RegisterPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister() {
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.')
      return
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const data = await registerUser(email, password)
      setToken(data.token)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-violet-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-12 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🛡️</div>
          <h2 className="text-2xl font-bold text-violet-800">Create an account</h2>
          <p className="text-gray-400 text-sm mt-1">Join CyberShield — it's free and confidential</p>
        </div>
        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-400"
            style={{ WebkitBoxShadow: '0 0 0px 1000px white inset' }}
          />
          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-400"
            style={{ WebkitBoxShadow: '0 0 0px 1000px white inset' }}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button onClick={handleRegister} disabled={loading} className="w-full bg-gradient-to-r from-purple-700 to-blue-700 hover:from-purple-800 hover:to-blue-800 text-white py-3 rounded-xl text-sm font-semibold transition-colors shadow-sm">
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </div>
        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{' '}
          <span className="text-violet-700 font-semibold cursor-pointer hover:underline" onClick={() => navigate('/login')}>Login</span>
        </p>
        <p className="text-center text-sm text-gray-400 mt-2">
          <span className="text-violet-700 cursor-pointer hover:underline" onClick={() => navigate('/')}>Back to home</span>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage