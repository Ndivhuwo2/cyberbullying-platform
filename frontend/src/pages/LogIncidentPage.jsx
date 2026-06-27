import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createIncident } from '../api/client'
import useAuth from '../hooks/useAuth'

function LogIncidentPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [platform, setPlatform] = useState('')
  const [description, setDescription] = useState('')
  const [occurredAt, setOccurredAt] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const platforms = ['Instagram', 'WhatsApp', 'TikTok', 'Facebook', 'Twitter/X', 'Snapchat', 'YouTube', 'Other']

  async function handleSubmit() {
    if (!platform || !description || !occurredAt) {
      setError('Please fill in all fields.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await createIncident(id, platform, description, new Date(occurredAt).toISOString())
      navigate(`/cases/${id}`)
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
        <button onClick={() => navigate(`/cases/${id}`)} className="bg-pink-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-pink-800 transition-colors">
          ← Back to Case
        </button>
      </div>

      <div className="max-w-xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl border border-pink-100 p-10">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">📝</div>
            <h2 className="text-2xl font-bold text-pink-700">Log Incident</h2>
            <p className="text-gray-400 text-sm mt-1">Record the details of what happened.</p>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-600 mb-1 block">Platform</label>
              <select
                value={platform}
                onChange={e => setPlatform(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-400"
              >
                <option value="">Select a platform</option>
                {platforms.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600 mb-1 block">When did it happen?</label>
              <input
                type="datetime-local"
                value={occurredAt}
                onChange={e => setOccurredAt(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-400"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600 mb-1 block">Description</label>
              <textarea
                placeholder="Describe what happened in as much detail as possible..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={5}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-400 resize-none"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button onClick={handleSubmit} disabled={loading} className="w-full bg-pink-700 hover:bg-pink-800 text-white py-3 rounded-xl text-sm font-semibold transition-colors">
              {loading ? 'Saving...' : 'Log Incident'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LogIncidentPage