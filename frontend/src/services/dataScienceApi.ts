import { apiClient } from './apiClient';

export const dataScienceApi = {
  getFlaggedClaims: () =>
    apiClient.get('/ds/fraud/flagged'),

  scoreClaim: (data: { claim_id: string; claim_amount: number; claimant_name: string; claim_type: string; days_since_inception?: number; prior_claims_90d?: number }) =>
    apiClient.post('/ds/fraud/score', data),

  scanForAnomalies: () =>
    apiClient.post('/ds/fraud/scan').then(r => r.data),

  getPipelines: () =>
    apiClient.get('/ds/pipelines/'),

  runPipeline: (pipelineId: string) =>
    apiClient.post(`/ds/pipelines/${pipelineId}/run`),

  getCustomerSegments: () =>
    apiClient.get('/ds/customers/segments'),

  getClaimsAnalysis: () =>
    apiClient.get('/ds/claims/analysis'),

  getForecast: (data: { 
    metric?: string; 
    horizon_months?: number; 
    confidence_level?: number;
    model_type?: 'linear' | 'arima' | 'lstm';
    phi?: number;
    historical_data?: number[];
  }) =>
    apiClient.post('/ds/predictions/forecast', data),

  getChurnPredictions: () =>
    apiClient.get('/ds/predictions/churn'),

  getDeployedModels: () =>
    apiClient.get('/ds/deployment/registry'),

  getDashboards: () =>
    apiClient.get('/ds/dashboards/'),

  getRiskSegments: () =>
    apiClient.get('/ds/risk/segments'),

  scoreCustomerRisk: (data: { customer_id: string; age: number; policy_type: string; claim_history?: number; credit_score?: number }) =>
    apiClient.post('/ds/risk/score', data),

  getGovernanceControls: () =>
    apiClient.get('/ds/governance/controls'),

  getPricingHistory: () =>
    apiClient.get('/ds/pricing/history'),

  detectAnomalies: (data: { series: number[]; sensitivity?: number }) =>
    apiClient.post('/ds/anomaly/detect', data).then(r => r.data),

  runBayesianInference: (data: { prior_alpha: number; prior_beta: number; observations: number[] }) =>
    apiClient.post('/ds/bayesian/inference', data).then(r => r.data),

  trainModel: (data: { model_type: string; target_variable: string; feature_columns: string[] }) =>
    apiClient.post('/ds/models/train', data).then(r => r.data),

  getDSLog: (limit: number = 100) =>
    apiClient.get(`/ds/governance/audit-log?limit=${limit}`).then(r => r.data),

  getStatistics: (data: { series: number[] }) =>
    apiClient.post('/ds/statistics/describe', data).then(r => r.data),

  // Forensic Fraud Lifecycle
  createFlaggedClaim: (data: any) =>
    apiClient.post('/ds/fraud/flagged', data).then(r => r.data),

  updateReviewStatus: (claimId: string, status: string) =>
    apiClient.put(`/ds/fraud/${claimId}/review?new_status=${status}`).then(r => r.data),
};
