import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginAnonymous, setToken } from '../api/client'

function WelcomePage() {
  const navigate = useNavigate()
  const [error, setError] = useState('')

  async function handleAnonymous() {
    try {
      const data = await loginAnonymous()
      setToken(data.token)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>CyberShield</h1>
      <p>Document, track, and report cyberbullying incidents safely.</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ marginTop: '40px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
        <button onClick={() => navigate('/login')}>Login</button>
        <button onClick={() => navigate('/register')}>Register</button>
        <button onClick={handleAnonymous}>Continue Anonymously</button>
      </div>
    </div>
  )
}

export default WelcomePage