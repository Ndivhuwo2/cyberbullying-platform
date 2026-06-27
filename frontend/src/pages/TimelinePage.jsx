import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getIncidentsByCaseId } from '../api/client'
import useAuth from '../hooks/useAuth'

function TimelinePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [incidents, setIncidents] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchIncidents() {
      try {
        const data = await getIncidentsByCaseId(id)
        const sorted = [...data.incidents].sort((a, b) => new Date(a.occurred_at) - new Date(b.occurred_at))
        setIncidents(sorted)
      } catch (err) {
        setError(err.message)
      }
    }
    fetchIncidents()
  }, [id])

  return (
    <div className="min-h-screen bg-pink-50">
      {/* Navbar */}
      <div className="bg-white border-b border-pink-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🛡️</span>
          <span className="text-lg font-bold text-pink-700">CyberShield</span>
        </div>
        <button onClick={() => navigate(`/cases/${id}`)} className="bg-pink-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-pink-800 transition-colors">
          ← Back to Case
        </button>
      </div>

      {/* Banner */}
      <div className="bg-pink-700 px-6 py-5">
        <p className="text-pink-200 text-xs mb-1">Case Timeline</p>
        <h2 className="text-white font-bold text-xl">Incident History</h2>
        <p className="text-pink-200 text-xs mt-1">{incidents.length} incident{incidents.length !== 1 ? 's' : ''} recorded</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {incidents.length === 0 ? (
          <div className="bg-white rounded-2xl border border-pink-100 p-10 text-center">
            <div className="text-4xl mb-3">🕒</div>
            <p className="text-gray-500 text-sm">No incidents logged yet.</p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-pink-200"></div>
            {incidents.map((incident, index) => (
              <div key={incident.id} className="relative pl-12 mb-6">
                <div className="absolute left-2.5 top-1.5 w-3 h-3 bg-pink-700 rounded-full border-2 border-pink-200"></div>
                <div className="bg-white rounded-xl border border-pink-100 p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-pink-100 text-pink-700 text-xs font-semibold px-3 py-1 rounded-full">{incident.platform}</span>
                    <span className="text-xs text-gray-400">{new Date(incident.occurred_at).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{incident.description}</p>
                  <p className="text-xs text-gray-400 mt-2">Logged: {new Date(incident.logged_at).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TimelinePage