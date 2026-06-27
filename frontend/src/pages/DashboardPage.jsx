import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function DashboardPage() {
  const navigate = useNavigate()
  const [cases, setCases] = useState([])
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  // MOCK — replace with getCases() from client.js when backend is ready
  useEffect(() => {
    setCases([
      { id: 'case-uuid-1', title: 'Instagram harassment — June 2026', status: 'open', incident_count: 4, evidence_count: 7 },
      { id: 'case-uuid-2', title: 'WhatsApp group bullying', status: 'open', incident_count: 2, evidence_count: 3 },
    ])
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

      {cases.length === 0 ? (
        <p>No cases yet. Create your first case to get started.</p>
      ) : (
        cases.map(c => (
          <div
            key={c.id}
            onClick={() => navigate(`/cases/${c.id}`)}
            style={{
              border: '1px solid #444',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '12px',
              cursor: 'pointer'
            }}
          >
            <h3 style={{ margin: '0 0 8px' }}>{c.title}</h3>
            <p style={{ margin: 0, fontSize: '14px', color: '#aaa' }}>
              {c.incident_count} incidents · {c.evidence_count} evidence files · {c.status}
            </p>
          </div>
        ))
      )}
    </div>
  )
}

export default DashboardPage