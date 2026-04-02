import React from 'react';
import { Route } from 'react-router-dom';
import { MortalityPage } from './MortalityPage';
import { SurvivalPage } from './SurvivalPage';
import { PricingPage } from './PricingPage';
import { ClaimsPage } from './ClaimsPage';
import { DataExplorerPage } from './DataExplorerPage';
import { ALMPage } from './ALMPage';
import { ActuarialWorkspacePage } from './ActuarialWorkspacePage';
import { AssumptionsPage } from './AssumptionsPage';
import { SimulationsPage } from './SimulationsPage';
import { DashboardsPage } from './DashboardsPage';
import { RegulatoryPage } from './RegulatoryPage';
import { ExperienceInvestigationPage } from './InvestigationPage';
import { StressTestingPage } from './StressTestingPage';
import { SolvencyIIPage } from './SolvencyIIPage';
import { IFRS17DetailsPage } from './IFRS17DetailsPage';

export const ActuarialRoutes = () => (
  <>
    <Route path="workspace" element={<ActuarialWorkspacePage />} />
    <Route path="assumptions" element={<AssumptionsPage />} />
    <Route path="regulatory" element={<RegulatoryPage />} />
    <Route path="regulatory/solvency-ii" element={<SolvencyIIPage />} />
    <Route path="regulatory/ifrs17-details" element={<IFRS17DetailsPage />} />
    <Route path="mortality" element={<MortalityPage />} />
    <Route path="survival" element={<SurvivalPage />} />
    <Route path="simulations" element={<SimulationsPage />} />
    <Route path="alm" element={<ALMPage />} />
    <Route path="pricing" element={<PricingPage />} />
    <Route path="claims" element={<ClaimsPage />} />
    <Route path="explorer" element={<DataExplorerPage />} />
    <Route path="dashboards" element={<DashboardsPage />} />
    <Route path="investigation" element={<ExperienceInvestigationPage />} />
    <Route path="stress-testing" element={<StressTestingPage />} />
    <Route index element={<ActuarialWorkspacePage />} />
  </>
);


