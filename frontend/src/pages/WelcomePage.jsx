import { useNavigate } from 'react-router-dom'

function WelcomePage() {
  const navigate = useNavigate()

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>CyberShield</h1>
      <p>Document, track, and report cyberbullying incidents safely.</p>
      <div style={{ marginTop: '40px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
        <button onClick={() => navigate('/login')}>Login</button>
        <button onClick={() => navigate('/register')}>Register</button>
        <button onClick={() => navigate('/dashboard')}>Continue Anonymously</button>
      </div>
    </div>
  )
}

export default WelcomePage