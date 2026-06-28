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

  const totalIncidents = cases.reduce((sum, c) => sum + c.incident_count, 0)
  const totalEvidence = cases.reduce((sum, c) => sum + c.evidence_count, 0)

  return (
    <div className="min-h-screen bg-pink-50">
      {/* Navbar */}
      <div className="bg-white border-b border-pink-100 px-6 py-4 flex items-center">
        <span className="text-2xl mr-2">🛡️</span>
        <span className="text-lg font-bold text-pink-700">CyberShield</span>
      </div>

      {/* Banner */}
      <div className="bg-pink-700 px-6 py-5 flex items-center justify-between">
        <div>
          <p className="text-pink-200 text-xs mb-1">Welcome back</p>
          <p className="text-white font-bold text-lg">{user?.username || 'Anonymous User'}</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-white font-bold text-xl">{cases.length}</p>
            <p className="text-pink-200 text-xs">Cases</p>
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-xl">{totalIncidents}</p>
            <p className="text-pink-200 text-xs">Incidents</p>
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-xl">{totalEvidence}</p>
            <p className="text-pink-200 text-xs">Files</p>
          </div>
          <div className="w-px h-8 bg-white opacity-30"></div>
          <button onClick={handleLogout} className="bg-white text-pink-700 px-4 py-2 rounded-lg text-xs font-semibold hover:bg-pink-50 transition-colors">
  Logout
</button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-800">My Cases</h2>
          <button onClick={() => navigate('/cases/new')} className="bg-pink-700 hover:bg-pink-800 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors">
            + New Case
          </button>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {loading ? (
          <p className="text-gray-400 text-sm">Loading your cases...</p>
        ) : cases.length === 0 ? (
          <div className="bg-white rounded-2xl border border-pink-100 p-10 text-center">
            <div className="text-4xl mb-3">📋</div>
            <p className="text-gray-500 text-sm">No cases yet. Create your first case to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {cases.map(c => (
              <div
                key={c.id}
                onClick={() => navigate(`/cases/${c.id}`)}
                className="bg-white border border-pink-100 rounded-xl p-4 cursor-pointer hover:border-pink-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-800 flex-1 mr-2">{c.title}</h3>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${c.status === 'open' ? 'bg-pink-100 text-pink-700' : 'bg-green-100 text-green-700'}`}>
                    {c.status}
                  </span>
                </div>
                <p className="text-xs text-gray-400">{c.incident_count} incidents · {c.evidence_count} files</p>
              </div>
            ))}
            <div
              onClick={() => navigate('/cases/new')}
              className="bg-pink-50 border border-dashed border-pink-300 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-pink-100 transition-colors"
            >
              <p className="text-2xl text-pink-500">+</p>
              <p className="text-xs font-semibold text-pink-500 mt-1">New Case</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardPage