import { apiClient } from './apiClient';

export interface ChatRequest {
  message: string;
  agent?: string;
  session_id?: string;
}

export interface ChatResponse {
  agent: string;
  reply: string;
  session_id: string;
}

export const aiApi = {
  chat: (data: ChatRequest) =>
    apiClient.post<ChatResponse>('/ai/chat/', data),

  // AI Governance & Knowledge Management
  listDocuments: () =>
    apiClient.get('/ai/knowledge/documents').then(r => r.data),

  createDocument: (data: any) =>
    apiClient.post('/ai/knowledge/documents', data).then(r => r.data),

  getDocument: (docId: string) =>
    apiClient.get(`/ai/knowledge/documents/${docId}`).then(r => r.data),

  deleteDocument: (docId: string) =>
    apiClient.delete(`/ai/knowledge/documents/${docId}`).then(r => r.data),

  searchKnowledge: (query: string, category?: string, topK: number = 5) =>
    apiClient.post('/ai/knowledge/search', { query, category, top_k: topK }).then(r => r.data),

  getKnowledgeStats: () =>
    apiClient.get('/ai/knowledge/stats').then(r => r.data),

  // Model & Agent Configuration
  listAgents: () =>
    apiClient.get('/ai/config/agents').then(r => r.data),

  createAgent: (data: any) =>
    apiClient.post('/ai/config/agents', data).then(r => r.data),

  updateAgentTemperature: (agentId: string, temperature: number) =>
    apiClient.put(`/ai/config/agents/${agentId}/temperature?temperature=${temperature}`).then(r => r.data),

  deleteAgent: (agentId: string) =>
    apiClient.delete(`/ai/config/agents/${agentId}`).then(r => r.data),

  listExperiments: () =>
    apiClient.get('/ai/config/experiments').then(r => r.data),

  getGlobalAISettings: () =>
    apiClient.get('/ai/config/settings').then(r => r.data),

  // Real-world File Upload (Multipart)
  uploadDocumentFile: (file: File, category: string = 'general') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    return apiClient.post('/ai/knowledge/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(r => r.data);
  }
};
