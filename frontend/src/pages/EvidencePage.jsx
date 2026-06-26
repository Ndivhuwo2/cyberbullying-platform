import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { uploadEvidence, getEvidenceByCaseId } from '../api/client'

function EvidencePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [evidence, setEvidence] = useState([])
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchEvidence() {
      const data = await getEvidenceByCaseId(id)
      setEvidence(data.evidence)
    }
    fetchEvidence()
  }, [id])

  async function handleUpload() {
    if (!file) {
      setError('Please select a file to upload.')
      return
    }
    setUploading(true)
    setError('')
    try {
      const uploaded = await uploadEvidence(id, file)
      setEvidence(prev => [...prev, uploaded])
      setFile(null)
    } catch (err) {
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{ maxWidth: '700px', margin: '60px auto', padding: '0 20px' }}>
      <button onClick={() => navigate(`/cases/${id}`)} style={{ marginBottom: '20px' }}>
        ← Back to Case
      </button>
      <h2>Evidence Vault</h2>

      <div style={{ border: '1px solid #444', borderRadius: '8px', padding: '16px', marginBottom: '32px' }}>
        <h3 style={{ marginTop: 0 }}>Upload Evidence</h3>
        <input
          type="file"
          onChange={e => setFile(e.target.files[0])}
          style={{ display: 'block', marginBottom: '12px' }}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button onClick={handleUpload} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload File'}
        </button>
      </div>

      <h3>Uploaded Evidence</h3>
      {evidence.length === 0 ? (
        <p style={{ color: '#aaa' }}>No evidence uploaded yet.</p>
      ) : (
        evidence.map(e => (
          <div
            key={e.id}
            style={{
              border: '1px solid #444',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '12px'
            }}
          >
            <p style={{ margin: '0 0 4px', fontWeight: 'bold' }}>{e.file_name}</p>
            <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#aaa' }}>
              SHA256: {e.sha256_hash}
            </p>
            <a href={e.file_url} target="_blank" rel="noreferrer" style={{ fontSize: '13px' }}>
              View File
            </a>
          </div>
        ))
      )}
    </div>
  )
}

export default EvidencePage