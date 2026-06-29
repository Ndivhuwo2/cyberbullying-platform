import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { resetPassword } from '../api/client'

function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleReset() {
    if (!password.trim() || !confirm.trim()) {
      setError('Please fill in both fields.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (!token) {
      setError('Invalid or missing reset token.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await resetPassword(token, password)
      setSuccess('Password reset successfully. Redirecting to login...')
      setTimeout(() => navigate('/login'), 2000)
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
          <div className="text-4xl mb-3">🔒</div>
          <h2 className="text-2xl font-bold text-violet-800">Reset your password</h2>
          <p className="text-gray-400 text-sm mt-1">Enter a new password for your account</p>
        </div>
        <div className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="New password (min 6 characters)"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-400"
            style={{ WebkitBoxShadow: '0 0 0px 1000px white inset' }}
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-400"
            style={{ WebkitBoxShadow: '0 0 0px 1000px white inset' }}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}
          <button onClick={handleReset} disabled={loading} className="w-full bg-gradient-to-r from-purple-700 to-blue-700 hover:from-purple-800 hover:to-blue-800 text-white py-3 rounded-xl text-sm font-semibold transition-colors shadow-sm">
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </div>
        <p className="text-center text-sm text-gray-400 mt-6">
          <span className="text-violet-700 cursor-pointer hover:underline" onClick={() => navigate('/login')}>Back to Login</span>
        </p>
      </div>
    </div>
  )
}

export default ResetPasswordPage