import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getCaseById, downloadReport } from '../api/client'
import useAuth from '../hooks/useAuth'

function CaseDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [caseData, setCaseData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchCase() {
      try {
        const data = await getCaseById(id)
        setCaseData(data)
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

  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>
  if (!caseData) return <p className="text-center mt-20 text-gray-400">Loading...</p>

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

      {/* Banner */}
      <div className="bg-pink-700 px-6 py-5">
        <p className="text-pink-200 text-xs mb-1">Case</p>
        <h2 className="text-white font-bold text-xl">{caseData.title}</h2>
        <div className="flex items-center gap-4 mt-2">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${caseData.status === 'open' ? 'bg-white text-pink-700' : 'bg-green-100 text-green-700'}`}>
            {caseData.status}
          </span>
          <span className="text-pink-200 text-xs">{caseData.incident_count} incidents · {caseData.evidence_count} evidence files</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div onClick={() => navigate(`/cases/${id}/log`)} className="bg-white border border-pink-100 rounded-xl p-5 cursor-pointer hover:border-pink-300 hover:shadow-sm transition-all text-center">
            <div className="text-3xl mb-2">📝</div>
            <p className="text-sm font-semibold text-gray-800">Log Incident</p>
            <p className="text-xs text-gray-400 mt-1">Record a new incident</p>
          </div>
          <div onClick={() => navigate(`/cases/${id}/timeline`)} className="bg-white border border-pink-100 rounded-xl p-5 cursor-pointer hover:border-pink-300 hover:shadow-sm transition-all text-center">
            <div className="text-3xl mb-2">🕒</div>
            <p className="text-sm font-semibold text-gray-800">View Timeline</p>
            <p className="text-xs text-gray-400 mt-1">See all incidents in order</p>
          </div>
          <div onClick={() => navigate(`/cases/${id}/evidence`)} className="bg-white border border-pink-100 rounded-xl p-5 cursor-pointer hover:border-pink-300 hover:shadow-sm transition-all text-center">
            <div className="text-3xl mb-2">🗂️</div>
            <p className="text-sm font-semibold text-gray-800">Evidence Vault</p>
            <p className="text-xs text-gray-400 mt-1">Upload and view evidence</p>
          </div>
          <div onClick={handleDownloadReport} className="bg-pink-700 hover:bg-pink-800 rounded-xl p-5 cursor-pointer transition-all text-center">
            <div className="text-3xl mb-2">📄</div>
            <p className="text-sm font-semibold text-white">Download Report</p>
            <p className="text-xs text-pink-200 mt-1">Export as PDF</p>
          </div>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </div>
  )
}

export default CaseDetailPage