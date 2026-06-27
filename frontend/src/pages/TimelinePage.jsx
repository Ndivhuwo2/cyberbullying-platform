import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getIncidentsByCaseId } from '../api/client'

function TimelinePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [incidents, setIncidents] = useState([])

  useEffect(() => {
    async function fetchIncidents() {
      const data = await getIncidentsByCaseId(id)
      const sorted = [...data.incidents].sort((a, b) => new Date(a.occurred_at) - new Date(b.occurred_at))
      setIncidents(sorted)
    }
    fetchIncidents()
  }, [id])

  return (
    <div style={{ maxWidth: '700px', margin: '60px auto', padding: '0 20px' }}>
      <button onClick={() => navigate(`/cases/${id}`)} style={{ marginBottom: '20px' }}>
        ← Back to Case
      </button>
      <h2>Incident Timeline</h2>

      {incidents.length === 0 ? (
        <p style={{ color: '#aaa' }}>No incidents logged yet.</p>
      ) : (
        incidents.map(incident => (
          <div
            key={incident.id}
            style={{
              borderLeft: '3px solid #4a90e2',
              paddingLeft: '16px',
              marginBottom: '24px'
            }}
          >
            <p style={{ margin: '0 0 4px', fontWeight: 'bold' }}>{incident.platform}</p>
            <p style={{ margin: '0 0 4px', color: '#aaa', fontSize: '13px' }}>
              Occurred: {new Date(incident.occurred_at).toLocaleString()}
            </p>
            <p style={{ margin: '0 0 4px', color: '#aaa', fontSize: '13px' }}>
              Logged: {new Date(incident.logged_at).toLocaleString()}
            </p>
            <p style={{ margin: '8px 0 0' }}>{incident.description}</p>
          </div>
        ))
      )}
    </div>
  )
}

export default TimelinePage