import { apiClient } from './apiClient';

export const riskApi = {
  // ... existing ...
  getReinsuranceTreaties: async () => {
    const response = await apiClient.get('/risk/reinsurance/treaties');
    return response.data;
  },
  simulateTreatyPlacement: async (payload: { coverage_limit: number; retention: number }) => {
    const response = await apiClient.post('/risk/reinsurance/simulate-placement', payload);
    return response.data;
  },
  getReinsuranceRecoveries: async () => {
    const response = await apiClient.get('/risk/reinsurance/claims-recovery');
    return response.data;
  },
  getStressScenarios: () =>
    apiClient.get('/risk/stress-tests/scenarios').then(r => r.data),

  runStressTest: (data: { portfolio_value: number; scenarios?: string[]; confidence_level?: number }) =>
    apiClient.post('/risk/stress-tests/run', data).then(r => r.data),

  getCapitalAllocation: () =>
    apiClient.get('/risk/capital/allocation').then(r => r.data),

  getSolvency: () =>
    apiClient.get('/risk/capital/solvency').then(r => r.data),

  getRiskAppetite: () =>
    apiClient.get<any[]>('/risk/appetite/framework').then(r => r.data),

  updateRiskLimit: (limitId: string, newLimit: number) =>
    apiClient.put(`/risk/appetite/limits`, { limit_id: limitId, new_board_limit: newLimit }).then(r => r.data),

  parametricVaR: (data: unknown) =>
    apiClient.post('/risk/metrics/var/parametric', data).then(r => r.data),

  historicalVaR: (data: unknown) =>
    apiClient.post('/risk/metrics/var/historical', data).then(r => r.data),

  monteCarloGBM: (data: unknown) =>
    apiClient.post('/risk/simulations/gbm', data).then(r => r.data),

  // Risk Limits (Hybrid)
  getRiskLimitProposals: () =>
    apiClient.get<any[]>('/risk/risk-limits/proposals').then(r => r.data),

  calibrateRiskLimit: (proposalId: string, calibration: number, specialist: string = 'CRO') =>
    apiClient.post(`/risk/risk-limits/proposals/${proposalId}/calibrate?specialist=${specialist}&calibration=${calibration}`).then(r => r.data),

  // Strategic Risk Nodes (New)
  getRiskAppetiteMetrics: () =>
    apiClient.get('/risk/appetite/metrics').then(r => r.data),

  runMonteCarlo: (data: any) =>
    apiClient.post('/risk/simulations/monte-carlo', data).then(r => r.data),

  getExpectedShortfall: (data: any) =>
    apiClient.post('/risk/metrics/expected-shortfall', data).then(r => r.data),

  getHistoricalScenarios: () =>
    apiClient.get<any[]>('/risk/stress-tests/historical-scenarios').then(r => r.data),

  getEconomicCapital: (data: any) =>
    apiClient.post('/risk/capital/economic', data).then(r => r.data),

  // ALM Strategic Node (New)
  getAssetProjection: (data: any) =>
    apiClient.post('/risk/alm/asset-projection', data).then(r => r.data),

  getLiabilityMatching: (data: any) =>
    apiClient.post('/risk/alm/liability-matching', data).then(r => r.data),

  getInterestRateSensitivity: (data: any) =>
    apiClient.post('/risk/alm/interest-rate-sensitivity', data).then(r => r.data),
};
