import { apiClient } from './apiClient';

export interface Framework {
  id: string;
  name: string;
  deadline: string;
  status: 'Adopted' | 'In Progress' | 'Planning' | 'Critical';
  progress: number;
  description?: string;
}

export const complianceApi = {
  // ... existing ...
  getSolvencyIIReport: async () => {
    const response = await apiClient.get('/compliance/reporting/solvency-ii');
    return response.data;
  },
  getIFRS17Impact: async () => {
    const response = await apiClient.get('/compliance/reporting/ifrs-17');
    return response.data;
  },
  submitESGDisclosure: async (payload: { carbon_offset: number; diversity_index: number }) => {
    const response = await apiClient.post('/compliance/reporting/esg-disclosure', payload);
    return response.data;
  },
  getFrameworks: () =>
    apiClient.get<Framework[]>('/compliance/frameworks/'),
    
    
  getPolicies: () =>
    apiClient.get('/compliance/policies/'),

  // Hybrid Telemetry
  getHybridTelemetry: () =>
    apiClient.get<any[]>('/compliance/telemetry/logs').then(r => r.data),

  // Governance & Statutory Nodes (New)
  getRegulations: () =>
    apiClient.get('/compliance/regulations/').then(r => r.data),

  getFilings: () =>
    apiClient.get('/compliance/filings/').then(r => r.data),

  triggerSignoff: (data: { entity_id: string; specialization: string; evidence_links: string[] }) =>
    apiClient.post('/compliance/signoff/', data).then(r => r.data),

  // Regulatory Filing Pipeline
  listFilings: () =>
    apiClient.get('/compliance/filings/').then(r => r.data),

  createFiling: (data: any) =>
    apiClient.post('/compliance/filings/', data).then(r => r.data),

  getFiling: (filingId: string) =>
    apiClient.get(`/compliance/filings/${filingId}`).then(r => r.data),

  submitFiling: (filingId: string, submittedBy: string) =>
    apiClient.post(`/compliance/filings/${filingId}/submit`, { submitted_by: submittedBy }).then(r => r.data),

  approveFiling: (filing_id: string, approvedBy: string) =>
    apiClient.put(`/compliance/filings/${filing_id}/approve?approved_by=${approvedBy}`).then(r => r.data),

  rejectFiling: (filingId: string, reason: string = 'Returned for revision') =>
    apiClient.post(`/compliance/filings/${filingId}/reject?reason=${reason}`).then(r => r.data),

  // Regulation & Framework Management
  listRegulations: () =>
    apiClient.get('/compliance/regulations/').then(r => r.data),

  createRegulation: (data: any) =>
    apiClient.post('/compliance/regulations/', data).then(r => r.data),

  getRegulation: (regId: string) =>
    apiClient.get(`/compliance/regulations/${regId}`).then(r => r.data),

  updateRegulation: (regId: string, data: any) =>
    apiClient.put(`/compliance/regulations/${regId}`, data).then(r => r.data),

  // Policy Management
  listPolicies: () =>
    apiClient.get('/compliance/policies/').then(r => r.data),

  createPolicy: (data: any) =>
    apiClient.post('/compliance/policies/', data).then(r => r.data),

  getPolicy: (policyId: string) =>
    apiClient.get(`/compliance/policies/${policyId}`).then(r => r.data),

  updatePolicy: (policyId: string, data: any) =>
    apiClient.put(`/compliance/policies/${policyId}`, data).then(r => r.data),

  deletePolicy: (policyId: string) =>
    apiClient.delete(`/compliance/policies/${policyId}`).then(r => r.data),

  // Automated Compliance Rules
  listRules: () =>
    apiClient.get('/compliance/rules/').then(r => r.data),

  createRule: (data: any) =>
    apiClient.post('/compliance/rules/', data).then(r => r.data),

  updateRule: (ruleId: string, data: any) =>
    apiClient.put(`/compliance/rules/${ruleId}`, data).then(r => r.data),

  deleteRule: (ruleId: string) =>
    apiClient.delete(`/compliance/rules/${ruleId}`).then(r => r.data),

  // Advanced Audit & Health
  getAuditLogs: (limit: number = 100) =>
    apiClient.get(`/compliance/audit/logs?limit=${limit}`).then(r => r.data),

  logAuditEvent: (user_id: string, action: string, details: any) =>
    apiClient.post('/compliance/audit/log', { user_id, action, details }).then(r => r.data),

  getComplianceHealth: () =>
    apiClient.get('/compliance/audit/regulations/health').then(r => r.data),

  // Real-world Compliance Exports (Binary/Blob)
  exportFilings: (format: string = 'csv') =>
    apiClient.get(`/compliance/filings/export?format=${format}`, {
      responseType: 'blob'
    }).then(r => {
      const url = window.URL.createObjectURL(new Blob([r.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `compliance_filings.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }),
};
