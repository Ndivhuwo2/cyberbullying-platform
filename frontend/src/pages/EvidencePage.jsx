import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { uploadEvidence, getEvidenceByCaseId } from '../api/client'
import useAuth from '../hooks/useAuth'

function EvidencePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [evidence, setEvidence] = useState([])
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchEvidence() {
      try {
        const data = await getEvidenceByCaseId(id)
        setEvidence(data.evidence)
      } catch (err) {
        setError(err.message)
      }
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
      setError(err.message)
    } finally {
      setUploading(false)
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

      {/* Banner */}
      <div className="bg-pink-700 px-6 py-5">
        <p className="text-pink-200 text-xs mb-1">Case Evidence</p>
        <h2 className="text-white font-bold text-xl">Evidence Vault</h2>
        <p className="text-pink-200 text-xs mt-1">{evidence.length} file{evidence.length !== 1 ? 's' : ''} uploaded</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Upload section */}
        <div className="bg-white rounded-2xl border border-pink-100 p-6 mb-6">
          <h3 className="text-sm font-bold text-gray-800 mb-4">Upload Evidence</h3>
          <div className="border-2 border-dashed border-pink-200 rounded-xl p-6 text-center mb-4">
            <div className="text-3xl mb-2">📎</div>
            <p className="text-sm text-gray-500 mb-3">Select a screenshot, document or file</p>
            <input
  type="file"
  id="fileInput"
  onChange={e => setFile(e.target.files[0])}
  className="hidden"
/>
<label
  htmlFor="fileInput"
  className="inline-block bg-pink-50 border border-pink-300 text-pink-700 text-sm font-semibold px-6 py-2 rounded-xl cursor-pointer hover:bg-pink-100 transition-colors"
>
  Choose File
</label>
          </div>
          {file && <p className="text-xs text-pink-600 mb-3 font-medium">Selected: {file.name}</p>}
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <button onClick={handleUpload} disabled={uploading} className="w-full bg-pink-700 hover:bg-pink-800 text-white py-3 rounded-xl text-sm font-semibold transition-colors">
            {uploading ? 'Uploading...' : 'Upload File'}
          </button>
        </div>

        {/* Evidence list */}
        <h3 className="text-sm font-bold text-gray-800 mb-4">Uploaded Evidence</h3>
        {evidence.length === 0 ? (
          <div className="bg-white rounded-2xl border border-pink-100 p-10 text-center">
            <div className="text-4xl mb-3">🗂️</div>
            <p className="text-gray-500 text-sm">No evidence uploaded yet.</p>
          </div>
        ) : (
          evidence.map(e => (
            <div key={e.id} className="bg-white rounded-xl border border-pink-100 p-5 mb-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-gray-800">{e.file_name}</p>
                <a href={e.file_url} target="_blank" rel="noreferrer" className="text-xs text-pink-700 font-semibold hover:underline">
                  View File
                </a>
              </div>
              <p className="text-xs text-gray-400">SHA256: {e.sha256_hash}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default EvidencePage