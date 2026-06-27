import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getCaseById, downloadReport } from '../api/client'

function CaseDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [caseData, setCaseData] = useState(null)

  useEffect(() => {
    async function fetchCase() {
      const data = await getCaseById(id)
      setCaseData(data)
    }
    fetchCase()
  }, [id])

  async function handleDownloadReport() {
    await downloadReport(id)
    alert('Report download triggered — will work once backend is connected.')
  }

  if (!caseData) return <p style={{ textAlign: 'center', marginTop: '100px' }}>Loading...</p>

  return (
    <div style={{ maxWidth: '700px', margin: '60px auto', padding: '0 20px' }}>
      <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '20px' }}>
        ← Back to Dashboard
      </button>

      <h2>{caseData.title}</h2>
      <p style={{ color: '#aaa' }}>
        Status: {caseData.status} · {caseData.incident_count} incidents · {caseData.evidence_count} evidence files
      </p>

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