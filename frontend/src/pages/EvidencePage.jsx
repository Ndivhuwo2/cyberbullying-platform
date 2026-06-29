import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { uploadEvidence, getEvidenceByCaseId, deleteEvidenceById } from '../api/client'
import useAuth from '../hooks/useAuth'

function EvidencePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [evidence, setEvidence] = useState([])
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedEvidence, setSelectedEvidence] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

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

  async function handleDelete() {
    setDeletingId(selectedEvidence.id)
    try {
      await deleteEvidenceById(selectedEvidence.id)
      setEvidence(prev => prev.filter(e => e.id !== selectedEvidence.id))
      setShowModal(false)
      setSelectedEvidence(null)
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
            <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Evidence</h3>
            <p className="text-sm text-gray-500 mb-2">Are you sure you want to delete <span className="font-semibold">{selectedEvidence?.file_name}</span>?</p>
            <p className="text-xs text-gray-400 mb-6">This cannot be undone.</p>
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
        <p className="text-violet-300 text-xs mb-1 uppercase tracking-widest">Case Evidence</p>
        <h2 className="text-white font-bold text-xl">Evidence Vault</h2>
        <p className="text-violet-300 text-xs mt-1">{evidence.length} file{evidence.length !== 1 ? 's' : ''} uploaded</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Upload section */}
        <div className="bg-white rounded-2xl border border-violet-100 p-6 mb-6 shadow-sm">
          <h3 className="text-sm font-bold text-gray-800 mb-4">Upload Evidence</h3>
          <div className="border-2 border-dashed border-violet-200 rounded-xl p-6 text-center mb-4">
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
              className="inline-block bg-violet-50 border border-violet-300 text-violet-700 text-sm font-semibold px-6 py-2 rounded-xl cursor-pointer hover:bg-violet-100 transition-colors"
            >
              Choose File
            </label>
          </div>
          {file && <p className="text-xs text-violet-600 mb-3 font-medium">Selected: {file.name}</p>}
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <button onClick={handleUpload} disabled={uploading} className="w-full bg-gradient-to-r from-purple-700 to-blue-700 hover:from-purple-800 hover:to-blue-800 text-white py-3 rounded-xl text-sm font-semibold transition-colors shadow-sm">
            {uploading ? 'Uploading...' : 'Upload File'}
          </button>
        </div>

        {/* Evidence list */}
        <h3 className="text-sm font-bold text-gray-800 mb-4">Uploaded Evidence</h3>
        {evidence.length === 0 ? (
          <div className="bg-white rounded-2xl border border-violet-100 p-10 text-center shadow-sm">
            <div className="text-4xl mb-3">🗂️</div>
            <p className="text-gray-500 text-sm">No evidence uploaded yet.</p>
          </div>
        ) : (
          evidence.map(e => (
            <div key={e.id} className="bg-white rounded-xl border border-violet-100 p-5 mb-3 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-gray-800">{e.file_name}</p>
                <div className="flex items-center gap-3">
                  <a href={`http://localhost:5000${e.file_url}`} target="_blank" rel="noreferrer" className="text-xs text-violet-700 font-semibold hover:underline">
                    View File
                  </a>
                  <button
                    onClick={() => { setSelectedEvidence(e); setShowModal(true) }}
                    className="text-xs text-red-500 hover:text-red-700 font-semibold"
                  >
                    Delete
                  </button>
                </div>
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