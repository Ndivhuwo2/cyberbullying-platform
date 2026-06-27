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
      setError('Failed to log incident. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '500px', margin: '60px auto', padding: '0 20px' }}>
      <button onClick={() => navigate(`/cases/${id}`)} style={{ marginBottom: '20px' }}>Back to Case</button>
      <h2>Log Incident</h2>
      <label style={{ display: 'block', marginBottom: '6px' }}>Platform</label>
      <select value={platform} onChange={e => setPlatform(e.target.value)} style={{ display: 'block', width: '100%', marginBottom: '16px', padding: '8px' }}>
        <option value="">Select a platform</option>
        {platforms.map(p => <option key={p} value={p}>{p}</option>)}
      </select>
      <label style={{ display: 'block', marginBottom: '6px' }}>When did it happen?</label>
      <input type="datetime-local" value={occurredAt} onChange={e => setOccurredAt(e.target.value)} style={{ display: 'block', width: '100%', marginBottom: '16px', padding: '8px' }} />
      <label style={{ display: 'block', marginBottom: '6px' }}>Description</label>
      <textarea placeholder="Describe what happened..." value={description} onChange={e => setDescription(e.target.value)} rows={5} style={{ display: 'block', width: '100%', marginBottom: '16px', padding: '8px' }} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleSubmit} disabled={loading}>{loading ? 'Saving...' : 'Log Incident'}</button>
    </div>
  )
}

export default LogIncidentPage