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
    <div style={{ maxWidth: '400px', margin: '100px auto', textAlign: 'center' }}>
      <h2>Create Account</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ display: 'block', width: '100%', marginBottom: '12px', padding: '8px' }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ display: 'block', width: '100%', marginBottom: '12px', padding: '8px' }}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleRegister} disabled={loading}>
        {loading ? 'Creating account...' : 'Register'}
      </button>
      <p style={{ marginTop: '16px' }}>
        Already have an account?{' '}
        <span style={{ cursor: 'pointer', color: 'blue' }} onClick={() => navigate('/login')}>Login</span>
      </p>
    </div>
  )
}

export default RegisterPage