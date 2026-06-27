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
      setError('Failed to create case. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '500px', margin: '100px auto', padding: '0 20px' }}>
      <h2>Create New Case</h2>
      <p style={{ color: '#aaa' }}>Give your case a clear title so you can identify it later.</p>
      <input
        type="text"
        placeholder="e.g. Instagram harassment"
        value={title}
        onChange={e => setTitle(e.target.value)}
        style={{ display: 'block', width: '100%', marginBottom: '12px', padding: '8px' }}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button onClick={handleCreate} disabled={loading}>
          {loading ? 'Creating...' : 'Create Case'}
        </button>
        <button onClick={() => navigate('/dashboard')}>Cancel</button>
      </div>
    </div>
  )
}

export default NewCasePage