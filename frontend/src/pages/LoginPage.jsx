import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser, setToken } from '../api/client'

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const data = await loginUser(email, password)
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
    <div className="min-h-screen bg-pink-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-12 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🛡️</div>
          <h2 className="text-2xl font-bold text-pink-700">Welcome back</h2>
          <p className="text-gray-400 text-sm mt-1">Login to your CyberShield account</p>
        </div>
        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-400"
            style={{ WebkitBoxShadow: '0 0 0px 1000px white inset' }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-400"
            style={{ WebkitBoxShadow: '0 0 0px 1000px white inset' }}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button onClick={handleLogin} disabled={loading} className="w-full bg-pink-700 hover:bg-pink-800 text-white py-3 rounded-xl text-sm font-semibold transition-colors">
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <p className="text-center text-sm text-gray-400">
            <span
              className="text-pink-700 cursor-pointer hover:underline"
              onClick={() => navigate('/forgot-password')}
            >
              Forgot your password?
            </span>
          </p>
        </div>
        <p className="text-center text-sm text-gray-400 mt-6">
          Don't have an account?{' '}
          <span className="text-pink-700 font-semibold cursor-pointer hover:underline" onClick={() => navigate('/register')}>Register</span>
        </p>
        <p className="text-center text-sm text-gray-400 mt-2">
          <span className="text-pink-700 cursor-pointer hover:underline" onClick={() => navigate('/')}>Back to home</span>
        </p>
      </div>
    </div>
  )
}

export default LoginPage