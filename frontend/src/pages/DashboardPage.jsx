import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCases } from '../api/client'
import useAuth from '../hooks/useAuth'

function DashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [cases, setCases] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCases() {
      try {
        const data = await getCases()
        setCases(data.cases)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchCases()
  }, [])

  function handleLogout() {
    localStorage.clear()
    navigate('/')
  }

  return (
    <div style={{ maxWidth: '700px', margin: '60px auto', padding: '0 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>My Cases</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => navigate('/cases/new')}>+ New Case</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading ? (
        <p style={{ color: '#aaa' }}>Loading your cases...</p>
      ) : cases.length === 0 ? (
        <p>No cases yet. Create your first case to get started.</p>
      ) : (
        cases.map(c => (
          <div key={c.id} onClick={() => navigate(`/cases/${c.id}`)} style={{ border: '1px solid #444', borderRadius: '8px', padding: '16px', marginBottom: '12px', cursor: 'pointer' }}>
            <h3 style={{ margin: '0 0 8px' }}>{c.title}</h3>
            <p style={{ margin: 0, fontSize: '14px', color: '#aaa' }}>{c.incident_count} incidents - {c.evidence_count} evidence files - {c.status}</p>
          </div>
        ))
      )}
    </div>
  )
}

export default DashboardPage