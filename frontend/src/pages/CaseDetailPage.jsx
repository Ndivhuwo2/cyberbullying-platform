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

  if (error) return <p style={{ textAlign: 'center', marginTop: '100px', color: 'red' }}>{error}</p>
  if (!caseData) return <p style={{ textAlign: 'center', marginTop: '100px' }}>Loading...</p>

  return (
    <div style={{ maxWidth: '700px', margin: '60px auto', padding: '0 20px' }}>
      <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '20px' }}>Back to Dashboard</button>
      <h2>{caseData.title}</h2>
      <p style={{ color: '#aaa' }}>Status: {caseData.status} - {caseData.incident_count} incidents - {caseData.evidence_count} evidence files</p>
      <div style={{ display: 'flex', gap: '12px', marginTop: '32px', flexWrap: 'wrap' }}>
        <button onClick={() => navigate(`/cases/${id}/log`)}>+ Log Incident</button>
        <button onClick={() => navigate(`/cases/${id}/timeline`)}>View Timeline</button>
        <button onClick={() => navigate(`/cases/${id}/evidence`)}>Evidence Vault</button>
        <button onClick={handleDownloadReport}>Download Report (PDF)</button>
      </div>
    </div>
  )
}

export default CaseDetailPage