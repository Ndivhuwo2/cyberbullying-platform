import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createCase } from '../api/client'
import useAuth from '../hooks/useAuth'

function NewCasePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleCreate() {
    if (!title.trim()) {
      setError('Please enter a case title.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const data = await createCase(title)
      navigate(`/cases/${data.id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-pink-50">
      {/* Navbar */}
      <div className="bg-white border-b border-pink-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🛡️</span>
          <span className="text-lg font-bold text-pink-700">CyberShield</span>
        </div>
        <button onClick={() => navigate('/dashboard')} className="bg-pink-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-pink-800 transition-colors">
          ← Back to Dashboard
        </button>
      </div>

      <div className="max-w-xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl border border-pink-100 p-10">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">📋</div>
            <h2 className="text-2xl font-bold text-pink-700">Create New Case</h2>
            <p className="text-gray-400 text-sm mt-1">Give your case a clear title so you can identify it later.</p>
          </div>
          <input
            type="text"
            placeholder="e.g. Instagram harassment — June 2026"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-400 mb-4"
            style={{ WebkitBoxShadow: '0 0 0px 1000px white inset' }}
          />
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="flex gap-3">
            <button onClick={handleCreate} disabled={loading} className="flex-1 bg-pink-700 hover:bg-pink-800 text-white py-3 rounded-xl text-sm font-semibold transition-colors">
              {loading ? 'Creating...' : 'Create Case'}
            </button>
            <button onClick={() => navigate('/dashboard')} className="flex-1 border border-pink-200 text-pink-700 hover:bg-pink-50 py-3 rounded-xl text-sm font-semibold transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewCasePage