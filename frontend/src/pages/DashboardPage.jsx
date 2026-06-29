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
    <div className="min-h-screen bg-violet-50">
    
      <div className="bg-white border-b border-violet-100 px-6 py-4 flex items-center justify-between shadow-sm">
  <div className="flex items-center gap-2">
    <span className="text-2xl">🛡️</span>
    <span className="text-lg font-bold text-violet-800">CyberShield</span>
  </div>
  <button onClick={() => navigate('/settings')} className="text-violet-700 hover:text-violet-900 text-xl transition-colors" title="Settings">
    ⚙️
  </button>
</div>

      
      <div className="bg-gradient-to-r from-purple-900 to-blue-800 px-6 py-6 flex items-center justify-between">
        <div>
          <p className="text-violet-300 text-xs mb-1 uppercase tracking-widest">Welcome back</p>
          <p className="text-white font-bold text-lg">{user?.email || 'Anonymous User'}</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-white font-bold text-xl">{cases.length}</p>
            <p className="text-violet-300 text-xs">Cases</p>
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-xl">{totalIncidents}</p>
            <p className="text-blue-300 text-xs">Incidents</p>
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-xl">{totalEvidence}</p>
            <p className="text-violet-300 text-xs">Files</p>
          </div>
          <div className="w-px h-8 bg-white opacity-20"></div>
          <button onClick={handleLogout} className="bg-white text-purple-800 px-4 py-2 rounded-lg text-xs font-bold hover:bg-violet-50 transition-colors">
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-800">My Cases</h2>
          <button onClick={() => navigate('/cases/new')} className="bg-gradient-to-r from-purple-700 to-blue-700 hover:from-purple-800 hover:to-blue-800 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm">
            + New Case
          </button>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {loading ? (
          <p className="text-gray-400 text-sm">Loading your cases...</p>
        ) : cases.length === 0 ? (
          <div className="bg-white rounded-2xl border border-violet-100 p-10 text-center">
            <div className="text-4xl mb-3">📋</div>
            <p className="text-gray-500 text-sm">No cases yet. Create your first case to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {cases.map(c => (
              <div
                key={c.id}
                onClick={() => navigate(`/cases/${c.id}`)}
                className="bg-white border border-violet-100 rounded-xl p-4 cursor-pointer hover:border-violet-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-800 flex-1 mr-2">{c.title}</h3>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap ${c.status === 'open' ? 'bg-violet-100 text-violet-700' : 'bg-green-100 text-green-700'}`}>
                    {c.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-gray-400">{c.incident_count} incidents · {c.evidence_count} files</p>
              </div>
            ))}
            <div
              onClick={() => navigate('/cases/new')}
              className="bg-violet-50 border border-dashed border-violet-300 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-violet-100 transition-colors"
            >
              <p className="text-2xl text-violet-500">+</p>
              <p className="text-xs font-semibold text-violet-500 mt-1">New Case</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardPage