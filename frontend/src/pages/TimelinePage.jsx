import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getIncidentsByCaseId, deleteIncidentById } from '../api/client'
import useAuth from '../hooks/useAuth'

function TimelinePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [incidents, setIncidents] = useState([])
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedIncident, setSelectedIncident] = useState(null)

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

  async function handleDelete() {
    setDeletingId(selectedIncident.id)
    try {
      await deleteIncidentById(selectedIncident.id)
      setIncidents(prev => prev.filter(i => i.id !== selectedIncident.id))
      setShowModal(false)
      setSelectedIncident(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-violet-50">

      {/* Delete Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4" style={{ backdropFilter: 'blur(2px)', backgroundColor: 'rgba(237, 233, 254, 0.5)' }}>
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Incident</h3>
            <p className="text-sm text-gray-500 mb-6">Are you sure you want to delete this incident? This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-violet-200 text-violet-700 hover:bg-violet-50 py-3 rounded-xl text-sm font-semibold transition-colors">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deletingId} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl text-sm font-semibold transition-colors">
                {deletingId ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <div className="bg-white border-b border-violet-100 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🛡️</span>
          <span className="text-lg font-bold text-violet-800">CyberShield</span>
        </div>
        <button onClick={() => navigate(`/cases/${id}`)} className="bg-gradient-to-r from-purple-700 to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-purple-800 hover:to-blue-800 transition-colors">
          ← Back to Case
        </button>
      </div>

      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-900 to-blue-800 px-6 py-6">
        <p className="text-violet-300 text-xs mb-1 uppercase tracking-widest">Case Timeline</p>
        <h2 className="text-white font-bold text-xl">Incident History</h2>
        <p className="text-violet-300 text-xs mt-1">{incidents.length} incident{incidents.length !== 1 ? 's' : ''} recorded</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {incidents.length === 0 ? (
          <div className="bg-white rounded-2xl border border-violet-100 p-10 text-center shadow-sm">
            <div className="text-4xl mb-3">🕒</div>
            <p className="text-gray-500 text-sm">No incidents logged yet.</p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-violet-200"></div>
            {incidents.map(incident => (
              <div key={incident.id} className="relative pl-12 mb-6">
                <div className="absolute left-2.5 top-1.5 w-3 h-3 bg-violet-700 rounded-full border-2 border-violet-200"></div>
                <div className="bg-white rounded-xl border border-violet-100 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-violet-100 text-violet-700 text-xs font-semibold px-3 py-1 rounded-full">{incident.platform}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400">{new Date(incident.occurred_at).toLocaleString()}</span>
                      <button
                        onClick={() => { setSelectedIncident(incident); setShowModal(true) }}
                        className="text-xs text-red-500 hover:text-red-700 font-semibold"
                      >
                        Delete
                      </button>
                    </div>
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