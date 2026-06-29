import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getCaseById, downloadReport, updateCaseStatus, deleteCaseById, updateCaseTitle } from '../api/client'
import useAuth from '../hooks/useAuth'

function CaseDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [caseData, setCaseData] = useState(null)
  const [error, setError] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [togglingStatus, setTogglingStatus] = useState(false)
  const [editingTitle, setEditingTitle] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [savingTitle, setSavingTitle] = useState(false)

  useEffect(() => {
    async function fetchCase() {
      try {
        const data = await getCaseById(id)
        setCaseData(data)
        setNewTitle(data.title)
      } catch (err) {
        setError(err.message)
      }
    }
    fetchCase()
  }, [id])

  async function handleDownloadReport() {
    try {
      await downloadReport(id)
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleToggleStatus() {
    setTogglingStatus(true)
    try {
      const newStatus = caseData.status === 'open' ? 'resolved' : 'open'
      const updated = await updateCaseStatus(id, newStatus)
      setCaseData(prev => ({ ...prev, status: updated.status }))
    } catch (err) {
      setError(err.message)
    } finally {
      setTogglingStatus(false)
    }
  }

  async function handleDeleteCase() {
    setDeleting(true)
    try {
      await deleteCaseById(id)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
      setDeleting(false)
      setShowDeleteModal(false)
    }
  }

  async function handleSaveTitle() {
    if (!newTitle.trim()) return
    setSavingTitle(true)
    try {
      const updated = await updateCaseTitle(id, newTitle)
      setCaseData(prev => ({ ...prev, title: updated.title }))
      setEditingTitle(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setSavingTitle(false)
    }
  }

  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>
  if (!caseData) return <p className="text-center mt-20 text-gray-400">Loading...</p>

  return (
    <div className="min-h-screen bg-violet-50">

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4" style={{ backdropFilter: 'blur(2px)', backgroundColor: 'rgba(237, 233, 254, 0.5)' }}>
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Case</h3>
            <p className="text-sm text-gray-500 mb-6">This will permanently delete this case and all its incidents and evidence. This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 border border-violet-200 text-violet-700 hover:bg-violet-50 py-3 rounded-xl text-sm font-semibold transition-colors">
                Cancel
              </button>
              <button onClick={handleDeleteCase} disabled={deleting} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl text-sm font-semibold transition-colors">
                {deleting ? 'Deleting...' : 'Yes, Delete'}
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
        <button onClick={() => navigate('/dashboard')} className="bg-gradient-to-r from-purple-700 to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-purple-800 hover:to-blue-800 transition-colors">
          ← Back to Dashboard
        </button>
      </div>

      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-900 to-blue-800 px-6 py-6">
        <p className="text-violet-300 text-xs mb-1 uppercase tracking-widest">Case</p>

        {/* Editable title */}
        {editingTitle ? (
          <div className="flex items-center gap-2 mb-2">
            <input
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              className="flex-1 bg-white border border-violet-200 text-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none"
              autoFocus
            />
            <button onClick={handleSaveTitle} disabled={savingTitle} className="bg-white text-violet-800 px-3 py-2 rounded-lg text-xs font-bold hover:bg-violet-50 transition-colors">
              {savingTitle ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => { setEditingTitle(false); setNewTitle(caseData.title) }} className="bg-white bg-opacity-20 text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-opacity-30 transition-colors">
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-white font-bold text-xl">{caseData.title}</h2>
            <button onClick={() => setEditingTitle(true)} className="text-violet-300 hover:text-white text-xs font-semibold transition-colors">
              ✏️ Edit
            </button>
          </div>
        )}

        <div className="flex items-center gap-4">
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${caseData.status === 'open' ? 'bg-white text-violet-800' : 'bg-green-100 text-green-700'}`}>
            {caseData.status.toUpperCase()}
          </span>
          <span className="text-violet-300 text-xs">{caseData.incident_count} incidents · {caseData.evidence_count} evidence files</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div onClick={() => navigate(`/cases/${id}/log`)} className="bg-white border border-violet-100 rounded-xl p-5 cursor-pointer hover:border-violet-300 hover:shadow-md transition-all text-center">
            <div className="text-3xl mb-2">📝</div>
            <p className="text-sm font-semibold text-gray-800">Log Incident</p>
            <p className="text-xs text-gray-400 mt-1">Record a new incident</p>
          </div>
          <div onClick={() => navigate(`/cases/${id}/timeline`)} className="bg-white border border-violet-100 rounded-xl p-5 cursor-pointer hover:border-violet-300 hover:shadow-md transition-all text-center">
            <div className="text-3xl mb-2">🕒</div>
            <p className="text-sm font-semibold text-gray-800">View Timeline</p>
            <p className="text-xs text-gray-400 mt-1">See all incidents in order</p>
          </div>
          <div onClick={() => navigate(`/cases/${id}/evidence`)} className="bg-white border border-violet-100 rounded-xl p-5 cursor-pointer hover:border-violet-300 hover:shadow-md transition-all text-center">
            <div className="text-3xl mb-2">🗂️</div>
            <p className="text-sm font-semibold text-gray-800">Evidence Vault</p>
            <p className="text-xs text-gray-400 mt-1">Upload and view evidence</p>
          </div>
          <div onClick={handleDownloadReport} className="bg-gradient-to-r from-purple-700 to-blue-700 hover:from-purple-800 hover:to-blue-800 rounded-xl p-5 cursor-pointer transition-all text-center shadow-sm">
            <div className="text-3xl mb-2">📄</div>
            <p className="text-sm font-semibold text-white">Download Report</p>
            <p className="text-xs text-violet-200 mt-1">Export as PDF</p>
          </div>
        </div>

        {/* Status toggle and delete */}
        <div className="flex gap-4">
          <button onClick={handleToggleStatus} disabled={togglingStatus} className="flex-1 border border-violet-200 text-violet-700 hover:bg-violet-50 py-3 rounded-xl text-sm font-semibold transition-colors">
            {togglingStatus ? 'Updating...' : caseData.status === 'open' ? 'Mark as Resolved' : 'Reopen Case'}
          </button>
          <button onClick={() => setShowDeleteModal(true)} className="flex-1 border border-red-200 text-red-600 hover:bg-red-50 py-3 rounded-xl text-sm font-semibold transition-colors">
            Delete Case
          </button>
        </div>

        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      </div>
    </div>
  )
}

export default CaseDetailPage