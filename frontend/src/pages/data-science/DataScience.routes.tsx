import React from 'react';
import { Route } from 'react-router-dom';
import { DSDataPage } from './DSDataPage';
import { DSGovernancePage } from './DSGovernancePage';
import { DSDashboardsPage } from './DSDashboardsPage';
import { DSDeploymentPage } from './DSDeploymentPage';
import { DSRiskPage } from './DSRiskPage';
import { DSPricingPage } from './DSPricingPage';
import { DSFraudPage } from './DSFraudPage';
import { DSPredictionsPage } from './DSPredictionsPage';
import { DSCustomersPage } from './DSCustomersPage';
import { DSClaimsPage } from './DSClaimsPage';

import { DatasetsPage } from './DatasetsPage';
import { ExperimentsPage } from './ExperimentsPage';
import { ModelsPage } from './ModelsPage';
import { DataScienceLabPage } from './DataScienceLabPage';

export const DataScienceRoutes = () => (
  <>
    <Route path="lab" element={<DataScienceLabPage />} />
    <Route path="data" element={<DSDataPage />} />
    <Route path="datasets" element={<DatasetsPage />} />

    <Route path="experiments" element={<ExperimentsPage />} />
    <Route path="models" element={<ModelsPage />} />
    <Route path="governance" element={<DSGovernancePage />} />
    <Route path="dashboards" element={<DSDashboardsPage />} />
    <Route path="deployment" element={<DSDeploymentPage />} />
    <Route path="risk" element={<DSRiskPage />} />
    <Route path="pricing" element={<DSPricingPage />} />
    <Route path="fraud" element={<DSFraudPage />} />
    <Route path="predictions" element={<DSPredictionsPage />} />
    <Route path="customers" element={<DSCustomersPage />} />
    <Route path="claims" element={<DSClaimsPage />} />
    <Route index element={<DataScienceLabPage />} />
  </>
);

