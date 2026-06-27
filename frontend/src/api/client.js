const BASE_URL = 'http://localhost:5000/api';

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
  return await res.json();
}

export async function loginUser(email, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email, password })
  });
  return await res.json();
}

export async function loginAnonymous() {
  const res = await fetch(`${BASE_URL}/auth/anonymous`, {
    method: 'POST',
    headers: getHeaders()
  });
  return await res.json();
}

// CASES
export async function getCases() {
  const res = await fetch(`${BASE_URL}/cases`, {
    headers: getHeaders()
  });
  return await res.json();
}

export async function createCase(title) {
  const res = await fetch(`${BASE_URL}/cases`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ title })
  });
  return await res.json();
}

export async function getCaseById(caseId) {
  const res = await fetch(`${BASE_URL}/cases/${caseId}`, {
    headers: getHeaders()
  });
  return await res.json();
}

// INCIDENTS
export async function createIncident(caseId, platform, description, occurredAt) {
  const res = await fetch(`${BASE_URL}/incidents`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ case_id: caseId, platform, description, occurred_at: occurredAt })
  });
  return await res.json();
}

export async function getIncidentsByCaseId(caseId) {
  const res = await fetch(`${BASE_URL}/cases/${caseId}/incidents`, {
    headers: getHeaders()
  });
  return await res.json();
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
  return await res.json();
}

export async function getEvidenceByCaseId(caseId) {
  const res = await fetch(`${BASE_URL}/cases/${caseId}/evidence`, {
    headers: getHeaders()
  });
  return await res.json();
}

// REPORT
export async function downloadReport(caseId) {
  const res = await fetch(`${BASE_URL}/cases/${caseId}/report`, {
    headers: getHeaders()
  });
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `case-${caseId}-report.pdf`;
  a.click();
  window.URL.revokeObjectURL(url);
}