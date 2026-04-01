import { apiClient } from './apiClient';

export interface Account {
  id: number;
  name: string;
  code: string;
  account_type: string;
  opening_balance: number;
  balance: number;
}

export interface TrialBalanceRow {
  account_code: string;
  account_name: string;
  debit: number;
  credit: number;
}

export interface Supplier {
  id: number;
  name: string;
  code: string;
  balance: number;
  status: string;
  payment_terms_days: number;
}

export interface Customer {
  id: number;
  name: string;
  code: string;
  balance: number;
  status: string;
  credit_limit: number;
}

export const financialApi = {
  // ... existing ...
  getTreasuryLiquidity: async () => {
    const response = await apiClient.get('/accounting/treasury/liquidity');
    return response.data;
  },
  performCashSweep: async (payload: { source_accounts: string[]; target_account: string }) => {
    const response = await apiClient.post('/accounting/treasury/sweep', payload);
    return response.data;
  },
  getFXExposure: async () => {
    const response = await apiClient.get('/accounting/treasury/fx-exposure');
    return response.data;
  },
  getAccounts: () =>
    apiClient.get<Account[]>('/accounting/accounts').then(r => r.data),

  createAccount: (data: { name: string; code: string; account_type: string; opening_balance?: number }) =>
    apiClient.post<Account>('/accounting/accounts', data),

  uploadAccounts: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/accounting/accounts/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(r => r.data);
  },

  getTrialBalance: () =>
    apiClient.get<TrialBalanceRow[]>('/accounting/reports/trial-balance').then(r => r.data),

  getBalanceSheet: () =>
    apiClient.get('/accounting/reports/balance-sheet').then(r => r.data),

  getIncomeStatement: () =>
    apiClient.get('/accounting/reports/income-statement').then(r => r.data),

  getTransactions: () =>
    apiClient.get('/accounting/transactions').then(r => r.data),

  postTransaction: (data: { description: string; lines: { account_id: number; debit: number; credit: number }[] }) =>
    apiClient.post('/accounting/transactions', data),

  // Accounts Payable (AP)
  getSuppliers: () =>
    apiClient.get<Supplier[]>('/accounting/ap/suppliers').then(r => r.data),
  
  createSupplier: (data: Partial<Supplier>) =>
    apiClient.post<Supplier>('/accounting/ap/suppliers', data),

  postPurchaseInvoice: (data: { entity_id: number; amount: number; description: string; offset_account_id: number }) =>
    apiClient.post('/accounting/ap/invoices', data),

  postSupplierPayment: (data: { entity_id: number; amount: number; bank_account_id: number }) =>
    apiClient.post('/accounting/ap/payments', data),

  // Accounts Receivable (AR)
  getCustomers: () =>
    apiClient.get<Customer[]>('/accounting/ar/customers').then(r => r.data),

  createCustomer: (data: Partial<Customer>) =>
    apiClient.post<Customer>('/accounting/ar/customers', data),

  postSalesInvoice: (data: { entity_id: number; amount: number; description: string; offset_account_id: number }) =>
    apiClient.post('/accounting/ar/invoices', data),

  postCustomerReceipt: (data: { entity_id: number; amount: number; bank_account_id: number }) =>
    apiClient.post('/accounting/ar/receipts', data),

  // Cash & Bank
  getBankAccounts: () =>
    apiClient.get<BankAccount[]>('/accounting/bank/accounts').then(r => r.data),

  postBankTransaction: (data: { account_id: number; amount: number; description: string; type: 'deposit' | 'withdrawal' }) =>
    apiClient.post('/accounting/bank/transactions', data),

  reconcileTransaction: (data: { statement_line_id: string; gl_transaction_id: number }) =>
    apiClient.post('/accounting/bank/reconcile', data),

  // Inventory & SCM
  getProducts: () =>
    apiClient.get<Product[]>('/accounting/inventory/products').then(r => r.data),
  
  createProduct: (data: Partial<Product>) =>
    apiClient.post<Product>('/accounting/inventory/products', data).then(r => r.data),

  getWarehouses: () =>
    apiClient.get<Warehouse[]>('/accounting/inventory/warehouses').then(r => r.data),

  getInventoryValuation: () =>
    apiClient.get<{ total_valuation: number }>('/accounting/inventory/valuation').then(r => r.data.total_valuation),

  // Procurement
  getPurchaseOrders: () =>
    apiClient.get<PurchaseOrder[]>('/accounting/procurement/pos').then(r => r.data),

  createPurchaseOrder: (data: { supplier_id: number; order_number: string; items: any[] }) =>
    apiClient.post<PurchaseOrder>('/accounting/procurement/pos', data).then(r => r.data),

  approvePO: (poId: number) =>
    apiClient.post(`/accounting/procurement/pos/${poId}/approve`),

  receiveGoods: (poId: number, data: { warehouse_id: number; items: any[] }) =>
    apiClient.post(`/accounting/procurement/pos/${poId}/receive`, data),

  completePO: (poId: number, data: any) =>
    apiClient.post(`/accounting/procurement/pos/${poId}/complete`, data).then(r => r.data),

  // Manufacturing
  getBoms: () =>
    apiClient.get<any[]>('/accounting/manufacturing/boms').then(r => r.data),

  createBom: (data: { product_id: number; components: any[] }) =>
    apiClient.post<any>('/accounting/manufacturing/boms', data).then(r => r.data),

  createWorkOrder: (data: { product_id: number; quantity: number; warehouse_id: number }) =>
    apiClient.post<any>('/accounting/manufacturing/work-orders', data).then(r => r.data),

  completeWorkOrder: (woId: number) =>
    apiClient.post(`/accounting/manufacturing/work-orders/${woId}/complete`).then(r => r.data),

  // Fixed Assets
  getAssets: () =>
    apiClient.get<any[]>('/accounting/fixed-assets/').then(r => r.data),

  createAsset: (data: any) =>
    apiClient.post<any>('/accounting/fixed-assets/', data).then(r => r.data),

  getAssetValuation: () =>
    apiClient.get<any>('/accounting/fixed-assets/valuation').then(r => r.data),

  getAssetSchedule: (assetId: number) =>
    apiClient.get<any[]>(`/accounting/fixed-assets/${assetId}/schedule`).then(r => r.data),

  // Payroll & HR
  getEmployees: () =>
    apiClient.get<any[]>('/accounting/payroll/employees').then(r => r.data),

  getPayrollHistory: () =>
    apiClient.get<any[]>('/accounting/payroll/history').then(r => r.data),

  processPayroll: (employeeId: number) =>
    apiClient.post<any>(`/accounting/payroll/process/${employeeId}`).then(r => r.data),

  // Projects & BI
  getProjectDashboard: () =>
    apiClient.get<any[]>('/accounting/projects/dashboard').then(r => r.data),

  createProject: (data: any) =>
    apiClient.post<any>('/accounting/projects/', data).then(r => r.data),

  // Tax & Compliance
  getTaxReturns: () =>
    apiClient.get<any[]>('/accounting/tax/returns').then(r => r.data),

  getVatSummary: () =>
    apiClient.get<any[]>('/accounting/tax/vat-summary').then(r => r.data),

  generateVat: (period: string) =>
    apiClient.post<any>(`/accounting/tax/generate-vat?period=${period}`).then(r => r.data),

  fileReturn: (returnId: number) =>
    apiClient.post<any>(`/accounting/tax/file/${returnId}`).then(r => r.data),

  // SCM & Operational Intelligence
  getStockLevels: () =>
    apiClient.get<any[]>('/accounting/scm/stock-levels').then(r => r.data),

  getProcurementMetrics: () =>
    apiClient.get<any>('/accounting/scm/procurement-metrics').then(r => r.data),

  getManufacturingMetrics: () =>
    apiClient.get<any>('/accounting/scm/manufacturing-metrics').then(r => r.data),

  getConsolidatedPL: () =>
    apiClient.get<any>('/accounting/consolidation/pl').then(r => r.data),

  // Period Close
  getPeriods: () =>
    apiClient.get<any[]>('/accounting/period-close/periods').then(r => r.data),

  getPeriodStatus: (period: string) =>
    apiClient.get<any>(`/accounting/period-close/periods/${period}/status`).then(r => r.data),

  closePeriod: (period: string, closeType: string = 'MONTH', closedBy: string = 'system') =>
    apiClient.post('/accounting/period-close/close', { period, close_type: closeType, closed_by: closedBy }).then(r => r.data),

  reopenPeriod: (period: string, reopenedBy: string = 'system') =>
    apiClient.post('/accounting/period-close/reopen', { period, reopened_by: reopenedBy }).then(r => r.data),

  getAuditLog: (entityType?: string, entityId?: number) => {
    const params = new URLSearchParams();
    if (entityType) params.append('entity_type', entityType);
    if (entityId) params.append('entity_id', entityId.toString());
    return apiClient.get(`/accounting/period-close/audit-trail?${params.toString()}`).then(r => r.data);
  },

  // Cost Accounting (Advanced)
  createCostCenter: (data: { code: string; name: string; department: string; manager: string }) =>
    apiClient.post('/accounting/cost-accounting/centers', data).then(r => r.data),

  getCostCenterSummary: (ccId: number) =>
    apiClient.get(`/accounting/cost-accounting/centers/${ccId}/summary`).then(r => r.data),

  allocateCost: (data: { cost_center_id: number; account_id: number; amount: number; allocation_type: string; period: string; description: string }) =>
    apiClient.post('/accounting/cost-accounting/allocations', data).then(r => r.data),

  listAllocations: (costCenterId?: number, period?: string) => {
    const params = new URLSearchParams();
    if (costCenterId) params.append('cost_center_id', costCenterId.toString());
    if (period) params.append('period', period);
    return apiClient.get(`/accounting/cost-accounting/allocations?${params.toString()}`).then(r => r.data);
  },

  getOverheadRate: (period: string) =>
    apiClient.get(`/accounting/cost-accounting/overhead-rate?period=${period}`).then(r => r.data),

  getProfitability: (period: string) =>
    apiClient.get(`/accounting/cost-accounting/profitability?period=${period}`).then(r => r.data),

  // Autonomous Decision Engine
  getAutonomousDecisions: () =>
    apiClient.get<any[]>('/accounting/autonomous/decisions').then(r => r.data),

  // AI-Proposed Journal Entries
  getJournalProposals: () =>
    apiClient.get<any[]>('/accounting/journals/proposals').then(r => r.data),

  postJournalProposal: (id: string) =>
    apiClient.post(`/accounting/journals/proposals/${id}/post`).then(r => r.data),

  rejectJournalProposal: (id: string) =>
    apiClient.post(`/accounting/journals/proposals/${id}/reject`).then(r => r.data),

  // Consolidation (Group)
  runElimination: (payload: any) =>
    apiClient.post('/accounting/consolidation/elimination', payload).then(r => r.data),

  // Advanced Quantitative Engineering (Excel Engine Service)
  calcNPV: (rate: number, cashflows: number[]) =>
    apiClient.post('/excel-engine/financial/npv', { rate, cashflows }).then(r => r.data),
  
  calcIRR: (cashflows: number[]) =>
    apiClient.post('/excel-engine/financial/irr', { cashflows }).then(r => r.data),
  
  calcXIRR: (cashflows: number[], dates: string[]) =>
    apiClient.post('/excel-engine/financial/xirr', { cashflows, dates }).then(r => r.data),
  
  calcAmortizationSchedule: (principal: number, annualRate: number, years: number, ppy: number = 12) =>
    apiClient.post('/excel-engine/financial/amortization-schedule', { principal, annual_rate: annualRate, years, payments_per_year: ppy }).then(r => r.data),

  calcDepreciation: (type: 'sln' | 'ddb', cost: number, salvage: number, life: number, period?: number, factor: number = 2.0) =>
    apiClient.post(`/excel-engine/financial/depreciation/${type}`, { cost, salvage, life, period, factor }).then(r => r.data),

  // Optimization & Solver Nodes
  runGoalSeek: (expression: string, target: number, variable: string, initial_guess: number = 1.0) =>
    apiClient.post('/excel-engine/optimization/goal-seek', { expression, target, variable, initial_guess }).then(r => r.data),
  
  runLinearSolver: (objective: number[], constraintsLhs: number[][], constraintsRhs: number[], bounds?: number[][], maximize: boolean = false) =>
    apiClient.post('/excel-engine/optimization/solver/linear', { objective, constraints_lhs: constraintsLhs, constraints_rhs: constraintsRhs, bounds, maximize }).then(r => r.data),

  runPortfolioOptimization: (expectedReturns: number[], covMatrix: number[][], targetReturn?: number, riskFreeRate: number = 0.02) =>
    apiClient.post('/excel-engine/optimization/portfolio', { expected_returns: expectedReturns, cov_matrix: covMatrix, target_return: targetReturn, risk_free_rate: riskFreeRate }).then(r => r.data),

  // Real-world Financial Exports (Binary/Blob)
  exportReport: (reportType: string, format: string = 'csv') =>
    apiClient.get(`/accounting/reports/export/${reportType}?format=${format}`, {
      responseType: 'blob'
    }).then(r => {
      const url = window.URL.createObjectURL(new Blob([r.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${reportType}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }),

  // ── External Software Integration ──

  getIntegrationDatasets: () =>
    apiClient.get('/accounting/integrations/datasets').then(r => r.data),

  exportDataset: (dataset: string, format: string = 'csv') =>
    apiClient.get(`/accounting/integrations/export/${dataset}?format=${format}`, {
      responseType: 'blob'
    }).then(r => {
      const url = window.URL.createObjectURL(new Blob([r.data]));
      const link = document.createElement('a');
      link.href = url;
      const ext = format === 'xlsx' ? 'xlsx' : format === 'json' ? 'json' : 'csv';
      link.setAttribute('download', `${dataset}.${ext}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }),

  importDataset: (dataset: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post(`/accounting/integrations/import/${dataset}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data);
  },

  createShareLink: (dataset: string, format: string = 'csv', expiresHours: number = 24) =>
    apiClient.post('/accounting/integrations/share', {
      dataset, format, expires_hours: expiresHours,
    }).then(r => r.data),

  getActiveShareLinks: () =>
    apiClient.get('/accounting/integrations/share/active').then(r => r.data),

  revokeShareLink: (token: string) =>
    apiClient.delete(`/accounting/integrations/share/${token}`).then(r => r.data),

  getSharedData: (token: string) =>
    apiClient.get(`/accounting/integrations/shared/${token}`, { responseType: 'blob' }).then(r => r.data),

  // ── Payment Processing ──

  getPaymentGatewayConfig: () =>
    apiClient.get('/accounting/payments/gateway/config').then(r => r.data),

  initiatePayment: (payload: {
    policy_id: string;
    amount: number;
    currency?: string;
    payment_method?: string;
    card_token: string;
    customer_email: string;
    description?: string;
  }) => apiClient.post('/accounting/payments/initiate', payload).then(r => r.data),

  getPaymentStatus: (transactionId: string) =>
    apiClient.get(`/accounting/payments/status/${transactionId}`).then(r => r.data),

  getPaymentHistory: (policyId?: string, status?: string) => {
    const params = new URLSearchParams();
    if (policyId) params.append('policy_id', policyId);
    if (status) params.append('status', status);
    return apiClient.get(`/accounting/payments/history?${params.toString()}`).then(r => r.data);
  },

  getPaymentAudit: (transactionId: string) =>
    apiClient.get(`/accounting/payments/audit/${transactionId}`).then(r => r.data),

  getPolicyPaymentStatus: (policyId: string) =>
    apiClient.get(`/accounting/payments/policy/${policyId}`).then(r => r.data),

  // ── Insurance & Assurance ──

  getInsuranceDashboard: () =>
    apiClient.get('/accounting/insurance/dashboard').then(r => r.data),

  getProductTypes: () =>
    apiClient.get('/accounting/insurance/product-types').then(r => r.data),

  enrollPolicy: (payload: {
    customer_id: number;
    product_type: string;
    plan_name: string;
    sum_assured: number;
    annual_premium: number;
    premium_frequency?: string;
    currency?: string;
    start_date: string;
    term_years?: number;
    grace_period_days?: number;
    waiting_period_days?: number;
    agent_code?: string;
    branch_code?: string;
    beneficiaries?: Array<{
      full_name: string;
      relationship_type: string;
      id_number?: string;
      phone?: string;
      allocation_percent: number;
      is_primary?: string;
    }>;
  }) => apiClient.post('/accounting/insurance/policies/enroll', payload).then(r => r.data),

  listPolicies: (params?: { status?: string; product_type?: string; customer_id?: number; page?: number }) => {
    const qs = new URLSearchParams();
    if (params?.status) qs.append('status', params.status);
    if (params?.product_type) qs.append('product_type', params.product_type);
    if (params?.customer_id) qs.append('customer_id', String(params.customer_id));
    if (params?.page) qs.append('page', String(params.page));
    return apiClient.get(`/accounting/insurance/policies?${qs.toString()}`).then(r => r.data);
  },

  getPolicy: (policyId: number) =>
    apiClient.get(`/accounting/insurance/policies/${policyId}`).then(r => r.data),

  underwritePolicy: (policyId: number, payload: { decision: string; notes?: string }) =>
    apiClient.post(`/accounting/insurance/policies/${policyId}/underwriting`, payload).then(r => r.data),

  updatePolicyStatus: (policyId: number, payload: { action: string; reason?: string }) =>
    apiClient.post(`/accounting/insurance/policies/${policyId}/status`, payload).then(r => r.data),

  renewPolicy: (policyId: number, newTermYears?: number, premiumAdjustPct?: number) => {
    const qs = new URLSearchParams();
    if (newTermYears) qs.append('new_term_years', String(newTermYears));
    if (premiumAdjustPct !== undefined) qs.append('premium_adjustment_pct', String(premiumAdjustPct));
    return apiClient.post(`/accounting/insurance/policies/${policyId}/renew?${qs.toString()}`).then(r => r.data);
  },

  listPremiums: (policyId: number, status?: string) => {
    const qs = status ? `?status=${status}` : '';
    return apiClient.get(`/accounting/insurance/policies/${policyId}/premiums${qs}`).then(r => r.data);
  },

  payPremium: (premiumId: number, payload: { paid_amount: number; payment_method: string; payment_reference?: string }) =>
    apiClient.post(`/accounting/insurance/premiums/${premiumId}/pay`, payload).then(r => r.data),

  getOverduePremiums: () =>
    apiClient.get('/accounting/insurance/premiums/overdue').then(r => r.data),

  listBeneficiaries: (policyId: number) =>
    apiClient.get(`/accounting/insurance/policies/${policyId}/beneficiaries`).then(r => r.data),

  addBeneficiary: (policyId: number, payload: { full_name: string; relationship_type: string; id_number?: string; phone?: string; allocation_percent: number; is_primary?: string }) =>
    apiClient.post(`/accounting/insurance/policies/${policyId}/beneficiaries`, payload).then(r => r.data),

  updateBeneficiary: (beneficiaryId: number, payload: Record<string, any>) =>
    apiClient.put(`/accounting/insurance/beneficiaries/${beneficiaryId}`, payload).then(r => r.data),

  removeBeneficiary: (beneficiaryId: number) =>
    apiClient.delete(`/accounting/insurance/beneficiaries/${beneficiaryId}`).then(r => r.data),

  submitClaim: (policyId: number, payload: { claim_type: string; claim_date: string; amount_claimed: number; documents_received?: string }) =>
    apiClient.post(`/accounting/insurance/policies/${policyId}/claims`, payload).then(r => r.data),

  listClaims: (params?: { status?: string; claim_type?: string; page?: number }) => {
    const qs = new URLSearchParams();
    if (params?.status) qs.append('status', params.status);
    if (params?.claim_type) qs.append('claim_type', params.claim_type);
    if (params?.page) qs.append('page', String(params.page));
    return apiClient.get(`/accounting/insurance/claims?${qs.toString()}`).then(r => r.data);
  },

  getClaim: (claimId: number) =>
    apiClient.get(`/accounting/insurance/claims/${claimId}`).then(r => r.data),

  assessClaim: (claimId: number, payload: { decision: string; amount_approved?: number; assessor_notes?: string; decline_reason?: string }) =>
    apiClient.post(`/accounting/insurance/claims/${claimId}/assess`, payload).then(r => r.data),

  settleClaim: (claimId: number) =>
    apiClient.post(`/accounting/insurance/claims/${claimId}/settle`).then(r => r.data),
};

export interface BankAccount {
  id: number;
  account_name: string;
  bank_name: string;
  account_number: string;
  currency: string;
  balance: number;
  status: string;
}

export interface Product {
  id: number;
  name: string;
  code: string;
  sku: string;
  category: string;
  unit: string;
  current_cost: number;
  sales_price: number;
  status: string;
}

export interface Warehouse {
  id: number;
  name: string;
  code: string;
  location: string;
  status: string;
}

export interface PurchaseOrder {
  id: number;
  supplier_id: number;
  order_number: string;
  status: string;
  total_amount: number;
  created_at: string;
  expected_date?: string;
}
