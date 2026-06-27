//communication between frontend react and backend happens here 
//API calls live here as named functions 

const BASE_URL = 'http://localhost:5000/api';

let authToken = null;

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
  // MOCK
  return { token: 'fake-token-123', user: { id: 'uuid-1', email, is_anonymous: false } };
}

export async function loginUser(email, password) {
  // MOCK
  return { token: 'fake-token-123', user: { id: 'uuid-1', email, is_anonymous: false } };
}

export async function loginAnonymous() {
  // MOCK
  return { token: 'fake-anon-token', user: { id: 'uuid-anon', is_anonymous: true } };
}

// CASES
export async function createCase(title) {
  // MOCK
  return { id: 'case-uuid-1', title, status: 'open', created_at: new Date().toISOString() };
}

export async function getCaseById(caseId) {
  // MOCK
  return { id: caseId, title: 'Instagram harassment — June 2026', status: 'open', incident_count: 4, evidence_count: 7 };
}

// INCIDENTS
export async function createIncident(caseId, platform, description, occurredAt) {
  // MOCK
  return { id: 'incident-uuid-1', case_id: caseId, platform, description, occurred_at: occurredAt, logged_at: new Date().toISOString() };
}

export async function getIncidentsByCaseId(caseId) {
  // MOCK
  return { incidents: [
    { id: 'incident-uuid-1', platform: 'Instagram', description: 'Posted a photo mocking me', occurred_at: '2026-06-20T14:30:00Z', logged_at: '2026-06-25T10:05:00Z' }
  ]};
}

// EVIDENCE
export async function uploadEvidence(caseId, file) {
  // MOCK
  return { id: 'evidence-uuid-1', case_id: caseId, file_name: file.name, file_type: file.type, file_url: 'https://storage.mock/screenshot.png', sha256_hash: 'abc123', uploaded_at: new Date().toISOString() };
}

export async function getEvidenceByCaseId(caseId) {
  // MOCK
  return { evidence: [
    { id: 'evidence-uuid-1', file_name: 'screenshot.png', file_url: 'https://storage.mock/screenshot.png', sha256_hash: 'abc123' }
  ]};
}

// REPORT
export async function downloadReport(caseId) {
  // MOCK — when real, this returns a PDF blob
  console.log('Downloading report for case:', caseId);
}

export async function getCases() {
  // MOCK
  return { cases: [
    { id: 'case-uuid-1', title: 'Instagram harassment — June 2026', status: 'open', incident_count: 4, evidence_count: 7 },
    { id: 'case-uuid-2', title: 'WhatsApp group bullying', status: 'open', incident_count: 2, evidence_count: 3 },
  ]}
}