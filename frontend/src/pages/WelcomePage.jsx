import { useNavigate } from 'react-router-dom'
import { loginAnonymous, setToken } from '../api/client'

function WelcomePage() {
  const navigate = useNavigate()

  async function handleAnonymous() {
    const data = await loginAnonymous()
    setToken(data.token)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    navigate('/dashboard')
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>CyberShield</h1>
      <p>Document, track, and report cyberbullying incidents safely.</p>
      <div style={{ marginTop: '40px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
        <button onClick={() => navigate('/login')}>Login</button>
        <button onClick={() => navigate('/register')}>Register</button>
        <button onClick={handleAnonymous}>Continue Anonymously</button>
      </div>
    </div>
  )
}

export default WelcomePage