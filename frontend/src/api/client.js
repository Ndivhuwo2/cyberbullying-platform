const BASE_URL = 'https://cybershield-backend-us1x.onrender.com/api';

let authToken = localStorage.getItem('token') || null;

export function setToken(token) {
  authToken = token;
}

function getHeaders(isFormData = false) {
  const headers = {};
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
  if (!isFormData) headers['Content-Type'] = 'application/json';
  return headers;
}

// AUTH
export async function registerUser(email, password) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Registration failed');
  return data;
}

export async function loginUser(email, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  return data;
}

export async function loginAnonymous() {
  const res = await fetch(`${BASE_URL}/auth/anonymous`, {
    method: 'POST',
    headers: getHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Anonymous login failed');
  return data;
}

// CASES
export async function getCases() {
  const res = await fetch(`${BASE_URL}/cases`, {
    headers: getHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch cases');
  return data;
}

export async function createCase(title) {
  const res = await fetch(`${BASE_URL}/cases`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ title })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to create case');
  return data;
}

export async function getCaseById(caseId) {
  const res = await fetch(`${BASE_URL}/cases/${caseId}`, {
    headers: getHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch case');
  return data;
}

// INCIDENTS
export async function createIncident(caseId, platform, description, occurredAt) {
  const res = await fetch(`${BASE_URL}/incidents`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ case_id: caseId, platform, description, occurred_at: occurredAt })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to log incident');
  return data;
}

export async function getIncidentsByCaseId(caseId) {
  const res = await fetch(`${BASE_URL}/cases/${caseId}/incidents`, {
    headers: getHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch incidents');
  return data;
}

// EVIDENCE
export async function uploadEvidence(caseId, file) {
  const formData = new FormData();
  formData.append('case_id', caseId);
  formData.append('file', file);
  const res = await fetch(`${BASE_URL}/evidence`, {
    method: 'POST',
    headers: getHeaders(true),
    body: formData
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Upload failed');
  return data;
}

export async function getEvidenceByCaseId(caseId) {
  const res = await fetch(`${BASE_URL}/cases/${caseId}/evidence`, {
    headers: getHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch evidence');
  return data;
}

// REPORT
export async function downloadReport(caseId) {
  const res = await fetch(`${BASE_URL}/cases/${caseId}/report`, {
    headers: getHeaders()
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Failed to download report');
  }
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `case-${caseId}-report.pdf`;
  a.click();
  window.URL.revokeObjectURL(url);
}

export async function forgotPassword(email) {
  const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to send reset email');
  return data;
}

export async function resetPassword(token, password) {
  const res = await fetch(`${BASE_URL}/auth/reset-password`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ token, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to reset password');
  return data;
}

export async function deleteAccount() {
  const res = await fetch(`${BASE_URL}/auth/account`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete account');
  return data;
}

export async function updateCaseStatus(caseId, status) {
  const res = await fetch(`${BASE_URL}/cases/${caseId}/status`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ status })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update status');
  return data;
}

export async function deleteCaseById(caseId) {
  const res = await fetch(`${BASE_URL}/cases/${caseId}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete case');
  return data;
}

export async function deleteIncidentById(incidentId) {
  const res = await fetch(`${BASE_URL}/incidents/${incidentId}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete incident');
  return data;
}

export async function deleteEvidenceById(evidenceId) {
  const res = await fetch(`${BASE_URL}/evidence/${evidenceId}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete evidence');
  return data;
}

export async function updateCaseTitle(caseId, title) {
  const res = await fetch(`${BASE_URL}/cases/${caseId}/title`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ title })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update title');
  return data;
}