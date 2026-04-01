import React from 'react';
import { Route } from 'react-router-dom';
import { LedgerPage } from './LedgerPage';
import { TransactionsPage } from './TransactionsPage';
import { ARPage } from './ARPage';
import { APPage } from './APPage';
import { CashBankPage } from './CashBankPage';
import { InventoryPage } from './InventoryPage';
import { ManufacturingPage } from './ManufacturingPage';
import { ProcurementPage } from './ProcurementPage';
import { FixedAssetsPage } from './FixedAssetsPage';
import { PayrollPage } from './PayrollPage';
import { ProjectsDashboard } from './ProjectsDashboard';
import { TaxPage } from './TaxPage';
import { ReportsPage } from './ReportsPage';
import { ConsolidationPage } from './ConsolidationPage';
import { DecisionsPage } from './DecisionsPage';
import { IntegrationHubPage } from './IntegrationHubPage';
import { PaymentProcessingPage } from './PaymentProcessingPage';
import { TreasuryPage } from './TreasuryPage';

export const FinancialsRoutes = () => (
  <>
    <Route path="ledger" element={<LedgerPage />} />
    <Route path="transactions" element={<TransactionsPage />} />
    <Route path="ar" element={<ARPage />} />
    <Route path="ap" element={<APPage />} />
    <Route path="cash" element={<CashBankPage />} />
    <Route path="inventory" element={<InventoryPage />} />
    <Route path="manufacturing" element={<ManufacturingPage />} />
    <Route path="procurement" element={<ProcurementPage />} />
    <Route path="assets" element={<FixedAssetsPage />} />
    <Route path="payroll" element={<PayrollPage />} />
    <Route path="projects" element={<ProjectsDashboard />} />
    <Route path="tax" element={<TaxPage />} />
    <Route path="reports" element={<ReportsPage />} />
    <Route path="consolidation" element={<ConsolidationPage />} />
    <Route path="decisions" element={<DecisionsPage />} />
    <Route path="integrations" element={<IntegrationHubPage />} />
    <Route path="payments" element={<PaymentProcessingPage />} />
    <Route path="treasury" element={<TreasuryPage />} />
    <Route index element={<LedgerPage />} />
  </>
);
