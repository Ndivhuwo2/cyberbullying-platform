import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { forgotPassword } from '../api/client'

function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      await forgotPassword(email)
      setSuccess('If that email exists, a reset link has been sent. Check your inbox.')
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
          <div className="text-4xl mb-3">🔑</div>
          <h2 className="text-2xl font-bold text-pink-700">Forgot your password?</h2>
          <p className="text-gray-400 text-sm mt-1">Enter your email and we will send you a reset link</p>
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
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}
          <button onClick={handleSubmit} disabled={loading} className="w-full bg-pink-700 hover:bg-pink-800 text-white py-3 rounded-xl text-sm font-semibold transition-colors">
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </div>
        <p className="text-center text-sm text-gray-400 mt-6">
          <span className="text-pink-700 cursor-pointer hover:underline" onClick={() => navigate('/login')}>Back to Login</span>
        </p>
      </div>
    </div>
  )
}

export default ForgotPasswordPage