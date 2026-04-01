import { apiClient } from './apiClient';

export const actuarialApi = {
  // ... existing ...
  getAssetProjection: async (payload: { assets: any[]; periods: number; reinvestment_rate: number }) => {
    const response = await apiClient.post('/actuarial/alm/asset-projection', payload);
    return response.data;
  },
  getLiabilityMatching: async (payload: { liability_cashflows: any[]; available_bonds: any[]; discount_rate: number }) => {
    const response = await apiClient.post('/actuarial/alm/liability-matching', payload);
    return response.data;
  },
  getRateSensitivity: async (payload: { liability_cashflows: any[]; base_rate: number; shock_bps?: number }) => {
    const response = await apiClient.post('/actuarial/alm/interest-rate-sensitivity', payload);
    return response.data;
  },
    runProjection: (payload: any) => 
        apiClient.post('/actuarial/projections/run', payload).then(r => r.data),
    
    getMortalityCurves: () =>
        apiClient.get('/actuarial/mortality/curves').then(r => r.data),

    // Autonomous Claims
    getAutonomousClaimsDecisions: () =>
        apiClient.get('/actuarial/claims/decisions').then(r => r.data),

    triggerAutonomousAdjudication: (claimId: string, policyId: string, amount: number, claimType: string) =>
        apiClient.post('/actuarial/claims/adjudicate', null, {
            params: { claim_id: claimId, policy_id: policyId, amount, claim_type: claimType }
        }).then(r => r.data),

    // Liability Valuations (Hybrid)
    getLiabilityValuations: () =>
        apiClient.get<any[]>('/actuarial/valuations/list').then(r => r.data),

    peerReviewValuation: (valuationId: string, reviewer: string = 'Chief Actuary') =>
        apiClient.post(`/actuarial/valuations/${valuationId}/review?reviewer=${reviewer}`).then(r => r.data),

    // Advanced Actuarial Nodes (New)
    calculatePremium: (payload: { age: number; smoker: boolean; base_rate: number }) =>
        apiClient.post('/actuarial/pricing/premium', payload).then(r => r.data),

    generateMortalityCurve: (payload: { alpha: number; beta: number; c: number; max_age: number }) =>
        apiClient.post('/actuarial/mortality/makeham-gompertz', payload).then(r => r.data),

    runSurvivalAnalysis: (payload: { ages: number[]; events: number[] }) =>
        apiClient.post('/actuarial/survival/kaplan-meier', payload).then(r => r.data),

    getALMMetrics: () =>
        apiClient.get('/actuarial/alm/metrics').then(r => r.data),

    // Regulatory Reporting (IFRS 17 / Solvency II)
    ifrs17GMM: (payload: any) =>
        apiClient.post('/actuarial/regulatory/ifrs17/gmm', payload).then(r => r.data),
    
    ifrs17PAA: (payload: any) =>
        apiClient.post('/actuarial/regulatory/ifrs17/paa', payload).then(r => r.data),
    
    ifrs17Transition: (payload: any) =>
        apiClient.post('/actuarial/regulatory/ifrs17/transition', payload).then(r => r.data),
    
    getSolvencyIIDisclosure: (payload: any) =>
        apiClient.post('/actuarial/regulatory/solvency-ii/disclosure', payload).then(r => r.data),
    
    getRegulatoryAuditTrail: (actions: string[]) =>
        apiClient.post('/actuarial/regulatory/audit-trail', { actions }).then(r => r.data),

    // Scenario Modeling & ESG
    runDeterministicScenarios: (base: any, scenarios: any[]) =>
        apiClient.post('/actuarial/scenarios/deterministic', { base_assumptions: base, scenarios }).then(r => r.data),
    
    runStochasticSimulation: (payload: any) =>
        apiClient.post('/actuarial/scenarios/stochastic', payload).then(r => r.data),
    
    generateEconomicScenarios: (payload: any) =>
        apiClient.post('/actuarial/scenarios/economic-scenarios', payload).then(r => r.data),

    // Pricing & Rating Proposals (Operationality)
    getRateProposals: () =>
        apiClient.get<any[]>('/actuarial/pricing/proposals').then(r => r.data),
    
    createRateProposal: (data: any) =>
        apiClient.post('/actuarial/pricing/proposals', data).then(r => r.data),
    
    updateRateProposalStatus: (id: string, status: string) =>
        apiClient.put(`/actuarial/pricing/proposals/${id}/status?status=${status}`).then(r => r.data),
};

export const dataScienceApi = {
    executeScript: (code: string, language: string = 'python') => 
        apiClient.post('/ds/execution/execute', { code, language }).then(r => r.data)
};

export const actuarialAiApi = {
    askCopilot: (message: string) =>
        apiClient.post('/ai/chat/', { 
            message, 
            agent: 'actuary',
            session_id: 'actuarial-workspace-1'
        }).then(r => r.data)
};
